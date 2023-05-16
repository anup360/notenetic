import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import DatePickerKendoRct from "../../../../control-components/date-picker/date-picker";
import DropDownKendoRct from "../../../../control-components/drop-down/drop-down";
import InputKendoRct from "../../../../control-components/input/input";
import PhoneInputMask from "../../../../control-components/phone-input-mask/phone-input-mask";
import SocialSecurityInput from "../../../../control-components/social-security/social-security";
import ZipCodeInput from "../../../../control-components/zip-code/zip-code";
import { ClientService } from "../../../../services/clientService";
import { MaskedTextBox } from "@progress/kendo-react-inputs";
import { renderErrors } from "src/helper/error-message-helper";

const AddDemographics = ({
  fields,
  setFields,
  errors,
  settingError,
  handleChange,
  handleValueChange,
}) => {
  const [loading, setLoading] = useState(false);
  const [genderData, setGenderData] = useState([]);
  const [genderLoading, setGenderLoading] = useState(false);
  const [stateData, setStateData] = useState([]);
  const [stateLoading, setStateLoading] = useState(false);
  const [raceData, setRaceData] = useState([]);
  const [raceLoading, setRaceLoading] = useState(false);

  useEffect(() => {
    getGender();
    getRace();
    getState();
  }, []);

  const getGender = async () => {
    setLoading(true);
    await ClientService.getGender()
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

  const getRace = async () => {
    setLoading(true);
    await ClientService.getRace()
      .then((result) => {
        let raceList = result.resultData;
        setRaceLoading(false);
        setRaceData(raceList);
      })
      .catch((error) => {
        setRaceLoading(false);
        renderErrors(error.message);
      });
  };

  const getState = async () => {
    setLoading(true);
    await ClientService.getStates()
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

  return (
    <div>
      <div className="row">
        <div className="mb-3 col-lg-4 col-md-6 col-12">
          <InputKendoRct
            validityStyles={settingError}
            value={fields.firstName}
            onChange={handleChange}
            name="firstName"
            label="First Name"
            error={fields.firstName == "" && errors.firstName}
            required={true}
            placeholder="First Name"
            suggest={true}
          />
        </div>
        <div className="mb-3 col-lg-4 col-md-6 col-12">
          <InputKendoRct
            validityStyles={settingError}
            value={fields.middleName}
            onChange={handleChange}
            name="middleName"
            label="Middle Name"
            placeholder="Middle Name"
          />
        </div>

        <div className="mb-3 col-lg-4 col-md-6 col-12">
          <InputKendoRct
            validityStyles={settingError}
            value={fields.lastName}
            onChange={handleChange}
            name="lastName"
            label="Last Name"
            error={fields.lastName == "" && errors.lastName}
            placeholder="Last Name"
            required={true}
          />
        </div>
        <div className="mb-3 col-lg-4 col-md-6 col-12">
          <InputKendoRct
            validityStyles={settingError}
            value={fields.nickName}
            onChange={handleChange}
            name="nickName"
            label="Nick Name"
            placeholder="Nick Name"
          />
        </div>

        <div className="mb-3 col-lg-4 col-md-6 col-12">
          <DropDownKendoRct
            validityStyles={settingError}
            label="Gender"
            onChange={handleChange}
            data={genderData}
            value={fields.gender}
            textField="name"
            required={true}
            suggest={true}
            name="gender"
            placeholder="Gender"
            error={!fields.gender && errors.gender}
          />
        </div>

        <div className="mb-3 col-lg-4 col-md-6 col-12">
          <DatePickerKendoRct
            validityStyles={settingError}
            onChange={handleChange}
            value={fields.dob}
            label={"Date of Birth"}
            name={"dob"}
            title={"Date of Birth"}
            error={!fields.dob && errors.dob}
            required={true}
            placeholder="Date of Birth"
            max={new Date()}
          />
        </div>
        <div className="mb-3 col-lg-4 col-md-6 col-12">
          <SocialSecurityInput
            onChange={handleValueChange}
            name="socialSecurityNumber"
            label="SSN"
            value={fields.socialSecurityNumber}
            placeholder="Social Security Number"
          />
        </div>
        <div className="mb-3 col-lg-4 col-md-6 col-12">
          <DropDownKendoRct
            label="Race"
            onChange={handleChange}
            data={raceData}
            validityStyles={settingError}
            required={true}
            value={fields.raceId}
            textField="name"
            suggest={true}
            name="raceId"
            placeholder="Race"
            error={!fields.raceId && errors.raceId}
          />
        </div>
      </div>
      <div className="address-line-content mt-3">
        <h4 className="address-title mb-4">Address</h4>
        <div className="row">
          <div className="mb-3 col-lg-4 col-md-6 col-12">
            <InputKendoRct
              value={fields.addressOne}
              onChange={handleChange}
              validityStyles={settingError}
              required={true}
              name="addressOne"
              label="Address Line 1"
              error={fields.addressOne == "" && errors.addressOne}
              placeholder="Address Line 1"
            />
          </div>
          <div className="mb-3 col-lg-4 col-md-6 col-12">
            <InputKendoRct
              validityStyles={settingError}
              value={fields.addressTwo}
              onChange={handleChange}
              name="addressTwo"
              label="Address Line 2"
              placeholder="Address Line 2"
            />
          </div>

          <div className="mb-3 col-lg-4 col-md-6 col-12">
            <InputKendoRct
              validityStyles={settingError}
              required={true}
              value={fields.city}
              onChange={handleChange}
              name="city"
              label="City"
              error={fields.city == "" && errors.city}
              placeholder="City"
            />
          </div>
          <div className="mb-3 col-lg-4 col-md-6 col-12">
            <DropDownKendoRct
              label="State"
              validityStyles={settingError}
              required={true}
              onChange={handleChange}
              data={stateData}
              value={fields.state}
              textField="stateName"
              suggest={true}
              name="state"
              error={!fields.state && errors.state}
              placeholder="State"
            />
          </div>
          <div className="mb-3 col-lg-4 col-md-6 col-12">
            <ZipCodeInput
              validityStyles={settingError}
              value={fields.zip}
              onChange={handleValueChange}
              name="zip"
              label="Zip Code"
              error={fields.zip.trim().length == "" && errors.zip}
              required={true}
              placeholder="Zip Code"
            />
          </div>
          <div className="mb-3 col-lg-4 col-md-6 col-12">
            {/* <MaskedTextBox
              width={200}
              mask="(999) 999-9999"
              defaultValue="(359) 884-12-33-21"
              label="Mobile Number"
              error={
                fields.mobilePhone.trim().length == "" && errors.mobilePhone
              }
            /> */}
            <PhoneInputMask
              value={fields.mobilePhone}
              onChange={handleValueChange}
              name="mobilePhone"
              label="Mobile Number"
              error={ fields.mobilePhone.trim().length !== 10 && errors.mobilePhone}
              required={true}
              validityStyles={settingError}
              placeholder="Mobile Number"
            />
          </div>

          <div className="mb-3 col-lg-4 col-md-6 col-12">
            <InputKendoRct
              validityStyles={settingError}
              required={true}
              value={fields.email}
              onChange={handleChange}
              name="email"
              label="Email"
              error={errors.email}
              placeholder="Email"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddDemographics;
