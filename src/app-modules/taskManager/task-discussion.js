import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { TaskService } from "../../services/taskService";
import Loader from "../../control-components/loader/loader";
import { NotificationManager } from "react-notifications";
import dummyImg from "../../assets/images/dummy-img.png";
import moment from "moment";
import EditTask from "./add-task";
import TextAreaKendo from "../../control-components/text-area/text-area";
import { useNavigate } from "react-router";
import DeleteTaskDiscussion from "./delete-task";
import EditDiscussion from "./edit-discussion";
import { useDispatch, useSelector } from "react-redux";
import {
  displayFormattedDueDate,
  displayUIForTasks,
} from "./tasks-common-items";
import { Tooltip } from "@progress/kendo-react-tooltip";
import useModelScroll from "../../cutomHooks/model-dialouge-scroll";
import AddDocumentTask from "../documents/tasks/add-doc-task";
import APP_ROUTES from "../../helper/app-routes";
import { renderErrors } from "src/helper/error-message-helper";


const TaskDiscussion = ({ task, documentId, authorStaffId }) => {
  const [taskInfo, setTaskInfo] = useState();
  const [loading, setLoading] = useState(false);
  const [editTaskModal, setEditTaskModal] = useState(false);
  const [isDeleteDiscussion, setDeleteDiscussion] = useState(false);
  const [isEditDiscussion, setEditDiscussion] = useState(false);
  const [selectedDiscussionId, setSelectedDiscussionId] = useState();
  const [taskDiscussion, setTaskDiscussion] = useState([]);
  const [statusUpdated, setStatusUpdated] = useState(false);
  const [fields, setFields] = useState({ discussion: "" });
  const [settingError, setSettingError] = useState(false);

  const { state } = useLocation();
  const taskObj = task ? task : state?.taskObj;
  const navigate = useNavigate();
  const [modelScroll, setScroll] = useModelScroll();
  const staffLogInId = useSelector((state) => state.loggedIn?.staffId);
  const staffLoginInfo = useSelector((state) => state.getStaffReducer);

  useEffect(() => {
    if (taskObj) {
      getTaskDetail();
    }
  }, [statusUpdated]);

  const getTaskDetail = () => {
    setLoading(true);
    TaskService.getTaskDetail(taskObj?.id)
      .then((result) => {
        setTaskInfo(result.resultData);
        getDiscussion();
      })
      .catch((error) => {
        renderErrors(error.message);
      })
      .finally(() => {
        setLoading(true);
      });
  };

  const handleEditTask = ({ edited }) => {
    if (edited == true) {
      getTaskDetail();
    }
    setEditTaskModal(!editTaskModal);
    if (editTaskModal == false) {
      setScroll(true);
    } else {
      setScroll(false);
    }
  };

  const getFormattedDates = async (discussionInfo) => {
    for (let i = 0; i < discussionInfo.length; i++) {
      const currentDate = moment.utc(new Date()).format("M/D/YYYY hh:mm:ss");
      await TaskService.getDateFormatted(
        currentDate,
        discussionInfo[i].commentedOn
      )
        .then((result) => {
          let dateInfo = result.resultData;
          discussionInfo[i]["formattedDate"] = dateInfo;
        })
        .catch((error) => {
          renderErrors(error);
        });
    }
    setTaskDiscussion(discussionInfo);
    setLoading(false);
    setFields({
      ...fields,
      discussion: "",
    });
  };

  const getDiscussion = async () => {
    setLoading(true);
    await TaskService.getTaskDiscussionByAssignedId(taskObj?.id)
      .then((result) => {
        let discussionInfo = result.resultData;
        getFormattedDates(discussionInfo);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const insertDiscussion = async () => {
    setLoading(true);
    await TaskService.insertDiscussion(fields.discussion, taskObj?.id)
      .then((result) => {
        setLoading(false);
        getDiscussion();
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const handleAddDiscussion = () => {
    setSettingError(true);
    insertDiscussion();
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const textAreaValue = e.value;
    setFields({
      ...fields,
      [name]: textAreaValue,
    });
  };

  const deleteDiscussion = (obj) => {
    setDeleteDiscussion(true);
    setSelectedDiscussionId(obj.id);
    setScroll(true);
  };

  const editDiscussion = (obj) => {
    setEditDiscussion(true);
    setSelectedDiscussionId(obj.id);
    setScroll(true);
  };

  const deleteCloseDiscussion = ({ isDeleteDiscussion }) => {
    if (isDeleteDiscussion == true) {
      getDiscussion();
    }
    setDeleteDiscussion(false);
    setScroll(false);
  };

  const editCloseDiscussion = ({ isUpdated }) => {
    if (isUpdated == true) {
      getDiscussion();
    }
    setEditDiscussion(false);
    setScroll(false);
  };

  const updateTaskStatus = () => {
    setLoading(true);
    TaskService.updateTaskStatus(taskInfo)
      .then((result) => {
        setStatusUpdated(true);
        getDiscussion();
      })
      .catch((error) => {
        renderErrors(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };


  const viewLinkedDocument = (docId) => {
    navigate(APP_ROUTES.DOCUMENT_VIEW, {
      state: {
        id: docId,
        backRoute: APP_ROUTES.TASK_MANAGER,
      },
    });
    window.scrollTo(0, 0);
  }


  function renderLinkedDocs(obj) {
    return (
      <>

        <button
          onClick={() => { viewLinkedDocument(obj.documentId) }}
          className="btn blue-primary-outline btn-sm ml-2  default-head-btn cursor-pointer"
        >
          {obj?.documentName}
        </button>
      </>
    );

  }

  return (
    <div>
      <div className="notenetic-container ">
        <div className="discussion-task-page task-modal-custom">
          <div className="d-flex align-items-center">
            <button
              onClick={() => {
                navigate(-1);
              }}
              type=""
              className="border-0 bg-transparent arrow-rotate pl-0 mb-3"
            >
              <i className="k-icon k-i-sort-asc-sm"></i>
            </button>
            <h5 className="mb-3">Task details</h5>
            {taskInfo && taskInfo.isCompleted === false && (
              <button
                onClick={updateTaskStatus}
                type="button"
                className="btn blue-primary-outline btn-sm   mb-3 ml-3"
              >
                Mark Complete{" "}
              </button>
            )}
          </div>
          <div className="d-flex justify-content-between">
            <div className="sign-user">
              <img
                src={
                  taskInfo && taskInfo.staffProfileImageUrl
                    ? taskInfo.staffProfileImageUrl
                    : dummyImg
                }
                className="user-top"
              />
              <span className="pl-2">
                {taskInfo ? taskInfo.assignedToStaffName : ""}
              </span>
            </div>
            {taskInfo && taskInfo.dueDate ? (
              <div className="due-date">
                <span className="mb-1 f-12 text-grey fw-500">Due on:</span>
                <span className={displayFormattedDueDate(taskInfo)}>
                  {taskInfo ? moment(taskInfo.dueDate).format("M/D/YYYY") : ""}
                </span>
                {taskInfo && taskInfo.createdBy == staffLogInId && (
                  <button
                    onClick={handleEditTask}
                    type=""
                    className="btn btn-sm blue-primary-outline"
                  >
                    <i className="k-icon k-i-edit pencile-edit-color mb-1 mr-1"></i>{" "}
                    Edit{" "}
                  </button>
                )}
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="form-group  mb-3 mt-3 pl-0 col-md-12 ">
            {taskInfo?.documentId && renderLinkedDocs(taskInfo)}
          </div>
          <hr />
          {taskInfo && (
            <div className="description-user">
              <div className={displayUIForTasks(taskInfo)}>
                <p className="f-14 text-grey">
                  {taskInfo ? taskInfo.taskDescription : ""}
                </p>
              </div>
            </div>
          )}
          <hr />
          {loading && <Loader />}
          <div className="discussion-detail mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h6 className="mb-0 ">Discussion</h6>
              {fields.discussion && (
                <button
                  type="button"
                  data-toggle="modal"
                  data-target="#editform"
                  onClick={handleAddDiscussion}
                  className="btn blue-primary-outline d-flex align-items-center btn-sm px-3 "
                >
                  Save
                </button>
              )}
            </div>
            <div className="user-people mb-3">
              <img
                src={
                  staffLoginInfo && staffLoginInfo.profileImageId
                    ? staffLoginInfo.profileImageId
                    : dummyImg
                }
                className="user-top"
              />
              <TextAreaKendo
                txtValue={fields.discussion}
                onChange={handleChange}
                name="discussion"
                label="Discussion"
                title={"Discussion"}
                rows="3"
                className="textarea-description"
                placeholder="Enter your Discussion Detail"
              />
            </div>
            <div>
              {taskDiscussion.length > 0 &&
                taskDiscussion.map((obj) => (
                  <div className="user-people mb-3">
                    <img
                      src={
                        obj.staffProfileImageUrl
                          ? obj.staffProfileImageUrl
                          : dummyImg
                      }
                      className="user-top"
                    />
                    <div className="border p-3 rounded">
                      <div className="d-flex justify-content-between">
                        <span className="text-grey f-12 mb-2 d-block">
                          <b>{obj.commentedBy + " "}</b>
                          commented {obj.formattedDate}
                        </span>
                        {obj.createdBy == staffLogInId && (
                          <div className="delete-btn">
                            <Tooltip anchorElement="target" position="top">
                              <button
                                onClick={() => {
                                  deleteDiscussion(obj);
                                }}
                                type=""
                                className="bg-transparent border-0"
                              >
                                <i
                                  className="fa fa-trash fa-xs"
                                  aria-hidden="true"
                                  title="Delete"
                                ></i>
                              </button>
                            </Tooltip>

                            <button
                              onClick={() => {
                                editDiscussion(obj);
                              }}
                              type=""
                              className="bg-transparent border-0"
                            >
                              <i
                                className="fa fa-pencil fa-xs"
                                aria-hidden="true"
                              ></i>
                            </button>
                          </div>
                        )}
                      </div>
                      <p className="f-14">{obj.description}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      {editTaskModal && !documentId && (
        <EditTask onClose={handleEditTask} selectedTaskId={taskObj} />
      )}
      {editTaskModal && documentId && (
        <AddDocumentTask
          onClose={handleEditTask}
          task={taskObj}
          documentId={documentId}
          authorStaffId={authorStaffId}
        />
      )}
      {isDeleteDiscussion && (
        <DeleteTaskDiscussion
          onClose={deleteCloseDiscussion}
          selectedDiscussionId={selectedDiscussionId}
        />
      )}

      {isEditDiscussion && (
        <EditDiscussion
          onClose={editCloseDiscussion}
          selectedDiscussionId={selectedDiscussionId}
          selectedTaskId={taskObj?.id}
        />
      )}
    </div>
  );
};

export default TaskDiscussion;
