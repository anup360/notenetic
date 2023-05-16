import { filterBy } from "@progress/kendo-data-query";
import { useTableKeyboardNavigation } from "@progress/kendo-react-data-tools";
import {
  DatePicker,
  DateTimePicker,
  TimePicker,
} from "@progress/kendo-react-dateinputs";
import { DropDownList, MultiSelect } from "@progress/kendo-react-dropdowns";
import {
  GRID_COL_INDEX_ATTRIBUTE,
  Grid,
  GridColumn,
} from "@progress/kendo-react-grid";
import Loading from "../../control-components/loader/loader"
import { Checkbox, NumericTextBox } from "@progress/kendo-react-inputs";
import { Error } from "@progress/kendo-react-labels";
import { Upload } from "@progress/kendo-react-upload";
import $ from "jquery";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import apiHelper from "../../helper/api-helper";
import API_URLS from "../../helper/api-urls";
import APP_ROUTES from "../../helper/app-routes";
import { displayDateMMDDYYYY, isString } from "../../util/utility";
import { AddDocumentFileTemplate } from "./add-document-file-template";
import AddDocumentSignature from "./add-document-signature";
import AddDocumentTreatmentPlan from "./add-document-treatment-plan";
import {
  convertServerDocumentDraftToLocal,
  convertServerDocumentToLocal,
  timeRecordingTypeEnum,
} from "./document-utility";
import {
  onShowFileTempFields,
  onShowFileValidations,
} from "./file-template-utility";
import {
  mapDocumentTemplate,
  templateControls,
  templateTypeInt,
} from "./template/document-template-utility";
import { InputDocumentTemplate } from "./template/input-document-template";
import { isArray } from "lodash";
import { RadioGroup } from "@progress/kendo-react-inputs";
import { renderErrors } from "src/helper/error-message-helper";
import { RadioButton } from "@progress/kendo-react-inputs";

export const documentStatusEnum = { new: 1, edit: 2, duplicate: 3, draft: 4 };
const visitArr = [
  {
    label: "Face to Face",
    value: "isFaceToFace",
  },
  {
    label: "Telephone",
    value: "isTelephone",
  },
];

const AddEditDocument = ({
  documentStatus,
  backRoute,
  editDocumentId,
  editDraftId,
}) => {
  // Const
  const posTypeEnum = { notRequired: 1, singleSelection: 2, multiSelection: 3 };
  const defaultTemplateSettings = {
    isSingleClientSelection: true,
    posType: posTypeEnum.notRequired,
    isTreatmentPlanEnable: true,
    serviceTimeRecordingType: timeRecordingTypeEnum.notRequired,
    canApplyClientSig: false,
  };
  const location = useLocation();
  const defaultDocSettings = { numDaysAllowedInPast: 0, canSign: true };

  // States
  const [loading, setLoading] = useState({
    patientList: false,
    serviceList: false,
    progressList: false,
    posList: false,
    templateList: false,
    timeShift: false,
    siteList: false,
  });
  const [mainLoading, setMainLoading] = useState(false);
  const [templateSettings, setTemplateSettings] = useState(
    defaultTemplateSettings
  );
  const [docSettings, setDocSettings] = useState(defaultDocSettings);
  const [filter, setFilter] = useState({});
  const [templateList, setTemplateList] = useState([]);
  const [selectedTreatmentPlanList, setSelectedTreatmentPlanList] = useState(
    []
  );
  const [patientList, setPatientList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [progressList, setProgressList] = useState([]);

  const [posList, setPOSList] = useState([]);
  const [siteList, setSiteList] = useState([]);
  const [timeShiftList, setTimeShiftList] = useState([]);
  const [diagnosisList, setDiagnosisList] = useState([]);
  const [clientId, setClientId] = useState("");
  const [displaySignDialog, setDisplaySignDialog] = useState(false);


  const [seconds, setSeconds] = useState(0);
  const [autoDraftId, setAutoDraftId] = useState(0);
  // Attachments
  const [attachments, setAttachments] = useState([]);
  const [uploadError, setUploadError] = useState(false);
  // Edit
  const [editDocument, setEditDocument] = useState();
  const [diagValidArry, setDiagValidArry] = useState([]);


  // States
  const [loadAllData, setLoadAllData] = useState(false);
  const [isTimeOverlap, setTimeOverlap] = useState(false);
  const [isPlanOnceSet, setPlanOnceSet] = useState(false);
  const [errorObj, setErrorObj] = useState({});
  const [controlErrors, setControlErrors] = useState([]);
  const [showValidationError, setShowValidationError] = useState(false);
  const [focusRef, setFocusRef] = useState();
  const [templateFocusEnable, setTemplateFocusEnable] = useState();

  const [isDocDuplicate, setDuplicate] = useState();

  const [newControl, setNewControl] = React.useState({
    name: "",
    text: "",
    textHtml: "",
  });

  // Refs
  const templateListRef = useRef(null);
  const clientListRef = useRef(null);
  const dateOfServiceRef = useRef(null);
  const serviceStartTimeRef = useRef(null);
  const serviceEndTimeRef = useRef(null);
  const serviceShiftListRef = useRef(null);
  const serviceDurationRef = useRef(null);
  const clientProgressListRef = useRef(null);
  const serviceListRef = useRef(null);
  const posListRef = useRef(null);
  const siteListRef = useRef(null);
  const visitRef = useRef(null);
  const treatementPlanRef = useRef(null);
  const interventionRef = useRef(null);
  const submitRef = useRef(null);
  const diagnosisRef = useRef(null);

  // Data
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedPatientList, setSelectedPatientList] = useState([]);
  const [selectedServiceDate, setSelectedServiceDate] = useState(null);
  const [selectedServiceStartTime, setSelectedServiceStartTime] =
    useState(null);
  const [selectedServiceEndTime, setSelectedServiceEndTime] = useState(null);
  const [selectedServiceShift, setSelectedServiceShift] = useState(null);
  const [selectedServiceDuration, setSelectedServiceDuration] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedProgress, setSelectedProgress] = useState(null);
  const [selectedPOS, setSelectedPOS] = useState(null);
  const [selectedSiteOfService, setSelectedSiteOfService] = useState(null);
  const [isFaceToFace, setFaceToFace] = useState("");
  const [isTelephone, setTelephone] = useState(false);
  const [isHtmlFileTypeTemplate, setIsHtmlFileTypeTemplate] = useState(false);
  // const [nextAppointment, setNextAppointment] = useState(null)
  const [apiError, setApiError] = useState("");
  const [showClientProgress, setShowClientProgress] = useState(false);
  const [canAddNextAppt, setCanAddNextAppt] = useState(false);
  const [showServiceControl, setShowServiceControl] = useState(false);
  const [showClientDiags, setShowClientDiags] = useState(false);
  const [showTreatmentPlan, setShowTreatmentPlan] = useState(false);
  const [showSiteOfService, setShowSiteOfService] = useState(false);
  const [showFileAttachment, setShowFileAttachement] = useState(false);
  const [showVisitType, setShowVisitType] = useState(false);
  const [clientDiagnosisId, setClientDiagId] = useState("");


  const [selectedDiagnosis, setSelectedDiagnosis] = useState([]);


  // Variables
  const classToCheckValueContainer = "contains-value";
  const navigate = useNavigate();
  const clinicId = useSelector((state) => state.loggedIn.clinicId);
  const staffId = useSelector((state) => state.loggedIn?.staffId);


  /* ============================= useEffect functions ============================= */

  useEffect(() => {
    if (location && location.state) {
      if (location.state?.isDuplicate) {
        setDuplicate(location.state.isDuplicate);
      }
    }
  }, []);

  useEffect(() => {
    if (focusRef && focusRef.current && focusRef.current.focus) {
      focusRef.current.focus();
      setFocusRef(undefined);
    }
  }, [focusRef]);

  useEffect(() => {
    const closePreventFunction = (ev) => {
      ev.preventDefault();
      return (ev.returnValue = "Are you sure you want to close?");
    };
    window.addEventListener("beforeunload", closePreventFunction);
    setFocusRef(templateListRef);
    return () => {
      window.removeEventListener("beforeunload", closePreventFunction);
    };
  }, []);

  useEffect(() => {
    if (editDocumentId) {
      setMainLoading(true);
      apiHelper
        .queryGetRequestWithEncryption(
          API_URLS.GET_DOCUMENT_BY_ID,
          editDocumentId
        )
        .then((result) => {
          if (result.resultData) {
            let doc = convertServerDocumentToLocal(result.resultData);
            setIsHtmlFileTypeTemplate(doc?.isHtmlFileTypeTemplate ?? false);
            setEditDocument(doc);
            initWithDocument(doc);
          }
        })
        .catch((err) => {
          setApiError(err);
        })
        .finally(() => {
          setMainLoading(false);
        });
    }
  }, [editDocumentId]);

  function onDataChange(isHtmlFileName) {
    let data = $("#" + isHtmlFileName).serializeArray();
    let newArray = [];
    if (data && data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        var c_name = data[i].name;
        var input_type = $("form#" + isHtmlFileName + " input[name=" + c_name + "]").attr("type");
        const element = {
          keyName: data[i].name,
          keyValue:
            input_type == "date"
              ? moment(data[i].value).format("M/D/YYYY")
              : data[i].value,
        };
        newArray.push(element);
      }
    }
    return newArray;
  }

  useEffect(() => {
    if (editDraftId) {
      setMainLoading(true);
      apiHelper
        .queryGetRequestWithEncryption(
          API_URLS.GET_DOCUMENT_DRAFT_BY_ID,
          editDraftId
        )
        .then((result) => {
          if (result.resultData) {
            let doc = convertServerDocumentDraftToLocal(result.resultData);
            setEditDocument(doc);
            initWithDocument(doc);
          }
        })
        .catch((err) => {
          setApiError(err);
        })
        .finally(() => {
          setMainLoading(false);
        });
    }
  }, [editDraftId]);

  useEffect(() => {
    if (!editDocument) {
      draftDocument(true);
    }
    let interval = setInterval(() => {
      setSeconds((seconds) => (seconds == 0 ? 1 : 0));
    }, 10 * 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (loadAllData) {
      fetchInitialData();
    }
  }, [loadAllData]);

  useEffect(() => {
    if (
      templateSettings.serviceTimeRecordingType === timeRecordingTypeEnum.shift
    )
      fetchTimeShift();
  }, [templateSettings.serviceTimeRecordingType]);

  useEffect(() => {
    if (selectedTemplate) {
      setIsHtmlFileTypeTemplate(selectedTemplate.isHtmlFileTypeTemplate);
      fetchTemplateSettings();
    } else {
      setTemplateSettings(defaultTemplateSettings);
    }
  }, [selectedTemplate]);

  useEffect(() => {
    if (selectedPatientList && selectedPatientList.length > 0) {
      setClientId(
        selectedPatientList.length == 1 ? selectedPatientList[0].id : ""
      );
      fetchDiagnosisList();
    } else {
      setClientId("");
      setDiagnosisList([]);
    }
    setSelectedTreatmentPlanList([]);
  }, [selectedPatientList]);



  useEffect(() => {
    setSelectedService(null);
    // if (!clientId || clientId < 1) {
    //     setServiceList([])
    //     return
    // }
    fetchServiceList();
    fetchClientProgress();
  }, [clientId]);

  useEffect(() => {
    if (
      !selectedTemplate ||
      selectedPatientList.length < 1 ||
      !selectedServiceDate ||
      !selectedService
    ) {
      return;
    } else {
      switch (templateSettings.serviceTimeRecordingType) {
        case timeRecordingTypeEnum.actual:
          if (!selectedServiceStartTime || !selectedServiceEndTime) {
            return;
          } else {
            // checkForOverlapping()
          }
          break;
        case timeRecordingTypeEnum.duration:
          if (!selectedServiceDuration) {
            return;
          }
          break;
        case timeRecordingTypeEnum.shift:
          if (!selectedServiceShift) {
            return;
          }
          break;
        case timeRecordingTypeEnum.notRequired:
          break;
      }
    }
  }, [
    selectedTemplate,
    selectedPatientList,
    selectedServiceDate,
    selectedService,
    selectedServiceStartTime,
    selectedServiceEndTime,
    templateSettings.serviceTimeRecordingType,
    selectedServiceDuration,
    selectedServiceShift,
  ]);

  /* ============================= Private functions ============================= */

  function fetchInitialData() {
    fetchTemplateList();
    fetchPatientList();
    fetchPOSList();
    fetchSiteOfServiceList();
    fetchDocSettings();
  }



  function validateData() {
    let errorObj = {};
    let focusRef;

    // Template
    if (!selectedTemplate) {
      errorObj.selectedTemplate = "Template required";
      if (!focusRef) {
        focusRef = templateListRef;
      }
    }

    // Client
    if (selectedPatientList.length < 1) {
      errorObj.selectedPatientList = "Client required";
      if (!focusRef) {
        focusRef = clientListRef;
      }
    }

    // Date of Service
    if (!selectedServiceDate) {
      errorObj.selectedServiceDate = "Date of Service required";
      if (!focusRef) {
        focusRef = dateOfServiceRef;
      }
    }

    // Time/Duration/Shift
    if (isTimeOverlap) {
      errorObj.selectedServiceStartTime =
        "Document overlap with another document";
      if (!focusRef) {
        focusRef = serviceStartTimeRef;
      }
    } else if (
      templateSettings.serviceTimeRecordingType == timeRecordingTypeEnum.actual
    ) {
      if (!selectedServiceStartTime) {
        errorObj.selectedServiceStartTime = "Start Time required";
        if (!focusRef) {
          focusRef = serviceStartTimeRef;
        }
      }
      if (!selectedServiceEndTime) {
        errorObj.selectedServiceEndTime = "End Time required";
        if (!focusRef) {
          focusRef = serviceEndTimeRef;
        }
      }
    } else if (
      templateSettings.serviceTimeRecordingType ==
      timeRecordingTypeEnum.duration
    ) {
      if (!selectedServiceDuration) {
        errorObj.selectedServiceDuration = "Service duration required";
        if (!focusRef) {
          focusRef = serviceDurationRef;
        }
      }
    } else if (
      templateSettings.serviceTimeRecordingType == timeRecordingTypeEnum.shift
    ) {
      if (!selectedServiceShift) {
        errorObj.selectedServiceShift = "Shift is required";
        if (!focusRef) {
          focusRef = serviceShiftListRef;
        }
      }
    }

    // Service
    // if (showServiceControl) {
    //   if (!selectedService && selectedTemplate?.templateTypeId == templateTypeInt.note) {
    //     errorObj.selectedService = "Service is required";
    //     if (!focusRef) {
    //       focusRef = serviceListRef;
    //     }
    //   }
    // }

    if (showClientDiags && selectedTemplate?.templateTypeId == "2") {
      if (docSettings.allowDocWithoutDiag == false) {
        let hasFalse = false;
        for (let i = 0; i < diagValidArry.length; i++) {
          const obj = diagValidArry[i];
          const value = Object.values(obj)[0];
          if (!value) {
            hasFalse = true;
            break;
          }
        }
        if (hasFalse) {
          errorObj.clientDiagnosisId = "Please select diagnosis";
          if (!focusRef) {
            focusRef = diagnosisRef;
          }
        }

      }
    }

    // Client Progress
    if (showClientProgress) {
      if (!selectedProgress) {
        errorObj.selectedProgress = "Client Progress is required";
        if (!focusRef) {
          focusRef = clientProgressListRef;
        }
      }
    }

    // Place of Service
    if (
      templateSettings.posType != posTypeEnum.notRequired &&
      (!selectedPOS || selectedPOS.length < 1)
    ) {
      errorObj.selectedPOS = "Place of Service required";
      if (!focusRef) {
        focusRef = posListRef;
      }
    }

    // Location/Site of Service
    if (showSiteOfService) {
      if (
        !selectedSiteOfService &&
        selectedTemplate?.templateTypeId == templateTypeInt.note
      ) {
        errorObj.selectedSiteOfService = "Site of Service required";
        if (!focusRef) {
          focusRef = siteListRef;
        }
      }
    }


    console.log("=====", errorObj);


    // Visit Type
    if (showVisitType) {
      if (
        !isFaceToFace &&
        selectedTemplate?.templateTypeId == templateTypeInt.note
      ) {
        errorObj.visit = "Select visit type";
        if (!focusRef) {
          focusRef = visitRef;
        }
      }
    }


    // Treatment Plan
    if (showTreatmentPlan && selectedPatientList.length < 2) {
      if (templateSettings.isTreatmentPlanEnable && selectedTreatmentPlanList.length < 1
      ) {
        errorObj.plan = "Please add at-least one goal";
        if (!focusRef) {
          focusRef = treatementPlanRef;
        }
      }

    }

    setFocusRef(focusRef);
    setTemplateFocusEnable(!focusRef);
    return errorObj;
  }

  function initWithDocument(editDocument) {

    setLoadAllData(true);
    if (editDocument.serviceDate) {
      setSelectedServiceDate(new Date(editDocument.serviceDate));
    }
    if (editDocument.isFaceToFace == true) {
      setFaceToFace("isFaceToFace");
    } else {
      setFaceToFace("isTelephone");
    }
    // setTelephone(editDocument.isTelephone)

    setClientDiagId(editDocument.clientDiagnosisId);

    let newArry = selectedDiagnosis;
    newArry.push({ dxId: editDocument.clientDiagnosisId, clientId: editDocument.clientId })
    setSelectedDiagnosis(newArry)

    if (editDocument.documentTimeRecording) {
      const documentTimeRecording = editDocument.documentTimeRecording;
      if (
        documentTimeRecording.recordingMethodId == timeRecordingTypeEnum.actual
      ) {
        setSelectedServiceStartTime(new Date(documentTimeRecording.startTime));
        setSelectedServiceEndTime(new Date(documentTimeRecording.endTime));
      }
      if (
        documentTimeRecording.recordingMethodId ==
        timeRecordingTypeEnum.duration
      ) {
        setSelectedServiceDuration(documentTimeRecording.totalMinutes);
      }
    }

    setTimeout(() => {
      onShowFileTempFields(editDocument?.documentFieldsMappings, "", false);
    }, 2000)
  }

  function uploadAttachments(docId) {
    if (attachments.length < 1) {
      if (documentStatus == documentStatusEnum.duplicate) {
        navigate(APP_ROUTES.DOCUMENT_LIST);
      } else {
        onBack();
      }
      return;
    }
    let data = {
      docid: docId ? docId : editDocumentId,
      files: attachments.map((file) => file.getRawFile()),
    };

    setMainLoading(true);
    apiHelper
      .multipartPostRequest(API_URLS.UPLOAD_DOCUMENT_ATTACHMENT, data)
      .then((_) => {
        setMainLoading(false);
        onBack();
      })
      .catch((error) => {
        setApiError(error);
      })
      .finally(() => {
        setMainLoading(false);
      });
  }



  function checkForOverlapping() {
    const body = {
      startTime: moment(selectedServiceStartTime).format("HH:mm:ss"),
      endTime: moment(selectedServiceEndTime).format("HH:mm:ss"),
      serviceDate: moment(selectedServiceDate).format("MM/DD/yyyy"),
      clientId: clientId,
      serviceId: selectedService.id,
      staffId: staffId,
      documentId: editDocumentId ? editDocumentId : 0,
      clinicID: clinicId,
    };

    // setMainLoading(true)
    apiHelper
      .postRequest(API_URLS.GET_DOCUMENT_OVER_LAPPING, body)
      .then((result) => {
        if (result.resultData.isOverlaping == true) {
          renderErrors("Time Overlaps");
        }
        setTimeOverlap(result.resultData.isOverlaping);
      })
      .catch((err) => {
        setApiError(err);
      })
      .finally(() => {
        setMainLoading(false);
      });
  }

  function fetchTimeShift() {
    setLoading({ timeShift: true });
    apiHelper
      .getRequest(API_URLS.GET_SHIFTS)
      .then((result) => {
        if (result.resultData) {
          const list = result.resultData;
          setTimeShiftList(list);
          if (
            editDocument?.documentTimeRecording.recordingMethodId ==
            timeRecordingTypeEnum.shift
          ) {
            setSelectedServiceShift(
              list.find(
                (x) => x.id == editDocument.documentTimeRecording.shiftId
              )
            );
          }
        }
      })
      .catch((err) => {
        setApiError(err);
      })
      .finally(() => {
        setLoading({ timeShift: false });
      });
  }

  function fetchTemplateList() {
    setLoading({ templateList: true });

    const apiPromise =
      editDocument && editDocument.documentTemplateId
        ? apiHelper
          .queryGetRequestWithEncryption(
            API_URLS.GET_DOCUMENT_TEMPLATE_BY_ID,
            editDocument.documentTemplateId
          )
          .then((result) => {
            if (result.resultData) {
              const template = mapDocumentTemplate(result.resultData);
              setSelectedTemplate(template);
              setIsHtmlFileTypeTemplate(
                template?.isHtmlFileTypeTemplate ?? false
              );
            }
          })
        : apiHelper
          .getRequest(API_URLS.GET_STAFF_TEMPLATES + staffId + "&" + "active" + "1")
          .then((result) => {
            if (result.resultData) {
              const list = result.resultData.map((d) =>
                mapDocumentTemplate(d)
              );
              // const list = result.resultData.map((r) => {
              //   return { id: r.templateId, name: r.templateName };
              // });
              setTemplateList(list);
            }
          });

    apiPromise
      .catch((err) => {
        setApiError(err);
      })
      .finally(() => {
        setLoading({ templateList: false });
      });
  }



  function fetchPatientList() {
    setLoading({ patientList: true });
    apiHelper
      .getRequest(API_URLS.GET_CLIENT_DDL_BY_CLINIC_ID)
      .then((result) => {
        const list = result.resultData.map((r) => {
          return { id: r.clientId, name: r.clientName };
        });
        setPatientList(list);

        if (editDocument) {
          let selectedPatientArray = null;
          if (editDocument.clients) {
            selectedPatientArray = list.filter((p1) =>
              editDocument.clients.find((p2) => p2.clientId == p1.id)
            );
          } else if (editDocument.clientId) {
            selectedPatientArray = list.filter(
              (p1) => editDocument.clientId == p1.id
            );
          }
          setSelectedPatientList(selectedPatientArray);
        }
      })
      .catch((err) => {
        setApiError(err);
      })
      .finally(() => {
        setLoading({ patientList: false });
      });
  }

  function fetchDiagnosisList() {
    const body = {
      clientIds: selectedPatientList.map((x) => x.id),
      isActive: true,
    };
    apiHelper
      .postRequest(API_URLS.GET_CLIENTS_DIAGNOSIS, body)
      .then((result) => {
        const data = result.resultData;
        setDiagnosisList(data);
        let diag = [...diagValidArry]
        data.forEach(element => {
          diag.push({ [element.clientId]: false })
        });
        setDiagValidArry(diag)

      })
      .catch((error) => {
        setApiError(error);
      });
  }



  function fetchServiceList() {
    setLoading({ serviceList: true });
    apiHelper
      .queryGetRequestWithEncryption(API_URLS.GET_DOCUMENT_SERVICES, clientId)
      .then((result) => {
        const list = result.resultData.map((x) => {
          return { id: x.serviceId, name: x.name };
        });
        setServiceList(list);

        if (editDocument && editDocument.serviceId) {
          setSelectedService(list.find((x) => x.id == editDocument.serviceId));
        }
      })
      .catch((err) => {
        setApiError(err);
      })
      .finally(() => {
        setLoading({ serviceList: false });
      });
  }

  function fetchClientProgress() {
    setLoading({ progressList: true });
    apiHelper
      .getRequest(API_URLS.GET_CLIENT_PROGRESS)
      .then((result) => {
        setProgressList(result.resultData);
        if (editDocument && editDocument.clientProgressId) {
          setSelectedProgress(
            result.resultData.find((x) => x.id == editDocument.clientProgressId)
          );
        }
      })
      .catch((err) => {
        setApiError(err);
      })
      .finally(() => {
        setLoading({ progressList: false });
      });
  }

  // POS: Location/Site of Service
  function fetchSiteOfServiceList() {
    setLoading({ siteList: true });
    apiHelper
      .getRequest(API_URLS.GET_CLINIC_SITES)
      .then((result) => {
        const list = result.resultData;
        setSiteList(list);

        if (editDocument && editDocument.serviceSiteId) {
          setSelectedSiteOfService(
            list.find((x) => x.id == editDocument.serviceSiteId)
          );
        }
      })
      .catch((err) => {
        setApiError(err);
      })
      .finally(() => {
        setLoading({ siteList: false });
      });
  }

  function fetchPOSList() {
    setLoading({ posList: true });
    apiHelper
      .queryGetRequestWithEncryption(
        API_URLS.GET_PLACE_OF_SERVICES_DDL_BY_CLINIC_ID,
        clinicId
      )
      .then((result) => {
        const list = result.resultData;
        setPOSList(list);

        if (editDocument && editDocument.placeOfServiceList) {
          setSelectedPOS(
            list.filter((pos1) =>
              editDocument.placeOfServiceList.find(
                (pos2) => pos2.id == pos1.id || pos2.placeOfServiceId == pos1.id
              )
            )
          );
        }
      })
      .catch((err) => {
        setApiError(err);
      })
      .finally(() => {
        setLoading({ posList: false });
      });
  }

  function fetchDocSettings() {
    apiHelper
      .queryGetRequestWithEncryption(
        API_URLS.GET_DOCUMENT_PREFS_BY_CLINIC_ID,
        clinicId
      )
      .then((result) => {
        if (result.resultData) {
          if (result.resultData && result.resultData[0]) {
            const settings = {
              numDaysAllowedInPast: result.resultData[0].numDaysAllowedInPast,
              // "numDaysApplySigAfterDos": 10,
              // "numDaysApplySigAfterDateLocked": 10,
              // "allowDocWithoutDiag": true,
              canSign: result.resultData[0].canApplySigOnSubmission,
              canDuplicateDoc:
                result.resultData[0].allowStaffToDuplicateThierOwnDocs,
              allowDocWithoutDiag: result.resultData[0].allowDocWithoutDiag,
            };
            setDocSettings(settings);
          }
        }
      })
      .catch((err) => {
        setApiError(err);
      })
      .finally(() => { });
  }

  function fetchTemplateSettings() {
    apiHelper
      .queryGetRequestWithEncryption(
        API_URLS.GET_DOCUMENT_TEMPLATE_PREF_BY_TEMPLATE_ID,
        selectedTemplate.id
      )
      .then((result) => {
        if (result.resultData) {
          if (result.resultData) {
            // TODO: Remove them after review
            setShowClientProgress(result.resultData.showClientProgress);
            // setCanAddNextAppt(result.resultData.canAddNextAppt)
            setShowServiceControl(result.resultData.showServiceControl);
            setShowClientDiags(result.resultData.showClientDiags);
            setShowTreatmentPlan(result.resultData.showTreatmentPlan);
            setShowSiteOfService(result.resultData.showSiteOfService);
            setShowFileAttachement(result.resultData.showFileAttachment);
            setShowVisitType(result.resultData.showVisitType);
            const settings = {
              isSingleClientSelection: documentStatus != documentStatusEnum.new, // ?
              posType: result.resultData.posTypeId,
              isTreatmentPlanEnable: true, // ?
              serviceTimeRecordingType: result.resultData.timeRecordingMethodId,
              canApplyClientSig: result.resultData.canApplyClientSig,
              showClientProgress: result.resultData.showClientProgress,
              showServiceControl: result.resultData.showServiceControl,
              showClientDiags: result.resultData.showClientDiags,
              showTreatmentPlan: result.resultData.showTreatmentPlan,
              showSiteOfService: result.resultData.showSiteOfService,
              // canAddNextAppt: result.resultData.canAddNextAppt,
              showFileAttachment: result.resultData.showFileAttachment,
              showVisitType: result.resultData.showVisitType,
            };
            setTemplateSettings(settings);
          }
        }
      })
      .catch((err) => {
        setApiError(err);
      })
      .finally(() => { });
  }

  function draftDocument(isAutoDraft) {
    let errorObj = {};

    if (!isAutoDraft) {
      if (!selectedTemplate) {
        errorObj.selectedTemplate = "Please select 'Template' first!";
      }
      if (selectedPatientList.length < 1) {
        errorObj.selectedPatientList = "Please select 'Patient name' first!";
      }
      if (!selectedServiceDate) {
        errorObj.selectedServiceDate = "Please select 'Date of Service' first!";
      }
    }

    if (
      !selectedTemplate ||
      selectedPatientList.length < 1 ||
      !selectedServiceDate
    ) {
      if (Object.keys(errorObj).length > 0) {
        setShowValidationError(true);
        setErrorObj(errorObj);
      }
      return;
    }

    insertDocument(undefined, undefined, true);
  }

  function insertDocument(pin, sigDateTime, isAutoDraft) {


    let fieldsMapping = onDataChange(selectedTemplate?.htmlFileName);


    const documentFieldsMappings =
      isHtmlFileTypeTemplate === true
        ? fieldsMapping
        : getDocumentFieldsMappings();

    let body = isAutoDraft
      ? {
        draftId: autoDraftId,
      }
      : {
        isStaffSigRequired: docSettings.canSign,
        documentStaffSignature: {
          pin: docSettings.canSign ? pin : undefined,
          dateSig: docSettings.canSign ? sigDateTime : undefined,
        },
      };
    body = {
      ...body,
      documentTemplateId: selectedTemplate.id,
      serviceId: selectedService?.id ?? editDocument?.serviceId,
      clientProgressId: selectedProgress?.id,
      clientDiagnosis: selectedDiagnosis,
      serviceDate: moment(selectedServiceDate).format("MM/DD/yyyy"),
      serviceSiteId: selectedSiteOfService?.id,
      // clientIds: selectedPatientList?.map((x) => x.id),
      placeOfServiceId: selectedPOS?.map((pos) => pos.id),
      documentFieldsMappings: documentFieldsMappings,
      documentTreatmentPlans: selectedTreatmentPlanList.map((x) => {
        return {
          treatmentPlanId: x?.treatementId ? x?.treatementId : null,
          goalId: x?.goal?.id ? x?.goal?.id : null,
          objectiveId: x?.objective ? x?.objective?.id : null,
          interventionId: x?.intervention ? x?.intervention?.id : null,
        };
      }),
      documentTimeRecording: {
        recordingMethodId: templateSettings.serviceTimeRecordingType,
        shiftId: selectedServiceShift ? selectedServiceShift.id : null,
        startTime: selectedServiceStartTime
          ? moment(selectedServiceStartTime).format("HH:mm:ss")
          : null,
        endTime: selectedServiceEndTime
          ? moment(selectedServiceEndTime).format("HH:mm:ss")
          : null,
        totalMinutes: selectedServiceDuration,
      },
      isFaceToFace:
        isFaceToFace == "isFaceToFace"
          ? true
          : isFaceToFace == ""
            ? false
            : false,
      isTelephone:
        isFaceToFace == "isFaceToFace"
          ? false
          : isFaceToFace == ""
            ? false
            : true,
      // nextAppointment: nextAppointment,
    };

    if (documentStatus == documentStatusEnum.duplicate) {
      body.clientIds = [clientId];
    } else if (editDocumentId) {
      body.id = editDocumentId;
      body.clientId = clientId;
    } else {
      body.clientIds = selectedPatientList?.map((x) => x.id);
    }

    let url = API_URLS.AUTO_SAVE_DOCUMENT_DRAFT;
    if (!isAutoDraft) {
      switch (documentStatus) {
        case documentStatusEnum.new:
          url = API_URLS.INSERT_DOCUMENT;
          break;
        case documentStatusEnum.duplicate:
          url = API_URLS.INSERT_DOCUMENT;
          break;
        case documentStatusEnum.draft:
          url = API_URLS.INSERT_DOCUMENT;
          break;
        case documentStatusEnum.edit:
          url = API_URLS.UPDATE_DOCUMENT;
          break;
      }
      if (!showValidationError) {
        setMainLoading(true)
        window.scrollTo(0, 0);
      }
    }
    const request =
      documentStatus == documentStatusEnum.edit
        ? apiHelper.putRequest(url, body)
        : apiHelper.postRequest(url, body);
    request
      .then((result) => {
        if (isAutoDraft) {
          setMainLoading(false);
          setAutoDraftId(result.resultData.documentDraftId);
        } else {
          uploadAttachments(result.resultData.documentId);
        }
        if (!isAutoDraft) {
          setMainLoading(false);
        }
      })
      .catch((err) => {
        if (!isAutoDraft) {
          setMainLoading(false);
          setApiError(err);
        }
      })
      .finally(() => {
        if (!isAutoDraft) setMainLoading(false);
      });
  }

  function findNameValueOfChildRecursively(child) {
    if (!child.getAttribute) return {};

    let keyName = child.getAttribute("name");
    let keyValue = child.getAttribute("value") || child.value;

    // console.log("========= " + keyName + " ==========")
    // console.log("child.getAttribute(value): " + child.getAttribute("value"))
    // console.log("child.value: " + child.value)

    // RadioButton and Checkbox
    if (
      child.getAttribute("type") === "radio" ||
      child.getAttribute("type") === "checkbox"
    ) {
      // console.log("child.checked " + child.checked)
      return child.checked ? { keyName, keyValue } : {};
    }
    // DropDown
    else if (child.type == "select-one" && child.childNodes[0]) {
      // console.log("child.childNodes[0].value " + child.childNodes[0].value)
      return { keyName, keyValue: child.childNodes[0].value };
    }
    // Other
    else if (keyName) {
      return { keyName, keyValue };
    }
    // If target is wrapped with span, div or any other wrapper.
    for (const children of child.childNodes) {
      const ret = findNameValueOfChildRecursively(children);
      if (ret.keyName) {
        return ret;
      }
    }
    if (newControl) {
      let data = {
        keyName: newControl.name,
        keyValue: newControl.textHtml,
        plainText: newControl.text,
      };
      return data;
    }
    return {};
  }

  function getDocumentFieldsMappings() {
    const documentFieldsMappings = [];
    for (const item of document.getElementsByClassName("contains-value")) {
      const { keyName, keyValue, plainText } =
        findNameValueOfChildRecursively(item);

      if (keyName) {
        documentFieldsMappings.push({ keyName, keyValue, plainText });
      }
    }

    return documentFieldsMappings;
  }

  function setDocumentFieldsMappings(documentFieldsMappings) {
    for (const elem of document.getElementsByClassName("contains-value")) {
      for (const obj of documentFieldsMappings) {
        const ret = setValueOfChildRecursively(elem, obj.keyName, obj.keyValue);
        if (ret) {
        }
      }
    }
  }

  function setValueOfChildRecursively(child, name, value) {
    if (child.getAttribute) {
      let keyName = child.getAttribute("name");
      if (keyName == name) {
        // RadioButton and Checkbox
        if (
          child.getAttribute("type") === "radio" ||
          child.getAttribute("type") === "checkbox"
        ) {
          child.checked = true;
        }
        // DropDown
        else if (child.type == "select-one" && child.childNodes[0]) {
          child.childNodes[0].value = value;
        }
        // Other
        else {
          if (child.hasAttribute("value")) {
            // console.log("Setting Attribute value to " + value)
            child.setAttribute("value", value);
            // console.log("Set Attribute value to " + value + " and it is now " + child.getAttribute('value'))
          } else {
            // console.log("Setting Attribute value to " + value)
            child.value = value;
            // console.log("Set Attribute value to " + value + " and it is now " + child.getAttribute('value'))
          }
        }
        return true;
      }
    }

    // If target is wrapped with span, div or any other wrapper.
    for (const children of child.childNodes) {
      const ret = setValueOfChildRecursively(children, name, value);
      if (ret) {
        return ret;
      }
    }
    return false;
  }

  /* ============================= Event functions ============================= */

  const onAdd = (event) => {
    setAttachments(event.newState);
    setUploadError(false);
  };

  const onRemove = (event) => {
    setAttachments(event.newState);
  };

  const onStatusChange = (event) => {
    setAttachments(event.newState);
  };

  function onBack() {
    // navigate(backRoute)
    navigate(-1);
    window.scrollTo(0, 0);
  }

  const handleChangeVisist = (e) => {
    setFaceToFace(e.value);
  };

  function onChange(e) {
    const name = e.target.name;
    let value = e.target.value;
    if (
      (name === "selectedPatientList" &&
        templateSettings.isSingleClientSelection) ||
      (name === "selectedPOS" &&
        templateSettings.posType === posTypeEnum.singleSelection)
    ) {
      if (value.length > 1) {
        value = [value[value.length - 1]];
      }
    }

    value = !value && value != true && value != false ? null : value;

    switch (name) {
      case "selectedTemplate":
        setSelectedTemplate(value);
        break;
      case "selectedPatientList":
        setSelectedPatientList(value);
        break;
      case "selectedServiceDate":
        setSelectedServiceDate(value);
        break;
      case "selectedServiceStartTime":
        setSelectedServiceStartTime(value);
        break;
      case "selectedServiceEndTime":
        setSelectedServiceEndTime(value);
        break;
      case "selectedServiceShift":
        setSelectedServiceShift(value);
        break;
      case "selectedServiceDuration":
        setSelectedServiceDuration(value);
        break;
      case "selectedService":
        setSelectedService(value);
        break;
      case "selectedProgress":
        setSelectedProgress(value);
        break;
      case "selectedPOS":
        setSelectedPOS(value);
        break;
      case "selectedSiteOfService":
        setSelectedSiteOfService(value);
        break;
      // case "isFaceToFace": setFaceToFace(e.value)
      //     break
      // case "isTelephone": setTelephone(value)
      //     break
      // case "nextAppointment": setNextAppointment(value)
      //     break
    }
  }

  function onFilterChange(event, listName) {
    setFilter({ ...filter, [listName]: event.filter });
  }

  function onDataChange(htmlFileName) {
    let data = $("#" + htmlFileName).serializeArray();

    let newArray = [];
    if (data && data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        var c_name = data[i].name;
        var input_type = $(
          "form#" + htmlFileName + " input[name=" + c_name + "]"
        ).attr("type");
        const element = {
          keyName: data[i].name,
          keyValue:
            input_type == "date"
              ? moment(data[i].value).format("M/D/YYYY")
              : data[i].value,
        };
        newArray.push(element);
      }
    }
    return newArray;
  }

  function setControlErrorList() {
    const documentFieldMapping = getDocumentFieldsMappings();

    function getValueUsingKey(key, type) {
      for (const keyValue of documentFieldMapping) {
        if (
          type == templateControls.checkbox &&
          keyValue.keyName.startsWith(key)
        ) {
          return keyValue.keyValue;
        } else if (keyValue.keyName == key) {
          if (type == templateControls.datePicker) {
            if (
              keyValue.keyValue.includes("month") ||
              keyValue.keyValue.includes("date") ||
              keyValue.keyValue.includes("year")
            ) {
              return "";
            }
          } else if (type == templateControls.timePicker) {
            if (
              keyValue.keyValue.includes("hour") ||
              keyValue.keyValue.includes("minute")
            ) {
              return "";
            }
          }
          return keyValue.keyValue;
        }
      }
      return "";
    }

    let errors = [];

    if (selectedTemplate?.controlList.length > 0) {
      for (const control of selectedTemplate.controlList) {
        const value = getValueUsingKey(control.id, control.type);

        if (control.isRequired) {
          if (!value) {
            errors.push({
              id: control.id,
              required: true,
              msg: `${control.title} is required.`,
            });
          }
        }

        if (control.minInputChar && control.minInputChar > 0) {
          if (value.length < control.minInputChar) {
            errors.push({
              id: control.id,
              minError: true,
              msg: `${control.title} should contain atleast ${control.minInputChar} characters.`,
            });
          }
        }
      }
    }

    setControlErrors(errors);
    return errors;
  }

  const showSignatureDialogIfNeeded = () => {
    // This helps in focus on element even its already focused but not visible on screen.
    if (submitRef && submitRef.current) {
      submitRef.current.focus();
    }

    let anyError = false;
    if (selectedTemplate && !isHtmlFileTypeTemplate) {
      if (setControlErrorList().length > 0) {
        anyError = true;
      }
    }
    if (selectedTemplate && isHtmlFileTypeTemplate) {
      const errors = onShowFileValidations(setControlErrors);
      // console.log(errors)
      if (errors.length > 0) {
        anyError = true;
      }
    }
    const errorObj = validateData();
    setErrorObj(errorObj);
    if (Object.keys(errorObj).length > 0) {
      anyError = true;
    }
    if (anyError) {
      setShowValidationError(true);
      return;
    }
    if (docSettings.canSign) {
      if (editDocumentId && !isDocDuplicate) {
        insertDocument();
      } else {
        setDisplaySignDialog(true);
      }
    } else {
      insertDocument();
    }
  };

  const hideSignatureDialog = () => {
    setDisplaySignDialog(false);
  };

  /* ============================= Render functions ============================= */

  function renderMultiSelectableItem(li, itemProps) {
    const itemChildren = (
      <span>
        <input
          type="checkbox"
          name={itemProps.dataItem}
          checked={itemProps.selected}
          onChange={(e) => itemProps.onClick(itemProps.index, e)}
        />
        &nbsp;{li.props.children}
      </span>
    );
    return React.cloneElement(li, li.props, itemChildren);
  }

  function renderErrorFor(key) {
    let isKeyVarEmpty = true;

    // If its a plan then don't show the error if any plan is added
    if (key == "plan") {
      if (selectedTreatmentPlanList.length > 0) {
        isKeyVarEmpty = false;
      }
    }
    // If its a visit then don't show the error if its already validated
    else if (key == "visit") {
      if (isFaceToFace) {
        isKeyVarEmpty = false;
      }
      // If local variable is filled but the error still in errorObj then don't show the error
    } else {
      try {
        const localVariable = eval(key);
        if (Array.isArray(localVariable)) {
          isKeyVarEmpty = !localVariable.length;
        } else {
          isKeyVarEmpty = !localVariable;
        }
      } catch (err) {
      }
    }

    if (showValidationError && errorObj[key] && isKeyVarEmpty) {
      return <Error id={key}>{errorObj[key]}</Error>;
    }
  }



  function renderTemplateList() {
    return (
      <div className="form-group mb-3 col-mg-6">
        <h6 className="mb-2">Template</h6>
        <DropDownList
          ref={templateListRef}
          filterable={true}
          data={filterBy(templateList, filter.templateList)}
          onFilterChange={(event) => {
            onFilterChange(event, "templateList");
          }}
          loading={loading.templateList}
          textField="name"
          name="selectedTemplate"
          value={selectedTemplate}
          onChange={onChange}
          dataItemKey="id"
        />
        {renderErrorFor("selectedTemplate")}
      </div>
    );
  }

  function renderClientList() {
    return (
      <div className="form-group mb-3 col-mg-6">
        <h6 className="mb-2">Client</h6>
        <MultiSelect
          ref={clientListRef}
          filterable={true}
          data={filterBy(patientList, filter.patientList)}
          onFilterChange={(event) => {
            onFilterChange(event, "patientList");
          }}
          loading={loading.patientList}
          textField="name"
          name="selectedPatientList"
          ariaDescribedBy="selectedPatientList"
          value={selectedPatientList}
          onChange={onChange}
          itemRender={
            templateSettings.isSingleClientSelection
              ? undefined
              : renderMultiSelectableItem
          }
        />
        {renderErrorFor("selectedPatientList")}
      </div>
    );
  }


  function renderTemplate() {
    if (documentStatus != documentStatusEnum.edit) {
      return renderTemplateList();
    }
    return (
      <div className="form-group mb-3 col-mg-6">
        <h6 className="mb-2">Template</h6>
        <label>{selectedTemplate?.name}</label>
      </div>
    );
  }

  function renderClient() {
    if (documentStatus != documentStatusEnum.edit) {
      return renderClientList();
    }
    return (
      <div className="form-group mb-3 col-mg-6">
        <h6 className="">Client</h6>
        <label>
          {selectedPatientList && selectedPatientList.length > 0
            ? selectedPatientList[0].name
            : ""}
        </label>
      </div>
    );
  }

  function renderDateOfService() {
    if (documentStatus == documentStatusEnum.edit) {
      return (
        <div className="form-group mb-3 col-mg-6">
          <h6 className="mb-2">Date of Service</h6>
          <label>
            {selectedServiceDate !== null
              ? displayDateMMDDYYYY(selectedServiceDate)
              : ""}
          </label>
        </div>
      );
    }
    const todayDate = new Date();
    const numDaysAllowedInPast = docSettings.numDaysAllowedInPast
      ? new Date(
        todayDate - docSettings.numDaysAllowedInPast * 24 * 60 * 60 * 1000
      )
      : undefined;
    return (
      <div className="form-group mb-3 col-mg-6">
        <h6 className="mb-2">Date of Service</h6>
        <DatePicker
          ref={dateOfServiceRef}
          min={numDaysAllowedInPast}
          max={todayDate}
          name="selectedServiceDate"
          value={selectedServiceDate}
          onChange={onChange}
        />
        {renderErrorFor("selectedServiceDate")}
      </div>
    );
  }

  function renderTimeDuration() {
    const todayDate = new Date();
    const numDaysAllowedInPast = docSettings.numDaysAllowedInPast
      ? new Date(
        todayDate - docSettings.numDaysAllowedInPast * 24 * 60 * 60 * 1000
      )
      : undefined;
    return (
      <>
        {templateSettings.serviceTimeRecordingType !==
          timeRecordingTypeEnum.notRequired ||
          templateSettings.serviceTimeRecordingType ===
          timeRecordingTypeEnum.actual ||
          templateSettings.serviceTimeRecordingType ===
          timeRecordingTypeEnum.shift ||
          templateSettings.serviceTimeRecordingType ===
          timeRecordingTypeEnum.duration ||
          templateSettings.showClientProgress ||
          templateSettings.showServiceControl ||
          templateSettings.showSiteOfService}
        {templateSettings.serviceTimeRecordingType !==
          timeRecordingTypeEnum.notRequired && (
            <div className="row">
              <h6 className="mb-2">Time/Duration/Shift</h6>
              {templateSettings.serviceTimeRecordingType ===
                timeRecordingTypeEnum.actual && (
                  <div className="col-md-6 mb-3">
                    <TimePicker
                      ref={serviceStartTimeRef}
                      name="selectedServiceStartTime"
                      max={
                        selectedServiceEndTime
                          ? new Date(selectedServiceEndTime.getTime() - 60000)
                          : undefined
                      }
                      value={selectedServiceStartTime}
                      onChange={onChange}
                      ariaDescribedBy="overlap"
                      placeholder="Start Time"
                    />
                    {renderErrorFor("selectedServiceStartTime")}
                  </div>
                )}
              {templateSettings.serviceTimeRecordingType ===
                timeRecordingTypeEnum.actual && (
                  <div className="col-md-6 mb-3">
                    <TimePicker
                      ref={serviceEndTimeRef}
                      name="selectedServiceEndTime"
                      min={
                        selectedServiceStartTime
                          ? new Date(selectedServiceStartTime.getTime() + 60000)
                          : undefined
                      }
                      value={selectedServiceEndTime}
                      onChange={onChange}
                      placeholder="End Time"
                    />
                    {renderErrorFor("selectedServiceEndTime")}
                  </div>
                )}
              {templateSettings.serviceTimeRecordingType ===
                timeRecordingTypeEnum.shift && (
                  <div className="col-md-12 mb-3">
                    <DropDownList
                      ref={serviceShiftListRef}
                      data={timeShiftList}
                      loading={loading.timeShift}
                      textField="shiftName"
                      name="selectedServiceShift"
                      ariaDescribedBy="selectedServiceShift"
                      value={selectedServiceShift}
                      onChange={onChange}
                    />
                    {renderErrorFor("selectedServiceShift")}
                  </div>
                )}
              {templateSettings.serviceTimeRecordingType ===
                timeRecordingTypeEnum.duration && (
                  <div className="col-md-12 mb-3">
                    <NumericTextBox
                      ref={serviceDurationRef}
                      placeholder="Total Minutes"
                      name="selectedServiceDuration"
                      value={selectedServiceDuration}
                      ariaDescribedBy="selectedServiceDuration"
                      onChange={onChange}
                      spinners={false}
                    />
                    {renderErrorFor("selectedServiceDuration")}
                  </div>
                )}
            </div>
          )}
      </>
    );
  }

  function renderClientProgress() {
    return (
      <div className="form-group mb-3 col-mg-6">
        <h6>Client Progress</h6>
        <DropDownList
          ref={clientProgressListRef}
          filterable={true}
          data={filterBy(progressList, filter.progressList)}
          onFilterChange={(event) => {
            onFilterChange(event, "progressList");
          }}
          loading={loading.progressList}
          textField="name"
          name="selectedProgress"
          ariaDescribedBy="selectedProgress"
          value={selectedProgress}
          onChange={onChange}
        />
        {renderErrorFor("selectedProgress")}
      </div>
    );
  }

  function renderServices() {
    if (editDocument && editDocument.serviceId) {
      if (!selectedService) {
        return (
          <div className="form-group mb-3 col-mg-6">
            <h6 className="mb-2">Service</h6>
            <label>{editDocument.serviceName}</label>
            <div className="text-warning">
              You may not edit this service because you do not have assigned
              services that match the current service or the current service has
              been deactivated
            </div>
          </div>
        );
      }
    }
    return (
      <div className="form-group mb-3 col-mg-6">
        <h6>Service</h6>
        <DropDownList
          ref={serviceListRef}
          filterable={true}
          data={filterBy(serviceList, filter.serviceList)}
          onFilterChange={(event) => {
            onFilterChange(event, "serviceList");
          }}
          loading={loading.serviceList}
          textField="name"
          name="selectedService"
          ariaDescribedBy="selectedService"
          value={selectedService}
          onChange={onChange}
        />
        {renderErrorFor("selectedService")}
      </div>
    );
  }

  function renderPlaceOfService() {
    return (
      <>
        {templateSettings.posType != posTypeEnum.notRequired && (
          <div className="form-group mb-3 col-mg-6">
            <h6>Place of Service</h6>
            <MultiSelect
              ref={posListRef}
              filterable={true}
              data={filterBy(posList, filter.posList)}
              onFilterChange={(event) => {
                onFilterChange(event, "posList");
              }}
              loading={loading.posList}
              textField="name"
              name="selectedPOS"
              ariaDescribedBy="selectedPOS"
              value={selectedPOS}
              onChange={onChange}
              itemRender={
                templateSettings.posType === posTypeEnum.singleSelection
                  ? undefined
                  : renderMultiSelectableItem
              }
              autoClose={
                templateSettings.posType === posTypeEnum.singleSelection
              }
            />
            {renderErrorFor("selectedPOS")}
          </div>
        )}
      </>
    );
  }




  function renderLocationSiteOfService() {
    return (
      <div className="form-group mb-3 col-mg-6">
        <h6>Location/Site of Service</h6>
        <DropDownList
          ref={siteListRef}
          filterable={true}
          data={filterBy(siteList, filter.siteList)}
          onFilterChange={(event) => {
            onFilterChange(event, "siteList");
          }}
          loading={loading.siteList}
          textField="siteName"
          name="selectedSiteOfService"
          ariaDescribedBy="selectedSiteOfService"
          value={selectedSiteOfService}
          onChange={onChange}
          autoClose={true}
        />
        {renderErrorFor("selectedSiteOfService")}
      </div>
    );
  }

  function renderVisitType() {
    return (
      <div>
        <h6 className="mb-2" ariaDescribedBy="visit">
          Visit
        </h6>
        <div className="d-flex align-items-center mb-4">
          <p className="mb-0 f-12 d-flex align-items-center">
            <RadioGroup
              data={visitArr}
              value={isFaceToFace}
              onChange={handleChangeVisist}
              name="isFaceToFace"
              layout={"horizontal"}
            />
          </p>
          {/* <p className="mb-0 f-12 ml-3 d-flex align-items-center">
                        <Checkbox
                            className="mr-2"
                            name="isTelephone"
                            value={isTelephone}
                            onChange={onChange}
                        />
                        Telephone
                    </p> */}
          <p className="mb-0 f-12 ml-3 d-flex align-items-center">
            {renderErrorFor("visit")}
          </p>
        </div>
      </div>
    );
  }

  function renderTreatmentPlan() {
    return (
      <div className="third-step">
        {selectedPatientList.length < 2 && (
          <>
            <h6>Treatment Plan</h6>
            <div className="row">
              {clientId !== undefined && (
                <AddDocumentTreatmentPlan
                  clientId={clientId}
                  selectedTreatmentPlanList={selectedTreatmentPlanList}
                  setSelectedTreatmentPlanList={setSelectedTreatmentPlanList}
                  editDocumentTreatmentPlans={
                    editDocument?.documentTreatmentPlans
                  }
                  isPlanOnceSet={isPlanOnceSet}
                  setPlanOnceSet={setPlanOnceSet}
                  treatementPlanRef={treatementPlanRef}
                  interventionRef={interventionRef}
                />
              )}
            </div>
            {renderErrorFor("plan")}
          </>
        )}
      </div>
    );
  }


  const handleDiagChange = (e, id, clientId) => {
    diagValidArry.forEach(element => {
      if (element.hasOwnProperty(clientId)) {
        element[clientId] = true;
      }
    });
    let newArry = selectedDiagnosis;
    newArry.push({ dxId: id, clientId: clientId })
    let arrayUniqueByKey = [...new Map(newArry.map(item =>
      [item["clientId"], item])).values()];
    setSelectedDiagnosis(arrayUniqueByKey)
  };


  const CustomCheckBox = (props, diag) => {
    const navigationAttributes = useTableKeyboardNavigation(props.id);
    let checked = false;
    selectedDiagnosis.forEach(element => {
      if (element.clientId == diag?.clientId && element.dxId === props.dataItem.id) {
        checked = true;
      }
    });

    return (
      <td
      >
        <div className="k-chip-content">
          <Checkbox
            id={props.dataItem.id}
            name={props.dataItem.diagnoseName}
            value={selectedDiagnosis == props.dataItem.id}
            checked={checked}
            onChange={(e) => { handleDiagChange(e, props.dataItem.id, diag?.clientId) }}
          />

        </div>
      </td>
    );
  };
  function renderDiagnosis(diag, index) {

    return (
      <div>
        <label className="mb-2">{diag.clientName}</label>
        <div className="grid-table">
          <Grid data={diag.diagnosis}>
            <GridColumn
              cell={(props) => CustomCheckBox(props, diag)}
              className="cursor-default  icon-align"
              width="70px"
            />
            <GridColumn title="Diagnosis"
              cell={(props) => {
                let field = props.dataItem;
                return <td>{field?.icd10 + " (" + field?.diagnoseName + ")"}</td>;
              }}

            />
            <GridColumn
              field="dateDiagnose"
              title="Date"
              cell={(props) => {
                let field = props.dataItem;
                return <td>{moment(field.dateDiagnose).format("M/D/YYYY")}</td>;
              }}
            />
          </Grid>
          {renderErrorFor("clientDiagnosisId")}
        </div>
      </div>
    );
  }


  function renderDiagnosisList() {
    return (
      <span>
        {diagnosisList.length > 0 && (
          <div className="row">
            <h6>Diagnosis</h6>
            {diagnosisList.map((diag, index) => renderDiagnosis(diag, index)

            )}
          </div>
        )}
      </span>
    );
  }

  // function renderNextAppointment() {
  //     return (
  //         <div>
  //             <h6 className="mt-2">Next Appointment Date</h6>
  //             <DateTimePicker
  //                 min={new Date()}
  //                 name="nextAppointment"
  //                 value={nextAppointment}
  //                 onChange={onChange}
  //             />
  //             <br />
  //         </div>
  //     )
  // }

  function renderFileAttachment() {
    return (
      <div>
        <br />
        <h6 className="mb-2">Attach File(s) to the document</h6>
        <div className="row">
          <Upload
            batch={false}
            multiple={true}
            autoUpload={false}
            files={attachments}
            defaultFiles={attachments}
            onAdd={onAdd}
            onRemove={onRemove}
            onStatusChange={onStatusChange}
            withCredentials={false}
            showActionButtons={false}
            aria-describedby={"firstNameError"}
          />
          {uploadError && <Error>Document is required</Error>}
        </div>
      </div>
    );
  }

  function renderApiError() {
    const response = apiError?.response?.data;
    if (showValidationError && response) {
      let message = "";

      if (isString(response)) {
        message = response;
      } else if (response?.message || response?.Message) {
        message = JSON.parse(response?.message || response.Message);
        // message = response?.message || response.Message

        if (isArray(message)) {
          return (
            <>
              {message.map((msg) => {
                return (
                  <Error className="alert alert-danger f-14 mt-2">
                    <span className="f-14 fw-500">{msg}</span>
                  </Error>
                );
              })}
            </>
          );
        }
      } else {
        message = "Unknown error";
      }
      return (
        <Error className="alert alert-danger f-14 mt-2">
          <span className="f-14 fw-500">{message}</span>
        </Error>
      );
    }
  }

  function getTitle() {
    switch (documentStatus) {
      case documentStatusEnum.new:
        return "New Document";
      case documentStatusEnum.edit:
        return "Update Document";
      case documentStatusEnum.new:
        return "Duplicate Document";
      case documentStatusEnum.draft:
        return "New Document";
    }
  }


  return (
    <div className="document-form-client">
      <div className="d-flex align-items-center mb-3">
        {!displaySignDialog && mainLoading && <Loading />}

        <button
          type="button"
          value="BACK"
          onClick={onBack}
          className="border-0 bg-transparent arrow-rotate pl-0 mb-0"
        >
          <i className="k-icon k-i-sort-asc-sm"></i>
        </button>
        <h5 className="fw-500 mb-0">{() => getTitle()}</h5>
      </div>
      <div className="container-fluid">
        <div className="setps-control">
          <div className="mx-auto">
            <div className="steps-show-dt">
              <div className="col-md-7 col-lg-6">
                <div className="a4-size-page">
                  {renderTemplate()}
                  {renderClient()}
                  {renderDateOfService()}
                  {renderTimeDuration()}
                  {showClientProgress && renderClientProgress()}
                  {showServiceControl && renderServices()}
                  {renderPlaceOfService()}
                  {showSiteOfService && renderLocationSiteOfService()}
                  {showVisitType && renderVisitType()}
                  {showTreatmentPlan && renderTreatmentPlan()}
                  {showClientDiags &&
                    selectedTemplate?.templateTypeId == "2" &&
                    renderDiagnosisList()}
                  {isHtmlFileTypeTemplate == true && (
                    <AddDocumentFileTemplate
                      name={selectedTemplate?.htmlFileName}
                      controlErrors={controlErrors}
                      showValidationError={showValidationError}
                      focusEnable={templateFocusEnable}
                    />
                  )}
                  {isHtmlFileTypeTemplate == false && (
                    <>
                      <InputDocumentTemplate
                        template={selectedTemplate}
                        classToCheckValueContainer={classToCheckValueContainer}
                        documentFieldsMappings={
                          editDocument?.documentFieldsMappings
                        }
                        setNewControl={setNewControl}
                        controlErrors={controlErrors}
                        showValidationError={showValidationError}
                        focusEnable={templateFocusEnable}
                      />
                    </>
                  )}
                  {displaySignDialog && clientId != undefined && (
                    <AddDocumentSignature
                      insertDocumentStaffSign={() => insertDocument()}
                      onClose={hideSignatureDialog}
                      serviceDate={selectedServiceDate}
                      mainLoading={mainLoading}
                    />
                  )}
                  {/* {canAddNextAppt && !editDocumentId && renderNextAppointment()} */}
                  {showFileAttachment && renderFileAttachment()}
                  <button
                    ref={submitRef}
                    type="submit"
                    className="btn blue-primary mt-2"
                    onClick={showSignatureDialogIfNeeded}
                  >
                    Submit
                  </button>
                  {renderApiError()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditDocument;
