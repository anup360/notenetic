import "../../custom-css/scheduler.scss"
import { useState, useEffect, useCallback, createElement, Fragment, cloneElement, useRef } from "react";
import values from "lodash/values";
import assign from "lodash/assign"
import { AddEditEventFormWrapper } from "./add-edit-event-form-wrapper";
import { EditStatusColor } from "./edit-status-color";
import { ViewReport } from "./view-report";
import { ViewEvent } from "./view-event";
import {
  Scheduler,
  TimelineView,
  DayView,
  WeekView,
  MonthView,
  AgendaView,
  useSchedulerFieldsContext,
} from "@progress/kendo-react-scheduler";
import { useSelector } from "react-redux";
import Loader from "../../control-components/loader/loader";
import { SchedulerService } from "../../services/schedulerService";
import { StaffService } from "../../services/staffService";
import { ClientService } from "../../services/clientService";
import { CommonService } from "../../services/commonService";
import { UserType } from "../../helper/enums";
import MultiSelectDropDown from "../../control-components/multi-select-drop-down/multi-select-drop-down";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import InputKendoRct from "../../control-components/input/input";
import filterIcon from '../../assets/images/filter.png'
import { Form, FormElement, Field } from "@progress/kendo-react-form";
import DateTimeHelper from "../../helper/date-time-helper";
import PDFExportHelper from "../../helper/pdf-export-helper";
import useModelScroll from '../../cutomHooks/model-dialouge-scroll'
import { permissionEnum } from "src/helper/permission-helper";
import { userSAPermission } from "../../helper/permission-helper";

const NoteneticScheduler = () => {
  const refFilterPopup = useRef();
  const fields = useSchedulerFieldsContext();
  const [loading, setLoading] = useState(false);
  const [onUpdateStatusColor, setOnUpdateStatusColor] = useState(false);
  const [reportOnClick, setReportOnClick] = useState(false);
  const [modelScroll, setScroll] = useModelScroll()
  const userAccessPermission = useSelector((state) => state.userAccessPermission);
  const staffLoginInfo = useSelector((state) => state.getStaffReducer);

  const clinicId = useSelector((state) => state.loggedIn.clinicId);
  const clininOpenTime = useSelector((state) => state.loggedIn.openTime);
  const clininCloseTime = useSelector((state) => state.loggedIn.closeTime);
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date());
  const [showOnlyWorkHours, setShowOnlyWorkHours] = useState(false);
  const [data, setData] = useState([]);
  const [customModelFields, setCustomModelFields] = useState();
  const [resourceFields, setResourceFields] = useState(
    SchedulerService.resources
  );
  const [staffsList, setStaffsList] = useState([...SchedulerService.resources.staffs.data]);
  const [clientsList, setClientsList] = useState([...SchedulerService.resources.clients.data]);
  const [filterFields, setFilterFields] = useState({
    staffs: [],
    clients: [],
    eventStatusId: 0
  });
  const staffId = useSelector((state) => state.loggedIn?.staffId);

  const [filterShow, setFilterShow] = useState(false)

  useEffect(() => {
    setLoading(true);
    setCustomModelFields({
      ...fields,
      startDate: "startDate",
      endDate: "endDate",
      startTime: "startTime",
      endTime: "endTime",
      staffs: "staffs",
      clients: "clients",
      eventStatusId: "eventStatusId",
      isTelehealth: "isTelehealth"
    });

    CommonService.getEventStatus().then((eventStatus) => {
      resourceFields.eventStatus.data = eventStatus;
      getEvents(clinicId, date, view)
    });

    setLoading(true);
    StaffService.getStaffsDDL(true).then((staffs) => {
      resourceFields.staffs.data = staffs;
      setStaffsList([...resourceFields.staffs.data]);
      setLoading(false);
    });

    setLoading(true);
    ClientService.getClientsDDL(true).then((clients) => {
      if (clients)
        clients = clients.resultData.map(x => { return { "id": x.clientId, "name": x.clientName } })
      resourceFields.clients.data = clients;
      setClientsList([...resourceFields.clients.data]);
      setLoading(false);
    });
  }, [setDate, setView, setResourceFields, setLoading]);

  const getEvents = (clinicId, currentDate, viewType, staffs, clients, eventStatus) => {
    setLoading(true);
    SchedulerService.getEvents(clinicId, viewType, currentDate, staffs, clients, eventStatus, UserType.STAFF).then(
      (events) => {
        setData(events);
        setLoading(false);
      }
    );
  };

  const handleViewChange = useCallback(
    (event) => {
      setView(event.value);
      refFilterPopup.current.resetForm();
      getEvents(clinicId, date, event.value);
    },
    [setView]

  );
  const handleDateChange = useCallback(
    (event) => {
      setDate(event.value);
      refFilterPopup.current.resetForm();
      getEvents(clinicId, new Date(event.value), view);
    },
    [setDate]
  );
  const handleDataChange = useCallback(
    ({ created, updated, deleted }) => {
      setData((old) =>
        old
          .filter((item) => {
            let deletedItem = deleted.find((current) => current.id === item.id);
            if (deletedItem) {
              SchedulerService.DeleteEvent(deletedItem.id).then(
                (eventId) => { }
              );
            }
            return deletedItem === undefined;
          })
          .map((item) => {
            let updateItem = updated.find((current) => current.id === item.id);
            if (updateItem) {
              item.clinicOpenTime = clininOpenTime;
              item.clinicCloseTime = clininCloseTime;
              SchedulerService.UpdateEvent(updateItem).then((eventId) => { });
            }
            return updateItem || item;
          })
      );

      created.map((item) => {
        item.clinicOpenTime = clininOpenTime;
        item.clinicCloseTime = clininCloseTime;
        item.id = 0;
        item.clinicId = clinicId;
        SchedulerService.CreateEvent(item).then((eventId) => {
          item.id = eventId;
          setData((old) => old.concat(item));
        });
      });
    },
    [setData]
  );
  const handleReportOnClick = ({ openDialog, eventStatusColors }) => {
    document.body.classList.add("model-open");
    setReportOnClick(!reportOnClick);
    if (openDialog) {
    }
    if (openDialog == false) {
      document.body.classList.remove("model-open");
    }
    if (reportOnClick == false) {
      setScroll(true)
    } else {
      setScroll(false)
    }
  };
  const handlePrintOnClick = () => {
    let startDate, endDate;
    [startDate, endDate] = DateTimeHelper.getStartEndDate(date, view);
    let fileName = `Scheduler Events Print ${startDate} to ${endDate}`;
    let element = document.getElementsByClassName("k-scheduler");
    if (element && element.length > 0)
      PDFExportHelper.exportPDF(element[0], { fileName: fileName });
  };

  const handleUpdateStatusColor = ({ openDialog, eventStatusColors }) => {
    document.body.classList.add("model-open");
    setOnUpdateStatusColor(!onUpdateStatusColor);
    if (openDialog) {
    }
    if (openDialog == false) {
      document.body.classList.remove("model-open");
    }
    if (onUpdateStatusColor == false) {
      setScroll(true)
    } else {
      setScroll(false)
    }
  };
  const itemRendererColorDropDownList = useCallback(function (element, itemProps) {
    const colorField = resourceFields.eventStatus.colorField;
    const valueField = resourceFields.eventStatus.valueField;
    const children = (createElement(Fragment, null,
      colorField && (createElement("span", {
        key: 1, className: 'k-scheduler-mark', style: {
          backgroundColor: itemProps.dataItem[colorField],
          marginRight: "-4px"
        }
      }, "\u00A0")),
      createElement("span", { key: 2 },
        "\u00A0 ",
        element.props.children)));
    return cloneElement(element, assign({}, element.props), children);
  }, [setResourceFields]);

  const valueRendererColorDropDownList = useCallback(function (element, currentValue) {

    const colorField = resourceFields.eventStatus.colorField;
    const valueField = resourceFields.eventStatus.valueField;
    var children = (createElement(Fragment, null,
      colorField && currentValue && (createElement("span", {
        key: 1, className: 'k-scheduler-mark', style: {
          backgroundColor: (currentValue ? currentValue[colorField] : ""),
          marginRight: "4px"
        }
      }, "\u00A0")),
      element.props.children));
    return cloneElement(element, {}, children);
  }, [setResourceFields]);

  const multiSelectFilterChange = (event) => {
    let name = event.target.name;
    const searchValue = event.filter.value.toLowerCase();

    if (name === resourceFields.staffs.field) {
      if (searchValue.length == 0) {
        setStaffsList([...resourceFields.staffs.data])
      } else {
        setStaffsList(resourceFields.staffs.data.filter(
          x => x.name.toLowerCase().includes(searchValue)))
      }
    }
    else if (name === resourceFields.clients.field) {
      if (searchValue.length == 0) {
        setClientsList([...resourceFields.clients.data])
      } else {
        setClientsList(resourceFields.clients.data.filter(
          x => x.name.toLowerCase().includes(searchValue)))
      }
    }
  };
  const handleClearFilter = useCallback((formRenderProps) => {
    setFilterShow(false);
    setFilterFields({
      staffs: [],
      clients: [],
      eventStatusId: 0
    });
    formRenderProps.onFormReset();
    getEvents(clinicId, date, view);
  });
  const handleApplyFilter = (dataItem) => {
    setFilterShow(false);
    getEvents(clinicId, date, view, dataItem?.staffs, dataItem?.clients, dataItem?.eventStatusId);
  };


  return (
    <div className="">
      {
        loading == true && <Loader />
      }
      <div className="top-bar-show-list">
        <div className="d-flex flex-wrap justify-content-between align-items-center">
          <div className="filter d-flex align-items-center col-lg-4 col-md-6">
            <div className="content-search-filter  dropdown dropleft col-md-11 px-0 mb-4 mb-md-0">
              <div className="filter-calendar"><InputKendoRct className=""
                placeholder="Filter"
              /></div>
              <span onClick={() => { setFilterShow(true); }} className="dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <img src={filterIcon} alt="" className="filter-search" />
              </span>

              <div className="dropdown-menu filter-popup dropdown-filter-menu" aria-labelledby="dropdownMenuButton">
                <div className='current-popup'>
                  <Form ref={refFilterPopup}
                    onSubmit={handleApplyFilter}
                    render={(formRenderProps) => (
                      <FormElement
                      >

                        {/* userAccessPermission.can_see_other_staff_events && */}
                        <div className='form-group mb-1 align-items-center'>
                          <Field component={MultiSelectDropDown}
                            as={MultiSelectDropDown}
                            label={resourceFields.staffs.name}
                            data={staffsList}
                            value={filterFields.staffs}
                            textField={resourceFields.staffs.textField}
                            name={resourceFields.staffs.field}
                            dataItemKey={resourceFields.staffs.valueField}
                            filterable={true}
                            onFilterChange={multiSelectFilterChange}
                          />
                        </div>


                        <div className='form-group mb-1 align-items-center'>
                          <Field component={MultiSelectDropDown}
                            as={MultiSelectDropDown}
                            label={resourceFields.clients.name}
                            data={clientsList}
                            value={filterFields.clients}
                            textField={resourceFields.clients.textField}
                            name={resourceFields.clients.field}
                            dataItemKey={clientsList.clientId}
                            filterable={true}
                            onFilterChange={multiSelectFilterChange}
                          />
                        </div>
                        <div className='form-group mb-1 align-items-center'>
                          <Field component={DropDownList}
                            as={DropDownList}
                            name={resourceFields.eventStatus.field}
                            label={resourceFields.eventStatus.name}
                            data={resourceFields.eventStatus.data}
                            value={filterFields.eventStatusId}
                            textField={resourceFields.eventStatus.textField}
                            dataItemKey={resourceFields.eventStatus.valueField}
                            itemRender={itemRendererColorDropDownList}
                            valueRender={valueRendererColorDropDownList}
                          />
                        </div>

                        <div className="d-flex">
                          <div>
                            <button type='submit' className='btn blue-primary m-2' disabled={!formRenderProps.allowSubmit}>
                              Filter
                            </button>
                          </div>
                          <div>
                            <button id="btnClearFilterForm" type='button' className='btn grey-secondary m-2' onClick={() => handleClearFilter(formRenderProps)}>
                              Clear
                            </button>
                          </div>

                        </div>
                      </FormElement>
                    )}
                  />
                  <form>

                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex">
            <button
              onClick={handleReportOnClick}
              className="btn blue-primary-outline d-flex align-items-center mr-2 btn-sm"
            >
              Report
            </button>
            <button
              onClick={handlePrintOnClick}
              className="btn blue-primary-outline d-flex align-items-center mr-2 btn-sm"
            >
              Print
            </button>

            {
              userAccessPermission[permissionEnum.MANAGE_CALENDAR_SETTINGS] || userSAPermission(staffLoginInfo?.roleId) &&
              <button
                onClick={handleUpdateStatusColor}
                className="btn blue-primary-outline d-flex align-items-center mr-2 btn-sm"
              >
                Edit Event Color
              </button>

            }


            {reportOnClick && (
              <ViewReport
                onClose={handleReportOnClick}
                date={date}
                view={view}
                resourceFields={resourceFields}
                itemRendererColorDropDownList={itemRendererColorDropDownList}
                valueRendererColorDropDownList={valueRendererColorDropDownList}
                loading={loading}
              />
            )}
            {onUpdateStatusColor && (
              <EditStatusColor
                onClose={handleUpdateStatusColor}
                resourceFieldsParam={resourceFields}
              />
            )}
          </div>
        </div>
      </div>
      <Scheduler className="august-calender"
        view={view}
        onViewChange={handleViewChange}
        date={date}
        onDateChange={handleDateChange}
        data={data}
        onDataChange={handleDataChange}
        editable={{
          add: userAccessPermission[permissionEnum.CREATE_EVENTS_OWN_EVENT],
          remove: userAccessPermission[permissionEnum.MANAGE_CALENDAR_SETTINGS]
            || userSAPermission(staffLoginInfo?.roleId),
          drag: userAccessPermission[permissionEnum.MANAGE_CALENDAR_SETTINGS]
            || userSAPermission(staffLoginInfo?.roleId),
          resize: true,
          edit: userAccessPermission[permissionEnum.MANAGE_CALENDAR_SETTINGS]
            || userSAPermission(staffLoginInfo?.roleId),
        }}
        form={AddEditEventFormWrapper}
        modelFields={customModelFields}
        resources={values(resourceFields)}
        item={ViewEvent}
      >
        <DayView workDayStart={clininOpenTime} workDayEnd={clininCloseTime} />
        <WeekView />
        <MonthView />
      </Scheduler>
    </div>
  );
};

export default NoteneticScheduler;
