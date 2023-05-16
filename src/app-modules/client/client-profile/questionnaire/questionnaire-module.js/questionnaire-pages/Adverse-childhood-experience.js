import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { ClientService } from "../../../../../../services/clientService";
import NotificationManager from "react-notifications/lib/NotificationManager";
import APP_ROUTES from "src/helper/app-routes";
import { useLocation } from "react-router";
import { renderErrors } from "src/helper/error-message-helper";

const AdverseChildhood = ({ list, questionId, response }) => {
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
        if (question.type === "radio") {
          return {
            ...question,
            value: matchingQuestion.value,
          };
        } else {
          return {
            ...question,
            value: matchingQuestion.value === "true" ? 1 : 0,
          };
        }
      }
      return question;
    });
    setListItems(updatedGAD);
  }, [response]);

  // State for storing the total sum
  const [totalSum, setTotalSum] = useState(0);

  const handleCheckboxChange = (itemId) => {
    const updatedItems = listItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, value: !item.value };
      }
      return item;
    });
    setListItems(updatedItems);
  };

  const handleRadioChange = (id, value) => {
    const updatedItems = listItems.map((item) => {
      if (item.id === id) {
        return { ...item, value: value };
      }
      return item;
    });
    setListItems(updatedItems);
  };

  const calculateSum = () => {
    const checkedItems = listItems.filter(
      (item) => item.value && item.type !== "radio"
    );
    const sum = checkedItems.reduce((acc, item) => acc + item.value, 0);
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
      <div className="ACE_main_table mt-3">
        <h3>ACE - Adverse Childhood Experience Questionnaire for Adults</h3>
        <label className="pb-3 mt-2 border-bottom">
          <b>Instructions: </b> Below is a list of 10 categories of Adverse
          Childhood Experiences (ACEs). From the list below, please place a
          checkmark next to each ACE category that you experienced prior to your
          18th birthday. Then, please add up the number of categories of ACEs
          you experienced and put the total number at the bottom.
        </label>
      </div>
      {listItems.map((item) => (
        <div className="row mb-3 pb-2 border-bottom">
          <div className="col-md-8">
            <label key={item.id} className="list_unstyled-cus-table">
              {item.id}. {item.name}
            </label>
          </div>
          {item.type === "radio" ? (
            item.buttons.map((btn) => (
              <label key={btn.value} className="cats_label">
                <input
                  type="radio"
                  name={`item${item.id}`}
                  value={btn.value}
                  checked={item.value === btn.value}
                  onChange={() => handleRadioChange(item.id, btn.value)}
                  className="mr-2"
                />
                {btn.label}
              </label>
            ))
          ) : (
            <div className="col-md-4  select_table_phq">
              <input
                type="checkbox"
                checked={item.value}
                onChange={() => handleCheckboxChange(item.id)}
              />
            </div>
          )}
        </div>
      ))}

      <div className="text-end total_phq col-9">
        <p>ACE Score: </p>
        <p className="submit_phq mb-0">{totalSum}</p>
      </div>

      {state == null ? (
        <div className="text-end mt-3 col-9">
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

export default AdverseChildhood;
