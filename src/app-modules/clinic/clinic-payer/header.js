import React, { useState, useEffect } from "react";
import Loader from "../../../../src/control-components/loader/loader";
import DrawerContainer from "../../../control-components/custom-drawer/custom-drawer";
import apiHelper from "../../../helper/api-helper";
import API_URLS from "../../../helper/api-urls";
import { useSelector } from "react-redux";
import { Encrption } from '../../encrption';
import ClinicPayers from "./clinic-payer";
import NotificationManager from "react-notifications";
import { renderErrors } from "src/helper/error-message-helper";

const ClinicPayersHeader = () => {
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState([]);
  const [assigned, setAssigned] = useState([]);
  const clinicId = useSelector(state => state.loggedIn.clinicId);

  useEffect(() => {
    AvailablePayers();
    AssignedClinicPayers();
  }, []);

  const AvailablePayers = () => {
    setLoading(true);
    apiHelper
      .getRequest(API_URLS.GET_ALL_PAYERS )
      .then((result) => {
        const data = result.resultData;
        setAvailable(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      renderErrors(error.message);

     });
  };
  const AssignedClinicPayers = () => {
    let clinicSelected = Encrption(clinicId)
    setLoading(true);
    apiHelper
      .getRequest(
        API_URLS.GET_CLINIC_PAYERS + clinicSelected
      )
      .then((result) => {
        const data = result.resultData;
        setAssigned(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      renderErrors(error.message);
     });
  };


  return (
    <div className="d-flex flex-wra">
      {loading === true && <Loader />}
      <div className="inner-dt col-md-3 col-lg-2">
        <DrawerContainer />
      </div>
      <div className="col-md-9 col-lg-10 ">
        <div className="px-2 mt-4">
          <div className="row ">
            <ClinicPayers available={available} assigned={assigned} loading={loading}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicPayersHeader;
