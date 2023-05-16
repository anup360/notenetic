import React, { useState, useEffect } from "react";
import moment from "moment";
// import moment from "moment";
import { useNavigate } from "react-router";
import CustomDrawer from "../../../../control-components/custom-drawer/custom-drawer";
import ClientHeader from "../client-header/client-header";
import AppRoutes from "../../../../helper/app-routes";
import addIcon from "../../../../assets/images/add.png";
import { Tooltip } from "@progress/kendo-react-tooltip";
import ApiHelper from "../../../../helper/api-helper";
import ApiUrls from "../../../../helper/api-urls";
import Loader from "../../../../control-components/loader/loader";
import { orderBy } from "@progress/kendo-data-query";
import { getter } from "@progress/kendo-react-common";
import { NotificationManager } from "react-notifications";
import { useSelector } from "react-redux";
import { displayDateFromUtcDate } from "../../../../util/utility.js";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { GridColumnMenuSort } from "@progress/kendo-react-grid";
import { Input } from "@progress/kendo-react-inputs";
import searchIcon from "../../../../assets/images/search.png";
import { Encrption } from "../../../encrption";
import useModelScroll from "../../../../cutomHooks/model-dialouge-scroll";
import DeleteDialogModal from "../../../../control-components/custom-delete-dialog-box/delete-dialog";
import { Chip, ChipList } from "@progress/kendo-react-buttons";
import AssignClientTags from "./add-files-tags";
import { ClientService } from "../../../../services/clientService";
import { permissionEnum } from "../../../../helper/permission-helper";
import { renderErrors } from "src/helper/error-message-helper";

const DATA_ITEM_KEY = "id";
const SELECTED_FIELD = "selected";
const idGetter = getter(DATA_ITEM_KEY);

const StoredDocuments = () => {
  const selectedClientId = useSelector((state) => state.selectedClientId);
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
  const [modelScroll, setScroll] = useModelScroll();
  const [openClientTags, setOpenTags] = React.useState(false);
  const userAccessPermission = useSelector(
    (state) => state.userAccessPermission
  );

  useEffect(() => {
    getStoredDocumentByClientId();
  }, [selectedClientId]);

  const handleFilter = (e) => {
    var search = e.target.value;
    setSearchQuery(search);
    if (search === "") {
      getStoredDocumentByClientId(null, null, search);
    } else {
      if (search.length > 2) {
        getStoredDocumentByClientId(null, null, search);
      }
    }
  };

  const pageChange = (event) => {
    let skip = event.page.skip;
    let take = event.page.take;
    setPage(skip);
    setPageSize(take);
    let newValue = skip / take;
    let finalValue = newValue + 1;
    getStoredDocumentByClientId(take, finalValue);
  };
  const dataStateChange = (event) => {
    setPage(event.dataState.skip);
    setPageSize(event.dataState.take);
    setSort(event.dataState.sort);
  };

  const getStoredDocumentByClientId = (take, finalValue, search) => {
    setLoading(true);
    var data = {
      pageNumber: finalValue ? finalValue : 1,
      pageSize: take == null ? pageSize : take,
      clientId: selectedClientId,
      searchContents: search ? search : "",
    };
    ApiHelper.postRequest(
      ApiUrls.POST_CLIENT_STORED_DOCUMENT_BY_CLIENT_ID,
      data
    )
      .then((result) => {
        setLoading(false);
        const list = result.resultData;
        setMetaData(result.metaData);
        setDocuments(list);
      })
      .catch((error) => {});
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
    ApiHelper.deleteRequest(ApiUrls.DELETE_CLIENT_DOCUMENT + Encrption(docId))
      .then(() => {
        NotificationManager.success("Document deleted successfully");
        setDeleteConfirm(!isDeleteConfirm);
        getStoredDocumentByClientId();
        setScroll(false);
      })
      .catch((error) => {
        renderErrors(error.message);
      });
  };

  function renderAttachments(documents) {
    const li = documents.clientDocumentAttachments.map((file) => {
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

  const handleAddTags = (id) => {
    SetdocId(id);
    setOpenTags(true);
    setScroll(true);
  };

  const handleCloseTags = ({ updated }) => {
    if (updated) {
      getStoredDocumentByClientId();
    }
    setScroll(false);
    setOpenTags(false);
  };

  const handleRemoveTags = (e, obj) => {
    deleteTags(obj.id);
  };

  const deleteTags = async (id) => {
    await ClientService.removeClientDocTags(id)
      .then((result) => {
        getStoredDocumentByClientId();
      })
      .catch((error) => {
        renderErrors(error.message);
      });
  };

  function handleDocumentView(event) {
    navigate(AppRoutes.EDIT_STRORED_DOCUMENT, {
      state: { id: event.id },
    });
  }

  return (
    <div className="d-flex flex-wrap">
      <div className="inner-dt col-md-3 col-lg-2">
        <CustomDrawer />
      </div>
      <div className="col-md-9 col-lg-10">
        <ClientHeader />
        <div className="Service-RateList mb-3 ">
          <div className="d-flex justify-content-between  mt-3">
            <h4 className="address-title text-grey ">
              <span className="f-24">Files</span>
            </h4>

            {userAccessPermission[permissionEnum.MANAGE_CLIENT_FILES] && (
              <button
                onClick={() => {
                  navigate(AppRoutes.ADD_STORED_DOCUMENTS);
                }}
                className="btn blue-primary text-white text-decoration-none d-flex align-items-center "
              >
                <img src={addIcon} alt="" className="me-2 add-img" />
                Add File
              </button>
            )}
          </div>
        </div>
        {loading === true && <Loader />}

        {documents.length == 0 && !loading ? (
          <div className="message-not-found">No files available</div>
        ) : (
          <>
            <div className="content-search-filter col-lg-3 mt-2">
              <img src={searchIcon} alt="" className="search-icon ml-2" />
              <Input
                className="icon-searchinput"
                placeholder="Type min. 3 chars to search..."
                value={searchQuery}
                onChange={(e) => handleFilter(e)}
              />
            </div>
            <div className="grid-table  filter-grid">
              <div className=" mt-3">
                <Grid
                  data={orderBy(documents, sort).map((item) => ({
                    ...item,
                    [SELECTED_FIELD]: selectedState[idGetter(item)],
                  }))}
                  dataItemKey={DATA_ITEM_KEY}
                  selectedField={SELECTED_FIELD}
                  skip={page}
                  take={pageSize}
                  total={metaData.totalCount}
                  onPageChange={pageChange}
                  // onRowClick={(e) => {
                  //   navigate(AppRoutes.EDIT_STRORED_DOCUMENT, {
                  //     state: { id: e.dataItem.id },
                  //   });
                  // }}
                  className="pagination-row-cus"
                  pageable={{
                    pageSizes: [15, 20, 30],
                  }}
                  onDataStateChange={dataStateChange}
                  sort={sort}
                  sortable={true}
                  onSortChange={(e) => {
                    setSort(e.sort);
                  }}
                >
                  <GridColumn
                    // columnMenu={columnMenus}
                    field="docName"
                    title="File Name"
                    cell={(props) => {
                      let field = props.dataItem;
                      return (
                        <td
                          className="anchar-pointer text-theme"
                          onClick={() => handleDocumentView(field)}
                        >
                          {field.docName}
                        </td>
                      );
                    }}
                  />
                  <GridColumn
                    title="File Tags"
                    cell={(props) => {
                      let field = props.dataItem.id;
                      let tagsArry = props.dataItem.clientDocumentTags;
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
                            permissionEnum.MANAGE_CLIENT_FILES
                          ] && (
                            <Chip
                              text="Add"
                              value="chip"
                              icon={"k-icon k-i-plus k-icon-64"}
                              rounded={"large"}
                              fillMode={"solid"}
                              size={"medium"}
                              onClick={() => handleAddTags(field)}
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
                    title="Date Uploaded"
                    cell={(props) => {
                      let field = moment
                        .utc(props.dataItem.utcDateCreated)
                        .local()
                        .format("M/D/YYYY HH:mm A");
                      return <td className="cursor-default">{field}</td>;
                    }}
                  />

                  {userAccessPermission[permissionEnum.MANAGE_CLIENT_FILES] && (
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
                    title="Stored Documnet"
                    message="stored document"
                    handleDelete={deleteStoredDocument}
                  />
                )}

                {openClientTags && (
                  <AssignClientTags onClose={handleCloseTags} docId={docId} />
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
