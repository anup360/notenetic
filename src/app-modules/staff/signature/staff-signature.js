import React, { Component, useEffect, useState, useRef } from "react";
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import Loader from "../../../control-components/loader/loader";
import CustomDrawer from "../../../control-components/custom-drawer/custom-drawer";
import SignatureCanvas from "react-signature-canvas";
import ProfileHeader from "./../staff-profile/staff-profile-header";
import InputKendoRct from "../../../control-components/input/input";
import InputPinKendoRct from "../../../control-components/pin-input-mask/pin-input-mask";
import ErrorHelper from "../../../helper/error-helper";
import { NotificationManager } from "react-notifications";
import ApiHelper from "../../../helper/api-helper";
import AppRoutes from "../../../helper/app-routes";
import ApiUrls from "../../../helper/api-urls";
import { Encrption } from "../../encrption";
import { renderErrors } from "src/helper/error-message-helper";

const StaffProfile = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [signData, setSignData] = useState("");
  const [onUpdateSign, setUpdateSign] = useState(false);
  const selectedStaffId = useSelector((state) => state.selectedStaffId);
  const staffId = useSelector((state) => state.loggedIn?.staffId);
  const profileImage = useSelector((state) => state.getProfileImg);
  const sigData = useRef({});
  const [fields, setFields] = useState({
    pin: "",
    confirm: "",
  });

  useEffect(() => {
    getSignature();
  }, []);

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

  const clearImage = () => {
    sigData.current.clear();
    setFields({
      ...fields,
      pin: "",
      confirm: "",
    });
  };
  const saveImage = () => {
    if (handleValidation()) {
      saveSignature();
      setImageUrl(sigData.current.getSignaturePad().toDataURL("image/png"));
    }
  };

  const saveSignature = () => {
    setLoading(true);
    var fileinput = sigData.current.getSignaturePad().toDataURL();
    var file = fileinput.split(",")[1];
    var data = {
      signBytes: file,
      staffId: selectedStaffId,
      pinNumber: fields.pin,
    };
    ApiHelper.postRequest(ApiUrls.CREATE_STAFF_SIGNATURE, data)
      .then((result) => {
        setUpdateSign(false);
        setLoading(false);
        getSignature();
        NotificationManager.success(result.message);
        setFields({
          ...fields,
          pin: "",
          confirm: "",
        });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error);
      });
  };

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;
    var emailPattern = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );
    var pattern = new RegExp(/^[0-9\b]+$/);

    if (!fields.pin || fields.pin.trim().length === 0) {
      formIsValid = false;
      errors["pin"] = ErrorHelper.FIELD_BLANK;
    } else if (fields.pin.trim().length != 4) {
      formIsValid = false;
      errors["pin"] = ErrorHelper.PIN_LENGTH;
    }
    if (!fields.confirm || fields.confirm.trim().length === 0) {
      formIsValid = false;
      errors["confirm"] = ErrorHelper.FIELD_BLANK;
    } else if (fields.confirm.trim().length != 4) {
      formIsValid = false;
      errors["confirm"] = ErrorHelper.PIN_LENGTH;
    } else if (fields.pin != fields.confirm) {
      formIsValid = false;
      errors["confirm"] = ErrorHelper.PIN_MATCH;
    }

    setErrors(errors);
    return formIsValid;
  };
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFields({
      ...fields,
      [name]: value,
    });
  };

  const handleUpdateSign = () => {
    setUpdateSign(true);
  };

  return (
    <div className="d-flex flex-wrap">
      <div className="inner-dt col-md-3 col-lg-2">
        <CustomDrawer />
      </div>
      <div className="col-md-9 col-lg-10">
        <div className="staff-profile-page">
          <ProfileHeader />
          <h4 className="address-title text-grey pt_20">
            <span className="f-24">Signature</span>
          </h4>
          {signData.length == 0 && !loading && (
            <div className="message-not-found mt-5 mr-5">
              No Signature Available
            </div>
          )}
          {loading == true ? (
            <Loader />
          ) : (
            <div className="upload-sign-file pt_30">
              <div className="col-md-8 mx-auto">
                <div className="row">
                  <div className="col-md-8 col-lg-8">
                    {signData == "" || onUpdateSign == true ? (
                      <div className="signature-upload">
                        {staffId === selectedStaffId ? (
                          <div>
                            <h4 className="address-title text-theme mb-3 ps-2">
                              Draw your signature
                            </h4>
                            <div
                              className="text-center border"
                              style={{ width: 502 }}
                            >
                              <SignatureCanvas
                                ref={sigData}
                                penColor="Black"
                                minDistance={"0.1"}
                                backgroundColor="#ffffff"
                                canvasProps={{
                                  width: 500,
                                  height: 200,
                                  className: "mt-1",
                                }}
                              />
                            </div>
                            <div className="text-right">
                              <button
                                type="text"
                                className="btn grey-secondary text-white mt-3"
                                onClick={clearImage}
                              >
                                Clear
                              </button>
                            </div>

                            <div className="pin mt-4">
                              <div className="mb-4">
                                <h6 className="address-title mb-2">Pin</h6>
                                <InputPinKendoRct
                                  onChange={handleChange}
                                  name="pin"
                                  label="PIN"
                                  value={fields.pin}
                                  error={errors.pin && errors.pin}
                                />
                              </div>
                              <div>
                                <h6 className="address-title mb-2">
                                  Confirm pin
                                </h6>
                                <InputPinKendoRct
                                  onChange={handleChange}
                                  name="confirm"
                                  label="Confirm"
                                  value={fields.confirm}
                                  error={errors.confirm && errors.confirm}
                                />
                              </div>
                            </div>
                            <div className="text-center d-flex  mt-3">
                              <div
                                onClick={() => {
                                  setUpdateSign(false);
                                }}
                              >
                                <button
                                  type="text"
                                  className="btn grey-secondary text-white"
                                >
                                  Cancel
                                </button>
                              </div>
                              <button
                                type="text"
                                className="btn blue-primary text-white  mx-3"
                                onClick={saveImage}
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    ) : (
                      ""
                    )}

                    {signData !== "" && onUpdateSign == false && (
                      <div className="signature mt-3">
                        <div className="d-flex justify-content-between align-itesm-center">
                          <h4 className="address-title text-theme mb-0">
                            Signature
                          </h4>
                          {staffId === selectedStaffId ? (
                            <button
                              onClick={handleUpdateSign}
                              className="btn blue-primary text-white"
                            >
                              Update Sign
                            </button>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="sign-show-img">
                          {signData ? <img src={signData} /> : ""}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default StaffProfile;
