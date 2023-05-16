import React from "react";
import { drawDOM, exportPDF } from "@progress/kendo-drawing";
import { saveAs } from "@progress/kendo-file-saver";
import * as ReactDOMServer from "react-dom/server";
import { MaskFormatted } from "../../helper/mask-helper";
import moment from "moment";
import { Chip } from "@progress/kendo-react-buttons";
import {
  Grid,
  GridColumn,
  GRID_COL_INDEX_ATTRIBUTE
} from "@progress/kendo-react-grid"; import dummyImg from '../../assets/images/dummy-img.png';
import PDFExportHelper from "../../helper/pdf-export-helper";
import { displayDateFromUtcDate, convertFromUtcDateToDateOnly } from "../../util/utility";
import DateTimeHelper from "../../helper/date-time-helper";
import { AddDocumentFileTemplate } from "../../app-modules/documents/add-document-file-template";
import { PreviewDocumentTemplate } from "../../app-modules/documents/template/preview-document-template";
import './document-styles.css';
import { convertTimeToLocally } from '../../app-modules/documents/document-utility';
import { useSelector } from "react-redux";
import {
  setExpandedState,
  setGroupIds,
  useTableKeyboardNavigation
} from "@progress/kendo-react-data-tools";
import { Checkbox, NumericTextBox } from "@progress/kendo-react-inputs"

const exportElement = (element, options) => {
  drawDOM(element, options)
    .then((group) => {
      return exportPDF(group);
    })
    .then((dataUri) => {
      saveAs(dataUri, "document.pdf");

    });
};


function DocumentTemplatePdf({
  isPrintPDF,
  staffInfo,
  documentName,
  diagnosisList,
  docSignature,
  isHtmlFileTypeTemplate,
  htmlFileName,
  template,
  onFieldsSet,
  showClinicLogo,
  documentId,
  docTreatmentPlans,
  setIsPrintPDF

}) {

  const profilePic = useSelector((state) => state.getClientProfileImgBytes);

  let _element = null;
  React.useEffect(() => {
    if (isPrintPDF) {
      onFieldsSet();
      handleSelect();
    }
  }, []);

  // const myTemplate = (args) => {
  //   return ReactDOMServer.renderToString(
  //     <div>
  //       <div
  //         style={{
  //           position: "absolute",
  //           bottom: 0,
  //           left: 0,
  //           padding: "2px 20px",
  //           background: "#F6F8FA",
  //           width: "100%",
  //         }}
  //       >
  //         <ul
  //           style={{
  //             display: "flex",
  //             paddingLeft: "0px",
  //             position: "relative",
  //             top: "0px",
  //             fontSize: "9px",
  //             marginBottom: "0px",
  //             alignItems: "center",
  //             justifyContent: "space-between",
  //             padding: "7px 0",
  //             width: "100%"
  //           }}
  //         // className="list-unstyled pl-0 details-info"
  //         >

  //           {documentName?.clientNameDoc && (
  //             <li
  //               style={{
  //               }}
  //             >
  //               <span style={{ fontSize: "9px" }}>Client Name: </span>
  //               <span style={{ fontSize: "9px" }}>
  //                 {" "}
  //                 {documentName?.clientNameDoc}
  //               </span>
  //             </li>
  //           )}

  //           {documentName?.clientId && (
  //             <li
  //               style={{

  //               }}
  //             >
  //               <span style={{ fontSize: "9px" }}>Client Id: </span>
  //               <span style={{ fontSize: "9px" }}>
  //                 {" "}
  //                 {documentName?.clientId}
  //               </span>
  //             </li>
  //           )}
  //           <li>
  //             <span
  //               style={{

  //               }}
  //             >
  //               <b>Page </b> {args.pageNum} of {args.totalPages}
  //             </span>
  //           </li>
  //         </ul>

  //       </div>
  //     </div>
  //   );
  // };


  function renderTemplate() {
    return (
      <div className="details-pdf-dt  border-bottom">
        <div className="row ">
          <div className="col-lg-12">
            <PreviewDocumentTemplate
              controlList={template.controlList}
              documentFieldsMappings={documentName.documentFieldsMappings}
              // disabled={true}
              isViewMode={true}
            />
          </div>
        </div>
      </div>
    );
  }

  const handleSelect = () => {
    exportElement(_element, {
      paperSize: "A4",
      marginTop: "0",
      marginLeft: "1cm",
      marginRight: "1cm",
      marginBottom: "1cm",
      fileName: "Document Temp",
      author: "Notenetic Team",
      template: myTemplate,
    });
    setTimeout(() => {
      setIsPrintPDF(false)
    }, 1000);
  };


  const CustomCheckBox = (props) => {
    const navigationAttributes = useTableKeyboardNavigation(props.id);

    return (
      <td
        colSpan={props.colSpan}
        role={"gridcell"}
        aria-colindex={props.ariaColumnIndex}
        aria-selected={props.isSelected}
        {...{ [GRID_COL_INDEX_ATTRIBUTE]: props.columnIndex }}
        {...navigationAttributes}
      >

        <div className="k-chip-content">
          <Checkbox title="Select" value={documentName?.clientDiagnosisId == props.dataItem.id && true}
          />
        </div>
      </td>
    );
  };



  function renderDiagnosis(diag) {
    return (
      <div className="grid-table">
        <Grid data={diag.diagnosis} style={{ fontSize: "10px" }}>
          <GridColumn
            cell={CustomCheckBox}
            className="cursor-default  icon-align"
            width="70px"
          />
          <GridColumn
            title="Diagnosis"
            className="diagnosis-title"
            cell={(props) => {
              let field = props.dataItem;
              return (
                <td style={{ fontSize: "10px" }}>
                  {field?.icd10 + " - " + field?.diagnoseName}
                </td>
              );
            }}
          />
          <GridColumn
            cell={(props) => {
              let field = props.dataItem;
              return (
                <td style={{ fontSize: "10px" }}>
                  {convertFromUtcDateToDateOnly(field?.dateDiagnose)
                  }
                </td>
              );
            }}
            title="Date" />
        </Grid>
      </div>
    );
  }



  const myTemplate = args => {
    return ReactDOMServer.renderToString(
      <div>
        <div style={{ position: 'absolute', top: 0.5, display: "flex", justifyContent: 'space-between', alignItems: "center", width: "100%", backgroundColor: "#F6F8FA", padding: "8px 20px", }}>
          <div className="document-sec" >
            <h6 className='mb-0' style={{ color: "#000", fontSize: "10px", marginLeft: "5px", fontWeight: "600" }}>Document ID : <span style={{ color: "#4a4a4b", }}>{documentId}</span> </h6>
          </div>
          <div className="document-sec">
            <h6 className='mb-0' style={{ color: "#000", fontSize: "10px", marginLeft: "5px", fontWeight: "600" }}>Client Name : <span style={{ color: "#4a4a4b", }}>{documentName?.clientNameDoc}</span></h6>
          </div>
          <div className="document-sec">
            <h6 className='mb-0' style={{ color: "#000", fontSize: "10px", marginLeft: "5px", fontWeight: "600" }}>Service Date : <span style={{ color: "#4a4a4b", }}>
              {DateTimeHelper.formatDatePickerString(documentName?.serviceDateStr)}
            </span></h6>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 0.5, display: "flex", justifyContent: 'space-between', alignItems: "center", width: "100%", backgroundColor: "#F6F8FA", padding: "8px 20px", }}>
          <div className="document-sec" >
            <h6 className='mb-0' style={{ color: "#000", fontSize: "10px", marginLeft: "5px", fontWeight: "600" }}>Client Name :  <span style={{ color: "#4a4a4b", }}>   {" "}
              {documentName?.clientNameDoc}</span> </h6>
          </div>
          <div className="document-sec">
            <h6 className='mb-0' style={{ color: "#000", fontSize: "10px", marginLeft: "5px", fontWeight: "600" }}>Client Id :  <span style={{ color: "#4a4a4b", }}>                  {documentName?.clientId}
            </span></h6>
          </div>
          <div className="document-sec">
            <h6 className='mb-0' style={{ color: "#000", fontSize: "10px", marginLeft: "5px", fontWeight: "600" }}><span style={{ color: "#4a4a4b", }}>
              <b>Page </b> {args.pageNum} of {args.totalPages}
            </span></h6>
          </div>
        </div>
      </div>
    );
  };



  return (
    <div ref={(div) => {
      _element = div;
    }}>
      <div className="documents-pdf-main-custom">
        <div className="row mt-3">
          <div className="col-md-12 mt-12 ">
            <div className="document-user-cover text-center py-3 ">
              <ul className="d-flex align-items-center"  >
                <li>
                  <p className="document-pdf-img mt-1">
                    <img src={"data:image/png;base64," + profilePic.clinicLogo} className="user-pdf" alt="" />
                  </p>
                </li>
                <li className="text-start pl-3">
                  <p className="mb-0">{staffInfo?.clinicName}</p>
                  <p style={{ color: "#aaa9b0", }}>{documentName?.docTemplateName}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className='row px-4 pt-2 mt-3  mb-0'>
          <div className='col-lg-6'>
            <ul className=" document-details-grid list-unstyled">

              <li className=''>
                <p className="fw-boldest">Service Date</p>

                <p style={{ color: "#414141" }}>
                  {DateTimeHelper.formatDatePickerString(documentName?.serviceDateStr)}
                </p>
              </li>

              {
                template.timeRecordingMethodId !== 1 &&
                <li className=''>
                  <p className="fw-boldest">Time of Service</p>
                  {
                    documentName?.documentTimeRecording?.startTime &&
                      documentName?.documentTimeRecording?.endTime ?
                      <p style={{ color: "#414141" }}>

                        {convertTimeToLocally(documentName.documentTimeRecording)}

                      </p> :
                      <p style={{ color: "#414141" }}>No Service Time </p>

                  }
                </li>
              }
              {template.showClientProgress &&
                <li>
                  <p className="fw-boldest">Client Progress</p>
                  <p style={{ color: "#414141" }}>
                    {documentName ? documentName.clientProgress : 'No Client Progress'}
                  </p>
                </li>
              }

              {template.showClientDiags &&
                <li>
                  <p className="fw-boldest">Diagnosis</p>
                  <p style={{ color: "#414141" }}>
                    {documentName ? documentName.clientDiagnosisName : ""}
                  </p>
                </li>
              }

            </ul>
          </div>
          <div className='col-lg-6'>
            <ul className=" document-details-grid list-unstyled">
              <li>
                <p className="fw-boldest">Client Name</p>
                <p style={{ color: "#414141" }}>
                  {documentName?.clientNameDoc}
                </p>
              </li>

              {template.showSiteOfService &&
                <li>
                  <p className="fw-boldest">Location/Site of Service</p>
                  <p style={{ color: "#414141" }}>
                    {documentName ? documentName.siteName : ""}
                  </p>
                </li>
              }
              {
                template.showVisitType &&
                <li>
                  <p className="fw-boldest">Visit</p>
                  <p style={{ color: "#414141" }}>
                    {documentName ? documentName.isFaceToFace == true ? "Face to Face" : "Telephone" : ""}
                  </p>
                </li>
              }



            </ul>
          </div>
        </div>
        {
          template.posType != 'Not Required' &&
          <div className='row mb-2 px-4 datanotshow-cus'>
            <div className='col-lg-12'>
              <div className='place-pdf'>
                <h6 className="blue-style mb-3">Place of Service</h6>
                <ul className='placelist pl-0 '>
                  {
                    documentName.placeOfServiceList.length > 0 ?
                      documentName?.placeOfServiceList.map((obj) => {
                        return (<li style={{ fontSize: "10px" }} className='mb-2'>{obj.placeOfServiceName}</li>)
                      }) :
                      <p style={{ color: "#727272", fontSize: "10px" }}> No Place of Service</p>
                  }
                </ul>
              </div>
            </div>
          </div>
        }

        {
          template.showServiceControl &&
          <div className="row px-4 ">
            <div className='col-lg-12'>
              <div className='place-pdf'>
                <h6 className="blue-style mb-3"> Service</h6>
                <ul className='placelist pl-0'>
                  <li className='mb-1'><span className="dot-blue" ></span><p style={{ fontSize: "10px" }}>{documentName?.serviceNameTemp}</p></li>
                </ul>
              </div>
            </div>
          </div>
        }

        


        {template.showTreatmentPlan &&
          <div className="treatmentplan-custom">
            <div className="row px-4">
              <div className="col-lg-12 mb-2">
                <h6 className="blue-style"> Treatment Plan</h6>
              </div>
            </div>
            <div className='row  mb-2 px-4 mt-1'>
              <div className={docTreatmentPlans.length > 1 ? "col-lg-6" : "col-lg-12"} >
                {
                  docTreatmentPlans.length > 0 ? docTreatmentPlans.map((plan) => {
                    return (

                      <div className='treatment-pdf'>
                        <p style={{ color: "#4a4a4b !important", fontSize: "10px", fontWeight: "500" }}>{plan.goalName}</p>
                        <ul className='list-unstyled pb-0'>
                          <li>
                            <div className='d-flex w-100'>
                              <p style={{ width: "40px", fontSize: "10px" }}><b>obj :</b></p>
                              <span style={{ color: "#727272", fontSize: "10px" }}>{plan.objectiveName}</span>
                            </div>
                          </li>
                          <li>
                            <div className='d-flex w-100'>
                              <p style={{ width: "40px", fontSize: "10px" }}><b>Int :</b></p>
                              <span style={{ color: "#727272", fontSize: "10px" }}>{plan.interventionName}</span>
                            </div>
                          </li>
                        </ul>
                      </div>
                    );
                  }) : <p style={{ color: "#727272", fontSize: "10px" }}> No Treatment Plan</p>
                }
              </div>
            </div>
          </div>
        }

        <div className=" mb-2 mt-1">
          {/* {template.showClientDiags &&
            <div className='px-4 diagnosis-pdf'>
              <h6 className="blue-style mb-4">Diagnosis</h6>
              {
                diagnosisList.length > 0 &&
                diagnosisList.map((diag) => renderDiagnosis(diag))
              }
            </div>
          } */}
          <div className='row'>
            <div className="details-pdf-dt mb-2 mt-0 ">
              {/* <div className="row px-4 py-2"> */}
              <div className="row py-2 px-4">
                <div className="col-lg-12 system-template-cus">
                  {
                    isHtmlFileTypeTemplate &&

                    <AddDocumentFileTemplate name={htmlFileName} />
                  }
                </div>
              </div>
            </div>
            <div></div>
            <div className="system-template-cus mt-0">
              {!isHtmlFileTypeTemplate && template && template.controlList && renderTemplate()}
            </div>

          </div>
        </div>
        <div className='row px-4  '>
          <div className='col-lg-12 signature-col' >
            {
              docSignature.length > 0 &&
              docSignature.map((obj, index) => {
                return (
                  <div className="signature text-center">
                    <img src={"data:image/png;base64," + obj.signature} style={{ width: "140px", height: "50px", textalign: "center" }}></img>
                    <p className='text-start fw-bold pt-1' style={{ fontSize: "10px" }}>{obj.staffName}</p>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  );
}
export default DocumentTemplatePdf;
