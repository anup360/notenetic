
import React, { useEffect, useState } from 'react';
import DatePickerKendoRct from "../../../../control-components/date-picker/date-picker";
import ErrorHelper from '../../../../helper/error-helper'
import { NotificationManager } from 'react-notifications';
import DropDownKendoRct from '../../../../control-components/drop-down/drop-down';
import InputKendoRct from "../../../../control-components/input/input";
import Loader from "../../../../control-components/loader/loader";
import { useSelector } from 'react-redux';
import { Dialog } from "@progress/kendo-react-dialogs";
import { ClientService } from '../../../../services/clientService';
import TextAreaKendoRct from '../../../../control-components/text-area/text-area';
import ValidationHelper from "../../../../helper/validation-helper";
import { isEmpty } from 'lodash';
import { renderErrors } from "src/helper/error-message-helper";

const AddGoal = ({ onClose, selectedGoal,setIsGoalRefreshed }) => {
  const vHelper = ValidationHelper();
    let [fields, setFields] = useState(
        {
            goalName: "",
            goalDescription: "",
            startDate: null,
            endDate: null,
            targetDate: null,
            comments: "",
            status: ""
        }
    )
    const [errors, setErrors] = useState("");
    const [loading, setLoading] = useState(false);
    // const selectedClientId = useSelector(state => state.selectedClientId);
    const [settingError, setSettingError] = useState(false);
    const [treatmentStatus, setTreatmentStatus] = useState([]);

    useEffect(() => {
         getTreatmentGoalStatus()
        if (selectedGoal?.id) { getGoalsById() }
    }, [])

    const getGoalsById = async () => {
        // setLoading(true)
        // await ClientService.getClientPlansById(selectedGoal?.id)
        //     .then(result => {
        //         setLoading(false)
        //         let planInfo = result.resultData
        //         const statusDetail = {
        //             "id": planInfo.statusId,
        //             "name": planInfo.status,
        //         }
                setFields({
                    ...fields,
                    goalName: selectedGoal?.goalName,
                    goalDescription: selectedGoal?.goalDescription,
                    startDate: selectedGoal.startDate == null ? "" : new Date(selectedGoal.startDate),
                    endDate: selectedGoal.endDate == null ? "" : new Date(selectedGoal.endDate),
                    targetDate: selectedGoal.targetDate == null ? "" : new Date(selectedGoal.targetDate),
                    comments: selectedGoal?.comments,
                    status: {id:selectedGoal?.statusId,name:selectedGoal?.status}
                })
            // }).catch(error => {
            //     setLoading(false)
            //     renderErrors(error.message);
            // });
    }

    const handleValidation = () => {
        let errors = {};
        let formIsValid = true;
        if (!fields.goalName || fields.goalName.trim().length === 0) {
            errors["goalName"] = ErrorHelper.FIELD_BLANK
        }

        // if (!fields?.startDate) errors["startDate"] = ErrorHelper.FIELD_BLANK;
        // if (!fields?.endDate) errors["endDate"] = ErrorHelper.FIELD_BLANK;
         if (!fields?.status) errors["status"] = ErrorHelper.FIELD_BLANK;
        
        formIsValid = isEmpty(errors);

         if(fields.startDate  && fields.endDate){
            let error = vHelper.startDateGreaterThanValidator(
              fields.startDate,
              fields.endDate,
              "startDate",
              "endDate"
            );
            if (error && error.length > 0) {
              errors["startDate"] = error;
              formIsValid = false;
            }
          }
   

         if (!fields.status) {
            formIsValid = false;
            errors["status"] = ErrorHelper.FIELD_BLANK
        }

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

    const handleTextChange = (e) => {
        const name = e.target.name;
        const value = e.value;
        setFields({
            ...fields,
            [name]: value,
        });
    };

    const handleSubmitGoal = (event) => {
        setSettingError(true)
        if (handleValidation()) {
            
            if (selectedGoal?.id) {
                
                updateTreatmentGoal()
            } else { 
                saveTreatmentGoal() 
            }
        }
    }

    const getTreatmentGoalStatus = async () => {
        await ClientService.getTreatmentPlanStatus()
            .then(result => {
                let treatmentStatusList = result.resultData
                setTreatmentStatus(treatmentStatusList)
            }).catch(error => {
                renderErrors(error);

            });
    }

    const saveTreatmentGoal = async () => {
        setLoading(true)
        await ClientService.saveTreatmentGoal(fields, selectedGoal.treatmentPlanId)
            .then(result => {
                setLoading(false)
                NotificationManager.success("Treatment goal added successfully");
                onClose({ "added": true });
                setIsGoalRefreshed(true);
            }).catch(error => {
                setLoading(false)
                renderErrors(error);
            });
    }

    const updateTreatmentGoal = async () => {
        setLoading(true)
        await ClientService.updateTreatmentGoal(fields, selectedGoal)
            .then(result => {
                setLoading(false)
                NotificationManager.success("Treatment goal updated successfully");
                onClose({ "edited": true });
                setIsGoalRefreshed(true);
            }).catch(error => {
                setLoading(false)
                renderErrors(error);
            });
    }

    return (
        <div  onKeyDown={(e) => e.stopPropagation()}>
        <Dialog onClose={onClose} title={selectedGoal?.id ? "Edit Goal" : "Add Goal"} className='small-dailog'>
            <div className='edit-client-popup  small-edit-client'>

                <div className="mb-2 col-lg-12 col-md-12 col-12">
                    <InputKendoRct
                        value={fields.goalName}
                        onChange={handleChange}
                        name="goalName"
                        label=" Goal Name"
                        error={fields.goalName === "" && errors.goalName}
                        validityStyles={settingError}
                        required={true}
                    />
                </div>
                <div className="mb-2 col-lg-12 col-md-12 col-12">
                    <TextAreaKendoRct
                        name="goalDescription"
                        txtValue={fields.goalDescription}
                        onChange={handleTextChange}
                        label="Description"
                    />
                </div>
                <div className='d-flex flex-wrap'>
                    <div className="mb-2 col-lg-4 col-md-6 col-12">
                        <DatePickerKendoRct
                            onChange={handleChange}
                            format={"MM/dd/YYYY"}
                            placeholder=""
                            value={fields.startDate}
                            name={"startDate"}
                            fillMode={"solid"}
                            size={"medium"}
                            title={"Start Date"}
                            label={"Start Date"}
                            weekNumber={false}
                            error={errors.startDate}
                           
                            validityStyles={settingError}
                        />
                    </div>
                    <div className="mb-2 col-lg-4 col-md-6 col-12">
                        <DatePickerKendoRct
                            onChange={handleChange}
                            format={"MM/dd/YYYY"}
                            placeholder=""
                            value={fields.endDate}
                            name={"endDate"}
                            fillMode={"solid"}
                            size={"medium"}
                            title={"End Date"}
                            weekNumber={false}
                            label={"End Date"}
                           
                            validityStyles={settingError}
                            min={fields.startDate? new Date(fields.startDate):null}    
                        />
                    </div>

                    <div className="mb-2 col-lg-4 col-md-6 col-12">
                        <DatePickerKendoRct
                            onChange={handleChange}
                            format={"MM/dd/YYYY"}
                            placeholder=""
                            value={fields.targetDate}
                            name={"targetDate"}
                            fillMode={"solid"}
                            size={"medium"}
                            title={"Target Date"}
                            label={"Target Date"}
                            weekNumber={false}
                            
                            validityStyles={settingError}
                            min={fields.startDate? new Date(fields.startDate):null}   
                        />
                    </div>

                    <div className="mb-2 col-lg-12 col-md-12 col-12">
                        
                        <DropDownKendoRct
                            label="Status"
                            onChange={handleChange}
                            value={fields.status}
                            textField="name"
                            name="status"
                            data={treatmentStatus}
                            required={true}
                            dataItemKey="id"
                            validityStyles={settingError}
                            error={!fields.status && errors.status}
                            placeholder="Status"
                            
                        />
                    </div>

                    <div className="mb-2 col-lg-12 col-md-12 col-12">
                        <TextAreaKendoRct
                            txtValue={fields.comments}
                            onChange={handleTextChange}
                            name="comments"
                            label="Comments"
                        />
                    </div>
                </div>
            </div>
            {loading === true && <Loader />}
            <div className='border-bottom-line'></div>
            <div className="d-flex my-3 px-4">
                <div>
                    <button onClick={handleSubmitGoal} className='btn blue-primary text-white  mx-2' >
                        Submit
                    </button>
                </div>
                <div>
                    <button className='btn grey-secondary text-white' onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </Dialog>
        </div>
    );
}
export default AddGoal;



