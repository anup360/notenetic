import React, { useState, useEffect } from "react";
import AssignStaff from "./assign-staff";
import Loader from "../../../../control-components/loader/loader";
import CustomDrawer from "../../../../control-components/custom-drawer/custom-drawer";
import ClientHeader from "../../../client/client-profile/client-header/client-header";
import apiHelper from "../../../../helper/api-helper";
import API_URLS from "../../../../helper/api-urls";
import { useSelector } from "react-redux";
import { Encrption } from '../../../encrption';
import { permissionEnum } from "../../../../helper/permission-helper";
import { renderErrors } from "src/helper/error-message-helper";

const AssignStaffHeader = () => {
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState([]);
  const [assigned, setAssigned] = useState([]);
  const selectedClientId = useSelector(state => state.selectedClientId);
  const userAccessPermission = useSelector((state) => state.userAccessPermission);

  useEffect(() => {
    AvailableStaff();
    AssignedStaff();
  }, [selectedClientId]);

  const AvailableStaff = () => {
    setLoading(true);
    apiHelper
      .getRequest(API_URLS.GET_STAFF_DDL_BY_CLINIC_ID)
      .then((result) => {
        const data = result.resultData;
        let newStaff = [];
        if (data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            const element = {
              "staffId": data[i].id,
              "staffName": data[i].name,
            };
            newStaff.push(element);
          }
        }
        if ( userAccessPermission[permissionEnum.EDIT_CLIENT_PROFILE]) {

        setAvailable(newStaff);
        }
        setLoading(false);
      })
      .catch((error) => { });
  };
  const AssignedStaff = () => {
    setLoading(true);
    apiHelper
      .getRequest(
        API_URLS.GET_CLIENT_ASSIGNED_STAFF +
        "/?clientId=" +
        Encrption(selectedClientId) +
        "&active=" +
        1
      )
      .then((result) => {
        const data = result.resultData;
        setAssigned(data);
        setLoading(false);
      })
      .catch((error) => { });
  };

  return (
    <div className="d-flex flex-wra">
      {loading === true && <Loader />}
      <div className="inner-dt col-md-3 col-lg-2">
        <CustomDrawer />
      </div>
      <div className="col-md-9 col-lg-10 ">
        <ClientHeader />
        <div className="px-2 mt-4">
          <div className="row ">
            <AssignStaff available={available} assigned={assigned} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignStaffHeader;
