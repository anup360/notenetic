import { Loader } from "@progress/kendo-react-indicators";
import { ExpansionPanel, ExpansionPanelContent } from "@progress/kendo-react-layout";
import { Tooltip } from "@progress/kendo-react-tooltip";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { ClientService } from "src/services/clientService";
import DeleteTreatment from "./delete-treatment";
import AddObjective from "./add-objective";
import AddIntervention from "./add-intervention";
import { permissionEnum } from "../../../../helper/permission-helper";
import { useSelector } from "react-redux";
import { renderErrors } from "src/helper/error-message-helper";

const ListTreatmentIntervention = ({ interventionData, goalId, setIsGoalRefreshed, isGoalRefreshed, showInactivePlans }) => {

    const [loading, setLoading] = useState(false);
    const [expandedObjective, setExpandedObjective] = React.useState(false);
    const [isDeleteIntervention, setIsDeleteIntervention] = useState(false);
    const [selectedIntervention, setSelectedIntervention] = useState();
    const [isEditIntervention, setIsEditIntervention] = useState(false);
    const userAccessPermission = useSelector((state) => state.userAccessPermission);


    const onActionObjective = React.useCallback(
        (event, obj) => {
            setExpandedObjective({ ...expandedObjective, [obj.id]: !expandedObjective[obj.id] });
            // if (event.expanded === false) {
            //     // setSelectedIntervention(obj)
            // }
        },
        [expandedObjective]
    );

    const handleCloseDeleteDialouge = () => {
        setIsDeleteIntervention(false)
    }

    const deletePlans = (obj) => {
        setSelectedIntervention(obj)
        setIsDeleteIntervention(true)
    }

    const handleCloseEditTreatment = ({ edited }) => {

        setIsEditIntervention(false)

    }

    const handleEditIntervention = (obj) => {
        setIsEditIntervention(true)
        setSelectedIntervention(obj)
    }

    if (loading) return <Loader />;

    return (
        <div>
            {interventionData.length > 0 && interventionData.map(interventionItem =>
                <ExpansionPanel
                    id={interventionItem.id + "rand"}
                    title={interventionItem.intervention}
                    tabIndex={0}
                    key={interventionItem.id}
                    expandIcon="k-i-plus  fa fa-plus"
                    className="main-inter"

                    collapseIcon="k-i-minus  fa fa-minus"
                    expanded={expandedObjective[interventionItem.id]}
                    onAction={(event) => onActionObjective(event, interventionItem)}>
                    {expandedObjective[interventionItem.id] && (
                        <ExpansionPanelContent>

                            {
                                !showInactivePlans && userAccessPermission[permissionEnum.MANAGE_TREATMENT_PLAN] &&

                                <div className="d-flex justify-content-end align-items-center mb-3">

                                    <button onClick={() => handleEditIntervention(interventionItem)} type="button" className="btn  btn-sm text-theme f-16 blue-primary-outline mr-3 line-height-pencil"> <i className="k-icon k-i-edit pencile-edit-color mr-2"></i>Edit Intervention
                                    </button>

                                    <Tooltip anchorElement="target" position="top">
                                        <i onClick={() => deletePlans(interventionItem)} className="fa fa-trash" aria-hidden="true" title="Delete Objective"></i>
                                    </Tooltip>
                                </div>
                            }
                            <div className="show-upper-event d-flex justify-content-between  py-2 align-items-center"></div>
                            <div className="date-timeshow px-3">

                                <p className="mb-1"> <b>Status: </b> {interventionItem.status}</p>

                            </div>

                        </ExpansionPanelContent>
                    )}

                </ExpansionPanel>)
            }

            {
                isDeleteIntervention &&
                <DeleteTreatment onClose={handleCloseDeleteDialouge} isDeleteIntervention={isDeleteIntervention} selectedIntervention={selectedIntervention} setIsGoalRefreshed={setIsGoalRefreshed} />
            }
            {
                isEditIntervention &&
                <AddIntervention onClose={handleCloseEditTreatment} selectedIntervention={selectedIntervention} setIsGoalRefreshed={setIsGoalRefreshed} />
            }
        </div>
    )
}

export default ListTreatmentIntervention;