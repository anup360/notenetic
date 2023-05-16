import ApiUrls from "../helper/api-urls";
import ApiHelper from "../helper/api-helper";
import moment from "moment";
import { Encrption } from "../app-modules/encrption";

// ------------------------------Update clinic--------------------------------

const updateClinic = (fields, clinicId) => {
  var data = {
    id: clinicId,
    address: fields?.address ? fields?.address : "",
    state: fields?.state ? fields?.state : "",
    city: fields?.city ? fields?.city : "",
    zip: fields?.zip ? fields?.zip : "",
    phone: fields?.phone ? fields?.phone : "",
    fax: fields?.fax ? fields?.fax : "",
    email: fields?.email ? fields?.email : "",
    websiteUrl: fields?.websiteUrl ? fields?.websiteUrl : "",
    npi: fields?.npi ? fields?.npi : "",
    startOfWeek: fields?.startOfWeek?.id ? fields?.startOfWeek?.id : "",
  };
  return ApiHelper.putRequest(ApiUrls.UPDATE_CLINIC, data);
};

//  ----------------------------- Ref Provider ------------------------------

const insertClinicReferring = (fields) => {
  var data = {
    companyName: fields.companyName,
    firstName: fields.firstName,
    lastName: fields.lastName,
    npi: fields.npi,
    email: fields.email,
    contactPhone: fields.mobilePhone,
    address: fields.address,
    city: fields.city,
    state: fields.state,
    zip: fields.zipCode,
  };
  return ApiHelper.postRequest(ApiUrls.INSERT_CLINIC_REFERRING_PROVIDER, data);
};

const getClinicReferringProvider = (clinicId, activeType) => {
  return ApiHelper.getRequest(
    ApiUrls.GET_CLINIC_REFERRING +
      Encrption(clinicId) +
      "&isActive=" +
      activeType
  );
};

const deleteClinicRef = (id) => {
  return ApiHelper.deleteRequest(
    ApiUrls.DELETE_CLINIC_REFERRING + Encrption(id),
    null,
    true
  );
};

const reActivateClinicReferring = (id) => {
  return ApiHelper.getRequest(
    ApiUrls.REACTIVATE_CLINIC_REFERRING + Encrption(id)
  );
};

const getRefProviderById = (id, activeType) => {
  return ApiHelper.getRequest(
    ApiUrls.GET_CLINIC_REF_BY_ID + Encrption(id) + "&isActive=" + activeType
  );
};

const updateClinicReferring = (fields, id) => {
  var data = {
    companyName: fields.companyName,
    firstName: fields.firstName,
    lastName: fields.lastName,
    npi: fields.npi,
    email: fields.email,
    contactPhone: fields.mobilePhone,
    address: fields.address,
    city: fields.city,
    state: fields.state,
    zip: fields.zipCode,
    id: id,
  };
  return ApiHelper.putRequest(ApiUrls.UPDATE_CLINIC_REFERRING_PROVIDER, data);
};

//  ----------------------------- Ref Source ------------------------------

const insertRefSource = (fields) => {
  var data = {
    referringCompanyName: fields.companyName,
    referringCompanyNPI: fields.npi,
    contactPerson: fields.contactPerson,
    contactPersonPosition: fields.position,
    contactPhone: fields.mobilePhone,
    contactEmail: fields.email,
    contactFax: fields.fax,
    address: fields.address,
  };
  return ApiHelper.postRequest(ApiUrls.INSERT_REF_SOURCE, data);
};

const getRefSource = (clinicId, activeType) => {
  return ApiHelper.getRequest(
    ApiUrls.GET_REF_SOURCE + Encrption(clinicId) + "&isActive=" + activeType
  );
};

const getRefSourceById = (id, activeType) => {
  return ApiHelper.getRequest(
    ApiUrls.GET_REF_SOURCE_BY_ID + Encrption(id) + "&isActive=" + activeType
  );
};

const updateRefSource = (fields, id) => {
  var data = {
    referringCompanyName: fields.companyName,
    referringCompanyNPI: fields.npi,
    contactPerson: fields.contactPerson,
    contactPersonPosition: fields.position,
    contactPhone: fields.mobilePhone,
    contactEmail: fields.email,
    contactFax: fields.fax,
    address: fields.address,
    id: id,
  };
  return ApiHelper.putRequest(ApiUrls.UPDATE_REF_SOURCE, data);
};

const deleteRefSource = (id) => {
  return ApiHelper.deleteRequest(
    ApiUrls.DELETE_REF_SOURCE + Encrption(id),
    null,
    true
  );
};

const reActivateRefSource = (id) => {
  return ApiHelper.getRequest(ApiUrls.REACTIVATE_REF_SOURCE + Encrption(id));
};

//  ----------------------------- Client Referral Source ------------------------------

const insertClientRefSource = (fields, id) => {
  var data = {
    clientId: id,
    referralSourceId: fields.refName.id,
    referralReason: fields.refReason,
    dateReferral: moment(fields.refDate).format("YYYY-MM-DD"),
  };
  return ApiHelper.postRequest(ApiUrls.INSERT_CLIENT_REF_SOURCE, data);
};

const getClientRefSource = (id) => {
  return ApiHelper.getRequest(ApiUrls.GET_CLIENT_REF_SOURCE + Encrption(id));
};

const insertClientRefProvider = (fields, id) => {
  var data = {
    clientId: id,
    referralProviderId: fields.refName.id,
    referralReason: fields.refReason,
    dateReferral: moment(fields.refDate).format("YYYY-MM-DD"),
  };
  return ApiHelper.postRequest(ApiUrls.INSERT_CLIENT_REF_PROVIDER, data);
};

const getClientRefProvider = (id) => {
  return ApiHelper.getRequest(ApiUrls.GET_CLIENT_REF_PROVIDER + Encrption(id));
};

const uploadClinicLogo = (profile, clinicId) => {
  let bodyFormData = new FormData();
  bodyFormData.append("logoFile", profile, profile.path);
  bodyFormData.append("clinicId", clinicId);
  return ApiHelper.putRequest(ApiUrls.UPLOAD_CLINIC_LOGO, bodyFormData);
};

const getClinicLogo = (clinicId, inBase64) => {
  return ApiHelper.getRequest(
    ApiUrls.GET_CLINIC_LOGO + Encrption(clinicId) + "&inBase64=" + inBase64
  );
};

const updateDocumentSettings = (fields) => {
  var data = {
    numDaysAllowedInPast: fields.pastAllowedDays ? fields.pastAllowedDays : 0,
    numDaysApplySigAfterDos: fields.daysAppliedSigDos
      ? fields.daysAppliedSigDos
      : 0,
    numDaysApplySigAfterDateLocked: fields.daysAppliedSigLocked
      ? fields.daysAppliedSigLocked
      : 0,
    allowDocWithoutDiag: fields.allowWithoutDiag,
    canApplySigOnSubmission: fields.signOnSubmission,
    allowDocumentsWithoutAuth: fields.allowDocumentsWithoutAuth == true ? 1 : 0,
    allowStaffToDuplicateThierOwnDocs:
      fields.allowStaffToDuplicateThierOwnDocs == true ? 1 : 0,
    // "canSealDocument":fields.canSealDocument
  };
  return ApiHelper.putRequest(ApiUrls.UPDATE_DOCUMENT_SETTINGS, data);
};

const getDocSettings = (clinicId) => {
  return ApiHelper.getRequest(
    ApiUrls.GET_DOCUMENT_SETTINGS + Encrption(clinicId)
  );
};

const updateCertificates = (fields) => {
  var data = {
    id: fields.id,
    certificationName: fields.certificateName,
  };
  return ApiHelper.putRequest(ApiUrls.UPDATE_CERTIFICATES, data);
};

const addCertificates = (fields, clinicId) => {
  var data = {
    clinicId: clinicId,
    certificationName: fields.certificateName,
  };
  return ApiHelper.postRequest(ApiUrls.INSERT_CERTIFICATES, data);
};

const deleteCertificate = (id) => {
  return ApiHelper.deleteRequest(
    ApiUrls.DELETE_CERTIFICATE + Encrption(id),
    null,
    true
  );
};

const addCliniClientFlag = (fields, flagColor) => {
  var data = {
    color: flagColor,
    flagName: fields.flagName,
  };
  return ApiHelper.postRequest(ApiUrls.INSERT_CLIENT_FLAG, data);
};

const getClinicFlags = (clinicId) => {
  return ApiHelper.getRequest(
    ApiUrls.GET_CLINIC_CLIENT_FLAGS + Encrption(clinicId) + "&isActive=" + true
  );
};

const deleteFlag = (id) => {
  return ApiHelper.deleteRequest(
    ApiUrls.DELETE_FLAG + Encrption(id),
    null,
    true
  );
};

const getClinicFlagById = (id) => {
  return ApiHelper.getRequest(ApiUrls.GET_FLAG_BY_ID + Encrption(id));
};

const updateCliniClientFlag = (fields, flagColor) => {
  var data = {
    id: fields.id,
    color: flagColor,
    flagName: fields.flagName,
  };
  return ApiHelper.putRequest(ApiUrls.UPDATE_CLIENT_FLAG, data);
};

const addCliniClientTags = (fields, tagColor) => {
  var data = {
    color: tagColor,
    tagName: fields.tagName,
  };
  return ApiHelper.postRequest(ApiUrls.INSERT_CLINIC_TAG, data);
};

const getClinicTags = (clinicId) => {
  return ApiHelper.getRequest(
    ApiUrls.GET_CLINIC_CLIENT_TAGS + Encrption(clinicId) + "&isActive=" + true
  );
};

const deleteTags = (id) => {
  return ApiHelper.deleteRequest(
    ApiUrls.DELETE_TAG + Encrption(id),
    null,
    true
  );
};

const deleteClientStatus = (id) => {
  return ApiHelper.deleteRequest(ApiUrls.DELETE_CLIENT_STATUS + Encrption(id));
};

const getClinicTagsById = (id) => {
  return ApiHelper.getRequest(ApiUrls.GET_TAG_BY_ID + Encrption(id));
};
const getclientStatus = () => {
  return ApiHelper.getRequest(ApiUrls.GET_CLIENT_STATUS);
};

const updateCliniClientTags = (fields, tagColor) => {
  var data = {
    id: fields.id,
    color: tagColor,
    tagName: fields.tagName,
  };
  return ApiHelper.putRequest(ApiUrls.UPDATE_CLINIC_TAG, data);
};

const addClientStatus = (fields, clinicId) => {
  var data = {
    statusName: fields.statusName,
    clinicId: clinicId,
  };
  return ApiHelper.postRequest(ApiUrls.ADD_CLIENT_STATUS, data);
};

const getMultipleClientServiceAuth = () => {
  const data = {
    siteId: 0,
    filterByClientId: "string",
    filterByStaffId: 0,
    startDate: "2023-03-15T12:32:10.554Z",
    endDate: "2023-03-15T12:32:10.554Z",
    orderBy: "string",
    currentPage: 0,
    pageSize: 0,
  };
  return ApiHelper.postRequest(ApiUrls);
};

const getClinicDetails = (id) => {
  return ApiHelper.getRequest(ApiUrls.GET_CLINIC + Encrption(id));
};

export const SettingsService = {
  insertClinicReferring,
  getClinicReferringProvider,
  deleteClinicRef,
  reActivateClinicReferring,
  getRefProviderById,
  updateClinicReferring,
  insertRefSource,
  getRefSource,
  getRefSourceById,
  updateRefSource,
  deleteRefSource,
  reActivateRefSource,
  insertClientRefSource,
  getClientRefSource,
  insertClientRefProvider,
  getClientRefProvider,
  uploadClinicLogo,
  getClinicLogo,
  updateDocumentSettings,
  getDocSettings,
  updateCertificates,
  deleteCertificate,
  addCertificates,
  addCliniClientFlag,
  getClinicFlags,
  deleteFlag,
  getClinicFlagById,
  updateCliniClientFlag,
  addCliniClientTags,
  getClinicTags,
  deleteTags,
  getClinicTagsById,
  updateCliniClientTags,
  getclientStatus,
  deleteClientStatus,
  addClientStatus,
  updateClinic,
  getClinicDetails,
};
