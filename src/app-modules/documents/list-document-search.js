import { filterBy } from "@progress/kendo-data-query";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import moment from "moment";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GET_DOCUMENT_FILTER } from "../../actions";
import MultiSelectDropDown from "../../control-components/multi-select-drop-down/multi-select-drop-down";
import apiHelper from "../../helper/api-helper";
import API_URLS from "../../helper/api-urls";
import { showError } from "../../util/utility";
import SideFilter from "./sideFilters";

const DocumentSearchView = forwardRef((props, ref) => {
  const {
    clearAdvSearchObj,
    advSearchFields,
    setAdvSearchFields,
    setDisplaySearchResult,
    fetchDocuments,
    setPage,
    setPageSize,
    docFilter,
    showFilter,
    setShowFilter,
    setIsActiveCheck,
    isActiveCheck,
    pastDate,
    currentDate,
    openDateFilter,
    setOpenDateFilter,
    openClientFilter,
    setOpenClientFilter,
    openStaffFilter,
    setOpenStaffFilter,
    openServiceFilter,
    setOpenServiceFilter
  } = props;

  const [patientList, setPatientList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [filter, setFilter] = useState({});
  const [loading, setLoading] = useState({});
  const [staffList, setStaffList] = useState([]);

  const dispatch = useDispatch();
  const staffId = useSelector((state) => state.loggedIn?.staffId);
  const outsideRef = useRef(null);

  const defaultPageSettings = { page: 1, pageSize: 10 };

  /* ============================= useEffects ============================= */

  useEffect(() => {
    fetchPatientList();
    fetchServiceList();
    fetchStaffList();
  }, []);

  /* ============================= Private functions ============================= */

  function fetchPatientList() {
    setLoading({ patientList: true });
    apiHelper
      .getRequest(API_URLS.GET_CLIENT_DDL_BY_CLINIC_ID)
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
    apiHelper
      .getRequest(API_URLS.GET_STAFF_DDL_BY_CLINIC_ID)
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

  function fetchServiceList() {
    setLoading({ serviceList: true });
    apiHelper
      .queryGetRequestWithEncryption(
        API_URLS.GET_DOCUMENT_STAFF_SERVICES,
        staffId
      )
      .then((result) => {
        const list = result.resultData.map((x) => {
          return { id: x.serviceId, name: x.fullName };
        });
        setServiceList(list);
      })
      .catch((err) => {
        showError(err, "Service List");
      })
      .finally(() => {
        setLoading({ serviceList: false });
      });
  }

  function onFilterChange(event, listName) {
    setFilter({ ...filter, [listName]: event.filter });
  }

  /* ============================= Event functions ============================= */

  const handleShowFilter = () => {
    setShowFilter(!showFilter);
  };

  const handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;

    if (value == "" && (name === "dosStartDate" || name === "dosEndDate")) {
      value = null;
    }

    const newAdvSearchFileds = {
      ...advSearchFields,
      [name]: value,
    };

    setAdvSearchFields(newAdvSearchFileds);
    if (name == "dosStartDate" || name == "dosEndDate") {
      // handleApplyFilter() on Apply click
    } else {
      // Immediate search
      apply(newAdvSearchFileds);
    }
  };

  const apply = (advSearchFields) => {
    dispatch({
      type: GET_DOCUMENT_FILTER,
      payload: advSearchFields,
    });
    setDisplaySearchResult(true);
    setPage(defaultPageSettings.page);
    setPageSize(defaultPageSettings.pageSize);
    fetchDocuments();
  };

  const handleApplyFilter = () => {
    apply(advSearchFields);
  };

  const handleClearService = () => {
    const newAdvSearchFileds = {
      ...advSearchFields,
      service: 0,
    };
    setAdvSearchFields(newAdvSearchFileds);
    dispatch({
      type: GET_DOCUMENT_FILTER,
      payload: newAdvSearchFileds,
    });
    setPage(defaultPageSettings.page);
    setPageSize(defaultPageSettings.pageSize);
    fetchDocuments();
  };

  const handleClearClient = () => {
    const newAdvSearchFileds = {
      ...advSearchFields,
      client: [],
    };
    setAdvSearchFields(newAdvSearchFileds);
    dispatch({
      type: GET_DOCUMENT_FILTER,
      payload: newAdvSearchFileds,
    });
    setPage(defaultPageSettings.page);
    setPageSize(defaultPageSettings.pageSize);
    fetchDocuments();
  };

  const handleClearStaff = () => {
    const newAdvSearchFileds = {
      ...advSearchFields,
      staff: [],
    };
    setAdvSearchFields(newAdvSearchFileds);
    dispatch({
      type: GET_DOCUMENT_FILTER,
      payload: newAdvSearchFileds,
    });
    setPage(defaultPageSettings.page);
    setPageSize(defaultPageSettings.pageSize);
    fetchDocuments();
  };

  const clearAllFilter = () => {
    setAdvSearchFields({
      ...advSearchFields,
      dosStartDate: pastDate,
      dosEndDate: currentDate,
      client: [],
      staff: [],
      template: [],
      documentId: "",
      service: 0,
    });
    setIsActiveCheck(false);
    dispatch({
      type: GET_DOCUMENT_FILTER,
      payload: null,
    });
    fetchDocuments();
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

  let clientCounts = advSearchFields?.client.length - 1;
  let staffCounts = advSearchFields?.staff.length - 1;

  /* ============================= Render View ============================= */

  return (
    <>
      <div className="col-lg-9 col-sm-12">
        <div
          className="content-search-filter  px-0 filter-drop-down"
          ref={outsideRef}
        >
          {/*start click major filter */}
          <div className="major-filter">
            <div
              onClick={() => setOpenDateFilter(true)}
              onMouseLeave={() => setOpenDateFilter(false)}
              className="service-main dropdown email-filter border-dashed-cus position-relative"
            >
              <button class="btn  btn-size-cus " type="button">
                Service Date{" "}
                <span className="border-spann">
                  {moment(advSearchFields?.dosStartDate).format("M/D/yyyy") +
                    " - " +
                    moment(advSearchFields?.dosEndDate).format("M/D/yyyy")}
                </span>
              </button>

              {openDateFilter && (
                <div className="dropdown-service ">
                  <div className="row">
                    <div className="col-md-6">
                      <DatePicker
                        validityStyles={false}
                        value={new Date(advSearchFields?.dosStartDate)}
                        onChange={handleChange}
                        max={
                          advSearchFields?.dosEndDate
                            ? new Date(advSearchFields?.dosEndDate)
                            : undefined
                        }
                        name="dosStartDate"
                        label="From"

                        
                        
                      />
                    </div>
                    <div className="col-6">
                      <DatePicker
                        validityStyles={false}
                        value={new Date(advSearchFields?.dosEndDate)}
                        onChange={handleChange}
                        min={
                          advSearchFields?.dosStartDate
                            ? new Date(advSearchFields?.dosStartDate)
                            : undefined
                        }
                        name="dosEndDate"
                        label="To"
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

          
            <div
              onClick={() => setOpenClientFilter(true)}
              onMouseLeave={() => setOpenClientFilter(false)}
              className="service-main dropdown email-filter border-dashed-cus position-relative"
            >
              <button class="btn  btn-size-cus pl-0 " type="button">
              {advSearchFields?.client.length !== 0 && (
                <i
                  onClick={handleClearClient}
                  className={"fa fa-times cross-icon mr-2 "}
                ></i>
              )}
              {advSearchFields?.client.length == 0 && (
                <i
                  className={"fa fa-plus cross-icon mr-2 "}
                  
                ></i>
              )} Client {advSearchFields?.client.length !== 0 && (
                <span
                  className={
                    advSearchFields?.client.length !== 0 && "border-spann"
                  }
                >
                  {advSearchFields?.client[0].name +
                    (advSearchFields?.client.length > 1
                      ? " (+" + clientCounts + ")"
                      : "")}
                </span>
              )}
              </button>

              {openClientFilter && (
                <div className="dropdown-service ">
                  <div className="row">
                    <div className="col-md-12">
                    <MultiSelectDropDown
                            data={filterBy(patientList, filter.patientList)}
                            onFilterChange={(event) => {
                              onFilterChange(event, "patientList");
                            }}
                            loading={loading.patientList}
                            textField="name"
                            label="Client Name"
                            name="client"
                            value={advSearchFields.client}
                            onChange={handleChange}
                            autoClose={true}
                            dataItemKey={"id"}
                            itemRender={renderToItem}
                          />
                    </div>
                 
                  </div>

               
                </div>
              )}
            </div>
 

            <div
              onClick={() => setOpenStaffFilter(true)}
              onMouseLeave={() => setOpenStaffFilter(false)}
              className="service-main dropdown email-filter border-dashed-cus position-relative"
            >
              <button class="btn  btn-size-cus pl-0 " type="button">
              {advSearchFields?.staff.length !== 0  && (
                <i
                  onClick={handleClearStaff}
                  className={"fa fa-times cross-icon mr-2 "}
                ></i>
              )}
              {advSearchFields?.staff.length == 0 && (
                <i
                  className={"fa fa-plus cross-icon mr-2 "}
                  
                ></i>
              )}   Staff
              {advSearchFields?.staff.length !== 0 && (
                <span
                  className={
                    advSearchFields?.staff.length !== 0 && "border-spann"
                  }
                >
                  {advSearchFields?.staff[0].name +
                    (advSearchFields?.staff.length > 1
                      ? " (+" + staffCounts + ")"
                      : "")}
                </span>
              )}
              </button>

              {openStaffFilter && (
                <div className="dropdown-service ">
                  <div className="row">
                    <div className="col-md-12">
                    <MultiSelectDropDown
                          data={staffList}
                          loading={loading.staffList}
                          textField="name"
                          label="Staff Name"
                          name="staff"
                          value={advSearchFields.staff}
                          onChange={handleChange}
                          autoClose={true}
                          dataItemKey={"id"}
                          itemRender={renderToItem}
                        />
                    </div>
                 
                  </div>

               
                </div>
              )}
            </div>


            <div
              onClick={() => setOpenServiceFilter(true)}
              onMouseLeave={() => setOpenServiceFilter(false)}
              className="service-main dropdown email-filter border-dashed-cus position-relative"
            >
              <button class="btn  btn-size-cus pl-0 " type="button">
              {advSearchFields?.service !== 0  && (
                <i
                  onClick={handleClearService}
                  className={"fa fa-times cross-icon mr-2 "}
                ></i>
              )}
              {advSearchFields?.service == 0 && (
                <i
                  className={"fa fa-plus cross-icon mr-2 "}
                  
                ></i>
              )}     Service
              <span className={advSearchFields?.service && "border-spann"}>
                {advSearchFields.service.name}
              </span>
              </button>

              {openServiceFilter && (
                <div className="dropdown-service ">
                  <div className="row">
                    <div className="col-md-12">
                    <DropDownList
                          filterable={true}
                          data={filterBy(serviceList, filter.serviceList)}
                          onFilterChange={(event) => {
                            onFilterChange(event, "serviceList");
                          }}
                          loading={loading.serviceList}
                          textField="name"
                          label="Service"
                          name="service"
                          value={advSearchFields.service}
                          onChange={handleChange}
                          autoClose={true}
                        />
                    </div>
                 
                  </div>

               
                </div>
              )}
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
        <div>
          <p
            onClick={handleShowFilter}
            className="mb-0 add-filter-cus position relative"
          >
            <i class="fa fa-filter  fiter-icon "></i>
            <i class="fa fa-plus d-none"></i> Add Filter
          </p>
        </div>
      </div>
      {showFilter && (
        <SideFilter
          showFilter={showFilter}
          handleShowFilter={handleShowFilter}
          advSearchFields={advSearchFields}
          setAdvSearchFields={setAdvSearchFields}
          setPage={setPage}
          setPageSize={setPageSize}
          defaultPageSettings={defaultPageSettings}
          fetchDocuments={fetchDocuments}
          docFilter={docFilter}
          setIsActiveCheck={setIsActiveCheck}
          isActiveCheck={isActiveCheck}
        />
      )}
    </>
  );
});

export default DocumentSearchView;
