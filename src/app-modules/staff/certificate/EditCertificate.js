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
import { Error } from "@progress/kendo-react-labels";
import Loader from "../../../control-components/loader/loader";
import { Encrption } from "../../encrption";
import ValidationHelper from "../../../helper/validation-helper";
import { renderErrors } from "src/helper/error-message-helper";

const EditCertificate = ({ onClose, certificateList, id }) => {
  const vHelper = ValidationHelper();
  const staffId = useSelector((state) => state.selectedStaffId);
  const [staffError, setStaffError] = useState(false);
  const [certificate, setCertificate] = useState([]);
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState({
    certificate: "",
    issueDate: "",
    expirationdate: "",
    completed: "",
  });

  useEffect(() => {
    getCertificateById(id);
    getCertificate();
  }, []);

  const getCertificate = () => {
    ApiHelper.getRequest(ApiUrls.GET_CLINIC_CERTIFICATE)
      .then((result) => {
        const data = result.resultData;
        setCertificate(data);
      })
      .catch(() => {});
  };

  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setFields({
      ...fields,
      [name]: value,
    });
  };

  const getCertificateById = (id) => {
    setLoading(true);
    let certificateById = Encrption(id);
    ApiHelper.getRequest(ApiUrls.GET_STAFF_CERTIFICATE_BY_ID + certificateById)
      .then((result) => {
        const data = result.resultData;
        const certificateIndo = {
          id: data.certificateId,
          certificationName: data.certificationName,
        };
        setLoading(false);
        setFields({
          certificate: certificateIndo,
          issueDate: new Date(data.dateIssued),
          expirationdate:
            data.dateExpiration === null ? "" : new Date(data.dateExpiration),
          completed: data.complete,
        });
      })
      .catch((error) => {
        renderErrors(error.message);
      });
  };

  const savedata = () => {
    setLoading(true);
    const data = {
      certificateId: fields.certificate.id,
      staffId: staffId,
      id: id,
      dateIssued: moment(fields.issueDate).format("YYYY-MM-DD"),
      dateExpiration: moment(fields.expirationdate).format("YYYY-MM-DD"),
      complete: fields.completed === 0 ? false : fields.completed,
    };
    ApiHelper.putRequest(ApiUrls.UPDATE_STAFF_CERTIFICATE, data)
      .then((result) => {
        setLoading(false);
        NotificationManager.success("Certificate updated successfully");
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
      let error = vHelper.startDateLessThanEndDateValidator(
        fields.issueDate,
        fields.expirationdate,
        "issueDate",
        "expirationdate"
      );
      if (error && error.length > 0) {
        errors["issueDate"] = error;
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
      onClose();
    }
  };
  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog
      onClose={onClose}
      title={"Edit Certification"}
      className="small-dailog"
    >
      {loading === true && <Loader />}
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
            dataItemKey="id"
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
            error={errors.issueDate}
          />
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
            value={fields.completed}
          />
        </div>
      </div>
      <div className="border-bottom-line"></div>
      <div className="d-flex flex-wrap mx-4  my-3">
        <button
          className="btn blue-primary text-white"
          onClick={handleSaveCertificate}
        >
          Update
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

export default EditCertificate;
