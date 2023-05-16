import React, { useEffect, useState } from 'react';
import DatePickerKendoRct from "../../../../control-components/date-picker/date-picker";
import ErrorHelper from '../../../../helper/error-helper'
import { NotificationManager } from 'react-notifications';
import InputKendoRct from "../../../../control-components/input/input";
import Loader from "../../../../control-components/loader/loader";
import { useSelector } from 'react-redux';
import { Dialog } from "@progress/kendo-react-dialogs";
import { ClientService } from '../../../../services/clientService';
import { isEmpty } from 'lodash';
import { TimePicker } from '@progress/kendo-react-dateinputs';
import { displayDate } from 'src/util/utility';
import moment from 'moment';
import { renderErrors } from "src/helper/error-message-helper";


const CloseTreatmentPlan = ({ onClose, selectedPlan,setIsGoalRefreshed }) => {
//   const vHelper = ValidationHelper();

    let [fields, setFields] = useState(
        {
            planName:selectedPlan.planName,
            planDate:new Date(selectedPlan.planDate),
            startTime: selectedPlan.startTime ? new Date(displayDate(new Date(),"MM/DD/yyyy") +" "+ selectedPlan.startTime) : null,
            planEndDate: "",
            endTime: selectedPlan.endTime ? new Date(displayDate(new Date(),"MM/DD/yyyy") +" "+ selectedPlan.endTime) : null,
            status: false,
            transitionDischargePlan:selectedPlan?.transitionDischargePlan,
            selectedService:{id:selectedPlan?.serviceId,name:selectedPlan?.serviceName}
            
        }
    )
    const [errors, setErrors] = useState("");
    const [loading, setLoading] = useState(false);
    const selectedClientId = useSelector(state => state.selectedClientId);
    const [settingError, setSettingError] = useState(false);
    
    const handleValidation = () => {
        let errors = {};
        let formIsValid = true;
        
        if (!fields?.planEndDate) errors["planEndDate"] = ErrorHelper.FIELD_BLANK;
    
          formIsValid = isEmpty(errors);

        setErrors(errors)
        return formIsValid;
    }

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setFields({
            ...fields,
            [name]: value,
        });
    };

    const handleSubmitPlan = (event) => {
        setSettingError(true)
        if (handleValidation()) {
            
            closeTreatmentPlan()
        }
    }


    const closeTreatmentPlan = async () => {
        
        setLoading(true)
        await ClientService.deleteTreatmentPlans(selectedPlan?.id, moment(fields?.planEndDate).format('MM/DD/YYYY'))
            .then(result => {
                setLoading(false)
                NotificationManager.success("Treatment plan deactivated successfully");
                onClose({ "edited": true });
                setIsGoalRefreshed(true);
            }).catch(error => {
                setLoading(false)
                renderErrors(error);
            });
    }

    return (
        <Dialog onClose={onClose} title={"Close/Completed Plan"} className='small-dailog'>
            <div>
       
                
                <div className="mb-2 col-lg-12 col-md-12 col-12 m-2">
                    <DatePickerKendoRct
                            onChange={handleChange}
                            format={"MM/dd/YYYY"}
                            placeholder=""
                            value={fields.planEndDate}
                            name={"planEndDate"}
                            fillMode={"solid"}
                            size={"medium"}
                            title={"Plan End Date"}
                            label={"Plan End Date"}
                            weekNumber={false}
                            error={errors.planEndDate}
                            required={true}
                            validityStyles={!!errors.planEndDate}
                            min={new Date()}
                        />
                </div>
                
                
                
            

            
            </div>
            {loading === true && <Loader />}
            <div className='border-bottom-line'></div>
            <div className="d-flex my-3 px-4">
                <div>
                    <button onClick={handleSubmitPlan} className='btn blue-primary text-white' >
                        Close Plan
                    </button>
                </div>
                <div>
                    <button className='btn grey-secondary text-white mx-2' onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </Dialog>
    );
}
export default CloseTreatmentPlan;



