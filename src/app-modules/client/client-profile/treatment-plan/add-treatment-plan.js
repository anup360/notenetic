import React, { useEffect, useState } from "react";
import DatePickerKendoRct from "../../../../control-components/date-picker/date-picker";
import ErrorHelper from "../../../../helper/error-helper";
import { NotificationManager } from "react-notifications";
import InputKendoRct from "../../../../control-components/input/input";
import Loader from "../../../../control-components/loader/loader";
import { useSelector } from "react-redux";
import { Dialog } from "@progress/kendo-react-dialogs";
import { ClientService } from "../../../../services/clientService";
import ValidationHelper from "../../../../helper/validation-helper";
import apiHelper from "src/helper/api-helper";
import API_URLS from "src/helper/api-urls";
import { displayDate, showError } from "src/util/utility";
import { filterBy } from "@progress/kendo-data-query";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Switch, TextArea } from "@progress/kendo-react-inputs";
import { Error, Label } from "@progress/kendo-react-labels";
import { isEmpty } from "lodash";
import { TimePicker } from "@progress/kendo-react-dateinputs";
import { renderErrors } from "src/helper/error-message-helper";

const AddTreatmentPlan = ({ onClose, selectedPlan }) => {
  //   const vHelper = ValidationHelper();
  const [fields, setFields] = useState({
    planName: "",
    transitionDischargePlan: "",
    planDate: "",
    startTime: null,
    endTime: null,
    endDate: "",
    status: true,
    selectedService: {},
    planEndDate: "",
  });
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const [settingError, setSettingError] = useState(false);
  const [treatmentStatus, setTreatmentStatus] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const staffId = useSelector((state) => state.loggedIn?.staffId);
  const [filter, setFilter] = useState({});

  useEffect(() => {
    fetchServiceList();
    getTreatmentPlanStatus();

    if (selectedPlan) {
      getPlansById(selectedPlan);
    }
  }, []);

  const getPlansById = async (selectedPlan) => {
    setFields({
      ...fields,
      planName: selectedPlan?.planName,
      transitionDischargePlan: selectedPlan?.transitionDischargePlan,
      planDate:
        selectedPlan?.planDate === null
          ? null
          : new Date(selectedPlan?.planDate),
      startTime:
        selectedPlan?.startTime === null
          ? null
          : new Date(
              displayDate(new Date(), "MM/DD/yyyy") +
                " " +
                selectedPlan?.startTime
            ),
      endTime:
        selectedPlan?.endTime === null
          ? null
          : new Date(
              displayDate(new Date(), "MM/DD/yyyy") +
                " " +
                selectedPlan?.endTime
            ),
      selectedService: {
        id: selectedPlan?.serviceId,
        name: selectedPlan?.serviceName,
      },
      status: selectedPlan?.activeParticipant,
      planEndDate:
        selectedPlan?.planEndDate === null
          ? null
          : new Date(selectedPlan?.planEndDate),
    });
  };

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;

    if (!fields?.planName || fields?.planName.trim().length === 0)
      errors["planName"] = ErrorHelper.FIELD_BLANK;

    if (!fields?.planDate) errors["planDate"] = ErrorHelper.FIELD_BLANK;
    // if (!fields?.transitionDischargePlan)
    //   errors["transitionDischargePlan"] = ErrorHelper.FIELD_BLANK;
    if (!fields?.selectedService?.id)
      errors["serviceId"] = ErrorHelper.FIELD_BLANK;

    formIsValid = isEmpty(errors);

    setErrors(errors);
    return formIsValid;
  };

  const handleChange = (e) => {
    const name = e.target.name;
    if (name === "transitionDischargePlan") {
      const value = e.value;
      setFields({
        ...fields,
        [name]: value,
      });
    } else {
      const value = e.target.value;
      setFields({
        ...fields,
        [name]: value,
      });
    }
  };

  const handleSubmitPlan = (event) => {
    setSettingError(true);
    if (handleValidation()) {
      if (selectedPlan) {
        updateTreatmentPlan();
      } else {
        saveTreatmentPlan();
      }
    }
  };

  const getTreatmentPlanStatus = async () => {
    await ClientService.getTreatmentPlanStatus()
      .then((result) => {
        let treatmentStatusList = result.resultData;
        setTreatmentStatus(treatmentStatusList);
      })
      .catch((error) => {
        renderErrors(error);
      });
  };

  const saveTreatmentPlan = async () => {
    setLoading(true);
    await ClientService.saveTreatmentPlan(fields, selectedClientId)
      .then((result) => {
        setLoading(false);
        NotificationManager.success("Treatment plan added successfully");
        onClose({ added: true });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error);
      });
  };

  const updateTreatmentPlan = async () => {
    setLoading(true);
    await ClientService.updateTreatmentPlan(fields, selectedPlan)
      .then((result) => {
        setLoading(false);
        NotificationManager.success("Treatment plan updated successfully");
        onClose({ edited: true });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error);
      });
  };

  function fetchServiceList() {
    setLoading({ serviceList: true });
    apiHelper
      .queryGetRequestWithEncryption(
        API_URLS.GET_DOCUMENT_STAFF_SERVICES,
        staffId
      )
      .then((result) => {
        const list = result.resultData.map((x) => {
          return { id: x.serviceId, name: x.fullName };
        });
        setServiceList(list);
      })
      .catch((err) => {
        showError(err, "Service List");
      })
      .finally(() => {
        setLoading({ serviceList: false });
      });
  }

  function onFilterChange(event) {
    const data = serviceList.slice();
    return filterBy(data, event.filter);
  }

  function onServiceListChange(event) {
    setFields({ ...fields, selectedService: event?.value });
  }
  return (
    <Dialog
      onClose={onClose}
      title={selectedPlan ? "Edit Treatment Plan" : "Add Treatment Plan"}
      className="small-dailog treat_plan_width"
    >
      <div className="edit-client-popup  small-edit-client">
        <div className="mb-2 col-lg-12 col-md-12 col-12">
          <InputKendoRct
            value={fields?.planName}
            onChange={handleChange}
            name="planName"
            label=" Plan Name"
            error={errors?.planName}
            validityStyles={!!errors?.planName}
            required={true}
          />
        </div>
        <div className="mb-2 col-lg-12 col-md-12 col-12">
          <DatePickerKendoRct
            onChange={handleChange}
            format={"MM/dd/YYYY"}
            placeholder=""
            value={fields?.planDate}
            name={"planDate"}
            fillMode={"solid"}
            size={"medium"}
            title={"Plan Date"}
            label={"Plan Date"}
            weekNumber={false}
            error={errors.planDate}
            required={true}
            validityStyles={!!errors.planDate}
          />
        </div>
        <div className="mb-2 col-lg-12 col-md-12 col-12">
          <TimePicker
            name={"startTime"}
            fillMode={"solid"}
            size={"medium"}
            title={"Start Time"}
            label={"Start Time"}
            value={fields?.startTime}
            onChange={handleChange}
          />
        </div>
        {selectedPlan ? (
          <div className="mb-2 col-lg-12 col-md-12 col-12">
            <DatePickerKendoRct
              onChange={handleChange}
              format={"MM/dd/YYYY"}
              placeholder=""
              value={fields?.planEndDate}
              name={"planEndDate"}
              fillMode={"solid"}
              size={"medium"}
              title={"Plan End Date"}
              label={"Plan End Date"}
              weekNumber={false}
            />
          </div>
        ) : (
          ""
        )}

        <div className="mb-2 col-lg-12 col-md-12 col-12">
          <TimePicker
            name={"endTime"}
            fillMode={"solid"}
            size={"medium"}
            title={"End Time"}
            label={"End Time"}
            value={fields?.endTime}
            onChange={handleChange}
          />
        </div>

        <div className="mb-2 col-lg-12 col-md-12 col-12">
          <DropDownList
            filterable={true}
            data={filterBy(serviceList, filter.serviceList)}
            onFilterChange={onFilterChange}
            loading={loading?.serviceList}
            textField="name"
            label="Service"
            name="service"
            value={fields?.selectedService}
            onChange={onServiceListChange}
            autoClose={true}
            error={errors?.serviceId}
            required={true}
            validityStyles={!!errors?.serviceId}
          />
          {settingError && errors?.serviceId && (
            <Error id={"service"}>{errors?.serviceId}</Error>
          )}
        </div>
        <div className="mb-2 mt-2 col-lg-12 col-md-12 col-12">
          <Label editorId="fields_status">Participant active </Label>
          &nbsp;&nbsp;
          <Switch
            id="fields_status"
            onLabel={"Yes"}
            offLabel={"No"}
            name="status"
            onChange={handleChange}
            checked={fields.status}
          />
        </div>
        <div className="mb-2 col-lg-12 col-md-12 col-12">
          <Label
            editorId="transitionDischargePlan"
            // editorValid={!!!errors.transitionDischargePlan}
          >
            Transition Discharge Plan
          </Label>
          <TextArea
            // error={errors.transitionDischargePlan}
            validityStyles={!!errors.transitionDischargePlan}
            required={true}
            value={fields.transitionDischargePlan}
            onChange={handleChange}
            name="transitionDischargePlan"
            id="transitionDischargePlan"
            label="Transition Discharge Plan"
          />
          {!!errors?.transitionDischargePlan && (
            <Error id={"transitionDischargePlan_"}>
              {errors?.transitionDischargePlan}
            </Error>
          )}
        </div>
      </div>
      {loading === true && <Loader />}
      <div className="border-bottom-line"></div>
      <div className="d-flex my-3 px-4">
        <div>
          <button
            onClick={handleSubmitPlan}
            className="btn blue-primary text-white  mx-2"
          >
            Submit
          </button>
        </div>
        <div>
          <button className="btn grey-secondary text-white" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </Dialog>
  );
};
export default AddTreatmentPlan;
