import React,{useState,useEffect} from 'react';
import { Switch } from "@progress/kendo-react-inputs";
import { Encrption } from '../../encrption';
import {  useSelector } from 'react-redux';
import ApiHelper from '../../../helper/api-helper';
import ApiUrls from '../../../helper/api-urls';
import { NotificationManager } from 'react-notifications';
import { Loader } from '@progress/kendo-react-indicators';
import Loading from "../../../control-components/loader/loader";
import { renderErrors } from "src/helper/error-message-helper";

const SmsSetting=(props)=>{
    const [loading, setLoading] = useState(false);
    const [settingSwitch, setSettingSwitch] = useState({
        allowSMSAlerts:false,
        calendarAppointmentsSMSAlert:false,
        noteCreationSMSAlert:false,
        lockedNoteCreationSMSAlert:false,
        authorizationExpireSMSAlert:false,
        treatmentPlanExpireSMSAlert:false,
        clientRequirementSMSAlert:false,
        clientLastSeenSMSAlert:false,
        clientStatusSMSAlert:false,
        schedulerEventCreationSMSAlert:false,
        certificationExpireSMSAlert:false,
    });

    useEffect(()=>{
        get_SMS_SettingList()
    },[])

    const get_SMS_SettingList = () => {
        setLoading(true);
        let id = Encrption(props.staffId)
        ApiHelper.getRequest(ApiUrls.GET_STAFF_SMS_SETTINGS + id)
          .then((result) => {
            const data = result.resultData;
            setSettingSwitch({
                allowSMSAlerts:data.allowSMSAlerts,
                calendarAppointmentsSMSAlert:data.calendarAppointmentsSMSAlert,
                noteCreationSMSAlert:data.noteCreationSMSAlert,
                lockedNoteCreationSMSAlert:data.lockedNoteCreationSMSAlert,
                authorizationExpireSMSAlert:data.authorizationExpireSMSAlert,
                treatmentPlanExpireSMSAlert:data.treatmentPlanExpireSMSAlert,
                clientRequirementSMSAlert:data.clientRequirementSMSAlert,
                clientLastSeenSMSAlert:data.clientLastSeenSMSAlert,
                clientStatusSMSAlert:data.clientStatusSMSAlert,
                schedulerEventCreationSMSAlert:data.schedulerEventCreationSMSAlert,
                certificationExpireSMSAlert:data.certificationExpireSMSAlert,
                
            });
            setLoading(false);
          })
          .catch((error) => {
            renderErrors(error.message);
            setLoading(false);
          });
      };


      const handleUpdate=()=>{
        setLoading(true)
        const data={
            staffId:props.staffId,
            allowSMSAlerts:settingSwitch.allowSMSAlerts,
                calendarAppointmentsSMSAlert:settingSwitch.calendarAppointmentsSMSAlert,
                noteCreationSMSAlert:settingSwitch.noteCreationSMSAlert,
                lockedNoteCreationSMSAlert:settingSwitch.lockedNoteCreationSMSAlert,
                authorizationExpireSMSAlert:settingSwitch.authorizationExpireSMSAlert,
                treatmentPlanExpireSMSAlert:settingSwitch.treatmentPlanExpireSMSAlert,
                clientRequirementSMSAlert:settingSwitch.clientRequirementSMSAlert,
                clientLastSeenSMSAlert:settingSwitch.clientLastSeenSMSAlert,
                clientStatusSMSAlert:settingSwitch.clientStatusSMSAlert,
                schedulerEventCreationSMSAlert:settingSwitch.schedulerEventCreationSMSAlert,
                certificationExpireSMSAlert:settingSwitch.certificationExpireSMSAlert,
        }
        ApiHelper.postRequest(ApiUrls.ADD_STAFF_SMS_SETTINGS, data)
        .then((result) => {
          setLoading(false)
          NotificationManager.success("Updated SMS successfully");
          get_SMS_SettingList()
        })
        .catch((error) => {
          renderErrors(error.message);
        });
      }

    const handleSwitch=(e)=>{
        var value = e.target.value;
        var name=e.target.name;
        setSettingSwitch({
                ...settingSwitch,
                [name]:value
        })
    }
    return(
    <>
    <ul className='list-unstyled d-flex flex-wrap pt-3'>
   
    <li className="col-md-6 col-12 mb-3 switch-on">
    <Switch
              onChange={handleSwitch}
              onLabel={"on"}
              offLabel={"off"}
              name="allowSMSAlerts"
              value={settingSwitch.allowSMSAlerts}
              checked={settingSwitch.allowSMSAlerts}
            />
    <span className="switch-title-text ml-2  fw-500 f-16">Allow SMS alert</span>
            
          </li>
          
    <li className="col-md-6 col-12 mb-3 switch-on">

<Switch
    onChange={handleSwitch}
    onLabel={"on"}
    offLabel={"off"}
    name="calendarAppointmentsSMSAlert"
    value={settingSwitch.calendarAppointmentsSMSAlert}
    checked={settingSwitch.calendarAppointmentsSMSAlert}

  />
<span className="switch-title-text ml-2  fw-500 f-16">Calender Appointment SMS alert</span>
  
</li>
    <li className="col-md-6 col-12 mb-3 switch-on">

          <Switch
              onChange={handleSwitch}
              onLabel={"on"}
              offLabel={"off"}
              name="noteCreationSMSAlert"
              value={settingSwitch.noteCreationSMSAlert}
              checked={settingSwitch.noteCreationSMSAlert}

            />
    <span className="switch-title-text ml-2  fw-500 f-16">Note Creation SMS alert</span>
            
          </li>
    <li className="col-md-6 col-12 mb-3 switch-on">
          
          <Switch
              onChange={handleSwitch}
              onLabel={"on"}
              offLabel={"off"}
              name="lockedNoteCreationSMSAlert"
              value={settingSwitch.lockedNoteCreationSMSAlert}
              checked={settingSwitch.lockedNoteCreationSMSAlert}

            />
    <span className="switch-title-text ml-2  fw-500 f-16">Locked note creation SMS alert</span>
            
          </li>
    <li className="col-md-6 col-12 mb-3 switch-on">
          
          <Switch
              onChange={handleSwitch}
              onLabel={"on"}
              offLabel={"off"}
              name="authorizationExpireSMSAlert"
              value={settingSwitch.authorizationExpireSMSAlert}
              checked={settingSwitch.authorizationExpireSMSAlert}

            />
    <span className="switch-title-text ml-2  fw-500 f-16">Authorization expire SMS alert</span>
            
          </li>
    <li className="col-md-6 col-12 mb-3 switch-on">

          <Switch
              onChange={handleSwitch}
              onLabel={"on"}
              offLabel={"off"}
              name="treatmentPlanExpireSMSAlert"
              value={settingSwitch.treatmentPlanExpireSMSAlert}
              checked={settingSwitch.treatmentPlanExpireSMSAlert}

            />
    <span className="switch-title-text ml-2  fw-500 f-16">Treatment Plan expire SMS alert</span>
            
          </li>
    {loading && <Loading />}
    <li className="col-md-6 col-12 mb-3 switch-on">
          
          <Switch
              onChange={handleSwitch}
              onLabel={"on"}
              offLabel={"off"}
              name="clientRequirementSMSAlert"
              value={settingSwitch.clientRequirementSMSAlert}
              checked={settingSwitch.clientRequirementSMSAlert}

            />
    <span className="switch-title-text ml-2  fw-500 f-16">Client requirement SMS alert</span>
            
          </li>
    <li className="col-md-6 col-12 mb-3 switch-on">

          <Switch
              onChange={handleSwitch}
              onLabel={"on"}
              offLabel={"off"}
              name="clientLastSeenSMSAlert"
              value={settingSwitch.clientLastSeenSMSAlert}
              checked={settingSwitch.clientLastSeenSMSAlert}

            />
    <span className="switch-title-text ml-2  fw-500 f-16">Client last seen SMS treatmentPlanExpireEmailAlert</span>
            
          </li>
    <li className="col-md-6 col-12 mb-3 switch-on">

          <Switch
              onChange={handleSwitch}
              onLabel={"on"}
              offLabel={"off"}
              name="clientStatusSMSAlert"
              value={settingSwitch.clientStatusSMSAlert}
              checked={settingSwitch.clientStatusSMSAlert}

            />
    <span className="switch-title-text ml-2  fw-500 f-16">Client status SMS alert</span>
            
          </li>
    <li className="col-md-6 col-12 mb-3 switch-on">

          <Switch
              onChange={handleSwitch}
              onLabel={"on"}
              offLabel={"off"}
              name="schedulerEventCreationSMSAlert"
              value={settingSwitch.schedulerEventCreationSMSAlert}
              checked={settingSwitch.schedulerEventCreationSMSAlert}

            />
    <span className="switch-title-text ml-2  fw-500 f-16">Scheduler event creation SMS alert</span>
            
          </li>
    <li className="col-md-6 col-12 mb-3 switch-on">
          
          <Switch
              onChange={handleSwitch}
              onLabel={"on"}
              offLabel={"off"}
              name="certificationExpireSMSAlert"
              value={settingSwitch.certificationExpireSMSAlert}
              checked={settingSwitch.certificationExpireSMSAlert}

            />
    <span className="switch-title-text ml-2  fw-500 f-16">Certification expire SMS alert</span>
            
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

export default SmsSetting