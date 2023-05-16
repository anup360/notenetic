
export const permissionEnum = {

  /* Client Module */
  ADD_CLIENTS: 100,
  DISCHARGE_REACTIVATE_CLIENT: 101,
  EDIT_CLIENT_PROFILE: 102,
  MANAGE_CLIENT_SERVICES: 103,
  MANAGE_TREATMENT_PLAN: 104,
  MANAGE_CONTACT_NOTES: 105,
  MANAGE_CLIENT_FILES: 106,
  /* Client Module */

  /* Staff Module */
  ADD_STAFF: 107,
  DEACTIVATE_REACTIVATE_STAFF: 108,
  EDIT_STAFF_PROFILE: 109,
  MANAGE_STAFF_SERVICES: 110,
  MANAGE_STAFF_CASELOAD: 111,
  MANAGE_CERTIFICATIONS: 112,
  MANAGE_STAFF_FILES: 113,
  MANAGE_STAFF_SITES: 114,
  MANAGE_STAFF_SETTINGS: 115,
  MANAGE_STAFF_TEAM: 116,
  MANAGE_STAFF_TEMPLATE: 117,
  /* Staff Module */

  /* Calender Module */
  CREATE_EVENTS_OWN_EVENT: 118,
  CREATE_EVENTS_FOR_OTHER_STAFF: 119,
  MANAGE_CALENDAR_SETTINGS: 120,
  CAN_SEE_ALL_EVENTS_OTHER_THAN_CASELOAD: 121,
  /* Calender Module */

  /* Document Module */
  TRASH_UN_TRASH_DOCUMENT: 122,
  EDIT_DOCUMENTS: 123,
  LOCK_UNLOCK: 124,
  VIEW_HISTORY: 125,
  /* Document Module */

  /* Miscellaneous Module */
  MANAGE_AUTHORIZATIONS: 126,
  /* Miscellaneous Module */
}

export const PermissionHelper = (data) => {
  if (data.length > 0) {
    let modulePerm = [];
    for (var i = 0; i < data.length; i++) {
      let modulePermissionList = data[i].modulePermissionList
      if (modulePermissionList.length > 0) {
        for (const permission of modulePermissionList) {
          modulePerm[permission.enumId] = permission.isHavePermissions
        }
      }
    }
    return modulePerm;
  };
}

export const userPermission = (value) => {
  if (value === 1 || value === 2) {
    return true
  } else {
    return false
  }
}


export const userSAPermission = (value) => {
  if (value === 1) {
    return true
  } else {
    return false
  }
}
