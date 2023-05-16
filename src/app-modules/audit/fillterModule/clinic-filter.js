import React, { useEffect, useState } from "react";
import DropDownKendoRct from "../../../control-components/drop-down/drop-down";
import { NotificationManager } from "react-notifications";
import ApiHelper from "../../../helper/api-helper";
import ApiUrls from "../../../helper/api-urls";
import moment from "moment";
import ErrorHelper from "../../../helper/error-helper";
import DatePickerKendoRct from "../../../control-components/date-picker/date-picker";
import { Encrption } from "../../encrption";
import { renderErrors } from "src/helper/error-message-helper";

const ClinicFillter = ({
  page,
  pageSize,
  finalValue,
  handleAuditData,
  handleMetaData,
}) => {
  function subtractDays(numOfDays, date = new Date()) {
    const dateCopy = new Date(date.getTime());
    dateCopy.setDate(dateCopy.getDate() - numOfDays);
    return dateCopy;
  }
  const date = new Date();
  const result = subtractDays(7, date);
  const [loading, setLoading] = useState(false);
  const [clinicAuditLogActions, setClinicAuditLogActions] = useState([]);
  const [auditAffectedSections, setAuditAffectedSections] = useState([]);
  const [errors, setErrors] = useState("");
  const [staffError, setStaffError] = useState(false);

  const [fields, setFields] = useState({
    byStaffId: "",
    fromDate: result,
    toDate: date,
    actionEnumId: "",
    affectedClinicId: "",
  });

  useEffect(() => {
    getClinicList();
    getClientAuditLogActions();
    getAuditAffectedSections();
  }, []);

  useEffect(() => {
    handleFilter();
  }, [pageSize, finalValue]);

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setFields({
      ...fields,
      [name]: value,
    });
  };

  const getClinicList = async () => {
    ApiHelper.getRequest(ApiUrls.GET_AUDIT_AFFECTED_SECTIONS)
      .then((result) => {
        let staffAuditActions = result.resultData;
        setAuditAffectedSections(staffAuditActions);
      })
      .catch((error) => {
        renderErrors(error.message);
      });
  };

  const getAuditAffectedSections = async () => {
    ApiHelper.getRequest(ApiUrls.GET_AUDIT_AFFECTED_SECTIONS + Encrption(3))
      .then((result) => {
        let staffAuditActions = result.resultData;
        setAuditAffectedSections(staffAuditActions);
      })
      .catch((error) => {
        renderErrors(error.message);
      });
  };

  const getClientAuditLogActions = async () => {
    ApiHelper.getRequest(ApiUrls.GET_CLIENT_AUDIT_LOG_ACTIONS)
      .then((result) => {
        let clientAuditActions = result.resultData;
        setClinicAuditLogActions(clientAuditActions);
      })
      .catch((error) => {
        renderErrors(error.message);
      });
  };

  const filter = () => {
    setLoading(true);
    const data = {
      pageNumber: finalValue ? finalValue : 1,
      pageSize: pageSize == null ? pageSize : pageSize,
      affectedClinicId: fields.affectedClinicId
        ? fields.affectedClinicId.id
        : 0,
      fromDate: moment(fields.fromDate).format("YYYY-MM-DD"),
      toDate: moment(fields.toDate).format("YYYY-MM-DD"),
      byStaffId: fields.byStaffId ? fields.byStaffId.id : 0,
      actionEnumId: fields.actionEnumId ? fields.actionEnumId.id : 0,
    };
    ApiHelper.postRequest(ApiUrls.GET_CLINIC_AUDITLOG, data)
      .then((result) => {
        setLoading(false);
        let metaData = result.metaData;
        handleMetaData(metaData);
        let clinicAuditActions = result.resultData;
        handleAuditData(clinicAuditActions);
      })
      .catch((error) => {
        renderErrors(error.message);
      });
  };

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;

    if (!fields.fromDate) {
      formIsValid = false;
      errors["fromDate"] = ErrorHelper.FIELD_BLANK;
    }
    if (!fields.toDate) {
      formIsValid = false;
      errors["toDate"] = ErrorHelper.FIELD_BLANK;
    }
    setErrors(errors);
    return formIsValid;
  };

  const handleFilter = () => {
    setStaffError(true);
    if (handleValidation()) {
      filter();
    }
  };

  const handleClearFilter = () => {
    setFields({
      byStaff: "",
      fromDate: "",
      toDate: "",
      action: "",
      affected: "",
      client: "",
    });
  };

  return (
    <>
      {/* {loading && <Loader/>}   */}
      <div className="row">
        <div className="mb-2 col-lg-2 col-md-3 col-12">
          <DatePickerKendoRct
            validityStyles={staffError}
            value={fields.fromDate}
            onChange={handleChange}
            name="fromDate"
            label="From Date"
            placeholder="From Date"
            error={!fields.fromDate && errors.fromDate}
            required={true}
          />
        </div>
        <div className="mb-2 col-lg-2 col-md-3 col-12">
          <DatePickerKendoRct
            validityStyles={staffError}
            value={fields.toDate}
            onChange={handleChange}
            name="toDate"
            label="To Date"
            placeholder="To Date"
            error={!fields.toDate && errors.toDate}
            required={true}
          />
        </div>
        <div className="mb-2 col-lg-2 col-md-3 col-12">
          <DropDownKendoRct
            label="Action"
            onChange={handleChange}
            data={clinicAuditLogActions}
            value={fields.actionEnumId}
            textField="name"
            name="actionEnumId"
          />
        </div>
        <div className="mb-2 col-lg-2 col-md-6 col-12">
          <DropDownKendoRct
            label="Affected Section"
            onChange={handleChange}
            data={auditAffectedSections}
            value={fields.affectedClinicId}
            textField="name"
            name="affectedClinicId"
          />
        </div>
        <div className="mb-2 col-lg-2 col-md-3 col-12 ">
          <DropDownKendoRct
            label="Clinic"
            onChange={handleChange}
            data={[]}
            value={fields.clinic}
            name="clinic"
            dataItemKey="id"
            textField="name"
          />
        </div>

        <div className="col-lg-2 col-md-6 col-12 mb-2 align-items-end d-flex">
          <button
            type="button"
            className="btn blue-primary mx-2"
            onClick={handleFilter}
          >
            Filter
          </button>

          <button
            type="button"
            className="btn grey-secondary mx-2"
            onClick={handleClearFilter}
          >
            Clear
          </button>
        </div>
      </div>
    </>
  );
};

export default ClinicFillter;
