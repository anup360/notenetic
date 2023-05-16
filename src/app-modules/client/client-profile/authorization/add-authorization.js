import React from "react";
import CustomDrawer from "../../../../control-components/custom-drawer/custom-drawer";
import CommonAuthorizationForm from "./common-authorization-form";
import { useSelector } from "react-redux";
import { renderErrors } from "src/helper/error-message-helper";

const AddAuthrization = () => {
  const selectedClientId = useSelector((state) => state.selectedClientId);

  return (
    <div className="d-flex flex-wrap">
      <div className="inner-dt col-md-3 col-lg-2">
        <CustomDrawer />
      </div>
      <CommonAuthorizationForm/>
    </div>
  );
};

export default AddAuthrization;
