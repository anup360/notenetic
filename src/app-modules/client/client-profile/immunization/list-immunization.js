import React, { useEffect, useState } from "react";
import CustomDrawer from "../../../../control-components/custom-drawer/custom-drawer";
import ClientHeader from "../client-header/client-header";
import addIcon from "../../../../assets/images/add.png";
import Loader from "../../../../control-components/loader/loader";
import ApiUrls from "../../../../helper/api-urls";
import ApiHelper from "../../../../helper/api-helper";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import AppRoutes from "../../../../helper/app-routes";
import {
  Grid,
  GridColumn,
  getSelectedState,
  GridNoRecords,
} from "@progress/kendo-react-grid";
import { getter } from "@progress/kendo-react-common";
import { orderBy } from "@progress/kendo-data-query";
import { GridColumnMenuSort } from "@progress/kendo-react-grid";
import Loading from "../../../../control-components/loader/loader";
import moment from "moment";
import { NotificationManager } from "react-notifications";
import { filter } from "@progress/kendo-data-query/dist/npm/transducers";
import { Tooltip } from "@progress/kendo-react-tooltip";
import DeleteImmunization from "./delete-immunization";
import { Encrption } from "../../../encrption";
import useModelScroll from "../../../../cutomHooks/model-dialouge-scroll";
import { permissionEnum } from "../../../../helper/permission-helper";
import { renderErrors } from "src/helper/error-message-helper";

const DATA_ITEM_KEY = "id";
const SELECTED_FIELD = "selected";
const idGetter = getter(DATA_ITEM_KEY);

const ImmunizationList = () => {
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedState, setSelectedState] = React.useState({});
  const [immunization, setImmunization] = useState([]);
  const [sort, setSort] = useState([]);
  const [confirm, setConfirm] = useState(false);
  const [deleteImmunizations, setDeleteImmunizations] = useState("");
  const [modelScroll, setScroll] = useModelScroll();

  const userAccessPermission = useSelector(
    (state) => state.userAccessPermission
  );

  useEffect(() => {
    getImmunization();
  }, [selectedClientId]);

  const getImmunization = (e) => {
    setLoading(true);
    ApiHelper.getRequest(
      ApiUrls.GET_CLIENT_IMMUNIZATION_BY_CLIENT_ID +
        Encrption(selectedClientId) +
        "&isActive=" +
        1 +
        ""
    )
      .then((result) => {
        setImmunization(result.resultData);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error);
      });
  };

  const pageChange = (event) => {
    let skip = event.page.skip;
    let take = event.page.take;
    setPage(skip);
    setPageSize(take);
    let newValue = skip / take;
    let finalValue = newValue + 1;
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

  const handleRowClick = (field) => {
    //   if (field.id) {
    //     dispatch({
    //       type: SELECTED_STAFF_ID,
    //       payload: field.id,
    //     });
    navigate(AppRoutes.DETAIL_IMMUNIZATION, { state: field });
    //   }
  };
  const columnMenus = (props) => {
    return (
      <div>
        <GridColumnMenuSort {...props} data={immunization} />
      </div>
    );
  };
  const handleAddImmunization = () => {
    navigate(AppRoutes.ADD_IMMUNIZATION);
  };

  const handleConfirm = (ID) => {
    setConfirm(!confirm);
    setDeleteImmunizations(ID);
    if (confirm == false) {
      setScroll(true);
    } else {
      setScroll(false);
    }
  };
  const hideConfirmPopup = () => {
    setConfirm(false);
    setDeleteImmunizations("");
  };

  const handleEdit = (Id) => {
    navigate(AppRoutes.EDIT_IMMUNIZATION, { state: { id: Id } });
  };
  return (
    <div className="d-flex flex-wrap">
      <div className="inner-dt col-md-3 col-lg-2">
        <CustomDrawer />
      </div>
      <div className="col-md-9 col-lg-10">
        <ClientHeader />
        <div className="d-flex justify-content-between mt-3">
          <h4 className="address-title text-grey ">
            <span className="f-24">Immunizations</span>
          </h4>

          {userAccessPermission[permissionEnum.EDIT_CLIENT_PROFILE] && (
            <button
              onClick={handleAddImmunization}
              className="btn blue-primary text-white text-decoration-none d-flex align-items-center "
            >
              <img src={addIcon} alt="" className="me-2 add-img" />
              Add Immunization
            </button>
          )}
        </div>
        {loading === true && <Loader />}
        {immunization.length == 0 && !loading ? (
          <div className="message-not-found mt-3">
            No Immunizations Available
          </div>
        ) : (
          <div className="client-accept grid-table">
            <div className="address-line-content mt-3">
              <Grid
                data={orderBy(
                  immunization.slice(page, pageSize + page),
                  sort
                ).map((item) => ({
                  ...item,
                  [SELECTED_FIELD]: selectedState[idGetter(item)],
                }))}
                checkboxElement
                style={{
                  height: immunization.length > 0 ? "100%" : "250px",
                }}
                dataItemKey={DATA_ITEM_KEY}
                selectedField={SELECTED_FIELD}
                skip={page}
                take={pageSize}
                total={immunization.length}
                onPageChange={pageChange}
                //   onRowClick={handleRowClick}s
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

                <GridColumn
                  title="Immunization"
                  field="immunizationName"
                  // columnMenu={columnMenus}
                  cell={(props) => {
                    let field = props.dataItem;
                    return (
                      <td
                        className="anchar-pointer text-theme"
                        onClick={() => handleRowClick(field)}
                      >
                        {field.immunizationName}
                      </td>
                    );
                  }}
                />
                <GridColumn
                  title="Date Administered"
                  cell={(props) => {
                    let field = props.dataItem;
                    return (
                      <td className="cursor-default">
                        {field.dateAdministered === null
                          ? ""
                          : moment(field.dateAdministered).format("M/D/YYYY")}
                      </td>
                    );
                  }}
                />
                <GridColumn
                  // columnMenu={columnMenus}
                  field="amountAdministered"
                  title="Amount Administered (mL)"
                  className="cursor-default"
                />
                <GridColumn
                  // columnMenu={columnMenus}
                  field="administrationSiteName"
                  title="Administration Site"
                  className="cursor-default"
                />

                <GridColumn
                  field="isActive"
                  title="Rejected "
                  className="cursor-default"
                  cell={(props) => {
                    let field = props.dataItem.isRejected;
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
                {userAccessPermission[permissionEnum.EDIT_CLIENT_PROFILE] && (
                  <GridColumn
                    field="Action"
                    filterable={false}
                    cell={(props) => {
                      let field = props.dataItem.id;
                      return (
                        <td>
                          {" "}
                          <div
                            className="k-chip k-chip-md k-rounded-md k-chip-solid k-chip-solid-base"
                            onClick={() => {
                              handleConfirm(field);
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
                              handleEdit(field);
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
                )}
              </Grid>
              {confirm && (
                <DeleteImmunization
                  setScroll={setScroll}
                  selectedId={deleteImmunizations}
                  onClose={handleConfirm}
                  getImmunization={getImmunization}
                  hide={hideConfirmPopup}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImmunizationList;
