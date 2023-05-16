import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NotificationManager } from "react-notifications";
import ApiUrls from "../../../helper/api-urls";
import ApiHelper from "../../../helper/api-helper";
import Loader from "../../../control-components/loader/loader";
import moment from "moment";
import DrawerContainer from "../../../control-components/custom-drawer/custom-drawer";
import ProfileHeader from "./staff-profile-header";
import { Encrption } from "../../encrption";
import { MaskFormatted } from "../../../helper/mask-helper";
import CustomSkeleton from "../../../control-components/skeleton/skeleton";
import {
  ExpansionPanel,
  ExpansionPanelContent,
} from "@progress/kendo-react-layout";
import { useNavigate } from "react-router";
import { GET_STAFF_DETAILS } from "../../../actions";
import { GET_STAFF_PROFILE_IMG } from "../../../actions/authActions";
import APP_ROUTES from "../../../helper/app-routes";
import BillingProfile from "./edit-billing-profile";
import { permissionEnum } from "../../../helper/permission-helper";
import { renderErrors } from "src/helper/error-message-helper";


const StaffProfile = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const selectedStaffId = useSelector((state) => state.selectedStaffId);
  const [staffInfo, setStaffInfo] = React.useState();
  const [showNewPass, setShowNewPass] = useState("socialSecurityNumber");
  const [expExpiringCertificate, setExpExpiringCertificate] = useState(true);
  const [expSignature, setExpSignature] = useState(true);
  const [expBillingProfilecard, setExpBillingProfileCard] = useState(true);
  const [billingProfileCardModal, setBillingProfileCardModal] = useState(false);
  const [signData, setSignData] = useState("");
  const [expiringCertificate, setExpiringCertificate] = React.useState([]);
  const [profilePic, setProfilePic] = React.useState("");
  const [billingProfileData, setBillingProfileData] = useState({});
  const navigate = useNavigate();
  const userAccessPermission = useSelector(
    (state) => state.userAccessPermission
  );

  useEffect(() => {
    if (selectedStaffId !== null) {
      getStaffProfileImg();
      getStaffDetail();
      getSignature();
      getStaffBillingProfile();
      window.scrollTo(0, 0);
    }
  }, [selectedStaffId]);

  const getStaffDetail = () => {
    // setLoading(true);
    let id = Encrption(selectedStaffId);
    ApiHelper.getRequest(ApiUrls.GET_STAFF_BY_ID + id)
      .then((result) => {
        dispatch({
          type: GET_STAFF_DETAILS,
          payload: result.resultData,
        });
        let staffDetail = result.resultData;
        setStaffInfo(staffDetail);
        getCertificateExpiration(staffDetail?.id);

        // setLoading(false);
      })
      .catch((error) => {
        // setLoading(false);
        renderErrors(error.message);
      });
  };
  const getCertificateExpiration = async (selecetdID) => {
    setLoading(true);
    let id = Encrption(selecetdID);
    ApiHelper.getRequest(ApiUrls.GET_STAFF_EXPIRING_CERTIFICATES + id)
      .then((result) => {
        setLoading(false);
        const data = result.resultData;
        setExpiringCertificate(data);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  const handleShowNewPass = () => {
    setShowNewPass(
      showNewPass === "socialSecurityNumber" ? "text" : "socialSecurityNumber"
    );
  };

  const getSignature = () => {
    setLoading(true);
    ApiHelper.getRequest(
      ApiUrls.GET_STAFF_SIGNATURE + Encrption(selectedStaffId)
    )
      .then((result) => {
        setLoading(false);
        if (result.resultData.length > 0) {
          let signList = result.resultData[0];
          setSignData("data:image/png;base64," + signList.signature);
        }
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const getStaffProfileImg = async () => {
    let id = Encrption(selectedStaffId);
    await ApiHelper.getRequest(ApiUrls.GET_STAFF_PROFILE + id)
      .then((result) => {
        setLoading(false);
        if (result.resultData !== null) {
          setProfilePic(result.resultData.staffProfileImageUrl);
          dispatch({
            type: GET_STAFF_PROFILE_IMG,
            payload: result.resultData,
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const getStaffBillingProfile = async () => {
    setLoading(true);
    let staffId = Encrption(selectedStaffId);
    ApiHelper.getRequest(ApiUrls.GET_STAFF_BILLING_PROFILE + staffId)
      .then((result) => {
        setLoading(false);
        const data = result.resultData;
        setBillingProfileData(data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleBillingProfileCard = () => {
    setBillingProfileCardModal(!billingProfileCardModal);
  };

  return (
    <div className="d-flex flex-wrap">
      {/* {loading == true && <Loader />} */}
      <div className="inner-dt col-md-3 col-lg-2">
        <DrawerContainer />
      </div>
      <div className="col-md-9 col-lg-10 ">
        <div className="staff-profile-page">
          <ProfileHeader
            profilePic={profilePic}
            getStaffDetail={getStaffProfileImg}
          />
          <div className="">
            <div className="col-md-12 col-xxl-10  col-12 pt_30">
              <h4 className="address-title text-grey pb_20">
                <span className="f-24">Personal Information</span>
              </h4>

              <div className="row">
                <div className="col-xl-6 col-md-12 mb-3">
                  <ul className="list-unstyled mb-0 details-info firts-details-border position-relative">
                    <li className="d-flex mb-3">
                      <p className="mb-0 col-md-6 fw-500">Username</p>
                      <p className="mb-0  col-md-6">
                        {!staffInfo ? (
                          <CustomSkeleton shape="text" />
                        ) : (
                          staffInfo.userName
                        )}
                      </p>
                    </li>

                    <li className="d-flex mb-3">
                      <p className="mb-0 col-md-6 fw-500">Gender</p>
                      <p className="mb-0  col-md-6">
                        {!staffInfo ? (
                          <CustomSkeleton shape="text" />
                        ) : (
                          staffInfo.genderName
                        )}
                      </p>
                    </li>

                    <li className="d-flex mb-3">
                      <p className="mb-0 col-md-6 fw-500">Gender at Birth</p>
                      <p className="mb-0  col-md-6">
                        {!staffInfo ? (
                          <CustomSkeleton shape="text" />
                        ) : (
                          staffInfo.genderAtBirth
                        )}
                      </p>
                    </li>
                    <li className="d-flex mb-3">
                      <p className="mb-0 col-md-6 fw-500">Marital Status</p>
                      <p className="mb-0  col-md-6">
                        {!staffInfo ? (
                          <CustomSkeleton shape="text" />
                        ) : (
                          staffInfo.maritalStatus
                        )}
                      </p>
                    </li>
                    <li className="d-flex mb-3">
                      <p className="mb-0 col-md-6 fw-500">Credentials</p>
                      <p className="mb-0  col-md-6">
                        {!staffInfo ? (
                          <CustomSkeleton shape="text" />
                        ) : (
                          staffInfo.credentials
                        )}
                      </p>
                    </li>
                    <li className="d-flex mb-3">
                      <p className="mb-0 col-md-6 fw-500">Address</p>
                      <p className="mb-0  col-md-6">
                        {!staffInfo ? (
                          <CustomSkeleton shape="text" />
                        ) : (
                          staffInfo.address
                        )}
                      </p>
                    </li>
                    <li className="d-flex mb-3">
                      <p className="mb-0 col-md-6 fw-500">City</p>
                      <p className="mb-0  col-md-6">
                        {!staffInfo ? (
                          <CustomSkeleton shape="text" />
                        ) : (
                          staffInfo.city
                        )}
                      </p>
                    </li>
                    <li className="d-flex mb-3">
                      <p className="mb-0 col-md-6 fw-500">State</p>
                      <p className="mb-0  col-md-6">
                        {!staffInfo ? (
                          <CustomSkeleton shape="text" />
                        ) : (
                          staffInfo.stateName
                        )}
                      </p>
                    </li>
                    <li className="d-flex mb-3">
                      <p className="mb-0 col-md-6 fw-500">Zip</p>
                      <p className="mb-0  col-md-6">
                        {!staffInfo ? (
                          <CustomSkeleton shape="text" />
                        ) : (
                          staffInfo.zip
                        )}
                      </p>
                    </li>
                  </ul>
                </div>
                <div className="col-xl-6 col-md-12 mb-3">
                  <ul className="list-unstyled mb-0 details-info">
                    <li className="d-flex mb-3">
                      <p className="mb-0 col-md-6 fw-500">Pronouns</p>
                      <p className="mb-0  col-md-6">
                        {!staffInfo ? (
                          <CustomSkeleton shape="text" />
                        ) : (
                          staffInfo.pronouns
                        )}
                      </p>
                    </li>
                    <li className="d-flex mb-3">
                      <p className="mb-0 col-md-6 fw-500">Suffix</p>
                      <p className="mb-0  col-md-6">
                        {!staffInfo ? (
                          <CustomSkeleton shape="text" />
                        ) : (
                          staffInfo.suffix
                        )}
                      </p>
                    </li>
                    <li className="d-flex mb-3">
                      <p className="mb-0 col-md-6 fw-500">SSN</p>

                      {!staffInfo ? (
                        <CustomSkeleton shape="text" />
                      ) : (
                        <p className="mb-0  col-md-6">
                          {staffInfo.socialSecurityNumber
                            ? showNewPass === "socialSecurityNumber"
                              ? "***-**-" +
                              String(staffInfo.socialSecurityNumber).slice(-4)
                              : MaskFormatted(
                                staffInfo.socialSecurityNumber.trim(),
                                "999-99-9999 "
                              )
                            : ""}
                          <span
                            onClick={handleShowNewPass}
                            className="cursor-pointer pl-3"
                          >
                            {userAccessPermission[
                              permissionEnum.EDIT_STAFF_PROFILE
                            ] && staffInfo.socialSecurityNumber ? (
                              showNewPass !== "socialSecurityNumber" ? (
                                <i className="far fa-eye text-theme"></i>
                              ) : (
                                <i className="far fa-eye-slash"></i>
                              )
                            ) : (
                              ""
                            )}
                          </span>
                        </p>
                      )}
                    </li>
                    <li className="d-flex mb-3">
                      <p className="mb-0 col-md-6 fw-500">Driver License #</p>
                      <p className="mb-0  col-md-6">
                        {!staffInfo ? (
                          <CustomSkeleton shape="text" />
                        ) : (
                          staffInfo.driverLicenseNumber
                        )}
                      </p>
                    </li>
                    <li className="d-flex mb-3">
                      <p className="mb-0 col-md-6 fw-500">
                        Driver License State{" "}
                      </p>
                      <p className="mb-0 col-md-6">
                        {!staffInfo ? (
                          <CustomSkeleton shape="text" />
                        ) : (
                          staffInfo.driverLicenseState
                        )}
                      </p>
                    </li>
                    <li className="d-flex mb-3">
                      <p className="mb-0 col-md-6 fw-500">Timezone</p>
                      <p className="mb-0  col-md-6">
                        {!staffInfo ? (
                          <CustomSkeleton shape="text" />
                        ) : (
                          staffInfo.timeZoneName
                        )}
                      </p>
                    </li>
                    <li className="d-flex mb-3">
                      <p className="mb-0 col-md-6 fw-500">
                        Emergency Contact Name
                      </p>
                      <p className="mb-0  col-md-6">
                        {!staffInfo ? (
                          <CustomSkeleton shape="text" />
                        ) : (
                          staffInfo.emergencyContactName
                        )}
                      </p>
                    </li>
                    <li className="d-flex mb-3">
                      <p className="mb-0 col-md-6 fw-500">
                        Emergeny Contact Phone
                      </p>
                      <p className="mb-0  col-md-6">
                        {!staffInfo ? (
                          <CustomSkeleton shape="text" />
                        ) : (
                          MaskFormatted(
                            staffInfo.emergenyContactPhone,
                            "(999) 999-9999"
                          )
                        )}
                      </p>
                    </li>
                    <li className="d-flex mb-3">
                      <p className="mb-0 col-md-6 fw-500">Hire Date</p>
                      <p className="mb-0  col-md-6">
                        {!staffInfo ? (
                          <CustomSkeleton shape="text" />
                        ) : staffInfo.hireDate === null ? (
                          ""
                        ) : (
                          moment(staffInfo.hireDate).format("M/D/YYYY")
                        )}
                      </p>
                    </li>
                    <li className="d-flex mb-3">
                      <p className="mb-0 col-md-6 fw-500">Termination Date</p>
                      <p className="mb-0  col-md-6">
                        {!staffInfo ? (
                          <CustomSkeleton shape="text" />
                        ) : staffInfo.terminationDate === null ? (
                          ""
                        ) : (
                          moment(staffInfo.terminationDate).format("M/D/YYYY")
                        )}
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* <div className="col-md-12 col-xl-8 col-12 ptb_30">
              <h4 className="address-title text-grey pb_20">
                <span className="f-24">Attachments</span>
              </h4>
              <div className="row"></div>
            </div> */}
          </div>
        </div>
        <section className="widgets-swection py-3 px-2">
          {loading === true && <Loader />}
          <h4 className="address-title text-grey col-md-12 px-1 mb-4">
            <span className="f-24"></span>
          </h4>
          <div className="row">
            <div className="col-md-6 col-xl-4 col-12 px-lg-3 mb-3">
              <div className="widget-box widget-box-cus-profile">
                <ExpansionPanel
                  title="Expiring/Expired Certificates"
                  expanded={expExpiringCertificate}
                  onAction={(e) => setExpExpiringCertificate(!e.expanded)}
                >
                  {expExpiringCertificate && (
                    <ExpansionPanelContent>
                      <div className="show-height-common white-scroll">
                        <ul className="list-unstyled mb-0 details-info">
                          {expiringCertificate.length == 0 && !loading && (
                            <div style={{ marginLeft: "100px" }}>
                              No Record Found
                            </div>
                          )}
                          <li className="client-list-sibling list-unstyled border mt-2">
                            {expiringCertificate.map((item, index) => {
                              return (
                                <li>
                                  {item.ecName}({item.certificationName})
                                  {"\u00a0\u00a0"}
                                  {"\u00a0\u00a0"}
                                  {"\u00a0\u00a0"}
                                  {"\u00a0\u00a0"}
                                  {"\u00a0\u00a0"}
                                  {"\u00a0\u00a0"}
                                  {"\u00a0\u00a0"}
                                  {"\u00a0\u00a0"}
                                  {"\u00a0\u00a0"}
                                  {moment(item.dateExpiration).format(
                                    "M/D/YYYY"
                                  )}
                                </li>
                              );
                            })}
                          </li>
                        </ul>
                      </div>
                    </ExpansionPanelContent>
                  )}
                </ExpansionPanel>
              </div>
            </div>
            <div className="col-md-6 col-xl-4">
              <div className="widget-box widget-box-cus-profile">
                <ExpansionPanel
                  title="Signature"
                  expanded={expSignature}
                  onAction={(e) => setExpSignature(!e.expanded)}
                >
                  {expSignature && (
                    <ExpansionPanelContent>
                      <div className="row outer">
                        <div className="inner mb-3 sign-border-profile ">
                          {signData.length > 0 ? (
                            ""
                          ) : (
                            <button
                              onClick={() =>
                                navigate(APP_ROUTES.STAFF_SIGNATURE)
                              }
                              className="btn blue-primary-outline btn-sm ml-2  default-head-btn mt-5"
                            >
                              Add Signature
                            </button>
                          )}

                          {signData ? (
                            <>
                              <img
                                style={{
                                  width: "300px",
                                  height: "100px",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  margin: "auto",
                                }}
                                src={signData}
                              />
                            </>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </ExpansionPanelContent>
                  )}
                </ExpansionPanel>
              </div>
            </div>

            <div className="col-md-6 col-xl-4 col-12 px-lg-3 mb-3">
              <div className="widget-box widget-box-cus-profile">
                <ExpansionPanel
                  title="Billing Profile"
                  expanded={expBillingProfilecard}
                  onAction={(e) => setExpBillingProfileCard(!e.expanded)}
                >
                  {expBillingProfilecard && (
                    <ExpansionPanelContent>
                      <div>
                        {userAccessPermission[
                          permissionEnum.EDIT_STAFF_PROFILE
                        ] && (
                            <div className="text-right">
                              <button
                                onClick={handleBillingProfileCard}
                                className="btn blue-primary-outline btn-sm "
                              >
                                <i className="k-icon k-i-edit pencile-edit-color"></i>{" "}
                                Edit
                              </button>
                            </div>
                          )}
                        <div className="">
                          <div>
                            <ul className="list-unstyled mb-0 details-info">
                              <li className="d-flex mb-3">
                                <p className="mb-0 col-md-6 mt-2 fw-500">
                                  Rendering NPI
                                </p>
                                <p className="mb-0  col-md-6 mt-2">
                                  {billingProfileData &&
                                    billingProfileData?.renderingNpi}
                                </p>
                              </li>
                              <li className="d-flex mb-3">
                                <p className="mb-0 col-md-6 fw-500">
                                  Rendering Taxonomy #
                                </p>
                                <p className="mb-0  col-md-6">
                                  {billingProfileData &&
                                    billingProfileData?.renderingTaxonomy}
                                </p>
                              </li>
                              <li className="d-flex mb-3">
                                <p className="mb-0 col-md-6 fw-500">
                                  Rendering MPN
                                </p>
                                <p className="mb-0 col-md-6">
                                  {billingProfileData &&
                                    billingProfileData?.renderingMpm}
                                </p>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </ExpansionPanelContent>
                  )}
                </ExpansionPanel>
              </div>
            </div>
          </div>
        </section>
        {billingProfileCardModal && (
          <BillingProfile
            onClose={handleBillingProfileCard}
            getStaffBillingProfile={getStaffBillingProfile}
            billingProfileData={billingProfileData}
          />
        )}
      </div>
    </div>
  );
};
export default StaffProfile;
