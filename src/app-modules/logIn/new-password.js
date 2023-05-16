import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import Loader from "../../control-components/loader/loader";
import InputKendoRct from '../../control-components/input/input'
import { CommonService } from "../../services/commonService";
import PasswordValidator from "../../helper/password-helper";
import ErrorHelper from '../../helper/error-helper'
import NOTIFICATION_MESSAGE from '../../helper/notification-messages';
import { renderErrors } from "src/helper/error-message-helper";

const NewPassword = ({ onClose }) => {
    let [fields, setFields] = useState({
        confirmPassword: "",
        newPassword: "",
    });
    const vHelper = PasswordValidator();
    const [errors, setErrors] = useState("");
    const [loading, setLoading] = useState(false);
    const [settingError, setSettingError] = useState(false);
    const [showNewPass, setShowNewPass] = useState("password");
    const [isNumber, setIsNumber] = useState(false);
    const [isAlphabet, setIsAlphabet] = useState(false);
    const [isChar, setIsChar] = useState(false);

    const handleValidation = () => {
        let errors = {};
        let formIsValid = true;
        var pattern = new RegExp(/(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-zA-Z])/);
        const { confirmPassword, newPassword } = fields;
        if (!newPassword || newPassword.trim().length === 0) {
            formIsValid = false;
            errors["newPassword"] = ErrorHelper.BLANK_NEW_PASSWORD
        } else if (!pattern.test(newPassword)) {
            formIsValid = false;
            errors["newPassword"] = ErrorHelper.PASSWORD_CONTAIN_CHECK
        } else if (newPassword.trim().length < 8) {
            formIsValid = false;
            errors["newPassword"] = ErrorHelper.PASSWORD_COUNT_CHECK
        }
        if (!confirmPassword || confirmPassword.trim().length === 0) {
            formIsValid = false;
            errors["confirmPassword"] = ErrorHelper.CONFIRM_PASSWORD_BLANK
        } else if (newPassword && newPassword.trim().length > 0 && confirmPassword.trim() !== newPassword.trim()) {
            formIsValid = false;
            errors["confirmPassword"] = ErrorHelper.PASSWORD_DIDNT_MATCH
        }
        setErrors(errors);
        return formIsValid;
    };


    const updatePassword = async () => {
        setLoading(true)
        await CommonService.updatePassword(fields)
            .then(result => {
                setLoading(false)
                NotificationManager.success(NOTIFICATION_MESSAGE.PASSWORD_CHANGED);
                onClose();
            }).catch(error => {
                setLoading(false)
                renderErrors(error);
            });
    }

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        if (name == "newPassword") {
            let numResult = vHelper.numberValidator(value)
            setIsNumber(numResult)
            let alphaResult = vHelper.alphabetValidator(value)
            setIsAlphabet(alphaResult)
            let charResult = vHelper.specialCharValidator(value)
            setIsChar(charResult)
        }
        setFields({
            ...fields,
            [name]: value,
        });
    };


    const handleSubmit = (event) => {
        setSettingError(true);
        if (handleValidation()) {
            updatePassword()
        }
    };

    const handleShowNewPass = () => {
        setShowNewPass(showNewPass === "password" ? "text" : "password")
    }

    return (
        <div className="Service-accept edit-Service-popup">
            <div className="row py-3">
                <div className="mb-2 col-lg-12 col-md-12 col-12">
                    <InputKendoRct
                        value={fields.newPassword}
                        onChange={handleChange}
                        name="newPassword"
                        label=" New Password"
                        error={errors.newPassword}
                        validityStyles={settingError}
                        required={true}
                        type={showNewPass}
                    />
                    <div onClick={handleShowNewPass} className="cursor-pointer eye-close">
                        {showNewPass !== 'password' ? <i className="far fa-eye text-theme" ></i> : <i className="far fa-eye-slash" ></i>}
                    </div>
                    {
                        fields.newPassword &&
                        <div>
                            <div className="mt-2">
                                <p>At least 1 Number
                                    {
                                        isNumber == true ?
                                            <i className="fa-solid fa-check pl-2"></i> :
                                            <i className="fa-solid fa-xmark pl-2"></i>
                                    }
                                </p>
                            </div>
                            <div className="mt-2">
                                <p>At least 1 Alphabet
                                    {
                                        isAlphabet == true ?
                                            <i className="fa-solid fa-check pl-2"></i> :
                                            <i className="fa-solid fa-xmark pl-2"></i>
                                    }
                                </p>
                            </div>
                            <div className="mt-2">
                                <p>At least 1 Special Character
                                    {
                                        isChar == true ?
                                            <i className="fa-solid fa-check pl-2"></i> :
                                            <i className="fa-solid fa-xmark pl-2"></i>
                                    }
                                </p>
                            </div>
                        </div>
                    }
                </div>
                <div className="mb-2 col-lg-12 col-md-12 col-12">
                    <InputKendoRct
                        value={fields.confirmPassword}
                        onChange={handleChange}
                        name="confirmPassword"
                        label=" Confirm Password"
                        error={errors.confirmPassword}
                        validityStyles={settingError}
                        required={true}
                        type={"password"}
                    />
                </div>
            </div>
            {loading == true && <Loader />}
            <div className="d-flex my-3">
                <button
                    onClick={handleSubmit}
                    className="btn blue-primary text-white  mr-3"
                >
                    Reset Password
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
export default NewPassword;
