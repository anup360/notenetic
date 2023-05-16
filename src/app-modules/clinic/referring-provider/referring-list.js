/**
 * App.js Layout Start Here
 */
import React, { Component, useEffect, useState } from "react";
import { Switch } from "@progress/kendo-react-inputs";
import { useSelector, useDispatch } from "react-redux";
import CustomDrawer from "../../../control-components/custom-drawer/custom-drawer";
import addIcon from "../../../assets/images/add.png";
import AddClinicReferring from "./add-clinic-referring";
import EditClinicReferring from "./add-clinic-referring";
import Loader from "../../../control-components/loader/loader";
import { SettingsService } from "../../../services/settingsService";
import { NotificationManager } from "react-notifications";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { orderBy } from "@progress/kendo-data-query";
import { getter } from "@progress/kendo-react-common";
import { Tooltip } from "@progress/kendo-react-tooltip";
import DeleteDialogModal from "../../../control-components/custom-delete-dialog-box/delete-dialog";
import searchIcon from "../../../assets/images/search.png";
import { Input } from "@progress/kendo-react-inputs";
import useModelScroll from "../../../cutomHooks/model-dialouge-scroll";
import { MaskFormatted } from "../../../helper/mask-helper";
import { renderErrors } from "src/helper/error-message-helper";

const DATA_ITEM_KEY = "id";
const SELECTED_FIELD = "selected";
const idGetter = getter(DATA_ITEM_KEY);

const ReferringList = () => {
  const [addReferring, setIsAddReferring] = useState(false);
  const [loading, setLoading] = useState(false);
  const clinicId = useSelector((state) => state.loggedIn.clinicId);
  const [referringData, setReferringData] = useState([]);
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [sort, setSort] = useState([]);
  const [activeType, setActiveType] = useState(false);
  const [selectedState, setSelectedState] = React.useState({});
  const [isDeleteReferring, setisDeleteReferring] = useState(false);
  const [selectedRefId, setSelectedRefId] = useState();
  const [isEditReferring, setIsEdiReferring] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchApiQuery, setsearchApiQuery] = useState([]);
  const [totalCount, setTotalCount] = useState();
  const defaultPageSettings = { skip: 0, take: 10 };
  const [pageNo, setPageNo] = React.useState(defaultPageSettings);
  const { skip, take } = pageNo;
  const [modelScroll, setScroll] = useModelScroll();

  useEffect(() => {
    getClinicReferrings();
  }, []);

  const handleAddReferring = () => {
    setIsAddReferring(true);
    setScroll(true);
  };

  const handleCloseReferring = ({ added }) => {
    if (added) {
      getClinicReferrings();
    }
    setIsAddReferring(false);
    setScroll(false);
  };

  const pageChange = (event) => {
    let skip = event.page.skip;
    let take = event.page.take;
    setPage(skip);
    setPageSize(take);
    setPageNo({
      skip: skip,
      take: take,
    });
  };

  const handleFilter = (e) => {
    if (e.target.value == "") {
      setReferringData(searchApiQuery);
    } else {
      const filterResult = searchApiQuery.filter(
        (item) =>
          item.firstName.toLowerCase().includes(e.target.value.toLowerCase()) ||
          item.lastName.toLowerCase().includes(e.target.value.toLowerCase()) ||
          item.email.toLowerCase().includes(e.target.value.toLowerCase()) ||
          item.city.toLowerCase().includes(e.target.value.toLowerCase()) ||
          item.companyName
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          item.address.toLowerCase().includes(e.target.value.toLowerCase()) ||
          item.state.toLowerCase().includes(e.target.value.toLowerCase()) ||
          item.zip.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setReferringData(filterResult);
    }
    setSearchQuery(e.target.value);
  };

  const getClinicReferrings = async (changeVal) => {
    setLoading(true);
    await SettingsService.getClinicReferringProvider(clinicId, !changeVal)
      .then((result) => {
        let list = result.resultData;
        setReferringData(
          list.map((reffingData) => {
            return {
              ...reffingData,
              phoneMask: MaskFormatted(
                reffingData.contactPhone,
                "(999) 999-9999"
              ),
            };
          })
        );
        setTotalCount(list.length);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const handleSwitch = (e) => {
    var changeVal = e.target.value;
    setActiveType(changeVal);
    getClinicReferrings(changeVal);
  };

  const deleteReferring = (id) => {
    setisDeleteReferring(true);
    setSelectedRefId(id);
    setScroll(true);
  };

  const closeDeleteRef = () => {
    setisDeleteReferring(false);
    setScroll(false);
  };

  const editReferring = (id) => {
    setIsEdiReferring(true);
    setSelectedRefId(id);
    setScroll(true);
  };

  const handleCloseEditReferring = ({ updated }) => {
    if (updated) {
      if (activeType == false) {
        getClinicReferrings(false);
      } else {
        getClinicReferrings(true);
      }
    }
    setIsEdiReferring(false);
    setScroll(false);
  };

  const deleteReferringAPI = async () => {
    setLoading(true);
    await SettingsService.deleteClinicRef(selectedRefId)
      .then((result) => {
        setLoading(false);
        NotificationManager.success("Provider deleted successfully.");
        setisDeleteReferring(false);
        getClinicReferrings(false);
        setScroll(false);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const reActivateReferringAPI = async () => {
    setLoading(true);
    await SettingsService.reActivateClinicReferring(selectedRefId)
      .then((result) => {
        setLoading(false);
        NotificationManager.success("Provider reactivated successfully.");
        setisDeleteReferring(false);
        getClinicReferrings(true);
        setScroll(false);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  function prevPage(e) {
    e.preventDefault();
    if (skip != 0) {
      const newSkip = skip - take;
      setPageNo({
        skip: newSkip,
        take: take,
      });
      setPage(newSkip);
      setPageSize(take);
    }
  }
  function nextPage(e) {
    e.preventDefault();
    const newSkip = skip + take;
    setPageNo({
      skip: newSkip,
      take: take,
    });
    setPage(newSkip);
    setPageSize(take);
  }

  function renderPrevNextPage() {
    const lastTaskCountOnScreen = skip + take;

    return (
      <div className="prev-next mt-3 mt-md-0 d-flex align-items-center pr-3">
        <div className="count-show-numer mr-2">
          <p className="mb-0 f-14">
            {referringData.length > 0 ? skip + 1 : skip} -{" "}
            {lastTaskCountOnScreen > totalCount
              ? totalCount
              : lastTaskCountOnScreen}{" "}
            of {totalCount}
          </p>
        </div>

        <ul className="list-unstyled d-flex justify-content-end mb-0">
          {skip != 0 && (
            <li className="d-inline-block mx-1">
              <button
                type="button"
                className="btn blue-primary btn-sm"
                onClick={prevPage}
              >
                <i className="k-icon k-i-arrow-chevron-left"></i>
              </button>
            </li>
          )}
          {lastTaskCountOnScreen < totalCount && (
            <li className="d-inline-block mx-1" onClick={nextPage}>
              <button type="button" className="btn blue-primary btn-sm">
                <i className="k-icon k-i-arrow-chevron-right"></i>
              </button>
            </li>
          )}
        </ul>
      </div>
    );
  }

  return (
    <div className="d-flex flex-wrap">
      <div className="inner-dt col-md-3 col-lg-2">
        <CustomDrawer />
      </div>

      <div className="col-md-9 col-lg-10">
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="address-title text-grey">
            <span className="f-24">Referring Provider</span>
          </h4>
          <button
            type="button"
            data-toggle="modal"
            data-target="#editform"
            onClick={handleAddReferring}
            className="btn blue-primary text-white d-flex align-items-center mr-3"
          >
            <img src={addIcon} alt="" className="me-2 add-img" />
            Add Provider
          </button>
        </div>

        <div className="d-flex flex-wrap align-items-center">
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
              Show Inactive Providers
            </span>
          </div>
          {renderPrevNextPage()}
        </div>

        <div className="grid-table  filter-grid">
          <div className=" mt-3">
            {loading && <Loader />}
            <Grid
              data={orderBy(
                referringData.slice(page, pageSize + page),
                sort
              ).map((item) => ({
                ...item,
                [SELECTED_FIELD]: selectedState[idGetter(item)],
              }))}
              checkboxElement
              style={{
                height: referringData.length > 0 ? "100%" : "250px",
              }}
              dataItemKey={DATA_ITEM_KEY}
              selectedField={SELECTED_FIELD}
              skip={page}
              take={pageSize}
              total={referringData.length}
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
            >
              <GridNoRecords style={{}}></GridNoRecords>
              {/* <GridColumn filterable={false} field={SELECTED_FIELD} width="100px" /> */}
              <GridColumn
                className="cursor-default"
                field="firstName"
                title="First Name"
              />
              <GridColumn
                className="cursor-default"
                field="lastName"
                title="Last Name"
              />
              <GridColumn
                className="cursor-default"
                field="companyName"
                title="Company Name"
              />
              <GridColumn
                className="cursor-default"
                field="npi"
                title="Company NPI"
              />
              <GridColumn
                className="cursor-default"
                field="email"
                title="Email"
              />
              <GridColumn
                className="cursor-default"
                field="phoneMask"
                title="Contact Phone"
              />

              <GridColumn
                title="Address"
                cell={(props) => {
                  let field = props.dataItem;
                  return (
                    <td>
                      {" "}
                      {field.companyName ||
                      field.address ||
                      field.city ||
                      field.state ||
                      field.zip ? (
                        <div>
                          <p className="mb-0">
                            <b>Address</b>: {field.address}
                          </p>
                          <p className="mb-0">
                            <b>City</b>: {field.city}
                          </p>

                          <p className="mb-0">
                            <b>State</b>: {field.state}
                          </p>
                          <p className="mb-0">
                            <b>Zip</b>: {field.zip}
                          </p>
                        </div>
                      ) : (
                        ""
                      )}
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
                      <div className="row-3">
                        <div
                          className="k-chip k-chip-md k-rounded-md k-chip-solid k-chip-solid-base"
                          onClick={() => deleteReferring(field)}
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
                                title={
                                  activeType == true ? "Reactivate" : "Delete"
                                }
                              ></i>
                            </Tooltip>
                          </div>
                        </div>
                        <div
                          className="k-chip k-chip-md k-rounded-md k-chip-solid k-chip-solid-base m-2"
                          onClick={() => editReferring(field)}
                        >
                          <div className="k-chip-content">
                            <Tooltip anchorElement="target" position="top">
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
          </div>
        </div>
      </div>
      {addReferring && <AddClinicReferring onClose={handleCloseReferring} />}
      {isDeleteReferring && (
        <DeleteDialogModal
          onClose={closeDeleteRef}
          title="Provider"
          message="provider"
          activeType={activeType}
          handleDelete={deleteReferringAPI}
          handleReactive={reActivateReferringAPI}
        />
      )}
      {isEditReferring && (
        <EditClinicReferring
          onClose={handleCloseEditReferring}
          selectedRefId={selectedRefId}
          activeType={activeType}
        />
      )}
    </div>
  );
};
export default ReferringList;
