import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ApiUrls from "../../../../helper/api-urls";
import InputKendoRct from "../../../../control-components/input/input";
import DatePickerKendoRct from "../../../../control-components/date-picker/date-picker";
import { NotificationManager } from "react-notifications";
import ApiHelper from "../../../../helper/api-helper";
import { useLocation } from "react-router-dom";
import DropDownKendoRct from "../../../../control-components/drop-down/drop-down";
import { useSelector, useDispatch } from "react-redux";
import { renderErrors } from "src/helper/error-message-helper";

const AddInsurance = ({
  fields,
  setFields,
  handleChange,
  settingError,
  errors = { errors },
}) => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [insuranceData, setInsuranceData] = useState([]);
  const [insuranceLoading, setInsuranceLoading] = useState(false);

  const clinicId = useSelector((state) => state.loggedIn.clinicId);

  useEffect(() => {
    getInsuranceTypes();
    if (location.state !== null) {
      let insuranceObj = location.state.insuranceObj;
      getInsuranceDetail(insuranceObj);
    }
  }, []);

  const getInsuranceTypes = () => {
    setInsuranceLoading(true);
    ApiHelper.getRequest(ApiUrls.GET_INSURANCE_TYPE + clinicId)
      .then((result) => {
        let insuranceList = result.resultData;
        setInsuranceLoading(false);
        setInsuranceData(insuranceList);
      })
      .catch((error) => {
        setInsuranceLoading(false);
        renderErrors(error.message);
      });
  };

  const getInsuranceDetail = (insuranceObj) => {
    setLoading(true);
    ApiHelper.getRequest(ApiUrls.GET_INSURANCE_BY_ID + insuranceObj.id, "")
      .then((result) => {
        let insuranceDetail = result.resultData;
        setLoading(false);
        setFields({
          ...fields,
          startDate: insuranceDetail.dateStart,
          endDate: insuranceDetail.dateEnd,
          policyNumber: insuranceDetail.policyNumber,
          insuranceType: insuranceDetail.insuranceTypeId,
        });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  return (
    <div>
      <div className="row">
        <div className="mb-3 col-lg-4 col-md-6 col-12">
          <DropDownKendoRct
            label="Insurance Type"
            onChange={handleChange}
            data={insuranceData}
            validityStyles={settingError}
            value={fields.insuranceType}
            textField="insuranceName"
            suggest={true}
            name="insuranceType"
            required={true}
            placeholder="Insurance Type"
            error={!fields.insuranceType && errors.insuranceType}
          />
        </div>
        <div className="mb-3 col-lg-4 col-md-6 col-12">
          <InputKendoRct
            validityStyles={settingError}
            value={fields.policyNumber}
            onChange={handleChange}
            name="policyNumber"
            label="Policy#"
            error={fields.policyNumber == "" && errors.policyNumber}
            placeholder="Policy Number"
            required={true}
          />
        </div>

        <div className="mb-3 col-lg-4 col-md-6 col-12">
          <DatePickerKendoRct
            onChange={handleChange}
            format={"MM/dd/YYYY"}
            name={"startDate"}
            label={"Start Date"}
            value={fields.startDate}
            title={"Start Date"}
            validityStyles={settingError}
            required={true}
            error={!fields.startDate && errors.startDate}
            placeholder={"Start Date"}
          />
        </div>
        <div className="mb-3 col-lg-4 col-md-6 col-12">
          <DatePickerKendoRct
            onChange={handleChange}
            format={"MM/dd/YYYY"}
            name={"endDate"}
            label={"End Date"}
            value={fields.endDate}
            title={"End Date"}
            error={!fields.endDate && errors.endDate}
            placeholder={"End Date"}
          />
        </div>
      </div>
    </div>
  );
};
export default AddInsurance;
