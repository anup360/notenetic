import React from "react";
import { drawDOM, exportPDF } from "@progress/kendo-drawing";
import { saveAs } from "@progress/kendo-file-saver";
import * as ReactDOMServer from "react-dom/server";
import DateTimeHelper from "../../helper/date-time-helper";
import { MaskFormatted } from "../../helper/mask-helper";
import { useSelector } from "react-redux";
import moment from "moment";
import { displayDate } from "src/util/utility";

const exportElement = (element, options) => {
  drawDOM(element, options)
    .then((group) => {
      return exportPDF(group);
    })
    .then((dataUri) => {
      saveAs(dataUri, "treatment_plan.pdf");
    });
};

function TreatmentPlanPDF({
  treatmentPlan,
  isPrintPDF,
  setIsPrintPDF,
  clientSignData,
  staffSignData,
  clientDetail,
  staffLoginInfo,
}) {
  let _element = null;
  const profilePic = useSelector((state) => state.getClientProfileImg);
  React.useEffect(() => {
    if (isPrintPDF) {
      handleSelect();
    }
  }, []);

  let phoneNum = MaskFormatted(
    clientDetail ? clientDetail?.homePhone : "",
    "(999) 999-9999"
  );

  const myTemplate = (args) => {
    return ReactDOMServer.renderToString(
      <div>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            padding: "8px 20px",
            background: "#F6F8FA",
            width: "100%",
          }}
        >
          <ul
            style={{
              display: "flex",
              paddingLeft: "0px",
              position: "relative",
              top: "0px",
              fontSize: "9px",
              marginBottom: "0px",
              textAlign: "center",
              justifyContent: "center",
            }}
          // className="list-unstyled pl-0 details-info"
          >
            {clientDetail?.fName && (
              <li
                style={{
                  display: "flex",
                  marginRight: "10px",
                  paddingRight: "5px",
                  borderRight: "1px solid #ddd",
                }}
              >
                <span style={{ fontSize: "9px" }}>Name: </span>
                <span style={{ fontSize: "9px", paddingLeft: "3px" }}>
                  {" "}
                  {clientDetail?.fName}
                </span>
              </li>
            )}
            {clientDetail?.dob && (
              <li
                style={{
                  display: "flex",
                  marginRight: "10px",
                  paddingRight: "5px",
                  borderRight: "1px solid #ddd",
                }}
              >
                <span style={{ fontSize: "9px" }}>Date of Birth: </span>
                <span style={{ fontSize: "9px", paddingLeft: "3px" }}>
                  {" "}
                  {DateTimeHelper.formatDatePickerString(clientDetail?.dob)}
                </span>
              </li>
            )}
            {clientDetail?.gender && (
              <li
                style={{
                  display: "flex",
                  marginRight: "10px",
                  paddingRight: "5px",
                  borderRight: "1px solid #ddd",
                }}
              >
                <span style={{ fontSize: "9px" }}>Gender: </span>
                <span style={{ fontSize: "9px", paddingLeft: "3px" }}>
                  {" "}
                  {clientDetail?.gender}
                </span>
              </li>
            )}
            {clientDetail?.email && (
              <li
                style={{
                  display: "flex",
                  marginRight: "10px",
                  paddingRight: "5px",
                }}
              >
                <span style={{ fontSize: "9px" }}>Email: </span>
                <span style={{ fontSize: "9px", paddingLeft: "3px" }}>
                  {" "}
                  {clientDetail?.email}
                </span>
              </li>
            )}
          </ul>
          <span
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
            Page {args.pageNum} of {args.totalPages}
          </span>
        </div>
      </div>
    );
  };

  const handleSelect = () => {
    exportElement(_element, {
      paperSize: "A4",
      marginTop: "0",
      marginLeft: "1cm",
      marginRight: "1cm",
      marginBottom: "1cm",
      fileName: "Treatment plan",
      author: "Notenetic Team",
      template: MyTemplate,
    });
    setIsPrintPDF(false);
  };

  const MyTemplate = args => {
    return ReactDOMServer.renderToString(
      <div>
        <div style={{
          position: 'absolute', top: 0.5, display: "flex", justifyContent: 'space-between', alignItems: "center", width: "100%",
          backgroundColor: "#F6F8FA", padding: "8px 20px",
        }}>
          <div style={{ fontSize: "10px", paddingLeft: "10px", color: "#5951e5" }}> notenetic </div>
          <div
            style={{
              textAlign: "right",
              fontSize: "10px",
              position: "absolute",
              right: "0",
              paddingRight: "10px",
              left: "auto",
              top: "3px",
              bottom :'3px'
            }}
          >
           
           <span>Clinic Name: {staffLoginInfo?.clinicName} </span><br/>
           <span>{staffLoginInfo?.phone} </span>
           
           
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 0.5, display: "flex", justifyContent: 'space-between', alignItems: "center", width: "100%", backgroundColor: "#F6F8FA", padding: "8px 20px", }}>
          <ul
            style={{
              display: "flex",
              paddingLeft: "0px",
              position: "relative",
              top: "0px",
              fontSize: "9px",
              marginBottom: "0px",
              textAlign: "center",
              justifyContent: "center",
            }}
          // className="list-unstyled pl-0 details-info"
          >
            {clientDetail?.fName && (
              <li
                style={{
                  display: "flex",
                  marginRight: "10px",
                  paddingRight: "5px",
                  borderRight: "1px solid #ddd",
                }}
              >
                <span style={{ fontSize: "9px" }}>Name: </span>
                <span style={{ fontSize: "9px", paddingLeft: "3px" }}>
                  {" "}
                  {clientDetail?.fName}
                </span>
              </li>
            )}
            {clientDetail?.dob && (
              <li
                style={{
                  display: "flex",
                  marginRight: "10px",
                  paddingRight: "5px",
                  borderRight: "1px solid #ddd",
                }}
              >
                <span style={{ fontSize: "9px" }}>Date of Birth: </span>
                <span style={{ fontSize: "9px", paddingLeft: "3px" }}>
                  {" "}
                  {DateTimeHelper.formatDatePickerString(clientDetail?.dob)}
                </span>
              </li>
            )}
            {clientDetail?.gender && (
              <li
                style={{
                  display: "flex",
                  marginRight: "10px",
                  paddingRight: "5px",
                  borderRight: "1px solid #ddd",
                }}
              >
                <span style={{ fontSize: "9px" }}>Gender: </span>
                <span style={{ fontSize: "9px", paddingLeft: "3px" }}>
                  {" "}
                  {clientDetail?.gender}
                </span>
              </li>
            )}
            {clientDetail?.email && (
              <li
                style={{
                  display: "flex",
                  marginRight: "10px",
                  paddingRight: "5px",
                }}
              >
                <span style={{ fontSize: "9px" }}>Email: </span>
                <span style={{ fontSize: "9px", paddingLeft: "3px" }}>
                  {" "}
                  {clientDetail?.email}
                </span>
              </li>
            )}
          </ul>
          <span
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
          Page  {args.pageNum} of {args.totalPages}
          </span>        </div>
      </div>
    );
  };

  return (
    <div>
      <div
        className="off-screen"
        style={{ position: "absolute", left: "-10000px", top: "0" }}
      >
        <div  ref={(div) => {
          _element = div;
        }}
          style={{ fontSize: "10px" }}
        >
          <div className="pdf-treament ">

            <div className="grid-template-pdf  mt-4">
              <p className="user-pdf-img">
                <img
                  src={"data:image/png;base64," + profilePic.clinicLogo}
                  className="user-pdf"
                  alt=""
                />
              </p>
              <div className="">
                <span
                  style={{ color: "#000", fontSize: "10px", marginLeft: "5px" }}
                >
                  {clientDetail ? clientDetail?.fName : ""}
                </span>
                <span
                  style={{ color: "#000", fontSize: "10px", marginLeft: "5px" }}
                >
                  {clientDetail ? clientDetail?.mName : ""}
                </span>
                <span
                  style={{ color: "#000", fontSize: "10px", marginLeft: "5px" }}
                >
                  {clientDetail ? clientDetail?.lName : ""}
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
                        fontSize: "11px",
                      }}
                    ></i>
                    {clientDetail ? clientDetail?.email : ""}
                  </li>
                  <li style={{ color: "#000" }}>
                    {/* <i
                      className="k-icon k-i-email "
                      style={{
                        marginRight: "10px",
                        backgroundColor: "#635BF6",
                        borderRadius: "100%",
                        padding: "10px",
                        color: "#fff",
                        fontSize: "9px",
                      }}
                    ></i> */}
                  <img src="/phone.png" className="img_tp"></img>
                    {phoneNum}
                    {clientDetail ? clientDetail?.phoneNum : ""}
                  </li> 
                </ul>
              </div>
            </div>
            <div className="treament-pdf-line px-4">
              {treatmentPlan?.length > 0 &&
                treatmentPlan?.map((treatObj) => (
                  <div key={treatObj?.id} 
                    className="first-column-pdf px-4"
                    style={{
                      marginBottom: "20px",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    <h6 className="temp-heading" key={treatObj?.id}>
                      {treatObj?.planName}
                    </h6>
                    {/* <p>{treatObj?.treatmentPlanDescription}</p> */}
                    <div className="date-timeshow">
                      <p className="mb-1">
                        <span
                          style={{
                            fontSize: "9px",
                            position: "relative",
                            top: "-2px",
                            paddingRight: "14px",
                            marginLeft:"19px",
                          }}
                          className="k-icon k-i-calendar-date text-theme pr-2"
                        ></span>
                        Plan date: 
                        <span style={{ }}>{ DateTimeHelper.formatDatePickerString(
                          treatObj?.planDate
                        )}</span>

                      </p>
                      <p className="mb-1">
                        <span
                          style={{
                            fontSize: "9px",
                            position: "relative",
                            top: "-2px",
                            paddingRight: "14px",
                            marginLeft:"19px",
                          }}
                          className="k-icon k-i-calendar-date text-theme pr-2"
                        ></span>
                        Start time: 
                        <span style={{ }}>{treatObj?.startTime? moment(new Date(displayDate(new Date(),"MM/DD/yyyy") +" "+ treatObj?.startTime)).format("hh:mm a"):' -:-'}</span>

                      </p>
                      <p className="mb-1">
                        {" "}
                        <span
                          style={{
                            fontSize: "9px",
                            position: "relative",
                            top: "-3px",
                            paddingRight: "14px",
                            marginLeft:"19px"
                          }}
                          className="k-icon k-i-calendar-date text-theme pr-2"
                        ></span>
                        Plan end date: {" "}
                        <span style={{  }}>
                          {treatObj?.planEndDate?DateTimeHelper.formatDatePickerString(
                            treatObj?.planEndDate
                          ):" -/-/-"}
                        </span>
                      </p>
                      <p className="mb-1">
                        <span
                          style={{
                            fontSize: "9px",
                            position: "relative",
                            top: "-2px",
                            paddingRight: "14px",
                            marginLeft:"19px",
                          }}
                          className="k-icon k-i-calendar-date text-theme pr-2"
                        ></span>
                        End time:
                        <span style={{ }}>{treatObj?.endTime?moment(new Date(displayDate(new Date(),"MM/DD/yyyy") +" "+ treatObj?.endTime)).format("hh:mm a"):' -:-'}</span>

                      </p>
                      <p className="mb-1">
                        {" "}
                        Service:<span style={{  }} >
                          {treatObj?.serviceName}
                        </span>
                      </p>

                      <p className="mt-1">
                      Participant:<span style={{ paddingLeft: '5px' }}>{treatObj?.activeParticipant?"Yes":"No"}</span>
                      </p>
                      <p className="mt-1">
                      Transition Discharge Plan:<span style={{ paddingLeft: '5px' }}>{treatObj?.transitionDischargePlan}</span>
                      </p>
                    </div>

                    {treatObj?.goals?.length > 0 &&
                      treatObj?.goals?.map((goalItem) => (
                        <div key={goalItem?.id}>
                          <h6 className="temp-heading" style={{ wordBreak: 'break-word', paddingRight: '20px' }}>
                            {goalItem?.goalName}
                          </h6>
                          <div className="date-timeshow px-3">
                            <p className="mb-1">
                              <span
                                style={{
                                  fontSize: "9px",
                                  position: "relative",
                                  top: "-2px",
                                  paddingRight: "14px",
                                }}
                                className="k-icon k-i-calendar-date text-theme pr-2"
                              ></span>
                              Start date:
                              <span style={{ paddingLeft: '5px' }} >
                                {goalItem?.startDate ? DateTimeHelper.formatDatePickerString(
                                  goalItem?.startDate
                                ):" -/-/-"}
                              </span>

                            </p>
                            <p style={{ paddingBottom: "12px" }}>
                              {" "}
                              <span
                                style={{
                                  fontSize: "10px",
                                  position: "relative",
                                  top: "-3px",
                                  paddingRight: "14px",
                                }}
                                className="k-icon k-i-calendar-date text-theme pr-2"
                              ></span>
                              End date:{" "}
                              <span style={{ paddingLeft: '5px' }}>
                                {goalItem?.endDate ? DateTimeHelper.formatDatePickerString(
                                  goalItem?.endDate
                                ): " -/-/-"}
                              </span>
                            </p>
                            
                          </div>
                          <p className="mt-1 status-report">
                              {" "}
                              Status:  <span style={{ }}>{goalItem?.status}</span>
                            </p>
                          {goalItem?.objectives?.length > 0 &&
                            goalItem?.objectives?.map((objItem) => (
                              <>
                                <h6 className="temp-heading mt-3" key={objItem?.id} >
                                  {objItem?.objective}
                                </h6>
                                <p>
                                  Status:  <span style={{  }} >{objItem?.status}</span>
                                </p>
                            <p style={{ paddingBottom: "12px" }}>
                              {" "}
                              <span
                                style={{
                                  fontSize: "10px",
                                  position: "relative",
                                  top: "-3px",
                                  paddingRight: "14px",
                                }}
                                className="k-icon k-i-calendar-date text-theme pr-2"
                              ></span>
                              Start date:
                              <span style={{ paddingLeft: '5px' }}>
                                {objItem?.startDate ? DateTimeHelper.formatDatePickerString(
                                  objItem?.startDate
                                ):" -/-/-"}
                              </span>

                            </p>
                            <p style={{ paddingBottom: "12px" }}>
                              {" "}
                              <span
                                style={{
                                  fontSize: "10px",
                                  position: "relative",
                                  top: "-3px",
                                  paddingRight: "14px",
                                }}
                                className="k-icon k-i-calendar-date text-theme pr-2"
                              ></span>
                              End date:{" "}
                              <span style={{ paddingLeft: '5px' }}>
                                {objItem?.endDate ? DateTimeHelper.formatDatePickerString(
                                  objItem?.endDate
                                ):" -/-/-"}
                              </span>

                            </p>

                            {objItem?.interventions?.length > 0 &&
                            objItem?.interventions?.map((intItem) => (
                              <>
                                <h6 className="temp-heading mt-3" key={intItem?.id} >
                                  {intItem?.intervention}
                                </h6>
                                <p>
                                  Status:  <span style={{  }} >{intItem?.status}</span>
                                </p>
                           
                              </>
                            ))}
                              </>
                            ))}

                            
                        </div>
                      ))}
                  
                  <div>
{treatObj?.clientSign?.length > 0 || treatObj?.staffSign?.length > 0 ? (
  <h4 className="address-title text-grey mt-4 ">
    <span className="f-24">Signatures</span>
  </h4>
) : (
  ""
)}
{treatObj?.clientSign?.length > 0 &&
  treatObj?.clientSign?.map((obj, key) => (
    <div
      key={key}
      className="d-flex justify-content-between align-items-center border p-3 mb-3"
    >
      <div className="">
        <div className="">
          <p className="mb-0 text-grey">
            Signed by:{" "}
            <span className="text-theme" style={{  }}>
              {obj?.fullNameAtSig}
            </span>
          </p>
          <p className="mb-0 text-grey">
            Date :{" "}
            <span style={{  }}>{DateTimeHelper.formatDatePickerString(
              obj.sigDateTime
            )}</span>

          </p>
        </div>
        <img
          className="signImage"
          alt="demo"
          src={"data:image/png;base64," + obj.signature}
        />
      </div>
    </div>
  ))}
{treatObj?.staffSign?.length > 0 &&
  treatObj?.staffSign?.map((obj, key) => (
    <div
      key={key}
      className="d-flex justify-content-between align-items-center border p-3 mb-3"
    >
      <div className="">
        <div className="">
          <p className="mb-0 text-grey">
            Signed by: {" "}
            <span className="text-theme" style={{}}>
              {obj?.staffName}
            </span>
          </p>
          <p className="mb-0 text-grey">
            Date: {" "}
            <span style={{  }}>
              {DateTimeHelper.formatDatePickerString(
                obj.sigDateTime
              )}
            </span>

          </p>
        </div>
        <img
          className="signImage"
          alt="demo"
          src={"data:image/png;base64," + obj.signature}
        />
      </div>
    </div>
  ))}
</div>
            
                  </div>
                  
                ))}

              {treatmentPlan.length > 0 && (
                <div>
                  {clientSignData?.length > 0 || staffSignData?.length > 0 ? (
                    <h4 className="address-title text-grey mt-4 ">
                      <span className="f-24">Signatures</span>
                    </h4>
                  ) : (
                    ""
                  )}
                  {clientSignData?.length > 0 &&
                    clientSignData.map((obj, key) => (
                      <div
                        key={key}
                        className="d-flex justify-content-between align-items-center border p-3 mb-3"
                      >
                        <div className="">
                          <div className="">
                            <p className="mb-0 text-grey">
                              Signed by:{" "}
                              <span className="text-theme" style={{  }}>
                                {obj?.fullNameAtSig}
                              </span>
                            </p>
                            <p className="mb-0 text-grey">
                              Date :{" "}
                              <span style={{  }}>{DateTimeHelper.formatDatePickerString(
                                obj.sigDateTime
                              )}</span>

                            </p>
                          </div>
                          <img
                            className="signImage"
                            alt="demo"
                            src={"data:image/png;base64," + obj.signature}
                          />
                        </div>
                      </div>
                    ))}
                  {staffSignData?.length > 0 &&
                    staffSignData?.map((obj, key) => (
                      <div
                        key={key}
                        className="d-flex justify-content-between align-items-center border p-3 mb-3"
                      >
                        <div className="">
                          <div className="">
                            <p className="mb-0 text-grey">
                              Signed by: {" "}
                              <span className="text-theme" style={{}}>
                                {obj?.staffName}
                              </span>
                            </p>
                            <p className="mb-0 text-grey">
                              Date: {" "}
                              <span style={{  }}>
                                {DateTimeHelper.formatDatePickerString(
                                  obj.sigDateTime
                                )}
                              </span>

                            </p>
                          </div>
                          <img
                            className="signImage"
                            alt="demo"
                            src={"data:image/png;base64," + obj.signature}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default TreatmentPlanPDF;
