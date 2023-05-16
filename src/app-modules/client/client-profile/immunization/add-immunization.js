import React, { useEffect, useState } from "react";
import moment from "moment";
import Loader from "../../../../control-components/loader/loader";
import ApiUrls from "../../../../helper/api-urls";
import ApiHelper from "../../../../helper/api-helper";
import { useSelector, useDispatch } from "react-redux";
import InputKendoRct from "../../../../control-components/input/input";
import DatePickerKendoRct from "../../../../control-components/date-picker/date-picker";
import DropDownKendoRct from "../../../../control-components/drop-down/drop-down";
import ErrorHelper from "../../../../helper/error-helper";
import { NotificationManager } from "react-notifications";
import AppRoutes from "../../../../helper/app-routes";
import { useNavigate } from "react-router";
import { Checkbox } from "@progress/kendo-react-inputs";
import TextAreaKendoRct from "../../../../control-components/kendo-text-area/kendo-text-area";
import CustomDrawer from "../../../../control-components/custom-drawer/custom-drawer";
import ClientHeader from "../client-header/client-header";
import { NumericTextBox } from "@progress/kendo-react-inputs";
import ValidationHelper from "../../../../helper/validation-helper";
import { renderErrors } from "src/helper/error-message-helper";

const AddImmunization = () => {
  const navigate = useNavigate();
  const vHelper = ValidationHelper();
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState(false);
  const [errors, setErrors] = useState("");
  const [immunization, setImmunization] = useState([]);
  const [administraionSiteList, setAdministraionSiteList] = useState([]);
  const [administraionRouteList, setAdministraionRouteList] = useState([]);
  const [manufacturerList, setManufacturerList] = useState([]);
  const [adminsterationByList, setAdministrationList] = useState([]);

  const [fields, setFields] = useState({
    immunizationId: "",
    dateAdministered: "",
    amountAdministered: "",
    manufacturerId: "",
    dateExpiration: "",
    lotNumber: "",
    administrationSiteId: "",
    administrationRouteId: "",
    administeredBy: "",
    isRejected: false,
    rejectedReason: "",
    comments: "",
  });

  useEffect(() => {
    immunizationId();
    administraionSite();
    administraionRoute();
    manufacturer();
    GetAdministrationBy();
  }, []);

  const immunizationId = () => {
    setLoading(true);
    ApiHelper.getRequest(ApiUrls.GET_IMMUNIZATION)
      .then((result) => {
        setLoading(false);
        setImmunization(result.resultData);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const administraionSite = () => {
    setLoading(true);
    ApiHelper.getRequest(ApiUrls.GET_ADMINISTRATION_SITE)
      .then((result) => {
        setLoading(false);
        setAdministraionSiteList(result.resultData);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const administraionRoute = () => {
    setLoading(true);
    ApiHelper.getRequest(ApiUrls.GET_ADMINISTRATION)
      .then((result) => {
        setLoading(false);
        setAdministraionRouteList(result.resultData);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };
  const manufacturer = () => {
    setLoading(true);

    ApiHelper.getRequest(ApiUrls.GET_MANUFACTUREER)
      .then((result) => {
        setLoading(false);
        setManufacturerList(result.resultData);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };
  async function GetAdministrationBy() {
    try {
      const result = await ApiHelper.getRequest(
        ApiUrls.GET_STAFF_DDL_BY_CLINIC_ID
      );
      const staffObjList = result.resultData.map((x) => {
        return {
          id: x.id,
          name: x.name,
        };
      });
      setAdministrationList(staffObjList);
    } catch (err) {}
  }

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFields({ ...fields, [name]: value });
  };
  const handleTextChange = (e) => {
    const name = e.target.name;
    const value = e.value;
    setFields({
      ...fields,
      [name]: value,
    });
  };

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;
    if (!fields.immunizationId) {
      formIsValid = false;
      errors["immunizationId"] = ErrorHelper.FIELD_BLANK;
    }
    if (!fields.dateAdministered) {
      formIsValid = false;
      errors["dateAdministered"] = ErrorHelper.FIELD_BLANK;
    } else if (fields.dateAdministered && fields.dateExpiration) {
      let error = vHelper.startDateLessThanEndDateValidator(
        fields.dateAdministered,
        fields.dateExpiration,
        "dateAdministered",
        "dateExpiration"
      );
      if (error && error.length > 0) {
        errors["dateAdministered"] = error;
        formIsValid = false;
      }
    }
    if (!fields.dateExpiration) {
      formIsValid = false;
      errors["dateExpiration"] = ErrorHelper.FIELD_BLANK;
    }
    if (!fields.amountAdministered) {
      formIsValid = false;
      errors["amountAdministered"] = ErrorHelper.FIELD_BLANK;
    }
    if (!fields.manufacturerId) {
      formIsValid = false;
      errors["manufacturerId"] = ErrorHelper.FIELD_BLANK;
    }
    if (!fields.administrationSiteId) {
      formIsValid = false;
      errors["administrationSiteId"] = ErrorHelper.FIELD_BLANK;
    }
    if (!fields.administrationRouteId) {
      formIsValid = false;
      errors["administrationRouteId"] = ErrorHelper.FIELD_BLANK;
    }
    if (!fields.administeredBy) {
      formIsValid = false;
      errors["administeredBy"] = ErrorHelper.FIELD_BLANK;
    }
    if (!fields.rejectedReason && fields.isRejected === true) {
      formIsValid = false;
      errors["rejectedReason"] = ErrorHelper.FIELD_BLANK;
    }
    setErrors(errors);
    return formIsValid;
  };

  const saveStaff = () => {
    setLoading(true);
    const data = {
      clientId: selectedClientId,
      immunizationId: fields?.immunizationId.id,
      dateAdministered:
        fields.dateAdministered === null
          ? ""
          : moment(fields?.dateAdministered).format("YYYY-MM-DD"),
      amountAdministered: fields?.amountAdministered,
      manufacturerId: fields?.manufacturerId.id,
      dateExpiration:
        fields?.dateExpiration === null
          ? ""
          : moment(fields?.dateExpiration).format("YYYY-MM-DD"),
      lotNumber: fields?.lotNumber ? fields?.lotNumber : null,
      administrationSiteId: fields?.administrationSiteId.id,
      administrationRouteId: fields?.administrationRouteId.id,
      administeredBy: fields?.administeredBy.id,
      isRejected: fields?.isRejected,
      rejectedReason: fields?.rejectedReason,
      comments: fields?.comments,
    };

    ApiHelper.postRequest(ApiUrls.INSERT_CLIENT_IMMUNIZATION, data)
      .then((result) => {
        setLoading(false);
        NotificationManager.success("Add immunization successfully");
        navigate(AppRoutes.CLIENT_IMMUNIZATION);
      })
      .catch((error) => {
        setLoading(false);
        NotificationManager.error(error.message);
        renderErrors(error);
      });
  };

  const handleSubmit = (event) => {
    setValidationError(true);
    if (handleValidation()) {
      saveStaff();
    }
  };

  const handleCancel = () => {
    navigate(AppRoutes.CLIENT_IMMUNIZATION);
  };

  return (
    <div className="client-accept ">
      <div className="d-flex flex-wrap">
        <div className="inner-dt col-md-3 col-lg-2">
          <CustomDrawer />
        </div>
        <div className="col-md-9 col-lg-10 ">
          <div className="staff-profile-page">
            <ClientHeader />
            {/* {loading === true && <Loader />} */}
            <h4 className="address-title text-grey mt-3 ">
              <span className="f-24">Add Immunization</span>
            </h4>
            <div className="row mx-0 mt-5">
              <div className="col-md-4 col-lg-4 col-12 mb-4">
                <DropDownKendoRct
                  validityStyles={validationError}
                  data={immunization}
                  onChange={handleChange}
                  value={fields.immunizationId}
                  textField="name"
                  label="Immunization"
                  dataItemKey="id"
                  name="immunizationId"
                  required={true}
                  error={!fields.immunizationId && errors.immunizationId}
                  placeholder="Immunization"
                />
              </div>
              <div className="mb-3 col-lg-4 col-md-6 col-12">
                <DatePickerKendoRct
                  validityStyles={validationError}
                  onChange={handleChange}
                  placeholder="Date Administered"
                  name={"dateAdministered"}
                  label={"Date Administered"}
                  value={fields.dateAdministered}
                  error={errors.dateAdministered}
                  required={true}
                />
              </div>
              <div className="col-md-4 col-lg-4 col-12 mb-4">
                <DropDownKendoRct
                  validityStyles={validationError}
                  data={adminsterationByList}
                  onChange={handleChange}
                  value={fields.administeredBy}
                  textField="name"
                  label="Administrationed By"
                  dataItemKey="id"
                  name="administeredBy"
                  required={true}
                  error={!fields.administeredBy && errors.administeredBy}
                  placeholder="Administrationed By"
                />
              </div>
              <div className="mb-3 col-lg-4 col-md-6 col-12">
                <DatePickerKendoRct
                  validityStyles={validationError}
                  onChange={handleChange}
                  placeholder="Date Expiration"
                  name={"dateExpiration"}
                  label={"Date Expiration"}
                  value={fields.dateExpiration}
                  error={fields.dateExpiration === "" && errors.dateExpiration}
                  required={true}
                />
              </div>
              <div className="mb-3 col-lg-4 col-md-6 col-12">
                <NumericTextBox
                  type="number"
                  validityStyles={validationError}
                  value={fields.amountAdministered}
                  onChange={handleChange}
                  name="amountAdministered"
                  label="Amount Administered (mL)"
                  error={
                    fields.amountAdministered === "" &&
                    errors.amountAdministered
                  }
                  required={true}
                  spinners={false}
                />
              </div>
              <div className="col-md-4 col-lg-4 col-12 mb-4">
                <DropDownKendoRct
                  validityStyles={validationError}
                  data={manufacturerList}
                  onChange={handleChange}
                  value={fields.manufacturerId}
                  textField="name"
                  label="Manufacturer"
                  dataItemKey="id"
                  name="manufacturerId"
                  required={true}
                  error={!fields.manufacturerId && errors.manufacturerId}
                  placeholder="Manufacturer"
                />
              </div>
              <div className="mb-3 col-lg-4 col-md-6 col-12">
                <NumericTextBox
                  validityStyles={validationError}
                  value={fields.lotNumber}
                  onChange={handleChange}
                  name="lotNumber"
                  label="Lot Number"
                  placeholder="Lot Number"
                  spinners={false}
                />
              </div>
              <div className="col-md-4 col-lg-4 col-12 mb-4">
                <DropDownKendoRct
                  validityStyles={validationError}
                  data={administraionSiteList}
                  onChange={handleChange}
                  value={fields.administrationSiteId}
                  textField="name"
                  label="Administration Site"
                  dataItemKey="id"
                  name="administrationSiteId"
                  required={true}
                  error={
                    !fields.administrationSiteId && errors.administrationSiteId
                  }
                  placeholder="Administration Site"
                />
              </div>
              <div className="col-md-4 col-lg-4 col-12 mb-4">
                <DropDownKendoRct
                  validityStyles={validationError}
                  data={administraionRouteList}
                  onChange={handleChange}
                  value={fields.administrationRouteId}
                  textField="name"
                  label="Administration Route"
                  dataItemKey="id"
                  name="administrationRouteId"
                  required={true}
                  error={
                    !fields.administrationRouteId &&
                    errors.administrationRouteId
                  }
                  placeholder="Administration Route"
                />
              </div>
              <div className="mb-3 col-lg-12 col-md-12 col-12 ">
                <Checkbox
                  onChange={handleChange}
                  label={"Is Rejected"}
                  name="isRejected"
                  value={fields.isRejected}
                />
              </div>
              <div className="mb-3 col-lg-4 col-md-6 col-12">
                <InputKendoRct
                  validityStyles={validationError}
                  value={fields.rejectedReason}
                  onChange={handleChange}
                  name="rejectedReason"
                  label="Rejected Reason"
                  error={fields.rejectedReason === "" && errors.rejectedReason}
                  required={true && fields.isRejected == true}
                  placeholder="Rejected Reason"
                />
              </div>

              <div className="col-md-12 col-lg-12 col-12 ">
                <TextAreaKendoRct
                  validityStyles={validationError}
                  name="comments"
                  txtValue={fields.comments}
                  onChange={handleTextChange}
                  label="Comments"
                />
              </div>
            </div>
            <div className="d-flex mt-4">
              <div className="right-sde">
                <button
                  className="btn blue-primary text-white mx-3"
                  onClick={handleSubmit}
                >
                  Add
                </button>
              </div>
              <div className="right-sde-grey">
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
    </div>
  );
};

export default AddImmunization;
