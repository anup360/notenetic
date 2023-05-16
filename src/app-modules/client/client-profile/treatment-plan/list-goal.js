import { Loader } from "@progress/kendo-react-indicators";
import { ExpansionPanel, ExpansionPanelContent } from "@progress/kendo-react-layout";
import { Tooltip } from "@progress/kendo-react-tooltip";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { ClientService } from "src/services/clientService";
import DeleteTreatment from "./delete-treatment";
import ListTreatmentObjective from "./list-objective";
import AddObjective from "./add-objective";
import AddGoal from "./add-goal";
import { permissionEnum } from "../../../../helper/permission-helper";
import { useSelector } from "react-redux";
import { renderErrors } from "src/helper/error-message-helper";

const ListTreatmentGoal = ({ planId, isReFetch, isGoalRefreshed, setIsGoalRefreshed, goalData, showInactivePlans }) => {

    const [treatmentGoal, setTreatmentGoal] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expandedGoal, setExpandedGoal] = React.useState(false);
    const [isDeleteGoals, setIsDeleteGoals] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState();
    const [isEditGoals, setIsEditGoals] = useState(false);
    const [addObjectiveOpen, setAddObjectiveOpen] = useState(false);
    const userAccessPermission = useSelector((state) => state.userAccessPermission);

    const onActionGoal = React.useCallback(
        (event, obj) => {
            setExpandedGoal({ ...expandedGoal, [obj.id]: !expandedGoal[obj.id] });

        },
        [expandedGoal]
    );

    const handleCloseDeleteDialouge = () => {
        setIsDeleteGoals(false)
    }

    const deletePlans = (obj) => {
        setSelectedGoal(obj)
        setIsDeleteGoals(true)
    }

    const handleCloseEditTreatment = ({ edited }) => {

        setIsEditGoals(false)

    }

    const handleEditGoals = (obj) => {
        setIsEditGoals(true)
        setSelectedGoal(obj)
    }

    const handleAddObjective = (id) => {
        setSelectedGoal({ goalId: id });
        setAddObjectiveOpen(true)

    }

    const handleCloseObjective = () => {
        setAddObjectiveOpen(false)
    }

    if (loading) return <Loader />;

    return (
        <div>

            {goalData?.length > 0 && goalData?.map(goalItem =>
                <ExpansionPanel
                    id={goalItem.id + "rand"}
                    title={goalItem.goalName}
                    tabIndex={0}
                    key={goalItem.id}
                    expandIcon="k-i-plus  fa fa-plus"
                    collapseIcon="k-i-minus  fa fa-minus"
                    className="main-goal"
                    expanded={expandedGoal[goalItem.id]}
                    onAction={(event) => onActionGoal(event, goalItem)}>
                    {expandedGoal[goalItem.id] && (
                        <ExpansionPanelContent>
                            <div onKeyDown={(e) => e.stopPropagation()}>

                                {!showInactivePlans ?
                                    <div className="d-flex justify-content-end align-items-center mb-3">

                                        {

                                            userAccessPermission[permissionEnum.MANAGE_TREATMENT_PLAN] &&

                                            <>
                                                <button onClick={() => handleEditGoals(goalItem)} type="button" className="btn  btn-sm text-theme f-16 blue-primary-outline mr-3 line-height-pencil">
                                                    <i className="k-icon k-i-edit pencile-edit-color mr-2"></i>Edit Goal
                                                </button>

                                                <Tooltip anchorElement="target" position="top">
                                                    <i onClick={() => deletePlans(goalItem)} className="fa fa-trash" aria-hidden="true" title="Delete Goal"></i>
                                                </Tooltip>
                                            </>

                                        }


                                    </div> : null}
                                <div className="show-upper-event d-flex justify-content-between  py-2 align-items-center"></div>
                                <div className="date-timeshow px-3">

                                    <p className="mb-1"><span className="k-icon k-i-calendar-date text-theme pr-2"></span><b>Start Date: </b> {goalItem.startDate === null ? " -/-" : moment(goalItem.startDate).format("M/D/YYYY")}</p>
                                    <p className="mb-1"> <span className="k-icon k-i-calendar-date text-theme pr-2"></span> <b>End Date: </b> {goalItem.endDate === null ? " -/-" : moment(goalItem.endDate).format("M/D/YYYY")}</p>
                                    <p className="mb-1"> <span className="k-icon k-i-calendar-date text-theme pr-2"></span> <b>Target Date: </b> {goalItem.targetDate === null ? " -/-" : moment(goalItem.targetDate).format("M/D/YYYY")}</p>
                                    <p className="mb-1"> <b>Status: </b> {goalItem.status}</p>
                                    <p className="mt-1"><b>Description: </b> {goalItem.goalDescription} </p>
                                    <p className="mb-1"><b>comments: </b>{goalItem.comments}</p>
                                </div>
                                {!showInactivePlans ? <div className="d-flex justify-content-end align-items-center mb-3">
                                    {
                                        userAccessPermission[permissionEnum.MANAGE_TREATMENT_PLAN] &&
                                        <>
                                            <button onClick={() => handleAddObjective(goalItem.id)} type="button" className="btn  btn-sm blue-primary-outline mr-3 "> <i className="k-icon k-i-plus mr-2"></i>Add Objective
                                            </button>
                                        </>
                                    }
                                </div> : null}
                                <ListTreatmentObjective objectiveData={goalItem?.objectives} goalId={goalItem?.id} setIsGoalRefreshed={setIsGoalRefreshed} isGoalRefreshed={isGoalRefreshed} showInactivePlans={showInactivePlans} />
                            </div>
                        </ExpansionPanelContent>
                    )}

                </ExpansionPanel>)
            }

            {
                isDeleteGoals &&
                <DeleteTreatment onClose={handleCloseDeleteDialouge} isDeleteGoals={isDeleteGoals} selectedPlan={selectedGoal} setIsGoalRefreshed={setIsGoalRefreshed} />
            }

            {
                isEditGoals && <AddGoal onClose={handleCloseEditTreatment} selectedGoal={selectedGoal} setIsGoalRefreshed={setIsGoalRefreshed} />
            }
            {
                addObjectiveOpen && <AddObjective onClose={handleCloseObjective} selectedObjective={selectedGoal} setIsGoalRefreshed={setIsGoalRefreshed} />
            }
        </div>
    )
}

export default ListTreatmentGoal;