import ApiUrls from "../helper/api-urls";
import ApiHelper from "../helper/api-helper";
import moment from 'moment';
import { Encrption } from '../app-modules/encrption';



const getRoles = () => {
    return ApiHelper.getRequest(ApiUrls.GET_ROLE);
};

const getRoleModules = (id) => {
    return ApiHelper.getRequest(ApiUrls.GET_ROLE_MODULES + Encrption(id));
};

const updateRoleModulePermission = (roleId, selectedPermissions) => {

    var data = {
        "roleId": roleId,
        "permissions": selectedPermissions
    }

    return ApiHelper.postRequest(ApiUrls.UPDATE_ROLE_PERMISSIONS, data,);
};


export const RoleService = {
    getRoles,
    getRoleModules,
    updateRoleModulePermission


}