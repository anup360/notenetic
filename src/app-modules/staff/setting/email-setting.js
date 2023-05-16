import React, { useState, useEffect } from 'react';
import { Switch } from "@progress/kendo-react-inputs";
import { Encrption } from '../../encrption';
import ApiHelper from '../../../helper/api-helper';
import ApiUrls from '../../../helper/api-urls';
import { NotificationManager } from 'react-notifications';
import Loading from "../../../control-components/loader/loader";
import { renderErrors } from "src/helper/error-message-helper";


const EmailSetting = (props, ref) => {
  const [loading, setLoading] = useState(false);
  const [settingSwitch, setSettingSwitch] = useState({
    allowEmailAlerts: false,
    calendarAppointmentsEmailAlert: false,
    noteCreationEmailAlert: false,
    noteCreationMessageCenterAlert: false,
    lockedNoteCreationEmailAlert: false,
    lockedNoteCreationMessageCenterAlert: false,
    authorizationExpireEmailAlert: false,
    treatmentPlanExpireEmailAlert: false,
    clientRequirementEmailAlert: false,
    clientLastSeenEmailAlert: false,
    clientStatusEmailAlert: false,
    schedulerEventCreationEmailAlert: false,
    certificationExpireEmailAlert: false,
    contactLogMessageCenterAlert: false,
  });

  useEffect(() => {
    getEmailSettingList()
  }, [])

  const getEmailSettingList = () => {
    setLoading(true);
    let id = Encrption(props.staffId)
    ApiHelper.getRequest(ApiUrls.GET_STAFF_EMAIL_SETTINGS + id)
      .then((result) => {
        const data = result.resultData;
        setSettingSwitch({
          allowEmailAlerts: data.allowEmailAlerts,
          calendarAppointmentsEmailAlert: data.calendarAppointmentsEmailAlert,
          noteCreationEmailAlert: data.noteCreationEmailAlert,
          noteCreationMessageCenterAlert: data.noteCreationMessageCenterAlert,
          lockedNoteCreationEmailAlert: data.lockedNoteCreationEmailAlert,
          lockedNoteCreationMessageCenterAlert: data.lockedNoteCreationMessageCenterAlert,
          authorizationExpireEmailAlert: data.authorizationExpireEmailAlert,
          treatmentPlanExpireEmailAlert: data.treatmentPlanExpireEmailAlert,
          clientRequirementEmailAlert: data.clientRequirementEmailAlert,
          clientLastSeenEmailAlert: data.clientLastSeenEmailAlert,
          clientStatusEmailAlert: data.clientStatusEmailAlert,
          schedulerEventCreationEmailAlert: data.schedulerEventCreationEmailAlert,
          certificationExpireEmailAlert: data.certificationExpireEmailAlert,
          contactLogMessageCenterAlert: data.contactLogMessageCenterAlert
        });
        setLoading(false);
      })
      .catch((error) => {
        renderErrors(error.message);
        setLoading(false);
      });
  };

  const handleUpdate = () => {
    setLoading(true)
    const data = {
      staffId: props.staffId,
      allowEmailAlerts: settingSwitch.allowEmailAlerts,
      calendarAppointmentsEmailAlert: settingSwitch.calendarAppointmentsEmailAlert,
      noteCreationEmailAlert: settingSwitch.noteCreationEmailAlert,
      noteCreationMessageCenterAlert: settingSwitch.noteCreationMessageCenterAlert,
      lockedNoteCreationEmailAlert: settingSwitch.lockedNoteCreationEmailAlert,
      lockedNoteCreationMessageCenterAlert: settingSwitch.lockedNoteCreationMessageCenterAlert,
      authorizationExpireEmailAlert: settingSwitch.authorizationExpireEmailAlert,
      treatmentPlanExpireEmailAlert: settingSwitch.treatmentPlanExpireEmailAlert,
      clientRequirementEmailAlert: settingSwitch.clientRequirementEmailAlert,
      clientLastSeenEmailAlert: settingSwitch.clientLastSeenEmailAlert,
      clientStatusEmailAlert: settingSwitch.clientStatusEmailAlert,
      schedulerEventCreationEmailAlert: settingSwitch.schedulerEventCreationEmailAlert,
      certificationExpireEmailAlert: settingSwitch.certificationExpireEmailAlert,
      contactLogMessageCenterAlert: settingSwitch.contactLogMessageCenterAlert
    }
    ApiHelper.postRequest(ApiUrls.ADD_STAFF_EMAIL_SETTINGS, data)
      .then((result) => {
        setLoading(false)
        NotificationManager.success("Updated  Email successfully");
        getEmailSettingList()
      })
      .catch((error) => {
        renderErrors(error.message);
      });
  }

  const handleSwitch = (e) => {
    var value = e.target.value;
    var name = e.target.name;
    setSettingSwitch({
      ...settingSwitch,
      [name]: value
    })
  }
  return (
    <>
      <ul className='list-unstyled d-flex flex-wrap pt-3'>
        <li className="col-md-6 col-12 mb-3 switch-on">
          <Switch
            onChange={handleSwitch}
            onLabel={"on"}
            offLabel={"off"}
            name="allowEmailAlerts"
            value={settingSwitch.allowEmailAlerts}
            checked={settingSwitch.allowEmailAlerts}
          />
          <span className="switch-title-text ml-2 f-16 fw-500">Allow email alert</span>

        </li>

        <li className="col-md-6 col-12 mb-3 switch-on">
          <Switch
            onChange={handleSwitch}
            onLabel={"on"}
            offLabel={"off"}
            name="calendarAppointmentsEmailAlert"
            value={settingSwitch.calendarAppointmentsEmailAlert}
            checked={settingSwitch.calendarAppointmentsEmailAlert}

          />
          <span className="switch-title-text ml-2 f-16 fw-500">Calender Appointment email alert</span>

        </li>
        <li className="col-md-6 col-12 mb-3 switch-on">
          <Switch
            onChange={handleSwitch}
            onLabel={"on"}
            offLabel={"off"}
            name="noteCreationEmailAlert"
            value={settingSwitch.noteCreationEmailAlert}
            checked={settingSwitch.noteCreationEmailAlert}

          />
          <span className="switch-title-text ml-2 f-16 fw-500">Note Creation email alert</span>
        </li>

        <li className="col-md-6 col-12 mb-3 switch-on">
          <Switch
            onChange={handleSwitch}
            onLabel={"on"}
            offLabel={"off"}
            name="noteCreationMessageCenterAlert"
            value={settingSwitch.noteCreationMessageCenterAlert}
            checked={settingSwitch.noteCreationMessageCenterAlert}

          />
          <span className="switch-title-text ml-2 f-16 fw-500">Note creation message center alert</span>

        </li>

        <li className="col-md-6 col-12 mb-3 switch-on">
          <Switch
            onChange={handleSwitch}
            onLabel={"on"}
            offLabel={"off"}
            name="lockedNoteCreationEmailAlert"
            value={settingSwitch.lockedNoteCreationEmailAlert}
            checked={settingSwitch.lockedNoteCreationEmailAlert}

          />
          <span className="switch-title-text ml-2 f-16 fw-500">Locked note Creation email alert</span>

        </li>
        <li className="col-md-6 col-12 mb-3 switch-on">
          <Switch
            onChange={handleSwitch}
            onLabel={"on"}
            offLabel={"off"}
            name="lockedNoteCreationMessageCenterAlert"
            value={settingSwitch.lockedNoteCreationMessageCenterAlert}
            checked={settingSwitch.lockedNoteCreationMessageCenterAlert}

          />
          <span className="switch-title-text ml-2 f-16 fw-500">Locked note creation message center alert</span>

        </li>
        
        <li className="col-md-6 col-12 mb-3 switch-on">
          <Switch
            onChange={handleSwitch}
            onLabel={"on"}
            offLabel={"off"}
            name="authorizationExpireEmailAlert"
            value={settingSwitch.authorizationExpireEmailAlert}
            checked={settingSwitch.authorizationExpireEmailAlert}

          />
          <span className="switch-title-text ml-2 f-16 fw-500">Authorization expire email alert</span>

        </li>
        <li className="col-md-6 col-12 mb-3 switch-on">
          <Switch
            onChange={handleSwitch}
            onLabel={"on"}
            offLabel={"off"}
            name="treatmentPlanExpireEmailAlert"
            value={settingSwitch.treatmentPlanExpireEmailAlert}
            checked={settingSwitch.treatmentPlanExpireEmailAlert}

          />
          <span className="switch-title-text ml-2 f-16 fw-500">treatment plan expire email alert</span>

        </li>

        <li className="col-md-6 col-12 mb-3 switch-on">
          <Switch
            onChange={handleSwitch}
            onLabel={"on"}
            offLabel={"off"}
            name="clientRequirementEmailAlert"
            value={settingSwitch.clientRequirementEmailAlert}
            checked={settingSwitch.clientRequirementEmailAlert}

          />
          <span className="switch-title-text ml-2 f-16 fw-500">Client requirement email alert</span>
        </li>
        
        <li className="col-md-6 col-12 mb-3 switch-on">
          <Switch
            onChange={handleSwitch}
            onLabel={"on"}
            offLabel={"off"}
            name="clientLastSeenEmailAlert"
            value={settingSwitch.clientLastSeenEmailAlert}
            checked={settingSwitch.clientLastSeenEmailAlert}

          />
          <span className="switch-title-text ml-2 f-16 fw-500">Client last seen email alert</span>
        </li>
        <li className="col-md-6 col-12 mb-3 switch-on">
          <Switch
            onChange={handleSwitch}
            onLabel={"on"}
            offLabel={"off"}
            name="clientStatusEmailAlert"
            value={settingSwitch.clientStatusEmailAlert}
            checked={settingSwitch.clientStatusEmailAlert}

          />
          <span className="switch-title-text ml-2 f-16 fw-500">Client status email alert</span>
        </li>
        <li className="col-md-6 col-12 mb-3 switch-on">
          <Switch
            onChange={handleSwitch}
            onLabel={"on"}
            offLabel={"off"}
            name="schedulerEventCreationEmailAlert"
            value={settingSwitch.schedulerEventCreationEmailAlert}
            checked={settingSwitch.schedulerEventCreationEmailAlert}

          />
          <span className="switch-title-text ml-2 f-16 fw-500">Scheduler event creation email alert</span>
        </li>
        <li className="col-md-6 col-12 mb-3 switch-on">
          <Switch
            onChange={handleSwitch}
            onLabel={"on"}
            offLabel={"off"}
            name="certificationExpireEmailAlert"
            value={settingSwitch.certificationExpireEmailAlert}
            checked={settingSwitch.certificationExpireEmailAlert}

          />
          <span className="switch-title-text ml-2 f-16 fw-500">certification expire email alert</span>
        </li>
    {loading && <Loading />}

        <li className="col-md-6 col-12 mb-3 switch-on">
          <Switch
            onChange={handleSwitch}
            onLabel={"on"}
            offLabel={"off"}
            name="contactLogMessageCenterAlert"
            value={settingSwitch.contactLogMessageCenterAlert}
            checked={settingSwitch.contactLogMessageCenterAlert}

          />
          <span className="switch-title-text ml-2 f-16 fw-500">Contact log message center alert</span>

        </li>
      </ul>
      <div className="col-12 px-4 border-top pt-2">
        <button className="btn blue-primary-outline update-small" onClick={handleUpdate}>
      <i className="fa fa-check pr-2" title="Print"></i>
          Update</button>
      </div>

    </>
  )
}

export default EmailSetting