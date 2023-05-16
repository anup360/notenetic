import React, { useEffect, useState } from "react";
import { PDFExport } from "@progress/kendo-react-pdf";
import * as ReactDOM from "react-dom";
import { drawDOM, exportPDF } from "@progress/kendo-drawing";
import { saveAs } from "@progress/kendo-file-saver";
import * as ReactDOMServer from "react-dom/server";
import DateTimeHelper from "../../helper/date-time-helper";
import { MaskFormatted } from "../../helper/mask-helper";
import { useSelector } from "react-redux";

const exportElement = (element, options) => {
  drawDOM(element, options)
    .then((group) => {
      return exportPDF(group);
    })
    .then((dataUri) => {
      saveAs(dataUri, "discharge.pdf");
    });
};

function DischargeClientPDF({
  isPrintPDF,
  setIsPrintPDF,
  staffLoginInfo,
  clientDetail,
  dischargeDetail,
}) {
  let _element = null;
  const profilePic = useSelector((state) => state.getClientProfileImg);
  React.useEffect(() => {
    if (isPrintPDF) {
      handleSelect();
    }
  }, []);

  const handleSelect = () => {
    exportElement(_element, {
      paperSize: "A4",
      marginTop: "0",
      marginLeft: "1cm",
      marginRight: "1cm",
      marginBottom: "1cm",
      fileName: "Discharge",
      author: "Notenetic Team",
      template: myTemplate,
    });
    setIsPrintPDF(false);
  };

  let phoneNum = MaskFormatted(
    clientDetail ? clientDetail.homePhone : "",
    "(999) 999-9999"
  );

  const myTemplate = (args) => {
    return ReactDOMServer.renderToString(<div></div>);
  };

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
          style={{ fontSize: "11px" }}
        >
          <div className="">
            <div
              style={{
                position: "relative",
                top: "0px",
                left: 0,
                padding: "10px 20px 13px",
                background: "#F6F8FA",
                width: "100%",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  paddingLeft: "10px",
                  color: "#5951e5",
                }}
              >
                notenetic
              </div>

              <div
                style={{
                  textAlign: "right",
                  fontSize: "10px",
                  position: "absolute",
                  right: "0",
                  paddingRight: "10px",
                  left: "auto",
                  top: "10px",
                }}
              >
                <span>Clinic Name: {staffLoginInfo?.clinicName}</span>
                <p style={{ fontSize: "10px", marginBottom: "0px" }}>
                  {" "}
                  {staffLoginInfo?.phone}
                </p>
              </div>
            </div>
            <div className="grid-template-pdf">
              <p className="user-pdf-img">
                <img
                  src={"data:image/png;base64," + profilePic.clinicLogo}
                  className="user-pdf"
                  alt=""
                />
              </p>
              <div className="">
                <span
                  style={{ color: "#000", fontSize: "14px", marginLeft: "5px" }}
                >
                  {clientDetail ? clientDetail.fName : ""}
                </span>
                <span
                  style={{ color: "#000", fontSize: "14px", marginLeft: "5px" }}
                >
                  {clientDetail ? clientDetail.mName : ""}
                </span>
                <span
                  style={{ color: "#000", fontSize: "14px", marginLeft: "5px" }}
                >
                  {clientDetail ? clientDetail.lName : ""}
                </span>

                <ul
                  className="list-unstyled list-icons-pdf "
                  style={{ marginBottom: "0px" }}
                >
                  <li style={{ color: "#000" }}>
                    <i
                      className="k-icon k-i-email"
                      style={{
                        marginRight: "10px",
                        backgroundColor: "#635BF6",
                        borderRadius: "100%",
                        padding: "10px",
                        color: "#fff",
                        fontSize: "9px",
                      }}
                    ></i>
                    {clientDetail ? clientDetail.email : ""}
                  </li>
                  <li style={{ color: "#000" }}>
                    <i
                      className="k-icon k-i-phone"
                      style={{
                        marginRight: "10px",
                        backgroundColor: "#635BF6",
                        borderRadius: "100%",
                        padding: "10px",
                        color: "#fff",
                        fontSize: "9px",
                      }}
                    ></i>
                    {phoneNum}
                  </li>
                </ul>
              </div>
            </div>
            <div className="details-pdf-dt">
              <div className="row px-4 py-2">
                <div className="col-lg-12 ">
                  <div className="discharge">
                      <p className="fw-bold" style={{marginBottom:'3px'}}>Discharge Date</p>
                      <p style={{ color: "#414141" }}>
                        {dischargeDetail
                          ? DateTimeHelper.formatDatePickerString(
                              dischargeDetail?.dateDischarge
                            )
                          : ""}
                      </p>
                      
                    </div>
                  <div className="discharge">
                     <p className="fw-bold" style={{marginBottom:'3px'}}>Discharge Reasons</p>
                      <p style={{ color: "#414141" }}>
                        {dischargeDetail
                          ? dischargeDetail?.dischargeReason
                          : ""}
                      </p>
                      </div>
                  <div className="discharge">
                      <p className="fw-bold" style={{marginBottom:'3px'}}>Discharge Summary</p>
                      <p style={{ color: "#414141" }}>
                        {dischargeDetail
                          ? dischargeDetail?.dischargeSummary
                          : ""}
                      </p>
                    </div>
                </div>
              </div>
            </div>
            {/* <div className="treament-pdf-line">
          <h6>
            <b>{dischargeDetail?.dischargeReason}</b>
          </h6>
          <p style={{marginBottom:'0px'}}>{dischargeDetail?.dischargeSummary}</p>
          <p>
            {DateTimeHelper.formatDatePickerString(
              dischargeDetail?.dateDischarge
            )}
          </p>
          </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
export default DischargeClientPDF;
