import React, { Component, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import APP_ROUTES from "../../../helper/app-routes";
import { NotificationManager } from "react-notifications";
import InputKendoRct from "../../../control-components/input/input";
import DropDownKendoRct from "../../../control-components/drop-down/drop-down";
import ApiUrls from "../../../helper/api-urls";
import { useLocation } from "react-router-dom";
import { Button } from "@progress/kendo-react-buttons";
import ApiHelper from "../../../helper/api-helper";
import ErrorHelper from "../../../helper/error-helper";
import PhoneInputMask from "../../../control-components/phone-input-mask/phone-input-mask";
import Loader from "../../../control-components/loader/loader";
import ZipCodeInput from "../../../control-components/zip-code/zip-code";
import { NumericTextBox } from "@progress/kendo-react-inputs";
import { renderErrors } from "src/helper/error-message-helper";
import { Error } from "@progress/kendo-react-labels";

//const dummyData = [{
//    name: "California",
//    id: 1
//}, {
//    name: "New York",
//    id: 2
//}, {
//    name: "Alaska",
//    id: 3
//}];

const AddSite = () => {
  const navigate = useNavigate();
  const site = useLocation();
  const [phone, setMobilePhone] = useState("");
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [stateData, setStateData] = useState([]);
  const [stateLoading, setStateLoading] = useState(false);
  const clinicId = useSelector((state) => state.loggedIn.clinicId);
  const [settingError, setSettingError] = useState(false);

  const [fields, setFields] = useState({
    siteName: "",
    address: "",
    locState: "",
    city: "",
    zipCode: "",
    phone: "",
    fax: "",
    email: "",
    licenses: "",
    county: "",
    comments: "",
    state: "",
  });

  useEffect(() => {
    getState();
    if (site.state !== null) {
      let siteObj = site.state.obj;
      getSiteDetail(siteObj);
    }
  }, []);

  const handleSubmit = (event) => {
    setSettingError(true);
    if (handleValidation()) {
      saveSite();
    }
  };
  const providerId = useSelector((state) => state.providerID);

  const saveSite = () => {
    setLoading(true);
    var data = {
      siteName: fields.siteName,
      address: fields.address,
      stateId: fields.locState.id,
      city: fields.city,
      zip: fields.zipCode,
      phone: fields.phone,
      providerId: providerId ? providerId : "",
      fax: fields.fax,
      email: fields.email,
      licenses: fields.licenses ? fields.licenses : 0,
      comments: fields.comments,
      clinicId: clinicId,
    };
    ApiHelper.postRequest(ApiUrls.ADD_PROVIDER_LOCATION, data)
      .then((result) => {
        NotificationManager.success("Site added successfully");
        setLoading(false);
        navigate(APP_ROUTES.GET_CLINIC_SITE);
        setFields({
          ...fields,
          siteName: "",
          address: "",
          locState: "",
          city: "",
          zipCode: "",
          phone: "",
          fax: "",
          email: "",
          licenses: "",
          comments: "",
          clinicId: "",
        });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error);
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

  const getSiteDetail = (siteObj) => {
    setLoading(true);
    ApiHelper.getRequest(ApiUrls.GET_LOCATION_BY_ID + siteObj.id, "")
      .then((result) => {
        let siteDetail = result.resultData;
        setLoading(false);
        setFields({
          ...fields,
          siteName: siteDetail?.siteName,
          address: siteDetail?.address,
          locState: siteDetail?.locState,
          city: siteDetail?.city,
          zipCode: siteDetail?.zip,
          phone: siteDetail?.phone,
          comments: siteDetail?.comments,
          email: siteDetail?.email,
          licenses: siteDetail?.licenses,
          fax: siteDetail?.fax,
        });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const handleCancel = () => {
    navigate(-1);
  };
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFields({
      ...fields,
      [name]: value,
    });
  };

  const handleValueChange = (e) => {
    const name = e.target.name;
    const rawValue = e.target.rawValue;
    setFields({
      ...fields,
      [name]: rawValue,
    });
  };

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;
    var pattern = new RegExp(/^[0-9\b]+$/);
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fields.siteName || fields.siteName.trim().length === 0) {
      formIsValid = false;
      errors["siteName"] = ErrorHelper.siteName;
    }
    if (!fields.address || fields.address.trim().length === 0) {
      formIsValid = false;
      errors["address"] = ErrorHelper.ADDRESS;
    }
    if (!fields.locState) {
      formIsValid = false;
      errors["locState"] = ErrorHelper.STATE;
    }

    if (!fields.city || fields.city.trim().length === 0) {
      formIsValid = false;
      errors["city"] = ErrorHelper.CITY;
    }

    if (!fields.zipCode || fields.zipCode.trim().length === 0) {
      formIsValid = false;
      errors["zipCode"] = ErrorHelper.ZIP_CODE;
    }

    if (!fields.fax || fields.fax.trim().length === 0) {
      formIsValid = false;
      errors["fax"] = ErrorHelper.fax;
    }

    if (!fields.email || fields.email.trim().length === 0) {
      formIsValid = false;
      errors["email"] = ErrorHelper.EMAIL;
    } else if (!emailPattern.test(fields.email)) {
      formIsValid = false;
      errors["email"] = ErrorHelper.INVALID_EMAIL;
    }

    if (!fields.phone || fields.phone.trim().length === 0) {
      formIsValid = false;
      errors["phone"] = ErrorHelper.PHONE;
    }

    setErrors(errors);
    return formIsValid;
  };

  return (
    <div className="client-accept accordition-list">
      <div className="notenetic-container">
        <div className="row mx-0">
          <div className="mb-3 col-lg-4 col-md-6 col-12">
            <InputKendoRct
              value={fields.siteName}
              onChange={handleChange}
              name="siteName"
              label="Site Name"
              error={fields.siteName == "" && errors.siteName}
              validityStyles={settingError}
              required={true}
              placeholder="Site Name"
            />
          </div>
          <div className="mb-3 col-lg-4 col-md-6 col-12">
            <InputKendoRct
              value={fields.address}
              onChange={handleChange}
              name="address"
              label="Address"
              error={fields.address == "" && errors.address}
              validityStyles={settingError}
              required={true}
              placeholder="Address"
            />
          </div>
          <div className="mb-2 col-lg-4 col-md-6 col-12">
            <DropDownKendoRct
              label="State"
              onChange={handleChange}
              data={stateData}
              value={fields.locState}
              textField="stateName"
              suggest={true}
              loading={stateLoading}
              name="locState"
              required={true}
              validityStyles={settingError}
              placeholder="State"
              error={!fields.locState && errors.locState}
            />
          </div>
          <div className="mb-3 col-lg-4 col-md-6 col-12">
            <InputKendoRct
              value={fields.city}
              onChange={handleChange}
              name="city"
              label="City"
              validityStyles={settingError}
              error={fields.city == "" && errors.city}
              required={true}
              placeholder="City"
            />
          </div>
          <div className="mb-3 col-lg-4 col-md-6 col-12">
            <ZipCodeInput
              validityStyles={settingError}
              value={fields.zipCode}
              onChange={handleValueChange}
              type="number"
              name="zipCode"
              label="Zip"
              error={fields.zipCode.trim().length == "" && errors.zipCode}
              required={true}
              placeholder="Zip Code"
            />
          </div>
          <div className="mb-3 col-lg-4 col-md-6 col-12">
            <PhoneInputMask
              validityStyles={settingError}
              value={fields.fax}
              onChange={handleValueChange}
              type="number"
              name="fax"
              label="Fax"
              error={fields.fax.trim().length == "" && errors.fax}
              required={true}
              placeholder="Fax"
            />
          </div>
          <div className="mb-3 col-lg-4 col-md-6 col-12">
            <InputKendoRct
              value={fields.email}
              onChange={handleChange}
              name="email"
              label="Email"
              error={errors.email}
              validityStyles={settingError}
              required={true}
              placeholder="Email"
            />
          </div>
          <div className="mb-3 col-lg-4 col-md-6 col-12">
            <PhoneInputMask
              validityStyles={settingError}
              value={fields.phone}
              type="number"
              onChange={handleValueChange}
              name="phone"
              label="Phone"
              placeholder="Phone"
              required={true}
              error={fields.phone === "" && errors.phone}
            />
          </div>
          <div className="mb-3 col-lg-4 col-md-6 col-12">
            <NumericTextBox
              validityStyles={true}
              value={fields.licenses}
              type="number"
              required={true}
              onChange={handleChange}
              name="licenses"
              label="License"
              placeholder="License"
              min={0}
              spinners={false}
            />
          </div>

          <div className="mb-3 col-lg-12 col-md-6 col-12">
            <InputKendoRct
              value={fields.comments}
              onChange={handleChange}
              name="comments"
              label="Comments"
              placeholder="comments"
            />
          </div>
        </div>

        {loading == true && <Loader />}

        <div className="d-flex my-3 mx-2 ">
          <div>
            <button
              className="btn blue-primary text-white"
              onClick={handleSubmit}
            >
              Add Site
            </button>
          </div>
          <div>
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
export default AddSite;
