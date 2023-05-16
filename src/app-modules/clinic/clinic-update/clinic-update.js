import React, { useEffect, useState } from "react";
import ErrorHelper from "../../../helper/error-helper";
import { NotificationManager } from "react-notifications";
import InputKendoRct from "../../../control-components/input/input";
import Loader from "../../../control-components/loader/loader";
import { useSelector } from "react-redux";
import { Dialog } from "@progress/kendo-react-dialogs";
import PhoneInputMask from "../../../control-components/phone-input-mask/phone-input-mask";
import { SettingsService } from "../../../services/settingsService";
import DropDownKendoRct from "../../../control-components/drop-down/drop-down";
import ApiHelper from "../../../helper/api-helper";
import ApiUrls from "../../../helper/api-urls";
import ZipCodeInput from "../../../control-components/zip-code/zip-code";
import useNPI from "../../../cutomHooks/npi";
import { MaskedTextBox } from "@progress/kendo-react-inputs";
import { renderErrors } from "src/helper/error-message-helper";

let startOfWeek = [
  { id: 1, value: "Sunday" },
  { id: 2, value: "Monday" },
  { id: 3, value: "Tuesday" },
  { id: 4, value: "Wednesday" },
  { id: 5, value: "Thursday" },
  { id: 6, value: "Friday" },
  { id: 7, value: "Saturday" },
];

const EditClinic = ({ onClose, selectedRefId, getClinicDetails }) => {
  const clinicDetailsById = useSelector((state) => state.getClinicDetails);
  const result = startOfWeek.find(
    (element) => element.id === clinicDetailsById?.startOfWeek
  );

  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const clinicId = useSelector((state) => state.loggedIn.clinicId);
  const [validateError, setValidateError] = useState(false);
  const [npi, validateNPI] = useNPI();

  let [fields, setFields] = useState({
    address: "",
    state: "",
    city: "",
    zip: "",
    phone: "",
    fax: "",
    email: "",
    websiteUrl: "",
    npi: "",
    startOfWeek: { id: 1, value: "Monday" },
  });

  useEffect(() => {
    setFields({
      address: clinicDetailsById?.address,
      state: clinicDetailsById?.state,
      city: clinicDetailsById?.city,
      zip: clinicDetailsById?.zip,
      phone: clinicDetailsById?.phone,
      fax: clinicDetailsById?.fax,
      email: clinicDetailsById?.email,
      websiteUrl: clinicDetailsById?.websiteUrl,
      npi: clinicDetailsById?.npi,
      startOfWeek: result,
    });
  }, []);

  useEffect(() => {
    validateNPI(fields?.npi);
  }, [fields?.npi]);

  const updateClinic = async () => {
    setLoading(true);
    await SettingsService.updateClinic(fields, clinicId)
      .then((result) => {
        setLoading(false);
        NotificationManager.success("Clinic updated successfully");
        getClinicDetails();
        onClose({ updated: true });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error);
      });
  };

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fields.npi) {
      formIsValid = false;
      errors["npi"] = ErrorHelper.NPI;
    }
    if (!npi) {
      formIsValid = false;
    }
    if (!fields.email) {
      formIsValid = false;
      errors["email"] = ErrorHelper.EMAIL;
    } else if (!emailPattern.test(fields.email)) {
      formIsValid = false;
      errors["email"] = ErrorHelper.INVALID_EMAIL;
    }

    if (!fields.address) {
      formIsValid = false;
      errors["address"] = ErrorHelper.ADDRESS;
    }
    if (!fields.state) {
      formIsValid = false;
      errors["state"] = ErrorHelper.STATE;
    }
    if (!fields.city) {
      formIsValid = false;
      errors["city"] = ErrorHelper.CITY;
    }
    if (!fields.zip) {
      formIsValid = false;
      errors["zip"] = ErrorHelper.ZIP_CODE;
    }
    if (
      !fields.phone ||
      fields.phone.trim() === "" ||
      fields.phone.trim().length < 10
    ) {
      formIsValid = false;
      errors["phone"] = ErrorHelper.PHONE_LIMIT;
    }
    if (!fields.startOfWeek) {
      formIsValid = false;
      errors["startOfWeek"] = ErrorHelper.DAY;
    }

    setErrors(errors);
    return formIsValid;
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

  const handleSubmit = (event) => {
    setValidateError(true);
    if (handleValidation()) {
      updateClinic();
    }
  };

  return (
    <Dialog onClose={onClose} title={"Edit Clinic"} className="dialog-modal">
      <div className=" edit-Service-popup">
        <div className="mx-3">
          <div className="row">
            <div className="mb-2 col-lg-4 col-md-6 col-12">
              <InputKendoRct
                validityStyles={validateError}
                value={fields.address}
                onChange={handleChange}
                name="address"
                label="Address"
                error={!fields.address && errors.address}
                required={true}
                placeholder="Address"
              />
            </div>
            <div className="mb-2 col-lg-4 col-md-6 col-12">
              <InputKendoRct
                validityStyles={validateError}
                label="State (NY, NC)"
                onChange={handleChange}
                value={fields.state}
                textField="stateName"
                suggest={true}
                name="state"
                error={!fields.state && errors.state}
                required={true}
                maxLength={2}
                placeholder="State (ex. NY, NC)"
              />
            </div>

            <div className="mb-2 col-lg-4 col-md-6 col-12">
              <InputKendoRct
                validityStyles={validateError}
                value={fields.city}
                onChange={handleChange}
                name="city"
                label="City"
                error={!fields.city && errors.city}
                required={true}
                placeholder="City"
              />
            </div>

            <div className="mb-2 col-lg-4 col-md-6 col-12">
              <ZipCodeInput
                validityStyles={validateError}
                value={fields.zip}
                onChange={handleValueChange}
                name="zip"
                label="Zip "
                error={fields.zip.trim().length == "" && errors.zip}
                required={true}
                placeholder="Zip "
              />
            </div>
            <div className="mb-2 col-lg-4 col-md-6 col-12">
              <PhoneInputMask
                validityStyles={validateError}
                onChange={handleValueChange}
                name="phone"
                label="Phone"
                value={fields.phone}
                error={errors.phone}
                required={true}
                placeholder="Phone"
              />
            </div>
            <div className="mb-2 col-lg-4 col-md-6 col-12">
              <PhoneInputMask
                onChange={handleValueChange}
                name="fax"
                label="Fax"
                value={fields.fax}
                placeholder="Fax"
                required={false}
                maskValidation={false}
              />
            </div>
            <div className="mb-2 col-lg-4 col-md-6 col-12">
              <InputKendoRct
                validityStyles={validateError}
                value={fields.email}
                onChange={handleChange}
                name="email"
                label="Email"
                error={errors.email}
                required={true}
                placeholder="Email"
              />
            </div>
            <div className="mb-2 col-lg-4 col-md-6 col-12">
              <InputKendoRct
                value={fields.websiteUrl}
                onChange={handleChange}
                name="websiteUrl"
                label="Website URL"
                // error={fields.websiteUrl == "" && errors.websiteUrl}
                // required={true}
                placeholder="Website URL"
              />
            </div>
            <div className="mb-2 col-lg-4 col-md-6 col-12">
              <InputKendoRct
                validityStyles={validateError}
                value={fields.npi}
                onChange={handleChange}
                name="npi"
                label="NPI #"
                error={!fields.npi && errors.npi}
                required={true}
                placeholder="NPI"
              />
              {npi === false && fields.npi && (
                <p style={{ color: "#d61923" }}>Invalid NPI</p>
              )}
            </div>

            <div className="mb-2 col-lg-4 col-md-6 col-12">
              <DropDownKendoRct
                // defaultValue={startOfWeek[0].value}
                validityStyles={validateError}
                label="First Day of Week"
                onChange={handleChange}
                data={startOfWeek}
                value={fields.startOfWeek}
                textField="value"
                // suggest={true}
                name="startOfWeek"
                error={!fields.startOfWeek && errors.startOfWeek}
                required={true}
              />
            </div>
          </div>
        </div>
        {loading == true && <Loader />}
      </div>
      <div className="border-bottom-line"></div>
      <div className="d-flex mt-4">
        <div className="right-sde">
          <button
            className="btn blue-primary text-white mx-3"
            onClick={handleSubmit}
          >
            {selectedRefId ? "Update" : "Submit"}
          </button>
        </div>
        <div className="right-sde-grey">
          <button className="btn grey-secondary text-white " onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </Dialog>
  );
};
export default EditClinic;
