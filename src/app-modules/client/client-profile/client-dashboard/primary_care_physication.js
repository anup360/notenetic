import React, { useState } from "react";
import Loader from "../../../../control-components/loader/loader";
import { useSelector } from "react-redux";
import { Dialog, Window } from "@progress/kendo-react-dialogs";
import NotificationManager from "react-notifications/lib/NotificationManager";
import ErrorHelper from "../../../../helper/error-helper";
import TextAreaKendo from "../../../../control-components/kendo-text-area/kendo-text-area";
import InputKendoRct from "../../../../control-components/input/input";
import PhoneInputMask from "../../../../control-components/phone-input-mask/phone-input-mask";
import ApiHelper from "../../../../helper/api-helper";
import ApiUrls from "../../../../helper/api-urls";
import { renderErrors } from "src/helper/error-message-helper";

const PrimaryCarePhyisican = ({ onClose, getPrimaryCallback }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [settingError, setSettingError] = useState(false);
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const primaryCaredata = useSelector((state) => state.getPrimaryCarePhysician);

  let [fields, setFields] = useState({
    pcpName: primaryCaredata[0]?.name,
    pcpAddress: primaryCaredata[0]?.address,
    pcpPhone: primaryCaredata[0]?.phone,
    // pcpFax: primaryCaredata[0]?.fax,
  });

  const updatePrimaryCarePhysication = async () => {
    const data = {
      clientId: selectedClientId,
      pcpName: fields.pcpName,
      pcpAddress: fields.pcpAddress,
      pcpPhone: fields.pcpPhone,
      // pcpFax: fields.pcpFax.trim(),
    };
    setLoading(true);
    await ApiHelper.putRequest(
      ApiUrls.UPDATE_CLIENT_PRIMARY_CARE_PHYSICIAN,
      data
    )
      .then((result) => {
        getPrimaryCallback();
        setLoading(false);
        NotificationManager.success(
          "Primary care physician updated successfully"
        );
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
      updatePrimaryCarePhysication();
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const textAreaValue = e.value;
    if (name === "pcpAddress") {
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
    if (!fields.pcpName) {
      formIsValid = false;
      errors["pcpName"] = ErrorHelper.PRIMARY_CARE_PHYSICIAN_NAME;
    }
    if (!fields.pcpAddress) {
      formIsValid = false;
      errors["pcpAddress"] = ErrorHelper.ADDRESS;
    }
    if (!fields.pcpPhone || fields.pcpPhone.trim().length === 0) {
      formIsValid = false;
      errors["pcpPhone"] = ErrorHelper.PHONE;
    }
    setErrors(errors);
    return formIsValid;
  };

  return (
    <div>
      <Dialog
        onClose={onClose}
        title={"Edit Primary Care Physician"}
        className="small-dailog"
      >
        <div className="edit-client-popup">
          <div className="popup-modal slibling-data">
            <div className="row">
              <div>
                <InputKendoRct
                  validityStyles={settingError}
                  value={fields.pcpName}
                  onChange={handleChange}
                  name="pcpName"
                  label="Primary Care Physician"
                  error={!fields.pcpName && errors.pcpName}
                  required={true}
                />
                <TextAreaKendo
                  txtValue={fields.pcpAddress}
                  onChange={handleChange}
                  name="pcpAddress"
                  label="Address"
                  error={!fields.pcpAddress && errors.pcpAddress}
                  required={settingError}
                />
                <div className="mt-3">
                  <PhoneInputMask
                    validityStyles={settingError}
                    onChange={handleValueChange}
                    name="pcpPhone"
                    label="Phone"
                    value={fields.pcpPhone}
                    error={!fields.pcpPhone && errors.pcpPhone}
                    required={true}
                    placeholder="Phone"
                  />
                </div>

                {/* <PhoneInputMask
                  validityStyles={settingError}
                  onChange={handleValueChange}
                  name="pcpFax"
                  label="Fax"
                  value={fields.pcpFax}
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
export default PrimaryCarePhyisican;
