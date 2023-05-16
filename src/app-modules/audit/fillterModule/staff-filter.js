import React, { useEffect, useState } from "react";
import DropDownKendoRct from "../../../control-components/drop-down/drop-down";
import { ClientService } from "../../../services/clientService";
import { NotificationManager } from "react-notifications";
import ApiHelper from "../../../helper/api-helper";
import ApiUrls from "../../../helper/api-urls";
import Loader from "../../../control-components/loader/loader";
import moment from "moment";
import ErrorHelper from "../../../helper/error-helper";
import DatePickerKendoRct from "../../../control-components/date-picker/date-picker";
import { Encrption } from "../../encrption";
import { renderErrors } from "src/helper/error-message-helper";

const StaffFillter = ({
  page,
  pageSize,
  finalValue,
  handleAuditData,
  handleMetaData,
}) => {
  const [staffData, setStaffData] = useState([]);
  const [staffError, setStaffError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [staffAuditAction, setStaffAuditAction] = useState([]);
  const [auditAffectedSections, setAuditAffectedSections] = useState([]);
  const [errors, setErrors] = useState("");

  function subtractDays(numOfDays, date = new Date()) {
    const dateCopy = new Date(date.getTime());
    dateCopy.setDate(dateCopy.getDate() - numOfDays);
    return dateCopy;
  }
  const date = new Date();
  const result = subtractDays(7, date);
  const [fields, setFields] = useState({
    byStaffId: "",
    fromDate: result,
    toDate: date,
    actionEnumId: "",
    affectedSectionId: "",
    affectedStaffId: "",
  });

  useEffect(() => {
    getStaffList();
    getStaffAuditLogActions();
    getAuditAffectedSections();
  }, []);

  useEffect(() => {
    handleFilter();
  }, [pageSize, finalValue]);

  const getStaffList = async () => {
    setLoading(true);
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

  const getStaffAuditLogActions = async () => {
    setLoading(true);
    ApiHelper.getRequest(ApiUrls.GET_STAFF_AUDIT_LOG_ACTIONS)
      .then((result) => {
        setLoading(false);
        let staffAuditActions = result.resultData;
        setStaffAuditAction(staffAuditActions);
      })
      .catch((error) => {
        renderErrors(error.message);
      });
  };

  const getAuditAffectedSections = async () => {
    setLoading(true);
    ApiHelper.getRequest(ApiUrls.GET_AUDIT_AFFECTED_SECTIONS + Encrption(2))
      .then((result) => {
        setLoading(false);
        let staffAuditActions = result.resultData;
        setAuditAffectedSections(staffAuditActions);
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
      fromDate: moment(fields.fromDate).format("YYYY-MM-DD"),
      toDate: moment(fields.toDate).format("YYYY-MM-DD"),
      byStaffId: fields.byStaffId ? fields.byStaffId.id : null,
      affectedStaffId: fields.affectedStaffId
        ? fields.affectedStaffId.id
        : null,
      actionEnumId: fields.actionEnumId ? fields.actionEnumId.id : null,
      affectedSectionId: fields.affectedSectionId
        ? fields.affectedSectionId.id
        : null,
    };
    ApiHelper.postRequest(ApiUrls.GET_STAFF_AUDIT_LOG, data)
      .then((result) => {
        setLoading(false);
        let metaData = result.metaData;
        handleMetaData(metaData);
        let staffAuditActions = result.resultData;
        handleAuditData(staffAuditActions);
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

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setFields({
      ...fields,
      [name]: value,
    });
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
      {loading && <Loader />}
      <div className="row">
        <div className="mb-2 col-lg-2 col-md-12 col-12">
          <DatePickerKendoRct
            validityStyles={staffError}
            value={fields.fromDate ? fields.fromDate : null}
            onChange={handleChange}
            name="fromDate"
            label="From Date"
            placeholder="From Date"
            error={!fields.fromDate && errors.fromDate}
            required={true}
          />
        </div>
        <div className="mb-2 col-lg-2 col-md-6 col-12">
          <DatePickerKendoRct
            validityStyles={staffError}
            value={fields.toDate ? fields.toDate : null}
            onChange={handleChange}
            name="toDate"
            placeholder="To Date"
            label="To Date"
            error={!fields.toDate && errors.toDate}
            required={true}
          />
        </div>
        <div className="mb-2 col-lg-2 col-md-6 col-12">
          <DropDownKendoRct
            label="Action"
            onChange={handleChange}
            data={staffAuditAction}
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
            value={fields.affectedSectionId}
            textField="name"
            name="affectedSectionId"
          />
        </div>
        <div className="mb-2 col-lg-2 col-md-6 col-12">
          <DropDownKendoRct
            label="Affected Staff"
            onChange={handleChange}
            data={staffData}
            value={fields.byStaffId}
            textField="name"
            suggest={true}
            name="byStaffId"
          />
        </div>
        <div className="mb-2 col-lg-2 col-md-6 col-12">
          <DropDownKendoRct
            label="Affected By"
            onChange={handleChange}
            data={staffData}
            value={fields.affectedStaffId}
            textField="name"
            suggest={true}
            name="affectedStaffId"
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

export default StaffFillter;
