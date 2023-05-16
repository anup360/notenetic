import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { ClientService } from "../../../../../../services/clientService";
import NotificationManager from "react-notifications/lib/NotificationManager";
import APP_ROUTES from "src/helper/app-routes";
import { useLocation } from "react-router";
import { renderErrors } from "src/helper/error-message-helper";

const GeneralAnxietyDisorder = ({ list, questionId, response }) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const [loading, setLoading] = useState(false);
  const [listItems, setListItems] = useState(list);

  useEffect(() => {
    calculateSum();
  }, [listItems]);

  useEffect(() => {
    setListItems(list);
  }, [list]);

  useEffect(() => {
    const updatedGAD = list.map((question) => {
      const matchingQuestion = response?.find(
        (item) => item.questionId === question.questionId
      );
      if (matchingQuestion) {
        return { ...question, value: parseInt(matchingQuestion.value) };
      }
      return question;
    });
    setListItems(updatedGAD);
  }, [response]);

  // State for storing the total sum
  const [totalSum, setTotalSum] = useState(0);

  // Function to handle change in dropdown values
  const handleDropdownChange = (itemId, value) => {
    // Update the listItems state with the new value
    const updatedListItems = listItems?.map((item) => {
      if (item.id === itemId) {
        return { ...item, value: parseInt(value) };
      }
      return item;
    });
    setListItems(updatedListItems);
  };

  // Function to calculate the sum of all dropdown values
  const calculateSum = () => {
    const sum = listItems?.reduce(
      (acc, currentItem) => acc + currentItem.value,
      0
    );
    setTotalSum(sum);
  };

  const handleSubmit = async () => {
    await ClientService.insertClientQuestionnaire(
      selectedClientId,
      totalSum,
      listItems,
      questionId
    )
      .then((result) => {
        let questionList = result.resultData;
        navigate(APP_ROUTES.QUESTIONNAIRE);
        NotificationManager.success("Add successfully");
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  return (
    <div>
      <div className="mt-3  phq_main_table">
        <h3>GAD7 - General Anxiety Disorder</h3>
        <label className="border-bottom pb-2">
          Over the last two weeks, How often have you been bothered by any of
          the following? (Use the drop down list to select the application
          amount.)
        </label>
      </div>
      {listItems?.map((item) => {
        return (
          <div className="row mb-3 pb-2 border-bottom">
            <div className="col-md-7">
              <div key={item?.id}>
                <label>
                  {item?.id}. {item?.name}:
                </label>
              </div>
            </div>
            <div className="col-md-5  select_table_phq">
              <select
                value={item?.value}
                onChange={(e) => handleDropdownChange(item?.id, e.target.value)}
                disabled={state == null ? false : true}
              >
                <option value={0}>0 - Not at all</option>
                <option value={1}>1 - Several days</option>
                <option value={2}>2 - More than half day</option>
                <option value={3}>3 - Nearly every day</option>
              </select>
            </div>
          </div>
        );
      })}
      <div className="text-end total_phq col-9">
        <p className="mb-0">Total Score: </p>
        <p className="submit_phq mb-0">{totalSum}</p>
      </div>
      {/* <div style={{ display: "flex", justifyContent: "end" }}> */}
      {state == null ? (
        <div className="text-end mt-3 col-9">
          <button onClick={handleSubmit} className="submit_phq ">
            Submit
          </button>
        </div>
      ) : (
        ""
      )}
      {/* </div> */}
      <p className="f-12">
        Copyright © 1999 Pfizer Inc. All rights reserved. Reproduced with
        permission.
      </p>
    </div>
  );
};

export default GeneralAnxietyDisorder;
