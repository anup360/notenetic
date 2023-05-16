import React, { useEffect, useState } from "react";
import { Dialog } from "@progress/kendo-react-dialogs";
import Loader from "../../../../control-components/loader/loader";
import ApiUrls from "../../../../helper/api-urls";
import ApiHelper from "../../../../helper/api-helper";
import { useSelector } from "react-redux";
import InputKendoRct from "../../../../control-components/input/input";
import DropDownKendoRct from "../../../../control-components/drop-down/drop-down";
import { NotificationManager } from "react-notifications";
import ErrorHelper from "../../../../helper/error-helper";
import { Encrption } from "../../../encrption";
import { NumericTextBox } from "@progress/kendo-react-inputs";
import { renderErrors } from "src/helper/error-message-helper";

const AddEducation = ({ onClose, selectedId }) => {
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState(false);
  const [errors, setErrors] = useState("");
  const [educationLevel, setEducationLevel] = useState([]);

  const [fields, setFields] = useState({
    educationLevelId: "",
    yearOfPassing: "",
    gradePercentage: "",
    schoolCollegeName: "",
    degree: "",
  });

  useEffect(() => {
    getEducationLevel();
    if (selectedId) {
      getEducationById();
    }
  }, []);

  const getEducationById = () => {
    setLoading(true);
    ApiHelper.getRequest(
      ApiUrls.GET_CLIENT_EDUCATION_BY_ID + Encrption(selectedId)
    )
      .then((result) => {
        const data = result.resultData;

        let educationData = {
          id: data.educationLevelId,
          name: data.educationLevel,
        };
        setFields({
          id: selectedId,
          educationLevelId: educationData,
          yearOfPassing: data.yearOfPassing,
          gradePercentage: data.gradePercentage,
          schoolCollegeName: data.schoolCollegeName,
          degree: data.degree,
        });
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const getEducationLevel = () => {
    ApiHelper.getRequest(ApiUrls.GET_EDUCATION_LEVEL)
      .then((result) => {
        setEducationLevel(result.resultData);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFields({
      ...fields,
      [name]: value,
    });
  };

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;

    if (!fields.educationLevelId) {
      formIsValid = false;
      errors["educationLevelId"] = ErrorHelper.FIELD_BLANK;
    }
    if (!fields.schoolCollegeName) {
      formIsValid = false;
      errors["schoolCollegeName"] = ErrorHelper.FIELD_BLANK;
    }
    // if (!fields.degree) {
    //   formIsValid = false;
    //   errors["degree"] = ErrorHelper.FIELD_BLANK;
    // }

    setErrors(errors);
    return formIsValid;
  };

  const saveEducation = () => {
    setLoading(true);
    const data = {
      clientId: selectedClientId,
      educationLevelId: fields.educationLevelId.id,
      yearOfPassing: fields.yearOfPassing,
      gradePercentage: fields.gradePercentage,
      schoolCollegeName: fields.schoolCollegeName,
      degree: fields.degree,
    };
    setLoading(true);
    ApiHelper.postRequest(ApiUrls.INSERT_CLIENT_EDUCATION, data)
      .then((result) => {
        setLoading(false);
        NotificationManager.success("Education added successfully");
        onClose({ added: true });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error);
      });
  };

  const updateEducation = () => {
    const data = {
      id: selectedId,
      educationLevelId: fields.educationLevelId.id,
      yearOfPassing: fields.yearOfPassing === "" ? null : fields.yearOfPassing,
      gradePercentage:
        fields.gradePercentage === "" ? null : fields.gradePercentage,
      schoolCollegeName: fields.schoolCollegeName,
      degree: fields.degree,
    };
    setLoading(true);
    ApiHelper.putRequest(ApiUrls.UPDATE_CLIENT_EDUCATION, data)
      .then((result) => {
        setLoading(false);
        NotificationManager.success("Education updated successfully");
        onClose({ edited: true });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error);
      });
  };

  const handleSubmit = (event) => {
    setValidationError(true);
    if (handleValidation()) {
      if (selectedId) {
        updateEducation();
      } else {
        saveEducation();
      }
    }
  };

  return (
    <Dialog
      onClose={onClose}
      title={selectedId ? "Edit Education" : "Add Education"}
      className="dialog-modal"
    >
      <div className="edit-client-popup d-flex flex-wrap">
        <div className="col-md-12 col-lg-6 col-12 mb-3 px-2">
          <DropDownKendoRct
            validityStyles={validationError}
            data={educationLevel}
            onChange={handleChange}
            value={fields.educationLevelId}
            textField="name"
            label="Education Level"
            dataItemKey="id"
            name="educationLevelId"
            required={true}
            error={!fields.educationLevelId && errors.educationLevelId}
            placeholder="Education Level"
          />
        </div>
        <div className="col-md-12 col-lg-6 col-12 mb-3 px-2">
          <InputKendoRct
            validityStyles={validationError}
            name="degree"
            value={fields.degree}
            onChange={handleChange}
            label="Degree"
            // error={!fields.degree && errors.degree}
            // required={true}
            placeholder="Degree"
          />
        </div>
        <div className="col-md-12 col-lg-6 col-12 mb-3 px-2">
          <NumericTextBox
            type="number"
            validityStyles={validationError}
            name="yearOfPassing"
            value={fields.yearOfPassing}
            onChange={handleChange}
            label="Year of completion"
            placeholder={"Year of Passing"}
            spinners={false}
          />
        </div>
        <div className="col-md-12 col-lg-6 col-12 mb-3 px-2">
          <InputKendoRct
            validityStyles={validationError}
            name="gradePercentage"
            value={fields.gradePercentage}
            onChange={handleChange}
            label="Grade/Percentage"
            placeholder={"Grade/Percentage"}
          />
        </div>
        <div className="col-md-12 col-lg-12 col-12 px-2">
          <InputKendoRct
            validityStyles={validationError}
            name="schoolCollegeName"
            value={fields.schoolCollegeName}
            onChange={handleChange}
            label="School/College Name"
            error={!fields.schoolCollegeName && errors.schoolCollegeName}
            required={true}
            placeholder={"School/College Name"}
          />
        </div>
      </div>

      {loading == true && <Loader />}
      <div className="border-bottom-line"></div>
      <div className="d-flex my-4 mx-3">
        <button
          onClick={handleSubmit}
          className="btn blue-primary text-white mx-3"
        >
          {selectedId ? "Update" : "Add"}
        </button>

        <button className="btn grey-secondary text-white" onClick={onClose}>
          Cancel
        </button>
      </div>
    </Dialog>
  );
};
export default AddEducation;
