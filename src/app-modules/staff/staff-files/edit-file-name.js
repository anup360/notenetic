import React, { useState } from "react";
import { Dialog } from "@progress/kendo-react-dialogs";
import InputKendoRct from "../../../control-components/input/input";
import ErrorHelper from "../../../helper/error-helper";
import { useSelector } from "react-redux";
import ApiHelper from "../../../helper/api-helper";
import ApiUrls from "../../../helper/api-urls";
import { NotificationManager } from "react-notifications";
import Loader from "../../../control-components/loader/loader";
import { renderErrors } from "src/helper/error-message-helper";

const EditDocumentName = ({
  documnetselectId,
  onClose,
  documentSelectName,
  getClientDocumentById,
}) => {
  const staffId = useSelector((state) => state.loggedIn?.staffId);
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
      staffId: staffId,
      docName: fields.docName,
    };
    ApiHelper.putRequest(ApiUrls.UPDATE_STAFF_DOCUMENET, data)
      .then((result) => {
        setLoading(false);
        onClose({ editable: true });
        NotificationManager.success("File name updated successfully");
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
      title={"Edit File Name"}
      className="small-dailog">
    
      <div className="edit-client-popup ">
        {loading === true && <Loader />}
          <div className=" col-12 px-1">
            <InputKendoRct
              validityStyles={staffError}
              value={fields.docName === null ? "" : fields.docName}
              onChange={handleChange}
              name="docName"
              label="File Name"
              error={fields.docName === "" && errors.docName}
            />
          </div>
          </div>
          <div className="border-bottom-line"></div>
          <div className="d-flex mx-4 my-3">
            <button
              className="btn blue-primary text-white "
              onClick={handleSubmit}
            >
              Update   </button>
            <button
              onClick={onClose}
              className="btn grey-secondary text-white mx-3"
            >
              Cancel
            </button>
          
        </div>
      
    </Dialog>
  );
};

export default EditDocumentName;
