import React, { useEffect, useState } from "react";
import Loader from "../../control-components/loader/loader";
import { Dialog } from "@progress/kendo-react-dialogs";

import { renderErrors } from "src/helper/error-message-helper";
import { ClientService } from "src/services/clientService";
import MyComponent from "../client/client-profile/questionnaire/questionnaire-module.js/patient-health-questionnaire";

const ViewLinkedQuestionire = ({
    onClose,
    selectedQuestionId
}) => {
    const [loading, setLoading] = useState(false);
    const [questionnaireData, seQuestionnaireData] = useState([]);
    const [errors, setErrors] = useState("");
    const [settingError, setSettingError] = useState(false);
    const [questionListById, setQuestionListById] = useState([]);

    let [fields, setFields] = useState({
        questionnaireName: ""

    });


    useEffect(() => {
        if (selectedQuestionId) {
            getQuestionsById();
        }
    }, [])



    const getQuestionsById = async () => {
        await ClientService.getQuestionsById(selectedQuestionId?.clientQuestionnaireId)
            .then((result) => {
                let questionListById = result?.resultData;
                setQuestionListById(JSON.parse(questionListById?.data));
            })
            .catch((error) => {
                setLoading(false);
                renderErrors(error.message);
            });
    };


    return (
        <div>
            <Dialog
                onClose={onClose}
                title={"Questionnaire"}
                className="dailog-model tables_question thin-scroll"
            >
                <div className="client-accept edit-client-popup">
                    <MyComponent
                        key={selectedQuestionId}
                        componentType={
                             JSON.stringify(selectedQuestionId?.enumId) 
                        }
                        questionListById={questionListById}
                    />

                    {loading == true && <Loader />}
              

                </div>

            </Dialog>
        </div>
    );
};
export default ViewLinkedQuestionire;
