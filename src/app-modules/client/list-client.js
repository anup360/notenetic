/**
 * App.js Layout Start Here
 */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { NotificationManager } from "react-notifications";
import AppRoutes from "../../helper/app-routes";
import {
  SELECTED_CLIENT_ID,
  SELECTED_CLIENT_FILTER,
  IS_GLOBAL_SEARCH,
} from "../../actions";
import { Grid, GridColumn, getSelectedState } from "@progress/kendo-react-grid";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@progress/kendo-react-inputs";
import addIcon from "../../assets/images/add.png";
import filterIcon from "../../assets/images/filter.png";
import { getter } from "@progress/kendo-react-common";
import Loading from "../../control-components/loader/loader";
import APP_ROUTES from "../../helper/app-routes";
import { GridColumnMenuSort } from "@progress/kendo-react-grid";
import { Switch } from "@progress/kendo-react-inputs";
import { filterBy, orderBy } from "@progress/kendo-data-query";
import DropDownKendoRct from "../../control-components/drop-down/drop-down";
import InputKendoRct from "../../control-components/input/input";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Tooltip } from "@progress/kendo-react-tooltip";
import { ClientService } from "../../services/clientService";
import NOTIFICATION_MESSAGE from "../../helper/notification-messages";
import moment from "moment";
import useModelScroll from "../../cutomHooks/model-dialouge-scroll";
import { MaskFormatted } from "../../helper/mask-helper";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import useBirthDateCalculor from "../../cutomHooks/birth-date-calculate/birth-date-calculate";
import { Popup } from "@progress/kendo-react-popup";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import { permissionEnum } from "src/helper/permission-helper";
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

const DialougeDeleteClient = ({
  onClose,
  clientDelete,
  clientReActivate,
  isActiveCheck,
}) => {
  return (
    <Dialog
      onClose={onClose}
      title={isActiveCheck == true ? "Reactivate Client" : "Discharge Client"}
      className=""
    >
      <p
        style={{
          margin: "25px",
          textAlign: "center",
        }}
      >
        Are you sure you want to{" "}
        {isActiveCheck == true ? "Reactivate?" : "Delete?"}
      </p>
      <DialogActionsBar>
        <button
          style={{ backgroundColor: "#5951e5" }}
          className="btn btn-primary text-white"
          onClick={isActiveCheck == true ? clientReActivate : clientDelete}
        >
          Yes
        </button>
        <button className="btn btn-secondary text-white" onClick={onClose}>
          No
        </button>
      </DialogActionsBar>
    </Dialog>
  );
};

const ClientList = () => {
  const clinicId = useSelector((state) => state.loggedIn.clinicId);
  const siteId = useSelector((state) => state.getSiteId);
  const defaultSite = useSelector((state) => state.getStaffReducer.defaultSite);
  const siteValue = useSelector((state) => state).getSiteVaue;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [clientData, setClientData] = useState([]);
  const [filter, setFilter] = React.useState(initialFilter);
  const [metaData, setMetaData] = useState([]);
  const [sort, setSort] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const dispatch = useDispatch();
  const [isDeleteConfirm, setDeleteConfirm] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isActiveCheck, setIsActiveCheck] = useState(false);
  const [globalCheckValue, setGobalCheckValue] = useState(true);
  const [modelScroll, setScroll] = useModelScroll();
  const [calculatedAge, handleAge] = useBirthDateCalculor();
  const anchor = React.useRef(null);
  const [show, setShow] = React.useState(false);
  const [itemsToShow, setShowMore] = useState(3);
  const [isICDData, setICDData] = useState([]);
  const userAccessPermission = useSelector(
    (state) => state.userAccessPermission
  );

  // React.useEffect(() => {
  //   setShow(true);
  // }, []);
  const onClick = () => {
    setShow(!show);
  };

  const initialExpanded = isICDData.reduce(
    (acc, cur) => ({ ...acc, [cur.id]: true }),
    {}
  );

  const [expandedModule, setExpandedModule] = React.useState({
    ...initialExpanded,
  });

  const clientLastFilter = useSelector(
    (state) => state.clientLastFilter.filter
  );

  const [fields, setFields] = useState({
    firstNameFilter: "",
    lastNameFilter: "",
    genderFilter: "",
  });
  const [selectedState, setSelectedState] = React.useState({});

  useEffect(() => {
    handleAge(clientData.dob);
    getGender();
    getClientByclinicId();
    if (clientLastFilter) {
      setFields({
        ...fields,
        firstNameFilter:
          clientLastFilter !== null ? clientLastFilter.firstNameFilter : "",
        lastNameFilter:
          clientLastFilter !== null ? clientLastFilter.lastNameFilter : "",
        genderFilter:
          clientLastFilter !== null ? clientLastFilter.genderFilter : "",
      });
    }
  }, [globalCheckValue, siteId, isActiveCheck]);

  const pageChange = (event) => {
    let skip = event.page.skip;
    let take = event.page.take;
    setPage(skip);
    setPageSize(take);
    let newValue = skip / take;
    let finalValue = newValue + 1;

    getClientByclinicId(take, finalValue);
  };

  const getClientByclinicId = async (
    take,
    finalValue,
    value,
    isTrue,
    search,
    isActive = isActiveCheck
  ) => {
    setLoading(true);
    await ClientService.getClients(
      take,
      pageSize,
      clinicId,
      finalValue,
      value ?? fields,
      clientLastFilter,
      isTrue,
      search,
      isActive,
      globalCheckValue,
      siteId,
      defaultSite,
      siteValue
    )
      .then((result) => {
        setClientData(
          result.resultData.map((clientData) => {
            return {
              ...clientData,
              phoneMask: MaskFormatted(clientData.homePhone, "(999) 999-9999"),
            };
          })
        );
        setMetaData(result.metaData);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const clientDelete = async () => {
    setLoading(true);
    await ClientService.clientDelete(selectedClientId)
      .then((result) => {
        NotificationManager.success(NOTIFICATION_MESSAGE.DELETE_CLIENT);
        setLoading(false);
        setDeleteConfirm(!isDeleteConfirm);
        getClientByclinicId();
        setScroll(false);
      })
      .catch((error) => {
        setLoading(false);
        setDeleteConfirm(!isDeleteConfirm);
        renderErrors(error.message);
        setScroll(false);
      });
  };

  const clientReActivate = async () => {
    setLoading(true);
    await ClientService.reActivateClient(selectedClientId)
      .then((result) => {
        NotificationManager.success(NOTIFICATION_MESSAGE.REACTIVATE_CLIENT);
        setLoading(false);
        setDeleteConfirm(!isDeleteConfirm);
        setScroll(false)
        getClientByclinicId();
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const getGender = async () => {
    setLoading(true);
    await ClientService.getGender()
      .then((result) => {
        setLoading(false);
        let genderList = result.resultData;
        if (genderList.length > 0) {
          setGenderData(genderList);
        }
      })
      .catch((error) => {
        renderErrors(error.message);
      });
  };

  const deleteClient = (id) => {
    setDeleteConfirm(true);
    setSelectedClientId(id);
    setScroll(true);
  };

  const handleAddClinet = () => {
    navigate(AppRoutes.ADD_CLIENT);
  };

  const handleRowClick = (field) => {
    if (field.id) {
      let element = field.id;
      dispatch({
        type: SELECTED_CLIENT_ID,
        payload: element,
      });
      dispatch({
        type: IS_GLOBAL_SEARCH,
        payload: false,
      });
      navigate(APP_ROUTES.CLIENT_DASHBOARD);
    }
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

  const columnMenus = (props) => {
    return (
      <div>
        {/* <GridColumnMenuCheckboxFilter
                     {...props}
                     data={clientData}
                     expanded={true}
                     searchBox={() => null}
                 /> */}
        <GridColumnMenuSort {...props} data={clientData} />
      </div>
    );
  };
  const dataStateChange = (event) => {
    setPage(event.dataState.skip);
    setPageSize(event.dataState.take);
    setSort(event.dataState.sort);
  };

  const handleApplyFilter = () => {
    dispatch({
      type: SELECTED_CLIENT_FILTER,
      payload: fields,
    });

    document.getElementById("dropdownMenuButton").click();

    getClientByclinicId();
  };

  const handleClearFilter = () => {
    dispatch({
      type: SELECTED_CLIENT_FILTER,
      payload: null,
    });
    setFields({
      ...fields,
      firstNameFilter: "",
      lastNameFilter: "",
      genderFilter: "",
    });
    getClientByclinicId(
      null,
      null,
      {
        firstNameFilter: "",
        lastNameFilter: "",
        genderFilter: "",
      },
      true,
      null,
      null
    );
    document.getElementById("dropdownMenuButton").click();
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFields({
      ...fields,
      [name]: value,
    });
  };

  const hideConfirmPopup = () => {
    setDeleteConfirm(false);
  };

  const handleDeleteClient = () => {
    setDeleteConfirm(!isDeleteConfirm);
    setScroll(false);
  };

  const handleFilter = (e) => {
    var search = e.target.value;
    setSearchQuery(search);

    if (search === "") {
      getClientByclinicId(null, null, null, null, search, isActiveCheck);
    } else {
      if (search.length > 2) {
        getClientByclinicId(null, null, null, null, search, isActiveCheck);
      }
    }
  };

  const handleSwitch = (e) => {
    var changeVal = e.target.value;
    setIsActiveCheck(changeVal);
    getClientByclinicId(null, null, null, null, changeVal, isActiveCheck);
  };

  const handleGlobalSwitch = (e) => {
    var changeVal = e.target.value;
    setGobalCheckValue(changeVal);
  };

  const showMoreList = (id) => {
    setExpandedModule({ ...expandedModule, [id]: !expandedModule[id] });
  };

  const handleLastSeenClick = (id) => {
    navigate(APP_ROUTES.DOCUMENT_VIEW, {
      state: {
        id: id,
        backRoute: APP_ROUTES.GET_CLIENT,
        isActiveCheck: isActiveCheck,
        // showClinicLogo:showClinicLogo
      },
    });
    window.scrollTo(0, 0);
  };

  return (
    <div className="grid-table  filter-grid">
      <div className="top-bar-show-list">
        <h4 className="address-title text-grey  ml-3">
          <span className="f-24">Clients</span>
        </h4>
        <div className="row align-items-center">
          <div className="col-lg-4">
            <div className="content-search-filter dropdown dropleft col-md-11 px-0 mb-4 mb-md-0">
              <Input
                value={searchQuery}
                onChange={(e) => handleFilter(e)}
                name="searchQuery"
                className="filtersearch"
                placeholder="Type min. 3 chars to search..."
              />
              <span
                className="dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <img src={filterIcon} alt="" className="filter-search" />
              </span>

              <div
                className="dropdown-menu filter-popup dropdown-filter-menu"
                aria-labelledby="dropdownMenuButton"
              >
                <div className="current-popup">
                  <form>
                    <div className="form-group  mb-1 align-items-center">
                      <InputKendoRct
                        validityStyles={false}
                        value={fields.firstNameFilter}
                        onChange={handleChange}
                        name="firstNameFilter"
                        label="First Name"
                      />
                    </div>
                    <div className="form-group mb-1 align-items-center">
                      <InputKendoRct
                        validityStyles={false}
                        value={fields.lastNameFilter}
                        onChange={handleChange}
                        name="lastNameFilter"
                        label="Last Name"
                      />
                    </div>

                    <div className="form-group mb-1 align-items-center gender-dropdown">
                      <DropDownList
                        filterable={true}
                        label="Gender"
                        onChange={handleChange}
                        data={genderData}
                        value={fields.genderFilter}
                        textField="name"
                        name="genderFilter"
                        dataItemKey="id"
                        suggest={true}
                      />
                    </div>

                    <div className="d-flex">
                      <div>
                        <button
                          type="button"
                          className="btn blue-primary m-2"
                          onClick={handleApplyFilter}
                        >
                          Filter
                        </button>
                      </div>
                      <div>
                        <button
                          type="button"
                          className="btn grey-secondary m-2"
                          onClick={handleClearFilter}
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-5 col-sm-9 mt-md-3">
            <div className="switch-on ">
              <Switch
                onChange={handleSwitch}
                checked={isActiveCheck}
                onLabel={""}
                offLabel={""}
                className="switch-on"
              />
              <span className="switch-title-text ml-2 mr-3">
                {" "}
                {isActiveCheck
                  ? "Show Inactive Clients"
                  : "Show Inactive Clients"}
              </span>

              <Switch
                onChange={handleGlobalSwitch}
                checked={globalCheckValue}
                onLabel={""}
                offLabel={""}
                className="switch-on"
              />
              <span className="switch-title-text ml-2">
                Show Global Clients
              </span>
            </div>
          </div>
          <div className="col-lg-3 col-sm-3 ml-auto mt-md-3 mt-sm-2">
            {userAccessPermission[permissionEnum.ADD_CLIENTS] && (
              <button
                onClick={handleAddClinet}
                className="btn blue-primary text-white d-flex align-items-center ml-auto"
              >
                <img src={addIcon} alt="" className="me-2 add-img" />
                Add New Client
              </button>
            )}
          </div>
        </div>
        {/* end */}
      </div>
      {loading && <Loading />}
      <Grid
        data={orderBy(clientData, sort).map((item) => ({
          ...item,
          [SELECTED_FIELD]: selectedState[idGetter(item)],
        }))}
        checkboxElement
        style={{
          height: clientData.length > 0 ? "100%" : "250px",
        }}
        dataItemKey={DATA_ITEM_KEY}
        // selectedField={SELECTED_FIELD}
        skip={page}
        take={pageSize}
        total={metaData.totalCount}
        onPageChange={pageChange}
        // onRowClick={handleRowClick}
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
        // filterable={true}
        // onFilterChange={filterChange}
        filter={filter}
        onDataStateChange={dataStateChange}
        onSelectionChange={onSelectionChange}
        onHeaderSelectionChange={onHeaderSelectionChange}
      >
        {/* <GridNoRecords style={{}}>
          {loading ? <Loading /> : "No data found"}
        </GridNoRecords> */}
        {/* <GridColumn filterable={false} field={SELECTED_FIELD} width="100px" /> */}
        {/* <GridColumn
          className="cursor-default"
          columnMenu={columnMenus}
          field="id"
          title="Client ID"
        /> */}
        <GridColumn
          title="ID"
          width="60px"
          cell={(props) => {
            let field = props?.dataItem?.clientId;
            return (
              <td className="cursor-default" onClick={handleRowClick}>
                {field}
              </td>
            );
          }}
        />
        <GridColumn
          field="fName"
          title="Client"
          // columnMenu={columnMenus}
          cell={(props) => {
            let field = props.dataItem;
            return (
              <td
                className="anchar-pointer text-theme"
                onClick={() => handleRowClick(field)}
              >
                {`${field.lName}, ${field.fName}${
                  field.nickName === "" ? "" : " (" + field.nickName + ")"
                }`}
              </td>
            );
          }}
        />
        {/* <GridColumn
          field="lName"
          title="Last Name"
          columnMenu={columnMenus}
          cell={(props) => {
            let field = props.dataItem;
            return (
              <td
                className="anchar-pointer text-theme"
                onClick={() => handleRowClick(field)}
              >
                {field.lName}
              </td>
            );
          }}
        /> */}
        <GridColumn
          title="DOB"
          width="130px"
          cell={(props) => {
            let field = moment(props.dataItem.dob).format("M/D/YYYY");
            return (
              <td className="cursor-default" onClick={handleRowClick}>
                {field} ({props.dataItem.age})
              </td>
            );
          }}
        />

        <GridColumn
          className="cursor-default"
          width="85px"
          field="gender"
          title="Gender"
        />
        <GridColumn
          className="cursor-default"
          width="80px"
          field="clientStatusName"
          title="Status"
        />
        <GridColumn
          className="cursor-default"
          width="120px"
          field="recordId"
          title="Record #"
        />
        <GridColumn
          title="Primary Ins."
          cell={(props) => {
            let field = props.dataItem.clientInsurance
              ? props.dataItem.clientInsurance
              : "";
            return (
              <td className="cursor-default">
                {field.insuranceName ? field.insuranceName : ""}
              </td>
            );
          }}
        />
        <GridColumn
          title="Policy #"
          cell={(props) => {
            let field = props.dataItem.clientInsurance
              ? props.dataItem.clientInsurance
              : "";
            return (
              <td className="cursor-default">
                {field.policyNumber ? field.policyNumber : ""}
              </td>
            );
          }}
        />
        <GridColumn
          title="Start Date"
          width="100px"
          cell={(props) => {
            let field =
              props.dataItem.dateStart == null
                ? ""
                : moment(props.dataItem.dateStart).format("M/D/YYYY");
            return (
              <td className="cursor-default" onClick={handleRowClick}>
                {field}
              </td>
            );
          }}
        />
        {/* <GridColumn
          className="cursor-default"
          columnMenu={columnMenus}
          field="phoneMask"
          title="Phone"
        /> */}
        {/* <GridColumn
          columnMenu={columnMenus}
          cell={(props) => {
            let field = props.dataItem.ssn;
            const lastFour = String(field).slice(-4);
            return (
              <td className="cursor-default">
                {" "}
                {field ? "***-**-" + lastFour : ""}
              </td>
            );
          }}
          title="SSN"
        /> */}

        <GridColumn
          title="Dx"
          cell={(props) => {
            let field = props.dataItem.clientDiagnosis;
            let arry = field.slice(
              0,
              expandedModule[props.dataItem.id] ? field.length : itemsToShow
            );
            setICDData(field);
            return (
              <td>
                <ul>
                  {arry.length > 0 &&
                    arry.map((obj, i) => (
                      <>
                        <li className="mb-0" key={i}>
                          {obj.icd10}
                          {field.length > 3 && arry.at(-1).id == obj?.id && (
                            <span
                              className="plus-click  ml-2 cursor-pointer"
                              onMouseEnter={() => {
                                showMoreList(props.dataItem.id);
                              }}
                            >
                              {expandedModule[props.dataItem.id] ? (
                                <i className="fa fa-minus "></i>
                              ) : (
                                <i className="fa fa-plus"></i>
                              )}
                            </span>
                          )}
                        </li>
                      </>
                    ))}
                </ul>
              </td>
            );
          }}
        />
        <GridColumn
          title="Last Seen"
          cell={(props) => {
            let field =
              props?.dataItem?.clientLastSeen == null
                ? ""
                : props?.dataItem?.clientLastSeen;
            let clientLastDocumentInfo =
              props?.dataItem?.clientLastDocumentInfo == null
                ? ""
                : props?.dataItem?.clientLastDocumentInfo;
            return (
              <td
                onClick={() =>
                  handleLastSeenClick(clientLastDocumentInfo.documentId)
                }
              >
                {field && (
                  <Menu
                    style={{ marginLeft: -21 }}
                    hoverOpenDelay={0}
                    hoverCloseDelay={200}
                  >
                    <MenuItem text={field}>
                      <MenuItem
                        disabled
                        text={clientLastDocumentInfo?.templateName}
                      ></MenuItem>
                      <MenuItem
                        disabled
                        text={clientLastDocumentInfo.staffName}
                      ></MenuItem>
                      <MenuItem
                        disabled
                        text={
                          clientLastDocumentInfo?.serviceDate == null
                            ? ""
                            : moment(
                                clientLastDocumentInfo?.serviceDate
                              ).format("M/D/YYYY")
                        }
                      />
                    </MenuItem>
                  </Menu>
                )}
                {/* <div className="dropdown">
                <td className="dropbtn dropdown">{field}</td>
                <div className="dropdown-content">
                  {!clientLastDocumentInfo && "No Record found"}
                <p className="ml-2 mt-2">{clientLastDocumentInfo?.serviceDate== null ? "" : moment(clientLastDocumentInfo?.serviceDate).format("M/D/YYYY")}</p>
                  <p className="ml-2">{clientLastDocumentInfo?.templateName}</p>
                  <p className="ml-2">{clientLastDocumentInfo.staffName}</p>
                </div>
              </div> */}
              </td>
            );
          }}
        />

        {globalCheckValue && (
          <GridColumn
            title="Site"
            width="100px"
            cell={(props) => {
              let field = props.dataItem.clientSites;
              let arry = field.slice(
                0,
                expandedModule[props.dataItem.id] ? field.length : itemsToShow
              );
              setICDData(field);
              return (
                <td>
                  <ul style={{ marginLeft: -20 }}>
                    {arry.length > 0 &&
                      arry.map((obj, i) => (
                        <>
                          <li className="mb-0 cursor-default" key={i}>
                            {obj.name}
                            {field.length > 3 &&
                              arry.at(-1).name == obj?.name && (
                                <span
                                  className="plus-click  ml-2 cursor-pointer"
                                  onMouseEnter={() => {
                                    showMoreList(props.dataItem.name);
                                  }}
                                >
                                  {expandedModule[props.dataItem.name] ? (
                                    <i className="fa fa-minus "></i>
                                  ) : (
                                    <i className="fa fa-plus"></i>
                                  )}
                                </span>
                              )}
                          </li>
                        </>
                      ))}
                  </ul>
                </td>
              );
            }}
          />
        )}

        {/* <GridColumn
          title="Client Sites"
          cell={(props) => {
            let field = props.dataItem.clientSites;
            let arry = field.slice(
              0,
              expandedModule[props.dataItem.id] ? field.length : itemsToShow
            );
            setICDData(field);

            return (
              <td className="cursor-default" style={{ width: "169px" }}>
                <ul>
                  {arry.length > 0 &&
                    arry.map((obj, i) => (
                      <>
                        <li className="mb-0" key={i}>
                          {obj.name}
                          {field.length > 3 && arry.at(-1).id == obj?.id && (
                            <span
                              className="plus-click  ml-2 "
                              onClick={() => {
                                showMoreList(props.dataItem.id);
                              }}
                            >
                              {expandedModule[props.dataItem.id] ? (
                                <i className="fa fa-minus "></i>
                              ) : (
                                <i className="fa fa-plus"></i>
                              )}
                            </span>
                          )}
                        </li>
                      </>
                    ))}
                </ul>
              </td>
            );
          }}
        /> */}

        {userAccessPermission[permissionEnum.DISCHARGE_REACTIVATE_CLIENT] && (
          <GridColumn
            title="Action"
            filterable={false}
            className="cursor-default"
            cell={(props) => {
              let field = props.dataItem.id;
              return (
                <td style={{ width: "60px" }}>
                  <div
                    // className="k-chip k-chip-md k-rounded-md k-chip-solid k-chip-solid-base"
                    onClick={() => deleteClient(field)}
                  >
                    <div className="k-chip-content">
                      <Tooltip anchorElement="target" position="top">
                        <i
                          className={
                            isActiveCheck == true
                              ? "fa fa-rotate-left"
                              : "fa fa-trash"
                          }
                          aria-hidden="true"
                          title={
                            isActiveCheck == true ? "Reactivate" : "Delete"
                          }
                        ></i>
                      </Tooltip>
                    </div>
                  </div>
                </td>
              );
            }}
          />
        )}
      </Grid>

      {isDeleteConfirm && (
        <DialougeDeleteClient
          onClose={handleDeleteClient}
          clientDelete={clientDelete}
          clientReActivate={clientReActivate}
          isActiveCheck={isActiveCheck}
        />
      )}
    </div>
  );
};
export default ClientList;
