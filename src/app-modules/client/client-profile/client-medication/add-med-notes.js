import React, { useEffect, useState } from "react";
import DatePickerKendoRct from "../../../../control-components/date-picker/date-picker";
import ErrorHelper from "../../../../helper/error-helper";
import { NotificationManager } from "react-notifications";
import InputKendoRct from "../../../../control-components/input/input";
import Loader from "../../../../control-components/loader/loader";
import { useSelector } from "react-redux";
import { Dialog } from "@progress/kendo-react-dialogs";
import DropDownKendoRct from "../../../../control-components/drop-down/drop-down";
import { ClientService } from "../../../../services/clientService";
import { useNavigate } from "react-router";
import APP_ROUTES from "../../../../helper/app-routes";
import apiHelper from "src/helper/api-helper";
import API_URLS from "src/helper/api-urls";
import { renderErrors } from "src/helper/error-message-helper";
import { Encrption } from "../../../encrption";
import TimePickerKendoRct from "../../../../control-components/time-picker/time-picker";


const AddMedNotes = ({ onClose,setNotesAdded }) => {


  let [fields, setFields] = useState({

    notes: "",

  });


  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const clinicId = useSelector((state) => state.loggedIn.clinicId);
  const [settingError, setSettingError] = useState(false);
  const navigate = useNavigate();
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const staffId = useSelector((state) => state.loggedIn?.staffId);



  const insertMedNotes = () => {
    setLoading(true);
    ClientService.addMedNotes(fields, selectedClientId)
      .then((result) => {
        setLoading(false);
        NotificationManager.success("Notes added successfully");
        onClose({ isAdded: true });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error);
      });
  };


  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;

    if (!fields.notes || fields.notes.trim().length === 0) {
      formIsValid = false;
      errors["notes"] = "this field is required";
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



  const handleSubmit = (event) => {
    setSettingError(true);
    if (handleValidation()) {
      insertMedNotes();
    }
  };


  return (
    <Dialog onClose={onClose} title={"Add Notes"} className="small-dailog">
      <div className=" edit-client-popup edit-kendo-dropdown">
        <div className="mb-3 col-lg-12 col-md-12 col-12 px-0">
          <InputKendoRct
            value={fields.notes}
            onChange={handleChange}
            name="notes"
            label="Notes"
            error={fields.notes == "" && errors.notes}
            validityStyles={settingError}
            required={true}
            type="text"
          />
        </div>
      </div>
      {loading == true && <Loader />}
      <div className="border-bottom-line"></div>
      <div className="my-3 px-4">
        <button
          className="btn blue-primary text-white"
          onClick={handleSubmit}
        >
          Save
        </button>
        <button
          className="btn grey-secondary text-white ml-3"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </Dialog>
  );
};
export default AddMedNotes;
