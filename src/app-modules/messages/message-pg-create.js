import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import {
  ListBox,
  ListBoxToolbar,
  processListBoxData,
  processListBoxDragAndDrop,
} from "@progress/kendo-react-listbox";
import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import apiHelper from "../../helper/api-helper";
import API_URLS from "../../helper/api-urls";
import NOTIFICATION_MESSAGE from "../../helper/notification-messages";
import { showError } from "../../util/utility";
import useModelScroll from "../../cutomHooks/model-dialouge-scroll";

function MessagePGCreateView({ visible, onDismiss, editPGData, orgStaffList }) {
  const [pgName, setPgName] = useState("");
  const [modelScroll, setScroll] = useModelScroll();

  const [state, setState] = React.useState({
    staffList: [],
    pgStaffList: [],
    draggedItem: {},
  });
  if (state.staffList.length == 0 && state.pgStaffList.length == 0) {
    setState({ ...state, staffList: getStaffList() });
  }

  const SELECTED_FIELD = "selected";

  /* ============================= private functions ============================= */

  function getStaffList() {
    return !orgStaffList
      ? []
      : orgStaffList.map((x) => {
          return { selected: false, ...x };
        });
  }

  async function addPersonalGroup() {
    if (pgName.length < 1) {
      showError("Name can't be empty!");
      return;
    }
    if (state.pgStaffList.length < 1) {
      showError("Please select at least 1 Staff!");
      return;
    }
    try {
      let body = {
        groupName: pgName,
        toStaffIds: state.pgStaffList.map((x) => x.id),
      };
      if (editPGData != undefined) {
        await apiHelper.putRequest(API_URLS.UPDATE_PERSONAL_GROUP, {
          id: editPGData.id,
          ...body,
        });
      } else {
        await apiHelper.postRequest(API_URLS.CREATE_PERSONAL_GROUP, body);
      }
      NotificationManager.success(NOTIFICATION_MESSAGE.SUCCESS);
      onClose();
      clearData();
    } catch (err) {
      showError(err, "Add Personal Group");
    }
  }

  function clearData() {
    setPgName("");
    setState({
      staffList: [],
      pgStaffList: [],
      draggedItem: {},
    });
  }

  function fillName() {
    let name = "";
    if (editPGData) {
      name = editPGData.name;
    }
    setPgName(name);
  }

  async function fillPGData() {
    let pgStaffList = [];
    if (editPGData) {
      try {
        const result = await apiHelper.postRequest(
          API_URLS.GET_STAFF_BY_PG_IDS,
          {
            groupIds: [editPGData.id],
          }
        );
        pgStaffList = result.resultData.map((x) => {
          return { selected: false, id: x.id, name: x.staffName };
        });
      } catch (err) {
        showError(err, "Get Staff List for " + editPGData.name);
      }
    }
    setState({
      staffList: getStaffList().filter(
        (staff) =>
          pgStaffList.find((pgStaff) => pgStaff.id == staff.id) == undefined
      ),
      pgStaffList: pgStaffList,
      draggedItem: {},
    });
  }

  /* ============================= useEffects ============================= */

  useEffect(() => {
    fillName();
  }, [editPGData]);

  useEffect(() => {
    fillPGData();
  }, [orgStaffList, editPGData]);

  /* ============================= onChange events ============================= */

  function onClose() {
    clearData();
    onDismiss();
  }

  function onPgNameChange(e) {
    setPgName(e.target.value);
  }

  function onCreate(e) {
    e.preventDefault();
    addPersonalGroup();
  }

  const handleItemClick = (event, data, connectedData) => {
    setState({
      ...state,
      [data]: state[data].map((item) => {
        if (item.id === event.dataItem.id) {
          item[SELECTED_FIELD] = !item[SELECTED_FIELD];
        } else if (!event.nativeEvent.ctrlKey) {
          item[SELECTED_FIELD] = false;
        }

        return item;
      }),
      [connectedData]: state[connectedData].map((item) => {
        item[SELECTED_FIELD] = false;
        return item;
      }),
    });
  };

  const handleToolBarClick = (e) => {
    let toolName = e.toolName || "";
    let result = processListBoxData(
      state.staffList,
      state.pgStaffList,
      toolName,
      SELECTED_FIELD
    );
    setState({
      ...state,
      staffList: result.listBoxOneData,
      pgStaffList: result.listBoxTwoData,
    });
  };

  const handleDragStart = (e) => {
    setState({ ...state, draggedItem: e.dataItem });
  };

  const handleDrop = (e) => {
    let result = processListBoxDragAndDrop(
      state.staffList,
      state.pgStaffList,
      state.draggedItem,
      e.dataItem,
      "name"
    );
    setState({
      ...state,
      staffList: result.listBoxOneData,
      pgStaffList: result.listBoxTwoData,
    });
  };

  return (
    <div>
      {visible && (
        <Dialog title={"Personal Group"} onClose={onClose} minWidth={800}>
          <input
            type="text"
            className="form-control"
            placeholder="Personal Group Name"
            value={pgName}
            onChange={onPgNameChange}
          />
          <br />
          <div className="container">
            <div className="row justify-content-center">
              <div className="col k-pr-2">
                <h6>Staff</h6>
                <ListBox
                  style={{
                    height: 400,
                    width: "100%",
                  }}
                  data={state.staffList}
                  textField="name"
                  selectedField={SELECTED_FIELD}
                  onItemClick={(e) =>
                    handleItemClick(e, "staffList", "pgStaffList")
                  }
                  onDragStart={handleDragStart}
                  onDrop={handleDrop}
                  toolbar={() => {
                    return (
                      <ListBoxToolbar
                        tools={[
                          "moveUp",
                          "moveDown",
                          "transferTo",
                          "transferFrom",
                          "transferAllTo",
                          "transferAllFrom",
                          "remove",
                        ]}
                        data={state.staffList}
                        dataConnected={state.pgStaffList}
                        onToolClick={handleToolBarClick}
                      />
                    );
                  }}
                />
              </div>
              <div className="col k-pl-0">
                <h6>Selected Staff for "{pgName}"</h6>
                <ListBox
                  style={{
                    height: 400,
                    width: "100%",
                  }}
                  data={state.pgStaffList}
                  textField="name"
                  selectedField={SELECTED_FIELD}
                  onItemClick={(e) =>
                    handleItemClick(e, "pgStaffList", "staffList")
                  }
                  onDragStart={handleDragStart}
                  onDrop={handleDrop}
                />
              </div>
            </div>
          </div>

          <DialogActionsBar>
            <button
              className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
              onClick={onCreate}
            >
              {editPGData ? "Update" : "Create"}
            </button>
            <button
              className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
              onClick={onClose}
            >
              Cancel
            </button>
          </DialogActionsBar>
        </Dialog>
      )}
    </div>
  );
}

export default MessagePGCreateView;
