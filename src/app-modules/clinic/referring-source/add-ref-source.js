import React, { useEffect, useState } from "react";
import ErrorHelper from "../../../helper/error-helper";
import { NotificationManager } from "react-notifications";
import InputKendoRct from "../../../control-components/input/input";
import Loader from "../../../control-components/loader/loader";
import { useSelector } from "react-redux";
import { Dialog } from "@progress/kendo-react-dialogs";
import PhoneInputMask from "../../../control-components/phone-input-mask/phone-input-mask";
import { SettingsService } from "../../../services/settingsService";
import { renderErrors } from "src/helper/error-message-helper";

import NOTIFICATION_MESSAGE from "../../../helper/notification-messages";


const AddRefSource = ({ onClose, selectedRefId, activeType }) => {

    let [fields, setFields] = useState({
        companyName: "",
        npi: "",
        contactPerson: "",
        position: "",
        mobilePhone: "",
        email: "",
        fax: "",
        address: "",
    });

    const [errors, setErrors] = useState("");
    const [loading, setLoading] = useState(false);
    const [stateData, setStateData] = useState([]);
    const clinicId = useSelector((state) => state.loggedIn.clinicId);
    const [settingError, setSettingError] = useState(false);
    const maskedRef = React.useRef(null);

    useEffect(() => {
        if (selectedRefId) {
            getSourceRefById()
        }
    }, []);

    const getSourceRefById = async () => {
        setLoading(true);
        await SettingsService.getRefSourceById(selectedRefId, !activeType)
            .then((result) => {
                setLoading(false);
                let info = result.resultData;
                setFields({
                    ...fields,
                    companyName: info?.referringCompanyName,
                    npi: info?.referringCompanyNPI,
                    email: info?.contactEmail,
                    contactPerson: info?.contactPerson,
                    address: info?.address,
                    mobilePhone: info?.contactPhone,
                    position: info?.contactPersonPosition,
                    fax: info?.contactFax
                })
            })
            .catch((error) => {
                setLoading(false);
                renderErrors(error.message);
            });
    };


    const saveRefSource = async () => {
        setLoading(true)
        await SettingsService.insertRefSource(fields)
            .then(result => {
                setLoading(false)
                NotificationManager.success(NOTIFICATION_MESSAGE.CLINIC_REF_SOURCE);
                onClose({ "added": true });
            }).catch(error => {
                setLoading(false)
                renderErrors(error);
            });
    }

    const updateReferringSource = async () => {
        setLoading(true)
        await SettingsService.updateRefSource(fields, selectedRefId)
            .then(result => {
                setLoading(false)
                NotificationManager.success(NOTIFICATION_MESSAGE.UPDATED_REF_SOURCE);
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
        if (!fields.companyName || fields.companyName.trim().length === 0) {
            formIsValid = false;
            errors["companyName"] = ErrorHelper.COMPANY_NAME;
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
        if (!fields.position || fields.position.trim().length === 0) {
            formIsValid = false;
            errors["position"] = ErrorHelper.POSITION;
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
                updateReferringSource();
            } else {
                saveRefSource();

            }
        }
    };

    return (
        <Dialog
            onClose={onClose}
            title={selectedRefId ? "Edit Referring Source" : "Add Referring Source"}
            className="dialog-modal"
        >
            <div className=" edit-Service-popup">
                <div className="mx-3">
                    <div className="row">

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
                                value={fields.position}
                                onChange={handleChange}
                                name="position"
                                label="Persons's Position"
                                error={fields.position == "" && errors.position}
                                required={true}
                                placeholder="Position"
                            />
                        </div>

                        <div className="mb-2 col-lg-4 col-md-6 col-12">
                            <InputKendoRct
                                validityStyles={settingError}
                                value={fields.contactPerson}
                                onChange={handleChange}
                                name="contactPerson"
                                label="Contact Person"
                                placeholder="Contact Person"
                            />
                        </div>

                        <div className="mb-2 col-lg-4 col-md-6 col-12">
                            <PhoneInputMask
                                value={fields.mobilePhone}
                                onChange={handleValueChange}
                                name="mobilePhone"
                                label="Contact Phone"
                                error={fields.mobilePhone === "" && errors.mobilePhone}
                                validityStyles={settingError}
                                placeholder="Contact Phone"

                            />
                        </div>

                        <div className="mb-2 col-lg-4 col-md-6 col-12">
                            <InputKendoRct
                                validityStyles={settingError}
                                value={fields.email}
                                onChange={handleChange}
                                name="email"
                                label="Contact Email"
                                error={errors.email}
                                required={true}
                                placeholder="Contact Email"
                            />
                        </div>

                        <div className="mb-2 col-lg-4 col-md-6 col-12">
                            <InputKendoRct
                                validityStyles={settingError}
                                value={fields.fax}
                                onChange={handleChange}
                                name="fax"
                                label="Contact Fax"
                                error={fields.fax == "" && errors.fax}
                                placeholder="Fax"
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
export default AddRefSource;
