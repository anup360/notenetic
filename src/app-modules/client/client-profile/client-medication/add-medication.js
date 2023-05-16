import React, { useEffect, useState } from "react";
import DatePickerKendoRct from "../../../../control-components/date-picker/date-picker";
import { NotificationManager } from "react-notifications";
import InputKendoRct from "../../../../control-components/input/input";
import Loader from "../../../../control-components/loader/loader";
import { useSelector } from "react-redux";
import { Dialog } from "@progress/kendo-react-dialogs";
import { ClientService } from "../../../../services/clientService";
import { useNavigate } from "react-router";
import apiHelper from "src/helper/api-helper";
import API_URLS from "src/helper/api-urls";
import { renderErrors } from "src/helper/error-message-helper";
import TimePickerKendoRct from "../../../../control-components/time-picker/time-picker";
import TextAreaKendoRct from "../../../../control-components/text-area/text-area";

const AddMedication = ({ onClose, selectedMedId }) => {
  let [fields, setFields] = useState({
    dosage: "",
    route: "",
    initials: "",
    notes: "",
    administerDate: "",
    medicationName: "",
    administerTime: "",
  });

  const [medicationData, setMedicationData] = useState([]);

  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const clinicId = useSelector((state) => state.loggedIn.clinicId);
  const [settingError, setSettingError] = useState(false);
  const navigate = useNavigate();
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const staffId = useSelector((state) => state.loggedIn?.staffId);

  useEffect(() => {
    if (selectedMedId) {
      getClientMedicationById();
    }
  }, []);

  function getClientMedicationById() {
    setLoading(true);
    apiHelper
      .getRequest(
        API_URLS.GET_CLIENT_MEDICATION_BY_ID + selectedMedId + "&isActive=true"
      )
      .then((result) => {
        let medInfo = result.resultData;
        setFields({
          ...fields,
          dosage: medInfo?.dosage,
          route: medInfo?.route,
          initials: medInfo?.initials,
          notes: medInfo?.notes,
          administerDate: new Date(medInfo?.dateAdministered),
          medicationName: medInfo?.medicationName,
        });
      })
      .catch((err) => {
        renderErrors(err, "Fetch Medications");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const insertMedication = () => {
    setLoading(true);
    ClientService.addMedication(fields, selectedClientId)
      .then((result) => {
        setLoading(false);
        setMedicationData(result.resultData);
        NotificationManager.success("Medication added successfully");
        onClose({ isAdded: true });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error);
      });
  };

  const updateMedication = () => {
    setLoading(true);
    ClientService.updateMedication(fields, selectedClientId, selectedMedId)
      .then((result) => {
        setLoading(false);
        NotificationManager.success("Medication updated successfully");
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

    if (!fields?.administerDate) {
      formIsValid = false;
      errors["administerDate"] = "this field is required";
    }

    if (!fields.dosage || fields.dosage.trim().length === 0) {
      formIsValid = false;
      errors["dosage"] = "this field is required";
    }
    if (!fields.medicationName || fields.medicationName.trim().length === 0) {
      formIsValid = false;
      errors["medicationName"] = "this field is required";
    }

    if (!fields.route || fields.route.trim().length === 0) {
      formIsValid = false;
      errors["route"] = "this field is required";
    }
    if (!fields.initials || fields.initials.trim().length === 0) {
      formIsValid = false;
      errors["initials"] = "this field is required";
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
      if (selectedMedId) {
        updateMedication();
      } else {
        insertMedication();
      }
    }
  };

  const handleTextChange = (e) => {
    const name = e.target.name;
    const value = e.value;
    setFields({
      ...fields,
      [name]: value,
    });
  };

  return (
    <div>
      <Dialog
        onClose={onClose}
        title={"Add Medication Administrations"}
        className="dialog-modal"
      >
        <div className="">
          <div className="popup-modal">
            <div className="row">
              <div className="mb-2 col-lg-6 col-md-6 col-6">
                <InputKendoRct
                  value={fields.medicationName}
                  onChange={handleChange}
                  name="medicationName"
                  label="Medication Name"
                  error={fields.medicationName == "" && errors.medicationName}
                  validityStyles={settingError}
                  required={true}
                  type="text"
                />
              </div>

              <div className="mb-2 col-lg-6 col-md-6 col-6">
                <DatePickerKendoRct
                  onChange={handleChange}
                  value={fields.administerDate}
                  name={"administerDate"}
                  title={"Administered Date"}
                  label={"Administered Date"}
                  required={true}
                  validityStyles={settingError}
                  error={!fields.administerDate && errors.administerDate}
                />
              </div>

              {/* <div className="mb-2 col-lg-4 col-md-6 col-12">
                <TimePickerKendoRct
                  validityStyles={settingError}
                  onChange={handleChange}
                  placeholder="Administer Time"
                  name={"administerTime"}
                  label={"Administer Time"}
                  value={fields.administerTime}
                  required={true}
                  error={!fields.administerTime && errors.administerTime}
                />
              </div> */}

              <div className="mb-2 col-lg-6 col-md-6 col-6">
                <InputKendoRct
                  value={fields.dosage}
                  onChange={handleChange}
                  name="dosage"
                  label="Dosage"
                  error={fields.dosage == "" && errors.dosage}
                  validityStyles={settingError}
                  required={true}
                  type="text"
                />
              </div>

              <div className="mb-2 col-lg-6 col-md-6 col-6">
                <InputKendoRct
                  value={fields.route}
                  onChange={handleChange}
                  name="route"
                  label="Route"
                  error={fields.route == "" && errors.route}
                  validityStyles={settingError}
                  required={true}
                  type="text"
                />
              </div>

              <div className="mb-2 col-lg-12 col-md-12 col-12">
                <InputKendoRct
                  value={fields.initials}
                  onChange={handleChange}
                  name="initials"
                  label="Initials"
                  error={fields.initials == "" && errors.initials}
                  validityStyles={settingError}
                  required={true}
                  type="text"
                />
              </div>

              <div className="mb-2 col-lg-12 col-md-12 col-12">
                <TextAreaKendoRct
                  name="notes"
                  txtValue={fields.notes}
                  onChange={handleTextChange}
                  label="Notes"
                />
              </div>
            </div>
          </div>

          {loading == true && <Loader />}
        </div>
        <div className="border-bottom-line"></div>
        <div className="d-flex mt-4 ">
          <button
            className="btn blue-primary text-white"
            onClick={handleSubmit}
          >
            Save
          </button>

          <button
            className="btn grey-secondary text-white ml-3 "
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </Dialog>
    </div>
  );
};
export default AddMedication;
