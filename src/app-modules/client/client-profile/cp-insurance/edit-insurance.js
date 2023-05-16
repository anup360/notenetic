import { Checkbox } from "@progress/kendo-react-inputs";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
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
import {
  default as AppRoutes,
  default as APP_ROUTES,
} from "../../../../helper/app-routes";
import ErrorHelper from "../../../../helper/error-helper";
import ValidationHelper from "../../../../helper/validation-helper";
import { ClientService } from "../../../../services/clientService";
import { Encrption } from "../../../encrption";
import ClientHeader from "../../client-profile/client-header/client-header";
import { renderErrors } from "src/helper/error-message-helper";

const EditInsurance = ({ onClose }) => {
  const dispatch = useDispatch();
  const vHelper = ValidationHelper();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [insuranceData, setInsuranceData] = useState([]);
  const clinicId = useSelector((state) => state.loggedIn.clinicId);
  const [settingError, setSettingError] = useState(false);
  const [errors, setErrors] = useState("");
  const [genderData, setGenderData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [fields, setField] = useState({});
  const [socialSecurityNumber, setSocialSecurityNumber] = useState("");
  const selectedClientId = useSelector((state) => state.selectedClientId);

  const relationShip = [
    { id: 1, name: "Child" },
    { id: 2, name: "Other" },
    { id: 3, name: "Spouse" },
  ];

  let currentdate = new Date();

  useEffect(() => {
    getInsuranceTypes();
    getGender();
    getState();
    getInsuranceListById();
  }, []);

  const getInsuranceListById = () => {
    setLoading(true);
    ApiHelper.getRequest(
      ApiUrls.GET_INSURANCE_BY_ID + Encrption(state?.InsuranceID)
    )
      .then((result) => {
        setLoading(false);
        const data = result.resultData;
        const InsuranceType = {
          id: data.insuranceTypeId,
          insuranceName: data.insuranceName,
        };
        const gender = {
          id: data.subGenderId,
          name: data.subGender,
        };
        const state = {
          id: data.subStateId,
          stateName: data.stateName,
        };
        const realtionShip = {
          id: data.subRelationshipId,
          name: data.subRelationName,
        };

        setField({
          id: data.id,
          dateStart: new Date(data.dateStart),
          endDate: data.dateEnd ? new Date(data.dateEnd) : "",
          //endDate: new Date(data.endDate),
          isActive: data,
          policyNumber: data.policyNumber,
          insuranceTypeId: InsuranceType,
          isPrimary: data.isPrimary,
          isClientNotSubscriber: data.isClientNotSubscriber,
          subFirstName: data.subFirstName,
          subLastName: data.subLastName,
          subDateOfBirth: data.subDateOfBirth
            ? new Date(data.subDateOfBirth)
            : "",
          subGenderId: gender,
          subSsn: data.subSsn,
          subAddress: data.subAddress,
          subCity: data.subCity,
          subState: state,
          subZip: data.subZip,
          subRelationshipId: realtionShip,
        });
        setSocialSecurityNumber(data.subSsn);
      })
      .catch((error) => {
        renderErrors(error.message);
        navigate(APP_ROUTES.INSURANCE);
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

  const UpdateInsurance = () => {
    var data = {
      id: fields.id,
      dateStart: moment(fields.dateStart).format("YYYY-MM-DD"),
      dateEnd: moment(fields.endDate).format("YYYY-MM-DD"),
      policyNumber: fields.policyNumber,
      insuranceTypeId: fields.insuranceTypeId.id,
      isPrimary: fields.isPrimary,
      isClientNotSubscriber: fields.isClientNotSubscriber,
      subFirstName:
        fields.isClientNotSubscriber === false ? null : fields.subFirstName,
      subLastName:
        fields.isClientNotSubscriber === false ? null : fields.subLastName,
      subDateOfBirth:
        fields.isClientNotSubscriber === false
          ? null
          : moment(fields.subDateOfBirth).format("YYYY-MM-DD"),
      subGenderId:
        fields.isClientNotSubscriber === false ? null : fields.subGenderId.id,
      subSSN: fields.isClientNotSubscriber === false ? null : fields.subSsn,
      subAddress:
        fields.isClientNotSubscriber === false ? null : fields.subAddress,
      subCity: fields.isClientNotSubscriber === false ? null : fields.subCity,
      subStateId:
        fields.isClientNotSubscriber === false ? null : fields.subState.id,
      subZip: fields.isClientNotSubscriber === false ? null : fields.subZip,
      subRelationshipId:
        fields.isClientNotSubscriber === false
          ? null
          : fields.subRelationshipId.id,
    };
    ApiHelper.putRequest(ApiUrls.UPDATE_INSURANCE, data)
      .then((result) => {
        setLoading(false);
        NotificationManager.success("Insurance updated successfully");
        // dispatch({
        //   type: GET_CLIENT_INSURANCE,
        //   payload: {
        //     insuranceName: fields.insuranceTypeId.insuranceName
        //   },
        // });
        getCurrentInsurance();
        navigate(AppRoutes.INSURANCE);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  // ------------------------------GET DATA-----------------------
  const getInsuranceTypes = () => {
    ApiHelper.getRequest(ApiUrls.GET_INSURANCE_TYPE + Encrption(clinicId))
      .then((result) => {
        let insuranceList = result.resultData;
        // const insuranceTypeInfo={
        //   id:insuranceList.id,
        //   insuranceName:insuranceList.insuranceName
        // }
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
      errors["endDate"] = ErrorHelper.endDate;
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

    if (!fields.subGenderId && fields.isClientNotSubscriber) {
      formIsValid = false;
      errors["subGenderId"] = ErrorHelper.GENDER;
    }
    if (
      (!fields.subSsn || fields.subSsn.trim().length === 0) &&
      fields.isClientNotSubscriber
    ) {
      formIsValid = false;
      errors["subSsn"] = ErrorHelper.SSN;
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
    const rawValue = event.target.rawValue;
    if (name === "socialSecurityNumber") {
      setSocialSecurityNumber(rawValue);
    }
    setField({
      ...fields,
      [name]: value,
    });
  };
  // ----------------------------END------------------------------------

  // ---------------------------HANDLESUBMIT--------------------------

  const handleSubmit = () => {
    setSettingError(true);
    if (handleValidation()) {
      UpdateInsurance();
    }
  };
  const handleValueChange = (e) => {
    const name = e.target.name;
    const rawValue = e.target.rawValue;
    setField({
      ...fields,
      [name]: rawValue,
    });
  };

  return (
    <div className="d-flex flex-wrap ">
      {loading === true && <Loader />}
      <div className="inner-dt col-md-3 col-lg-2">
        <CustomDrawer />
      </div>
      <div className="col-md-9 col-lg-10 ">
        <ClientHeader />
        <div className="row mt-5">
          <div className="mb-3 col-lg-4 col-md-6 col-12">
            <DropDownKendoRct
              label="Insurance Type"
              onChange={handleChange}
              data={insuranceData}
              validityStyles={settingError}
              value={fields.insuranceTypeId}
              textField="insuranceName"
              name="insuranceTypeId"
              error={!fields.insuranceTypeId && errors.insuranceTypeId}
              required={true}
              placeholder="Insurance Type"
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
              title={"Start Date"}
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
              title={"End Date"}
              error={!fields.endDate && errors.endDate}
              placeholder={"End Date"}
              required={true}
            />
          </div>
        </div>
        <div className="mb-3 col-lg-4 col-md-6 col-12 ">
          <Checkbox
            onChange={handleChange}
            value={fields.isPrimary}
            name="isPrimary"
            label={"Primary"}
          />
        </div>
        <div className="mb-3 col-lg-4 col-md-6 col-12 ">
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
                error={!fields.subFirstName && errors.subFirstName}
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
                error={!fields.subLastName && errors.subLastName}
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
                error={!fields.subDateOfBirth && errors.subDateOfBirth}
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
              />
            </div>
            <div className="mb-3 col-lg-4 col-md-6 col-12">
              <SocialSecurityInput
                validityStyles={settingError}
                value={fields.subSsn}
                onChange={handleValueChange}
                name="subSsn"
                label="SSN"
                error={fields.subSsn && errors.subSsn}
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
              />
            </div>
            <div className="mb-3 col-lg-4 col-md-6 col-12">
              <InputKendoRct
                validityStyles={settingError}
                value={fields.subAddress}
                onChange={handleChange}
                name="subAddress"
                label="Address"
                error={!fields.subAddress && errors.subAddress}
                required={true}
                placeholder="Address"
              />
            </div>
            <div className="mb-3 col-lg-4 col-md-6 col-12">
              <InputKendoRct
                validityStyles={settingError}
                value={fields.subCity}
                onChange={handleChange}
                name="subCity"
                label="City"
                error={!fields.subCity && errors.subCity}
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
        <div>
          <button
            className="btn blue-primary text-white "
            onClick={handleSubmit}
          >
            Update Insurance
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

export default EditInsurance;
