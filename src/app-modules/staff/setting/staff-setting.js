import React, { useEffect, useState } from "react";
import { Switch } from "@progress/kendo-react-inputs";
import { Encrption } from "../../encrption";
import ApiHelper from "../../../helper/api-helper";
import ApiUrls from "../../../helper/api-urls";
import { NotificationManager } from "react-notifications";
import Loading from "../../../control-components/loader/loader";
import { useDispatch } from "react-redux";
import { GET_ROLE_PERMISSIONS } from "../../../actions/authActions";
import { permissionEnum } from "../../../helper/permission-helper";
import { useSelector } from "react-redux";
import { renderErrors } from "src/helper/error-message-helper";


const StaffSetting = (props) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [settingSwitch, setSettingSwitch] = useState({
    canSeeAllClients: false,
    autoClockMeInOut: false,
    canModifyClinicRoles: false,
    canReviewDocuments: false,
    isBillingManager: false,
    isHumanResourcesManager: false,
    canSealDocuments: false

  });
  const userAccessPermission = useSelector((state) => state.userAccessPermission);


  useEffect(() => {
    getStaffSettingList();
  }, []);

  const getStaffSettingList = () => {
    setLoading(true);
    let id = Encrption(props.staffId);
    ApiHelper.getRequest(ApiUrls.GET_STAFF_SETTING + id)
      .then((result) => {
        const data = result.resultData;
        setSettingSwitch({
          canSeeAllClients: data.canSeeAllClients,
          autoClockMeInOut: data.autoClockMeInOut,
          canModifyClinicRoles: data.canModifyClinicRoles,
          canReviewDocuments: data.canReviewDocuments,
          isBillingManager: data.isBillingManager,
          isHumanResourcesManager: data.isHumanResourcesManager,
          canSealDocuments: data.canSealDocuments
        });
        dispatch({
          type: GET_ROLE_PERMISSIONS,
          payload: result.resultData,
        });
        setLoading(false);
      })
      .catch((error) => {
        renderErrors(error.message);
        setLoading(false);
      });
  };

  const handleUpdate = () => {
    setLoading(true);
    const data = {
      staffId: props.staffId,
      canSeeAllClients: settingSwitch.canSeeAllClients,
      autoClockMeInOut: settingSwitch.autoClockMeInOut,
      canModifyClinicRoles: settingSwitch.canModifyClinicRoles,
      canReviewDocuments: settingSwitch.canReviewDocuments,
      isBillingManager: settingSwitch.isBillingManager,
      isHumanResourcesManager: settingSwitch.isHumanResourcesManager,
      canSealDocuments: settingSwitch.canSealDocuments
    };
    ApiHelper.postRequest(ApiUrls.ADD_STAFF_SETTING, data)
      .then((result) => {
        setLoading(false);
        NotificationManager.success("Updated General successfully");
        getStaffSettingList();
      })
      .catch((error) => {
        renderErrors(error.message);
      });
  };

  const handleSwitch = (e) => {
    var value = e.target.value;
    var name = e.target.name;
    setSettingSwitch({
      ...settingSwitch,
      [name]: value,
    });
  };


  return (
    <>
      <ul className="d-flex flex-wrap list-unstyled pt-3">
        <li className="col-md-6 col-12   switch-on mb-3">
          <Switch
            onChange={handleSwitch}
            onLabel={"on"}
            offLabel={"off"}
            name="canSeeAllClients"
            value={settingSwitch.canSeeAllClients}
            checked={settingSwitch.canSeeAllClients}
            disabled={userAccessPermission[permissionEnum.MANAGE_STAFF_SETTINGS] ? false : true}
          />
          <span className="switch-title-text ml-2  fw-500 f-16 ">
            Can see all clients if no caseload assigned
          </span>
        </li>
        {loading && <Loading />}

        {/* <li className="col-md-6 col-12   switch-on mb-3">
          <Switch
            onChange={handleSwitch}
            onLabel={"on"}
            offLabel={"off"}
            name="autoClockMeInOut"
            value={settingSwitch.autoClockMeInOut}
            checked={settingSwitch.autoClockMeInOut}
          />
          <span className="switch-title-text ml-2 fw-500 f-16">
            Auto clock me in out
          </span>
        </li> */}
        <li className="col-md-6 col-12   switch-on mb-3">
          <Switch
            onChange={handleSwitch}
            onLabel={"on"}
            offLabel={"off"}
            name="canModifyClinicRoles"
            value={settingSwitch.canModifyClinicRoles}
            checked={settingSwitch.canModifyClinicRoles}
            disabled={userAccessPermission[permissionEnum.MANAGE_STAFF_SETTINGS] ? false : true}

          />
          <span className="switch-title-text ml-2 fw-500 f-16">
            Can see clinic access roles and permissions
          </span>
        </li>
        <li className="col-md-6 col-12   switch-on mb-3">
          <Switch
            onChange={handleSwitch}
            onLabel={"on"}
            offLabel={"off"}
            name="canReviewDocuments"
            value={settingSwitch.canReviewDocuments}
            checked={settingSwitch.canReviewDocuments}
            disabled={userAccessPermission[permissionEnum.MANAGE_STAFF_SETTINGS] ? false : true}

          />
          <span className="switch-title-text ml-2 fw-500 f-16">
            Can review documents
          </span>
        </li>
        <li className="col-md-6 col-12   switch-on mb-3">
          <Switch
            onChange={handleSwitch}
            onLabel={"on"}
            offLabel={"off"}
            name="isBillingManager"
            value={settingSwitch.isBillingManager}
            checked={settingSwitch.isBillingManager}
            disabled={userAccessPermission[permissionEnum.MANAGE_STAFF_SETTINGS] ? false : true}

          />
          <span className="switch-title-text ml-2 fw-500 f-16">
            Billing/Claims Manager
          </span>
        </li>
        <li className="col-md-6 col-12   switch-on mb-3">
          <Switch
            onChange={handleSwitch}
            onLabel={"on"}
            offLabel={"off"}
            name="isHumanResourcesManager"
            value={settingSwitch.isHumanResourcesManager}
            checked={settingSwitch.isHumanResourcesManager}
            disabled={userAccessPermission[permissionEnum.MANAGE_STAFF_SETTINGS] ? false : true}

          />
          <span className="switch-title-text ml-2 fw-500 f-16">
            Human Resources (HR) Management
          </span>
        </li>
        <li className="col-md-6 col-12   switch-on mb-3">
          <Switch
            onChange={handleSwitch}
            onLabel={"on"}
            offLabel={"off"}
            name="canSealDocuments"
            value={settingSwitch.canSealDocuments}
            checked={settingSwitch.canSealDocuments}
            disabled={userAccessPermission[permissionEnum.MANAGE_STAFF_SETTINGS] ? false : true}

          />
          <span className="switch-title-text ml-2 fw-500 f-16">
            Can Seal Documents
          </span>
        </li>

      </ul>
      {userAccessPermission[permissionEnum.MANAGE_STAFF_SETTINGS] &&
        <div className="col-12 px-4 border-top pt-2">
          <button
            className="btn blue-primary-outline update-small"
            onClick={handleUpdate}
          >
            <i className="fa fa-check pr-2" title="Print"></i>
            Update
          </button>
        </div>
      }


    </>
  );
};

export default StaffSetting;
