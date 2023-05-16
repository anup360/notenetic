
import React, { useEffect, useState } from 'react';
import ErrorHelper from '../../helper/error-helper'
import { NotificationManager } from 'react-notifications';
import Loader from "../../control-components/loader/loader";
import { Dialog } from "@progress/kendo-react-dialogs";
import NOTIFICATION_MESSAGE from '../../helper/notification-messages';
import InputKendoRct from '../../control-components/input/input';
import { CommonService } from '../../services/commonService';
import { Stepper } from "@progress/kendo-react-layout";
import ConfirmOtp from './confirm-otp';
import NewPassword from './new-password';
import { renderErrors } from "src/helper/error-message-helper";

const stepsWithLabel = [
    { label: "Enter Username" },
    { label: "Verify Otp" },
    { label: "Reset Password" }
];

const ForgotPassword = ({ onClose }) => {
    let [fields, setFields] = useState(
        { userName: "", }
    )
    const [errors, setErrors] = useState("");
    const [loading, setLoading] = useState(false);
    const [settingError, setSettingError] = useState(false);
    const [isStepperValue, setIsStepperValue] = React.useState(0);

    const saveForgotPassword = async () => {
        setLoading(true)
        await CommonService.forgotPass(fields.userName)
            .then(result => {
                setLoading(false)
                NotificationManager.success(NOTIFICATION_MESSAGE.USERNAME_SUBMITTED);
                setIsStepperValue(1)
            }).catch(error => {
                setLoading(false)
                renderErrors(error);
            });
    }

    const handleValidation = () => {
        let errors = {};
        let formIsValid = true;
        if (!fields.userName || fields.userName.trim().length === 0) {
            formIsValid = false;
            errors["userName"] = ErrorHelper.USER_NAME
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

    const handleSubmit = (event) => {
        setSettingError(true)
        if (handleValidation()) {
            event.preventDefault();
            saveForgotPassword()
        }
    }

    return (
        <Dialog onClose={onClose} title={"Forgot Password"} className='dialog-modal'>
            <Stepper
                value={isStepperValue}
                items={stepsWithLabel}
            />
            {
                isStepperValue == 0 &&
                <div className='Service-accept edit-Service-popup'>
                    <div className="row py-3">
                        <div className="mb-2 col-md-6 col-12 mx-auto">
                            <InputKendoRct
                                name="userName"
                                value={fields.userName}
                                onChange={handleChange}
                                label="Username"
                                error={fields.userName == "" && errors.userName}
                                validityStyles={settingError}
                                required={true}
                            />
                        </div>
                    </div>
                    {
                        loading == true && <Loader />
                    }
                    <div className="my-3 col-md-6 col-12 mx-auto d-flex">
                        <button
                            onClick={handleSubmit}
                            className="btn blue-primary text-white  mr-3"
                        >
                            Send Otp
                        </button>
                        <button
                            className="btn grey-secondary text-white"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            }
            {
                isStepperValue == 1 && <ConfirmOtp setIsStepperValue={setIsStepperValue} onClose={onClose} userName={fields.userName} />
            }
            {
                isStepperValue == 2 && <NewPassword onClose={onClose} />
            }
        </Dialog>
    );
}
export default ForgotPassword;



