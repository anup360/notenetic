import { Pager } from "@progress/kendo-react-data-tools";
import { Checkbox } from "@progress/kendo-react-inputs";
import moment from "moment";
import { ListView } from "@progress/kendo-react-listview";
import React, { useEffect, useRef, useState } from "react";
import { NotificationManager } from "react-notifications";
import Loader from "../../control-components/loader/loader";
import ApiHelper from "../../helper/api-helper";
import ApiUrls from "../../helper/api-urls";
import {
  displayDateFromUtcDate,
  showError,
  convertToUtcMorning,
  convertToUtcNight,
} from "../../util/utility";
import MessageCompose from "./message-compose";
import MessageDetail from "./message-detail";
import MessageDrawerContainer, { messageDrawerState } from "./message-drawer";
import MessageSearchView from "./message-search";
import MessageLabelView from "./messages-label";
import LabelSelectionDialog from "./messages-label-selection";
import useModelScroll from "../../cutomHooks/model-dialouge-scroll";

function Message() {
  // States
  const [compose, setCompose] = useState(false);
  const [isReplying, setReplying] = useState(false);
  const [isForwarding, setForwarding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modelScroll, setScroll] = useModelScroll();

  // Drawer
  const [drawerState, setDrawerState] = useState(messageDrawerState.inbox);
  const drawerRef = useRef(null);

  // Count
  const [inboxUnReadCount, setInboxUnReadCount] = useState(0);

  // Labels
  const [labels, setLabels] = useState([]);
  const [labelState, setLabelState] = useState(undefined);

  // Messages
  const [messageState, setMessageState] = useState(undefined);
  const [messages, setMessages] = useState([]);
  const [searchMessages, setSearchMessages] = useState([]);
  const [clickedMessage, setClickedMessage] = useState();
  const [totalMessages, setTotalMessages] = useState(0);
  const [checkedMessages, setCheckedMessages] = useState([]);

  // Move to Custom Label
  const [displayLabelSelection, setDisplayLabelSelection] = useState(false);

  // Search Status
  const searchRef = useRef(null);
  const [search, setSearch] = useState("");
  const [advSearchActive, setAdvSearchActive] = React.useState(false);
  const clearAdvSearchObj = {
    subject: "",
    body: "",
    fromUtcDate: null, // "2022-08-08T16:00:17.362Z",
    toUtcDate: null, // "2022-08-08T16:00:17.362Z",
    fromStaffId: null,
  };
  const [advSearchFields, setAdvSearchFields] = useState(clearAdvSearchObj);
  const [displaySearchResult, setDisplaySearchResult] = useState(false);

  // Paging
  const defaultPageSettings = { skip: 0, take: 50 };
  const [page, setPage] = React.useState(defaultPageSettings);
  const { skip, take } = page;

  // Staff
  const [staffList, setStaffList] = useState([]);

  /* ============================= Private functions ============================= */

  async function moveToCustomLabel(label) {
    try {
      const body = {
        messageReceiverId: clickedMessage
          ? [clickedMessage.id]
          : checkedMessages,
        labelId: label.id,
      };
      const result = await ApiHelper.postRequest(
        ApiUrls.MOVE_TO_CUSTOM_LABEL,
        body
      );
      if (result.resultData) {
        NotificationManager.success("Success");
        setCheckedMessages([]);
      }
    } catch (err) {
      showError(err, "Move To Custom Label");
    }
  }

  function isSearchActive(localAdvSearchActive) {
    localAdvSearchActive =
      localAdvSearchActive != undefined
        ? localAdvSearchActive
        : advSearchActive;
    return search.length > 2 || localAdvSearchActive;
  }

  async function getUnreadCount() {
    try {
      const result = await ApiHelper.getRequest(ApiUrls.GET_UNREAD_COUNT);
      setInboxUnReadCount(result.resultData.unreadCount);
    } catch (err) {
      showError(err, "Staff List");
    }
  }

  async function getStaffList() {
    try {
      const result = await ApiHelper.getRequest(
        ApiUrls.GET_STAFF_DDL_BY_CLINIC_ID
      );
      const staffObjList = result.resultData.map((x) => {
        return {
          id: x.id,
          name: x.name,
        };
      });
      setStaffList(staffObjList);
    } catch (err) {
      showError(err, "Staff List");
    }
  }

  function handlePageChange(e) {
    setPage({
      skip: e.skip,
      take: e.take,
    });
    getMessagesList(drawerState, labelState, e.skip, e.take, advSearchActive);
  }

  function nextPage(e) {
    e.preventDefault();
    const newSkip = skip + take;
    setPage({
      skip: newSkip,
      take: take,
    });
    getMessagesList(drawerState, labelState, newSkip, take, advSearchActive);
  }

  function prevPage(e) {
    e.preventDefault();
    if (skip != 0) {
      const newSkip = skip - take;
      setPage({
        skip: newSkip,
        take: take,
      });
      getMessagesList(drawerState, labelState, newSkip, take, advSearchActive);
    }
  }
  function mapMessage(message) {
    return {
      id: message.messageReceiverId,
      fromStaffId: message.fromStaffId,
      fromStaffName: message.fromStaffName,
      toStaffId: message.toStaffId,
      toStaffName: message.toStaffName,
      subject: message.subject,
      body: message.body,
      bodyHtml: message.htmlBody,
      date:  moment.utc(message.utcDateCreated).local().format("M/D/YYYY"),
      // fullDate: displayDateFromUtcDate(
      //   message.utcDateCreated,
      //   "MMM DD, yyyy [at] hh:mm A"
      // ),
      fullDate: moment.utc(message.utcDateCreated).local().format("MMM DD, yyyy [at] hh:mm A"),
      read: drawerState == messageDrawerState.sent ? true : message.viewed,
      userImage: message.staffImageUrl,
      attachments: message.attachments.map((x) => {
        return {
          name: x.fileName,
          url: x.s3FileUrl,
        };
      }),
    };
  }

  function mapMessageList(list) {
    setTotalMessages(list.length > 0 ? list[0].totCount : 0);
    return list.map((x) => {
      return mapMessage(x);
    });
  }

  async function getPersonalLabels() {
    try {
      const result = await ApiHelper.getRequest(ApiUrls.GET_PERSONAL_LABEL);
      const personalLableList = result.resultData.map((x) => x);
      setLabels(personalLableList);
    } catch (err) {
      showError(err, "Personal Labels");
    }
  }

  async function getMessagesList(
    localDrawerState,
    label,
    localSkip,
    localTake,
    localAdvSearchActive
  ) {
    setLoading(true);
    setMessageState({
      localDrawerState,
      label,
      localSkip,
      localTake,
      localAdvSearchActive,
    });
  }

  async function fetchMessagesList() {
    if (messageState == undefined) return;
    let {
      localDrawerState,
      label,
      localSkip,
      localTake,
      localAdvSearchActive,
    } = messageState;
    localDrawerState =
      localDrawerState != undefined ? localDrawerState : drawerState;
    const advSearch = localAdvSearchActive
      ? advSearchFields
      : clearAdvSearchObj;
    let searchFromStaffId = null;
    if (
      advSearch.fromStaffId &&
      advSearch.fromStaffId.length &&
      advSearch.fromStaffId.length > 0
    ) {
      searchFromStaffId = advSearch.fromStaffId[0].id;
    }
    const pageSize = localTake != undefined ? localTake : take;
    const currentPage =
      (localSkip != undefined ? localSkip : skip) / pageSize + 1;
    const body = {
      inbox: false,
      sent: false,
      trash: false,
      flagged: false,
      personalLabelId: null,
      searchContents: localAdvSearchActive ? "" : search,
      searchSubject: advSearch.subject,
      searchBody: advSearch.body,
      searchFromUtcDate: convertToUtcMorning(advSearch.fromUtcDate), // "2022-08-08T16:00:17.362Z",
      searchToUtcDate: convertToUtcNight(advSearch.toUtcDate), // "2022-08-08T16:00:17.362Z",
      searchFromStaffId: searchFromStaffId,
      currentPage: currentPage,
      pageSize: pageSize,
    };
    if (label != undefined) {
      body.personalLabelId = label.id;
    } else {
      switch (+localDrawerState) {
        case messageDrawerState.inbox:
          body.inbox = true;
          break;
        case messageDrawerState.sent:
          body.sent = true;
          break;
        case messageDrawerState.trash:
          body.trash = true;
          break;
        default:
          NotificationManager.showError(
            `GetMessages unknown state ${localDrawerState}`
          );
          return;
      }
    }
    ApiHelper.postRequest(ApiUrls.GET_STAFF_MESSAGES, body)
      .then((result) => {
        const messageObjList = mapMessageList(result.resultData);
        if (isSearchActive(localAdvSearchActive)) {
          setSearchMessages(messageObjList);
        } else {
          setMessages(messageObjList);
        }
        setLoading(false);
      })
      .catch((err) => {
        showError(err, "Messages");
        setLoading(false);
      });
  }

  async function trashOrDelete(messageIds) {
    try {
      const body = { messageReceiverId: messageIds };
      let result;
      if (drawerState == messageDrawerState.trash) {
        result = await ApiHelper.deleteRequest(ApiUrls.DELETE_MESSAGE, body);
      } else {
        result = await ApiHelper.postRequest(ApiUrls.TRASH_MESSAGE, body);
      }
      if (result.resultData) {
        const filter = (x) => !messageIds.find((id) => id == x.id);
        setMessages(messages.filter(filter));
        setSearchMessages(searchMessages.filter(filter));
        setCheckedMessages([]);
      }
    } catch (err) {
      showError(err, "Delete Message");
    }
  }

  /* ============================= onChange, Action events ============================= */

  function toggleComposeVisibility() {
    setCompose((x) => !x);
    setScroll(true);
  }

  function closeComposeView() {
    setReplying(false);
    setForwarding(false);
    setCompose(false);
    setScroll(false);
  }

  function onMessageClick(e, message) {
    if (e.target.value == "on") return;
    e.preventDefault();
    if (!message.read) {
      ApiHelper.postRequest(ApiUrls.MARK_READ, {
        messageReceiverId: [message.id],
      })
        .then((result) =>
          handleMarkReadResult(result, (msg) => {
            if (message.id == msg.id) {
              msg.read = true;
            }
            return msg;
          })
        )
        .catch((err) => {
          showError(err, "Messages");
        });
      if (inboxUnReadCount > 0) {
        setInboxUnReadCount(inboxUnReadCount - 1);
      }
    }
    setClickedMessage(message);
  }

  function handleMarkReadResult(result, mapper) {
    if (result.resultData) {
      setMessages(messages.map(mapper));
      setSearchMessages(searchMessages.map(mapper));
      setCheckedMessages([]);
    }
  }

  async function onMarkRead(e) {
    try {
      e.preventDefault();
      const body = { messageReceiverId: checkedMessages };
      const result = await ApiHelper.postRequest(ApiUrls.MARK_READ, body);
      handleMarkReadResult(result, (msg) => {
        if (checkedMessages.find((id) => id == msg.id) != undefined) {
          msg.read = true;
        }
        return msg;
      });
      getUnreadCount();
    } catch (err) {
      showError(err, "Mark Read Message");
    }
  }

  async function onMarkUnRead(e) {
    try {
      e.preventDefault();
      const body = { messageReceiverId: checkedMessages };
      const result = await ApiHelper.postRequest(ApiUrls.MARK_UN_READ, body);
      if (result.resultData) {
        const mapper = (x) => {
          if (checkedMessages.find((id) => id == x.id) != undefined) {
            x.read = false;
          }
          return x;
        };
        setMessages(messages.map(mapper));
        setSearchMessages(searchMessages.map(mapper));
        setCheckedMessages([]);
      }
      getUnreadCount();
    } catch (err) {
      showError(err, "Mark Un-Read Message");
    }
  }

  function onMoveToCustomLabel(e) {
    e.preventDefault();
    setDisplayLabelSelection(true);
    setScroll(true);
  }

  function onMoveToLabelSelected(label) {
    if (label) moveToCustomLabel(label);
    setDisplayLabelSelection(false);
    setScroll(false);
  }

  async function onMoveToInbox(e) {
    try {
      e.preventDefault();
      const body = { messageReceiverId: checkedMessages };
      const result = await ApiHelper.postRequest(ApiUrls.MOVE_TO_INBOX, body);
      if (result.resultData) {
        const filter = (x) => !checkedMessages.find((id) => id == x.id);
        setMessages(messages.filter(filter));
        setSearchMessages(searchMessages.filter(filter));
        setCheckedMessages([]);
      }
    } catch (err) {
      showError(err, "Mark Un-Read Message");
    }
  }

  function onDetailBackClick() {
    setClickedMessage(undefined);
  }

  function onCheckboxChange(e, message) {
    // Checked now
    if (e.value) {
      setCheckedMessages([...checkedMessages, message.id]);
    }
    // Unchecked now
    else {
      setCheckedMessages(checkedMessages.filter((id) => id != message.id));
    }
  }

  function onTrashOrDelete(e) {
    e.preventDefault();
    trashOrDelete(checkedMessages);
  }

  async function onUnTrash(e) {
    try {
      e.preventDefault();
      const body = { messageReceiverId: checkedMessages };
      const result = await ApiHelper.postRequest(
        ApiUrls.UN_TRASH_MESSAGE,
        body
      );
      if (result.resultData) {
        const filter = (x) => !checkedMessages.find((id) => id == x.id);
        setMessages(messages.filter(filter));
        setSearchMessages(searchMessages.filter(filter));
        setCheckedMessages([]);
      }
    } catch (err) {
      showError(err, "Delete Message");
    }
  }

  function onDrawerStateChange(state) {
    setPage(defaultPageSettings);
    if (searchRef && searchRef.current) searchRef.current.reset();
    setClickedMessage(undefined);
    setCheckedMessages([]);
    setLabelState(undefined);
    setDrawerState(state);
    getMessagesList(state);
  }

  function onLabelSelected(label) {
    setPage(defaultPageSettings);
    if (searchRef && searchRef.current) searchRef.current.reset();
    setClickedMessage(undefined);
    setCheckedMessages([]);
    setLabelState(label);
    setDrawerState(undefined);
    drawerRef.current.unselectAll();
    getMessagesList(undefined, label);
  }

  /* ============================= useEffects ============================= */

  useEffect(() => {
    getMessagesList(messageDrawerState.inbox);
    getPersonalLabels();
    getStaffList();
    getUnreadCount();
  }, []);

  useEffect(() => {
    fetchMessagesList();
  }, [messageState]);

  /* ============================= Render View ============================= */

  function renderAttachments(message) {
    const li = message.attachments.map((file) => {
      return (
        <li className="mb-2 mx-1">
          <a href={file.url} target="_blank" download>
            {file.name}
          </a>
        </li>
      );
    });
    return <ul className="d-flex flex-wrap upload-attachemnt">{li}</ul>;
  }

  function renderMessage(props) {
    let message = props.dataItem;

    const name =
      drawerState == messageDrawerState.sent
        ? message.toStaffName
        : message.fromStaffName;
    return (
      <div>
        <div className="col-md-12">
          <div className="top-column-first">
            <div
              className="lable-details-msg"
              onClick={(e) => onMessageClick(e, message)}
            >
              <Checkbox
                label={""}
                value={!!checkedMessages.find((id) => message.id == id)}
                onChange={(e) => onCheckboxChange(e, message)}
              />
              <div className="d-flex align-items-center px-4">
                <img src={message.userImage} className="user-image" />
                <p className="px-3 mb-0 ruth-text">
                  {message.read ? name : <b>{name}</b>}
                </p>
              </div>
              <div className="text-content-message">
                <p className="mb-0 f-14 px-lg-2">
                  <div className="message-subject">
                    {message.read ? message.subject : <b>{message.subject}</b>}
                  </div>{" "}
                  &nbsp; - &nbsp;{" "}
                  <div className="message-body">{message.body}</div>
                </p>
              </div>
              <div className="month-number text-end">
                <p className="mb-0 f-14 px-lg-2">
                  {message?.date
                    ? message.date
                    : ""}
                </p>
              </div>
            </div>
            <div className="attachemnt">{renderAttachments(message)}</div>
          </div>
        </div>
      </div>
    );
  }

  function renderMultiSelectOptions() {
    return (
      <div className="d-flex align-items-center check_delte_icon">
        {drawerState == messageDrawerState.trash && (
          <a
            href=""
            className="bg-grey-dt mx-2"
            data-toggle="tooltip"
            title="Un-trash"
            onClick={onUnTrash}
          >
            <span className="k-icon k-i-save"></span>
          </a>
        )}
        {labelState && (
          <a
            href=""
            className="bg-grey-dt mx-2"
            data-toggle="tooltip"
            title="Move back to Inbox"
            onClick={onMoveToInbox}
          >
            <span className="k-icon k-i-folder-up"></span>
          </a>
        )}
        {drawerState == messageDrawerState.inbox && (
          <a
            href=""
            data-toggle="tooltip"
            title="Mark as Read"
            className="bg-grey-dt mx-2"
            onClick={onMarkRead}
          >
            <span className="k-icon k-i-folder-open"></span>
          </a>
        )}
        {drawerState == messageDrawerState.inbox && (
          <a
            href=""
            data-toggle="tooltip"
            title="Mark as Unread"
            className="bg-grey-dt mx-2"
            onClick={onMarkUnRead}
          >
            <span className="k-icon k-i-folder"></span>
          </a>
        )}
        {drawerState == messageDrawerState.inbox && (
          <a
            href=""
            data-toggle="tooltip"
            title="Move to Labels"
            className="bg-grey-dt mx-2"
            onClick={onMoveToCustomLabel}
          >
            <span className="k-icon k-i-folder-up" />
          </a>
        )}
        <a
          href=""
          data-toggle="tooltip"
          title="Delete"
          className="bg-grey-dt mx-2"
          onClick={onTrashOrDelete}
        >
          <span className="k-icon k-i-delete" />
        </a>
      </div>
    );
  }

  function renderLeftPanel() {
    return (
      <div className="inner-dt col-md-3 col-lg-2">
        <span
          onClick={toggleComposeVisibility}
          className="btn blue-primary text-white"
        >
          &nbsp; <i className="k-icon k-i-pencil pr-3"></i>Compose
        </span>
        <MessageDrawerContainer
          ref={drawerRef}
          inboxCount={inboxUnReadCount}
          onStateChange={onDrawerStateChange}
          className="message-menu-items"
        />
        <MessageLabelView
          labels={labels}
          setLabels={setLabels}
          labelState={labelState}
          onLabelSelected={onLabelSelected}
        />
      </div>
    );
  }

  function renderSearchView() {
    return (
      <div className="col-lg-6 col-md-6">
        <MessageSearchView
          ref={searchRef}
          search={search}
          setSearch={setSearch}
          clearAdvSearchObj={clearAdvSearchObj}
          advSearchFields={advSearchFields}
          setAdvSearchFields={setAdvSearchFields}
          advSearchActive={advSearchActive}
          setAdvSearchActive={setAdvSearchActive}
          setDisplaySearchResult={setDisplaySearchResult}
          getMessagesList={getMessagesList}
          orgStaffList={staffList}
          drawerState={drawerState}
          labelState={labelState}
          setPage={setPage}
          defaultPageSettings={defaultPageSettings}
        />
      </div>
    );
  }

  function renderPrevNextPage() {
    const lastMessageCountOnScreen = skip + take;
    return (
      <div className="prev-next mt-3 mt-md-0 col-lg-3 text-right col-md-12 d-flex justify-content-end align-items-center">
        <div className="count-show-numer mr-2">
          <p className="mb-0 f-14">
            {skip + 1} -{" "}
            {lastMessageCountOnScreen > totalMessages
              ? totalMessages
              : lastMessageCountOnScreen}{" "}
            of {totalMessages}
          </p>
        </div>
        <ul className="list-unstyled d-flex justify-content-end mb-0">
          {skip != 0 && (
            <li className="d-inline-block mx-1">
              <button
                type="button"
                className="btn blue-primary btn-sm"
                onClick={prevPage}
              >
                <i className="k-icon k-i-arrow-chevron-left"></i>
              </button>
            </li>
          )}
          {lastMessageCountOnScreen < totalMessages && (
            <li className="d-inline-block mx-1" onClick={nextPage}>
              <button type="button" className="btn blue-primary btn-sm">
                <i className="k-icon k-i-arrow-chevron-right"></i>
              </button>
            </li>
          )}
        </ul>
      </div>
    );
  }

  function renderMessageListView() {
    return (
      <span>
        <ListView
          data={displaySearchResult ? searchMessages : messages}
          item={renderMessage}
          style={{ width: "100%" }}
        />
        <Pager
          skip={skip}
          take={take}
          onPageChange={handlePageChange}
          total={totalMessages}
        />
      </span>
    );
  }

  function renderMessageDetail() {
    return (
      <MessageDetail
        clickedMessage={clickedMessage}
        onBack={onDetailBackClick}
        trashOrDelete={trashOrDelete}
        onMoveToCustomLabel={onMoveToCustomLabel}
        setReplying={setReplying}
        setForwarding={setForwarding}
      />
    );
  }

  return (
    <div>
      <div className="d-flex flex-wrap">
        {renderLeftPanel()}
        <div className="col-md-9 col-lg-10 ">
          <div className="message-page">
            <div className="d-flex align-items-center flex-wrap">
              {!clickedMessage && renderSearchView()}
              <div className="col-md-3 ">
                {checkedMessages.length > 0 && renderMultiSelectOptions()}
              </div>
              {!clickedMessage && renderPrevNextPage()}
            </div>
            <div className="column-check-message">
              <div className="head-column-row ">
                {loading && (
                  <div>
                    <Loader size="small" type={"converging-spinner"} />
                  </div>
                )}
                {!clickedMessage &&
                  !loading &&
                  messages.length > 0 &&
                  renderMessageListView()}
                {messages.length == 0 && !loading && (
                  <div className="message-not-found">No Messages</div>
                )}
                {clickedMessage && renderMessageDetail()}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*Modal*/}
      {(compose || isReplying || isForwarding) && (
        <MessageCompose
          orgStaffList={staffList}
          onClose={closeComposeView}
          message={clickedMessage}
          isReplying={isReplying}
          isForwarding={isForwarding}
          isInSent={drawerState == messageDrawerState.sent}
        />
      )}
      {displayLabelSelection && (
        <LabelSelectionDialog
          labelList={labels}
          visible={displayLabelSelection}
          onLabelSelected={onMoveToLabelSelected}
        />
      )}
    </div>
  );
}

export default Message;
