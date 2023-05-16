import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import Loader from "../../control-components/loader/loader";
import InputKendoRct from '../../control-components/input/input'
import { CommonService } from "../../services/commonService";
import ErrorHelper from '../../helper/error-helper'
import NOTIFICATION_MESSAGE from '../../helper/notification-messages';
import DEVELOPMENT_CONFIG from '../../helper/config'
import { renderErrors } from "src/helper/error-message-helper";

const ConfirmOtp = ({ setIsStepperValue, onClose, userName }) => {
    let [fields, setFields] = useState({
        userName: userName ? userName : "",
        otp: ""
    });
    const [errors, setErrors] = useState("");
    const [loading, setLoading] = useState(false);
    const [settingError, setSettingError] = useState(false);
    const [showOtp, setShowOtp] = useState("password");

    const handleValidation = () => {
        let errors = {};
        let formIsValid = true;
        var pattern = new RegExp(/(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-zA-Z])/);
        const { otp, } = fields;
        if (!otp || otp.trim().length === 0) {
            formIsValid = false;
            errors["otp"] = ErrorHelper.OTP_BLANK
        }
        setErrors(errors);
        return formIsValid;
    };


    const otpConfirmation = async () => {
        setLoading(true)
        await CommonService.confirmOtp(fields)
            .then(result => {
                localStorage.setItem(DEVELOPMENT_CONFIG.TOKEN, result.resultData.token)
                setLoading(false)
                NotificationManager.success(NOTIFICATION_MESSAGE.OTP_CONFIRMED);
                setIsStepperValue(2)
            }).catch(error => {
                setLoading(false)
                renderErrors(error);
            });
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
        setSettingError(true);
        if (handleValidation()) {
            otpConfirmation()
        }
    };

    const handleShowOtp = () => {
        setShowOtp(showOtp === "password" ? "text" : "password")
    }

    return (
        <div className='Service-accept edit-Service-popup'>
            <div className="row py-3">
                <div className="mb-2 col-md-6 col-12 mx-auto">
                    <InputKendoRct
                        name="otp"
                        value={fields.otp}
                        onChange={handleChange}
                        label="Confirm Otp"
                        error={fields.otp == "" && errors.otp}
                        validityStyles={settingError}
                        required={true}
                        type={showOtp}
                    />
                    <div onClick={handleShowOtp} className="cursor-pointer eye-close">
                        {showOtp !== 'password' ? <i className="far fa-eye text-theme" ></i> : <i className="far fa-eye-slash" ></i>}
                    </div>
                </div>
            </div>

            {loading == true && <Loader />}

            <div className="d-flex my-3  col-md-6 col-12 mx-auto">
                <button
                    onClick={handleSubmit}
                    className="btn blue-primary text-white  mr-3"
                >
                    Verify Otp
                </button>
                <button
                    className="btn grey-secondary text-white"
                    onClick={onClose}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};
export default ConfirmOtp;
