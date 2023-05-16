import moment from "moment";
import { useSelector } from "react-redux";
import CustomDrawer from "../../../../control-components/custom-drawer/custom-drawer";
import ClientHeader from "../client-header/client-header";
import addIcon from '../../../../assets/images/add.png';
import TreatmentPlan from './add-treatment-plan';
import { ClientService } from "../../../../services/clientService";
import { SettingsService } from "../../../../services/settingsService";
import Loader from "../../../../control-components/loader/loader";
import React, { useEffect, useState } from "react";
import AddObjective from './add-objective';
import AddIntervention from './add-intervention';
import EditTreatmentPlan from './add-treatment-plan';
import EditObjective from './add-objective';
import EditInterventions from './add-intervention';
import { Tooltip } from "@progress/kendo-react-tooltip";
import DeleteTreatment from "./delete-treatment";
import { ExpansionPanel, ExpansionPanelContent } from "@progress/kendo-react-layout";
import AddClientTreatmentSign from '../../../../control-components/add-client-treatment-sign/add-client-treatment-sign';
import TretmentPlanPDF from '../../../../control-components/pdf-generator-kendo/treatment-plan-pdf';
import DeleteSignature from "./delete-signature";
import useModelScroll from '../../../../cutomHooks/model-dialouge-scroll'
import { NotificationManager } from "react-notifications";
import AddGoalPlan from "./add-goal";
import ListTreatmentGoal from "./list-goal";
import CloseTreatmentPlan from "./close-treatment-plan";
import { Switch } from "@progress/kendo-react-inputs";
import ShowSignature from "./show-signature";
import { permissionEnum } from "../../../../helper/permission-helper";
import { renderErrors } from "src/helper/error-message-helper";


const ListTreatmentPlan = () => {
    const [loading, setLoading] = useState(false);
    const selectedClientId = useSelector(state => state.selectedClientId);
    const [addTreatmentOpen, setAddTreatmentOpen] = useState(false);
    const [treatmentPlan, setTreatmentPlan] = useState([]);
    const [isAddObjective, setIsAddObjective] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState();
    const [selectedObjective, setSelectedObjective] = useState();
    const [selectedIntervention, setSelectedIntervention] = useState();
    const [isAddIntervention, setIsAddIntervention] = useState(false);
    const [isEditPlans, setIsEditPlans] = useState(false);
    const [isEditObjective, setIsEditObjective] = useState(false);
    const [isEditInterventions, setIsEditInterventions] = useState(false);
    const [expandedPlan, setExpandedPlan] = React.useState(false);
    const [expandedObjective, setExpandedObjective] = React.useState(false);
    const [isDeletePlans, setIsDeletePlans] = useState(false);
    const [isDeleteObjective, setIsDeleteObjective] = useState(false);
    const [isDeleteIntervention, setIsDeleteIntervention] = useState(false);
    const [isAddSign, setIsAddSign] = useState(false);
    const [isPrintPDF, setIsPrintPDF] = useState(false);
    const [clientSignData, setClientSignData] = useState([]);
    const [staffSignData, setStaffSignData] = useState([]);
    const [isdeleteSign, setIsDeleteSign] = useState(false);
    const [clientSignObj, setClientSignObj] = useState();
    const [staffSignObj, setStaffSignObj] = useState();
    const pdfExportComponent = React.useRef(null);
    const [isParentSign, setIsParentSign] = useState(false);
    const [isClientSign, setIsClientSign] = useState(false);
    const [signStaffId, setSignStaffId] = useState();
    const clientDetail = useSelector((state) => state.clientDetails);
    const [modelScroll, setScroll] = useModelScroll()
    const [clinicLogo, setClinicLogo] = React.useState("");
    const clinicId = useSelector((state) => state.loggedIn.clinicId);
    const staffLoginInfo = useSelector((state) => state.getStaffReducer);
    const [addGoalOpen, setAddGoalOpen] = useState(false);
    const [planId, setPlanId] = useState(0);
    const [isGoalRefreshed, setIsGoalRefreshed] = useState(false);
    const [planCloseComplete, setPlanCloseComplete] = useState(false);
    const userAccessPermission = useSelector((state) => state.userAccessPermission);

    const [isHaveStaffSign, setHaveStaffSign] = useState([]);
    const [isHaveClientSign, setHaveClientSign] = useState([]);

    

    const [inactivePlanList, setInactivePlanList] = useState(false);
    const [isAnyActivePlan, setIsAnyActivePlan] = useState(false);
    const [showInactivePlans, setShowInactivePlans] = useState(false);

    useEffect(() => {

        if (selectedClientId) {
            geTreatmentPlan()

        }
    }, [selectedClientId, addGoalOpen, isGoalRefreshed, showInactivePlans])

    const geTreatmentPlan = async () => {
        setLoading(true)
        await ClientService.getClientTreatmentPlan(selectedClientId, showInactivePlans)
            .then(result => {
                let planList = result?.resultData?.filter(tpItem => tpItem)
                //let isAnyActivePlan = planList.filter(item => (item.activeParticipant === true && !item.planEndDate));
                // let getActive = planList.filter(item => (item.activeParticipant === !inactivePlanList && !item.planEndDate));
                setTreatmentPlan(planList)

                //setIsAnyActivePlan(isAnyActivePlan.length)

                let updatedExpanded = planList.map(item => ({ [item.id]: true }));

                setExpandedPlan(updatedExpanded.reduce((id, val) => ({ ...id, ...val }), {}))

                getLogo()
                setIsGoalRefreshed(false)
            }).catch(error => {
                setLoading(false)
            });
    }

    const getLogo = async () => {
        setLoading(true);
        await SettingsService.getClinicLogo(clinicId, false)
            .then((result) => {
                setLoading(false);
                if (result.resultData !== null) {
                    setClinicLogo(result.resultData.clinicLogo);
                }
            })
            .catch((error) => {
                setLoading(false);
                renderErrors(error.message);
            });
    };


    const handleAddTreatment = () => {

        setAddTreatmentOpen(true)
        setScroll(true)

    }

    const handleAddGoal = (planId) => {
        setPlanId(planId);
        setAddGoalOpen(true)
        setScroll(true)

    }

    const handleCompletePlan = (plan) => {
        setPlanCloseComplete(true);
        setSelectedPlan(plan)
        setScroll(true)

    }


    const handleAddObjective = (obj) => {
        setSelectedPlan(obj)
        setIsAddObjective(true)
        setScroll(true)
    }

    const handleAddIntervention = (obj) => {
        setIsAddIntervention(true)
        setSelectedObjective(obj)
        setScroll(true)

    }

    const handleCloseTreatment = ({ added }) => {
        if (added) { geTreatmentPlan() }
        setAddTreatmentOpen(false)
        setScroll(false)

    }

    const handleCloseGoal = ({ added }) => {
        // if (added) { geTreatmentPlan() }
        setAddGoalOpen(false)
        setScroll(false)

    }

    const handleCloseEditTreatment = ({ edited }) => {
        if (edited) { geTreatmentPlan() }
        setIsEditPlans(false)
        setScroll(false)

    }

    const handleCloseIntervention = ({ added }) => {
        if (added) {
            setSelectedPlan(selectedPlan)
            geTreatmentPlan()
        }
        setIsAddIntervention(false)
        setScroll(false)

    }

    const handleCloseEditIntervention = ({ edited }) => {
        if (edited) {
            setSelectedPlan(selectedPlan)
            geTreatmentPlan()
        }
        setIsEditInterventions(false)
        setScroll(false)

    }

    const handleCloseObjective = ({ added, selectedPlan }) => {
        if (added) {
            setSelectedPlan(selectedPlan)
            geTreatmentPlan()
        }
        setIsAddObjective(false)
        setScroll(false)

    }

    const handleCloseEditObjective = ({ edited, selectedPlan }) => {
        if (edited) {
            setSelectedPlan(selectedPlan)
            geTreatmentPlan()
        }
        setIsEditObjective(false)
        setScroll(false)

    }

    const handleEditPlans = (obj) => {
        setIsEditPlans(true)
        setSelectedPlan(obj)
        setScroll(true)
    }

    const handleEditObjective = (obj) => {
        setIsEditObjective(true)
        setSelectedObjective(obj)
        setScroll(true)

    }

    const handleEditIntervention = (obj) => {
        setIsEditInterventions(true)
        setSelectedIntervention(obj)
        setScroll(true)

    }

    const deletePlans = (obj) => {
        setSelectedPlan(obj)
        setIsDeletePlans(true)
        setScroll(true)
    }

    const deleteObjective = (obj) => {
        setSelectedObjective(obj)
        setIsDeleteObjective(true)
        setScroll(true)

    }

    const deleteIntervention = (obj) => {
        setSelectedIntervention(obj)
        setIsDeleteIntervention(true)
        setScroll(true)

    }

    const handleCloseDeleteDialouge = ({ isDeleted }) => {
        if (isDeleted === "planDeleted") { geTreatmentPlan() }
        if (isDeleted === "objectiveDeleted") { geTreatmentPlan() }
        if (isDeleted === "interventionDeleted") { geTreatmentPlan() }
        setIsDeletePlans(false)
        setIsDeleteObjective(false)
        setIsDeleteIntervention(false)
        setScroll(false)

    }

    const onActionPlans = React.useCallback(
        (event, obj) => {
            setExpandedPlan({ ...expandedPlan, [obj.id]: !expandedPlan[obj.id] });
            if (event.expanded === false) {
                setSelectedPlan(obj)
            }
        },
        [expandedPlan]
    );

    const onActionObjective = React.useCallback(
        (event, obj) => {
            setExpandedObjective({ ...expandedObjective, [obj.id]: !expandedObjective[obj.id] });
            if (event.expanded === false) {
                setSelectedObjective(obj)
            }
        },
        [expandedObjective]
    );

    const handlePrintPDF = () => {
        // if (pdfExportComponent.current) {
        //     pdfExportComponent.current.save();
        // }
        setIsPrintPDF(true)
    }

    const handleAddSignature = () => {
        setIsAddSign(true)
        setScroll(true)
    }

    const handleSignClose = ({ isAdded }) => {
        if (isAdded) {
            geTreatmentPlan()
        }

        setIsAddSign(false)
        setScroll(false)

    }

    const deleteSign = (obj) => {
        if (obj.staffId) {
            setStaffSignObj(obj)
            setClientSignObj({})
        } else {
            setClientSignObj(obj)
            setStaffSignObj({})
        }
        setIsDeleteSign(true)
        setScroll(true)

    }

    const handleSignDeleteClose = ({ isDeleted }) => {
        if (isDeleted) {
            setIsParentSign(false)
            setIsClientSign(false)
            geTreatmentPlan()
        }
        setIsDeleteSign(false)
        setScroll(false)

    }

    const handleShowInactivePlan = (e) => {
        setClientSignData([]);
        setShowInactivePlans(e.value)
    }




    return (
        <div className='d-flex flex-wrap'>

            <div className="inner-dt col-md-3 col-lg-2">
                <CustomDrawer />
            </div>
            <div className='col-md-9 col-lg-10'>
                <div className='staff-profile-page'>
                    <ClientHeader />
                    <div className='upload-sign-file pt_30 treatment_upload'>
                        <div className='d-flex justify-content-between mb-3 '>
                            <h4 className='address-title text-grey '><span className='f-24'>Treatment Plan</span></h4>

                            {

                                <div className="px-1  switch-on mx-auto">
                                    <Switch
                                        onChange={(e) => handleShowInactivePlan(e)}
                                        checked={showInactivePlans}
                                        onLabel={""}
                                        offLabel={""}
                                    />

                                    <span className="switch-title-text ml-2"> Show Closed/Completed Plan</span>
                                </div>
                            }



                            <div className="list-pdf d-flex align-items-center">

                                {
                                    treatmentPlan.length > 0 && !showInactivePlans ?
                                        <Tooltip anchorElement="target" position="top">

                                            <button onClick={handleAddSignature}
                                                className="btn blue-primary-outline  text-decoration-none d-flex align-items-center ">
                                                <i className="fa-solid fa-signature" title="Apply Signature"></i>
                                            </button>
                                        </Tooltip> : null

                                }

                                {
                                    treatmentPlan.length > 0 &&
                                    <Tooltip anchorElement="target" position="top">
                                        <button className="btn blue-primary-outline  btn-sm  mx-3"
                                            onClick={handlePrintPDF}>
                                            <i className="fa-solid fa-file-pdf" title="Print"></i>
                                        </button>
                                    </Tooltip>
                                }

                                {

                                    userAccessPermission[permissionEnum.MANAGE_TREATMENT_PLAN] && loading == false &&


                                        treatmentPlan.length === 0 ?
                                        <button onClick={handleAddTreatment} className="btn blue-primary text-white  text-decoration-none d-flex align-items-center ">
                                            <img src={addIcon} alt="" className="me-2 add-img" />
                                            Add Plan
                                        </button> : null



                                }

                            </div>
                        </div>

                        {
                            treatmentPlan.map(parentItem => (

                                <ExpansionPanel
                                    id={parentItem.id + "rand"}
                                    title={parentItem.planName}
                                    tabIndex={0}
                                    key={parentItem.id}
                                    expanded={expandedPlan[parentItem.id]}
                                    onAction={(event) => { onActionPlans(event, parentItem) }}>
                                    {expandedPlan[parentItem.id] && (
                                        <ExpansionPanelContent>
                                            {!showInactivePlans ?
                                                <div className="d-flex justify-content-end align-items-center mb-3">

                                                    {
                                                        userAccessPermission[permissionEnum.MANAGE_TREATMENT_PLAN] &&
                                                        <>
                                                            <button onClick={() => handleEditPlans(parentItem)} type="button" className="btn  btn-sm text-theme f-16 blue-primary-outline mr-3 line-height-pencil"> <i className="k-icon k-i-edit pencile-edit-color mr-2"></i>Edit Plan
                                                            </button>
                                                            <button onClick={() => handleCompletePlan(parentItem)} type="button" className="btn btn-sm br-8 btn-danger-delete mr-3"> <i className="k-icon k-i-times mr-2"></i>Close/Complete Plan
                                                            </button>
                                                            <Tooltip anchorElement="target" position="top">
                                                                <i onClick={() => deletePlans(parentItem)} className="fa fa-trash" aria-hidden="true" title="Delete Plan"></i>
                                                            </Tooltip>
                                                        </>
                                                    }

                                                </div> : null}

                                            <div className="show-upper-event d-flex justify-content-between  py-2 align-items-center"></div>
                                            <div className="date-timeshow px-3">
                                                <p className="mb-2"> <span className="k-icon k-i-calendar-date text-theme pr-2"></span><b>Plan Date: </b> {parentItem.planDate === null ? "" : moment(parentItem.planDate).format("M/D/YYYY")}</p>
                                                <p className="mb-2"> <span className="k-icon k-i-calendar-date text-theme pr-2"></span><b>Plan End Date: </b> {parentItem.planEndDate === null ? "-/-/-" : moment(parentItem.planEndDate).format("M/D/YYYY")}</p>

                                                <p className="mb-2"><span className="k-icon k-i-calendar-date text-theme pr-2"></span><b>Start Time: </b> {parentItem?.startTime ? parentItem?.startTime : " -/-"}</p>
                                                <p className="mb-2"><span className="k-icon k-i-calendar-date text-theme pr-2"></span><b>End Time: </b> {parentItem?.endTime ? parentItem?.endTime : " -/-"}</p>
                                                <p className="mb-2"> <b>Service: </b> {parentItem.serviceName}</p>
                                                <p className="mt-2"><b>Participant Status: </b> {parentItem.activeParticipant ? "Yes" : "No"}</p>
                                                <p className="mb-2"><b>Transition Discharge Plan: </b>{parentItem.transitionDischargePlan}</p>
                                            </div>
                                            {!showInactivePlans ?
                                                <div className="d-flex justify-content-end align-items-center mb-3">
                                                    {
                                                        userAccessPermission[permissionEnum.MANAGE_TREATMENT_PLAN] &&

                                                        <button onClick={() => handleAddGoal(parentItem.id)} type="button" className="btn  btn-sm text-theme f-16 blue-primary-outline mr-3 line-height-pencil">
                                                            <i className="k-icon k-i-plus pencile-edit-color mr-2"></i>Add Goal
                                                        </button>
                                                    }
                                                </div> : null}
                                            <ListTreatmentGoal planId={parentItem.id} goalData={parentItem?.goals} isGoalRefreshed={isGoalRefreshed} setIsGoalRefreshed={setIsGoalRefreshed} showInactivePlans={showInactivePlans} />

                                            {


                                                <div>
                                                    <ShowSignature parentId={parentItem?.id}
                                                        setIsParentSign={setIsParentSign}
                                                        setIsClientSign={setIsClientSign}
                                                        setTreatmentPlan={setTreatmentPlan}
                                                        treatmentPlan={treatmentPlan}
                                                        setLoading={setLoading}
                                                        loading={loading}
                                                        setSignStaffId={setSignStaffId}
                                                        deleteSign={deleteSign}
                                                        isAddSign={isAddSign}
                                                        isdeleteSign={isdeleteSign}
                                                        showInactivePlans={showInactivePlans}
                                                        setHaveStaffSign={setHaveStaffSign}
                                                        setHaveClientSign={setHaveClientSign}
                                                    />


                                                </div>
                                            }
                                        </ExpansionPanelContent>
                                    )}

                                </ExpansionPanel>
                            ))
                        }
                        {treatmentPlan.length === 0 && !loading && <div className="message-not-found mt-3">No Treatment Available</div>}

                    </div>
                </div>

            </div>
            {
                loading === true && <Loader />
            }

            {
                addTreatmentOpen &&
                < TreatmentPlan onClose={handleCloseTreatment} />
            }

            {
                addGoalOpen &&
                <AddGoalPlan onClose={handleCloseGoal} selectedGoal={{ treatmentPlanId: planId }} setIsGoalRefreshed={setIsGoalRefreshed} />
            }

            {
                isDeletePlans &&
                < DeleteTreatment onClose={handleCloseDeleteDialouge} isDeletePlans={isDeletePlans} selectedPlan={selectedPlan} />
            }
            {
                isEditPlans &&
                < EditTreatmentPlan onClose={handleCloseEditTreatment} selectedPlan={selectedPlan} />
            }
            {
                isAddObjective &&
                < AddObjective onClose={handleCloseObjective} selectedPlan={selectedPlan} />
            }
            {
                isEditObjective &&
                < EditObjective onClose={handleCloseEditObjective} selectedPlan={selectedPlan} selectedObjective={selectedObjective} />
            }
            {
                isDeleteObjective &&
                < DeleteTreatment onClose={handleCloseDeleteDialouge} isDeleteObjective={isDeleteObjective} selectedPlan={selectedPlan} selectedObjective={selectedObjective} />
            }
            {
                isAddIntervention &&
                < AddIntervention onClose={handleCloseIntervention} selectedObjective={selectedObjective} />
            }
            {
                isEditInterventions &&
                < EditInterventions onClose={handleCloseEditIntervention} selectedObjective={selectedObjective} selectedIntervention={selectedIntervention} />
            }
            {
                isDeleteIntervention &&
                < DeleteTreatment onClose={handleCloseDeleteDialouge} isDeleteIntervention={isDeleteIntervention} selectedPlan={selectedPlan} selectedIntervention={selectedIntervention} />
            }

            {
                isPrintPDF &&
                <TretmentPlanPDF
                    treatmentPlan={treatmentPlan}
                    isPrintPDF={isPrintPDF}
                    setIsPrintPDF={setIsPrintPDF}
                    clientSignData={clientSignData}
                    staffSignData={staffSignData}
                    clientDetail={clientDetail}
                    staffLoginInfo={staffLoginInfo}

                />
            }
            {
                isAddSign &&
                <AddClientTreatmentSign onClose={handleSignClose}
                    isParentSign={isParentSign} isClientSign={isClientSign}
                    signStaffId={signStaffId} treatmentPlan={treatmentPlan}
                    showInactivePlans={showInactivePlans}
                    isHaveStaffSign={isHaveStaffSign}
                    isHaveClientSign={isHaveClientSign}
                />
            }

            {
                isdeleteSign &&
                <DeleteSignature
                    onClose={handleSignDeleteClose}
                    clientSignObj={clientSignObj}
                    staffSignObj={staffSignObj} setIsGoalRefreshed={setIsGoalRefreshed} />
            }
            {planCloseComplete && <CloseTreatmentPlan onClose={() => {
                setPlanCloseComplete(false)
                setScroll(false)
            }} selectedPlan={selectedPlan} setIsGoalRefreshed={setIsGoalRefreshed} />}

        </div >
    );
};
export default ListTreatmentPlan;
