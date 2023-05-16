import "bootstrap/dist/css/bootstrap.min.css";
import { ErrorBoundary } from "react-error-boundary";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  Redirect,
} from "react-router-dom";
import {
  default as AddAuthorization,
  default as EditAuthorization,
} from "../src/app-modules/client/client-profile/authorization/add-authorization";
import ListAuthorization from "../src/app-modules/client/client-profile/authorization/list-authorization";
import TreatmentPlan from "../src/app-modules/client/client-profile/treatment-plan/list-treatment-plan";
import "../src/custom-css/nn-kendo.scss";
import "./App.css";
import ClientAudit from "./app-modules/audit/client-audit";
import ClinicAudit from "./app-modules/audit/clinic-audit";
import StaffAudit from "./app-modules/audit/staff-audit";
import AddClient from "./app-modules/client/add-client";
import AssignServiceToClient from "./app-modules/client/client-profile/assign-services/header";
import AssignStaffToClient from "./app-modules/client/client-profile/assign-staff/header";
import ClientDashboard from "./app-modules/client/client-profile/client-dashboard/client-dashboard";
import AddClientSignature from "./app-modules/client/client-profile/client-signature/add-client-signature";
import AddParentSignature from "./app-modules/client/client-profile/client-signature/add-parent-signature";
import ClientSignature from "./app-modules/client/client-profile/client-signature/client-signature";
import AddStoredDocuments from "./app-modules/client/client-profile/client-files/add-client-files";
import StoredDocuments from "./app-modules/client/client-profile/client-files/client-files";
import EditStoredDocuments from "./app-modules/client/client-profile/client-files/edit-client-files";
import ContactNotesList from "./app-modules/client/client-profile/contact-notes/list-contact-notes";
import AddCPInsurance from "./app-modules/client/client-profile/cp-insurance/add-insurance";
import EditInsurance from "./app-modules/client/client-profile/cp-insurance/edit-insurance";
import Insurance from "./app-modules/client/client-profile/cp-insurance/list-insurance";
import Diagnosis from "./app-modules/client/client-profile/diagnosis/diagnosis";
import Discharge from "./app-modules/client/client-profile/discharge/discharge";
import EducationList from "./app-modules/client/client-profile/education/list-education";
import EmploymentList from "./app-modules/client/client-profile/employement/list-employement";
import AddGuardian from "./app-modules/client/client-profile/guardian-parent/add-guardian";
import GuardianParent from "./app-modules/client/client-profile/guardian-parent/list-guardian";
import AddImmunization from "./app-modules/client/client-profile/immunization/add-immunization";
import ImmunizationDetails from "./app-modules/client/client-profile/immunization/immunization-details";
import ImmunizationList from "./app-modules/client/client-profile/immunization/list-immunization";
import EditImmunization from "./app-modules/client/client-profile/immunization/update-immunization";
import AddInsurance from "./app-modules/client/client-profile/insurance/add-insurance";
import InsuranceList from "./app-modules/client/client-profile/insurance/list-insurance";
import CreateQuestionnaire from "./app-modules/client/client-profile/questionnaire/create-questionnaire";
import Questionnaire from "./app-modules/client/client-profile/questionnaire/questionnaire";
import AddVital from "./app-modules/client/client-profile/vitals/add-vital";
import ClientVital from "./app-modules/client/client-profile/vitals/list-vital";
import ListClient from "./app-modules/client/list-client";
import AddPhysician from "./app-modules/client/physician/add-physician";
import Physician from "./app-modules/client/physician/list-physician";
import Eligibility from "./app-modules/client/client-profile/eligibility/eligibility-grid-list";
import AddClinic from "./app-modules/clinic/add-clinic";
import CertificationSettings from "./app-modules/clinic/certification-settings/certification-settings";
import clientStatus from "./app-modules/clinic/client-status/client-status-list";
import ClinicFlags from "./app-modules/clinic/clinic-flags/clinic-flags";
import ClinicPayersHeader from "./app-modules/clinic/clinic-payer/header";
import ClinicTags from "./app-modules/clinic/clinic-tags/clinic-tags";
import DocumentSettings from "./app-modules/clinic/document-settings/documents-settings";
import ListClinic from "./app-modules/clinic/list-clinic";
import ReferringProvider from "./app-modules/clinic/referring-provider/referring-list";
import ReferringSource from "./app-modules/clinic/referring-source/referring-source-list";
import Roles from "./app-modules/clinic/roles/roles";
import MedicationList from "./app-modules/client/client-profile/client-medication/list-medication";
import {
  default as AddMultipleClientAuth,
  default as EditMultipleClientAuth,
} from "./app-modules/clinic/service-auth/add-multiple-client-auth";
import ServiceAuthrization from "./app-modules/clinic/service-auth/service-auth-listing";
import AddSite from "./app-modules/clinic/site/add-site";
import ListSite from "./app-modules/clinic/site/list-site";
import UploadLogo from "./app-modules/clinic/upload-logo/upload-logo";
import Dashboard from "./app-modules/dashboard/dashboard";
import AddDocument from "./app-modules/documents/add-document";
import EditDocument from "./app-modules/documents/edit-document";
import ListDocuments from "./app-modules/documents/list-document";
import ListDocumentDrafts from "./app-modules/documents/list-document-draft";
import DocumentHistory from "./app-modules/documents/list-document-history";
import AddDocumentTemplate from "./app-modules/documents/template/add-document-template";
import AddDocumentTemplateByDnD from "./app-modules/documents/template/add-document-template-with-dnd";
import DocumentTemplateList from "./app-modules/documents/template/list-document-template";
import ListDocumentTemplateDrafts from "./app-modules/documents/template/list-document-template-draft";
import { ViewDocumentTemplate } from "./app-modules/documents/template/view-document-template";
import ViewDocument from "./app-modules/documents/view-document";
import EditedHistory from "./app-modules/documents/view-edited-history";
import ViewMultipleDocument from "./app-modules/documents/view-multi-document";
import LogIn from "./app-modules/logIn/logIn";
import Message from "./app-modules/messages/messages";
import NotFound from "./app-modules/notFound/notFound";
import NoteneticScheduler from "./app-modules/scheduler/scheduler";
import InternalServerError from "./app-modules/server-error-page/server-error-page";
import AddServices from "./app-modules/service/add-service";
import ServiceDetail from "./app-modules/service/detail-service";
import ServicesList from "./app-modules/service/list-service";
import AddStaff from "./app-modules/staff/add-staff";
import AssignServiceToStaff from "./app-modules/staff/assign-services/header";
import CaseloadHeader from "./app-modules/staff/caseload/Header";
import CertificateHeader from "./app-modules/staff/certificate/certificateHeader";
import DocumentTemplateHeader from "./app-modules/staff/document-template/Header";
import AssignDocumentTemplate from "./app-modules/staff/document-template/assign-document-template";
import ListStaff from "./app-modules/staff/list-staff";
import StaffPosition from "./app-modules/staff/position/staff-position";
import SettingHeader from "./app-modules/staff/setting/settingHeader";
import StaffSignature from "./app-modules/staff/signature/staff-signature";
import SitesHeader from "./app-modules/staff/sites/Header";
import EditStaff from "./app-modules/staff/staff-profile/edit-staff";
import StaffProfile from "./app-modules/staff/staff-profile/staff-profile";
import AddStaffStoredDocuments from "./app-modules/staff/staff-files/add-staff-files";
import EditStaffStoredDocuments from "./app-modules/staff/staff-files/edit-staff-file";
import StaffStoredDocuments from "./app-modules/staff/staff-files/staff-files";
import StaffTeamHeader from "./app-modules/staff/staff-team/header";
import TrackStaffTime from "./app-modules/staff/track-staff/track-staff-time";
import Task from "./app-modules/taskManager/task";
import TaskDiscussion from "./app-modules/taskManager/task-discussion";
import Protected from "./container/protected";
import ErrorFallback from "./control-components/error-boundry/error-boundry";
import Layout from "./control-components/layout/layout";
import Telehealth from "./control-components/telehealth/telehealth";
import AppRoutes from "./helper/app-routes";
import DEVELOPMENT_CONFIG from "./helper/config";
import { permissionEnum } from "./helper/permission-helper";
import APP_ROUTES from "./helper/app-routes";
import { userPermission } from "./helper/permission-helper";
import { useEffect } from "react";
import LandingPage from "./app-modules/landing-page/landing-page";

const PrivateRoutes = ({ token }) => {
  const userAccessPermission = useSelector((state) => state.userAccessPermission);
  const staffLoginInfo = useSelector((state) => state.getStaffReducer);

  return (
    <div>
      {token && (
        <Layout>
          <Routes>
            {/* <Route path="*" element={<h1 > 404 no url found  </h1>} /> */}

            {/* --------------------------- Add Clinic ------------------------------- */}

            <Route
              path={AppRoutes.LANDING_PAGE}
              element={<Protected Component={LandingPage} />}
            />
            <Route
              path={AppRoutes.ADD_CLINIC}
              element={<Protected Component={AddClinic} />}
            />

            {userPermission(staffLoginInfo?.roleId) && (
              <Route
                path={AppRoutes.REF_PROVIDER_SETTINGS}
                element={<Protected Component={ReferringProvider} />}
              />
            )}

            {userPermission(staffLoginInfo?.roleId) && (
              <Route
                path={AppRoutes.SETTINGS_UPLOAD_LOGO}
                element={<Protected Component={UploadLogo} />}
              />
            )}
            {userPermission(staffLoginInfo?.roleId) && (
              <Route
                path={AppRoutes.DOCUMENT_SETTINGS}
                element={<Protected Component={DocumentSettings} />}
              />
            )}

            {userPermission(staffLoginInfo?.roleId) && (
              <Route
                path={AppRoutes.CERTIFICATION_SETTINGS}
                element={<Protected Component={CertificationSettings} />}
              />
            )}
            {
              <Route
                path={AppRoutes.MEDICATION}
                element={<Protected Component={MedicationList} />}
              />
            }
            {userPermission(staffLoginInfo?.roleId) && (
              <Route
                path={AppRoutes.CLINIC_FLAGS}
                element={<Protected Component={ClinicFlags} />}
              />
            )}
            {userPermission(staffLoginInfo?.roleId) && (
              <Route
                path={AppRoutes.CLINIC_TAGS}
                element={<Protected Component={ClinicTags} />}
              />
            )}
            {userPermission(staffLoginInfo?.roleId) && (
              <Route
                path={AppRoutes.REF_SOURCE_SETTINGS}
                element={<Protected Component={ReferringSource} />}
              />
            )}
            <Route
              path={AppRoutes.ADD_TREATMENT_PLAN}
              element={<Protected Component={TreatmentPlan} />}
            />
            <Route
              path={AppRoutes.TASK_DISCUSSION}
              element={<Protected Component={TaskDiscussion} />}
            />

            {userAccessPermission[permissionEnum.MANAGE_CLIENT_SERVICES] && (
              <Route
                path={AppRoutes.ASSIGN_SERVICE_TO_CLIENT}
                element={<Protected Component={AssignServiceToClient} />}
              />
            )}

            <Route
              path={AppRoutes.UPDATE_CLINIC}
              element={<Protected Component={AddClinic} />}
            />
            <Route
              path={AppRoutes.GET_CLINIC}
              element={<Protected Component={ListClinic} />}
            />

            {userPermission(staffLoginInfo?.roleId) && (
              <Route
                path={AppRoutes.ADD_CLINIC_SITE}
                element={<Protected Component={AddSite} />}
              />
            )}

            {userPermission(staffLoginInfo?.roleId) && (
              <Route
                path={AppRoutes.GET_CLINIC_SITE}
                element={<Protected Component={ListSite} />}
              />
            )}
            <Route
              path={AppRoutes.UPDATE_SITE}
              element={<Protected Component={AddSite} />}
            />

            {userAccessPermission[permissionEnum.EDIT_CLIENT_PROFILE] && (
              <Route
                path={AppRoutes.ADD_CLIENT_VITAL}
                element={<Protected Component={AddVital} />}
              />
            )}

            <Route
              path={AppRoutes.GET_CLIENT_VITAL}
              element={<Protected Component={ClientVital} />}
            />

            <Route
              path={AppRoutes.ASSIGN_STAFF_TO_CLIENT}
              element={<Protected Component={AssignStaffToClient} />}
            />

            {userAccessPermission[permissionEnum.MANAGE_AUTHORIZATIONS] && (
              <Route
                path={AppRoutes.MULTIPLE_CLIENT_SERVICE_AUTH}
                element={<Protected Component={ServiceAuthrization} />}
              />
            )}

            {userAccessPermission[permissionEnum.MANAGE_AUTHORIZATIONS] && (
              <Route
                path={AppRoutes.ADD_MULTIPLE_CLIENT_AUTH}
                element={<Protected Component={AddMultipleClientAuth} />}
              />
            )}

            {userAccessPermission[permissionEnum.MANAGE_AUTHORIZATIONS] && (
              <Route
                path={AppRoutes.EDIT_MULTIPLE_CLIENT_AUTH}
                element={<Protected Component={EditMultipleClientAuth} />}
              />
            )}

            {/* -------------------------------Task manager---------------------------*/}
            <Route
              path={AppRoutes.TASK_MANAGER}
              element={<Protected Component={Task} />}
            />

            {/* --------------------------- Add Staff ------------------------------- */}

            {userAccessPermission[permissionEnum.ADD_STAFF] && (
              <Route
                path={AppRoutes.ADD_STAFF}
                element={<Protected Component={AddStaff} />}
              />
            )}

            <Route
              path={AppRoutes.GET_STAFF}
              element={<Protected Component={ListStaff} />}
            />

            <Route
              path={AppRoutes.TRACK_STAFF_TIME}
              element={<Protected Component={TrackStaffTime} />}
            />

            <Route
              path={AppRoutes.EDIT_STAFF_BY_ID}
              element={<Protected Component={AddStaff} />}
            />

            <Route
              path={AppRoutes.STAFF_PROFILE}
              element={<Protected Component={StaffProfile} />}
            />
            <Route
              path={AppRoutes.STAFF_SIGNATURE}
              element={<Protected Component={StaffSignature} />}
            />

            {userAccessPermission[permissionEnum.EDIT_STAFF_PROFILE] && (
              <Route
                path={AppRoutes.EDIT_STAFF}
                element={<Protected Component={EditStaff} />}
              />
            )}

            <Route
              path={AppRoutes.STAFF_POSITION}
              element={<Protected Component={StaffPosition} />}
            />
            <Route
              path={AppRoutes.STAFF_CASELOAD}
              element={<Protected Component={CaseloadHeader} />}
            />
            <Route
              path={AppRoutes.DOCUMENT_TEMPLATE_STAFF}
              element={<Protected Component={DocumentTemplateHeader} />}
            />
            <Route
              path={AppRoutes.ASSIGN_SERVICE_TO_STAFF}
              element={<Protected Component={AssignServiceToStaff} />}
            />
            <Route
              path={AppRoutes.STAFF_SITES}
              element={<Protected Component={SitesHeader} />}
            />
            <Route
              path={AppRoutes.STAFF_CERTIFICATE}
              element={<Protected Component={CertificateHeader} />}
            />
            <Route
              path={AppRoutes.STAFF_STORED_DOCUMENTS}
              element={<Protected Component={StaffStoredDocuments} />}
            />
            {userAccessPermission[permissionEnum.MANAGE_STAFF_FILES] && (
              <Route
                path={AppRoutes.STAFF_ADD_STORED_DOCUMENT}
                element={<Protected Component={AddStaffStoredDocuments} />}
              />
            )}

            {userAccessPermission[permissionEnum.MANAGE_STAFF_FILES] && (
              <Route
                path={AppRoutes.STAFF_EDIT_STORED_DOCUMENT}
                element={<Protected Component={EditStaffStoredDocuments} />}
              />
            )}

            <Route
              path={AppRoutes.STAFF_SETTING}
              element={<Protected Component={SettingHeader} />}
            />

            <Route
              path={AppRoutes.DOCUMENT_TEMPLATE_STAFF}
              element={<Protected Component={AssignDocumentTemplate} />}
            />
            <Route
              path={AppRoutes.STAFF_TEAM}
              element={<Protected Component={StaffTeamHeader} />}
            />
            {/* --------------------------- Dashbaord ------------------------------- */}
            <Route
              path={AppRoutes.DASHBOARD}
              element={<Protected Component={Dashboard} />}
            />

            {/* --------------------------- Add Client ------------------------------- */}

            {userAccessPermission[permissionEnum.ADD_CLIENTS] && (
              <Route
                path={AppRoutes.ADD_CLIENT}
                element={<Protected Component={AddClient} />}
              />
            )}

            <Route
              path={AppRoutes.GET_CLIENT}
              element={<Protected Component={ListClient} />}
            />

            <Route
              path={AppRoutes.CLIENT_DASHBOARD}
              element={<Protected Component={ClientDashboard} />}
            />

            <Route
              path={AppRoutes.CLIENT_SIGNATURE}
              element={<Protected Component={ClientSignature} />}
            />
            {userAccessPermission[permissionEnum.EDIT_CLIENT_PROFILE] && (
              <Route
                path={AppRoutes.ADD_CLIENT_SIGNATURE}
                element={<Protected Component={AddClientSignature} />}
              />
            )}

            {userAccessPermission[permissionEnum.EDIT_CLIENT_PROFILE] && (
              <Route
                path={AppRoutes.ADD_PARENT_SIGNATURE}
                element={<Protected Component={AddParentSignature} />}
              />
            )}

            <Route
              path={AppRoutes.AUTHORIZATION_LIST}
              element={<Protected Component={ListAuthorization} />}
            />

            {userAccessPermission[permissionEnum.MANAGE_AUTHORIZATIONS] && (
              <Route
                path={AppRoutes.AUTHORIZATION_ADD}
                element={<Protected Component={AddAuthorization} />}
              />
            )}

            {userAccessPermission[permissionEnum.MANAGE_AUTHORIZATIONS] && (
              <Route
                path={AppRoutes.AUTHORIZATION_EDIT}
                element={<Protected Component={EditAuthorization} />}
              />
            )}

            <Route
              path={AppRoutes.DIAGNOSIS}
              element={<Protected Component={Diagnosis} />}
            />
            <Route
              path={AppRoutes.INSURANCE}
              element={<Protected Component={Insurance} />}
            />

            {userAccessPermission[permissionEnum.MANAGE_CLIENT_FILES] && (
              <Route
                path={AppRoutes.ADD_STORED_DOCUMENTS}
                element={<Protected Component={AddStoredDocuments} />}
              />
            )}

            <Route
              path={AppRoutes.STORED_DOCUMENTS}
              element={<Protected Component={StoredDocuments} />}
            />

            {userAccessPermission[permissionEnum.MANAGE_CLIENT_FILES] && (
              <Route
                path={AppRoutes.EDIT_STRORED_DOCUMENT}
                element={<Protected Component={EditStoredDocuments} />}
              />
            )}

            <Route
              path={AppRoutes.CLIENT_CONTACT_NOTES}
              element={<Protected Component={ContactNotesList} />}
            />
            <Route
              path={AppRoutes.CLIENT_EMPLOYMENT}
              element={<Protected Component={EmploymentList} />}
            />
            <Route
              path={AppRoutes.CLIENT_GUARDIAN_LIST}
              element={<Protected Component={GuardianParent} />}
            />
            <Route
              path={AppRoutes.CLIENT_PHYSICIAN_LIST}
              element={<Protected Component={Physician} />}
            />

            <Route
              path={AppRoutes.CLIENT_ELIGIBILITY}
              element={<Protected Component={Eligibility} />}
            />

            {userAccessPermission[permissionEnum.EDIT_CLIENT_PROFILE] && (
              <Route
                path={AppRoutes.CLIENT_PHYSICIAN_ADD}
                element={<Protected Component={AddPhysician} />}
              />
            )}

            <Route
              path={AppRoutes.CLIENT_IMMUNIZATION}
              element={<Protected Component={ImmunizationList} />}
            />

            {userAccessPermission[permissionEnum.EDIT_CLIENT_PROFILE] && (
              <Route
                path={AppRoutes.ADD_IMMUNIZATION}
                element={<Protected Component={AddImmunization} />}
              />
            )}

            {userAccessPermission[permissionEnum.EDIT_CLIENT_PROFILE] && (
              <Route
                path={AppRoutes.EDIT_IMMUNIZATION}
                element={<Protected Component={EditImmunization} />}
              />
            )}

            <Route
              path={AppRoutes.DETAIL_IMMUNIZATION}
              element={<Protected Component={ImmunizationDetails} />}
            />
            <Route
              path={AppRoutes.CLIENT_EDUCATION}
              element={<Protected Component={EducationList} />}
            />

            {userAccessPermission[permissionEnum.EDIT_CLIENT_PROFILE] && (
              <Route
                path={AppRoutes.CLIENT_GUARDIAN_ADD}
                element={<Protected Component={AddGuardian} />}
              />
            )}

            {userAccessPermission[
              permissionEnum.DISCHARGE_REACTIVATE_CLIENT
            ] && (
              <Route
                path={AppRoutes.CLIENT_DISCHARGE}
                element={<Protected Component={Discharge} />}
              />
            )}
            <Route
              path={AppRoutes.QUESTIONNAIRE}
              element={<Protected Component={Questionnaire} />}
            />
            <Route
              path={AppRoutes.CREATE_QUESTIONNAIRE}
              element={<Protected Component={CreateQuestionnaire} />}
            />

            {/* --------------------------- Scheduler ------------------------------- */}
            <Route
              path={AppRoutes.SCHEDULER}
              element={<Protected Component={NoteneticScheduler} />}
            />

            {/* --------------------------- Add Insurance ------------------------------- */}
            <Route
              path={AppRoutes.ADD_INSURANCE}
              element={<Protected Component={AddInsurance} />}
            />
            <Route
              path={AppRoutes.GET_INSURANCE_LIST}
              element={<Protected Component={InsuranceList} />}
            />
            <Route
              path={AppRoutes.EDIT_INSURANCE_BY_ID}
              element={<Protected Component={AddStaff} />}
            />
            {userAccessPermission[permissionEnum.EDIT_CLIENT_PROFILE] && (
              <Route
                path={AppRoutes.ADD_CLIENT_INSURANCE}
                element={<Protected Component={AddCPInsurance} />}
              />
            )}

            {userAccessPermission[permissionEnum.EDIT_CLIENT_PROFILE] && (
              <Route
                path={AppRoutes.EDIT_CLIENT_INSURANCE}
                element={<Protected Component={EditInsurance} />}
              />
            )}

            {/* --------------------------- Add Service Manager ------------------------------- */}
            {userPermission(staffLoginInfo?.roleId) && (
              <Route
                path={AppRoutes.ADD_Services}
                element={<Protected Component={AddServices} />}
              />
            )}

            {userPermission(staffLoginInfo?.roleId) && (
              <Route
                path={AppRoutes.GET_SERVICE_BY_CLINICID}
                element={<Protected Component={ServicesList} />}
              />
            )}
            {userPermission(staffLoginInfo?.roleId) && (
              <Route
                path={AppRoutes.EDIT_Services_BY_ID}
                element={<Protected Component={AddServices} />}
              />
            )}

            {userPermission(staffLoginInfo?.roleId) && (
              <Route
                path={AppRoutes.GET_Services_BY_ID}
                element={<Protected Component={ServiceDetail} />}
              />
            )}

            <Route
              path={AppRoutes.UPDATE_INSURANCE}
              element={<Protected Component={AddStaff} />}
            />

            {/* <Route
                     path={AppRoutes.ADD_CLIENT_INSURANCE}
                     element={<Protected Component={AddClientInsurance} />}
                 /> */}
            <Route
              path={AppRoutes.GET_INSURANCE_LIST}
              element={<Protected Component={InsuranceList} />}
            />
            <Route
              path={AppRoutes.UPDATE_INSURANCE}
              element={<Protected Component={AddStaff} />}
            />

            {/*-------------------MESSAGE ----------------*/}
            <Route
              path={AppRoutes.MESSAGE}
              element={<Protected Component={Message} />}
            />

            {/* --------------------------- Roles ------------------------------- */}
            <Route
              path={AppRoutes.ROLES}
              element={<Protected Component={Roles} />}
            />

            {/*------------------- Document Templates ----------------*/}
            {userPermission(staffLoginInfo?.roleId) && (
              <Route
                path={AppRoutes.DOCUMENT_TEMPLATE_LIST}
                element={<Protected Component={DocumentTemplateList} />}
              />
            )}

            {userPermission(staffLoginInfo?.roleId) && (
              <Route
                path={AppRoutes.DOCUMENT_TEMPLATE_VIEW}
                element={<Protected Component={ViewDocumentTemplate} />}
              />
            )}
            {userPermission(staffLoginInfo?.roleId) && (
              <Route
                path={AppRoutes.DOCUMENT_TEMPLATE_ADD}
                element={<Protected Component={AddDocumentTemplate} />}
              />
            )}

            {userPermission(staffLoginInfo?.roleId) && (
              <Route
                path={AppRoutes.DOCUMENT_TEMPLATE_ADD_BY_DND}
                element={<Protected Component={AddDocumentTemplateByDnD} />}
              />
            )}

            {/*------------------- Document Template Drafts ----------------*/}
            {userPermission(staffLoginInfo?.roleId) && (
              <Route
                path={AppRoutes.DOCUMENT_TEMPLATE_DRAFT_LIST}
                element={<Protected Component={ListDocumentTemplateDrafts} />}
              />
            )}

            {/*------------------- Documents ----------------*/}
            <Route
              path={AppRoutes.DOCUMENT_LIST}
              element={<Protected Component={ListDocuments} />}
            />

            <Route
              path={AppRoutes.DOCUMENT_HISTORY}
              element={<Protected Component={DocumentHistory} />}
            />
            <Route
              path={AppRoutes.VIEW_DOCUMENT_EDIT_HISTORY}
              element={<Protected Component={EditedHistory} />}
            />
            <Route
              path={AppRoutes.DOCUMENT_VIEW}
              element={<Protected Component={ViewDocument} />}
            />
            <Route
              path={AppRoutes.DOCUMENT_MULTI_VIEW}
              element={<Protected Component={ViewMultipleDocument} />}
            />
            <Route
              path={AppRoutes.DOCUMENT_ADD}
              element={<Protected Component={AddDocument} />}
            />
            <Route
              path={AppRoutes.DOCUMENT_EDIT}
              element={<Protected Component={EditDocument} />}
            />
            <Route
              path={AppRoutes.DOCUMENT_DRAFT_LIST}
              element={<Protected Component={ListDocumentDrafts} />}
            />

            {/* -------------------------Clinic || Audit--------------------- */}
            {userPermission(staffLoginInfo?.roleId) && (
              <Route
                path={AppRoutes.STAFF_AUDIT}
                element={<Protected Component={StaffAudit} />}
              />
            )}
            {userPermission(staffLoginInfo?.roleId) && (
              <Route
                path={AppRoutes.CLIENT_AUDIT}
                element={<Protected Component={ClientAudit} />}
              />
            )}
            <Route
              path={AppRoutes.CLINIC_AUDIT}
              element={<Protected Component={ClinicAudit} />}
            />
            {userPermission(staffLoginInfo?.roleId) && (
              <Route
                path={AppRoutes.CLIENT_STATUS}
                element={<Protected Component={clientStatus} />}
              />
            )}

            {userPermission(staffLoginInfo?.roleId) && (
              <Route
                path={AppRoutes.CLINIC_PAYERS}
                element={<Protected Component={ClinicPayersHeader} />}
              />
            )}

            {/*------------------- Not Found ----------------*/}

            <Route path="*" element={<Protected Component={NotFound} />} />

            <Route
              path={AppRoutes.INTERNAL_SERVER_ERROR}
              element={<Protected Component={InternalServerError} />}
            />
          </Routes>
        </Layout>
      )}
    </div>
  );
};

const MainApp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!localStorage.getItem(DEVELOPMENT_CONFIG.TOKEN)) {
      navigate("/login");
    }
  }, []);

  let token = localStorage.getItem(DEVELOPMENT_CONFIG.TOKEN);
  if (location.pathname === "/") {
    if (token === null || "") {
      return <Navigate to={"/logIn"} />;
    }
    if (token !== null || "") {
      return <Navigate to={APP_ROUTES.DASHBOARD} />;
    }
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div>
        <Routes>
          <Route path="/logIn" element={<LogIn />} />
          <Route path={AppRoutes.TELEHEALTH} element={<Telehealth />} />
        </Routes>

        {location.pathname !== AppRoutes.TELEHEALTH && (
          <PrivateRoutes token={token} />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default MainApp;
