import React, { Component, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { NumericTextBox } from "@progress/kendo-react-inputs"
import APP_ROUTES from "../../../../helper/app-routes";
import { NotificationManager } from "react-notifications";
import ApiUrls from "../../../../helper/api-urls";
import { useLocation } from "react-router-dom";
import ApiHelper from "../../../../helper/api-helper";
import ErrorHelper from "../../../../helper/error-helper";
import DatePickerKendoRct from "../../../../control-components/date-picker/date-picker";
import ClientHeader from "../client-header/client-header";
import Loader from "../../../../control-components/loader/loader";
import CustomDrawer from "../../../../control-components/custom-drawer/custom-drawer";
import moment from "moment";
import useDateCheck from "../../../../cutomHooks/date-check/date-check";
import { renderErrors } from "src/helper/error-message-helper";

const AddVital = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const clinicId = useSelector((state) => state.loggedIn.clinicId);
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const [settingError, setSettingError] = useState(false);
  const [dateChecker, setDateCheck] = useDateCheck();

  const [fields, setFields] = useState({
    bpDia: "",
    bpSys: "",
    clientId: "",
    heartRate: "",
    pulseRate: "",
    temperature: "",
    dateRecord: "",
    respiration: "",
    height: "",
    weight: "",
  });

  useEffect(() => {
    setDateCheck(fields.dateRecord);
  }, [fields.dateRecord]);

  const handleSubmit = (event) => {
    setSettingError(true);
    if (handleValidation()) {
      saveVital();
    }
  };
  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;

    // if (!fields.bpSys || fields.bpSys.trim().length === 0 ) {
    //     formIsValid = false;
    //     errors["bpSys"] = ErrorHelper.bpSys
    // }
    // else if( fields.bpSys <= 0){
    //   formIsValid = false;
    //   errors["bpSys"] = "minus value not allowed"
    // }

    // if (!fields.bpDia || fields.bpDia.trim().length === 0) {
    //     formIsValid = false;
    //     errors["bpDia"] = ErrorHelper.bpDia
    // }

    // if (!fields.heartRate || fields.heartRate.trim().length === 0) {
    //     formIsValid = false;
    //     errors["heartRate"] = ErrorHelper.heartRate
    // }

    // if (!fields.pulseRate || fields.pulseRate.trim().length === 0) {
    //     formIsValid = false;
    //     errors["pulseRate"] = ErrorHelper.pulseRate
    // }

    // if (!fields.temperature && fields.temperature.trim().length === 0) {
    //     formIsValid = false;
    //     errors["temperature"] = ErrorHelper.temperature
    // }
    // if (!fields.respiration && fields.respiration.trim().length === 0) {
    //     formIsValid = false;
    //     errors["respiration"] = ErrorHelper.respiration
    // }
    // if (!fields.height && fields.height.trim().length === 0) {
    //     formIsValid = false;
    //     errors["height"] = ErrorHelper.height
    // }

    // if (!fields.weight && fields.weight.trim().length === 0) {
    //     formIsValid = false;
    //     errors["weight"] = ErrorHelper.FIELD_BLANK
    // }

    if (!fields.dateRecord) {
      formIsValid = false;
      errors["dateRecord"] = ErrorHelper.dateRecord;
    }
    if (dateChecker == true) {
      formIsValid = false;
      errors["dateRecord"] = ErrorHelper.DATE_CHECK;
    }

    setErrors(errors);
    return formIsValid;
  };

  const saveVital = () => {
    setLoading(true);
    let dateRecord = fields.dateRecord
      ? moment(fields.dateRecord).format("YYYY-MM-DD")
      : "";
    var data = {
      bpDia: fields.bpDia ? fields.bpDia : 0,
      bpSys: fields.bpSys ? fields.bpSys : 0,
      clientId: selectedClientId,
      heartRate: fields.heartRate ? fields.heartRate : 0,
      pulseRate: fields.pulseRate ? fields.pulseRate : 0,
      temperature: fields.temperature ? fields.temperature : 0,
      dateRecord: new Date(dateRecord),
      respiration: fields.respiration ? fields.respiration : 0,
      weight: fields.weight ? fields.weight : 0,
      height: fields.height ? fields.height : 0,
    };
    ApiHelper.postRequest(ApiUrls.Add_VITAL, data)
      .then((result) => {
        NotificationManager.success("Vitals added successfully");
        setLoading(false);
        navigate(APP_ROUTES.GET_CLIENT_VITAL);
        setFields({
          ...fields,
          bpDia: "",
          bpSys: "",
          clientId: "",
          heartRate: "",
          id: "",
          pulseRate: "",
          temperature: "",
          dateRecord: "",
          respiration: "",
          weight: "",
          height: "",
        });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error);
      });
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFields({
      ...fields,
      [name]: value,
    });
  };
  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="client-accept accordition-list">
      <div className="d-flex flex-wrap">
        <div className="inner-dt col-md-3 col-lg-2">
          <CustomDrawer />
        </div>
        <div className="col-md-9 col-lg-10 ">
          <div className="staff-profile-page">
            <ClientHeader />
            <div className="row mx-0 mt-3">
              <div className="mb-2 col-lg-4 col-md-6 col-12">
                <DatePickerKendoRct
                  validityStyles={settingError}
                  onChange={handleChange}
                  value={fields.dateRecord}
                  name={"dateRecord"}
                  title={"Record Date"}
                  required={true}
                  error={errors.dateRecord}
                  label={"Record Date"}
                  placeholder={"Record Date"}
                  max={new Date()}
                />
              </div>
              <div className="mb-3 col-lg-4 col-md-6 col-12">
                <NumericTextBox
                  validityStyles={false}
                  value={fields.bpSys}
                  type="number"
                  onChange={handleChange}
                  name="bpSys"
                  label="Bp Sys"
                  placeholder="Bp Sys"
                  error={errors.bpSys}
                  min={0}
                  spinners={false}
                />
              </div>
              <div className="mb-3 col-lg-4 col-md-6 col-12">
                <NumericTextBox
                  validityStyles={false}
                  value={fields.bpDia}
                  type="number"
                  onChange={handleChange}
                  name="bpDia"
                  label="Bp Dias"
                  placeholder="Bp Dias"
                  min={0}
                  spinners={false}
                  //error={errors.bpDia && errors.bpDia}
                />
              </div>
              <div className="mb-3 col-lg-4 col-md-6 col-12">
                <NumericTextBox
                  validityStyles={false}
                  value={fields.temperature}
                  type="number"
                  onChange={handleChange}
                  name="temperature"
                  label="Temperature"
                  placeholder="Temperature"
                  min={0}
                  spinners={false}
                  // error={errors.temperature && errors.temperature}
                />
              </div>
              <div className="mb-3 col-lg-4 col-md-6 col-12">
                <NumericTextBox
                  validityStyles={false}
                  value={fields.heartRate}
                  onChange={handleChange}
                  type="number"
                  name="heartRate"
                  label="Heart Rate"
                  placeholder="Heart Rate"
                  min={0}
                  spinners={false}
                  //error={errors.heartRate && errors.heartRate}
                />
              </div>

              <div className="mb-3 col-lg-4 col-md-6 col-12">
                <NumericTextBox
                  validityStyles={false}
                  value={fields.respiration}
                  type="number"
                  onChange={handleChange}
                  name="respiration"
                  label="Respiration"
                  placeholder="Respiration"
                  min={0}
                  spinners={false}
                  // error={errors.respiration && errors.respiration}
                />
              </div>
              <div className="mb-3 col-lg-4 col-md-6 col-12">
                <NumericTextBox
                  validityStyles={false}
                  value={fields.pulseRate}
                  type="number"
                  onChange={handleChange}
                  name="pulseRate"
                  label="Pulse Rate"
                  placeholder="Pulse Rate"
                  min={0}
                  spinners={false}
                  // error={errors.pulseRate && errors.pulseRate}
                />
              </div>

              <div className="mb-3 col-lg-4 col-md-6 col-12">
                <NumericTextBox
                  validityStyles={false}
                  value={fields.weight}
                  type="number"
                  onChange={handleChange}
                  name="weight"
                  label="Weight(in lbs.)"
                  placeholder="Weight"
                  min={0}
                  spinners={false}
                  // error={errors.weight && errors.weight}
                />
              </div>
              <div className="mb-3 col-lg-4 col-md-6 col-12">
                <NumericTextBox
                  validityStyles={false}
                  value={fields.height}
                  type="number"
                  onChange={handleChange}
                  name="height"
                  label="Height(in cms.)"
                  placeholder="Height"
                  min={0}
                  spinners={false}
                  // error={errors.height && errors.height}
                />
              </div>
            </div>
            {loading && <Loader />}
            <div className="d-flex">
              <div>
                <button
                  className="btn blue-primary text-white mx-3"
                  onClick={handleSubmit}
                >
                  Add Vital
                </button>
              </div>
              <div>
                <button
                  className="btn grey-secondary text-white ml-0"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddVital;
