import React, { useEffect, useState } from "react";
import CustomDrawer from "../../../../control-components/custom-drawer/custom-drawer";
import ClientHeader from "../client-header/client-header";
import DropDownKendoRct from "../../../../control-components/drop-down/drop-down";
import DatePickerKendoRct from "../../../../control-components/date-picker/date-picker";
import ApiHelper from "../../../../helper/api-helper";
import ApiUrls from "../../../../helper/api-urls";
import { useSelector } from "react-redux";
import { NotificationManager } from "react-notifications";
import Customeditor from "../../../../control-components/custom-editor/custom-editor";
import { Editor, EditorTools, EditorUtils } from "@progress/kendo-react-editor";
import moment from "moment";
import Loader from "../../../../control-components/loader/loader";
import { Encrption } from "../../../encrption";
import ErrorHelper from "../../../../helper/error-helper";
import { Error } from "@progress/kendo-react-labels";
import { Tooltip } from "@progress/kendo-react-tooltip";
import DischargeClientPDF from '../../../../control-components/pdf-generator-kendo/discharge-client-pdf';
import { permissionEnum } from "../../../../helper/permission-helper";
import { renderErrors } from "src/helper/error-message-helper";


const Discharge = () => {
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const [loading, setLoading] = useState(false);
  const [settingError, setSettingError] = useState(false);
  const [errors, setErrors] = useState("");
  const [dischargeReason, setDischargeReason] = useState([]);
  const editor = React.createRef();
  const [bodyHtml, setBodyHtml] = useState("");
  const [body, setBody] = useState("");
  const [buttonDisable, setButtondisable] = useState(false);
  const [editorError, setEditorError] = useState(false);
  const [isPrintPDF, setIsPrintPDF] = useState(false);
  const staffLoginInfo = useSelector((state) => state.getStaffReducer);
  const clientDetail = useSelector((state) => state.clientDetails);
  const userAccessPermission = useSelector( (state) => state.userAccessPermission);

  const [dischargeDetail, setDischargeDetail] = useState();

  const [fields, setFields] = useState({
    dischargeReasonId: "",
    dateDischarge: "",
  });

  function onBodyChange(props) {
    setEditorError(false)
    setBody(props.value.textContent);
    setBodyHtml(props.html);
  }

  useEffect(() => {
    getDischargeInfo();
    getDischargeReason();
  }, []);

  const getDischargeReason = () => {
    ApiHelper.getRequest(ApiUrls.GET_DISCHARGE_REASON)
      .then((result) => {
        let dischargeReason = result.resultData;
        setDischargeReason(dischargeReason);
      })
      .catch((error) => {
        renderErrors(error.message);
      });
  };

  const getDischargeInfo = () => {
    setLoading(true);
    ApiHelper.getRequest(
      ApiUrls.GET_CLIENT_DISCHARGEINFOR + Encrption(selectedClientId)
    )
      .then((result) => {
        setLoading(false);
        let dischargeInfo = result.resultData;
        if (dischargeInfo !== null) {
          setDischargeDetail(dischargeInfo)
        }
        setButtondisable(dischargeInfo === null ? false : true);
        const reasonInfor = {
          id: dischargeInfo === null ? "" : dischargeInfo.dischargeReasonId,
          name: dischargeInfo === null ? "" : dischargeInfo.dischargeReason,
        };
        setFields({
          dischargeReasonId: dischargeInfo === null ? "" : reasonInfor,
          dateDischarge: dischargeInfo === null ? "" : dischargeInfo.dateDischarge ? new Date(dischargeInfo.dateDischarge) : "",
        });
        setBodyHtml(
          dischargeInfo === null ? "" : dischargeInfo.dischargeSummary
        );
      })
      .catch((error) => {
        renderErrors(error.message);
        setLoading(false);
      });
  };

  const handleChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    setFields({
      ...fields,
      [name]: value,
    });
  };

  const saveDischarge = () => {
    setLoading(true);
    const data = {
      clientId: selectedClientId,
      dischargeReasonId: fields.dischargeReasonId.id,
      dischargeSummary: body,
      dateDischarge: moment(fields.dateDischarge).format("YYYY-MM-DD"),
    };
    ApiHelper.postRequest(ApiUrls.CREATE_DISCHARGE, data)
      .then((result) => {
        setLoading(false);
        NotificationManager.success("Discharged successfully");
        getDischargeInfo();
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;
    if (!fields.dischargeReasonId) {
      formIsValid = false;
      errors["dischargeReasonId"] = ErrorHelper.FIELD_BLANK;
    }
    if (!fields.dateDischarge) {
      formIsValid = false;
      errors["dateDischarge"] = ErrorHelper.FIELD_BLANK;
    }
    if (!bodyHtml || bodyHtml.length < 8) {
      setEditorError(true)
      formIsValid = false;
      errors["bodyHtml"] = ErrorHelper.FIELD_BLANK;
    }
    setErrors(errors);
    return formIsValid;
  };

  const handleSubmit = () => {
    if (bodyHtml.length < 8) {
      setEditorError(true)
    }
    setSettingError(true);
    if (handleValidation()) {
      saveDischarge();
    }
  };

  const handlePrintPDF = () => {
    setIsPrintPDF(true)
  }

  function renderKendoEditor() {
    const {
      Bold,
      Italic,
      Underline,
      AlignLeft,
      AlignRight,
      AlignCenter,
      Indent,
      Outdent,
      OrderedList,
      UnorderedList,
      Undo,
      Redo,
      Link,
      Unlink,
    } = EditorTools;
    return (
      <Editor
        ref={editor}
        value={bodyHtml}
        onChange={onBodyChange}
        tools={[
          [Bold, Italic, Underline],
          [Undo, Redo],
          [Link, Unlink],
          [AlignLeft, AlignCenter, AlignRight],
          [OrderedList, UnorderedList, Indent, Outdent],
        ]}
        contentStyle={{
          height: 320,
        }}
        defaultContent={""}
        disabled={buttonDisable === true ? true : false}

      />
    );
  }




  return (
    <div className="d-flex flex-wrap">
      {loading === true && <Loader />}
      <div className="inner-dt col-md-3 col-lg-2">
        <CustomDrawer />
      </div>
      <div className="col-md-9 col-lg-10">
        <ClientHeader />
        <div className="Service-RateList">
          <div className="d-flex mt-3">
            <h4 className="address-title text-grey ml-3 mb-4">
              <span className="f-24">Discharge</span>
            </h4>
            {
              dischargeDetail &&
              <Tooltip anchorElement="target" position="top">
                <button  className="btn blue-primary-outline  btn-sm  mx-3"
                  onClick={handlePrintPDF}><i className="fa-solid fa-file-pdf mr-2" title="Print"></i>Print discharge summary
                  
                </button>
              </Tooltip>
            }

          </div>
        </div>
        <div className="mb-3 col-lg-4 col-md-6 col-12">
          <DatePickerKendoRct
            onChange={handleChange}
            format={"MM/dd/YYYY"}
            name={"dateDischarge"}
            label={"Discharge Date"}
            value={fields.dateDischarge}
            validityStyles={settingError}
            required={true}
            error={fields.dateDischarge === "" && errors.dateDischarge}
            placeholder={"Date Discharge"}
            disabled={buttonDisable === true ? true : false}
          />
        </div>
        <div className="mb-3 col-lg-4 col-md-6 col-12 ">
          <DropDownKendoRct
            label="Reason of Discharge"
            onChange={handleChange}
            data={dischargeReason}
            validityStyles={settingError}
            value={fields.dischargeReasonId}
            textField="name"
            name="dischargeReasonId"
            error={fields.dischargeReasonId === "" && errors.dischargeReasonId}
            required={true}
            disabled={buttonDisable === true ? true : false}
            placeholder="Reason of Discharge"
          />
        </div>
        <div className="mb-3 col-lg-12 col-md-12 col-12 ">
          <label className="k-label mb-2">{(editorError) ? <Error>{"Discharge summary"}</Error> : "Discharge summary"}</label>
          {renderKendoEditor()}
          {(bodyHtml.length < 7 || editorError) && <Error>{errors.bodyHtml}</Error>}

        </div>

        {userAccessPermission[permissionEnum.DISCHARGE_REACTIVATE_CLIENT] &&
        <div className="ml-3">
          <button
            className="btn blue-primary text-white "
            onClick={handleSubmit}
            disabled={buttonDisable}
          >
            Discharge
          </button>
        </div>
}
      </div>

      {
        isPrintPDF &&
        <DischargeClientPDF
          isPrintPDF={isPrintPDF}
          setIsPrintPDF={setIsPrintPDF}
          staffLoginInfo={staffLoginInfo}
          clientDetail={clientDetail}
          dischargeDetail={dischargeDetail}
        />
      }
    </div>
  );
};

export default Discharge;
