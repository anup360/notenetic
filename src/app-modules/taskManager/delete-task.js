
import React, { useState } from 'react';
import NotificationManager from 'react-notifications/lib/NotificationManager';
import DeleteDialogModal from "../../control-components/custom-delete-dialog-box/delete-dialog";
import NOTIFICATION_MESSAGE from '../../helper/notification-messages';
import { TaskService } from '../../services/taskService';
import { renderErrors } from "src/helper/error-message-helper";

const DeleteTaks = ({ onClose, selectedTask, selectedDiscussionId }) => {

    const [loading, setLoading] = useState(false);

    const deleteTask = () => {
        setLoading(true)
        TaskService.deleteTask(selectedTask.id)
            .then(result => {
                NotificationManager.success(NOTIFICATION_MESSAGE.TASK_DELETED)
                onClose({ "isDeleted": true });
            }).catch(error => {
                renderErrors(error)
            })
            .finally(() => { setLoading(false) })
    }

    const deleteDiscussion = () => {
        setLoading(true)
        TaskService.deleteTaskDiscussion(selectedDiscussionId)
            .then(result => {
                NotificationManager.success(NOTIFICATION_MESSAGE.DISCUSSION_DELETED)
                onClose({ "isDeleteDiscussion": true });
            }).catch(error => {
                renderErrors("Something went wrong")
            })
            .finally(() => { setLoading(false) })

    }

    const handleDelete = () => {
        if (selectedDiscussionId) {
            deleteDiscussion()
        } else {
            deleteTask()
        }
    }

    return (
        <DeleteDialogModal
            onClose={onClose}
            title={selectedDiscussionId ? "Discussion" : "Task"}
            message={selectedDiscussionId ? "discussion" : "task"}
            handleDelete={handleDelete}
        />
    );
}
export default DeleteTaks;



