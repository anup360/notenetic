/**
 * App.js Layout Start Here
 */
import { orderBy } from "@progress/kendo-data-query";
import { filter } from "@progress/kendo-data-query/dist/npm/transducers";
import { getter } from "@progress/kendo-react-common";
import {
  getSelectedState,
  Grid,
  GridColumn,
  GridNoRecords,
} from "@progress/kendo-react-grid";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Loading from "../../control-components/loader/loader";
import apiHelper from "../../helper/api-helper";
import API_URLS from "../../helper/api-urls";
import APP_ROUTES from "../../helper/app-routes";
import { showError } from "../../util/utility";
import { displayDateFromUtcDate } from "../../util/utility.js";

// Const Vars
const DATA_ITEM_KEY = "id";
const SELECTED_FIELD = "selected";
const ACTION_ID = {
  submitted: 1,
  edited: 2,
  trashed: 3,
  locked: 4,
  unLocked: 5,
  signed: 6,
  signatureRemoved: 7,
  printed: 8,
  sealed: 9,
  restored: 10,
  rating: 11,
  linked: 13,
  linkedDeleted: 14,
  docApproved: 15,
  docDisApproved: 16,
  postEditReview: 17,
  linkedQuestionnaire: 18,
  questionnaireRemoved: 19,
  documentSignByClient: 20,
  documentSignByParent: 21,
};
const idGetter = getter(DATA_ITEM_KEY);
const filterOperators = {
  text: [
    {
      text: "grid.filterContainsOperator",
      operator: "contains",
    },
  ],
};

const DocumentHistoryList = () => {
  // States
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedState, setSelectedState] = useState({});
  const [historyList, setHistoryList] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  /* ============================= useEffect functions ============================= */

  useEffect(() => {
    getDocumentHistory();
  }, []);

  /* ============================= useCallbacks ============================= */

  const onSelectionChange = React.useCallback(
    (event) => {
      const newSelectedState = getSelectedState({
        event,
        selectedState: selectedState,
        dataItemKey: DATA_ITEM_KEY,
      });
      setSelectedState(newSelectedState);
    },
    [selectedState]
  );

  const onHeaderSelectionChange = React.useCallback((event) => {
    const checkboxElement = event.syntheticEvent.target;
    const checked = checkboxElement.checked;
    const newSelectedState = {};
    event.dataItems.forEach((item) => {
      newSelectedState[idGetter(item)] = checked;
    });
    setSelectedState(newSelectedState);
  }, []);

  /* ============================= private functions ============================= */

  function getDocumentHistory() {
    setLoading(true);
    apiHelper
      .queryGetRequestWithEncryption(
        API_URLS.DOCUMENT_HISTORY,
        location.state?.id
      )
      .then((result) => {
        setHistoryList(result.resultData);
      })
      .catch((err) => {
        showError(err, "History Document");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function getClassName(actionId) {
    console.log(actionId, "actionIdactionIdactionId");

    switch (actionId) {
      case ACTION_ID.submitted:
        return "fa fa-notes-medical fa-lg";
      case ACTION_ID.edited:
        return "fa fa-edit fa-lg";
      case ACTION_ID.trashed:
        return "d-flex fa fa-trash fa-lg";
      case ACTION_ID.locked:
        return "d-inline-flex fa fa-lock fa-lg";
      case ACTION_ID.unLocked:
        return "fa fa-unlock fa-lg";
      case ACTION_ID.signed:
        return "fa fa-signature fa-lg";
      case ACTION_ID.signatureRemoved:
        return "fa fa-signature fa-lg";
      case ACTION_ID.restored:
        return "fa fa-rotate-left pr-2";
      case ACTION_ID.rating:
        return "fa fa-star pr-2";
      case ACTION_ID.linked:
        return "fa fa-link pr-2";
      case ACTION_ID.sealed:
        return "fa-solid fa-stamp pr-2";
      case ACTION_ID.linkedDeleted:
        return "d-flex fa fa-trash fa-lg";
      case ACTION_ID.docApproved:
        return "fa fa-check-square fa-lg";
      case ACTION_ID.docDisApproved:
        return "fa fa-ban fa-lg";
      case ACTION_ID.postEditReview:
        return "fa-solid fa-file-pen fa-lg ";
      case ACTION_ID.linkedQuestionnaire:
        return "fa fa-file-text fa-lg";
      case ACTION_ID.questionnaireRemoved:
        return "d-flex fa fa-trash fa-lg";
      case ACTION_ID.documentSignByClient:
        return "fa fa-signature fa-lg";
      case ACTION_ID.documentSignByParent:
        return "fa fa-signature fa-lg";
    }
    return "";
  }

  /* ============================= event functions ============================= */

  function onActionClick(action) {
    if (action.actionId == ACTION_ID.edited) {
      navigate(APP_ROUTES.VIEW_DOCUMENT_EDIT_HISTORY, {
        state: {
          oldVersion: JSON.parse(action.oldVersion),
          latestVersion: JSON.parse(action.latestVersion),
          documentId: location.state?.id,
          documentName: location.state?.documentName,
          documentTemplateId: action.documentTemplateId,
        },
      });
    }
  }

  function onBack() {
    navigate(-1);
  }

  function onPageChange(event) {
    let skip = event.page.skip;
    let take = event.page.take;

    setPage(skip);
    setPageSize(take);
  }

  function onDataStateChange(event) {
    setPage(event.dataState.skip);
    setPageSize(event.dataState.take);
    setSort(event.dataState.sort);
  }

  console.log(location.state?.documentName, "wertyuioiuytrewertyu");

  return (
    <div className="grid-table filter-grid">
      <button
        type="button"
        value="BACK"
        onClick={onBack}
        className="border-0 bg-transparent arrow-rotate mb-3 history-title"
      >
        <i className="k-icon k-i-sort-asc-sm"></i>
        Document History
      </button>
      <ul className="list-unstyled pl-0 details-info ms-4 mb-3">
        <li className="d-flex mb-2">
          <p className="col-md-1 mb-0  px-0 f-16 fw-600">Client:</p>
          <p className="col-md-8 mb-0  px-0 f-14">
            {location.state?.documentName.clientNameDoc}
          </p>
        </li>
        <li className="d-flex mb-2">
          <p className="col-md-1 mb-0  px-0 f-16 fw-600">Service Date:</p>
          <p className="col-md-8 mb-0  px-0 f-14">
            {moment(location.state?.documentName.serviceDateStr).format(
              "M/D/YYYY"
            )}
          </p>
        </li>
        <li className="d-flex mb-2">
          <p className="col-md-1 mb-0  px-0 f-16 fw-600">Doc Status:</p>
          <p className="col-md-8 mb-0  px-0 f-14">
            {location.state?.documentName?.docStatus}
          </p>
        </li>
      </ul>
      <Grid
        data={orderBy(historyList.slice(page, pageSize + page), sort).map(
          (item) => ({
            ...item,
            [SELECTED_FIELD]: selectedState[idGetter(item)],
          })
        )}
        checkboxElement
        style={{
          height: historyList.length > 0 ? "100%" : "250px",
        }}
        dataItemKey={DATA_ITEM_KEY}
        skip={page}
        take={pageSize}
        total={historyList.length}
        onPageChange={onPageChange}
        sort={sort}
        sortable={true}
        onSortChange={(e) => {
          setSort(e.sort);
        }}
        filter={filter}
        filterOperators={filterOperators}
        onDataStateChange={onDataStateChange}
        onSelectionChange={onSelectionChange}
        onHeaderSelectionChange={onHeaderSelectionChange}
        className="pagination-row-cus"
        pageable={{
          pageSizes: [10, 20, 30],
        }}
      >
        <GridNoRecords style={{}}>
          {loading ? <Loading /> : "No data found"}
        </GridNoRecords>

        <GridColumn
          title=""
          className="w-5"
          cell={(props) => {
            let actionId = props.dataItem.actionId;
            return (
              <td>
                <i className={getClassName(actionId)} />
              </td>
            );
          }}
        />

        <GridColumn
          title="Action"
          className="w-20"
          cell={(props) => {
            const action = props.dataItem;
            if (action.actionId == ACTION_ID.edited) {
              return (
                <td
                  className="anchar-pointer text-theme w-20"
                  onClick={() => onActionClick(action)}
                >
                  {action.actionName.trim()}
                </td>
              );
            }
            return <td className="w-20">{action.actionName.trim()}</td>;
          }}
        />

        <GridColumn
          field="staffName"
          title="By Staff"
          className="cursor-default"
        />

        <GridColumn
          title="Date"
          cell={(props) => {
            let field = moment
              .utc(props.dataItem.utcDateCreated)
              .local()
              .format("M/D/YYYY");
            return <td className="cursor-default">{field}</td>;
          }}
        />
        <GridColumn
          title="Time"
          cell={(props) => {
            let field = moment
              .utc(props.dataItem.utcDateCreated)
              .local()
              .format("HH:mm A");
            return <td className="cursor-default">{field}</td>;
          }}
        />
      </Grid>
    </div>
  );
};

export default DocumentHistoryList;
