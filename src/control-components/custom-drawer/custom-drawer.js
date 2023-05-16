import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { SELECTED_DRAWER_ROUTE } from "../../actions";
import "../../custom-css/custom-style.css";
import AppRoutes from "../../helper/app-routes";
import { permissionEnum } from "src/helper/permission-helper";

const CustomDrawer = (props) => {
  const [selectedTab, setSelectedTab] = React.useState(1);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const userAccessPermission = useSelector(
    (state) => state.userAccessPermission
  );

  const newPath = location.pathname.toLowerCase();
  let d = newPath.split("/");
  let primaryPath = d[1];

  const clinicSettings = [
    {
      id: "1",
      name: " Clinic Info",
      route: AppRoutes.SETTINGS_UPLOAD_LOGO,
    },
    {
      id: "2",
      name: "Document Settings",
      route: AppRoutes.DOCUMENT_SETTINGS,
    },
    {
      id: "3",
      name: "Certifications",
      route: AppRoutes.CERTIFICATION_SETTINGS,
    },
    {
      id: "4",
      name: "Client Flags",
      route: AppRoutes.CLINIC_FLAGS,
    },
    {
      id: "5",
      name: "Tags",
      route: AppRoutes.CLINIC_TAGS,
    },
    {
      id: "6",
      name: "Client Status",
      route: AppRoutes.CLIENT_STATUS,
    },
    {
      id: "7",
      name: "Referring Provider",
      route: AppRoutes.REF_PROVIDER_SETTINGS,
    },
    {
      id: "8",
      name: "Referring Source",
      route: AppRoutes.REF_SOURCE_SETTINGS,
    },
    {
      id: "8",
      name: "Clinic Payers",
      route: AppRoutes.CLINIC_PAYERS,
    },
  ];

  let clientMenu = [
    {
      id: "1",
      name: "Dashboard",
      route: AppRoutes.CLIENT_DASHBOARD,
    },
    {
      id: "2",
      name: "Signature",
      route: AppRoutes.CLIENT_SIGNATURE,
    },
    {
      id: "3",
      name: "Insurance",
      route: AppRoutes.INSURANCE,
    },
    {
      id: "4",
      name: "Eligibility",
      route: AppRoutes.CLIENT_ELIGIBILITY,
    },
    {
      id: "5",
      name: "Diagnosis",
      route: AppRoutes.DIAGNOSIS,
    },
    {
      id: "6",
      name: "Medication Administrations",
      route: AppRoutes.MEDICATION,
    },
    {
      id: "7",
      name: "Vitals",
      route: AppRoutes.GET_CLIENT_VITAL,
    },
  ];
  if (userAccessPermission[permissionEnum.MANAGE_CLIENT_SERVICES]) {
    clientMenu.push({
      id: "8",
      name: "Services",
      route: AppRoutes.ASSIGN_SERVICE_TO_CLIENT,
    });
  }
  clientMenu.push(
    ...[
      {
        id: "9",
        name: "Treatment Plan",
        route: AppRoutes.ADD_TREATMENT_PLAN,
      },

      {
        id: "10",
        name: "Authorizations",
        route: AppRoutes.AUTHORIZATION_LIST,
      },
      {
        id: "11",
        name: "Assigned Staff",
        route: AppRoutes.ASSIGN_STAFF_TO_CLIENT,
      },
      {
        id: "12",
        name: "Questionnaire",
        route: AppRoutes.QUESTIONNAIRE,
      },

      {
        id: "13",
        name: "Physician",
        route: AppRoutes.CLIENT_PHYSICIAN_LIST,
      },
      {
        id: "14",
        name: "Employment",
        route: AppRoutes.CLIENT_EMPLOYMENT,
      },
      {
        id: "15",
        name: "Education",
        route: AppRoutes.CLIENT_EDUCATION,
      },
      {
        id: "16",
        name: "Parent/Guardian",
        route: AppRoutes.CLIENT_GUARDIAN_LIST,
      },
      {
        id: "17",
        name: "Contact Notes",
        route: AppRoutes.CLIENT_CONTACT_NOTES,
      },
      {
        id: "18",
        name: "Immunization",
        route: AppRoutes.CLIENT_IMMUNIZATION,
      },

      {
        id: "19",
        name: "Files",
        route: AppRoutes.STORED_DOCUMENTS,
      },
    ]
  );
  if (userAccessPermission[permissionEnum.DISCHARGE_REACTIVATE_CLIENT]) {
    clientMenu.push({
      id: "20",
      name: "Discharge",
      route: AppRoutes.CLIENT_DISCHARGE,
    });
  }

  const staffMenu = [
    {
      id: "1",
      name: "Dashboard",
      route: AppRoutes.STAFF_PROFILE,
    },
    {
      id: "2",
      name: "Signature",
      route: AppRoutes.STAFF_SIGNATURE,
    },
    {
      id: "3",
      name: "Positions",
      route: AppRoutes.STAFF_POSITION,
    },
    {
      id: "4",
      name: "Caseload",
      route: AppRoutes.STAFF_CASELOAD,
    },
    {
      id: "5",
      name: "Sites",
      route: AppRoutes.STAFF_SITES,
    },
    {
      id: "6",
      name: "Certifications",
      route: AppRoutes.STAFF_CERTIFICATE,
    },
    {
      id: "7",
      name: "Files",
      route: AppRoutes.STAFF_STORED_DOCUMENTS,
    },
    {
      id: "8",
      name: "Services",
      route: AppRoutes.ASSIGN_SERVICE_TO_STAFF,
    },
    {
      id: "9",
      name: "Templates",
      route: AppRoutes.DOCUMENT_TEMPLATE_STAFF,
    },
    {
      id: "10",
      name: "Staff Team",
      route: AppRoutes.STAFF_TEAM,
    },
    {
      id: "11",
      name: "Settings",
      route: AppRoutes.STAFF_SETTING,
    },
  ];

  let values =
    primaryPath === "client"
      ? clientMenu
      : primaryPath === "settings"
      ? clinicSettings
      : staffMenu;

  const handleRouteChange = (obj) => {
    setSelectedTab(obj.id);
    navigate(obj.route);
    dispatch({
      type: SELECTED_DRAWER_ROUTE,
      payload: obj,
    });
  };

  return (
    <div className="side-bar-left">
      <nav className="navbar-nav">
        <ul className="list-unstyled mb-0">
          <li className="nav-items">
            <a href="" className="items-list">
              {primaryPath.charAt(0).toUpperCase() + primaryPath.slice(1)}
            </a>
            <ul className="drop-down-list list-unstyled mb-0  white-scroll">
              {values.map((obj, i) => (
                <li
                  key={i}
                  onClick={() => handleRouteChange(obj)}
                  className={
                    location.pathname == obj.route
                      ? "drop-list active"
                      : "drop-list"
                  }
                >
                  <a> {obj.name}</a>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default CustomDrawer;
