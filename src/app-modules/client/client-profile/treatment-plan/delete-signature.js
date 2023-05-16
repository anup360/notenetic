
import React, { useState } from 'react';
import Loader from "../../../../control-components/loader/loader";
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import NotificationManager from 'react-notifications/lib/NotificationManager';
import { ClientService } from '../../../../services/clientService';
import NOTIFICATION_MESSAGE from '../../../../helper/notification-messages';
import { useSelector } from "react-redux";
import { renderErrors } from "src/helper/error-message-helper";


const DeleteSignature = ({ onClose, clientSignObj, staffSignObj, setIsGoalRefreshed }) => {
    const [loading, setLoading] = useState(false);
    const staffId = useSelector(state => state.loggedIn?.staffId);
    const selectedClientId = useSelector(state => state.selectedClientId);

    const deleteClientSign = async () => {
        setLoading(true)
        await ClientService.deleteClientPlanSignature(selectedClientId, clientSignObj)
            .then(result => {
                setLoading(false)
                NotificationManager.success(NOTIFICATION_MESSAGE.SIGNATURE_DELETED)
                onClose({ "isDeleted": true });
                setIsGoalRefreshed(true)
            }).catch(error => {
                renderErrors(error)
                setLoading(false)
            });
    }

    const deleteStaffSign = async () => {
        setLoading(true)
        await ClientService.deleteStaffPlanSignature(staffSignObj.id, staffSignObj.staffId)
            .then(result => {
                setLoading(false)
                NotificationManager.success(NOTIFICATION_MESSAGE.SIGNATURE_DELETED)
                onClose({ "isDeleted": true });
                setIsGoalRefreshed(true)
            }).catch(error => {
                renderErrors(error)
                setLoading(false)
            });
    }

    const handleDelete = () => {
        if (staffSignObj.staffId) {
            deleteStaffSign()
        } else {
            deleteClientSign()
        }
    }

    return (
        <Dialog onClose={onClose} title={"Delete Signature "} className=''>
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
export default DeleteSignature;



