import { process } from "@progress/kendo-data-query";
import { Dialog } from "@progress/kendo-react-dialogs";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import React, { useEffect, useState } from "react";
import useModelScroll from "../../cutomHooks/model-dialouge-scroll";

function MessagePGListView({
  visible,
  onClose,
  personalGroupList,
  onAdd,
  deletePG,
  editPG,
}) {
  const [pgData, setPgData] = useState([]);
  const [dataState, setDataState] = useState({ take: 5, skip: 0 });
  const [modelScroll, setScroll] = useModelScroll();

  /* ============================= private functions ============================= */

  /* ============================= useEffects ============================= */

  useEffect(() => {
    setPgData(
      personalGroupList.map((pg) => {
        return {
          id: pg.id,
          name: pg.name,
          totalStaff: pg.totStaff,
        };
      })
    );
  }, [personalGroupList]);

  /* ============================= onChange events ============================= */

  function onDelete(e, dataItem) {
    e.preventDefault();
    deletePG(dataItem.id);
  }

  function onEdit(e, dataItem) {
    e.preventDefault();
    editPG(dataItem);
  }

  /* ============================= UI ============================= */

  function renderActions(props) {
    return (
      <div className="d-flex align-items-center">
        <button
          type="button"
          className="bg-transparent border-0 m-1"
          data-toggle="tooltip"
          title="Delete Group"
          onClick={(e) => onDelete(e, props.dataItem)}
        >
          <i className="fa fa-trash"></i>
        </button>
        <button
          type="button"
          className="bg-transparent border-0"
          data-toggle="tooltip"
          title="Edit Group"
          onClick={(e) => onEdit(e, props.dataItem)}
        >
          <i className="fa fa-edit"></i>
        </button>
      </div>
    );
  }

  return (
    <div>
      {visible && (
        <Dialog
          title={"My Groups"}
          onClose={onClose}
          className="k-dialog-wrapper dialog-modal"
        >
          <input
            type="button"
            className="btn blue-primary-outline btn-sm mb-3"
            value="+ Add New Group"
            onClick={onAdd}
          />

          <Grid
            pageable={true}
            {...dataState}
            data={process(pgData, dataState)}
            total={pgData.length}
            onDataStateChange={(e) => setDataState(e.dataState)}
          >
            <GridColumn
              field="name"
              title="Group Name"
              className="cursor-default"
            />
            <GridColumn
              field="totalStaff"
              title="Total Staff"
              className="cursor-default"
            />
            <GridColumn title="Actions" cell={renderActions} />
          </Grid>
        </Dialog>
      )}
    </div>
  );
}

export default MessagePGListView;
