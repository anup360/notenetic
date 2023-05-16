import React, { useEffect, useState } from "react";
import Loader from "../../../control-components/loader/loader";
import { useSelector } from "react-redux";
import { Dialog } from "@progress/kendo-react-dialogs";
import NotificationManager from "react-notifications/lib/NotificationManager";
import ErrorHelper from "../../../helper/error-helper";
import InputKendoRct from "../../../control-components/input/input";
import ApiHelper from "../../../helper/api-helper";
import ApiUrls from "../../../helper/api-urls";
import { renderErrors } from "src/helper/error-message-helper";

const BillingProfile = ({
  onClose,
  getStaffBillingProfile,
  billingProfileData,
}) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [settingError, setSettingError] = useState(false);
  const selectedStaffId = useSelector((state) => state.selectedStaffId);
  const [isValid, setIsValid] = useState(null);
  let [fields, setFields] = useState({
    renderingNpi: billingProfileData?.renderingNpi
      ? billingProfileData?.renderingNpi
      : "",
    renderingTaxonomy: billingProfileData?.renderingTaxonomy
      ? billingProfileData?.renderingTaxonomy
      : "",
    renderingMpm: billingProfileData?.renderingMpm
      ? billingProfileData?.renderingMpm
      : "",
  });

  // let [fields, setFields] = useState({
  //   renderingNpi: billingProfileData?.renderingNpi,
  //   renderingTaxonomy: billingProfileData?.renderingTaxonomy,
  //   renderingMpm: billingProfileData?.renderingMpm,
  // });

  useEffect(() => {
    if (validateNPI(fields?.renderingNpi)) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, []);

  const updateClientRefProvider = async () => {
    const data = {
      staffId: selectedStaffId,
      renderingNpi: fields.renderingNpi,
      renderingTaxonomy: !fields.renderingTaxonomy
        ? ""
        : fields.renderingTaxonomy,
      renderingMpm: !fields.renderingMpm ? "" : fields.renderingMpm,
    };
    setLoading(true);
    await ApiHelper.postRequest(ApiUrls.INSERT_STAFF_BILLING_PROFILE, data)
      .then((result) => {
        setLoading(false);
        getStaffBillingProfile();
        NotificationManager.success("Billing updated successfully");

        onClose({ updated: true });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const handleSubmit = () => {
    setSettingError(true);
    if (handleValidation()) {
      updateClientRefProvider();
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name == "renderingNpi") {
      if (validateNPI(value)) {
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    }
    setFields({
      ...fields,
      [name]: value,
    });
  };

  function validateNPI(npi) {
    // remove any whitespace or dashes from the input string
    npi = npi.replace(/\s+|-/g, "");

    // NPI must be exactly 10 digits long
    if (npi.length !== 10) {
      return false;
    }

    // reverse the input string for easier processing
    npi = npi.split("").reverse().join("");

    let sum = 0;
    for (let i = 1; i < npi.length; i++) {
      let digit = parseInt(npi[i], 10);
      // multiply every other digit by 2, starting with the second to last
      if (i % 2 === 1) {
        digit *= 2;
      }
      // if the doubled digit is greater than 9, sum its digits (i.e., 10 becomes 1+0=1)
      if (digit > 9) {
        digit = digit
          .toString()
          .split("")
          .reduce((a, b) => parseInt(a) + parseInt(b));
      }
      sum += digit;
    }
    // the NPI is valid if the sum of its digits is divisible by 10
    const nextMultipleOfTen = Math.ceil((sum + 24) / 10) * 10;
    const calculatedCheckDigit = nextMultipleOfTen - (sum + 24);
    return (
      calculatedCheckDigit ===
      parseInt(npi.split("").reverse().join("").slice(-1))
    );
  }

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;
    if (!fields.renderingNpi) {
      formIsValid = false;
      errors["renderingNpi"] = ErrorHelper.FIELD_BLANK;
    }
    if (!isValid) {
      formIsValid = false;
    }
    // if (
    //   !fields.pediatricianAddress ||
    //   fields.pediatricianAddress.trim().length === 0
    // ) {
    //   formIsValid = false;
    //   errors["renderingTaxonomy"] = ErrorHelper.FIELD_BLANK;
    // }
    // if (
    //   !fields.pediatricianPhone ||
    //   fields.pediatricianPhone.trim().length === 0
    // ) {
    //   formIsValid = false;
    //   errors["renderingMpm"] = ErrorHelper.FIELD_BLANK;
    // }
    setErrors(errors);
    return formIsValid;
  };

  return (
    <div>
      <Dialog
        onClose={onClose}
        title={"Edit Billing Profile"}
        className="small-dailog"
      >
        <div className="edit-client-popup">
          <div className="popup-modal slibling-data">
            <div className="row">
              <div>
                <InputKendoRct
                  validityStyles={settingError}
                  value={fields.renderingNpi}
                  onChange={handleChange}
                  name="renderingNpi"
                  label="Staff NPI"
                  error={!fields.renderingNpi && errors.renderingNpi}
                  required={true}
                />
                {isValid === false && fields.renderingNpi && (
                  <p style={{ color: "#d61923" }}>Invalid NPI</p>
                )}
                <InputKendoRct
                  validityStyles={settingError}
                  value={fields.renderingTaxonomy}
                  onChange={handleChange}
                  name="renderingTaxonomy"
                  label="Taxonomy #"
                  //   error={!fields.renderingTaxonomy && errors.renderingTaxonomy}
                  //   required={true}
                />
                <InputKendoRct
                  validityStyles={settingError}
                  value={fields.renderingMpm}
                  onChange={handleChange}
                  name="renderingMpm"
                  label="MPN (Medical Provider Number)"
                  //   error={!fields.renderingMpm && errors.renderingMpm}
                  //   required={true}
                />
              </div>
            </div>
          </div>

          {loading == true && <Loader />}
        </div>
        <div className="border-bottom-line"></div>
        <div className="d-flex my-3">
          <div className="right-sde">
            <button
              className="btn blue-primary text-white mx-3"
              onClick={handleSubmit}
            >
              Update
            </button>
          </div>
          <div className="right-sde-grey">
            <button
              className="btn grey-secondary text-white "
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
export default BillingProfile;
