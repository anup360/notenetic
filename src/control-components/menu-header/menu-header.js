import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { SELECTED_HEADER_MENU, SITE_ID, SITE_VALUE } from "../../actions";
import APP_ROUTES from "../../helper/app-routes";
import ApiHelper from "../../helper/api-helper";
import ApiUrls from "../../helper/api-urls";
import { NotificationManager } from "react-notifications";
import { permissionEnum } from "../..//helper/permission-helper";
import { userPermission } from "../..//helper/permission-helper";

function MenuHeader() {
  const defaultSite = useSelector((state) => state.getStaffReducer);
  const [siteData, setSiteData] = useState([]);
  const [field, setField] = useState({});
  const [isShown, setIsShown] = useState(false);
  const getRolePermisson = useSelector(
    (state) => state.getRolePermisson.canModifyClinicRoles
  );
  const staffLoginInfo = useSelector((state) => state.getStaffReducer);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const newPath = location.pathname.toLowerCase();
  let d = newPath.split("/");
  let primaryPath = d[1];
  const userAccessPermission = useSelector(
    (state) => state.userAccessPermission
  );

  useEffect(() => {
    getSiteByclinicId();
  }, [defaultSite]);

  const handleChange = (e) => {
    setField(e.target.value);
    dispatch({
      type: SITE_ID,
      payload: e.target.value,
    });
  };

  const getSiteByclinicId = () => {
    ApiHelper.getRequest(ApiUrls.Get_StaffGlobalView_Sites)
      .then((result) => {
        setField({
          siteId:
            defaultSite == 0
              ? result.resultData[0].siteId
              : defaultSite.defaultSite,
          siteName:
            defaultSite.defaultSiteName == null
              ? result.resultData[0].siteName
              : defaultSite.defaultSiteName,
        });
        dispatch({
          type: SITE_ID,
          payload: field,
        });

        dispatch({
          type: SITE_VALUE,
          payload: result.resultData,
        });

        setSiteData(result.resultData);
      })
      .catch((error) => {});
  };

  const handleDefaultValue = () => {
    const data = {
      siteId: field.siteId,
    };
    ApiHelper.postRequest(ApiUrls.SET_STAFF_DEFAULT_SITE, data)
      .then(() => {
        NotificationManager.success("Default Value Set Successfully");
      })
      .catch((error) => {
        NotificationManager.success(error.message);
      });
  };

  const menus = [
    {
      id: "1",
      name: "Dashboard",
      route: APP_ROUTES.DASHBOARD,
      className: primaryPath == "dashboard" ? "nav-link active" : "nav-link",
    },
    {
      id: "2",
      name: "Staff",
      route: APP_ROUTES.GET_STAFF,
      className: primaryPath == "staff" ? "nav-link active" : "nav-link",
    },
    {
      id: "3",
      name: "Clients",
      route: APP_ROUTES.GET_CLIENT,
      className: primaryPath == "client" ? "nav-link active" : "nav-link",
    },
    {
      id: "4",
      name: "Messages",
      route: APP_ROUTES.MESSAGE,
      className: primaryPath == "messages" ? "nav-link active" : "nav-link",
    },
    {
      id: "5",
      name: "Calendar",
      route: APP_ROUTES.SCHEDULER,
      className: primaryPath == "scheduler" ? "nav-link active" : "nav-link",
    },
    {
      id: "6",
      name: "Documents",
      route: APP_ROUTES.DOCUMENT_LIST,
      className: primaryPath == "document" ? "nav-link active" : "nav-link",
    },
  ];

  const clinicMenuItems = [
    {
      id: "1",
      name: "Document Templates",
      route: APP_ROUTES.DOCUMENT_TEMPLATE_LIST,
      className:
        newPath == APP_ROUTES.DOCUMENT_TEMPLATE_LIST
          ? "dropdown-item active"
          : "dropdown-item",
      value: true,
      isPermission: userPermission(staffLoginInfo?.roleId),
    },
    {
      id: "2",
      name: "Services",
      route: APP_ROUTES.GET_SERVICE_BY_CLINICID,
      className:
        primaryPath == "services" ? "dropdown-item active" : "dropdown-item",
      value: true,
      isPermission: userPermission(staffLoginInfo?.roleId),
    },
    {
      id: "3",
      name: "Sites",
      route: APP_ROUTES.GET_CLINIC_SITE,
      className:
        primaryPath == "provider" ? "dropdown-item active" : "dropdown-item",
      value: true,
      isPermission: userPermission(staffLoginInfo?.roleId),
    },

    {
      id: "5",
      name: "Settings",
      route: APP_ROUTES.SETTINGS_UPLOAD_LOGO,
      className:
        primaryPath == "settings" ? "dropdown-item active" : "dropdown-item",
      value: true,
      isPermission: userPermission(staffLoginInfo?.roleId),
    },
    {
      id: "6",
      name: "Roles",
      route: APP_ROUTES.ROLES,
      className:
        primaryPath == "roles" ? "dropdown-item active" : "dropdown-item",
      // value: settingSwitch.canModifyClinicRoles,
      value: getRolePermisson,
      isPermission: true,
    },
    {
      id: "7",
      name: "Authorizations",
      route: APP_ROUTES.MULTIPLE_CLIENT_SERVICE_AUTH,
      className:
        primaryPath == "Authorizations"
          ? "dropdown-item active"
          : "dropdown-item",
      // value: settingSwitch.canModifyClinicRoles,
      value: true,
      isPermission: userAccessPermission[permissionEnum.MANAGE_AUTHORIZATIONS],
    },
  ];

  const accessMenuItems = [
    {
      id: "1",
      name: "Task Manager",
      route: APP_ROUTES.TASK_MANAGER,
      className:
        primaryPath == "task" ? "dropdown-item active" : "dropdown-item",
    },
  ];

  const AuditMenuItems = [
    {
      id: "1",
      name: "Staff Audit",
      route: APP_ROUTES.STAFF_AUDIT,
      className:
        primaryPath == "Staff" ? "dropdown-item active" : "dropdown-item",
    },
    {
      id: "2",
      name: "Client Audit",
      route: APP_ROUTES.CLIENT_AUDIT,
      className:
        primaryPath == "Client" ? "dropdown-item active" : "dropdown-item",
    },
    // {
    //   id: "3",
    //   name: "Clinic Audit",
    //   route: APP_ROUTES.CLINIC_AUDIT,
    //   className:
    //     primaryPath == "Clinic" ? "dropdown-item active" : "dropdown-item",
    // },
  ];

  const onMenuSelect = (e, obj) => {
    e.preventDefault();
    navigate(obj.route);
    dispatch({
      type: SELECTED_HEADER_MENU,
      payload: obj,
    });
  };

  const onMoreMenuSelect = (e, obj) => {
    e.preventDefault();
    setIsShown(false);
    navigate(obj.route);
  };

  return (
    <div className="menu-header-items">
      <header className="inner-header position-relative">
        <div className="container-fluid">
          <nav className="navbar navbar-expand-lg navbar-light p-0">
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              {/* { <span className="navbar-toggler-icon"></span > } */}
            </button>
            <div
              className="collapse navbar-collapse cursor-pointer"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav mb-2 mb-lg-0">
                {menus.map((obj, index) => (
                  <li key={index} className="nav-item">
                    <a
                      href={obj.route}
                      className={obj.className}
                      onClick={(e) => {
                        onMenuSelect(e, obj);
                      }}
                    >
                      {obj.name}
                    </a>
                  </li>
                ))}
                <li className="nav-item dropdown more-btn-drop  d-lg-block ">
                  <a
                    onMouseOver={() => setIsShown(true)}
                    className="nav-link dropdown-toggle"
                    type="button"
                  >
                    More <i className="fa fa-angle-down" aria-hidden="true"></i>
                  </a>
                  {isShown && (
                    <div className="dropdown-menu-t">
                      <div className="drop-downlist">
                        <div className="d-flex flex-wrap">
                          <div className="col-md-6 list-unstyled col-12 mb-0">
                            <div className="mb-2">
                              <a className="dropdown-item">
                                <h6 className="mb-1">Clinic</h6>
                              </a>
                              <ul className="list-unstyled pt-0 pb-0">
                                {clinicMenuItems
                                  .filter((item) => {
                                    return item.value != false;
                                  })
                                  .map((obj, index) => (
                                    <li key={index} className="mb-1">
                                      <a
                                        className={obj.className}
                                        href={obj.route}
                                        onClick={(e) => {
                                          onMoreMenuSelect(e, obj);
                                        }}
                                      >
                                        {obj.isPermission == true
                                          ? obj.name
                                          : ""}
                                        {/* {console.log("isPermission", obj.isPermission)} */}
                                      </a>
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          </div>
                          <div className="col-md-6 list-unstyled col-12 mb-0">
                            {userPermission(staffLoginInfo?.roleId) && (
                              <div className="mb-2">
                                <a className="dropdown-item">
                                  <h6 className="mb-1">Audit</h6>
                                </a>
                                <ul className="list-unstyled pt-0 pb-0">
                                  {AuditMenuItems.map((obj, index) => (
                                    <li key={index} className="mb-1">
                                      <a
                                        className={obj.className}
                                        href={obj.route}
                                        onClick={(e) => {
                                          onMoreMenuSelect(e, obj);
                                        }}
                                      >
                                        {obj.name}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            <div className="mb-2">
                              <a className="dropdown-item">
                                <h6 className="mb-1">Misc.</h6>
                              </a>
                              <ul className="list-unstyled pt-0 pb-0">
                                {accessMenuItems.map((obj, index) => (
                                  <li key={index} className="mb-1">
                                    <a
                                      className={obj.className}
                                      href={obj.route}
                                      onClick={(e) => {
                                        onMoreMenuSelect(e, obj);
                                      }}
                                    >
                                      {obj.name}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="border-bottom-line"></div>
                      </div>
                    </div>
                  )}
                </li>
              </ul>
            </div>
            <p
              className="mr-2 ml-0 mb-0 mt-0  default-head-btn"
              style={{ textAlign: "center" }}
            >
              Site
            </p>
            <div className="header-site-cus">
              <DropDownList
                style={{
                  width: "220px",
                  height: "30px",
                  padding: "0.375rem 0.75rem",
                  marginTop: "0px",
                }}
                onChange={handleChange}
                data={siteData}
                value={field}
                textField="siteName"
                dataItemKey="siteId"
                suggest={true}
                name="field"
                autoClose={true}
              />
            </div>

            <button
              onClick={handleDefaultValue}
              className="btn blue-primary-outline btn-sm ml-2  default-head-btn"
            >
              Set as Default
            </button>
          </nav>
        </div>
      </header>
    </div>
  );
}
export default MenuHeader;
