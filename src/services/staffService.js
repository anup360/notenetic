import ApiUrls from "../helper/api-urls";
import ApiHelper from "../helper/api-helper";
import moment from 'moment';
import { Encrption } from '../app-modules/encrption';

const getStaffsDDL = (isActive = true) => {
  return new Promise((resolve, reject) => {
    ApiHelper.getRequest(ApiUrls.GET_STAFF_DDL_BY_CLINIC_ID, null, true)
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        //TODO://Implement error at common place in API Helper along with loader at common place
        reject(error);
      });
  });
};

const getGender = () => {
  return ApiHelper.getRequest(ApiUrls.GET_GENDER);
};

const getState = () => {
  return ApiHelper.getRequest(ApiUrls.GET_STATE)
}
const saveStaff = (fields, clinicId) => {
  var data = {
    firstName: fields.firstName,
    lastName: fields.lastName,
    email: fields.email,
    userName: fields.userName,
    phone: fields.phone,
    genderId: fields.gender.id,
    positionEffectiveDate: moment(fields.positionEffectiveDate).format("YYYY-MM-DD"),
    roleId: fields?.roleId.id ? fields?.roleId.id :0 ,
    dob: moment(fields.dob).format("YYYY-MM-DD"),
    clinicId: clinicId,
    position: fields.position,
    isActive: true,
  };
  return ApiHelper.postRequest(ApiUrls.INSERT_STAFF, data)
};

const getStaffDLL = () => {
  return ApiHelper.getRequest(ApiUrls.GET_STAFF_DDL_BY_CLINIC_ID)
}

const getStaffTrack = (take, pageSize, finalValue) => {
  var data = {
    "pageNumber": finalValue ? finalValue : 1,
    "pageSize": take == null ? pageSize : take,
  };
  return ApiHelper.postRequest(ApiUrls.GET_STAFF_TRACK_TIME, data)
};

const insertStaffTrack = (fields) => {
  var data = {
    "time": fields.trackTime,
    "comments": fields.comments,
  };
  return ApiHelper.postRequest(ApiUrls.INSERT_STAFF_TRACK_TIME, data)
};

const assignTagToStaffDocument = (fields, docId) => {
  let tagIds = [];
  fields.tagName.map(objType => tagIds.push(objType.id))
  var data = {
    "docId": docId,
    "tagIds": tagIds,
  };
  return ApiHelper.putRequest(ApiUrls.ASSIGN_TAG_TO_STAFF_DOC, data,);
}

const removeStaffDocTags = (id) => {
  return ApiHelper.deleteRequest(ApiUrls.REMOVE_STAFF_DOC_TAG + Encrption(id), null, true);
};

export const StaffService = {
  getStaffsDDL,
  getGender,
  getState,
  saveStaff,
  getStaffDLL,
  getStaffTrack,
  assignTagToStaffDocument,
  removeStaffDocTags,
  insertStaffTrack
};