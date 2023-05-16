import ApiUrls from "../helper/api-urls";
import ApiHelper from "../helper/api-helper";
import moment from "moment";
import { Encrption } from "../app-modules/encrption";

const getClients = (
  take,
  pageSize,
  clinicId,
  finalValue,
  fields,
  clientLastFilter,
  isTrue,
  searchQuery,
  isActive,
  globalCheckValue,
  siteId,
  defaultSite,
  siteValue
) => {
  let isSelected = isTrue == null ? false : true;
  var data = {
    pageNumber: finalValue ? finalValue : 1,
    pageSize: take == null ? pageSize : take,
    clinicId: clinicId,
    firstName: isSelected
      ? ""
      : clientLastFilter
      ? clientLastFilter?.firstNameFilter
      : fields?.firstNameFilter,
    lastName: isSelected
      ? ""
      : clientLastFilter
      ? clientLastFilter?.lastNameFilter
      : fields?.lastNameFilter,
    searchContents: searchQuery ? searchQuery : "",
    isActive: isActive == true ? 0 : 1,
    genderId: fields?.genderFilter.id,
    siteId:
      globalCheckValue === true
        ? 0
        : siteId.siteId
        ? siteId.siteId
        : defaultSite
        ? defaultSite
        : siteValue[0].siteId,
  };

  // if (isSelected != true) {
  //   data["genderId"] = isSelected
  //     ? ""
  //     : clientLastFilter
  //     ? clientLastFilter?.genderFilter.id
  //     : fields?.genderFilter.id;
  // }

  return ApiHelper.postRequest(ApiUrls.GET_CLIENT_BY_CLINIC_ID, data);
};

const clientDelete = (id) => {
  return ApiHelper.deleteRequest(
    ApiUrls.DELETE_CLIENT + Encrption(id),
    null,
    true
  );
};

const getGender = () => {
  return ApiHelper.getRequest(ApiUrls.GET_GENDER);
};

const getTreatmentPlanStatus = () => {
  return ApiHelper.getRequest(ApiUrls.GET_TREATMENTPLAN_STATUS);
};

const getAuthorizationStatus = () => {
  return ApiHelper.getRequest(ApiUrls.GET_AUTHORIZATION_STATUS);
};

const getRace = () => {
  return ApiHelper.getRequest(ApiUrls.GET_RACE);
};

const getStates = () => {
  return ApiHelper.getRequest(ApiUrls.GET_STATE);
};

const getSites = (clinicId) => {
  return ApiHelper.getRequest(ApiUrls.GET_CLINIC_SITES + Encrption(clinicId));
};

const getRelations = () => {
  return ApiHelper.getRequest(ApiUrls.GET_RELATIONS);
};

const getEthnicity = () => {
  return ApiHelper.getRequest(ApiUrls.GET_ETHNICITY);
};

const getSmokingStatus = () => {
  return ApiHelper.getRequest(ApiUrls.GET_SMOKING_STATUS);
};

const getInsuranceList = () => {
  return ApiHelper.getRequest(ApiUrls.GET_INSURANCE_LIST);
};

const getClientsDDL = () => {
  return ApiHelper.getRequest(ApiUrls.GET_CLIENT_DDL_BY_CLINIC_ID);
};
const getClientStatus = () => {
  return ApiHelper.getRequest(ApiUrls.GET_CLIENT_STATUS);
};

const getClientDetail = (selectedClientId) => {
  return ApiHelper.getRequest(
    ApiUrls.GET_CLIENT_BY_ID + Encrption(selectedClientId)
  );
};

const getClientProfileImg = (selectedClientId) => {
  return ApiHelper.getRequest(
    ApiUrls.GET_CLIENT_PROFILE +
      Encrption(selectedClientId) +
      "&inBase64=" +
      true
  );
};

const getClientSites = (selectedClientId) => {
  return ApiHelper.getRequest(
    ApiUrls.GET_CLIENT_SITES_BY_CLIENTID + Encrption(selectedClientId)
  );
};

const getClientSiblings = (selectedClientId) => {
  return ApiHelper.getRequest(
    ApiUrls.GET_CLIENT_SIBLING_BY_CLIENT_ID + Encrption(selectedClientId)
  );
};

const deleteSiblingClient = (id) => {
  return ApiHelper.deleteRequest(
    ApiUrls.DELETE_CLIENT_SIBLING + Encrption(id),
    null,
    true
  );
};

const getClientSiblingById = (id) => {
  return ApiHelper.getRequest(ApiUrls.GET_CLIENT_SIBLING_BY_ID + Encrption(id));
};

const getClientPlansById = (id) => {
  return ApiHelper.getRequest(ApiUrls.GET_CLIENT_PLANS_BY_ID + Encrption(id));
};

const getObjectiveById = (id) => {
  return ApiHelper.getRequest(ApiUrls.GET_OBJECTIVE_BY_ID + Encrption(id));
};
const getObjectiveByGoalId = (id) => {
  return ApiHelper.getRequest(ApiUrls.GET_OBJECTIVE_BY_GOAL_ID + Encrption(id));
};

const getInterventionById = (id) => {
  return ApiHelper.getRequest(ApiUrls.GET_INTERVENTION_BY_ID + Encrption(id));
};

const getClientDiagnose = (selectedClientId) => {
  return ApiHelper.getRequest(
    ApiUrls.GET_CLIENT_DIAGNOSIS +
      Encrption(selectedClientId) +
      "&active=" +
      true
  );
};

const getClientInsurences = (selectedClientId) => {
  return ApiHelper.getRequest(
    ApiUrls.GET_CLIENT_INSURANCE_LIST + Encrption(selectedClientId)
  );
};

const getClientCurrentVitals = (selectedClientId) => {
  return ApiHelper.getRequest(
    ApiUrls.GET_CLIENT_CURRENT_VITAL + Encrption(selectedClientId)
  );
};

const getClientCurrentInsurance = (selectedClientId) => {
  return ApiHelper.getRequest(
    ApiUrls.GET_CLIENT_CURRENT_INSURANCE + Encrption(selectedClientId)
  );
};

const getClientFlags = (selectedClientId) => {
  return ApiHelper.getRequest(
    ApiUrls.GET_CLIENT_FLAGS_BY_CLIENT_ID + Encrption(selectedClientId)
  );
};

const saveClient = (fields, clinicId) => {
  let newDate = moment(fields.dob).format("YYYY-MM-DD");
  var data = {
    fName: fields.firstName,
    lName: fields.lastName,
    mName: fields.middleName,
    email: fields.email,
    genderId: fields.gender.id,
    dob: newDate,
    ssn: fields.socialSecurityNumber,
    clinicId: clinicId,
    homePhone: fields.mobilePhone,
    homeAddress: fields.addressOne,
    homeAddress2: fields.addressTwo,
    homeCity: fields.city,
    homeStateId: fields.state.id,
    homeZip: fields.zip,
    raceId: fields.raceId.id,
    nickName: fields.nickName,
    isActive: true,
  };
  return ApiHelper.postRequest(ApiUrls.INSERT_CLIENT, data);
};

const saveInsurance = (fields, clientId) => {
  var data = {
    clientId: clientId,
    dateStart: moment(fields.startDate).format("YYYY-MM-DD"),
    dateEnd: fields.endDate
      ? moment(fields.endDate).format("YYYY-MM-DD")
      : fields.endDate,
    policyNumber: fields.policyNumber,
    insuranceTypeId: fields.insuranceType.id,
  };
  return ApiHelper.postRequest(ApiUrls.INSERT_INSURANCE, data);
};

const uploadClientProfile = (profile, clinicId, selectedClientId) => {
  let bodyFormData = new FormData();
  bodyFormData.append("file", profile, profile.path);
  bodyFormData.append("clinicId", clinicId);
  bodyFormData.append("ClientId", selectedClientId);
  return ApiHelper.postRequest(ApiUrls.UPLOAD_CLIENT_PROFILE, bodyFormData);
};

const assignSiteToClient = (fields, clientId) => {
  let siteIds = [];
  fields.site.map((objType) => siteIds.push(objType.id));
  var data = {
    clientId: clientId,
    siteIds: siteIds,
  };

  return ApiHelper.postRequest(ApiUrls.ASSIGN_SITE_TO_CLIENT, data);
};

const addClientSibling = (fields, checked, clientId) => {
  var data = {
    clientId: clientId,
    sibFirstName: fields.firstName == "" ? "" : fields.firstName,
    sibLastName: fields.lastName == "" ? "" : fields.lastName,
    relationId:
      checked == "existing"
        ? fields.existingRelations.id
        : fields.newRelations.id,
    sibClientId: checked == "new" ? null : fields.sibClient.clientId,
  };

  return ApiHelper.postRequest(ApiUrls.INSERT_CLIENT_SIBLING, data);
};

const updateClientSibling = (fields, checked, clientId, siblingId) => {
  var data = {
    id: siblingId,
    clientId: clientId,
    sibFirstName: fields.firstName == "" ? "" : fields.firstName,
    sibLastName: fields.lastName == "" ? "" : fields.lastName,
    relationId:
      checked == "existing"
        ? fields.existingRelations.id
        : fields.newRelations.id,
    sibClientId: checked == "new" ? null : fields.sibClient.clientId,
  };

  return ApiHelper.putRequest(ApiUrls.UPDATE_CLIENT_SIBLING, data);
};

const reActivateClient = (clientId) => {
  var data = {
    clientId: clientId,
  };
  return ApiHelper.putRequest(ApiUrls.REACTIVATE_CLIENT, data);
};

const updateClient = (
  fields,
  selectedClientId,
  clinicId,
  socialSecurityNumber,
  mobilePhone,
  zipCode
) => {
  let feet = fields.feetHeight ? fields.feetHeight : "";
  let inch = fields.inchHeight ? fields.inchHeight : "";
  let raceIdd = fields.raceId ? fields.raceId.id : "";
  let genderIdd = fields.gender.id ? fields.gender.id : "";
  let stateIdd = fields.state.id ? fields.state.id : "";
  let total = feet * 12;

  var data = {
    id: selectedClientId,
    fName: fields.firstName,
    lName: fields.lastName,
    mName: fields.middleName,
    email: fields.email,
    genderId: genderIdd,
    dob:
      !fields.dob || fields.dob == null
        ? ""
        : moment(fields.dob).format("YYYY-MM-DD"),
    ssn: socialSecurityNumber.trim(),
    clinicId: clinicId,
    recordId: fields.recordId,
    homePhone: mobilePhone,
    homeAddress: fields.addressOne,
    homeAddress2: fields.addressTwo,
    homeCity: fields.city,
    homeStateId: parseInt(stateIdd),
    homeZip: zipCode,
    // "weight": fields.weight,
    // "height": parseInt(total) + parseInt(inch),
    raceId: raceIdd,
    hairColor: fields.hairColor,
    eyeColor: fields.eyeColor,
    nickName: fields.nickName,
    ethnicityId: fields.ethnicity.id,
    smokingStatusId: fields.smokingStatus.id,
    canCallHomePhone: fields.canCallHomePhone,
    canCallMobilePhone: fields.canCallMobilePhone,
    canSendTextSMS: fields.canSendTextSMS,
    canSendEmail: fields.canSendFax,
    dateStart:
      !fields.dateStart || fields.dateStart == null
        ? ""
        : moment(fields.dateStart).format("YYYY-MM-DD"),
    clientStatusId: fields.clientStatusId.id,
  };

  return ApiHelper.putRequest(ApiUrls.UPDATE_CLIENT, data);
};

const saveTreatmentPlan = (fields, clientId) => {
  let planDate = fields.planDate
    ? moment(fields.planDate).format("YYYY-MM-DD")
    : "";
  let startTime = fields.startTime
    ? moment(fields.startTime).format("hh:mm A")
    : null;
  let endTime = fields.endTime
    ? moment(fields.endTime).format("hh:mm A")
    : null;

  let planEndDate = fields.planEndDate
    ? moment(fields.planEndDate).format("YYYY-MM-DD")
    : "";

  var data = {
    clientId: clientId,
    planName: fields.planName,
    planDate: planDate,
    startTime: startTime,
    endTime: endTime,
    serviceId: fields?.selectedService?.id,
    billStatusId: "",
    activeParticipant: fields?.status,
    transitionDischargePlan: fields.transitionDischargePlan,
    planEndDate: planEndDate,
  };
  return ApiHelper.postRequest(ApiUrls.Add_TREATMENT_PLAN, data);
};

const saveTreatmentGoal = (fields, treatmentPlanId) => {
  //   let startDate = fields.startDate
  //   ? moment(fields.startDate).format("YYYY-MM-DD")
  //   : "";
  // let endDate = fields.endDate
  //   ? moment(fields.endDate).format("YYYY-MM-DD")
  //   : "";
  // let tartgetDate = fields.tartgetDate
  //   ? moment(fields.tartgetDate).format("YYYY-MM-DD")
  //   : "";
  var data = {
    treatmentPlanId: treatmentPlanId,
    goalName: fields.goalName,
    goalDescription: fields.goalDescription,
    statusId: fields.status.id,
    targetDate: fields.targetDate
      ? moment(fields.targetDate).format("MM/DD/yyyy")
      : "",
    startDate: fields.startDate
      ? moment(fields.startDate).format("MM/DD/yyyy")
      : "",
    endDate: fields.endDate ? moment(fields.endDate).format("MM/DD/yyyy") : "",
    comments: fields.comments,
  };
  return ApiHelper.postRequest(ApiUrls.Add_TREATMENT_GOAL, data);
};

const getClientTreatmentPlan = (selectedClientId, showInactivePlans = 1) => {
  return ApiHelper.getRequest(
    ApiUrls.GET_CLIENT_TREATMENT_PLAN_BY_CLIENT_ID +
      Encrption(selectedClientId) +
      "&showInactivePlans=" +
      showInactivePlans
  );
};

const getClientTreatmentGoal = (selectedPlanId) => {
  return ApiHelper.getRequest(
    ApiUrls.GET_CLIENT_TREATMENT_GOAL_BY_PLAN_ID + Encrption(selectedPlanId)
  );
};

const validateTreatmentPlanPin = (fields, pinCode, selectedClientId) => {
  let type = fields.signType == "Parent Signature" ? true : false;
  return ApiHelper.getRequest(
    ApiUrls.VALIDATE_CLIENT_PIN +
      "pin" +
      "=" +
      pinCode +
      "&" +
      "clientId" +
      "=" +
      Encrption(selectedClientId) +
      "&" +
      "isParentSig" +
      "=" +
      type
  );
};

const InsertClientTreatmentPlanSign = (fields, selectedClientId, planId) => {
  let newDate = moment(fields.signDate).format("YYYY-MM-DD");
  let newTime = moment(fields.signTime).format("HH:mm:ss");
  let dateTime = moment(`${newDate} ${newTime}`).format("YYYY-MM-DD HH:mm:ss");
  var data = {
    signatureType: "1",
    pin: fields.pinCode,
    sigDateTime: dateTime,
    isParent: fields.signType === "Parent Signature" ? true : false,
    clientId: selectedClientId,
    id: planId,
  };
  return ApiHelper.postRequest(ApiUrls.INSERT_CLIENT_TREATMENT_PLAN_SIGN, data);
};

const InsertStaffTreatmentPlanSign = (
  fields,
  selectedClientId,
  staffId,
  planId
) => {
  let newDate = moment(fields.signDate).format("YYYY-MM-DD");
  let newTime = moment(fields.signTime).format("HH:mm:ss");
  let dateTime = moment(`${newDate} ${newTime}`).format("YYYY-MM-DD HH:mm:ss");
  var data = {
    signatureType: "1",
    pin: fields.pinCode,
    sigDateTime: dateTime,
    clientId: selectedClientId,
    id: planId,
  };
  return ApiHelper.postRequest(ApiUrls.INSERT_STAFF_TREATMENT_PLAN_SIGN, data);
};

const InsertStaffDocumentSign = (pinCode, sigDate, sigTime, documentId) => {
  let newDate = moment(sigDate).format("YYYY-MM-DD");
  let newTime = moment(sigTime).format("HH:mm:ss");
  let dateTime = moment(`${newDate} ${newTime}`).format("YYYY-MM-DD HH:mm:ss");
  var data = {
    signatureType: "2",
    pin: pinCode,
    sigDateTime: dateTime,
    id: documentId,
  };
  return ApiHelper.postRequest(ApiUrls.INSERT_STAFF_TREATMENT_PLAN_SIGN, data);
};

const InsertClientDocumentSign = (
  pinCode,
  sigDate,
  sigTime,
  documentId,
  isParent,
  clientId
) => {
  let newDate = moment(sigDate).format("YYYY-MM-DD");
  let newTime = moment(sigTime).format("HH:mm:ss");
  let dateTime = moment(`${newDate} ${newTime}`).format("YYYY-MM-DD HH:mm:ss");
  var data = {
    signatureType: "2",
    pin: pinCode,
    sigDateTime: dateTime,
    isParent: isParent,
    clientId: clientId,
    id: documentId,
  };
  return ApiHelper.postRequest(ApiUrls.INSERT_CLIENT_TREATMENT_PLAN_SIGN, data);
};

const getClientTreatmentSignByClientId = (selectedClientId) => {
  return ApiHelper.getRequest(
    ApiUrls.GET_CLIENT_TREATMENT_SIGN_BY_CLIENT_ID + Encrption(selectedClientId)
  );
};

const getClientTreatmentSignByPlanId = (selectedPlanId) => {
  return ApiHelper.getRequest(
    ApiUrls.GET_CLIENT_TREATMENT_SIGN_BY_PLAN_ID + Encrption(selectedPlanId)
  );
};

const getStaffTreatmentSignByClientId = (selectedClientId) => {
  return ApiHelper.getRequest(
    ApiUrls.GET_STAFF_TREATMENT_SIGN_BY_CLIENT_ID + Encrption(selectedClientId)
  );
};

const getStaffTreatmentSignByPlanId = (selectedPlanId) => {
  return ApiHelper.getRequest(
    ApiUrls.GET_STAFF_TREATMENT_SIGN_BY_PLAN_ID + Encrption(selectedPlanId)
  );
};

const deleteClientPlanSignature = (selectedClientId, clientDetail) => {
  var data = {
    signatureType: "1",
    isParent: clientDetail?.isParent,
    id: clientDetail?.id,
  };
  return ApiHelper.postRequest(ApiUrls.DELETE_CLIENT_PLAN_SIGN, data);
};

const deleteStaffPlanSignature = (id, staffId) => {
  var data = {
    signatureType: "1",
    id: id,
  };
  return ApiHelper.postRequest(ApiUrls.DELETE_STAFF_PLAN_SIGN, data);
};

const getObjectives = (id) => {
  return ApiHelper.getRequest(
    ApiUrls.GET_PLAN_OBJECTIVE_BY_TREATMENT_PLAN_ID + id
  );
};

const getIntervention = (id) => {
  return ApiHelper.getRequest(ApiUrls.GET_INTERVENTION_BY_OBJECTIVE_ID + id);
};

const saveObjective = (fields, id) => {
  let startDate = fields.startDate
    ? moment(fields.startDate).format("YYYY-MM-DD")
    : "";
  let endDate = fields.endDate
    ? moment(fields.endDate).format("YYYY-MM-DD")
    : "";
  var data = {
    goalId: id,
    objective: fields.objective,
    startDate: startDate,
    endDate: endDate,
    statusId: fields.status.id,
  };
  return ApiHelper.postRequest(ApiUrls.ADD_OBJECTIVE, data);
};

const saveIntervention = (fields, id) => {
  var data = {
    objectiveId: id,
    statusId: fields.status.id,
    intervention: fields.intervention,
  };
  return ApiHelper.postRequest(ApiUrls.ADD_INTERVENTION, data);
};

const updateTreatmentPlan = (fields, selectedPlan) => {
  let planDate = fields.planDate
    ? moment(fields.planDate).format("YYYY-MM-DD")
    : "";
  let startTime = fields.startTime
    ? moment(fields.startTime).format("hh:mm A")
    : null;
  let endTime = fields.endTime
    ? moment(fields.endTime).format("hh:mm A")
    : null;
  let planEndDate = fields.planEndDate
    ? moment(fields.planEndDate).format("YYYY-MM-DD")
    : "";
  var data = {
    id: selectedPlan?.id,
    clientId: selectedPlan?.clientId,
    planName: fields?.planName,
    planDate: planDate,
    startTime: startTime,
    endTime: endTime,
    serviceId: fields?.selectedService?.id,
    billStatusId: "",
    activeParticipant: fields?.status,
    transitionDischargePlan: fields?.transitionDischargePlan,
    planEndDate: planEndDate,
  };

  return ApiHelper.putRequest(ApiUrls.UPDATE_TREATMENT_PLAN, data);
};

const updateTreatmentGoal = (fields, selectedGoal) => {
  var data = {
    id: selectedGoal.id,
    treatmentPlanId: selectedGoal.treatmentPlanId,
    goalName: fields.goalName,
    goalDescription: fields.goalDescription,
    statusId: fields.status.id,
    targetDate: fields.targetDate,
    startDate: fields.startDate,
    endDate: fields.endDate,
    comments: fields.comments,
  };
  return ApiHelper.putRequest(ApiUrls.UPDATE_TREATMENT_GOAL, data);
};

const updatePlanObjective = (fields, selectedObjective) => {
  let startDate = fields.startDate
    ? moment(fields.startDate).format("YYYY-MM-DD")
    : "";
  let endDate = fields.endDate
    ? moment(fields.endDate).format("YYYY-MM-DD")
    : "";
  var data = {
    id: selectedObjective.id,
    goalId: selectedObjective.goalId,
    objective: fields.objective,
    startDate: startDate,
    endDate: endDate,
    statusId: fields.status.id,
  };
  return ApiHelper.putRequest(ApiUrls.UPDATE_PLAN_OBJECTIVE, data);
};

const updateIntervention = (fields, selectedIntervention) => {
  var data = {
    id: selectedIntervention.id,
    objectiveId: selectedIntervention.objectiveId,
    intervention: fields.intervention,
    statusId: fields.status.id,
  };
  return ApiHelper.putRequest(ApiUrls.UPDATE_INTERVENTION, data);
};

const addMedication = (fields, selectedClientId) => {
  var data = {
    medicationName: fields.medicationName,
    dateAdministered: moment(fields.administerDate).format("YYYY-MM-DD"),
    dosage: fields.dosage,
    route: fields.route,
    initials: fields.initials,
    notes: fields.notes,
    clientId: selectedClientId,
  };
  return ApiHelper.postRequest(ApiUrls.INSERT_CLIENT_MEDICATION, data);
};

const updateMedication = (fields, selectedClientId, selectedMedId) => {
  var data = {
    medicationName: fields.medicationName,
    dateAdministered: moment(fields.administerDate).format("YYYY-MM-DD"),
    dosage: fields.dosage,
    route: fields.route,
    initials: fields.initials,
    notes: fields.notes,
    clientId: selectedClientId,
    id: selectedMedId,
  };
  return ApiHelper.putRequest(ApiUrls.UPDATE_CLIENT_MEDICATION, data);
};

const addMedNotes = (fields, id) => {
  var data = {
    clientId: id,
    medNotes: fields.notes,
  };
  return ApiHelper.postRequest(ApiUrls.INSERT_CLIENT_MED_NOTES, data);
};

const deleteTreatmentPlans = (id, planEndDate) => {
  return ApiHelper.deleteRequest(
    ApiUrls.DELETE_TREATMENT_PLAN +
      id +
      (planEndDate ? "&planEndDate=" + planEndDate : ""),
    null,
    true
  );
};
const deleteTreatmentGoals = (id) => {
  return ApiHelper.deleteRequest(
    ApiUrls.DELETE_TREATMENT_GOAL + id,
    null,
    true
  );
};

const deleteTreatmentObjective = (id) => {
  return ApiHelper.deleteRequest(
    ApiUrls.DELETE_TREATMENT_OBJECTIVE + id,
    null,
    true
  );
};

const deleteTreatmentIntervention = (id) => {
  return ApiHelper.deleteRequest(
    ApiUrls.DELETE_TREATMENT_INTERVENTION + id,
    null,
    true
  );
};

const saveAuthorization = (fields, selectedClientId, staffId, location) => {
  let serviceIds = [];
  fields.authServices.map((objType) => serviceIds.push(objType.id));
  let effectiveDate = fields.effectiveDate
    ? moment(fields.effectiveDate).format("YYYY-MM-DD")
    : "";
  let endDate = fields.endDate
    ? moment(fields.endDate).format("YYYY-MM-DD")
    : "";
  let dateAuth = fields.dateAuth
    ? moment(fields.dateAuth).format("YYYY-MM-DD")
    : "";
  let submittedDate = fields.submittedDate
    ? moment(fields.submittedDate).format("YYYY-MM-DD")
    : "";

  var data = {
    clientId: selectedClientId ? selectedClientId : fields.clientId.id,
    effectiveDate: effectiveDate,
    endDate: endDate,
    numUnits: fields.numUnits,
    dateAuth: dateAuth,
    authStatusId: fields.authStatus.id,
    dateSubmitted: submittedDate,
    submittedBy: fields.submittedBy.id,
    comments: fields.comments,
    custAuthId: fields.custAuthId,
    staffId: staffId,
    serviceIds: serviceIds,
    isEnforceValidation: fields.isEnforceValidation,
    freqNumUnits: fields.freqNumUnits,
    frequency: fields.frequency.key,
  };
  return ApiHelper.postRequest(ApiUrls.INSERT_AUTHORIZATION, data);
};

const getAuthByClientId = (take, pageSize, finalValue, selectedClientId) => {
  var data = {
    pageNumber: finalValue ? finalValue : 1,
    pageSize: take == null ? pageSize : take,
    clientId: selectedClientId,
  };
  return ApiHelper.postRequest(ApiUrls.GET_AUTHORIZATION_BY_CLIENT_ID, data);
};

const authorizationDelete = (id) => {
  return ApiHelper.deleteRequest(
    ApiUrls.DELETE_AUTHORIZATION + Encrption(id),
    null,
    true
  );
};

const getAuthById = (id) => {
  return ApiHelper.getRequest(ApiUrls.GET_AUTHORIZATION_BY_ID + Encrption(id));
};

const updateAuthorization = (
  fields,
  selectedClientId,
  staffId,
  authId,
  location
) => {
  let serviceIds = [];
  fields.authServices.map((objType) => serviceIds.push(objType.id));
  let effectiveDate = fields.effectiveDate
    ? moment(fields.effectiveDate).format("YYYY-MM-DD")
    : "";
  let endDate = fields.endDate
    ? moment(fields.endDate).format("YYYY-MM-DD")
    : "";
  let dateAuth = fields.dateAuth
    ? moment(fields.dateAuth).format("YYYY-MM-DD")
    : "";
  let submittedDate = fields.submittedDate
    ? moment(fields.submittedDate).format("YYYY-MM-DD")
    : "";

  var data = {
    id: authId,
    clientId: selectedClientId ? selectedClientId : fields.clientId.id,
    effectiveDate: effectiveDate,
    endDate: endDate,
    numUnits: fields.numUnits,
    dateAuth: dateAuth,
    authStatusId: fields.authStatus.id,
    dateSubmitted: submittedDate,
    submittedBy: fields.submittedBy.id,
    comments: fields.comments,
    custAuthId: fields.custAuthId,
    staffId: staffId,
    serviceIds: serviceIds,
    isEnforceValidation: fields.isEnforceValidation,
    freqNumUnits: fields.freqNumUnits,
    frequency: fields.frequency.key,
  };
  return ApiHelper.putRequest(ApiUrls.UPDATE_AUTHORIZATION, data);
};

const getStaffDDLByClinicId = () => {
  return ApiHelper.getRequest(ApiUrls.GET_STAFF_DDL_BY_CLINIC_ID);
};

const assignFlagToClient = (fields, id) => {
  var data = {
    clientId: id,
    flagId: fields.flagName.id,
  };
  return ApiHelper.postRequest(ApiUrls.ASSIGN_FLAG_TO_CLIENT, data);
};

const postEligibility = (fields) => {
  var data = {
    // submitterId: 1,
    // placeOfService: fields.placeOfService?.id,
    asOfDate: fields?.fromDate
      ? moment(fields.fromDate).format("MM/DD/yyyy")
      : "",
    toDate: fields?.toDate ? moment(fields.toDate).format("MM/DD/yyyy") : "",
    // serviceType:fields.serviceType,
    // procedureCode:fields.procedureCode,
    memberId: fields.policyNumber,
    // medicaidId: fields.medicaidId,
    patientLastName: fields.patientLastName,
    patientFirstName: fields.patientFirstName,
    // patientMiddleName: fields.patientMiddleName,
    // patientSuffix: fields.patientSuffix,
    patientBirthDate: fields?.patientBirthDate
      ? moment(fields.patientBirthDate).format("MM/DD/yyyy")
      : "",
    patientGender: fields.patientGender?.id,
    // patientState: fields.patientState?.id,
    subscriberRelationship: fields.subscriberRelationship?.id,
    payerId: fields.payer?.id,
    // groupNumber: fields.groupNumber
  };
  return ApiHelper.postRequest(ApiUrls.INSERT_ELIGIBILITY, data);
};

const removeClientFlags = (id) => {
  return ApiHelper.deleteRequest(
    ApiUrls.REMOVE_CLIENT_FLAG + Encrption(id),
    null,
    true
  );
};

const assignTagToClientDocument = (fields, docId) => {
  let tagIds = [];
  fields.tagName.map((objType) => tagIds.push(objType.id));
  var data = {
    docId: docId,
    tagIds: tagIds,
  };
  return ApiHelper.putRequest(ApiUrls.ASSIGN_TAG_TO_CLIENT_DOC, data);
};

const removeClientDocTags = (id) => {
  return ApiHelper.deleteRequest(
    ApiUrls.REMOVE_CLIENT_DOC_TAG + Encrption(id),
    null,
    true
  );
};

const getQuestions = () => {
  return ApiHelper.getRequest(ApiUrls.GET_QUESTIONS);
};

const getQuestionsById = (id) => {
  return ApiHelper.postRequest(ApiUrls.GET_QUESTIONS_BY_Id + id);
};

const getQuestionsListByClientId = (clientId) => {
  return ApiHelper.getRequest(ApiUrls.GET_QUESTION_BY_CLIENT_ID + clientId);
};

const insertClientQuestionnaire = (
  selectedClientId,
  totalSum,
  listItems,
  questionId
) => {
  const postData = listItems.map(({ questionId, value, checked }) => ({
    questionId,
    value,
  }));

  var data = {
    clientId: selectedClientId,
    questionnaireId: questionId,
    score: totalSum,
    dataObject: postData,
  };

  return ApiHelper.postRequest(ApiUrls.INSERT_CLIENT_QUESTIONNAIRE, data);
};

const insertClientModdQuestionnaire = (
  selectedClientId,
  totalSum,
  listItems,
  questionId
) => {
  const postData = listItems.map(
    ({ questionId, value, checked, type }, idx) => ({
      questionId,
      value: idx === 0 ? JSON.stringify(value) : value,
      checked,
      type,
    })
  );

  var data = {
    clientId: selectedClientId,
    questionnaireId: questionId,
    score: totalSum,
    dataObject: postData,
  };
  return ApiHelper.postRequest(ApiUrls.INSERT_CLIENT_QUESTIONNAIRE, data);
};

export const ClientService = {
  getClients,
  clientDelete,
  getGender,
  getRace,
  getStates,
  saveClient,
  saveInsurance,
  assignSiteToClient,
  getEthnicity,
  updateClient,
  getClientDetail,
  getClientProfileImg,
  uploadClientProfile,
  getSites,
  getInsuranceList,
  getClientSites,
  getRelations,
  addClientSibling,
  getClientSiblings,
  getClientsDDL,
  deleteSiblingClient,
  getClientSiblingById,
  updateClientSibling,
  getSmokingStatus,
  saveTreatmentPlan,
  saveTreatmentGoal,
  updateTreatmentGoal,
  getClientTreatmentPlan,
  getClientTreatmentGoal,
  saveObjective,
  getObjectives,
  getIntervention,
  saveIntervention,
  getTreatmentPlanStatus,
  getClientPlansById,
  updateTreatmentPlan,
  getObjectiveById,
  getObjectiveByGoalId,
  updatePlanObjective,
  getInterventionById,
  updateIntervention,
  deleteTreatmentPlans,
  deleteTreatmentGoals,
  deleteTreatmentObjective,
  deleteTreatmentIntervention,
  getClientDiagnose,
  getClientInsurences,
  getClientCurrentVitals,
  getClientCurrentInsurance,
  saveAuthorization,
  getAuthorizationStatus,
  getAuthByClientId,
  authorizationDelete,
  getAuthById,
  updateAuthorization,
  getStaffDDLByClinicId,
  reActivateClient,
  validateTreatmentPlanPin,
  getClientTreatmentSignByClientId,
  getClientTreatmentSignByPlanId,
  InsertClientTreatmentPlanSign,
  getStaffTreatmentSignByClientId,
  getStaffTreatmentSignByPlanId,
  InsertStaffTreatmentPlanSign,
  deleteClientPlanSignature,
  deleteStaffPlanSignature,
  getClientFlags,
  assignFlagToClient,
  removeClientFlags,
  assignTagToClientDocument,
  removeClientDocTags,
  InsertStaffDocumentSign,
  InsertClientDocumentSign,
  getClientStatus,
  getQuestions,
  getQuestionsListByClientId,
  insertClientQuestionnaire,
  postEligibility,
  getQuestionsById,
  insertClientModdQuestionnaire,
  addMedication,
  addMedNotes,
  updateMedication,
};
