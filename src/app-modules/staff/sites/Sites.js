import React, { useEffect, useState } from "react";
import * as ReactDOM from "react-dom";
import apiHelper from "../../../helper/api-helper";
import API_URLS from "../../../helper/api-urls";
import { useSelector } from "react-redux";
import {
  ListBox,
  ListBoxToolbar,
  processListBoxData,
  processListBoxDragAndDrop,
} from "@progress/kendo-react-listbox";
import NotificationManager from "react-notifications";
import Loader from "../../../control-components/loader/loader";
import { permissionEnum } from "../../../helper/permission-helper";
import { renderErrors } from "src/helper/error-message-helper";

const SELECTED_FIELD = "selected";

const Sites = ({ available, assigned }) => {
  const lastSelectedIndex = React.useRef(0);
  const selectedStaffId = useSelector((state) => state.selectedStaffId);
  const [selectedID, setSelectedID] = useState([]);
  const [loading, setLoading] = useState(false);
  const [state, setState] = React.useState({
    available: [],
    assigned: [],
    draggedItem: {},
  });
  const userAccessPermission = useSelector(
    (state) => state.userAccessPermission
  );

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
              assigned.siteId === available.siteId ||
              assigned.siteId === available.siteId
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
      (dataItem) => dataItem.siteId === event.dataItem.siteId
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
        if (item.siteId === event.dataItem.siteId) {
          id.push(item.siteId);
          setSelectedID(id);
        }
        return item;
      }),
    });
  };

  const handleToolBarClick = async (e) => {
    setLoading(true);
    let toolName = e.toolName || "";
    let result = processListBoxData(
      state.available,
      state.assigned,
      toolName,
      SELECTED_FIELD
    );

    let body = {
      staffId: selectedStaffId,
      siteIds: Array.from(
        new Set(result.listBoxTwoData.map((item) => item.siteId))
      ),
    };

    try {
      await apiHelper.postRequest(API_URLS.POST_STAFF_SITES, body);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      renderErrors(error.Message);
    }

    setState({
      ...state,
      available: result.listBoxOneData,
      assigned: result.listBoxTwoData.map((item) => ({
        ...item,
        siteId: item?.siteId || item?.id,
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
      {loading && <Loader />}
      <div className="row justify-content-center">
        <h4 className="address-title text-grey pb_20">
          <span className="f-24">Sites</span>
        </h4>
        <div className="col k-pr-2">
          <h6>Available</h6>
          <ListBox
            className="k-reset-assign-up"
            style={{
              height: 400,
              width: "100%",
            }}
            data={state.available}
            textField="siteName"
            selectedField={SELECTED_FIELD}
            onItemClick={(e) => handleItemClick(e, "available", "assigned")}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            toolbar={() => {
              return (
                <>
                  {userAccessPermission[permissionEnum.MANAGE_STAFF_SITES] && (
                    <ListBoxToolbar
                      className="k-reset-assign-up"
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
                  )}
                </>
              );
            }}
          />
        </div>
        <div className="col-md-6 col k-pl-0">
          <h6>Assigned</h6>
          <ListBox
            style={{
              height: 400,
              width: "100%",
            }}
            data={state.assigned}
            textField="siteName"
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

export default Sites;
