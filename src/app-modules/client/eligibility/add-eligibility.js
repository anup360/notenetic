import React, { useEffect, useState } from "react";
import DatePickerKendoRct from "../../../control-components/date-picker/date-picker";
import ErrorHelper from "../../../helper/error-helper";
import { NotificationManager } from "react-notifications";
import InputKendoRct from "../../../control-components/input/input";
import Loader from "../../../control-components/loader/loader";
import { useSelector } from "react-redux";
import { Dialog } from "@progress/kendo-react-dialogs";
import DropDownKendoRct from "../../../control-components/drop-down/drop-down";
import { ClientService } from "../../../services/clientService";
import { useNavigate } from "react-router";
import apiHelper from "src/helper/api-helper";
import API_URLS from "src/helper/api-urls";
import { renderErrors } from "src/helper/error-message-helper";


const relationShip = [
    { id: 1, name: "Child" },
    { id: 2, name: "Other" },
    { id: 3, name: "Spouse" },
    { id: 4, name: "Self" },

];


const AddEligibility = ({ onClose, setViewEligibility, setEligibilityInfo, clientDetails }) => {

    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);



    const genderDetails = {
        id: clientDetails?.genderId,
        name: clientDetails?.gender,
    };


    let [fields, setFields] = useState({
        payer: "",
        fromDate: firstDay,
        toDate: lastDay,
        serviceType: "",
        procedureCode: "",
        patientLastName: "",
        patientFirstName: "",
        patientMiddleName: "",
        patientSuffix: "",
        patientBirthDate: "",
        patientGender: "",
        patientState: "",
        subscriberRelationship: relationShip[3],
        groupNumber: "",
        memberId: "",
        policyNumber: "",

    });

    const [genderData, setGenderData] = useState([]);
    const [stateData, setStateData] = useState([]);
    const [posData, setPOSData] = useState([]);

    const [errors, setErrors] = useState("");
    const [loading, setLoading] = useState(false);
    const clinicId = useSelector((state) => state.loggedIn.clinicId);
    const [settingError, setSettingError] = useState(false);
    const navigate = useNavigate();
    const [insuranceData, setInsuranceData] = useState([]);
    const [insuranceLoading, setInsuranceLoading] = useState(false);
    const [genderLoading, setGenderLoading] = useState(false);


    useEffect(() => {
        getGender();
        // getState();
        getInsuranceTypes();
    }, []);


    useEffect(() => {
        if (clientDetails !== undefined) {
            setFields({
                patientLastName: clientDetails?.lName,
                patientFirstName: clientDetails?.fName,
                fromDate: firstDay,
                toDate: lastDay,
                patientBirthDate: clientDetails?.dob == null ? "" : new Date(clientDetails?.dob),
                patientGender: genderDetails,
                subscriberRelationship: relationShip[3],
            });
        }
    }, [])


    const getGender = async () => {
        setGenderLoading(true)
        await ClientService.getGender()
            .then((result) => {
                let genderList = result.resultData;
                setGenderData(genderList);
                setGenderLoading(false)
            })
            .catch((error) => {
                renderErrors(error.message);
                setGenderLoading(false)

            });
    };




    const insertEligibility = () => {
        setLoading(true);
        ClientService.postEligibility(fields)
            .then((result) => {
                setLoading(false);
                NotificationManager.success("Eligibility added successfully");
                setEligibilityInfo(result.resultData?.coverages)
                onClose({ isAdded: true });
                setViewEligibility(true);

            })
            .catch((error) => {
                setLoading(false);
                renderErrors(error);
            });
    };


    const getInsuranceTypes = () => {
        setInsuranceLoading(true);
        apiHelper.getRequest(API_URLS.GET_INSURANCE_TYPE + clinicId)
            .then((result) => {
                let insuranceList = result.resultData;
                setInsuranceData(insuranceList);
                setInsuranceLoading(false);

            })
            .catch((error) => {
                renderErrors(error.message);
                setInsuranceLoading(false);

            });
    };



    const handleValidation = () => {
        let errors = {};
        let formIsValid = true;


        if (!fields.payer) {
            formIsValid = false;
            errors["payer"] = "Payer is required";
        }




        if (!fields.patientLastName || fields.patientLastName.trim().length === 0) {
            formIsValid = false;
            errors["patientLastName"] = ErrorHelper.LAST_NAME;
        }

        if (!fields.patientFirstName || fields.patientFirstName.trim().length === 0) {
            formIsValid = false;
            errors["patientFirstName"] = ErrorHelper.FIRST_NAME;
        }


        if (!fields.policyNumber || fields.policyNumber.trim().length === 0) {
            formIsValid = false;
            errors["policyNumber"] = ErrorHelper.POILICY;
        }


        if (!fields?.patientBirthDate) {
            formIsValid = false;
            errors["patientBirthDate"] = ErrorHelper.DOB;
        }


        if (!fields.patientGender) {
            formIsValid = false;
            errors["patientGender"] = ErrorHelper.GENDER;
        }


        if (!fields.subscriberRelationship) {
            formIsValid = false;
            errors["subscriberRelationship"] = "Relationship is required";
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
            insertEligibility();
        }
    };


    return (
        <div>
            <Dialog
                onClose={onClose}
                title={"Check Eligibility"}
                className="dialog-modal"
            >
                <div className="">
                    <div className="popup-modal">
                        <div className="row">



                            <div className="mb-2 col-lg-4 col-md-6 col-12">
                                <DatePickerKendoRct
                                    onChange={handleChange}
                                    value={fields.fromDate}
                                    name={"fromDate"}
                                    title={"From Date"}
                                    label={"From Date"}
                                    placeholder={"From Date"}
                                    max={new Date()}

                                />
                            </div>
                            <div className="mb-2 col-lg-4 col-md-6 col-12">
                                <DatePickerKendoRct
                                    onChange={handleChange}
                                    value={fields.toDate}
                                    name={"toDate"}
                                    title={"To Date"}
                                    label={"To Date"}
                                    placeholder={"To Date"}
                                    max={new Date()}

                                />
                            </div>

                            {/* <div className="mb-2 col-lg-4 col-md-6 col-12">
                                <InputKendoRct
                                    value={fields.serviceType}
                                    onChange={handleChange}
                                    name="serviceType"
                                    label="Service Type"
                                    error={fields.serviceType == "" && errors.serviceType}
                                    validityStyles={settingError}
                                    required={true}
                                    placeholder="Service Type"
                                    type="letter"
                                />
                            </div> */}
                            {/* <div className="mb-2 col-lg-4 col-md-6 col-12">
                                <InputKendoRct
                                    value={fields.procedureCode}
                                    onChange={handleChange}
                                    name="procedureCode"
                                    label="Procedure Code"
                                    placeholder="Procedure Code"
                                    type="text"
                                />
                            </div> */}
                            <div className="mb-2 col-lg-4 col-md-6 col-12">
                                <InputKendoRct
                                    value={fields.patientLastName}
                                    onChange={handleChange}
                                    name="patientLastName"
                                    label="Last Name"
                                    error={fields.patientLastName == "" && errors.patientLastName}
                                    validityStyles={settingError}
                                    required={true}
                                    placeholder="Last Name"
                                    type="text"
                                />
                            </div>
                            <div className="mb-2 col-lg-4 col-md-6 col-12">
                                <InputKendoRct
                                    value={fields.patientFirstName}
                                    onChange={handleChange}
                                    name="patientFirstName"
                                    label="First Name"
                                    error={fields.patientFirstName == "" && errors.patientFirstName}
                                    validityStyles={settingError}
                                    required={true}
                                    placeholder="First Name"
                                    type="text"
                                />
                            </div>
                            {/* <div className="mb-2 col-lg-4 col-md-6 col-12">
                                <InputKendoRct
                                    value={fields.patientMiddleName}
                                    onChange={handleChange}
                                    name="patientMiddleName"
                                    label="Middle Name"
                                    placeholder="Middle Name"
                                    type="text"
                                />
                            </div> */}
                            {/* 
                            <div className="mb-2 col-lg-4 col-md-6 col-12">
                                <InputKendoRct
                                    value={fields.patientSuffix}
                                    onChange={handleChange}
                                    name="patientSuffix"
                                    label="Suffix"
                                    placeholder="Suffix"
                                    type="text"
                                />
                            </div> */}

                            <div className="mb-2 col-lg-4 col-md-6 col-12">
                                <DatePickerKendoRct
                                    onChange={handleChange}
                                    value={fields.patientBirthDate}
                                    name={"patientBirthDate"}
                                    title={"Birth Date"}
                                    label={"Birth Date"}
                                    placeholder={"Birth Date"}
                                    max={new Date()}
                                    error={!fields.patientBirthDate && errors.patientBirthDate}
                                    required={true}
                                    validityStyles={settingError}

                                />
                            </div>


                            <div className="mb-2 col-lg-4 col-md-6 col-12">
                                <DropDownKendoRct
                                    data={genderData}
                                    onChange={handleChange}
                                    textField="name"
                                    name="patientGender"
                                    loading={genderLoading}
                                    value={fields.patientGender}
                                    dataItemKey="id"
                                    required={true}
                                    validityStyles={settingError}
                                    error={!fields.patientGender && errors.patientGender}
                                    label="Gender"
                                    placeholder="Gender"
                                />
                            </div>

                            {/* <div className="mb-2 col-lg-4 col-md-6 col-12">
                                <DropDownKendoRct
                                    data={stateData}
                                    onChange={handleChange}
                                    textField="stateName"
                                    name="patientState"
                                    value={fields.patientState}
                                    dataItemKey="id"
                                    required={true}
                                    validityStyles={settingError}
                                    error={!fields.patientState && errors.patientState}
                                    label="State"
                                    placeholder="State"
                                />
                            </div> */}

                            <div className="mb-2 col-lg-4 col-md-6 col-12">
                                <DropDownKendoRct
                                    data={relationShip}
                                    onChange={handleChange}
                                    textField="name"
                                    name="subscriberRelationship"
                                    value={fields.subscriberRelationship}
                                    dataItemKey="id"
                                    required={true}
                                    validityStyles={settingError}
                                    error={!fields.subscriberRelationship && errors.subscriberRelationship}
                                    label="Relationship"
                                    placeholder="Relationship"
                                />
                            </div>


                            {/* 
                            <div className="mb-2 col-lg-4 col-md-6 col-12">
                                <InputKendoRct
                                    value={fields.memberId}
                                    onChange={handleChange}
                                    name="memberId"
                                    label="Member ID"
                                    placeholder="Member ID"
                                    type="text"
                                />
                            </div> */}
                            {/* <div className="mb-2 col-lg-4 col-md-6 col-12">
                                <InputKendoRct
                                    value={fields.groupNumber}
                                    onChange={handleChange}
                                    name="groupNumber"
                                    label="Group #"
                                    error={fields.groupNumber == "" && errors.groupNumber}
                                    validityStyles={settingError}
                                    required={true}
                                    placeholder="Group #"
                                    type="text"
                                />
                            </div> */}

                            <div className="mb-2 col-lg-4 col-md-6 col-12">
                                <InputKendoRct
                                    value={fields.policyNumber}
                                    onChange={handleChange}
                                    name="policyNumber"
                                    label="Policy#"
                                    placeholder="Policy#"
                                    type="text"
                                    error={fields.policyNumber == "" && errors.policyNumber}
                                    validityStyles={settingError}
                                    required={true}
                                />
                            </div>

                            <div className="mb-2 col-lg-4 col-md-6 col-12">
                                <DropDownKendoRct
                                    data={insuranceData}
                                    onChange={handleChange}
                                    textField="insuranceName"
                                    name="payer"
                                    value={fields.payer}
                                    dataItemKey="id"
                                    required={true}
                                    validityStyles={settingError}
                                    error={!fields.payer && errors.payer}
                                    label="Payer"
                                    placeholder="Payer"
                                    loading={insuranceLoading}

                                />
                            </div>

                        </div>

                    </div>

                    {loading == true && <Loader />}
                </div>
                <div className="border-bottom-line"></div>
                <div className="d-flex mt-4 px-2">
                    <button
                        className="btn blue-primary text-white mx-3"
                        onClick={handleSubmit}
                    >
                        Check
                    </button>

                    <button
                        className="btn grey-secondary text-white "
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </Dialog>
        </div>
    );
};
export default AddEligibility;
