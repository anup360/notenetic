import { useState, useCallback, useEffect } from "react";
import {
  SchedulerForm,
  useSchedulerFieldsContext,
} from "@progress/kendo-react-scheduler";
import { Error } from "@progress/kendo-react-labels";
import first from "lodash/first"
import { AddEditEventDialog } from "./add-edit-event-dialog";
import { AddEditEventFormEditor } from "./add-edit-event-form-editor";
import { SchedulerService } from "../../services/schedulerService";
import ValidationHelper from "../../helper/validation-helper";
import DateTimeHelper from "../../helper/date-time-helper";
import { useSelector } from "react-redux";
import useModelScroll from '../../cutomHooks/model-dialouge-scroll'
import { permissionEnum } from "src/helper/permission-helper";


export const AddEditEventFormWrapper = (props) => {

  const vHelper = ValidationHelper();
  const isUpdateMode = props.dataItem.hasOwnProperty("id");
  const fieldsContext = useSchedulerFieldsContext();
  const clinicOpenTime = useSelector((state) => state.loggedIn.openTime);
  const clinicCloseTime = useSelector((state) => state.loggedIn.closeTime);
  const [modelScroll, setScroll] = useModelScroll();
  const [teleHealthValue, setTeleHealth] = useState(props.dataItem.isTelehealth)
  const userAccessPermission = useSelector((state) => state.userAccessPermission);


  const [fieldLabels, setFieldLabels] = useState({
    title: "Title",
    startDate: "Start Date",
    startTime: "Start Time",
    endDate: "End Date",
    endTime: "End Time",
    staffs: "Staffs",
  }, [fieldsContext]);

  props.dataItem.startDate = props.dataItem.start;
  props.dataItem.endDate = props.dataItem.end;
  props.dataItem.startTime = props.dataItem.start;
  props.dataItem.endTime = props.dataItem.end;

  if (isUpdateMode === false) {
    props.dataItem.isAllDay = false;
    if (SchedulerService.resources.eventStatus.data)
      props.dataItem.eventStatusId = first(SchedulerService.resources.eventStatus.data).id;

    props.dataItem.end = props.dataItem.start;
    props.dataItem.endDate = props.dataItem.start;

    let timeToAddStart = (clinicOpenTime ? clinicOpenTime : "00:00:00");
    let timeToStart = DateTimeHelper.addTimeToTheDate(props.dataItem.start, timeToAddStart);
    props.dataItem.start = timeToStart;
    props.dataItem.startDate = timeToStart;
    props.dataItem.startTime = timeToStart;

    let timeToAddEnd = (clinicCloseTime ? clinicCloseTime : "11:59:00");
    let timeToEnd = DateTimeHelper.addTimeToTheDate(props.dataItem.end, timeToAddEnd);
    props.dataItem.end = timeToEnd;
    props.dataItem.endDate = timeToEnd;
    props.dataItem.endTime = timeToEnd;
  }

  const LazyError = (props) => {
    return props.visited && props.touched ? <Error {...props} /> : null;
  };

  const schedulerFormValidator = useCallback(
    (_dataItem, formValueGetter) => {
      let errors = {};
      let isAllDayEvent = formValueGetter(fieldsContext.isAllDay);
      errors[fieldsContext.title] = vHelper.reduceErrors([vHelper.requiredValidator(formValueGetter(fieldsContext.title), fieldLabels.title)]);
      errors[fieldsContext.staffs] = !userAccessPermission[permissionEnum.CREATE_EVENTS_FOR_OTHER_STAFF] ? "" : vHelper.reduceErrors([vHelper.requiredValidator(formValueGetter(fieldsContext.staffs), fieldLabels.staffs)]);
      errors[fieldsContext.startDate] = vHelper.reduceErrors([
        vHelper.requiredValidator(formValueGetter(fieldsContext.startDate), fieldLabels.startDate),
        vHelper.startDateLessThanEndDateValidator(formValueGetter(fieldsContext.start), formValueGetter(fieldsContext.end), fieldLabels.startDate, fieldLabels.endDate)
      ],

      );
      errors[fieldsContext.endDate] = vHelper.reduceErrors([vHelper.requiredValidator(formValueGetter(fieldsContext.endDate), fieldLabels.endDate)]);
      if (isAllDayEvent == true) {
        errors[fieldsContext.startTime] = "";
        errors[fieldsContext.endTime] = "";
      }
      else {
        errors[fieldsContext.startTime] = vHelper.reduceErrors([vHelper.requiredValidator(formValueGetter(fieldsContext.startTime), fieldLabels.startTime)]);
        errors[fieldsContext.endTime] = vHelper.reduceErrors([vHelper.requiredValidator(formValueGetter(fieldsContext.endTime), fieldLabels.endTime)]);
      }

      return errors;
    }, [fieldLabels, vHelper.requiredValidator, vHelper.reduceErrors, vHelper.startDateLessThanEndDateValidator]);





  return <SchedulerForm className="dsfsdfdsfdsfsd" {...props}
    startError={LazyError}
    endError={LazyError}
    editor={AddEditEventFormEditor}
    dialog={AddEditEventDialog}
    validator={schedulerFormValidator}

  />;
};
