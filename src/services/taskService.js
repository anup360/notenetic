import ApiUrls from "../helper/api-urls";
import ApiHelper from "../helper/api-helper";
import moment from "moment";
import { Encrption } from "../app-modules/encrption";

const addTask = (toStaffList, fields) => {
  let toStaffIds = toStaffList.value.map((x) => x.id);
  var data = {
    taskDescription: fields.taskDescription,
    dueDate:
      fields?.dueDate == "" ? "" : moment(fields.dueDate).format("YYYY-MM-DD"),
    isHighPriorityTask: fields.isHighPriorityTask,
    staffIds: toStaffIds,
  };
  return ApiHelper.postRequest(ApiUrls.INSERT_TASK, data);
};

const getTaskSearch = (pageSize, pageNumber, fields, dateRange, search) => {
  var data = {
    pageSize: pageSize,
    pageNumber: pageNumber,
    taskId: 0,
    staffId: fields.staffName ? fields.staffName.id : 0,
    taskDescription: search ? search : "",
    showImportantTasksOnly: fields.isImportant ? fields.isImportant : false,
    dueDateStart: fields.fromUtcDate ? fields.fromUtcDate : null,
    dueDateEnd: fields.ToUtcDate ? fields.ToUtcDate : null,
    isActive: true,
  };

  return ApiHelper.postRequest(ApiUrls.GET_ALL_TASKS_BY_SEARCH, data);
};

const getTaskDetail = (id) => {
  return ApiHelper.getRequest(ApiUrls.GET_TASK_BY_ID + Encrption(id));
};

const deleteTask = (id) => {
  return ApiHelper.deleteRequest(
    ApiUrls.DELETE_TASK + Encrption(id),
    null,
    true
  );
};

const deleteTaskDiscussion = (id) => {
  return ApiHelper.deleteRequest(
    ApiUrls.DELETE_TASK_DISCUSSION + Encrption(id),
    null,
    true
  );
};

const updateTask = (fields, selectedTaskId) => {
  var data = {
    taskDescription: fields.taskDescription,
    dueDate: moment(fields.dueDate).format("YYYY-MM-DD"),
    isHighPriorityTask: fields.isHighPriorityTask,
    id: selectedTaskId,
  };
  return ApiHelper.putRequest(ApiUrls.UPDATE_TASK, data);
};

const insertDiscussion = (discussion, assignedToId) => {
  var data = {
    assignedToId: assignedToId,
    description: discussion,
  };
  return ApiHelper.postRequest(ApiUrls.INSERT_DISCUSSION, data);
};

const getTaskDiscussionByAssignedId = (id) => {
  return ApiHelper.getRequest(
    ApiUrls.GET_TASK_DISCUSSION_BY_ASSIGNED_ID + Encrption(id)
  );
};

const updateDiscussion = (
  description,
  selectedTaskId,
  selectedDiscussionId
) => {
  var data = {
    assignedToId: selectedTaskId,
    description: description,
    id: selectedDiscussionId,
  };
  return ApiHelper.putRequest(ApiUrls.UPDATE_DISCUSSION, data);
};

const getDiscussionById = (id) => {
  return ApiHelper.getRequest(
    ApiUrls.GET_TASK_DISCUSSION_BY_ID + Encrption(id)
  );
};

const updateTaskStatus = (taskObj) => {
  let taskArry = [];
  taskArry.push(taskObj.id);
  var data = {
    assignedTaskIds: taskArry,
    isCompleted: taskObj.isCompleted == true ? false : true,
  };
  return ApiHelper.putRequest(ApiUrls.UPDATE_TASK_STATUS, data);
};

const getDateFormatted = (currentDate, dateforMatted) => {
  return ApiHelper.getRequest(
    ApiUrls.GET_FORMATTED_DATE +
      "currentDate" +
      "=" +
      currentDate +
      "&" +
      "dateToFormat" +
      "=" +
      dateforMatted
  );
};

export const TaskService = {
  addTask,
  getTaskSearch,
  getTaskDetail,
  deleteTask,
  updateTask,
  insertDiscussion,
  getTaskDiscussionByAssignedId,
  deleteTaskDiscussion,
  updateDiscussion,
  getDiscussionById,
  updateTaskStatus,
  getDateFormatted,
};
