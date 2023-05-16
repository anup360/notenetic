import React, { useEffect, useState } from "react";
import ErrorHelper from "../../../helper/error-helper";
import { NotificationManager } from "react-notifications";
import InputKendoRct from "../../../control-components/input/input";
import Loader from "../../../control-components/loader/loader";
import { useSelector } from "react-redux";
import { Dialog } from "@progress/kendo-react-dialogs";
import { SettingsService } from "../../../services/settingsService";
import { renderErrors } from "src/helper/error-message-helper";

const AddClientStatus= ({ onClose,getClientStatus }) => {
    const [errors, setErrors] = useState("");
    const [loading, setLoading] = useState(false);
    const [settingError, setSettingError] = useState(false);
    const clinicId = useSelector((state) => state.loggedIn.clinicId);
    let [fields, setFields] = useState({
        statusName: "",
    });

    const addClinicTag = async () => {
        setLoading(true)
        await SettingsService.addClientStatus(fields,clinicId)
            .then(result => {
                setLoading(false)
                NotificationManager.success("Client Status Added Successfully");
                onClose({ "added": true });
                getClientStatus()
            }).catch(error => {
                setLoading(false)
                renderErrors(error);
            });
    }

    const handleValidation = () => {
        let errors = {};
        let formIsValid = true;
        if (!fields.statusName || fields.statusName.trim().length === 0) {
            formIsValid = false;
            errors["statusName"] = ErrorHelper.STATUS_NAME;
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


    const handleSubmit = (event) => {
        setSettingError(true);
        if (handleValidation()) {
                addClinicTag();
        }
    };

    return (
        <Dialog
            onClose={onClose}
            title={"Add Client Status"}
            className="small-dailog"
        >
            <div className=" edit-Service-popup py-3">
                <div className="mx-3">
                    <div className="row align-items-center">
                        <div className="k col-lg-8 col-md-8 col-12">
                            <InputKendoRct
                                value={fields.statusName}
                                onChange={handleChange}
                                name="statusName"
                                label="Status Name"
                                error={fields.statusName == "" && errors.statusName}
                                validityStyles={settingError}
                                required={true}
                                placeholder={"Status Name"}
                            />
                        </div>

                    </div>
                </div>
                {loading == true && <Loader />}
            </div>
            <div className="border-bottom-line"></div>
            <div className="d-flex my-4">
                <div className="right-sde">
                    <button
                        className="btn blue-primary text-white mx-3"
                        onClick={handleSubmit}
                    >
                        {"Add"}
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
export default AddClientStatus;
