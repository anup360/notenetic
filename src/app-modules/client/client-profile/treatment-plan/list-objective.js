import { Loader } from "@progress/kendo-react-indicators";
import { ExpansionPanel, ExpansionPanelContent } from "@progress/kendo-react-layout";
import { Tooltip } from "@progress/kendo-react-tooltip";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { ClientService } from "src/services/clientService";
import DeleteTreatment from "./delete-treatment";
import AddObjective from "./add-objective";
import ListTreatmentIntervention from "./list-intervention";
import AddIntervention from "./add-intervention";
import { permissionEnum } from "../../../../helper/permission-helper";
import { useSelector } from "react-redux";
import { renderErrors } from "src/helper/error-message-helper";

const ListTreatmentObjective = ({ objectiveData, goalId, setIsGoalRefreshed, isGoalRefreshed, showInactivePlans }) => {

    const [treatmentObjective, setTreatmentObjective] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expandedObjective, setExpandedObjective] = React.useState(false);
    const [isDeleteObjectives, setIsDeleteObjectives] = useState(false);
    const [selectedObjective, setSelectedObjective] = useState();
    const [isEditObjectives, setIsEditObjectives] = useState(false);
    const [isAddIntervention, setisAddIntervention] = useState(false);
    const [selectedIntervention, setSelectedIntervention] = useState();
    const userAccessPermission = useSelector((state) => state.userAccessPermission);

    useEffect(() => {
        // geTreatmentObjective(goalId)

    }, [goalId, isEditObjectives, isDeleteObjectives, isGoalRefreshed])

    // const geTreatmentObjective = async (goalId) => {
    //     setLoading(false)
    //     await ClientService.getObjectiveByGoalId(goalId)
    //         .then(result => {
    //             let objList = result.resultData
    //             setTreatmentObjective(objList)
    //             setLoading(false)
    //         }).catch(error => {
    //             setLoading(false)
    //         });


    // }


    const onActionObjective = React.useCallback(
        (event, obj) => {
            setExpandedObjective({ ...expandedObjective, [obj.id]: !expandedObjective[obj.id] });
            // if (event.expanded === false) {
            //     // setSelectedObjective(obj)
            // }
        },
        [expandedObjective]
    );

    const handleCloseDeleteDialouge = () => {
        setIsDeleteObjectives(false)
    }

    const deletePlans = (obj) => {
        setSelectedObjective(obj)
        setIsDeleteObjectives(true)
    }

    const handleCloseEditTreatment = ({ edited }) => {

        setIsEditObjectives(false)

    }

    const handleEditObjectives = (obj) => {
        setIsEditObjectives(true)
        setSelectedObjective(obj)
    }

    const handleEditIntervention = (obj) => {
        setisAddIntervention(true)
        setSelectedIntervention({ objectiveId: obj.id })
    }

    const handleCloseEditIntervention = ({ edited }) => {

        setisAddIntervention(false)

    }

    if (loading) return <Loader />;

    return (
        <div>
            {objectiveData.length > 0 && objectiveData.map(ObjectiveItem =>
                <ExpansionPanel
                    id={ObjectiveItem.id + "rand"}
                    title={ObjectiveItem.objective}
                    tabIndex={0}
                    key={ObjectiveItem.id}
                    expandIcon="k-i-plus  fa fa-plus"
                    collapseIcon="k-i-minus  fa fa-minus"
                    className="main-objective"

                    expanded={expandedObjective[ObjectiveItem.id]}
                    onAction={(event) => onActionObjective(event, ObjectiveItem)}>
                    {expandedObjective[ObjectiveItem.id] && (
                        <ExpansionPanelContent>

                            {!showInactivePlans ? <div className="d-flex justify-content-end align-items-center mb-3">
                                {
                                    userAccessPermission[permissionEnum.MANAGE_TREATMENT_PLAN] &&
                                    <>
                                        <button onClick={() => handleEditObjectives(ObjectiveItem)} type="button" className="btn  btn-sm text-theme f-16 blue-primary-outline mr-3 line-height-pencil"> <i className="k-icon k-i-edit pencile-edit-color mr-2"></i>Edit Objective
                                        </button>

                                        <Tooltip anchorElement="target" position="top">
                                            <i onClick={() => deletePlans(ObjectiveItem)} className="fa fa-trash" aria-hidden="true" title="Delete Objective"></i>
                                        </Tooltip>

                                    </>

                                }


                            </div> : null}
                            <div className="show-upper-event d-flex justify-content-between  py-2 align-items-center"></div>
                            <div className="date-timeshow px-3">

                                <p className="mb-1"><span className="k-icon k-i-calendar-date text-theme pr-2"></span><b>Start Date: </b> {ObjectiveItem.startDate === null ? " -/-/-" : moment(ObjectiveItem.startDate).format("M/D/YYYY")}</p>
                                <p className="mb-1"> <span className="k-icon k-i-calendar-date text-theme pr-2"></span> <b>End Date: </b> {ObjectiveItem.endDate === null ? " -/-/-" : moment(ObjectiveItem.endDate).format("M/D/YYYY")}</p>

                                <p className="mb-1"> <b>Status: </b> {ObjectiveItem.status}</p>

                            </div>
                            {!showInactivePlans ? <div className="d-flex justify-content-end align-items-center mb-3">
                                {userAccessPermission[permissionEnum.MANAGE_TREATMENT_PLAN] &&

                                    <button onClick={() => handleEditIntervention(ObjectiveItem)} type="button" className="btn  btn-sm text-theme f-16 blue-primary-outline mr-3 line-height-pencil"> <i className="k-icon k-i-plus pencile-edit-color mr-2"></i>Add Intervention
                                    </button>
                                }

                            </div> : null}
                            {ObjectiveItem?.interventions && <ListTreatmentIntervention interventionData={ObjectiveItem?.interventions} setIsGoalRefreshed={setIsGoalRefreshed} showInactivePlans={showInactivePlans} />}
                        </ExpansionPanelContent>
                    )}

                </ExpansionPanel>)
            }

            {
                isDeleteObjectives &&
                <DeleteTreatment onClose={handleCloseDeleteDialouge} isDeleteObjective={isDeleteObjectives} selectedObjective={selectedObjective} setIsGoalRefreshed={setIsGoalRefreshed} />
            }
            {
                isEditObjectives &&
                <AddObjective onClose={handleCloseEditTreatment} selectedObjective={selectedObjective} setIsGoalRefreshed={setIsGoalRefreshed} />
            }
            {
                isAddIntervention && <AddIntervention onClose={handleCloseEditIntervention} selectedIntervention={selectedIntervention} setIsGoalRefreshed={setIsGoalRefreshed} />
            }
        </div>
    )
}

export default ListTreatmentObjective;