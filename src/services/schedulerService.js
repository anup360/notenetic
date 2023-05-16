
import ApiUrls from "../helper/api-urls";
import ApiHelper from "../helper/api-helper";
import DateTimeHelper from "../helper/date-time-helper";
import { NotificationManager } from "react-notifications";
import { RRule } from 'rrule';
import { map, find } from "lodash";
import { Encrption } from '../app-modules/encrption';
import { renderErrors } from "src/helper/error-message-helper";

const resources = {
  staffs: {
    name: "Staffs",
    data: [],
    field: "staffs",
    valueField: "id",
    textField: "name",
    multiple: true,
  },
  clients: {
    name: "Clients",
    data: [],
    field: "clients",
    valueField: "id",
    textField: "name",
    multiple: true,
  },
  eventStatus: {
    name: "Status",
    data: [],
    field: "eventStatusId",
    valueField: "id",
    textField: "name",
    colorField: "color",
    value: 1
  },
};

const getEvents = (clinicId, view, date, staffs, clients, eventStatus, userType) => {
  let startDate, endDate;
  [startDate, endDate] = DateTimeHelper.getStartEndDate(date, view);

  return getEventsByFilters(clinicId, startDate, endDate, staffs, clients, eventStatus, userType);

};
const getEventsByFilters = (clinicId, startDate, endDate, staffs, clients, eventStatus, userType) => {
  let staffIds = (staffs && staffs.length > 0 ? map(staffs, "id") : []);
  let clientIds = (clients && clients.length > 0 ? map(clients, "id") : []);
  let eventStatusId = (eventStatus ? eventStatus.id : 0);

  return new Promise((resolve, reject) => {

    ApiHelper.postRequest(
      `${ApiUrls.SCHEDULER.GET_EVENTS}`,
      { clinicId: clinicId, userType: userType, startDate: startDate, endDate: endDate, staffs: staffIds, clients: clientIds, eventStatusId: eventStatusId },
      true
    )
      .then((result) => {
        resolve(transformEventsDataToKendoReadable(result));
      })
      .catch((error) => {
        //TODO://Implement error at common place in API Helper along with loader at common place
        reject(error);
      });
  });
};

const CreateEvent = (event) => {
  let params = preparePostEvent(event);
  return new Promise (  (resolve, reject) => {

    ApiHelper.postRequest(`${ApiUrls.SCHEDULER.CREATE_EVENT}`, params, true)
      .then((eventId) => {
        NotificationManager.success("Event Created Successfully");
        resolve(eventId);
      })
      .catch((error) => {
        //TODO://Implement error at common place in API Helper along with loader at common place
        renderErrors("Error Creating Event");
        reject(error);
      });
  });
};
const UpdateEvent = (event) => {
  let params = preparePostEvent(event);
  return new Promise((resolve, reject) => {
    ApiHelper.putRequest(`${ApiUrls.SCHEDULER.UPDATE_EVENT}`, params, true)
      .then((eventId) => {
        NotificationManager.success("Event Updated Successfully");
        resolve(eventId);
      })
      .catch((error) => {
        //TODO://Implement error at common place in API Helper along with loader at common place
        renderErrors("Error Updating Event");
        reject(error);
      });
  });
};
const DeleteEvent = (id) => {
  return new Promise((resolve, reject) => {
    ApiHelper.deleteRequest(ApiUrls.SCHEDULER.DELETE_EVENT + id, null, true)
      .then((eventId) => {
        NotificationManager.success("Event Deleted Successfully");
        resolve(eventId);
      })
      .catch((error) => {
        //TODO://Implement error at common place in API Helper along with loader at common place
        renderErrors("Error Deleting Event");
        reject(error);
      });
  });
};

const UpdateEventStaffStatusColor = (statusColors) => {
  return new Promise((resolve, reject) => {
    ApiHelper.putRequest(`${ApiUrls.SCHEDULER.UPDATE_STAFF_STATUS_COLOR}`, statusColors, true)
      .then((response) => {
        NotificationManager.success("Event Status Color Updated Successfully");
        resolve();
      })
      .catch((error) => {
        //TODO://Implement error at common place in API Helper along with loader at common place
        renderErrors("Error Updating Event Status Color");
        reject(error);
      });
  });
};

//#region private methods
const transformEventsDataToKendoReadable = (data) => {

  return data.map((dataItem) => ({
    ...dataItem,
    id: dataItem.id,
    start: new Date(dataItem.dateStart),
    end: new Date(dataItem.dateEnd),
    isAllDay: dataItem.isAllDay,
    isTelehealth: dataItem.isTelehealth,
    title: dataItem.title,
    description: dataItem.description,
    recurrenceRule: dataItem.recurrenceRule,
    recurrenceExceptions: (dataItem.recurrenceExceptions && dataItem.recurrenceExceptions.length > 0 ? dataItem.recurrenceExceptions.split(",").map((d) => new Date(d)) : [])
  }));
};
const preparePostEvent = (event) => {
  let recurrenceExceptionsCommaSeprated = "";
 
  event.dateRecurrenceEnd = event.dateRecurrenceEnd = DateTimeHelper.formatFullDateTimeString(event.end);

  if (event.recurrenceRule != null) {
    let endDate = getRecurrenceEndDate(event.recurrenceRule, DateTimeHelper.formatFullDateTimeStringYYYYYMMDDHHmmss(event.start));
    if (endDate) {
      event.dateRecurrenceEnd = DateTimeHelper.formatFullDateTimeString(endDate);
    }
  }

  if (event.recurrenceExceptions)
    recurrenceExceptionsCommaSeprated = event.recurrenceExceptions
      .map((d) => DateTimeHelper.formatFullDateTimeString(d))
      .join(",");

  if (event.staffs)
    event.staffs = event.staffs.filter(x => x > 0);

  if (event.clients)
    event.clients = event.clients;

  if (event.isAllDay && event.isAllDay == true) {
    let timeToAddStart = (event.clinicOpenTime ? event.clinicOpenTime : "00:00:00");
    event.start = DateTimeHelper.addTimeToTheDate(event.start, timeToAddStart);

    let timeToAddEnd = (event.clinicCloseTime ? event.clinicCloseTime : "11:59:00");
    event.end = DateTimeHelper.addTimeToTheDate(event.end, timeToAddEnd);
  }
  // else
  // {
  //   event.start = DateTimeHelper.formatFullDateTimeString(event.start);
  //   event.end = DateTimeHelper.formatFullDateTimeString(event.end);
  // }
  let telehealthValue = event.isTelehealth ?? false ;
 

  return {
    ...event,
    dateStart: DateTimeHelper.formatFullDateTimeString(event.start),
    dateEnd: DateTimeHelper.formatFullDateTimeString(event.end),
    recurrenceExceptions: recurrenceExceptionsCommaSeprated,
    isTelehealth: telehealthValue,

  };
};

const getRecurrenceDates = (ruleString, start) => {

  if (!ruleString || ruleString === "")
    return null;
  ruleString = `${ruleString};DTSTART=${start}`
  let rule = RRule.fromString(ruleString);

  if (rule.options.count == null && rule.options.until == null) {
    rule.options.until = DateTimeHelper.add(rule.options.dtstart, 1, "years");
  }
  return rule.all();
};
const getRecurrenceEndDate = (ruleString, start) => {
  let allEventDates = getRecurrenceDates(ruleString, start);
  if (allEventDates.length > 0)
    return allEventDates[allEventDates.length - 1]
  else
    return null;

};
const getRecurrenceByDateGate = (ruleString, start, end, filterStart, filterEnd) => {
  let diff = DateTimeHelper.DatesDiff(start, end);
  let allEventDates = getRecurrenceDates(ruleString, DateTimeHelper.formatFullDateTimeStringYYYYYMMDDHHmmss(start));
  if (allEventDates.length > 0) {
    let allEventStartEnd = allEventDates.map(e => ({ start: e, end: DateTimeHelper.addDiff(e, diff).toDate() }));
    return allEventStartEnd.filter(x => x.start >= filterStart && x.start <= filterEnd);
  }
  else
    return null;

};
const commaSepratedString = (arr, arrData, limit) => {
  let arrLength = arr?.length;
  if (arrData && arrData.length > 0) {
    if (limit)
      arr = arr.slice(0, limit);
    let names = map(arr.map(i => find(arrData, x => x.id == i)), "name");
    if (names) {
      if (limit) {
        if (arrLength > limit)
          names.push("etc.")
      }
      return names.join(",");
    }
  }
  return "";
};
const getCommaSepratedStaffNames = (arr, limit) => {
  return commaSepratedString(arr, resources.staffs.data, limit);
};
const getCommaSepratedClientNames = (arr, limit) => {
  return commaSepratedString(arr, resources.clients.data, limit);
};
const getEventStatusName = (eventStatusId) => {
  if (resources.eventStatus && resources.eventStatus.data) {
    let statusName = find(resources.eventStatus.data, x => x.id === eventStatusId);
    if (statusName)
      return statusName.name;
  }
  return "";
};
//#endregion

export const SchedulerService = {
  resources,
  getEvents,
  getEventsByFilters,
  CreateEvent,
  UpdateEvent,
  DeleteEvent,
  UpdateEventStaffStatusColor,
  getCommaSepratedStaffNames,
  getCommaSepratedClientNames,
  getEventStatusName,
  getRecurrenceByDateGate
};
