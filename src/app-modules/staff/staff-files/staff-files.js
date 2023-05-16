import React, { useState, useEffect } from "react";
import moment from "moment";
import { useNavigate } from "react-router";
import Loader from "../../../control-components/loader/loader";
import DrawerContainer from "../../../control-components/custom-drawer/custom-drawer";
import StaffProfileHeader from "../staff-profile/staff-profile-header";
import AppRoutes from "../../../helper/app-routes";
import addIcon from "../../../assets/images/add.png";
import { Tooltip } from "@progress/kendo-react-tooltip";
import ApiHelper from "../../../helper/api-helper";
import ApiUrls from "../../../helper/api-urls";
import Loading from "../../../control-components/loader/loader";
import { orderBy } from "@progress/kendo-data-query";
import { getter } from "@progress/kendo-react-common";
import { NotificationManager } from "react-notifications";
import { useSelector } from "react-redux";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { displayDateFromUtcDate } from "../../../util/utility.js";
import {
  Grid,
  GridColumn,
  GridNoRecords,
  getSelectedState,
} from "@progress/kendo-react-grid";
import { GridColumnMenuSort } from "@progress/kendo-react-grid";
import { filter } from "@progress/kendo-data-query/dist/npm/transducers";
import searchIcon from "../../../assets/images/search.png";
import { Input } from "@progress/kendo-react-inputs";
import { Encrption } from "../../encrption";
import useModelScroll from "../../../cutomHooks/model-dialouge-scroll";
import DeleteDialogModal from "../../../control-components/custom-delete-dialog-box/delete-dialog";
import { Chip, ChipList } from "@progress/kendo-react-buttons";
import { StaffService } from "../../../services/staffService";
import AssignStaffTags from "./add-files-tags";
import { permissionEnum } from "../../../helper/permission-helper";
import { renderErrors } from "src/helper/error-message-helper";


const DATA_ITEM_KEY = "id";
const SELECTED_FIELD = "selected";
const idGetter = getter(DATA_ITEM_KEY);

const StoredDocuments = () => {
  // const staffId = useSelector((state) => state.loggedIn?.staffId);
  const selectedStaffId = useSelector((state) => state.selectedStaffId);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [selectedState, setSelectedState] = React.useState({});
  const [sort, setSort] = useState([]);
  const [isDeleteConfirm, setDeleteConfirm] = useState(false);
  const [docId, SetdocId] = useState("");
  const [metaData, setMetaData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchApiQuery, setsearchApiQuery] = useState([]);
  const [modelScroll, setScroll] = useModelScroll();
  const [openTags, setOpenTags] = React.useState(false);
  const [assignTags, setAssignTags] = useState([]);
  const userAccessPermission = useSelector(
    (state) => state.userAccessPermission
  );

  useEffect(() => {
    getStoredDocumentByStaffId();
  }, []);

  // const DialougeDeleteDocument = ({ onClose, deleteStoredDocument }) => {
  //   return (
  //     <Dialog onClose={onClose} title={"Delete Stored Documnet"}>
  //       <p
  //         style={{
  //           margin: "25px",
  //           textAlign: "center",
  //         }}
  //       >
  //         Are you sure you want to delete document ?
  //       </p>
  //       <DialogActionsBar>
  //       <button
  //           className="btn blue-primary text-white"
  //           onClick={deleteStoredDocument}
  //         >
  //           Yes
  //         </button>
  //         <button
  //           className="btn grey-secondary text-white"
  //           onClick={onClose}
  //         >
  //           No
  //         </button>

  //       </DialogActionsBar>
  //     </Dialog>
  //   );
  // };

  const pageChange = (event) => {
    let skip = event.page.skip;
    let take = event.page.take;
    setPage(skip);
    setPageSize(take);
    let newValue = skip / take;
    let finalValue = newValue + 1;
  };
  const dataStateChange = (event) => {
    setPage(event.dataState.skip);
    setPageSize(event.dataState.take);
    setSort(event.dataState.sort);
  };

  const getStoredDocumentByStaffId = () => {
    let id = Encrption(selectedStaffId);
    setLoading(true);
    ApiHelper.getRequest(
      ApiUrls.GET_STAFF_STORED_DOCUMNET_BY_STAFFID + "+" + id
    )
      .then((result) => {
        setLoading(false);
        const list = result.resultData;
        setDocuments(list);
        setsearchApiQuery(list);
        setMetaData(result.metaData);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const columnMenus = (props) => {
    return (
      <div>
        <GridColumnMenuSort {...props} data={documents} />
      </div>
    );
  };

  const handleDeleteDocument = () => {
    setDeleteConfirm(!isDeleteConfirm);
    setScroll(false);
  };
  const deleteDocument = (id) => {
    setDeleteConfirm(true);
    SetdocId(id);
    setScroll(true);
  };

  const deleteStoredDocument = () => {
    let documentId = Encrption(docId);
    let staffSelected = Encrption(selectedStaffId);
    ApiHelper.deleteRequest(
      ApiUrls.DELETE_STAFF_DOCUMENT +
        "?docId=" +
        documentId +
        "&staffProfileId=" +
        staffSelected
    )
      .then(() => {
        NotificationManager.success("File deleted successfully");
        setDeleteConfirm(!isDeleteConfirm);
        getStoredDocumentByStaffId();
        setScroll(false);
      })
      .catch((error) => {
        renderErrors(error.message);
      });
  };

  function renderAttachments(documents) {
    const li = documents.staffDocumentAttachments.map((file) => {
      return (
        <li className="mb-2 mx-1">
          <a href={file.attachmentUrl} target="_blank" download>
            {file.fileName}
          </a>
        </li>
      );
    });
    return (
      <td className="border-right">
        <ul className="d-flex flex-wrap upload-attachemnt list-unstyled mb-0 ">
          {li}
        </ul>
      </td>
    );
  }
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

  const filterOperators = {
    text: [
      {
        text: "grid.filterContainsOperator",
        operator: "contains",
      },
    ],
  };

  const handleFilter = (e) => {
    if (e.target.value === "") {
      setDocuments(searchApiQuery);
    } else {
      const filterResult = searchApiQuery.filter((item) =>
        item.docName.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setDocuments(filterResult);
    }
    setSearchQuery(e.target.value);
  };

  const handleAddTags = (id, tagsArry) => {
    SetdocId(id);
    setOpenTags(true);
    setScroll(true);
    setAssignTags(tagsArry);
  };

  const handleCloseTags = ({ updated }) => {
    if (updated) {
      getStoredDocumentByStaffId();
    }
    setScroll(false);
    setOpenTags(false);
  };

  const handleRemoveTags = (e, obj) => {
    deleteTags(obj.id);
  };

  const deleteTags = async (id) => {
    await StaffService.removeStaffDocTags(id)
      .then((result) => {
        getStoredDocumentByStaffId();
      })
      .catch((error) => {
        renderErrors(error.message);
      });
  };

  return (
    <div className="d-flex flex-wrap">
      <div className="inner-dt col-md-3 col-lg-2">
        <DrawerContainer />
      </div>
      <div className="col-md-9 col-lg-10">
        <StaffProfileHeader />
        <div>
          <div className="d-flex justify-content-between  mt-3">
            <h4 className="address-title text-grey ">
              <span className="f-24">Files</span>
            </h4>

            {userAccessPermission[permissionEnum.MANAGE_STAFF_FILES] && (
              <button
                onClick={() => {
                  navigate(AppRoutes.STAFF_ADD_STORED_DOCUMENT);
                }}
                className="btn blue-primary text-white text-decoration-none d-flex align-items-center "
              >
                <img src={addIcon} alt="" className="me-2 add-img" />
                Add File
              </button>
            )}
          </div>
        </div>
        {documents.length == 0 && !loading ? (
          <div className="message-not-found">No Certification Available</div>
        ) : (
          <>
            <div className="content-search-filter col-lg-3 mt-2">
              <img src={searchIcon} alt="" className="search-icon ml-2" />
              <Input
                className="icon-searchinput"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => handleFilter(e)}
              />
            </div>
            <div className="grid-table  filter-grid">
              {loading === true && <Loader />}
              <div className=" mt-3">
                <Grid
                  data={orderBy(
                    documents.slice(page, pageSize + page),
                    sort
                  ).map((item) => ({
                    ...item,
                    [SELECTED_FIELD]: selectedState[idGetter(item)],
                  }))}
                  checkboxElement
                  style={{
                    height: documents.length > 0 ? "100%" : "250px",
                  }}
                  dataItemKey={DATA_ITEM_KEY}
                  selectedField={SELECTED_FIELD}
                  skip={page}
                  take={pageSize}
                  total={documents.length}
                  onPageChange={pageChange}
                  onRowClick={(e) => {
                    navigate(AppRoutes.STAFF_EDIT_STORED_DOCUMENT, {
                      state: { id: e.dataItem.id },
                    });
                  }}
                  sort={sort}
                  sortable={true}
                  onSortChange={(e) => {
                    setSort(e.sort);
                  }}
                  filter={filter}
                  filterOperators={filterOperators}
                  onDataStateChange={dataStateChange}
                  onSelectionChange={onSelectionChange}
                  onHeaderSelectionChange={onHeaderSelectionChange}
                  className="pagination-row-cus"
                  pageable={{
                    pageSizes: [10, 20, 30],
                  }}
                >
                  {documents.length == 0 && !loading && <GridNoRecords />}
                  <GridColumn
                    // columnMenu={columnMenus}
                    field="docName"
                    title="File Name"
                    className="anchar-pointer text-theme"
                  />

                  <GridColumn
                    title="File Tags"
                    cell={(props) => {
                      let field = props.dataItem.id;
                      let tagsArry = props.dataItem.staffDocumentTags;
                      return (
                        <td className="anchar-pointer text-theme">
                          {tagsArry.length > 0 &&
                            tagsArry.map((obj) => (
                              <Chip
                                text={obj.tagName}
                                key={obj.id}
                                value="chip"
                                rounded={"large"}
                                fillMode={"solid"}
                                removable={true}
                                size={"medium"}
                                style={{
                                  marginRight: 5,
                                  backgroundColor: obj.color,
                                  marginBottom: 10,
                                  color: "#ffffff",
                                }}
                                onRemove={(e) => {
                                  handleRemoveTags(e, obj);
                                }}
                              />
                            ))}
                          {userAccessPermission[
                            permissionEnum.MANAGE_STAFF_FILES
                          ] && (
                            <Chip
                              text="Add"
                              value="chip"
                              icon={"k-icon k-i-plus k-icon-64"}
                              rounded={"large"}
                              fillMode={"solid"}
                              size={"medium"}
                              onClick={() => handleAddTags(field, tagsArry)}
                              style={{ marginBottom: 10 }}
                            />
                          )}
                        </td>
                      );
                    }}
                  />
                  <GridColumn
                    // columnMenu={columnMenus}
                    field="createdByStaffName"
                    title="Uploaded By"
                    className="cursor-default"
                  />
                  <GridColumn
                    cell={(props) => {
                      let field = props.dataItem;
                      return renderAttachments(field);
                    }}
                    title="Files"
                    className="cursor-default"
                  />
                  <GridColumn
                    field="utcDateCreated"
                    // columnMenu={columnMenus}
                    title="Date Uploaded"
                    cell={(props) => {
                      let field = moment
                        .utc(props.dataItem.utcDateCreated)
                        .local()
                        .format("M/D/YYYY");
                      return <td className="cursor-default">{field}</td>;
                    }}
                  />
                  {userAccessPermission[permissionEnum.MANAGE_STAFF_FILES] && (
                    <GridColumn
                      filterable={false}
                      title="Actions"
                      cell={(props) => {
                        let field = props.dataItem.id;
                        return (
                          <td>
                            <div className="row-3">
                              <div
                                className="k-chip k-chip-md k-rounded-md k-chip-solid k-chip-solid-base"
                                onClick={() => deleteDocument(field)}
                              >
                                <div className="k-chip-content">
                                  <Tooltip
                                    anchorElement="target"
                                    position="top"
                                  >
                                    <i
                                      className="fa fa-trash"
                                      aria-hidden="true"
                                      title="Delete"
                                    ></i>
                                  </Tooltip>
                                </div>
                              </div>
                              {/* <div
                          className="k-chip k-chip-md k-rounded-md k-chip-solid k-chip-solid-base m-2"
                          onClick={() => editDocument(field)}
                        >
                          <div className="k-chip-content">
                            <Tooltip anchorElement="target" position="top">
                              <i className="fas fa-edit" title="Edit"></i>
                            </Tooltip>
                          </div>
                        </div> */}
                            </div>
                          </td>
                        );
                      }}
                    />
                  )}
                </Grid>
                {isDeleteConfirm && (
                  <DeleteDialogModal
                    onClose={handleDeleteDocument}
                    title="File"
                    message="file"
                    handleDelete={deleteStoredDocument}
                  />
                )}

                {openTags && (
                  <AssignStaffTags
                    onClose={handleCloseTags}
                    docId={docId}
                    staffTags={assignTags}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StoredDocuments;
