import * as React from "react";
import { useTableKeyboardNavigation } from "@progress/kendo-react-data-tools";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import {
  Grid,
  GridColumn,
  GRID_COL_INDEX_ATTRIBUTE,
} from "@progress/kendo-react-grid";
import { Tooltip } from "@progress/kendo-react-tooltip";
import { useEffect, useState } from "react";
import NotificationManager from "react-notifications/lib/NotificationManager";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import addIcon from "../../../assets/images/add.png";
import CustomDrawer from "../../../control-components/custom-drawer/custom-drawer";
import apiHelper from "../../../helper/api-helper";
import API_URLS from "../../../helper/api-urls";
import APP_ROUTES from "../../../helper/app-routes";
import { MaskFormatted } from "../../../helper/mask-helper";
import { showError } from "../../../util/utility";
import { Encrption } from "../../encrption";
import ClientHeader from "../client-profile/client-header/client-header";
import useModelScroll from "../../../cutomHooks/model-dialouge-scroll";
import Loading from "../../../control-components/loader/loader";
import DeleteDialogModal from "../../../control-components/custom-delete-dialog-box/delete-dialog";
import { permissionEnum } from "../../../helper/permission-helper";

const Physician = () => {
  //State

  const [loading, setLoading] = useState(false);
  const [physicianInfo, setPhysicianInfo] = useState([]);
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const [confirm, setConfirm] = useState(false);
  const [deletePhysicianId, setDeletePhysicianId] = useState();
  const [modelScroll, setScroll] = useModelScroll();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const userAccessPermission = useSelector( (state) => state.userAccessPermission);

  const navigate = useNavigate();

  function getPhysician() {
    setLoading(true);
    apiHelper
      .getRequest(
        API_URLS.GET_CLIENT_PHYSICIAN_BY_CLIENT_ID + Encrption(selectedClientId)
      )
      .then((result) => {
        setPhysicianInfo(
          result.resultData.map((physician) => {
            return {
              ...physician,
              phoneMask: MaskFormatted(physician.mobilePhone, "(999) 999-9999"),
            };
          })
        );
      })
      .catch((error) => {
        showError(error, "Fetch Documents");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    getPhysician();
  }, [selectedClientId]);

  // ------------Edit----

  function editPhysician(id) {
    navigate(APP_ROUTES.CLIENT_PHYSICIAN_ADD, { state: { id: id } });
  }

  // -------------Delete----

  const handleConfirm = (id) => {
    setConfirm(true);
    setDeletePhysicianId(id);
    setScroll(true);
  };

  const hideConfirmPopup = () => {
    setConfirm(false);
    setDeletePhysicianId();
    setScroll(false);
  };

  const handleDelete = () => {
    setLoading(true);
    apiHelper
      .deleteRequest(
        API_URLS.DELETE_CLIENT_PHYSICIAN + Encrption(deletePhysicianId)
      )
      .then((_) => {
        NotificationManager.success(" Physician deleted successfully");
        getPhysician();
        hideConfirmPopup();
      })
      .catch((error) => {
        showError(error.message, "Delete Physician");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const CustomActionCell = (props) => {
    const navigationAttributes = useTableKeyboardNavigation(props.id);
    return (
      <td
        colSpan={props.colSpan}
        role={"gridcell"}
        aria-colindex={props.ariaColumnIndex}
        aria-selected={props.isSelected}
        {...{ [GRID_COL_INDEX_ATTRIBUTE]: props.columnIndex }}
        {...navigationAttributes}
      >
        <div
          className="k-chip k-chip-md k-rounded-md k-chip-solid k-chip-solid-base"
          onClick={() => {
            handleConfirm(props.dataItem.id);
          }}
        >
          <div className="k-chip-content">
            <Tooltip anchorElement="target" position="top">
              <i className="fa fa-trash" aria-hidden="true" title="Delete" />
            </Tooltip>
          </div>
        </div>
        <div
          className="k-chip k-chip-md k-rounded-md k-chip-solid k-chip-solid-base m-2"
          onClick={() => {
            editPhysician(props.dataItem.id);
          }}
        >
          <div className="k-chip-content">
            <Tooltip anchorElement="target" position="top">
              <i className="fas fa-edit" title="Edit" />
            </Tooltip>
          </div>
        </div>
      </td>
    );
  };

  function pageChange(event) {
    let skip = event.page.skip;
    let take = event.page.take;

    setPage(skip);
    setPageSize(take);
  }

  return (
    <div className="d-flex flex-wrap">
      <div className="inner-dt col-md-3 col-lg-2">
        <CustomDrawer />
      </div>
      <div className="col-md-9 col-lg-10">
        <ClientHeader />
        <br></br>
        <div className="Service-RateList">
          <div className="d-flex justify-content-between  mt-3">
            <h4 className="address-title text-grey ">
              <span className="f-24">Physician</span>
            </h4>
            {loading && (
              <div>
                <Loading />
              </div>
            )}
                    {userAccessPermission[permissionEnum.EDIT_CLIENT_PROFILE] &&

            <button
              onClick={() => {
                navigate(APP_ROUTES.CLIENT_PHYSICIAN_ADD);
              }}
              className="btn blue-primary text-white text-decoration-none d-flex align-items-center"
            >
              <img src={addIcon} alt="" className="me-2 add-img" />
              Add Physician Info
            </button>
}
          </div>
          <br></br>
          {physicianInfo.length == 0 && !loading ? (
            <div className="message-not-found">No Physician Available</div>
          ) : (
            <div className="grid-table">
              <Grid
                data={physicianInfo.slice(page, pageSize + page)}
                skip={page}
                take={pageSize}
                onPageChange={pageChange}
                total={physicianInfo.length}
                className="pagination-row-cus"
                pageable={{
                  pageSizes: [10, 20, 30],
                }}
              >
                <GridColumn
                  field="firstName"
                  title="First Name"
                  width="250px"
                />
                <GridColumn field="lastName" title="Last Name" />
                <GridColumn field="phoneMask" title="Phone No." />
                <GridColumn field="address" title="Address" />
                <GridColumn field="comments" title="Comments" />
                {userAccessPermission[permissionEnum.EDIT_CLIENT_PROFILE] &&

                <GridColumn cell={CustomActionCell} title="Action" />
}
              </Grid>
            </div>
          )}
        </div>
        {confirm && (
          <DeleteDialogModal
            onClose={hideConfirmPopup}
            title="Physician"
            message="physician"
            handleDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};
export default Physician;
