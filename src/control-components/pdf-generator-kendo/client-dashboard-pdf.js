import React from "react";
import { drawDOM, exportPDF } from "@progress/kendo-drawing";
import { saveAs } from "@progress/kendo-file-saver";
import * as ReactDOMServer from "react-dom/server";
import { MaskFormatted } from "../../helper/mask-helper";
import moment from "moment";
import { Chip } from "@progress/kendo-react-buttons";

const exportElement = (element, options) => {
  drawDOM(element, options)
    .then((group) => {
      return exportPDF(group);
    })
    .then((dataUri) => {
      saveAs(dataUri, "client_dashboard.pdf");
    });
};

function ClientDashboardPDF({
  isPrintPDF,
  setIsPrintPDF,
  clientInfo,
  curentInsurance,
  clientRefSource,
  refSourceData,
  primaryCareData,
  pediatricianData,
  emergencyContactList,
  clientSiblings,
  communicationList,
  clientSites,
  clientFlags,
  showNewPass,
  profilePic,
  phoneImage,
}) {


  let _element = null;
  React.useEffect(() => {
    if (isPrintPDF) {
      handleSelect();
    }
  }, []);

  

  const myTemplate = (args) => {
    return ReactDOMServer.renderToString();
  };

  const handleSelect = () => {
    exportElement(_element, {
      paperSize: "A4",
      marginTop: "0",
      marginLeft: "1cm",
      marginRight: "1cm",
      marginBottom: "1cm",
      fileName: "Client dashboard",
      author: "Notenetic Team",
      template: myTemplate,
    });
    setIsPrintPDF(false);
  };

  let phoneNum = MaskFormatted(
    clientInfo ? clientInfo.homePhone : "",
    "(999) 999-9999"
  );
  let PhysicianPhoneNumber = MaskFormatted(
    primaryCareData ? primaryCareData.phone : "",
    "(999) 999-9999"
  );

  let PhysicianFax = MaskFormatted(
    primaryCareData ? primaryCareData.fax : "",
    "(999) 999-9999"
  );
  let PediatricianPhoneNumber = MaskFormatted(
    pediatricianData ? pediatricianData.phone : "",
    "(999) 999-9999"
  );

  let PediatricianFax = MaskFormatted(
    pediatricianData ? pediatricianData.fax : "",
    "(999) 999-9999"
  );

  return (
    <div>
      <div
        className="off-screen"
        style={{ position: "absolute", left: "-10000px", top: "0" }}
      >
        <div
          ref={(div) => {
            _element = div;
          }}
          style={{ fontSize: "10px" }}
        >
          <div className="header-pdf">
            <div className="grid-template-pdf">
              <p className="user-pdf-img">
                <img src={profilePic} className="user-pdf" alt="" />
              </p>
              <div className="">
                <span
                  style={{ color: "#000", fontSize: "14px", marginLeft: "5px", marginRight:"0px" }}
                >
                  {clientInfo ? clientInfo.fName : ""}
                </span>
                {clientInfo ? (
                  <span
                    style={{
                      color: "#000",
                      fontSize: "14px",
                      marginLeft: "3px",
                      marginRight:"3px"
                    }}
                  >
                    {clientInfo ? clientInfo.mName : ""}
                  </span>
                ) : (
                  ""
                )}
                <span
                  style={{ color: "#000", fontSize: "14px", marginLeft: "0" }}
                >
                  {clientInfo ? clientInfo.lName : ""}
                </span>

                <ul
                  className="list-unstyled list-icons-pdf "
                  style={{ marginBottom: "0px" }}
                >
                  <li style={{ color: "#000" }}>
                    <i
                      className="k-icon k-i-email"
                      style={{
                        marginRight: "5px",
                        backgroundColor: "#635BF6",
                        borderRadius: "100%",
                        padding: "10px",
                        color: "#fff",
                        fontSize: "9px",
                      }}
                    ></i>
                    {clientInfo ? clientInfo.email : ""}
                  </li>
                  <li style={{ color: "#000", padding:"0" }}>
                    {/* <img src={phoneImage} alt="" className="user-pdf"/> */}
                    {phoneNum}
                  </li>
                </ul>
                <ul
                  className="show-skills chip-list-skill  list-unstyled mb-0 d-flex align-items-center flex-wrap"
                  style={{ marginBottom: "0px" }}
                >
                  {clientFlags.length > 0 &&
                    clientFlags.map((obj) => (
                      <Chip
                        text={obj.flagName}
                        key={obj.id}
                        value="chip"
                        rounded={"large"}
                        fillMode={"solid"}
                        size={"medium"}
                        style={{
                          marginRight: 5,
                          backgroundColor: obj.color,
                          marginBottom: 10,
                          color: "#ffffff",
                          borderRadius: "4px",
                          fontSize: "10px",
                          lineHeight: "14px",
                        }}
                      />
                    ))}
                </ul>
              </div>
            </div>

            <div className="details-pdf-dt">
              <h6>Details</h6>
              <div className="row px-4 py-2">
                <div className="col-lg-6 rightline-border">
                  <ul className="details-grid list-unstyled">
                    <li>
                      <p className="fw-bold">First Name</p>
                      <p style={{ color: "#414141" }}>
                        {clientInfo ? clientInfo.fName : ""}
                      </p>
                    </li>
                    {clientInfo.mName === null ? (
                      <li style={{ display: "none" }}></li>
                    ) : (
                      <li>
                        <p className="fw-bold">Middle Name</p>
                        <p style={{ color: "#414141" }}>
                          {clientInfo ? clientInfo.mName : ""}
                        </p>
                      </li>
                    )}

                    <li>
                      <p className="fw-bold">Last Name</p>
                      <p style={{ color: "#414141" }}>
                        {clientInfo ? clientInfo.lName : ""}
                      </p>
                    </li>
                    <li>
                      <p className="fw-bold">Nick Name</p>
                      <p style={{ color: "#414141" }}>
                        {clientInfo ? clientInfo.nickName : ""}
                      </p>
                    </li>
                    <li>
                      <p className="fw-bold">Gender</p>
                      <p style={{ color: "#414141" }}>
                        {clientInfo ? clientInfo.gender : ""}
                      </p>
                    </li>
                    <li>
                      <p className="fw-bold">Date of Birth</p>
                      <p style={{ color: "#414141" }}>
                        {" "}
                        {moment(clientInfo.dob).format("M/D/YYYY")}
                      </p>
                    </li>
                    <li>
                      <p className="fw-bold">Record Id</p>
                      <p style={{ color: "#414141" }}>
                        {clientInfo ? clientInfo.recordId : ""}
                      </p>
                    </li>
                    <li>
                      <p className="fw-bold">Hair Color</p>
                      <p style={{ color: "#414141" }}>
                        {clientInfo ? clientInfo.hairColor : ""}
                      </p>
                    </li>
                    <li>
                      <p className="fw-bold">Eye Color</p>
                      <p style={{ color: "#414141" }}>
                        {clientInfo ? clientInfo.eyeColor : ""}
                      </p>
                    </li>
                    <li>
                      <p className="fw-bold">Smoker</p>
                      <p style={{ color: "#414141" }}>
                        {clientInfo ? clientInfo.smokingStatus : ""}
                      </p>
                    </li>
                    <li>
                      <p className="fw-bold">Race</p>
                      <p style={{ color: "#414141" }}>
                        {clientInfo ? clientInfo.race : ""}
                      </p>
                    </li>
                    <li>
                      <p className="fw-bold">Ethnicity</p>
                      <p style={{ color: "#414141" }}>
                        {clientInfo ? clientInfo.ethnicityName : ""}
                      </p>
                    </li>
                  </ul>
                </div>
                <div className="col-lg-6">
                  <ul className="details-grid list-unstyled">
                    <li>
                      <p className="fw-bold">SSN</p>
                      <p style={{ color: "#414141" }}>
                        {clientInfo.ssn
                          ? showNewPass === "SSN"
                            ? "***-**-" + String(clientInfo.ssn).slice(-4)
                            : MaskFormatted(clientInfo.ssn, "999-99-9999")
                          : ""}
                      </p>
                    </li>
                    <li>
                      <p className="fw-bold">Address 1</p>
                      <p style={{ color: "#414141" }}>
                        {clientInfo ? clientInfo.homeAddress : ""}
                      </p>
                    </li>
                    <li>
                      <p className="fw-bold">Address 2</p>
                      <p style={{ color: "#414141" }}>
                        {clientInfo ? clientInfo.homeAddress2 : ""}
                      </p>
                    </li>
                    <li>
                      <p className="fw-bold">City</p>
                      <p style={{ color: "#414141" }}>
                        {clientInfo ? clientInfo.homeCity : ""}
                      </p>
                    </li>
                    <li>
                      <p className="fw-bold">State</p>
                      <p style={{ color: "#414141" }}>
                        {clientInfo ? clientInfo.homeStateName : ""}
                      </p>
                    </li>
                    <li>
                      <p className="fw-bold">Zip</p>
                      <p style={{ color: "#414141" }}>
                        {clientInfo ? clientInfo.homeZip : ""}
                      </p>
                    </li>
                    <li>
                      <p className="fw-bold">Comm. Pref</p>
                      <ul
                        className={
                          communicationList.canCallHomePhone === true ||
                          communicationList.canCallHomePhone === true ||
                          communicationList.canCallMobilePhone === true ||
                          communicationList.canSendEmail === true ||
                          communicationList.canSendFax === true ||
                          communicationList.canSendTextSMS === true
                            ? "listphone-call dotts-list pl-2 mb-0"
                            : "istphone-call pl-2 mb-0"
                        }
                      >
                        <li
                          className={
                            communicationList.canCallHomePhone == true
                              ? "mb-0 fw-500"
                              : "mb-0 fw-500 common_prof_list"
                          }
                        >
                          {communicationList.canCallHomePhone == true
                            ? "Home Phone call"
                            : ""}
                        </li>
                        <li
                          className={
                            communicationList.canCallMobilePhone == true
                              ? "mb-0 fw-500"
                              : "mb-0 fw-500 common_prof_list"
                          }
                        >
                          {communicationList.canCallMobilePhone == true
                            ? "Home Mobile call"
                            : ""}
                        </li>
                        <li
                          className={
                            communicationList.canSendEmail == true
                              ? "mb-0 fw-500"
                              : "mb-0 fw-500 common_prof_list"
                          }
                        >
                          {communicationList.canSendEmail == true
                            ? "Send Email"
                            : ""}
                        </li>
                        <li
                          className={
                            communicationList.canSendFax == true
                              ? "mb-0 fw-500"
                              : "mb-0 fw-500 common_prof_list"
                          }
                        >
                          {communicationList.canSendFax == true
                            ? " Send Fax"
                            : ""}
                        </li>
                        <li
                          className={
                            communicationList.canSendTextSMS == true
                              ? "mb-0 fw-500"
                              : "mb-0 fw-500 common_prof_list"
                          }
                        >
                          {communicationList.canSendTextSMS == true
                            ? "Text SMS"
                            : ""}
                        </li>
                      </ul>
                    </li>
                    <li>
                      <p className="fw-bold">Sites</p>
                      {/* <ul className="listphone-call dotts-list pl-2 mb-0"> */}

                      <ul className="mb-0 fw-500 listphone-call dotts-list  pl-2 mb-0">
                        {clientSites.map((obj, index) => (
                          <li key={index}>{obj.name}</li>
                        ))}
                      </ul>

                      {/* </ul>{" "} */}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* End */}
            <div className="details-pdf-dt mb-3 border-bottom">
              <h6 className="blue-style">Current Insurance</h6>
              <div className="row px-4 py-2">
                <div className="col-lg-6">
                  <ul className="details-grid list-unstyled mb-0">
                    <li>
                      <p className="fw-bold">Insurance</p>
                      <p style={{ color: "#414141" }}>
                        {!curentInsurance ? "" : curentInsurance.insuranceName}
                      </p>
                    </li>
                    <li>
                      <p className="fw-bold">Policy#</p>
                      <p style={{ color: "#414141" }}>
                        {!curentInsurance ? "" : curentInsurance.policyNumber}
                      </p>
                    </li>
                  </ul>
                </div>
                <div className="col-lg-6">
                  <ul className="details-grid list-unstyled mb-0">
                    <li>
                      <p className="fw-bold">State Date</p>
                      <p style={{ color: "#414141" }}>
                        {!curentInsurance
                          ? ""
                          : moment(curentInsurance.dateStart).format(
                              "M/D/YYYY"
                            )}
                      </p>
                    </li>
                    <li>
                      <p className="fw-bold">End Date</p>
                      <p style={{ color: "#414141" }}>
                        {!curentInsurance
                          ? ""
                          : moment(curentInsurance.dateEnd).format(
                              "M/D/YYYY"
                            )}
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* End */}
            <div className="details-pdf-dt mb-3 border-bottom">
              <h6 className="blue-style">Relationship</h6>
              <div className="row px-4 py-2">
                <div className="col-lg-12">
                  <ul className=" list-unstyled  dotts-list colum-list-dt mb-0">
                    {clientSiblings.map((obj, index) => {
                      return (
                        <li key={index}>
                          {obj.sibClientId !== 0
                            ? obj.lName + ", " + obj.fName + "   -   "
                            : obj.sibLastName + ", " + obj.sibFirstName + " - "}
                          {obj.relationName}
                          <span className="fa fa-sm fa-phone mt-1"></span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
            {/* End */}
            <div className="details-pdf-dt mb-3 border-bottom">
              <h6 className="blue-style">Emergency Contact</h6>
              <div className="row px-4 py-2">
                <div className="col-lg-12">
                  <ul className="colum-list-dt mb-0 list-unstyled dotts-list">
                    {emergencyContactList.map((item, index) => {
                      return (
                        <li>
                          {item.ecName} ({item.relationName})
                          <span className="fa fa-sm fa-phone mt-1"></span>
                          {item.ecPhone}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
            {/* End */}
            <div className="details-pdf-dt mb-3 border-bottom">
              <h6 className="blue-style">Referral Source</h6>
              <div className="row px-4 py-2">
                <div className="col-lg-12">
                  <ul className="details-grid mb-0 list-unstyled">
                    <li>
                      <p className="fw-bold">Referral Source</p>
                      <p style={{ color: "#414141" }}>
                        {!clientRefSource
                          ? ""
                          : ` ${clientRefSource.contactPerson} (${clientRefSource.referringCompanyName})`}
                      </p>
                    </li>
                    <li>
                      <p className="fw-bold">Referral Date</p>
                      <p style={{ color: "#414141" }}>
                        {!clientRefSource
                          ? ""
                          : moment(clientRefSource.dateReferral).format(
                              "M/D/YYYY"
                            )}
                      </p>
                    </li>
                    <li>
                      <p className="fw-bold">Reason for Referral </p>
                      <p style={{ color: "#414141" }}>
                        {!clientRefSource ? "" : clientRefSource.referralReason}
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* End */}
            <div className="details-pdf-dt mb-3 border-bottom">
              <h6 className="blue-style">Referral Provider</h6>
              <div className="row px-4 py-2">
                <div className="col-lg-12">
                  <ul className="details-grid mb-0 list-unstyled">
                    <li>
                      <p className="fw-bold">Referral Provider</p>
                      <p style={{ color: "#414141" }}>
                        {!refSourceData
                          ? ""
                          : `${refSourceData.firstName} ${refSourceData.lastName} (${refSourceData.referringCompanyName})`}
                      </p>
                    </li>
                    <li>
                      <p className="fw-bold">Referral Date</p>
                      <p style={{ color: "#414141" }}>
                        {!refSourceData
                          ? ""
                          : moment(refSourceData.dateReferral).format(
                              "M/D/YYYY"
                            )}
                      </p>
                    </li>
                    <li>
                      <p className="fw-bold">Reason for Referral </p>
                      <p style={{ color: "#414141" }}>
                        {!refSourceData ? "" : refSourceData.referralReason}
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* End */}
            <div className="details-pdf-dt mb-3 border-bottom">
              <h6 className="blue-style">Primary Care Physician</h6>
              <div className="row px-4 py-2">
                <div className="col-lg-12">
                  <ul className="details-grid mb-0 list-unstyled">
                    <li>
                      <p className="fw-bold">Primary Name</p>
                      <p style={{ color: "#414141" }}>
                        {!primaryCareData ? "" : primaryCareData.name}
                      </p>
                    </li>
                    <li>
                      <p className="fw-bold">Address</p>
                      <p style={{ color: "#414141" }}>
                        {!primaryCareData ? "" : primaryCareData.address}
                      </p>
                    </li>
                    <li>
                      <p className="fw-bold">Phone </p>
                      <p style={{ color: "#414141" }}>{PhysicianPhoneNumber}</p>
                    </li>
                    {/* <li>
                      <p className="fw-bold">Fax</p>
                      <p style={{ color: "#414141" }}>{PhysicianFax}</p>
                    </li> */}
                  </ul>
                </div>
              </div>
            </div>
            {/* End */}
            <div className="details-pdf-dt mb-3 border-bottom">
              <h6 className="blue-style">Pediatrician</h6>
              <div className="row px-4 py-2">
                <div className="col-lg-6">
                  <ul className="details-grid mb-0 list-unstyled">
                    <li>
                      <p className="fw-bold">Primary Name</p>
                      <p style={{ color: "#414141" }}>
                        {!pediatricianData ? "" : pediatricianData.name}
                      </p>
                    </li>
                    <li>
                      <p className="fw-bold">Address</p>
                      <p style={{ color: "#414141" }}>
                        {!pediatricianData ? "" : pediatricianData.address}
                      </p>
                    </li>
                    <li>
                      <p className="fw-bold">Phone </p>
                      <p style={{ color: "#414141" }}>
                        {PediatricianPhoneNumber}
                      </p>
                    </li>
                    {/* <li>
                      <p className="fw-bold">Fax</p>
                      <p style={{ color: "#414141" }}>{PediatricianFax}</p>
                    </li> */}
                  </ul>
                </div>
              </div>
            </div>
            {/* End */}
          </div>
        </div>
      </div>
    </div>
  );
}
export default ClientDashboardPDF;
