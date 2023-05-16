import React, { useState } from "react";
import Loader from "../../../control-components/loader/loader";
import StaffSetting from "./staff-setting";
import EmailSetting from "./email-setting";
import SmsSetting from "./sms-setting";
import { useSelector } from "react-redux";
import { TabStrip, TabStripTab } from "@progress/kendo-react-layout";
import { renderErrors } from "src/helper/error-message-helper";

const Setting = () => {
  const [loading, setLoading] = useState(false);
  const selectedStaffId = useSelector((state) => state.selectedStaffId);
  const [selected, setSelected] = React.useState(0);

  const handleSelect = (e) => {
    setSelected(e.selected);
  };

  return (
    <div className="container general-tabs">
      {loading === true && <Loader />}
      <div className="row justify-content-center">
        <div className="d-flex justify-content-between mb-3 mt-3">
          <h4 className="address-title text-grey ">
            <span className="f-24">Settings</span>
          </h4>
        </div>
        <TabStrip
          className="setting-tabs-staff"
          selected={selected}
          onSelect={handleSelect}
        >
          <TabStripTab title="General Settings">
            <div className="row ">
              <StaffSetting staffId={selectedStaffId} />
            </div>
          </TabStripTab>
          {/* <TabStripTab title="SMS Alerts">
            <div className="row ">
              <SmsSetting staffId={staffId} />
            </div>
          </TabStripTab>
          <TabStripTab title="Email Alerts">
            <div className="row ">
              <EmailSetting staffId={staffId} />
            </div>
          </TabStripTab>
          <TabStripTab title="Message Alert">
            <div className="row ">
            </div>
          </TabStripTab> */}
        </TabStrip>
      </div>
    </div>
  );
};

export default Setting;
