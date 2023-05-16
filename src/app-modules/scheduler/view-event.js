import { useState, useRef, useCallback, Fragment, useEffect } from "react";
import {
    SchedulerItem,
    useSchedulerEditItemFormItemContext,
    useSchedulerEditItemRemoveItemContext,
    useSchedulerEditItemShowOccurrenceDialogContext,
    useSchedulerEditItemShowRemoveDialogContext
} from '@progress/kendo-react-scheduler';
import { Card, CardHeader, CardBody, CardTitle } from '@progress/kendo-react-layout';
import { useAsyncFocusBlur } from '@progress/kendo-react-common';
import { Popup } from "@progress/kendo-react-popup";
import { RRule } from 'rrule';
import DateTimeHelper from "../../helper/date-time-helper";
import { SchedulerService } from "../../services/schedulerService";
import { useSelector } from "react-redux";
import useModelScroll from '../../cutomHooks/model-dialouge-scroll'
import { useNavigate } from "react-router-dom";
import APP_ROUTES from "../../helper/app-routes";
import {
    Encrption,
    EncrpytUrl, telehealthEncrption,
} from "../encrption";
import { displayTime } from "../../util/utility";
import moment from "moment";
import { permissionEnum } from "src/helper/permission-helper";
import { userSAPermission } from "../../helper/permission-helper";


export const ViewEvent = (props) => {


    const item = useRef(null);
    const [show, setShow] = useState(false);
    const resourceWithColor = props.group.resources.find((resource) => resource.colorField && resource[resource.colorField] !== undefined);
    const color = resourceWithColor && resourceWithColor.colorField && resourceWithColor[resourceWithColor.colorField];
    const [, setFormItem] = useSchedulerEditItemFormItemContext();
    const [, setRemoveItem] = useSchedulerEditItemRemoveItemContext();
    const userAccessPermission = useSelector((state) => state.userAccessPermission);
    const [modelScroll, setScroll] = useModelScroll()
    const staffId = useSelector(state => state.loggedIn?.staffId);
    const staffName = useSelector(state => state.loggedIn);
    const userName = useSelector((state) => state.getStaffReducer?.userName);
    const navigate = useNavigate();
    const [selectedStaffId, setSelectedStaffId] = useState(false);
    const staffLoginInfo = useSelector((state) => state.getStaffReducer);

    const [, setShowOccurrenceDialog] = useSchedulerEditItemShowOccurrenceDialogContext();
    const [, setShowRemoveDialog] = useSchedulerEditItemShowRemoveDialogContext();

    const handleClick = useCallback(
        (event) => {
            setShow(true); if (props.onClick) { props.onClick(event); }
        },
        [props]
    );
    const handleMouseOver = useCallback(
        (event) => { setShow(true); if (props.onMouseOver) { props.onMouseOver(event); } },
        [props]
    );
    const handleMouseOut = useCallback(
        (event) => { setShow(false); if (props.onMouseOut) { props.onMouseOut(event); } },
        [props]
    );
    const handleDoubleClick = useCallback(
        (event) => {
            setShow(false);
            if (props.onDoubleClick) { props.onDoubleClick(event); }
        },
        [props]
    );
    const handleBlur = useCallback(
        (event) => { setShow(false); if (props.onBlur) { props.onBlur(event); } },
        [props]
    );
    const handleCloseClick = useCallback(
        () => {
            setShow(false);
        },
        [setShow]
    );
    const handleEditClick = useCallback(
        () => {
            setShow(false);
            setFormItem(props.dataItem);
            if (props.isRecurring) {
                setShowOccurrenceDialog(true);
            }
        },
        [setFormItem, props.dataItem, props.isRecurring, setShowOccurrenceDialog]
    );
    const handleDeleteClick = useCallback(
        () => {
            setShow(false);
            setRemoveItem(props.dataItem);
            if (props.isRecurring) {
                setShowOccurrenceDialog(true);
            } else {
                setShowRemoveDialog(true);
            }
        },
        [setRemoveItem, props.dataItem, props.isRecurring, setShowOccurrenceDialog, setShowRemoveDialog]
    );

    const { onFocus, onBlur } = useAsyncFocusBlur({ onFocus: props.onFocus, onBlur: handleBlur });


    const handleJoinCall = () => {

        // bool isHostInMeeting =  Trigger api to get is host in the meeting;
        // if(isHostInMeeting && id != Host) {
        // joinFunction()
        // } else if (!isHostInMeeting && id == Host) {
        // setHostInMeeting using api
        // joinFunction()
        // }

        let enStaffId = telehealthEncrption(staffId)
        let enEventId = telehealthEncrption(props.dataItem.id)

        let isClient = staffId ? false : true

        navigate(`${APP_ROUTES.TELEHEALTH}?isClient=${isClient}&userId=${enStaffId}&eventId=${enEventId}`, {
            state: {
                eventInfo: props.dataItem
            }
        });

    }

    const handleInviteCall = () => {
        let url = window.location.origin + APP_ROUTES.TELEHEALTH + "?" + "userId" + "=" + Encrption(staffId) + "&" + "eventId" + "=" + Encrption(props.dataItem.id)
        navigator.clipboard.writeText(`${url}`);

        let decryptedUrl = window.location.origin + "/" + props.dataItem.id + "/" + staffId
    }

    const rruleToText = () => {
        if (props.isRecurring) {
            let ruleString = props.recurrenceRule;
            if (!ruleString || ruleString === "")
                return "";
            let rule = RRule.fromString(ruleString);
            return `[${rule.toText()}]`;
        }
        return "";
    }


    const RenderJoinTel = ({ onClick, propData }) => {


        let dateObj = new Date();
        let currentTime = new Date(dateObj).getTime()

        let subtractTime = moment(propData?.start).subtract(30, 'm').format()

        let startTime = new Date(subtractTime).getTime()

        let addedTime = moment(propData?.end).add(15, 'm').format()
        let endTime = new Date(addedTime).getTime()

        let b = <button className="px-2 py-1 btn blue-primary-outline join-popup" onClick={onClick}>Join</button>;

        if (propData.isAllDay) {
            return (b)
        }
        if (currentTime > endTime) {
            return <></>
        }
        else if (propData?.isAllDay == false && currentTime < endTime && currentTime > startTime) {
            return (b)
        }
        else if (currentTime < endTime) {
            return <></>
        }
        else {
            return <></>
        }
    }


    useEffect(() => {
        let selectedStaffs = props.dataItem?.staffs
        if (selectedStaffs.length > 0) {
            selectedStaffs.forEach(element => {
                if (staffId == props.dataItem?.createdBy || staffId == element) {
                    setSelectedStaffId(true)
                }
            });
        }
    })


    return (
        <>
            <Fragment>
                <SchedulerItem
                    ref={item}
                    {...props}
                    onClick={handleClick}
                    onDoubleClick={handleDoubleClick}
                    onFocus={onFocus}
                    onBlur={onBlur}>
                    {props.children}

                </SchedulerItem>
                <Popup
                    anchor={item.current && item.current.element}
                    show={show}
                    style={{
                        width: 300
                    }}
                    anchorAlign={{
                        horizontal: 'right',
                        vertical: 'center'
                    }}
                    popupAlign={{
                        horizontal: 'left',
                        vertical: 'center'
                    }}>
                    <div
                        tabIndex={-1}
                        onFocus={onFocus}
                        onBlur={onBlur}>
                        <Card style={{ boxShadow: "0 0 4px 0 rgba(0, 0, 0, .1)" }}>
                            <CardHeader className="ml-auto p-0 overflow-visible">


                                {
                                    userAccessPermission[permissionEnum.MANAGE_CALENDAR_SETTINGS] || userSAPermission(staffLoginInfo?.roleId) &&
                                    <button className="delet-btn mr-1 position-relative" onClick={handleEditClick}>
                                        <span className="k-icon k-i-edit text-black"></span>
                                    </button>
                                }


                                {
                                    userAccessPermission[permissionEnum.MANAGE_CALENDAR_SETTINGS] || userSAPermission(staffLoginInfo?.roleId) &&

                                    <button className="delet-btn mr-1 position-relative" onClick={handleDeleteClick}>
                                        <span className="fa fa-trash fa-xs"></span>
                                    </button>

                                }

                                <button className="delet-btn position-relative" onClick={handleCloseClick}>
                                    <span className="fa fa-times-circle cursor-default f-18 text-black"></span>
                                </button>

                            </CardHeader>
                            <CardBody>
                                <CardTitle>
                                    {
                                        props.dataItem.isTelehealth && selectedStaffId &&
                                        <RenderJoinTel onClick={handleJoinCall} propData={props.dataItem} />

                                    }

                                    {/* {
                                        props.dataItem.isTelehealth &&
                                        <button className="px-2 py-1 btn blue-primary-outline" onClick={handleInviteCall}>
                                            Invite
                                        </button>
                                    } */}

                                    <div className="row">
                                        <div className="col-1" >
                                            <div
                                                style={{
                                                    backgroundColor: color,
                                                    width: 16,
                                                    height: 16,
                                                    position: 'relative',
                                                    top: '50%',
                                                    borderRadius: 4,
                                                    transform: 'translateY(-50%)'
                                                }}
                                            />
                                        </div>
                                        <div className="col">
                                            <div>{props.title}</div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-1" />
                                        <div className="col">
                                            <small className="text-muted mr-1">{DateTimeHelper.format(props.start, 'ddd, Do MMMM')}</small>
                                            <small className="text-muted fst-italic">{rruleToText()}</small>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-1"><span className="k-icon k-i-clock" /></div>
                                        <div className="col d-flex align-items-end">
                                            {props.isAllDay ? (<div>All day event</div>) : (
                                                <Fragment>
                                                    <div className="mr-1">From: {DateTimeHelper.format(props.start, 'LT')}</div>
                                                    <div className="mr-1">-</div>
                                                    <div>To: {DateTimeHelper.format(props.end, 'LT')}</div>
                                                </Fragment>)}

                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-1"><span className="k-icon" /></div>
                                        <div className="col d-flex align-items-end">
                                            Staffs: {SchedulerService.getCommaSepratedStaffNames(props.dataItem.staffs, 5)}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-1"><span className="k-icon" /></div>
                                        <div className="col d-flex align-items-end">
                                            Clients: {SchedulerService.getCommaSepratedClientNames(props.dataItem.clients, 5)}
                                        </div>
                                    </div>
                                </CardTitle>
                            </CardBody>
                        </Card>
                    </div>
                </Popup>
            </Fragment>

        </>

    );

};