import { Loader } from "@progress/kendo-react-indicators";
import * as React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import CustomDrawer from "../../../control-components/custom-drawer/custom-drawer";
import InputKendoRct from "../../../control-components/input/input";
import PhoneInputMask from "../../../control-components/phone-input-mask/phone-input-mask";
import APP_ROUTES from "../../../helper/app-routes";
import ErrorHelper from "../../../helper/error-helper";
import ClientHeader from "../client-profile/client-header/client-header";
import apiHelper from "../../../helper/api-helper";
import API_URLS from "../../../helper/api-urls";
import { showError } from "../../../util/utility";
import { Encrption } from "../../encrption";
import Loading from "../../../control-components/loader/loader";
import { NotificationManager } from "react-notifications";
import { renderErrors } from "src/helper/error-message-helper";

const AddPhysician = () => {
  //
  const [errors, setErrors] = useState("");
  const [settingError, setSettingError] = useState(false);
  const [loading, setLoading] = useState(false);
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const [editId, setEditId] = useState();
  const [physician, setPhysician] = useState({
    firstName: "",
    lastName: "",
    phoneMasked: "",
    address: "",
    comments: "",
  });

  // Variables
  const navigate = useNavigate();
  const location = useLocation();

  if (location && location.state && location.state.id != editId) {
    setEditId(location.state.id);
    setLoading(true);
    apiHelper
      .getRequest(
        API_URLS.GET_CLIENT_GETPHYSICIAN_BY_ID + Encrption(location.state.id)
      )
      .then((result) => {
        setPhysician({
          ...result.resultData,
          phone: result.resultData.mobilePhone,
        });
      })
      .catch((err) => {
        showError(err, "Get Physician");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;

    if (!physician.firstName) {
      formIsValid = false;
      errors["firstName"] = ErrorHelper.FIRST_NAME;
    }

    if (!physician.lastName) {
      formIsValid = false;
      errors["lastName"] = ErrorHelper.LAST_NAME;
    }

    if (!physician.phone || physician.phone.trim().length == 0) {
      formIsValid = false;
      errors["phone"] = ErrorHelper.PHONE;
    } else if (physician.phone.replace(/\D/g, "").trim().length != 10) {
      formIsValid = false;
      errors["phone"] = ErrorHelper.PHONE_LIMIT;
    }

    if (!physician.address) {
      formIsValid = false;
      errors.address = ErrorHelper.ADDRESS;
    }
    setErrors(errors);
    return formIsValid;
  };

  function savePhysician() {
    const body = {
      clientId: selectedClientId,
      firstName: physician.firstName,
      lastName: physician.lastName,
      mobilePhone: physician.phone,
      address: physician.address,
      comments: physician.comments,
    };
    setLoading(true);

    (editId
      ? apiHelper.putRequest(API_URLS.UPDATE_CLIENT_PHYSICIAN, {
          ...body,
          id: editId,
        })
      : apiHelper.postRequest(API_URLS.INSERT_CLIENT_PHYSICIAN, body)
    )

      .then((result) => {
        NotificationManager.success(editId ? "Physician updated successfully " : "Physician added successfully")
        navigate(APP_ROUTES.CLIENT_PHYSICIAN_LIST);
      })
      .catch((error) => {
        renderErrors(error)
        showError(error, editId ? "Update Physician" : "Add Physician");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const handleAddPhysician = () => {
    setSettingError(true);
    if (handleValidation()) {
      savePhysician();
    }
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    const rawValue = event.target.rawValue;

    setPhysician({
      ...physician,
      [name]: name == "phone" ? rawValue : value,
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
            <span className="f-24">Physician</span>
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
                value={physician.firstName}
                onChange={handleChange}
                name="firstName"
                required={true}
                validityStyles={settingError}
                label="First Name"
                placeholder="First Name"
                error={physician.firstName === "" && errors.firstName}
              />
            </div>
            <div className="col-lg-4 col-md-6 col-12 mb-3">
              <InputKendoRct
                value={physician.lastName}
                onChange={handleChange}
                name="lastName"
                required={true}
                validityStyles={settingError}
                label="Last Name"
                placeholder="Last Name"
                error={physician.lastName === "" && errors.lastName}
              />
            </div>

            <div className="col-lg-4 col-md-6 col-12 mb-3">
              <PhoneInputMask
                value={physician.phone}
                onChange={handleChange}
                name="phone"
                type="number"
                required={true}
                validityStyles={settingError}
                label="Phone No."
                placeholder="Phone No."
                error={
                  (!physician.phone ||
                    physician.phone.replace(/\D/g, "").trim().length != 10) &&
                  errors.phone
                }
              />
            </div>

            <div className="col-lg-4 col-md-6 col-12 mb-3">
              <InputKendoRct
                value={physician.address}
                onChange={handleChange}
                name="address"
                required={true}
                validityStyles={settingError}
                label="Address"
                placeholder="Address"
                error={physician.address === "" && errors.address}
              />
            </div>

            <div className="col-lg-4 col-md-6 col-12 mb-3">
              <InputKendoRct
                value={physician.comments}
                onChange={handleChange}
                name="comments"
                validityStyles={settingError}
                label="Comment"
                placeholder="Comment"
              />
            </div>
          </div>
        </div>
        <div className="my-3 px-3">
          <button
            className="btn blue-primary text-white "
            onClick={handleAddPhysician}
          >
            {editId ? "Update Physician" : "Add Physician"}
          </button>
          <button
            className="btn grey-secondary text-white mx-3"
            onClick={() => {
              navigate(APP_ROUTES.CLIENT_PHYSICIAN_LIST);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
export default AddPhysician;
