import { Checkbox } from "@progress/kendo-react-inputs";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { GET_CLIENT_INSURANCE } from "../../../../actions";
import CustomDrawer from "../../../../control-components/custom-drawer/custom-drawer";
import DatePickerKendoRct from "../../../../control-components/date-picker/date-picker";
import DropDownKendoRct from "../../../../control-components/drop-down/drop-down";
import InputKendoRct from "../../../../control-components/input/input";
import Loader from "../../../../control-components/loader/loader";
import SocialSecurityInput from "../../../../control-components/social-security/social-security";
import ZipCodeInput from "../../../../control-components/zip-code/zip-code";
import ApiHelper from "../../../../helper/api-helper";
import ApiUrls from "../../../../helper/api-urls";
import AppRoutes from "../../../../helper/app-routes";
import ErrorHelper from "../../../../helper/error-helper";
import ValidationHelper from "../../../../helper/validation-helper";
import { ClientService } from "../../../../services/clientService";
import ClientHeader from "../client-header/client-header";
import useDateCheck from "../../../../cutomHooks/date-check/date-check";
import { renderErrors } from "src/helper/error-message-helper";

const AddInsurance = () => {
  const vHelper = ValidationHelper();
  const navigate = useNavigate();
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [insuranceData, setInsuranceData] = useState([]);
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const clinicId = useSelector((state) => state.loggedIn.clinicId);
  const [settingError, setSettingError] = useState(false);
  const [genderData, setGenderData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const dispatch = useDispatch();
  const [dateChecker, setDateCheck] = useDateCheck();

  const relationShip = [
    { id: 1, name: "Child" },
    { id: 2, name: "Other" },
    { id: 3, name: "Spouse" },
  ];

  const [fields, setField] = useState({
    clientId: "",
    dateStart: "",
    endDate: "",
    policyNumber: "",
    insuranceTypeId: "",
    isPrimary: "",
    isClientNotSubscriber: "",
    subFirstName: "",
    subLastName: "",
    subDateOfBirth: "",
    subGenderId: "",
    subSSN: "",
    subAddress: "",
    subCity: "",
    subState: "",
    subZip: "",
    subRelationshipId: "",
  });
  const handleValueChange = (e) => {
    const name = e.target.name;
    const rawValue = e.target.rawValue;
    setField({
      ...fields,
      [name]: rawValue,
    });
  };

  const getCurrentInsurance = async () => {
    await ClientService.getClientCurrentInsurance(selectedClientId)
      .then((result) => {
        let insuranceList = result.resultData;
        dispatch({
          type: GET_CLIENT_INSURANCE,
          payload: result.resultData,
        });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const saveInsurance = () => {
    setLoading(true);
    var data = {
      clientId: selectedClientId,
      dateStart: moment(fields.dateStart).format("YYYY-MM-DD"),
      dateEnd:
        fields.endDate === ""
          ? null
          : moment(fields.endDate).format("YYYY-MM-DD"),
      policyNumber: fields.policyNumber,
      insuranceTypeId: fields.insuranceTypeId.id,
      isPrimary: fields.isPrimary === "" ? false : fields.isPrimary,
      isClientNotSubscriber:
        fields.isClientNotSubscriber === ""
          ? false
          : fields.isClientNotSubscriber,
      subFirstName:
        fields.isClientNotSubscriber === true ? fields.subFirstName : null,
      subLastName:
        fields.isClientNotSubscriber === true ? fields.subLastName : null,
      subDateOfBirth: fields.isClientNotSubscriber
        ? fields.subDateOfBirth === ""
          ? null
          : moment(fields.subDateOfBirth).format("YYYY-MM-DD")
        : null,
      subGenderId: fields.isClientNotSubscriber ? fields.subGenderId.id : null,
      subSsn: fields.isClientNotSubscriber ? fields.subSSN : null,
      subAddress: fields.isClientNotSubscriber ? fields.subAddress : null,
      subCity: fields.isClientNotSubscriber ? fields.subCity : null,
      subStateId: fields.isClientNotSubscriber ? fields.subState.id : null,
      subZip: fields.isClientNotSubscriber ? fields.subZip : null,
      subRelationshipId: fields.isClientNotSubscriber
        ? fields.subRelationshipId.id
        : null,
    };

    ApiHelper.postRequest(ApiUrls.INSERT_INSURANCE, data)
      .then((result) => {
        setLoading(false);
        NotificationManager.success("Insurance Added successfully");
        navigate(AppRoutes.INSURANCE);
        getCurrentInsurance();
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  // ------------------------------GET DATA-----------------------
  const getInsuranceTypes = () => {
    ApiHelper.getRequest(ApiUrls.GET_INSURANCE_TYPE + clinicId)
      .then((result) => {
        let insuranceList = result.resultData;
        setInsuranceData(insuranceList);
      })
      .catch((error) => {
        renderErrors(error.message);
      });
  };

  const getGender = () => {
    ApiHelper.getRequest(ApiUrls.GET_GENDER)
      .then((result) => {
        let genderList = result.resultData;
        setGenderData(genderList);
      })
      .catch((error) => {
        renderErrors(error.message);
      });
  };

  const getState = () => {
    ApiHelper.getRequest(ApiUrls.GET_STATE)
      .then((result) => {
        let stateList = result.resultData;
        setStateData(stateList);
      })
      .catch((error) => {
        renderErrors(error.message);
      });
  };

  useEffect(() => {
    getInsuranceTypes();
    getGender();
    getState();
  }, []);

  // --------------------------------END------------------------------

  // --------------------------------validation----------------------
  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;
    var emailPattern = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );
    var pattern = new RegExp(/^[0-9\b]+$/);

    if (!fields.insuranceTypeId) {
      formIsValid = false;
      errors["insuranceTypeId"] = ErrorHelper.INSURANCETYPE;
    }

    if (!fields.policyNumber || fields.policyNumber.trim().length === 0) {
      formIsValid = false;
      errors["policyNumber"] = ErrorHelper.POILICY;
    }
    if (!fields.dateStart) {
      formIsValid = false;
      errors["dateStart"] = ErrorHelper.START_DATE;
    } else if (fields.dateStart && fields.endDate) {
      let error = vHelper.startDateLessThanEndDateValidator(
        fields.dateStart,
        fields.endDate,
        "dateStart",
        "endDate"
      );
      if (error && error.length > 0) {
        errors["dateStart"] = error;
        formIsValid = false;
      }
    }
    if (!fields.endDate) {
      formIsValid = false;
      errors["endDate"] = ErrorHelper.END_DATE;
    }

    if (
      (!fields.subFirstName || fields.subFirstName.trim().length === 0) &&
      fields.isClientNotSubscriber
    ) {
      formIsValid = false;
      errors["subFirstName"] = ErrorHelper.FIRST_NAME;
    }
    if (
      (!fields.subLastName || fields.subLastName.trim().length === 0) &&
      fields.isClientNotSubscriber
    ) {
      formIsValid = false;
      errors["subLastName"] = ErrorHelper.LAST_NAME;
    }
    if (!fields.subDateOfBirth && fields.isClientNotSubscriber) {
      formIsValid = false;
      errors["subDateOfBirth"] = ErrorHelper.DOB;
    }
    if (dateChecker === true) {
      formIsValid = false;
      errors["subDateOfBirth"] = ErrorHelper.DATE_CHECK;
    }

    if (!fields.subGenderId && fields.isClientNotSubscriber) {
      formIsValid = false;
      errors["subGenderId"] = ErrorHelper.GENDER;
    }
    if (
      (!fields.subSSN || fields.subSSN.trim().length === 0) &&
      fields.isClientNotSubscriber
    ) {
      formIsValid = false;
      errors["subSSN"] = ErrorHelper.SSN;
    }
    if (!fields.subRelationshipId && fields.isClientNotSubscriber) {
      formIsValid = false;
      errors["subRelationshipId"] = ErrorHelper.RELATION;
    }
    if (
      (!fields.subAddress || fields.subAddress.trim().length === 0) &&
      fields.isClientNotSubscriber
    ) {
      formIsValid = false;
      errors["subAddress"] = ErrorHelper.ADDRESS;
    }
    if (
      (!fields.subCity || fields.subCity.trim().length === 0) &&
      fields.isClientNotSubscriber
    ) {
      formIsValid = false;
      errors["subCity"] = ErrorHelper.CITY;
    }
    if (!fields.subState && fields.isClientNotSubscriber) {
      formIsValid = false;
      errors["subState"] = ErrorHelper.STATE;
    }
    if (
      (!fields.subZip || fields.subZip.trim().length === 0) &&
      fields.isClientNotSubscriber
    ) {
      formIsValid = false;
      errors["subZip"] = ErrorHelper.ZIP_CODE;
    }

    setErrors(errors);
    return formIsValid;
  };

  // ---------------------------------END---------------------------

  // --------------------------------EVENT CHANGE---------------------
  const handleChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    setField({
      ...fields,
      [name]: value,
    });
  };
  // ----------------------------END------------------------------------

  // ---------------------------HANDLESUBMIT--------------------------

  const handleSubmit = () => {
    setDateCheck(fields.subDateOfBirth);
    setSettingError(true);
    if (handleValidation()) {
      saveInsurance();
    }
  };

  return (
    <div className="d-flex flex-wrap">
      {loading === true && <Loader />}
      <div className="inner-dt col-md-3 col-lg-2">
        <CustomDrawer />
      </div>
      <div className="col-md-6 col-lg-10">
        <ClientHeader />
        <div className="row mt-5">
          <div className="mb-3 col-lg-4 col-md-6 col-12 ">
            <DropDownKendoRct
              label="Insurance Type"
              onChange={handleChange}
              data={insuranceData}
              validityStyles={settingError}
              value={fields.insuranceTypeId}
              textField="insuranceName"
              name="insuranceTypeId"
              placeholder="Insurance Type"
              error={fields.insuranceTypeId === "" && errors.insuranceTypeId}
              required={true}
            />
          </div>
          <div className="mb-3 col-lg-4 col-md-6 col-12">
            <InputKendoRct
              validityStyles={settingError}
              value={fields.policyNumber}
              onChange={handleChange}
              name="policyNumber"
              required={true}
              label="Policy#"
              error={fields.policyNumber === "" && errors.policyNumber}
              placeholder="Policy Number"
            />
          </div>
          <div className="mb-3 col-lg-4 col-md-6 col-12"></div>

          <div className="mb-3 col-lg-4 col-md-6 col-12">
            <DatePickerKendoRct
              onChange={handleChange}
              format={"MM/dd/YYYY"}
              name={"dateStart"}
              label={"Start Date"}
              value={fields.dateStart}
              validityStyles={settingError}
              required={true}
              error={errors.dateStart}
              placeholder={"Start Date"}
            />
          </div>
          <div className="mb-3 col-lg-4 col-md-6 col-12">
            <DatePickerKendoRct
              validityStyles={settingError}
              onChange={handleChange}
              format={"MM/dd/YYYY"}
              name={"endDate"}
              label={"End Date"}
              value={fields.endDate}
              error={!fields.endDate && errors.endDate}
              placeholder={"End Date"}
              required={true}
            />
          </div>
        </div>
        <div className="mb-3 col-lg-4 col-md-6 col-12 px-0">
          <Checkbox
            onChange={handleChange}
            value={fields.isPrimary}
            name="isPrimary"
            label={"Primary"}
          />
        </div>
        <div className="mb-3 col-lg-4 col-md-6 col-12 px-0">
          <Checkbox
            onChange={handleChange}
            label={"Insured is different from client"}
            name="isClientNotSubscriber"
            value={fields.isClientNotSubscriber}
          />
        </div>
        {fields.isClientNotSubscriber && (
          <div className="row">
            <div className="mb-3 col-lg-4 col-md-6 col-12">
              <InputKendoRct
                validityStyles={settingError}
                value={fields.subFirstName}
                onChange={handleChange}
                name="subFirstName"
                label="First Name"
                error={fields.subFirstName === "" && errors.subFirstName}
                required={true}
                placeholder="First Name"
              />
            </div>
            <div className="mb-3 col-lg-4 col-md-6 col-12">
              <InputKendoRct
                validityStyles={settingError}
                value={fields.subLastName}
                onChange={handleChange}
                name="subLastName"
                required={true}
                label="Last name"
                error={fields.subLastName === "" && errors.subLastName}
                placeholder="Last Name"
              />
            </div>
            <div className="mb-3 col-lg-4 col-md-6 col-12">
              <DatePickerKendoRct
                validityStyles={settingError}
                onChange={handleChange}
                format={"MM/dd/YYYY"}
                name={"subDateOfBirth"}
                label={"Date of Birth"}
                value={fields.subDateOfBirth}
                placeholder={"Date of Birth"}
                required={true}
                error={errors.subDateOfBirth}
                max={new Date()}
              />
            </div>
            <div className="mb-3 col-lg-4 col-md-6 col-12">
              <DropDownKendoRct
                label="Gender"
                onChange={handleChange}
                data={genderData}
                validityStyles={settingError}
                value={fields.subGenderId}
                textField="name"
                suggest={true}
                name="subGenderId"
                required={true}
                error={!fields.subGenderId && errors.subGenderId}
                placeholder="Gender"
              />
            </div>
            <div className="mb-3 col-lg-4 col-md-6 col-12">
              <SocialSecurityInput
                validityStyles={settingError}
                value={fields?.subSSN === null ? "" : fields?.subSSN}
                onChange={handleValueChange}
                name="subSSN"
                label="SSN"
                error={fields.subSSN.trim().length == "" && errors.subSSN}
                required={true}
                placeholder="Social Security Number"
              />
            </div>
            <div className="mb-3 col-lg-4 col-md-6 col-12">
              <DropDownKendoRct
                label="Relationship"
                onChange={handleChange}
                data={relationShip}
                validityStyles={settingError}
                value={fields.subRelationshipId}
                textField="name"
                suggest={true}
                name="subRelationshipId"
                error={!fields.subRelationshipId && errors.subRelationshipId}
                required={true}
                placeholder="Relationship"
              />
            </div>
            <div className="mb-3 col-lg-4 col-md-6 col-12">
              <InputKendoRct
                validityStyles={settingError}
                value={fields?.subAddress === null ? "" : fields?.subAddress}
                onChange={handleChange}
                name="subAddress"
                label="Address"
                error={fields.subAddress === "" && errors.subAddress}
                required={true}
                placeholder="Address"
              />
            </div>
            <div className="mb-3 col-lg-4 col-md-6 col-12">
              <InputKendoRct
                validityStyles={settingError}
                value={fields?.subCity === null ? "" : fields?.subCity}
                onChange={handleChange}
                name="subCity"
                label="City"
                error={fields.subCity === "" && errors.subCity}
                required={true}
                placeholder="City"
              />
            </div>
            <div className="mb-3 col-lg-4 col-md-6 col-12">
              <DropDownKendoRct
                label="State"
                onChange={handleChange}
                data={stateData}
                validityStyles={settingError}
                value={fields.subState}
                textField="stateName"
                suggest={true}
                name="subState"
                required={true}
                error={!fields.subState && errors.subState}
                placeholder="State"
              />
            </div>
            <div className="mb-3 col-lg-4 col-md-6 col-12">
              <ZipCodeInput
                validityStyles={settingError}
                onChange={handleChange}
                name="subZip"
                label="Zip Code"
                value={fields?.subZip === null ? "" : fields?.subZip}
                required={true}
                error={!fields.subZip && errors.subZip}
                placeholder="Zip Code"
              />
            </div>
          </div>
        )}
        <div className="mt-4">
          <button
            className="btn blue-primary text-white "
            onClick={handleSubmit}
          >
            Add Insurance
          </button>

          <button
            className="btn grey-secondary text-white mx-3"
            onClick={() => {
              navigate(AppRoutes.INSURANCE);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddInsurance;
