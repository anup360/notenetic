import { Tooltip } from "@progress/kendo-react-tooltip";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { GET_CLIENT_INSURANCE } from "../../../../actions";
import addIcon from "../../../../assets/images/add.png";
import DeleteDialogModal from "../../../../control-components/custom-delete-dialog-box/delete-dialog";
import CustomDrawer from "../../../../control-components/custom-drawer/custom-drawer";
import Loader from "../../../../control-components/loader/loader";
import useModelScroll from "../../../../cutomHooks/model-dialouge-scroll";
import ApiHelper from "../../../../helper/api-helper";
import ApiUrls from "../../../../helper/api-urls";
import {
  default as AppRoutes,
  default as APP_ROUTES,
} from "../../../../helper/app-routes";
import { ClientService } from "../../../../services/clientService";
import { Encrption } from "../../../encrption";
import ClientHeader from "../client-header/client-header";
import { permissionEnum } from "../../../../helper/permission-helper";
import { renderErrors } from "src/helper/error-message-helper";

const Insurance = () => {
  const navigate = useNavigate();
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const [loading, setLoading] = useState(false);
  const [insurance, setInsurance] = useState([]);
  const [confirm, setConfirm] = useState(false);
  const [selectedInsuranceId, setSelectedInsuranceId] = useState("");
  const [modelScroll, setScroll] = useModelScroll();
  const dispatch = useDispatch();

  const userAccessPermission = useSelector((state) => state.userAccessPermission);


  const getInsuranceList = () => {
    setLoading(true);
    ApiHelper.getRequest(
      ApiUrls.GET_CLIENT_INSURANCE_LIST + Encrption(selectedClientId)
    )
      .then((result) => {
        const data = result.resultData;
        setInsurance(data);
        setLoading(false);
      })
      .catch((error) => {
        renderErrors(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    getInsuranceList();
  }, [selectedClientId]);

  // ------------Edit

  const handleEdit = (id) => {
    navigate(APP_ROUTES.EDIT_CLIENT_INSURANCE, { state: { InsuranceID: id } });
  };

  // -------------Delete

  const handleConfirm = (ID) => {
    setConfirm(true);
    setSelectedInsuranceId(ID);
    setScroll(true);
  };

  const hideConfirmPopup = () => {
    setConfirm(false);
    setSelectedInsuranceId("");
    setScroll(false);
  };
  const getCurrentInsurance = async () => {
    await ClientService.getClientCurrentInsurance(selectedClientId)
      .then((result) => {
        let insuranceList = result.resultData;
        dispatch({
          type: GET_CLIENT_INSURANCE,
          payload: result.resultData,
        });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const handleDelete = (id) => {
    ApiHelper.deleteRequest(ApiUrls.DELETE_INSURANCE + Encrption(id))
      .then((result) => {
        NotificationManager.success(" Insurance deleted successfully");
        getInsuranceList();
        hideConfirmPopup();
        getCurrentInsurance();
      })
      .catch((error) => {
        renderErrors(error.message);
      });
  };

  return (
    <div className="d-flex flex-wrap">
      {loading === true && <Loader />}
      <div className="inner-dt col-md-3 col-lg-2">
        <CustomDrawer />
      </div>
      <div className="col-md-9 col-lg-10">
        <ClientHeader />
        <div className="Service-RateList">
          <div className="d-flex justify-content-between  mt-3">
            <h4 className="address-title text-grey ">
              <span className="f-24">Insurance</span>
            </h4>
            {userAccessPermission[permissionEnum.EDIT_CLIENT_PROFILE] &&
              <button
                onClick={() => {
                  navigate(AppRoutes.ADD_CLIENT_INSURANCE);
                }}
                className="btn blue-primary text-white text-decoration-none d-flex align-items-center "
              >
                <img src={addIcon} alt="" className="me-2 add-img" />
                Add Insurance
              </button>
            }

          </div>
          {insurance.length == 0 && !loading ? (
            <div className="message-not-found">No Insurance Available</div>
          ) : (
            <div className="table-responsive table_view_dt mt-3">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Insurance</th>
                    <th scope="col"> Policy Number </th>
                    <th scope="col">Start Date</th>
                    <th scope="col">End Date</th>
                    <th scope="col">Primary</th>
                    <th scope="col">Insured is different?</th>
                    <th scope="col">Insured Info</th>
                    {userAccessPermission[permissionEnum.EDIT_CLIENT_PROFILE] &&
                      <th scope="col">Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {insurance.map((item) => (
                    <tr>
                      <td>{item.insuranceName}</td>
                      <td>{item.policyNumber}</td>
                      <td>{moment(item.dateStart).format("M/D/YYYY")}</td>
                      <td>
                        {" "}
                        {item.dateEnd !== null
                          ? moment(item.dateEnd).format("M/D/YYYY")
                          : ""}
                      </td>
                      <td>
                        {" "}
                        {item.isPrimary === true ? (
                          <span
                            className="fa fa-check-circle cursor-default  f-18"
                            style={{ color: "green" }}
                          ></span>
                        ) : (
                          <span className="fa fa-times-circle cursor-default f-18 cross-icon-color"></span>
                        )}
                      </td>
                      <td>
                        {item.isClientNotSubscriber === true ? (
                          <span
                            className="fa fa-check-circle cursor-default  f-18"
                            style={{ color: "green" }}
                          ></span>
                        ) : (
                          <span className="fa fa-times-circle cursor-default f-18 cross-icon-color"></span>
                        )}
                      </td>
                      <td>
                        {" "}
                        {item.subFirstName ||
                          item.subLastName ||
                          item.subDateOfBirth ||
                          item.subGender ||
                          item.subRelationName ||
                          item.subAddress ||
                          item.subCity ||
                          item.stateName ? (
                          <div>
                            <p className="mb-0">
                              {item.subFirstName} {item.subLastName}
                            </p>
                            <p className="mb-0">
                              <b>Dob</b>:{" "}
                              {item.subDateOfBirth === null
                                ? ""
                                : moment(item.subDateOfBirth).format(
                                  "M/D/YYYY"
                                )}
                            </p>
                            <p className="mb-0">
                              <b>Sex</b>: {item.subGender}
                            </p>
                            <p className="mb-0">
                              <b>Relation</b>: {item.subRelationName}
                            </p>
                            <p className="mb-0">
                              <b>Address</b>:{" "}
                              {item.subAddress ? item.subAddress + "," : ""}{" "}
                              {item.subCity ? item.subCity + "," : ""}{" "}
                              {item.stateName}
                              {/* {`${item.subAddress},${item.subCity}, ${item.stateName}`} */}
                            </p>
                            <p className="mb-0">
                              <b>Zip</b>: {item.subZip}
                            </p>
                          </div>
                        ) : (
                          ""
                        )}
                      </td>
                      {userAccessPermission[permissionEnum.EDIT_CLIENT_PROFILE] &&
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
                                  title="Delete"
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
                      }
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {confirm ? (
        <DeleteDialogModal
          title="insurance"
          message="insurance"
          onClose={hideConfirmPopup}
          handleDelete={() => {
            handleDelete(selectedInsuranceId);
          }}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default Insurance;
