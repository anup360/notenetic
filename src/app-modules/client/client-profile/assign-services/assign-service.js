import React, { useEffect, useState } from "react";
import apiHelper from "../../../../helper/api-helper";
import API_URLS from "../../../../helper/api-urls";
import { useSelector } from "react-redux";
import Loader from "../../../../control-components/loader/loader";
import NotificationManager from "react-notifications";
import { renderErrors } from "src/helper/error-message-helper";

import {
  ListBox,
  ListBoxToolbar,
  processListBoxData,
  processListBoxDragAndDrop,
} from "@progress/kendo-react-listbox";
import searchIcon from "../../../../assets/images/search.png";
import { Input } from "@progress/kendo-react-inputs";
import { filterBy } from "@progress/kendo-data-query";
import { permissionEnum } from "../../../../helper/permission-helper";

const SELECTED_FIELD = "selected";

const AssignService = ({ available, assigned }) => {
  const lastSelectedIndex = React.useRef(0);
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const [loading, setLoading] = useState(false);
  const [selectedID, setSelectedID] = useState([]);
  const [toolname, setToolname] = useState("");
  const [state, setState] = React.useState({
    available: [],
    assigned: [],
    draggedItem: {},
  });
  const userAccessPermission = useSelector((state) => state.userAccessPermission);


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
              assigned.id === available.id ||
              assigned.serviceId === available.serviceId
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
      (dataItem) => dataItem.serviceId === event.dataItem.serviceId
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
        if (item.serviceId === event.dataItem.serviceId) {
          id.push(item.serviceId);
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
      clientId: selectedClientId,
      serviceIds: Array.from(
        new Set(result.listBoxTwoData.map((item) => item.serviceId))
      ),
    };

    try {
      await apiHelper.postRequest(API_URLS.ASSIGN_SERVICES_TO_CLIENT, body);
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
        serviceId: item?.serviceId || item?.id,
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
    <div className="container">
      {loading === true && <Loader />}
      <h4 className="address-title text-grey pb_20">
        <span className="f-24">Client Services</span>
      </h4>
      <div className="col-lg-4 col-md-6 mb-3">
        <div className="content-search-filter">
          <img src={searchIcon} alt="" className="search-icon" />
          <Input
            className="icon-searchinput"
            placeholder="Search Availabe Services"
            onChange={handleFilter}
          />
        </div>
      </div>
      <div className="d-flex flex-wrap">
        <div className="col k-pr-2">
          <h6>Available Services</h6>
          <ListBox
            className="k-reset-assign-up"
            style={{
              height: 400,
              width: "100%",
            }}
            data={filterBy(state.available, [
              { field: "fullName", operator: "contains", value: filter },
            ])}
            textField="fullName"
            selectedField={SELECTED_FIELD}
            onItemClick={(e) => handleItemClick(e, "available", "assigned")}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            toolbar={() => {
              return (
                <>
                {userAccessPermission[permissionEnum.MANAGE_CLIENT_SERVICES] &&
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
                />}
                </>
              );
            }}
          />
        </div>
        <div className="col k-pl-0">
          <h6>Assigned Services</h6>
          <ListBox
            style={{
              height: 400,
              width: "100%",
            }}
            data={state.assigned}
            textField="fullName"
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
