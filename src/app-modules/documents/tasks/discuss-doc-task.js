import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import React from 'react';
import TaskDiscussion from "../../taskManager/task-discussion";

const DiscussDocTask = ({ onClose, task, documentId, authorStaffId }) => {
    return (
        <Dialog onClose={onClose} title={"Task"} className="task-modal-main">
            <TaskDiscussion
                task={task}
                documentId={documentId}
                authorStaffId={authorStaffId}
            />
            <DialogActionsBar>
                <button
                    className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
                    onClick={onClose} >
                    Close
                </button>
            </DialogActionsBar>
        </Dialog>
    )
}

export default DiscussDocTask