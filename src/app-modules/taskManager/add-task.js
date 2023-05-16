import React from "react";
import { MultiSelect } from "@progress/kendo-react-dropdowns";
import { useEffect, useState } from "react";
import DatePickerKendoRct from "../../control-components/date-picker/date-picker";
import TextAreaKendoRct from "../../control-components/kendo-text-area/kendo-text-area";
import { Checkbox } from "@progress/kendo-react-inputs";
import { NotificationManager } from "react-notifications";
import { useNavigate } from "react-router";
import AppRoutes from "../../helper/app-routes";
import { Dialog } from "@progress/kendo-react-dialogs";
import Loader from "../../control-components/loader/loader";
import { TaskService } from "../../services/taskService";
import ErrorHelper from "../../helper/error-helper";
import { renderErrors } from "src/helper/error-message-helper";

const AddTask = ({ onClose, orgStaffList, selectedTaskId }) => {
  const navigate = useNavigate();
  const [toStaffList, setToStaffList] = useState({
    value: [],
    allSelected: true,
  });
  const selectAllOption = { id: 0, name: "Select All" };
  const [staffList, setStaffList] = useState([]);
  //   const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [taskInfo, setTaskInfo] = React.useState();
  const [errors, setErrors] = useState("");
  const [settingError, setSettingError] = useState(false);

  const [fields, setFields] = useState({
    taskDescription: "",
    dueDate: "",
    isHighPriorityTask: false,
  });

  useEffect(() => {
    getStaffList();
    if (selectedTaskId) {
      getTaskDetail();
    }
  }, [orgStaffList]);

  const getTaskDetail = async () => {
    setLoading(true);
    await TaskService.getTaskDetail(selectedTaskId.id)
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
    await TaskService.updateTask(fields, selectedTaskId.id)
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

  async function getStaffList() {
    setStaffList([selectAllOption, ...orgStaffList]);
  }

  function onStaffFilterChange(event) {
    const searchValue = event.filter.value.toLowerCase();
    if (searchValue.length == 0) {
      setStaffList([selectAllOption, ...orgStaffList]);
    } else {
      setStaffList(
        staffList.filter((staff) =>
          staff.name.toLowerCase().includes(searchValue)
        )
      );
    }
  }

  function onStaffChange(event) {
    const currentSelectAll = toStaffList.value.some(
      (i) => i.id == selectAllOption.id
    );
    const nextSelectAll = event.value.some((i) => i.id == selectAllOption.id);
    let value = event.value;
    const currentCount = toStaffList.value.length;
    const nextCount = value.length;

    if (
      nextCount > currentCount &&
      !currentSelectAll &&
      !nextSelectAll &&
      staffList.length - 1 === nextCount
    ) {
      value = staffList;
    } else if (
      nextCount < currentCount &&
      currentCount === staffList.length &&
      currentSelectAll &&
      nextSelectAll
    ) {
      value = value.filter((v) => v.id !== selectAllOption.id);
    } else if (!currentSelectAll && nextSelectAll) {
      value = staffList;
    } else if (currentSelectAll && !nextSelectAll) {
      value = [];
    }
    setToStaffList({ value });
  }

  function renderToItem(li, itemProps) {
    const itemChildren = (
      <span>
        <input
          type="checkbox"
          name={itemProps.dataItem}
          checked={itemProps.selected}
          onChange={(e) => itemProps.onClick(itemProps.index, e)}
        />
        &nbsp;{li.props.children}
      </span>
    );
    return React.cloneElement(li, li.props, itemChildren);
  }

  const saveTask = async () => {
    // setLoading(true);
    await TaskService.addTask(toStaffList, fields)
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

  const handleCancle = () => {
    navigate(AppRoutes.TASK_MANAGER);
  };

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;
    if (!fields.taskDescription) {
      formIsValid = false;
      errors["taskDescription"] = ErrorHelper.FIELD_BLANK;
    }
    // if (!toStaffList.value) {
    //   formIsValid = false;
    //   errors["status"] = ErrorHelper.FIELD_BLANK;
    // }
    setErrors(errors);
    return formIsValid;
  };

  return (
    <Dialog
      onClose={onClose}
      title={selectedTaskId ? "Update task" : "Add Task"}
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
              error={!fields.taskDescription && errors.taskDescription}
              required={settingError}
            />
          </div>
          <div className="col-md-12 col-lg-12 col-12 mb-4">
            {!selectedTaskId && (
              <MultiSelect
                data={staffList}
                itemRender={renderToItem}
                onChange={onStaffChange}
                value={toStaffList.value}
                filterable={true}
                onFilterChange={onStaffFilterChange}
                textField="name"
                tags={toStaffList.value
                  .filter((staff) => staff.id != 0)
                  .map((staff) => {
                    return { text: staff.name, data: [staff] };
                  })}
                autoClose={false}
                label="Assign Task To "
              />
            )}
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
        {loading && <Loader />}
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

export default AddTask;
