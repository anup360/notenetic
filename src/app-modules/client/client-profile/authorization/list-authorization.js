import React, { useEffect, useState } from "react";
import Loader from "../../../../control-components/loader/loader";
import CustomDrawer from "../../../../control-components/custom-drawer/custom-drawer";
import ClientHeader from "../client-header/client-header";
import {
  Grid,
  GridColumn,
  getSelectedState,
  GridToolbar,
  GridNoRecords,
} from "@progress/kendo-react-grid";
import { useSelector } from "react-redux";
import { NotificationManager } from "react-notifications";
import moment from "moment";
import { useNavigate } from "react-router";
import APP_ROUTES from "../../../../helper/app-routes";
import { ClientService } from "../../../../services/clientService";
import { getter } from "@progress/kendo-react-common";
import { GridColumnMenuSort } from "@progress/kendo-react-grid";
import { orderBy } from "@progress/kendo-data-query";
import addIcon from "../../../../assets/images/add.png";
import { Tooltip } from "@progress/kendo-react-tooltip";
import DeleteDialogModal from "../../../../control-components/custom-delete-dialog-box/delete-dialog";
import useModelScroll from "../../../../cutomHooks/model-dialouge-scroll";
import { permissionEnum } from "../../../../helper/permission-helper";
import { renderErrors } from "src/helper/error-message-helper";

const DATA_ITEM_KEY = "id";
const SELECTED_FIELD = "selected";
const idGetter = getter(DATA_ITEM_KEY);

const initialFilter = {
  logic: "and",
  filters: [
    {
      field: "fName",
      operator: "contains",
      value: "",
    },
  ],
};

const ListAuthrization = () => {
  const navigate = useNavigate();
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = React.useState(initialFilter);
  const [authorizations, setAuthorizations] = useState([]);
  const [sort, setSort] = useState([]);
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [selectedState, setSelectedState] = React.useState({});
  const [isDeleteConfirm, setDeleteConfirm] = useState(false);
  const [selectedAuthId, setSelectedAuthId] = useState("");
  const [metaData, setMetaData] = useState({});
  const [modelScroll, setScroll] = useModelScroll();
  const userAccessPermission = useSelector(
    (state) => state.userAccessPermission
  );

  const [itemsToShow, setShowMore] = useState(3);
  const [serviceData, setServiceData] = useState([]);

  const initialExpanded = serviceData.reduce(
    (acc, cur) => ({ ...acc, [cur.id]: true }),
    {}
  );

  const [expandedModule, setExpandedModule] = React.useState({
    ...initialExpanded,
  });

  useEffect(() => {
    geTreatmentAuthByClientId();
  }, [selectedClientId]);

  const handleAddAuthorization = () => {
    navigate(APP_ROUTES.AUTHORIZATION_ADD);
  };

  const pageChange = (event) => {
    let skip = event.page.skip;
    let take = event.page.take;
    setPage(skip);
    setPageSize(take);
    let newValue = skip / take;
    let finalValue = newValue + 1;
    geTreatmentAuthByClientId(take, finalValue);
  };

  const geTreatmentAuthByClientId = async (take, finalValue) => {
    setLoading(true);
    await ClientService.getAuthByClientId(
      take,
      pageSize,
      finalValue,
      selectedClientId
    )
      .then((result) => {
        let list = result.resultData;
        setAuthorizations(list);
        setMetaData(result.metaData);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };
  const dataStateChange = (event) => {
    setPage(event.dataState.skip);
    setPageSize(event.dataState.take);
    setSort(event.dataState.sort);
  };

  const columnMenus = (props) => {
    return (
      <div>
        <GridColumnMenuSort {...props} data={authorizations} />
      </div>
    );
  };

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
  const handleDeleteAuth = () => {
    setDeleteConfirm(!isDeleteConfirm);
    setScroll(false);
  };
  const authDelete = async () => {
    setLoading(true);
    await ClientService.authorizationDelete(selectedAuthId)
      .then((result) => {
        NotificationManager.success("Authorization deleted successfully.");
        setLoading(false);
        setDeleteConfirm(!isDeleteConfirm);
        geTreatmentAuthByClientId();
        setScroll(false);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const deleteAuth = (id) => {
    setDeleteConfirm(true);
    setSelectedAuthId(id);
    setScroll(true);
  };

  const editAuth = (id) => {
    setSelectedAuthId(id);
    navigate(APP_ROUTES.AUTHORIZATION_EDIT, {
      state: { selectedAuthorization: id },
    });
  };

  const showMoreList = (id) => {
    setExpandedModule({ ...expandedModule, [id]: !expandedModule[id] });
  };

  return (
    <div className="grid-table  filter-grid">
      <div className="d-flex flex-wrap">
        <div className="inner-dt col-md-3 col-lg-2">
          <CustomDrawer />
        </div>
        <div className="col-md-9 col-lg-10">
          <div className="staff-profile-page">
            <ClientHeader />
            <div className="upload-sign-file pt_30">
              <div className="d-flex justify-content-between mb-3 ">
                <h4 className="address-title text-grey ">
                  <span className="f-24">Authorizations</span>
                </h4>
                {userAccessPermission[permissionEnum.MANAGE_AUTHORIZATIONS] && (
                  <button
                    onClick={handleAddAuthorization}
                    className="btn blue-primary text-white text-decoration-none d-flex align-items-center "
                  >
                    <img src={addIcon} alt="" className="me-2 add-img" />
                    Add Authorization{" "}
                  </button>
                )}
              </div>
            </div>
            {loading === true && <Loader />}
            {authorizations.length == 0 && !loading ? (
              <div className="message-not-found mt-3">
                No Authorizations Available
              </div>
            ) : (
              <div className="client-accept">
                <div className="address-line-content mt-3  table-heading-auth">
                  <Grid
                    data={orderBy(authorizations, sort).map((item) => ({
                      ...item,
                      [SELECTED_FIELD]: selectedState[idGetter(item)],
                    }))}
                    style={{
                      height: authorizations.length > 0 ? "100%" : "250px",
                    }}
                    dataItemKey={DATA_ITEM_KEY}
                    selectedField={SELECTED_FIELD}
                    skip={page}
                    take={pageSize}
                    total={metaData.totalCount}
                    onPageChange={pageChange}
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
                    onDataStateChange={dataStateChange}
                    onSelectionChange={onSelectionChange}
                    onHeaderSelectionChange={onHeaderSelectionChange}
                  >
                    <GridColumn
                      className=""
                      title="Services"
                      cell={(props) => {
                        let field = props.dataItem.serviceIds;
                        setServiceData(field);
                        return (
                          <td className="cursor-default ">
                            {field
                              .slice(
                                0,
                                expandedModule[props.dataItem.id]
                                  ? field.length
                                  : itemsToShow
                              )
                              .map((obj, i) => (
                                <ul>
                                  <li key={i}>{obj.name}</li>
                                </ul>
                              ))}
                            {field.length > 3 && (
                              <a
                                onClick={() => {
                                  showMoreList(props.dataItem.id);
                                }}
                              >
                                {expandedModule[props.dataItem.id] ? (
                                  <i className="fa fa-minus"></i>
                                ) : (
                                  <i className="fa fa-plus"></i>
                                )}
                              </a>
                            )}
                          </td>
                        );
                      }}
                    />

                    <GridColumn
                      title="Eff. Date"
                      width="100px"
                      cell={(props) => {
                        let field = moment(props.dataItem.effectiveDate).format(
                          "M/D/YYYY"
                        );
                        return <td>{field}</td>;
                      }}
                    />
                    <GridColumn
                      width="100px"
                      title="End Date"
                      cell={(props) => {
                        let field = moment(props.dataItem.endDate).format(
                          "M/D/YYYY"
                        );
                        return <td>{field}</td>;
                      }}
                    />
                    <GridColumn
                      width="100px"
                      title="Auth Date"
                      cell={(props) => {
                        let field = moment(props.dataItem.dateAuth).format(
                          "M/D/YYYY"
                        );
                        return <td>{field}</td>;
                      }}
                    />
                    <GridColumn
                      width="100px"
                      field="authStatus"
                      title="Status"
                    />
                    <GridColumn
                      width="100px"
                      field="numUnits"
                      title="Tot. Units"
                    />
                    <GridColumn
                      width="100px"
                      field="totalUnitsUsed"
                      title="Used"
                    />
                    <GridColumn
                      width="100px"
                      field="remainingUnits"
                      title="Remaining"
                    />
                    <GridColumn
                      width="100px"
                      title="Enforce?"
                      className="cursor-default"
                      cell={(props) => {
                        let field = props.dataItem.isEnforceValidation;
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
                    />

                    <GridColumn
                      className="cursor-default"
                      width="100px"
                      field="Frequency"
                      cell={(props) => {
                        let field = props.dataItem;
                        return (
                          <td>
                            {field.freqNumUnits ||
                            (field.frequency && field?.freqNumUnits != 0) ? (
                              <>
                                {/* <p className="mb-0"> */}
                                {/* <b>FreqNumUnits</b>:{" "} */}
                                {field.freqNumUnits === null
                                  ? ""
                                  : field.freqNumUnits}
                                /
                                {field.frequency === null
                                  ? ""
                                  : field.frequency}
                                {/* </p> */}
                                {/* <p className="mb-0"> */}
                                {/* <b>Frequency</b>:{" "} */}
                                {/* </p> */}
                              </>
                            ) : (
                              ""
                            )}
                          </td>
                        );
                      }}
                    />
                    <GridColumn
                      width="100px"
                      title="Req. Date"
                      cell={(props) => {
                        let field = moment(props.dataItem.dateSubmitted).format(
                          "M/D/YYYY"
                        );
                        return <td>{field}</td>;
                      }}
                    />

                    <GridColumn
                      width="100px"
                      // columnMenu={columnMenus}
                      field="submittedByStaffName"
                      title="Sub. By"
                    />

                    {userAccessPermission[
                      permissionEnum.MANAGE_AUTHORIZATIONS
                    ] && (
                      <GridColumn
                        title="Action"
                        filterable={false}
                        cell={(props) => {
                          let field = props.dataItem.id;
                          return (
                            <td>
                              <div className="row-3">
                                <div
                                  className="k-chip k-chip-md k-rounded-md k-chip-solid k-chip-solid-base"
                                  onClick={() => deleteAuth(field)}
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
                                <div
                                  className="k-chip k-chip-md k-rounded-md k-chip-solid k-chip-solid-base m-2"
                                  onClick={() => editAuth(field)}
                                >
                                  <div className="k-chip-content">
                                    <Tooltip
                                      anchorElement="target"
                                      position="top"
                                    >
                                      <i
                                        className="fas fa-edit"
                                        title="Edit"
                                      ></i>
                                    </Tooltip>
                                  </div>
                                </div>
                              </div>
                              {/* <span className='k-icon k-i-delete text-danger' onClick={() => deleteAuth(field)} />
                          <span style={{ marginLeft: '20px' }} className='k-icon k-i-edit' onClick={() => editAuth(field)} /> */}
                            </td>
                          );
                        }}
                      />
                    )}
                  </Grid>
                  {isDeleteConfirm && (
                    <DeleteDialogModal
                      onClose={handleDeleteAuth}
                      title="Authorization"
                      message="authorization"
                      handleDelete={authDelete}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListAuthrization;
