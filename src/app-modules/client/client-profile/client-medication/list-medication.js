import * as React from "react";
import { useTableKeyboardNavigation } from "@progress/kendo-react-data-tools";
import {
  Grid,
  GridColumn,
  GRID_COL_INDEX_ATTRIBUTE,
} from "@progress/kendo-react-grid";
import { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
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
import AddMedication from "./add-medication";
import EditMedication from "./add-medication";

import { SELECTED_CLIENT_ID } from "../../../../actions";

import ListMedNotes from "./list-med-notes";

import AddMedNotes from "./add-med-notes";
import APP_ROUTES from "../../../../helper/app-routes";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

const MedicationList = () => {
  //State
  const [loading, setLoading] = useState(false);
  const [medicationInfo, setMedicationInfo] = useState([]);
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const [confirm, setConfirm] = useState(false);
  const [deleteMedicateId, setDeleteMedicateId] = useState();
  const [modelScroll, setScroll] = useModelScroll();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const userAccessPermission = useSelector(
    (state) => state.userAccessPermission
  );
  const [isAddMedication, setAddMedication] = useState(false);
  const [selectedMedId, setSelectedMedId] = useState();
  const dispatch = useDispatch();

  const [setIsAddNotes, setAddNotes] = useState(false);

  const [notesInfo, setNoteInfo] = useState([]);

  const [isEditMedication, setEditMedication] = useState(false);

  const navigate = useNavigate();

  function getClientMedication() {
    setLoading(true);
    apiHelper
      .getRequest(
        API_URLS.GET_CLIENT_MEDICATION_BY_CLIENT_ID +
          Encrption(selectedClientId) +
          "&isActive=true"
      )
      .then((result) => {
        setMedicationInfo(result.resultData);
      })
      .catch((err) => {
        renderErrors(err, "Fetch Medications");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function getClientMedNotes() {
    setLoading(true);
    apiHelper
      .getRequest(API_URLS.GET_CLIENT_MED_NOTES + Encrption(selectedClientId))
      .then((result) => {
        setNoteInfo(result.resultData);
      })
      .catch((err) => {
        renderErrors(err, "Fetch Medication Notes");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    getClientMedication();
    getClientMedNotes();
  }, [selectedClientId]);

  // ------------Edit----

  function editMedication(id) {
    setSelectedMedId(id);
    setEditMedication(true);
  }

  // -------------Delete----

  const handleConfirm = (id) => {
    setConfirm(true);
    setDeleteMedicateId(id);
    setScroll(true);
  };

  const hideConfirmPopup = () => {
    setConfirm(false);
    setDeleteMedicateId("");
    setScroll(false);
  };

  const handleDelete = () => {
    setLoading(true);
    apiHelper
      .deleteRequest(
        API_URLS.DELETE_CLIENT_MEDICATION + Encrption(deleteMedicateId)
      )
      .then((_) => {
        NotificationManager.success("Medication deleted successfully");
        getClientMedication();
        hideConfirmPopup();
      })
      .catch((error) => {
        showError(error.message, "Delete Medication");
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
            editMedication(props.dataItem.id);
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

  const handleCloseMed = ({ isAdded }) => {
    if (isAdded) {
      getClientMedication();
    }
    setAddMedication(false);
    setEditMedication(false);
    setScroll(false);
  };

  const handleCloseNotes = ({ isAdded }) => {
    if (isAdded) {
      getClientMedNotes();
    }
    setAddNotes(false);
    setScroll(false);
  };

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
              <span className="f-24">Medication Administrations</span>
            </h4>
            {loading && (
              <div>
                <Loading />
              </div>
            )}
            {userAccessPermission[permissionEnum.EDIT_CLIENT_PROFILE] && (
              <>
                <button
                  onClick={() => {
                    setAddMedication(true);
                    setScroll(true);
                  }}
                  className="btn blue-primary text-white text-decoration-none d-flex align-items-center"
                >
                  <img src={addIcon} alt="" className="me-2 add-img" />
                  Add Medication Administrations
                </button>
              </>
            )}
          </div>
        </div>
        <br></br>
        <div className="row">
          <div className="col-md-8">
            <div>
              {medicationInfo.length == 0 && !loading ? (
                <div className="message-not-found">
                  No Medication Administrations{" "}
                </div>
              ) : (
                <div className="grid-table">
                  <Grid
                    data={medicationInfo.slice(page, pageSize + page)}
                    skip={page}
                    take={pageSize}
                    onPageChange={pageChange}
                    total={medicationInfo.length}
                    className="pagination-row-cus"
                    pageable={{
                      pageSizes: [10, 20, 30],
                    }}
                  >
                    <GridColumn field="medicationName" title="Medication" />

                    <GridColumn
                      title="Date"
                      cell={(props) => {
                        let field = props.dataItem;
                        return (
                          <td className="cursor-default">
                            {moment(field.dateAdministered).format("M/D/YYYY")}
                          </td>
                        );
                      }}
                    />

                    <GridColumn field="dosage" title="Dosage" />
                    <GridColumn field="route" title="Route" />
                    <GridColumn field="initials" title="Initials" />
                    <GridColumn field="notes" title="Notes" />
                    {userAccessPermission[
                      permissionEnum.EDIT_CLIENT_PROFILE
                    ] && <GridColumn cell={CustomActionCell} title="Action" />}
                  </Grid>
                </div>
              )}
            </div>
          </div>
          <div className="col-md-4">
            <ListMedNotes
              notesInfo={notesInfo}
              setAddNotes={setAddNotes}
              setScroll={setScroll}
            />
          </div>
        </div>
      </div>
      {confirm && (
        <DeleteDialogModal
          onClose={hideConfirmPopup}
          title="Medication"
          message="medication"
          handleDelete={handleDelete}
        />
      )}

      {isAddMedication && <AddMedication onClose={handleCloseMed} />}

      {isEditMedication && (
        <EditMedication
          onClose={handleCloseMed}
          selectedMedId={selectedMedId}
        />
      )}

      {setIsAddNotes && <AddMedNotes onClose={handleCloseNotes} />}
    </div>
  );
};

export default MedicationList;
