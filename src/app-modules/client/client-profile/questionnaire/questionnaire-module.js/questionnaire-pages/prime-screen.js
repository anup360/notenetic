import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { ClientService } from "../../../../../../services/clientService";
import NotificationManager from "react-notifications/lib/NotificationManager";
import APP_ROUTES from "src/helper/app-routes";
import { useLocation } from "react-router";
import { renderErrors } from "src/helper/error-message-helper";

const PrimeScreen = ({ list, questionId, response }) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const [loading, setLoading] = useState(false);
  // State for storing list items and their respective dropdown values
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
  const handleRadioChange = (itemId, value) => {
    // Find the item in the items array
    const updatedItems = listItems.map((item) => {
      if (item.id === itemId) {
        // Update the value of the selected radio button
        return { ...item, value };
      }
      return item;
    });
    setListItems(updatedItems);
  };

  // Calculate the sum of all selected values
  const calculateSum = () => {
    const sum = listItems.reduce((acc, item) => acc + (item.value || 0), 0);
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
    <div className="ACE_main_table mt-4 ">
      <div>
        <h3>Prime Screen - Revised w/ Distress</h3>
        <label className="pb-3 mt-2 ">
          Please select the appropriate level for each question below regarding
          any instance that have occured within the PAST YEAR.
        </label>
      </div>
      <div className="row border-bottom mb-3">
        <div className="col-md-8"></div>
        <div className="col-md-4">
          <div className="strongly_main ml-auto">
            <div className="strongly-disagree">
              <label>strongly disagree</label>
              <div class="flex-text">
                <div className="data-zero">
                  <p>0</p>
                </div>
                <div className="data-one">
                  <p>1</p>
                </div>
              </div>
            </div>
            <div className="not-sure">
              <label>Not-sure</label>
              <div class="flex-text">
                <div className="data-two">
                  <p>2</p>
                </div>
                <div className="data-three">
                  <p>3</p>
                </div>
                <div className="data-four">
                  <p>4</p>
                </div>
              </div>
            </div>
            <div className="strongly-agree">
              <label>strongly agree</label>
              <div class="flex-text">
                <div className="data-five">
                  <p>5</p>
                </div>
                <div className="data-six">
                  <p>6</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {listItems.map((item) => (
        <div className="row mb-3 pb-2 border-bottom">
          <div className="col-md-8">
            <div key={item.id}>
              <label>
                {item.id}. {item.name}
              </label>
            </div>
          </div>
          <div className="col-md-4 select_table_phq">
            {[0, 1, 2, 3, 4, 5, 6].map((value) => (
              <label key={value} className="cats_label">
                <input
                  disabled={state == null ? false : true}
                  type="radio"
                  name={`item${item.id}`}
                  value={value}
                  checked={item.value === value}
                  onChange={() => handleRadioChange(item.id, value)}
                  className="mr-2"
                />
                {/* {value} */}
              </label>
            ))}
          </div>
        </div>
      ))}
      <div className="text-end total_phq col-11">
        <p>Total Score: </p>
        <p className="submit_phq mb-0"> {totalSum}</p>
      </div>
      {state == null ? (
        <div className="text-end mt-3 col-11">
          <button onClick={handleSubmit} className="submit_phq ">
            Submit
          </button>
        </div>
      ) : (
        ""
      )}
      <p className="f-12">
        Copyright © 1999 Pfizer Inc. All rights reserved. Reproduced with
        permission.
      </p>
    </div>
  );
};

export default PrimeScreen;
