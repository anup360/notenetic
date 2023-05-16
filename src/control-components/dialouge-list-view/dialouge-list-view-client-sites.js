import React from 'react';
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { forwardRef, useRef, useImperativeHandle } from "react"
import {
  ListView,
  ListViewHeader,
  ListViewFooter,
} from "@progress/kendo-react-listview";
import moment from 'moment';
import {
  GET_CLIENT_PROFILE_IMG_BYTES, SELECTED_CLIENT_ID, SELECTED_STAFF_ID
} from "../../actions";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import APP_ROUTES from "../../helper/app-routes";

const DialougueClientSites = forwardRef(({
  onClose,
  data,
  label,
  setScroll

}, ref) => {


  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleClientView(e, field) {
    dispatch({
      type: SELECTED_CLIENT_ID,
      payload: field?.clientId,
    });
    setScroll(false)
    navigate(APP_ROUTES.CLIENT_DASHBOARD);
  }




  const MyItemRender = (props) => {
    let item = props.dataItem;
    return (
      <div
        className="row p-2 naming-list border-bottom align-middle mt-20"
        style={{
          margin: 0,
          textAlign: "center",
        }}
      >
        <div onClick={(e) => handleClientView(e, item)} className={"col-3  cursor-pointer text-theme"}>{item.lName + ", " + item.fName}</div>

        <div className={"col-3"}>{item.siteName}</div>

      </div>
    );
  };

  const MyHeader = () => {
    return (
      <ListViewHeader
        style={{
          color: "#000000",
          fontSize: 20,
        }}
        className="pl-3 pb-2 pt-2"
      >

        <div className="row py-2 border-bottom align-middle mt-20" style={{
          textAlign: "center",
        }}>
          <div className="col-3">
            <h2
              style={{
                fontSize: 15,
                color: "#000000",
                marginBottom: 0,
              }}
              className=""
            >
              Client
            </h2>
          </div>
         
          <div className="col-3">
            <h2
              style={{
                fontSize: 15,
                color: "#000000",
                marginBottom: 0,
              }}
              className=""
            >
              Site 
            </h2>
          </div>
        </div>
      </ListViewHeader>
    );
  };


  return (
    <Dialog onClose={onClose} title={label} className="k-dialog-wrapper dialog-modal clients-modal-dash">

      <DialogActionsBar>
        <ListView
          data={data}
          item={MyItemRender}
          style={{
            width: "100%",
          }}
          header={MyHeader}

        />
      </DialogActionsBar>
    </Dialog>
  )
})

export default DialougueClientSites