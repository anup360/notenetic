import React, { useEffect, useState } from "react";
import Loader from "../../../control-components/loader/loader";
import { Grid, GridColumn, getSelectedState } from "@progress/kendo-react-grid";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { NotificationManager } from "react-notifications";
import moment from "moment";
import { useNavigate } from "react-router";
import APP_ROUTES from "../../../helper/app-routes";
import { ClientService } from "../../../services/clientService";
import { getter } from "@progress/kendo-react-common";
import { GridColumnMenuSort } from "@progress/kendo-react-grid";
import { orderBy } from "@progress/kendo-data-query";
import addIcon from "../../../assets/images/add.png";
import { Tooltip } from "@progress/kendo-react-tooltip";
import DeleteDialogModal from "../../../control-components/custom-delete-dialog-box/delete-dialog";
import useModelScroll from "../../../cutomHooks/model-dialouge-scroll";
import { useDispatch } from "react-redux";
import { SELECTED_CLIENT_ID, SELECTED_STAFF_ID } from "../../../actions";
import { renderErrors } from "src/helper/error-message-helper";

import ApiHelper from "../../../helper/api-helper";
import ApiUrls from "../../../helper/api-urls";
import DatePickerKendoRct from "../../../control-components/date-picker/date-picker";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { filterBy } from "@progress/kendo-data-query";
import { showError } from "../../../util/utility";
import { GET_DOCUMENT_FILTER } from "../../../actions";
import ErrorHelper from "../../../helper/error-helper";
import ValidationHelper from "../../../helper/validation-helper";
import { ConversationList } from "twilio/lib/rest/conversations/v1/conversation";
import { flushSync } from "react-dom";

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

const ServiceAuthrization = () => {
  const vHelper = ValidationHelper();
  const latestDataRef = useRef(null);
  const siteId = useSelector((state) => state.getSiteId);
  const dispatch = useDispatch();
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
  const [itemsToShow, setShowMore] = useState(3);
  const [serviceData, setServiceData] = useState([]);
  const [openDateFilter, setOpenDateFilter] = useState(false);
  const [staffError, setStaffError] = useState(false);
  const [errors, setErrors] = useState("");
  const [clientFilter, setClientFilter] = useState(false);
  const [patientList, setPatientList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [staffFilter, setStaffFilter] = useState(false);

  function subtractDays(numOfDays, date = new Date()) {
    const dateCopy = new Date(date.getTime());
    dateCopy.setDate(dateCopy.getDate() - numOfDays);
    return dateCopy;
  }

  const date = new Date();
  const result = subtractDays(7, date);

  const [fields, setFields] = useState({
    filterByStaffId: "",
    startDate: result,
    endDate: date,
    filterByClientId: "",
  });

  const initialExpanded = serviceData.reduce(
    (acc, cur) => ({ ...acc, [cur.id]: true }),
    {}
  );

  const [expandedModule, setExpandedModule] = React.useState({
    ...initialExpanded,
  });

  useEffect(() => {
    fetchPatientList();
    fetchStaffList();
    filterAuth();
  }, []);

  useEffect(() => {
    if (fields.filterByStaffId || fields.filterByClientId || siteId) {
      filterAuth();
    }
  }, [fields.filterByStaffId, fields.filterByClientId, siteId]);

  const handleAddAuthorization = () => {
    dispatch({
      type: SELECTED_CLIENT_ID,
      payload: null,
    });
    navigate(APP_ROUTES.ADD_MULTIPLE_CLIENT_AUTH);
  };

  function fetchPatientList() {
    setLoading({ patientList: true });
    ApiHelper.getRequest(ApiUrls.GET_CLIENT_DDL_BY_CLINIC_ID)
      .then((result) => {
        const list = result.resultData.map((r) => {
          return { id: r.clientId, name: r.clientName };
        });
        setPatientList(list);
      })
      .catch((err) => {
        showError(err, "Patient List");
      })
      .finally(() => {
        setLoading({ patientList: false });
      });
  }

  function fetchStaffList() {
    setLoading({ staffList: true });
    ApiHelper.getRequest(ApiUrls.GET_STAFF_DDL_BY_CLINIC_ID)
      .then((result) => {
        const list = result.resultData.map((r) => {
          return { id: r.id, name: r.name };
        });
        setStaffList(list);
      })
      .catch((err) => {
        showError(err, "Staff List");
      })
      .finally(() => {
        setLoading({ staffList: false });
      });
  }

  const pageChange = (event) => {
    let skip = event.page.skip;
    let take = event.page.take;
    setPage(skip);
    setPageSize(take);
    let newValue = skip / take;
    let finalValue = newValue + 1;
    filterAuth(take, finalValue);
    window.scrollTo(0, 0);
  };

  function onFilterChange(event, listName) {
    setFilter({ ...filter, [listName]: event.filter });
  }

  const filterAuth = (take, finalValue) => {
    setLoading(true);
    const data = {
      siteId: siteId.id,
      filterByClientId:
        fields.filterByClientId === "" ? null : fields.filterByClientId.id,
      filterByStaffId:
        fields.filterByStaffId === "" ? 0 : fields.filterByStaffId.id,
      startDate: fields.startDate,
      endDate: fields.endDate,
      orderBy: "",
      currentPage: finalValue ? finalValue : 1,
      pageSize: take == null ? pageSize : take,
    };
    ApiHelper.postRequest(ApiUrls.GET_AUTH_BY_CLINIC, data)
      .then((result) => {
        setLoading(false);
        setOpenDateFilter(false);
        setAuthorizations(result.resultData);
        setMetaData(result.metaData);
      })
      .catch((error) => {
        setLoading(false);
        setOpenDateFilter(false);
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
    dispatch({
      type: SELECTED_CLIENT_ID,
      payload: null,
    });
    setSelectedAuthId(id);
    navigate(APP_ROUTES.EDIT_MULTIPLE_CLIENT_AUTH, {
      state: { selectedAuthorization: id },
    });
  };

  const showMoreList = (id) => {
    setExpandedModule({ ...expandedModule, [id]: !expandedModule[id] });
  };

  const handleClientClick = (field) => {
    if (field.clientId) {
      let element = field.clientId;
      dispatch({
        type: SELECTED_CLIENT_ID,
        payload: element,
      });
      navigate(APP_ROUTES.CLIENT_DASHBOARD);
    }
  };

  const handleStaffClick = (field) => {
    if (field.staffId) {
      let element = field.staffId;
      dispatch({
        type: SELECTED_STAFF_ID,
        payload: element,
      });
      navigate(APP_ROUTES.STAFF_PROFILE);
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    latestDataRef.current = value;
    if (value == "" && (name === "startDate" || name === "endDate")) {
      value = null;
    }
    const newAdvSearchFileds = {
      ...fields,
      [name]: value,
    };
    // flushSync(() => {setFields(newAdvSearchFileds)})
    setFields(newAdvSearchFileds);
    //   if(name === "startDate" || name === "endDate"){
    //   }
    //   else{
    // filterAuth()
    //   }
  };

  const clearAllFilter = () => {
    setFields({
      ...fields,
      startDate: result,
      endDate: date,
      filterByClientId: "",
      filterByStaffId: "",
    });
    filterAuth();
  };

  const handleClearClient = () => {
    setClientFilter(false);
    setFields({
      ...fields,
      filterByClientId: "",
    });
  };
  const handleClearStaff = () => {
    setStaffFilter(false);
    setFields({
      ...fields,
      filterByStaffId: "",
    });
  };

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;
    if (!fields.startDate) {
      formIsValid = false;
      errors["startDate"] = ErrorHelper.POSITION_EFFECTIVE;
    } else if (fields.startDate && fields.endDate) {
      let error = vHelper.startDateGreaterThanValidator(
        fields.startDate,
        fields.endDate,
        "startDate",
        "endDate"
      );
      if (error && error.length > 0) {
        errors["startDate"] = error;
        formIsValid = false;
      }
    }
    setErrors(errors);
    return formIsValid;
  };

  const handleApplyFilter = (event) => {
    setStaffError(true);
    if (handleValidation()) {
      filterAuth();
    }
  };

  function renderToItem(li, itemProps) {
    const itemChildren = (
      <span>
        <input
          type="checkbox"
          name={itemProps.dataItem}
          checked={itemProps.selected}
          onChange={(e) => itemProps.onClick(itemProps.index, e)}
        />
        &nbsp;{li.props.children}
      </span>
    );
    return React.cloneElement(li, li.props, itemChildren);
  }

  return (
    <div className="grid-table  filter-grid">
      {loading === true && <Loader style={{ top: "10%" }} />}
      <div className="d-flex flex-wrap">
        <div className="col-md-9 col-lg-12">
          <div className="staff-profile-page">
            <div className="upload-sign-file pt_30">
              <div className="d-flex justify-content-between mb-3 ">
                <h4 className="address-title text-grey ">
                  <span className="f-24">Authorizations</span>
                </h4>
                <button
                  onClick={handleAddAuthorization}
                  className="btn blue-primary text-white text-decoration-none d-flex align-items-center "
                >
                  <img src={addIcon} alt="" className="me-2 add-img" />
                  Add New Auth{" "}
                </button>
              </div>
            </div>
            <hr className="hr-spacing mt-2"></hr>
            <div className="row align-items-center">
              <div className="col-lg-9 col-sm-12">
                <div className="content-search-filter  px-0 filter-drop-down">
                  {/*start click major filter */}
                  <div className="major-filter">
                    <div
                      onClick={() => setOpenDateFilter(true)}
                      onMouseLeave={() => setOpenDateFilter(false)}
                      className="service-main dropdown email-filter border-dashed-cus position-relative"
                    >
                      <button className="btn  btn-size-cus " type="button">
                        Authorization Date{" "}
                        <span className="border-spann">
                          {moment(fields?.startDate).format("MM/DD/yyyy") +
                            " - " +
                            moment(fields?.endDate).format("MM/DD/yyyy")}
                        </span>
                      </button>

                      {openDateFilter && (
                        <div className="dropdown-service ">
                          <div className="row">
                            <div className="col-md-6">
                              <DatePickerKendoRct
                                validityStyles={staffError}
                                value={
                                  fields.startDate ? fields.startDate : null
                                }
                                onChange={handleChange}
                                name="startDate"
                                label="Start Date"
                                placeholder="Start Date"
                                error={errors.startDate}
                                required={true}
                              />
                            </div>
                            <div className="col-6">
                              <DatePickerKendoRct
                                validityStyles={staffError}
                                value={fields.endDate ? fields.endDate : null}
                                onChange={handleChange}
                                name="endDate"
                                label="End Date"
                                placeholder="End Date"
                                error={errors.endDate}
                                required={true}
                              />
                            </div>
                          </div>

                          <div className="row mt-2">
                            <div className="col-12">
                              <div className="text-center apply-search-btn">
                                <button onClick={handleApplyFilter} type="btn">
                                  Apply
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* create click2 start */}

                    <div
                      onClick={() => setClientFilter(true)}
                      className="dropdown email-filter border-dashed-cus"
                      onMouseLeave={() => setClientFilter(false)}
                    >
                      {fields?.filterByClientId.length !== 0 && (
                        <i
                          onClick={handleClearClient}
                          style={{ cursor: "pointer" }}
                          className={"fa fa-times cross-icon dropdown-toggle"}
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                        />
                      )}
                      {fields?.filterByClientId.length == 0 && (
                        <i
                          onClick={() => setClientFilter(true)}
                          style={{ cursor: "pointer" }}
                          className={"fa fa-plus cross-icon dropdown-toggle"}
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        ></i>
                      )}

                      <button
                        className="btn dropdown-toggle btn-size-cus"
                        style={{ cursor: "pointer" }}
                        type="button"
                        id="dropdownMenuButton"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        Client
                        {fields?.filterByClientId.length !== 0 && (
                          <span
                            className={
                              fields?.filterByClientId.length !== 0 &&
                              "border-spann"
                            }
                          >
                            {fields?.filterByClientId.name +
                              (fields?.filterByClientId.length > 1
                                ? " (+" + +")"
                                : "")}
                          </span>
                        )}
                      </button>

                      <div
                        className="dropdown-menu"
                        aria-labelledby="dropdownMenuButton"
                      >
                        <div className="row">
                          <div className="col-12">
                            <form>
                              <div className="row pl-2">
                                <DropDownList
                                  data={filterBy(
                                    patientList,
                                    filter.patientList
                                  )}
                                  onFilterChange={(event) => {
                                    onFilterChange(event, "patientList");
                                  }}
                                  textField="name"
                                  label="Client Name"
                                  name="filterByClientId"
                                  value={fields.filterByClientId}
                                  onChange={handleChange}
                                  autoClose={true}
                                  dataItemKey={"id"}
                                  // itemRender={renderToItem}
                                  filterable={true}
                                />
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      onClick={() => setStaffFilter(true)}
                      className="dropdown email-filter border-dashed-cus"
                      onmouseleave={() => setStaffFilter(false)}
                    >
                      {fields?.filterByStaffId.length !== 0 && (
                        <i
                          onClick={handleClearStaff}
                          className={"fa fa-times cross-icon dropdown-toggle"}
                          style={{ cursor: "pointer" }}
                        ></i>
                      )}
                      {fields?.filterByStaffId.length == 0 && (
                        <i
                          onClick={() => setStaffFilter(true)}
                          className={"fa fa-plus cross-icon dropdown-toggle"}
                          style={{ cursor: "pointer" }}
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        ></i>
                      )}
                      <button
                        className="btn dropdown-toggle btn-size-cus"
                        style={{ cursor: "pointer" }}
                        type="button"
                        id="dropdownMenuButton"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        Staff
                        {fields?.filterByStaffId.length !== 0 && (
                          <span
                            className={
                              fields?.filterByStaffId.length !== 0 &&
                              "border-spann"
                            }
                          >
                            {fields?.filterByStaffId.name +
                              (fields?.filterByStaffId.length > 1
                                ? " (+" + +")"
                                : "")}
                          </span>
                        )}
                      </button>
                      <div
                        className="dropdown-menu"
                        aria-labelledby="dropdownMenuButton"
                      >
                        <div className="row">
                          <div className="col-12">
                            <form>
                              <div className="row">
                                <DropDownList
                                  data={filterBy(staffList, filter.staffList)}
                                  onFilterChange={(event) => {
                                    onFilterChange(event, "staffList");
                                  }}
                                  textField="name"
                                  label="Staff Name"
                                  name="filterByStaffId"
                                  value={fields?.filterByStaffId}
                                  onChange={handleChange}
                                  autoClose={true}
                                  dataItemKey={"id"}
                                  // itemRender={renderToItem}
                                  suggest={true}
                                  filterable={true}
                                />
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* create click2  end*/}
                  {/* end click filter */}
                </div>
              </div>
              <div className="col-lg-3 col-sm-12 d-flex justify-content-end clear-add-filter">
                <div className="mr-3">
                  <p className="mb-0" onClick={clearAllFilter}>
                    Clear Filter
                  </p>
                </div>
              </div>
            </div>
            <hr className="hr-spacing mt-2"></hr>
            {authorizations.length == 0 && loading ? (
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
                      field="clientName"
                      width="150px"
                      title="Client"
                      columnMenu={columnMenus}
                      cell={(props) => {
                        let field = props.dataItem;
                        return (
                          <td
                            className="anchar-pointer text-theme"
                            onClick={() => handleClientClick(field)}
                          >
                            {field.clientName}
                          </td>
                        );
                      }}
                    />
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
                      // columnMenu={columnMenus}
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
                      field="isActive"
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
                            {field.freqNumUnits > 0 && field.frequency ? (
                              <>
                                {field.freqNumUnits === null
                                  ? ""
                                  : field.freqNumUnits}
                                /
                                {field.frequency === null
                                  ? ""
                                  : field.frequency}
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
                      field="submittedByStaffName"
                      title="Sub. By"
                      width="100px"
                      cell={(props) => {
                        let field = props.dataItem;
                        return (
                          <td
                            className="anchar-pointer text-theme"
                            onClick={() => handleStaffClick(field)}
                          >
                            {field.submittedByStaffName}
                          </td>
                        );
                      }}
                    />
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
                                    <i className="fas fa-edit" title="Edit"></i>
                                  </Tooltip>
                                </div>
                              </div>
                            </div>
                          </td>
                        );
                      }}
                    />
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

export default ServiceAuthrization;
