import * as React from "react";
import * as ReactDOM from "react-dom";
import { useState,useEffect } from "react";
import moment from "moment";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { DragAndDrop } from "@progress/kendo-react-common";
import { NotificationManager } from "react-notifications";
import ApiHelper from "../../../../helper/api-helper";
import ApiUrls from "../../../../helper/api-urls";
import { Encrption } from "../../../encrption";
import { useSelector } from "react-redux";
import { Tooltip } from "@progress/kendo-react-tooltip";
import Loader from "../../../../control-components/loader/loader";
import CustomDrawer from "../../../../control-components/custom-drawer/custom-drawer";
import ClientHeader from "../client-header/client-header";
import AddDiagnosis from "./add-diagnosis";
import addIcon from "../../../../assets/images/add.png";
import DeleteDialogModal from "../../../../control-components/custom-delete-dialog-box/delete-dialog";
import { permissionEnum } from "../../../../helper/permission-helper";
import { renderErrors } from "src/helper/error-message-helper";

export const ReorderContext = React.createContext({
  reorder: () => {},
  dragStart: () => {},
  data:[]
});


const DragCell = (props) => {  
  const currentContext=React.useContext(ReorderContext)
  
  
  const UpdateClientDiagnosis = () => {
    let data = currentContext.data.map((item,index)=>{
      return{
        id:item.id,
        rankNumber:index
      }
    })
    ApiHelper.putRequest(ApiUrls.REORDER_CLIENT_DIAGNOSIS, data)
      .then((result) => {
        NotificationManager.success("Diagnosis updated successfully");
      })
      .catch((error) => {
        renderErrors(error.message);
      });
  };

  

  return (
    <td
      onDragOver={(e) => {
        currentContext.reorder(props.dataItem);
        e.preventDefault();
        e.dataTransfer.dropEffect ="copy";
      }}
    >
      <span
        className="k-icon k-i-reorder"
        draggable={true}
        style={{
          cursor: "move",
        }}
        onDragStart={(e) => {
          currentContext.dragStart(props.dataItem);
          e.dataTransfer.setData("dragging", "");
        }}
        onDragEnd={()=>{
          UpdateClientDiagnosis()
        }
          
        }
      />
    </td>
  );
};

const Diagnosis = () => {
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const [loading, setLoading] = useState(false);
  const [gridData, setGridData] = React.useState();
  const [activeItem, setActiveItem] = React.useState(null);
  const [addDiagnosis, setAddDiagnosis] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [deleteDiagnosis, setDeleteDiagnosis] = useState("");
  const userAccessPermission = useSelector((state) => state.userAccessPermission);

  const reorder = (dataItem, direction) => {
    if (activeItem === dataItem) {
      return;
    }
    let reorderedData = gridData.slice();
    let prevIndex = reorderedData.findIndex((p) => p === activeItem);
    let nextIndex = reorderedData.findIndex((p) => p === dataItem);
    reorderedData.splice(prevIndex, 1);
    reorderedData.splice(
      Math.max(nextIndex + (direction === "before" ? -1 : 0), 0),
      0,
      activeItem || reorderedData[0]
    );
    setGridData(reorderedData);
  };

  const dragStart = (dataItem) => {
    setActiveItem(dataItem);
  };

  const listDiagnosis = () => {
    setLoading(true);
    ApiHelper.getRequest(
      ApiUrls.GET_CLIENT_DIAGNOSIS +
        Encrption(selectedClientId) +
        "&active=" +
        true
    )
      .then((result) => {
        const data = result.resultData;
        setGridData(data);
        setLoading(false);
      })
      .catch((error) => {});
  };

  const handleDelete = (deleteDiagnosis) => {
    ApiHelper.deleteRequest(
      ApiUrls.DELETE_CLIENT_DIAGNOSIS + Encrption(deleteDiagnosis)
    )
      .then((result) => {
        NotificationManager.success("Diagnosis deleted successfully");
        listDiagnosis();
        hideConfirmPopup();
      })
      .catch((error) => {
        renderErrors(error.message);
        hideConfirmPopup();
      });
  };

  useEffect(() => {
    listDiagnosis();
  }, [selectedClientId]);

  const handleAddService = () => {
    setAddDiagnosis(true);
  };

  const handleEditClose = () => {
    setAddDiagnosis(false);
  };

  const handleConfirm = (ID) => {
    setConfirm(true);
    setDeleteDiagnosis(ID);
  };
  const hideConfirmPopup = () => {
    setConfirm(false);
    setDeleteDiagnosis("");
  };

  return (
    <div className="d-flex flex-wrap">
    {loading === true && <Loader />}
    <div className="inner-dt col-md-3 col-lg-2">
      <CustomDrawer />
    </div>
    <div className="col-md-9 col-lg-10 ">
      <ClientHeader />
      <div className="d-flex justify-content-between mb-3 mt-3">
          <h4 className="address-title text-grey ">
            <span className="f-24">Diagnosis</span>
          </h4>
          {userAccessPermission[permissionEnum.EDIT_CLIENT_PROFILE] &&

          <button
            onClick={handleAddService}
            className="btn blue-primary text-white text-decoration-none d-flex align-items-center "
          >
            <img src={addIcon} alt="" className="me-2 add-img" />
            Add Diagnosis{" "}
          </button>
}
        </div>
    <ReorderContext.Provider
      value={{
        reorder: reorder,
        dragStart: dragStart,
        data:gridData
      }}
      
      
      className="mb-4"
    >
      <DragAndDrop>
        <Grid 
          data={gridData}
          dataItemKey={"ids"}
        >
          <Column title="" width="80px" cell={DragCell} />
          <Column field="icd10" title="Dx Code" width="100px" />
          <Column field="diagnoseName" title="Diagnosis" />
          <Column
          title="Diagnosis Date"
          cell={(props) => {
            let field = moment(props.dataItem.dateDiagnose).format("M/D/YYYY");
            return (
              <td className="cursor-default">
                {field}
              </td>
            );
          }}
        />
                    {userAccessPermission[permissionEnum.EDIT_CLIENT_PROFILE] &&

        <Column
          title="Action"
          filterable={false}
          className="cursor-default"
          cell={(props) => {
            let field = props.dataItem.id;
            return (
              <td>
                <div
                  onClick={() => handleConfirm(field)}
                >
                  <div className="k-chip-content">
                    <Tooltip anchorElement="target" position="top">
                      <i
                        className="fa fa-trash"
                        aria-hidden="true"
                        title="Delete"
                      ></i>
                    </Tooltip>
                  </div>
                </div>
              </td>
            );
          }}
        />
}
        </Grid>
      </DragAndDrop>
      {addDiagnosis && (
        <AddDiagnosis onClose={handleEditClose} listDiagnosis={listDiagnosis} />
      )}
       {confirm ? (
        <DeleteDialogModal
          title="Diagnosis"
          message="Diagnosis"
          onClose={hideConfirmPopup}
          handleDelete={() => {
            handleDelete(deleteDiagnosis);
          }}
        />
      ) : (
        ""
      )}
    </ReorderContext.Provider>
    </div>
    </div>
  );
};
 export default Diagnosis;