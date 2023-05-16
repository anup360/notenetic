import React, { useEffect, useRef, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { ALL_CLIENT_AVAILABLE } from "../../actions";
import Loader from "../../control-components/loader/loader";
import apiHelper from "../../helper/api-helper";
import API_URLS from "../../helper/api-urls";
import APP_ROUTES from "../../helper/app-routes";
import { Encrption } from "../encrption";
import { Switch } from "@progress/kendo-react-inputs";
import ClientNoSession from "./client-no-session";
import ClientBySites from "./clients-by-sites";
import ClientInsurance from "./clients-by-insurance";
import StaffNotLoggedIn from "./staff-not-loggedIn";
import StaffOnlineStatus from "./staff-online-status";
import AuthorizationUnits from "./authorization-units";
import ClientCaseload from "./client-flags-caseload";
import AuthExpirations from "./authorization-expiration";
import ReviewedDocuments from "./document-review-list";
import useModelScroll from "../../cutomHooks/model-dialouge-scroll";
import ClinicInfo from "./clinic-info";
import "hammerjs";
import CustomSkeleton from "../../control-components/skeleton/skeleton";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedStaffId = useSelector((state) => state.getStaffReducer.id);
  const activeStaffs = useSelector((state) => state.getStaffOnline);
  const [available, setAvailable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [signData, setSignData] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [isShowItems, setShowItems] = useState(false);
  const [modelScroll, setScroll] = useModelScroll();

  useEffect(() => {
    Available();
  }, []);

  const Available = () => {
    setLoading(true);
    apiHelper
      .getRequest(API_URLS.GET_CLINIC_DASHBOARD)
      .then((result) => {
        const data = result.resultData;
        dispatch({
          type: ALL_CLIENT_AVAILABLE,
          payload: result.resultData,
        });
        setAvailable(data);
        setLoading(false);
        setShowItems(true);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const handleSwitchMonth = (event) => {
    setSelectedItem(event);
  };

  return (
    <>
      {/* {loading && <Loader />} */}
      <div className="container-fluid">
        {/* <div className="top-border-dash">
          <div className="row">
            <div className="col-lg-12 justify-content-end d-flex">
              <div className="month-year-btn">
                <button onClick={() => handleSwitchMonth("Month")} type="btn" className={selectedItem == "Month" ? 'month-dash-btn active' : 'month-dash-btn'} >Month</button>
                <button onClick={() => handleSwitchMonth("Year")} type="btn" className={selectedItem == "Year" ? 'year-dash-btn  active' : 'year-dash-btn '} >Year</button>
                <Switch
                  onLabel={"Months"}
                  offLabel={"Year"}
                  className="switch-on"
                />
              </div>
            </div>
          </div>
        </div> */}
        <div className="graph-chart mt-3">
          <div className="row ">
            <div className="col-lg-4">
              <div
                onClick={() => navigate(APP_ROUTES.GET_STAFF)}
                className="doctor-text text-center cursor-pointer"
              >
                <p className="mb-0">Staff</p>
                {!isShowItems ? (
                  <CustomSkeleton shape="text" />
                ) : (
                  <span style={{ color: "#635BFF" }}>
                    {" "}
                    {available?.staffCount?.count}
                  </span>
                )}
              </div>
            </div>
            <div className="col-lg-4">
              <div
                onClick={() => navigate(APP_ROUTES.GET_CLIENT)}
                className="doctor-text text-center cursor-pointer"
              >
                <p className="mb-0">Clients</p>
                {!isShowItems ? (
                  <CustomSkeleton shape="text" />
                ) : (
                  <span style={{ color: "#4AB7FF" }}>
                    {" "}
                    {available?.clientCount?.count}
                  </span>
                )}
              </div>
            </div>
            <div className="col-lg-4">
              <div
                onClick={() => navigate(APP_ROUTES.GET_CLINIC_SITE)}
                className="doctor-text text-center cursor-pointer"
              >
                <p className="mb-0">Sites</p>
                {!isShowItems ? (
                  <CustomSkeleton shape="text" />
                ) : (
                  <span style={{ color: "#82C43C" }}>
                    {" "}
                    {available?.siteCount?.count}
                  </span>
                )}
              </div>
            </div>
          </div>
          {/* bar chart */}
          <div className="row">
            <div className="col-md-4">
              <ClientNoSession />
            </div>

            <div className="col-md-4">
              <StaffNotLoggedIn />
            </div>
            <div className="col-md-4">
              <AuthorizationUnits />
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <ClientInsurance />
            </div>
            <div className="col-md-4">

              <StaffOnlineStatus activeStaffs={activeStaffs} />

            </div>
            <div className="col-md-4">
              <AuthExpirations />
            </div>

          </div>

          <div className="row">
            <div className="col-md-6">
              <ReviewedDocuments />
            </div>
            <div className="col-md-6">
              <ClientCaseload />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <ClientBySites />
            </div>
            <div className="col-md-4">
              <ClinicInfo />
            </div>
          </div>
          <div className="row">
          </div>

          {/* <div className="row mt-3">
            <div className="col-lg-12">
              <div className="bar-chat-main">
                <Chart style={{
                  height: 350,
                }}>
                  <ChartTooltip />
                  <ChartTitle text="Client Sites" />
                  <ChartSeries>
                    <ChartSeriesItem
                      data={clientSites}
                      type="column"
                      field="totCount"
                      categoryField="siteName"
                      style="smooth"
                      color="green"
                    />
                  </ChartSeries>
                </Chart>
              </div>
            </div>
          </div> */}
        </div>
        {/* expenses chart */}
        {/* <div className="row mt-3">
          <div className="col-lg-6">
            <div className="expenses-chart">
              <Chart style={{
                height: 350
              }}>
                <ChartLegend position="top" orientation="horizontal" />
                <ChartCategoryAxis>
                  <ChartCategoryAxisItem categories={categories} startAngle={45} />
                </ChartCategoryAxis>
                <ChartSeries>
                  {series.map((item, idx) => <ChartSeriesItem key={idx} type="line" tooltip={{
                    visible: true
                  }} data={item.data} name={item.name} />)}
                </ChartSeries>
              </Chart>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="used-detail-cus">
              <Chart style={{
                height: 350
              }}>
                <ChartSeriesDefaults type="bar" labels={{
                  format: 'c'
                }} />
                <ChartCategoryAxis>
                  <ChartCategoryAxisItem categories={categoriesBar} />
                </ChartCategoryAxis>
                <ChartSeries>
                  <ChartSeriesItem data={salesData} />
                </ChartSeries>
              </Chart>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
}
export default Dashboard;
