import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { NotificationManager } from "react-notifications";
import { getter } from "@progress/kendo-react-common";
import ApiUrls from "../../helper/api-urls";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { SELECTED_SERVICE_ID } from "../../actions";
import AppRoutes from "../../helper/app-routes";
import ApiHelper from "../../helper/api-helper";
import { Input } from "@progress/kendo-react-inputs";
import addIcon from "../../assets/images/add.png";
import { useDispatch, useSelector } from "react-redux";
import APP_ROUTES from "../../helper/app-routes";
import searchIcon from "../../assets/images/search.png";
import Loading from "../../control-components/loader/loader";
import { orderBy } from "@progress/kendo-data-query";
import { Tooltip } from "@progress/kendo-react-tooltip";
import { Encrption } from "../encrption";
import moment from "moment";
import { Switch } from "@progress/kendo-react-inputs";
import { useRef } from "react";
import DeleteDialogModal from "../../control-components/custom-delete-dialog-box/delete-dialog";
import useModelScroll from "../../cutomHooks/model-dialouge-scroll";
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

const ServicesList = () => {
  const clinicId = useSelector((state) => state.loggedIn.clinicId);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [serivemanagerData, setServicemangerData] = useState([]);
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [sort, setSort] = useState([]);
  const [filter, setFilter] = React.useState(initialFilter);
  const [selectedServiceId, setselectedServiceId] = useState("");
  const [isDeleteConfirm, setDeleteConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchApiQuery, setsearchApiQuery] = useState([]);
  const [activeType, setActiveType] = useState(false);
  const [selectedState, setSelectedState] = React.useState({});
  const [modelScroll, setScroll] = useModelScroll();
  const userAccessPermission = useSelector(
    (state) => state.userAccessPermission
  );

  const [fields, setFields] = useState({
    service: "",
    serviceCode: "",
    modifier: "",
  });

  useEffect(() => {
    getServicesList();
  }, []);

  const handleRowClick = (e) => {
    dispatch({
      type: SELECTED_SERVICE_ID,
      payload: e.id,
    });
    navigate(APP_ROUTES.GET_Services_BY_ID);
  };

  const pageChange = (event) => {
    let skip = event.page.skip;
    let take = event.page.take;
    setPage(skip);
    setPageSize(take);
  };

  const handleAddServices = () => {
    navigate(AppRoutes.ADD_Services);
  };

  const filterOperators = {
    text: [
      {
        text: "grid.filterContainsOperator",
        operator: "contains",
      },
    ],
  };

  const dataStateChange = (event) => {
    setPage(event.dataState.skip);
    setPageSize(event.dataState.take);
    setSort(event.dataState.sort);
  };

  const getServicesList = async (changeVal) => {
    let isActive = changeVal ? !changeVal : true;
    setLoading(true);
    await ApiHelper.getRequest(
      ApiUrls.GET_Services_BY_PROVIDER_ID +
        Encrption(clinicId) +
        "&isActive=" +
        isActive
    )
      .then((result) => {
        setServicemangerData(result.resultData);
        setsearchApiQuery(result.resultData);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };
  const deleteService = (id) => {
    setDeleteConfirm(true);
    setselectedServiceId(id);
    setScroll(true);
  };

  const serviceDelete = () => {
    setLoading(true);
    ApiHelper.deleteRequest(
      ApiUrls.DELETE_Services + Encrption(selectedServiceId)
    )
      .then((result) => {
        setLoading(false);
        setDeleteConfirm(!isDeleteConfirm);
        NotificationManager.success("Deleted Successfully");
        getServicesList(false);
        setScroll(false);
      })
      .catch((error) => {
        setLoading(false);
        setDeleteConfirm(!isDeleteConfirm);
        renderErrors(error.message);
      });
  };

  const reActivate = () => {
    setLoading(true);
    ApiHelper.getRequest(
      ApiUrls.GET_SERVICE_REACTIVE + Encrption(selectedServiceId)
    )
      .then((result) => {
        setLoading(false);
        setDeleteConfirm(!isDeleteConfirm);
        NotificationManager.success("Reactivate Successfully");
        getServicesList(true);
        setScroll(false);
      })
      .catch((error) => {
        setLoading(false);
        setDeleteConfirm(!isDeleteConfirm);
        renderErrors(error.message);
      });
  };

  const handleDeleteService = () => {
    setDeleteConfirm(!isDeleteConfirm);
    setScroll(false);
  };

  const onHeaderSelectionChange = React.useCallback((event) => {
    const checkboxElement = event.syntheticEvent.target;
    const checked = checkboxElement.checked;
    const newSelectedState = {};
    event.dataItems.forEach((item) => {
      newSelectedState[idGetter(item)] = checked;
    });
    setSelectedState(newSelectedState);
  }, []);

  const handleFilter = (e) => {
    if (e.target.value == "") {
      setServicemangerData(searchApiQuery);
    } else {
      const filterResult = searchApiQuery.filter(
        (item) =>
          item.modifier.toLowerCase().includes(e.target.value.toLowerCase()) ||
          item.service.toLowerCase().includes(e.target.value.toLowerCase()) ||
          item.serviceCode.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setServicemangerData(filterResult);
    }
    setSearchQuery(e.target.value);
  };

  const handleSwitch = (e) => {
    var changeVal = e.target.value;
    setActiveType(changeVal);
    getServicesList(changeVal);
  };


  return (
    <div className="grid-table  filter-grid">
      <div className="top-bar-show-list">
        <h4 className="address-title text-grey ml-3 ">
          <span className="f-24">Services</span>
        </h4>
        {loading && <Loading />}
        <div className="d-flex flex-wrap justify-content-between align-items-center">
          <div className="filter d-flex align-items-center col-md-10">
            <div className="content-search-filter">
              <img src={searchIcon} alt="" className="search-icon" />
              <Input
                className="icon-searchinput"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => handleFilter(e)}
              />
            </div>

            <div className="mx-auto px-1  switch-on">
              <Switch
                onChange={handleSwitch}
                checked={activeType}
                onLabel={""}
                offLabel={""}
              />
              <span className="switch-title-text ml-2">
                {" "}
                Show Inactive service
              </span>
            </div>
          </div>
          
            <button
              onClick={handleAddServices}
              className="btn blue-primary text-white d-flex align-items-center ml-auto"
            >
              <img src={addIcon} alt="" className="me-2 add-img" />
              Add Service
            </button>
          
        </div>
      </div>
      <Grid
        data={orderBy(serivemanagerData.slice(page, pageSize + page), sort).map(
          (item) => ({
            ...item,
            [SELECTED_FIELD]: selectedState[idGetter(item)],
          })
        )}
        checkboxElement
        style={{
          height: serivemanagerData.length > 0 ? "100%" : "250px",
        }}
        dataItemKey={DATA_ITEM_KEY}
        // selectedField={SELECTED_FIELD}
        skip={page}
        take={pageSize}
        total={serivemanagerData.length}
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
        onHeaderSelectionChange={onHeaderSelectionChange}
      >
        <GridNoRecords style={{}}></GridNoRecords>
        {/* <GridColumn filterable={false} field={SELECTED_FIELD} width="100px" /> */}
        <GridColumn
          className="anchar-pointer text-theme"
          title="Service"
          cell={(props) => {
            let field = props.dataItem;
            return (
              <td
                className="anchar-pointer text-theme"
                onClick={() => handleRowClick(field)}
              >
                {field.fullName}
                {/* {`(${field.serviceCode}${props.dataItem.modifier}${props.dataItem.secModifier}${props.dataItem.thirdModifier}${props.dataItem.fourthModifier}${props.dataItem.ageModifier})` + "\u00a0" + field.service} */}
              </td>
            );
          }}
        />

        <GridColumn
          title="Date Effective"
          cell={(props) => {
            let date = props.dataItem.dateEffective;
            return (
              <td className="cursor-default">
                {" "}
                {moment(date).format("M/D/YYYY")}
              </td>
            );
          }}
        />
        <GridColumn
          filterable={false}
          cell={(props) => {
            let field = props.dataItem.id;
            return (
              <td>
                
                  <div
                    className="k-chip k-chip-md k-rounded-md k-chip-solid k-chip-solid-base"
                    onClick={() => {
                      deleteService(field);
                    }}
                  >
                    <div className="k-chip-content">
                      <Tooltip anchorElement="target" position="top">
                        <i
                          className={
                            activeType == true
                              ? "fa fa-rotate-left"
                              : "fa fa-trash"
                          }
                          aria-hidden="true"
                          title={activeType == true ? "Reactivate" : "Delete"}
                        ></i>
                      </Tooltip>
                    </div>
                  </div>
                
              </td>
            );
          }}
        />
      </Grid>
      {isDeleteConfirm && (
        <DeleteDialogModal
          title="Service"
          message="service"
          onClose={handleDeleteService}
          activeType={activeType}
          handleDelete={serviceDelete}
          handleReactive={reActivate}
        />
      )}
    </div>
  );
};

export default ServicesList;
