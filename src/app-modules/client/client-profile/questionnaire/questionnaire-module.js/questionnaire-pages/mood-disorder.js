import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { ClientService } from "../../../../../../services/clientService";
import NotificationManager from "react-notifications/lib/NotificationManager";
import APP_ROUTES from "src/helper/app-routes";
import RecentIssue from "./recent-issues";
import { renderErrors } from "src/helper/error-message-helper";

const MoodDisorderQuestionnaire = ({ list, questionId, response }) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const [loading, setLoading] = useState(false);
  const [selectedValues, setSelectedValues] = useState([]);
  const [listItems, setListItems] = useState(list);
  const [totalSum, setTotalSum] = useState(0);
  const [isQuestionnaireSubmit, setQuestionnaireSubmit] = useState(0);

  useEffect(() => {
    if (state?.field?.id) {
      const updatedGAD = list.map((question) => {
        const matchingQuestion = response?.find(
          (item) => item.questionId === question.questionId
        );

        if (matchingQuestion) {
          if (matchingQuestion.questionId === list[0].questionId) {
            const value = JSON.parse(matchingQuestion.value);
            const ques = [...question.question];
            value?.forEach((v, idx) => {
              ques[idx] = { ...ques[idx], value: v };
            });
            return { ...question, question: ques, value };
          }
          return { ...question, value: parseInt(matchingQuestion.value) };
        }
        return question;
      });
      setListItems(updatedGAD);
    } else {
      setListItems(list);
    }
  }, [response]);

  const handleRadioChange = (itemId, value) => {
    console.clear();
    let openStatus = 0;
    let openStatusID = 0;

    const updatedItems = listItems.map((item) => {
      if (item.id === itemId) {
        if (!!item.openId) {
          openStatusID = item.openId;
          openStatus = value;
        }
        return { ...item, value: value };
      }
      if (item.id === openStatusID) {
        item.isOpen = openStatus;
        openStatusID = 0;
        openStatus = 0;
      }
      return item;
    });
    setListItems(updatedItems);
  };

  const handeNestedItem = (itemId, questionId, value) => {
    const updatedItems = listItems.map((item) => {
      if (item.questionId === itemId) {
        const question = item.question.map((ques, idx) => {
          if (ques.id === questionId) {
            item.value[idx] = value;
            return {
              ...ques,
              value,
            };
          }
          return ques;
        });
        return {
          ...item,
          question,
        };
      }
      return item;
    });
    setListItems(updatedItems);
  };

  const handleSubmit = async () => {
    await ClientService.insertClientModdQuestionnaire(
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
  const arr = Object.entries(selectedValues).map(([key, value]) => {
    return { key: parseInt(key), value };
  });

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

  const getDynamicContent = (item) => {
    switch (item.type) {
      case null:
        return <></>;

      case "dropdown":
        return (
          <>
            {!!item.isOpen ? (
              <div className="select_listing col-md-4 text-center">
                <select
                  value={item.value}
                  onChange={(e) =>
                    handleDropdownChange(item.id, e.target.value)
                  }
                >
                  <option value={0}>0 - No Problem</option>
                  <option value={1}>1 - Minor Problem</option>
                  <option value={2}>2 - Moderate Problem </option>
                  <option value={3}>3 - Serious Problem</option>
                </select>
              </div>
            ) : (
              ""
            )}
          </>
        );

      case "boolean":
        return (
          <>
            <div className="col-md-4 text-center">
              <label className="cats_label">
                <input
                  type="radio"
                  name={`selection-${item.id}`}
                  value={1}
                  checked={item.value === 1}
                  onChange={() => handleRadioChange(item.id, 1)}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="cats_label">
                <input
                  type="radio"
                  name={`selection-${item.id}`}
                  value={0}
                  checked={item.value === 0}
                  onChange={() => handleRadioChange(item.id, 0)}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </>
        );

      default:
        break;
    }
  };

  return (
    <div className="child_main_table mt-3 ml-1">
      <div>
        <h3>MDQ - Mood Disorder Questionnaire</h3>
        <label className="pb-3 mt-2 border-bottom">
          The MDQ is the best at screening for bipolar I (depression and mania)
          disorder and is not as sensitive to bipolar || (depression and
          hypomania) or bipolar not otherwise specified (NOS) disorder.
        </label>
      </div>

      {listItems?.map((item) => (
        <>
          <div className="row mb-3 pb-2 border-bottom">
            <div className="col-md-8">
              <label key={item.id}>
                {item.id}. {item.name}
              </label>
            </div>

            {getDynamicContent(item)}
          </div>

          <ul className="pl-0 ">
            {item.question?.map((questionItem, idx) => (
              <li style={{ listStyle: "none" }} key={questionItem.id}>
                <div className="row mb-3 pb-2 border-bottom px-0">
                  <div className="col-md-8">
                    <label>{questionItem.name}</label>
                  </div>
                  <div className="col-md-4 text-center">
                    <label className="cats_label">
                      <input
                        type="radio"
                        name={`selection-${questionItem.questionId}`}
                        value={1}
                        checked={questionItem.value === 1}
                        onChange={() =>
                          handeNestedItem(item.questionId, questionItem.id, 1)
                        }
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="cats_label">
                      <input
                        type="radio"
                        name={`selection-${questionItem.questionId}`}
                        value={0}
                        checked={questionItem.value === 0}
                        onChange={() =>
                          handeNestedItem(item.questionId, questionItem.id, 0)
                        }
                        className="mr-2"
                      />
                      No
                    </label>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      ))}
      {state == null ? (
        <div className="text-end mt-3 col-11">
          <button onClick={handleSubmit} className="submit_phq ">
            Submit
          </button>
        </div>
      ) : (
        ""
      )}
      <label className="f-12">
        This instrument is designed for screening purposes only and not to be
        used as a diagnostic tool. Permission for use granted by RMA Hirschfeld,
        MD.
      </label>
    </div>
  );
};

export default MoodDisorderQuestionnaire;
