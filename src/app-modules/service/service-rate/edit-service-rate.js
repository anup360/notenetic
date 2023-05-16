import React, { useEffect, useState } from "react";
import ApiUrls from "../../../helper/api-urls";
import DatePickerKendoRct from "../../../control-components/date-picker/date-picker";

import ErrorHelper from "../../../helper/error-helper";
import { NotificationManager } from "react-notifications";
import ApiHelper from "../../../helper/api-helper";
import InputKendoRct from "../../../control-components/input/input";
import Loader from "../../../control-components/loader/loader";
import { Dialog } from "@progress/kendo-react-dialogs";
import { Encrption } from "../../encrption";
import ValidationHelper from "../../../helper/validation-helper";
import { renderErrors } from "src/helper/error-message-helper";

const EditServiceRate = ({
  onClose,
  selectedServiceRate,
  selectedServiceId,
}) => {
  const vHelper = ValidationHelper();
  let [fields, setFields] = useState({
    serviceRate: "",
    dateEffective: "",
    dateEnd: "",
    billingUnitId: "",
  });
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [ServiceRateInfo, setServiceRateInfo] = React.useState(false);
  const [settingError, setSettingError] = useState(false);

  useEffect(() => {
    if (selectedServiceRate) {
      getserviceRateDetail();
    }
  }, []);

  const getserviceRateDetail = () => {
    let serviceId = selectedServiceRate.id;
    setLoading(true);
    ApiHelper.getRequest(ApiUrls.GET_SERVICERATE_BY_ID + Encrption(serviceId))
      .then((result) => {
        let serviceDetail = result.resultData;
        setFields({
          serviceRate: serviceDetail && serviceDetail.serviceRate,
          dateEffective: serviceDetail && new Date(serviceDetail.dateEffective),
          dateEnd:
            serviceDetail.dateEnd == null
              ? ""
              : new Date(serviceDetail.dateEnd),
        });
        setServiceRateInfo(serviceDetail);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const updateServiceRate = () => {
    setLoading(true);
    var data = {
      id: selectedServiceRate.id,
      serviceId: selectedServiceId,
      serviceRate: fields.serviceRate,
      dateEffective: fields.dateEffective,
      dateEnd: fields.dateEnd,
    };
    ApiHelper.putRequest(ApiUrls.UPDATE_SERVICE_RATES, data)
      .then((result) => {
        setLoading(false);
        NotificationManager.success("Service rates update successfully");
        onClose({ billEdited: true });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const addServiceRate = () => {
    setLoading(true);
    var data = {
      serviceId: selectedServiceId,
      serviceRate: fields.serviceRate,
      dateEffective: fields.dateEffective,
      dateEnd: fields.dateEnd,
    };
    ApiHelper.postRequest(ApiUrls.ADD_SERVICE_RATES, data)
      .then((result) => {
        setLoading(false);
        NotificationManager.success("Service rates addded successfully");
        onClose({ billEdited: true });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;

    if (!fields.serviceRate) {
      formIsValid = false;
      errors["serviceRate"] = ErrorHelper.FIELD_BLANK;
    }

    if (!fields.dateEffective) {
      formIsValid = false;
      errors["dateEffective"] = ErrorHelper.FIELD_BLANK;
    }
    else if(fields.dateEffective && fields.dateEnd){
      let error=vHelper.startDateLessThanEndDateValidator(fields.dateEffective, fields.dateEnd, "dateEffective", "dateEnd")
      if (error && error.length > 0) {
        errors["dateEffective"] = error;
        formIsValid = false;
    }
    }
    setErrors(errors);
    return formIsValid;
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFields({
      ...fields,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    setSettingError(true);
    if (handleValidation()) {
      if (selectedServiceRate) {
        updateServiceRate();
      } else {
        addServiceRate();
      }
    }
  };
  return (
    <div>
      <Dialog
        onClose={onClose}
        title={"Edit Service Rate"}
        className="dialog-modal"
      >
        <div className="Service-accept edit-Service-popup">
          <div className="row py-3">
            <div className="mb-2 col-lg-4 col-md-6 col-12">
              <InputKendoRct
                value={fields.serviceRate}
                onChange={handleChange}
                name="serviceRate"
                label="Service Rate"
                error={fields.serviceRate == "" && errors.serviceRate}
                validityStyles={settingError}
                required={true}
                type="number"
                placeholder={"Service Rate"}
              />
            </div>
            <div className="mb-2 col-lg-4 col-md-6 col-12">
              <DatePickerKendoRct
                onChange={handleChange}
                format={"MM/dd/YYYY"}
                placeholder="Date Effective"
                value={fields.dateEffective}
                name={"dateEffective"}
                fillMode={"solid"}
                size={"medium"}
                title={"Date Effective"}
                label={"Date Effective"}
                weekNumber={false}
                required={true}
                validityStyles={settingError}
                error={ errors.dateEffective}
              />
            </div>
            <div className="mb-2 col-lg-4 col-md-6 col-12">
              <DatePickerKendoRct
                onChange={handleChange}
                format={"MM/dd/YYYY"}
                placeholder="End Date"
                value={fields.dateEnd}
                name={"dateEnd"}
                fillMode={"solid"}
                size={"medium"}
                title={"End Date"}
                weekNumber={false}
                label={"End Date"}
              />
            </div>
          </div>

          {loading == true && <Loader />}
          <div className="border-bottom-line"></div>
          <div className="row my-3">
            <div className="d-flex">
              <div>
                <button
                  className="btn blue-primary text-white"
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
      </Dialog>
    </div>
  );
};
export default EditServiceRate;
