import { NotificationManager } from "react-notifications";
import moment from "moment";
import { renderErrors } from "src/helper/error-message-helper";

export function isString(variable) {
  return typeof variable === "string" || variable instanceof String;
}

export function showError(error, tag) {
  let message = "";
  if (isString(error)) {
    message = error;
  } else if (error && error.message && isString(error.message)) {
    message = error.message;
  }
  renderErrors(tag ? `${tag} -> ${message}` : message);
}

export function convertToUtcDate(date) {
  return moment(date).utc();
}

export function convertFromUtcDateToDateOnly(dateStr, format = "M/D/YYYY") {
  if (!dateStr) return dateStr;
  const date = dateStr.includes("Z") ? dateStr : dateStr + "Z";
  return moment(date).format(format);
}

export function convertToUtcTime(date, format = "HH:mm") {
  return moment(date).utc().format(format);
}

export function convertFromUtcTimeToTimeOnly(
  dateStr /* "1900-01-01T10:22:00" */,
  format = "HH:mm"
) {
  const parts = dateStr.split("T");
  if (parts.length < 1) return "";
  const date = moment(parts[parts.length - 1], "HH:mm:ss")
    .utc(true)
    .local();
  return date.format(format);
}

export function mergeDateAndTimeInToUtc(date, time) {
  const dateMoment = moment(date);
  const timeMoment = moment(time);
  const dateStr = dateMoment.format("YYYY-MM-DD");
  const timeStr = timeMoment.format("HH:mm:ss");
  const mergedDate = moment(`${dateStr} ${timeStr}`, "YYYY-MM-DD HH:mm:ss");
  console.log(mergedDate, "mergedDatemergedDatemergedDate");
  return mergedDate.utc();
}

export function convertToUtcMorning(date /* 2022-08-22T18:30:00.000Z */) {
  const momentObj = moment(date);
  momentObj.set("hour", 0);
  momentObj.set("minute", 0);
  momentObj.set("second", 0);
  momentObj.set("millisecond", 0);
  return momentObj.utc();
}

export function convertToUtcNight(date /* 2022-08-22T18:30:00.000Z */) {
  const momentObj = moment(date);
  momentObj.set("hour", 23);
  momentObj.set("minute", 59);
  momentObj.set("second", 59);
  momentObj.set("millisecond", 999);
  return momentObj.utc();
}

export function displayDateFromUtcDate(
  utcDate /* 2022-07-28T06:31:51.95 */,
  format
) {
  const momentObj = moment.utc(utcDate).local();
  const year = momentObj.year();
  const month = momentObj.month() + 1;
  const date = momentObj.date();

  const curMomentObj = moment(new Date());
  const curYear = curMomentObj.year();
  const curMonth = curMomentObj.month() + 1;
  const curDate = curMomentObj.date();

  if (format) {
    return momentObj.format(format);
  }
  if (curYear > year) {
    return momentObj.format("YYYY-MM-DD");
  } else if (curMonth > month || curDate > date) {
    return momentObj.format("MMM DD");
  } else {
    return momentObj.format("hh:mm a");
  }
}

export function displayDate(date /* Date Object */, format) {
  const momentObj = moment(date);
  return momentObj.format(format);
}

export function displayDateMMDDYYYY(date /* Date Object */) {
  return displayDate(date, "M/D/YYYY");
}

export function displayTime(date /* Date Object */) {
  return displayDate(date, "hh:mm a");
}
