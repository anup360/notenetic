import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ApiUrls from "../../helper/api-urls";
import InputKendoRct from "../../control-components/input/input";
import DatePickerKendoRct from "../../control-components/date-picker/date-picker";
import DropDownKendoRct from "../../control-components/drop-down/drop-down";
import PhoneInputMask from "../../control-components/phone-input-mask/phone-input-mask";
import ErrorHelper from "../../helper/error-helper";
import { NotificationManager } from "react-notifications";
import ApiHelper from "../../helper/api-helper";
import { useSelector, useDispatch } from "react-redux";
import AppRoutes from "../../helper/app-routes";
import Loader from "../../control-components/loader/loader";
import NOTIFICATION_MESSAGE from "../../../src/helper/notification-messages";
import { StaffService } from "../../../src/services/staffService";
import { GET_GENDER, GET_ROLE } from "../../actions";
import ValidationHelper from "../../helper/validation-helper";
import useDateCheck from "../../cutomHooks/date-check/date-check";
import { renderErrors } from "src/helper/error-message-helper";
import { userPermission } from "../../helper/permission-helper";


const AddStaff = () => {
  const vHelper = ValidationHelper();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [roleLoading, setRoleLoading] = useState(false);
  const [roleData, setRoleData] = useState([]);
  const [genderLoading, setGenderLoading] = useState(false);
  const [genderData, setGenderData] = useState([]);
  const [IsUserNameAvailable, setUserNameAvailable] = useState(true);
  const [staffError, setStaffError] = useState(false);
  const [dateChecker, setDateCheck] = useDateCheck();
  const clinicId = useSelector((state) => state.loggedIn.clinicId);
  const staffInfo = useSelector((state) => state.getStaffDetails);
  const staffLoginInfo = useSelector((state) => state.getStaffReducer);





  const [fields, setFields] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    userName: "",
    gender: "",
    positionEffectiveDate: "",
    roleId: "",
    position: "",
    dob: "",
  });


  useEffect(() => {
    getGender();
    getRole();
  }, []);
  const handleSubmit = (event) => {
    setDateCheck(fields.dob);
    setStaffError(true);
    if (handleValidation()) {
      saveStaff();
    }
  };
  const handleCancel = () => {
    navigate(AppRoutes.GET_STAFF);
  };

  const getUserName = (e) => {
    ApiHelper.getRequest(ApiUrls.GET_USERNAME_AVAILABLE + e)
      .then((result) => {
        setUserNameAvailable(result.resultData.isAvailable);
      })
      .catch((error) => {
        renderErrors(error.message);
      });
  };

  const getGender = () => {
    setGenderLoading(true);
    ApiHelper.getRequest(ApiUrls.GET_GENDER)
      .then((result) => {
        let genderList = result.resultData;
        dispatch({
          type: GET_GENDER,
          payload: genderList,
        });
        setGenderLoading(false);
        setGenderData(genderList);
      })
      .catch((error) => {
        setGenderLoading(false);
        renderErrors(error.message);
      });
  };

  const getRole = () => {
    setRoleLoading(true);
    ApiHelper.getRequest(ApiUrls.GET_ROLE)
      .then((result) => {
        let roleList = result.resultData;
        dispatch({
          type: GET_ROLE,
          payload: roleList,
        });
        setRoleLoading(false);
        setRoleData(roleList);
      })
      .catch((error) => {
        setGenderLoading(false);
        renderErrors(error.message);
      });
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (e.target.name === "userName") {
      setFields({
        ...fields,
        [name]: value,
      });
      if (value.length > 3) {
        getUserName(value);
      }
    } else if (name === "firstName" || name === "lastName") {
      const value = e.target.value.replace(/^[0-9\b]+$/g, "");
      setFields({
        ...fields,
        [name]: value,
      });
    } else {
      setFields({
        ...fields,
        [name]: value,
      });
    }

    // if (name == "roleId" && value.id == staffInfo.roleId ) {
    //   renderErrors("Couldn't assign a role of Super Admin")
    // }

  };

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (fields?.roleId && fields.roleId?.id == 1 && staffLoginInfo?.roleId !== 1) {
      formIsValid = false;
      renderErrors("Couldn't assign as a Super Admin")
    }

    if (!fields.firstName || fields.firstName.trim().length === 0) {
      formIsValid = false;
      errors["firstName"] = ErrorHelper.FIRST_NAME;
    }
    if (!fields.lastName || fields.lastName.trim().length === 0) {
      formIsValid = false;
      errors["lastName"] = ErrorHelper.LAST_NAME;
    }
    if (!fields.positionEffectiveDate) {
      formIsValid = false;
      errors["positionEffectiveDate"] = ErrorHelper.POSITION_EFFECTIVE;
    }
    else if (fields.positionEffectiveDate && fields.dob) {
      let error = vHelper.startDateGreaterThanValidator(
        fields.dob,
        fields.positionEffectiveDate,
        "positionEffectiveDate",
        "dob"
      );
      if (error && error.length > 0) {
        errors["positionEffectiveDate"] = error;
        formIsValid = false;
      }
    }
    if (!fields.dob) {
      formIsValid = false;
      errors["dob"] = ErrorHelper.DOB;
    }

    if (dateChecker == true) {
      formIsValid = false;
      errors["dob"] = ErrorHelper.DATE_CHECK;
    }

    if (!fields.phone || fields.phone.trim().length === 0) {
      formIsValid = false;
      errors["phone"] = ErrorHelper.MOBILE_PHONE;
    }
    if (!fields.email || fields.email.trim().length === 0) {
      formIsValid = false;
      errors["email"] = ErrorHelper.EMAIL;
    } else if (!emailPattern.test(fields.email)) {
      formIsValid = false;
      errors["email"] = ErrorHelper.INVALID_EMAIL;
    }
    if (!fields.userName || fields.userName.trim().length === 0) {
      formIsValid = false;
      errors["userName"] = ErrorHelper.USER;
    } else if (!IsUserNameAvailable) {
      formIsValid = false;
      errors["userName"] = ErrorHelper.USERNAME_AVAILABLE;
    }

    if (!fields.position || fields.position.trim().length === 0) {
      formIsValid = false;
      errors["position"] = ErrorHelper.POSTION;
    }

    if (!fields.gender) {
      formIsValid = false;
      errors["gender"] = ErrorHelper.GENDER;
    }
    if (userPermission(staffLoginInfo?.roleId)) {
      if (!fields.roleId) {
        formIsValid = false;
        errors["roleId"] = ErrorHelper.ROLE_ID;
      }

    }


    setErrors(errors);
    return formIsValid;
  };

  const handleValueChange = (e) => {
    const name = e.target.name;
    const rawValue = e.target.rawValue;
    setFields({
      ...fields,
      [name]: rawValue,
    });
  };

  const saveStaff = () => {
    setLoading(true);
    StaffService.saveStaff(fields, clinicId)
      .then((result) => {
        setLoading(false);
        NotificationManager.success(NOTIFICATION_MESSAGE.ADD_STAFF);
        navigate(AppRoutes.GET_STAFF);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error);
      });
  };



  return (
    <div className="client-accept notenetic-container">
      {loading == true && <Loader />}
      <div className="row">
        <div className="mb-3 col-lg-4 col-md-6 col-12">
          <InputKendoRct
            type="text"
            validityStyles={staffError}
            value={fields.firstName}
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
            value={fields.lastName}
            onChange={handleChange}
            name="lastName"
            label="Last Name"
            error={fields.lastName === "" && errors.lastName}
            required={true}
            placeholder="Last Name"
          />
        </div>
        <div className="mb-3 col-lg-4 col-md-6 col-12">
          <InputKendoRct
            validityStyles={staffError}
            value={fields.email}
            onChange={handleChange}
            name="email"
            label="Email"
            error={errors.email}
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
            value={fields.phone}
            error={fields.phone === "" && errors.phone}
            required={true}
            placeholder="Mobile Phone"
          />
        </div>
        <div className="mb-3 col-lg-4 col-md-6 col-12">
          <InputKendoRct
            validityStyles={staffError}
            value={fields.userName}
            onChange={handleChange}
            name="userName"
            label="User Name"
            error={
              IsUserNameAvailable === false
                ? ErrorHelper.USERNAME_AVAILABLE
                : fields.userName === "" && errors.userName
            }
            required={true}
            placeholder="User Name"
          />
        </div>
        <div className="mb-3 col-lg-4 col-md-6 col-12">
          <DropDownKendoRct
            validityStyles={staffError}
            label="Gender"
            onChange={handleChange}
            data={genderData}
            value={fields.gender}
            textField="name"
            suggest={true}
            // onOpened={getGender}
            loading={genderLoading}
            name="gender"
            error={fields.gender === "" && errors.gender}
            required={true}
          />
        </div>
        <div className="mb-3 col-lg-4 col-md-6 col-12">
          <InputKendoRct
            validityStyles={staffError}
            value={fields.position}
            onChange={handleChange}
            name="position"
            label="Position"
            error={fields.position === "" && errors.position}
            required={true}
            placeholder="Position"
          />
        </div>
        <div className="mb-3 col-lg-4 col-md-6 col-12">
          <DatePickerKendoRct
            validityStyles={staffError}
            onChange={handleChange}
            placeholder="Position effective date"
            name={"positionEffectiveDate"}
            label={"Position Effective Date"}
            value={fields.positionEffectiveDate}
            error={errors.positionEffectiveDate}
            required={true}
          />
        </div>
        <div className="mb-3 col-lg-4 col-md-6 col-12">
          <DatePickerKendoRct
            validityStyles={staffError}
            onChange={handleChange}
            placeholder="Date of Birth"
            name={"dob"}
            label={"Date of Birth"}
            value={fields.dob}
            error={fields.dob === "" && errors.dob}
            required={true}
            max={new Date()}
          />
        </div>
        {
          userPermission(staffLoginInfo?.roleId)&&
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
              name="roleId"
              error={fields.roleId === "" && errors.roleId}
              required={true}
            />
          </div>
        }

        <div className="d-flex mt-4">


          <div className="right-sde">
            <button
              className="btn blue-primary text-white"
              onClick={handleSubmit}
            >
              Add Staff
            </button>
          </div>


          <div className="right-sde-grey">
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
  );
};

export default AddStaff;
