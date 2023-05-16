import React, { useEffect, useState } from "react";
import Loader from "../../../control-components/loader/loader";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import moment from "moment";

import {
  ListView,
  ListViewHeader,
  ListViewFooter,
} from "@progress/kendo-react-listview";

const Plans = ({ data }) => {


  const [loading, setLoading] = useState(false);
  const clinicId = useSelector((state) => state.loggedIn.clinicId);
  const navigate = useNavigate();

  const MyHeader = () => {
    return (
      <ListViewHeader
        style={{
          color: "#000000",
          fontSize: 20,
        }}
        className="px-3 py-2 "
      >
        <div className="d-flex justify-content-between mb-3">

        </div>
        <div className="row py-2 border-bottom align-middle eligibility_cus">
          <div className="col-2 ">
            <h2 className="elig_text">
              Status
            </h2>
          </div>
          <div className="col-2 ">
            <h2 className="elig_text">
              Plan Name
            </h2>
          </div>
          <div className="col-2">
            <h2 className="elig_text">
             Policy Eff. Date
            </h2>
          </div>
          <div className="col-2">
            <h2 className="elig_text">
              Policy Exp. Date
            </h2>
          </div>

          <div className="col-2">
            <h2 className="elig_text">
              Coverage Start Date
            </h2>
          </div>

          <div className="col-2">
            <h2 className="elig_text">
              Coverage End Date
            </h2>
          </div>


        </div>
      </ListViewHeader>
    );
  };


  const MyItemRender = (props) => {
    let item = props.dataItem;


    return (
      <div className="row border-bottom mx-0">
        <div className="col-md-2">
          <div

          >
            {item.status}
          </div>
        </div>
        <div className="col-md-2">

          {item?.planName ? item.planName : ""}

        </div>
        <div className="col-md-2">
          {
            item?.policyEffectiveDate ? moment(item.policyEffectiveDate).format('M/D/YYYY') : ""
          }
        </div>

        <div className="col-md-2">
          {
            item?.policyExpirationDate ? moment(item.policyExpirationDate).format('M/D/YYYY') : ""
          }
        </div>

        <div className="col-md-2">
          {
            item?.coverageStartDate ? moment(item.coverageStartDate).format('M/D/YYYY') : ""
          }
        </div>
        <div className="col-md-2">
          {
            item?.coverageEndDate ? moment(item.coverageEndDate).format('M/D/YYYY') : ""
          }
        </div>


      </div>


    );
  };



  return (
    <div className="grid-table filter-grid dash-filter-grid my-3 elig_main_table">

            <h5 className="plans_text">Plans</h5>
            <ListView
                data={data}
                item={MyItemRender}
                style={{
                    width: "100%",
                 
                }}
                header={MyHeader}

            />

        </div>
  );
};
export default Plans;
