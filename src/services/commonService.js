import ApiUrls from "../helper/api-urls";
import ApiHelper from "../helper/api-helper";
import { Encrption } from '../app-modules/encrption';

const getEventStatus = () => {
  return new Promise((resolve, reject) => {
    ApiHelper.getRequest(ApiUrls.GET_EVENT_STATUS, null, true)
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
  return new Promise((resolve, reject) => {
    ApiHelper.getRequest(ApiUrls.GET_GENDER, null, true)
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
};


const changePass = (fields) => {
  var data = {
    "currentPassword": fields.currentPassword,
    "newPassword": fields.newPassword
  };
  return ApiHelper.postRequest(ApiUrls.CHANGE_PASSWORD, data,);
};



const forgotPass = (userName) => {
  return ApiHelper.getRequest(ApiUrls.FORGOT_PASSWORD + userName);
};

const syncStaffOnlineStatus = () => {
  return ApiHelper.getRequest(ApiUrls.SYNC_STAFF_STATUS);
};


const confirmOtp = (fields) => {
  var data = {
    "userName": fields.userName,
    "otp": fields.otp
  };
  return ApiHelper.postRequest(ApiUrls.VERIFY_OTP, data,);
};


const updatePassword = (fields) => {
  var data = {
    "newPassword": fields.newPassword,
  };
  return ApiHelper.postRequest(ApiUrls.UPDATE_PASSWORD, data,);
};

const logOutUser = (sessionId) => {
  var data = {
    "sessionId": sessionId,
  };
  return ApiHelper.postRequest(ApiUrls.LOGOUT_USER, data,);
};

const addDocumentExisting = (documentId, linkedDocIds) => {
  var data = {
    "documentId": documentId,
    "linkedDocId": linkedDocIds
  };

  return ApiHelper.postRequest(ApiUrls.LINKED_DOCUMENTS, data,);
};

const getDocumentByClientId = (id) => {
  return ApiHelper.getRequest(ApiUrls.GET_DOCUMENTS_BY_CLIENT_ID + id);
};

const getLinkedDocByDocId = (id) => {
  return ApiHelper.getRequest(ApiUrls.GET_DOCUMENTS_BY_DOCUMENT_ID + id);
};

const getQuestionnaireByClientId = (id) => {
  return ApiHelper.getRequest(ApiUrls.GET_QUESTIONNAIRE_BY_CLIENT_ID + id);
};

const addClientQuestionnaire = (documentId, clientQuestionnaireId, createdBy) => {
  var data = {
    "documentId": documentId,
    "clientQuestionnaireId": clientQuestionnaireId,
    "createdBy": createdBy
  };

  return ApiHelper.postRequest(ApiUrls.LINKED_QUESTOINNAIRE, data,);
};


export const CommonService = {
  getEventStatus,
  getGender,
  changePass,
  forgotPass,
  updatePassword,
  confirmOtp,
  logOutUser,
  syncStaffOnlineStatus,
  getDocumentByClientId,
  addDocumentExisting,
  getLinkedDocByDocId,
  getQuestionnaireByClientId,
  addClientQuestionnaire

};