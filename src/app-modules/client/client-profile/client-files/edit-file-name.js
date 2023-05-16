import React, { useState } from "react";
import { Dialog } from "@progress/kendo-react-dialogs";
import InputKendoRct from "../../../../control-components/input/input";
import ErrorHelper from "../../../../helper/error-helper";
import { useSelector } from "react-redux";
import ApiHelper from "../../../../helper/api-helper";
import ApiUrls from "../../../../helper/api-urls";
import { NotificationManager } from "react-notifications";
import Loader from "../../../../control-components/loader/loader";
import { renderErrors } from "src/helper/error-message-helper";

const EditDocumentName = ({
  documnetselectId,
  onClose,
  documentSelectName,
  getClientDocumentById,
}) => {
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const [errors, setErrors] = useState("");
  const [staffError, setStaffError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [fields, setFields] = useState({
    docName: documentSelectName,
  });

  const handleChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    setFields({
      ...fields,
      [name]: value,
    });
  };

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;
    if (!fields.docName || fields.docName.trim().length === 0) {
      formIsValid = false;
      errors["docName"] = ErrorHelper.DOCUMENT_NAME;
    }
    setErrors(errors);
    return formIsValid;
  };

  const updateDocumentName = () => {
    setLoading(true);
    const data = {
      id: documnetselectId,
      clientId: selectedClientId,
      docName: fields.docName,
    };
    ApiHelper.putRequest(ApiUrls.UPDATE_CLIENT_STORED_DOCUMENT, data)
      .then((result) => {
        setLoading(false);
        onClose({ editable: true });
        NotificationManager.success("Document name updated successfully");
        getClientDocumentById();
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const handleSubmit = () => {
    setStaffError(true);
    if (handleValidation()) {
      updateDocumentName();
    }
  };

  return (
    <Dialog
      onClose={onClose}
      title={"Edit Docment Name"}
      className="small-dailog"
    >
      <div className=" edit-client-popup">
        {loading === true && <Loader />}
        <div className="row mx-0">
          <div className="mb-3 col-lg-4 col-md-6 col-12">
            <InputKendoRct
              validityStyles={staffError}
              value={fields.docName === null ? "" : fields.docName}
              onChange={handleChange}
              name="docName"
              label="File Name"
              error={fields.docName === "" && errors.docName}
            />
          </div>
          <div className="right-sde">
            <button
              className="btn blue-primary text-white "
              onClick={handleSubmit}
            >
              Update 
            </button>
            <button
              onClick={onClose}
              className="btn grey-secondary text-white ml-3"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default EditDocumentName;
