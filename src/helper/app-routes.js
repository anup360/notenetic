const APP_ROUTES = {
  // -------------Video Chat---------------

  TELEHEALTH: "/telehealth",

  LANDING_PAGE: "/landing",


  // -------------Provider---------------

  ADD_CLINIC: "/provider/add",
  EDIT_CLINIC: "/provider/edit/",
  UPDATE_CLINIC: "/provider/edit/:id",
  GET_CLINIC: "/provider/list",

  //ADD_CLINIC_SITE: "/provider/location/add",
  //EDIT_CLINIC_SITE: "/provider/location/edit/",
  //UPDATE_SITE: "/provider/location/edit/:id",
  //GET_CLINIC_SITE: "/provider/location/list",

  ADD_CLINIC_SITE: "/provider/site/add",
  EDIT_CLINIC_SITE: "/provider/site/edit/",
  UPDATE_SITE: "/provider/site/edit/:id",
  GET_CLINIC_SITE: "/provider/site/list",

  // -----------------Staff------------------
  ADD_STAFF: "/staff/add",
  GET_STAFF: "/staff/list",
  EDIT_STAFF: "/staff/edit",
  EDIT_STAFF_BY_ID: "/staff/edit/:id",
  STAFF_PROFILE: "/staff/profile",
  STAFF_SIGNATURE: "/staff/signature",
  STAFF_POSITION: "/staff/position",
  STAFF_CASELOAD: "/staff/caseload",
  STAFF_SITES: "/staff/sites",
  STAFF_CERTIFICATE: "/staff/certificate",
  STAFF_STORED_DOCUMENTS: "/staff/stored",
  STAFF_ADD_STORED_DOCUMENT: "/staff/document/add",
  STAFF_EDIT_STORED_DOCUMENT: "/staff/document/edit",
  STAFF_SETTING: "/staff/setting",
  TRACK_STAFF_TIME: "/track/staff",
  STAFF_TEAM: "/staff/staff-team",

  // -----------------Dashboard------------------
  DASHBOARD: "/dashboard",
  // -----------------Roles------------------
  ROLES: "/roles",

  //-----------------------Task manager-----------------
  TASK_MANAGER: "/task/manager",
  TASK_DISCUSSION: "/task/discussion",

  // -----------------Insurance------------------
  ADD_INSURANCE: "/insurance/add",
  GET_INSURANCE_LIST: "/insurance/list",
  EDIT_INSURANCE: "/insurance/edit/",
  UPDATE_INSURANCE: "/insurance/edit/:id",
  ADD_CLIENT_INSURANCE: "/client/insurance/add",

  // -----------------Client------------------
  ADD_CLIENT: "/client/add",
  GET_CLIENT: "/client/list",
  // UPDATE_CLIENT: "/client/edit/:id",
  CLIENT_DASHBOARD: "/client/dashboard",
  CLIENT_HEADER: "/client/header",
  CLIENT_SIGNATURE: "/client/signature",

  UPDATE_CLIENT_VITAL: "/ClientVital/edit",
  DELETE_CLIENT_VITAL: "/ClientVital/delete",
  GET_CLIENT_BY_ID: "ClientVital/list",
  GET_CLIENT_VITAL: "/client/vital/list",
  ADD_CLIENT_VITAL: "/client/vital/add",

  DIAGNOSIS: "/client/diagnosis",
  INSURANCE: "/client/insurance",
  EDIT_CLIENT_INSURANCE: "/client/insurance/edit",

  ADD_TREATMENT_PLAN: "/client/treatment",
  STORED_DOCUMENTS: "/client/storedDocuments",
  ADD_STORED_DOCUMENTS: "/client/storedDocuments/add",
  EDIT_STRORED_DOCUMENT: "/client/storedDocumnet/edit",
  CLIENT_DISCHARGE: "/client/discharge",
  QUESTIONNAIRE: "/client/Questionnaire",
  CREATE_QUESTIONNAIRE: "/client/questionnaire/add",

  MEDICATION: "/client/medication",

  // -----------------Authorization------------------

  AUTHORIZATION_LIST: "/client/authorization/list",
  AUTHORIZATION_ADD: "/client/authorization/add",
  AUTHORIZATION_EDIT: "/client/authorization/edit",

  // ----------------- Add Notes------------------

  // ----------------- SCHEDULER ------------------
  SCHEDULER: "/scheduler",

  // ----------------- Message ------------------
  MESSAGE: "/messages/",
  MESSAGE_SENT: "/messages/sent",
  MESSAGE_TRASH: "/messages/trash",

  // -----------------Service Manager------------------

  ADD_Services: "/Services/add",
  GET_SERVICE_BY_CLINICID: "/Services/list",
  EDIT_Services: "/Services/edit",
  EDIT_Services_BY_ID: "/Services/edit",
  GET_Services_BY_ID: "/Services/detail",

  // ----------------- Document Templates ------------------
  DOCUMENT_TEMPLATE_LIST: "/documents/template/list",
  DOCUMENT_TEMPLATE_VIEW: "/documents/template/view",
  DOCUMENT_TEMPLATE_ADD: "/documents/template/add",
  DOCUMENT_TEMPLATE_ADD_BY_DND: "/documents/template/add-dnd",
  DOCUMENT_TEMPLATE_STAFF: "/staff/template-assign",

  // ----------------- Document Templates Draft ------------------
  DOCUMENT_TEMPLATE_DRAFT_LIST: "/documents/template/draft/list",

  // ----------------- Documents ------------------
  DOCUMENT_DRAFT_LIST: "/documents/draft/list",
  DOCUMENT_LIST: "/document/list",
  DOCUMENT_HISTORY: "/document/history",
  VIEW_DOCUMENT_EDIT_HISTORY: "/document/history/view",

  DOCUMENT_VIEW: "/document/view",
  DOCUMENT_MULTI_VIEW: "/document/multi-view",
  DOCUMENT_ADD: "/document/add",
  DOCUMENT_EDIT: "/document/edit",

  // ----------------------------Employment----------------------------
  CLIENT_EMPLOYMENT: "/client/employment",


    // -----------------------Eligibility-----------------
    CLIENT_ELIGIBILITY: "/client/eligibility",


  // -----------------------Immunization-----------------
  CLIENT_IMMUNIZATION: "/client/immunization",
  ADD_IMMUNIZATION: "/client/immunization/add",
  EDIT_IMMUNIZATION: "/client/immunization/edit",
  DETAIL_IMMUNIZATION: "/client/immunization/details",
  // -----------------------Assign Staff-----------------
  ASSIGN_STAFF_TO_CLIENT: "/client/assign-staff",

  // --------------------------Education-------------------

  CLIENT_EDUCATION: "/client/education",

  // --------------------------Clinic Settings-------------------

  REF_PROVIDER_SETTINGS: "/settings/provider",
  REF_SOURCE_SETTINGS: "/settings/source",
  SETTINGS_UPLOAD_LOGO: "/settings/upload-logo",
  DOCUMENT_SETTINGS: "/settings/document",
  CERTIFICATION_SETTINGS: "/settings/certification",
  CLINIC_FLAGS: "/settings/clinic-flags",
  CLINIC_TAGS: "/settings/clinic-tags",
  CLIENT_STATUS: "/settings/clinicStatus",
  ADD_MULTIPLE_CLIENT_AUTH: "/multipleClientAuth/add",
  EDIT_MULTIPLE_CLIENT_AUTH: "/multipleClientAuth/edit",
  CLINIC_PAYERS: "/settings/clinic-payers",

  // ------------------------ Client Guardian ------------------
  CLIENT_GUARDIAN_LIST: "/client/guardian/list",
  CLIENT_GUARDIAN_ADD: "/client/guardian/add",

  // ------------------------ Client Physician ------------------
  CLIENT_PHYSICIAN: "/client/physician",
  CLIENT_PHYSICIAN_LIST: "/client/physician/list",
  CLIENT_PHYSICIAN_ADD: "/client/physician/add",

  // ----------------------Contact Notes-----------------------

  CLIENT_CONTACT_NOTES: "/client/contact/list",

  // -----------------------Assign Services-----------------
  ASSIGN_SERVICE_TO_CLIENT: "/client/assign-service",
  ASSIGN_SERVICE_TO_STAFF: "/staff/assign-service",

  // ---------------------Signature------------------
  ADD_PARENT_SIGNATURE: "/client/signature/addParent",
  ADD_CLIENT_SIGNATURE: "/client/signature/addClient",

  // -----------------------Audit----------------------
  STAFF_AUDIT: "/audit/staffAudit",
  CLIENT_AUDIT: "/audit/clientAudit",
  CLINIC_AUDIT: "/audit/clinicAudit",
  INTERNAL_SERVER_ERROR: "/internal-server-error",

  // --------------------------Service Atuth-----------------------
  MULTIPLE_CLIENT_SERVICE_AUTH: "/authorizations",

  // -----------------------------------------Demo-----------------------
};

export default APP_ROUTES;
