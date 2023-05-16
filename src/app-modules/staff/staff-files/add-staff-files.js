import React, { useState } from "react";
import { useNavigate } from "react-router";
import Loader from "../../../control-components/loader/loader";
import DrawerContainer from "../../../control-components/custom-drawer/custom-drawer";
import StaffProfileHeader from "../staff-profile/staff-profile-header";
import AppRoutes from "../../../helper/app-routes";
import InputKendoRct from "../../../control-components/input/input";
import { Upload } from "@progress/kendo-react-upload";
import ApiHelper from "../../../helper/api-helper";
import ApiUrls from "../../../helper/api-urls";
import { NotificationManager } from "react-notifications";
import { useSelector } from "react-redux";
import ErrorHelper from "../../../helper/error-helper";
import { Error } from "@progress/kendo-react-labels";
import { renderErrors } from "src/helper/error-message-helper";

const AddStaffDocuments = () => {
  const navigate = useNavigate();
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const selectedStaffId = useSelector((state) => state.selectedStaffId);

  const [settingError, setSettingError] = useState(false);
  const [errors, setErrors] = useState("");
  const [uploadError, setUploadError] = useState(false);

  const [fields, setFields] = useState({
    docName: "",
  });

  const handleChange = (event) => {
    let name = event.target.name;
    let value = event.target.value.replace(/[^a-zA-Z\s]/g, "");
    setFields({
      ...fields,
      [name]: value,
    });
  };

  const saveDocument = () => {
    setLoading(true);
    let data = {
      staffId: selectedStaffId,
      docName: fields.docName,
      documents:
        attachments.length > 0
          ? attachments.map((file) => file.getRawFile())
          : null,
    };
    ApiHelper.multipartPostRequest(ApiUrls.POST_STAFF_STORED_DOCUMNET, data)
      .then((result) => {
        setLoading(false);
        NotificationManager.success("File added successfully");
        navigate(AppRoutes.STAFF_STORED_DOCUMENTS);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;
    if (!fields.docName || fields.docName.trim().length === 0) {
      formIsValid = false;
      errors["docName"] = ErrorHelper.DOCUMENT_NAME;
    }
    if (attachments.length === 0) {
      formIsValid = false;
      errors["upload"] = ErrorHelper.UPLOAD_DOCUMENT;
      setUploadError(true);
    }
    setErrors(errors);
    return formIsValid;
  };

  const handleSubmit = () => {
    setSettingError(true);
    if (handleValidation()) {
      saveDocument();
    }
  };

  const onAdd = (event) => {
    setAttachments(event.newState);
    setUploadError(false);
  };

  const onRemove = (event) => {
    setAttachments(event.newState);
  };

  const onStatusChange = (event) => {
    setAttachments(event.newState);
  };

  return (
    <div className="d-flex flex-wrap">
      {loading === true && <Loader />}
      <div className="inner-dt col-md-3 col-lg-2">
        <DrawerContainer />
      </div>
      <div className="col-md-9 col-lg-10">
        <StaffProfileHeader />
        <div className="Service-RateList">
          <div className="d-flex justify-content-between  mt-3">
            <h4 className="address-title text-grey ">
              <span className="f-24">Add File</span>
            </h4>
          </div>
        </div>
        <div className="col mt-5 ">
          <div className="mb-3 col-lg-5 col-md-6 col-12 px-0 ">
            <InputKendoRct
              validityStyles={settingError}
              value={fields.docName}
              onChange={handleChange}
              name="docName"
              label="File Name"
              error={fields.docName === "" && errors.docName}
              required={true}
              placeholder="File Name"
            />
          </div>
          <div className="footer-composer mt-2 col-lg-5 col-md-6 col-12 px-0">
            <span className="position-relative">
              <Upload
                batch={false}
                multiple={true}
                autoUpload={false}
                files={attachments}
                defaultFiles={attachments}
                onAdd={onAdd}
                onRemove={onRemove}
                onStatusChange={onStatusChange}
                withCredentials={false}
                showActionButtons={false}
                ariaDescribedBy={"firstNameError"}
              />
              {uploadError && <Error>File is required</Error>}

              <div className="d-flex mt-4">
                <button
                  className="btn blue-primary text-white"
                  onClick={handleSubmit}
                >
                  Upload
                </button>

                <button
                  className="btn grey-secondary text-white mx-3"
                  onClick={() => {
                    navigate(AppRoutes.STAFF_STORED_DOCUMENTS);
                  }}
                >
                  Cancel
                </button>
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStaffDocuments;
