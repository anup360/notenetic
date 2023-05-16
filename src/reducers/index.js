import { combineReducers } from "redux";
import { logInReducer, logOutReducer } from "./authReducer";
import { clinicIDReducer } from "./clinicReducer";
import {
  clientIDReducer,
  clientInsuranceIDReducer,
  selectedClientIdReducer,
  clientFilterReducer,
  selectedDrawer,
  clientDetails,
  getClientProfileImg,
  getClientProfileImgBytes,
  currentInsuranceDetails,
  getPrimaryCarePhysician,
  getPediatrician,
  getAllclientAvailable,
  clientFlagsReducer
} from "./clientReducer";

import { selectedServiceIdReducer } from "./serviceReducer";
import {
  selectedHeaderMenu,
  isGlobalSearchReducer,
  getGender,
  getRole,
  getDocumentTemplate,
  getSiteId,
  getSiteVaue,
} from "./commonSlice";
import { userAccessReducer } from "./userAccessReducer";

import {
  selectedStaffIdReducer,
  getStaffReducer,
  getMaritialsStatusReducer,
  getGenderReducer,
  getStaffDetails,
  getStaffProfileImg,
  getRolePermisson,
  getAvailableStaff,
  getDocumentFilter,
  getStaffOnline,
} from "./staffReducer";

import { getClinicDetails } from "./clinicReducer";

const appReducer = combineReducers({
  loggedIn: logInReducer,
  loggedOut: logOutReducer,
  clinicId: clinicIDReducer,
  clientId: clientIDReducer,
  clientFlagsReducer:clientFlagsReducer,
  selectedDrawer: selectedDrawer,
  clientInsuranceId: clientInsuranceIDReducer,
  selectedClientId: selectedClientIdReducer,
  selectedServiceId: selectedServiceIdReducer,
  selectedStaffId: selectedStaffIdReducer,
  clientLastFilter: clientFilterReducer,
  getStaffReducer: getStaffReducer,
  getMaritialsStatusReducer: getMaritialsStatusReducer,
  getGenderReducer: getGenderReducer,
  selectedHeaderMenu: selectedHeaderMenu,
  isGlobalSearchReducer: isGlobalSearchReducer,
  getGender: getGender,
  getRole: getRole,
  clientDetails: clientDetails,
  getClientProfileImg: getClientProfileImg,
  getClientProfileImgBytes: getClientProfileImgBytes,
  getStaffDetails: getStaffDetails,
  getStaffProfileImg: getStaffProfileImg,
  currentInsuranceDetails: currentInsuranceDetails,
  userAccessPermission: userAccessReducer,
  getPrimaryCarePhysician: getPrimaryCarePhysician,
  getPediatrician: getPediatrician,
  getRolePermisson: getRolePermisson,
  getDocumentTemplate: getDocumentTemplate,
  getSiteId: getSiteId,
  getAllclientAvailable: getAllclientAvailable,
  getAvailableStaff: getAvailableStaff,
  getSiteVaue: getSiteVaue,
  getDocumentFilter: getDocumentFilter,
  getStaffOnline: getStaffOnline,
  getClinicDetails: getClinicDetails,
});

export default appReducer;
