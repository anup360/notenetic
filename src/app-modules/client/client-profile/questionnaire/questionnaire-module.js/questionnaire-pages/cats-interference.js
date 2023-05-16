import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { ClientService } from "../../../../../../services/clientService";
import NotificationManager from "react-notifications/lib/NotificationManager";
import APP_ROUTES from "src/helper/app-routes";
import RecentIssue from "./recent-issues";
import { renderErrors } from "src/helper/error-message-helper";

const Interference = ({
  list,
  questionId,
  onChildStateChange,
  listItems,
  setListItems,
}) => {
  const navigate = useNavigate();
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const [loading, setLoading] = useState(false);
  const [selectedValues, setSelectedValues] = useState([]);
  // const [listItems, setListItems] = useState(list);

  const handleOptionChange = (itemId, option) => {
    const updatedListItems = listItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, value: option };
      }
      return item;
    });
    setListItems(updatedListItems);
    onChildStateChange(updatedListItems);
  };

  return (
    <div className="child_main_table mt-3 ml-1">
      <div>
        <h5>Interference</h5>
        <label className="pb-3 mt-2 border-bottom">
          Please mark YES or NO if the problems selected in the "Recent Issues"
          section have interfered with any of the following.
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
          <div className="col-md-3 select_table_phq">
            <label className="cats_label">
              <input
                type="radio"
                name={`radio_${item.id}`}
                value="yes"
                checked={item.value === "yes"}
                onChange={() => handleOptionChange(item.id, "yes")}
                className="mr-2"
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name={`radio_${item.id}`}
                value="no"
                checked={item.value === "no"}
                onChange={() => handleOptionChange(item.id, "no")}
                className="mr-2"
              />
              No
            </label>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Interference;
