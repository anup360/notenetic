import { useState, useEffect, useRef } from "react";
import { Dialog } from "@progress/kendo-react-dialogs";
import { Grid, GridColumn, GridNoRecords, GridToolbar } from '@progress/kendo-react-grid';
import { ExcelExport } from '@progress/kendo-react-excel-export';
import { GridPDFExport } from "@progress/kendo-react-pdf";
import { SchedulerService } from "../../services/schedulerService";
import DatePickerKendoRct from "../../control-components/date-picker/date-picker";
import MultiSelectDropDown from "../../control-components/multi-select-drop-down/multi-select-drop-down";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import DateTimeHelper from "../../helper/date-time-helper";
import { useSelector } from "react-redux";
import { UserType } from "../../helper/enums";
import Loader from "../../control-components/loader/loader";
import { forEach, sortBy } from "lodash";
import ValidationHelper from "../../helper/validation-helper";
import useModelScroll from '../../cutomHooks/model-dialouge-scroll'
import { permissionEnum } from "src/helper/permission-helper";


export const ViewReport = ({ onClose, date, view, resourceFields, itemRendererColorDropDownList, valueRendererColorDropDownList }) => {
    const vHelper = ValidationHelper();
    const [loading, setLoading] = useState(false);
    let pdfExport = useRef(null);
    const excelExport = useRef(null);
    const clinicId = useSelector((state) => state.loggedIn.clinicId);
    const [data, setData] = useState([]);
    const [errors, setErrors] = useState({});
    const [modelScroll, setScroll] = useModelScroll()
    const userAccessPermission = useSelector((state) => state.userAccessPermission);
    const [filterFields, setFilterFields] = useState({
        startDate: new Date(),
        endDate: new Date(),
        staffs: [],
        clients: [],
        eventStatusId: undefined
    });
    const [filterFieldsName] = useState(Object.keys(filterFields).reduce((a, v) => ({ ...a, [v]: v }), {}));
    useEffect(() => {
        let startDateOfView, endDateOfView;
        [startDateOfView, endDateOfView] = DateTimeHelper.getStartEndDateAsMoment(date, view);
        setFilterFields({ ...filterFields, startDate: new Date(startDateOfView), endDate: new Date(endDateOfView) });
    }, [setFilterFields])


    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setFilterFields({
            ...filterFields,
            [name]: value,
        });
    };

    const handleExportOnClick = (isExcel) => {
        if (handleValidation()) {
            getEvents().then((events) => {
                setTimeout(() => {
                    exportFile(isExcel);
                });

            });
        }
    };

    const handleClose = () => {
        onClose({ openCloseReportDialog: false });
    };
    const getEvents = () => {
        setLoading(true);
        return SchedulerService.getEventsByFilters(clinicId, filterFields.startDate, filterFields.endDate, filterFields.staffs, filterFields.clients, filterFields.eventStatusId, UserType.STAFF).then(
            (events) => {
                let eventsData = [];
                forEach(events, (dataItem) => {
                    let event = {
                        id: dataItem.id,
                        title: dataItem.title,
                        isAllDay: dataItem.isAllDay,
                        startDate: (dataItem.isAllDay ? DateTimeHelper.formatDatePickerString(dataItem.start) : DateTimeHelper.formatGridDateTimeString(dataItem.start)),
                        endDate: (dataItem.isAllDay ? DateTimeHelper.formatDatePickerString(dataItem.end) : DateTimeHelper.formatGridDateTimeString(dataItem.end)),
                        staffs: SchedulerService.getCommaSepratedStaffNames(dataItem.staffs),
                        clients: SchedulerService.getCommaSepratedClientNames(dataItem.clients),
                        status: SchedulerService.getEventStatusName(dataItem.eventStatusId)
                    };
                    if (dataItem.recurrenceRule && dataItem.recurrenceRule.trim() != "") {
                        let recurrenceEvents = SchedulerService.getRecurrenceByDateGate(dataItem.recurrenceRule, dataItem.start, dataItem.end, filterFields.startDate, filterFields.endDate);
                        forEach(recurrenceEvents, (rEvent) => {
                            eventsData.push({
                                ...event,
                                startDate: (dataItem.isAllDay ? DateTimeHelper.formatDatePickerString(rEvent.start) : DateTimeHelper.formatGridDateTimeString(rEvent.start)),
                                endDate: (dataItem.isAllDay ? DateTimeHelper.formatDatePickerString(rEvent.end) : DateTimeHelper.formatGridDateTimeString(rEvent.end))
                            });
                        });
                    }
                    else {
                        eventsData.push(event);
                    }
                });
                eventsData = sortBy(eventsData, "startDate");
                setData(eventsData);
                setLoading(false);
            }
        );
    };
    const exportFile = (isExcel) => {
        let exporter = (isExcel ? excelExport : pdfExport)
        if (exporter.current !== null) {
            exporter.current.save();
        }
    };
    const handleValidation = () => {
        let errors = {};

        errors[filterFieldsName.startDate] =
            vHelper.reduceErrors([
                vHelper.requiredValidator(filterFields.startDate, "Start Date"),
                vHelper.startDateLessThanEndDateValidator(filterFields.startDate, filterFields.endDate, "Start Date", "End Date")
            ]);
        errors[filterFieldsName.endDate] = vHelper.requiredValidator(filterFields.endDate, "End Date");

        setErrors(errors);

        return !vHelper.hasError(errors);
    };

    const grid = (<Grid data={data}
        style={{
            height: data.length > 0 ? "100%" : "250px",
            display: "none"
        }}
        sortable={false}>
        <GridNoRecords>
            {"No data found"}
        </GridNoRecords>
        <GridColumn field="title" title="Title" />
        <GridColumn field="startDate" title="Start Date" />
        <GridColumn field="endDate" title="End Date" />
        <GridColumn field="staffs" title="Staffs" />
        <GridColumn field="clients" title="Clients" />
        <GridColumn field="status" title="Status" />
    </Grid>);

    return (
        <Dialog
            onClose={handleClose}
            title={"Report"}
            className="dialog-modal">
            {
                loading == true && <Loader />
            }
            <div className="edit-client-popup px-2">
                <div className="popup-modal">
                    <div className="row">
                        <div className="mb-1 col-lg-6 col-md-6 col-sm-6 col-12 align-items-center">
                            <DatePickerKendoRct
                                onChange={handleChange}
                                value={filterFields.startDate}
                                label={"Start Date"}
                                name={filterFieldsName.startDate}
                                title={"Start Date"}
                                error={errors && errors.startDate}
                                placeholder={""}
                                required={true} validityStyles={true}
                            />
                        </div>
                        <div className="mb-1 col-lg-6 col-md-6 col-sm-6 col-12 align-items-center">
                            <DatePickerKendoRct
                                onChange={handleChange}
                                value={filterFields.endDate}
                                label={"End Date"}
                                name={filterFieldsName.endDate}
                                title={"End Date"}
                                error={errors && errors.endDate}
                                placeholder={""}
                                required={true} validityStyles={true}
                            />
                        </div>
                    </div>
                    <div className='form-group mb-1 align-items-center'>
                        <MultiSelectDropDown
                            label={resourceFields.staffs.name}
                            data={resourceFields.staffs.data}
                            value={filterFields.staffs}
                            textField={resourceFields.staffs.textField}
                            name={resourceFields.staffs.field}
                            dataItemKey={resourceFields.staffs.valueField}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='form-group mb-1 align-items-center'>
                        <MultiSelectDropDown
                            label={resourceFields.clients.name}
                            data={resourceFields.clients.data}
                            value={filterFields.clients}
                            textField={resourceFields.clients.textField}
                            name={resourceFields.clients.field}
                            dataItemKey={resourceFields.clients.valueField}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='form-group mb-1 align-items-center'>
                        <DropDownList
                            name={resourceFields.eventStatus.field}
                            label={resourceFields.eventStatus.name}
                            data={resourceFields.eventStatus.data}
                            value={filterFields.eventStatusId}
                            textField={resourceFields.eventStatus.textField}
                            dataItemKey={resourceFields.eventStatus.valueField}
                            itemRender={itemRendererColorDropDownList}
                            valueRender={valueRendererColorDropDownList}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="grid-table" id="divReportGrid">
                        {grid}
                        <ExcelExport data={data} ref={excelExport} fileName="Scheduler Event Report">
                            {grid}
                        </ExcelExport>
                        <GridPDFExport ref={pdfExport} fileName="Scheduler Event Report">
                            {grid}
                        </GridPDFExport>
                    </div>

                </div>
            </div>
            <div className="border-top"></div>
            <div className="d-flex mt-4">
                <button className="btn blue-primary text-white ml-1" onClick={() => handleExportOnClick(false)}>
                    PDF Report
                </button>
                <button className="btn blue-primary text-white mx-3" onClick={() => handleExportOnClick(true)}>
                    Excel Report
                </button>

                <button className="btn grey-secondary text-white " onClick={handleClose}>
                    Cancel
                </button>

            </div>
        </Dialog >
    );

};