import React, { useState, useEffect } from "react";
import Certificate from "./Certificate";
import Loader from "../../../../src/control-components/loader/loader";
import DrawerContainer from "../../../control-components/custom-drawer/custom-drawer";
import StaffProfileHeader from "../../../../src/app-modules/staff/staff-profile/staff-profile-header";
import apiHelper from "../../../helper/api-helper";
import API_URLS from "../../../helper/api-urls";
import { useSelector } from "react-redux";
import { renderErrors } from "src/helper/error-message-helper";

const CertificateHeader = () => {
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState([]);
  const [assigned, setAssigned] = useState([]);
  const selectedStaffId = useSelector((state) => state.selectedStaffId);
  const clinicId = useSelector((state) => state.loggedIn.clinicId);

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
            <Certificate />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateHeader;
