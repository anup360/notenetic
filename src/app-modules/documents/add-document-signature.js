import { Dialog } from "@progress/kendo-react-dialogs";
import React, { useState } from "react";
import DatePickerKendoRct from "../../control-components/date-picker/date-picker";
import InputKendoRct from "../../control-components/input/input";
import TimePickerKendoRct from "../../control-components/time-picker/time-picker";
import ApiHelper from "../../helper/api-helper";
import API_URLS from "../../helper/api-urls";
import ErrorHelper from "../../helper/error-helper";
import { mergeDateAndTimeInToUtc } from "../../util/utility";
import DropDownKendoRct from "../../control-components/drop-down/drop-down";
import { Encrption } from "../encrption";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Loading from "../../control-components/loader/loader";
import moment from "moment";
const AddDocumentSignature = ({
  insertDocumentStaffSign,
  insertClientSignature /* (pin, sigDateTime) */,
  onClose,
  serviceDate,
  template,
  signStaffId,
  documentName,
  setIsParent,
  mainLoading,
}) => {
  // States
  const [isPinAvailable, setIsPinAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState({
    pinCode: undefined,
    signDate: undefined,
    signTime: undefined,
    signType: undefined,
  });
  const [errors, setErrors] = useState("");
  const [settingError, setSettingError] = useState(false);
  const [showPin, setShowPin] = useState("password");
  const [sigControlDisabled, setSigControlDisabled] = useState(true);
  const optionData = [
    "Staff Signature",
    "Client Signature",
    "Parent Signature",
  ];
  const staffId = useSelector((state) => state.loggedIn?.staffId);
  const [isButtonDisable, setButtonDisable] = useState(false);
  const [signText, setSignText] = useState("");

  /* ============================= useEffect functions ============================= */

  useEffect(() => {
    if (!template?.canApplyClientSig) {
      if (signStaffId == staffId) {
        setButtonDisable(true);
        setSignText("Signature already applied!");
      } else {
        setButtonDisable(false);
        setSignText("");
      }
    }
  });

  /* ============================= Private functions ============================= */

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;

    if (!fields.pinCode || fields.pinCode.trim().length === 0) {
      formIsValid = false;
      errors["pinCode"] = ErrorHelper.FIELD_BLANK;
    } else if (fields.pinCode.trim().length != 4) {
      formIsValid = false;
      errors["pinCode"] = ErrorHelper.PIN_LENGTH;
    } else if (isPinAvailable === false) {
      formIsValid = false;
      errors["pinCode"] = ErrorHelper.INVALID_PIN;
    }
    if (!fields.signDate) {
      formIsValid = false;
      errors["signDate"] = ErrorHelper.FIELD_BLANK;
    }
    if (!fields.signTime) {
      formIsValid = false;
      errors["signTime"] = ErrorHelper.FIELD_BLANK;
    }

    if (template?.canApplyClientSig) {
      if (!fields.signType) {
        formIsValid = false;
        errors["signType"] = ErrorHelper.FIELD_BLANK;
      }
    }

    setErrors(errors);
    return formIsValid;
  };

  const validateStaffPin = (pinCode) => {
    setLoading(true);
    ApiHelper.getRequest(API_URLS.VALIDATE_STAFF_PIN + Encrption(pinCode))
      .then((result) => {
        setIsPinAvailable(result.resultData && result.resultData.isValid);
      })
      .catch((_) => {
        setIsPinAvailable(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const validateClientPin = (pinCode) => {
    let signTypeCLient = fields.signType == "Parent Signature" ? true : false;
    setLoading(true);
    ApiHelper.getRequest(
      API_URLS.VALIDATE_CLIENT_PIN +
        "pin" +
        "=" +
        Encrption(pinCode) +
        "&" +
        "clientId" +
        "=" +
        documentName?.clientId +
        "&" +
        "isParentSig" +
        "=" +
        signTypeCLient
    )
      .then((result) => {
        setIsPinAvailable(result.resultData && result.resultData.isValid);
      })
      .catch((_) => {
        setIsPinAvailable(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /* ============================= Event functions ============================= */

  const handleShowPin = () => {
    setShowPin(showPin === "password" ? "text" : "password");
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setSigControlDisabled(false);
    if (name == "signType" && value == "Parent Signature") {
      setIsParent(true);
    }
    if (name == "signType" && value == "Client Signature") {
      setIsParent(false);
    }

    if (template?.canApplyClientSig) {
      if (name == "signType") {
        if (signStaffId == staffId && value == "Staff Signature") {
          setButtonDisable(true);
          setSignText("Signature already applied!");
        } else {
          setButtonDisable(false);
          setSignText("");
        }
      }
    }

    if (name === "pinCode") {
      if (value.length == 4) {
        if (fields.signType == "Client Signature") {
          validateClientPin(value);
        } else if (fields.signType == "Parent Signature") {
          validateClientPin(value);
        } else {
          validateStaffPin(value);
        }
      } else {
        setIsPinAvailable(false);
      }
    }
    setFields({ ...fields, [name]: value });
  };

  const handleSubmit = (event) => {
    setSettingError(true);
    if (handleValidation()) {
      if (fields.signType == "Client Signature") {
        insertClientSignature(
          fields.pinCode,
          fields.signDate,
          fields.signTime,
          fields.signType
        );
      } else if (fields.signType == "Parent Signature") {
        insertClientSignature(
          fields.pinCode,
          fields.signDate,
          fields.signTime,
          fields.signType
        );
      } else {
        insertDocumentStaffSign(
          fields.pinCode,
          fields.signDate,
          fields.signTime
          // mergeDateAndTimeInToUtc(fields.signDate, fields.signTime)
        );
      }
    }
  };

  /* ============================= Render functions ============================= */
  return (
    <Dialog
      onClose={onClose}
      title={"Apply Signature"}
      className="small-dailog"
    >
      {mainLoading && <Loading />}

      <div className="edit-client-popup ">
        {template?.canApplyClientSig && (
          <div className="mb-2 col-lg-12 col-md-12 col-12">
            <DropDownKendoRct
              data={optionData}
              onChange={handleChange}
              name="signType"
              value={fields.signType}
              required={true}
              validityStyles={settingError}
              error={!fields.signType && errors.signType}
              label="Select Type"
            />
          </div>
        )}

        <div className="mb-2 col-lg-12 col-md-12 col-12">
          <DatePickerKendoRct
            min={serviceDate}
            max={new Date()}
            onChange={handleChange}
            value={fields.signDate}
            name={"signDate"}
            title={"Signature Date"}
            required={true}
            validityStyles={settingError}
            error={!fields.signDate && errors.signDate}
            label={"Signature Date"}
            placeholder={""}
          />
        </div>

        <div className="mb-2 col-lg-12 col-md-12 col-12">
          <TimePickerKendoRct
            validityStyles={settingError}
            onChange={handleChange}
            placeholder="Signature Time"
            name={"signTime"}
            label={"Signature Time"}
            value={fields.signTime}
            required={true}
            error={!fields.signTime && errors.signTime}
            disabled={sigControlDisabled}
          />
        </div>

        <div className="mb-2 col-lg-12 col-md-12 col-12 ">
          <InputKendoRct
            value={fields.pinCode}
            onChange={handleChange}
            name="pinCode"
            label="Signature Pin"
            error={errors.pinCode ? errors.pinCode : ""}
            validityStyles={settingError}
            required={true}
            type={showPin}
            maxLength={4}
            loading={loading}
            minLength={4}
            disabled={sigControlDisabled}
          />
          <div onClick={handleShowPin} className="cursor-pointer eye-close">
            {showPin !== "password" ? (
              <i className="far fa-eye text-theme"></i>
            ) : (
              <i className="far fa-eye-slash"></i>
            )}
          </div>
        </div>
      </div>

      <p className="error-message">{signText}</p>

      <div className="border-bottom-line"></div>

      <div className="d-flex my-3 px-3">
        <div>
          <button
            onClick={handleSubmit}
            disabled={isButtonDisable}
            className="btn blue-primary text-white  mx-3"
          >
            Apply
          </button>
        </div>
        <div>
          <button className="btn grey-secondary text-white" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default AddDocumentSignature;
