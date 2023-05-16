import React, { useEffect, useState } from "react";
import "../../custom-css/custom-style.css";
import { filterBy } from "@progress/kendo-data-query";
import { Icon } from "@progress/kendo-react-common";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import moment from "moment";
import { useIdleTimer } from "react-idle-timer";
import { NotificationManager } from "react-notifications";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import dummyImg from "../../../src/assets/images/dummy-img.png";
import { renderErrors } from "src/helper/error-message-helper";
import {
  SELECTED_STAFF_ID,
  STAFF_LOGIN_DETAIL,
  STAFF_ONLINE_STATUS,
} from "../../actions";
import ApiHelper from "../../helper/api-helper";
import ApiUrls from "../../helper/api-urls";
import {
  default as APP_ROUTES,
  default as AppRoutes,
} from "../../helper/app-routes";
import DEVELOPMENT_CONFIG from "../../helper/config";
import { ClientService } from "../../services/clientService";
import { CommonService } from "../../services/commonService";
import GlobalSearch from "../global-search/global-search";
import ChangePassword from "./changePassword";

const RefreshToken = async () => {
  var refreshtoken = localStorage.getItem("refeshtoken");
  var data = {
    refreshToken: refreshtoken,
  };
  ApiHelper.postRequest(ApiUrls.RERESH_TOKEN, data)
    .then((result) => {
      localStorage.setItem(DEVELOPMENT_CONFIG.TOKEN, result.resultData.token);
      localStorage.setItem(
        DEVELOPMENT_CONFIG.REFRESH_TOKEN,
        result.resultData.refreshToken
      );
      localStorage.setItem(DEVELOPMENT_CONFIG.LOGIN_TIME, moment().format());
      localStorage.setItem(
        DEVELOPMENT_CONFIG.TOKEN_EXPIRETIME,
        moment().add(result.resultData.tokenExpireIn, "seconds").format()
      );
      localStorage.setItem(
        DEVELOPMENT_CONFIG.REFRESHTOKEN_EXPIRETIME,
        moment().add(result.resultData.refreshTokenExpireIn, "seconds").format()
      );
    })
    .catch((error) => {
      renderErrors(error);
      localStorage.clear();
      window.location.href = "/login";
    });
};

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const anchor = React.useRef(null);
  const [timer, setTimer] = useState("10:00");
  const [counterpopup, setCounterPopup] = React.useState(false);
  const [isChangePassword, setChangePassword] = React.useState(false);
  const [loginData, setLoginData] = React.useState("");
  const dispatch = useDispatch();
  const [clientData, setClientData] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState("");
  const selectedDrawer = useSelector((state) => state.selectedDrawer);
  const selectedHeaderMenu = useSelector((state) => state.selectedHeaderMenu);
  const isGlobalSearchReducer = useSelector(
    (state) => state.isGlobalSearchReducer
  );
  const [isSelectedDDL, setIsSelectedDDL] = React.useState(false);
  const newPath = location.pathname.toLowerCase();
  const [loading, setLoading] = useState(false);
  const sessionId = useSelector((state) => state.loggedIn.sessionId);
  const selectedClientId = useSelector((state) => state.selectedClientId);

  let d = newPath.split("/");
  let primaryPath = d[1];

  useEffect(() => {
    if (
      location.pathname == APP_ROUTES.GET_CLIENT ||
      primaryPath !== "client"
    ) {
      setSearchValue("");
    }
    const interval = setInterval(() => {
      GetDateDiff(new Date(localStorage.accessTokenExpireTime), new Date());
    }, 10000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  useEffect(() => {
    getLoginDetail();
    getClientsList();
    getStaffOnlineStatus();
  }, []);

  const getClientsList = async () => {
    await ClientService.getClientsDDL()
      .then((result) => {
        let clientListing = result.resultData;
        setClientData(clientListing);
      })
      .catch((error) => {
        renderErrors(error.message);
      });
  };

  const getStaffOnlineStatus = async () => {
    await CommonService.syncStaffOnlineStatus()
      .then((result) => {
        let data = result.resultData;
        dispatch({
          type: STAFF_ONLINE_STATUS,
          payload: data,
        });
      })
      .catch((error) => {
        renderErrors(error.message);
      });
  };

  useEffect(() => {
    setInterval(getStaffOnlineStatus, 30000);
  }, []);

  const getDeadTime = (seconds) => {
    let deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + seconds);
    return deadline;
  };
  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    return { minutes, seconds };
  };
  const startTimer = (e) => {
    let { minutes, seconds } = getTimeRemaining(e);
    if (minutes >= 0 && seconds >= 0) {
      setTimer(
        (minutes > 9 ? minutes : "0" + minutes) +
          ":" +
          (seconds > 9 ? seconds : "0" + seconds)
      );
    } else {
      Logout();
    }
  };
  const clearTimer = (e) => {
    setTimer("10:00");
    if (anchor.current) clearInterval(anchor.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    anchor.current = id;
  };
  const [anchorAlign, setAnchorAlign] = React.useState({
    horizontal: "center",
    vertical: "bottom",
  });
  const [popupAlign, setPopupAlign] = React.useState({
    horizontal: "center",
    vertical: "top",
  });
  const [show, setProfileDropdown] = React.useState(false);

  const logout = () => {
    // Clear user session data
    sessionStorage.clear();
    localStorage.setItem("logout", Date.now().toString());

    // Clear local storage data
    localStorage.removeItem("logout");
    localStorage.clear();
    window.location.href = "/login";
  };

  useEffect(() => {
    const onStorageChange = (event) => {
      if (event.key === "logout") {
        // Call the logout function if the 'logout' key is set in the local storage
        logout();
      }
    };

    window.addEventListener("storage", onStorageChange);

    return () => {
      window.removeEventListener("storage", onStorageChange);
    };
  }, []);

  const handleLogout = async () => {
    await CommonService.logOutUser(sessionId)
      .then((result) => {
        setLoading(false);
        logout();
      })
      .catch((error) => {
        setLoading(false);
        renderErrors("Something went wrong.");
      });
  };
  const Logout = () => {
    if (sessionId) {
      handleLogout();
    } else {
      logout();
    }
  };
  function profileDropdownEnter() {
    setProfileDropdown(true);
  }
  function profileDropdownOver() {
    setProfileDropdown(false);
  }
  function showCounterPopup() {
    setCounterPopup(true);
  }

  function hideCounterPopup(dontSendMessage) {
    setCounterPopup(false);
    clearTimer(getDeadTime(18000));

    // If the counter popup hide here then hide it on all another tabs as well
    if (!dontSendMessage) {
      idleTimer.message({ resetSession: true }, false);
    }
  }

  function resetSession() {
    hideCounterPopup(false);
  }

  function GetDateDiff(startDate, endDate) {
    var mins = parseInt(
      (Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60)) % 60
    );
    if (mins < 15) {
      RefreshToken();
    }
  }
  const getLoginDetail = () => {
    ApiHelper.getRequest(ApiUrls.GET_LOGIN_STAFF)
      .then((result) => {
        let loginData = result.resultData;
        if (loginData) {
          setLoginData(loginData);
          dispatch({
            type: STAFF_LOGIN_DETAIL,
            payload: loginData,
          });
        } else {
          setLoginData("");
        }
      })
      .catch((error) => {
        renderErrors(error.message);
      });
  };

  const handleOnIdle = (event) => {
    showCounterPopup(true);
    clearTimer(getDeadTime(600));
  };

  const handleOnActive = (event) => {};

  const handleOnAction = (event) => {
    // Send remaining time to active the another tab when current tab is active
    idleTimer.message({ remainingTime: idleTimer.getRemainingTime() }, false);
  };

  const handleTimerMessages = (message) => {
    // Recieved when user click on "I'm here"
    if (message.resetSession) {
      hideCounterPopup(true);
    }
    // Recieved to reset the timer if user active on another tab
    else if (
      message.remainingTime &&
      idleTimer.getRemainingTime() < message.remainingTime
    ) {
      idleTimer.reset();
    }
  };

  const idleTimer = useIdleTimer({
    timeout: 1000 * 60 * 5,
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    onAction: handleOnAction,
    crossTab: true,
    onMessage: handleTimerMessages,
    debounce: 500,
  });

  const profileHandler = () => {
    dispatch({
      type: SELECTED_STAFF_ID,
      payload: loginData.id,
    });
    navigate(AppRoutes.STAFF_PROFILE);
  };

  const changePassword = () => {
    setChangePassword(true);
  };

  const handleClosePassword = () => {
    setChangePassword(false);
  };

  // const getClientDetail = async () => {
  //   await ClientService.getClientDetail(selectedClientId)
  //     .then((result) => {
  //       let clientDetail = result.resultData;

  //       dispatch({
  //         type: GET_CLIENT_DETAILS,
  //         payload: result.resultData,
  //       });

  //     })
  //     .catch((error) => {
  //       renderErrors(error.message);
  //     });
  // };

  const onSearchChange = (event) => {
    if (event.value) {
      setSearchValue(event.value);
      let eventType = event.syntheticEvent.type;
      if (eventType == "click" || eventType == "keydown") {
        // getClientDetail()
        setIsSelectedDDL(true);
        if (primaryPath == "client") {
          if (selectedDrawer.route) {
            navigate(selectedDrawer.route);
          } else {
            navigate(APP_ROUTES.CLIENT_DASHBOARD);
          }
        } else {
          navigate(APP_ROUTES.CLIENT_DASHBOARD);
        }
        if (newPath === APP_ROUTES.GET_CLIENT) {
          navigate(APP_ROUTES.CLIENT_DASHBOARD);
        }
      } else {
        setIsSelectedDDL(false);
      }
    } else {
      setSearchValue("");
    }
  };

  return (
    <div className="top-header">
      <div className="top-header-menu">
        <div className="topbar-items nav-left d-flex align-items-center">
          <a href="" className="logo-link text-blue text-decoration-none">
            <h3 className="logo-link notenetic-text mb-0">NOTENETIC</h3>
          </a>
          <div className="position-relative ms-3 ms-md-5 searchicons">
            <form>
              <GlobalSearch
                data={filterBy(clientData, [
                  {
                    field: "clientName",
                    operator: "contains",
                    value: searchValue,
                  },
                ])}
                textField="clientName"
                value={searchValue}
                onChange={onSearchChange}
                placeholder="Jump to client.."
                dataItemKey="clientId"
                isSelectedDDL={isSelectedDDL}
                isGlobalSearchReducer={isGlobalSearchReducer}
                setSearchValue={setSearchValue}
              />

              <Icon name="search" className="search-icon" />
            </form>
          </div>
        </div>
        <div className="topbar-items nav-right">
          <ul className="list-unstyled d-flex align-items-center mb-0">
            {/* <li className="nav-item dropdown more-btn-drop d-block d-lg-none">
              <a
                className="nav-link dropdown-toggle mb-0"
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i
                  className="k-icon k-i-more-vertical"
                  data-toggle="tooltip"
                  data-placement="top"
                  title="More"
                ></i>
              </a>
              <div
                className="dropdown-menu drop-downlist"
                aria-labelledby="dropdownMenuButton"
              >
                <div className="d-flex flex-wrap">
                  <ul className="col-lg-6 list-unstyled col-12">
                    <li className="mb-3">
                      <a className="dropdown-item active" href="#">
                        <div className="d-flex align-items-start">
                          <p className="mb-0">Lorem Ipsum</p>
                        </div>
                      </a>
                    </li>
                    <li className="mb-3">
                      <a className="dropdown-item" href="#">
                        <div className="d-flex align-items-start">
                          <p className="mb-0">Lorem Ipsum</p>
                        </div>
                      </a>
                    </li>
                    <li className="mb-3">
                      <a className="dropdown-item" href="#">
                        <div className="d-flex align-items-start">
                          <p className="mb-0">Lorem Ipsum</p>
                        </div>
                      </a>
                    </li>
                    <li className="mb-3">
                      <a className="dropdown-item" href="#">
                        <div className="d-flex align-items-start">
                          <p className="mb-0">Lorem Ipsum</p>
                        </div>
                      </a>
                    </li>
                    <li className="mb-3">
                      <a className="dropdown-item" href="#">
                        <div className="d-flex align-items-start">
                          <p className="mb-0">Lorem Ipsum</p>
                        </div>
                      </a>
                    </li>
                  </ul>
                  <ul className="col-lg-6 list-unstyled col-12">
                    <li className="mb-3">
                      <a className="dropdown-item" href="#">
                        <div className="d-flex align-items-start">
                          <p className="mb-0">Lorem Ipsum</p>
                        </div>
                      </a>
                    </li>
                    <li className="mb-3">
                      <a className="dropdown-item" href="#">
                        <div className="d-flex align-items-start">
                          <p className="mb-0">Lorem Ipsum</p>
                        </div>
                      </a>
                    </li>
                    <li className="mb-3">
                      <a className="dropdown-item" href="#">
                        <div className="d-flex align-items-start">
                          <p className="mb-0">Lorem Ipsum</p>
                        </div>
                      </a>
                    </li>
                    <li className="mb-3">
                      <a className="dropdown-item" href="#">
                        <div className="d-flex align-items-start">
                          <p className="mb-0">Lorem Ipsum</p>
                        </div>
                      </a>
                    </li>
                    <li className="mb-3">
                      <a className="dropdown-item" href="#">
                        <div className="d-flex align-items-start">
                          <p className="mb-0">Lorem Ipsum</p>
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </li> */}

            {/* <li className="icon-size mx-3">
              <a className="text-darkgrey">
                <i className="fa-clock text-theme fa fa-clock-o"></i>
              </a>
            </li> */}
            <li className="icon-size mx-3">
              <div className="text-darkgrey " style={{ cursor: "pointer" }}>
                <i
                  className="fa-solid text-theme fa-notes-medical"
                  onClick={() => navigate(AppRoutes.DOCUMENT_ADD)}
                ></i>
              </div>
            </li>

            {/* <li className="mx-3 dropdown dropright icon-size">
              <a
                className="notification-drop dropdown-toggle toogle-hide"
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="fa-solid fa-bell">
                  <span className="top-circle-show">1</span>
                </i>
              </a>
              <div
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton"
              >
                <a className="dropdown-item" href="#">
                  Action
                </a>
                <a className="dropdown-item" href="#">
                  Another action
                </a>
                <a className="dropdown-item" href="#">
                  Something else here
                </a>
              </div>
            </li> */}
            <li className="dropdown dropright drop-user-toogle">
              <a
                className="notification-drop dropdown-toggle"
                type="button"
                id="dropdownMenuButtonn"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <img
                  src={
                    loginData.profileImageId
                      ? loginData.profileImageId
                      : dummyImg
                  }
                  alt=""
                  className="user-top"
                />
              </a>
              <div
                className="dropdown-menu py-2"
                aria-labelledby="dropdownMenuButton"
              >
                <h6 className="user-name ">
                  <a className="dropdown-item  text-capitalize">
                    {loginData.firstName} {loginData.lastName}
                  </a>
                </h6>
                <hr className="my-0" />
                <ul className="list-unstyled list-prodile px-3 mb-2 mt-2">
                  <li>
                    <a
                      className="text-decoration-none f-14 text-theme fw-500"
                      href="#"
                      onClick={profileHandler}
                    >
                      My Profile
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-decoration-none f-14 text-theme fw-500"
                      href="#"
                      onClick={changePassword}
                    >
                      Change Password
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-decoration-none f-14 my-2 text-theme fw-500"
                      href="#"
                      onClick={Logout}
                    >
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {counterpopup && (
        <Dialog title={"Session Expire Time"} onClose={resetSession}>
          <b>Are you still there?</b> If not, your session will close in:{" "}
          <b>{timer}</b> due to inactivity.
          {/* Are you still there? out in <b>{timer}</b> minutes. You want to stay? */}
          <DialogActionsBar>
            <button
              className="common-btn-size k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
              onClick={resetSession}
            >
              {" "}
              I'm here
            </button>
            <button
              className="common-btn-size k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
              onClick={Logout}
            >
              Log out
            </button>
          </DialogActionsBar>
        </Dialog>
      )}

      {isChangePassword && <ChangePassword onClose={handleClosePassword} />}
    </div>
  );
}
export default Header;
