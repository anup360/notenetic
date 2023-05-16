import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { ClientService } from "../../../../../../services/clientService";
import NotificationManager from "react-notifications/lib/NotificationManager";
import APP_ROUTES from "src/helper/app-routes";
import RecentIssue from "./recent-issues";
import Interference from "./cats-interference";
import { useLocation } from "react-router";
// import InputKendoRct from "../../../control-components/input/input";
import InputKendoRct from "src/control-components/input/input";
import { renderErrors } from "src/helper/error-message-helper";

const ChildAdolesent = ({
  list,
  questionId,
  subList,
  interfered,
  response,
}) => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const [loading, setLoading] = useState(false);
  const [selectedValues, setSelectedValues] = useState([]);
  const [listItems, setListItems] = useState(list);
  const [listItems2, setListItems2] = useState(subList);
  const [listItems3, setListItems3] = useState(interfered);
  const [botherQuestion, setBotherQuestion] = useState({
    questionId: "bother_ques_1",
    value: "",
  });

  const [fields, setFields] = useState({
    event: "",
    brother: "",
  });

  const totalSum = listItems2.reduce(
    (sum, item) => sum + (Number(item.value) || 0),
    0
  );

  useEffect(() => {
    const l1 = listItems.map((item) => {
      const foundItem = response.find((i) => i.questionId === item.questionId);
      if (foundItem) {
        if (item.type === "question") {
          if (foundItem.value) {
            return { ...item, isSelected: true, value: foundItem.value };
          } else {
            return { ...item, isSelected: false, value: "" };
          }
        }
        return { ...item, ...foundItem };
      } else {
        return item;
      }
    });

    const l2 = listItems2.map((item) => {
      const foundItem = response.find((i) => i.questionId === item.questionId);
      if (foundItem) {
        return { ...item, ...foundItem };
      } else {
        return item;
      }
    });

    const l3 = listItems3.map((item) => {
      const foundItem = response.find((i) => i.questionId === item.questionId);
      if (foundItem) {
        return { ...item, ...foundItem };
      } else {
        return item;
      }
    });

    const botherQ = response.find(
      (i) => i.questionId === botherQuestion.questionId
    );

    setTimeout(() => {
      setListItems(l1);
      setListItems2(l2);
      setListItems3(l3);
      if (botherQ) {
        setBotherQuestion((prev) => ({ ...prev, value: botherQ.value }));
      }
    }, 0);
  }, [response]);

  const handleRadioChange = (itemId, value) => {
    const updatedItems = listItems.map((item) => {
      if (item.questionId === itemId) {
        if (itemId === "CATS_Q15") {
          if (value === "true") {
            return { ...item, isSelected: true, value: "" };
          } else {
            return { ...item, isSelected: false, value: "" };
          }
        }
        return { ...item, value: value };
      }
      return item;
    });
    setListItems(updatedItems);
  };

  const handleChange = (e) => {
    setBotherQuestion({ ...botherQuestion, value: e.target.value });
  };

  const handleEventChange = (item, value) => {
    const updatedItems = listItems.map((itm) => {
      if (itm.id === item.id) {
        return { ...itm, value: value };
      }
      return itm;
    });
    setListItems(updatedItems);
  };

  const handleSubmit = async () => {
    await ClientService.insertClientQuestionnaire(
      selectedClientId,
      totalSum,
      [...listItems, ...listItems2, ...listItems3, botherQuestion],
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

  // const arr = Object.entries(selectedValues).map(([key, value]) => {
  //   return { key: parseInt(key), value };
  // });

  const condition = "true";
  const foundItem = listItems?.find((item) => item.value === condition);

  const calculateSum = (listItems) => {
    const sum = listItems.reduce((acc, item) => acc + item.value, 0);
    // setTotalSum(sum);
  };

  // const handleChildStateChange1 = (childState) => {
  //   setState1(childState);
  // };

  // const handleChildStateChange2 = (childState) => {
  //   setState1(childState);
  // };

  return (
    <div className="child_main_table mt-3 ml-1">
      <div>
        <h3>CATS - Child & Adolescent Trauma screen</h3>
        <h6>Caregiver Report (Ages 7 - 17 years)</h6>
        <label className="pb-3 mt-2 border-bottom">
          Stressful or scary events happen to many people. Below is a list of
          stressful and scary events that sometimes happen. Mark YES if it
          happened to you. Mark No if it didn’t happen toyou.
        </label>
      </div>

      {listItems.map((item) => (
        <div className="row mb-3 pb-2 border-bottom">
          <div className="col-md-7">
            <div key={item.id}>
              <label>
                {item.id}. {item.name}
              </label>
            </div>
          </div>
          <div className="col-md-5  select_table_phq">
            <input
              type="radio"
              name={`radio_${item.questionId}`}
              value={true}
              checked={
                item?.type === "question"
                  ? item.isSelected
                  : item.value === "true"
              }
              onChange={() => handleRadioChange(item.questionId, "true")}
              className="input_box_cats"
            />
            <label className="mr-3">Yes</label>
            <input
              type="radio"
              name={`radio_${item.questionId}`}
              value={false}
              checked={
                item?.type === "question"
                  ? item.isSelected === null
                    ? false
                    : !item.isSelected
                  : item.value === "false"
              }
              onChange={() => handleRadioChange(item.questionId, "false")}
              className="input_box_cats"
            />
            <label className="mr-3">No</label>
          </div>
        </div>
      ))}
      {listItems[listItems.length - 1].isSelected ? (
        <div className="mb-3 col-lg-4 col-md-6 col-12 px-md-0">
          <InputKendoRct
            value={listItems[listItems.length - 1].value}
            onChange={(e) =>
              handleEventChange(listItems[listItems.length - 1], e.target.value)
            }
            name="event"
            label="Describe Event"
          />
        </div>
      ) : null}
      <div className="mb-3 col-lg-4 col-md-6 col-12 px-md-0">
        <InputKendoRct
          value={botherQuestion.value}
          onChange={handleChange}
          name="brother"
          label="Which one bothers the child most now ?"
        />
      </div>
      {foundItem || listItems[listItems.length - 1].isSelected ? (
        <RecentIssue
          list={subList}
          calculateSum={calculateSum}
          totalSum={totalSum}
          // onChildStateChange={handleChildStateChange1}
          listItems={listItems2}
          setListItems={setListItems2}
        />
      ) : null}
      {foundItem || listItems[listItems.length - 1].isSelected ? (
        <Interference
          list={interfered}
          listItems={listItems3}
          setListItems={setListItems3}
          // onChildStateChange={handleChildStateChange2}
        />
      ) : null}

      {state == null ? (
        <div className="text-end mt-3 col-9">
          <button onClick={handleSubmit} className="submit_phq ">
            Submit
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default ChildAdolesent;
