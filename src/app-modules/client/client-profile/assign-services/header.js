import React, { useState, useEffect } from "react";
import AssignService from "./assign-service";
import Loader from "../../../../control-components/loader/loader";
import CustomDrawer from "../../../../control-components/custom-drawer/custom-drawer";
import ClientHeader from "../../../client/client-profile/client-header/client-header";
import apiHelper from "../../../../helper/api-helper";
import API_URLS from "../../../../helper/api-urls";
import { useSelector } from "react-redux";
import { Encrption } from '../../../encrption';
import { NotificationManager } from "react-notifications";
import { permissionEnum } from "../../../../helper/permission-helper";
import { renderErrors } from "src/helper/error-message-helper";


const AssignServiceHeader = () => {
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState([]);
  const [assigned, setAssigned] = useState([]);
  const selectedClientId = useSelector(state => state.selectedClientId);
  const clinicId = useSelector((state) => state.loggedIn.clinicId);
  const userAccessPermission = useSelector((state) => state.userAccessPermission);

  useEffect(() => {
    AvailableServices();
    AssignedServices();
  }, [selectedClientId]);

  const AvailableServices = () => {
    setLoading(true);
    apiHelper.getRequest(
      API_URLS.GET_Services_BY_PROVIDER_ID + Encrption(clinicId) + "&isActive=" + true, "")
      .then((result) => {
        const data = result.resultData;
        let newServices = [];
        if (data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            const element = {
              "serviceId": data[i].id,
              "fullName": data[i].fullName,
            };
            newServices.push(element);
          }
        }
        if ( userAccessPermission[permissionEnum.MANAGE_CLIENT_SERVICES]) {

        setAvailable(newServices);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors("Something went wrong");
      });
  };
  const AssignedServices = () => {
    setLoading(true);
    apiHelper.getRequest(API_URLS.GET_CLIENT_ASSIGNED_SERVICES + "/?clientId=" + Encrption(selectedClientId) + "&active=" + 1)
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
            <AssignService available={available} assigned={assigned} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignServiceHeader;
