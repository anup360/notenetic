import React, { useEffect, useState } from "react";
import { Dialog } from "@progress/kendo-react-dialogs";
import DatePickerKendoRct from "../../../../control-components/date-picker/date-picker";
import moment from "moment";
import ApiHelper from "../../../../helper/api-helper";
import ApiUrls from "../../../../helper/api-urls";
import { NotificationManager } from "react-notifications";
import { useSelector, useDispatch } from "react-redux";
import ErrorHelper from "../../../../helper/error-helper";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { filterBy } from "@progress/kendo-data-query";
import Loader from "../../../../control-components/loader/loader";
import InputKendoRct from "../../../../control-components/input/input";
import { renderErrors } from "src/helper/error-message-helper";

const DiagnosisEditModal = ({
  onClose,
  stateData,
  diagnosisId,
  getDiagnosisList,
}) => {
  const clientID = useSelector((state) => state.selectedClientId);
  const [diagnosisListWithdate, setDiagnosisListWithdate] = useState([]);
  const [staffError, setStaffError] = useState(false);
  const [errors, setErrors] = useState("");
  const [diagnoseLoading, setDiagnoseLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState({
    diagnosisDate: "",
    filterText: "",
    diagnosisName: "",
  });
  const [diagnosisCopy, setDiagnosisCopy] = useState([]);

  const listDiagnosis = () => {
    setDiagnoseLoading(true);
    ApiHelper.getRequest(
      ApiUrls.GET_CLIENT_DIAGNOSIS_BY_ID +
        "?clientID=" +
        clientID +
        "&diagnosisId=" +
        diagnosisId
    )
      .then((result) => {
        const data = result.resultData;
        setDiagnoseLoading(false);
        const diagnosisInfo = {
          id: data.dsmId,
          dsmWithCodes: `${data.icd10}-${data.diagnoseName}`,
        };
        setDiagnosis({
          diagnosisDate: new Date(data.dateDiagnose),
          diagnosisName: diagnosisInfo,
        });
        // getDiagnoseByID(data.dateDiagnose);
      })
      .catch((error) => {
        setDiagnoseLoading(false);
        renderErrors(error.message);
      });
  };

  useEffect(() => {
    listDiagnosis();
  }, []);

  const getDiagnoseByID = (value) => {
    setDiagnoseLoading(true);
    let data = {
      diagnoseDate: moment(diagnosis.diagnosisDate).format("MM/DD/yyyy"),
    };
    ApiHelper.getRequest(
      ApiUrls.GET_DIAGNOSIS +
        "filterText" +
        "=" +
        diagnosis.filterText +
        "&" +
        "diagnoseDate" +
        "=" +
        data.diagnoseDate
    )
      .then((result) => {
        const data = result.resultData;
        setDiagnoseLoading(false);
        const diagnosisInfo = {
          id: data.id,
          dsmWithCodes: `${data.icd10}-${data.diagnoseName}`,
        };
        if (data.length === 0) {
          setDiagnosis({
            ...diagnosis,
            // diagnosisDate: data.diagnoseDate,
            filterText: data.filterText,
            diagnosisName: data.length === 0 ? "" : diagnosisInfo.dsmWithCodes,
          });
        }

        setDiagnosisListWithdate(data);
        setDiagnosisCopy(data);
      })
      .catch((error) => {
        renderErrors(error.message);
        setDiagnoseLoading(false);
      });
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setDiagnosis({
      ...diagnosis,
      [name]: value,
    });
    if (diagnosis.diagnosisDate && diagnosis.filterText.length >= 3) {
      getDiagnoseByID();
    }
  };

  const UpdateClientDiagnosis = () => {
    let data = {
      id: diagnosisId,
      dateDiagnose: moment(diagnosis.diagnosisDate).format("YYYY-MM-DD"),
      diagnosisId: diagnosis.diagnosisName.id,
    };
    ApiHelper.putRequest(ApiUrls.UPDATE_CLIENT_DIAGNOSIS, data)
      .then((result) => {
        NotificationManager.success("Diagnosis updated successfully");
        onClose();
        getDiagnosisList();
      })
      .catch((error) => {
        renderErrors(error.message);
      });
  };

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;
    if (!diagnosis.diagnosisDate) {
      formIsValid = false;
      errors["diagnosisDate"] = ErrorHelper.DIAGNOSIS_UPDATE_DATE;
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
      UpdateClientDiagnosis();
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
    setDiagnosisCopy(filterData(event.filter));
  };

  return (
    <Dialog
      onClose={onClose}
      title={"Update Diagnosis"}
      className="small-dailog"
    >
      <div className=" edit-client-popup ">
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
        <div className="mb-3 col-lg-12 col-md-12 col-12 px-0">
          <InputKendoRct
            validityStyles={staffError}
            onChange={handleChange}
            placeholder="Min 4 character required"
            name={"filterText"}
            label={"Diagnosis Search"}
            value={diagnosis.filterText}
            required={true}
            error={diagnosis.filterText === "" && errors.filterText}
          />
        </div>
        <div className=" col-md-12 col-12 px-md-0">
          <DropDownList
            validityStyles={staffError}
            data={diagnosisCopy}
            filterable={true}
            onFilterChange={filterChange}
            textField="dsmWithCodes"
            onChange={handleChange}
            value={diagnosis.diagnosisName}
            name="diagnosisName"
            label="Diagnosis"
            dataItemKey={"id"}
            required={true}
            loading={diagnoseLoading}
          />
          {diagnoseLoading === true && <Loader />}
        </div>
      </div>
      <div className="border-bottom-line"></div>
      <div className="d-flex my-4 mx-3">
        <button
          className="btn blue-primary text-white"
          onClick={handleSaveDiagnosis}
        >
          Update
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
