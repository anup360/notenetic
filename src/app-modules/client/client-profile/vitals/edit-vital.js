// JavaScript source code

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import ApiUrls from '../../../../helper/api-urls'
import ErrorHelper from '../../../../helper/error-helper'
import { NotificationManager } from 'react-notifications';
import ApiHelper from '../../../../helper/api-helper'
import InputKendoRct from '../../../../control-components/input/input';
/*import Loader from "../../../../control-components/loader/loader";*/
import { useDispatch, useSelector } from 'react-redux';
import { Dialog } from "@progress/kendo-react-dialogs";
import DropDownKendoRct from "../../../../control-components/drop-down/drop-down";
import PhoneInputMask from "../../../../control-components/phone-input-mask/phone-input-mask";
import DatePickerKendoRct from "../../../../control-components/date-picker/date-picker";
import Loader from '../../../../control-components/loader/loader';
import { Encrption } from '../../../encrption';
import { NumericTextBox } from "@progress/kendo-react-inputs"
import { renderErrors } from "src/helper/error-message-helper";


const EditVital = ({ onClose, selectedVitalId, stateData }) => {
    let [fields, setFields] = useState(
        {
            bpDia: "",
            bpSys: "",
            clientId: "",
            heartRate: "",
            pulseRate: "",
            temperature: "",
            dateRecord: "",
            respiration: "",
            height: "",
            weight: "",

        }
    )
    const [errors, setErrors] = useState("");
    const [loading, setLoading] = useState(false);

    const clinicId = useSelector(state => state.loggedIn.clinicId);
    const [settingError, setSettingError] = useState(false);
    const selectedClientId = useSelector(state => state.selectedClientId);
    const providerId = useSelector(state => state.providerID);

    useEffect(() => {
        getVitalDetail();



    }, [selectedClientId])

    const getVitalDetail = () => {

        setLoading(true)
        ApiHelper.getRequest(ApiUrls.GET_VITAL_BY_ID + Encrption(selectedVitalId))
            .then(result => {
                setLoading(false)

                let vitalDetail = result.resultData
                setFields({
                    ...fields,
                    bpDia: vitalDetail.bpDia ? vitalDetail.bpDia : '',
                    bpSys: vitalDetail.bpSys ? vitalDetail.bpSys : '',
                    heartRate: vitalDetail.heartRate ? vitalDetail.heartRate : '',
                    pulseRate: vitalDetail.pulseRate ? vitalDetail.pulseRate : '',
                    temperature: vitalDetail.temperature ? vitalDetail.temperature : '',
                    weight: vitalDetail.weight ? vitalDetail.weight : '',
                    respiration: vitalDetail.respiration ? vitalDetail.respiration : '',
                    licenses: vitalDetail.licenses ? vitalDetail.licenses : '',
                    height: vitalDetail.height ? vitalDetail.height : '',
                    dateRecord: new Date(vitalDetail.dateRecord),
                });

            }).catch(error => {
                setLoading(false)
                renderErrors(error.message);
            })
    }


    const updateVital = () => {

        setLoading(true);

        var data = {
            "id": selectedVitalId,
            "bpDia": fields.bpDia ? fields.bpDia : 0,
            "bpSys": fields.bpSys ? fields.bpSys : 0,
            "clientId": selectedClientId,
            "heartRate": fields.heartRate ? fields.heartRate : 0,
            "pulseRate": fields.pulseRate ? fields.pulseRate : 0,
            "temperature": fields.temperature ? fields.temperature : 0,
            "dateRecord": new Date(fields.dateRecord),
            "respiration": fields.respiration ? fields.respiration : 0,
            "weight": fields.weight ? fields.weight : 0,
            "height": fields.height ? fields.height : 0,

        };
        ApiHelper.putRequest(ApiUrls.UPDATE_Vital, data)
            .then((result) => {
                setLoading(false);
                NotificationManager.success("Vitals updated successfully");
                onClose({ "editable": true });
            })
            .catch((error) => {
                setLoading(false);
                renderErrors(error.message);
            });
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
        setSettingError(true)
        if (handleValidation()) {
            updateVital()
        }

        //if (handleValidation()) {
        //    updateSite()
        //}
    }

    const handleValidation = () => {
        let errors = {};
        let formIsValid = true;

        if (!fields.dateRecord) {
            formIsValid = false;
            errors["dateRecord"] = ErrorHelper.dateRecord
        }
        // if (!fields.bpSys || fields.bpSys.trim().length === 0) {
        //     formIsValid = false;
        //     errors["bpSys"] = ErrorHelper.bpSys
        // }
        // if (!fields.bpDia || fields.bpDia.trim().length === 0) {
        //     formIsValid = false;
        //     errors["bpDia"] = ErrorHelper.bpDia
        // }

        // if (!fields.heartRate || fields.heartRate.trim().length === 0) {
        //     formIsValid = false;
        //     errors["heartRate"] = ErrorHelper.heartRate
        // }


        // if (!fields.pulseRate || fields.pulseRate.trim().length === 0) {
        //     formIsValid = false;
        //     errors["pulseRate"] = ErrorHelper.pulseRate
        // }

        // if (!fields.temperature && fields.temperature.trim().length === 0) {
        //     formIsValid = false;
        //     errors["temperature"] = ErrorHelper.temperature
        // }
        // if (!fields.respiration && fields.respiration.trim().length === 0) {
        //     formIsValid = false;
        //     errors["respiration"] = ErrorHelper.respiration
        // }
        // if (!fields.height && fields.height.trim().length === 0) {
        //     formIsValid = false;
        //     errors["height"] = ErrorHelper.height
        // }

        // if (!fields.weight && fields.weight.trim().length === 0) {
        //     formIsValid = false;
        //     errors["weight"] = ErrorHelper.FIELD_BLANK
        // }
        setErrors(errors)
        return formIsValid;
    }
    return (
        <Dialog onClose={onClose} title={"Edit Vital"} className='dialog-modal'>
            <div className=' edit-client-popup px-0'>

                <div className="row mx-0">

                    <div className="mb-2 col-lg-4 col-md-6 col-12">
                        <DatePickerKendoRct
                            validityStyles={settingError}
                            onChange={handleChange}
                            value={fields.dateRecord}
                            name={"dateRecord"}
                            title={"Record Date"}
                            required={true}
                            error={!fields.dateRecord && errors.dateRecord}
                            label={"Record Date"}
                            placeholder={"Record Date"}
                        />
                    </div>
                    <div className="mb-3 col-lg-4 col-md-6 col-12">
                        <NumericTextBox
                            validityStyles={false}
                            value={fields.bpSys}
                            type="number"
                            onChange={handleChange}
                            name="bpSys"
                            label="Bp Sys"
                            error={errors.bpSys && errors.bpSys}
                            placeholder="Bp Sys"
                  spinners={false}

                        />
                    </div>
                    <div className="mb-3 col-lg-4 col-md-6 col-12">
                        <NumericTextBox
                            validityStyles={false}
                            value={fields.bpDia}
                            type="number"
                            onChange={handleChange}
                            name="bpDia"
                            label="Bp Dias"
                            error={errors.bpDia && errors.bpDia}
                            placeholder="Bp Dias"
                  spinners={false}

                        />
                    </div>


                    <div className="mb-3 col-lg-4 col-md-6 col-12">
                        <NumericTextBox
                            validityStyles={false}
                            value={fields.heartRate}
                            onChange={handleChange}
                            type="number"
                            name="heartRate"
                            label="Heart Rate"
                            error={errors.heartRate && errors.heartRate}
                            placeholder="Heart Rate"
                  spinners={false}

                        />
                    </div>
                    <div className="mb-3 col-lg-4 col-md-6 col-12">
                        <NumericTextBox
                            validityStyles={false}
                            value={fields.respiration}
                            type="number"
                            onChange={handleChange}
                            name="respiration"
                            label="Respiration"
                            error={errors.respiration && errors.respiration}
                            placeholder="Respiration"
                  spinners={false}

                        />
                    </div>
                    < div className="mb-3 col-lg-4 col-md-6 col-12">
                        <NumericTextBox
                            validityStyles={false}
                            value={fields.pulseRate}
                            type="number"
                            onChange={handleChange}
                            name="pulseRate"
                            label="Pulse Rate"
                            error={errors.pulseRate && errors.pulseRate}
                            placeholder="Pulse Rate"
                  spinners={false}

                        />
                    </div>

                    <div className="mb-3 col-lg-4 col-md-6 col-12">
                        <NumericTextBox
                            validityStyles={false}
                            value={fields.temperature}
                            type="number"
                            onChange={handleChange}
                            name="temperature"
                            label="Temperature"
                            error={errors.temperature && errors.temperature}
                            placeholder="Temperature"
                  spinners={false}


                        />
                    </div>
                    <div className="mb-3 col-lg-4 col-md-6 col-12">
                        <NumericTextBox
                            validityStyles={false}
                            value={fields.weight}
                            type="number"
                            onChange={handleChange}
                            name="weight"
                            label="Weight(in lbs.)"
                            error={errors.weight && errors.weight}
                            placeholder="Weight"
                  spinners={false}


                        />
                    </div>
                    <div className="mb-3 col-lg-4 col-md-6 col-12">
                        <NumericTextBox
                            validityStyles={false}
                            value={fields.height}
                            type="number"
                            onChange={handleChange}
                            name="height"
                            label="Height(in cms.)"
                            error={errors.height && errors.height}
                            placeholder="Height"
                        spinners={false}


                        />
                    </div>



                </div >

            </div>


            {
                loading && <Loader />
            }
            <div className="border-bottom-line"></div>

            <div className="d-flex my-3">
                <div>
                    <button className='btn blue-primary text-white mx-3' onClick={handleSubmit}>
                        Update
                    </button>
                </div>
                <div>
                    <button className='btn grey-secondary text-white' onClick={onClose}>
                        Cancel
                    </button>
                </div>

            </div>


        </Dialog>
    );
}
export default EditVital;



