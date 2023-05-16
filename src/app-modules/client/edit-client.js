import React, { useEffect, useState } from "react";
import DatePickerKendoRct from "../../control-components/date-picker/date-picker";
import ErrorHelper from "../../helper/error-helper";
import { NotificationManager } from "react-notifications";
import InputKendoRct from "../../control-components/input/input";
import Loader from "../../control-components/loader/loader";
import { useSelector } from "react-redux";
import { Dialog } from "@progress/kendo-react-dialogs";
import DropDownKendoRct from "../../control-components/drop-down/drop-down";
import PhoneInputMask from "../../control-components/phone-input-mask/phone-input-mask";
import SocialSecurityInput from "../../control-components/social-security/social-security";
import ZipCodeInput from "../../control-components/zip-code/zip-code";
import { ClientService } from "../../services/clientService";
import NOTIFICATION_MESSAGE from "../../helper/notification-messages";
import ApiUrls from "../../helper/api-urls";
import ApiHelper from "../../helper/api-helper";
import { Checkbox } from "@progress/kendo-react-inputs";
import { Encrption } from "../encrption";
import useDateCheck from "../../cutomHooks/date-check/date-check";
import { renderErrors } from "src/helper/error-message-helper";

const EditClient = ({ onClose, selectedClientId, clientInfo }) => {
  const [communicationList, setCommunicationList] = useState({});

  const genderDetail = {
    id: clientInfo.genderId,
    name: clientInfo.gender,
  };

  const stateDetail = {
    id: parseInt(clientInfo.homeState),
    stateName: clientInfo.homeStateName,
  };
  const raceDetail = {
    id: clientInfo.raceId,
    name: clientInfo.race,
  };
  const ethnicityDetail = {
    id: clientInfo.ethnicityId,
    name: clientInfo.ethnicityName,
  };

  const smokingDetail = {
    id: clientInfo.smokingStatusId,
    name: clientInfo.smokingStatus,
  };

  const clientStatusDetails={
    id:clientInfo.clientStatusId,
    statusName:clientInfo.clientStatusName
  }

  const heightId = clientInfo.height;
  const newFeetValue = heightId / 12;
  const newInchValue = heightId % 12;

  let [fields, setFields] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    addressOne: "",
    addressTwo: "",
    email: "",
    dob: "",
    city: "",
    state: "",
    raceId: "",
    gender: "",
    nickName: "",
    goToProfile: true,
    site: "",
    startDate: "",
    endDate: "",
    policyNumber: "",
    insuranceType: "",
    middleName: "",
    weight: "",
    height: "",
    hairColor: "",
    eyeColor: "",
    recordId: "",
    feetHeight: "",
    inchHeight: "",
    ethnicity: "",
    smokingStatus: "",
    dateStart:"",
    clientStatusId:""
  });


  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [genderData, setGenderData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [raceData, setRaceData] = useState([]);
  const [ethnicityData, setEthnicityData] = useState([]);
  const [smokingData, setSmokingData] = useState([]);
  const [zipCode, setZipCode] = useState("");
  const [clientStatus,setClientStatus]=useState([]);
  const [mobilePhone, setMobilePhone] = useState("");
  const [socialSecurityNumber, setSocialSecurityNumber] = useState("");
  const clinicId = useSelector((state) => state.loggedIn.clinicId);
  const [settingError, setSettingError] = useState(false);
  const [dateChecker, setDateCheck] = useDateCheck();


  const [checkBox, setCheckBox] = useState({
    canCallHomePhone: "",
    canCallMobilePhone: "",
    canSendTextSMS: "",
    canSendEmail: "",
    canSendFax: "",
  });

  const maskedRef = React.useRef(null);


  useEffect(() => {
    getGender();
    getState();
    getRace();
    getEthnicity();
    getSmokingStatus();
    getCommunicationPref();
    getClientStatus()
    setFields({
      firstName: clientInfo.fName,
      lastName: clientInfo.lName,
      addressOne: clientInfo.homeAddress,
      addressTwo: clientInfo.homeAddress2,
      email: clientInfo.email,
      dob: clientInfo.dob==null ? "" : new Date(clientInfo.dob),
      city: clientInfo.homeCity,
      state: clientInfo.homeState,
      gender: genderDetail,
      nickName: clientInfo.nickName,
      recordId: clientInfo.recordId,
      middleName: clientInfo.mName,
      weight: clientInfo.weight,
      height: clientInfo.height,
      hairColor: clientInfo.hairColor,
      eyeColor: clientInfo.eyeColor,
      raceId: raceDetail,
      state: stateDetail,
      feetHeight: Math.round(newFeetValue).toString(),
      inchHeight: newInchValue.toString(),
      ethnicity: ethnicityDetail,
      smokingStatus: smokingDetail,
      dateStart: clientInfo.dateStart == null ?  "" : new Date(clientInfo.dateStart ),
      clientStatusId:clientStatusDetails

    });

    setCheckBox({});
    setZipCode(clientInfo.homeZip);
    setMobilePhone(clientInfo.homePhone);
    setSocialSecurityNumber(clientInfo.ssn);
  }, []);

  const getRace = async () => {
    await ClientService.getRace()
      .then((result) => {
        let raceList = result.resultData;
        setRaceData(raceList);
      })
      .catch((error) => {
        renderErrors(error.message)
      });
  };

  const getSmokingStatus = async () => {
    await ClientService.getSmokingStatus()
      .then((result) => {
        let smokingList = result.resultData;
        setSmokingData(smokingList);
      })
      .catch((error) => {
        renderErrors(error.message)
      });
  };


  const getState = async () => {
    await ClientService.getStates()
      .then((result) => {
        let stateList = result.resultData;
        setStateData(stateList);
      })
      .catch((error) => {
        renderErrors(error.message)
      });
  };

  const getGender = async () => {
    await ClientService.getGender()
      .then((result) => {
        let genderList = result.resultData;
        setGenderData(genderList);
      })
      .catch((error) => {
        renderErrors(error.message)
      });
  };

  const getEthnicity = async () => {
    await ClientService.getEthnicity()
      .then((result) => {
        let ethnicityList = result.resultData;
        setEthnicityData(ethnicityList);
      })
      .catch((error) => {
        renderErrors(error.message)
      });
  };

  const getCommunicationPref = async () => {
    await ApiHelper.getRequest(
      ApiUrls.GET_CLIENT_COMMUNICATION_PREF + Encrption(selectedClientId)
    )
      .then((response) => {
        const data = response.resultData === null ? "" : response.resultData;
        setCommunicationList({
          canCallHomePhone: data.canCallHomePhone,
          canCallMobilePhone: data.canCallMobilePhone,
          canSendTextSMS: data.canSendTextSMS,
          canSendEmail: data.canSendEmail,
          canSendFax: data.canSendFax,
        });
      })
      .catch((error) => {
        renderErrors(error.message)
      });
  };


  const getClientStatus = async () => {
    await ClientService.getClientStatus()
      .then((result) => {
        let client = result.resultData;
        setClientStatus(client);
      })
      .catch((error) => {
        renderErrors(error.message)
      });
  };

  const updateClient = async () => {
    await ClientService.updateClient(
      fields,
      selectedClientId,
      clinicId,
      socialSecurityNumber,
      mobilePhone,
      zipCode
    )
      .then((result) => {
    setLoading(false);
        AddCommunicationPref();
      })
      .catch((error) => {
        setLoading(false);
        renderErrors("Something wrong!")
      });
  };

  const AddCommunicationPref = () => {
    setLoading(true);
    const data = {
      clientId: selectedClientId,
      canCallHomePhone: communicationList.canCallHomePhone,
      canCallMobilePhone: communicationList.canCallMobilePhone,
      canSendTextSMS: communicationList.canSendTextSMS,
      canSendEmail: communicationList.canSendEmail,
      canSendFax: communicationList.canSendFax,
    };
    ApiHelper.postRequest(ApiUrls.POST_CLIENT_COMMUNICATION_PREF, data)
      .then((result) => {
        setLoading(false);
        NotificationManager.success(NOTIFICATION_MESSAGE.CLIENT_UPDATED);
        onClose({ editable: true });
      })
      .catch((error) => {
        setLoading(false);

        renderErrors(error.message)
      });
  };


  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;
    var emailPattern = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );
    if (!fields.addressOne || fields.addressOne.trim().length === 0) {
      formIsValid = false;
      errors["addressOne"] = ErrorHelper.ADDRESS_LINE_ONE;
    }

    if (!fields.firstName || fields.firstName.trim().length === 0) {
      formIsValid = false;
      errors["firstName"] = ErrorHelper.FIRST_NAME;
    }
    if (!fields.lastName || fields.lastName.trim().length === 0) {
      formIsValid = false;
      errors["lastName"] = ErrorHelper.LAST_NAME;
    }

    if (!fields.email || fields.email.trim().length === 0) {
      formIsValid = false;
      errors["email"] = ErrorHelper.EMAIL;
    } else if (!emailPattern.test(fields.email)) {
      formIsValid = false;
      errors["email"] = ErrorHelper.INVALID_EMAIL;
    }
    if (!fields.city || fields.city.trim().length === 0) {
      formIsValid = false;
      errors["city"] = ErrorHelper.CITY;
    }
    if (mobilePhone.trim().length == "") {
      formIsValid = false;
      errors["mobilePhone"] = ErrorHelper.MOBILE_PHONE;
    } else if (mobilePhone.trim().length != 10) {
      formIsValid = false;
      errors["mobilePhone"] = ErrorHelper.PHONE_LIMIT;
    }
    if (!fields.gender) {
      formIsValid = false;
      errors["gender"] = ErrorHelper.GENDER;
    }
    if (!fields.raceId) {
      formIsValid = false;
      errors["raceId"] = ErrorHelper.RACE;
    }
    if (!fields.state) {
      formIsValid = false;
      errors["state"] = ErrorHelper.STATE;
    }

    if (fields?.dob===null || !fields?.dob) {
      formIsValid = false;
      errors["dob"] = ErrorHelper.DOB;
    }
    if (dateChecker == true) {
      formIsValid = false;
      errors["dob"] = ErrorHelper.DATE_CHECK;
    }

    setErrors(errors);
    return formIsValid;
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const rawValue = e.target.rawValue;
    if (name == "mobilePhone") {
      setMobilePhone(rawValue);
    } else if (name == "zipCode") {
      setZipCode(rawValue);
    } else if (name == "socialSecurityNumber") {
      setSocialSecurityNumber(rawValue);
    }
    setFields({
      ...fields,
      [name]: value,
    });
  };

  const handleCheckBox = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setCommunicationList({
      ...communicationList,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    setDateCheck(fields.dob);
    setSettingError(true);
    if (handleValidation()) {
      updateClient();
    }
  };

  const handleClose = () => {
    onClose({ editable: false });
  };

  return (
    <div>
      <Dialog
        onClose={handleClose}
        title={"Edit Client"}
        className="dialog-modal"
      >
        <div className="client-accept edit-client-popup">
          <div className="popup-modal">
            <div className="row">
              <div className="mb-2 col-lg-4 col-md-6 col-12">
                <InputKendoRct
                  value={fields.firstName}
                  onChange={handleChange}
                  name="firstName"
                  label="First Name"
                  error={fields.firstName == "" && errors.firstName}
                  validityStyles={settingError}
                  required={true}
                  placeholder="First Name"
                  type="letter"
                />
              </div>
              <div className="mb-2 col-lg-4 col-md-6 col-12">
                <InputKendoRct
                  validityStyles={false}
                  value={fields.middleName}
                  onChange={handleChange}
                  name="middleName"
                  label="Middle Name"
                  error={errors.middleName && errors.middleName}
                  placeholder="Middle Name"
                  type="text"
                />
              </div>
              <div className="mb-2 col-lg-4 col-md-6 col-12">
                <InputKendoRct
                  value={fields.lastName}
                  onChange={handleChange}
                  name="lastName"
                  label="Last Name"
                  error={fields.lastName == "" && errors.lastName}
                  validityStyles={settingError}
                  required={true}
                  placeholder="Last Name"
                  type="text"
                />
              </div>
              <div className="mb-2 col-lg-4 col-md-6 col-12">
                <InputKendoRct
                  validityStyles={false}
                  value={fields.nickName}
                  onChange={handleChange}
                  name="nickName"
                  label="Nick Name"
                  placeholder="Nick Name"
                />
              </div>
              <div className="mb-2 col-lg-4 col-md-6 col-12">
                <InputKendoRct
                  validityStyles={false}
                  value={fields.recordId}
                  onChange={handleChange}
                  name="recordId"
                  label="Record Id"
                  placeholder="Record Id"
                />
              </div>
              <div className="mb-2 col-lg-4 col-md-6 col-12">
                <DropDownKendoRct
                  data={genderData}
                  onChange={handleChange}
                  textField="name"
                  name="gender"
                  value={fields.gender}
                  dataItemKey="id"
                  required={true}
                  validityStyles={settingError}
                  error={!fields.gender && errors.gender}
                  label="Gender"
                  placeholder="Gender"
                />
              </div>

              <div className="mb-2 col-lg-4 col-md-6 col-12">
                <DatePickerKendoRct
                  onChange={handleChange}
                  value={fields.dob}
                  name={"dob"}
                  title={"Date of Birth"}
                  required={true}
                  validityStyles={settingError}
                  error={errors.dob}
                  label={"Date of Birth"}
                  placeholder={"Date of Birth"}
                  max={new Date()}
                />
              </div>
              <div className="mb-2 col-lg-4 col-md-6 col-12">
                <SocialSecurityInput
                  validityStyles={false}
                  value={socialSecurityNumber}
                  onChange={handleChange}
                  name="socialSecurityNumber"
                  label="SSN"
                  required={false}
                  placeholder="Social Security Number"
                />
              </div>
              <div className="mb-2 col-lg-4 col-md-6 col-12">
                <DropDownKendoRct
                  data={raceData}
                  onChange={handleChange}
                  textField="name"
                  name="raceId"
                  value={fields.raceId}
                  dataItemKey="id"
                  required={true}
                  validityStyles={settingError}
                  error={!fields.raceId && errors.raceId}
                  label="Race"
                  placeholder="Race"
                />
              </div>

              <div className="mb-2 col-lg-4 col-md-6 col-12">
                <InputKendoRct
                  validityStyles={false}
                  value={fields.hairColor}
                  onChange={handleChange}
                  name="hairColor"
                  label="Hair Color"
                  placeholder="Hair Color"
                />
              </div>
              <div className="mb-2 col-lg-4 col-md-6 col-12">
                <InputKendoRct
                  validityStyles={false}
                  value={fields.eyeColor}
                  onChange={handleChange}
                  name="eyeColor"
                  label="Eye Color"
                  placeholder="Eye Color"
                />
              </div>

              <div className="mb-2 col-lg-4 col-md-6 col-12">
                <DropDownKendoRct
                  data={ethnicityData}
                  onChange={handleChange}
                  textField="name"
                  name="ethnicity"
                  value={fields.ethnicity}
                  dataItemKey="id"
                  label="Ethnicity"
                  placeholder="Ethnicity"
                />
              </div>

              <div className="mb-2 col-lg-4 col-md-6 col-12">
                <DropDownKendoRct
                  data={smokingData}
                  onChange={handleChange}
                  textField="name"
                  name="smokingStatus"
                  value={fields.smokingStatus}
                  dataItemKey="id"
                  label="Smoker"
                  placeholder="Smoker"
                />
              </div>
              <div className="mb-2 col-lg-4 col-md-6 col-12">
                <DropDownKendoRct
                  data={clientStatus}
                  onChange={handleChange}
                  textField="statusName"
                  name="clientStatusId"
                  value={fields.clientStatusId}
                  dataItemKey="id"
                  label="Client Status"
                  placeholder="Client Status"
                />
              </div>
              <div className="mb-3 col-lg-4 col-md-6 col-12">
          <DatePickerKendoRct
            validityStyles={settingError}
            onChange={handleChange}
            value={fields.dateStart}
            label={"Start Date"}
            name={"dateStart"}
            title={"Start Date"}
            placeholder="Start Date"
            max={new Date()}
          />
     
        </div>
            </div>
            <div className="address-line-content mt-3">
              <h4 className="address-title mb-4">Address</h4>
              <div className="row">
                <div className="mb-2 col-lg-4 col-md-6 col-12">
                  <InputKendoRct
                    value={fields.addressOne}
                    onChange={handleChange}
                    name="addressOne"
                    label="Address Line 1"
                    error={fields.addressOne == "" && errors.addressOne}
                    validityStyles={settingError}
                    required={true}
                    placeholder="Address Line 1"
                  />
                </div>
                <div className="mb-2 col-lg-4 col-md-6 col-12">
                  <InputKendoRct
                    validityStyles={false}
                    value={fields.addressTwo}
                    onChange={handleChange}
                    name="addressTwo"
                    label="Address Line 2"
                    placeholder="Address Line 2"
                  />
                </div>

                <div className="mb-2 col-lg-4 col-md-6 col-12">
                  <InputKendoRct
                    validityStyles={settingError}
                    value={fields.city}
                    onChange={handleChange}
                    name="city"
                    label="City"
                    error={fields.city == "" && errors.city}
                    required={true}
                    placeholder="City"
                  />
                </div>
                <div className="mb-2 col-lg-4 col-md-6 col-12">
                  <DropDownKendoRct
                    data={stateData}
                    onChange={handleChange}
                    textField="stateName"
                    name="state"
                    value={fields.state}
                    dataItemKey="id"
                    required={true}
                    validityStyles={settingError}
                    error={!fields.state && errors.state}
                    label="State"
                    placeholder="State"
                  />
                </div>
                <div className="mb-2 col-lg-4 col-md-6 col-12">
                  <ZipCodeInput
                    validityStyles={true}
                    value={zipCode}
                    onChange={handleChange}
                    name="zipCode"
                    label="Zip Code"
                    error={zipCode.trim().length == "" && ErrorHelper.ZIP_CODE}
                    required={true}
                    placeholder="Zip Code"
                  />
                </div>
                <div className="mb-2 col-lg-4 col-md-6 col-12">
                  <PhoneInputMask
                    value={mobilePhone}
                    onChange={handleChange}
                    name="mobilePhone"
                    label="Mobile Number"
                    error={
                      mobilePhone.trim().length == "" &&
                      ErrorHelper.MOBILE_PHONE
                    }
                    required={true}
                    validityStyles={true}
                    placeholder="Mobile Number"
                  />
                </div>

                <div className="mb-2 col-lg-4 col-md-6 col-12">
                  <InputKendoRct
                    value={fields.email}
                    onChange={handleChange}
                    name="email"
                    label="Email"
                    error={errors.email}
                    required={true}
                    placeholder="Email"
                  />
                </div>
              </div>
            </div>
            <div className="address-line-content mt-3">
              <h4 className="address-title mb-4">Communication Preferences</h4>
              <div className="row">
                <div className="mb-3 col-lg-4 col-md-6 col-12">
                  <Checkbox
                    onChange={handleCheckBox}
                    label={"Home Phone call"}
                    name="canCallHomePhone"
                    value={communicationList.canCallHomePhone}
                  />
                </div>
                <div className="mb-3 col-lg-4 col-md-6 col-12">
                  <Checkbox
                    onChange={handleCheckBox}
                    label={"Mobile Phone call"}
                    name="canCallMobilePhone"
                    value={communicationList.canCallMobilePhone}
                  />
                </div>
                <div className="mb-3 col-lg-4 col-md-6 col-12">
                  <Checkbox
                    onChange={handleCheckBox}
                    label={"Send Text SMS"}
                    name="canSendTextSMS"
                    value={communicationList.canSendTextSMS}
                  />
                </div>
                <div className="mb-3 col-lg-4 col-md-6 col-12">
                  <Checkbox
                    onChange={handleCheckBox}
                    label={"Send Mail"}
                    name="canSendEmail"
                    value={communicationList.canSendEmail}
                  />
                </div>
                <div className="mb-3 col-lg-4 col-md-6 col-12">
                  <Checkbox
                    onChange={handleCheckBox}
                    label={"Send fax"}
                    name="canSendFax"
                    value={communicationList.canSendFax}
                  />
                </div>
              </div>
            </div>
          </div>

          {loading == true && <Loader />}
        </div>
        <div className="border-bottom-line"></div>
        <div className="d-flex mt-4 px-2">
          <button
            className="btn blue-primary text-white mx-3"
            onClick={handleSubmit}
          >
            Submit
          </button>

          <button
            className="btn grey-secondary text-white "
            onClick={handleClose}
          >
            Cancel
          </button>
        </div>
      </Dialog>
    </div>
  );
};
export default EditClient;
