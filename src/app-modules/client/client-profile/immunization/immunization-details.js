import React from "react";
import {
  ListView,
  ListViewHeader,
  ListViewFooter,
} from "@progress/kendo-react-listview";
import { useLocation, useNavigate } from "react-router";
import AppRoutes from "../../../../helper/app-routes";
import moment from "moment";
import { renderErrors } from "src/helper/error-message-helper";


const ImmunizationDetails = () => {
    window.scrollTo(0, 0);
  const location = useLocation();
  const navigate = useNavigate();
  let immunizationInfo = location.state;

     const handleBackImmunization=()=>{
          navigate(AppRoutes.CLIENT_IMMUNIZATION);
     }
     const handleEditImmunization=()=>{
        navigate(AppRoutes.EDIT_IMMUNIZATION,{state:{id:location.state.id}});
     }

  return (
    <div className="row notenetic-container">
      <div className="col-md-12 col-xl-12 col-12 px-lg-4 mb-3">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="address-title text-grey">
            <span className="f-24">Immune Details</span>
          </h4>
          <div className="d-flex justify-content-between align-items-center ">
          <button onClick={handleBackImmunization} className="btn d-flex align-items-center mr-2 btn grey-secondary text-white  ">Back</button>
          <button onClick={handleEditImmunization} className="btn blue-primary-outline d-flex align-items-center"><span className="k-icon k-i-edit me-2" ></span>Edit</button>
          </div>
          

        </div>
        <div className="row">
          <div className="col-xl-6 col-md-12 mb-3">
            <ul className="list-unstyled mb-0 details-info firts-details-border position-relative">
              <li className="d-flex mb-3">
                <p className="mb-0 col-md-6">immunization</p>
                <p className="mb-0 fw-500 col-md-6">
                  {immunizationInfo.immunizationName}
                </p>
              </li>
              <li className="d-flex mb-3">
                <p className="mb-0 col-md-6">Date Administered</p>
                <p className="mb-0 fw-500 col-md-6">
                  {immunizationInfo.utcDateCreated===null ? "" : moment(immunizationInfo.utcDateCreated).format("M/D/YYYY")}
                </p>
              </li>
              <li className="d-flex mb-3">
                <p className="mb-0 col-md-6">Administered By</p>
                <p className="mb-0 fw-500 col-md-6">
                  {immunizationInfo.administeredByStaffName}
                </p>
              </li>
              <li className="d-flex mb-3">
                <p className="mb-0 col-md-6">Amount Administered</p>
                <p className="mb-0 fw-500 col-md-6">
                  {immunizationInfo.amountAdministered}
                </p>
              </li>

              <li className="d-flex mb-3">
                <p className="mb-0 col-md-6">Manufacturer</p>
                <p className="mb-0 fw-500 col-md-6">
                  {immunizationInfo.manufacturerName}
                </p>
              </li>

              <li className="d-flex mb-3">
                <p className="mb-0 col-md-6">Date Expiration</p>
                <p className="mb-0 fw-500 col-md-6">
                  {immunizationInfo.dateExpiration ===null ? "" : moment(immunizationInfo.dateExpiration).format("M/D/YYYY")}
                </p>
              </li>
              <li className="d-flex mb-3">
                <p className="mb-0 col-md-6">Lot Number</p>
                <p className="mb-0 fw-500 col-md-6">
                  {immunizationInfo.lotNumber}
                </p>
              </li>
              <li className="d-flex mb-3">
                <p className="mb-0 col-md-6">Administration Site</p>
                <p className="mb-0 fw-500 col-md-6">
                  {immunizationInfo.administrationSiteName}
                </p>
              </li>

              <li className="d-flex mb-3">
                <p className="mb-0 col-md-6">Administration Route</p>
                <p className="mb-0 fw-500 col-md-6">
                  {immunizationInfo.administrationRouteName}
                </p>
              </li>
            </ul>
          </div>
          <div className="col-xl-6 col-md-12 mb-3">
            <ul className="list-unstyled mb-0 details-info">
              <li className="d-flex mb-3">
                <p className="mb-0 col-md-6">Rejected</p>
                <p className="mb-0 fw-500 col-md-6">
                  {immunizationInfo.isRejected === true ? (
                    <span
                      className="fa fa-check-circle cursor-default  f-18"
                      style={{ color: "green" }}
                    ></span>
                  ) : (
                    <span
                      className="fa fa-times-circle cursor-default f-18"
                      style={{ color: "red" }}
                    ></span>
                  )}
                </p>
              </li>
              <li className="d-flex mb-3">
                <p className="mb-0 col-md-6">Rejected Reason</p>
                <p className="mb-0 fw-500 col-md-6">
                  {immunizationInfo.rejectedReason}
                </p>
              </li>
              <li className="d-flex mb-3">
                <p className="mb-0 col-md-6">Comments</p>
                <p className="mb-0 fw-500 col-md-6">
                  {immunizationInfo.comments}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImmunizationDetails;
