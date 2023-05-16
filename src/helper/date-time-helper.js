import moment from "moment";
const DATE_FORMAT = "YYYY-MM-DD";
const TIME_FORMAT = "HH:mm:ss";
const TIME_FORMAT_HOURS = "HH:mm";
const DATE_T_TIME_FORMAT = `${DATE_FORMAT}T${TIME_FORMAT}`;
const DATE_PICKER_DATE_FORMAT = "M/D/YYYY";
const DATE_TIME_FORMAT_GRID = `M/D/YYYY h:mm a`;

const format = (dateTime, format) => {
  return moment(dateTime).format(format);
};
const formatFullDateString = (dateTime) => {
  return moment(dateTime).format(DATE_FORMAT);
};
const formatFullTimetring = (dateTime) => {
  return moment(dateTime).format(TIME_FORMAT);
};

const formatFullTimeHours = (dateTime) => {
  return moment(dateTime).format(TIME_FORMAT_HOURS);
};
const formatFullDateTimeString = (dateTime) => {
  return moment(dateTime).format(DATE_T_TIME_FORMAT);
};
const formatGridDateTimeString = (dateTime) => {
  return moment(dateTime).format(DATE_TIME_FORMAT_GRID);
};
const formatFullDateTimeStringYYYYYMMDDHHmmss = (dateTime) => {
  return moment(dateTime).format("YYYYMMDDTHHmmss");
};
const formatDatePickerString = (dateTime) => {
  return moment(dateTime).format(DATE_PICKER_DATE_FORMAT);
};
const add = (date, count, type) => {
  return moment(date).add(count, type);
};
const addDiff = (date, number) => {
  return moment(date).add(number);
};
const getStartEndDateAsMoment = (date, type) => {
  let startDate, endDate;
  [startDate, endDate] = getStartEndDate(date, type);
  return [moment(startDate), moment(endDate)];
};
const getStartEndDate = (date, type) => {
  let d;
  if (date.hasOwnProperty("_localDate"))
    d = date._localDate;
  else
    d = moment(date);
  return [formatFullDateString(d.startOf(type)), formatFullDateString(d.endOf(type))];
};
const concatDateTimeOfTwoDates = (dateObject, timeObject) => {
  let dateStr = formatFullDateString(moment(dateObject));
  let timeStr = formatFullTimetring(moment(timeObject));
  return moment(dateStr + timeStr, DATE_FORMAT + TIME_FORMAT).toDate();
};
const truncateTime = (dateTime) => {
  return moment(dateTime).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate();
};
const isStartDateGreaterThanEndDate = (startDate, endDate) => {
  return moment(startDate).isAfter(endDate);
};
const DatesDiff = (start, end) => {
  return moment(end).diff(start);

};
const addTimeToTheDate = (date, time) => {
  if (time && time.length === 5)
    time = time + ":00";
  return moment(formatFullDateString(date) + time, DATE_FORMAT + TIME_FORMAT).toDate();
}
const localDateToUtc = (date) => {
  const utcDate = moment(date).utc()
  // console.log("localDateToUtc", date, utcDate)
  return utcDate
}
const utcDateToLocal = (date) => {
  const localDate = moment.utc(date).local()
  // console.log("utcDateToLocal", date, localDate)
  return localDate
}
const DateTimeHelper = {
  localDateToUtc, utcDateToLocal,
  format, formatFullDateString, formatFullTimetring, formatFullTimeHours, formatFullDateTimeString, formatDatePickerString, formatFullDateTimeStringYYYYYMMDDHHmmss, formatGridDateTimeString, add, addDiff, getStartEndDateAsMoment, getStartEndDate, concatDateTimeOfTwoDates, truncateTime, isStartDateGreaterThanEndDate, DatesDiff, addTimeToTheDate
};

export default DateTimeHelper;
