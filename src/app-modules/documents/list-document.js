import { groupBy } from "@progress/kendo-data-query";
import { Button } from "@progress/kendo-react-buttons";
import {
  setExpandedState,
  setGroupIds,
  useTableKeyboardNavigation,
} from "@progress/kendo-react-data-tools";
import {
  Grid,
  GridColumn,
  GRID_COL_INDEX_ATTRIBUTE,
} from "@progress/kendo-react-grid";
import { renderErrors } from "src/helper/error-message-helper";
import { Checkbox } from "@progress/kendo-react-inputs";
import { Tooltip } from "@progress/kendo-react-tooltip";
import React, { useEffect, useRef, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useNavigate } from "react-router";

import { useDispatch, useSelector } from "react-redux";
import {
  GET_CLIENT_PROFILE_IMG_BYTES,
  SELECTED_CLIENT_ID,
  SELECTED_STAFF_ID,
} from "../../actions";
import DeleteDialogModal from "../../control-components/custom-delete-dialog-box/delete-dialog";
import Loading from "../../control-components/loader/loader";
import useModelScroll from "../../cutomHooks/model-dialouge-scroll";
import apiHelper from "../../helper/api-helper";
import API_URLS from "../../helper/api-urls";
import APP_ROUTES from "../../helper/app-routes";
import { SettingsService } from "../../services/settingsService";
import { showError } from "../../util/utility";
import { convertServerDocumentToLocal } from "./document-utility";
import DocumentSearchView from "./list-document-search";

import { permissionEnum } from "../..//helper/permission-helper";

const initialGroup = [];
const processWithGroups = (data, group) => {
  const newDataState = groupBy(data, group);
  setGroupIds({
    data: newDataState,
    group: group,
  });
  return newDataState;
};

const ListDocuments = () => {
  // States
  const [documentList, setDocumentList] = useState([]);
  const [draftCount, setDraftCount] = useState();
  const [loading, setLoading] = useState(false);
  const [skip, setSkip] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const dispatch = useDispatch();
  const [openDateFilter, setOpenDateFilter] = useState(false);
  const [openClientFilter, setOpenClientFilter] = useState(false);
  const [openStaffFilter, setOpenStaffFilter] = useState(false);
  const [openServiceFilter, setOpenServiceFilter] = useState(false);

  const userAccessPermission = useSelector(
    (state) => state.userAccessPermission
  );

  const [group, setGroup] = React.useState(initialGroup);
  const [resultState, setResultState] = React.useState(
    processWithGroups(documentList, initialGroup)
  );
  const [collapsedState, setCollapsedState] = React.useState([]);
  const [filter, setFilter] = React.useState({});

  const [confirm, setConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [modelScroll, setScroll] = useModelScroll();
  const [isActiveCheck, setIsActiveCheck] = useState(false);

  // Search Status
  const searchRef = useRef(null);

  const docFilter = useSelector((state) => state.getDocumentFilter);
  const [showFilter, setShowFilter] = React.useState(false);

  let currentDate = new Date();
  let pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 6);

  const clearAdvSearchObj = {
    documentId: "",
    client: [],
    service: 0,
    dosStartDate: pastDate, // "2022-08-08T16:00:17.362Z",
    dosEndDate: currentDate, // "2022-08-08T16:00:17.362Z",
    staff: [],
    template: [],
  };

  const [advSearchFields, setAdvSearchFields] = useState(clearAdvSearchObj);
  const [docFilterHandled, setDocFilterHandled] = useState(false);
  const [displaySearchResult, setDisplaySearchResult] = useState(false);
  const [fetchState, setFetchState] = useState({});
  const clinicId = useSelector((state) => state.loggedIn.clinicId);

  // Variables
  const navigate = useNavigate();
  const onExpandChange = React.useCallback(
    (event) => {
      const item = event.dataItem;
      if (item.groupId) {
        const newCollapsedIds = !event.value
          ? [...collapsedState, item.groupId]
          : collapsedState.filter((groupId) => groupId !== item.groupId);
        setCollapsedState(newCollapsedIds);
      }
    },
    [collapsedState]
  );
  const newData = setExpandedState({
    data: resultState,
    collapsedIds: collapsedState,
  });

  /* ============================= useEffect functions ============================= */

  useEffect(() => {
    // fetchDocuments();
    fetchDraftCount();
    if (docFilter) {
      setAdvSearchFields({
        ...advSearchFields,
        client: docFilter?.client ? docFilter?.client : [],
        staff: docFilter?.staff ? docFilter?.staff : [],
        template: docFilter?.template ? docFilter?.template : [],
        documentId: docFilter?.documentId ? docFilter?.documentId : "",
        service: docFilter?.service ? docFilter?.service : 0,
        dosStartDate: docFilter?.dosStartDate
          ? docFilter?.dosStartDate
          : pastDate,
        dosEndDate: docFilter?.dosEndDate ? docFilter?.dosEndDate : currentDate,
      });
    }
    setDocFilterHandled(true);
  }, []);

  useEffect(() => {
    if (docFilterHandled) _fetchDocuments();
  }, [fetchState, docFilterHandled]);

  /* ============================= Private functions ============================= */

  function fetchDraftCount() {
    apiHelper
      .getRequest(API_URLS.GET_DOCUMENT_DRAFT_COUNT)
      .then((result) => {
        setDraftCount(result.resultData);
      })
      .catch((err) => showError(err, "Draft Count"));
  }

  function fetchDocuments(localAdvSearchActive) {
    setFetchState({ ...fetchState, advSearchActive: localAdvSearchActive });
  }

  function _fetchDocuments(take, finalValue, changeVal) {
    setOpenDateFilter(false);
    setOpenClientFilter(false);
    setOpenStaffFilter(false);
    setOpenServiceFilter(false);
    let clientArry = [];
    let staffArry = [];
    let templateArry = [];
    if (advSearchFields?.client) {
      advSearchFields?.client.map((objType) => clientArry.push(objType.id));
    } else {
      docFilter?.client.map((objType) => clientArry.push(objType.id));
    }
    if (advSearchFields?.staff) {
      advSearchFields?.staff.map((objType) => staffArry.push(objType.id));
    } else {
      docFilter?.staff.map((objType) => staffArry.push(objType.id));
    }
    if (advSearchFields?.template) {
      advSearchFields?.template.map((objType) => templateArry.push(objType.id));
    } else {
      docFilter?.template.map((objType) => templateArry.push(objType.id));
    }

    const body = {
      showTrashNote: isActiveCheck,
      active: true,
      clientId: clientArry,
      documentId: advSearchFields?.documentId ? advSearchFields?.documentId : 0,
      serviceId: advSearchFields?.service.id,
      startDate: advSearchFields?.dosStartDate,
      endDate: advSearchFields?.dosEndDate,
      pageNumber: finalValue ? finalValue : 1,
      pageSize: take == null ? pageSize : take,
      sortDirection: null,
      staffId: staffArry,
      documentTemplateIds: templateArry,
    };

    if (fetchState.advSearchActive) {
      if (advSearchFields?.documentId > 0) {
        body.documentId = advSearchFields.documentId;
      }
      if (advSearchFields?.client) {
        body.clientId = advSearchFields.client.id;
      }
      if (advSearchFields?.service) {
        body.serviceId = advSearchFields.service.id;
      }
      if (advSearchFields?.dosStartDate) {
        body.startDate = advSearchFields?.dosStartDate;
      }
      if (advSearchFields?.dosEndDate) {
        body.endDate = advSearchFields?.dosEndDate;
      }
    }

    setLoading(true);
    apiHelper
      .postRequest(API_URLS.GET_DOCUMENTS_PAGING, body)
      .then((result) => {
        if (result.resultData) {
          getLogo();
          let list = result.resultData.map(convertServerDocumentToLocal);
          list = list.map((x) => {
            if (documentList) {
              return {
                ...x,
                isSelected:
                  documentList.find((y) => y.id == x.id)?.isSelected ?? false,
              };
            }
            return { ...x, isSelected: false };
          });
          setDocumentList(list);
          const newDataState = processWithGroups(list, group);
          setResultState(newDataState);
        }
      })
      .catch((err) => {
        showError(err, "Fetch Document");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function unTrashDocument(id) {
    setLoading(true);
    apiHelper
      .queryGetRequestWithEncryption(API_URLS.UNTRASH_DOCUMENT, id)
      .then((_) => {
        NotificationManager.success("Document restore successfully");
        //  onBack();
        setConfirm(false);
        setScroll(false);
        _fetchDocuments(null, null, true);
      })
      .catch((err) => {
        showError(err, "Restore Document");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  /* ============================= Event functions ============================= */

  const handleConfirm = (id) => {
    setConfirm(true);
    setDeleteId(id);
    setScroll(true);
  };

  const handleSwitch = (e) => {
    var changeVal = e.target.value;
    setIsActiveCheck(changeVal);
    _fetchDocuments(null, null, changeVal);
  };

  const hideConfirmPopup = () => {
    setConfirm(false);
    setDeleteId();
    setScroll(false);
  };

  const handleDelete = () => {
    if (isActiveCheck == true) {
      unTrashDocument(deleteId);
    } else {
      handleDeleteDocument(deleteId);
    }
  };

  const getLogo = async () => {
    try {
      const result = await SettingsService.getClinicLogo(clinicId, true);
      if (result.resultData !== null) {
        dispatch({
          type: GET_CLIENT_PROFILE_IMG_BYTES,
          payload: result.resultData,
        });
      }
    } catch (error) {
      renderErrors(error.message);
    }
  };

  function onDataChange(filter, group) {
    const list = documentList.slice(skip, pageSize + skip);
    const filteredList = list; //filterBy(list, filter)
    const newDataState = processWithGroups(filteredList, group);
    setGroup(group);
    setFilter(filter);
    setResultState(newDataState);
  }

  function pageChange(event) {
    let skip = event.page.skip;
    let take = event.page.take;
    setSkip(skip);
    setPageSize(take);
    let newValue = skip / take;
    let finalValue = newValue + 1;

    _fetchDocuments(take, finalValue, isActiveCheck);
  }

  function handleDocumentView(event) {
    navigate(APP_ROUTES.DOCUMENT_VIEW, {
      state: {
        id: event.id,
        backRoute: APP_ROUTES.DOCUMENT_LIST,
        isActiveCheck: isActiveCheck,
        // showClinicLogo:showClinicLogo
      },
    });
    window.scrollTo(0, 0);
  }

  function handleClientView(e, field) {
    dispatch({
      type: SELECTED_CLIENT_ID,
      payload: field?.clientId,
    });
    navigate(APP_ROUTES.CLIENT_DASHBOARD);
  }

  function handleAuthorView(event) {
    dispatch({
      type: SELECTED_STAFF_ID,
      payload: event.createdBy,
    });
    navigate(APP_ROUTES.STAFF_PROFILE);
  }

  function viewMultipleDocument() {
    const selectedDocuments = documentList.filter((x) => x.isSelected);
    if (selectedDocuments.length < 1) {
      showError("Please select any document!");
      return;
    }
    navigate(APP_ROUTES.DOCUMENT_MULTI_VIEW, {
      state: {
        idList: selectedDocuments.map((x) => x.id),
        backRoute: APP_ROUTES.DOCUMENT_LIST,
      },
    });
  }

  function handleAddNewDocument() {
    navigate(APP_ROUTES.DOCUMENT_ADD);
  }

  function handleDocumentDraftsClick() {
    navigate(APP_ROUTES.DOCUMENT_DRAFT_LIST);
  }

  function handleEditDocument(id) {
    navigate(APP_ROUTES.DOCUMENT_EDIT, { state: { id: id } });
  }

  function selectUnselectDocument(id) {
    const list = documentList.map((x) => {
      if (x.id == id) {
        return { ...x, isSelected: !x.isSelected };
      }
      return x;
    });
    setDocumentList(list);
    const newDataState = processWithGroups(list, group);
    setResultState(newDataState);
  }

  function handleDeleteDocument(id) {
    setLoading(true);
    apiHelper
      .deleteRequestWithEncryption(API_URLS.DELETE_DOCUMENT, id)
      .then((_) => {
        NotificationManager.success("Document deleted successfully");
        _fetchDocuments(null, null, false);
      })
      .catch((err) => {
        showError(err, "Delete Document");
      })
      .finally(() => {
        hideConfirmPopup();
        setLoading(false);
      });
  }

  /* ============================= Render functions ============================= */

  function renderSearchView() {
    return (
      <>
        <DocumentSearchView
          ref={searchRef}
          clearAdvSearchObj={clearAdvSearchObj}
          advSearchFields={advSearchFields}
          setAdvSearchFields={setAdvSearchFields}
          setDisplaySearchResult={setDisplaySearchResult}
          fetchDocuments={fetchDocuments}
          setPage={setSkip}
          setPageSize={setPageSize}
          docFilter={docFilter}
          showFilter={showFilter}
          setShowFilter={setShowFilter}
          setIsActiveCheck={setIsActiveCheck}
          isActiveCheck={isActiveCheck}
          pastDate={pastDate}
          currentDate={currentDate}
          openDateFilter={openDateFilter}
          setOpenDateFilter={setOpenDateFilter}
          openClientFilter={openClientFilter}
          setOpenClientFilter={setOpenClientFilter}
          openStaffFilter={openStaffFilter}
          setOpenStaffFilter={setOpenStaffFilter}
          openServiceFilter={openServiceFilter}
          setOpenServiceFilter={setOpenServiceFilter}
        />
      </>
    );
  }

  function renderHeader() {
    return (
      <div className="row">
        <div className="col-lg-8 col-sm-12">
          <h4 className="address-title text-grey ml-3">
            <span className="f-24">Documents</span>
          </h4>
        </div>
        <div className="col-lg-4 col-sm-12 ">
          <div className="right-align-docs">
            <Button
              onClick={handleDocumentDraftsClick}
              className="btn blue-primary-outline mr-2"
            >
              {/* <img src={addIcon} alt="" className="me-2 add-img" /> */}
              <i className="fa-brands fa-firstdraft"></i> Draft{" "}
              {draftCount > 0 ? `(${draftCount})` : ""}
            </Button>
            <Button onClick={handleAddNewDocument} className="btn blue-primary">
              <i className="fa fa-plus "></i> Add Document
            </Button>
          </div>
        </div>
      </div>
    );
  }

  function renderDocuments() {
    const CustomActionCell = (props) => {
      const navigationAttributes = useTableKeyboardNavigation(props.id);
      return (
        <td
          colSpan={props.colSpan}
          role={"gridcell"}
          aria-colindex={props.ariaColumnIndex}
          aria-selected={props.isSelected}
          {...{ [GRID_COL_INDEX_ATTRIBUTE]: props.columnIndex }}
          {...navigationAttributes}
        >
          <div
            className="k-chip k-chip-md k-rounded-md k-chip-solid k-chip-solid-base"
            onClick={() => {
              handleConfirm(props.dataItem.id);
            }}
          >
            <div className="k-chip-content">
              <Tooltip anchorElement="target" position="top">
                <i
                  className={
                    isActiveCheck == true ? "fa fa-rotate-left" : "fa fa-trash"
                  }
                  aria-hidden="true"
                  title={isActiveCheck == true ? "Reactivate" : "Delete"}
                />
              </Tooltip>
            </div>
          </div>
          {/* <div
                        className="k-chip k-chip-md k-rounded-md k-chip-solid k-chip-solid-base m-2"
                        onClick={() => { handleEditDocument(props.dataItem.id) }}>
                        <div className="k-chip-content">
                            <Tooltip anchorElement="target" position="top">
                                <i className="fas fa-edit" title="Edit" />
                            </Tooltip>
                        </div>
                    </div> */}
          {/* <div
                        className="k-chip k-chip-md k-rounded-md k-chip-solid k-chip-solid-base m-2"
                        onClick={() => { selectUnselectDocument(props.dataItem.id) }}>
                        <div className="k-chip-content">
                            <Checkbox
                                title="Select"
                                value={props.dataItem.isSelected}
                            />
                        </div>
                    </div> */}
        </td>
      );
    };

    const CustomCheckBox = (props) => {
      const navigationAttributes = useTableKeyboardNavigation(props.id);
      return (
        <td
          colSpan={props.colSpan}
          role={"gridcell"}
          aria-colindex={props.ariaColumnIndex}
          aria-selected={props.isSelected}
          {...{ [GRID_COL_INDEX_ATTRIBUTE]: props.columnIndex }}
          {...navigationAttributes}
        >
          <div
            // className="k-chip k-chip-md k-rounded-md k-chip-solid k-chip-solid-base m-2"
            onClick={() => {
              selectUnselectDocument(props.dataItem.id);
            }}
          >
            <div className="k-chip-content">
              <Checkbox title="Select" value={props.dataItem.isSelected} />
            </div>
          </div>
        </td>
      );
    };

    return (
      <div className="grid-table table-heading-auth">
        <Grid
          // onRowClick={handleDocumentView}
          data={newData}
          skip={skip}
          take={pageSize}
          onPageChange={pageChange}
          total={
            documentList && documentList.length > 0
              ? documentList[0].totalRecords
              : 0
          }
          className="pagination-row-cus"
          pageable={{
            pageSizes: [10, 50, 100, 500],
          }}
          groupable={true}
          group={group}
          onGroupChange={(e) => onDataChange(filter, e.group)}
          onExpandChange={onExpandChange}
        >
          <GridColumn
            cell={CustomCheckBox}
            className="cursor-default  icon-align"
            width="70px"
          />
          <GridColumn
            width="100px"
            title="ID"
            cell={(props) => {
              let field = props.dataItem;
              return (
                <td
                  className={"anchar-pointer text-theme"}
                  onClick={() => handleDocumentView(field)}
                >
                  {field.id}
                </td>
              );
            }}
            className="anchar-pointer text-theme"
          />
          <GridColumn
            title="Client"
            width="100px"
            cell={(props) => {
              let field = props.dataItem;
              return (
                <td
                  className={"anchar-pointer text-theme"}
                  onClick={(e) => handleClientView(e, field)}
                >
                  {field.clientLName + ", " + field.clientFName}
                </td>
              );
            }}
            className="anchar-pointer text-theme"
          />
          <GridColumn
            field="dateOfBirth"
            width="100px"
            title="DOB"
            format="{0:d}"
            className="cursor-default"
          />
          <GridColumn
            width="150px"
            field="documentTemplateName"
            title="Template"
            className="cursor-default"
          />
          <GridColumn
            field="serviceDateObj"
            width="100px"
            title="DOS"
            format="{0:d}"
            className="cursor-default"
          />

          <GridColumn
            field="placeOfServiceStr"
            title="Place of Srv."
            className="cursor-default"
          />

          <GridColumn
            field="timeStr"
            width="100px"
            title="Duration"
            className="cursor-default"
          />

          <GridColumn
            width="100px"
            title="Staff"
            cell={(props) => {
              let field = props.dataItem;
              return (
                <td
                  className={"anchar-pointer text-theme"}
                  onClick={() => handleAuthorView(field)}
                >
                  {field.createdByStaff}
                </td>
              );
            }}
            className="anchar-pointer text-theme"
          />

          <GridColumn
            width="100px"
            field="diagnosis"
            title="Dx"
            className="cursor-default"
          />
          <GridColumn
            width="100px"
            field="serviceRate"
            title="Srv. Rate"
            className="cursor-default"
          />
          <GridColumn
            field="docStatus"
            width="100px"
            title="Doc Status"
            className="cursor-default"
          />
          <GridColumn
            field="primaryInsurance"
            title="Payer"
            className="cursor-default"
          />
          <GridColumn
            width="100px"
            field="service"
            title="Service"
            className="cursor-default"
          />

          {/* <GridColumn
            title="Reviewed"
            sortable={false}
            cell={(props) => {
              let field = props.dataItem.isNoteReviewed;
              return (
                <td>
                  {field === true && (
                    <span
                      className="fa fa-check-circle cursor-default f-18 "
                      style={{ color: "green" }}
                    ></span>
                  )}
                </td>
              );
            }}
          /> */}
          <GridColumn
            field="numUnits"
            width="100px"
            title="Units"
            className="cursor-default"
            cell={(props) => {
              let field = props.dataItem;
              return <td className="cursor-default">{field.numUnits}</td>;
            }}
          />
          <GridColumn
            width="100px"
            field="billingStatus"
            title="Bill Status"
            className="cursor-default"
          />

          <GridColumn
            width="100px"
            field="custAuthId"
            title="Cust Auth Id"
            className="cursor-default"
          />

          {/* <GridColumn
            field="serviceName"
            title="Service"
            className="cursor-default"
          /> */}

          {/* <GridColumn
            field="utcDateCreatedObj"
            title="Date of Sub."
            format="{0:d}"
            className="cursor-default"
          /> */}

          <GridColumn
            field="isLocked"
            title="Locked"
            width="100px"
            className="cursor-default"
            cell={(props) => {
              let field = props.dataItem.isLocked;
              return (
                <td className="cursor-default">
                  {field === true && (
                    <span
                      className="fa fa-lock cursor-default"
                      style={{ color: "#e9a01ae3" }}
                    ></span>
                  )}
                </td>
              );
            }}
          />
          <GridColumn
            field="isSigned"
            title="Signed"
            width="100px"
            cell={(props) => {
              let field = props.dataItem.isSigned;
              return (
                <td className="cursor-default">
                  {field === true && (
                    <span
                      className="fa fa-check-circle cursor-default"
                      style={{ color: "green" }}
                    ></span>
                  )}
                </td>
              );
            }}
          />

          <GridColumn
            cell={CustomActionCell}
            width="100px"
            title="Actions"
            className="cursor-default"
          />
        </Grid>
        {loading && <Loading />}
      </div>
    );
  }

  return (
    <div className={showFilter ? "documnet-inner-content" : ""}>
      <div className="container-fluid ">
        {renderHeader()}
        {/* 
        <div className="search-bar "> */}
        <hr className="hr-spacing mt-2"></hr>
        <div className="row align-items-center">
          {renderSearchView()}

          {/* <Switch
            onChange={handleSwitch}
            checked={isActiveCheck}
            onLabel={""}
            offLabel={""}
            className="switch-on"
          />
          <span className="switch-title-text ml-2 mr-3">
            {" "}
            Show Trashed Documents
          </span> */}
        </div>
        <hr className="hr-spacing mb-2"></hr>
      </div>
      {renderDocuments()}
      <Button onClick={viewMultipleDocument} className="alert alert-info mt-2">
        {/* <img src={addIcon} alt="" className="me-2 add-img" /> */}
        <i className="fa fa-eye "></i> View Checked Document
      </Button>
      {confirm && (
        <DeleteDialogModal
          onClose={hideConfirmPopup}
          title="Document"
          message="document"
          handleDelete={handleDelete}
          handleReactive={handleDelete}
          activeType={isActiveCheck}
        />
      )}
    </div>
  );
};

export default ListDocuments;
