import React, { useEffect, useState } from "react";
import moment from "moment";
import Loader from "../../../../control-components/loader/loader";
import ApiUrls from "../../../../helper/api-urls";
import ApiHelper from "../../../../helper/api-helper";
import { useSelector, useDispatch } from "react-redux";
import InputKendoRct from "../../../../control-components/input/input";
import DatePickerKendoRct from "../../../../control-components/date-picker/date-picker";
import DropDownKendoRct from "../../../../control-components/drop-down/drop-down";
import PhoneInputMask from "../../../../control-components/phone-input-mask/phone-input-mask";
import ErrorHelper from "../../../../helper/error-helper";
import { NotificationManager } from "react-notifications";
import AppRoutes from "../../../../helper/app-routes";
import { IMMUNIZATION_ID } from "../../../../actions";
import { useNavigate, useLocation } from "react-router";
import { Checkbox } from "@progress/kendo-react-inputs";
import TextAreaKendoRct from "../../../../control-components/kendo-text-area/kendo-text-area";
import CustomDrawer from "../../../../control-components/custom-drawer/custom-drawer";
import ClientHeader from "../client-header/client-header";
import { NumericTextBox } from "@progress/kendo-react-inputs";
import { Encrption } from "../../../encrption";
import { renderErrors } from "src/helper/error-message-helper";

const EditImmunization = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let location = useLocation();
  let selecetdId = location.state.id;
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
    getFields();
  }, []);

  const getFields = () => {
    setLoading(true);
    ApiHelper.getRequest(
      ApiUrls.GET_CLIENT_IMMUNIZATION_BY_ID + Encrption(selecetdId)
    )
      .then((result) => {
        const data = result.resultData;
        const immunization = {
          id: data.immunizationId,
          name: data.immunizationName,
        };
        const manufacturer = {
          id: data.manufacturerId,
          name: data.manufacturerName,
        };

        const administrationSite = {
          id: data.administrationSiteId,
          name: data.administrationSiteName,
        };

        const administrationRoute = {
          id: data.administrationRouteId,
          name: data.administrationRouteName,
        };
        const administeredBy = {
          id: data.administeredBy,
          name: data.administeredByStaffName,
        };
        setFields({
          immunizationId: immunization,
          dateAdministered: data.dateAdministered
            ? new Date(data.dateAdministered)
            : "",
          amountAdministered: data.amountAdministered,
          manufacturerId: manufacturer,
          dateExpiration: data.dateExpiration
            ? new Date(data.dateExpiration)
            : "",
          lotNumber: data.lotNumber,
          administrationSiteId: administrationSite,
          administrationRouteId: administrationRoute,
          administeredBy: administeredBy,
          isRejected: data.isRejected,
          rejectedReason: data.rejectedReason,
          comments: data.comments,
        });
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const immunizationId = () => {
    ApiHelper.getRequest(ApiUrls.GET_IMMUNIZATION)
      .then((result) => {
        setImmunization(result.resultData);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const administraionSite = () => {
    ApiHelper.getRequest(ApiUrls.GET_ADMINISTRATION_SITE)
      .then((result) => {
        setAdministraionSiteList(result.resultData);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const administraionRoute = () => {
    ApiHelper.getRequest(ApiUrls.GET_ADMINISTRATION)
      .then((result) => {
        setAdministraionRouteList(result.resultData);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };
  const manufacturer = () => {
    ApiHelper.getRequest(ApiUrls.GET_MANUFACTUREER)
      .then((result) => {
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
    var emailPattern = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );
    var pattern = new RegExp(/^[0-9\b]+$/);

    if (!fields.immunizationId) {
      formIsValid = false;
      errors["immunizationId"] = ErrorHelper.FIELD_BLANK;
    }
    if (!fields.dateAdministered) {
      formIsValid = false;
      errors["dateAdministered"] = ErrorHelper.FIELD_BLANK;
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
    if (!fields.lotNumber) {
      formIsValid = false;
      errors["lotNumber"] = ErrorHelper.FIELD_BLANK;
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
    if (!fields.rejectedReason) {
      formIsValid = false;
      errors["rejectedReason"] = ErrorHelper.FIELD_BLANK;
    }
    setErrors(errors);
    return formIsValid;
  };

  const saveStaff = () => {
    const data = {
      clientId: selectedClientId,
      immunizationId: fields.immunizationId.id,
      dateAdministered:
        fields.dateAdministered === null
          ? ""
          : moment(fields.dateAdministered).format("YYYY-MM-DD"),
      amountAdministered: fields.amountAdministered,
      manufacturerId: fields.manufacturerId.id,
      dateExpiration:
        fields.dateExpiration === null
          ? ""
          : moment(fields.dateExpiration).format("YYYY-MM-DD"),
      lotNumber: fields.lotNumber,
      administrationSiteId: fields.administrationSiteId.id,
      administrationRouteId: fields.administrationRouteId.id,
      administeredBy: fields.administeredBy.id,
      isRejected: fields.isRejected,
      rejectedReason: fields.rejectedReason,
      comments: fields.comments,
      id: selecetdId,
    };

    setLoading(true);
    ApiHelper.putRequest(ApiUrls.UPDATE_CLIENT_IMMUNIZATION, data)
      .then((result) => {
        setLoading(false);
        NotificationManager.success("Edit immunization successfully");
        navigate(AppRoutes.CLIENT_IMMUNIZATION);
      })
      .catch((error) => {
        setLoading(false);
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
            {loading == true && <Loader />}
            <h4 className="address-title text-grey mt-3 ">
              <span className="f-24">Edit Immunization</span>
            </h4>
            <div className="row mx-0 mt-4">
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
                  error={!fields.dateAdministered && errors.dateAdministered}
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
                  error={!fields.dateExpiration && errors.dateExpiration}
                  required={true}
                />
              </div>
              <div className="mb-3 col-lg-4 col-md-6 col-12">
                <NumericTextBox
                  validityStyles={validationError}
                  value={fields.amountAdministered}
                  onChange={handleChange}
                  name="amountAdministered"
                  label="Amount Administered"
                  error={
                    fields.amountAdministered === "" &&
                    errors.amountAdministered
                  }
                  required={true}
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
                />
              </div>
              <div className="mb-3 col-lg-4 col-md-6 col-12">
                <InputKendoRct
                  validityStyles={validationError}
                  value={fields.lotNumber}
                  onChange={handleChange}
                  name="lotNumber"
                  label="Lot Number"
                  error={fields.lotNumber === "" && errors.lotNumber}
                  required={true}
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
                  required={true}
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
                  Edit
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

export default EditImmunization;
