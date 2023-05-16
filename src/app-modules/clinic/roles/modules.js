import React, { Component, useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { Checkbox } from "@progress/kendo-react-inputs";
import {
  ExpansionPanel,
  ExpansionPanelContent,
} from "@progress/kendo-react-layout";
import { RoleService } from "../../../services/rolesService";
import Loader from "../../../control-components/loader/loader";
import DEVELOPMENT_CONFIG from "../../../helper/config";
import ApiUrls from "../../../helper/api-urls";
import ApiHelper from "../../../helper/api-helper";
import moment from "moment";
import { renderErrors } from "src/helper/error-message-helper";

const ModuelsPermissions = ({
  roleModules,
  onSavePermission,
  selectedRoleId,
  expandedModule,
  setExpandedModule,
  staffLoginInfo,
  role,
}) => {
  const [selectedPermissions, setSelectedPermissions] = React.useState([]);
  const [loading, setLoading] = useState(false);

  const handlePermissionChange = (event, obj) => {
    const index = selectedPermissions.indexOf(obj);
    if (index > -1) {
      selectedPermissions.splice(index, 1);
    } else {
      selectedPermissions.push(obj);
    }
    for (var i = 0; i < selectedPermissions.length; i++) {
      selectedPermissions[i]["isHavePermissions"] = event.value;
    }
    setSelectedPermissions(selectedPermissions);
  };

  const updatePermissions = async () => {
    setLoading(true);
    window.scrollTo(0, 0);
    setExpandedModule(false);
    let newArr = [];
    if (selectedPermissions.length > 0) {
      for (var i = 0; i < selectedPermissions.length; i++) {
        const element = {
          permissionId: selectedPermissions[i].id,
          isHavePermissions: selectedPermissions[i].isHavePermissions,
        };
        newArr.push(element);
      }
    }
    await RoleService.updateRoleModulePermission(selectedRoleId, newArr)
      .then((result) => {
        setLoading(false);
        const initialExpanded = roleModules.reduce(
          (acc, cur) => ({ ...acc, [cur.id]: true }),
          {}
        );
        setExpandedModule(initialExpanded);
        NotificationManager.success("Permissions updated successfully");
        RefreshToken();
        setSelectedPermissions([]);
        onSavePermission({ selectedRoleId });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const RefreshToken = async () => {
    var refreshtoken = localStorage.getItem("refeshtoken");
    var data = {
      refreshToken: refreshtoken,
    };
    ApiHelper.postRequest(ApiUrls.RERESH_TOKEN, data)
      .then((result) => {
        localStorage.setItem(DEVELOPMENT_CONFIG.TOKEN, result.resultData.token);
        localStorage.setItem(
          DEVELOPMENT_CONFIG.REFRESH_TOKEN,
          result.resultData.refreshToken
        );
        localStorage.setItem(DEVELOPMENT_CONFIG.LOGIN_TIME, moment().format());
        localStorage.setItem(
          DEVELOPMENT_CONFIG.TOKEN_EXPIRETIME,
          moment().add(result.resultData.tokenExpireIn, "seconds").format()
        );
        localStorage.setItem(
          DEVELOPMENT_CONFIG.REFRESHTOKEN_EXPIRETIME,
          moment()
            .add(result.resultData.refreshTokenExpireIn, "seconds")
            .format()
        );
      })
      .catch((error) => {
        renderErrors(error);
        localStorage.clear();
        window.location.href = "/login";
      });
  };

  const onActionModules = React.useCallback(
    (event, obj) => {
      setExpandedModule({
        ...expandedModule,
        [obj.id]: !expandedModule[obj.id],
      });
    },
    [expandedModule]
  );

  return (
    <div>
      {roleModules.map((parentItem) => (
        <ExpansionPanel
          title={parentItem.moduleName}
          key={parentItem.id}
          expanded={expandedModule[parentItem.id]}
          onAction={(event) => onActionModules(event, parentItem)}
        >
          {expandedModule[parentItem.id] && (
            <ExpansionPanelContent>
              <>
                {parentItem.modulePermissionList.map((permissionObj, index) => (
                  <Checkbox
                    name="isPrimary"
                    key={index}
                    label={permissionObj.permissionName}
                    defaultChecked={permissionObj.isHavePermissions}
                    disabled={
                      permissionObj.isActive == true
                        ? false || staffLoginInfo.roleId !== 1
                          ? true
                          : false
                        : true
                    }
                    onChange={(event) =>
                      handlePermissionChange(event, permissionObj)
                    }
                  />
                ))}
              </>
            </ExpansionPanelContent>
          )}
        </ExpansionPanel>
      ))}
      {loading == true && <Loader />}

      <div className="mt-4">
        <button
          disabled={
            role?.roleName === "Super Admin" || staffLoginInfo.roleId !== 1
              ? true
              : false
          }
          onClick={updatePermissions}
          className="btn blue-primary text-white"
        >
          Update
        </button>
      </div>
    </div>
  );
};
export default ModuelsPermissions;
