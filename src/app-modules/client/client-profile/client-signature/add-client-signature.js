import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import Loader from "../../../../control-components/loader/loader";
import SignatureCanvas from "react-signature-canvas";
import InputPinKendoRct from "../../../../control-components/pin-input-mask/pin-input-mask";
import ErrorHelper from "../../../../helper/error-helper";
import { NotificationManager } from "react-notifications";
import ApiHelper from "../../../../helper/api-helper";
import ApiUrls from "../../../../helper/api-urls";
import CustomDrawer from "../../../../control-components/custom-drawer/custom-drawer";
import ClientHeader from "../client-header/client-header";
import AppRoutes from "../../../../helper/app-routes";
import { renderErrors } from "src/helper/error-message-helper";

const AddClientSignature = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [signData, setSignData] = useState("");
  const [onUpdateSignModal, setUpdateSignModal] = useState(false);
  const [updateValue, setUpdateValue] = useState();
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const [settingError, setSettingError] = useState(false);

  const sigData = useRef({});
  const { state } = location;
  const [fields, setFields] = useState({
    pin: "",
    confirm: "",
    firstName: "",
    lastName: "",
    dropdownName: "",
  });

  const clearImage = () => {
    sigData.current.clear();
    setFields({
      ...fields,
      pin: "",
      confirm: "",
    });
  };
  const saveImage = () => {
    setSettingError(true);

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
      clientId: selectedClientId,
      pinNumber: fields.pin,
      isParentSig: false,
      parentLastName: fields.lastName,
      parentFirstName: fields.firstName,
    };

    ApiHelper.postRequest(ApiUrls.CREATE_CLIENT_SIGNATURE, data)
      .then((result) => {
        setUpdateSignModal(false);
        setLoading(false);
        NotificationManager.success(result.message);
        navigate(AppRoutes.CLIENT_SIGNATURE);
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

    if (!fields.pin && fields.pin.trim().length === 0) {
      formIsValid = false;
      errors["pin"] = ErrorHelper.FIELD_BLANK;
    } else if (fields.pin.trim().length < 3) {
      formIsValid = false;
      errors["pin"] = ErrorHelper.PIN_LENGTH;
    }
    if (!fields.confirm || fields.confirm.trim().length === 0) {
      formIsValid = false;
      errors["confirm"] = ErrorHelper.FIELD_BLANK;
    } else if (fields.pin !== fields.confirm) {
      formIsValid = false;
      errors["confirm"] = ErrorHelper.PIN_MATCH;
    }
    if (sigData.current.getSignaturePad()._data.length == 0) {
      formIsValid = false;
      renderErrors("Please add signature");
    }
    setErrors(errors);
    return formIsValid;
  };
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if(name === "pin" || name ==="confirm"){
      handleValidation()
    }
    setFields({
      ...fields,
      [name]: value,
    });
  };

  const handleUpdateSign = (value) => {
    setUpdateSignModal(true);
    setUpdateValue(value);
  };

  return (
    <div className="d-flex flex-wrap">
      <div className="inner-dt col-md-3 col-lg-2">
        <CustomDrawer />
      </div>
      <div className="col-md-9 col-lg-10">
        <div className="staff-profile-page">
          <ClientHeader />
          <div
            style={{
              display: "felx",
              justifyContent: "space-between",
            }}
            className="d-flex "
          >
            <h4 className="address-title text-grey pt_20">
              <span className="f-24">Signature</span>
            </h4>
          </div>

          {loading == true ? (
            <Loader />
          ) : (
            <div className="upload-sign-file pt_30">
              <div className="col-md-8 mx-auto">
                <div className="row">
                  <div className="col-md-8 col-lg-7">
                    {signData == "" || onUpdateSignModal == true ? (
                      <div className="signature-upload">
                        <h4 className="address-title text-theme mb-3 ps-2">
                          Draw Client Signature
                        </h4>
                        <div
                          className="text-center border"
                          style={{ width: "502px" }}
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
                          <span>Pin</span>
                          <div className="mb-4">
                            <InputPinKendoRct
                              value={fields.pin}
                              onChange={handleChange}
                              name="pin"
                              label="Pin"
                              error={errors.pin}
                              required={true}
                              type={"password"}
                              validityStyles={settingError}
                              minLength={4}
                              maxLength={4}
                            />
                          </div>
                          <span>Confirm Pin</span>
                          <div>
                            <InputPinKendoRct
                              onChange={handleChange}
                              name="confirm"
                              label="Confirm Pin"
                              value={fields.confirm}
                              error={errors.confirm}
                              required={true}
                              type={"password"}
                              validityStyles={settingError}
                              minLength={4}
                              maxLength={4}
                            />
                          </div>
                        </div>
                        <div className="text-center d-flex  mt-3">
                          <button
                            type="text"
                            className="btn blue-primary text-white"
                            onClick={saveImage}
                          >
                            Save
                          </button>
                          <div
                            onClick={() => {
                              navigate(AppRoutes.CLIENT_SIGNATURE);
                            }}
                            className="right-sde-grey"
                          >
                            <button
                              type="text"
                              className="btn grey-secondary text-white ml-3"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}

                    {signData !== "" &&
                      onUpdateSignModal == false &&
                      signData.map((item) => {
                        return (
                          <div className="signature mt-3">
                            <div className="d-flex justify-content-between align-itesm-center">
                              <h4 className="address-title text-theme mb-0">
                                {item.isParentSig
                                  ? "Parent Signature "
                                  : "Client Signature"}
                              </h4>
                              <button
                                onClick={() =>
                                  handleUpdateSign(item.isParentSig)
                                }
                                className="btn blue-primary-outline text-white"
                              >
                                {item.isParentSig
                                  ? "Update Parent Sign"
                                  : "Update Client Sign"}
                              </button>
                            </div>
                            <div className="sign-show-img">
                              {item.isParentSig ? (
                                <img
                                  src={
                                    "data:image/png;base64," + item.signBytes
                                  }
                                />
                              ) : (
                                <img
                                  src={
                                    "data:image/png;base64," + item.signBytes
                                  }
                                />
                              )}
                            </div>
                          </div>
                        );
                      })}
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
export default AddClientSignature;
