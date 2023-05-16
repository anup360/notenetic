import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Loader from "../../../../control-components/loader/loader";
import { NotificationManager } from "react-notifications";
import ApiHelper from "../../../../helper/api-helper";
import ApiUrls from "../../../../helper/api-urls";
import CustomDrawer from "../../../../control-components/custom-drawer/custom-drawer";
import ClientHeader from "../client-header/client-header";
import { Encrption } from "../../../encrption";
import AppRoutes from "../../../../helper/app-routes";
import { permissionEnum } from "../../../../helper/permission-helper";
import { renderErrors } from "src/helper/error-message-helper";


const ClientSignature = () => {
  const [parent, setParent] = useState(false);
  const [client, setClient] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [signData, setSignData] = useState("");
  const [onUpdateSignModal, setUpdateSignModal] = useState(false);
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const userAccessPermission = useSelector((state) => state.userAccessPermission);

  useEffect(() => {
    getSignature();
  }, [selectedClientId]);

  const getSignature = () => {
    setLoading(true);
    ApiHelper.getRequest(
      ApiUrls.GET_CLIENT_SIGNATURE + Encrption(selectedClientId)
    )
      .then((result) => {
        setLoading(false);
        if (result.resultData !== null) {
          let sign = result.resultData;
          sign.forEach((element) => {
            element.isParentSig === true ? setParent(true) : setClient(true);
          });
          setSignData(sign);
        }
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const handleUpdateSign = (value) => {
    setUpdateSignModal(true);

    if (value === true) {
      navigate(AppRoutes.ADD_PARENT_SIGNATURE);
    } else {
      navigate(AppRoutes.ADD_CLIENT_SIGNATURE);
    }
  };

  return (
    <div className="d-flex flex-wrap">
      <div className="inner-dt col-md-3 col-lg-2">
        <CustomDrawer />
      </div>
      <div className="col-md-9 col-lg-10">
        <div className="staff-profile-page">
          <ClientHeader />
          <div
            style={{
              display: "felx",
              justifyContent: "space-between",
            }}
            className="d-flex "
          >
            <h4 className="address-title text-grey pt_20">
              <span className="f-24">Signature</span>
            </h4>
            {!loading && (
              <div className=" mt-3">
                {client === false ? (
                  <button
                    className="btn blue-primary-outline mr-3 btn-sm"
                    onClick={() => {
                      navigate(AppRoutes.ADD_CLIENT_SIGNATURE);
                    }}
                  >
                    + Add Client Signature
                  </button>
                ) : (
                  ""
                )}

                {parent === false ? (
                  <button
                    className="btn blue-primary-outline btn-sm"
                    onClick={() => {
                      navigate(AppRoutes.ADD_PARENT_SIGNATURE);
                    }}
                  >
                    + Add Parent Signature
                  </button>
                ) : (
                  ""
                )}
              </div>
            )}
          </div>
          <div className="upload-sign-file pt_30">
            {signData.length == 0 && !loading && (
              <div className="message-not-found mt-5 mr-5">
                No Signature Available
              </div>
            )}

            <div className="col-md-8 mx-auto">
              <div className="row">
                <div className="col-md-8 col-lg-7">
                  {loading === true && <Loader />}

                  {signData !== "" &&
                    onUpdateSignModal == false &&
                    signData.map((item) => {
                      return (
                        <div className="signature mt-3">
                          <div className="d-flex justify-content-between align-itesm-center">
                            <h4 className="address-title mb-0">
                              {item.isParentSig
                                ? "Parent Signature "
                                : "Client Signature"}
                            </h4>
                            {userAccessPermission[permissionEnum.EDIT_CLIENT_PROFILE] &&
                            <button
                              onClick={() => handleUpdateSign(item.isParentSig)}
                              className="btn blue-primary-outline btn-sm"
                            >
                              <i className="k-icon k-i-edit me-2"></i>
                              {item.isParentSig
                                ? "Update Parent Sig"
                                : "Update Client Sig"}
                              {/* {item.isParentSig ? setParent(true) : setClient(true)} */}
                            </button>
                    }
                            
                          </div>
                          <h6 className=" "><span className="text-theme">{item.isParentSig ? "Parent name:" :  ""}</span><span className="fw-normal  pl-1">
                            {item?.parentFirstName + " " + item?.parentLastName}</span>
                          </h6>
                          <div className="sign-show-img">
                            {item.isParentSig ? (
                              <img
                                alt="demo"
                                src={"data:image/png;base64," + item.signBytes}
                              />
                            ) : (
                              <img
                                alt="demo"
                                src={"data:image/png;base64," + item.signBytes}
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ClientSignature;
