import React, { useEffect, useState } from "react";
import apiHelper from "../../../helper/api-helper";
import API_URLS from "../../../helper/api-urls";
import { useSelector } from "react-redux";
import Loader from "../../../control-components/loader/loader";
import NotificationManager from "react-notifications";
import { renderErrors } from "src/helper/error-message-helper";

import {
  ListBox,
  ListBoxToolbar,
  processListBoxData,
  processListBoxDragAndDrop,
} from "@progress/kendo-react-listbox";
import searchIcon from "../../../assets/images/search.png";
import { Input } from "@progress/kendo-react-inputs";
import { filterBy } from "@progress/kendo-data-query";

const SELECTED_FIELD = "selected";

const AssignService = ({ available, assigned }) => {
  const lastSelectedIndex = React.useRef(0);
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const [loading, setLoading] = useState(false);
  const [selectedID, setSelectedID] = useState([]);
  const [state, setState] = React.useState({
    available: [],
    assigned: [],
    draggedItem: {},
  });
  const [filter, setFilter] = React.useState("");

  useEffect(() => {
    fillData();
  }, [available, assigned]);

  function getavailableList() {
    return !available
      ? []
      : available.map((x) => {
          return { selected: false, ...x };
        });
  }

  function getAssignedList() {
    return !assigned
      ? []
      : assigned.map((item) => {
          return { selected: false, ...item };
        });
  }

  async function fillData() {
    let AssignedList = getAssignedList();
    setState({
      ...state,
      available: getavailableList().filter(
        (available) =>
          !AssignedList.find(
            (assigned) =>
              assigned.id === available.id || assigned.id === available.id
          )
      ),
      assigned: AssignedList,
      draggedItem: {},
    });
  }

  const handleItemClick = (event, data, connectedData) => {
    let last = lastSelectedIndex.current;
    const newData = [...state[data]];
    let id = [...selectedID];
    const current = newData.findIndex(
      (dataItem) => dataItem.id === event.dataItem.id
    );
    if (!event.nativeEvent.shiftKey) {
      lastSelectedIndex.current = last = current;
    }
    if (!event.nativeEvent.metaKey && !event.nativeEvent.ctrlKey) {
      newData.forEach((item) => (item.selected = false));
      id = [];
    }
    const select = !event.dataItem.selected;
    for (let i = Math.min(last, current); i <= Math.max(last, current); i++) {
      newData[i].selected = select;
    }
    setState({
      ...state,
      [data]: newData.map((item) => {
        if (item.id === event.dataItem.id) {
          id.push(item.id);
          setSelectedID(id);
          // item[SELECTED_FIELD] = !item[SELECTED_FIELD];
        }
        return item;
      }),
      // [connectedData]: state[connectedData].map((item) => {
      //   item[SELECTED_FIELD] = false;
      //   return item;
      // }),
    });
  };

  const handleToolBarClick = async (e) => {
    let toolName = e.toolName || "";
    let result = processListBoxData(
      state.available,
      state.assigned,
      toolName,
      SELECTED_FIELD
    );

    let body = {
      posIds: Array.from(new Set(result.listBoxTwoData.map((item) => item.id))),
    };

    try {
      await apiHelper.postRequest(API_URLS.ASSIGN_DOC_PLACE_OF_SERVICE, body);
      setLoading(false);
    } catch (err) {
      renderErrors("Something went wrong");
      setLoading(false);
    }

    setState({
      ...state,
      available: result.listBoxOneData,
      assigned: result.listBoxTwoData.map((item) => ({
        ...item,
        id: item?.id || item?.id,
      })),
    });
  };

  const handleDragStart = (e) => {
    setState({ ...state, draggedItem: e.dataItem });
  };

  const handleDrop = (e) => {
    let result = processListBoxDragAndDrop(
      state.available,
      state.assigned,
      state.draggedItem,
      e.dataItem,
      "name"
    );
    setState({
      ...state,
      available: result.listBoxOneData,
      assigned: result.listBoxTwoData,
    });
  };

  const handleFilter = (e) => {
    setFilter(e.target.value);
  };

  return (
    <div>
      {loading === true && <Loader />}
      <div className="col-lg-4 col-md-6 mb-3">
        <div className="content-search-filter">
          <img src={searchIcon} alt="" className="search-icon" />
          <Input
            className="icon-searchinput"
            placeholder="Search Place of Services"
            onChange={handleFilter}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6 col-md-12 mb-3 mb-lg-0">
          <h6>Place of Services</h6>
          <ListBox
            className="k-reset-assign-up"
            style={{
              height: 400,
              width: "100%",
            }}
            data={filterBy(state.available, [
              { field: "name", operator: "contains", value: filter },
            ])}
            textField="name"
            selectedField={SELECTED_FIELD}
            onItemClick={(e) => handleItemClick(e, "available", "assigned")}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            toolbar={() => {
              return (
                <ListBoxToolbar
                  tools={[
                    "transferTo",
                    "transferFrom",
                    "transferAllTo",
                    "transferAllFrom",
                  ]}
                  data={state.available}
                  dataConnected={state.assigned}
                  onToolClick={handleToolBarClick}
                />
              );
            }}
          />
        </div>
        <div className="col-lg-6 col-md-12 mb-3 mb-lg-0">
          <h6>Assign to Clinic</h6>
          <ListBox
            style={{
              height: 400,
              width: "100%",
            }}
            data={state.assigned}
            textField="name"
            selectedField={SELECTED_FIELD}
            onItemClick={(e) => handleItemClick(e, "assigned", "available")}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
          />
        </div>
      </div>
    </div>
  );
};

export default AssignService;
