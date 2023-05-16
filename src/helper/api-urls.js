const API_URLS = {
  LOGIN: "/Auth/Login",
  RERESH_TOKEN: "/Auth/RefreshToken",

  // -------------Provider---------------
  CREATE_PROVIDER: "/Provider/CreateProvider",
  UPDATE_PROVIDER: "/Provider/UpdateProvider",
  GET_PROVIDER_BY_ID: "/Provider/GetProviderById/",
  GET_PROVIDER_LIST: "/Provider/GetProvderList",
  DELETE_PROVIDER: "/Provider/DeleteProvider",

  // ------------- Document ---------------
  INSERT_DOCUMENT: "/Document/InsertDocument",
  AUTO_SAVE_DOCUMENT_DRAFT: "/Document/AutoSaveDocumentDraft",
  UPDATE_DOCUMENT: "/Document/UpdateDocument",
  DELETE_DOCUMENT: "/Document/TrashDocument?documentId=",
  UNTRASH_DOCUMENT: "/Document/UnTrashDocument?documentId=",
  DELETE_DOCUMENT_ATTACHMENT: "/Document/DeleteDocumentAttachment?id=",
  DELETE_LINKED_DOCUMENT: "/Document/DeleteLinkedDocumentById?id=",

  DELETE_LINKED_QUESTIONNAIRE: "/Document/DeleteClientDocQuestionnaireById?id=",

  DOCUMENT_HISTORY: "/Document/GetDocumentHistory?documentId=",
  GET_ALL_DOCUMENT: "/Document/GetAllDocument",
  GET_DOCUMENTS_PAGING: "/Document/GetDocumentsPaging",
  GET_DOCUMENT_BY_ID: "/Document/GetDocumentById?documentId=", // {documentId}
  GET_DOCUMENT_SERVICES: "/Document/GetDocumentServices?clientId=",
  GET_CLIENT_PROGRESS: "/Common/GetClientProgress",
  GET_DOCUMENT_STAFF_SERVICES: "/Staff/GetStaffServicesDDL?staffId=",

  GET_PLACE_OF_SERVICES_DDL_BY_CLINIC_ID:
    "/Document/GetPlaceOfServicesDDLByClinicId?clinicId=",
  GET_DOCUMENT_PREFS_BY_CLINIC_ID:
    "/Document/GetDocumentPrefsByClinicId?clinicId=",
  UPDATE_DOCUMENT_SETTINGS: "/Document/UpdateDocumentPrefs",
  GET_DOCUMENT_SETTINGS: "/Document/GetDocumentPrefsByClinicId?clinicId=",
  GET_DOCUMENT_OVER_LAPPING: "/Document/GetDocumentOverLapping",
  UPLOAD_DOCUMENT_ATTACHMENT: "/Document/UploadDocumentAttachment",
  GET_DOCUMENT_DRAFT: "/Document/GetDocumentDraft",
  GET_DOCUMENT_DRAFT_COUNT: "/Document/GetDocumentDraftCount",
  GET_DOCUMENT_DRAFT_BY_ID: "/Document/GetDocumentDraftById?id=",
  DELETE_DOCUMENT_DRAFT_BY_ID:
    "/Document/DeleteDocumentDraftById?documentDraftId=",

  // ------------- Document Template Drafts ---------------
  AUTO_SAVE_TEMPLATE_DRAFT: "/DocumentTemplates/AutoSaveTemplateDraft",
  GET_TEMPLATE_DRAFT: "/DocumentTemplates/GetTemplateDraft",
  DELETE_TEMPLATE_DRAFT_BY_ID:
    "/DocumentTemplates/DeleteTemplateDraftById?templateDraftId=",
  GET_TEMPLATE_DRAFT_BY_ID: "/DocumentTemplates/GetTemplateDraftById?id=",

  // ------------- Document Templates ---------------
  INSERT_DOCUMENT_TEMPLATE: "/DocumentTemplates/InsertDocumentTemplate",
  UPDATE_DOCUMENT_TEMPLATE: "/DocumentTemplates/UpdateDocumentTemplate",
  DELETE_DOCUMENT_TEMPLATE:
    "/DocumentTemplates/DeleteDocumentTemplate?documentTemplateId=",
  GET_DOCUMENT_TEMPLATE_BY_ID: "/DocumentTemplates/GetDocumentTemplateById?documentTemplateId=",
  GET_DOCUMENT_TEMPLATE_BY_CLINIC_ID: "/DocumentTemplates/GetDocumentTemplateByClinicId",
  INSERT_DOCUMENT_TEMPLATE_PREF:
    "/DocumentTemplates/InsertDocumentTemplatePref",
  GET_DOCUMENT_TEMPLATE_PREF_BY_TEMPLATE_ID:
    "/DocumentTemplates/GetDocumentTemplatePrefByTemplateId?templateId=",
  GET_DOCUMENT_TEMPLATE_DRAFT_COUNT: "/DocumentTemplates/GetDocumentDraftCount",
  GET_DOCUMENT_TEMPLATE_TYPES: "/Common/GetDocumentTemplateTypes",

  GET_STAFF_TEMPLATES: "/Staff/GetStaffTemplates",

  GET_STAFF_ASSIGNED_TEMPLATES_ONLY: "/Staff/GetStaffAssignedTemplatesOnly?staffId=",


  GET_STAFF_DOCUMENT_SIGNATURE:
    "/Signature/GetStaffDocumentSignature?documentId=",
  GET_DOCUMENT_ATTACHMENT: "/Document/GetDocumentAttachment?documentId=",
  GET_DOCUMENT_TASKS: "/Document/GetDocumentTasks?documentId=",

  UPDATE_DOCUMENT_TEMPLATE_NAME:
    "/DocumentTemplates/UpdateDocumentTemplateName?templateName=",

  // -------------Provider Location---------------
  ADD_PROVIDER_LOCATION: "/Site/CreateSite",
  GET_PROVIDER_LOCATION: "/Location/GetLocation?providerId=",
  DELETE_PROVIDER_LOCATION: "/Location/DeleteLocation",
  GET_LOCATION_BY_ID: "/Location/GetLocationById/",
  UPDATE_PROVIDER_LOCATION: "/Location/UpdateLocation",

  DELETE_SITE: "/Site/DeleteSite?id=",
  UPDATE_SITE: "/Site/UpdateSite",
  GET_SITE_BY_ID: "/Site/GetSiteById?id=",

  // -------------Staff---------------
  INSERT_STAFF: "/Staff/InsertStaff",
  GET_STAFF_LIST: "/Staff/GetStaff?isActive=",
  GET_AVAILABLE_STAFF: "/Staff/GetStaff?isActive=true",
  GET_STAFF_DDL_BY_CLINIC_ID: "/Staff/GetStaffDDLByClinicId",
  DELETE_STAFF: "/Staff/DeleteStaff?id=",
  GET_STAFF_BY_ID: "/Staff/GetStaffById?staffId=",
  UPDATE_STAFF: "/Staff/UpdateStaff",
  GET_ROLE: "/Staff/GetRole",
  GET_LOGIN_STAFF: "/Staff/GetLoginStaff",
  CREATE_STAFF_SIGNATURE: "/Staff/CreateStaffSignature",
  GET_STAFF_SIGNATURE: "/Staff/GetStaffSignature?staffId=",
  GET_USERNAME_AVAILABLE: "/Staff/IsUserNameAvailable?userName=",
  ACTIVE_STAFF: "/Staff/ActiveStaff?staffId=",
  UPLOAD_STAFF_PROFILE: "/Staff/UploadStaffProfile",
  GET_STAFF_PROFILE: "/Staff/GetStaffProfileImage?staffId=",
  GET_STAFF_BY_ROLE_IDS: "/Staff/getStaffByRoleIds",
  GET_TIMEZONE: "/Common/GetTimeZones",
  POST_STAFF_STORED_DOCUMENTS: "/Staff/InsertStaffStoredDocument",
  GET_STAFF_CASELOAD: "/Staff/GetStaffCaseload",
  POST_STAFF_CASELOAD: "/Staff/AssignClientsToStaffCaseload",
  GET_STAFF_SITES: "/Staff/GetStaffSites",
  POST_STAFF_SITES: "/Staff/AssignSitesToStaff",
  GET_STAFF_TRACK_TIME: "/Staff/GetStaffTrackTime",
  INSERT_STAFF_TRACK_TIME: "/Staff/InsertCustomStaffTrackTime",

  GET_FORMATTED_DATE: "/Common/GetFormattedDate?",

  ASSIGN_SERVICES_TO_STAFF: "/Staff/AssignServicesToStaff",
  GET_STAFF_ASSIGNED_SERVICES: "/Staff/GetStaffServices?staffId=",
  GET_STAFF_EXPIRING_CERTIFICATES:
    "/Staff/GetStaffExpiringCertificates?staffId=",

  ASSIGN_TAG_TO_STAFF_DOC: "/Staff/AssignTagToStaffDocument",

  REMOVE_STAFF_DOC_TAG: "/Staff/DeleteStaffDocumentTag?id=",
  GET_STAFF_TEMPLATES: "/Staff/GetStaffTemplates?staffId=",
  ASSIGN_TEMPLATE_TO_STAFF: "/Staff/AssignTemplateToStaff",
  GET_DOCUMENT_TEMPLATES_DDL: "/DocumentTemplates/GetDocumentTemplatesDDL",
  GET_STAFF_TEAM: "/Staff/GetStaffTeam",
  GET_STAFF_BILLING_PROFILE: "/Staff/GetStaffBillingProfileByStaffId?staffId=",
  INSERT_STAFF_BILLING_PROFILE: "/Staff/InsertStaffBillingProfile",
  // ------------------------Staff setting----------------------

  GET_STAFF_SETTING: "/Staff/GetStaffSettings?staffId=",
  ADD_STAFF_SETTING: "/Staff/AddStaffSettings",
  GET_STAFF_EMAIL_SETTINGS: "/Staff/GetStaffEmailSettings?staffId=",
  ADD_STAFF_EMAIL_SETTINGS: "/Staff/AddStaffEmailSettings",
  GET_STAFF_SMS_SETTINGS: "/Staff/GetStaffSMSSettings?staffId=",
  ADD_STAFF_SMS_SETTINGS: "/Staff/AddStaffSMSSettings",

  // -------------Insurance---------------
  INSERT_INSURANCE: "/Insurance/InsertClientInsurance",
  GET_INSURANCE_LIST: "/Insurance/GetAllClientInsurance",
  DELETE_INSURANCE: "/Insurance/DeleteClientInsurance?id=",
  GET_INSURANCE_BY_ID: "/Insurance/GetClientInsuranceById?id=",
  UPDATE_INSURANCE: "/Insurance/UpdateClientInsurance",
  GET_INSURANCE_TYPE: "/Insurance/GetInsuranceType?clinicId=",
  GET_CLIENT_CURRENT_INSURANCE:
    "/Insurance/GetClientCurrentInsurance?clientId=",

  // -------------Guardian---------------
  INSERT_CLIENT_GUARDIANS: "/Client/InsertClientGuardians",
  GET_CLIENT_GUARDIANS_BY_CLIENT_ID:
    "/Client/GetClientGuardiansByClientId?clientId=",
  DELETE_CLIENT_GUARDIANS: "/Client/DeleteClientGuardians?id=",
  UPDATE_CLIENT_GUARDIANS: "/Client/UpdateClientGuardians",
  GET_CLIENT_GETGUARDIANS_BY_ID: "/client/GetClientGuardiansById?id=",

  // -------------Physician---------------
  INSERT_CLIENT_PHYSICIAN: "/Client/CreateClientPhysician",
  GET_CLIENT_PHYSICIAN_BY_CLIENT_ID:
    "/Client/GetClientPhysicianByClientId?clientId=",
  DELETE_CLIENT_PHYSICIAN: "/Client/DeleteClientPhysician?id=",
  UPDATE_CLIENT_PHYSICIAN: "/Client/UpdateClientPhysician",
  GET_CLIENT_GETPHYSICIAN_BY_ID: "/client/GetClientPhysicianById?id=",

  // ----------------------------------staff Stored Documnet------------------------------------
  POST_STAFF_STORED_DOCUMNET: "/Staff/InsertStaffStoredDocument",
  GET_STAFF_STORED_DOCUMNET_BY_STAFFID:
    "/Staff/GetStaffStoredDocumentByStaffId?staffId=",
  GET_STAFF_STORED_DOCUMENT_BY_ID: "/Staff/GetStaffDocumentById",
  POST_ADD_ATTACHMENT_DOCUMNET: "/Staff/AddAttachmentToDocument",
  DELETE_STAFF_DOCUMENT: "/Staff/DeleteStaffDocument",
  DELETE_STAFF_ATTACHMENT: "/Staff/DeleteStaffAttachment",
  UPDATE_STAFF_DOCUMENET: "/Staff/UpdateStaffDocument",

  // -------------Client---------------
  ASSIGN_STAFF_TO_CLIENT: "/Client/AssignStaffsToClient",
  GET_CLIENT_ASSIGNED_STAFF: "/Client/GetClientAssignedStaff",
  ASSIGN_SERVICES_TO_CLIENT: "/Client/AssignServicesToClient",
  GET_CLIENT_ASSIGNED_SERVICES: "/Client/GetClientServices",
  INSERT_CLIENT: "/Client/CreateClient",
  GET_CLIENT_BY_CLINIC_ID: "/Client/GetClientByClinicId",
  DELETE_CLIENT: "/Client/DeleteClient?id=",
  UPDATE_CLIENT: "/Client/UpdateClient",
  GET_CLIENT_BY_ID: "/Client/GetClientById?id=",

  GET_CLIENT_ELIGIBILITY_BY_CLIENT_ID:
    "/Client/GetClientAllEligibilityCheck?clientId=",

  ASSIGN_SITE_TO_CLIENT: "/Client/AssignSiteToClient",
  UPLOAD_CLIENT_PROFILE: "/Client/UploadClientProfile",
  GET_CLIENT_PROFILE: "/Client/GetClientProfileImage?clientId=",
  GET_CLIENT_DDL_BY_CLINIC_ID: "/Client/GetClientDDLByClinicId?isActive=true",
  GET_CLIENTS_WITHOUT_CASELOAD:
    "/Client/GetAllClientsWithOutCaseload?clinicId=",
  GET_CLIENT_STATUS: "/Clinic/GetClientStatusByClinicId",

  CREATE_CLIENT_SIGNATURE: "/Client/InsertClientSignature",
  GET_CLIENT_SIGNATURE: "/Client/GetClientSignature?clientId=",
  GET_CLIENT_VITAL: "/Client/GetClientVitals?clientId=",
  GET_CLIENT_SITES_BY_CLIENTID: "/Client/GetClientSites?clientId=",
  INSERT_CLIENT_SIBLING: "/Client/InsertClientSibling",
  GET_CLIENT_SIBLING_BY_CLIENT_ID:
    "/Client/GetClientSiblingByClientId?clientId=",
  DELETE_CLIENT_SIBLING: "/Client/DeleteClientSibling?id=",
  GET_CLIENT_SIBLING_BY_ID: "/Client/GetClientSiblingById?id=",
  UPDATE_CLIENT_SIBLING: "/Client/UpdateClientSibling",
  REACTIVATE_CLIENT: "/Client/ReactivateClient",

  GET_CLIENT_DIAGNOSIS: "/Client/GetClientDiagnosis?clientID=",
  GET_CLIENTS_DIAGNOSIS: "/Client/GetClientsDiagnosis",
  POST_SEAL_DOCUMENT: "/Document/SealDocument",
  POST_DOCUMENT_RATING: "/Document/UpdateDocumentRating",
  LOCK_UNLOCK_DOCUMENTS: "/Document/LockUnlockDocuments",
  APPROVE_DISAPPROVE_DOCUMENTS: "/Document/ApproveOrDisapproveDocuments",

  POST_CLIENT_DIAGNOSIS: "/Client/InsertClientDiagnosis",
  DELETE_CLIENT_DIAGNOSIS: "/Client/DeleteClientDiagnosis?id=",
  UPDATE_CLIENT_DIAGNOSIS: "/Client/UpdateClientDiagnosis",
  REORDER_CLIENT_DIAGNOSIS: "/Client/ReorderClientDiagnosis",
  DELETE_VITAL: "/Client/DeleteClientVitals?id=",
  Add_VITAL: "/Client/InsertClientVitals",
  Add_TREATMENT_PLAN: "/Client/InsertTreatmentPlan",
  Add_TREATMENT_GOAL: "/Client/InsertGoal",
  UPDATE_TREATMENT_GOAL: "/Client/UpdateGoal",

  GET_CLIENT_FLAGS_BY_CLIENT_ID: "/Client/GetClientFlagByClientId?clientID=",
  ASSIGN_FLAG_TO_CLIENT: "/Client/AssignFlagToClient",
  REMOVE_CLIENT_FLAG: "/Client/DeleteClientFlag?id=",
  INSERT_ELIGIBILITY: "/Eligibility/CheckEligibility",

  ASSIGN_TAG_TO_CLIENT_DOC: "/Client/AssignTagToClientDocument",

  REMOVE_CLIENT_DOC_TAG: "/Client/DeleteClientDocumentTag?id=",

  GET_CLIENT_TREATMENT_PLAN_BY_CLIENT_ID:
    "/Client/GetTreatmentPlanByClientId?clientId=",
  GET_CLIENT_TREATMENT_GOAL_BY_PLAN_ID:
    "/Client/GetGoalByTreatmentPlanId?treatmentPlanId=",
  GET_CLIENT_DIAGNOSIS_BY_ID: "/Client/GetClientDiagnosisById",
  GET_CLIENT_INSURANCE_LIST: "/Insurance/GetAllClientInsurance?clientId=",
  GET_CLIENT_INSURANCE_TYPE: "/Insurance/GetInsuranceType",
  POST_CLIENT_INSURANCE: "/Insurance/InsertClientInsurance",
  UPDATE_CLIENT_INSURANCE: "/Insurance/UpdateClientInsurance",
  DELETE_CLIENT_INSURANCE: "/Insurance/DeleteClientInsurance",
  GET_CLIENT_INSURANCE_BY_ID: "/Insurance/GetClientInsuranceById?id=",
  GET_VITAL_BY_ID: "/Client/GetClientVitalsById?id=",
  UPDATE_Vital: "/Client/UpdateClientVitals/",
  ADD_OBJECTIVE: "/Client/InsertObjective",
  GET_PLAN_OBJECTIVE_BY_TREATMENT_PLAN_ID:
    "/Client/GetObjectiveByTreatmentPlanId?treatmentPlanId=",
  GET_INTERVENTION_BY_OBJECTIVE_ID:
    "/Client/GetInterventionByObjectiveId?objectiveId=",
  ADD_INTERVENTION: "/Client/InsertIntervention",
  GET_CLIENT_PLANS_BY_ID: "/Client/GetTreatmentPlanById?id=",
  UPDATE_TREATMENT_PLAN: "/Client/UpdateTreatmentPlan",
  GET_OBJECTIVE_BY_ID: "/Client/GetObjectiveById?id=",
  GET_OBJECTIVE_BY_GOAL_ID: "/Client/GetObjectiveByGoalId?goalId=",
  GET_DOCUMENTS_BY_CLIENT_ID: "/Document/GetDocumentDDLByClientId?clientId=",
  GET_DOCUMENTS_BY_DOCUMENT_ID: "/Document/GetLinkedDocumentByDocId?docId=",
  UPDATE_PLAN_OBJECTIVE: "/Client/UpdateObjective",
  GET_INTERVENTION_BY_ID: "/Client/GetInterventionById?id=",
  LINKED_DOCUMENTS: "/Document/LinkDocument",
  MARK_AS_REVIEWED: "/Document/MarkDocumentReviewed?documentId=",

  GET_QUESTIONNAIRE_BY_CLIENT_ID:
    "/Client/GetClientQuestionnaireByClientId?clientId=",
  LINKED_QUESTOINNAIRE: "/Document/LinkClientQuestionnaire",
  GET_QUESTIONNAIRE_BY_DOCUMENT_ID:
    "/Document/GetClientQuestionnaireByDocId?docId=",

  UPDATE_INTERVENTION: "/Client/UpdateIntervention",
  INSERT_CLIENT_MEDICATION: "/ClientMedication/InsertClientMedicationAdministrations",
  UPDATE_CLIENT_MEDICATION: "/ClientMedication/UpdateClientMedicationAdministrations",

  GET_CLIENT_MEDICATION_BY_CLIENT_ID:"/ClientMedication/GetClientMedicationAdministrationsByClientId?clientId=",
  DELETE_CLIENT_MEDICATION: "/ClientMedication/DeleteClientMedicationAdministrations?id=",

  GET_CLIENT_MEDICATION_BY_ID:"/ClientMedication/GetClientMedicationAdministrationsById?id=",

  INSERT_CLIENT_MED_NOTES: "/ClientMedication/InsertClientMedicationNotes",
  GET_CLIENT_MED_NOTES:"/ClientMedication/GetMedNotesByClientId?clientId=",


  DELETE_TREATMENT_PLAN: "/Client/DeleteTreatmentPlan?id=",
  DELETE_TREATMENT_GOAL: "/Client/DeleteGoal?id=",
  DELETE_TREATMENT_OBJECTIVE: "/Client/DeleteObjective?id=",
  DELETE_TREATMENT_INTERVENTION: "/Client/DeleteIntervention?id=",
  VALIDATE_CLIENT_PIN: "/Client/ValidatePin?",
  GET_QUESTIONS: "/Common/GetQuestionnaire",
  GET_QUESTIONS_BY_Id: "/Client/GetClientQuestionnaireById?id=",
  GET_QUESTION_BY_CLIENT_ID:
    "/Client/GetClientQuestionnaireByClientId?clientId=",
  INSERT_CLIENT_QUESTIONNAIRE: "/Client/InsertClientQuestionnaire",
  DELETE_QUESTIONNAIRE: "/Client/DeleteClientQuestionnaire?id=",

  // ---------------------------Signature-------------------------------------

  INSERT_CLIENT_TREATMENT_PLAN_SIGN: "/Signature/ApplyClientSignature",
  INSERT_STAFF_TREATMENT_PLAN_SIGN: "/Signature/ApplyStaffSignature",
  GET_CLIENT_TREATMENT_SIGN_BY_CLIENT_ID:
    "/Signature/GetClientTreatmentPlanSign?clientId=",
  GET_CLIENT_TREATMENT_SIGN_BY_PLAN_ID:
    "/Signature/GetClientTreatmentPlanSign?treatmentPlanId=",
  GET_STAFF_TREATMENT_SIGN_BY_CLIENT_ID:
    "/Signature/GetStaffTreatmentPlanSignature?clientId=",
  GET_STAFF_TREATMENT_SIGN_BY_PLAN_ID:
    "/Signature/GetStaffTreatmentPlanSignature?treatmentPlanId=",
  DELETE_CLIENT_PLAN_SIGN: "/Signature/DeleteClientSignature",
  DELETE_STAFF_PLAN_SIGN: "/Signature/DeleteStaffSignature",
  VALIDATE_STAFF_PIN: "/Staff/ValidatePin?pin=",
  GET_CLIENT_CURRENT_VITAL: "/Client/GetClientCurrentVital?clientId=",
  INSERT_AUTHORIZATION: "/Client/InsertAuthorization",
  GET_AUTHORIZATION_BY_CLIENT_ID: "/Client/GetAuthorizationByClientId",
  DELETE_AUTHORIZATION: "/Client/DeleteAuthorization?id=",
  GET_AUTHORIZATION_BY_ID: "/Client/GetAuthorizationById?id=",
  UPDATE_AUTHORIZATION: "/Client/UpdateAuthorization",
  GET_CLIENT_COMMUNICATION_PREF: "/Client/GetClientCommunicationPref?clientId=",
  POST_CLIENT_COMMUNICATION_PREF: "/Client/AddClientCommunicationPref",
  // ---------------------------Stored Document-------------------------------------
  POST_CLIENT_STORED_DOCUMENT: "/Client/InsertClientStoredDocument",
  POST_CLIENT_STORED_DOCUMENT_BY_CLIENT_ID:
    "/Client/GetClientStoredDocumentByClientId",
  POST_CLIENT_STORED_DOCUMENT_BY_ID: "/Client/GetClientDocumentById?docId=",
  POST_CLIENT_ATTACHED_DOCUMENT: "/Client/AddAttachmentToDocument",
  DELETE_CLIENT_DOCUMENT: "/Client/DeleteClientDocument?docId=",
  DELETE_CLIENT_ATTACHMENT: "/Client/DeleteClientAttachment",
  UPDATE_CLIENT_STORED_DOCUMENT: "/Client/UpdateClientStoredDocument",
  DELETE_CLIENT_STATUS: "/Clinic/DeleteClientStatus?id=",

  // --------------------------Emergence Contact --------------------------------

  ADD_EMERGENCY_CONTACT: "/Client/InsertEmergencyContacts",
  DELETE_EMERGENCY_CONTACT: "/Client/DeleteEmergencyContacts?id=",
  GET_EMERGENCY_CONTACT_BY_ID: "/Client/GetEmergencyContactsById",
  GET_EMERGENCY_CONTACT_BY_CLIENT_ID:
    "/Client/GetEmergencyContactsByClientId?clientId=",

  // -------------Common---------------s

  GET_GENDER: "/Common/GetGenders",
  GET_STATE: "/Common/GetState",
  GET_RACE: "/Common/GetRace",
  GET_SHIFTS: "/Common/GetShifts",
  GET_EVENT_STATUS: "/Common/GetEventStatus",
  GET_BILLINGUNIT: "/Common/GetBillingUnit",
  GET_ETHNICITY: "/Common/GetEthnicity",
  GET_SMOKING_STATUS: "/Common/GetSmokingStatusList",
  GET_MARITAL_STATUS: "/Common/GetMaritalStatus",
  GET_RELATIONS: "/Common/GetRelations",
  GET_DIAGNOSIS: "/Common/GetDiagnosisByDate?",
  GET_TREATMENTPLAN_STATUS: "/Common/GetTreatmentPlanStatuses",
  GET_AUTHORIZATION_STATUS: "/Common/GetAuthorizationStatuses",
  GET_COMMUNICATION_METHODS: "/Common/GetCommunicationMethods",
  GET_IMMUNIZATION: "/Common/GetImmunization",
  GET_ADMINISTRATION_SITE: "/Common/GetAdministrationSite",
  GET_ADMINISTRATION: "/Common/GetAdministrationRoute",
  GET_MANUFACTUREER: "/Common/GetManufacturer",
  GET_EDUCATION_LEVEL: "/Common/GetEducationLevel",
  GET_DISCHARGE_REASON: "/Common/GetDischargeReasons",
  GET_TIME_RECORDING_METHODS: "/Common/GetTimeRecordingMethods",
  GET_ALL_PLACE_OF_SERVICETYPE: "/Common/GetAllPlaceOfServiceType",
  GET_ALL_PAYERS: "/Common/GetAllPayers",
  // -------------Auth---------------s

  CHANGE_PASSWORD: "/Auth/ChangePassword",
  FORGOT_PASSWORD: "/Auth/ForgotPassword?userName=",

  SYNC_STAFF_STATUS: "/Staff/SyncStaffOnlineStatus",

  GET_CURRENTLY_LOGGEDIN_STAFF: "/Staff/GetCurrentlyLoggedInStaff",

  VERIFY_OTP: "/Auth/VerifyOTP",
  UPDATE_PASSWORD: "/Auth/UpdatePassword",
  LOGOUT_USER: "/Auth/LogOut",

  // -------------Ref Provider Settings---------------s

  INSERT_CLINIC_REFERRING_PROVIDER:
    "/ClinicReferringProvider/InsertClinicReferringProvider",
  GET_CLINIC_REFERRING:
    "/ClinicReferringProvider/GetClinicReferringProviderByClinicId?clinicId=",
  DELETE_CLINIC_REFERRING:
    "/ClinicReferringProvider/DeleteClinicReferringProvider?id=",
  REACTIVATE_CLINIC_REFERRING:
    "/ClinicReferringProvider/ReactivateReferringProvider?id=",
  GET_CLINIC_REF_BY_ID:
    "/ClinicReferringProvider/GetClinicReferringProviderById?id=",
  UPDATE_CLINIC_REFERRING_PROVIDER:
    "/ClinicReferringProvider/UpdateClinicReferringProvider",

  // -------------Telehealth Video---------------s

  GET_TELEHEALTH_TOKEN: "/Scheduler/GetTeleheathAccessToken",
  CLOSE_TELEHEALTH_SESSION: "/Scheduler/CloseTelehealthSession?roomId=",

  // -------------RefSource Settings---------------s

  INSERT_REF_SOURCE: "/ClinicReferralSource/InsertClinicReferralSource",
  GET_REF_SOURCE:
    "/ClinicReferralSource/GetClinicReferralSourceByClinicId?clinicId=",
  DELETE_REF_SOURCE: "/ClinicReferralSource/DeleteClinicReferralSource?id=",
  REACTIVATE_REF_SOURCE: "/ClinicReferralSource/ReactivateReferringSource?id=",
  GET_REF_SOURCE_BY_ID: "/ClinicReferralSource/GetClinicReferralSourceById?id=",
  UPDATE_REF_SOURCE: "/ClinicReferralSource/UpdateClinicReferralSource",

  UPDATE_CERTIFICATES: "/Clinic/UpdateClinicCertificates",
  DELETE_CERTIFICATE: "/Clinic/DeleteClinicCertificates?id=",
  INSERT_CERTIFICATES: "/Clinic/InsertClinicCertificates",

  // -------------Client Ref Source---------------s

  INSERT_CLIENT_REF_SOURCE: "/Referral/InsertClientReferralSource",
  GET_CLIENT_REF_SOURCE:
    "/Referral/GetClientReferralSourceByClientId?clientId=",
  INSERT_CLIENT_REF_PROVIDER: "/Referral/InsertClientReferralProvider",
  GET_CLIENT_REF_PROVIDER: "/Referral/GetClientReferralProvider?clientId=",

  UPLOAD_CLINIC_LOGO: "/Clinic/UpdateClinicLogo",
  GET_CLINIC_LOGO: "/Clinic/GetClinicLogo?clinicId=",

  // -------------Client Flags---------------s
  INSERT_CLIENT_FLAG: "/Clinic/InsertClinicClientFlags",
  GET_CLINIC_CLIENT_FLAGS: "/Clinic/GetClinicClientFlagsByClinicId?clinicId=",
  DELETE_FLAG: "/Clinic/DeleteClinicClientFlags?id=",
  GET_FLAG_BY_ID: "/Clinic/GetClinicClientFlagsById?id=",
  UPDATE_CLIENT_FLAG: "/Clinic/UpdateClinicClientFlags",

  // -------------Client Tags---------------s
  INSERT_CLINIC_TAG: "/Clinic/InsertClinicTags",
  GET_CLINIC_CLIENT_TAGS: "/Clinic/GetClinicTagsByClinicId?clinicId=",
  DELETE_TAG: "/Clinic/DeleteClinicTags?id=",
  GET_TAG_BY_ID: "/Clinic/GetClinicTagsById?id=",
  UPDATE_CLINIC_TAG: "/Clinic/UpdateClinicTags",

  // -------------Client Status----------------
  ADD_CLIENT_STATUS: "/Clinic/InsertClientStatus",

  // -------------Roles Permissions---------------s

  GET_ROLE_MODULES: "/RolesAndPermission/GetRoleModulePermissionAccess?roleId=",
  UPDATE_ROLE_PERMISSIONS:
    "/RolesAndPermission/UpdateRoleModulePermissionAccess",

  // -------------Site---------------
  GET_CLINIC_SITES: "/Site/GetClinicSites?clinicId=",
  GET_SITES: "/Site/GetClinicSites",
  Get_StaffGlobalView_Sites: "/Staff/GetStaffGlobalViewSites",
  SET_STAFF_DEFAULT_SITE: "/Staff/SetStaffDefaultSite",

  // -------------Service Manager---------------
  INSERT_Services: "/Service/InsertService",
  UPDATE_SERVICE: "/Service/UpdateService",

  GET_Services_BY_PROVIDER_ID: "/Service/GetClinicServices?clinicId=",
  DELETE_Services: "/Service/DeleteService?id=",
  UPDATE_SERVICE_RATES: "/Service/UpdateServiceRate",
  ADD_SERVICE_RATES: "/Service/InsertServiceRate",

  GET_Services_BY_ID: "/Service/GetServiceById?id=",
  DELETE_SERVICE_RATE: "/Service/DeleteServiceRate?id=",
  GET_SERVICERATE_BY_ID: "/Service/GetServiceRateById?id=",
  GET_SERVICE_REACTIVE: "/Service/ReActivateService?serviceId=",

  // -------------Scheduler---------------
  SCHEDULER: {
    GET_EVENTS: "/Scheduler/GetEvents",
    CREATE_EVENT: "/Scheduler/CreateEvent",
    UPDATE_EVENT: "/Scheduler/UpdateEvent",
    DELETE_EVENT: "/Scheduler/DeleteEvent?id=",
    UPDATE_STAFF_STATUS_COLOR: "/Scheduler/UpdateStaffStatusColor",
  },
  // -------------Messages---------------
  INSERT_MESSAGE: "/MessageCenter/InsertMessage",
  GET_STAFF_MESSAGES: "/MessageCenter/GetStaffMessages",
  GET_STAFF_MESSAGES_BY_ID: "/MessageCenter/GetStaffMessagesById",
  GET_PERSONAL_GROUP: "/MessageCenter/GetPersonalGroup",
  CREATE_PERSONAL_GROUP: "/MessageCenter/CreatePersonalGroup",
  DELETE_PERSONAL_GROUP: "/MessageCenter/DeletePersonalGroup",
  // GET_PERSONAL_GROUP_BY_ID: "/MessageCenter/GetPersonalGroupById",
  UPDATE_PERSONAL_GROUP: "/MessageCenter/UpdatePersonalGroup",
  GET_STAFF_BY_PG_IDS: "/MessageCenter/GetStaffByPersonalGroupIds",
  GET_UNREAD_COUNT: "/MessageCenter/GetUnreadCount",
  TRASH_MESSAGE: "/MessageCenter/TrashMessage",
  UN_TRASH_MESSAGE: "/MessageCenter/UnTrashMessage",
  DELETE_MESSAGE: "/MessageCenter/DeleteMessage",
  MARK_UN_READ: "/MessageCenter/MarkUnRead",
  MARK_READ: "/MessageCenter/MarkRead",
  MOVE_TO_CUSTOM_LABEL: "/MessageCenter/MoveToCustomLabel",
  MOVE_TO_INBOX: "/MessageCenter/MoveToInbox",
  GET_PERSONAL_LABEL: "/MessageCenter/GetPersonalLabel",
  CREATE_PERSONAL_LABEL: "/MessageCenter/CreatePersonalLabel",
  DELETE_PERSONAL_LABEL: "/MessageCenter/DeletePersonalLabel",
  UPDATE_PERSONAL_LABEL: "/MessageCenter/UpdatePersonalLabel",

  //-----------------Position------------------------
  POST_ADD_POSITION: "/StaffPositions/InsertStaffPosition",
  GET_POSITION_LIST: "/StaffPositions/GetStaffPositionByStaffId?staffId=",
  DELETE_POSITION: "/StaffPositions/DeleteStaffPosition?staffPositionId=",
  EDIT_POSITION: "/StaffPositions/UpdateStaffPosition",
  GET_POSITION_BY_ID: "/StaffPositions/GetStaffPositionById?staffPositionId=",

  // ----------------------Certificate--------------------------
  GET_CLINIC_CERTIFICATE: "/Clinic/GetClinicCertificates",
  POST_CLINIC_CERTIFICATE: "/Staff/InsertStaffCertification",
  GET_STAFF_CERTIFICATE: "/Staff/GetStaffCertificationByStaffId?staffId=",
  DELETE_STAFF_CERTIFICATE: "/Staff/DeleteStaffCertification?id=",
  UPDATE_STAFF_CERTIFICATE: "/Staff/UpdateStaffCertification",
  GET_STAFF_CERTIFICATE_BY_ID: "/Staff/GetStaffCertificationById?id=",

  // ------------------------------Task manager-------------------------
  INSERT_TASK: "/TaskManager/InsertTask",
  GET_ALL_TASKS_BY_SEARCH: "/TaskManager/GetAllTasks",
  UPDATE_TASK: "/TaskManager/UpdateTask",
  GET_TASK_BY_ID: "/TaskManager/GetTaskById?id=",
  MARK_TASK_COMPLETE: "/TaskManager/MarkTaskComplate",
  DELETE_TASK: "/TaskManager/DeleteTask?id=",
  INSERT_DISCUSSION: "/TaskManager/InsertTaskDiscussion",
  GET_TASK_DISCUSSION_BY_ID: "/TaskManager/GetTaskDiscussionById?id=",
  GET_TASK_DISCUSSION_BY_ASSIGNED_ID:
    "/TaskManager/GetTaskDiscussionByAssignedId?assignedToId=",
  DELETE_TASK_DISCUSSION: "/TaskManager/DeleteTaskDiscussion?id=",
  UPDATE_DISCUSSION: "/TaskManager/UpdateTaskDiscussion",
  UPDATE_TASK_STATUS: "/TaskManager/UpdateTaskStatus",
  // ------------------------------Contact notes----------------------
  INSERT_CONTACT_NOTES: "/Client/InsertContactNotes",
  UPDATE_CONTACT_NOTES: "/Client/UpdateContactNotes",
  DELETE_CONTACT_NOTES: "/Client/DeleteContactNotes?id=",
  GET_CONTACT_NOTES_BY_CLIENT_ID: "/Client/GetContactNotesByClientId?clientId=",
  GET_CONTACT_NOTES_BY_ID: "/Client/GetContactNotesById?id=",

  //  --------------------------------Employment----------------------------

  INSERT_CLIENT_EMPLOYEMENTS: "/Client/InsertClientEmployements",
  GET_CLIENT_EMPLOYEMENTS: "/Client/GetClientEmployements?clientId=",
  GER_CLIENT_EMPLOYEMENT_BY_ID: "/Client/GetClientEmployementById?Id=",
  UPDATE_CLIENT_EMPLOYEMENTS: "/Client/UpdateClientEmployements",
  DELETE_CLIENT_EMPLOYMENTS: "/Client/DeleteClientEmployements?id=",

  // ------------------------------Immunization--------------------------
  INSERT_CLIENT_IMMUNIZATION: "/ClientImmunization/InsertClientImmunization",
  UPDATE_CLIENT_IMMUNIZATION: "/ClientImmunization/UpdateClientImmunization",
  DELETE_CLIENT_IMMUNIZATION:
    "/ClientImmunization/DeleteClientImmunization?id=",
  GET_CLIENT_IMMUNIZATION_BY_CLIENT_ID:
    "/ClientImmunization/GetClientImmunizationByClientId?clientId=",
  GET_CLIENT_IMMUNIZATION_BY_ID:
    "/ClientImmunization/GetClientImmunizationById?id=",

  // ----------------------------------Education--------------------------------
  GET_CLIENT_EDUCATION: "/Client/GetClientEducation?clientId=",
  GET_CLIENT_EDUCATION_BY_ID: "/Client/GetClientEducationById?id=",
  INSERT_CLIENT_EDUCATION: "/Client/InsertClientEducation",
  UPDATE_CLIENT_EDUCATION: "/Client/UpdateClientEducation",
  DELETE_CLIENT_EDUCATION: "/Client/DeleteClientEducation?id=",

  // ---------------------------DisCharge-------------------------
  CREATE_DISCHARGE: "/Client/DischargeClient",
  GET_CLIENT_DISCHARGEINFOR: "/Client/GetClientDischargeInfo?clientId=",

  GET_DOC_PLACE_OF_SERVICE: "/Document/GetDocumentPrefPlaceOfServiceByClinicId",
  ASSIGN_DOC_PLACE_OF_SERVICE: "/Document/AssignPlaceOfServiceToClinic",
  GET_ALL_PLACE_OF_SERVICE: "/Common/GetAllPlaceOfServices",

  // --------------------------Dashboard------------------------------
  UPDATE_CLIENT_PRIMARY_CARE_PHYSICIAN:
    "/Client/UpdateClientPrimaryCarePhysician",
  GET_CLIENT_PRIMARY_CARE_PHYSICIAN:
    "/Client/GetClientPrimaryCarePhysician?clientId=",
  UPDATE_CLIENT_PEDIATRICATION: "/Client/UpdateClientPediatrician",
  GET_CLIENT_PEDIATRICATION: "/Client/GetClientPediatrician?clientId=",
  GET_CLINIC_DASHBOARD: "/Dashboard/GetClinicDashboard",
  GET_CLIENTS_BY_SITES: "/Dashboard/GetClientsBySite?returnTotCountOnly=true",

  GET_NO_SESSION_CLIENTS: "/Dashboard/GetClientsByLastSeen?",
  GET_CLIENT_BY_SITE: "/Dashboard/GetClientsBySite?",
  GET_CLIENT_BY_INSURANCE: "/Dashboard/GetClientsByInsurance?",
  GET_STAFF_NOT_LOGGEDIN: "/Staff/GetLoggedInStaffWithinDays?",
  GET_REMAINING_AUTH_UNITS: "/Dashboard/GetAuthRemainingUnitRange?",
  GET_CLIENT_FLAGS_CASELOAD: "/Dashboard/GetStaffClients",

  GET_DOCUMENT_REVIEWED_LIST: "/Dashboard/GetDocumentReviewList",

  GET_AUTH_EXPIRATION: "/Dashboard/GetAuthExpiringWithinDays?",

  // ---------------------------------Audit-----------------------------
  GET_STAFF_AUDIT_LOG_ACTIONS: "/Common/GetStaffAuditLogActions",
  GET_AUDIT_AFFECTED_SECTIONS: "/Common/GetAuditAffectedSections?id=",
  GET_CLIENT_AUDIT_LOG_ACTIONS: "/Common/GetClientAuditLogActions",
  GET_CLIENT_AUDIT_LOG: "/AuditLog/GetClientAuditLog",
  GET_CLINIC_AUDITLOG: "/AuditLog/GetClinicAuditLog",
  GET_STAFF_AUDIT_LOG: "/AuditLog/GetStaffAuditLog",

  // -------------------------------Service Auth--------------------
  GET_AUTH_BY_CLINIC: "/Client/GetAuthByClinic",

  // -------------------------------Clinic------------------------------
  GET_CLINIC_PAYERS: "/Clinic/GetClinicPayers?clinicId=",
  POST_CLINIC_PAYERS: "/Clinic/ClinicPayers",
  ASSIGN_STAFF_TO_STAFF: "/Staff/AssignStaffsToStaff",
  UPDATE_CLINIC: "/Clinic/UpdateClinic",
  GET_CLINIC: "/Clinic/GetClinicById?id=",
};

export default API_URLS;
