import React, { useEffect, useState } from "react";
import ErrorHelper from "../../../helper/error-helper";
import { NotificationManager } from "react-notifications";
import InputKendoRct from "../../../control-components/input/input";
import Loader from "../../../control-components/loader/loader";
import { useSelector } from "react-redux";
import { Dialog } from "@progress/kendo-react-dialogs";

import { SettingsService } from "../../../services/settingsService";
import { renderErrors } from "src/helper/error-message-helper";

import NOTIFICATION_MESSAGE from "../../../helper/notification-messages";

const UpdateCertification = ({ onClose, selectedCertificate }) => {
  let [fields, setFields] = useState({
    certificateName: selectedCertificate?.certificationName,
    id: selectedCertificate?.id,
  });

  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [stateData, setStateData] = useState([]);
  const [settingError, setSettingError] = useState(false);
  const clinicId = useSelector((state) => state.loggedIn.clinicId);

  useEffect(() => {}, []);

  const updateCertification = async () => {
    setLoading(true);
    await SettingsService.updateCertificates(fields)
      .then((result) => {
        setLoading(false);
        NotificationManager.success(NOTIFICATION_MESSAGE.CERTIFICATION_UPDATED);
        onClose({ updated: true });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error);
      });
  };

  const addCertification = async () => {
    setLoading(true);
    await SettingsService.addCertificates(fields, clinicId)
      .then((result) => {
        setLoading(false);
        NotificationManager.success(NOTIFICATION_MESSAGE.CERTIFICATION_ADDED);
        onClose({ updated: true });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error);
      });
  };

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;
    if (!fields.certificateName || fields.certificateName.trim().length === 0) {
      formIsValid = false;
      errors["certificateName"] = ErrorHelper.CERTIFICATE_NAME;
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
      if (selectedCertificate) {
        updateCertification();
      } else {
        addCertification();
      }
    }
  };

  return (
    <Dialog
      onClose={onClose}
      title={selectedCertificate ? "Update Certification" : "Add Certification"}
      className="small-dailog"
    >
      <div className=" edit-Service-popup">
        <div className="mx-3">
          <div className="row">
            <div className="mb-2 col-lg-4 col-md-6 col-12 mt-3">
              <InputKendoRct
                value={fields.certificateName}
                onChange={handleChange}
                name="certificateName"
                label="Certification Name"
                error={fields.certificateName == "" && errors.certificateName}
                validityStyles={settingError}
                required={true}
                placeholder="Certification Name"
              />
            </div>
          </div>
        </div>
        {loading == true && <Loader />}
      </div>
      <div className="border-bottom-line"></div>
      <div className="d-flex mt-3 mb-3 ">
        <div className="right-sde">
          <button
            className="btn blue-primary text-white mx-3"
            onClick={handleSubmit}
          >
            {selectedCertificate ? "Update" : "Add"}
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
export default UpdateCertification;
