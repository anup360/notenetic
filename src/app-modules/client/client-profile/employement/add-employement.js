import React, { useEffect, useState } from "react";
import { Dialog } from "@progress/kendo-react-dialogs";
import Loader from "../../../../control-components/loader/loader";
import ApiUrls from "../../../../helper/api-urls";
import ApiHelper from "../../../../helper/api-helper";
import DatePickerKendoRct from "../../../../control-components/date-picker/date-picker";
import TextAreaKendoRct from "../../../../control-components/kendo-text-area/kendo-text-area";
import { useSelector } from "react-redux";
import { NotificationManager } from "react-notifications";
import ErrorHelper from "../../../../helper/error-helper";
import InputKendoRct from "../../../../control-components/input/input";
import moment from "moment";
import { Encrption } from '../../../encrption';
import ValidationHelper from "../../../../helper/validation-helper";
import { renderErrors } from "src/helper/error-message-helper";

const AddEmployment = ({ onClose, selectedEmployementId }) => {
  const vHelper = ValidationHelper();
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const [loading, setLoading] = useState(false);
  const [settingError, setSettingError] = useState(false);
  const [errors, setErrors] = useState("");

  const [fields, setFields] = useState({
    organisationName: "",
    designation: "",
    jobStartDate: "",
    jobEndDate: "",
    jobResponsibilities: "",
  });

  useEffect(() => {
    if (selectedEmployementId) {
      getEmployementById();

    }
  }, []);


  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFields({
      ...fields,
      [name]: value,
    });
  };
  const handleTextChange = (e) => {
    const name = e.target.name;
    const value = e.value;
    setFields({
      ...fields,
      [name]: value,
    });
  };
  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;
    if (!fields.organisationName) {
      formIsValid = false;
      errors["organisationName"] = ErrorHelper.FIELD_BLANK;
    }
    if (!fields.designation) {
      formIsValid = false;
      errors["designation"] = ErrorHelper.FIELD_BLANK;
    }
    if (!fields.jobStartDate) {
      formIsValid = false;
      errors["jobStartDate"] = ErrorHelper.FIELD_BLANK;
    }
    else if (fields.jobStartDate && fields.jobEndDate) {
      let error = vHelper.startDateLessThanEndDateValidator(fields.jobStartDate, fields.jobEndDate, "jobStartDate", "jobEndDate")
      if (error && error.length > 0) {
        errors["jobStartDate"] = error;
        formIsValid = false;
      }
    }
    if (!fields.jobResponsibilities) {
      formIsValid = false;
      errors["jobResponsibilities"] = ErrorHelper.FIELD_BLANK;
    }
    setErrors(errors);
    return formIsValid;
  };
  const handleSubmit = () => {
    setSettingError(true);
    if (handleValidation()) {
      if (selectedEmployementId) {
        updateEmployement()
      } else {
        saveEmployement();
      }

    }
  };
  const saveEmployement = async () => {
    setLoading(true);
    const data = {
      clientId: selectedClientId,
      organisationName: fields.organisationName,
      designation: fields.designation,
      jobStartDate:
        fields.jobStartDate === ""
          ? null
          : moment(fields.jobStartDate).format("YYYY/MM/DD"),
      jobEndDate:
        fields.jobEndDate === ""
          ? null
          : moment(fields.jobEndDate).format("YYYY/MM/DD"),
      jobResponsibilities: fields.jobResponsibilities,
    };
    await ApiHelper.postRequest(ApiUrls.INSERT_CLIENT_EMPLOYEMENTS, data)
      .then((result) => {
        setLoading(false);
        NotificationManager.success("Employment added successfully");
        onClose({ added: true });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error);
      });
  };

  const updateEmployement = async () => {
    setLoading(true);
    const data = {
      id: selectedEmployementId,
      organisationName: fields.organisationName,
      designation: fields.designation,
      jobStartDate: fields.jobStartDate,
      jobEndDate: fields.jobEndDate,
      jobResponsibilities: fields.jobResponsibilities,
    };
    await ApiHelper.putRequest(ApiUrls.UPDATE_CLIENT_EMPLOYEMENTS, data)
      .then((result) => {
        setLoading(false);
        NotificationManager.success("Employment updated successfully");
        onClose({ edited: true });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error);
      });
  };

  const getEmployementById = () => {
    setLoading(true);
    try {
      ApiHelper.getRequest(
        ApiUrls.GER_CLIENT_EMPLOYEMENT_BY_ID + Encrption(selectedEmployementId)
      ).then((response) => {
        const data = response.resultData;
        setFields({
          organisationName: data.organisationName,
          designation: data.designation,
          jobStartDate: data.jobStartDate ? new Date(data.jobStartDate) : "",
          jobEndDate: data.jobEndDate ? new Date(data.jobEndDate) : "",
          jobResponsibilities: data.jobResponsibilities,
        });
        setLoading(false);
      });
    } catch (err) { }
  };
  return (
    <Dialog
      onClose={onClose}
      title={selectedEmployementId ? "Edit Employement" : "Add Employement"}
      className="small-dailog"
    >
      <div className="edit-client-popup d-flex flex-wrap">
        <div className="col-md-12 col-lg-12 col-12 mb-4">
          <InputKendoRct
            validityStyles={settingError}
            name="organisationName"
            value={fields.organisationName}
            onChange={handleChange}
            label="Organisation Name"
            error={!fields.organisationName && errors.organisationName}
            required={true}
            placeholder="Organisation Name"
          />
        </div>
        <div className="col-md-12 col-lg-12 col-12 mb-4">
          <InputKendoRct
            validityStyles={settingError}
            name="designation"
            value={fields.designation}
            onChange={handleChange}
            label="Designation"
            error={!fields.designation && errors.designation}
            required={settingError}
            placeholder="Designation"
          />
        </div>
        <div className="col-md-6 col-lg-6 col-12 mb-4">
          <DatePickerKendoRct
            validityStyles={settingError}
            onChange={handleChange}
            placeholder="Job Start Date"
            name={"jobStartDate"}
            label={"Job Start Date"}
            value={fields.jobStartDate}
            required={true}
            error={errors.jobStartDate}
          />
        </div>
        <div className="col-md-6 col-lg-6 col-12 mb-4">
          <DatePickerKendoRct
            validityStyles={settingError}
            onChange={handleChange}
            placeholder="Job End Date"
            name={"jobEndDate"}
            label={"Job End Date"}
            value={fields.jobEndDate}
          //   required={true}
          //   error={!fields.jobEndDate && errors.jobEndDate}
          />
        </div>

        <div className="col-md-12 col-lg-12 col-12 ">
          <TextAreaKendoRct
            validityStyles={settingError}
            name="jobResponsibilities"
            txtValue={fields.jobResponsibilities}
            onChange={handleTextChange}
            label="Job Responsibilities"
            error={!fields.jobResponsibilities && errors.jobResponsibilities}
            required={settingError}
          />
        </div>
      </div>

      {loading == true && <Loader />}

      <div className="border-bottom-line"></div>
      <div className="d-flex my-3 px-3">
        <div>
          <button
            onClick={handleSubmit}
            className="btn blue-primary text-white  mx-3"
          >
            {selectedEmployementId ? "Update" : "Add"}
          </button>
        </div>
        <div>
          <button
            className="btn grey-secondary text-white"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>


    </Dialog>
  );
};

export default AddEmployment;
