import React, { useState } from "react";
import { useNavigate } from "react-router";
import DEVELOPMENT_CONFIG from "../../helper/config";
import ApiUrls from "../../helper/api-urls";
import { NotificationManager } from "react-notifications";
import { useDispatch } from "react-redux";
import { LOGIN_USER, USER_CAN_ACCESS } from "../../actions";
import AppRoutes from "../../helper/app-routes";
import ApiHelper from "../../helper/api-helper";
import ErrorHelper from "../../helper/error-helper";
import "../../custom-css/custom-style.css";
import InputKendoRct from "../../control-components/input/input";
import { Navigate } from "react-router-dom";
import { Checkbox } from "@progress/kendo-react-inputs";
import Loader from "../../control-components/loader/loader";
import APP_ROUTES from "../../helper/app-routes";
import ForgotPassword from "./forgot-password";
import { RoleService } from "../../services/rolesService";
import moment from "moment";
import { PermissionHelper } from "../../helper/permission-helper";
import DropDownKendoRct from "../../control-components/drop-down/drop-down";
import { renderErrors } from "src/helper/error-message-helper";

let token = localStorage.getItem(DEVELOPMENT_CONFIG.TOKEN);

function LogIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [domainName, setDomain] = useState(window.location.host.split(".")[0]);
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [isForgotPassword, setForgotPassword] = useState(false);

  const handleSubmit = (event) => {
    if (handleValidation()) {
      event.preventDefault();
      postLogin();
    }
  };

  const postLogin = () => {
    setLoading(true);

    var data = {
      username: username,
      password: password,
      domainName: domainName == "localhost:3000" ? "notenetic-ui" : domainName,
    };
    ApiHelper.postRequest(ApiUrls.LOGIN, data)
      .then((result) => {
        setLoading(false);
        if(result?.resultData?.isTempPassword === 1){
          localStorage.setItem(DEVELOPMENT_CONFIG.IS_TEMP_PASSWORD, result?.resultData?.isTempPassword);   
        }
        navigate(AppRoutes.DASHBOARD);
        let roleId = result.resultData?.roleId;
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
          moment()
            .add(result.resultData.refreshTokenExpireIn, "seconds")
            .format()
        );
        dispatch({
          type: LOGIN_USER,
          payload: result.resultData,
        });
        getRoleModules(roleId);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error)
      });
  };

  const getRoleModules = async (roleId) => {
    await RoleService.getRoleModules(roleId)
      .then((result) => {
        if (result.resultData.length > 0) {
          let data = PermissionHelper(result.resultData);
          dispatch({
            type: USER_CAN_ACCESS,
            payload: data,
          });
        }
      })
      .catch((error) => {
        renderErrors(error.message)

      });
  };

  const handleChange = (event) => {
    if (event.target.name === "username") {
      setUsername(event.target.value);
    }
    if (event.target.name === "password") {
      setPassword(event.target.value);
    }
    // if (event.target.name === "domainName") {
    //     setDomain(event.target.value);
    // }
  };

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;
    if (!username || username.trim().length === 0) {
      formIsValid = false;
      errors["username"] = ErrorHelper.FIELD_BLANK;
    }
    if (!password || password.trim().length === 0) {
      formIsValid = false;
      errors["password"] = ErrorHelper.FIELD_BLANK;
    }
    // if (!domainName || domainName.trim().length === 0) {
    //     formIsValid = false;
    //     errors["domainName"] = ErrorHelper.FIELD_BLANK;
    //   }
    setErrors(errors);
    return formIsValid;
  };

  const handleForgotPass = () => {
    setForgotPassword(true);
  };

  const handleClosePassword = () => {
    setForgotPassword(false);
  };

  if (token != null) {
    return <Navigate to={APP_ROUTES.DASHBOARD} />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="login-form">
        <div className="container-fluid">
          <div className="row example-wrapper">
            <div className="col-md-8 col-lg-4 mx-auto">
              <h1>notenetic</h1>
              <div className="inner-login-notenetic">
                <h2>Sign in to your account</h2>
                <div className="mb-4">
                  <InputKendoRct
                    validityStyles={false}
                    name="username"
                    value={username}
                    onChange={handleChange}
                    label="User Name"
                    error={errors.username && errors.username}
                  />
                </div>
                <div className="mb-2">
                  <InputKendoRct
                    validityStyles={false}
                    value={password}
                    onChange={handleChange}
                    name="password"
                    type="password"
                    label="Password"
                    minLength={6}
                    maxLength={18}
                    error={errors.password && errors.password}
                  />
                </div>
                <div>
                  {/* <DropDownKendoRct
                    label="Region(This is temporary for testing)"
                    onChange={handleChange}
                    data={regionData}
                    value={region.value}
                    textField="name"
                    suggest={true}
                    name="region"
                    required={true}
                  /> */}
                  {/* <InputKendoRct
                    validityStyles={false}
                    value={domainName}
                    onChange={handleChange}
                    name="domainName"
                    label="Domain Name(This is temporary for testing)"
                    minLength={2}
                    maxLength={20}
                    error={errors.domainName && errors.domainName}
                  /> */}
                </div>
                <div
                  onClick={handleForgotPass}
                  className="cursor-pointer text-theme py-3"
                >
                  Forgot Password?
                </div>

                <button type="submit" onClick={handleSubmit}>
                  {loading ? "Submitting" : "Submit"}
                </button>
                {loading == true && <Loader />}
              </div>
            </div>
          </div>
        </div>
        {isForgotPassword && <ForgotPassword onClose={handleClosePassword} />}
      </div>
    </form>
  );
}
export default LogIn;
