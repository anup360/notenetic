import { useTableKeyboardNavigation } from "@progress/kendo-react-data-tools";
import {
  GRID_COL_INDEX_ATTRIBUTE,
  Grid,
  GridColumn,
} from "@progress/kendo-react-grid";
import { Checkbox, Rating, Switch } from "@progress/kendo-react-inputs";
import React, { useEffect, useRef, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  default as DeleteAttachmentModal,
  default as DeleteDialogModal,
  default as DeleteLinkedDocModal,
} from "../../control-components/custom-delete-dialog-box/delete-dialog";
import SealDocumentModal from "../../control-components/custom-delete-dialog-box/seal-document-dialog";
import LockDialogModal from "../../control-components/custom-lock-unlock-dialouge-box/lock-dialog";
import Loading from "../../control-components/loader/loader";
import DocumentTempPDF from "../../control-components/pdf-generator-kendo/pdf-doc-temp";
import CustomSkeleton from "../../control-components/skeleton/skeleton";
import useModelScroll from "../../cutomHooks/model-dialouge-scroll";
import apiHelper from "../../helper/api-helper";
import API_URLS from "../../helper/api-urls";
import APP_ROUTES from "../../helper/app-routes";
import { ClientService } from "../../services/clientService";
import { convertFromUtcDateToDateOnly, showError } from "../../util/utility";
import { AddDocumentFileTemplate } from "./add-document-file-template";
import AddDocumentSignature from "./add-document-signature";
import {
  convertServerDocumentDraftToLocal,
  convertServerDocumentToLocal,
  convertTimeToLocally,
} from "./document-utility";
import { onShowFileTempFields } from "./file-template-utility";
import { mapDocumentTemplate } from "./template/document-template-utility";
import { PreviewDocumentTemplate } from "./template/preview-document-template";
import { Encrption } from "../encrption";

import { renderErrors } from "src/helper/error-message-helper";

import moment from "moment";
import LinkDocument from "./link-documents";
import AttachQuestionnaire from "./attach-questionnaire";
import AddDocumentTask from "./tasks/add-doc-task";
import ListDocumentTasks from "./tasks/list-doc-task";
import { permissionEnum } from "../..//helper/permission-helper";
import ViewLinkedQuestionire from "./view-linked-questionaire";
import ViewBillingStatus from "./billing-status";

const ACTION_ID = {
  approved: 2,
  postEditReview: 4,
  notApproved: 3,
  toBeReview: 1,
};

const ViewDocument = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const staffId = useSelector((state) => state.loggedIn?.staffId);
  const [tasks, setTasks] = useState([]);
  const [documentDetail, setDocumentDetail] = useState();
  const [documentId, setDocumentId] = useState();
  const [selectedQuestionId, setSelectedQuestionId] = useState({});

  const [documentDraftId, setDocumentDraftId] = useState();
  const [canSealDocument, setCanSealDocument] = useState(false);

  const [isMultiView, setMultiView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [backRoute, setBackRoute] = useState(APP_ROUTES.DOCUMENT_LIST);
  const [diagnosisList, setDiagnosisList] = useState([]);
  const [template, setTemplate] = useState([]);
  const [confirm, setConfirm] = useState(false);
  const [modelScroll, setScroll] = useModelScroll();
  const [ratingVal, setRatingVal] = useState(0);
  const [isHtmlFileTypeTemplate, setHtmlFileTypeTemplate] = useState(false);
  const [htmlFileName, setHtmlFileName] = useState("");
  const [fieldsMapping, setFieldsMapping] = useState([]);
  const [displaySignDialog, setDisplaySignDialog] = useState(false);
  const [docServiceDate, setServiceDate] = useState();
  const [docSignature, setDocSignature] = useState([]);
  const [isDocumentDeleted, setDocumentDeleted] = useState();
  const [docAttachment, setDocAttachment] = useState([]);
  const [linkedDocuments, setLinkedDocuments] = useState([]);
  const [linkedQuestionnaire, setLinkedQuestionnaire] = useState([]);
  const userAccessPermission = useSelector(
    (state) => state.userAccessPermission
  );

  const [isLockDocument, setLockDocument] = useState(false);
  const [isDocSealed, setSealDocumentVal] = useState(false);
  const [isOpenLock, setOpenLock] = useState(false);
  const [isPrintPDF, setIsPrintPDF] = useState(false);
  const staffInfo = useSelector((state) => state.getStaffReducer);
  const [signStaffId, setSignStaffId] = useState();
  const clinicId = useSelector((state) => state.loggedIn.clinicId);
  const [isDeleteAttachment, setDeleteAttachment] = useState(false);
  const [isDeleteLinkDoc, setDeleteLinkedDoc] = useState(false);
  const [isSealDocument, setIsSealDocument] = useState(false);
  const [docSettings, setDocSettings] = useState({});
  const [attachmentId, setAttachmentId] = useState();
  const [linkedDocId, setLinkedDocId] = useState();
  const [markAsReview, setMarkAsReview] = useState(false);
  const [alreadyMarkReview, setAlreadyMark] = useState(false);
  const [isParent, setIsParent] = useState(false);
  const [isShowMenus, setMenusShow] = useState(false);
  const [isLinkDoc, setLinkDoc] = useState(false);
  const [isTaskAndDocuments, setShowTaskAndComments] = useState(false);
  const [isDeleteAssociateSign, setDeleteAssociateSign] = useState(false);
  const taskListRef = useRef(null);
  const [isAttachQuestion, setAttachQuestion] = useState(false);
  const [deletedQuesionId, setDeletedQuestionId] = useState();
  const [isDeleteLinkQueston, setDeleteLinkQuestion] = useState(false);

  const [isViewQueston, setViewQuestion] = useState(false);

  const [isApprovedDoc, setApprovedDoc] = useState(false);

  /* ============================= useEffects ============================= */

  useEffect(() => {
    if (props.multiId) {
      if (props.multiId != documentId) {
        setDocumentId(props.multiId);
        setMultiView(true);
      }
    } else if (location && location.state) {
      if (location.state.id != documentId) {
        setDocumentId(location.state.id);
      }
      if (location.state.backRoute && location.state.backRoute != backRoute) {
        setBackRoute(location.state.backRoute);
      }
      if (location.state.draftId && location.state.draftId != documentDraftId) {
        setDocumentDraftId(location.state.draftId);
      }
    }
  }, []);

  useEffect(() => {
    if (documentDetail) {
      if (documentDetail.clientId) fetchDiagnosisList();
      if (documentDetail.documentTemplateId) getDocumentTemplate();
    }
  }, [documentDetail]);

  useEffect(() => {
    if (linkedDocId) {
      setDocumentId(linkedDocId);
    }
  }, []);

  function fetchByDocumentId(documentId) {
    apiHelper
      .queryGetRequestWithEncryption(API_URLS.GET_DOCUMENT_BY_ID, documentId)
      .then(async (result) => {
        if (result.resultData) {
          setDocumentDetail(convertServerDocumentToLocal(result.resultData));
          setHtmlFileTypeTemplate(result.resultData.isHtmlFileTypeTemplate);
          setHtmlFileName(result.resultData.htmlFileName);
          setDocumentDeleted(result.resultData.isActive);
          setFieldsMapping(result.resultData.documentFieldsMappings);
          setServiceDate(result.resultData.serviceDate);
          setLockDocument(result.resultData.isLocked);
          setSealDocumentVal(result.resultData.isSealed);
          fetchDocumentSignature(documentId);
          fetchLinkedDocuments(documentId);
          fetchLinkedQuestionnaire(documentId);
          setMenusShow(true);
          setRatingVal(result.resultData.rating);
          setAlreadyMark(result.resultData?.isNoteReviewed);
          setMarkAsReview(result.resultData?.isNoteReviewed);
        }

        // Get TASKs attached to this document
        const taskResult = await apiHelper.queryGetRequestWithEncryption(
          API_URLS.GET_DOCUMENT_TASKS,
          documentId
        );
        if (taskResult.resultData) {
          setTasks(
            taskResult.resultData.map((task) => {
              return {
                ...task,
                dueDate: task.dueDate,
              };
            })
          );
        }
      })
      .catch((err) => {
        showError(err, "Fetch Document");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function fetchTasks() {
    setLoading(true);
    return apiHelper
      .queryGetRequestWithEncryption(API_URLS.GET_DOCUMENT_TASKS, documentId)
      .then((taskResult) => {
        if (taskResult.resultData) {
          setTasks(taskResult.resultData);
        }
      })
      .catch((err) => {
        showError(err, "Fetch Tasks");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    if (documentId) {
      fetchByDocumentId(documentId);
    }
  }, [documentId]);

  useEffect(() => {
    onFieldsSet();
  });

  useEffect(() => {
    fetchDocSettings();
  }, []);

  useEffect(() => {
    if (staffInfo?.id) {
      getStaffSettingList();
    }
  }, []);

  useEffect(() => {
    if (documentDraftId) {
      setLoading(true);
      apiHelper
        .queryGetRequestWithEncryption(
          API_URLS.GET_DOCUMENT_DRAFT_BY_ID,
          documentDraftId
        )
        .then((result) => {
          if (result.resultData) {
            setDocumentDetail(
              convertServerDocumentDraftToLocal(result.resultData)
            );
          }
        })
        .catch((err) => {
          showError(err, "Fetch Draft");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [documentDraftId]);

  /* ============================= private functions ============================= */

  useEffect(() => {}, [isPrintPDF]);

  function onFieldsSet() {
    if (fieldsMapping && fieldsMapping.length > 0) {
      onShowFileTempFields(fieldsMapping, documentId, true);
    }
  }

  const insertStaffSignature = async (pin, sigDate, sigTime) => {
    setLoading(true);
    await ClientService.InsertStaffDocumentSign(
      pin,
      sigDate,
      sigTime,
      documentId
    )
      .then((result) => {
        setLoading(false);
        NotificationManager.success("Signature applied successfully");
        setDisplaySignDialog(false);
        fetchDocumentSignature(documentId);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error);
      });
  };

  const insertClientSignature = async (pin, sigDate, sigTime) => {
    setLoading(true);
    await ClientService.InsertClientDocumentSign(
      pin,
      sigDate,
      sigTime,
      documentId,
      isParent,
      documentDetail?.clientId
    )
      .then((result) => {
        setLoading(false);
        NotificationManager.success("Signature applied successfully");
        setDisplaySignDialog(false);
        fetchDocumentSignature(documentId);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error);
      });
  };

  function getDocumentTemplate() {
    // setLoading(true);
    apiHelper
      .queryGetRequestWithEncryption(
        API_URLS.GET_DOCUMENT_TEMPLATE_BY_ID,
        documentDetail.documentTemplateId
      )
      .then((result) => {
        if (result.resultData)
          setTemplate(mapDocumentTemplate(result.resultData));
      })

      .catch((error) => {
        showError(error, "Fetch Template");
      })
      .finally(() => setLoading(false));
  }

  function deleteDraft() {
    setLoading(true);
    apiHelper
      .deleteRequestWithEncryption(
        API_URLS.DELETE_DOCUMENT_DRAFT_BY_ID,
        documentDraftId
      )
      .then((_) => {
        onBack();
      })
      .catch((err) => {
        showError(err, "Delete Draft");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const getStaffSettingList = () => {
    setLoading(true);
    let id = Encrption(staffInfo.id);
    apiHelper
      .getRequest(API_URLS.GET_STAFF_SETTING + id)
      .then((result) => {
        const data = result.resultData;
        setCanSealDocument(data.canSealDocuments);
        setLoading(false);
      })
      .catch((error) => {
        renderErrors(error.message);
        setLoading(false);
      });
  };

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
              canDuplicateDoc:
                result.resultData[0].allowStaffToDuplicateThierOwnDocs,
              canSealDocument: result.resultData[0].canSealDocument,
            };
            setDocSettings(settings);
          }
        }
      })
      .catch((err) => {
        showError(err, "Document Settings");
      })
      .finally(() => {});
  }

  function deleteDocument() {
    setLoading(true);
    apiHelper
      .deleteRequestWithEncryption(API_URLS.DELETE_DOCUMENT, documentId)
      .then((result) => {
        NotificationManager.success("Document deleted successfully");
        //  onBack();
        setDocumentDeleted(false);
        setConfirm(false);
        setScroll(false);
      })
      .catch((err) => {
        showError(err, "Delete Document");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function unTrashDocument() {
    setLoading(true);
    apiHelper
      .queryGetRequestWithEncryption(API_URLS.UNTRASH_DOCUMENT, documentId)
      .then((result) => {
        NotificationManager.success("Document restored successfully");
        //  onBack();
        setDocumentDeleted(true);
        setConfirm(false);
        setScroll(false);
      })
      .catch((err) => {
        showError(err, "Restore Document");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function deleteAttachment() {
    setLoading(true);
    apiHelper
      .deleteRequestWithEncryption(
        API_URLS.DELETE_DOCUMENT_ATTACHMENT,
        attachmentId
      )
      .then((result) => {
        NotificationManager.success("Attachment deleted successfully");
        hideConfirmPopup();
        fetchDocumentAttachment();
      })
      .catch((err) => {
        showError(err, "Delete Attachment");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleDocumentRating(value) {
    const body = {
      rating: value,
      documentId: documentId,
    };
    apiHelper
      .postRequest(API_URLS.POST_DOCUMENT_RATING, body)
      .then((result) => {
        fetchByDocumentId(documentId);
        // NotificationManager.success("Document rating done successfully");
      })
      .catch((error) => {
        showError(error, "Rating Document");
      });
  }

  function handleSealedDocument() {
    const body = {
      isSealed: isDocSealed == false ? true : false,
      documentId: documentId,
    };
    apiHelper
      .postRequest(API_URLS.POST_SEAL_DOCUMENT, body)
      .then((result) => {
        NotificationManager.success("Document sealed successfully");
        setSealDocumentVal(true);
        setIsSealDocument(false);
        setScroll(false);
      })
      .catch((error) => {
        showError(error, "Seal Document");
      });
  }

  function deleteLinkedDoc() {
    setLoading(true);
    apiHelper
      .deleteRequestWithEncryption(API_URLS.DELETE_LINKED_DOCUMENT, linkedDocId)
      .then((result) => {
        NotificationManager.success("Linked document deleted successfully");
        hideConfirmPopup();
        fetchLinkedDocuments(documentId);
      })
      .catch((err) => {
        showError(err, "Delete Attachment");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function deleteLinkedQuestionnaire() {
    setLoading(true);
    apiHelper
      .deleteRequestWithEncryption(
        API_URLS.DELETE_LINKED_QUESTIONNAIRE,
        deletedQuesionId
      )
      .then((result) => {
        NotificationManager.success(
          "Linked questionnaire deleted successfully"
        );
        hideConfirmPopup();
        fetchLinkedQuestionnaire(documentId);
      })
      .catch((err) => {
        showError(err, "Delete Questionnaire");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function fetchDocumentAttachment() {
    apiHelper
      .queryGetRequestWithEncryption(
        API_URLS.GET_DOCUMENT_ATTACHMENT,
        documentId
      )
      .then((result) => {
        setDocAttachment(result.resultData);
      })
      .catch((err) => {
        showError(err, "Error while fetching document attachment");
      })
      .finally(() => {});
  }

  function fetchDocumentSignature(id) {
    apiHelper
      .queryGetRequestWithEncryption(API_URLS.GET_STAFF_DOCUMENT_SIGNATURE, id)
      .then((result) => {
        let sign = result.resultData;
        sign.forEach((element) => {
          let id = element.staffId;
          setSignStaffId(id);
        });
        setDocSignature(result.resultData);
        fetchDocumentAttachment();
      })
      .catch((err) => {
        showError(err, "Error while fetching document signature");
      })
      .finally(() => {});
  }

  function fetchLinkedDocuments(id) {
    apiHelper
      .queryGetRequestWithEncryption(API_URLS.GET_DOCUMENTS_BY_DOCUMENT_ID, id)
      .then((result) => {
        setLinkedDocuments(result.resultData);
      })
      .catch((err) => {
        showError(err, "Error while fetching linked documents");
      })
      .finally(() => {});
  }

  function fetchLinkedQuestionnaire(id) {
    apiHelper
      .queryGetRequestWithEncryption(
        API_URLS.GET_QUESTIONNAIRE_BY_DOCUMENT_ID,
        id
      )
      .then((result) => {
        setLinkedQuestionnaire(result.resultData);
      })
      .catch((err) => {
        showError(err, "Error while fetching linked questionnaire");
      })
      .finally(() => {});
  }

  function markDocumentAsReview() {
    apiHelper
      .patchRequest(API_URLS.MARK_AS_REVIEWED, documentId, false)
      .then((result) => {
        setAlreadyMark(true);
      })
      .catch((err) => {
        showError(err, "Error while marking as reviewed");
      })
      .finally(() => {});
  }

  function fetchDiagnosisList() {
    const body = {
      clientIds: [documentDetail.clientId],
      isActive: true,
    };
    apiHelper
      .postRequest(API_URLS.GET_CLIENTS_DIAGNOSIS, body)
      .then((result) => {
        const data = result.resultData;
        setDiagnosisList(data);
      })
      .catch((error) => {
        showError(error, "Fetch Diagnosis List");
      });
  }

  function lockUnLockDocument() {
    let docArry = [];
    docArry.push(documentId);
    const body = {
      ids: docArry,
      isLock: isLockDocument == false ? true : false,
      deleteAssociateSigns: isDeleteAssociateSign,
    };
    apiHelper
      .postRequest(API_URLS.LOCK_UNLOCK_DOCUMENTS, body)
      .then((result) => {
        if (isLockDocument == true) {
          NotificationManager.success("Document unlocked successfully");
          setLockDocument(false);
          fetchDocumentSignature(documentId);
          setDeleteAssociateSign(false);
        } else {
          setLockDocument(true);
          NotificationManager.success("Document locked successfully");
        }
        hideLockPopUp();
      })
      .catch((error) => {
        showError(error, "Lock Documents");
      });
  }

  function approveDisapproveDoc(status) {
    let docArry = [];
    docArry.push(documentId);
    const body = {
      docIds: docArry,
      isApproved: status,
    };
    apiHelper
      .postRequest(API_URLS.APPROVE_DISAPPROVE_DOCUMENTS, body)
      .then((result) => {
        if (status == true) {
          NotificationManager.success("Document approved successfully");
          setApprovedDoc(false);
          fetchByDocumentId(documentId);
        } else {
          setApprovedDoc(true);
          NotificationManager.success("Document not approved");
          fetchByDocumentId(documentId);
        }
      })
      .catch((error) => {
        showError(error, "Lock Documents");
      });
  }

  const handleApproved = () => {
    setApprovedDoc(true);
    approveDisapproveDoc(true);
  };

  const handleNotApproved = () => {
    setApprovedDoc(false);
    approveDisapproveDoc(false);
  };

  /* ============================= Event functions ============================= */

  const handleLockDocument = () => {
    setOpenLock(true);
    setScroll(true);
  };

  const handleViewHistory = () => {
    navigate(APP_ROUTES.DOCUMENT_HISTORY, {
      state: {
        id: documentId,
        documentName: documentDetail,
      },
    });
  };

  const hideLockPopUp = () => {
    setOpenLock(false);
    setScroll(false);
  };

  const onTaskDialogClose = () => {
    setShowTaskAndComments(false);
  };

  const onTaskAdded = ({ added }) => {
    if (added) {
      fetchTasks();
      // taskListRef.current.focus()
    }
  };

  const handleTaskAndComments = () => {
    setShowTaskAndComments(true);
  };

  const handleConfirm = (id) => {
    setConfirm(true);
    setScroll(true);
  };

  const hideConfirmPopup = () => {
    setConfirm(false);
    setScroll(false);
    setDeleteAttachment(false);
    setDeleteLinkedDoc(false);
    setIsSealDocument(false);
    setDeleteLinkQuestion(false);
  };

  function onBack() {
    navigate(backRoute);
  }

  function handleDelete() {
    if (documentDraftId) {
      deleteDraft();
    } else {
      if (isDocumentDeleted) {
        deleteDocument();
      } else {
        unTrashDocument();
      }
    }
  }

  function handleEdit() {
    navigate(documentId ? APP_ROUTES.DOCUMENT_EDIT : APP_ROUTES.DOCUMENT_ADD, {
      state: {
        id: documentId,
        draftId: documentDraftId,
        backRoute: APP_ROUTES.DOCUMENT_VIEW,
      },
    });
  }

  /* ============================= render functions ============================= */

  const handleDeleteAttachment = (id) => {
    setAttachmentId(id);
    setDeleteAttachment(true);
    setScroll(true);
  };

  const handleDeleteDoc = (id) => {
    setLinkedDocId(id);
    setDeleteLinkedDoc(true);
    setScroll(true);
  };

  const handleDeleteQuestionnaire = (id) => {
    setDeletedQuestionId(id);
    setDeleteLinkQuestion(true);
    setScroll(true);
  };

  const viewLinkedDocument = (id) => {
    setDocumentId(id);
    fetchByDocumentId(id);
    fetchDocumentSignature(id);
    fetchLinkedDocuments(id);
    fetchLinkedQuestionnaire(id);
    fetchDocumentAttachment();
    fetchDiagnosisList();
    window.scrollTo(0, 0);
  };

  const viewLinkedQuestionaire = (obj) => {
    setViewQuestion(true);
    setSelectedQuestionId(obj);
    setScroll(true);
  };

  const handleCloseQuestion = () => {
    setViewQuestion(false);
    setSelectedQuestionId({});
    setScroll(false);
  };

  function renderAttachments(isDocSealed) {
    const li = docAttachment.map((file, index) => {
      return (
        <li key={index} className="ml-2 mx-1 cursor-pointer">
          <a href={file.fileUrl} target="_blank" download>
            {file.fileName}
          </a>
          {isDocSealed == false && (
            <button
              title="Delete"
              className=" bg-transparent border-0  fa-regular fa-circle-xmark"
              onClick={() => {
                handleDeleteAttachment(file.id);
              }}
            ></button>
          )}
        </li>
      );
    });
    return (
      <ul className="d-flex flex-wrap upload-attachemnt list-unstyled mt-3">
        {li}
      </ul>
    );
  }

  function renderLinkedDocs(isDocSealed) {
    const li = linkedDocuments.map((obj, index) => {
      return (
        <li key={index} className="ml-2 mx-1 cursor-pointer">
          <a
            onClick={() => {
              viewLinkedDocument(obj.linkedDocId);
            }}
          >
            {obj.docName}
          </a>
          {isDocSealed == false && (
            <button
              title="Delete"
              className=" bg-transparent border-0 pr-3 fa-regular fa-circle-xmark"
              onClick={() => {
                handleDeleteDoc(obj.id);
              }}
            ></button>
          )}
        </li>
      );
    });
    return (
      <ul className="d-flex flex-wrap upload-attachemnt list-unstyled mt-3">
        {li}
      </ul>
    );
  }

  function renderLinkedQuestionnaire() {
    const li = linkedQuestionnaire.map((obj, index) => {
      return (
        <li key={index} className="ml-2 mx-1 cursor-pointer">
          <a
            onClick={() => {
              viewLinkedQuestionaire(obj);
            }}
          >
            [{moment.utc(obj.utcDateCreated).local().format("M/D/YYYY")}]{" "}
            {obj.shortName} - {obj.fullName}
          </a>

          {!isDocSealed && (
            <button
              title="Delete"
              className=" bg-transparent border-0 pr-3 fa-regular fa-circle-xmark"
              onClick={() => {
                handleDeleteQuestionnaire(obj.id);
              }}
            ></button>
          )}
        </li>
      );
    });
    return (
      <ul className="d-flex flex-wrap upload-attachemnt list-unstyled mt-3">
        {li}
      </ul>
    );
  }

  function renderTreatmentPlans() {
    return (
      <div className="form-group mt-3 pl-0 col-md-12">
        <h6 className="mb-3">Treatment Plan</h6>
        <div className="row">
          {documentDetail?.documentTreatmentPlans && (
            <div className="col-lg-12 col-12 mb-3">
              <div>
                {documentDetail?.documentTreatmentPlans.length == 0 ? (
                  <p>No Selected Treatment Plans</p>
                ) : (
                  documentDetail?.documentTreatmentPlans.map((plan, index) => {
                    return (
                      <>
                        {!documentDetail ? (
                          <CustomSkeleton shape="text" />
                        ) : (
                          <div key={index} className="treament-text ml-2 mb-2">
                            <div className="tex-show">
                              <p className="f-14 mb-2">{plan.goalName}</p>
                              <p className="f-12 mb-2">{plan.objectiveName}</p>
                              <p className="f-12 mb-2">
                                {plan.interventionName}
                              </p>
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

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
          <Checkbox
            title="Select"
            value={
              documentDetail?.clientDiagnosisId == props.dataItem.id && true
            }
          />
        </div>
      </td>
    );
  };

  function renderDiagnosis(diag) {
    return (
      <div className="form-group ml-2  pl-0 col-md-12">
        <div className="grid-table mb-3">
          <Grid data={diag.diagnosis}>
            <GridColumn
              cell={CustomCheckBox}
              className="cursor-default  icon-align"
              width="70px"
            />
            <GridColumn
              title="Diagnosis"
              cell={(props) => {
                let field = props.dataItem;
                return (
                  <td>
                    {!field ? (
                      <CustomSkeleton shape="text" />
                    ) : (
                      field?.icd10 + " - " + field?.diagnoseName
                    )}
                  </td>
                );
              }}
            />
            <GridColumn
              cell={(props) => {
                let field = props.dataItem;
                return (
                  <td>
                    {!field ? (
                      <CustomSkeleton shape="text" />
                    ) : (
                      convertFromUtcDateToDateOnly(field?.dateDiagnose)
                    )}
                  </td>
                );
              }}
              title="Date"
            />
          </Grid>
        </div>
      </div>
    );
  }

  function renderDiagnosisList() {
    return (
      <span>
        {diagnosisList.length > 0 && (
          <div className="row">
            <div className="form-group mb-3  pl-0 col-md-12">
              <h6 className="mb-2">Diagnosis</h6>
              {diagnosisList.map((diag) => renderDiagnosis(diag))}
            </div>
          </div>
        )}
      </span>
    );
  }

  function renderTemplate() {
    return (
      <PreviewDocumentTemplate
        controlList={template.controlList}
        documentFieldsMappings={documentDetail.documentFieldsMappings}
        // disabled={true}
        isViewMode={true}
      />
    );
  }

  const handlePrintOnClick = () => {
    setIsPrintPDF(true);
  };

  const handleAddSignature = () => {
    setDisplaySignDialog(true);
  };

  const hideSignatureDialog = () => {
    setDisplaySignDialog(false);
  };

  function handleDuplicateDoc() {
    navigate(APP_ROUTES.DOCUMENT_EDIT, {
      state: {
        id: documentId,
        isDuplicate: true,
      },
    });
  }

  function handleLinkDoc() {
    setLinkDoc(true);
    setScroll(true);
  }

  function handleAttachQuestion() {
    setAttachQuestion(true);
    setScroll(true);
  }

  function handleSealDoc() {
    if (isDocSealed) {
      setIsSealDocument(false);
    } else {
      setIsSealDocument(true);
      setScroll(true);
    }
  }

  function handleCloseLinkDoc({ linked }) {
    if (linked) {
      fetchLinkedDocuments(documentId);
    }
    setLinkDoc(false);
    setScroll(false);
  }

  function handleCloseQuestionnaire({ attached }) {
    if (attached) {
      fetchLinkedQuestionnaire(documentId);
    }
    setAttachQuestion(false);
    setScroll(false);
  }

  const handleRatingChange = (event) => {
    setRatingVal(event.value);
    handleDocumentRating(event.value);
  };

  const handleReviewSwitch = (e) => {
    var changeVal = e.target.value;
    setMarkAsReview(changeVal);
    if (changeVal == true) {
      markDocumentAsReview();
    }
  };

  // const ButtonApproved = ({}) => {
  //   return (
  //     <div className="col-md-6 col-12 px-0">
  //       <button
  //         onClick={handleApproved}
  //         className="btn blue-primary-outline btn-sm pr-2"
  //       >
  //         <i className="fa fa-check me-2"></i>
  //         Mark it Approved
  //       </button>
  //     </div>
  //   );
  // };

  const ButtonApproved = ({ }) => {
    return <div className="approve_btn px-0">
      <button onClick={handleApproved} className="btn blue-primary-outline btn-sm pr-2">
        <i className="fa fa-check me-2"></i>
        Mark it Approved
      </button>
    </div>
  }


  const ButtonNotApproved = ({ }) => {
    return <div className="unapprove_btn px-0">
      <button onClick={handleNotApproved} className="btn blue-primary-outline btn-sm pr-2">
        <i className="fa fa-ban me-2"></i>
        Mark Not Approved
      </button>
    </div>

  }

  


  const BothApprovedButton = ({}) => {
    return (
      <>
        <ButtonApproved />
        <ButtonNotApproved />
      </>
    );
  };

  function getClassName(actionId) {
    switch (actionId) {
      case ACTION_ID.approved:
        return <ButtonNotApproved />;
      case ACTION_ID.notApproved:
        return <ButtonApproved />;
      case ACTION_ID.toBeReview:
        return <BothApprovedButton />;
      case ACTION_ID.postEditReview:
        return <BothApprovedButton />;
    }
    return;
  }

  return (
    <div className={"file-" + documentId}>
      {!isMultiView && (
        <button
          type="button"
          value="BACK"
          onClick={onBack}
          className="border-0 bg-transparent arrow-rotate mb-3"
        >
          <i className="k-icon k-i-sort-asc-sm"></i>
          Back
        </button>
      )}
      <div className="container-fluid">
        <div className="Service-RateList">
          <div className="d-flex justify-content-between  mt-3">
            <h4 className="address-title text-grey ">
              <span className="f-20">
                {!documentDetail ? (
                  <CustomSkeleton shape="text" />
                ) : (
                  documentDetail?.docTemplateName +
                  " for " +
                  documentDetail?.clientNameDoc
                )}
              </span>
            </h4>
            <div>&nbsp;</div>
          </div>
        </div>
      </div>

      <div className="container-fluid ">
        <div className="row ">
          <div className="col-md-3">
            <div className="view-teplate-side">
              {!isShowMenus ? (
                <CustomSkeleton shape="text" />
              ) : (
                <Rating
                  value={ratingVal}
                  disabled={ratingVal > 0 ? true : false}
                  precision={"half"}
                  onChange={handleRatingChange}
                />
              )}

              <ul className="list-styled pl-0">
                {userAccessPermission[permissionEnum.EDIT_DOCUMENTS] && (
                  <>
                    {!isLockDocument && isDocSealed == false && (
                      <li onClick={handleEdit}>
                        {!isShowMenus ? (
                          <CustomSkeleton shape="text" />
                        ) : (
                          <a>
                            <i className="fa fa-edit pr-2"></i> Edit
                          </a>
                        )}
                      </li>
                    )}
                  </>
                )}

                {userAccessPermission[permissionEnum.LOCK_UNLOCK] && (
                  <>
                    {isDocSealed == false && (
                      <li onClick={handleLockDocument}>
                        {!isShowMenus ? (
                          <CustomSkeleton shape="text" />
                        ) : (
                          <a>
                            <i
                              className={
                                isLockDocument == true
                                  ? "fa fa-unlock pr-2"
                                  : "fa fa-lock pr-2"
                              }
                            ></i>{" "}
                            {isLockDocument == true ? "Unlock" : "Lock"}
                          </a>
                        )}
                      </li>
                    )}
                  </>
                )}

                {userAccessPermission[permissionEnum.VIEW_HISTORY] && (
                  <>
                    {
                      <li onClick={handleViewHistory}>
                        {!isShowMenus ? (
                          <CustomSkeleton shape="text" />
                        ) : (
                          <a>
                            <i className="fa fa-history pr-2"></i> View History
                          </a>
                        )}
                      </li>
                    }
                  </>
                )
                }

                {
                  <li
                    onClick={handlePrintOnClick}
                  >
                    {!isShowMenus ? (<CustomSkeleton shape="text" />) : (<a><i className="fa fa-print pr-2"></i> Print</a>)}
                  </li>
                }

                {!isDocSealed &&
                  <li onClick={handleTaskAndComments}>
                    {!isShowMenus ? (<CustomSkeleton shape="text" />) : (<a><i className="fa-solid fa-list-check pr-2"></i>  {"Add Tasks/Comments"}</a>)}
                  </li>
                }

                {
                  isDocSealed == false &&
                  <>
                    {
                      isLockDocument &&
                      <li onClick={handleAddSignature}>
                        {!isShowMenus ? (<CustomSkeleton shape="text" />) : (<a><i className="fa-solid fa-signature pr-2"></i>Apply Sig.</a>)}
                      </li>
                    }
                  </>
                }


                <>
                  {staffId == documentDetail?.createdBy &&
                    <li onClick={handleDuplicateDoc}>
                      {!isShowMenus ? (<CustomSkeleton shape="text" />) : (<a><i className="fa fa-clone pr-2"></i> Duplicate</a>)}
                    </li>
                  }
                </>


                {
                  isDocSealed == false &&
                  <li onClick={handleLinkDoc}>
                    {!isShowMenus ? (<CustomSkeleton shape="text" />) : (<a><i className="fa fa-link pr-2"></i>Link Document</a>)}
                  </li>
                }


                {!isDocSealed &&

                  <li onClick={handleAttachQuestion}>
                    {!isShowMenus ? (<CustomSkeleton shape="text" />) : (<a><i className="fa fa-file-text pr-2"></i> Link Questionnaire</a>)}
                  </li>
                }



                {
                  canSealDocument &&
                  <li onClick={handleSealDoc}>
                    {!isShowMenus ? (<CustomSkeleton shape="text" />) : (<a className={isDocSealed == true ? "cursor-default" : ""} ><i style={{ color: isDocSealed == true ? "#FF0000" : "" }} className="fa-solid fa-stamp pr-2"></i>
                      {isDocSealed == true ? "Document Sealed" : "Seal Document"}</a>)}
                  </li>
                }


                {userAccessPermission[permissionEnum.TRASH_UN_TRASH_DOCUMENT] &&
                  <>
                    {
                      <li onClick={handleConfirm}>
                        {!isShowMenus ? (<CustomSkeleton shape="text" />) : (<a><i className={isDocumentDeleted ? "fa fa-trash pr-2" : "fa fa-rotate-left pr-2"
                        }></i>  {isDocumentDeleted ? "Trash " : "Restore"}</a>)}
                      </li>
                    }
                  </>
                }


                {!isShowMenus ? (<CustomSkeleton shape="text" />) : (
                  <>
                    {
                      staffInfo?.canReviewDocuments &&
                      <div className="box_approve">
                        <label className="review_box-approve ml-2 fw-500">{"Review Status"}</label>

                        <div className={documentDetail.docStatusId == 1 ? " color_change_docs px-2 new-color-change" : "row color_change_docs px-2"} style={{
                          backgroundColor: documentDetail.docStatusId == 2 ? "#eefee7" :
                            documentDetail.docStatusId == 1 ? ""
                              :
                              "#fee9eb"
                        }}>
                        
                          <label className="dynamic_text_approve px-0 text-black">{documentDetail?.docStatus}</label>
                          <div className="dynamic_approve_btn">   {!isDocSealed && getClassName(documentDetail?.docStatusId)}</div>
                       
                        </div>

                      </div>
                    }
                  </>
                )}

                {
                  <li onClick={handlePrintOnClick}>
                    {!isShowMenus ? (
                      <CustomSkeleton shape="text" />
                    ) : (
                      <a>
                        <i className="fa fa-print pr-2"></i> Print
                      </a>
                    )}
                  </li>
                }

                {!isDocSealed && (
                  <li onClick={handleTaskAndComments}>
                    {!isShowMenus ? (
                      <CustomSkeleton shape="text" />
                    ) : (
                      <a>
                        <i className="fa-solid fa-list-check pr-2"></i>{" "}
                        {"Add Tasks/Comments"}
                      </a>
                    )}
                  </li>
                )}

                {isDocSealed == false && (
                  <>
                    {isLockDocument && (
                      <li onClick={handleAddSignature}>
                        {!isShowMenus ? (
                          <CustomSkeleton shape="text" />
                        ) : (
                          <a>
                            <i className="fa-solid fa-signature pr-2"></i>Apply
                            Sig.
                          </a>
                        )}
                      </li>
                    )}
                  </>
                )}

                <>
                  {staffId == documentDetail?.createdBy && (
                    <li onClick={handleDuplicateDoc}>
                      {!isShowMenus ? (
                        <CustomSkeleton shape="text" />
                      ) : (
                        <a>
                          <i className="fa fa-clone pr-2"></i> Duplicate
                        </a>
                      )}
                    </li>
                  )}
                </>

                {isDocSealed == false && (
                  <li onClick={handleLinkDoc}>
                    {!isShowMenus ? (
                      <CustomSkeleton shape="text" />
                    ) : (
                      <a>
                        <i className="fa fa-link pr-2"></i>Link Document
                      </a>
                    )}
                  </li>
                )}

                {!isDocSealed && (
                  <li onClick={handleAttachQuestion}>
                    {!isShowMenus ? (
                      <CustomSkeleton shape="text" />
                    ) : (
                      <a>
                        <i className="fa fa-file-text pr-2"></i> Link
                        Questionnaire
                      </a>
                    )}
                  </li>
                )}

                {canSealDocument && (
                  <li onClick={handleSealDoc}>
                    {!isShowMenus ? (
                      <CustomSkeleton shape="text" />
                    ) : (
                      <a
                        className={isDocSealed == true ? "cursor-default" : ""}
                      >
                        <i
                          style={{
                            color: isDocSealed == true ? "#FF0000" : "",
                          }}
                          className="fa-solid fa-stamp pr-2"
                        ></i>
                        {isDocSealed == true
                          ? "Document Sealed"
                          : "Seal Document"}
                      </a>
                    )}
                  </li>
                )}

                {userAccessPermission[
                  permissionEnum.TRASH_UN_TRASH_DOCUMENT
                ] && (
                  <>
                    {
                      <li onClick={handleConfirm}>
                        {!isShowMenus ? (
                          <CustomSkeleton shape="text" />
                        ) : (
                          <a>
                            <i
                              className={
                                isDocumentDeleted
                                  ? "fa fa-trash pr-2"
                                  : "fa fa-rotate-left pr-2"
                              }
                            ></i>{" "}
                            {isDocumentDeleted ? "Trash " : "Restore"}
                          </a>
                        )}
                      </li>
                    }
                  </>
                )}

                {!isShowMenus ? (
                  <CustomSkeleton shape="text" />
                ) : (
                  <>
                    {staffInfo?.canReviewDocuments && (
                      <div className="box_approve">
                        <label className="review_box-approve ml-2 fw-500">
                          {"Review Status"}
                        </label>

                        <div
                          className={
                            documentDetail.docStatusId == 1
                              ? "row color_change_docs px-2 new-color-change"
                              : "row color_change_docs px-2"
                          }
                          style={{
                            backgroundColor:
                              documentDetail.docStatusId == 2
                                ? "#3CB371"
                                : documentDetail.docStatusId == 1
                                ? ""
                                : "#EE4B2B",
                          }}
                        >
                          <label className="dynamic_text_approve px-0 text-black">
                            {documentDetail?.docStatus}
                          </label>
                          {!isDocSealed &&
                            getClassName(documentDetail?.docStatusId)}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </ul>
            </div>
          </div>
          <div className="col-md-6 file-print">
            {/* <ViewBillingStatus /> */}
            <div className="a4-size-page-view thin-scroll mt-2">
              <div className="row col-12">
                <div className="form-group mb-3 mt-3 pl-0 col-md-6">
                  <h6 className="mb-2">Client</h6>
                  {!documentDetail ? (
                    <CustomSkeleton shape="text" />
                  ) : (
                    <label className="ml-2">
                      {documentDetail?.clientNameDoc}
                    </label>
                  )}
                </div>
                <div className="form-group mb-3 mt-3 pl-0 col-md-6">
                  <h6 className="mb-2 ">Service Date</h6>
                  {!documentDetail ? (
                    <CustomSkeleton shape="text" />
                  ) : (
                    <label className="ml-2">
                      {moment(documentDetail?.serviceDateStr).format(
                        "M/D/YYYY"
                      )}
                    </label>
                  )}
                </div>

                {template.showServiceControl && (
                  <div className="form-group mb-3 mt-3 pl-0 col-md-6">
                    <h6 className="mb-2 ">Service</h6>
                    {!documentDetail ? (
                      <CustomSkeleton shape="text" />
                    ) : (
                      <label className="ml-2">
                        {documentDetail?.serviceNameTemp}
                      </label>
                    )}
                  </div>
                )}
                {template.timeRecordingMethodId !== 1 && (
                  <div className="form-group mb-3 mt-3 pl-0 col-md-6">
                    <h6 className="mb-2 ">Time/Duration/Shift</h6>
                    {documentDetail?.documentTimeRecording?.startTime &&
                    documentDetail?.documentTimeRecording?.endTime ? (
                      <label className="mb-2">
                        {!documentDetail ? (
                          <CustomSkeleton shape="text" />
                        ) : (
                          <label className="ml-2">
                            {convertTimeToLocally(
                              documentDetail.documentTimeRecording
                            )}
                          </label>
                        )}
                        {/* {
                        displayDateFromUtcDate(documentName?.documentTimeRecording?.startTime, "hh:mm A") + " to " +
                        displayDateFromUtcDate(documentName?.documentTimeRecording?.endTime, "hh:mm A")
                        } */}
                      </label>
                    ) : documentDetail?.documentTimeRecording?.shiftName ? (
                      <>
                        <label className="ml-2">
                          {documentDetail?.documentTimeRecording?.shiftName}
                        </label>
                      </>
                    ) : (
                      <p className="ml-2">---</p>
                    )}
                  </div>
                )}
                {template.showVisitType && (
                  <div className="form-group mb-2 mt-3 pl-0 col-md-6">
                    <h6 className="mb-2">Visit </h6>
                    {!documentDetail ? (
                      <CustomSkeleton shape="text" />
                    ) : (
                      <label className="ml-2">
                        {documentDetail?.isFaceToFace == true
                          ? "Face to Face"
                          : "Telephone"}
                      </label>
                    )}
                  </div>
                )}
                {template.showClientProgress && (
                  <div className="form-group mb-3 mt-3 pl-0 col-md-6">
                    <h6 className="mb-2 ">Client Progress</h6>
                    {!documentDetail ? (
                      <CustomSkeleton shape="text" />
                    ) : (
                      <label className="ml-2">
                        {documentDetail?.clientProgress
                          ? documentDetail?.clientProgress
                          : "---"}
                      </label>
                    )}
                  </div>
                )}

                {template.posType != "Not Required" && (
                  <div className="form-group mb-3 mt-3 pl-0 col-md-6">
                    <h6 className="mb-2">Place of Service</h6>
                    {documentDetail?.placeOfServiceList.length == 0 ? (
                      <p className="ml-2">---</p>
                    ) : (
                      documentDetail?.placeOfServiceList.map((obj, index) => {
                        return (
                          <>
                            {!documentDetail ? (
                              <CustomSkeleton shape="text" />
                            ) : (
                              <label key={index} className="col-md-12">
                                {obj.placeOfServiceName}
                              </label>
                            )}
                          </>
                        );
                      })
                    )}
                  </div>
                )}

                {template.showSiteOfService && (
                  <div className="form-group  mb-3  mt-3 pl-0 col-md-6 ">
                    <h6 className="mb-2">Location/Site of Service </h6>
                    {!documentDetail ? (
                      <CustomSkeleton shape="text" />
                    ) : (
                      <label className="ml-2">{documentDetail?.siteName}</label>
                    )}
                  </div>
                )}

                {template.showClientDiags && (
                  <div className="form-group  mb-3  mt-3 pl-0 col-md-6 ">
                    <h6 className="mb-2">Diagnosis </h6>
                    {!documentDetail ? (
                      <CustomSkeleton shape="text" />
                    ) : (
                      <label className="ml-2">
                        {documentDetail?.clientDiagnosisName}
                      </label>
                    )}
                  </div>
                )}

                <div className="form-group  mb-3 mt-3 pl-0 col-md-12 ">
                  <h6> Linked Documents</h6>
                  {linkedDocuments.length < 0 ? (
                    <CustomSkeleton shape="text" />
                  ) : linkedDocuments.length > 0 ? (
                    renderLinkedDocs(isDocSealed)
                  ) : (
                    <p className="ml-2">---</p>
                  )}
                </div>

                <div className="form-group  mb-3 mt-3 pl-0 col-md-12 ">
                  <h6> Questionnaire</h6>
                  {linkedQuestionnaire.length < 0 ? (
                    <CustomSkeleton shape="text" />
                  ) : linkedQuestionnaire.length > 0 ? (
                    renderLinkedQuestionnaire()
                  ) : (
                    <p className="ml-2">---</p>
                  )}
                </div>

                {template.showFileAttachment && (
                  <div className="form-group  mb-3 mt-3 pl-0 col-md-12 ">
                    <h6> Document Attachment</h6>
                    {docAttachment.length < 0 ? (
                      <CustomSkeleton shape="text" />
                    ) : docAttachment.length > 0 ? (
                      renderAttachments(isDocSealed)
                    ) : (
                      <p className="ml-2">---</p>
                    )}
                  </div>
                )}

                {template.showTreatmentPlan && renderTreatmentPlans()}
                {/* {diagnosisList && template.showClientDiags && renderDiagnosisList()} */}

                {tasks.length > 0 && (
                  <ListDocumentTasks
                    ref={taskListRef}
                    taskList={tasks}
                    fetchTasks={fetchTasks}
                    documentId={documentId}
                    authorStaffId={documentDetail.createdBy}
                  />
                )}

                {!isHtmlFileTypeTemplate &&
                  template &&
                  template.controlList &&
                  renderTemplate()}

                {isHtmlFileTypeTemplate && (
                  <AddDocumentFileTemplate name={htmlFileName} />
                )}

                <div className="form-group  mb-3 pl-0 col-md-12 ">
                  <h6 className="">Signature</h6>
                  {docSignature.length < 0 ? (
                    <CustomSkeleton shape="text" />
                  ) : docSignature.length > 0 ? (
                    docSignature.map((obj, index) => (
                      <div
                        key={index}
                        className="d-flex justify-content-between align-items-center border p-3 mb-3"
                      >
                        <div className="">
                          <div className="">
                            <p className="mb-0 text-grey">
                              Signed by:{" "}
                              <span className="fw-500">{obj.staffName}</span>{" "}
                            </p>
                            <p className="mb-0 text-grey">
                              Date :{" "}
                              {moment(obj.sigDateTime).format("M/D/YYYY")}
                            </p>
                          </div>
                          <img
                            className="signImage"
                            alt="demo"
                            src={"data:image/png;base64," + obj.signature}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="ml-2">---</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <br />
      {loading && <Loading />}
      {confirm && (
        <DeleteDialogModal
          onClose={hideConfirmPopup}
          title="Document"
          message="document"
          handleDelete={handleDelete}
          activeType={isDocumentDeleted == true ? false : true}
          handleReactive={handleDelete}
        />
      )}

      {isDeleteAttachment && (
        <DeleteAttachmentModal
          onClose={hideConfirmPopup}
          title="Attachment"
          message="attachment"
          handleDelete={deleteAttachment}
          activeType={false}
        />
      )}

      {isDeleteLinkDoc && (
        <DeleteLinkedDocModal
          onClose={hideConfirmPopup}
          title="Linked Document"
          message=""
          handleDelete={deleteLinkedDoc}
          activeType={false}
        />
      )}
      {isDeleteLinkQueston && (
        <DeleteLinkedDocModal
          onClose={hideConfirmPopup}
          title="Linked Questionnaire"
          message=""
          handleDelete={deleteLinkedQuestionnaire}
          activeType={false}
        />
      )}

      {isSealDocument && (
        <SealDocumentModal
          onClose={hideConfirmPopup}
          title="Document"
          message=""
          handleDelete={handleSealedDocument}
        />
      )}

      {isOpenLock && (
        <LockDialogModal
          onClose={hideLockPopUp}
          title="Document"
          message="document"
          handleDelete={lockUnLockDocument}
          activeType={isLockDocument}
          handleReactive={lockUnLockDocument}
          setDeleteAssociateSign={setDeleteAssociateSign}
          isDeleteAssociateSign={isDeleteAssociateSign}
        />
      )}

      {displaySignDialog && (
        <AddDocumentSignature
          insertDocumentStaffSign={insertStaffSignature}
          insertClientSignature={insertClientSignature}
          onClose={hideSignatureDialog}
          serviceDate={new Date(docServiceDate)}
          template={template}
          signStaffId={signStaffId}
          documentName={documentDetail}
          setIsParent={setIsParent}
        />
      )}

      {isLinkDoc && (
        <LinkDocument
          onClose={handleCloseLinkDoc}
          clientId={documentDetail?.clientId}
          documentId={documentId}
        />
      )}

      {isAttachQuestion && (
        <AttachQuestionnaire
          onClose={handleCloseQuestionnaire}
          clientId={documentDetail?.clientId}
          documentId={documentId}
        />
      )}

      {isPrintPDF && (
        <DocumentTempPDF
          isPrintPDF={isPrintPDF}
          staffInfo={staffInfo}
          documentName={documentDetail}
          diagnosisList={diagnosisList}
          docSignature={docSignature}
          isHtmlFileTypeTemplate={isHtmlFileTypeTemplate}
          htmlFileName={htmlFileName}
          template={template}
          onFieldsSet={onFieldsSet}
          documentId={documentId}
          docTreatmentPlans={documentDetail?.documentTreatmentPlans}
          setIsPrintPDF={setIsPrintPDF}
        />
      )}

      {isTaskAndDocuments && (
        <AddDocumentTask
          onClose={onTaskDialogClose}
          documentId={documentId}
          authorStaffId={documentDetail.createdBy}
          taskAdded={onTaskAdded}
        />
      )}

      {isViewQueston && (
        <ViewLinkedQuestionire
          onClose={handleCloseQuestion}
          selectedQuestionId={selectedQuestionId}
        />
      )}
    </div>
  );
};

export default ViewDocument;
