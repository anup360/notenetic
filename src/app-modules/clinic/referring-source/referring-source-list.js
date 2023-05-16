/**
 * App.js Layout Start Here
 */
import React, { Component, useEffect, useState } from "react";
import { Switch } from "@progress/kendo-react-inputs";
import { useSelector, useDispatch } from "react-redux";
import CustomDrawer from "../../../control-components/custom-drawer/custom-drawer";
import addIcon from "../../../assets/images/add.png";
import AddClinicReferring from "./add-ref-source";
import EditClinicReferring from "./add-ref-source";
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

const RefSourceList = () => {
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
    getReferringSource();
  }, []);

  const handleAddReferring = () => {
    setIsAddReferring(true);
    setScroll(true);
  };

  const handleCloseReferring = ({ added }) => {
    if (added) {
      getReferringSource();
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
          item.referringCompanyName
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          item.referringCompanyNPI
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          item.contactPerson
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          item.contactPersonPosition
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          item.contactPhone
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          item.contactEmail.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setReferringData(filterResult);
    }
    setSearchQuery(e.target.value);
  };

  const getReferringSource = async (changeVal) => {
    setLoading(true);
    await SettingsService.getRefSource(clinicId, !changeVal)
      .then((result) => {
        let list = result.resultData;
        setReferringData(
          list.map((refferingData) => {
            return {
              ...refferingData,
              phoneMask: MaskFormatted(
                refferingData.contactPhone,
                "(999) 999-9999"
              ),
            };
          })
        );
        setsearchApiQuery(list);
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
    getReferringSource(changeVal);
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
        getReferringSource(false);
      } else {
        getReferringSource(true);
      }
    }
    setIsEdiReferring(false);
    setScroll(false);
  };

  const deleteReferringAPI = async () => {
    setLoading(true);
    await SettingsService.deleteRefSource(selectedRefId)
      .then((result) => {
        setLoading(false);
        NotificationManager.success("Source deleted successfully.");
        setisDeleteReferring(false);
        getReferringSource(false);
        setScroll(false);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const reActivateReferringAPI = async () => {
    setLoading(true);
    await SettingsService.reActivateRefSource(selectedRefId)
      .then((result) => {
        setLoading(false);
        NotificationManager.success("Source reactivated successfully.");
        setisDeleteReferring(false);
        getReferringSource(true);
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
        <div className="d-flex justify-content-between">
          <h4 className="address-title text-grey">
            <span className="f-24">Referring Source</span>
          </h4>
          <button
            type="button"
            data-toggle="modal"
            data-target="#editform"
            onClick={handleAddReferring}
            className="btn blue-primary text-white d-flex align-items-center mr-3"
          >
            <img src={addIcon} alt="" className="me-2 add-img" />
            Add Source
          </button>
        </div>
        <div className="d-flex flex-wrap  align-items-center">
          <div className="content-search-filter">
            <img src={searchIcon} alt="" className="search-icon" />
            <Input
              className="icon-searchinput"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => handleFilter(e)}
            />
          </div>
          <div className="mx-auto switch-on">
            <Switch
              onChange={handleSwitch}
              checked={activeType}
              onLabel={""}
              offLabel={""}
            />
            <span className="switch-title-text ml-2">
              {" "}
              Show Inactive Sources
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
                field="referringCompanyName"
                title="Company Name"
              />
              <GridColumn
                className="cursor-default"
                field="referringCompanyNPI"
                title="Company NPI"
              />
              <GridColumn
                className="cursor-default"
                field="contactPerson"
                title="Contact Person"
              />
              <GridColumn
                className="cursor-default"
                field="contactPersonPosition"
                title="Person's Position"
              />
              <GridColumn
                className="cursor-default"
                field="phoneMask"
                title="Contact Phone"
              />
              <GridColumn
                className="cursor-default"
                field="contactEmail"
                title="Contact Email"
              />
              <GridColumn
                className="cursor-default"
                field="contactFax"
                title="Contact Fax"
              />
              <GridColumn
                className="cursor-default"
                field="address"
                title="Address"
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
          title="Source"
          message="source"
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
export default RefSourceList;
