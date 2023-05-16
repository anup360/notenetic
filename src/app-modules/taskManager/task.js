/**
 * App.js Layout Start Here
 */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { NotificationManager } from "react-notifications";
import ApiUrls from "../../helper/api-urls";
import ApiHelper from "../../helper/api-helper";
import { ListView } from "@progress/kendo-react-listview";
import { Pager } from "@progress/kendo-react-data-tools";
import { useSelector } from "react-redux";
import { Input } from "@progress/kendo-react-inputs";
import addIcon from "../../assets/images/add.png";
import filterIcon from "../../assets/images/filter.png";
import moment from "moment";
import { TaskService } from "../../services/taskService";
import Loader from "../../control-components/loader/loader";
import AddTask from "./add-task";
import APP_ROUTES from "../../helper/app-routes";
import DeleteTask from "./delete-task";
import { Checkbox } from "@progress/kendo-react-inputs";
import { DateRangePicker } from "@progress/kendo-react-dateinputs";
import { displayFormattedDueDate, displayUIForTasks } from "./tasks-common-items";
import DropDownKendoRct from '../../control-components/drop-down/drop-down';
import useModelScroll from '../../cutomHooks/model-dialouge-scroll'
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { renderErrors } from "src/helper/error-message-helper";


const Task = () => {
  const navigate = useNavigate();
  const [addTaskModal, setAddtaskModal] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [staffData, setStaffData] = useState([]);
  const [taskList, setTaskList] = React.useState([]);
  const [loading, setLoading] = useState(false);
  const [clickedTask, setClickedTask] = useState();
  const [totalTask, setTotalTask] = useState();
  const [isDeleteTask, setDeleteTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState();
  const defaultPageSettings = { skip: 0, take: 10 };
  const [page, setPage] = React.useState(defaultPageSettings);
  const { skip, take } = page;
  const staffLogInId = useSelector((state) => state.loggedIn?.staffId);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [modelScroll, setScroll] = useModelScroll()

  let [fields, setFields] = useState({
    discussion: "",
    isImportant: false,
    staffName: "",
    fromUtcDate: "",
    ToUtcDate: ""

  });
  const [dateRange, setDateRange] = React.useState({
    start: null,
    end: null,
  });

  useEffect(() => {
    getStaffLists();
    getTasksList();
    window.scrollTo(0, 0);
  }, []);

  async function getStaffLists() {
    try {
      const result = await ApiHelper.getRequest(
        ApiUrls.GET_STAFF_DDL_BY_CLINIC_ID
      );
      const staffObjList = result.resultData.map((x) => {
        return {
          id: x.id,
          name: x.name,
        };
      });
      setStaffList(staffObjList);
      setStaffData(staffObjList);
    } catch (err) { }
  }

  const getTasksList = async (
    localSkip,
    localTake,
    value,
    rangePicker,
    search
  ) => {
    setLoading(true);

    const pageSize = localTake != undefined ? localTake : take;
    const pageNumber =
      (localSkip != undefined ? localSkip : skip) / pageSize + 1;
    await TaskService.getTaskSearch(
      pageSize,
      pageNumber,
      value ?? fields,
      dateRange ? dateRange : rangePicker,
      search
    )
      .then((result) => {
        setTaskList(result.resultData);
        setTotalTask(result.metaData.totalCount);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error);
      });
  };

  const handleAddTask = ({ added }) => {
    if (added == true) {
      getTasksList();
    }
    setAddtaskModal(!addTaskModal)
    if (addTaskModal == false) {
      setScroll(true)
    } else {
      setScroll(false)
    }
  };

  function onTaskClick(e, taskObj) {
    e.preventDefault();
    setClickedTask(taskObj);
    navigate(APP_ROUTES.TASK_DISCUSSION, { state: { taskObj: taskObj } });
  }

  const handleDeleteTask = (taskObj) => {
    setDeleteTask(true)
    setSelectedTask(taskObj)
    setScroll(true)
  }

  const handleCloseDelete = ({ isDeleted }) => {
    if (isDeleted == true) {
      getTasksList();
    }
    setDeleteTask(false)
    setScroll(false)
  }

  const updateTaskStatus = async (taskObj) => {
    setLoading(true);
    await TaskService.updateTaskStatus(taskObj)
      .then((result) => {
        setLoading(false);
        getTasksList();
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error);
      });
  };

  const hanldeTaskStatus = (taskObj) => {
    updateTaskStatus(taskObj);
  };

  const handleFilter = (e) => {
    var search = e.target.value;
    setSearchQuery(search);
    if (search === "") {
      getTasksList(null, null, null, null, search);
    } else {
      if (search.length > 2) {
        getTasksList(null, null, null, null, search);
      }
    }
  };

  function renderTasks(props) {
    let taskObj = props.dataItem;
    const currentDate = new Date();

    return (
      <div>
        <div className="col-md-12">
          <div className={displayUIForTasks(taskObj)}>
            <div className="lable-details-msg align-items-start">
              {taskObj.isCompleted == true ? (
                <i
                  onClick={() => {
                    hanldeTaskStatus(taskObj);
                  }}
                  className="fa-solid text-success fa-circle-check fa-fw pt-3 f-18 cursor-pointer "
                ></i>
              ) : (
                <i
                  onClick={() => {
                    hanldeTaskStatus(taskObj);
                  }}
                  className="fa-regular fa-circle-check fa-fw pt-3 f-18 cursor-pointer"
                ></i>
              )}
              <div className="d-flex align-items-center px-4">
                {/* <img src={message.userImage} className='user-image' /> */}
                <p className="px-3 mb-0 ruth-text ">
                  {taskObj.assignedToStaffName}
                </p>
                {/* <b>{taskObj.assignedToStaffName}</b> */}
              </div>
              <div className="text-content-message">
                <p
                  onClick={(e) => {
                    onTaskClick(e, taskObj);
                  }}
                  className="mb-0 f-14 px-lg-2 cursor-pointer text-theme"
                >
                  <div className="message-subject">
                    <b>{taskObj.taskDescription}</b>
                  </div>
                </p>
              </div>
              <div className="month-number text-end">
                <p className={displayFormattedDueDate(taskObj)}>
                  {taskObj.dueDate
                    ? moment(taskObj.dueDate).format("M/D/YYYY")
                    : ""}
                </p>
              </div>
            </div>
            <div className="d-flex justify-content-between">
              <div className="attachemnt"></div>
              <div className=" pr-2">
                {taskObj.createdBy == staffLogInId && (
                  <i
                    onClick={() => handleDeleteTask(taskObj)}
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

  function handlePageChange(e) {
    setPage({
      skip: e.skip,
      take: e.take,
    });
    getTasksList(e.skip, e.take);
    window.scrollTo(0, 0);
  }

  function prevPage(e) {
    e.preventDefault();
    if (skip != 0) {
      const newSkip = skip - take;
      setPage({
        skip: newSkip,
        take: take,
      });
      getTasksList(newSkip, take);
    }
  }

  function nextPage(e) {
    e.preventDefault();
    const newSkip = skip + take;
    setPage({
      skip: newSkip,
      take: take,
    });
    getTasksList(newSkip, take);
  }

  function renderPrevNextPage() {
    const lastTaskCountOnScreen = skip + take;
    return (
      <div className="prev-next mt-3 mt-md-0 d-flex align-items-center pr-3">
        <div className="count-show-numer mr-2">
          <p className="mb-0 f-14">
            {skip + 1} -{" "}
            {lastTaskCountOnScreen > totalTask
              ? totalTask
              : lastTaskCountOnScreen}{" "}
            of {totalTask}
          </p>
        </div>
        <ul className="list-unstyled d-flex justify-content-end mb-0">
          {skip != 0 && (
            <li className="d-inline-block mx-1">
              <button
                type="button"
                className="btn blue-primary btn-sm"
                onClick={prevPage}
              >
                <i className="k-icon k-i-arrow-chevron-left"></i>
              </button>
            </li>
          )}
          {lastTaskCountOnScreen < totalTask && (
            <li className="d-inline-block mx-1" onClick={nextPage}>
              <button type="button" className="btn blue-primary btn-sm">
                <i className="k-icon k-i-arrow-chevron-right"></i>
              </button>
            </li>
          )}
        </ul>
      </div>
    );
  }

  const handleChange = (e) => {
    const name = e.target.name;
    const textAreaValue = e.value;
    setFields({
      ...fields,
      [name]: textAreaValue,
    });
  };

  const handleValueChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFields({
      ...fields,
      [name]: value,
    });
  };

  const handleApplyFilter = () => {
    document.getElementById("dropdownMenuButton").click();
    setIsFilterOpen(false);
    getTasksList();
  };

  const handleClearFilter = () => {
    setFields({
      ...fields,
      discussion: "",
      isImportant: false,
      staffName: "",
      fromUtcDate: null,
      ToUtcDate: null
    });
    setDateRange({
      ...dateRange,
      start: null,
      end: null,
    });
    getTasksList(
      null,
      null,
      {
        discussion: "",
        isImportant: false,
        staffName: "",
      },
      {
        start: "",
        end: false,
      },
      null
    );
    document.getElementById("dropdownMenuButton").click();
    setIsFilterOpen(false);
  };

  const handleDateRangeChange = (event) => {
    setDateRange(event.value);
  };

  return (
    <div>
      <div className="grid-upper-head mb-lg-3">
        <h4 className="address-title text-grey mb-0 ml-3 mb-2">
          <span className="f-24">Tasks</span>
        </h4>
        <div className="filter d-flex align-items-center filter-width mb-2">
          <div className="content-search-filter filter-drop-down col-md-11 px-0 mb-2 mb-md-0">
            <Input
              value={searchQuery}
              onChange={(e) => handleFilter(e)}
              name="searchQuery"
              className="filtersearch"
              placeholder="Type min. 3 chars to search..."
            />
            <span
              onClick={() => {
                setIsFilterOpen(!isFilterOpen);
              }}
              className="dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
            // data-toggle="dropdown"
            // aria-haspopup="true"
            // aria-expanded="false"
            >
              <img src={filterIcon} alt="" className="filter-search" />
            </span>
            {isFilterOpen && (

              <div
                className="dropdown-menu filter-popup dropdown-filter-menu show"
                aria-labelledby="dropdownMenuButton"
              >
                <div className="current-popup">
                  <form>
                    <div className="form-group mb-1 align-items-center">
                      <DropDownKendoRct
                        label="Staff"
                        onChange={handleValueChange}
                        data={staffList}
                        value={fields.staffName}
                        textField="name"
                        suggest={true}
                        name="staffName"
                        dataItemKey="id"
                      />
                    </div>
                    {/* <div className="form-group  mb-1 align-items-center col-md-12 mb-3"> */}
                    {/* <DateRangePicker onChange={handleDateRangeChange} />
                       */}
                    {/* </div> */}
                    <div className='form-group mb-1 align-items-center'>
                      <DatePicker
                        validityStyles={false}
                        value={fields.fromUtcDate}
                        onChange={handleValueChange}
                        name="fromUtcDate"
                        label="From Date"
                      />
                    </div>
                    <div className='form-group mb-1 align-items-center'>
                      <DatePicker
                        validityStyles={false}
                        value={fields.ToUtcDate}
                        onChange={handleValueChange}
                        name="ToUtcDate"
                        label="To Date"
                      />
                    </div>

                    <div className="col-md-12 col-lg-12 col-12 mb-3">
                      <Checkbox
                        onChange={handleChange}
                        label={"Show Important tasks only"}
                        name="isImportant"
                        value={fields.isImportant}
                      />
                    </div>
                    <div className="border-bottom"></div>
                    <div className="d-flex mt-2">
                      <div>
                        <button
                          type="button"
                          className="btn btn-sm grey-secondary m-2"
                          onClick={handleClearFilter}
                        >
                          Clear
                        </button>
                      </div>
                      <div>
                        <button
                          type="button"
                          className="btn btn-sm blue-primary m-2"
                          onClick={handleApplyFilter}
                        >
                          Filter
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <button
            type="button"
            data-toggle="modal"
            data-target="#editform"
            onClick={handleAddTask}
            className="btn blue-primary text-white d-flex align-items-center mr-3"
          >
            <img src={addIcon} alt="" className="me-2 add-img" />
            Add New Task
          </button>
          {!clickedTask && renderPrevNextPage()}
        </div>
      </div>
      {loading && <Loader />}
      {taskList.length > 0 ? (
        <div>
          <ListView
            data={taskList}
            item={renderTasks}
            style={{ width: "100%" }}
          />
          <Pager
            skip={skip}
            take={take}
            onPageChange={handlePageChange}
            total={totalTask}
          />
        </div>
      ) : (
        <div className="message-not-found mt-3">No Tasks </div>
      )}
      {addTaskModal && (
        <AddTask onClose={handleAddTask} orgStaffList={staffList} />
      )}
      {isDeleteTask && (
        <DeleteTask onClose={handleCloseDelete} selectedTask={selectedTask} />
      )}
    </div>
  );
};
export default Task;
