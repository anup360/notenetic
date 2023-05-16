import { useTableKeyboardNavigation } from "@progress/kendo-react-data-tools";
import {
  Grid,
  GridColumn,
  GRID_COL_INDEX_ATTRIBUTE,
} from "@progress/kendo-react-grid";
import { Loader } from "@progress/kendo-react-indicators";
import * as React from "react";
import { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import addIcon from "../../../../assets/images/add.png";
import CustomDrawer from "../../../../control-components/custom-drawer/custom-drawer";
import apiHelper from "../../../../helper/api-helper";
import API_URLS from "../../../../helper/api-urls";
import AppRoutes from "../../../../helper/app-routes";
import { showError } from "../../../../util/utility";
import ClientHeader from "../client-header/client-header";
import { Encrption } from "../../../encrption";
import { MaskFormatted } from "../../../../helper/mask-helper";
import { Tooltip } from "@progress/kendo-react-tooltip";
import useModelScroll from "../../../../cutomHooks/model-dialouge-scroll";
import Loading from "../../../../control-components/loader/loader";
import DeleteDialogModal from "../../../../control-components/custom-delete-dialog-box/delete-dialog";
import { permissionEnum } from "../../../../helper/permission-helper";
import { renderErrors } from "src/helper/error-message-helper";


const GuardianParent = () => {
  //State
  const [loading, setLoading] = useState(false);
  const [guardianInfo, setGuardianInfo] = useState([]);
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const [confirm, setConfirm] = useState(false);
  const [deleteGuardianId, setDeleteGuardianId] = useState();
  const [modelScroll, setScroll] = useModelScroll();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const userAccessPermission = useSelector((state) => state.userAccessPermission);

  const navigate = useNavigate();

  function getGuardian() {
    setLoading(true);
    apiHelper
      .postRequest(
        API_URLS.GET_CLIENT_GUARDIANS_BY_CLIENT_ID + Encrption(selectedClientId)
      )
      .then((result) => {
        setGuardianInfo(
          result.resultData.map((guardian) => {
            return {
              ...guardian,
              phoneMask: MaskFormatted(guardian.phone, "(999) 999-9999"),
            };
          })
        );
      })
      .catch((err) => {
        showError(err, "Fetch Documents");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    getGuardian();
  }, [selectedClientId]);

  // ------------Edit----

  function editGuardian(id) {
    navigate(AppRoutes.CLIENT_GUARDIAN_ADD, { state: { id: id } });
  }

  // -------------Delete----

  const handleConfirm = (id) => {
    setConfirm(true);
    setDeleteGuardianId(id);
    setScroll(true);
  };

  const hideConfirmPopup = () => {
    setConfirm(false);
    setDeleteGuardianId("");
    setScroll(false);
  };

  const handleDelete = () => {
    setLoading(true);
    apiHelper
      .deleteRequest(
        API_URLS.DELETE_CLIENT_GUARDIANS + Encrption(deleteGuardianId)
      )
      .then((_) => {
        NotificationManager.success("Parent/Guardian deleted successfully");
        getGuardian();
        hideConfirmPopup();
      })
      .catch((error) => {
        showError(error.message, "Delete Guardian");
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
            editGuardian(props.dataItem.id);
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
        <div>
          <div className="d-flex justify-content-between">
            <h4 className="address-title text-grey ">
              <span className="f-24">Parent/Guardian</span>
            </h4>
            {loading && (
              <div>
                <Loading />
              </div>
            )}
            {userAccessPermission[permissionEnum.EDIT_CLIENT_PROFILE] &&

              <button
                onClick={() => {
                  navigate(AppRoutes.CLIENT_GUARDIAN_ADD);
                }}
                className="btn blue-primary text-white text-decoration-none d-flex align-items-center"
              >
                <img src={addIcon} alt="" className="me-2 add-img" />
                Add Guardian Info
              </button>
            }
          </div>
        </div>
        <br></br>
        {guardianInfo.length == 0 && !loading ? (
          <div className="message-not-found">No Parent/Guardian Available</div>
        ) : (
          <div className="grid-table">
            <Grid
              data={guardianInfo.slice(page, pageSize + page)}
              skip={page}
              take={pageSize}
              onPageChange={pageChange}
              total={guardianInfo.length}
              className="pagination-row-cus"
              pageable={{
                pageSizes: [10, 20, 30],
              }}
            >
              <GridColumn field="firstName" title="First Name" width="250px" />
              <GridColumn field="lastName" title="Last Name" />
              <GridColumn field="phoneMask" title="Phone No." />
              <GridColumn field="address" title="Address" />
              <GridColumn field="city" title="City" />
              <GridColumn field="stateName" title="State" />
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
          title="Guardian"
          message="guardian"
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default GuardianParent;
