import React, { useEffect, useState } from "react";
import Loader from "../../../../control-components/loader/loader";
import CustomDrawer from "../../../../control-components/custom-drawer/custom-drawer";
import ClientHeader from "../client-header/client-header";
import { ClientService } from "../../../../services/clientService";
import NotificationManager from "react-notifications/lib/NotificationManager";
import MyComponent from "./questionnaire-module.js/patient-health-questionnaire";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { useLocation } from "react-router";
import { useNavigate } from "react-router";
import { renderErrors } from "src/helper/error-message-helper";


const CreateQuestionnaire = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [questionsDetails, setQuestionDetails] = useState();
  const [questionList, setQuestionList] = useState([]);
  const [questionListById, setQuestionListById] = useState([]);

  useEffect(() => {
    getQuestions();
    if (state?.field?.id) {
      getQuestionsById();
    }
    if (state?.field) {
      const dropdownvalue = {
        fullName: state?.field?.questionnaire,
        id: state?.field?.questionnaireId,
      };
      setQuestionDetails(dropdownvalue);
    }
  }, []);



  const getQuestions = async () => {
    await ClientService.getQuestions()
      .then((result) => {
        let questionList = result?.resultData;
        setQuestionList(questionList);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const getQuestionsById = async () => {
    await ClientService.getQuestionsById(state?.field?.id)
      .then((result) => {
        let questionListById = result?.resultData;
        setQuestionListById(JSON.parse(questionListById?.data));
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuestionDetails(value);
  };

  return (
    <div className="d-flex flex-wrap">
      {loading === true && <Loader />}
      <div className="inner-dt col-md-3 col-lg-2">
        <CustomDrawer />
      </div>
      <div className="col-md-6 col-lg-10">
        <ClientHeader />
        <div className="row mt-5">
          <button
            style={{
              display: "flex",
              justifyContent: "left",
              alignItems: "center",
            }}
            onClick={() => {
              navigate(-1);
            }}
            type=""
            className="border-0 bg-transparent arrow-rotate pl-0 "
          >
            <i className="k-icon k-i-sort-asc-sm"></i>
            Go Back
          </button>
          {state == null ? (
            <div className=" col-lg-4 col-md-6 col-12 ">
              <DropDownList
                label="Questions"
                onChange={handleChange}
                data={questionList}
                value={questionsDetails}
                textField="fullName"
                dataItemKey="id"
                placeholder="Questions"
              />
            </div>
          ) : (
            ""
          )}

          <MyComponent
            key={state?.field?.id}
            componentType={
              questionsDetails?.enumId || JSON.stringify(state?.field?.enumId)
            }
             questionId={questionsDetails?.id}
            questionListById={questionListById}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateQuestionnaire;
