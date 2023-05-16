import React, { useEffect, useState } from "react";
import { Encrption } from "../../encrption";
import DropDownKendoRct from "../../../control-components/drop-down/drop-down";
import { Dialog } from "@progress/kendo-react-dialogs";
import Loader from "../../../control-components/loader/loader";
import ApiHelper from "../../../helper/api-helper";
import ApiUrls from "../../../helper/api-urls";
import { Switch } from "@progress/kendo-react-inputs";
import { NotificationManager } from "react-notifications";
import { renderErrors } from "src/helper/error-message-helper";

const SettingTemplate = ({
  onClose,
  isSelectedId,
  getAllDocumentTemplates,
}) => {
  const [settingError, setSettingError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeRecording, setTimeRecording] = useState([]);
  const [placeService, setPlaceService] = useState([]);
  const [fields, setFields] = useState({
    posTypeId: "",
    canAddNextAppt: false,
    timeRecordingMethodId: "",
    canApplyClientSig: false,
    showServiceControl: false,
    showClientProgress: false,
    showTreatmentPlan: false,
    showSiteOfService: false,
    showClientDiags: false,
    showFileAttachment: false,
    showVisitType: false,
  });

  useEffect(() => {
    getTimeRecordingMethod();
    getDocumentTemplatePrefById();
    getPlaceOfService();
  }, []);

  const getTimeRecordingMethod = () => {
    setLoading(true);
    try {
      ApiHelper.getRequest(ApiUrls.GET_TIME_RECORDING_METHODS).then(
        (response) => {
          const data = response.resultData;
          setTimeRecording(data);
          setLoading(false);
        }
      );
    } catch (error) {
      renderErrors(error);
    }
  };

  const getPlaceOfService = () => {
    setLoading(true);
    try {
      ApiHelper.getRequest(ApiUrls.GET_ALL_PLACE_OF_SERVICETYPE).then(
        (response) => {
          const data = response.resultData;
          setPlaceService(data);
          setLoading(false);
        }
      );
    } catch (error) {
      renderErrors(error);
    }
  };

  const getDocumentTemplatePrefById = () => {
    setLoading(true);
    try {
      ApiHelper.getRequest(
        ApiUrls.GET_DOCUMENT_TEMPLATE_PREF_BY_TEMPLATE_ID +
          Encrption(isSelectedId)
      ).then((response) => {
        setLoading(false);
        const data = response.resultData;
        const posTypeId = {
          id: data.posTypeId,
          name: data.posTypeName,
        };
        const timeRecordingMethod = {
          id: data.timeRecordingMethodId,
          name: data.timeRecordingMethod,
        };
        setFields({
          posTypeId: posTypeId,
          // canAddNextAppt: data.canAddNextAppt,
          timeRecordingMethodId: timeRecordingMethod,
          canApplyClientSig: data.canApplyClientSig,
          showClientProgress: data.showClientProgress,
          showServiceControl: data.showServiceControl,
          showTreatmentPlan: data.showTreatmentPlan,
          showSiteOfService: data.showSiteOfService,
          showClientDiags: data.showClientDiags,
          showVisitType: data.showVisitType,
          showFileAttachment: data.showFileAttachment,
        });
      });
    } catch (error) {
      renderErrors(error);
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFields({
      ...fields,
      [name]: value,
    });
  };

  const saveTask = async () => {
    setLoading(true);
    const data = {
      templateId: isSelectedId,
      posTypeId: fields.posTypeId.id ? fields.posTypeId.id : 1,
      // canAddNextAppt: fields.canAddNextAppt,
      timeRecordingMethodId: fields.timeRecordingMethodId.id
        ? fields.timeRecordingMethodId.id
        : 1,
      canApplyClientSig: fields.canApplyClientSig,
      showClientProgress: fields.showClientProgress,
      showServiceControl: fields.showServiceControl,
      showTreatmentPlan: fields.showTreatmentPlan,
      showSiteOfService: fields.showSiteOfService,
      showClientDiags: fields.showClientDiags,
      showFileAttachment: fields.showFileAttachment,
      showVisitType: fields.showVisitType,
    };
    
    await ApiHelper.postRequest(ApiUrls.INSERT_DOCUMENT_TEMPLATE_PREF, data)
      .then((result) => {
        
        setLoading(false);
        NotificationManager.success("Document template updated successfully");
        onClose({ added: true });
        getAllDocumentTemplates();
      })
      .catch((error) => {
        
        setLoading(false);
        renderErrors(error);
      });
  };

  const handleSubmit = () => {
    setSettingError(true);
    saveTask();
  };

  return (
    <Dialog
      onClose={onClose}
      title=" Document Template Settings"
      className="small-dailog"
    >
      {loading == true && <Loader />}
      <div className="column mt-3">
        <div className="col-md-12 col-lg-12 col-12 mb-3">
          <DropDownKendoRct
            validityStyles={settingError}
            data={placeService}
            onChange={handleChange}
            value={fields.posTypeId}
            textField="name"
            label="Place Of Service"
            dataItemKey="id"
            name="posTypeId"
            defaultValue="Not Required"
          />
        </div>

        <div className="col-md-12 col-lg-12 col-12 mb-3">
          <DropDownKendoRct
            validityStyles={settingError}
            data={timeRecording}
            onChange={handleChange}
            value={fields.timeRecordingMethodId}
            textField="name"
            label="Time Recording Method"
            dataItemKey="id"
            name="timeRecordingMethodId"
          />
        </div>
        {/* <div className="col-md-12 col-lg-12 col-12 mb-3">
          <Switch
            value={fields.canAddNextAppt}
            name={"canAddNextAppt"}
            onChange={handleChange}
            checked={fields.canAddNextAppt}
          />
          <span className="switch-title-text ml-2  fw-400 f-16 ">
            User Can Add Next Appointment
          </span>
        </div> */}
        <div className="col-md-12 col-lg-12 col-12 mb-3">
          <Switch
            value={fields.canApplyClientSig}
            name={"canApplyClientSig"}
            onChange={handleChange}
            checked={fields.canApplyClientSig}
          />

          <span className="switch-title-text ml-2  fw-400 f-16 ">
            Can Apply Client Signature
          </span>
        </div>

        <div className="col-md-12 col-lg-12 col-12 mb-3">
          <Switch
            value={fields.showServiceControl}
            name={"showServiceControl"}
            onChange={handleChange}
            checked={fields.showServiceControl}
          />

          <span className="switch-title-text ml-2  fw-400 f-16 ">
            Service Control
          </span>
        </div>
        <div className="col-md-12 col-lg-12 col-12 mb-3">
          <Switch
            value={fields.showClientProgress}
            name={"showClientProgress"}
            onChange={handleChange}
            checked={fields.showClientProgress}
          />

          <span className="switch-title-text ml-2  fw-400 f-16 ">
            Show Client Progress
          </span>
        </div>
        <div className="col-md-12 col-lg-12 col-12 mb-3">
          <Switch
            value={fields.showTreatmentPlan}
            name={"showTreatmentPlan"}
            onChange={handleChange}
            checked={fields.showTreatmentPlan}
          />

          <span className="switch-title-text ml-2  fw-400 f-16 ">
            Show Treatment Plan
          </span>
        </div>
        <div className="col-md-12 col-lg-12 col-12 mb-3">
          <Switch
            value={fields.showSiteOfService}
            name={"showSiteOfService"}
            onChange={handleChange}
            checked={fields.showSiteOfService}
          />

          <span className="switch-title-text ml-2  fw-400 f-16 ">
            Show Site of Service
          </span>
        </div>
        <div className="col-md-12 col-lg-12 col-12 mb-3">
          <Switch
            value={fields.showClientDiags}
            name={"showClientDiags"}
            onChange={handleChange}
            checked={fields.showClientDiags}
          />

          <span className="switch-title-text ml-2  fw-400 f-16 ">
            Show Client Diagnosis
          </span>
        </div>
        <div className="col-md-12 col-lg-12 col-12 mb-3">
          <Switch
            value={fields.showVisitType}
            name={"showVisitType"}
            onChange={handleChange}
            checked={fields.showVisitType}
          />

          <span className="switch-title-text ml-2  fw-400 f-16 ">
            Show Visit Type
          </span>
        </div>
        <div className="col-md-12 col-lg-12 col-12 mb-3">
          <Switch
            value={fields.showFileAttachment}
            name={"showFileAttachment"}
            onChange={handleChange}
            checked={fields.showFileAttachment}
          />

          <span className="switch-title-text ml-2 fw-400 f-16 ">
          Show File Attachment
          </span>
        </div>
        <div className="border-bottom-line"></div>

        <div className="d-flex my-3">
          <div>
            <button
              onClick={handleSubmit}
              className="btn blue-primary text-white  mx-3"
            >
              Update
            </button>
          </div>
          <div>
            <button className="btn grey-secondary text-white" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default SettingTemplate;
