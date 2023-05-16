
import React, { useEffect, useState } from 'react';
import ErrorHelper from '../../../../helper/error-helper'
import { NotificationManager } from 'react-notifications';
import Loader from "../../../../control-components/loader/loader";
import { Dialog } from "@progress/kendo-react-dialogs";
import { ClientService } from '../../../../services/clientService';
import DropDownKendoRct from '../../../../control-components/drop-down/drop-down';
import TextAreaKendo from "../../../../control-components/kendo-text-area/kendo-text-area";
import { renderErrors } from "src/helper/error-message-helper";

const AddIntervention = ({ onClose, selectedIntervention,setIsGoalRefreshed }) => {
    let [fields, setFields] = useState(
        {
            intervention: "",
            status: ""
        }
    )
    const [errors, setErrors] = useState("");
    const [loading, setLoading] = useState(false);
    const [settingError, setSettingError] = useState(false);
    const [treatmentStatus, setTreatmentStatus] = useState([]);

    useEffect(() => {
        getTreatmentPlanStatus()
        if (selectedIntervention?.id) { getInterventionById() }
    }, [])


    const getTreatmentPlanStatus = async () => {
        await ClientService.getTreatmentPlanStatus()
            .then(result => {
                let treatmentStatusList = result.resultData
                setTreatmentStatus(treatmentStatusList)
            }).catch(error => {
                renderErrors(error);
            });
    }
    const getInterventionById = async () => {
        // setLoading(true)
        // await ClientService.getInterventionById(selectedIntervention?.objectiveId)
        //     .then(result => {
        //         setLoading(false)
        //         let InterventionInfo = result.resultData
        //         const statusDetail = {
        //             "id": InterventionInfo.statusId,
        //             "name": InterventionInfo.status,
        //         }
                setFields({
                    ...fields,
                    intervention: selectedIntervention?.intervention,
                    status: {id:selectedIntervention.statusId,name:selectedIntervention.status}
                })
            // }).catch(error => {
            //     setLoading(false)
            //     renderErrors(error.message);
            // });
    }

    const handleValidation = () => {
        let errors = {};
        let formIsValid = true;
        if (!fields.intervention) {
            formIsValid = false;
            errors["intervention"] = ErrorHelper.FIELD_BLANK
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
        const textAreaValue = e.value
        if (name === "intervention") {
            setFields({
                ...fields,
                [name]: textAreaValue,
            });
        } else {
            setFields({
                ...fields,
                [name]: value,
            });
        }
    };

    const handleSubmitIntervention = (event) => {
        setSettingError(true)
        
        if (handleValidation()) {
            if (selectedIntervention?.id) {
                updateIntervention()
            } else { saveIntervention() }
        }
    }

    const saveIntervention = async () => {
        setLoading(true)
        await ClientService.saveIntervention(fields, selectedIntervention?.objectiveId)
            .then(result => {
                setLoading(false)
                NotificationManager.success("Intervention added successfully");
                onClose({ "added": true, "selectedIntervention": selectedIntervention });
                setIsGoalRefreshed(true)
            }).catch(error => {
                setLoading(false)
                renderErrors(error);
            });
    }

    const updateIntervention = async () => {
        setLoading(true)
        await ClientService.updateIntervention(fields, selectedIntervention)
            .then(result => {
                setLoading(false)
                NotificationManager.success("Intervention updated successfully");
                onClose({ "edited": true, "selectedIntervention": selectedIntervention });
                setIsGoalRefreshed(true)
            }).catch(error => {
                setLoading(false)
                renderErrors(error);
            });
    }

    return (
        <Dialog onClose={onClose} title={selectedIntervention ? "Edit Intervention" : "Add Intervention"} className='small-dailog'>
            <div className='edit-client-popup '>
                <div className="mb-2 col-md-12 col-12">
                    <TextAreaKendo
                        txtValue={fields.intervention}
                        onChange={handleChange}
                        name="intervention"
                        label={"Intervention"}
                        error={!fields.intervention && errors.intervention}
                        required={settingError}
                    />
                </div>
                <div className="mb-2  col-md-12 col-12">
                    <DropDownKendoRct
                        label="Status"
                        onChange={handleChange}
                        value={fields.status}
                        textField="name"
                        name="status"
                        data={treatmentStatus}
                        dataItemKey="id"
                        required={true}
                        validityStyles={settingError}
                        error={!fields.status && errors.status}
                    />
                </div>
            </div>



            {loading === true && <Loader />}
            <div className="border-bottom-line"></div>


            <div className="d-flex my-3 px-3">
                <div>
                    <button onClick={handleSubmitIntervention} className='btn blue-primary text-white  mx-3' >
                        Save
                    </button>
                </div>
                <div>
                    <button className='btn grey-secondary text-white' onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </Dialog>
    );
}
export default AddIntervention;



