import React, { useEffect, useState } from "react";
import ApiUrls from "../../../helper/api-urls";
import ErrorHelper from "../../../helper/error-helper";
import { NotificationManager } from "react-notifications";
import ApiHelper from "../../../helper/api-helper";
import InputKendoRct from "../../../control-components/input/input";
import Loader from "../../../control-components/loader/loader";
import { useDispatch, useSelector } from "react-redux";
import { Dialog } from "@progress/kendo-react-dialogs";
import DropDownKendoRct from "../../../control-components/drop-down/drop-down";
import PhoneInputMask from "../../../control-components/phone-input-mask/phone-input-mask";
import ZipCodeInput from "../../../control-components/zip-code/zip-code";
import { Encrption } from "../../encrption";
import { renderErrors } from "src/helper/error-message-helper";

const EditSite = ({ onClose, selectedSiteId, stateData }) => {
  let [fields, setFields] = useState({
    siteName: "",
    address: "",
    locState: "",
    city: "",
    zipCode: "",
    fax: "",
    email: "",
    licenses: "",
    county: "",
    comments: "",
  });

  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const clinicId = useSelector((state) => state.loggedIn.clinicId);
  const [settingError, setSettingError] = useState(false);
  const providerId = useSelector((state) => state.providerID);
  const [mobilePhone, setMobilePhone] = useState("");

  useEffect(() => {
    getSiteDetail();
  }, []);

  const getSiteDetail = () => {
    setLoading(true);

    ApiHelper.getRequest(ApiUrls.GET_SITE_BY_ID + Encrption(selectedSiteId))
      .then((result) => {
        setLoading(false);
        let siteDetail = result.resultData;
        setFields({
          ...fields,
          siteName: siteDetail.siteName,
          address: siteDetail.address,
          locState: stateData.find((x) => x.id == siteDetail.stateId),
          city: siteDetail.city,
          zipCode: siteDetail.zip,
          comments: siteDetail.comments,
          email: siteDetail.email,
          licenses: siteDetail.licenses,
          fax: siteDetail.fax,
        });
        setMobilePhone(siteDetail.phone);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const updateSite = () => {
    setLoading(true);

    var data = {
      id: selectedSiteId,
      siteName: fields.siteName,
      address: fields.address,
      stateId: fields.locState.id,
      city: fields.city,
      zip: fields.zipCode,
      phone: mobilePhone,
      providerId: providerId ? providerId : "",
      fax: fields.fax,
      email: fields.email,
      licenses: parseInt(fields.licenses),
      comments: fields.comments,
      clinicId: clinicId,
    };
    ApiHelper.putRequest(ApiUrls.UPDATE_SITE, data)
      .then((result) => {
        setLoading(false);
        onClose({ editable: true });
        NotificationManager.success("Site updated successfully");
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;
    var pattern = new RegExp(/^[0-9\b]+$/);
    var emailPattern = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );

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

    // if (!fields.fax || fields.fax.trim().length === 0) {
    //   formIsValid = false;
    //   errors["fax"] = ErrorHelper.fax;
    // }

    if (!fields.email || fields.email.trim().length === 0) {
      formIsValid = false;
      errors["email"] = ErrorHelper.email;
    } else if (!emailPattern.test(fields.email)) {
      formIsValid = false;
      errors["email"] = ErrorHelper.INVALID_EMAIL;
    }

    if (!fields.licenses) {
      formIsValid = false;
      errors["licenses"] = ErrorHelper.licenses;
    }
    if (!mobilePhone) {
      formIsValid = false;
      errors["mobilePhone"] = ErrorHelper.PHONE;
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
    }
    setFields({
      ...fields,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    setSettingError(true);
    if (handleValidation()) {
      updateSite();
    }
  };

  return (
    <div>
      <Dialog onClose={onClose} title={"Edit Site"} className="dialog-modal">
        <div className="edit-client-popup px-0">
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
            <div className="mb-3 col-lg-4 col-md-6 col-12">
              <DropDownKendoRct
                label="State"
                onChange={handleChange}
                data={stateData}
                value={fields.locState}
                format={"MM/dd/YYYY"}
                textField="stateName"
                suggest={true}
                name="locState"
                required={true}
                validityStyles={settingError}
                error={!fields.locState && errors.locState}
                placeholder="State"
              />
            </div>
            <div className="mb-3 col-lg-4 col-md-6 col-12">
              <InputKendoRct
                value={fields.city}
                onChange={handleChange}
                name="city"
                label="City"
                error={fields.city == "" && errors.city}
                validityStyles={settingError}
                required={true}
                placeholder="City"
              />
            </div>
            <div className="mb-3 col-lg-4 col-md-6 col-12">
              <ZipCodeInput
                validityStyles={settingError}
                value={fields.zipCode}
                onChange={handleChange}
                type="number"
                name="zipCode"
                label="Zip"
                error={fields?.zipCode?.trim().length == "" && errors.zipCode}
                required={true}
                placeholder="Zip Code"
              />
            </div>
            <div className="mb-3 col-lg-4 col-md-6 col-12">
              <PhoneInputMask
                validityStyles={settingError}
                value={fields.fax}
                onChange={handleChange}
                type="number"
                name="fax"
                label="Fax"
                placeholder="Fax"
              />
            </div>
            <div className="mb-3 col-lg-4 col-md-6 col-12">
              <InputKendoRct
                value={fields.email}
                onChange={handleChange}
                name="email"
                label="Email"
                error={fields.email == "" && errors.email}
                validityStyles={settingError}
                required={true}
                placeholder="Email"
              />
            </div>
            <div className="mb-3 col-lg-4 col-md-6 col-12">
              <PhoneInputMask
                validityStyles={settingError}
                value={mobilePhone}
                type="number"
                onChange={handleChange}
                name="mobilePhone"
                label="Phone"
                placeholder="Phone"
                required={true}
                error={mobilePhone == "" && errors.mobilePhone}
              />
            </div>
            <div className="mb-3 col-lg-4 col-md-6 col-12">
              <InputKendoRct
                value={fields.licenses}
                type="number"
                onChange={handleChange}
                name="licenses"
                label="License"
                error={fields.licenses == "" && errors.licenses}
                validityStyles={settingError}
                required={true}
                placeholder="Licenses"
              />
            </div>

            <div className="mb-3 col-lg-12 col-md-6 col-12">
              <InputKendoRct
                value={fields.comments}
                onChange={handleChange}
                name="comments"
                label="Comments"
                placeholder="Comments"
              />
            </div>
          </div>
        </div>
        {loading == true && <Loader />}

        <div className="border-bottom-line"></div>
        <div className="d-flex my-3 mx-2">
          <button
            className="btn blue-primary text-white"
            onClick={handleSubmit}
          >
            Submit
          </button>

          <button
            className="btn grey-secondary text-white mx-3"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </Dialog>
    </div>
  );
};
export default EditSite;
