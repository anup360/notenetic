import React, { Component, useEffect, useRef, useState } from "react";
import DropDownKendoRct from "../../../control-components/drop-down/drop-down";
import { RoleService } from "../../../services/rolesService";
import { NotificationManager } from "react-notifications";
import RoleModules from "./modules";
import Loader from "../../../control-components/loader/loader";
import { USER_CAN_ACCESS } from "../../../actions";
import { useDispatch, useSelector } from "react-redux";
import { PermissionHelper } from "../../../helper/permission-helper";
import { Error } from "@progress/kendo-react-labels";
import ApiHelper from "../../../helper/api-helper";
import ApiUrls from "../../../helper/api-urls";
import { Encrption } from "../../encrption";
import { renderErrors } from "src/helper/error-message-helper";

function Roles() {
  const staffId = useSelector((state) => state.loggedIn?.staffId);

  const [rolesList, setRoles] = useState([]);
  const [roleModules, setRoleModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = React.useState({});
  const dispatch = useDispatch();
  const staffLoginInfo = useSelector((state) => state.getStaffReducer);

  const initialExpanded = roleModules.reduce(
    (acc, cur) => ({ ...acc, [cur.id]: true }),
    {}
  );
  const [expandedModule, setExpandedModule] = React.useState({
    ...initialExpanded,
  });

  let [fields, setFields] = useState({
    roles: "",
  });

  const [settingSwitch, setSettingSwitch] = useState({
    canSeeAllClients: false,
    autoClockMeInOut: false,
    canModifyClinicRoles: false,
  });

  useEffect(() => {
    getRoles();
    getStaffSettingList();
  }, []);

  const getRoles = async () => {
    await RoleService.getRoles()
      .then((result) => {
        let list = result.resultData;
        setRoles(list);
      })
      .catch((error) => {
        renderErrors(error.message);
      });
  };

  const getRoleModules = async (id) => {
    setLoading(true);
    setExpandedModule(false);
    await RoleService.getRoleModules(id)
      .then((result) => {
        let list = result.resultData;
        setRoleModules(list);
        const initialExpanded = list.reduce(
          (acc, cur) => ({ ...acc, [cur.id]: true }),
          {}
        );
        setExpandedModule(initialExpanded);
        setLoading(false);
        if (list.length > 0) {
          let data = PermissionHelper(result.resultData);
          dispatch({
            type: USER_CAN_ACCESS,
            payload: data,
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFields({
      ...fields,
      [name]: value,
    });
    if (value) {
      setSelectedRoleId(value.id);
      getRoleModules(value.id);
    }
  };
  const onSavePermission = (selectedRoleId) => {
    if (selectedRoleId) {
      getRoleModules(selectedRoleId.selectedRoleId);
    }
  };

  const getStaffSettingList = () => {
    setLoading(true);
    let id = Encrption(staffId);
    ApiHelper.getRequest(ApiUrls.GET_STAFF_SETTING + id)
      .then((result) => {
        const data = result.resultData;
        setSettingSwitch({
          canSeeAllClients: data.canSeeAllClients,
          autoClockMeInOut: data.autoClockMeInOut,
          canModifyClinicRoles: data.canModifyClinicRoles,
        });
        setLoading(false);
      })
      .catch((error) => {
        renderErrors(error.message);
        setLoading(false);
      });
  };

  return (
    <div role="alert">
      <div className="notenetic-container">
        <div className="py-4">
          <h4 className="address-title text-grey mb-4">
            <span className="f-24">Access Level Settings</span>
          </h4>
          <div className="mb-2  col-md-4 col-12 px-0">
            <DropDownKendoRct
              label="Roles"
              onChange={handleChange}
              value={fields.roles}
              textField="roleName"
              name="roles"
              data={rolesList}
              dataItemKey="id"
              disabled={
                settingSwitch.canModifyClinicRoles === true
                  ? false
                  : staffLoginInfo?.roleId === fields.roles?.id
                  ? true
                  : true
              }
            />
            {!loading && settingSwitch.canModifyClinicRoles === false ? (
              <Error>"You don't have access to change"</Error>
            ) : (
              ""
            )}
          </div>
          <div className="mt-5 modules-section">
            <h6 className="address-title text-grey mb-4 fw-500">
              <span className="f-20">Modules</span>
            </h6>

            {loading == true && <Loader />}

            {roleModules.length > 0 && (
              <RoleModules
                roleModules={roleModules}
                onSavePermission={onSavePermission}
                selectedRoleId={selectedRoleId}
                expandedModule={expandedModule}
                setExpandedModule={setExpandedModule}
                staffLoginInfo={staffLoginInfo}
                role={fields.roles}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Roles;
