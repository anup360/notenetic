import { Loader } from "@progress/kendo-react-indicators";
import * as React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import CustomDrawer from "../../../../control-components/custom-drawer/custom-drawer";
import DropDownKendoRct from "../../../../control-components/drop-down/drop-down";
import InputKendoRct from "../../../../control-components/input/input";
import apiHelper from "../../../../helper/api-helper";
import API_URLS from "../../../../helper/api-urls";
import AppRoutes from "../../../../helper/app-routes";
import ErrorHelper from "../../../../helper/error-helper";
import { showError } from "../../../../util/utility";
import { Encrption } from "../../../encrption";
import ClientHeader from "../client-header/client-header";
import PhoneInputMask from "../../../../control-components/phone-input-mask/phone-input-mask";
import Loading from "../../../../control-components/loader/loader";
import { NotificationManager } from "react-notifications";
import { renderErrors } from "src/helper/error-message-helper";

const AddGuardian = () => {
  const [errors, setErrors] = useState("");
  const [settingError, setSettingError] = useState(false);
  const [loading, setLoading] = useState(false);
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const [stateData, setStateData] = useState([]);
  const [stateLoading, setStateLoading] = useState(false);
  const [editId, setEditId] = useState();
  const [guardian, setGuardian] = useState({
    firstName: "",
    lastName: "",
    phoneMasked: "",
    address: "",
    city: "",
    state: "",
  });

  // Variables
  const navigate = useNavigate();
  const location = useLocation();

  if (location && location.state && location.state.id != editId) {
    setEditId(location.state.id);
    setLoading(true);
    apiHelper
      .getRequest(
        API_URLS.GET_CLIENT_GETGUARDIANS_BY_ID + Encrption(location.state?.id)
      )
      .then((result) => {
        let resultData = result.resultData;
        resultData.state = {
          id: resultData.stateId,
          stateName: resultData.stateName,
        };
        setGuardian(resultData);
      })
      .catch((err) => {
        showError(err, "detail Documents");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    getState();
  }, []);

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;

    if (!guardian.firstName) {
      formIsValid = false;
      errors["firstName"] = ErrorHelper.FIRST_NAME;
    }

    if (!guardian.lastName) {
      formIsValid = false;
      errors["lastName"] = ErrorHelper.LAST_NAME;
    }

    if (!guardian.phone || guardian.phone.trim().length == 0) {
      formIsValid = false;
      errors["phone"] = ErrorHelper.PHONE;
    } else if (guardian.phone.replace(/\D/g, "").trim().length != 10) {
      formIsValid = false;
      errors["phone"] = ErrorHelper.PHONE_LIMIT;
    }

    if (!guardian.address) {
      formIsValid = false;
      errors.address = ErrorHelper.ADDRESS;
    }

    if (!guardian.city) {
      formIsValid = false;
      errors["city"] = ErrorHelper.CITY;
    }

    if (!guardian.state) {
      formIsValid = false;
      errors["state"] = ErrorHelper.STATE;
    }

    setErrors(errors);
    return formIsValid;
  };

  function saveGuardian() {
    const body = {
      clientId: selectedClientId,
      firstName: guardian.firstName,
      lastName: guardian.lastName,
      phone: guardian.phone,
      address: guardian.address,
      city: guardian.city,
      stateId: guardian.state.id,
      zip: guardian.zip,
    };
    setLoading(true);

    (editId
      ? apiHelper.putRequest(API_URLS.UPDATE_CLIENT_GUARDIANS, {
          ...body,
          id: editId,
        })
      : apiHelper.postRequest(API_URLS.INSERT_CLIENT_GUARDIANS, body)
    )
      .then((result) => {
        NotificationManager.success(editId ? "Parent/Guardian updated successfully" : " Parent/Guardian added successfully")
        navigate(AppRoutes.CLIENT_GUARDIAN_LIST);
      })
      .catch((err) => {
        setLoading(false);
        showError(err, editId ? "Update Guardian" : "Add Guadiran");
      })
      .finally(() => {});
  }

  const handleAddGuardian = () => {
    setSettingError(true);
    if (handleValidation()) {
      saveGuardian();
    }
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    const rawValue = event.target.rawValue;

    setGuardian({
      ...guardian,
      [name]: name == "phone" ? rawValue : value,
    });
  };

  const getState = () => {
    setStateLoading(true);
    apiHelper
      .getRequest(API_URLS.GET_STATE)
      .then((result) => {
        let stateList = result.resultData;
        setStateLoading(false);
        setStateData(stateList);
      })
      .catch((error) => {
        setStateLoading(false);
        showError(error.message, "Fetching States");
      });
  };

  return (
    <div className="d-flex flex-wrap">
      <div className="inner-dt col-md-3 col-lg-2">
        <CustomDrawer />
      </div>
      <div className="col-md-9 col-lg-10">
        <ClientHeader />
        <br></br>
        <div className="Service-RateList my-3">
          <h4 className="address-title text-grey ">
            <span className="f-24">Parent/Guardian</span>
          </h4>
          {loading && (
            <div>
              <Loading />
            </div>
          )}
          &emsp;<div></div>
        </div>
        <div className="Service-RateList">
          <div className="d-flex flex-wrap">
            <div className="col-lg-4 col-md-6 col-12 mb-3">
              <InputKendoRct
                value={guardian.firstName}
                onChange={handleChange}
                name="firstName"
                required={true}
                validityStyles={settingError}
                label="First Name"
                placeholder="First Name"
                error={guardian.firstName === "" && errors.firstName}
              />
            </div>

            <div className="col-lg-4 col-md-6 col-12 mb-3">
              <InputKendoRct
                value={guardian.lastName}
                onChange={handleChange}
                name="lastName"
                required={true}
                validityStyles={settingError}
                label="Last Name"
                placeholder="Last Name"
                error={guardian.lastName === "" && errors.lastName}
              />
            </div>

            <div className="col-lg-4 col-md-6 col-12 mb-3">
              <PhoneInputMask
                value={guardian.phone}
                onChange={handleChange}
                name="phone"
                type="number"
                required={true}
                validityStyles={settingError}
                label="Phone No."
                placeholder="Phone No."
                error={
                  (!guardian.phone ||
                    guardian.phone.replace(/\D/g, "").trim().length != 10) &&
                  errors.phone
                }
              />
            </div>

            <div className="col-lg-4 col-md-6 col-12 mb-3">
              <InputKendoRct
                value={guardian.address}
                onChange={handleChange}
                name="address"
                required={true}
                validityStyles={settingError}
                label="Address"
                placeholder="Address"
                error={guardian.address === "" && errors.address}
              />
            </div>

            <div className="col-lg-4 col-md-6 col-12 mb-3">
              <InputKendoRct
                value={guardian.city}
                onChange={handleChange}
                name="city"
                required={true}
                validityStyles={settingError}
                label="City"
                placeholder="City"
                error={guardian.city === "" && errors.city}
              />
            </div>

            <div className="col-lg-4 col-md-6 col-12 mb-3">
              <DropDownKendoRct
                label="State"
                value={guardian.state}
                onChange={handleChange}
                name="state"
                required={true}
                validityStyles={settingError}
                placeholder="State"
                error={!guardian.state && errors.state}
                suggest={true}
                data={stateData}
                textField="stateName"
                loading={stateLoading}
              />
            </div>
          </div>
          <div className="my-3 ml-3">
          <button
            className="btn blue-primary text-white  "
            onClick={handleAddGuardian}
          >
            {editId ? "Update Guardian" : "Add Guardian"}
          </button>
          <button
            className="btn grey-secondary text-white mx-3"
            onClick={() => {
              navigate(AppRoutes.CLIENT_GUARDIAN_LIST);
            }}
          >
            Cancel
          </button>
        </div>
        </div>  
      </div>
    </div>
  );
};
export default AddGuardian;
