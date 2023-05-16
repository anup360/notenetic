import React, { useState } from "react";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import InputKendoRct from "../../../control-components/input/input";
import ErrorHelper from "../../../helper/error-helper";
import ApiHelper from "../../../helper/api-helper";
import ApiUrls from "../../../helper/api-urls";
import { NotificationManager } from "react-notifications";
import NOTIFICATION_MESSAGE from "../../../helper/notification-messages";
import { Encrption } from "../../encrption";
import Loader from "../../../control-components/loader/loader";
import { renderErrors } from "src/helper/error-message-helper";

const RenameDialog = ({
  onClose,
  title,
  renameInfo,
  getAllDocumentTemplates,
}) => {
  const [templateName, setTemplateName] = useState(renameInfo.name);
  const [errors, setErrors] = useState("");
  const [validation, setValidation] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;
    if (!templateName || templateName.trim().length === 0) {
      formIsValid = false;
      errors["templateName"] = ErrorHelper.FIELD_BLANK;
    }
    setErrors(errors);
    return formIsValid;
  };

  const saveDocumentTemplateRename = () => {
    setLoading(true);
    const encrptId = Encrption(renameInfo.id);
    ApiHelper.putRequest(
      ApiUrls.UPDATE_DOCUMENT_TEMPLATE_NAME +
        templateName +
        "&" +
        "documentTemplateId" +
        "=" +
        encrptId
    )
      .then((result) => {
        NotificationManager.success(
          NOTIFICATION_MESSAGE.DOCUMENT_TEMPLATE_RENAME
        );
        onClose();
        setLoading(false);
        getAllDocumentTemplates();
      })
      .catch((error) => {
        renderErrors(error);
        setLoading(false);

      });
  };

  const handleSubmit = () => {
    setValidation(true);
    if (handleValidation()) {
      saveDocumentTemplateRename();
    }
  };

  return (
    <Dialog onClose={onClose} title={title} className="small-dailog">
      {loading && <Loader />}
      <div className="mb-3 col-lg-12 col-md-12 col-12 mt-3">
        <InputKendoRct
          validityStyles={validation}
          value={templateName === null ? "" : templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          name="templateName"
          label="Template"
          error={templateName === "" && errors.templateName}
          required={true}
        />
      </div>
      <div className="border-bottom-line"></div>
      <div className="d-flex flex-wrap mx-4 my-3">
        <button className="btn blue-primary text-white " onClick={handleSubmit}>
          Rename
        </button>
        <button
          onClick={onClose}
          className="btn grey-secondary text-white ml-3"
        >
          Cancel
        </button>
      </div>
    </Dialog>
  );
};

export default RenameDialog;
