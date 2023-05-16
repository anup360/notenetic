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
import { SettingsService } from "../../services/settingsService";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { GET_CLINIC_DETAILS_BY_ID } from "../../actions";
import { NotificationManager } from "react-notifications";
import { MaskFormatted } from "../../helper/mask-helper";
import { renderErrors } from "src/helper/error-message-helper";

const ClinicInfo = ({ activeStaffs }) => {
  const clinicId = useSelector((state) => state.loggedIn.clinicId);
  const [clinicDetails, setClinicDetails] = useState({});
  const dispatch = useDispatch();
  const [profilePic, setProfilePic] = React.useState("");

  // States
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getClinicDetails();
    getLogo();
  }, []);

  const getLogo = async () => {
    setLoading(true);
    await SettingsService.getClinicLogo(clinicId, false)
      .then((result) => {
        setLoading(false);
        if (result.resultData !== null) {
          setProfilePic(result?.resultData?.clinicLogo);
        }
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const getClinicDetails = async () => {
    setLoading(true);
    await SettingsService.getClinicDetails(clinicId)
      .then((result) => {
        setLoading(false);
        if (result.resultData !== null) {
          setClinicDetails(result?.resultData);
          dispatch({
            type: GET_CLINIC_DETAILS_BY_ID,
            payload: result?.resultData,
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  let Phone = MaskFormatted(
    clinicDetails ? clinicDetails.phone : "",
    "(999) 999-9999"
  );

  /* ============================= private functions ============================= */

  const MyItemRender = () => {
    return (
      <div
        className="k-listview-item  p-2 border-bottom align-middle"
        style={{
          margin: 0,
        }}
      >
        <div className="col-2">
          <img
            src={!profilePic ? DummyImage : profilePic}
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
            {clinicDetails?.clinicName} <br></br>
            {clinicDetails?.address}
            <br></br>
            {clinicDetails?.city}, {clinicDetails?.state} - {clinicDetails?.zip}
            <br></br>
            {Phone}
          </h2>
          <div
            style={{
              fontSize: 12,
              color: "#a0a0a0",
            }}
          ></div>
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
        Clinic Info
      </ListViewHeader>
    );
  };

  return (
    <div className="dash-listing-cus dash-filter-grid my-3">
      <MyHeader />
      <MyItemRender />
    </div>
  );
};

export default ClinicInfo;
