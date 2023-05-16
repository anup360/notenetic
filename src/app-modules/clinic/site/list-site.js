/**
 * App.js Layout Start Here
 */
/**
 * App.js Layout Start Here
 */
import React, { Component, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { NotificationManager } from "react-notifications";
import ApiUrls from "../../../helper/api-urls";
import AppRoutes from "../../../helper/app-routes";
import ApiHelper from "../../../helper/api-helper";
import { SELECTED_CLIENT_ID, SELECTED_CLIENT_FILTER } from "../../../actions";
import {
  Grid,
  GridColumn,
  getSelectedState,
  GridNoRecords,
} from "@progress/kendo-react-grid";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@progress/kendo-react-inputs";
import addIcon from "../../../assets/images/add.png";
import searchIcon from "../../../assets/images/search.png";
import { getter } from "@progress/kendo-react-common";
import Loading from "../../../control-components/loader/loader";
import APP_ROUTES from "../../../helper/app-routes";
import { GridColumnMenuSort } from "@progress/kendo-react-grid";
import { orderBy } from "@progress/kendo-data-query";
import DialougeEditSite from "./edit-site";
import { Tooltip } from "@progress/kendo-react-tooltip";
import { Encrption } from "../../encrption";
import useModelScroll from "../../../cutomHooks/model-dialouge-scroll";
import DeleteDialogModal from "../../../control-components/custom-delete-dialog-box/delete-dialog";
import { MaskFormatted } from "../../../helper/mask-helper";
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

const SiteList = () => {
  const clinicId = useSelector((state) => state.loggedIn.clinicId);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [siteData, setSiteData] = useState([]);
  const [filter, setFilter] = React.useState(initialFilter);
  const [metaData, setMetaData] = useState([]);
  const [sort, setSort] = useState([]);
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [stateData, setStateData] = useState([]);
  const dispatch = useDispatch();
  const siteLastFilter = useSelector((state) => state.clientLastFilter);
  const [isDeleteConfirm, setDeleteConfirm] = useState(false);
  const [isEditSite, setIsEditSite] = useState(false);
  const [show, setShow] = React.useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchApiQuery, setsearchApiQuery] = useState([]);
  const [modelScroll, setScroll] = useModelScroll();
  const [selectedState, setSelectedState] = React.useState({});
  const [fields, setFields] = useState({
    siteName: "",
  });
  useEffect(() => {
    getSiteByclinicId(page);
    getState();

    setFields({
      ...fields,
      siteName: siteLastFilter.siteName,
    });
  }, []);

  const getState = () => {
    ApiHelper.getRequest(ApiUrls.GET_STATE)
      .then((result) => {
        let stateList = result.resultData;
        setStateData(stateList);
      })
      .catch((error) => {
        renderErrors(error.message);
      });
  };

  const pageChange = (event) => {
    let skip = event.page.skip;
    let take = event.page.take;
    setPage(skip);
    setPageSize(take);
  };

  const getSiteByclinicId = (param, take) => {
    setLoading(true);

    ApiHelper.getRequest(ApiUrls.GET_CLINIC_SITES + Encrption(clinicId))
      .then((result) => {
        setSiteData(result.resultData);
        setsearchApiQuery(result.resultData);
        setMetaData(result.metaData);
        setLoading(false);
        setShow(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const deleteSite = (id) => {
    setDeleteConfirm(true);
    setSelectedSiteId(id);
    setScroll(true);
  };
  const siteDelete = () => {
    setLoading(true);
    ApiHelper.deleteRequest(ApiUrls.DELETE_SITE + Encrption(selectedSiteId))
      .then((result) => {
        setLoading(false);
        setDeleteConfirm(!isDeleteConfirm);
        NotificationManager.success("Deleted Successfully");
        getSiteByclinicId();
        setScroll(false);
      })
      .catch((error) => {
        setLoading(false);
        setDeleteConfirm(!isDeleteConfirm);
        renderErrors(error.message);
      });
  };

  const handleAddSite = () => {
    navigate(AppRoutes.ADD_CLINIC_SITE);
  };

  const handleRowClick = (e) => {
    dispatch({
      type: SELECTED_CLIENT_ID,
      payload: e.dataItem.id,
    });
    navigate(APP_ROUTES.GET_CLINIC_SITE);
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
        <GridColumnMenuSort {...props} data={siteData} />
      </div>
    );
  };

  const dataStateChange = (event) => {
    setPage(event.dataState.skip);
    setPageSize(event.dataState.take);
    setSort(event.dataState.sort);
  };

  const handleDeleteSite = () => {
    setDeleteConfirm(!isDeleteConfirm);
    setScroll(false);
  };

  const handleEditSite = (id) => {
    setSelectedSiteId(id);
    setIsEditSite(true);
    setScroll(true);
  };

  const handleEditClose = ({ editable }) => {
    if (editable) {
      getSiteByclinicId(page);
    }
    setIsEditSite(false);
    setScroll(false);
  };
  const handleFilter = (e) => {
    if (e.target.value == "") {
      setSiteData(searchApiQuery);
    } else {
      const filterResult = searchApiQuery.filter(
        (item) =>
          item.clinicName
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          item.city.toLowerCase().includes(e.target.value.toLowerCase()) ||
          item.address.toLowerCase().includes(e.target.value.toLowerCase()) ||
          item.siteName.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setSiteData(filterResult);
    }
    setSearchQuery(e.target.value);
  };

  return (
    <div className="grid-table  filter-grid">
      <div className="top-bar-show-list">
        <h4 className="address-title text-grey ml-3 ">
          <span className="f-24">Sites</span>
        </h4>
        <div className="d-flex flex-wrap justify-content-between align-items-center">
          <div className="filter d-flex align-items-center col-lg-4 col-md-6">
            <div className="content-search-filter">
              <img src={searchIcon} alt="" className="search-icon" />
              <Input
                className="icon-searchinput"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => handleFilter(e)}
              />
            </div>
          </div>

          <button
            onClick={handleAddSite}
            className="btn blue-primary text-white  text-decoration-none d-flex align-items-center "
          >
            <img src={addIcon} alt="" className="me-2 add-img" />
            Add New Site
          </button>
        </div>
      </div>

      <Grid
        data={orderBy(siteData.slice(page, pageSize + page), sort).map(
          (item) => ({
            ...item,
            [SELECTED_FIELD]: selectedState[idGetter(item)],
          })
        )}
        checkboxElement
        style={{
          height: siteData.length > 0 ? "100%" : "250px",
        }}
        dataItemKey={DATA_ITEM_KEY}
        selectedField={SELECTED_FIELD}
        skip={page}
        take={pageSize}
        total={siteData.length}
        onPageChange={pageChange}
        onRowClick={handleRowClick}
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
        <GridNoRecords style={{}}>
          {loading ? <Loading /> : "No data found"}
        </GridNoRecords>
        {/*  <GridColumn filterable={false} field={SELECTED_FIELD} width="100px" />*/}

        <GridColumn
          // columnMenu={columnMenus}
          field="siteName"
          title="Site Name"
          className="cursor-default"
        />

        <GridColumn
          // columnMenu={columnMenus}
          field="address"
          title="Address"
          className="cursor-default"
        />
        <GridColumn
          // columnMenu={columnMenus}
          field="city"
          title="City"
          className="cursor-default"
        />

        <GridColumn
          // columnMenu={columnMenus}
          field="phone"
          title="Phone"
          className="cursor-default"
          cell={(props) => {
            let field = props.dataItem.phone ? props.dataItem.phone : "";
            return (
              <td className="cursor-default">
                {MaskFormatted(field, "(999) 999-9999")}
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
                    deleteSite(field);
                  }}
                >
                  <div className="k-chip-content">
                    <Tooltip anchorElement="target" position="top">
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
                  onClick={() => {
                    handleEditSite(field);
                  }}
                >
                  <div className="k-chip-content">
                    <Tooltip anchorElement="target" position="top">
                      <i className="fas fa-edit" title="Edit"></i>
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
          onClose={handleDeleteSite}
          title="Site"
          message="site"
          handleDelete={siteDelete}
        />
      )}
      {isEditSite && (
        <DialougeEditSite
          stateData={stateData}
          onClose={handleEditClose}
          selectedSiteId={selectedSiteId}
        />
      )}
    </div>
  );
};
export default SiteList;
