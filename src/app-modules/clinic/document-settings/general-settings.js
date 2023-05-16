import React, { useEffect, useState } from "react";
import { Switch } from "@progress/kendo-react-inputs";
import { NotificationManager } from "react-notifications";
import Loading from "../../../control-components/loader/loader";
import { SettingsService } from "../../../services/settingsService";
import NOTIFICATION_MESSAGE from "../../../helper/notification-messages";
import { useSelector, useDispatch } from "react-redux";
import { NumericTextBox } from "@progress/kendo-react-inputs";
import { renderErrors } from "src/helper/error-message-helper";


const GeneralSettings = (props) => {
  const [loading, setLoading] = useState(false);

  let [fields, setFields] = useState({
    pastAllowedDays: "",
    daysAppliedSigDos: "",
    daysAppliedSigLocked: "",
    allowWithoutDiag: false,
    signOnSubmission: false,
    allowDocumentsWithoutAuth: false,
    allowStaffToDuplicateThierOwnDocs: false,
    // canSealDocument:false
  });

  const [errors, setErrors] = useState("");
  const [settingError, setSettingError] = useState(false);
  const clinicId = useSelector((state) => state.loggedIn.clinicId);

  useEffect(() => {
    getDocSettingsById();
  }, []);

  const handleUpdate = () => {
    setSettingError(true);
    if (handleValidation()) {
      updateDocSettings();
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFields({
      ...fields,
      [name]: value,
    });
  };

  const getDocSettingsById = async () => {
    setLoading(true);
    await SettingsService.getDocSettings(clinicId)
      .then((result) => {
        setLoading(false);
        let info = result.resultData[0];
        setFields({
          ...fields,
          pastAllowedDays: info?.numDaysAllowedInPast
            ? info?.numDaysAllowedInPast
            : 0,
          daysAppliedSigDos: info?.numDaysApplySigAfterDos
            ? info?.numDaysApplySigAfterDos
            : 0,
          daysAppliedSigLocked: info?.numDaysApplySigAfterDateLocked
            ? info?.numDaysApplySigAfterDateLocked
            : 0,
          allowWithoutDiag: info?.allowDocWithoutDiag,
          signOnSubmission: info?.canApplySigOnSubmission,
          allowDocumentsWithoutAuth: info?.allowDocumentsWithoutAuth,
          allowStaffToDuplicateThierOwnDocs:
            info?.allowStaffToDuplicateThierOwnDocs,
          // canSealDocument:info?.canSealDocument
        });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const updateDocSettings = async () => {
    setLoading(true);
    await SettingsService.updateDocumentSettings(fields)
      .then((result) => {
        setLoading(false);
        NotificationManager.success(
          NOTIFICATION_MESSAGE.DOCUMENT_SETTINGS_UPDATED
        );
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error);
      });
  };

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;

    setErrors(errors);
    return formIsValid;
  };
  return (
    <>
      <div>
        <div className="col-lg-12 row align-items-center">
          <div className="col-1">
            <NumericTextBox
              type="number"
              name="pastAllowedDays"
              value={fields.pastAllowedDays}
              onChange={handleChange}
              className="input-control-up"
              spinners={false}
            ></NumericTextBox>
          </div>
          <div className="col-4 text-left">
            Number of days allowed in past to submit new document
          </div>
        </div>
        <div className="col-lg-12 row align-items-center">
          <div className="col-1">
            <NumericTextBox
              type="number"
              name="daysAppliedSigDos"
              value={fields.daysAppliedSigDos}
              onChange={handleChange}
              className="input-control-up"
              spinners={false}
            ></NumericTextBox>
          </div>
          <label className="col-4 text-left">
            Number of Days allowed to Apply Signature after date of service
          </label>
        </div>
        <div className="col-lg-12 row align-items-center">
          <div className="col-1">
            <NumericTextBox
              type="number"
              name="daysAppliedSigLocked"
              value={fields.daysAppliedSigLocked}
              onChange={handleChange}
              className="input-control-up"
              spinners={false}
            ></NumericTextBox>
          </div>
          <label className="col-10 text-left">
            Number of Days allowed to Apply Signature after date locked
          </label>
        </div>
        <div className="col-lg-12 row align-items-center">
          <ul className="d-flex flex-wrap list-unstyled pt-3">
            <li className="col-md-12 col-12  text-left  switch-on mb-3">
              <Switch
                onLabel={"on"}
                offLabel={"off"}
                name="allowWithoutDiag"
                onChange={handleChange}
                value={fields.allowWithoutDiag}
                checked={fields.allowWithoutDiag}
              />
              <span className="switch-title-text ml-2">
                Allowed document submission without client diagnosis
              </span>
            </li>
            {loading && <Loading />}

            <li className="col-md-12 col-12 text-left  switch-on mb-3">
              <Switch
                onLabel={"on"}
                offLabel={"off"}
                name="signOnSubmission"
                onChange={handleChange}
                value={fields.signOnSubmission}
                checked={fields.signOnSubmission}
              />
              <span className="switch-title-text ml-2">
                Staff can apply Sign on new document submission
              </span>
            </li>
            <li className="col-md-12 col-12 text-left  switch-on mb-3">
              <Switch
                onLabel={"on"}
                offLabel={"off"}
                name="allowDocumentsWithoutAuth"
                onChange={handleChange}
                value={fields.allowDocumentsWithoutAuth}
                checked={fields.allowDocumentsWithoutAuth}
              />
              <span className="switch-title-text ml-2">
                Allow docs without authorization
              </span>
            </li>
            <li className="col-md-12 col-12 text-left  switch-on mb-3">
              <Switch
                onLabel={"on"}
                offLabel={"off"}
                name="allowStaffToDuplicateThierOwnDocs"
                onChange={handleChange}
                value={fields.allowStaffToDuplicateThierOwnDocs}
                checked={fields.allowStaffToDuplicateThierOwnDocs}
              />
              <span className="switch-title-text ml-2 ">
                Allow staff to duplicate their own documents
              </span>
            </li>
            {/* <li className="col-md-12 col-12 text-left  switch-on mb-3">
            <Switch
              onLabel={"on"}
              offLabel={"off"}
              name="canSealDocument"
              onChange={handleChange}
              value={fields.canSealDocument}
              checked={fields.canSealDocument}
            />
            <span className="switch-title-text ml-2 ">
            Allow staff to seal their documents
            </span>
          </li> */}
          </ul>
        </div>
        <div className="col-12 pt-2 text-left">
          <button
            className="btn blue-primary-outline update-small"
            onClick={handleUpdate}
          >
            <i className="fa fa-check pr-2" title="Print"></i>
            Update
          </button>
        </div>
      </div>
    </>
  );
};

export default GeneralSettings;
