import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ApiUrls from "../../../helper/api-urls";
import DatePickerKendoRct from "../../../control-components/date-picker/date-picker";
import ErrorHelper from "../../../helper/error-helper";
import { NotificationManager } from "react-notifications";
import ApiHelper from "../../../helper/api-helper";
import InputKendoRct from "../../../control-components/input/input";
import { useDispatch, useSelector } from "react-redux";
import DropDownKendoRct from "../../../control-components/drop-down/drop-down";
import PhoneInputMask from "../../../control-components/phone-input-mask/phone-input-mask";
import SocialSecurityInput from "../../../control-components/social-security/social-security";
import ZipCodeInput from "../../../control-components/zip-code/zip-code";
import AppRoutes from "../../../helper/app-routes";
import DrawerContainer from "../../../control-components/custom-drawer/custom-drawer";
import ProfileHeader from "./staff-profile-header";
import Loader from "../../../control-components/loader/loader";
import { GET_MARITIALS_STATUS } from "../../../actions/";
import NOTIFICATION_MESSAGE from "../../../../src/helper/notification-messages";
import moment from "moment";
import { StaffService } from "../../../services/staffService";
import ValidationHelper from "../../../helper/validation-helper";
import { renderErrors } from "src/helper/error-message-helper";

import { userPermission } from "../../../helper/permission-helper";

const EditStaff = () => {
  const vHelper = ValidationHelper();
  const dispatch = useDispatch();
  var Pronouns = ["He/Him", "She/Her", "They/Them"];
  const navigate = new useNavigate();
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [roleLoading, setRoleLoading] = useState(false);
  const [roleData, setRoleData] = useState([]);
  const [genderLoading, setGenderLoading] = useState(false);
  const [genderData, setGenderData] = useState([]);
  const clinicId = useSelector((state) => state?.loggedIn.clinicId);
  const getStaff = useSelector((state) => state?.getStaffDetails);
  const [stateData, setStateData] = useState([]);
  const selectedStaffId = useSelector((state) => state?.selectedStaffId);
  const [stateLoading, setStateLoading] = useState(false);
  const [fields, setFields] = useState({});
  const [timezoneLoading, setTimezoneLoading] = useState(false);
  const [timezone, setTimezone] = useState([]);
  const [staffError, setStaffError] = useState(false);
  const [maritial, setmaritial] = useState([]);
  const [maritialLoading, setMaritialLoading] = useState(false);

  const staffLoginInfo = useSelector((state) => state?.getStaffReducer);

  // const [allowCustom, setAllowCustom] = React.useState("");
  const stateDetail = {
    id: getStaff?.state,
    stateName: getStaff?.stateName,
  };

  const genderNameDetails = {
    id: getStaff?.genderId,
    name: getStaff?.genderName,
  };

  const genderAtbirthDetails = {
    id: getStaff?.genderAtBirthId,
    name: getStaff?.genderAtBirth,
  };

  const timeZoneDetails = {
    id: getStaff?.timeZoneId,
    timeZoneName: getStaff?.timeZoneName,
  };

  const maritialstatus = {
    id: parseInt(getStaff?.maritalStatusId),
    name: getStaff?.maritalStatus,
  };

  const Role = {
    id: getStaff?.roleId,
    roleName: getStaff?.roleName,
  };

  // const AccessLevel={
  //   id:getStaff
  //   name:
  // }

  useEffect(() => {
    getState();
    getRole();
    timeZone();
    getGender();
    MaritialsStatus();

    if (selectedStaffId !== null) {
      setFields({
        firstName: getStaff?.firstName,
        lastName: getStaff?.lastName,
        middleName: getStaff?.middleName,
        dob: new Date(getStaff?.dob),
        email: getStaff?.email,
        userName: getStaff?.userName,
        address: getStaff?.address,
        city: getStaff?.city,
        state: stateDetail,
        zip: getStaff?.zip,
        phone: getStaff?.phone === null ? "" : getStaff?.phone,
        socialSecurityNumber: getStaff?.socialSecurityNumber?.trim(),
        driverLicenseNumber: getStaff?.driverLicenseNumber,
        driverLicenseState: getStaff?.driverLicenseState,
        maritalStatus: maritialstatus,
        emergencyContactName: getStaff?.emergencyContactName,
        emergenyContactPhone: getStaff?.emergenyContactPhone,
        gender: genderNameDetails,
        position: getStaff?.position,
        licensureId: getStaff?.licensureId,
        genderAtBirthId: genderAtbirthDetails,
        suffix: getStaff?.suffix,
        pronouns: getStaff?.pronouns,
        credentials: getStaff?.credentials,
        terminationDate:
          getStaff?.terminationDate === null
            ? null
            : new Date(getStaff?.terminationDate),
        hireDate:
          getStaff?.hireDate === null ? null : new Date(getStaff?.hireDate),
        timeZoneId: timeZoneDetails,
        utcDateAdded: getStaff?.utcDateAdded,
        roleId: Role,
      });
    }
  }, []);

  const handleChange = (e) => {
    const name = e.target.name;
    if (
      e.target.name === "firstName" ||
      e.target.name === "lastName" ||
      e.target.name === "middleName"
    ) {
      const value = e.target.value;
      setFields({
        ...fields,
        [name]: value,
      });
    } else {
      const value = e.target.value;
      setFields({
        ...fields,
        [name]: value,
      });
    }
  };

  const getGender = async () => {
    setGenderLoading(true);
    StaffService.getGender()
      .then((result) => {
        let genderList = result.resultData;
        setGenderLoading(false);
        setGenderData(genderList);
      })
      .catch((error) => {
        setGenderLoading(false);
        renderErrors(error.message);
      });
  };

  const timeZone = () => {
    setTimezoneLoading(true);
    ApiHelper.getRequest(ApiUrls.GET_TIMEZONE).then((result) => {
      let timeZoneList = result.resultData;
      setTimezoneLoading(false);
      setTimezone(timeZoneList);
    });
  };

  const getRole = () => {
    setRoleLoading(true);
    ApiHelper.getRequest(ApiUrls.GET_ROLE)
      .then((result) => {
        let roleList = result.resultData;
        setRoleLoading(false);
        setRoleData(roleList);
      })
      .catch((error) => {
        setGenderLoading(false);
        renderErrors(error.message);
      });
  };
  const getState = () => {
    setStateLoading(true);
    ApiHelper.getRequest(ApiUrls.GET_STATE)
      .then((result) => {
        let stateList = result.resultData;
        setStateLoading(false);
        setStateData(stateList);
      })
      .catch((error) => {
        setStateLoading(false);
        renderErrors(error.message);
      });
  };

  const MaritialsStatus = () => {
    setMaritialLoading(true);
    ApiHelper.getRequest(ApiUrls.GET_MARITAL_STATUS)
      .then((result) => {
        const maritalData = result.resultData;
        setmaritial(maritalData);
        dispatch({
          type: GET_MARITIALS_STATUS,
          payload: maritalData,
        });
      })
      .catch((error) => {
        setMaritialLoading(false);
        renderErrors(error.message);
      });
  };

  const handleSubmit = (event) => {
    setStaffError(true);
    if (handleValidation()) {
      window.scrollTo(0, 0);
      updateStaff();
    }
  };
  const handleValueChange = (e) => {
    const name = e.target.name;
    const rawValue = e.target.rawValue;
    setFields({
      ...fields,
      [name]: rawValue,
    });
  };
  const handleCancel = () => {
    navigate(AppRoutes.STAFF_PROFILE);
  };

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;
    var emailPattern = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );
    var pattern = new RegExp(/[^A-Za-z]/gi, "");

    if (!fields.firstName || fields.firstName.trim().length === 0) {
      formIsValid = false;
      errors["firstName"] = ErrorHelper.FIRST_NAME;
    }

    if (
      fields?.roleId &&
      fields.roleId?.id == 1 &&
      staffLoginInfo?.roleId !== 1
    ) {
      formIsValid = false;
      renderErrors("Couldn't assign as a Super Admin");
    }

    if (!fields.lastName || fields.lastName.trim().length === 0) {
      formIsValid = false;
      errors["lastName"] = ErrorHelper.LAST_NAME;
    }
    if (!fields.dob) {
      formIsValid = false;
      errors["dob"] = ErrorHelper.DOB;
    }
    if (!fields.email || fields.email.trim().length === 0) {
      formIsValid = false;
      errors["email"] = ErrorHelper.EMAIL;
    } else if (!emailPattern.test(fields.email)) {
      formIsValid = false;
      errors["email"] = ErrorHelper.INVALID_EMAIL;
    }
    if (fields.phone.trim() === "") {
      formIsValid = false;
      errors["phone"] = ErrorHelper.MOBILE_PHONE;
    }

    if (!fields.gender) {
      formIsValid = false;
      errors["gender"] = ErrorHelper.GENDER;
    }
    if (!fields.timeZoneId) {
      formIsValid = false;
      errors["timeZoneId"] = ErrorHelper.TIMEZONE;
    }

    if (fields.dob && fields.hireDate) {
      let error = vHelper.startDateLessThanEndDateValidator(
        fields.dob,
        fields.hireDate,
        "dob",
        "hireDate"
      );
      if (error && error.length > 0) {
        errors["dob"] = error;
        formIsValid = false;
      }
    }

    if (fields.hireDate && fields.terminationDate) {
      let error = vHelper.startDateLessThanEndDateValidator(
        fields.hireDate,
        fields.terminationDate,
        "hireDate",
        "terminationDate"
      );
      if (error && error.length > 0) {
        errors["hireDate"] = error;
        formIsValid = false;
      }
    }

    setErrors(errors);
    return formIsValid;
  };

  const updateStaff = () => {
    setLoading(true);
    var data = {
      id: selectedStaffId,
      firstName: fields.firstName,
      lastName: fields.lastName,
      middleName: fields.middleName,
      dob: moment(fields.dob).format("YYYY-MM-DD"),
      email: fields.email,
      clinicId: clinicId,
      address: fields.address,
      city: fields.city,
      state: fields.state.id === 0 || null ? null : fields.state.id,
      zip: fields.zip,
      phone: fields.phone,
      // mobile: fields.mobile,
      socialSecurityNumber: fields.socialSecurityNumber?.trim(),
      driverLicenseNumber: fields.driverLicenseNumber,
      driverLicenseState: fields.driverLicenseState,
      maritalStatusId:
        fields.maritalStatus.id === 0 ? null : fields.maritalStatus.id,
      emergencyContactName: fields.emergencyContactName,
      emergenyContactPhone: fields.emergenyContactPhone,
      genderId: fields.gender.id === 0 ? null : fields.gender.id,
      genderAtBirthId:
        fields.genderAtBirthId.id === 0 ? null : fields.genderAtBirthId.id,
      suffix: fields.suffix === "" ? null : fields.suffix,
      pronouns: fields.pronouns,
      credentials: fields.credentials,
      terminationDate:
        fields.terminationDate === null
          ? null
          : moment(fields.terminationDate).format("YYYY-MM-DD"),
      hireDate:
        fields.hireDate === null
          ? null
          : moment(fields.hireDate).format("YYYY-MM-DD"),
      timeZoneId: fields.timeZoneId.id === 0 ? null : fields.timeZoneId.id,
      roleId: fields.roleId.id === 0 ? null : fields.roleId.id,
    };

    ApiHelper.putRequest(ApiUrls.UPDATE_STAFF, data)
      .then((result) => {
        setLoading(false);
        navigate(AppRoutes.STAFF_PROFILE);
        NotificationManager.success(NOTIFICATION_MESSAGE.UPDATE_STAFF);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  return (
    <div className="d-flex flex-wrap">
      {loading === true && <Loader />}

      <div className="inner-dt col-md-3 col-lg-2">
        <DrawerContainer />
      </div>
      <div className="col-md-9 col-lg-10">
        <div className="staff-profile-page">
          <ProfileHeader />
          <div className="client-accept">
            <div className="address-line-content mt-3">
              <h4 className="address-title mb-4">Personal information</h4>
              <div className="row">
                <div className="mb-3 col-lg-4 col-md-6 col-12">
                  <InputKendoRct
                    validityStyles={staffError}
                    value={fields?.firstName === null ? "" : fields?.firstName}
                    onChange={handleChange}
                    name="firstName"
                    label="First Name"
                    error={fields.firstName === "" && errors.firstName}
                    required={true}
                    placeholder="First Name"
                  />
                </div>
                <div className="mb-3 col-lg-4 col-md-6 col-12">
                  <InputKendoRct
                    validityStyles={staffError}
                    value={
                      fields?.middleName === null ? "" : fields?.middleName
                    }
                    onChange={handleChange}
                    name="middleName"
                    label="Middle Name"
                    placeholder="Middle Name"
                  />
                </div>
                <div className="mb-3 col-lg-4 col-md-6 col-12">
                  <InputKendoRct
                    validityStyles={staffError}
                    value={fields?.lastName === null ? "" : fields?.lastName}
                    onChange={handleChange}
                    name="lastName"
                    label="Last Name"
                    error={fields.lastName === "" && errors.lastName}
                    required={true}
                    placeholder="Last Name"
                  />
                </div>
                <div className="mb-3 col-lg-4 col-md-6 col-12">
                  <DatePickerKendoRct
                    validityStyles={staffError}
                    name={"dob"}
                    label="Date of Birth"
                    onChange={handleChange}
                    value={fields.dob === null ? "" : fields.dob}
                    placeholder="Date of Birth"
                    error={errors.dob}
                    required={true}
                    max={new Date()}
                  />
                </div>

                <div className="mb-3 col-lg-4 col-md-6 col-12">
                  <InputKendoRct
                    validityStyles={staffError}
                    value={fields?.email === null ? "" : fields?.email}
                    onChange={handleChange}
                    name="email"
                    label="Email"
                    error={fields.email === "" && errors.email}
                    required={true}
                    placeholder="Email"
                  />
                </div>
                <div className="mb-3 col-lg-4 col-md-6 col-12">
                  <PhoneInputMask
                    validityStyles={staffError}
                    onChange={handleValueChange}
                    name="phone"
                    label="Mobile Phone"
                    value={fields?.phone == null ? "" : fields.phone}
                    error={fields.phone && errors.phone}
                    required={true}
                    placeholder="Mobile Phone"
                  />
                </div>
                <div className="mb-3 col-lg-4 col-md-6 col-12">
                  <SocialSecurityInput
                    validityStyles={false}
                    value={
                      fields?.socialSecurityNumber === null
                        ? ""
                        : fields?.socialSecurityNumber
                    }
                    onChange={handleValueChange}
                    name="socialSecurityNumber"
                    label="SSN"
                    placeholder="Social Security Number"
                  />
                </div>
                <div className="mb-3 col-lg-4 col-md-6 col-12">
                  <DropDownKendoRct
                    label="Gender at Birth"
                    onChange={handleChange}
                    data={genderData}
                    value={
                      fields?.genderAtBirthId === null
                        ? ""
                        : fields?.genderAtBirthId
                    }
                    dataItemKey="id"
                    textField="name"
                    suggest={true}
                    loading={genderLoading}
                    name="genderAtBirthId"
                  />
                </div>
                <div className="mb-3 col-lg-4 col-md-6 col-12">
                  <DropDownKendoRct
                    validityStyles={staffError}
                    label="Gender"
                    onChange={handleChange}
                    data={genderData}
                    value={fields?.gender === null ? "" : fields?.gender}
                    dataItemKey="id"
                    textField="name"
                    suggest={true}
                    // onOpened={getGender}
                    loading={genderLoading}
                    name="gender"
                    error={!fields.gender && errors.gender}
                    required={true}
                  />
                </div>
                <div className="mb-3 col-lg-4 col-md-6 col-12">
                  <DropDownKendoRct
                    validityStyles={staffError}
                    name="maritalStatus"
                    label="Marital Status"
                    onChange={handleChange}
                    data={maritial}
                    value={
                      fields?.maritalStatus === null
                        ? ""
                        : fields?.maritalStatus
                    }
                    dataItemKey="id"
                    textField="name"
                    loading={maritialLoading}
                  />
                </div>
              </div>
              <h4 className="address-title mb-4">Address information</h4>
              <div className="row">
                <div className="mb-3 col-lg-4 col-md-6 col-12">
                  <InputKendoRct
                    validityStyles={false}
                    value={fields?.address === null ? "" : fields?.address}
                    onChange={handleChange}
                    name="address"
                    label="Address"
                    placeholder="Address"
                  />
                </div>
                <div className="mb-3 col-lg-4 col-md-6 col-12">
                  <InputKendoRct
                    validityStyles={false}
                    value={fields.city === null ? "" : fields.city}
                    onChange={handleChange}
                    name="city"
                    label="City"
                    textField="City"
                    placeholder="City"
                  />
                </div>
                <div className="mb-3 col-lg-4 col-md-6 col-12">
                  <DropDownKendoRct
                    validityStyles={staffError}
                    label="State"
                    onChange={handleChange}
                    data={stateData}
                    dataItemKey="id"
                    value={fields.state === null ? "" : fields.state}
                    textField="stateName"
                    suggest={true}
                    name="state"
                    placeholder="State"
                  />
                </div>
                <div className="mb-3 col-lg-4 col-md-6 col-12">
                  <ZipCodeInput
                    onChange={handleValueChange}
                    name="zip"
                    label="Zip Code"
                    value={fields?.zip === null ? "" : fields?.zip}
                    placeholder="Zip Code"
                  />
                </div>
              </div>
              <h4 className="address-title mb-4">Official information</h4>
              <div className="row">
                <div className="mb-3 col-lg-4 col-md-6 col-12">
                  <InputKendoRct
                    validityStyles={false}
                    value={fields?.suffix === null ? "" : fields?.suffix}
                    onChange={handleChange}
                    name="suffix"
                    label="Suffix"
                    placeholder="Suffix"
                  />
                </div>
                <div className="mb-3 col-lg-4 col-md-6 col-12">
                  <InputKendoRct
                    validityStyles={false}
                    value={
                      fields?.credentials === null ? "" : fields?.credentials
                    }
                    onChange={handleChange}
                    name="credentials"
                    label="Credentials"
                    placeholder="Credentails"
                  />
                </div>
                <div className="mb-3 col-lg-4 col-md-6 col-12">
                  <DropDownKendoRct
                    // validityStyles={false}
                    value={fields?.pronouns === null ? "" : fields?.pronouns}
                    onChange={handleChange}
                    name="pronouns"
                    label="Pronouns"
                    data={Pronouns}
                    placeholder="Pronouns"
                  />
                </div>
                <div className="mb-3 col-lg-4 col-md-6 col-12">
                  <InputKendoRct
                    validityStyles={false}
                    value={
                      fields?.driverLicenseNumber === null
                        ? ""
                        : fields?.driverLicenseNumber
                    }
                    onChange={handleChange}
                    name="driverLicenseNumber"
                    label="Driver License #"
                    placeholder="Driver Licence"
                  />
                </div>
                <div className="mb-3 col-lg-4 col-md-6 col-12">
                  <InputKendoRct
                    validityStyles={false}
                    value={
                      fields?.driverLicenseState === null
                        ? ""
                        : fields?.driverLicenseState
                    }
                    onChange={handleChange}
                    name="driverLicenseState"
                    label="Driver License State "
                    placeholder="Driver Licence State"
                  />
                </div>
                <div className="mb-3 col-lg-4 col-md-6 col-12">
                  <InputKendoRct
                    validityStyles={false}
                    value={
                      fields?.emergencyContactName === null
                        ? ""
                        : fields?.emergencyContactName
                    }
                    onChange={handleChange}
                    name="emergencyContactName"
                    label="Emergency Contact Name"
                    placeholder="Emergency Contact Name"
                  />
                </div>
                <div className="mb-3 col-lg-4 col-md-6 col-12">
                  <PhoneInputMask
                    validityStyles={false}
                    value={
                      fields?.emergenyContactPhone === null
                        ? ""
                        : fields?.emergenyContactPhone
                    }
                    onChange={handleValueChange}
                    name="emergenyContactPhone"
                    label="Emergency Contact Phone"
                    placeholder="Emergency Contact Phone"
                  />
                </div>
                <div className="mb-3 col-lg-4 col-md-6 col-12">
                  <DatePickerKendoRct
                    value={fields.hireDate === null ? "" : fields.hireDate}
                    onChange={handleChange}
                    placeholder="Hire Date"
                    name={"hireDate"}
                    title={"hireDate"}
                    label="Hire Date"
                    error={errors.hireDate}
                  />
                </div>
                <div className="mb-3 col-lg-4 col-md-6 col-12">
                  <DatePickerKendoRct
                    value={
                      fields?.terminationDate === null
                        ? ""
                        : fields?.terminationDate
                    }
                    onChange={handleChange}
                    placeholder="Termination Date"
                    name={"terminationDate"}
                    label="Termination Date"
                  />
                </div>
                <div className="mb-3 col-lg-4 col-md-6 col-12">
                  <DropDownKendoRct
                    validityStyles={staffError}
                    label="TimeZone"
                    onChange={handleChange}
                    data={timezone}
                    value={fields.timeZoneId}
                    dataItemKey="id"
                    textField="timeZoneName"
                    suggest={true}
                    name="timeZoneId"
                    loading={timezoneLoading}
                    error={!fields.timeZoneId && errors.timeZoneId}
                    required={true}
                  />
                </div>
                <div className="mb-3 col-lg-4 col-md-6 col-12">
                  <DropDownKendoRct
                    validityStyles={staffError}
                    label="Access Level"
                    onChange={handleChange}
                    data={roleData}
                    value={fields.roleId}
                    textField="roleName"
                    suggest={true}
                    // onOpened={getRole}
                    loading={roleLoading}
                    disabled={!userPermission(staffLoginInfo?.roleId)}
                    name="roleId"
                    dataItemKey="id"
                    error={fields.roleId === "" && errors.roleId}
                    required={true}
                  />
                </div>
              </div>
              <div className="d-flex mt-3">
                <button
                  className="btn blue-primary text-white"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
                <button
                  className="btn grey-secondary text-white mx-3"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EditStaff;
