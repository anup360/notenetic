import {
  useEffect,
  useState,
  useCallback,
  createElement,
  Fragment,
  cloneElement,
  createRef,
} from "react";
import each from "lodash/each";
import filter from "lodash/filter";
import find from "lodash/find";
import assign from "lodash/assign";
import map from "lodash/map";
import some from "lodash/some";
import InputKendoRct from "../../control-components/input/input";
import DateTimePickerKendoRct from "../../control-components/date-time-picker/date-time-picker";
import DatePickerKendoRct from "../../control-components/date-picker/date-picker";
import TimePickerKendoRct from "../../control-components/time-picker/time-picker";
import MultiSelectDropDown from "../../control-components/multi-select-drop-down/multi-select-drop-down";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Switch } from "@progress/kendo-react-inputs";
import { SchedulerService } from "../../services/schedulerService";
import { FormElement, Field } from "@progress/kendo-react-form";
import DateTimeHelper from "../../helper/date-time-helper";
import Utils from "../../helper/utils";
import KendoFormHelper from "../../helper/kendo-form-helper";
import { useSchedulerFieldsContext } from "@progress/kendo-react-scheduler";
import useModelScroll from '../../cutomHooks/model-dialouge-scroll'
import { permissionEnum } from "src/helper/permission-helper";
import { useSelector } from "react-redux";


export const AddEditEventFormEditor = (props) => {

  var startTimeDivRef = createRef();
  var endTimeDivRef = createRef();
  const [modelScroll, setScroll] = useModelScroll()

  const staffLoginInfo = useSelector((state) => state.getStaffReducer);
  const userAccessPermission = useSelector((state) => state.userAccessPermission);



  const selectAllOption = { id: 0, name: "Select All" };

  const [resourceFields, setResourceFields] = useState(
    SchedulerService.resources
  );

  const fieldsContext = useSchedulerFieldsContext();

  const [fields, setFields] = useState({
    ...props,
    isAllDay: false,
    isTelehealth: false,
    staffs: [],
    clients: [],
    eventStatusId: {},
  });
  const [fieldsValue, setFieldsValue] = useState({});
  const [staffsList, setStaffsList] = useState([
    selectAllOption,
    ...resourceFields.staffs.data,
  ]);
  const [clientsList, setClientsList] = useState([
    selectAllOption,
    ...resourceFields.clients.data,
  ]);





  useEffect(() => {
    if (!userAccessPermission[permissionEnum.CREATE_EVENTS_FOR_OTHER_STAFF]) {
      let newArry = fields.staffs
      newArry.push({ id: staffLoginInfo.id, name: staffLoginInfo.lastName + ", " + staffLoginInfo.firstName })
      setFields({
        ...fields,
        staffs: newArry,
      });
    }
  }, [fields.staffs])


  useEffect(() => {
    //set fieldsValue

    each(fieldsContext, (val, key) => {
      fieldsValue[key] = () => KendoFormHelper.getValue(props, val);
    });


    setStartEndKendoSchedulerValues();

    let selectedStaffIds = fieldsValue.staffs();
    let filteredStaffs = filter(
      SchedulerService.resources.staffs.data,
      (x) => selectedStaffIds.indexOf(x.id) > -1
    );
    let selectedClientIds = fieldsValue.clients();
    let filteredClients = filter(
      SchedulerService.resources.clients.data,
      (x) => selectedClientIds.indexOf(x.id) > -1
    );
    let eventStatusId = fieldsValue.eventStatusId();
    let filteredEventStatus = find(
      SchedulerService.resources.eventStatus.data,
      (x) => eventStatusId == x.id
    );
    let allDay = fieldsValue.isAllDay();
    let allTelehealth = fieldsValue.isTelehealth();


    // isTelehealthOnChange({ value: false });

    setFields({
      ...fields,
      staffs: filteredStaffs,
      clients: filteredClients,
      eventStatusId: filteredEventStatus,
      isAllDay: allDay,
      isTelehealth: allTelehealth
    });

    let rule = fieldsValue.recurrenceRule();
    if (rule && rule.length > 0) hideRecurrenceEndNeverOption();
  }, [setFields, setFieldsValue, setResourceFields]);

  const dateTimeOnChange = (event) => {
    setStartEndKendoSchedulerValues();
  };

  const isAllDayOnChange = (event) => {
    setFields({ ...fields, isAllDay: event.value });
    setStartEndKendoSchedulerValues();
  };

  const isTelehealthOnChange = (event) => {
    setFields({ ...fields, isTelehealth: event.value });

  }

  const setStartEndKendoSchedulerValues = () => {
    if (fieldsValue.isAllDay()) {
      startTimeDivRef.current.className =
        startTimeDivRef.current.className + " d-none";
      endTimeDivRef.current.className =
        endTimeDivRef.current.className + " d-none";
      KendoFormHelper.setValue(props, fieldsContext.startTime, {
        value: DateTimeHelper.truncateTime(fieldsValue.startTime()),
      });
      KendoFormHelper.setValue(props, fieldsContext.endTime, {
        value: DateTimeHelper.truncateTime(fieldsValue.endTime()),
      });
    } else {
      startTimeDivRef.current.className = Utils.splitReplaceRemoveJoinString(
        startTimeDivRef.current.className,
        " ",
        "d-none"
      );
      endTimeDivRef.current.className = Utils.splitReplaceRemoveJoinString(
        endTimeDivRef.current.className,
        " ",
        "d-none"
      );
    }
    let concatStartDateTime = DateTimeHelper.concatDateTimeOfTwoDates(
      fieldsValue.startDate(),
      fieldsValue.startTime()
    );
    let concatEndDateTime = DateTimeHelper.concatDateTimeOfTwoDates(
      fieldsValue.endDate(),
      fieldsValue.endTime()
    );
    KendoFormHelper.setValue(props, fieldsContext.start, {
      value: concatStartDateTime,
    });
    KendoFormHelper.setValue(props, fieldsContext.end, {
      value: concatEndDateTime,
    });
    // KendoFormHelper.setValue(props, fields.isTelehealth, {
    //   value: fields.isTelehealth,
    // });

  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFields({
      ...fields,
      [name]: value,
    });
    KendoFormHelper.setValue(props, name, { value: value.id });
  };

  const multiSelectHandleChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    let currentList = [];
    let dataList = [];

    if (name == fieldsContext.staffs) {
      currentList = fieldsValue.staffs();
      dataList = staffsList;
    } else if (name == fieldsContext.clients) {
      currentList = fieldsValue.clients();
      dataList = clientsList;
    }

    const currentSelectAll = some(currentList, (x) => x == selectAllOption.id);
    const nextSelectAll = some(value, (x) => x.id == selectAllOption.id);
    const currentCount = currentList.length;
    const nextCount = value.length;

    if (
      nextCount > currentCount &&
      !currentSelectAll &&
      !nextSelectAll &&
      dataList.length - 1 === nextCount
    ) {
      value = dataList;
    } else if (
      nextCount < currentCount &&
      currentCount === dataList.length &&
      currentSelectAll &&
      nextSelectAll
    ) {
      value = value.filter((v) => v.id !== selectAllOption.id);
    } else if (!currentSelectAll && nextSelectAll) {
      value = dataList;
    } else if (currentSelectAll && !nextSelectAll) {
      value = [];
    }

    setFields({
      ...fields,
      [name]: value,
    });

    KendoFormHelper.setValue(props, name, { value: map(value, "id") });
  };
  const multiSelectFilterChange = (event) => {
    let name = event.target.name;
    const searchValue = event.filter.value.toLowerCase();

    if (name === fieldsContext.staffs) {
      if (searchValue.length == 0) {
        setStaffsList([selectAllOption, ...resourceFields.staffs.data]);
      } else {
        setStaffsList(
          resourceFields.staffs.data.filter((x) =>
            x.name.toLowerCase().includes(searchValue)
          )
        );
      }
    } else if (name === fieldsContext.clients) {
      if (searchValue.length == 0) {
        setClientsList([selectAllOption, ...resourceFields.clients.data]);
      } else {
        setClientsList(
          resourceFields.clients.data.filter((x) =>
            x.name.toLowerCase().includes(searchValue)
          )
        );
      }
    }
  };
  const recurrenceEditorHandleChange = (e) => {
    if (e && e.value && e.value.length > 0) {
      if (
        e.value.toLowerCase().indexOf("count") < 0 &&
        e.value.toLowerCase().indexOf("until") < 0
      ) {
        KendoFormHelper.setValue(props, fieldsContext.recurrenceRule, {
          value: e.value + ";COUNT=1",
        });
        hideRecurrenceEndNeverOption();
      }
    }
  };

  const hideRecurrenceEndNeverOption = () => {
    setTimeout(() => {
      let endRadioGroupli = document.querySelectorAll(
        "div.k-dialog-wrapper.k-scheduler-edit-dialog > div.k-widget.k-window.k-dialog > div.k-window-content.k-dialog-content > form > div > div:nth-child(4) > div > div:nth-child(3) > div > ul > li"
      );
      if (endRadioGroupli && endRadioGroupli.length === 3) {
        let endNever = endRadioGroupli[0];
        endNever.remove();
      }
    });
  };

  const itemRendererColorDropDownList = useCallback(
    function (element, itemProps) {
      const colorField = resourceFields.eventStatus.colorField;
      const valueField = resourceFields.eventStatus.valueField;
      const children = createElement(
        Fragment,
        null,
        colorField &&
        createElement(
          "span",
          {
            key: 1,
            className: "k-scheduler-mark",
            style: {
              backgroundColor: itemProps.dataItem[colorField],
              marginRight: "-4px",
            },
          },
          "\u00A0"
        ),
        createElement("span", { key: 2 }, "\u00A0 ", element.props.children)
      );
      return cloneElement(element, assign({}, element.props), children);
    },
    [setResourceFields]
  );



  const valueRendererColorDropDownList = useCallback(
    function (element, currentValue) {
      const colorField = resourceFields.eventStatus.colorField;
      const valueField = resourceFields.eventStatus.valueField;
      var children = createElement(
        Fragment,
        null,
        colorField &&
        currentValue &&
        createElement(
          "span",
          {
            key: 1,
            className: "k-scheduler-mark",
            style: {
              backgroundColor: currentValue[colorField],
              marginRight: "4px",
            },
          },
          "\u00A0"
        ),
        element.props.children
      );
      return cloneElement(element, {}, children);
    },
    [setResourceFields]
  );

  const renderCheckboxInMultiSelect = (li, itemProps) => {
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
    return cloneElement(li, li.props, itemChildren);
  };


  return (
    <FormElement horizontal={false}  >
      <div className="client-accept edit-client-popup">
        <div className="row">
          <div className="mb-3 col-lg-12 col-md-12 col-12">
            <Field
              name={fieldsContext.title}
              component={InputKendoRct}
              label={"Title"}
              as={InputKendoRct}
              error={props.visited && props.touched && props.errors.title}
              required={props.visited && props.touched}
              validityStyles={true}
            />
          </div>
        </div>

        <div className="row">

          <div className="col-md-6  mb-4">
            <span className="k-label">
              <strong className="mt-2">Telehealth Event</strong>
              <div className="switch-on pl-2">
                <Field
                  name={"isTelehealth"}
                  component={Switch}
                  as={Switch}
                  value={fields.isTelehealth}
                  checked={fields.isTelehealth}
                  label="Is Telehealth Event"
                  onChange={isTelehealthOnChange}
                  onLabel={""}
                  offLabel={""}
                />
              </div>
            </span>
          </div>
          <div className="col-md-6 day_event  mb-4 ">
            <span className="k-label">
              <strong className="mt-2">All Day</strong>
              <div className="switch-on pl-2">
                <Field
                  name={"isAllDay"}
                  component={Switch}
                  as={Switch}
                  value={fields.isAllDay}
                  checked={fields.isAllDay}
                  label="All Day"
                  onChange={isAllDayOnChange}
                  onLabel={""}
                  offLabel={""}
                />
              </div>
            </span>
          </div>
        </div>






        <div className="d-none row">
          <div className="mb-3 col-lg-3 col-md-3 col-6">
            <Field
              name={fieldsContext.start}
              component={props.startEditor || DateTimePickerKendoRct}
              as={DateTimePickerKendoRct}
              label={"Start"}
              value={fields.start}
              validator={props.startError}
            />
          </div>
          <div className="mb-3 col-lg-3 col-md-3 col-6">
            <Field
              name={fieldsContext.end}
              component={props.endEditor || DateTimePickerKendoRct}
              as={DateTimePickerKendoRct}
              label={"End"}
              validator={props.endError}
            />
          </div>
        </div>
        <div className="row">
          <div className="mb-3 col-lg-3 col-md-3 col-sm-6 col-12">
            <Field
              name={fieldsContext.startDate}
              component={DatePickerKendoRct}
              as={DatePickerKendoRct}
              label={"Start Date"}
              onChange={dateTimeOnChange}
              value={fields.startDate}
              required={props.visited && props.touched}
              error={props.visited && props.touched && props.errors.startDate}
              validityStyles={true}
            />
          </div>
          <div
            className="mb-3 col-lg-3 col-md-3 col-sm-6 col-12 icon-time"
            ref={startTimeDivRef}
          >
            <Field
              name={fieldsContext.startTime}
              component={TimePickerKendoRct}
              as={TimePickerKendoRct}
              label={"Start Time"}
              onChange={dateTimeOnChange}
              value={fields.startTime}
              required={props.visited && props.touched}
              error={props.visited && props.touched && props.errors.startTime}
              validityStyles={true}
            />
          </div>
          <div className="mb-3 col-lg-3 col-md-3 col-sm-6 col-12">
            <Field
              name={fieldsContext.endDate}
              component={DatePickerKendoRct}
              as={DatePickerKendoRct}
              label={"End Date"}
              onChange={dateTimeOnChange}
              value={fields.endDate}
              required={props.visited && props.touched}
              error={props.visited && props.touched && props.errors.endDate}
              validityStyles={true}
            />
          </div>
          <div
            className="mb-3 col-lg-3 col-md-3 col-sm-6 col-12 icon-time"
            ref={endTimeDivRef}
          >
            <Field
              name={fieldsContext.endTime}
              component={TimePickerKendoRct}
              as={TimePickerKendoRct}
              label={"End Time"}
              onChange={dateTimeOnChange}
              value={fields.endTime}
              required={props.visited && props.touched}
              error={props.visited && props.touched && props.errors.endTime}
              validityStyles={true}
            />
          </div>
        </div>
        <div className="row">
          <div className="mb-3 col-lg-12 col-md-12 col-12">
            <Field
              name={fieldsContext.recurrenceRule}
              component={props.recurrenceEditor}
              start={props.valueGetter("start")}
              onChange={recurrenceEditorHandleChange}
            />
          </div>
        </div>
        {resourceFields?.staffs && (
          <div className="row">
            <div className="mb-3 col-lg-12 col-md-12 col-12">
              <MultiSelectDropDown
                label={resourceFields.staffs.name}
                onChange={multiSelectHandleChange}
                data={staffsList}
                value={fields.staffs}
                textField={resourceFields.staffs.textField}
                name={fieldsContext.staffs}
                dataItemKey={resourceFields.staffs.valueField}
                itemRender={renderCheckboxInMultiSelect}
                filterable={true}
                onFilterChange={multiSelectFilterChange}
                required={props.visited && props.touched}
                error={props.visited && props.touched && props.errors.staffs}
                validityStyles={true}
                disabled={!userAccessPermission[permissionEnum.CREATE_EVENTS_FOR_OTHER_STAFF] && true}
              />
            </div>
          </div>
        )}
        {resourceFields?.clients && (
          <div className="row">
            <div className="mb-3 col-lg-12 col-md-12 col-12">
              <MultiSelectDropDown
                label={resourceFields.clients.name}
                onChange={multiSelectHandleChange}
                data={clientsList}
                value={fields.clients}
                textField={resourceFields.clients.textField}
                name={fieldsContext.clients}
                dataItemKey={resourceFields.clients.valueField}
                itemRender={renderCheckboxInMultiSelect}
                filterable={true}
                onFilterChange={multiSelectFilterChange}
              />
            </div>
          </div>
        )}
        <div className="row">
          <div className="mb-3 col-lg-12 col-md-12 col-12">
            <label className="k-label">Comments</label>
            <Field name={"description"} component={props.descriptionEditor} />
          </div>
        </div>
        {resourceFields?.eventStatus && (
          <div className="row">
            <div className="mb-3 col-lg-12 col-md-12 col-12">
              <DropDownList
                name={fieldsContext.eventStatusId}
                label={resourceFields.eventStatus.name}
                onChange={handleChange}
                data={resourceFields.eventStatus.data}
                value={fields.eventStatusId}
                textField={resourceFields.eventStatus.textField}
                dataItemKey={resourceFields.eventStatus.valueField}
                itemRender={itemRendererColorDropDownList}
                valueRender={valueRendererColorDropDownList}
              />
            </div>
          </div>
        )}
      </div>
    </FormElement>
  );
};
