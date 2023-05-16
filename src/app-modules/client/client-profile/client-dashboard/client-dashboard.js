import { Chip } from "@progress/kendo-react-buttons";
import {
  ExpansionPanel,
  ExpansionPanelContent,
} from "@progress/kendo-react-layout";
import { Tooltip } from "@progress/kendo-react-tooltip";
import moment from "moment";
import React, { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { NotificationManager } from "react-notifications";
import { useDispatch, useSelector } from "react-redux";
import {
  GET_CLIENT_DETAILS,
  GET_CLIENT_INSURANCE,
  GET_CLIENT_PROFILE_IMG,
  SELECTED_CLIENT_ID,
  GET_CLIENT_FLAGS,
} from "../../../../actions/";
import dummyImg from "../../../../assets/images/dummy-img.png";
import CustomDrawer from "../../../../control-components/custom-drawer/custom-drawer";
import { resizeFiles } from "../../../../control-components/image-resizer/image-resizer";
import ClientDashboardPDF from "../../../../control-components/pdf-generator-kendo/client-dashboard-pdf";
import CustomSkeleton from "../../../../control-components/skeleton/skeleton";
import useModelScroll from "../../../../cutomHooks/model-dialouge-scroll";
import ApiHelper from "../../../../helper/api-helper";
import ApiUrls from "../../../../helper/api-urls";
import { MaskFormatted } from "../../../../helper/mask-helper";
import { ClientService } from "../../../../services/clientService";
import { SettingsService } from "../../../../services/settingsService";
import { Encrption } from "../../../encrption";
import EditClient from "../../edit-client";
import AddClientFlag from "./add-client-flags";
import AddEmergence from "./add-emergency";
import {
  default as AddSiblings,
  default as EditSiblings,
} from "./add-relationship";
import AddSites from "./add-sites-dialog";
import EditClientProvider from "./client-referring-provider";
import EditClientReferral from "./client-referring-source";
import DeleteSiblings from "./delete-relationship";
import Pediatrication from "./pediatrician";
import PrimaryCarePhyisican from "./primary_care_physication";
import { permissionEnum } from "src/helper/permission-helper";
import { renderErrors } from "src/helper/error-message-helper";

const ClientDashboard = () => {
  const dispatch = useDispatch();
  const [expVitals, setExpVitals] = React.useState(true);
  const [expInsurance, setExpInsurance] = React.useState(true);
  const [expEmContact, setExpEmContact] = React.useState(true);
  const [expClientRef, setExpClientRef] = React.useState(true);
  const [loading, setLoading] = useState(false);
  const [onEdit, setOnEdit] = React.useState(false);
  const [clientInfo, setClientInfo] = React.useState(false);
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const clinicId = useSelector((state) => state.loggedIn.clinicId);
  const [profilePic, setProfilePic] = React.useState("");
  const [clientSites, setClientSites] = React.useState([]);
  const [clientSiblings, setClientSiblings] = React.useState([]);
  const [openAddSites, setOpenAddSites] = React.useState(false);
  const [openAddSiblings, setOpenAddSiblings] = React.useState(false);
  const [openEditSiblings, setOpenEditSiblings] = React.useState(false);
  const [isDeleteSibling, setIsDeleteSibling] = React.useState(false);
  const [expSiblings, setExpSiblings] = React.useState(true);
  const [selectedSibling, setSelectedSibling] = React.useState();
  const [cuurentVitals, setCurrentVitals] = React.useState({});
  const [cuurentInsurance, setCurrentInsurance] = React.useState({});
  const [clientDiagnose, setClientDiagnose] = React.useState([]);
  const [addEmergence, setAddEmergence] = React.useState(false);
  const [emergencyContactList, setEmergencyContactList] = useState([]);
  const [showNewPass, setShowNewPass] = useState("SSN");
  const [communicationList, setCommunicationList] = useState({});
  const [openClientReferral, setOpenReferral] = React.useState(false);
  const [clientRefSource, setClientRefSource] = React.useState([]);
  const [expRefProvider, setExpRefProvider] = React.useState(true);
  const [expandPhysician, setExpandPhysician] = useState(true);
  const [expandPediatrication, setExpandPediatrication] = useState(true);
  const [openRefProvider, setOpenRefProvider] = React.useState(false);
  const [primaryCare, setPrimaryCare] = useState(false);
  const [refSourceData, setRefSourceData] = React.useState([]);
  const [primaryCareData, setPrimaryCareData] = useState([]);
  const [pediatricianData, setPediatricianData] = useState([]);
  const [modelScroll, setScroll] = useModelScroll();
  const [pediatrician, setPediatrician] = useState(false);
  const [isPrintPDF, setIsPrintPDF] = useState(false);
  const getProfilePic = useSelector((state) => state.getStaffProfileImg);
  const userAccessPermission = useSelector(
    (state) => state.userAccessPermission
  );

  const [clientFlags, setClientFlags] = React.useState([]);
  const [openClientFlags, setOpenFlags] = React.useState(false);
  const [phoneImage, setPhoneImage] = useState("");
  const [copied, setCopied] = useState(false);
  const [tooltipTitle, setTooltipTitle] = useState("Copy");

  useEffect(() => {}, [copied]);

  const handleEditProfile = ({ editable }) => {
    setOnEdit(!onEdit);
    if (editable) {
      getClientDetail();
    }
    if (onEdit == false) {
      setScroll(true);
    } else {
      setScroll(false);
    }
  };
  useEffect(() => {
    getClientDetail();
    window.scrollTo(0, 0);
  }, [selectedClientId]);

  const getClientDetail = async (sibId) => {
    setLoading(true);
    await ClientService.getClientDetail(sibId ? sibId : selectedClientId)
      .then((result) => {
        let clientDetail = result.resultData;
        dispatch({
          type: GET_CLIENT_DETAILS,
          payload: result.resultData,
        });
        setClientInfo(clientDetail);
        getCommunicationPref();
        getClientFlags(sibId);
        getEmergencyContact();
        getClientDiagnose(sibId);
        getClientProfileImg(sibId);
        getClientSites(sibId);
        getCurrentVitals(sibId);
        getClientSiblings(sibId);
        getCurrentInsurance(sibId);
        getClientRefSource(sibId);
        getClientRefProvider(sibId);
        getPrimaryCarePhysician(sibId);
        getPediatrician(sibId);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const getClientSites = async (sibId) => {
    setLoading(true);
    await ClientService.getClientSites(sibId ? sibId : selectedClientId)
      .then((result) => {
        let clientSites = result.resultData?.clientSites;
        setClientSites(clientSites);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const getCurrentVitals = async (sibId) => {
    setLoading(true);
    await ClientService.getClientCurrentVitals(sibId ? sibId : selectedClientId)
      .then((result) => {
        setLoading(false);
        let vitalList = result.resultData;
        setCurrentVitals(vitalList);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const getCurrentInsurance = async (sibId) => {
    setLoading(true);
    await ClientService.getClientCurrentInsurance(
      sibId ? sibId : selectedClientId
    )
      .then((result) => {
        setLoading(false);
        let insuranceList = result.resultData;

        dispatch({
          type: GET_CLIENT_INSURANCE,
          payload: result.resultData,
        });
        setCurrentInsurance(insuranceList);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const getClientDiagnose = async (sibId) => {
    setLoading(true);
    await ClientService.getClientDiagnose(sibId ? sibId : selectedClientId)
      .then((result) => {
        setLoading(false);
        let list = result.resultData;
        setClientDiagnose(list);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const getClientFlags = async (sibId) => {
    setLoading(true);
    await ClientService.getClientFlags(sibId ? sibId : selectedClientId)
      .then((result) => {
        setLoading(false);
        let list = result.resultData;
        setClientFlags(list);
        dispatch({
          type: GET_CLIENT_FLAGS,
          payload: list,
        });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const getClientSiblings = async (sibId) => {
    setLoading(true);
    await ClientService.getClientSiblings(sibId ? sibId : selectedClientId)
      .then((result) => {
        let clientSiblings = result.resultData;
        setClientSiblings(clientSiblings);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const getClientRefSource = async (sibId) => {
    setLoading(true);
    await SettingsService.getClientRefSource(sibId ? sibId : selectedClientId)
      .then((result) => {
        setLoading(false);
        let data = result.resultData[0];
        setClientRefSource(data);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const getClientRefProvider = async (sibId) => {
    setLoading(true);
    await SettingsService.getClientRefProvider(sibId ? sibId : selectedClientId)
      .then((result) => {
        setLoading(false);
        let data = result.resultData[0];
        setRefSourceData(data);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };
  const uploadClientProfile = async (profile, sibId) => {
    setLoading(true);
    await ClientService.uploadClientProfile(
      profile,
      clinicId,
      sibId ? sibId : selectedClientId
    )
      .then((result) => {
        setLoading(false);
        getClientProfileImg();
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error);
      });
  };

  const getClientProfileImg = async (sibId) => {
    await ClientService.getClientProfileImg(sibId ? sibId : selectedClientId)
      .then((result) => {
        dispatch({
          type: GET_CLIENT_PROFILE_IMG,
          payload: result.resultData,
        });
        if (result.resultData !== null) {
          setProfilePic(
            "data:image/png;base64," + result.resultData.clinicLogo
          );
        }
      })
      .catch((error) => {
        renderErrors(error.message);
      });
  };

  const getEmergencyContact = () => {
    setLoading(true);
    ApiHelper.getRequest(
      ApiUrls.GET_EMERGENCY_CONTACT_BY_CLIENT_ID + Encrption(selectedClientId)
    )
      .then((result) => {
        setLoading(false);
        const data = result.resultData;
        setEmergencyContactList(data);
      })
      .catch((error) => {
        renderErrors(error.message);
        setLoading(false);
      });
  };

  const getCommunicationPref = async () => {
    setLoading(true);
    await ApiHelper.getRequest(
      ApiUrls.GET_CLIENT_COMMUNICATION_PREF + Encrption(selectedClientId)
    )
      .then((response) => {
        setLoading(false);
        const data = response.resultData === null ? "" : response.resultData;
        setCommunicationList({
          canCallHomePhone: data.canCallHomePhone,
          canCallMobilePhone: data.canCallMobilePhone,
          canSendTextSMS: data.canSendTextSMS,
          canSendEmail: data.canSendEmail,
          canSendFax: data.canSendFax,
        });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const getPrimaryCarePhysician = (sibId) => {
    setLoading(true);
    ApiHelper.getRequest(
      ApiUrls.GET_CLIENT_PRIMARY_CARE_PHYSICIAN +
        Encrption(sibId ? sibId : selectedClientId)
    )
      .then((result) => {
        setLoading(false);
        dispatch({
          type: "GET_PRIMARY_CARE_PHYSICIAN",
          payload: result.resultData,
        });
        const data = result.resultData[0];
        setPrimaryCareData(data);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const getPediatrician = () => {
    setLoading(true);
    ApiHelper.getRequest(
      ApiUrls.GET_CLIENT_PEDIATRICATION + Encrption(selectedClientId)
    )
      .then((result) => {
        setLoading(false);
        dispatch({
          type: "GET_PEDIATRICIAN",
          payload: result.resultData,
        });
        const data = result.resultData[0];

        setPediatricianData(data);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const handleValueChange = (value) => {
    setProfilePic(value);
    uploadClientProfile(value, "");
  };

  const handleAddSites = () => {
    setOpenAddSites(true);
    setScroll(true);
  };

  const handleAddSiblings = () => {
    setOpenAddSiblings(true);
    setScroll(true);
  };

  const handleAddEmergence = () => {
    setAddEmergence(true);
    setScroll(true);
  };

  const handleSiteClose = ({ siteAdded }) => {
    if (siteAdded) {
      window.scrollTo(0, 0);
      getClientSites();
    }
    setOpenAddSites(false);
    setScroll(false);
  };

  const handleSiblingClose = ({ siblingAdded }) => {
    if (siblingAdded) {
      getClientSiblings();
    }
    setOpenAddSiblings(false);
    setAddEmergence(false);
    setOpenEditSiblings(false);
    setScroll(false);
  };

  const handleDeleteSiblingClose = ({ siblingDeleted }) => {
    if (siblingDeleted) {
      getClientSiblings();
    }
    setIsDeleteSibling(false);
    setScroll(false);
  };
  const deleteSibling = async (obj) => {
    setIsDeleteSibling(true);
    setSelectedSibling(obj);
    setScroll(true);
  };
  const deleteEmergency = (id) => {
    setLoading(true);
    ApiHelper.deleteRequest(ApiUrls.DELETE_EMERGENCY_CONTACT + id)
      .then((result) => {
        setLoading(false);
        NotificationManager.success("Emergency contact deleted successfully");
        getEmergencyContact();
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error);
      });
  };

  const handleEditSiblings = (obj) => {
    setOpenEditSiblings(true);
    setSelectedSibling(obj);
    setScroll(true);
  };

  const handleClickSibling = (id) => {
    window.scrollTo(0, 0);

    dispatch({
      type: SELECTED_CLIENT_ID,
      payload: id,
    });

    getClientDetail(id);
  };

  // let newFeetValue = cuurentVitals.height && cuurentVitals.height / 12
  // let newInchValue = cuurentVitals.height && cuurentVitals.height % 12
  // let feetValue = Math.floor(newFeetValue)

  let phoneNum = MaskFormatted(
    clientInfo ? clientInfo.homePhone : "",
    "(999) 999-9999"
  );

  let PrimaryNumber = MaskFormatted(
    primaryCareData ? primaryCareData.phone : "",
    "(999) 999-9999"
  );

  let PrimaryFax = MaskFormatted(
    primaryCareData ? primaryCareData.fax : "",
    "(999) 999-9999"
  );

  let PediatricationNumber = MaskFormatted(
    pediatricianData ? pediatricianData.phone : "",
    "(999) 999-9999"
  );
  let PediatricationFax = MaskFormatted(
    pediatricianData ? pediatricianData.fax : "",
    "(999) 999-9999"
  );

  const handleShowNewPass = () => {
    setShowNewPass(showNewPass === "SSN" ? "text" : "SSN");
  };

  const handleEditReferral = () => {
    setOpenReferral(true);
    setScroll(true);
  };

  const handleCloseReferral = ({ updated }) => {
    if (updated) {
      getClientRefSource();
    }
    setOpenReferral(false);
    setScroll(false);
  };

  const handleEditRefProvider = () => {
    setOpenRefProvider(true);
    setScroll(true);
  };

  const handleCloseRefProvider = ({ updated }) => {
    if (updated) {
      getClientRefProvider();
    }
    setOpenRefProvider(false);
    setScroll(false);
  };

  const handleEditPrimaryCare = () => {
    setPrimaryCare(true);
    setScroll(true);
  };

  const handleClosePrimaryCare = () => {
    setPrimaryCare(false);
    setScroll(false);
  };

  const handlePediatrician = () => {
    setPediatrician(true);
    setScroll(true);
  };

  const handleClosePediatrician = () => {
    setPediatrician(false);
    setScroll(false);
  };

  const handleAddFlags = () => {
    setOpenFlags(true);
    setScroll(true);
  };

  const handleCloseFlag = ({ updated }) => {
    if (updated) {
      getClientFlags();
    }
    setScroll(false);
    setOpenFlags(false);
  };

  const deleteFlags = async (id) => {
    await ClientService.removeClientFlags(id)
      .then((result) => {
        setLoading(false);
        getClientFlags();
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const handleRemoveFlag = (e, obj) => {
    deleteFlags(obj.id);
  };

  const handlePrintPDF = () => {
    const data =
      "iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAABHNCSVQICAgIfAhkiAAABzlJREFUaEPdW3tsk1UUP+frHl/LwxhhIcrDP8iAhMT5SABjYpQI6AyYYLOuc9B1ExYTFUgMEMZQJiKJER+Jwci6AaPdnBgggIOISnwQEwUUjUAwER+gDKOAtN/G+h3PbVfo+vru13a04ybL2n73nnt+95x7Xvd+CIPYapw984D0aTzFGAQoIaQSBCwhghIxLSKcJ6DzSMj/4Tz/9Ceg8nWLt3jXYLHFfGSvOZ10azFp5QA0j4HNAYThaVEn+I8XogsRd2qg7vN68Z+06CQYlBXAtY7eu3UluJ6Jzc4WYwPoEHQBWVZ72ou+yZR+RoBrn9Im6kF9PSvnfFbPjGgZAeFtQIj0QV9QadjaoZ4y6p/seVpMVtsD4wsLoIGJ1jDMgnQnT2scQR8heFBXX/K041mzNEwDrnVo5bpCXh440uxk2ezPRu4S6ljtaVd3m6FrCnBNZaCRib842OorC0CoOfdd3eKzrpMdIwXY5SIVe7VW7lwhS/gG99t++ar6dGcnBozmNQTsstMYpSDQxU7zLiNiOX1OdLTXYi1va8NzqfhICTgs2cBhNsBlOQUjOzmD1out97e2opaWlXY7/e+zy7HLzpcP/XhTd7R4rQ7TgN2VgRXsctjHDsFGsNLjs76aiPOEKl3j6HkSFb2DByhDEK5gWdcJy1t9alcs/3GA3XNpBA0L/Mxx7OhkYMeNRyifB2AbltwE+K8Q7OUU4LdfhefIQSP6q0exlm7fjpeiZ48H7NRYFWh5Khbrn0Mou8dY+MeO6LDprRwBDgHADR6vuiIp4P6Q8RTv3eJUgJetUKB0sqFHC5GodwVzIN7wlLzUWp9FnbBtG4rUM7wE0dxwJNXKUdRCIw6HCuAQaIJ3ORKrjwNcV9EzJajoxxmw5SYDzLCUsuaO4h8GSLjGGeiSzWcX1ikw4wE5lV7XqOfOcPVLjlV7P/vmOdcAhy2zdoGlW2QkXfH88SeQ/4yNlui76W2CY9/qMmQHrQ+rdW+voo4WFjskplqn30GAPtkZy+5VoP5ZOQkf/oJgy+bcAg5Lliqbvbb2ENeszuKDdCYk/PCqtXISvtBN0PBC7gGzlLew8XJFAF80m9BvfEcBq01Oyhs36HDyp1z645C5Puvx2e5AV5V/ukJ4WFadI/1kgw/RP1/UWkeage5KbQkgbTQLWFhpYa1l27JndPD7cy1lXIo1lf43OG5+XpbxSD8bq/PrrNayLS8Ac6iJZg1WNEBZte70ERzcnx+GiyUc+Iz974Oykorul8o9BVh9Dx4g+OQA5F6VIwEIwSF0OwO/8PcJ6QAWY9a9psBto+Kt9cEDOnR6c7xn40GdZKMV0Iyyo1SLkcp45YU7imae4KIA/C8DviVdCYtxDU0KjB0XL2URdLyyhvJGpTlfZMDOwAnmeVImgCdNQVi6PLHFzhcf3I/vZEZGK3qRUmVQ+bKfObw8lJFbigYs/PKqtZjQgIl+IoEQ0s5lEyXctAOPRIwbJRV7dhLs2Rnvj8W4xZx92YZxGPo5wacfA4j9n+1GRG8Ko5XV+rNRyJloTycqGZ06QfDdkXDVU3zOSuN6NboqtTkK0kdZIdhPxKhAIEBs3UwhMKkMXjRPom/AH/7l7wvAJWAyrQVcq34UFy2iwr7LWnemril2wWTKQELFSyeDdAU0eg6zebY4Ty4croZDpEzi6VSaYXcizJwln2CY1TIzJeDImVNaJR4zjBntaTO0YvuaATygxFNVRSOLdK1btohnlkmxT0UNTLZCIktfFrAo4uEVdZRnN16+Fg+aKdPKMhTrpxfUgdQRjSx9acCxZVoxQW1Fz1Sy6MdlJ0u3n0gp7ZWQNEAxQ1cWcJCUqVt8xT8K2gOPWkxWL80wFyvth2dBqJifKLWUpSsDOPaAfABglyNwJ+/j0zLHLbJMGfUToGfOxoTZltFYI8DiMI19xORmr/VMhFZcTscVkE0MeLHRZNl+Pmo0wkOPcNrGBi5RqploPkPAHEq2+GxLosfGAa6uppKCoHaGH6jZBiVLTyQipSHgBGPH88G7+B5zPGuUjIhAA66qE1s6sTslYPGQc+Ra/rdZlsF87KeDMr/VW/xhLG9Jjw7cEjcB8hFomKf4k/+ke/g6CBLVEL7YMrSuLfGRyg6+wcNXrTBhinWzXUz7ni+mTUv7YpqQdl2Vf2xQx6/Yco/LXxUWnNHvfVet07d24h+p+JQ6/rPbyTqiUHuPCVXlKejsXS6NBsg+ehV/b8qr68MEjS3t1pdlBSEl4Whiboc2FxQStwVsspMMRr8bckE8wrjbQbcTao28WrW5eAWA+WjptahrjK4KJ1po0xKOJrKgQistUKiJV9s+2Goevv1OOxSLsrK5TT2drtZkBPi6xHvvAww2sbRDV4Oy3cS1I0W3rGxuLzqaKe2sAI4wIV7UUkF7jOu/fLEp8xe1OHjY1YPq3rx7USvZqpt9FY+3xTkd8MtWr7ovU0kmG/8/AXTVvR287ygAAAAASUVORK5CYII=";
    setPhoneImage(`data:image/png;base64,${data}`);
    setIsPrintPDF(true);
  };

  const handleCopyClick = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTooltipTitle("Copied");
    setTimeout(() => {
      setCopied(false);
      setTooltipTitle("Copy");
    }, 3000);
  };

  return (
    <div className="client-profile">
      <div className="d-flex flex-wrap">
        <div className="inner-dt col-md-3 col-lg-2">
          <CustomDrawer />
        </div>
        <div className="col-md-9 col-lg-10">
          <div className="row">
            <div className="col-xl-4 col-md-8 col-12 px-lg-4 mb-3">
              <div className="profile-box-show">
                <div className="top-profileedit"></div>
                <div className="inner-section-edit position-relative text-center">
                  <div className="inner-uploadimg">
                    {userAccessPermission[
                      permissionEnum.EDIT_CLIENT_PROFILE
                    ] ? (
                      <Dropzone
                        onDrop={(files) => {
                          resizeFiles(files, 200, 300).then((reSizedFiles) => {
                            handleValueChange(reSizedFiles[0]);
                          });
                        }}
                        multiple={false}
                        accept={"image/*"[(".png", ".gif", ".jpeg", ".jpg")]}
                      >
                        {({ getRootProps, getInputProps }) => (
                          <div {...getRootProps({ className: "" })}>
                            <span className="k-icon k-i-photo-camera camera-photo"></span>
                            <input {...getInputProps()} />
                            {profilePic ? (
                              <img
                                width={160}
                                height={140}
                                src={
                                  profilePic ||
                                  getProfilePic.staffProfileImageUrl
                                    ? profilePic ||
                                      getProfilePic.staffProfileImageUrl
                                    : profilePic
                                }
                                alt="profileImage"
                              />
                            ) : (
                              <div>
                                <img src={dummyImg} alt="dummyImage" />
                              </div>
                            )}
                          </div>
                        )}
                      </Dropzone>
                    ) : (
                      <div>
                        <span className="k-icon k-i-photo-camera camera-photo"></span>
                        {profilePic || getProfilePic.staffProfileImageUrl ? (
                          <img
                            width={160}
                            height={140}
                            src={
                              profilePic || getProfilePic.staffProfileImageUrl
                                ? profilePic ||
                                  getProfilePic.staffProfileImageUrl
                                : dummyImg
                            }
                            alt="profileImage"
                          />
                        ) : (
                          <div>
                            <img src={dummyImg} alt="dummyImage" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <h4 className="address-title text-theme">
                    {!clientInfo ? (
                      <CustomSkeleton shape="text" />
                    ) : (
                      clientInfo && clientInfo.fName + " " + clientInfo.lName
                    )}
                  </h4>

                  <p
                    style={{ display: "flex", justifyContent: "center" }}
                    className="mb-1 f-16 "
                  >
                    {/* --------------------------Client ID copied--------------------- */}

                    {/* {!clientInfo ? (
                      <CustomSkeleton shape="text" />
                    ) : clientInfo.id.length > 8 ? (
                      `${clientInfo.id.slice(0, 8)}...`
                    ) : (
                      clientInfo.id
                    )} */}
                    {/* {!copied && (
                      <Tooltip anchorElement="target" position="top">
                        <i
                          className="fa-solid fa-copy"
                          aria-hidden="true"
                          title="Copy"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleCopyClick(clientInfo.id)}
                        ></i>
                      </Tooltip>
                    )} */}
                    {/* {copied && (
                      <Tooltip anchorElement="target" position="top">
                        {" "}
                        <i
                          className="fa fa-check mt-1 ml-1"
                          aria-hidden="true"
                          title="Copied"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleCopyClick(clientInfo.id)}
                        ></i>
                      </Tooltip>
                    )} */}
                  </p>
                  <p className="mb-1 f-16">
                    {!clientInfo ? (
                      <CustomSkeleton shape="text" />
                    ) : (
                      clientInfo.email
                    )}
                  </p>
                  <p className="f-16 mb-4">
                    {!clientInfo ? <CustomSkeleton shape="text" /> : phoneNum}
                  </p>
                  <ul className="show-skills  list-unstyled mb-0 d-flex align-items-center flex-wrap">
                    {/* {clientDiagnose.length > 0 &&
                      clientDiagnose.map((obj, index) => (
                        <li key={index} className="view-box">
                          <p className="mb-0">{obj.icd10}</p>
                        </li>
                      ))} */}
                    {clientFlags.length > 0 &&
                      clientFlags.map((obj) => (
                        <Chip
                          text={obj.flagName}
                          key={obj.id}
                          value="chip"
                          rounded={"large"}
                          fillMode={"solid"}
                          removable={true}
                          size={"medium"}
                          style={{
                            marginRight: 5,
                            backgroundColor: obj.color,
                            marginBottom: 10,
                            color: "#ffffff",
                          }}
                          onRemove={(e) => {
                            handleRemoveFlag(e, obj);
                          }}
                        />
                      ))}

                    {userAccessPermission[
                      permissionEnum.EDIT_CLIENT_PROFILE
                    ] && (
                      <Chip
                        text="Add Flags"
                        value="chip"
                        icon={"k-icon k-i-plus k-icon-64"}
                        rounded={"large"}
                        fillMode={"solid"}
                        size={"medium"}
                        onClick={handleAddFlags}
                        style={{ marginBottom: 10 }}
                      />
                    )}
                  </ul>
                </div>
              </div>
            </div>
            {/* End*/}
            <div className="col-md-12 col-xl-8 col-12 px-lg-4 mb-3">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="address-title text-grey">
                  <span className="f-24">Details</span>
                </h4>
                <div className="right-edit d-flex align-items-center">
                  <Tooltip anchorElement="target" position="top">
                    <button
                      className="btn blue-primary-outline  btn-sm  mx-3"
                      onClick={handlePrintPDF}
                    >
                      <i className="fa-solid fa-file-pdf m-2" title="Print"></i>
                      Print
                    </button>
                  </Tooltip>

                  {userAccessPermission[permissionEnum.EDIT_CLIENT_PROFILE] && (
                    <button
                      onClick={handleEditProfile}
                      className="btn blue-primary-outline d-flex align-items-center "
                    >
                      <i className="k-icon k-i-edit me-2"></i>Edit Profile
                    </button>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-xl-6 col-md-12 mb-3">
                  <ul className="list-unstyled mb-0 details-info firts-details-border position-relative">
                    <li className="d-flex mb-3">
                      <p className="mb-0 col-md-6 fw-500">Client Status</p>
                      <p className="mb-0  col-md-6">
                        {!clientInfo ? (
                          <CustomSkeleton shape="text" />
                        ) : (
                          clientInfo.clientStatusName
                        )}
                      </p>
                    </li>
                    <li className="d-flex mb-3">
                      <p className="mb-0 col-md-6 fw-500">First Name</p>
                      <p className="mb-0  col-md-6">
                        {!clientInfo ? (
                          <CustomSkeleton shape="text" />
                        ) : (
                          clientInfo.fName
                        )}
                      </p>
                    </li>
                    <li className="d-flex mb-3">
                      <p className="mb-0 col-md-6 fw-500">Middle Name</p>
                      <p className="mb-0  col-md-6">
                        {!clientInfo ? (
                          <CustomSkeleton shape="text" />
                        ) : (
                          clientInfo.mName
                        )}
                      </p>
                    </li>
                    <li className="d-flex mb-3">
                      <p className="mb-0 col-md-6 fw-500">Last Name</p>
                      <p className="mb-0  col-md-6">
                        {!clientInfo ? (
                          <CustomSkeleton shape="text" />
                        ) : (
                          clientInfo.lName
                        )}
                      </p>
                    </li>
                    <li className="d-flex mb-3">
                      <p className="mb-0 col-md-6 fw-500">Nick Name</p>
                      <p className="mb-0  col-md-6">
                        {!clientInfo ? (
                          <CustomSkeleton shape="text" />
                        ) : (
                          clientInfo.nickName
                        )}
                      </p>
                    </li>
                    <li className="d-flex mb-3">
                      <p className="mb-0 col-md-6 fw-500">Gender</p>
                      <p className="mb-0  col-md-6">
                        {!clientInfo ? (
                          <CustomSkeleton shape="text" />
                        ) : (
                          clientInfo.gender
                        )}
                      </p>
                    </li>
                    <li className="d-flex mb-3">
                      <p className="mb-0 col-md-6 fw-500">Date of Birth</p>
                      <p className="mb-0  col-md-6">
                        {!clientInfo ? (
                          <CustomSkeleton shape="text" />
                        ) : (
                          moment(clientInfo.dob).format("M/D/YYYY")
                        )}
                      </p>
                    </li>

                    <li className="d-flex mb-3">
                      <p className="mb-0 col-md-6 fw-500">Start Date</p>
                      <p className="mb-0  col-md-6">
                        {!clientInfo ? (
                          <CustomSkeleton shape="text" />
                        ) : clientInfo.dateStart == null ? (
                          ""
                        ) : (
                          moment(clientInfo.dateStart).format("M/D/YYYY")
                        )}
                      </p>
                    </li>

                    <li className="d-flex mb-3">
                      <p className="mb-0 col-md-6 fw-500">Record Id</p>
                      <p className="mb-0  col-md-6">
                        {!clientInfo ? (
                          <CustomSkeleton shape="text" />
                        ) : (
                          clientInfo.recordId
                        )}
                      </p>
                    </li>

                    <li className="d-flex mb-3">
                      <p className="mb-0 col-md-6 fw-500">Hair Color</p>
                      <p className="mb-0  col-md-6">
                        {!clientInfo ? (
                          <CustomSkeleton shape="text" />
                        ) : (
                          clientInfo.hairColor
                        )}
                      </p>
                    </li>
                    <li className="d-flex mb-3">
                      <p className="mb-0 col-md-6 fw-500">Eye Color</p>
                      <p className="mb-0  col-md-6">
                        {!clientInfo ? (
                          <CustomSkeleton shape="text" />
                        ) : (
                          clientInfo.eyeColor
                        )}
                      </p>
                    </li>
                    <li className="d-flex mb-3">
                      <p className="mb-0 col-md-6 fw-500">Smoker</p>
                      <p className="mb-0  col-md-6">
                        {!clientInfo ? (
                          <CustomSkeleton shape="text" />
                        ) : (
                          clientInfo.smokingStatus
                        )}
                      </p>
                    </li>
                    <li className="d-flex mb-3">
                      <p className="mb-0 col-md-6 fw-500">Race</p>
                      <p className="mb-0  col-md-6">
                        {!clientInfo ? (
                          <CustomSkeleton shape="text" />
                        ) : (
                          clientInfo.race
                        )}
                      </p>
                    </li>
                    <li className="d-flex mb-3">
                      <p className="mb-0 col-md-6 fw-500">Ethnicity</p>
                      <p className="mb-0  col-md-6">
                        {!clientInfo ? (
                          <CustomSkeleton shape="text" />
                        ) : (
                          clientInfo.ethnicityName
                        )}
                      </p>
                    </li>
                  </ul>
                </div>
                {/*End*/}
                <div className="col-xl-6 col-md-12 mb-3">
                  <ul className="list-unstyled mb-0 details-info">
                    <li className="d-flex mb-3">
                      <p className="mb-0 col-md-6 fw-500">SSN</p>
                      {!clientInfo ? (
                        <CustomSkeleton shape="text" />
                      ) : (
                        <p className="mb-0  col-md-6">
                          {clientInfo.ssn
                            ? showNewPass === "SSN"
                              ? "***-**-" + String(clientInfo.ssn).slice(-4)
                              : MaskFormatted(clientInfo.ssn, "999-99-9999")
                            : ""}

                          {userAccessPermission[
                            permissionEnum.EDIT_CLIENT_PROFILE
                          ] && (
                            <span
                              onClick={handleShowNewPass}
                              className="cursor-pointer pl-3"
                            >
                              {clientInfo.ssn ? (
                                showNewPass !== "SSN" ? (
                                  <i className="far fa-eye text-theme"></i>
                                ) : (
                                  <i className="far fa-eye-slash"></i>
                                )
                              ) : (
                                ""
                              )}
                            </span>
                          )}
                        </p>
                      )}
                    </li>
                    <li className="d-flex mb-3">
                      <p className="mb-0 col-md-6 fw-500">Address 1</p>
                      <p className="mb-0  col-md-6">
                        {!clientInfo ? (
                          <CustomSkeleton shape="text" />
                        ) : (
                          clientInfo.homeAddress
                        )}
                      </p>
                    </li>
                    <li className="d-flex mb-3">
                      <p className="mb-0 col-md-6 fw-500">Address 2</p>
                      <p className="mb-0  col-md-6">
                        {!clientInfo ? (
                          <CustomSkeleton shape="text" />
                        ) : (
                          clientInfo.homeAddress2
                        )}
                      </p>
                    </li>
                    <li className="d-flex mb-3">
                      <p className="mb-0 col-md-6 fw-500">City</p>
                      <p className="mb-0  col-md-6">
                        {!clientInfo ? (
                          <CustomSkeleton shape="text" />
                        ) : (
                          clientInfo.homeCity
                        )}
                      </p>
                    </li>
                    <li className="d-flex mb-3">
                      <p className="mb-0 col-md-6 fw-500">State</p>
                      <p className="mb-0  col-md-6">
                        {!clientInfo ? (
                          <CustomSkeleton shape="text" />
                        ) : (
                          clientInfo.homeStateName
                        )}
                      </p>
                    </li>

                    <li className="d-flex mb-3">
                      <p className="mb-0 col-md-6 fw-500">Zip</p>
                      <p className="mb-0  col-md-6">
                        {!clientInfo ? (
                          <CustomSkeleton shape="text" />
                        ) : (
                          clientInfo.homeZip
                        )}
                      </p>
                    </li>
                    <li className="d-flex mb-3">
                      <p className="mb-0 col-md-6 fw-500">Comm. Pref</p>
                      <ul className="common-prof-dt">
                        <li
                          className={
                            communicationList.canCallHomePhone == true
                              ? "mb-0 "
                              : "mb-0  common_prof_list"
                          }
                        >
                          {communicationList.canCallHomePhone == true
                            ? "Home Phone call"
                            : ""}
                        </li>
                        <li
                          className={
                            communicationList.canCallMobilePhone == true
                              ? "mb-0 "
                              : "mb-0  common_prof_list"
                          }
                        >
                          {communicationList.canCallMobilePhone == true
                            ? "Home Mobile call"
                            : ""}
                        </li>
                        <li
                          className={
                            communicationList.canSendEmail == true
                              ? "mb-0 "
                              : "mb-0  common_prof_list"
                          }
                        >
                          {communicationList.canSendEmail == true
                            ? "Send Email"
                            : ""}
                        </li>
                        <li
                          className={
                            communicationList.canSendFax == true
                              ? "mb-0 "
                              : "mb-0  common_prof_list"
                          }
                        >
                          {communicationList.canSendFax == true
                            ? " Send Fax"
                            : ""}
                        </li>
                        <li
                          className={
                            communicationList.canSendTextSMS == true
                              ? "mb-0 "
                              : "mb-0  common_prof_list"
                          }
                        >
                          {communicationList.canSendTextSMS == true
                            ? "Text SMS"
                            : ""}
                        </li>
                      </ul>
                    </li>
                    <li className="d-flex mb-3">
                      <p className="mb-0 col-md-6 fw-500">
                        Sites{" "}
                        {userAccessPermission[
                          permissionEnum.EDIT_CLIENT_PROFILE
                        ] && (
                          <span
                            className="k-icon k-i-edit ml-2"
                            onClick={handleAddSites}
                          ></span>
                        )}
                      </p>
                      <li className="common-prof-dt">
                        <li className="mb-0 ">
                          {clientSites.map((obj, index) => (
                            <ul className="common-prof-dt">
                              <li key={index}>{obj.name}</li>
                            </ul>
                          ))}
                          <div className="text-right"></div>
                        </li>
                      </li>
                    </li>
                  </ul>
                </div>
                {/*End*/}
              </div>
            </div>
            {/*End*/}
          </div>
          <section className="widgets-swection py-3">
            <h4 className="address-title text-grey col-md-12 px-1 mb-4">
              <span className="f-24"></span>
            </h4>
            <div className="row">
              <div className="col-md-6 col-xl-4 col-12 px-lg-3 mb-3">
                <div className="widget-box">
                  <ExpansionPanel
                    title="Current Insurance"
                    expanded={expInsurance}
                    onAction={(e) => setExpInsurance(!e.expanded)}
                  >
                    {expInsurance && (
                      <ExpansionPanelContent>
                        <div className="text-right py-3"></div>
                        <div className="show-height-common white-scroll">
                          <div>
                            <ul className="list-unstyled mb-0 details-info">
                              <li className="d-flex mb-3">
                                <p className="mb-0 col-md-6 fw-500">
                                  Insurance
                                </p>
                                <p className="mb-0  col-md-6">
                                  {!cuurentInsurance
                                    ? ""
                                    : cuurentInsurance?.insuranceName}
                                  {/* {!cuurentInsurance ? (<CustomSkeleton shape="text" />) : (cuurentInsurance?.insuranceName)} */}
                                </p>
                              </li>
                              <li className="d-flex mb-3">
                                <p className="mb-0 col-md-6 fw-500">Policy #</p>
                                <p className="mb-0  col-md-6">
                                  {!cuurentInsurance
                                    ? ""
                                    : cuurentInsurance?.policyNumber}
                                  {/* {!cuurentInsurance ? (<CustomSkeleton shape="text" />) : (cuurentInsurance?.policyNumber)} */}
                                </p>
                              </li>
                              <li className="d-flex mb-3">
                                <p className="mb-0 col-md-6 fw-500">
                                  Start Date
                                </p>
                                <p className="mb-0  col-md-6">
                                  {cuurentInsurance &&
                                  cuurentInsurance?.dateStart
                                    ? moment(
                                        cuurentInsurance?.dateStart
                                      ).format("M/D/YYYY")
                                    : ""}
                                </p>
                              </li>
                              <li className="d-flex mb-3">
                                <p className="mb-0 col-md-6 fw-500">End Date</p>
                                <p className="mb-0  col-md-6">
                                  {cuurentInsurance && cuurentInsurance?.dateEnd
                                    ? moment(cuurentInsurance?.dateEnd).format(
                                        "M/D/YYYY"
                                      )
                                    : ""}
                                </p>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </ExpansionPanelContent>
                    )}
                  </ExpansionPanel>
                </div>
              </div>
              <div className="col-md-6 col-xl-4 col-12 px-lg-3 mb-3">
                <div className="widget-box">
                  <ExpansionPanel
                    title="Vitals"
                    expanded={expVitals}
                    onAction={(e) => setExpVitals(!e.expanded)}
                  >
                    {expVitals && (
                      <ExpansionPanelContent>
                        <div className="text-right py-3"></div>
                        <div className="show-height-common white-scroll">
                          <div>
                            <ul className="list-unstyled mb-0 details-info">
                              <li className="d-flex mb-3">
                                <p className="mb-0 col-md-6 fw-500">
                                  Date Record
                                </p>
                                <p className="mb-0  col-md-6">
                                  {cuurentVitals?.dateRecord
                                    ? moment(cuurentVitals?.dateRecord).format(
                                        "M/D/YYYY"
                                      )
                                    : ""}
                                </p>
                              </li>
                              <li className="d-flex mb-3">
                                <p className="mb-0 col-md-6 fw-500">
                                  Blood Pressure
                                </p>
                                <p className="mb-0  col-md-6">
                                  {cuurentVitals !== null &&
                                    cuurentVitals?.bpDia +
                                      " /" +
                                      cuurentVitals &&
                                    cuurentVitals?.bpSys}
                                </p>
                              </li>
                              <li className="d-flex mb-3">
                                <p className="mb-0 col-md-6 fw-500">
                                  Temperature
                                </p>
                                <p className="mb-0  col-md-6">
                                  {cuurentVitals &&
                                  cuurentVitals?.temperature &&
                                  cuurentVitals?.temperature == 0
                                    ? ""
                                    : cuurentVitals?.temperature}
                                </p>
                              </li>
                              <li className="d-flex mb-3">
                                <p className="mb-0 col-md-6 fw-500">Height</p>
                                <p className="mb-0  col-md-6">
                                  {cuurentVitals &&
                                  cuurentVitals?.height &&
                                  cuurentVitals?.height == 0
                                    ? ""
                                    : cuurentVitals?.height}

                                  {/* {cuurentVitals && (cuurentVitals.height
                                    || cuurentVitals.height == 0 ? "" : cuurentVitals.height)
                                  } */}
                                </p>
                              </li>
                              <li className="d-flex mb-3">
                                <p className="mb-0 col-md-6 fw-500">
                                  Weight (in lbs)
                                </p>
                                <p className="mb-0  col-md-6">
                                  {cuurentVitals &&
                                  cuurentVitals?.weight &&
                                  cuurentVitals?.weight == 0
                                    ? ""
                                    : cuurentVitals?.weight}
                                </p>
                              </li>

                              <li className="d-flex mb-3">
                                <p className="mb-0 col-md-6 fw-500">
                                  Heart Rate
                                </p>
                                <p className="mb-0  col-md-6">
                                  {cuurentVitals &&
                                  cuurentVitals?.heartRate &&
                                  cuurentVitals?.heartRate == 0
                                    ? ""
                                    : cuurentVitals?.heartRate}
                                </p>
                              </li>
                              <li className="d-flex mb-3">
                                <p className="mb-0 col-md-6 fw-500">
                                  Pulse Rate
                                </p>
                                <p className="mb-0  col-md-6">
                                  {cuurentVitals &&
                                  cuurentVitals?.pulseRate &&
                                  cuurentVitals?.pulseRate == 0
                                    ? ""
                                    : cuurentVitals?.pulseRate}
                                </p>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </ExpansionPanelContent>
                    )}
                  </ExpansionPanel>
                </div>
              </div>
              <div className="col-md-6 col-xl-4 col-12 px-lg-3 mb-3">
                <div className="widget-box">
                  <ExpansionPanel
                    title="Relationship"
                    expanded={expSiblings}
                    onAction={(e) => setExpSiblings(!e.expanded)}
                  >
                    {expSiblings && (
                      <ExpansionPanelContent>
                        <div>
                          <div className="text-right">
                            {userAccessPermission[
                              permissionEnum.EDIT_CLIENT_PROFILE
                            ] && (
                              <button
                                onClick={handleAddSiblings}
                                className="btn blue-primary-outline btn-sm"
                              >
                                + Add Relation
                              </button>
                            )}
                          </div>
                          <ul className="list-unstyled mb-0 details-info">
                            <div className="show-height-common white-scroll">
                              <ul className="client-list-sibling list-unstyled border mt-2">
                                {clientSiblings.map((obj, index) => (
                                  <li key={index}>
                                    {obj.isOpenedClientProfile === true ? (
                                      <div>
                                        <span
                                          className={
                                            obj.sibClientId !== 0
                                              ? "c-link"
                                              : ""
                                          }
                                          onClick={() =>
                                            obj.sibClientId !== 0 &&
                                            handleClickSibling(obj.clientId)
                                          }
                                        >
                                          {" "}
                                          {obj.sibClientId !== 0
                                            ? obj.lName +
                                              ", " +
                                              obj.fName +
                                              "   -   "
                                            : obj.sibLastName +
                                              ", " +
                                              obj.sibFirstName +
                                              " - "}
                                        </span>{" "}
                                        {obj.relationName}
                                      </div>
                                    ) : (
                                      <div>
                                        You've relationship with{" "}
                                        <span
                                          className="c-link"
                                          onClick={() =>
                                            handleClickSibling(obj.clientId)
                                          }
                                        >
                                          {obj.lName + ", " + obj.fName}
                                        </span>{" "}
                                        as {obj.relationName}
                                      </div>
                                    )}
                                    {obj.isOpenedClientProfile === true && (
                                      <div className="d-flex align-items-center">
                                        <span
                                          className="k-icon k-i-edit me-2"
                                          onClick={() =>
                                            handleEditSiblings(obj)
                                          }
                                        ></span>

                                        <Tooltip
                                          anchorElement="target"
                                          position="top"
                                        >
                                          <i
                                            className="fa fa-trash fa-xs"
                                            onClick={() => deleteSibling(obj)}
                                            title="Delete"
                                          />
                                        </Tooltip>
                                      </div>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </ul>
                        </div>
                      </ExpansionPanelContent>
                    )}
                  </ExpansionPanel>
                </div>
              </div>

              <div className="col-md-6 col-xl-4 col-12 px-lg-3 mb-3">
                <div className="widget-box">
                  <ExpansionPanel
                    title="Emergency Contact"
                    expanded={expEmContact}
                    onAction={(e) => setExpEmContact(!e.expanded)}
                  >
                    {expEmContact && (
                      <ExpansionPanelContent>
                        <div className="text-right">
                          {userAccessPermission[
                            permissionEnum.EDIT_CLIENT_PROFILE
                          ] && (
                            <button
                              onClick={handleAddEmergence}
                              className="btn blue-primary-outline btn-sm"
                            >
                              + Add
                            </button>
                          )}
                        </div>

                        <div className="show-height-common white-scroll">
                          <ul className="list-unstyled mb-0 details-info">
                            <li className="client-list-sibling list-unstyled border mt-2">
                              {emergencyContactList.map((item, index) => {
                                return (
                                  <li>
                                    {item.ecName} {"\u00a0"}({item.relationName}
                                    ){"\u00a0\u00a0"}
                                    <span className="fa fa-sm fa-phone mt-1"></span>
                                    {item.ecPhone}
                                    {" \u00a0\u00a0"}
                                    <Tooltip
                                      anchorElement="target"
                                      position="top"
                                    >
                                      <i
                                        className="fa fa-trash fa-xs"
                                        onClick={() => deleteEmergency(item.id)}
                                        title="Delete"
                                      />
                                    </Tooltip>
                                  </li>
                                );
                              })}
                            </li>
                          </ul>
                        </div>
                      </ExpansionPanelContent>
                    )}
                  </ExpansionPanel>
                </div>
              </div>

              <div className="col-md-6 col-xl-4 col-12 px-lg-3 mb-3">
                <div className="widget-box">
                  <ExpansionPanel
                    title="Referral Source"
                    expanded={expClientRef}
                    onAction={(e) => setExpClientRef(!e.expanded)}
                  >
                    {expClientRef && (
                      <ExpansionPanelContent>
                        <div>
                          <div className="text-right">
                            {userAccessPermission[
                              permissionEnum.EDIT_CLIENT_PROFILE
                            ] && (
                              <button
                                onClick={handleEditReferral}
                                className="btn blue-primary-outline btn-sm "
                              >
                                <i className="k-icon k-i-edit pencile-edit-color"></i>{" "}
                                Edit
                              </button>
                            )}
                          </div>
                          <div className="show-height-common white-scroll">
                            <div>
                              <ul className="list-unstyled mb-0 details-info">
                                <li className="d-flex mb-3">
                                  <p className="mb-0 col-md-6 mt-3 fw-500">
                                    Referral Source
                                  </p>
                                  <p className="mb-0  col-md-6 mt-3 ">
                                    {clientRefSource &&
                                      clientRefSource?.contactPerson +
                                        " (" +
                                        clientRefSource?.referringCompanyName +
                                        ") "}
                                  </p>
                                </li>
                                <li className="d-flex mb-3">
                                  <p className="mb-0 col-md-6 fw-500">
                                    Referral Date
                                  </p>
                                  <p className="mb-0  col-md-6">
                                    {clientRefSource &&
                                    clientRefSource?.dateReferral
                                      ? moment(
                                          clientRefSource?.dateReferral
                                        ).format("M/D/YYYY")
                                      : ""}
                                  </p>
                                </li>
                                <li className="d-flex mb-3">
                                  <p className="mb-0 col-md-6 fw-500">
                                    Reason for Referral
                                  </p>
                                  <p className="mb-0  col-md-6">
                                    {clientRefSource?.referralReason}
                                  </p>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </ExpansionPanelContent>
                    )}
                  </ExpansionPanel>
                </div>
              </div>

              <div className="col-md-6 col-xl-4 col-12 px-lg-3 mb-3">
                <div className="widget-box">
                  <ExpansionPanel
                    title="Referring Provider "
                    expanded={expRefProvider}
                    onAction={(e) => setExpRefProvider(!e.expanded)}
                  >
                    {expRefProvider && (
                      <ExpansionPanelContent>
                        <div>
                          <div className="text-right">
                            {userAccessPermission[
                              permissionEnum.EDIT_CLIENT_PROFILE
                            ] && (
                              <button
                                onClick={handleEditRefProvider}
                                className="btn blue-primary-outline btn-sm "
                              >
                                <i className="k-icon k-i-edit pencile-edit-color"></i>{" "}
                                Edit
                              </button>
                            )}
                          </div>
                          <div className="show-height-common white-scroll">
                            <div>
                              <ul className="list-unstyled mb-0 details-info">
                                <li className="d-flex mb-3 ">
                                  <p className="mb-0 col-md-6 mt-2 fw-500">
                                    Referring Provider
                                  </p>
                                  <p className="mb-0  col-md-6 mt-2">
                                    {refSourceData &&
                                      refSourceData?.firstName +
                                        " " +
                                        refSourceData?.lastName +
                                        " (" +
                                        refSourceData?.referringCompanyName +
                                        ") "}
                                  </p>
                                </li>
                                <li className="d-flex mb-3">
                                  <p className="mb-0 col-md-6 fw-500">
                                    Referral Date
                                  </p>
                                  <p className="mb-0  col-md-6">
                                    {refSourceData &&
                                    refSourceData?.dateReferral
                                      ? moment(
                                          refSourceData?.dateReferral
                                        ).format("M/D/YYYY")
                                      : ""}
                                  </p>
                                </li>
                                <li className="d-flex mb-3">
                                  <p className="mb-0 col-md-6 fw-500">
                                    Reason for Referring
                                  </p>
                                  <p className="mb-0  col-md-6">
                                    {refSourceData?.referralReason}
                                  </p>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </ExpansionPanelContent>
                    )}
                  </ExpansionPanel>
                </div>
              </div>
              <div className="col-md-6 col-xl-4 col-12 px-lg-3 mb-3">
                <div className="widget-box">
                  <ExpansionPanel
                    title="Primary Care Physician"
                    expanded={expandPhysician}
                    onAction={(e) => setExpandPhysician(!e.expanded)}
                  >
                    {expandPhysician && (
                      <ExpansionPanelContent>
                        <div>
                          <div className="text-right">
                            {userAccessPermission[
                              permissionEnum.EDIT_CLIENT_PROFILE
                            ] && (
                              <button
                                onClick={handleEditPrimaryCare}
                                className="btn blue-primary-outline btn-sm "
                              >
                                <i className="k-icon k-i-edit pencile-edit-color"></i>{" "}
                                Edit
                              </button>
                            )}
                          </div>
                          <div className="show-height-common white-scroll">
                            <div>
                              <ul className="list-unstyled mb-0 details-info">
                                <li className="d-flex mb-3">
                                  <p className="mb-0 col-md-6 mt-2 fw-500">
                                    Primary Physician
                                  </p>
                                  <p className="mb-0  col-md-6 mt-2">
                                    {primaryCareData && primaryCareData?.name}
                                  </p>
                                </li>
                                <li className="d-flex mb-3">
                                  <p className="mb-0 col-md-6 fw-500">
                                    Address
                                  </p>
                                  <p className="mb-0  col-md-6">
                                    {primaryCareData?.address}
                                  </p>
                                </li>
                                <li className="d-flex mb-3">
                                  <p className="mb-0 col-md-6 fw-500">Phone</p>
                                  <p className="mb-0  col-md-6">
                                    {PrimaryNumber}
                                  </p>
                                </li>
                                {/* <li className="d-flex mb-3">
                                  <p className="mb-0 col-md-6 fw-500">Fax</p>
                                  <p className="mb-0  col-md-6">{PrimaryFax}</p>
                                </li> */}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </ExpansionPanelContent>
                    )}
                  </ExpansionPanel>
                </div>
              </div>
              <div className="col-md-6 col-xl-4 col-12 px-lg-3 mb-3">
                <div className="widget-box">
                  <ExpansionPanel
                    title="Pediatrician "
                    expanded={expandPediatrication}
                    onAction={(e) => setExpandPediatrication(!e.expanded)}
                  >
                    {expandPediatrication && (
                      <ExpansionPanelContent>
                        <div>
                          <div className="text-right">
                            {userAccessPermission[
                              permissionEnum.EDIT_CLIENT_PROFILE
                            ] && (
                              <button
                                onClick={handlePediatrician}
                                className="btn blue-primary-outline btn-sm "
                              >
                                <i className="k-icon k-i-edit pencile-edit-color"></i>{" "}
                                Edit
                              </button>
                            )}
                          </div>
                          <div className="show-height-common white-scroll">
                            <div>
                              <ul className="list-unstyled mb-0 details-info">
                                <li className="d-flex mb-3">
                                  <p className="mb-0 col-md-6 mt-2 fw-500">
                                    Pediatrician
                                  </p>
                                  <p className="mb-0  col-md-6 mt-2">
                                    {pediatricianData && pediatricianData?.name}
                                  </p>
                                </li>
                                <li className="d-flex mb-3">
                                  <p className="mb-0 col-md-6 fw-500">
                                    Address
                                  </p>
                                  <p className="mb-0  col-md-6">
                                    {pediatricianData &&
                                      pediatricianData?.address}
                                  </p>
                                </li>
                                <li className="d-flex mb-3">
                                  <p className="mb-0 col-md-6 fw-500">Phone</p>
                                  <p className="mb-0 col-md-6">
                                    {PediatricationNumber}
                                  </p>
                                </li>
                                {/* <li className="d-flex mb-3">
                                  <p className="mb-0 col-md-6 fw-500">Fax</p>
                                  <p className="mb-0 col-md-6">
                                    {PediatricationFax}
                                  </p>
                                </li> */}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </ExpansionPanelContent>
                    )}
                  </ExpansionPanel>
                </div>
              </div>
            </div>
            {onEdit && (
              <EditClient
                onClose={handleEditProfile}
                selectedClientId={selectedClientId}
                clientInfo={clientInfo}
              />
            )}

            {openAddSites && (
              <AddSites
                clientSites={clientSites}
                onClose={handleSiteClose}
                selectedClientId={selectedClientId}
              />
            )}
            {openAddSiblings && (
              <AddSiblings
                selectedClientId={selectedClientId}
                onClose={handleSiblingClose}
              />
            )}

            {openEditSiblings && (
              <EditSiblings
                selectedClientId={selectedClientId}
                selectedSibling={selectedSibling}
                onClose={handleSiblingClose}
              />
            )}

            {isDeleteSibling && (
              <DeleteSiblings
                selectedClientId={selectedClientId}
                selectedSibling={selectedSibling}
                onClose={handleDeleteSiblingClose}
              />
            )}
            {addEmergence && (
              <AddEmergence
                selectedClientId={selectedClientId}
                onClose={handleSiblingClose}
                getEmergencyContact={getEmergencyContact}
              />
            )}
            {openClientReferral && (
              <EditClientReferral onClose={handleCloseReferral} />
            )}

            {openClientFlags && (
              <AddClientFlag
                onClose={handleCloseFlag}
                clientFlags={clientFlags}
              />
            )}

            {openRefProvider && (
              <EditClientProvider onClose={handleCloseRefProvider} />
            )}

            {primaryCare && (
              <PrimaryCarePhyisican
                onClose={handleClosePrimaryCare}
                getPrimaryCallback={getPrimaryCarePhysician}
              />
            )}
            {pediatrician && (
              <Pediatrication
                onClose={handleClosePediatrician}
                getPediatricianCallback={getPediatrician}
              />
            )}
            {isPrintPDF && (
              <ClientDashboardPDF
                treatmentPlan={clientInfo}
                isPrintPDF={isPrintPDF}
                setIsPrintPDF={setIsPrintPDF}
                clientInfo={clientInfo}
                curentInsurance={cuurentInsurance}
                clientRefSource={clientRefSource}
                refSourceData={refSourceData}
                primaryCareData={primaryCareData}
                pediatricianData={pediatricianData}
                emergencyContactList={emergencyContactList}
                clientSiblings={clientSiblings}
                communicationList={communicationList}
                clientSites={clientSites}
                clientFlags={clientFlags}
                showNewPass={showNewPass}
                profilePic={profilePic}
                phoneImage={phoneImage}
              />
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
export default ClientDashboard;
