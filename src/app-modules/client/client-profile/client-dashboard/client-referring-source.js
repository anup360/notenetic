import React, { useEffect, useState } from "react";
import Loader from "../../../../control-components/loader/loader";
import { useSelector } from "react-redux";
import { Dialog } from "@progress/kendo-react-dialogs";
import NotificationManager from "react-notifications/lib/NotificationManager";
import ErrorHelper from "../../../../helper/error-helper";
import DropDownKendoRct from "../../../../control-components/drop-down/drop-down";
import { SettingsService } from "../../../../services/settingsService";
import DatePickerKendoRct from "../../../../control-components/date-picker/date-picker";
import TextAreaKendo from "../../../../control-components/kendo-text-area/kendo-text-area";
import { renderErrors } from "src/helper/error-message-helper";

const ClientRefSource = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [settingError, setSettingError] = useState(false);
  const [referringData, setReferringData] = useState([]);
  const clinicId = useSelector((state) => state.loggedIn.clinicId);
  const selectedClientId = useSelector((state) => state.selectedClientId);

  let [fields, setFields] = useState({
    refName: "",
    refDate: "",
    refReason: "",
  });


  useEffect(() => {
    getClientRefSource();
    getClinicReferrings();
  }, []);

  const getClientRefSource = async () => {
    setLoading(true);
    await SettingsService.getClientRefSource(selectedClientId)
      .then((result) => {
        let data = result.resultData[0];
        setLoading(false);
        const info = {
          id: data && data?.referralSourceId,
          valueName:
            data &&
            data?.contactPerson + " (" + data?.referringCompanyName + ")",
        };
        setFields({
          ...fields,
          refName: info.id==undefined ? "" : info,
          refDate: data?.dateReferral ? new Date(data?.dateReferral) : "",
          refReason: data?.referralReason,
        });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const getClinicReferrings = async () => {
    await SettingsService.getRefSource(clinicId, true)
      .then((result) => {
        let list = result.resultData;
        let newArry = [];
        for (var i = 0; i < list.length; i++) {
          const element = {
            id: list[i]?.id,
            valueName:
              list[i]?.contactPerson +
              " (" +
              list[i]?.referringCompanyName +
              ")",
          };
          newArry.push(element);
        }
        setReferringData(newArry);
      })
      .catch((error) => {
        renderErrors(error.message);
      });
  };

  const updateClientRefSource = async () => {
    setLoading(true);
    await SettingsService.insertClientRefSource(fields, selectedClientId)
      .then((result) => {
        setLoading(false);
        NotificationManager.success("Referral source updated successfully");
        onClose({ updated: true });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error);
      });
  };

  const handleSubmit = () => {
    setSettingError(true);
    if (handleValidation()) {
      updateClientRefSource();
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const textAreaValue = e.value;
    if (name == "refReason") {
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

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;
    if (!fields.refName || !fields?.refName?.id) {
      formIsValid = false;
      errors["refName"] = ErrorHelper.REF_NAME;
    }
    if (!fields.refDate) {
      formIsValid = false;
      errors["refDate"] = ErrorHelper.REF_DATE;
    }
    if (!fields.refReason) {
      formIsValid = false;
      errors["refReason"] = ErrorHelper.REASON;
    }
    setErrors(errors);
    return formIsValid;
  };

  return (
    <div>
      <Dialog
        onClose={onClose}
        title={"Referral Source"}
        className="small-dailog"
      >
        <div className="edit-client-popup">
          <div className="popup-modal slibling-data">
            <div className="row">
              <div>
                <DropDownKendoRct
                  label="Referral Source"
                  value={fields.refName}
                  onChange={handleChange}
                  data={referringData}
                  textField="valueName"
                  suggest={true}
                  name="refName"
                  dataItemKey="id"
                  validityStyles={settingError}
                  error={fields?.refName?.id == undefined && errors.refName}
                  placeholder="Referral Source"
                  required={!fields?.refName?.id ? true : false}
                />

                <DatePickerKendoRct
                  onChange={handleChange}
                  value={fields.refDate}
                  name={"refDate"}
                  title={"Referral Date"}
                  required={true}
                  validityStyles={settingError}
                  error={!fields.refDate && errors.refDate}
                  label={"Referral Date"}
                  placeholder={""}
                  max={new Date()}
                />

                <TextAreaKendo
                  txtValue={fields.refReason}
                  onChange={handleChange}
                  name="refReason"
                  label="Reason for Referral"
                  title={"Reason for Referral"}
                  error={!fields.refReason && errors.refReason}
                  required={settingError}
                />
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
export default ClientRefSource;
