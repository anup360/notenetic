import React, { useEffect, useState } from "react";
import ErrorHelper from "../../../helper/error-helper";
import { NotificationManager } from "react-notifications";
import InputKendoRct from "../../../control-components/input/input";
import Loader from "../../../control-components/loader/loader";
import { useSelector } from "react-redux";
import { Dialog } from "@progress/kendo-react-dialogs";
import PhoneInputMask from "../../../control-components/phone-input-mask/phone-input-mask";
import ZipCodeInput from "../../../control-components/zip-code/zip-code";
import { SettingsService } from "../../../services/settingsService";
import { renderErrors } from "src/helper/error-message-helper";

import NOTIFICATION_MESSAGE from "../../../helper/notification-messages";
import { update } from "lodash";


const AddReferringProvider = ({ onClose, selectedRefId, activeType }) => {


    let [fields, setFields] = useState({
        firstName: "",
        lastName: "",
        npi: "",
        email: "",
        companyName: "",
        address: "",
        city: "",
        state: "",
        mobilePhone: "",
        zipCode: "",
    });

    const [errors, setErrors] = useState("");
    const [loading, setLoading] = useState(false);
    const [stateData, setStateData] = useState([]);
    const clinicId = useSelector((state) => state.loggedIn.clinicId);
    const [settingError, setSettingError] = useState(false);

    const maskedRef = React.useRef(null);

    useEffect(() => {
        if (selectedRefId) {
            getProviderRefById()
        }
    }, []);


    const getProviderRefById = async () => {
        setLoading(true);
        await SettingsService.getRefProviderById(selectedRefId, !activeType)
            .then((result) => {
                setLoading(false);
                let info = result.resultData;
                setFields({
                    ...fields,
                    firstName: info?.firstName,
                    lastName: info?.lastName,
                    npi: info?.npi,
                    email: info?.email,
                    companyName: info?.companyName,
                    address: info?.address,
                    city: info?.city,
                    state: info?.state,
                    mobilePhone: info?.contactPhone,
                    zipCode: info?.zip,
                })
            })
            .catch((error) => {
                setLoading(false);
                renderErrors(error.message);
            });
    };


    const saveClinicReferring = async () => {
        setLoading(true)
        await SettingsService.insertClinicReferring(fields)
            .then(result => {
                setLoading(false)
                NotificationManager.success(NOTIFICATION_MESSAGE.CLINIC_REFERRING_PROVIDER);
                onClose({ "added": true });
            }).catch(error => {
                setLoading(false)
                renderErrors(error);
            });
    }

    const updateClinicReferring = async () => {
        setLoading(true)
        await SettingsService.updateClinicReferring(fields, selectedRefId)
            .then(result => {
                setLoading(false)
                NotificationManager.success(NOTIFICATION_MESSAGE.UPDATED_REFERRING_PROVIDER);
                onClose({ "updated": true });
            }).catch(error => {
                setLoading(false)
                renderErrors(error);
            });
    }



    const handleValidation = () => {
        let errors = {};
        let formIsValid = true;
        var emailPattern = new RegExp(
            /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
        );
        var pattern = new RegExp(/^[0-9\b]+$/);
        if (!fields.address || fields.address.trim().length === 0) {
            formIsValid = false;
            errors["address"] = ErrorHelper.ADDRESS;
        }
        if (!fields.city || fields.city.trim().length === 0) {
            formIsValid = false;
            errors["city"] = ErrorHelper.CITY;
        }
        if (!fields.firstName || fields.firstName.trim().length === 0) {
            formIsValid = false;
            errors["firstName"] = ErrorHelper.FIRST_NAME;
        }
        if (!fields.companyName || fields.companyName.trim().length === 0) {
            formIsValid = false;
            errors["companyName"] = ErrorHelper.COMPANY_NAME;
        }
        if (!fields.lastName || fields.lastName.trim().length === 0) {
            formIsValid = false;
            errors["lastName"] = ErrorHelper.LAST_NAME;
        }
        if (!fields.npi || fields.npi.trim().length === 0) {
            formIsValid = false;
            errors["npi"] = ErrorHelper.NPI;
        }
        if (!fields.email || fields.email.trim().length === 0) {
            formIsValid = false;
            errors["email"] = ErrorHelper.EMAIL;
        } else if (!emailPattern.test(fields.email)) {
            formIsValid = false;
            errors["email"] = ErrorHelper.INVALID_EMAIL;
        }

        if (!fields.state || fields.state.trim().length === 0) {
            formIsValid = false;
            errors["state"] = ErrorHelper.STATE;
        }

        setErrors(errors);
        return formIsValid;
    };

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setFields({
            ...fields,
            [name]: value,
        });
    };


    const handleValueChange = (e) => {
        const name = e.target.name;
        const rawValue = e.target.rawValue;
        setFields({
            ...fields,
            [name]: rawValue,
        });
    };



    const handleSubmit = (event) => {
        setSettingError(true);
        if (handleValidation()) {
            if (selectedRefId) {
                updateClinicReferring();
            } else {
                saveClinicReferring();

            }
        }
    };

    return (
        <Dialog
            onClose={onClose}
            title={selectedRefId ? "Edit Clinic Referring" : "Add Clinic Referring"}
            className="dialog-modal"
        >
            <div className=" edit-Service-popup">
                <div className="mx-3">
                    <div className="row">
                        <div className="mb-2 col-lg-4 col-md-6 col-12">
                            <InputKendoRct
                                value={fields.firstName}
                                onChange={handleChange}
                                name="firstName"
                                label="First Name"
                                error={fields.firstName == "" && errors.firstName}
                                validityStyles={settingError}
                                required={true}
                                placeholder="First Name"
                            />
                        </div>
                        <div className="mb-2 col-lg-4 col-md-6 col-12">
                            <InputKendoRct
                                value={fields.lastName}
                                onChange={handleChange}
                                name="lastName"
                                label="Last Name"
                                error={fields.lastName == "" && errors.lastName}
                                validityStyles={settingError}
                                required={true}
                                placeholder="Last Name"
                            />
                        </div>

                        <div className="mb-2 col-lg-4 col-md-6 col-12">
                            <InputKendoRct
                                value={fields.companyName}
                                onChange={handleChange}
                                name="companyName"
                                label="Company Name"
                                error={fields.companyName == "" && errors.companyName}
                                validityStyles={settingError}
                                required={true}
                                placeholder="Company Name"
                            />
                        </div>
                        <div className="mb-2 col-lg-4 col-md-6 col-12">
                            <InputKendoRct
                                value={fields.npi}
                                onChange={handleChange}
                                name="npi"
                                label="Company NPI"
                                error={fields.npi == "" && errors.npi}
                                validityStyles={settingError}
                                required={true}
                                placeholder="Company NPI"
                            />
                        </div>
                        <div className="mb-2 col-lg-4 col-md-6 col-12">
                            <InputKendoRct
                                validityStyles={settingError}
                                value={fields.email}
                                onChange={handleChange}
                                name="email"
                                label="Email"
                                error={errors.email}
                                required={true}
                                placeholder="Email"
                            />
                        </div>
                        <div className="mb-2 col-lg-4 col-md-6 col-12">
                            <PhoneInputMask
                                value={fields.mobilePhone}
                                onChange={handleValueChange}
                                name="mobilePhone"
                                label="Mobile Number"
                                error={fields.mobilePhone === "" && errors.mobilePhone}
                                validityStyles={settingError}
                                placeholder="Mobile Number"
                            />
                        </div>
                        <div className="mb-2 col-lg-4 col-md-6 col-12">
                            <InputKendoRct
                                value={fields.address}
                                onChange={handleChange}
                                name="address"
                                label="Address"
                                error={fields.address == "" && errors.address}
                                validityStyles={settingError}
                                required={true}
                                placeholder="Address"
                            />
                        </div>





                        <div className="mb-2 col-lg-4 col-md-6 col-12">
                            <InputKendoRct
                                validityStyles={settingError}
                                value={fields.city}
                                onChange={handleChange}
                                name="city"
                                label="City"
                                error={fields.city == "" && errors.city}
                                required={true}
                                placeholder="City"
                            />
                        </div>
                        <div className="mb-2 col-lg-4 col-md-6 col-12">
                            <InputKendoRct
                                value={fields.state}
                                onChange={handleChange}
                                name="state"
                                label="State"
                                error={fields.state == "" && errors.state}
                                validityStyles={settingError}
                                required={true}
                                placeholder="State"
                            />
                        </div>


                        <div className="mb-2 col-lg-4 col-md-6 col-12">
                            <ZipCodeInput
                                value={fields.zipCode}
                                onChange={handleValueChange}
                                name="zipCode"
                                label="Zip Code"
                                error={fields.zipCode === "" && errors.zipCode}
                                validityStyles={settingError}
                                placeholder="Zip Code"
                            />
                        </div>
                    </div>
                </div>
                {loading == true && <Loader />}
            </div>
            <div className="border-bottom-line"></div>
            <div className="d-flex mt-4">
                <div className="right-sde">
                    <button
                        className="btn blue-primary text-white mx-3"
                        onClick={handleSubmit}
                    >
                        {selectedRefId ? "Update" : "Submit"}
                    </button>
                </div>
                <div className="right-sde-grey">
                    <button
                        className="btn grey-secondary text-white "
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </Dialog>
    );
};
export default AddReferringProvider;
