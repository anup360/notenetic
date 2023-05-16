import React from "react";
import DrawerContainer from "../../../control-components/custom-drawer/custom-drawer";
import StaffProfileHeader from "../../../../src/app-modules/staff/staff-profile/staff-profile-header";
import Setting from "./setting";

const SettingHeader = () => {
  return (
    <div className="d-flex flex-wra">
      <div className="inner-dt col-md-3 col-lg-2">
        <DrawerContainer />
      </div>
      <div className="col-md-9 col-lg-10 ">
        <StaffProfileHeader />
        <div className="px-2 mt-4">
          <div className="row ">
            <Setting />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingHeader;
