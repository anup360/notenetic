import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ApiUrls from "../../helper/api-urls";
import InputKendoRct from "../../control-components/input/input";
import DatePickerKendoRct from "../../control-components/date-picker/date-picker";
import ErrorHelper from "../../helper/error-helper";
import { NotificationManager } from "react-notifications";
import ApiHelper from "../../helper/api-helper";
import { useLocation } from "react-router-dom";
import DropDownKendoRct from "../../control-components/drop-down/drop-down";
import { useSelector } from "react-redux";
import APP_ROUTES from "../../helper/app-routes";
import Loader from "../../control-components/loader/loader";
import {
  ExpansionPanel,
  ExpansionPanelContent,
} from "@progress/kendo-react-layout";
import { Reveal } from "@progress/kendo-react-animation";
import { Switch } from "@progress/kendo-react-inputs";
import moment from "moment";
import { Encrption } from "../encrption";
import ValidationHelper from "../../helper/validation-helper";
import { NumericTextBox } from "@progress/kendo-react-inputs";
import { renderErrors } from "src/helper/error-message-helper";
import { Error } from "@progress/kendo-react-labels";


const AddServices = () => {
  const vHelper = ValidationHelper();
  const navigate = useNavigate();
  const location = useLocation();
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [billinUnitData, setBillingUnitData] = useState([]);
  const [billingUnitLoading, setBillingUnitLoading] = useState(false);
  const [settingError, setSettingError] = useState(false);
  const [expDemographics, setExpDemographics] = React.useState(true);
  const [fields, setFields] = useState({
    service: "",
    serviceCode: "",
    modifier: "",
    secModifier: "",
    thirdModifier: "",
    fourthModifier: "",
    ageModifier: "",
    locModifier: "",
    serviceRate: "",
    billingUnitId: "",
    clinicId: "",
    dateEffective: "",
    endDate: "",
    rateDateEffective: "",
    rateEndDate: "",
    minTime: "",
    addon: false,
    maxTime: "",
    billable: true,
    revenueCode: "",
    professional: false,
    allowOverlapping: false,
    authRequired: false,
  });

  useEffect(() => {
    getBillingUnit();

    if (location.state !== null) {
      let servicesObj = location.state.servicesObj;

      getServicesDetail(servicesObj);
    }
  }, []);

  const clinicId = useSelector((state) => state.loggedIn.clinicId);
  const handleCancel = () => {
    navigate(-1);
  };
  const getBillingUnit = () => {
    setBillingUnitLoading(true);
    ApiHelper.getRequest(ApiUrls.GET_BILLINGUNIT)
      .then((result) => {
        let stateList = result.resultData;
        setBillingUnitLoading(false);
        setBillingUnitData(stateList);
      })
      .catch((error) => {
        setBillingUnitLoading(false);
        renderErrors(error.message);
      });
  };
  const handleSubmit = (event) => {
    setSettingError(true);
    if (handleValidation()) {
      if (location.state !== null) {
        let servicesObj = location.state.servicesObj;
        updateServices(servicesObj);
      } else {
        saveServices();
      }
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFields({
      ...fields,
      [name]: value,
    });
  };

  const saveServices = () => {
    setLoading(true);
    window.scrollTo(0, 0);

    let effectiveDate = fields.dateEffective
      ? moment(fields.dateEffective).format("YYYY-MM-DD")
      : "";
    let dateEnd = fields.endDate
      ? moment(fields.endDate).format("YYYY-MM-DD")
      : "";
    let rateDateEffective = fields.rateDateEffective
      ? moment(fields.rateDateEffective).format("YYYY-MM-DD")
      : "";
    let endRateDate = fields.rateEndDate
      ? moment(fields.rateEndDate).format("YYYY-MM-DD")
      : "";

    var data = {
      service: fields.service ? fields.service : "",
      serviceCode: fields.serviceCode ? fields.serviceCode : "",
      modifier: fields.modifier ? fields.modifier : "",
      secModifier: fields.secModifier ? fields.secModifier : "",
      thirdModifier: fields.thirdModifier ? fields.thirdModifier : "",
      fourthModifier: fields.fourthModifier ? fields.fourthModifier : "",
      ageModifier: fields.ageModifier ? fields.ageModifier : "",
      locModifier: fields.locModifier ? fields.locModifier : "",
      serviceRate: fields.serviceRate,
      billingUnitId: fields.billingUnitId.id,
      dateEffective: effectiveDate,
      endDate: dateEnd,
      rateDateEffective: rateDateEffective,
      rateEndDate: endRateDate,
      clinicId: clinicId,
      minTime: fields.minTime ? parseInt(fields.minTime) : 0,
      addon: fields.addon,
      maxTime: fields.maxTime ? parseInt(fields.maxTime) : 0,
      billable: fields.billable,
      revenueCode: fields.revenueCode ? fields.revenueCode : "",
      professional: fields.professional,
      allowOverlapping: fields.allowOverlapping,
      authRequired: fields.authRequired,
    };
    ApiHelper.postRequest(ApiUrls.INSERT_Services, data)
      .then((result) => {
        setLoading(false);
        NotificationManager.success(result.message);
        navigate(APP_ROUTES.GET_SERVICE_BY_CLINICID);
        setFields({
          ...fields,
          service: "",
          serviceCode: "",
          modifier: "",
          secModifier: "",
          thirdModifier: "",
          fourthModifier: "",
          ageModifier: "",
          locModifier: "",
          serviceRate: "",
          billingUnitId: "",
          clinicId: "",
          dateEffective: "",
          endDate: "",
          rateDateEffective: "",
          rateEndDate: "",
          minTime: "",
          addon: "",
          maxTime: "",
          billable: "",
          revenueCode: "",
          professional: "",
          allowOverlapping: "",
          authRequired: "",
        });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error);
      });
  };

  const getServicesDetail = (servicesObj) => {
    let serviceId = servicesObj.id;
    setLoading(true);
    ApiHelper.getRequest(ApiUrls.GET_Services_BY_ID + Encrption(serviceId), "")
      .then((result) => {
        let servicesDetail = result.resultData;
        setLoading(false);
        setFields({
          ...fields,
          service: servicesDetail.service,
          serviceDesc: servicesDetail.serviceDesc,
          isActive: servicesDetail.isActive,
          serviceCode: servicesDetail.serviceCode,
          modifier: servicesDetail.modifier,
          secModifier: servicesDetail.secModifier,
          thirdModifier: servicesDetail.thirdModifier,
          fourthModifier: servicesDetail.fourthModifier,
          ageModifier: servicesDetail.ageModifier,
          locModifier: servicesDetail.locModifier,
          serviceRate: servicesDetail.serviceRate,
          profService: servicesDetail.profService,
          billingUnitId: servicesDetail.billingUnitId,
          billingRateID: servicesDetail.billingRateID,
          clinicId: servicesDetail.clinicId,
          ediType: servicesDetail.ediType,
          maxUnitsPerDay: servicesDetail.maxUnitsPerDay,
          dateEffective: servicesDetail.dateEffective,
          endDate: servicesDetail.endDate,
          allowOverlappingTime: servicesDetail.allowOverlappingTime,
          flagNote: servicesDetail.flagNote,
          minTime: servicesDetail.minTime,
          addon: servicesDetail.addon,
          maxMins: servicesDetail.maxMins,
          authRequired: servicesDetail.authRequired,
          billable: servicesDetail.billable,
          importedServiceID: servicesDetail.importedServiceID,
          revenueCode: servicesDetail.revenueCode,
          allowOverlapping: servicesDetail.allowOverlapping,
        });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const updateServices = (servicesObj) => {
    setLoading(true);
    var data = {
      id: servicesObj.id,
      service: fields.service,
      serviceDesc: fields.serviceDesc,
      isActive: fields.isActive,
      serviceCode: fields.serviceCode,
      modifier: fields.modifier,
      secModifier: fields.secModifier,
      thirdModifier: fields.thirdModifier,
      fourthModifier: fields.fourthModifier,
      ageModifier: fields.ageModifier,
      locModifier: fields.locModifier,
      serviceRate: fields.serviceRate,
      profService: fields.profService,
      billingUnitId: fields.billingUnitId,
      billingRateID: fields.billingRateID,
      clinicId: servicesObj.clinicId,
      ediType: fields.ediType,
      maxUnitsPerDay: fields.maxUnitsPerDay,
      dateEffective: fields.dateEffective,
      endDate: fields.endDate,
      allowOverlappingTime: fields.allowOverlappingTime,
      flagNote: fields.flagNote,
      minTime: fields.minTime,
      addon: fields.addon,
      maxMins: fields.maxMins,
      authRequired: fields.authRequired,
      billable: fields.billable,
      importedServiceID: fields.importedServiceID,
      revenueCode: fields.revenueCode,
      allowOverlapping: fields.allowOverlapping,
    };
    ApiHelper.putRequest(ApiUrls.UPDATE_Services, data)
      .then((result) => {
        setLoading(false);
        NotificationManager.success(result.message);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;
    if (!fields.service || fields.service.trim().length === 0) {
      formIsValid = false;
      errors["service"] = ErrorHelper.service;
    }

    if (!fields.serviceCode || fields.serviceCode.trim().length === 0) {
      formIsValid = false;
      errors["serviceCode"] = ErrorHelper.serviceCode;
    }

    if (!fields.serviceRate) {
      formIsValid = false;
      errors["serviceRate"] = ErrorHelper.serviceRate;
    }

    if (!fields.dateEffective) {
      formIsValid = false;
      errors["dateEffective"] = ErrorHelper.dateEffective;
    }
    if (!fields.rateEndDate) {
      formIsValid = false;
      errors["rateEndDate"] = ErrorHelper.rateEndDate;
    } else if (fields.dateEffective && fields.rateEndDate) {
      let error = vHelper.startDateLessThanEndDateValidator(
        fields.dateEffective,
        fields.rateEndDate,
        "dateEffective",
        "rateEndDate"
      );
      if (error && error.length > 0) {
        errors["dateEffective"] = error;
        formIsValid = false;
      }
    }

    if (!fields.rateDateEffective) {
      formIsValid = false;
      errors["rateDateEffective"] = ErrorHelper.rateDateEffective;
    } else if (fields.rateDateEffective && fields.endDate) {
      let error = vHelper.startDateLessThanEndDateValidator(
        fields.rateDateEffective,
        fields.endDate,
        "rateDateEffective",
        "endDate"
      );
      if (error && error.length > 0) {
        errors["rateDateEffective"] = error;
        formIsValid = false;
      }
    }

    if (!fields.billingUnitId) {
      formIsValid = false;
      errors["billingUnitId"] = ErrorHelper.billingUnitId;
    }

    setErrors(errors);
    return formIsValid;
  };


  console.log("errrrr", errors)

  return (
    <div className="client-accept accordition-list add_services-cus">
      <div className="notenetic-container">
        <div className="row mx-0">
          <ExpansionPanel title="Service Manager" expanded={expDemographics}>
            <Reveal>
              {expDemographics && (
                <ExpansionPanelContent>
                  <div onKeyDown={(e) => e.stopPropagation()}>
                    <div className="row">
                      <div className="mb-3 col-lg-4 col-md-6 col-12">
                        <InputKendoRct
                          value={fields.service}
                          onChange={handleChange}
                          name="service"
                          label="Service"
                          error={fields.service == "" && errors.service}
                          validityStyles={settingError}
                          required={true}
                          placeholder="Service"
                        />
                      </div>
                      <div className="mb-3 col-lg-4 col-md-6 col-12">
                        <InputKendoRct
                          value={fields.serviceCode}
                          onChange={handleChange}
                          name="serviceCode"
                          label="Service Code"
                          error={fields.serviceCode == "" && errors.serviceCode}
                          validityStyles={settingError}
                          required={true}
                          placeholder="Service Code"
                        />
                      </div>
                    </div>
                    <div className="modifires-line-content ">
                      <div className="fw-500 mb-4 mt-4">MODIFIERS</div>
                      <div className="row">
                        <div className="mb-3 col-lg-2 col-md-3 col-12">
                          <InputKendoRct
                            validityStyles={false}
                            value={fields.modifier}
                            onChange={handleChange}
                            name="modifier"
                            label="I"
                            error={errors.modifier && errors.modifier}
                          />
                        </div>

                        <div className="mb-3 col-lg-2 col-md-3 col-12">
                          <InputKendoRct
                            validityStyles={false}
                            value={fields.secModifier}
                            onChange={handleChange}
                            name="secModifier"
                            label="II"
                          //error={errors.modifier && errors.modifier}
                          />
                        </div>
                        <div className="mb-3 col-lg-2 col-md-3 col-12">
                          <InputKendoRct
                            validityStyles={false}
                            value={fields.thirdModifier}
                            onChange={handleChange}
                            name="thirdModifier"
                            label="III"
                          //error={errors.modifier && errors.modifier}
                          />
                        </div>

                        <div className="mb-3 col-lg-2 col-md-3 col-12">
                          <InputKendoRct
                            validityStyles={false}
                            value={fields.fourthModifier}
                            onChange={handleChange}
                            name="fourthModifier"
                            label="IV"
                          //error={errors.modifier && errors.modifier}
                          />
                        </div>

                        <div className="mb-3 col-lg-2 col-md-3 col-12">
                          <InputKendoRct
                            validityStyles={false}
                            value={fields.ageModifier}
                            onChange={handleChange}
                            name="ageModifier"
                            label="Age"
                            placeholder="Age"

                          //error={errors.modifier && errors.modifier}
                          />
                        </div>

                        <div className="mb-3 col-lg-2 col-md-3 col-12">
                          <InputKendoRct
                            validityStyles={false}
                            value={fields.locModifier}
                            onChange={handleChange}
                            name="locModifier"
                            label="Location"
                            placeholder="Location"

                          //error={errors.modifier && errors.modifier}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="rates-line-content ">
                      <div className="fw-500 mb-4 mt-4 text-capitalize">RATE</div>
                      <div className="row">
                        <div className="mb-3 col-lg-4 col-md-6 col-12">
                          <NumericTextBox
                            value={fields.serviceRate}
                            onChange={handleChange}
                            name="serviceRate"
                            label="Service Rate"
                            validityStyles={settingError}
                            required={true}
                            type="number"
                            placeholder="Service Rate"
                            spinners={false}
                          />
                          {!fields.serviceRate && <Error>{errors.serviceRate}</Error>}

                        </div>

                        <div className="mb-3 col-lg-4 col-md-6 col-12">
                          <DatePickerKendoRct
                            onChange={handleChange}
                            format="MM/dd/YYYY"
                            placeholder="Rate Effective Date "
                            value={fields.dateEffective}
                            name={"dateEffective"}
                            fillMode={"solid"}
                            size={"medium"}
                            title={"Rate Effective Date"}
                            weekNumber={false}
                            label={"Rate Effective Date"}
                            required={true}
                            validityStyles={settingError}
                            error={errors.dateEffective}
                          />
                        </div>

                        <div className="mb-3 col-lg-4 col-md-6 col-12">
                          <DatePickerKendoRct
                            label={"Rate End Date"}
                            onChange={handleChange}
                            format="MM/dd/YYYY"
                            placeholder="Rate End Date"
                            value={fields.rateEndDate}
                            name={"rateEndDate"}
                            fillMode={"solid"}
                            size={"medium"}
                            title={"Rate End Date"}
                            weekNumber={false}
                            required={true}
                            validityStyles={settingError}
                            error={!fields.rateEndDate && errors.rateEndDate}
                          //error={errors.dob && errors.dob}
                          />
                        </div>

                        <div className="mb-3 col-lg-4 col-md-6 col-12">
                          <DropDownKendoRct
                            label="Billing Unit"
                            onChange={handleChange}
                            data={billinUnitData}
                            value={fields.billingUnitId}
                            textField="name"
                            suggest={true}
                            // onOpened={getGender}
                            name="billingUnitId"
                            required={true}
                            validityStyles={settingError}
                            error={!fields.billingUnitId && errors.billingUnitId}
                            placeholder="Billing Unit"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="setting-line-content ">
                      <div className="row">
                        <div className="col-lg-12 col-md-12 col-12 ">
                          <div className="fw-500 mb-4 mt-4">SETTINGS</div>
                        </div>

                        <div className="row">
                          <div className="col-lg-2 mb-3 col-md-6 col-sm-12 col-12 switch-on px-0">
                            <span className="switch-title-text mr-3">Billable</span>
                            <Switch
                              onLabel={""}
                              offLabel={""}
                              value={fields.billable}
                              defaultChecked={true}
                              name={"billable"}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-lg-2  mb-3 col-md-6 col-sm-12 col-12 switch-on px-0">
                            <span className="switch-title-text mr-3"> Professional</span>
                            <Switch
                              onLabel={""}
                              offLabel={""}
                              value={fields.professional}
                              name={"professional"}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-lg-2 mb-3 col-md-6 col-sm-12 col-12 switch-on px-0">
                            <span className="switch-title-text mr-3">Add On</span>
                            <Switch
                              onLabel={""}
                              offLabel={""}
                              value={fields.addon}
                              name={"addon"}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-lg-3 mb-3 col-md-6 col-sm-12 col-12 switch-on px-0">
                            <span className="switch-title-text mr-3">
                              Allow Overlapping
                            </span>
                            <Switch
                              onLabel={""}
                              offLabel={""}
                              value={fields.allowOverlapping}
                              name={"allowOverlapping"}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-lg-3 mb-3 col-md-6 col-sm-12 col-12 switch-on px-0">
                            <span className="switch-title-text mr-3">
                              Auth Required
                            </span>
                            <Switch
                              onLabel={""}
                              offLabel={""}
                              defaultChecked={true}
                              value={fields.authRequired}
                              name={"authRequired"}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="mb-3 col-lg-4 col-md-6 col-12">
                          <DatePickerKendoRct
                            onChange={handleChange}
                            format="MM/dd/YYYY"
                            placeholder="Date Effective"
                            value={fields.rateDateEffective}
                            name={"rateDateEffective"}
                            fillMode={"solid"}
                            size={"medium"}
                            title={"Date Effective"}
                            weekNumber={false}
                            label={"Effective Date"}
                            required={true}
                            validityStyles={settingError}
                            error={errors.rateDateEffective}
                          />
                        </div>

                        <div className="mb-3 col-lg-4 col-md-6 col-12">
                          <DatePickerKendoRct
                            onChange={handleChange}
                            format="MM/dd/YYYY"
                            placeholder="End Date"
                            value={fields.endDate}
                            name={"endDate"}
                            label={"End Date"}
                            fillMode={"solid"}
                            size={"medium"}
                            title={"End Date"}
                            weekNumber={false}
                          />
                        </div>
                        <div className="mb-3 col-lg-4 col-md-6 col-12"></div>

                        <div className="mb-3 col-lg-4 col-md-6 col-12">
                          <NumericTextBox
                            validityStyles={false}
                            value={fields.minTime}
                            onChange={handleChange}
                            name="minTime"
                            label="Min Time (in minutes)"
                            type={"number"}
                            placeholder="Min TIme"
                            spinners={false}

                          //error={errors.modifier && errors.modifier}
                          />
                        </div>

                        <div className="mb-3 col-lg-4 col-md-6 col-12">
                          <NumericTextBox
                            validityStyles={false}
                            value={fields.maxTime}
                            onChange={handleChange}
                            name="maxTime"
                            label="Max Time (in minutes)"
                            type={"number"}
                            placeholder="Max Time"
                            spinners={false}
                          //error={errors.modifier && errors.modifier}
                          />
                        </div>

                        <div className="mb-3 col-lg-4 col-md-6 col-12">
                          <InputKendoRct
                            validityStyles={false}
                            value={fields.revenueCode}
                            onChange={handleChange}
                            name="revenueCode"
                            label="Revenue Code"
                            placeholder="Revenue Code"

                          //error={errors.modifier && errors.modifier}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </ExpansionPanelContent>
              )}
            </Reveal>
          </ExpansionPanel>
        </div>
        {loading == true && <Loader />}
        <div className="row">
          <div className="d-flex">
            <div>
              <button
                className="btn blue-primary text-white  mx-3"
                onClick={handleSubmit}
              >
                + Add Service
              </button>
            </div>
            <div>
              <button
                className="btn grey-secondary text-white"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddServices;
