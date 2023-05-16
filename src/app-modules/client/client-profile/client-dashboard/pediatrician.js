import React, { useState } from "react";
import Loader from "../../../../control-components/loader/loader";
import { useSelector } from "react-redux";
import { Dialog } from "@progress/kendo-react-dialogs";
import NotificationManager from "react-notifications/lib/NotificationManager";
import ErrorHelper from "../../../../helper/error-helper";
import TextAreaKendo from "../../../../control-components/kendo-text-area/kendo-text-area";
import InputKendoRct from "../../../../control-components/input/input";
import PhoneInputMask from "../../../../control-components/phone-input-mask/phone-input-mask";
import ApiHelper from "../../../../helper/api-helper";
import ApiUrls from "../../../../helper/api-urls";
import { renderErrors } from "src/helper/error-message-helper";

const Pediatrication = ({ onClose, getPediatricianCallback }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [settingError, setSettingError] = useState(false);
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const pediatricianData = useSelector((state) => state.getPediatrician);

  let [fields, setFields] = useState({
    pediatricianName: pediatricianData[0]?.name,
    pediatricianAddress: pediatricianData[0]?.address,
    pediatricianPhone: pediatricianData[0]?.phone,
    // pediatricianFax: pediatricianData[0]?.fax,
  });

  const updateClientRefProvider = async () => {
    const data = {
      clientId: selectedClientId,
      pediatricianName: fields.pediatricianName,
      pediatricianAddress: fields.pediatricianAddress,
      pediatricianPhone: fields.pediatricianPhone,
      // pediatricianFax: fields.pediatricianFax.trim(),
    };
    setLoading(true);
    await ApiHelper.putRequest(ApiUrls.UPDATE_CLIENT_PEDIATRICATION, data)
      .then((result) => {
        setLoading(false);
        getPediatricianCallback();
        NotificationManager.success("Pediatrician updated successfully");

        onClose({ updated: true });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const handleSubmit = () => {
    setSettingError(true);
    if (handleValidation()) {
      updateClientRefProvider();
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const textAreaValue = e.value;
    if (name === "pediatricianAddress") {
      setFields({
        ...fields,
        [name]: textAreaValue,
      });
    } else {
      setFields({
        ...fields,
        [name]: value,
      });
    }
  };

  const handleValueChange = (e) => {
    const name = e.target.name;
    const rawValue = e.target.rawValue;
    setFields({
      ...fields,
      [name]: rawValue,
    });
  };

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;
    if (!fields.pediatricianName ) {
      formIsValid = false;
      errors["pediatricianName"] = ErrorHelper.PEDIATRICATION;
    }
    if (
      !fields.pediatricianAddress ||
      fields.pediatricianAddress.trim().length === 0
    ) {
      formIsValid = false;
      errors["pediatricianAddress"] = ErrorHelper.ADDRESS;
    }
    if (
      !fields.pediatricianPhone ||
      fields.pediatricianPhone.trim().length === 0
    ) {
      formIsValid = false;
      errors["pediatricianPhone"] = ErrorHelper.PHONE;
    }

    setErrors(errors);
    return formIsValid;
  };

  return (
    <div>
      <Dialog
        onClose={onClose}
        title={"Edit Pediatrician"}
        className="small-dailog"
      >
        <div className="edit-client-popup">
          <div className="popup-modal slibling-data">
            <div className="row">
              <div>
                <InputKendoRct
                  validityStyles={settingError}
                  value={fields.pediatricianName}
                  onChange={handleChange}
                  name="pediatricianName"
                  label="Pediatrician"
                  error={!fields.pediatricianName && errors.pediatricianName}
                  required={true}
                />
                <TextAreaKendo
                  txtValue={fields.pediatricianAddress}
                  onChange={handleChange}
                  name="pediatricianAddress"
                  label="Address"
                  error={
                    !fields.pediatricianAddress && errors.pediatricianAddress
                  }
                  required={settingError}
                />
                <div className="mt-3">
                  <PhoneInputMask
                    validityStyles={settingError}
                    onChange={handleValueChange}
                    name="pediatricianPhone"
                    label="Phone"
                    value={fields.pediatricianPhone}
                    error={
                      !fields.pediatricianPhone && errors.pediatricianPhone
                    }
                    required={true}
                    placeholder="Phone"
                  />
                </div>

                {/* <PhoneInputMask
                  onChange={handleValueChange}
                  name="pediatricianFax"
                  label="Fax"
                  value={fields.pediatricianFax}
                  placeholder="Fax"
                /> */}
              </div>
            </div>
          </div>

          {loading == true && <Loader />}
        </div>
        <div className="border-bottom-line"></div>
        <div className="d-flex my-3">
          <div className="right-sde">
            <button
              className="btn blue-primary text-white mx-3"
              onClick={handleSubmit}
            >
              Update
            </button>
          </div>
          <div className="right-sde-grey">
            <button
              className="btn grey-secondary text-white "
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
export default Pediatrication;
