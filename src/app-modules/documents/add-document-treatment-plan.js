import { DropDownList } from "@progress/kendo-react-dropdowns";
import { useEffect, useState } from "react";
import apiHelper from "../../helper/api-helper";
import API_URLS from "../../helper/api-urls";
import { showError } from "../../util/utility";
import moment from "moment";

const AddDocumentTreatmentPlan = ({
  clientId,
  selectedTreatmentPlanList,
  setSelectedTreatmentPlanList,
  editDocumentTreatmentPlans,
  isPlanOnceSet,
  setPlanOnceSet,
  treatementPlanRef,
  interventionRef,
}) => {
  // States
  const [loading, setLoading] = useState({
    treatment: false,
    objective: false,
    intervention: false,
  });





  const [treatmentList, setTreatmentList] = useState([]);
  const [goalList, setGoalList] = useState([]);
  const [objectiveList, setObjectiveList] = useState([]);
  const [interventionList, setInterventionList] = useState([]);

  const [treatmentInfo, setTreatmentInfo] = useState();

  const [selectedTreatment, setSelectedTreatment] = useState();
  const [selectedGoal, setSelectedGoal] = useState();
  const [selectedObjective, setSelectedObjective] = useState();
  const [selectedIntervention, setSelectedIntervention] = useState();

  // Variables

  /* ============================= useEffect functions ============================= */

  useEffect(() => {
    if (!clientId) return;
    fetchTreatments();
  }, [clientId]);

  useEffect(() => {
    if (!clientId) {
      setGoalList([]);
      setObjectiveList([]);
      setInterventionList([]);
      setSelectedGoal("");
      setSelectedObjective("");
      setSelectedIntervention("");
    }
  }, [clientId]);

  // useEffect(() => {
  //     setSelectedGoal("")

  //     if (selectedTreatment) {
  //         fetchGoals()
  //     }
  // }, [selectedTreatment])

  useEffect(() => {
    if (selectedGoal) {
      fetchObjectives();
    }
  }, [selectedGoal]);

  useEffect(() => {
    if (selectedObjective) {
      fetchInterventions();
    }
  }, [selectedObjective]);

  /* ============================= Private functions ============================= */

  function mapServerTreatementToLocal(treatement) {
    if (!treatement) return treatement;
    return {
      id: treatement?.id,
      name: treatement?.planName,
      goalList: treatement?.goals,
    };
  }

  function mapServerObjectiveToLocal(objective) {
    if (!objective) return objective;
    return {
      id: objective?.id,
      name: objective?.objective,
      interventionList: objective?.interventions,
    };
  }

  function mapServerGoalToLocal(goal) {
    if (!goal) return goal;
    return {
      id: goal?.id,
      name: goal?.goalName,
      objectiveList: goal?.objectives,
    };
  }

  function mapServerInterventionToLocal(intervention) {
    if (!intervention) return intervention;
    return {
      id: intervention?.id,
      name: intervention?.intervention,
    };
  }

  function fetchTreatments() {
    setLoading({ treatment: true });
    apiHelper
      .queryGetRequestWithEncryption(
        API_URLS.GET_CLIENT_TREATMENT_PLAN_BY_CLIENT_ID,
        clientId
      )
      .then((result) => {
        if (result.resultData.length > 0) {
          setTreatmentInfo(result.resultData[0]);
          const list = result.resultData;
          const goalArry = result.resultData[0]?.goals;

          const goalList = goalArry.map((r) => {
            return { id: r?.id, name: r?.goalName, objectives: r?.objectives };
          });
          setGoalList(goalList);
          setTreatmentList(list.map(mapServerTreatementToLocal));

          let newSelectedTreatmentPlanList = [];

          let goal = undefined;
          let objective = undefined;
          let intervention = undefined;

          if (editDocumentTreatmentPlans && !isPlanOnceSet) {
            setPlanOnceSet(true);

            for (const plan of editDocumentTreatmentPlans) {
              goal = {
                id: plan?.goalId,
                name: plan?.goalName,
                objectives: [
                  {
                    id: plan?.objectiveId,
                    name: plan?.objectiveName,
                  },
                ],
              };
              objective = {
                id: plan?.objectiveId,
                name: plan?.objectiveName,
                interventionList: [
                  {
                    id: plan?.interventionId,
                    name: plan?.interventionName,
                  },
                ],
              };
              intervention = {
                id: plan?.interventionId,
                name: plan?.interventionName,
              };
              // setSelectedGoal(goal)
              // setSelectedObjective(objective)
              // setSelectedIntervention(intervention)

              // const treament = list.find(x => x?.id == plan?.treatmentPlanId)
              // if (!treament) continue

              // if (treament) {
              //     objective = treament?.goals?.objectives.find(x => x?.id === plan?.objectiveId)
              // }

              // if (treament) {
              //     goal = treament?.goals.find(x => x?.id === plan?.goalId)
              // }
              // if (objective) {
              //     intervention = objective.interventions.find(x => x?.id === plan?.interventionId)
              // }

              newSelectedTreatmentPlanList.push({
                id: newSelectedTreatmentPlanList.length,
                treatementId: plan?.treatmentPlanId,
                goal: goal,
                objective: objective,
                intervention: intervention,
              });
            }
            setSelectedTreatmentPlanList(
              ...selectedTreatmentPlanList,
              newSelectedTreatmentPlanList
            );
          }
        }
      })
      .catch((err) => {
        showError(err, "Fetch Treatments");
      })
      .finally(() => {
        setLoading({ treatment: false });
      });
  }

  function fetchObjectives() {
    setObjectiveList(selectedGoal?.objectives?.map(mapServerObjectiveToLocal));

    /* 
        setLoading({ objective: true })
        apiHelper.getRequest(API_URLS.GET_PLAN_OBJECTIVE_BY_TREATMENT_PLAN_ID +
            selectedTreatment.id)
            .then(result => {
                if (result.resultData) {
                    setObjectiveList(result.resultData)
                }
            })
            .catch(err => { showError(err, "Fetch Objectives") })
            .finally(() => { setLoading({ objective: false }) }) 
            */
  }
  function fetchGoals() {
    setGoalList(selectedTreatment?.goalList?.map(mapServerGoalToLocal));
  }
  function fetchInterventions() {
    setInterventionList(
      selectedObjective.interventionList.map(mapServerInterventionToLocal)
    );
  }

  /* ============================= Event functions ============================= */

  // function onTreatmentChange(props) { setSelectedTreatment(props.value) }
  function onGoalChange(props) {
    setSelectedGoal(props.value);
  }
  function onObjectiveChange(props) {
    setSelectedObjective(props.value);
  }
  function onInterventionChange(props) {
    setSelectedIntervention(props.value);
  }

  function onTreatmentPlanAdd(event) {
    function match(obj1, obj2) {
      if (!obj1 && !obj2) {
        return true;
      }
      if (obj1 && !obj2) {
        return false;
      }
      if (!obj1 && obj2) {
        return false;
      }
      return obj1?.id === obj2?.id;
    }

    if (
      selectedTreatmentPlanList.find((x) => {
        return (
          match(x.goal, selectedGoal) &&
          match(x.objective, selectedObjective) &&
          match(x.intervention, selectedIntervention)
        );
      })
    ) {
      showError("You can't add duplicate treatement plan!");
      return;
    }
    setSelectedTreatmentPlanList([
      ...selectedTreatmentPlanList,
      {
        id: selectedTreatmentPlanList.length,
        treatementId: treatmentInfo?.id,
        goal: selectedGoal,
        objective: selectedObjective,
        intervention: selectedIntervention,
      },
    ]);
    setSelectedTreatment("");
    setSelectedGoal("");
    setSelectedObjective("");
    setSelectedIntervention("");
  }

  function onTreatmentPlanDelete(plan) {
    setSelectedTreatmentPlanList(
      selectedTreatmentPlanList.filter((p) => p?.id !== plan?.id)
    );
  }

  return (
    <>
      <label className="mb-2">
        {clientId &&
          treatmentInfo?.planName +
            " (" +
            moment(treatmentInfo?.planDate).format("M/D/YYYY") +
            ")"}
      </label>
      <div className="border-steps-btn mb-4">
        <div className="row">
          <div className="col-lg-6 col-12 mb-3">
            {/* <div className='form-group mb-3'>
                            <label className='mb-2'>Goal</label>
                            <DropDownList
                                ref={treatementPlanRef}
                                data={treatmentList}
                                loading={loading.treatment}
                                textField="name"
                                value={selectedTreatment}
                                onChange={onTreatmentChange}
                            />
                        </div> */}
            {/*End  */}

            <div className="form-group mb-3">
              <label className="mb-2">Goal</label>
              <DropDownList
                ref={treatementPlanRef}
                data={goalList}
                loading={loading.goal}
                textField="name"
                value={selectedGoal}
                onChange={onGoalChange}
                dataItemKey="id"
              />
            </div>

            <div className="form-group mb-3">
              <label className="mb-2">Objective</label>
              <DropDownList
                data={objectiveList}
                loading={loading.objective}
                textField="name"
                value={selectedObjective}
                onChange={onObjectiveChange}
                dataItemKey="id"
              />
            </div>
            {/* End */}
            <div className="form-group mb-3">
              <label className="mb-2">Intervention</label>
              <DropDownList
                ref={interventionRef}
                data={interventionList}
                loading={loading.intervention}
                textField="name"
                value={selectedIntervention}
                onChange={onInterventionChange}
                dataItemKey="id"
              />
            </div>
            {/* End */}
            <div id="plan-add-to-doc" tabIndex="0"></div>
            <button
              type="button"
              disabled={!selectedGoal}
              className="btn blue-primary btn-sm mx-auto text-center"
              onClick={onTreatmentPlanAdd}
            >
              Add to DOC
            </button>
          </div>
          <div className="col-lg-6 col-12 mb-3">
            <p className="mb-4 f-14">
              <b>Selected Treatment Plan</b>
            </p>
            <div className="scroll-treatment white-scroll">
              {selectedTreatmentPlanList.length === 0 ? (
                <p>No Selected Treatment Plans</p>
              ) : (
                selectedTreatmentPlanList.map((plan) => {
                  return (
                    <div key={plan?.id} className="treament-text mb-4">
                      <div className="tex-show">
                        {/* <p className='f-14 fw-500 mb-2'>{plan.treatement ? plan.treatement.name : ""}</p> */}
                        <p className="f-12 mb-1">
                          {plan?.goal ? plan.goal?.name : ""}
                        </p>
                        <p className="f-12 mb-1">
                          {plan?.objective ? plan.objective?.name : ""}
                        </p>
                        <p className="f-12 mb-1">
                          {plan?.intervention ? plan.intervention?.name : ""}
                        </p>
                      </div>
                      <div
                        className="delet-sht text-center cursor-pointer"
                        onClick={() => onTreatmentPlanDelete(plan)}
                      >
                        <i className="fa fa-trash text-danger"></i>
                        <p className="f-9 mb-0 text-danger">Delete</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddDocumentTreatmentPlan;
