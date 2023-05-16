import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ApiUrls from "../../helper/api-urls";
import DatePickerKendoRct from "../../control-components/date-picker/date-picker";
import ErrorHelper from "../../helper/error-helper";
import { NotificationManager } from "react-notifications";
import ApiHelper from "../../helper/api-helper";
import InputKendoRct from "../../control-components/input/input";
import Loader from "../../control-components/loader/loader";
import { useDispatch, useSelector } from "react-redux";
import { Dialog } from "@progress/kendo-react-dialogs";
import { Switch } from "@progress/kendo-react-inputs";
import DropDownKendoRct from "../../control-components/drop-down/drop-down";
import ValidationHelper from "../../helper/validation-helper";
import { renderErrors } from "src/helper/error-message-helper";


const EditService = ({ onClose, selectedServiceId, serviceInfo }) => {
  const vHelper = ValidationHelper();
  const billingUnit = {
    id: serviceInfo.billingUnitId,
    name: serviceInfo.billingUnitsDesc,
  };

  let [fields, setFields] = useState({
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
    dateEnd: "",
    rateDateEffective: "",
    ratedateEnd: "",
    minTime: "",
    addon: false,
    maxTime: "",
    billable: false,
    revenueCode: "",
    professional: false,
    billingUnitId: "",
    allowOverlapping: false,
    authRequired: false,
  });

  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [settingError, setSettingError] = useState(false);
  const clinicId = useSelector((state) => state.loggedIn.clinicId);
  const [billinUnitData, setBillingUnitData] = useState([]);

  useEffect(() => {
    getBillingUnit();
    setFields({
      service: serviceInfo.service,
      serviceCode: serviceInfo.serviceCode,
      modifier: serviceInfo.modifier,
      secModifier: serviceInfo.secModifier,
      thirdModifier: serviceInfo.thirdModifier,
      fourthModifier: serviceInfo.fourthModifier,
      ageModifier: serviceInfo.ageModifier,
      locModifier: serviceInfo.locModifier,
      minTime: serviceInfo.minTime,
      maxTime: serviceInfo.maxTime,
      billable: serviceInfo.billable,
      professional: serviceInfo.professional,
      clinicId: serviceInfo.clinicId,
      revenueCode: serviceInfo.revenueCode,
      dateEffective:
        serviceInfo.dateEffective && new Date(serviceInfo.dateEffective),
      dateEnd: serviceInfo.dateEnd && new Date(serviceInfo.dateEnd),
      billingUnitId: billingUnit,
      addon: serviceInfo.addon,
      allowOverlapping: serviceInfo.allowOverlapping,
      authRequired: serviceInfo.authRequired,
    });
  }, []);

  const updateBill = () => {
    setLoading(true);
    var data = {
      id: selectedServiceId,
      service: fields.service,
      serviceCode: fields.serviceCode,
      modifier: fields.modifier,
      secModifier: fields.secModifier,
      thirdModifier: fields.thirdModifier,
      fourthModifier: fields.fourthModifier,
      ageModifier: fields.ageModifier,
      locModifier: fields.locModifier,
      dateEffective: fields.dateEffective,
      dateEnd: fields.dateEnd,
      clinicId: clinicId,
      minTime: fields.minTime,
      addon: fields.addon,
      maxTime: parseInt(fields.maxTime),
      billable: fields.billable,
      revenueCode: fields.revenueCode,
      professional: fields.professional,
      billingUnitId: fields.billingUnitId.id,
      allowOverlapping: fields.allowOverlapping,
      authRequired: fields.authRequired,
    };

    ApiHelper.putRequest(ApiUrls.UPDATE_SERVICE, data)
      .then((result) => {
        setLoading(false);
        onClose({ editable: true });
        NotificationManager.success("Service updated successfully");
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
      errors["service"] = ErrorHelper.FIELD_BLANK;
    }

    if (!fields.serviceCode || fields.serviceCode.trim().length === 0) {
      formIsValid = false;
      errors["serviceCode"] = ErrorHelper.FIELD_BLANK;
    }

    if (!fields.dateEffective) {
      formIsValid = false;
      errors["dateEffective"] = ErrorHelper.FIELD_BLANK;
    }

    if (!fields.billingUnitId) {
      formIsValid = false;
      errors["billingUnitId"] = ErrorHelper.FIELD_BLANK;
    } else if (fields.dateEffective && fields.dateEnd) {
      let error = vHelper.startDateLessThanEndDateValidator(
        fields.dateEffective,
        fields.dateEnd,
        "dateEffective",
        "dateEnd"
      );
      if (error && error.length > 0) {
        errors["dateEffective"] = error;
        formIsValid = false;
      }
    }

    if (!fields.dateEnd) {
      formIsValid = false;
      errors["dateEnd"] = ErrorHelper.FIELD_BLANK;
    }

    setErrors(errors);
    return formIsValid;
  };

  const getBillingUnit = () => {
    ApiHelper.getRequest(ApiUrls.GET_BILLINGUNIT)
      .then((result) => {
        let list = result.resultData;
        setBillingUnitData(list);
      })
      .catch((error) => {
        renderErrors(error.message);
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

  const handleSubmit = (event) => {
    setSettingError(true);
    if (handleValidation()) {
      updateBill();
    }
  };

  return (
    <div>
      <Dialog onClose={onClose} title={"Edit Service"} className="dialog-modal">
        <div className="client-accept edit-client-popup">
          <div className="popup-modal">
            <div className="row">
              <div className="mb-2 col-lg-4 col-md-6 col-12">
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
              <div className="mb-2 col-lg-4 col-md-6 col-12">
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

              <div className="mb-2 col-lg-4 col-md-6 col-12">
                <DropDownKendoRct
                  label="Billing Unit"
                  onChange={handleChange}
                  data={billinUnitData}
                  value={fields.billingUnitId}
                  textField="name"
                  suggest={true}
                  name="billingUnitId"
                  required={true}
                  validityStyles={settingError}
                  dataItemKey="id"
                  error={!fields.billingUnitId && errors.billingUnitId}
                  placeholder="Billing Unit"
                />
              </div>
              <div className="address-line-content mt-4">
                <h4 className="address-title mb-3">Modifiers</h4>
                <div className="row">
                  <div className="mb-2 col-lg-4 col-md-6 col-12">
                    <InputKendoRct
                      validityStyles={false}
                      value={fields.modifier}
                      onChange={handleChange}
                      name="modifier"
                      label="Modifier"
                      error={errors.modifier && errors.modifier}
                      placeholder="Modifier"
                    />
                  </div>
                  <div className="mb-2 col-lg-4 col-md-6 col-12">
                    <InputKendoRct
                      validityStyles={false}
                      value={fields.secModifier}
                      onChange={handleChange}
                      name="secModifier"
                      label="II Modifier"
                      error={errors.secModifier && errors.secModifier}
                    />
                  </div>
                  <div className="mb-2 col-lg-4 col-md-6 col-12">
                    <InputKendoRct
                      validityStyles={false}
                      value={fields.thirdModifier}
                      onChange={handleChange}
                      name="thirdModifier"
                      label="Third Modifier"
                      error={errors.thirdModifier && errors.thirdModifier}
                    />
                  </div>
                  <div className="mb-2 col-lg-4 col-md-6 col-12">
                    <InputKendoRct
                      validityStyles={false}
                      value={fields.fourthModifier}
                      onChange={handleChange}
                      name="fourthModifier"
                      label="Fourth Modifier"
                      error={errors.fourthModifier && errors.fourthModifier}
                    />
                  </div>
                  <div className="mb-2 col-lg-4 col-md-6 col-12">
                    <InputKendoRct
                      validityStyles={false}
                      value={fields.ageModifier}
                      onChange={handleChange}
                      name="ageModifier"
                      label="Age Modifier"
                      error={errors.ageModifier && errors.ageModifier}
                      placeholder="Age Modifier"
                    />
                  </div>
                  <div className="mb-2 col-lg-4 col-md-6 col-12">
                    <InputKendoRct
                      validityStyles={false}
                      value={fields.locModifier}
                      onChange={handleChange}
                      name="locModifier"
                      label="loc Modifier"
                      error={errors.locModifier && errors.locModifier}
                      placeholder="Loc Modifier"
                    />
                  </div>
                </div>
              </div>
              <div className="address-line-content mt-4">
                <h4 className="address-title mb-3">Setting</h4>
                <div className="row">
                  <div className="mb-2 col-lg-4 col-md-6 col-12">
                    <DatePickerKendoRct
                      onChange={handleChange}
                      value={fields.dateEffective}
                      name={"dateEffective"}
                      title={"Date of Birth"}
                      required={true}
                      validityStyles={settingError}
                      error={errors.dateEffective}
                      label={"Date Effective"}
                      placeholder={"Date of Birth"}
                    />
                  </div>

                  <div className="mb-2 col-lg-4 col-md-6 col-12">
                    <DatePickerKendoRct
                      onChange={handleChange}
                      format={"MM/dd/YYYY"}
                      placeholder="End Date"
                      value={fields.dateEnd}
                      label={"End Date"}
                      name={"dateEnd"}
                      fillMode={"solid"}
                      size={"medium"}
                      title={"End Date"}
                      weekNumber={false}
                      required={true}
                      validityStyles={settingError}
                      error={!fields.dateEnd && errors.dateEnd}
                    />
                  </div>

                  <div className="mb-2 col-lg-4 col-md-6 col-12">
                    <InputKendoRct
                      validityStyles={false}
                      value={fields.maxTime}
                      onChange={handleChange}
                      name="maxTime"
                      label="Max Time (in minutes)"
                      type={"number"}
                      placeholder="Max Time"

                      //error={errors.modifier && errors.modifier}
                    />
                  </div>
                  <div className="mb-2 col-lg-4 col-md-6 col-12">
                    <InputKendoRct
                      validityStyles={false}
                      value={fields.minTime}
                      onChange={handleChange}
                      name="minTime"
                      label="Min Time (in minutes)"
                      type={"number"}
                      placeholder="Min Time"

                      //error={errors.modifier && errors.modifier}
                    />
                  </div>
                  <div className="mb-2 col-lg-4 col-md-6 col-12">
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
                <div className="row my-3 switch-on">
                  <div className="mb-2 col-lg-4 col-md-6 col-12">
                    <span className="switch-title-text mr-3">Billable</span>
                    <Switch
                      onLabel={""}
                      offLabel={""}
                      value={fields.billable}
                      name={"billable"}
                      onChange={handleChange}
                      checked={fields.billable}
                    />
                  </div>
                  <div className="mb-2 col-lg-4 col-md-6 col-12">
                    <span className="switch-title-text mr-3">Professional</span>

                    <Switch
                      onLabel={""}
                      offLabel={""}
                      value={fields.professional}
                      name={"professional"}
                      onChange={handleChange}
                      checked={fields.professional}
                    />
                  </div>

                  <div className="mb-2 col-lg-4 col-md-6 col-12">
                    <span className="switch-title-text mr-3">Add On</span>
                    <Switch
                      onLabel={""}
                      offLabel={""}
                      value={fields.addon}
                      name={"addon"}
                      onChange={handleChange}
                      checked={fields.addon}
                    />
                  </div>
                  <div className="mb-2 col-lg-4 col-md-6 col-12">
                    <span className="switch-title-text mr-3">
                      Allow Overlapping
                    </span>
                    <Switch
                      onLabel={""}
                      offLabel={""}
                      value={fields.allowOverlapping}
                      name={"allowOverlapping"}
                      onChange={handleChange}
                      checked={fields.allowOverlapping}
                    />
                  </div>
                  <div className="mb-2 col-lg-4 col-md-6 col-12">
                    <span className="switch-title-text mr-3">
                      Auth Required
                    </span>
                    <Switch
                      onLabel={""}
                      offLabel={""}
                      value={fields.authRequired}
                      name={"authRequired"}
                      onChange={handleChange}
                      checked={fields.authRequired}
                    />
                  </div>
                </div>
              </div>
            </div>

            {loading == true && <Loader />}
            <div className="border-bottom-line"></div>
            <div className="row py-3">
              <div className="d-flex">
                <div>
                  <button
                    className="btn blue-primary text-white  "
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </div>
                <div>
                  <button
                    className="btn grey-secondary text-white mx-3"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
export default EditService;
