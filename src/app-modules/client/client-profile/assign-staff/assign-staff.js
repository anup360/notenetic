import React, { useEffect, useState } from "react";
import apiHelper from "../../../../helper/api-helper";
import API_URLS from "../../../../helper/api-urls";
import { useSelector } from "react-redux";
import Loader from "../../../../control-components/loader/loader";
import NotificationManager from "react-notifications";
import {
  ListBox,
  ListBoxToolbar,
  processListBoxData,
  processListBoxDragAndDrop,
} from "@progress/kendo-react-listbox";
import { permissionEnum } from "../../../../helper/permission-helper";
import { renderErrors } from "src/helper/error-message-helper";

const SELECTED_FIELD = "selected";

const AssignStaff = ({ available, assigned }) => {
  const lastSelectedIndex = React.useRef(0);
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const [loading, setLoading] = useState(false);
  const [selectedID, setSelectedID] = useState([]);
  const userAccessPermission = useSelector((state) => state.userAccessPermission);
  const [state, setState] = React.useState({
    available: [],
    assigned: [],
    draggedItem: {},
  });

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
              assigned.staffId === available.staffId
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
      (dataItem) => dataItem.staffId === event.dataItem.staffId
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
        if (item.staffId === event.dataItem.staffId) {
          id.push(item.staffId);
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
      staffIds: Array.from(
        new Set(result.listBoxTwoData.map((item) => item.staffId))
      ),
    };
    try {
      await apiHelper.postRequest(API_URLS.ASSIGN_STAFF_TO_CLIENT, body);
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
        staffId: item?.staffId || item?.id,
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

  return (
    <div className="container">
      {loading === true && <Loader />}
      <div className="row justify-content-center">
        <h4 className="address-title text-grey pb_20">
          <span className="f-24">Clients Staff</span>
        </h4>
        <div className="col k-pr-2">
          <h6>Available Staff</h6>
          <ListBox
            className="k-reset-assign-up"
            style={{
              height: 400,
              width: "100%",
            }}
            data={state.available}
            textField="staffName"
            selectedField={SELECTED_FIELD}
            onItemClick={(e) => handleItemClick(e, "available", "assigned")}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            toolbar={() => {
              return (
                <>
                  {userAccessPermission[permissionEnum.EDIT_CLIENT_PROFILE] &&

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
                  }
                </>
              );
            }}
          />
        </div>
        <div className="col k-pl-0">
          <h6>Assigned Staff</h6>
          <ListBox
            style={{
              height: 400,
              width: "100%",
            }}
            data={state.assigned}
            textField="staffName"
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

export default AssignStaff;
