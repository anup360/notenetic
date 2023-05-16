import React, { useState } from "react";
import { Dialog } from "@progress/kendo-react-dialogs";
import DatePickerKendoRct from "../../../../control-components/date-picker/date-picker";
import moment from "moment";
import ApiHelper from "../../../../helper/api-helper";
import ApiUrls from "../../../../helper/api-urls";
import { NotificationManager } from "react-notifications";
import { useSelector } from "react-redux";
import ErrorHelper from "../../../../helper/error-helper";
import { filterBy } from "@progress/kendo-data-query";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Error } from "@progress/kendo-react-labels";
import { renderErrors } from "src/helper/error-message-helper";

const DiagnosisEditModal = ({ onClose, listDiagnosis }) => {
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const [diagnosisListWithdate, setDiagnosisListWithdate] = useState([]);
  const [staffError, setStaffError] = useState(false);
  const [diagnoseLoading, setDiagnoseLoading] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [diagnosisCopy, setDiagnosisCopy] = useState([]);
  const [errors, setErrors] = useState("");

  const [diagnosis, setDiagnosis] = useState({
    diagnosisDate: "",
    filterText: "",
    diagnosisName: "",
  });

  const diagnosislistItem = () => {
    setDiagnoseLoading(true);
    let data = {
      diagnoseDate: moment(diagnosis.diagnosisDate).format("MM/DD/yyyy"),
    };
    ApiHelper.getRequest(
      ApiUrls.GET_DIAGNOSIS +
        "filterText" +
        "=" +
        filterText +
        "&" +
        "diagnoseDate" +
        "=" +
        data.diagnoseDate
    )
      .then((result) => {
        const data = result.resultData;
        setDiagnoseLoading(false);
        setDiagnoseLoading(false);
        setDiagnosisListWithdate(data);
        setDiagnosisCopy(data.slice());
      })
      .catch((error) => {
        renderErrors(error.message);
        setDiagnoseLoading(false);
      });
  };
  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setDiagnosis({
      ...diagnosis,
      [name]: value,
    });
    if (diagnosis.diagnosisDate && diagnosis.filterText.length >= 2) {
      diagnosislistItem();
    }
  };

  const addClientDiagnosis = () => {
    setDiagnoseLoading(true);
    let newDataChange = moment(diagnosis.diagnosisDate).format("YYYY-MM-DD");
    let data = {
      clientId: selectedClientId,
      dateDiagnose: newDataChange,
      diagnosisId: diagnosis.diagnosisName.id,
    };
    ApiHelper.postRequest(ApiUrls.POST_CLIENT_DIAGNOSIS, data)
      .then((result) => {
        NotificationManager.success("Diagnosis added successfully");
        setDiagnoseLoading(false);
        onClose();
        listDiagnosis();
      })
      .catch((error) => {
        renderErrors(error.message);
        setDiagnoseLoading(false);
      });
  };

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;
    if (!diagnosis.diagnosisDate) {
      formIsValid = false;
      errors["diagnosisDate"] = ErrorHelper.DIAGNOSIS_DATE;
    }
    if (!diagnosis.diagnosisName) {
      formIsValid = false;
      errors["diagnosisName"] = ErrorHelper.DIAGNOSIS_NAME;
    }
    setErrors(errors);
    return formIsValid;
  };

  const handleSaveDiagnosis = () => {
    setStaffError(true);
    if (handleValidation()) {
      addClientDiagnosis();
      listDiagnosis();
    }
  };
  const handleCancel = () => {
    onClose();
  };

  const filterData = (filter) => {
    const data = diagnosisListWithdate.slice();
    return filterBy(data, filter);
  };

  const filterChange = (event) => {
    const value = event.filter.value;
    setFilterText(value);
    if (diagnosis.diagnosisDate && filterText.length >= 2) {
      diagnosislistItem();
    }
    setDiagnosisCopy(filterData(event.filter));
  };

  return (
    <Dialog onClose={onClose} title={"Add Diagnosis"} className="small-dailog">
      <div className=" edit-client-popup edit-kendo-dropdown">
        <div className="mb-3 col-lg-12 col-md-12 col-12 px-0">
          <DatePickerKendoRct
            validityStyles={staffError}
            onChange={handleChange}
            placeholder="Diagnosis Date"
            name={"diagnosisDate"}
            label={"Date Diagnosis"}
            value={diagnosis.diagnosisDate}
            required={true}
            error={!diagnosis.diagnosisDate && errors.diagnosisDate}
          />
        </div>
        {/* <div className="mb-3 col-lg-12 col-md-12 col-12 px-0">
          <InputKendoRct
            validityStyles={staffError}
            onChange={handleChange}
            placeholder="Min 3 character required"
            name={"filterText"}
            label={"Diagnosis Search"}
            value={diagnosis.filterText}
            required={true}
            error={diagnosis.filterText === "" && errors.filterText}
          />
        </div> */}
        <div className="col-lg-12 col-md-12 col-12 px-0">
          <DropDownList
            data={diagnosisCopy}
            validityStyles={staffError}
            filterable={true}
            onFilterChange={filterChange}
            textField="dsmWithCodes"
            onChange={handleChange}
            value={diagnosis.diagnosisName}
            label="Diagnosis (Type min 3 chars to search)"
            name="diagnosisName"
            required={true}
            loading={diagnoseLoading}
            placeholder="min 3 character required"
          />
        </div>
        {!diagnosis.diagnosisName && <Error>{errors.diagnosisName}</Error>}
      </div>
      <div className="border-bottom-line"></div>
      <div className="my-3 px-4">
        <button
          className="btn blue-primary text-white"
          onClick={handleSaveDiagnosis}
        >
          Add
        </button>
        <button
          className="btn grey-secondary text-white ml-3"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </Dialog>
  );
};

export default DiagnosisEditModal;
