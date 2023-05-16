import React, { useEffect, useState } from "react";
import DatePickerKendoRct from "../../../../control-components/date-picker/date-picker";
import ErrorHelper from "../../../../helper/error-helper";
import { NotificationManager } from "react-notifications";
import DropDownKendoRct from "../../../../control-components/drop-down/drop-down";
import Loader from "../../../../control-components/loader/loader";
import { Dialog } from "@progress/kendo-react-dialogs";
import { ClientService } from "../../../../services/clientService";
import TextAreaKendo from "../../../../control-components/kendo-text-area/kendo-text-area";
import ValidationHelper from "src/helper/validation-helper";
import { renderErrors } from "src/helper/error-message-helper";

const AddObjective = ({ onClose, selectedObjective,setIsGoalRefreshed }) => {
    const vHelper = ValidationHelper();
    let [fields, setFields] = useState({
        objective: "",
        startDate: "",
        endDate: "",
        status: "",
    });
    const [errors, setErrors] = useState("");
    const [loading, setLoading] = useState(false);
    const [settingError, setSettingError] = useState(false);
    const [treatmentStatus, setTreatmentStatus] = useState([]);

    useEffect(() => {
        getTreatmentPlanStatus();
        if (selectedObjective?.id) { getObjectiveById(); }
    }, []);

    const getTreatmentPlanStatus = async () => {
        await ClientService.getTreatmentPlanStatus()
            .then((result) => {
                let treatmentStatusList = result.resultData;
                setTreatmentStatus(treatmentStatusList);
            })
            .catch((error) => {
                renderErrors(error);
            });
    };

    const getObjectiveById = async () => {
        // setLoading(true);
        // await ClientService.getObjectiveById(selectedObjective?.id)
        //     .then((result) => {
        //         setLoading(false);
        //         let objectiveInfo = result.resultData;
        //         const statusDetail = {
        //             id: objectiveInfo.statusId,
        //             name: objectiveInfo.status,
        //         };
                setFields({
                    ...fields,
                    objective: selectedObjective?.objective,
                    startDate:
                    selectedObjective.startDate == null
                            ? ""
                            : new Date(selectedObjective.startDate),
                    endDate:
                    selectedObjective.endDate == null
                            ? ""
                            : new Date(selectedObjective.endDate),
                    status: {id:selectedObjective.statusId,name:selectedObjective.status},
                });
            // })
            // .catch((error) => {
            //     setLoading(false);
            //     renderErrors(error.message);
            // });
    };

    const handleValidation = () => {
        
        let errors = {};
        let formIsValid = true;
        if (!fields.objective) {
            formIsValid = false;
            errors["objective"] = ErrorHelper.FIELD_BLANK;
        }
        if (!fields.status) {
            formIsValid = false;
            errors["status"] = ErrorHelper.FIELD_BLANK;
        }

        if(fields.startDate  && fields.endDate){
            let error = vHelper.startDateGreaterThanValidator(
              fields.startDate,
              fields.endDate,
              "startDate",
              "endDate"
            );
            
            if (error && error.length > 0) {
              errors["startDate"] = error;
              formIsValid = false;
            }
          }

        setErrors(errors);
        
        return formIsValid;
    };

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        const textAreaValue = e.value
        if (name === "objective") {
            setFields({
                ...fields,
                [name]: textAreaValue,
            });
        } else {
            setFields({
                ...fields,
                [name]: value,
            });
        }
    };

    const handleSubmitObjective = (event) => {
        setSettingError(true);
        if (handleValidation()) {
            if (selectedObjective?.id) {
                updateObjective();
            } else {
                saveObjective();
            }
        }
    };

    const saveObjective = async () => {
        setLoading(true);
        await ClientService.saveObjective(fields, selectedObjective?.goalId)
            .then((result) => {
                setLoading(false);
                NotificationManager.success("Objective added successfully");
                onClose({ added: true,selectedObjective: selectedObjective?.goalId });
                setIsGoalRefreshed(true)
            })
            .catch((error) => {
                setLoading(false);
                renderErrors(error);
            });
    };

    const updateObjective = async () => {
        setLoading(true);
        await ClientService.updatePlanObjective(fields, selectedObjective)
            .then((result) => {
                setLoading(false);
                NotificationManager.success("Objective updated successfully");
                onClose({ edited: true, selectedObjective: selectedObjective });
                setIsGoalRefreshed(true)
            })
            .catch((error) => {
                setLoading(false);
                renderErrors(error);
            });
    };

    return (
        <div  onKeyDown={(e) => e.stopPropagation()}>
            <Dialog
                onClose={onClose}
                title={selectedObjective ? "Edit Objective" : "Add Objective"}
                className="dailog-modal">
                <div className="Service-accept edit-Service-popup">
                    <div className=" py-3">
                        <div className="mb-2 col-lg-12 col-md-12 col-12">
                            <TextAreaKendo
                                txtValue={fields.objective}
                                onChange={handleChange}
                                name="objective"
                                label="Objective"
                                title={"Objective"}
                                error={!fields.objective && errors.objective}
                                required={settingError} />
                        </div>
                        <div className="d-flex flex-wrap">
                            <div className="mb-2 col-lg-6 col-md-6 col-12">
                                
                                <DatePickerKendoRct
                                    onChange={handleChange}
                                    format={"MM/dd/YYYY"}
                                    placeholder=""
                                    value={fields.startDate}
                                    name={"startDate"}
                                    fillMode={"solid"}
                                    size={"medium"}
                                    title={"Start Date"}
                                    label={"Start Date"}
                                    weekNumber={false}
                                    error={fields.startDate && errors.startDate}
                                />
                            </div>
                            <div className="mb-2 col-lg-6 col-md-6 col-12">
                                <DatePickerKendoRct
                                    onChange={handleChange}
                                    format={"MM/dd/YYYY"}
                                    placeholder=""
                                    value={fields.endDate}
                                    name={"endDate"}
                                    fillMode={"solid"}
                                    size={"medium"}
                                    title={"End Date"}
                                    weekNumber={false}
                                    label={"End Date"}
                                    min={fields.startDate? new Date(fields.startDate):null}
                                />
                            </div>
                            <div className="mb-2 col-lg-12 col-md-12 col-12">
                                <DropDownKendoRct
                                    label="Status"
                                    onChange={handleChange}
                                    value={fields.status}
                                    textField="name"
                                    name="status"
                                    data={treatmentStatus}
                                    dataItemKey="id"
                                    required={true}
                                    validityStyles={settingError}
                                    error={!fields.status && errors.status}
                                />
                            </div>
                        </div>
                    </div>
                    </div>
                    <div className="border-bottom-line"></div>


                    {loading === true && <Loader />}

                    <div className="d-flex mx-2 my-3">
                        <button
                            onClick={handleSubmitObjective}
                            className="btn blue-primary text-white  mr-3"
                        >
                            Submit
                        </button>
                        <button
                            className="btn grey-secondary text-white"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>
            </Dialog>
        </div>
    );
};
export default AddObjective;
