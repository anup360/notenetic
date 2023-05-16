import React, { useEffect, useState } from "react";
import ErrorHelper from "../../../helper/error-helper";
import { NotificationManager } from "react-notifications";
import InputKendoRct from "../../../control-components/input/input";
import Loader from "../../../control-components/loader/loader";
import { useSelector } from "react-redux";
import { Dialog } from "@progress/kendo-react-dialogs";
import { SettingsService } from "../../../services/settingsService";
import NOTIFICATION_MESSAGE from "../../../helper/notification-messages";
import { StaffService } from "../../../services/staffService";
import TimePickerKendoRct from "../../../control-components/time-picker/time-picker";
import TextAreaKendoRct from "../../../control-components/kendo-text-area/kendo-text-area";
import { renderErrors } from "src/helper/error-message-helper";


const AddTrackTime = ({ onClose, selectedTag }) => {
  let [fields, setFields] = useState({
    trackTime: "",
    comments: "",
  });

  const [errors, setErrors] = useState("");

  const [loading, setLoading] = useState(false);
  const [settingError, setSettingError] = useState(false);
  const clinicId = useSelector((state) => state.loggedIn.clinicId);

  useEffect(() => {}, []);

  const saveTrackTime = async () => {
    setLoading(true);
    await StaffService.insertStaffTrack(fields)
      .then((result) => {
        setLoading(false);
        NotificationManager.success(NOTIFICATION_MESSAGE.TIME_ADDED);
        onClose({ updated: true });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;
    if (!fields.trackTime) {
      formIsValid = false;
      errors["trackTime"] = ErrorHelper.FIELD_BLANK;
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

  const handleTextChange = (e) => {
    const name = e.target.name;
    const value = e.value;
    setFields({
      ...fields,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    setSettingError(true);
    if (handleValidation()) {
      saveTrackTime();
    }
  };

  return (
    <Dialog onClose={onClose} title={"Add Track Time"} className="small-dailog">
      <div className=" edit-Service-popup py-3">
        <div className="mx-3">
          <div className="row align-items-center">
            <TimePickerKendoRct
              validityStyles={settingError}
              onChange={handleChange}
              placeholder="Time"
              name={"trackTime"}
              label={"Time"}
              value={fields.trackTime}
              required={true}
              error={!fields.trackTime && errors.trackTime}
            />
            <div className="col-md-12 col-lg-12 col-12 pt-4">
              <TextAreaKendoRct
                validityStyles={settingError}
                name="comments"
                txtValue={fields.comments}
                onChange={handleTextChange}
                label="Comments"
              />
            </div>
          </div>
        </div>
        {loading == true && <Loader />}
      </div>
      <div className="border-bottom-line"></div>
      <div className="d-flex my-4">
        <div className="right-sde">
          <button
            className="btn blue-primary text-white mx-3"
            onClick={handleSubmit}
          >
            {selectedTag ? "Update" : "Add"}
          </button>
        </div>
        <div className="right-sde-grey">
          <button className="btn grey-secondary text-white " onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </Dialog>
  );
};
export default AddTrackTime;
