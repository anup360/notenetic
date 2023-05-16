import { Button } from "@progress/kendo-react-buttons";
import { useTableKeyboardNavigation } from "@progress/kendo-react-data-tools";
import {
  Grid,
  GridColumn,
  GridColumnMenuSort,
  GRID_COL_INDEX_ATTRIBUTE,
} from "@progress/kendo-react-grid";
import { Tooltip } from "@progress/kendo-react-tooltip";
import React, { useEffect, useRef, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Loader from "../../../control-components/loader/loader";
import useModelScroll from "../../../cutomHooks/model-dialouge-scroll";
import ApiHelper from "../../../helper/api-helper";
import ApiUrls from "../../../helper/api-urls";
import APP_ROUTES from "../../../helper/app-routes";
import { showError } from "../../../util/utility";
import DeleteDialogModal from "../../../control-components/custom-delete-dialog-box/delete-dialog";
import { mapDocumentTemplate } from "./document-template-utility";
import SettingTemplate from "./setting-template";
import searchIcon from "../../../assets/images/search.png";
import { Input } from "@progress/kendo-react-inputs";
import { getter } from "@progress/kendo-react-common";
import { filterBy, orderBy } from "@progress/kendo-data-query";
import { getSelectedState, GridNoRecords } from "@progress/kendo-react-grid";
import { filter } from "@progress/kendo-data-query/dist/npm/transducers";
import { process } from "@progress/kendo-data-query";

import RenameDialog from "./rename-model";
const DATA_ITEM_KEY = "id";
const SELECTED_FIELD = "selected";
const idGetter = getter(DATA_ITEM_KEY);

function DocumentTemplateList() {
  // States
  const [documentTemplateList, setDocumentTemplateList] = useState([]);
  const [draftCount, setDraftCount] = useState();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [setting, setSetting] = useState(false);
  const [settingTemplateId, setSettingTemplateId] = useState();
  const [confirm, setConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchApiQuery, setsearchApiQuery] = useState([]);
  const [selectedState, setSelectedState] = React.useState({});
  const [sort, setSort] = useState([]);
  const [renameDialog, setRenameDialog] = useState(false);
  const [renameInfo, setRenameInfo] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  // Variables
  const navigate = useNavigate();
  const clinicId = useSelector((state) => state.loggedIn.clinicId);
  const [modelScroll, setScroll] = useModelScroll();

  const tableRef = useRef(null);

  /* ============================= private functions ============================= */

  function fetchDraftCount() {
    ApiHelper.getRequest(ApiUrls.GET_DOCUMENT_TEMPLATE_DRAFT_COUNT)
      .then((result) => {
        setDraftCount(result.resultData);
      })
      .catch((err) => showError(err, "Draft Count"));
  }

  async function getAllDocumentTemplates() {
    ApiHelper.getRequest(ApiUrls.GET_DOCUMENT_TEMPLATE_BY_CLINIC_ID)
      .then((result) => {
        if (result.resultData) {
          setDocumentTemplateList(
            result.resultData.map((d) => mapDocumentTemplate(d))
          );
        }
        setsearchApiQuery(result.resultData);
      })
      .catch((err) => {
        showError(err, "Fetch Document Templates");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function deleteDocumentTemplate(id) {
    ApiHelper.deleteRequestWithEncryption(ApiUrls.DELETE_DOCUMENT_TEMPLATE, id)
      .then((_) => {
        NotificationManager.success("Delete Document Template Successfully");
        getAllDocumentTemplates();
      })
      .catch((err) => {
        showError(err, "Delete Document Template");
      })
      .finally(() => {
        hideConfirmPopup();
        setLoading(false);
      });
  }

  /* ============================= useEffect functions ============================= */

  useEffect(() => {
    setLoading(true);
    getAllDocumentTemplates();
    fetchDraftCount();
    if (localStorage.getItem("document-template-pagesize")) {
      setPageSize(localStorage.getItem("document-template-pagesize"));
    }
  }, []);

  /* ============================= Event functions ============================= */

  const handleConfirm = (id) => {
    setConfirm(true);
    setDeleteId(id);
    setScroll(true);
  };

  const hideConfirmPopup = () => {
    setConfirm(false);
    setDeleteId();
    setScroll(false);
  };

  const handleDelete = () => {
    handleDeleteDocumentTemplate(deleteId);
  };

  function pageChange(event) {
    let skip = event?.page?.skip;
    let take = event?.page?.take;

    storePage(take);
    setPage(skip);
    setPageSize(take);
    window.scrollTo(0, 0);
  }

  function handleAddNewDocumentTemplate(e) {
    navigate(APP_ROUTES.DOCUMENT_TEMPLATE_ADD, {
      state: { documentTemplateId: undefined },
    });
  }

  function handleEditDocumentTemplate(id) {
    navigate(APP_ROUTES.DOCUMENT_TEMPLATE_ADD, {
      state: { documentTemplateId: id, isDuplicate: false },
    });
  }

  function handleDuplicateDocTemplate(id) {
    navigate(APP_ROUTES.DOCUMENT_TEMPLATE_ADD, {
      state: {
        documentTemplateId: id,
        isDuplicate: true,
      },
    });
  }

  function handleDeleteDocumentTemplate(id) {
    setLoading(true);
    deleteDocumentTemplate(id);
  }

  function handleDocumentTemplateView(event) {
    navigate(APP_ROUTES.DOCUMENT_TEMPLATE_VIEW, {
      state: { documentTemplateId: event.id },
    });
  }

  function habdleDocumentRename(event) {
    setRenameDialog(!renameDialog);
    setRenameInfo(event);
  }

  function handleSettingTemplateView(id) {
    setSetting(!setting);
    setSettingTemplateId(id);
    if (setting == false) {
      setScroll(true);
    } else {
      setScroll(false);
    }
  }

  function handleDocumentTemplateDraftsClick() {
    navigate(APP_ROUTES.DOCUMENT_TEMPLATE_DRAFT_LIST);
  }

  const filterOperators = {
    text: [
      {
        text: "grid.filterContainsOperator",
        operator: "contains",
      },
    ],
  };

  const storePage = (pageValue) =>
    localStorage.setItem("document-template-pagesize", pageValue);
  /* ============================= Render functions ============================= */

  const CustomActionCell = (props) => {
    const navigationAttributes = useTableKeyboardNavigation(props.id);
    let isHtmlFileTypeTemplate = props.dataItem.isHtmlFileTypeTemplate;
    let isDefault = props.dataItem.isDefault;

    const filterOperators = {
      text: [
        {
          text: "grid.filterContainsOperator",
          operator: "contains",
        },
      ],
    };

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
          className="k-chip k-chip-md k-rounded-md k-chip-solid k-chip-solid-base m-1"
          onClick={() => {
            handleConfirm(props.dataItem.id);
          }}
        >
          <div className="k-chip-content">
            <Tooltip anchorElement="target" position="top">
              <i className="fa fa-trash" aria-hidden="true" title="Delete" />
            </Tooltip>
          </div>
        </div>
        {isHtmlFileTypeTemplate === false && isDefault == false && (
          <div
            className="k-chip k-chip-md k-rounded-md k-chip-solid k-chip-solid-base m-1"
            onClick={() => {
              handleEditDocumentTemplate(props.dataItem.id);
            }}
          >
            <div className="k-chip-content">
              <Tooltip anchorElement="target" position="top">
                <i className="fas fa-edit" title="Edit" />
              </Tooltip>
            </div>
          </div>
        )}
        <div
          className={
            isHtmlFileTypeTemplate == true
              ? " k-chip k-chip-md k-rounded-md k-chip-solid k-chip-solid-base m-1"
              : " k-chip k-chip-md k-rounded-md k-chip-solid k-chip-solid-base "
          }
          onClick={() => {
            handleSettingTemplateView(props.dataItem.id);
          }}
        >
          <div className="k-chip-content">
            <Tooltip anchorElement="target" position="top">
              <i className="fa fa-cog" title="Setting" />
            </Tooltip>
          </div>
        </div>
        {isHtmlFileTypeTemplate === false && (
          <div
            className="k-chip k-chip-md k-rounded-md k-chip-solid k-chip-solid-base m-1"
            onClick={() => {
              handleDuplicateDocTemplate(props.dataItem.id);
            }}
          >
            <div className="k-chip-content">
              <Tooltip anchorElement="target" position="top">
                <i
                  className="fa fa-file"
                  title="Duplicate"
                  aria-hidden="true"
                />
              </Tooltip>
            </div>
          </div>
        )}
      </td>
    );
  };
  const columnMenus = (props) => {
    return (
      <div>
        <GridColumnMenuSort {...props} data={documentTemplateList} />
      </div>
    );
  };

  const handleFilter = (e) => {
    if (e.target.value === "") {
      setPage(currentPage);
      setDocumentTemplateList(searchApiQuery);
    } else {
      const filterResult = searchApiQuery.filter((item) =>
        item.templateName.toLowerCase().includes(e.target.value.toLowerCase())
      );
      if (filterResult.length > 0) {
        setCurrentPage(page);
        setPage(0);
      }
      setDocumentTemplateList(filterResult);
    }
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <h4 className="address-title text-grey ml-3">
        <span className="f-24">Document Templates</span>
      </h4>
      <div className="grid-table ">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="content-search-filter ">
            <img src={searchIcon} alt="" className="search-icon" />
            <Input
              className="icon-searchinput"
              placeholder="Search Template Name"
              value={searchQuery}
              onChange={(e) => handleFilter(e)}
            />
          </div>
          <span className="d-flex align-items-center">
            <Button
              onClick={handleDocumentTemplateDraftsClick}
              className="btn blue-primary-outline"
            >
              {/* <img src={addIcon} alt="" className="me-2 add-img" /> */}
              <i className="fa-brands fa-firstdraft"></i> Draft{" "}
              {draftCount ? `(${draftCount})` : ""}
            </Button>
            &nbsp;
            <Button
              onClick={handleAddNewDocumentTemplate}
              className="btn blue-primary"
            >
              <i className="fa fa-plus "></i> Add Template
            </Button>
          </span>
        </div>

        <div className="grid-table table-heading-auth">
          {loading && <Loader />}
          <Grid
            // onRowClick={handleDocumentTemplateView}
            // data={documentTemplateList.slice(page, pageSize + page)}
            data={orderBy(
              documentTemplateList.slice(page, +pageSize + page),
              sort
            ).map((item) => ({
              ...item,
              [SELECTED_FIELD]: selectedState[idGetter(item)],
            }))}
            skip={page}
            take={+pageSize}
            onPageChange={pageChange}
            total={documentTemplateList.length}
            className="pagination-row-cus"
            pageable={{
              pageSizes: [10, 20, 30],
            }}
            sort={sort}
            sortable={true}
            onSortChange={(e) => {
              setSort(e.sort);
            }}
            filterOperators={filterOperators}
            filter={filter}
          >
            <GridColumn
              // columnMenu={columnMenus}
              title="Name"
              field="templateName"
              locked={true}
              cell={(props) => {
                let field = props.dataItem;
                let isHtmlFileTypeTemplate =
                  props.dataItem.isHtmlFileTypeTemplate;
                return (
                  <>
                    {isHtmlFileTypeTemplate ? (
                      <td
                        title={"File template can't be editable"}
                        className=" position-sticky start-0 bg-custom-color"
                      >
                        {field.templateName}
                      </td>
                    ) : (
                      <td className=" position-sticky start-0 bg-custom-color">
                        <span
                          className="anchar-pointer text-theme mr-2 "
                          onClick={() => {
                            handleDocumentTemplateView(field);
                          }}
                        >
                          {field.templateName}
                        </span>
                        <span
                          className="pencil-tool-align"
                          onClick={() => {
                            habdleDocumentRename(field);
                          }}
                        >
                          <Tooltip
                            anchorElement="target"
                            position="top"
                            style={{ display: "inherit" }}
                          >
                            <i className="fa fa-pencil fa-sm " title="rename" />
                          </Tooltip>
                        </span>
                      </td>
                    )}
                  </>
                );
              }}
            />

            <GridColumn
              // columnMenu={columnMenus}
              className="cursor-default"
              field="templateTypeName"
              title="Type"
            />
            <GridColumn
              className="cursor-default"
              field="posType"
              title="POS"
              sortable={false}
            />
            <GridColumn
              className="cursor-default"
              field="timeRecordingMethod"
              title="Time Recording"
              sortable={false}
            />
            <GridColumn
              title="File Template?"
              sortable={false}
              cell={(props) => {
                let field = props.dataItem.isHtmlFileTypeTemplate;
                return (
                  <td>
                    {field === true ? (
                      <span
                        className="fa fa-check-circle cursor-default f-18 "
                        style={{ color: "green" }}
                      ></span>
                    ) : (
                      <span className="fa fa-times-circle cursor-default f-18 cross-icon-color"></span>
                    )}
                  </td>
                );
              }}
            />
            {/* <GridColumn
              sortable={false}
              className="cursor-default"
              title="Can Add Next Appt."
              cell={(props) => {
                let field = props.dataItem.canAddNextAppt;
                return (
                  <td>
                    {field === true ? (
                      <span
                        className="fa fa-check-circle cursor-default  f-18"
                        style={{ color: "green" }}
                      ></span>
                    ) : (
                      <span className="fa fa-times-circle cursor-default f-18 cross-icon-color"></span>
                    )}
                  </td>
                );
              }}
            /> */}
            <GridColumn
              sortable={false}
              title="Can Apply Client Sig."
              cell={(props) => {
                let field = props.dataItem.canApplyClientSig;
                return (
                  <td>
                    {field === true ? (
                      <span
                        className="fa fa-check-circle cursor-default  f-18 "
                        style={{ color: "green" }}
                      ></span>
                    ) : (
                      <span className="fa fa-times-circle cursor-default f-18 cross-icon-color"></span>
                    )}
                  </td>
                );
              }}
            />
            <GridColumn
              sortable={false}
              title="Show Client Progress"
              cell={(props) => {
                let field = props.dataItem.showClientProgress;
                return (
                  <td>
                    {field === true ? (
                      <span
                        className="fa fa-check-circle cursor-default  f-18 "
                        style={{ color: "green" }}
                      ></span>
                    ) : (
                      <span className="fa fa-times-circle cursor-default f-18 cross-icon-color"></span>
                    )}
                  </td>
                );
              }}
            />
            <GridColumn
              sortable={false}
              title="Show Service Control"
              cell={(props) => {
                let field = props.dataItem.showServiceControl;
                return (
                  <td>
                    {field === true ? (
                      <span
                        className="fa fa-check-circle cursor-default  f-18 "
                        style={{ color: "green" }}
                      ></span>
                    ) : (
                      <span className="fa fa-times-circle cursor-default f-18 cross-icon-color"></span>
                    )}
                  </td>
                );
              }}
            />
            <GridColumn
              sortable={false}
              title="Show Treatment Plan"
              cell={(props) => {
                let field = props.dataItem.showTreatmentPlan;
                return (
                  <td>
                    {field === true ? (
                      <span
                        className="fa fa-check-circle cursor-default  f-18 "
                        style={{ color: "green" }}
                      ></span>
                    ) : (
                      <span className="fa fa-times-circle cursor-default f-18 cross-icon-color"></span>
                    )}
                  </td>
                );
              }}
            />
            <GridColumn
              sortable={false}
              title="Show Site of Service"
              cell={(props) => {
                let field = props.dataItem.showSiteOfService;
                return (
                  <td>
                    {field === true ? (
                      <span
                        className="fa fa-check-circle cursor-default  f-18 "
                        style={{ color: "green" }}
                      ></span>
                    ) : (
                      <span className="fa fa-times-circle cursor-default f-18 cross-icon-color"></span>
                    )}
                  </td>
                );
              }}
            />
            <GridColumn
              sortable={false}
              title="Show Client Diagnosis"
              cell={(props) => {
                let field = props.dataItem.showClientDiags;
                return (
                  <td>
                    {field === true ? (
                      <span
                        className="fa fa-check-circle cursor-default  f-18 "
                        style={{ color: "green" }}
                      ></span>
                    ) : (
                      <span className="fa fa-times-circle cursor-default f-18 cross-icon-color"></span>
                    )}
                  </td>
                );
              }}
            />
            <GridColumn
              sortable={false}
              title="Show Visit Type"
              cell={(props) => {
                let field = props.dataItem.showVisitType;
                return (
                  <td>
                    {field === true ? (
                      <span
                        className="fa fa-check-circle cursor-default  f-18 "
                        style={{ color: "green" }}
                      ></span>
                    ) : (
                      <span className="fa fa-times-circle cursor-default f-18 cross-icon-color"></span>
                    )}
                  </td>
                );
              }}
            />
            <GridColumn
              sortable={false}
              title="Show File Attachment"
              cell={(props) => {
                let field = props.dataItem.showFileAttachment;
                return (
                  <td>
                    {field === true ? (
                      <span
                        className="fa fa-check-circle cursor-default  f-18 "
                        style={{ color: "green" }}
                      ></span>
                    ) : (
                      <span className="fa fa-times-circle cursor-default f-18 cross-icon-color"></span>
                    )}
                  </td>
                );
              }}
            />
            <GridColumn sortable={false} cell={CustomActionCell} title="" />
          </Grid>
        </div>
        {setting && (
          <SettingTemplate
            onClose={handleSettingTemplateView}
            isSelectedId={settingTemplateId}
            getAllDocumentTemplates={getAllDocumentTemplates}
          />
        )}
        {confirm && (
          <DeleteDialogModal
            onClose={hideConfirmPopup}
            title="Document Template"
            message="document template"
            handleDelete={handleDelete}
          />
        )}
        {renameDialog && (
          <RenameDialog
            onClose={habdleDocumentRename}
            title="Rename Template"
            renameInfo={renameInfo}
            getAllDocumentTemplates={getAllDocumentTemplates}
          />
        )}
      </div>
    </>
  );
}
export default DocumentTemplateList;
