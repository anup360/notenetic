import moment from "moment";
import { forwardRef, useState } from "react";
import { useSelector } from "react-redux";
import DeleteTask from "../../../app-modules/taskManager/delete-task";
import Loading from "../../../control-components/loader/loader";
import useModelScroll from "../../../cutomHooks/model-dialouge-scroll";
import { TaskService } from "../../../services/taskService";
import { showError } from "../../../util/utility";
import { displayFormattedDueDate, displayUIForTasks } from "../../taskManager/tasks-common-items";
import DiscussDocTask from "./discuss-doc-task";

const ListDocumentTasks = forwardRef(({ taskList, fetchTasks, documentId, authorStaffId }, ref) => {

    const [loading, setLoading] = useState(false);
    const [selectedTask, setSelectedTask] = useState();
    const [isDeleteTask, setDeleteTask] = useState(false);
    const [showTaskDiscussion, setShowTaskDiscussion] = useState(false);

    const [modelScroll, setScroll] = useModelScroll()

    const staffLogInId = useSelector((state) => state.loggedIn?.staffId);

    const hanldeTaskStatus = (taskObj) => {
        setLoading(true);
        TaskService.updateTaskStatus(taskObj)
            .then(async (result) => {
                await fetchTasks()
            })
            .catch((error) => { showError(error, "Update Task Status") })
            .finally(() => { setLoading(false) })
    };

    const handleCloseDelete = ({ isDeleted }) => {
        if (isDeleted == true) {
            fetchTasks();
        }
        setDeleteTask(false)
        setScroll(false)
    }

    const handleCloseDiscussion = ({ }) => {
        setShowTaskDiscussion(false)
        setSelectedTask(undefined)
        fetchTasks()
        setScroll(false)
    }

    function onTaskClick(e, taskObj) {
        e.preventDefault()
        setSelectedTask(taskObj)
        setShowTaskDiscussion(true)
        setScroll(true)
    }

    const handleDeleteTask = (taskObj) => {
        setDeleteTask(true)
        setSelectedTask(taskObj)
        setScroll(true)
    }


    function renderTask(taskObj, index) {
        const currentDate = new Date();

        return (
            <div key={"task" + index}>
                <div className="col-md-12">
                    <div className={displayUIForTasks(taskObj)}>
                        <div className="lable-details-msg align-items-start document-label-details">
                            <i ref={index == taskList.length - 1 ? ref : undefined} tabIndex={0} onClick={() => {
                                hanldeTaskStatus(taskObj);
                            }}
                                className={taskObj.isCompleted == true
                                    ? "fa-solid text-success fa-circle-check fa-fw pt-3 f-18 cursor-pointer "
                                    : "fa-regular fa-circle-check fa-fw pt-1 f-18 cursor-pointer"
                                }
                            ></i>
                            <div className="text-content-message">
                                <p onClick={(e) => { onTaskClick(e, taskObj); }}
                                    className="mb-0 f-14 px-lg-2 cursor-pointer text-theme">
                                    <div className="message-subject">
                                        <b>{taskObj.taskDescription}</b>
                                    </div>

                                </p>
                            </div>
                            <div className="month-number text-end">
                                <p className={displayFormattedDueDate(taskObj)}>
                                    {taskObj.dueDate !==null 
                                        ? moment(taskObj.dueDate).format('M/D/YYYY')
                                        : ""}
                                </p>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center ml-4">

                            <div className="attachemnt">
                                <p className={displayFormattedDueDate(taskObj)} style={{ marginBottom: 0, fontWeight: 500 }}>
                                    {"Added by " + taskObj.addedBy + " on " + (taskObj.utcDateCreated
                                        ? moment.utc(taskObj.utcDateCreated).local().format('M/D/YYYY')
                                        : "")}
                                </p>
                            </div>

                            <div className=" pr-2">
                                {taskObj.createdBy == staffLogInId && (
                                    <i onClick={() => handleDeleteTask(taskObj)}
                                        className="fa fa-trash"
                                    ></i>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    function renderTaskList() {
        return (
            <span>
                <div className="row">
                    <div className="form-group mb-3  pl-0 col-md-12">
                        <h6 className="mb-2">Tasks</h6>
                        {taskList.map((task, index) => renderTask(task, index))}
                        {loading && <Loading />}
                    </div>
                </div>
                {isDeleteTask && (
                    <DeleteTask
                        onClose={handleCloseDelete}
                        selectedTask={selectedTask} />
                )}
                {showTaskDiscussion && (
                    <DiscussDocTask
                        onClose={handleCloseDiscussion}
                        task={selectedTask}
                        documentId={documentId}
                        authorStaffId={authorStaffId}
                    />
                )}
            </span>
        );
    }

    return renderTaskList()
})

export default ListDocumentTasks;