
import React, { useState } from 'react';
import Loader from "../../../../control-components/loader/loader";
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import NotificationManager from 'react-notifications/lib/NotificationManager';
import { ClientService } from '../../../../services/clientService';
import NOTIFICATION_MESSAGE from '../../../../helper/notification-messages';
import { renderErrors } from "src/helper/error-message-helper";


const DeleteTreatment = ({ onClose, isDeleteObjective, isDeletePlans, isDeleteGoals, isDeleteIntervention, selectedPlan, selectedObjective, selectedIntervention,setIsGoalRefreshed }) => {
    const [loading, setLoading] = useState(false);
    const deletePlans = async () => {
        setLoading(true)
        await ClientService.deleteTreatmentPlans(selectedPlan.id)
            .then(result => {
                setLoading(false)
                NotificationManager.success(NOTIFICATION_MESSAGE.TREATMENT_PLAN_DELETED)
                onClose({ "isDeleted": "planDeleted" });
            }).catch(error => {
                renderErrors(error)
                setLoading(false)
            });
    }

    const deleteGoals = async () => {
        setLoading(true)
        await ClientService.deleteTreatmentGoals(selectedPlan.id)
            .then(result => {
                setLoading(false)
                NotificationManager.success(NOTIFICATION_MESSAGE.TREATMENT_GOAL_DELETED)
                onClose({ "isDeleted": "planDeleted" });
                setIsGoalRefreshed(true);
            }).catch(error => {
                renderErrors(error)
                setLoading(false)
            });
    }
    const deleteObjective = async () => {
        setLoading(true)
        await ClientService.deleteTreatmentObjective(selectedObjective?.id)
            .then(result => {
                setLoading(false)
                NotificationManager.success(NOTIFICATION_MESSAGE.TREATMENT_OBJECTIVE_DELETED)
                onClose({ "isDeleted": "objectiveDeleted" });
                setIsGoalRefreshed(true)
            }).catch(error => {
                renderErrors(error)
                setLoading(false)
            });
    }

    const deleteIntervention = async () => {
        setLoading(true)
        await ClientService.deleteTreatmentIntervention(selectedIntervention.id)
            .then(result => {
                setLoading(false)
                NotificationManager.success(NOTIFICATION_MESSAGE.TREATMENT_INTERVENTION_DELETED)
                onClose({ "isDeleted": "interventionDeleted" });
                setIsGoalRefreshed(true)
            }).catch(error => {
                renderErrors(error)
                setLoading(false)
            });
    }

    const handleDelete = () => {
        if (isDeletePlans === true) { deletePlans() }
        if (isDeleteGoals === true) { deleteGoals() }
        if (isDeleteObjective === true) { deleteObjective() }
        if (isDeleteIntervention === true) { deleteIntervention() }
    }

    let titleText = ""
    if (isDeletePlans === true) { titleText = "Plan" }
    if (isDeleteGoals === true) { titleText = "Goal" }
    if (isDeleteObjective === true) { titleText = "Objective" }
    if (isDeleteIntervention === true) { titleText = "Intervention" }


    return (
        <Dialog onClose={onClose} title={"Delete Treatment " + titleText} className=''>
            {loading === true && <Loader />}
            <p style={{
                margin: "25px", textAlign: "center"
            }}>Are you sure you want to delete ? </p>
            <DialogActionsBar>
            <button className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base" onClick={handleDelete} >Yes</button>
                <button className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base" onClick={onClose} >No</button>
            </DialogActionsBar>
        </Dialog>
    );
}
export default DeleteTreatment;



