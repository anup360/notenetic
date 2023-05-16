import DEVELOPMENT_CONFIG from "../helper/config";
import axios from "axios";
import FormData from "form-data";
import {
  Encrption,
  telehealthEncrption,
  EncrpytUrl,
} from "../app-modules/encrption";
import { Link } from "react-router-dom";
import APP_ROUTES from "./app-routes";
import { useNavigate } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import { renderErrors } from "src/helper/error-message-helper";

export default {
  postRequest: function (url, data, returnResultDataOnly = false) {
    if (!returnResultDataOnly) returnResultDataOnly = false;
    const token = localStorage.getItem("token");
    var config = {
      method: "post",
      url: DEVELOPMENT_CONFIG.base_url + url,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };
    return new Promise((resolve, reject) => {
      axios(config)
        .then(function (response) {
          if (
            response.data.statusCode === DEVELOPMENT_CONFIG.statusCode &&
            response.data.status == true
          ) {
            if (returnResultDataOnly === true) {
              resolve(response.data.resultData);
            } else resolve(response.data);
          } else {
            reject(response.data.message);
          }
        })
        .catch(function (error) {
          if (error.response.status == DEVELOPMENT_CONFIG.unAuthorized) {
            localStorage.clear();
            window.location.href = "/login";
          }
          else if (error.response.status === DEVELOPMENT_CONFIG.noPermission) {
          } else if (error.response.data) {
            let newMessage = error.response.data.Message;
            let parsedMessage = JSON.parse(newMessage);
            for (let i = 0; i < parsedMessage.length; i++) {
              renderErrors(parsedMessage[i])
              reject();
            }
          } else {
            reject(error.message);
            if (error.response.status == DEVELOPMENT_CONFIG.internalServer) {
              // window.location.replace("/internal-server-error");
            }
          }
        });
    });
  },



  multipartPostRequest: function (url, data, dontUseUTF8) {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    for (const key in data) {
      const value = data[key];
      if (Array.isArray(value)) {
        for (const item of value) formData.append(key, item);
      } else {
        formData.append(key, value);
      }
    }
    var config = {
      method: "post",
      url: DEVELOPMENT_CONFIG.base_url + url,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": dontUseUTF8
          ? "multipart/form-data"
          : "multipart/form-data;charset=UTF-8",
      },
      data: formData,
    };
    return new Promise((resolve, reject) => {
      axios(config)
        .then(function (response) {
          if (response.data.statusCode === DEVELOPMENT_CONFIG.statusCode) {
            resolve(response.data);
          } else {
            reject(response.data.message);
          }
        })
        .catch(function (error) {
          if (error.response.status == 401) {
            localStorage.clear();
            window.location.href = "/login";
          } else if (error.response.status === DEVELOPMENT_CONFIG.noPermission) {

            renderErrors(error.response.data.Message);
          }
          else {
            reject(error);
            if (error.response.status == DEVELOPMENT_CONFIG.internalServer) {
              //window.location.href = APP_ROUTES.internalServer;
            }
          }
        });
    });
  },

  queryGetRequestWithEncryption: function (
    url,
    encryptParam1,
    param2,
    encryptParam2,
    data,
    returnResultDataOnly = false
  ) {
    return this.getRequest(url + Encrption(encryptParam1) + (param2 ? param2 : "") + (encryptParam2 ? Encrption(encryptParam2) : ""), data, returnResultDataOnly
    );
  },

  getRequest: function (url, data, returnResultDataOnly = false) {
    if (!returnResultDataOnly) returnResultDataOnly = false;
    const token = localStorage.getItem("token");
    var config = {
      method: "get",
      url: DEVELOPMENT_CONFIG.base_url + url,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };
    return new Promise((resolve, reject) => {
      axios(config)
        .then(function (response) {
          if (response.data.statusCode === DEVELOPMENT_CONFIG.statusCode) {
            if (returnResultDataOnly === true)
              resolve(response.data.resultData);
            else resolve(response.data);
          } else {
            reject(response.data);
          }
        })
        .catch(function (error) {
          if (error.response.status == DEVELOPMENT_CONFIG.unAuthorized) {
            localStorage.clear();
            window.location.href = "/login";
          }
          else if (error.response.status === DEVELOPMENT_CONFIG.noPermission) {
            renderErrors(error.response.data.Message);
          } else {
            reject(error);
            if (error.response.status == DEVELOPMENT_CONFIG.internalServer) {
              // window.location.href = APP_ROUTES.internalServer;
            }
          }
        });
    });
  },


  patchRequest: function (url, id, returnResultDataOnly = false) {
    if (!returnResultDataOnly) returnResultDataOnly = false;
    const token = localStorage.getItem("token");
    var config = {
      method: "patch",
      url: DEVELOPMENT_CONFIG.base_url + url + Encrption(id),
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    };
    return new Promise((resolve, reject) => {
      axios(config)
        .then(function (response) {
          if (response.data.statusCode === DEVELOPMENT_CONFIG.statusCode) {
            if (returnResultDataOnly === true)
              resolve(response.data.resultData);
            else resolve(response.data);
          } else {
            reject(response.data);
          }
        })
        .catch(function (error) {
          if (error.response.status == DEVELOPMENT_CONFIG.unAuthorized) {
            localStorage.clear();
            window.location.href = "/login";
          }
          else if (error.response.status === DEVELOPMENT_CONFIG.noPermission) {

            renderErrors(error.response.data.Message);
          } else {
            reject(error);
            if (error.response.status == DEVELOPMENT_CONFIG.internalServer) {
              //window.location.href = APP_ROUTES.internalServer;
            }
          }
        });
    });
  },

  deleteRequestWithEncryption: function (
    url,
    encryptParam1,
    data,
    returnResultDataOnly = false
  ) {
    return this.deleteRequest(
      url + Encrption(encryptParam1),
      data,
      returnResultDataOnly
    );
  },

  deleteRequest: function (url, data, returnResultDataOnly = false) {
    if (!returnResultDataOnly) returnResultDataOnly = false;
    const token = localStorage.getItem("token");
    var config = {
      method: "delete",
      url: DEVELOPMENT_CONFIG.base_url + url,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };
    return new Promise((resolve, reject) => {
      axios(config)
        .then(function (response) {
          if (response.data.statusCode === DEVELOPMENT_CONFIG.statusCode) {
            if (returnResultDataOnly === true)
              resolve(response.data.resultData);
            else resolve(response.data);
          } else {
            reject(response.data.resultData);
          }
        })
        .catch(function (error) {
          if (error.response.status == DEVELOPMENT_CONFIG.unAuthorized) {
            localStorage.clear();
            window.location.href = "/login";
          } else if (error.response.status === DEVELOPMENT_CONFIG.noPermission) {

            renderErrors(error.response.data.Message);
          } else {
            reject(error.message);
            // if (error.response.status == DEVELOPMENT_CONFIG.internalServer) {
            //   window.location.replace("/internal-server-error");
            // }
          }
        });
    });
  },

  putRequest: function (url, data, returnResultDataOnly = false) {
    if (!returnResultDataOnly) returnResultDataOnly = false;
    const token = localStorage.getItem("token");
    var config = {
      method: "put",
      url: DEVELOPMENT_CONFIG.base_url + url,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };
    return new Promise((resolve, reject) => {
      axios(config)
        .then(function (response) {
          if (response.data.statusCode === DEVELOPMENT_CONFIG.statusCode) {
            if (returnResultDataOnly === true)
              resolve(response.data.resultData);
            else resolve(response.data);
          } else {
            reject(response.data.message);
          }
        })
        .catch(function (error) {
          if (error.response.status == DEVELOPMENT_CONFIG.unAuthorized) {
            localStorage.clear();
            window.location.href = "/login";
          } else if (error.response.status === DEVELOPMENT_CONFIG.noPermission) {
            renderErrors(error.response.data.Message);
            // reject();
          } else if (error.response.data) {
            let newMessage = error.response.data.Message;
            let parsedMessage = JSON.parse(newMessage);
            for (let i = 0; i < parsedMessage.length; i++) {
              renderErrors(parsedMessage[i])
            }

          } else {
            reject(error);

            // if (error.response.status == DEVELOPMENT_CONFIG.internalServer) {
            //   window.location.replace("/internal-server-error");
            // }
          }
        });
    });
  },

  getRequest: function (url, data, returnResultDataOnly = false) {
    if (!returnResultDataOnly) returnResultDataOnly = false;
    const token = localStorage.getItem("token");
    var config = {
      method: "get",
      url: DEVELOPMENT_CONFIG.base_url + url,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };
    return new Promise((resolve, reject) => {
      axios(config)
        .then(function (response) {
          if (response.data.statusCode === DEVELOPMENT_CONFIG.statusCode) {
            if (returnResultDataOnly === true)
              resolve(response.data.resultData);
            else resolve(response.data);
          } else {
            reject(response.data);
          }
        })
        .catch(function (error) {
          if (error.response.status == DEVELOPMENT_CONFIG.unAuthorized) {
            localStorage.clear();
            window.location.href = "/login";
          } else if (error.response.status === DEVELOPMENT_CONFIG.noPermission) {
            renderErrors(error.response.data.Message);
          } else {
            reject(error);
            if (error.response.status == DEVELOPMENT_CONFIG.internalServer) {
              //window.location.href = APP_ROUTES.internalServer;
            }
          }
        });
    });
  },

  telehealthPostRequest: function (url, data, returnResultDataOnly = false) {
    if (!returnResultDataOnly) returnResultDataOnly = false;
    const token = localStorage.getItem("token");
    let encUrl = telehealthEncrption("MtZV6zExM2rgFE5borPfeM9LfCAc", false);
    var config = {
      method: "post",
      url: DEVELOPMENT_CONFIG.base_url + url,
      headers: {
        Authorization: "Bearer " + token,
        teleHealthAccessKey: encUrl,
        "Content-Type": "application/json",
      },
      data: data,
    };
    return new Promise((resolve, reject) => {
      axios(config)
        .then(function (response) {
          if (
            response.data.statusCode === DEVELOPMENT_CONFIG.statusCode &&
            response.data.status == true
          ) {
            if (returnResultDataOnly === true) {
              resolve(response.data.resultData);
            } else resolve(response.data);
          } else {
            reject(response.data.message);
          }
        })
        .catch(function (error) {
          if (error.response.status == DEVELOPMENT_CONFIG.unAuthorized) {
            // localStorage.clear();
            // window.location.href = "/login";
            reject(error.message);
          } else if (error.response.status === DEVELOPMENT_CONFIG.noPermission) {
            renderErrors(error.response.data.Message);
          } else {
            reject(error.message);
            if (error.response.status == DEVELOPMENT_CONFIG.internalServer) {
              //window.location.href = APP_ROUTES.internalServer;
            }
          }
        });
    });
  },
};
