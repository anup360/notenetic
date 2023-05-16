import React from "react";
import { useEffect, useState } from "react";
import ApiUrls from "../../../../helper/api-urls";
import ApiHelper from "../../../../helper/api-helper";
import DatePickerKendoRct from "../../../../control-components/date-picker/date-picker";
import TextAreaKendoRct from "../../../../control-components/kendo-text-area/kendo-text-area";
import { NotificationManager } from "react-notifications";
import { useNavigate } from "react-router";
import AppRoutes from "../../../../helper/app-routes";
import { Dialog } from "@progress/kendo-react-dialogs";
import Loader from "../../../../control-components/loader/loader";
import { TaskService } from "../../../../services/taskService";
import ErrorHelper from "../../../../helper/error-helper";
import { ClientService } from "../../../../services/clientService";
import DropDownKendoRct from "../../../../control-components/drop-down/drop-down";
import { useSelector } from "react-redux";
import TimePickerKendoRct from "../../../../control-components/time-picker/time-picker";
import { renderErrors } from "src/helper/error-message-helper";

const AddContactNotes = ({ onClose, orgStaffList, selectedTaskId }) => {
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const navigate = useNavigate();
  const [toStaffList, setToStaffList] = useState({
    value: [],
    allSelected: true,
  });
  //   const selectAllOption = { id: 0, name: "Select All" };
  const [staffList, setStaffList] = useState([]);
  //   const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [taskInfo, setTaskInfo] = React.useState();
  const [errors, setErrors] = useState("");
  const [settingError, setSettingError] = useState(false);
  const [relationData, setRelationData] = useState([]);
  const [communicationMethod, setCommunicationMethod] = useState([]);
  const [fields, setFields] = useState({
    contactedByStaffId: "",
    newRelations: "",
    dateOfContact: "",
    timeOfContact: "",
    methodOfContact: "",
    contactNotes: "",
  });

  useEffect(() => {
    getCommunicationMethod();
    getRelations();
    // getStaffList();
    if (selectedTaskId) {
      getTaskDetail();
    }
  }, [orgStaffList]);

  const getRelations = async () => {
    await ClientService.getRelations()
      .then((result) => {
        let relationList = result.resultData;
        setRelationData(relationList);
      })
      .catch((error) => {
        renderErrors(error.message);
      });
  };

  const getCommunicationMethod = () => {
    ApiHelper.getRequest(ApiUrls.GET_COMMUNICATION_METHODS)
      .then((result) => {
        setCommunicationMethod(result.resultData);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const getTaskDetail = async () => {
    setLoading(true);
    await TaskService.getTaskDetail(selectedTaskId)
      .then((result) => {
        let data = result.resultData;
        setTaskInfo(result.resultData);
        setFields({
          ...fields,
          taskDescription: data.taskDescription,
          dueDate: new Date(data.dueDate),
          isHighPriorityTask: data.isHighPriorityTask,
        });
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const updateTask = async () => {
    setLoading(true);
    await TaskService.updateTask(fields, selectedTaskId)
      .then((result) => {
        setLoading(false);
        NotificationManager.success("Task updated successfully");
        onClose({ edited: true });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error);
      });
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFields({
      ...fields,
      [name]: value,
    });
  };

  const handleTextChange = (e) => {
    const name = e.target.name;
    const value = e.value;
    setFields({
      ...fields,
      [name]: value,
    });
  };

  const saveTask = async () => {
    setLoading(true);
    const data = {
      clientId: selectedClientId,
      contactedByStaffId: fields.contactedByStaffId.id,
      relationId: fields.newRelations.id,
      dateOfContact: fields.dateOfContact,
      // timeOfContact:fields.timeOfContact,
      methodOfContact: fields.methodOfContact.id,
      contactNotes: fields.contactNotes,
    };

    await ApiHelper.postRequest(ApiUrls.INSERT_CONTACT_NOTES, data)
      .then((result) => {
        setLoading(false);
        NotificationManager.success("Task added successfully");
        onClose({ added: true });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error);
      });
  };

  const handleSubmit = () => {
    setSettingError(true);
    if (handleValidation()) {
      if (selectedTaskId) {
        updateTask();
      } else {
        saveTask();
      }
    }
  };

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;

    if (!fields.newRelations) {
      formIsValid = false;
      errors["newRelations"] = ErrorHelper.FIELD_BLANK;
    }

    setErrors(errors);
    return formIsValid;
  };

  return (
    <Dialog
      onClose={onClose}
      title={"Add Documnet Notes"}
      className="small-dailog-modal"
    >
      <div className="Service-accept edit-Service-popup">
        <div className=" py-3">
          <div className="col-md-12 col-lg-12 col-12 mb-4">
            {!selectedTaskId && (
              <DropDownKendoRct
                data={orgStaffList}
                onChange={handleChange}
                value={fields.contactedByStaffId}
                textField="name"
                label="Staff"
                dataItemKey="id"
                name="contactedByStaffId"
              />
            )}
          </div>
          <div className="col-md-12 col-lg-12 col-12 mb-4">
            <DropDownKendoRct
              validityStyles={settingError}
              label="Relations"
              onChange={handleChange}
              data={relationData}
              value={fields.newRelations}
              textField="relationName"
              required={true}
              suggest={true}
              name="newRelations"
              dataItemKey="id"
              error={!fields.newRelations && errors.newRelations}
            />
          </div>

          <div className="col-md-12 col-lg-12 col-12 mb-4">
            <DatePickerKendoRct
              onChange={handleChange}
              placeholder="Date of  Contact"
              name={"dateOfContact"}
              label={"Date Contact"}
              value={fields.dateOfContact}
            />
          </div>
          <div className="col-md-12 col-lg-12 col-12 mb-4">
            <TimePickerKendoRct
              onChange={handleChange}
              placeholder="Time of  Contact"
              name={"timeOfContact"}
              label={"Time Contact"}
              value={fields.timeOfContact}
            />
          </div>

          <div className="col-md-12 col-lg-12 col-12 mb-4">
            <DropDownKendoRct
              validityStyles={settingError}
              label="Contact Method"
              onChange={handleChange}
              data={communicationMethod}
              value={fields.methodOfContact}
              textField="name"
              required={true}
              suggest={true}
              name="methodOfContact"
              dataItemKey="id"
              error={!fields.newRelations && errors.newRelations}
            />
          </div>

          <div className="col-md-12 col-lg-12 col-12 mb-4">
            <TextAreaKendoRct
              name="contactNotes"
              txtValue={fields.contactNotes}
              onChange={handleTextChange}
              label="Description"
              error={!fields.taskDescription && errors.taskDescription}
              required={settingError}
            />
          </div>
        </div>

        {loading == true && <Loader />}

        <div className="row my-3">
          <div className="d-flex">
            <div>
              <button
                onClick={handleSubmit}
                className="btn blue-primary text-white  mx-3"
              >
                Save
              </button>
            </div>
            <div>
              <button
                className="btn grey-secondary text-white"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default AddContactNotes;
