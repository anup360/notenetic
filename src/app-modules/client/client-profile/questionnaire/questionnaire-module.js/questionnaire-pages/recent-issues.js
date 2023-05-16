import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { ClientService } from "../../../../../../services/clientService";
import NotificationManager from "react-notifications/lib/NotificationManager";
import APP_ROUTES from "src/helper/app-routes";
import { renderErrors } from "src/helper/error-message-helper";

const RecentIssue = ({
  list,
  questionId,
  calculateSum,
  onChildStateChange,
  listItems,
  totalSum,
  setListItems,
}) => {
  const navigate = useNavigate();
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const [loading, setLoading] = useState(false);

  // State for storing list items and their respective dropdown values
  // const [listItems, setListItems] = useState(list);

  // useEffect(() => {
  //   // calculateSum();
  //   sendDataToParent();
  // }, [listItems]);

  // useEffect(() => {
  //   setListItems(list);
  // }, [list]);

  // State for storing the total sum
  // const [totalSum, setTotalSum] = useState(0);

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

    // onChildStateChange(updatedItems);
    setListItems(updatedItems);
  };

  // Calculate the sum of all selected values
  // const calculateSum = () => {
  //   const sum = listItems.reduce((acc, item) => acc + item.value, 0);
  //   setTotalSum(sum);
  // };

  const sendDataToParent = () => {
    // onDataFromChild(inputValue);
    calculateSum(listItems);
  };

  return (
    <div className="ACE_main_table mt-4">
      <div>
        <h5>Recent Issues</h5>
        <label className="pb-3 mt-2 border-bottom">
          Since you marked YES to at least one item above, please complete this
          section. Mark the answer that corresponds with how often the item has
          bothered the child in the last two weeks.
        </label>
      </div>
      <div className="row border-bottom mb-3 mt-2">
        <div className="col-md-7">
          <label className="fw-500">
            NOTE: 0 = Never; 1 = Once in a while; 2 = Half the time; 3 = Almost
            always
          </label>
        </div>
        <div className="col-md-2 ">
          <div className="strongly_main ml-auto align-items-center">
            <div className="strongly-disagree">
              {/* <label>strongly disagree</label> */}
              <div class="flex-text">
                <div className="data-zero">
                  <p>0</p>
                </div>
                <div className="data-one">
                  <p>1</p>
                </div>
                <div className="data-one">
                  <p>2</p>
                </div>
                <div className="data-one">
                  <p>3</p>
                </div>
              </div>
            </div>
          </div>
        </div>
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
            {[0, 1, 2, 3].map((value) => (
              <label key={value} className="cats_label">
                <input
                  type="radio"
                  name={`item${item.id}`}
                  value={value}
                  checked={item.value == value}
                  onChange={() => handleRadioChange(item.id, value)}
                  className="mr-2"
                />
              </label>
            ))}
          </div>
        </div>
      ))}
      <div className="text-end total_phq col-9">
        <p>Total Score: </p>
        <p className="submit_phq mb-0"> {totalSum}</p>
      </div>
    </div>
  );
};

export default RecentIssue;
