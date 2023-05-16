/**
 * App.js Layout Start Here
 */
import React, { useEffect, useState } from "react";
import apiHelper from "../../helper/api-helper";
import API_URLS from "../../helper/api-urls";
import ListViewDashboard from "../../control-components/list-view-dashboard/list-view-dashboard";
import {
  ListView,
  ListViewHeader,
  ListViewFooter,
} from "@progress/kendo-react-listview";
import { Avatar } from "@progress/kendo-react-layout";
import DummyImage from "../../assets/images/dummy-img.png";

const StaffOnlineStatus = ({ activeStaffs }) => {

  // States
  const [loading, setLoading] = useState(false);



  /* ============================= private functions ============================= */

  const MyItemRender = (props) => {
    let item = props.dataItem;
    return (
      <div
        className="k-listview-item row p-2 border-bottom align-middle"
        style={{
          margin: 0,
        }}
      >
        <div className="col-2">
          <img
            src={!item?.profileImage ? DummyImage : item?.profileImage}
            className="user-top"
          />
        </div>
        <div className="col-6">
          <h2
            style={{
              fontSize: 14,
              color: "#454545",
              marginBottom: 0,
            }}
            // className="text-uppercase"
          >
            {item.staffName}
          </h2>
          <div
            style={{
              fontSize: 12,
              color: "#a0a0a0",
            }}
          >
            {item.status}
          </div>
        </div>
        <div className="col-4 text-end">
          {item.status == "online" ? (
            <i
              className="fa fa-circle"
              aria-hidden="true"
              style={{ color: "green", fontSize: "11px" }}
            ></i>
          ) : (
            <i
              className="fa fa-circle"
              aria-hidden="true"
              style={{ color: "#e9a01ae3", fontSize: "11px" }}
            ></i>
          )}
        </div>
      </div>
    );
  };

  const MyHeader = () => {
    return (
      <ListViewHeader
        style={{
          color: "rgb(160, 160, 160)",
          fontSize: 14,
        }}
        className="pl-3 pb-2 pt-2"
      >
        Logged in Staff
      </ListViewHeader>
    );
  };

  return (
    <div className="dash-listing-cus dash-filter-grid my-3">
      {
        activeStaffs.length > 0 &&
        <ListView
        data={activeStaffs}
        item={MyItemRender}
        style={{
          width: "100%",
        }}
        header={MyHeader}
      />
      }
     
    </div>
  );
};

export default StaffOnlineStatus;
