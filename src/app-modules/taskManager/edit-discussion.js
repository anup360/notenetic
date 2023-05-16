
import React, { useEffect, useState } from 'react';
import Loader from "../../control-components/loader/loader";
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import NotificationManager from 'react-notifications/lib/NotificationManager';
import NOTIFICATION_MESSAGE from '../../helper/notification-messages';
import { TaskService } from '../../services/taskService';
import TextAreaKendo from "../../control-components/text-area/text-area";
import { renderErrors } from "src/helper/error-message-helper";

const EditDiscussion = ({ onClose, selectedDiscussionId, selectedTaskId }) => {
    let [fields, setFields] = useState({ discussion: "", });
    const [errors, setErrors] = useState("");
    const [settingError, setSettingError] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedDiscussionId) {
            getDiscussionById()
        }
    }, []);

    const handleValidation = () => {
        let errors = {};
        let formIsValid = true;
        if (!fields.discussion) {
            formIsValid = false;
            errors["discussion"] = "this field can't be blank.";
        }
        setErrors(errors);
        return formIsValid;
    };

    const getDiscussionById = async () => {
        setLoading(true)
        await TaskService.getDiscussionById(selectedDiscussionId)
            .then(result => {
                setFields({
                    ...fields,
                    discussion: result.resultData?.description,
                })
                setLoading(false)
            }).catch(error => {
                renderErrors(error.message)
                setLoading(false)
            });
    }

    const updateDiscussion = async () => {
        setLoading(true)
        await TaskService.updateDiscussion(fields.discussion, selectedTaskId, selectedDiscussionId)
            .then(result => {
                setLoading(false)
                NotificationManager.success(NOTIFICATION_MESSAGE.DISCUSSION_UPDATED)
                onClose({ "isUpdated": true });
            }).catch(error => {
                renderErrors(error)
                setLoading(false)
            });
    }

    const handleSubmit = () => {
        setSettingError(true);
        if (handleValidation()) {
            updateDiscussion()
        }
    }

    const handleChange = (e) => {
        const name = e.target.name;
        const textAreaValue = e.value
        setFields({
            ...fields,
            [name]: textAreaValue,
        });
    };

    return (
        <Dialog onClose={onClose} title={"Update Discussion"} className='dialog-modal'>
            <div className='Service-accept edit-Service-popup'>
                <div className=" py-3">
                    <TextAreaKendo
                        txtValue={fields.discussion}
                        onChange={handleChange}
                        name="discussion"
                        label="Discussion"
                        rows="3"
                        className="textarea-description"
                        placeholder="Enter your Discussion Detail"
                    />
                </div>
                {
                    loading == true && <Loader />
                }
                <div className="row my-3" >
                    <div className="d-flex">
                        <div>
                            <button onClick={handleSubmit} className='btn blue-primary text-white  mx-3' >
                                Save
                            </button>
                        </div>
                        <div>
                            <button className='btn grey-secondary text-white' onClick={onClose}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    );
}
export default EditDiscussion;



