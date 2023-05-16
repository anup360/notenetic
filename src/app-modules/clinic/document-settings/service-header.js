import React, { useState, useEffect } from "react";
import AssignService from "./service-place";
import Loader from "../../../control-components/loader/loader";
import apiHelper from "../../../helper/api-helper";
import API_URLS from "../../../helper/api-urls";
import { useSelector } from "react-redux";
import { NotificationManager } from "react-notifications";
import { renderErrors } from "src/helper/error-message-helper";


const ServiceHeader = () => {
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState([]);
  const [assigned, setAssigned] = useState([]);
  const selectedClientId = useSelector(state => state.selectedClientId);
  const clinicId = useSelector((state) => state.loggedIn.clinicId);

  useEffect(() => {
    AvailableServices();
    AssignedServices();
  }, [selectedClientId]);

  const AvailableServices = () => {
    setLoading(true);
    apiHelper.getRequest(
      API_URLS.GET_ALL_PLACE_OF_SERVICE)
      .then((result) => {
        const data = result.resultData;
        let newServices = [];
        if (data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            const element = {
              "serviceId": data[i].id,
              "serviceName": data[i].name,
            };
            newServices.push(element);
          }
        }
        setAvailable(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors("Something went wrong");
      });
  };
  const AssignedServices = () => {
    setLoading(true);
    apiHelper.getRequest(API_URLS.GET_DOC_PLACE_OF_SERVICE)
      .then((result) => {
        const data = result.resultData;
        let newServices = [];
        if (data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            const element = {
              "serviceId": data[i].id,
              "serviceName": data[i].name,
            };
            newServices.push(element);
          }
        }
        setAssigned(data);
        setLoading(false);
      })
      .catch((error) => { });
  };



  return (
    <div >
      {loading === true && <Loader />}

      <AssignService available={available} assigned={assigned} />
    </div>
  );
};

export default ServiceHeader;
