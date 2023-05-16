import React, { useState, useEffect } from "react";
import Sites from "./Sites";
import Loader from "../../../../src/control-components/loader/loader";
import DrawerContainer from "../../../control-components/custom-drawer/custom-drawer";
import StaffProfileHeader from "../../../../src/app-modules/staff/staff-profile/staff-profile-header";
import apiHelper from "../../../helper/api-helper";
import API_URLS from "../../../helper/api-urls";
import { useSelector } from "react-redux";
import { Encrption } from "../../encrption";
import { permissionEnum } from "../../../helper/permission-helper";
import { renderErrors } from "src/helper/error-message-helper";

const SitesHeader = () => {
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState([]);
  const [assigned, setAssigned] = useState([]);
  const selectedStaffId = useSelector((state) => state.selectedStaffId);
  const clinicId = useSelector((state) => state.loggedIn.clinicId);
  const userAccessPermission = useSelector(
    (state) => state.userAccessPermission
  );

  useEffect(() => {
    AvailableClient();
    AssignedClient();
  }, []);

  const AvailableClient = () => {
    setLoading(true);
    apiHelper
      .getRequest(API_URLS.GET_CLINIC_SITES + Encrption(clinicId))
      .then((result) => {
        const data = result.resultData.map((item) => {
          return {
            siteId: item.siteId,
            siteName: `${item.siteName} (${item.address}) `,
          };
        });
        if (userAccessPermission[permissionEnum.MANAGE_STAFF_SITES]) {
          setAvailable(data);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };
  const AssignedClient = () => {
    let staffSelected = Encrption(selectedStaffId);
    setLoading(true);
    apiHelper
      .getRequest(
        API_URLS.GET_STAFF_SITES + "/?staffId=" + staffSelected + "&active=" + 1
      )
      .then((result) => {
        const data = result.resultData.map((item) => {
          return {
            siteId: item.siteId,
            siteName: `${item.siteName}`,
          };
        });

        setAssigned(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  return (
    <div className="d-flex flex-wra">
      {loading === true && <Loader />}
      <div className="inner-dt col-md-3 col-lg-2">
        <DrawerContainer />
      </div>
      <div className="col-md-9 col-lg-10 ">
        <StaffProfileHeader />

        <div className="px-2 mt-4">
          <div className="row ">
            <Sites available={available} assigned={assigned} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SitesHeader;
