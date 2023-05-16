import React, { useEffect, useState } from "react";
import AddCertificate from "./AddCertificate";
import ApiHelper from "../../../helper/api-helper";
import ApiUrls from "../../../helper/api-urls";
import { useSelector } from "react-redux";
import { NotificationManager } from "react-notifications";
import moment from "moment";
import EditCertificate from "./EditCertificate";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import Loader from "../../../control-components/loader/loader";
import addIcon from "../../../assets/images/add.png";
import { Tooltip } from "@progress/kendo-react-tooltip";
import { Encrption } from "../../encrption";
import useModelScroll from "../../../cutomHooks/model-dialouge-scroll";
import DeleteDialogModal from "../../../control-components/custom-delete-dialog-box/delete-dialog";
import { permissionEnum } from "../../../helper/permission-helper";
import { renderErrors } from "src/helper/error-message-helper";

const Certificate = () => {
  const staffId = useSelector((state) => state.selectedStaffId);
  const [addCertificate, setAddCertificate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [certificate, setCertificate] = useState([]);
  const [confirm, setConfirm] = useState(false);
  const [deleteCertificate, setDelteCertificate] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [SelectedEditId, setSelectedEditId] = useState("");
  const [modelScroll, setScroll] = useModelScroll();
  const userAccessPermission = useSelector(
    (state) => state.userAccessPermission
  );

  useEffect(() => {
    getCertificateList();
  }, []);

  const getCertificateList = () => {
    setLoading(true);
    let id = Encrption(staffId);
    ApiHelper.getRequest(ApiUrls.GET_STAFF_CERTIFICATE + id)
      .then((result) => {
        const data = result.resultData;
        setCertificate(data);
        setLoading(false);
      })
      .catch((error) => {
        renderErrors(error.message);
        setLoading(false);
      });
  };

  const handleAddService = () => {
    setAddCertificate(true);
    setScroll(true);
  };

  const handleClose = () => {
    setAddCertificate(false);
    setIsEdit(false);
    setScroll(false);
  };

  const handleConfirm = (ID) => {
    setConfirm(true);
    setDelteCertificate(ID);
    setScroll(true);
  };

  const hideConfirmPopup = () => {
    setConfirm(false);
    setDelteCertificate("");
    setScroll(false);
  };

  const handleDelete = () => {
    let DeleteId = Encrption(deleteCertificate);
    ApiHelper.deleteRequest(ApiUrls.DELETE_STAFF_CERTIFICATE + DeleteId)
      .then((result) => {
        NotificationManager.success("Certificate deleted successfully");
        getCertificateList();
        hideConfirmPopup();
      })
      .catch((error) => {
        renderErrors(error.message);
      });
  };
  const handleEdit = (certificateID) => {
    setIsEdit(true);
    setSelectedEditId(certificateID);
    setScroll(true);
  };

  return (
    <div className="container">
      {loading === true && <Loader />}
      <div className="row justify-content-center">
        <div className="d-flex justify-content-between mb-3 mt-3">
          <h4 className="address-title text-grey ">
            <span className="f-24">Certifications</span>
          </h4>
          {userAccessPermission[permissionEnum.MANAGE_CERTIFICATIONS] && (
            <button
              onClick={handleAddService}
              className="btn blue-primary text-white text-decoration-none d-flex align-items-center "
            >
              <img src={addIcon} alt="" className="me-2 add-img" />
              Add Certification{" "}
            </button>
          )}
        </div>
        {certificate.length == 0 && !loading ? (
          <div className="message-not-found">No Certification Available</div>
        ) : (
          <div className="table-responsive table_view_dt ">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Certifications</th>
                  <th scope="col">Issue Date </th>
                  <th scope="col">Expiration Date</th>
                  <th scope="col">Completed</th>
                  {userAccessPermission[
                    permissionEnum.MANAGE_CERTIFICATIONS
                  ] && <th scope="col">Action</th>}
                </tr>
              </thead>

              <tbody>
                {certificate.map((item) => (
                  <tr>
                    <td>{item.certificationName}</td>
                    <td>{moment(item.dateIssued).format("M/D/YYYY")}</td>
                    <td>
                      {" "}
                      {item.dateEnd !== null
                        ? moment(item.dateExpiration).format("M/D/YYYY")
                        : ""}
                    </td>
                    <td>
                      {" "}
                      {item.complete === true ? (
                        <span
                          className="fa fa-check-circle cursor-default  f-18"
                          style={{ color: "green" }}
                        ></span>
                      ) : (
                        <span className="fa fa-times-circle cursor-default f-18 cross-icon-color"></span>
                      )}
                    </td>

                    {userAccessPermission[
                      permissionEnum.MANAGE_CERTIFICATIONS
                    ] && (
                      <td>
                        {" "}
                        <div
                          className="k-chip k-chip-md k-rounded-md k-chip-solid k-chip-solid-base"
                          onClick={() => {
                            handleConfirm(item.id);
                          }}
                        >
                          <div className="k-chip-content">
                            <Tooltip anchorElement="target" position="top">
                              <i
                                className="fa fa-trash"
                                aria-hidden="true"
                                title="Delete Certification"
                              ></i>
                            </Tooltip>
                          </div>
                        </div>
                        <div
                          className="k-chip k-chip-md k-rounded-md k-chip-solid k-chip-solid-base m-2"
                          onClick={() => {
                            handleEdit(item.id);
                          }}
                        >
                          <div className="k-chip-content">
                            <Tooltip anchorElement="target" position="top">
                              <i className="fas fa-edit" title="Edit"></i>
                            </Tooltip>
                          </div>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {addCertificate && (
          <AddCertificate
            onClose={handleClose}
            certificateList={getCertificateList}
          />
        )}
        {isEdit && (
          <EditCertificate
            onClose={handleClose}
            id={SelectedEditId}
            certificateList={getCertificateList}
          />
        )}
        {confirm ? (
          <DeleteDialogModal
            onClose={hideConfirmPopup}
            title="Certification"
            message="certification"
            handleDelete={handleDelete}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Certificate;
