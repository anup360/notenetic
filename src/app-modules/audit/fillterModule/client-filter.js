import React, { useEffect, useState } from "react";
import DropDownKendoRct from "../../../control-components/drop-down/drop-down";
import { ClientService } from "../../../services/clientService";
import { NotificationManager } from "react-notifications";
import ApiHelper from "../../../helper/api-helper";
import ApiUrls from "../../../helper/api-urls";
import Loader from "../../../control-components/loader/loader";
import ErrorHelper from "../../../helper/error-helper";
import DatePickerKendoRct from "../../../control-components/date-picker/date-picker";
import { Encrption } from "../../encrption";
import moment from "moment";
import { renderErrors } from "src/helper/error-message-helper";

const ClientFillter = ({
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

  const [staffError, setStaffError] = useState(false);
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clientAuditLogActions, setClientAuditLogActions] = useState([]);
  const [patientList, setPatientList] = useState([]);
  const [auditAffectedSections, setAuditAffectedSections] = useState([]);
  const [errors, setErrors] = useState("");

  const [fields, setFields] = useState({
    fromDate: result,
    toDate: date,
    action: "",
    affected: "",
    client: "",
    bystaff: "",
  });

  useEffect(() => {
    getStaffList();
    getClientAuditLogActions();
    getPatientList();
    getAuditAffectedSections();
    handleFilter();
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

  const getStaffList = async () => {
    setLoading(true);
    await ClientService.getStaffDDLByClinicId()
      .then((result) => {
        setLoading(false);
        let list = result.resultData;
        setStaffData(list);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error)
        
      });
  };

  const getAuditAffectedSections = async () => {
    ApiHelper.getRequest(ApiUrls.GET_AUDIT_AFFECTED_SECTIONS + Encrption(1))
      .then((result) => {
        let staffAuditActions = result.resultData;
        setAuditAffectedSections(staffAuditActions);
      })
      .catch((error) => {
        renderErrors(error.message)

      });
  };

  const getClientAuditLogActions = async () => {
    ApiHelper.getRequest(ApiUrls.GET_CLIENT_AUDIT_LOG_ACTIONS)
      .then((result) => {
        let clientAuditActions = result.resultData;
        setClientAuditLogActions(clientAuditActions);
      })
      .catch((error) => {
        renderErrors(error.message)        
      });
  };

  const getPatientList = () => {
    setLoading(true);
    ApiHelper.getRequest(ApiUrls.GET_CLIENT_DDL_BY_CLINIC_ID)
      .then((result) => {
        setLoading(false);
        const list = result.resultData.map((r) => {
          return { id: r.clientId, name: r.clientName };
        });
        setPatientList(list);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message)
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

  const filter = () => {
    // setLoading(true);
    const data = {
      pageNumber: finalValue ? finalValue : 1,
      pageSize: pageSize == null ? pageSize : pageSize,
      affectedClientId: fields.client ? fields.client.id : null,
      fromDate: moment(fields.fromDate).format("YYYY-MM-DD"),
      toDate: moment(fields.toDate).format("YYYY-MM-DD"),
       byStaffId: fields.bystaff ? fields.bystaff.id : null,
      actionEnumId: fields.action ? fields.action.id : null,
      affectedSection: fields.affected ? fields?.affected?.id :null
    };
    ApiHelper.postRequest(ApiUrls.GET_CLIENT_AUDIT_LOG, data)
      .then((result) => {
        setLoading(false);
        let metaData = result.metaData;
        handleMetaData(metaData);
        let staffAuditActions = result.resultData;
        handleAuditData(staffAuditActions);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message)
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
      ...fields,
      fromDate: result,
      toDate: date,
      action: "",
      affected: "",
      client: "",
      bystaff :""
    });
    filter();
  };


  return (
    <>
      {loading && <Loader />}
      <div className="row">
        <div className="mb-2 col-lg-2 col-md-3 col-12">
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
        <div className="mb-2 col-lg-2 col-md-3 col-12">
          <DatePickerKendoRct
            validityStyles={staffError}
            value={fields.toDate ? fields.toDate : null}
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
            validityStyles={staffError}
            label="Action"
            onChange={handleChange}
            data={clientAuditLogActions}
            value={fields.action}
            textField="name"
            name="action"
          />
        </div>
        <div className="mb-2 col-lg-2 col-md-3 col-12">
          <DropDownKendoRct
            validityStyles={staffError}
            label="Affected Section"
            onChange={handleChange}
            data={auditAffectedSections}
            value={fields.affected}
            textField="name"
            name="affected"
          />
        </div>
        <div className="mb-2 col-lg-2 col-md-3 col-12 ">
          <DropDownKendoRct
            validityStyles={staffError}
            label="Client"
            onChange={handleChange}
            data={patientList}
            value={fields.client}
            name="client"
            dataItemKey="id"
            textField="name"
          />
        </div>
        <div className="mb-2 col-lg-2 col-md-3 col-12 ">
          <DropDownKendoRct
            validityStyles={staffError}
            label="Staff"
            onChange={handleChange}
            data={staffData}
            value={fields.bystaff}
            name="bystaff"
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

export default ClientFillter;
