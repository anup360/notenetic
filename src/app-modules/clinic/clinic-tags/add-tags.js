import React, { useEffect, useState } from "react";
import ErrorHelper from "../../../helper/error-helper";
import { NotificationManager } from "react-notifications";
import InputKendoRct from "../../../control-components/input/input";
import Loader from "../../../control-components/loader/loader";
import { useSelector } from "react-redux";
import { Dialog } from "@progress/kendo-react-dialogs";
import { SettingsService } from "../../../services/settingsService";
import NOTIFICATION_MESSAGE from "../../../helper/notification-messages";
import { ColorPicker } from "@progress/kendo-react-inputs";
import Utils from "../../../helper/utils"
import { Error } from '@progress/kendo-react-labels';
import { renderErrors } from "src/helper/error-message-helper";

const AddClinicTags = ({ onClose, selectedTag }) => {

    const paletteSettings = {
        palette: ["#28a745", "#dc3545", "#ffc107", "#007bff", "#6f42c1", "#f0d0c9", "#e2a293", "#d4735e", "#65281a", "#eddfda", "#dcc0b6", "#cba092", "#7b4b3a", "#fcecd5", "#f9d9ab", "#f6c781", "#c87d0e", "#e1dca5", "#d0c974", "#a29a36", "#514d1b", "#c6d9f0", "#8db3e2", "#548dd4", "#17365d"],
        columns: 5,
        tileSize: 30,
    };

    let [fields, setFields] = useState({
        tagName: "",
        id: selectedTag?.id
    });


    let [tagColor, setTagColor] = useState();
    const [errors, setErrors] = useState("");

    const [loading, setLoading] = useState(false);
    const [settingError, setSettingError] = useState(false);
    const clinicId = useSelector((state) => state.loggedIn.clinicId);


    useEffect(() => {
        if (selectedTag) {
            getClinicTagsById()
        }

    }, []);

    const getClinicTagsById = async () => {
        setLoading(true)
        await SettingsService.getClinicTagsById(selectedTag?.id)
            .then((result) => {
                setLoading(false)
                let data = result.resultData;
                setFields({
                    ...fields,
                    tagName: data?.tagName,
                })

                setTagColor(data.color)

            })
            .catch((error) => {
                setLoading(false);
                renderErrors(error.message);
            });
    };


    const updateClinicTag = async () => {
        setLoading(true)
        await SettingsService.updateCliniClientTags(fields, tagColor)
            .then(result => {
                setLoading(false)
                NotificationManager.success(NOTIFICATION_MESSAGE.TAG_UPDATED);
                onClose({ "updated": true });
            }).catch(error => {
                setLoading(false)
                renderErrors(error);
            });
    }

    const addClinicTag = async () => {
        setLoading(true)
        await SettingsService.addCliniClientTags(fields, tagColor)
            .then(result => {
                setLoading(false)
                NotificationManager.success(NOTIFICATION_MESSAGE.TAG_ADDED);
                onClose({ "updated": true });
            }).catch(error => {
                setLoading(false)
                renderErrors(error);
            });
    }

    const handleValidation = () => {
        let errors = {};
        let formIsValid = true;
        if (!fields.tagName || fields.tagName.trim().length === 0) {
            formIsValid = false;
            errors["tagName"] = ErrorHelper.TAG_NAME;
        }
        if (!tagColor || tagColor.trim().length === 0) {
            formIsValid = false;
            errors["tagColor"] = ErrorHelper.TAG_COLOR;
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
            if (selectedTag) {
                updateClinicTag();
            } else {
                addClinicTag();
            }
        }
    };



    return (
        <Dialog
            onClose={onClose}
            title={selectedTag ? "Update Tag" : "Add Tag"}
            className="small-dailog"
        >
            <div className=" edit-Service-popup py-3">
                <div className="mx-3">
                    <div className="row align-items-center">
                        <div className="k col-lg-8 col-md-8 col-12">
                            <InputKendoRct
                                value={fields.tagName}
                                onChange={handleChange}
                                name="tagName"
                                label="Tag Name"
                                error={fields.tagName == "" && errors.tagName}
                                validityStyles={settingError}
                                required={true}
                                placeholder={"Tag Name"}
                            />
                        </div>
                    <div className="col-lg-4 col-md-4 col-12 pt-4">
                    <ColorPicker
                        view="palette"
                        paletteSettings={paletteSettings}
                        defaultValue={tagColor}
                        value={tagColor}
                        onChange={(e) => {
                            let newColor = Utils.rgba2hex(e.value, true)
                            setTagColor(newColor)
                        }}

                    />
                    </div>
                    </div>
                    {
                        errors &&
                        <Error >
                            {errors.tagColor}
                        </Error>
                    }
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
                        {selectedTag ? "Update" : "Add"}
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
export default AddClinicTags;
