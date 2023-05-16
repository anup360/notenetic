import React, { useEffect, useRef, useState } from "react";
import { Switch } from "@progress/kendo-react-inputs";
import { Error } from "@progress/kendo-react-labels";
import { useDispatch } from "react-redux";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import DatePickerKendoRct from "../../../../control-components/date-picker/date-picker";
import ClientHeader from "../client-header/client-header";
import ErrorHelper from "../../../../helper/error-helper";
import { NotificationManager } from "react-notifications";
import DropDownKendoRct from "../../../../control-components/drop-down/drop-down";
import InputKendoRct from "../../../../control-components/input/input";
import Loader from "../../../../control-components/loader/loader";
import { useSelector } from "react-redux";
import { ClientService } from "../../../../services/clientService";
import TextAreaKendoRct from "../../../../control-components/text-area/text-area";
import MultiSelectDropDown from "../../../../control-components/multi-select-drop-down/multi-select-drop-down";
import ApiHelper from "../../../../helper/api-helper";
import ApiUrls from "../../../../helper/api-urls";
import { useNavigate, useLocation } from "react-router";
import { Encrption } from "../../../encrption";
import ValidationHelper from "../../../../helper/validation-helper";
import APP_ROUTES from "../../../../helper/app-routes";
import { SELECTED_CLIENT_ID } from "../../../../actions";
import { NumericTextBox } from "@progress/kendo-react-inputs";
import { renderErrors } from "src/helper/error-message-helper";

const CommonAuthorizationForm = () => {
  const frequencyData = [
    { key: "Day", value: "Day" },
    { key: "Week", value: "Week" },
    { key: "Month", value: "Month" },
    { key: "Year", value: "Year" },
  ];
  const vHelper = ValidationHelper();
  const staffLoginInfo = useSelector((state) => state.getStaffReducer);

  const submittedByd = {
    name: `${staffLoginInfo?.lastName}, ${staffLoginInfo?.firstName}`,
    id: staffLoginInfo?.id,
  };

  let [fields, setFields] = useState({
    effectiveDate: "",
    endDate: "",
    numUnits: "",
    dateAuth: "",
    authStatus: "",
    submittedDate: "",
    submittedBy: submittedByd,
    comments: "",
    custAuthId: "",
    authServices: "",
    isEnforceValidation: true,
    freqNumUnits: 0,
    frequency: { key: "Day", value: "Day" },
    clientId: "",
  });
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const [settingError, setSettingError] = useState(false);
  const [authStatus, setAuthStatus] = useState([]);
  const [staffData, setStaffData] = useState([]);
  const staffId = useSelector((state) => state.loggedIn?.staffId);
  const clinicId = useSelector((state) => state.loggedIn.clinicId);
  const [clientList, setClientList] = useState([]);
  const navigate = useNavigate();

  const [serviceData, setServiceData] = useState([]);
  const { state } = useLocation();

  useEffect(() => {
    getAuthorizationStatus();
    getStaffList();
    getServicesList();
    fetchClientList();

    if (state) {
      getAuthorizationtById();
    }
  }, []);

  function fetchClientList() {
    setLoading({ patientList: true });
    ApiHelper.getRequest(ApiUrls.GET_CLIENT_DDL_BY_CLINIC_ID)
      .then((result) => {
        const list = result.resultData.map((r) => {
          return { id: r.clientId, name: r.clientName };
        });
        setClientList(list);
      })
      .catch((err) => {
        setErrors(err, "Patient List");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const getAuthorizationtById = async () => {
    setLoading(true);
    await ClientService.getAuthById(state.selectedAuthorization)
      .then((result) => {
        setLoading(false);
        let authInfo = result.resultData;
        let services = result.resultData.serviceIds;
        let newData = [];
        if (services.length > 0) {
          for (var i = 0; i < services.length; i++) {
            const element = {
              id: services[i]?.id,
              fullName: services[i]?.name,
            };
            newData.push(element);
          }
        }
        const clientId = {
          id: authInfo?.clientId,
          name: authInfo?.clientName,
        };
        const authStatus = {
          id: authInfo?.authStatusId,
          name: authInfo?.authStatus,
        };
        const authSubmitted = {
          id: authInfo?.staffId,
          name: authInfo?.submittedByStaffName,
        };
        const frequencyVal = {
          key: authInfo?.frequency,
          value: authInfo?.frequency,
        };

        setFields({
          ...fields,
          effectiveDate:
            authInfo?.effectiveDate && new Date(authInfo.effectiveDate),
          endDate: authInfo?.endDate && new Date(authInfo.endDate),
          submittedDate:
            authInfo?.dateSubmitted && new Date(authInfo.dateSubmitted),
          dateAuth: authInfo?.dateAuth && new Date(authInfo.dateAuth),
          numUnits: authInfo?.numUnits,
          comments: authInfo?.comments,
          custAuthId: authInfo?.custAuthId,
          authStatus: authStatus !== null && authStatus,
          submittedBy: authSubmitted !== null && authSubmitted,
          authServices: newData,
          isEnforceValidation: authInfo?.isEnforceValidation,
          freqNumUnits: authInfo?.freqNumUnits,
          frequency: frequencyVal !== null && frequencyVal,
          clientId: clientId !== null && clientId,
        });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const getAuthorizationStatus = async () => {
    await ClientService.getAuthorizationStatus()
      .then((result) => {
        let list = result.resultData;

        setAuthStatus(list);
      })
      .catch((error) => {
        renderErrors(error);
      });
  };

  const getStaffList = async () => {
    await ClientService.getStaffDDLByClinicId()
      .then((result) => {
        let list = result.resultData;
        setStaffData(list);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error);
      });
  };
  const getServicesList = () => {
    ApiHelper.getRequest(
      ApiUrls.GET_Services_BY_PROVIDER_ID +
        Encrption(clinicId) +
        "&isActive=" +
        true,
      ""
    )
      .then((result) => {
        setServiceData(result.resultData);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;

    if (!fields.clientId && !selectedClientId) {
      formIsValid = false;
      errors["clientId"] = ErrorHelper.FIELD_BLANK;
    }

    if (!fields.numUnits) {
      formIsValid = false;
      errors["numUnits"] = ErrorHelper.FIELD_BLANK;
    }

    if (!fields.effectiveDate) {
      formIsValid = false;
      errors["effectiveDate"] = ErrorHelper.FIELD_BLANK;
    } else if (fields.effectiveDate && fields.endDate) {
      let error = vHelper.startDateLessThanEndDateValidator(
        fields.effectiveDate,
        fields.endDate,
        "effectiveDate",
        "endDate"
      );
      if (error && error.length > 0) {
        errors["effectiveDate"] = error;
        formIsValid = false;
      }
    }
    if (!fields.endDate) {
      formIsValid = false;
      errors["endDate"] = ErrorHelper.FIELD_BLANK;
    }
    if (!fields.dateAuth) {
      formIsValid = false;
      errors["dateAuth"] = ErrorHelper.FIELD_BLANK;
    }
    if (!fields.submittedDate) {
      formIsValid = false;
      errors["submittedDate"] = ErrorHelper.FIELD_BLANK;
    }
    if (!fields.authStatus) {
      formIsValid = false;
      errors["authStatus"] = ErrorHelper.FIELD_BLANK;
    }
    if (fields.authServices.length == 0) {
      formIsValid = false;
      errors["authServices"] = ErrorHelper.FIELD_BLANK;
    }

    if (!fields.submittedBy) {
      formIsValid = false;
      errors["submittedBy"] = ErrorHelper.FIELD_BLANK;
    }

    if (
      fields.isEnforceValidation == true
        ? fields.freqNumUnits < 1
        : fields.freqNumUnits
    ) {
      formIsValid = false;
      errors["freqNumUnits"] = ErrorHelper.GREATER_THEN_ZERO;
    }

    if (!fields.frequency) {
      formIsValid = false;
      errors["frequency"] = ErrorHelper.FIELD_BLANK;
    }

    setErrors(errors);
    return formIsValid;
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    // if (name === "freqNumUnits") {
    //   if (value < 0) {
    //     return;
    //   }
    // } else {
    setFields({
      ...fields,
      [name]: value,
    });
    // }
  };

  const handleTextChange = (e) => {
    const name = e.target.name;
    const value = e.value;

    setFields({
      ...fields,
      [name]: value,
    });
  };

  const saveAuthorization = async () => {
    setLoading(true);
    await ClientService.saveAuthorization(fields, selectedClientId, staffId)
      .then((result) => {
        setLoading(false);
        NotificationManager.success("Authorization added successfully");
        navigate(-1);
        setFields({
          ...fields,
          effectiveDate: "",
          endDate: "",
          numUnits: "",
          dateAuth: "",
          authStatus: "",
          submittedDate: "",
          submittedBy: "",
          comments: "",
          custAuthId: "",
          authServices: "",
          isEnforceValidation: "",
          freqNumUnits: "",
          frequency: "",
          clientId: "",
        });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error);
      });
  };

  const updateAuthorization = async (authId) => {
    setLoading(true);
    await ClientService.updateAuthorization(
      fields,
      selectedClientId,
      staffId,
      authId
    )
      .then((result) => {
        setLoading(false);
        NotificationManager.success("Authorization updated successfully");
        navigate(-1);
        setFields({
          ...fields,
          effectiveDate: "",
          endDate: "",
          numUnits: "",
          dateAuth: "",
          authStatus: "",
          submittedDate: "",
          submittedBy: "",
          comments: "",
          custAuthId: "",
          authServices: "",
          isEnforceValidation: "",
          freqNumUnits: "",
          frequency: "",
          clientId: "",
        });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error);
      });
  };

  const handleSubmit = () => {
    setSettingError(true);
    if (handleValidation()) {
      if (state) {
        updateAuthorization(state.selectedAuthorization);
      } else {
        saveAuthorization();
      }
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };
  return (
    <>
      <div className="col-md-9 col-lg-10">
        <div className="staff-profile-page">
          {selectedClientId ? <ClientHeader /> : ""}
          <div className="upload-sign-file pt_30">
            <div className="d-flex justify-content-between ">
              <h4 className="address-title text-grey ">
                <span className="f-24">Authorization</span>
              </h4>
            </div>
          </div>
          <div className="row mt-3">
            {selectedClientId ? (
              " "
            ) : (
              <div className="mb-2 col-lg-4 col-md-6 col-12">
                <DropDownKendoRct
                  label="Client"
                  onChange={handleChange}
                  value={fields.clientId}
                  textField="name"
                  name="clientId"
                  data={clientList}
                  required={true}
                  dataItemKey="id"
                  validityStyles={settingError}
                  error={!fields.clientId && errors.clientId}
                  placeholder="Client"
                  disabled={state?.selectedAuthorization ? true : false}
                />
              </div>
            )}
            <div className="mb-2 col-lg-4 col-md-6 col-12">
              <DatePickerKendoRct
                onChange={handleChange}
                format={"MM/dd/YYYY"}
                placeholder=""
                value={fields.submittedDate}
                name={"submittedDate"}
                fillMode={"solid"}
                size={"medium"}
                title={"Date of Request Submission"}
                label={"Date of Request Submission"}
                weekNumber={false}
                required={true}
                validityStyles={settingError}
                error={!fields.submittedDate && errors.submittedDate}
              />
            </div>
            <div className="mb-2 col-lg-4 col-md-6 col-12">
              <InputKendoRct
                value={fields.numUnits}
                onChange={handleChange}
                name="numUnits"
                type="number"
                label="Total Units"
                error={fields.numUnits == "" && errors.numUnits}
                validityStyles={settingError}
                required={true}
                placeholder="Num Units"
              />
            </div>
            <div className="mb-2 col-lg-4 col-md-6 col-12">
              <DatePickerKendoRct
                onChange={handleChange}
                format={"MM/dd/YYYY"}
                placeholder=""
                value={fields.effectiveDate}
                name={"effectiveDate"}
                fillMode={"solid"}
                size={"medium"}
                title={"Effective Date"}
                label={"Effective Date"}
                weekNumber={false}
                required={true}
                validityStyles={settingError}
                error={errors.effectiveDate}
              />
            </div>

            <div className="mb-2 col-lg-4 col-md-6 col-12">
              <DatePickerKendoRct
                onChange={handleChange}
                format={"MM/dd/YYYY"}
                placeholder=""
                value={fields.endDate}
                name={"endDate"}
                fillMode={"solid"}
                size={"medium"}
                title={"End Date"}
                label={"End Date"}
                weekNumber={false}
                required={true}
                validityStyles={settingError}
                error={!fields.endDate && errors.endDate}
              />
            </div>

            <div className="mb-2 col-lg-4 col-md-6 col-12">
              <DatePickerKendoRct
                onChange={handleChange}
                format={"MM/dd/YYYY"}
                placeholder=""
                value={fields.dateAuth}
                name={"dateAuth"}
                fillMode={"solid"}
                size={"medium"}
                label={"Auth Date"}
                weekNumber={false}
                required={true}
                validityStyles={settingError}
                error={!fields.dateAuth && errors.dateAuth}
              />
            </div>

            <div className="mb-2 col-lg-4 col-md-6 col-12">
              <DropDownKendoRct
                label="Auth Status"
                onChange={handleChange}
                value={fields.authStatus}
                textField="name"
                name="authStatus"
                data={authStatus}
                required={true}
                dataItemKey="id"
                validityStyles={settingError}
                error={!fields.authStatus && errors.authStatus}
                placeholder="Auth Status"
              />
            </div>

            <div className="mb-2 col-lg-4 col-md-6 col-12">
              <DropDownKendoRct
                label="Submitted By"
                onChange={handleChange}
                value={fields.submittedBy}
                textField="name"
                name="submittedBy"
                data={staffData}
                required={true}
                dataItemKey="id"
                validityStyles={settingError}
                error={!fields.submittedBy && errors.submittedBy}
                placeholder="Submitted By"
              />
            </div>
            <div className="mb-2 col-lg-4 col-md-6 col-12">
              <InputKendoRct
                value={fields.custAuthId}
                onChange={handleTextChange}
                name="custAuthId"
                label="Custom Auth ID"
                placeholder="Custom Auth ID"
              />
            </div>
            <div className="mb-2 col-lg-12 col-md-12 col-12">
              <MultiSelectDropDown
                label="Auth Services"
                onChange={handleChange}
                data={serviceData}
                value={fields.authServices}
                textField="fullName"
                name="authServices"
                dataItemKey="id"
                validityStyles={settingError}
                required={true}
                error={fields.authServices.length == 0 && errors.authServices}
              />
            </div>
            <div className="mb-2 col-lg-12 col-md-12 col-12">
              <TextAreaKendoRct
                txtValue={fields.comments}
                onChange={handleTextChange}
                name="comments"
                label="Comments"
                rows={1}
              />
            </div>

            <div className="mb-2 col-lg-12 col-md-12 col-12">
              <span className="mr-2">Enforce Validation</span>
              <Switch
                onChange={handleChange}
                checked={fields.isEnforceValidation}
                onLabel={""}
                offLabel={""}
                name="isEnforceValidation"
              />
            </div>
            {/* start */}
            <div className="frequency mb-3">
              <div className="row mb-2">
                <div className="col-md-12">
                  <label>Frequency Cap</label>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 d-flex">
                  <p>Client cannot be seen for more than a total of</p>
                  <NumericTextBox
                    style={{ width: "60px" }}
                    value={fields.freqNumUnits}
                    onChange={handleChange}
                    name="freqNumUnits"
                    validityStyles={settingError}
                    required={true}
                    spinners={false}
                  />
                  {errors && (
                    <Error style={{ position: "absolute", top: "30px" }}>
                      {errors.freqNumUnits}
                    </Error>
                  )}
                  <p className="ml-2">units in a</p>
                  <div className="auth-drop-error">
                    <DropDownList
                      defaultValue={frequencyData[0].value}
                      data={frequencyData}
                      textField="value"
                      dataItemKey="key"
                      value={fields.frequency}
                      onChange={handleChange}
                      name="frequency"
                      className="frequency-drop"
                      error={fields.frequency.length == 0 && errors.frequency}
                      required={true}
                    />
                    {!fields.frequency && <Error>{errors.frequency}</Error>}
                  </div>
                  <p className="ml-2">for the life of this authorization.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading == true && <Loader />}

        <div className="row my-2 ">
          <div className="d-flex">
            <div>
              <button
                onClick={handleSubmit}
                className="btn blue-primary text-white "
              >
                Submit
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
    </>
  );
};

export default CommonAuthorizationForm;
