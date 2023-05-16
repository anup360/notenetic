import { Dialog } from "@progress/kendo-react-dialogs";
import { Checkbox } from "@progress/kendo-react-inputs";
import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import DatePickerKendoRct from "../../../control-components/date-picker/date-picker";
import TextAreaKendoRct from "../../../control-components/kendo-text-area/kendo-text-area";
import Loader from "../../../control-components/loader/loader";
import apiHelper from "../../../helper/api-helper";
import API_URLS from "../../../helper/api-urls";
import DateTimeHelper from "../../../helper/date-time-helper";
import ErrorHelper from "../../../helper/error-helper";
import { TaskService } from "../../../services/taskService";
import { showError } from "../../../util/utility";
import { renderErrors } from "src/helper/error-message-helper";

const AddDocumentTask = ({ onClose, task, documentId, authorStaffId , taskAdded}) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [settingError, setSettingError] = useState(false);

  const [fields, setFields] = useState({
    taskDescription: "",
    dueDate: "",
    isHighPriorityTask: false,
  });

  useEffect(() => {
    if (task) {
      getTaskDetail();
    }
  }, [task]);

  useEffect(() => {
    let errors = {};

    if (!fields.taskDescription) {
      errors.taskDescription = ErrorHelper.FIELD_BLANK;
    }

    setErrors(errors);
  }, [fields]);

  const getTaskDetail = () => {
    setLoading(true);
    TaskService.getTaskDetail(task.id)
      .then((result) => {
        let data = result.resultData;
        setFields({
          ...fields,
          taskDescription: data.taskDescription,
          dueDate: data.dueDate ? new Date(data.dueDate) : "",
          isHighPriorityTask: data.isHighPriorityTask,
        });
      })
      .catch((error) => {
        renderErrors(error.message);
      })
      .finally(() => {
        setLoading(false);
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

  const saveTask = () => {
    const body = {
      ...fields,
      documentId,
      staffIds: [authorStaffId],
      dueDate: fields.dueDate ? DateTimeHelper.format(fields.dueDate, "YYYY-MM-DD") : "",
    };

    setLoading(true);
    apiHelper
      .postRequest(API_URLS.INSERT_TASK, body)
      .then((result) => {
        NotificationManager.success("Task added successfully");
        onClose(true);
        taskAdded({added:true})
      })
      .catch((error) => {
        renderErrors(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const updateTask = () => {
    const body = {
      ...fields,
      id: task.id,
      documentId,
      staffIds: [authorStaffId],
      dueDate: fields.dueDate ? DateTimeHelper.format(fields.dueDate, "YYYY-MM-DD") : "",
    };

    setLoading(true);
    apiHelper
      .putRequest(API_URLS.UPDATE_TASK, body)
      .then((result) => {
        NotificationManager.success("Task updated successfully");
        onClose(true);
      })
      .catch((error) => {
        showError(error, "Task Update");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSubmit = () => {
    if (Object.keys(errors).length > 0) {
      setSettingError(true);
      return;
    }

    if (task) {
      updateTask();
    } else {
      saveTask();
    }
  };

  const handleClose = () => {
    onClose(false)
  }

  return (
    <Dialog
      onClose={handleClose}
      title={task ? "Update task" : "Add Task"}
      className="small-dailog-modal"
    >
      <div className="Service-accept edit-Service-popup">
        <div className=" py-3">
          <div className="col-md-12 col-lg-12 col-12 mb-4">
            <TextAreaKendoRct
              name="taskDescription"
              txtValue={fields.taskDescription}
              onChange={handleTextChange}
              label="Task"
              placeholder={"Enter your task description..."}
              error={
                settingError &&
                !fields.taskDescription &&
                errors.taskDescription
              }
              required={settingError}
            />
          </div>
          <div className="col-md-12 col-lg-12 col-12 mb-4">
            <DatePickerKendoRct
              onChange={handleChange}
              placeholder="Due date"
              name={"dueDate"}
              label={"Due date"}
              value={fields.dueDate}
            />
          </div>
          <div className="col-md-12 col-lg-12 col-12 mb-4">
            <Checkbox
              onChange={handleChange}
              label={"Is Important"}
              name="isHighPriorityTask"
              value={fields.isHighPriorityTask}
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
                onClick={handleClose}
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

export default AddDocumentTask;
