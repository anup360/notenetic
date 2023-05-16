import React, { useEffect, useState } from "react";
import ErrorHelper from "../../helper/error-helper";
import { NotificationManager } from "react-notifications";
import Loader from "../loader/loader";
import { Dialog } from "@progress/kendo-react-dialogs";
import { ClientService } from "../../services/clientService";
import InputKendoRct from "../input/input";
import { useSelector } from "react-redux";
import DropDownKendoRct from "../drop-down/drop-down";
import API_URLS from "../../helper/api-urls";
import ApiHelper from "../../helper/api-helper";
import DatePickerKendoRct from "../date-picker/date-picker";
import TimePickerKendoRct from "../time-picker/time-picker";
import InputPinKendoRct from "../../control-components/pin-input-mask/pin-input-mask";
import { Encrption } from "../../app-modules/encrption";
import { renderErrors } from "src/helper/error-message-helper";


const optionData = ["Staff Signature", "Client Signature", "Parent Signature"];

const AddClientTreatmentSign = ({
  onClose,
  isParentSign,
  isClientSign,
  signStaffId,
  setSignStaffId,
  treatmentPlan,
  showInactivePlans,
  isHaveStaffSign,
  isHaveClientSign
}) => {
  let [fields, setFields] = useState({
    pinCode: "",
    signType: "",
    signDate: "",
    signTime: "",
  });
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [settingError, setSettingError] = useState(false);
  const [showNewPin, setShowNewPin] = useState("password");
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const staffId = useSelector((state) => state.loggedIn?.staffId);
  const [isPinAvailable, setIsPinAvailable] = useState(true);
  const [isButtonDisable, setButtonDisable] = useState(false);
  const [parent, setParent] = useState(false);
  const [planId, setPlanId] = useState();
  const [signText, setSignText] = useState("");
  const [sigControlDisabled, setSigControlDisabled] = useState(true)




  useEffect(() => {
    // let plan = treatmentPlan?.filter(item=>item.activeParticipant === true);
    
    setPlanId(treatmentPlan[0]?.id);
  }, []);

  const validateClientPin = async (pinCode) => {
    await ClientService.validateTreatmentPlanPin(
      fields,
      Encrption(pinCode),
      selectedClientId
    )
      .then((result) => {
        if (result.resultData === null) {
          setIsPinAvailable(false);
        } else {
          setIsPinAvailable(true);
        }
      })
      .catch((error) => {
        setIsPinAvailable(false);
      });
  };

  const validateStaffPin = (pinCode) => {
    ApiHelper.getRequest(API_URLS.VALIDATE_STAFF_PIN + Encrption(pinCode))
      .then((result) => {
        if (result.resultData === null) {
          setIsPinAvailable(false);
        } else {
          setIsPinAvailable(true);
        }
      })
      .catch((error) => {
        setIsPinAvailable(false);
      });
  };

  const insertClientSignature = async () => {
    setLoading(true);
    
    await ClientService.InsertClientTreatmentPlanSign(fields, selectedClientId, planId)
      .then((result) => {
        setLoading(false);
        NotificationManager.success("Signature applied successfully");
        onClose({ isAdded: true });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors("Something went wrong");
      });
  };

  const insertStaffSignature = async () => {
    setLoading(true);
       
    await ClientService.InsertStaffTreatmentPlanSign(
      fields,
      selectedClientId,
      staffId,
      planId,
    )
      .then((result) => {
        setLoading(false);
        NotificationManager.success("Signature applied successfully");
        onClose({ isAdded: true });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors("Something went wrong");
      });
  };

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;

    if (!fields.pinCode || fields.pinCode.trim().length === 0) {
      formIsValid = false;
      errors["pinCode"] = ErrorHelper.FIELD_BLANK;
    } else if (fields.pinCode.trim().length !== 4) {
      formIsValid = false;
      errors["pinCode"] = ErrorHelper.PIN_LENGTH;
    } else if (isPinAvailable === false) {
      formIsValid = false;
      errors["pinCode"] = ErrorHelper.INVALID_PIN;
    }
    if (!fields.signType) {
      formIsValid = false;
      errors["signType"] = ErrorHelper.FIELD_BLANK;
    }
    if (!fields.signDate) {
      formIsValid = false;
      errors["signDate"] = ErrorHelper.FIELD_BLANK;
    }
    if (!fields.signTime) {
      formIsValid = false;
      errors["signTime"] = ErrorHelper.FIELD_BLANK;
    }
    setErrors(errors);
    return formIsValid;
  };



  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setSigControlDisabled(false);

    if (name === "signType") {
      if (
        (isClientSign === true && isHaveClientSign.length > 0 && value === "Client Signature") ||
        (isParentSign === true && isHaveClientSign.length > 0 && value === "Parent Signature") ||
        (signStaffId === staffId && isHaveStaffSign.length > 0   && value === "Staff Signature")
      ) {
        setButtonDisable(true);
        setSignText("Signature already applied!");
      } else {
        setButtonDisable(false);
        setSignText("");
      }
    }
    if (name === "pinCode") {
      if (value.length === 4) {
        if (fields.signType === "Staff Signature") {
          validateStaffPin(value);
        } else {
          validateClientPin(value);
        }
      }
    }
    setFields({
      ...fields,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    setSettingError(true);
    
    if (handleValidation()) {
      if (fields.signType === "Staff Signature") {
       
        insertStaffSignature();
        
      } else {
        insertClientSignature();
      }
    }
  };

  const handleShowPin = () => {
    setShowNewPin(showNewPin === "password" ? "text" : "password");

    
  };

  return (
    <Dialog
      onClose={onClose}
      title={"Apply Signature"}
      className="small-dailog"
    >
      <div className="edit-client-popup ">
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

        <div className="mb-2 col-lg-12 col-md-12 col-12">
          <DatePickerKendoRct
            onChange={handleChange}
            value={fields.signDate}
            name={"signDate"}
            title={"Signature Date"}
            required={true}
            validityStyles={settingError}
            error={!fields.signDate && errors.signDate}
            label={"Signature Date"}
            placeholder={""}
            disabled={sigControlDisabled}
          />
        </div>

        <div className="mb-2 col-lg-12 col-md-12 col-12">
          <TimePickerKendoRct
            validityStyles={settingError}
            onChange={handleChange}
            placeholder="Signature Time"
            name={"signTime"}
            label={"Signature Time"}
            value={fields.signTime?fields.signTime:null}
            required={true}
            error={!fields.signTime && errors.signTime}
            disabled={sigControlDisabled}
          />
        </div>

        <div className="mb-2 col-lg-12 col-md-12 col-12">
          <label>Signature Pin</label>
          <InputPinKendoRct
            value={fields.pinCode}
            onChange={handleChange}
            name="pinCode"
            label="Signature Pin"
            error={
              fields.pinCode.length !== 4
                ? errors.pinCode
                : isPinAvailable === false
                ? ErrorHelper.INVALID_PIN
                : ""
            }
            validityStyles={settingError}
            required={true}
             type={showNewPin}

            maxLength={4}
            minLength={4}
            disabled={sigControlDisabled}
          />
          {/* <div onClick={handleShowPin} className="cursor-pointer eye-close">
            {showNewPin !== "password" ? (
              <i className="far fa-eye text-theme"></i>
            ) : (
              <i className="far fa-eye-slash"></i>
            )}
          </div> */}


          
        </div>
      </div>

      <p className="error-message">{signText}</p>

      {loading === true && <Loader />}
      <div className="border-bottom-line"></div>

      <div className="d-flex my-3 px-3">
        <div>
          <button
            disabled={isButtonDisable}
            onClick={handleSubmit}
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
export default AddClientTreatmentSign;
