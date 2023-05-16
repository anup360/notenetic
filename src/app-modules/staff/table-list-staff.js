/**
 * App.js Layout Start Here
 */
import React, { Component, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { NotificationManager } from "react-notifications";
import moment from "moment";
import ApiUrls from "../../helper/api-urls";
import AppRoutes from "../../helper/app-routes";
import ApiHelper from "../../helper/api-helper";
import { SELECTED_STAFF_ID } from "../../actions";
import {
  Grid,
  GridColumn,
  getSelectedState,
  GridNoRecords,
} from "@progress/kendo-react-grid";
import { useDispatch, useSelector } from "react-redux";
import { getter } from "@progress/kendo-react-common";
import Loading from "../../control-components/loader/loader";
import { Tooltip } from "@progress/kendo-react-tooltip";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { GridColumnMenuSort } from "@progress/kendo-react-grid";
import { orderBy } from "@progress/kendo-data-query";
import { filter } from "@progress/kendo-data-query/dist/npm/transducers";
import NOTIFICATION_MESSAGE from "../../../src/helper/notification-messages";
import useModelScroll from "../../cutomHooks/model-dialouge-scroll";
import { Encrption } from "../encrption";
import { restoreImage } from "../../assets/images/restore ne.svg";
import { MaskFormatted } from "../../helper/mask-helper";
import { permissionEnum } from "../../helper/permission-helper";
import { renderErrors } from "src/helper/error-message-helper";

const DATA_ITEM_KEY = "id";
const SELECTED_FIELD = "selected";
const idGetter = getter(DATA_ITEM_KEY);

const StaffTableList = ({ staffData, staffType, renderAPI }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState([]);
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const dispatch = useDispatch();
  const [isDeleteConfirm, setDeleteConfirm] = useState(false);
  const [selectedStafftId, setSelectedStaffId] = useState("");
  const selectedStaffId = useSelector((state) => state.selectedStaffId);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteUser, setDeleteUser] = useState("");
  const [tableview, setTableView] = useState(false);
  const [selectedState, setSelectedState] = React.useState({});
  const [modelScroll, setScroll] = useModelScroll();
  const staffLoginInfo = useSelector((state) => state.getStaffReducer);

  const userAccessPermission = useSelector(
    (state) => state.userAccessPermission
  );

  useEffect(() => {});

  const handleRowClick = (field) => {
    if (field.id) {
      dispatch({
        type: SELECTED_STAFF_ID,
        payload: field.id,
      });
      navigate(AppRoutes.STAFF_PROFILE);
    }
  };

  const deleteStaff = (id) => {
    setLoading(true);
    setDeleteConfirm(true);
    setSelectedStaffId(id);
    satffDelete();
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

  const pageChange = (event) => {
    let skip = event.page.skip;
    let take = event.page.take;
    setPage(skip);
    setPageSize(take);
  };

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
        <GridColumnMenuSort {...props} data={staffData} />
      </div>
    );
  };
  const dataStateChange = (event) => {
    setPage(event.dataState.skip);
    setPageSize(event.dataState.take);
    setSort(event.dataState.sort);
  };

  const showConfirmPopup = (obj) => {
    setShowConfirm(true);
    setDeleteUser(obj);
    setScroll(true);
  };
  const hideConfirmPopup = () => {
    setShowConfirm(false);
    setDeleteUser("");
    setScroll(false);
  };

  const satffDelete = () => {
    let deleteId = Encrption(deleteUser);
    setLoading(true);
    ApiHelper.deleteRequest(ApiUrls.DELETE_STAFF + deleteId)
      .then((result) => {
        setLoading(true);
        setDeleteConfirm(!isDeleteConfirm);
        hideConfirmPopup();
        NotificationManager.success(NOTIFICATION_MESSAGE.INACTIVE_STAFF);
        renderAPI({ hitted: true });
      })
      .catch((error) => {
        setLoading(false);
        setDeleteConfirm(!isDeleteConfirm);
        renderErrors(error.message);
      });
  };
  const activeStaff = () => {
    let deleteId = Encrption(deleteUser);
    setLoading(true);
    ApiHelper.getRequest(ApiUrls.ACTIVE_STAFF + deleteId)
      .then((result) => {
        setLoading(false);
        NotificationManager.success(NOTIFICATION_MESSAGE.ACTIVE_STAFF);
        renderAPI({ hitted: true });
        // getStaff(!staffType);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
    hideConfirmPopup();
  };

  const newObj = {
    sort: sort,
    take: page,
    skip: pageSize,
  };

  return (
    <div className="grid-table filter-grid">
      {showConfirm ? (
        <Dialog title={"Please confirm"} onClose={hideConfirmPopup}>
          <p
            style={{
              margin: "25px",
              textAlign: "center",
            }}
          >
            Are you sure you want to {!staffType ? "deactivate" : "reactivate"}?
          </p>
          <DialogActionsBar>
            {!staffType ? (
              <button
                className="btn blue-primary text-white"
                onClick={deleteStaff}
              >
                Yes
              </button>
            ) : (
              <button
                className="btn blue-primary text-white"
                onClick={activeStaff}
              >
                Yes
              </button>
            )}
            <button
              className="btn grey-secondary text-white"
              onClick={hideConfirmPopup}
            >
              No
            </button>
          </DialogActionsBar>
        </Dialog>
      ) : (
        ""
      )}
      <Grid
        data={orderBy(staffData, sort)
          .map((item) => ({
            ...item,
            [SELECTED_FIELD]: selectedState[idGetter(item)],
          }))
          .slice(page, pageSize + page)}
        checkboxElement
        style={{
          height: staffData.length > 0 ? "100%" : "250px",
        }}
        dataItemKey={DATA_ITEM_KEY}
        // selectedField={SELECTED_FIELD}
        skip={page}
        take={pageSize}
        total={staffData.length}
        onPageChange={pageChange}
        // onRowClick={handleRowClick}
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
        {/* <GridColumn filterable={false} field={SELECTED_FIELD} width="100px" /> */}
        <GridColumn field="id" title="ID" className="cursor-default" />
        <GridColumn
          title="Staff"
          field="firstName"
          cell={(props) => {
            let field = props.dataItem;
            return (
              <td
                className="anchar-pointer text-theme"
                onClick={() => handleRowClick(field)}
              >
                {`${field.lastName}, ${field.firstName}`}
              </td>
            );
          }}
        />
        <GridColumn
          // columnMenu={columnMenus}
          field="credentials"
          title="Credentials"
          className="cursor-default"
        />

        {/* <GridColumn
          field="lastName"
          title="Last Name"
          columnMenu={columnMenus}
          cell={(props) => {
            let field = props.dataItem;
            return (
              <td
                className="anchar-pointer text-theme"
                onClick={() => handleRowClick(field)}
              >
                {field.lastName}
              </td>
            );
          }}
        /> */}

        <GridColumn
          field="genderName"
          title="Gender"
          className="cursor-default"
        />
        <GridColumn
          // columnMenu={columnMenus}
          field="position"
          title="Position"
          className="cursor-default"
        />
        <GridColumn
          // columnMenu={columnMenus}
          field="phone"
          title="Phone"
          className="cursor-default"
          cell={(props) => {
            let field = props?.dataItem?.phone ? props?.dataItem?.phone : "";
            return (
              <td className="cursor-default">
                {MaskFormatted(field, "(999) 999-9999")}
              </td>
            );
          }}
        />
        <GridColumn
          // columnMenu={columnMenus}
          field="email"
          title="Email"
          className="cursor-default"
        />

        {staffLoginInfo?.roleId !== 3 && (
          <GridColumn
            title="Last Document"
            cell={(props) => {
              let field =
                props?.dataItem?.lastDocumentDate == null
                  ? ""
                  : moment(props?.dataItem?.lastDocumentDate).format(
                      "M/D/YYYY"
                    );
              return (
                <td className="cursor-default" onClick={handleRowClick}>
                  {field}
                </td>
              );
            }}
          />
        )}
        {staffLoginInfo?.roleId !== 3 && (
          <GridColumn
            title="Last Login"
            cell={(props) => {
              let field =
                props?.dataItem?.lastLogin == null
                  ? ""
                  : moment(props?.dataItem?.lastLogin).format("M/D/YYYY");
              return (
                <td className="cursor-default" onClick={handleRowClick}>
                  {field}
                </td>
              );
            }}
          />
        )}

        {staffLoginInfo?.roleId !== 3 && (
          <GridColumn
            title="# of Cases"
            cell={(props) => {
              let field =
                props?.dataItem?.caseloadCount == null
                  ? ""
                  : props?.dataItem?.caseloadCount;
              return (
                <td className="cursor-default" onClick={handleRowClick}>
                  {field}
                </td>
              );
            }}
          />
        )}

        {/* userAccessPermission[permissionEnum.DEACTIVATE_REACTIVATE_STAFF]  */}

        {staffLoginInfo?.roleId !== 3 && (
          <GridColumn
            filterable={false}
            title="Action"
            cell={(props) => {
              let field = props.dataItem.id;
              return (
                <td className="cursor-default">
                  <div onClick={() => showConfirmPopup(field)}>
                    <div className="k-chip-content">
                      <Tooltip anchorElement="target" position="top">
                        <i
                          className={
                            staffType == true
                              ? "fa fa-rotate-left"
                              : "fa fa-trash"
                          }
                          aria-hidden="true"
                          title={staffType == true ? "Reactivate" : "Delete"}
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
    </div>
  );
};
export default StaffTableList;
