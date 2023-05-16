import React, { useEffect, useState } from "react";
import { Dialog } from "@progress/kendo-react-dialogs";
import DatePickerKendoRct from "../../../control-components/date-picker/date-picker";
import moment from "moment";
import ApiHelper from "../../../helper/api-helper";
import ApiUrls from "../../../helper/api-urls";
import { NotificationManager } from "react-notifications";
import { useSelector } from "react-redux";
import ErrorHelper from "../../../helper/error-helper";
import DropDownKendoRct from "../../../control-components/drop-down/drop-down";
import { Checkbox } from "@progress/kendo-react-inputs";
import ValidationHelper from "../../../helper/validation-helper";
import { renderErrors } from "src/helper/error-message-helper";
import { Error } from "@progress/kendo-react-labels";

const AddCertificate = ({ onClose, certificateList }) => {
  const vHelper = ValidationHelper();
  const [staffError, setStaffError] = useState(false);
  const [certificate, setCertificate] = useState([]);
  const staffId = useSelector((state) => state.selectedStaffId);

  const [errors, setErrors] = useState("");
  const [compError, setCompError] = useState("");

  
  const [fields, setFields] = useState({
    certificate: "",
    issueDate: "",
    expirationdate: "",
    completed: "",
  });

  useEffect(() => {
    getCertificate();
  }, []);

  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setFields({
      ...fields,
      [name]: value,
    });
  };

  const getCertificate = () => {
    ApiHelper.getRequest(ApiUrls.GET_CLINIC_CERTIFICATE)
      .then((result) => {
        const data = result.resultData;
        setCertificate(data);
      })
      .catch(() => { });
  };

  const savedata = () => {
    const data = {
      certificateId: fields.certificate.id,
      staffId: staffId,
      dateIssued: moment(fields.issueDate).format("YYYY-MM-DD"),
      dateExpiration: moment(fields.expirationdate).format("YYYY-MM-DD"),
      complete: fields.completed === "" ? false : fields.completed,
    };
    ApiHelper.postRequest(ApiUrls.POST_CLINIC_CERTIFICATE, data)
      .then((result) => {
        NotificationManager.success("Certificate added successfully");
        setCompError('');
        onClose();
        certificateList();
      })
      .catch((error) => {
        renderErrors(error.message);
      });
  };

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;
    if (!fields.certificate) {
      formIsValid = false;
      errors["certificate"] = ErrorHelper.CERTIFICATE;
    }
    if (!fields.issueDate) {
      formIsValid = false;
      errors["issueDate"] = ErrorHelper.ISSUE_DATE;
    } else if (fields.issueDate && fields.expirationdate) {
      let error = vHelper.startDateGreaterThanValidator(fields.issueDate, fields.expirationdate, "issueDate", "expirationdate");
      if (error && error.length > 0) {
        // errors["issueDate"] = error;
        setCompError(error)
        formIsValid = false;
      }
    }
    if (!fields.expirationdate) {
      formIsValid = false;
      errors["expirationdate"] = ErrorHelper.EXPIRATION_DATE;
    }
    setErrors(errors);
    return formIsValid;
  };

  const handleSaveCertificate = () => {
    setStaffError(true);
    if (handleValidation()) {
      savedata();
    }
  };
  const handleCancel = () => {
    onClose();
  };



  return (
    <Dialog
      onClose={onClose}
      title={"Add Certification"}
      className="small-dailog"
    >
      <div className="edit-client-popup d-flex flex-wrap">
        <div className="mb-3 col-md-12 col-12 ">
          <DropDownKendoRct
            validityStyles={staffError}
            label="Certification"
            onChange={handleChange}
            data={certificate}
            value={fields.certificate}
            textField="certificationName"
            suggest={true}
            loading={""}
            name="certificate"
            error={fields.certificate === "" && errors.certificate}
            required={true}
          />
        </div>
        <div className="mb-3 col-lg-6 col-12 ">
          <DatePickerKendoRct
            validityStyles={staffError}
            onChange={handleChange}
            placeholder="Issue Date"
            name={"issueDate"}
            label={"Issue Date"}
            value={fields.issueDate}
            required={true}
            error={!fields.issueDate && errors.issueDate}
          />
          {compError && <Error>{compError}</Error>}

        </div>
        <div className="mb-3 col-lg-6  col-12 ">
          <DatePickerKendoRct
            validityStyles={staffError}
            onChange={handleChange}
            placeholder="Expiration Date"
            name={"expirationdate"}
            label={"Expiration Date"}
            value={fields.expirationdate}
            required={true}
            error={!fields.expirationdate && errors.expirationdate}
          />
        </div>
        <div className="col-md-12 col-12 ">
          <Checkbox
            onChange={handleChange}
            label={"Completed"}
            name="completed"
            value={fields.isClientNotSubscriber}
          />
        </div>
      </div>
      <div className="border-bottom-line"></div>
      <div className="d-flex flex-wrap mx-4  my-3">
        <button
          className="btn blue-primary text-white"
          onClick={handleSaveCertificate}
        >
          Add
        </button>
        <button
          className="btn grey-secondary text-white ml-3"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </Dialog>
  );
};

export default AddCertificate;
