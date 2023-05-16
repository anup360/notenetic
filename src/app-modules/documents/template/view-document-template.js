import { Button } from '@progress/kendo-react-buttons';
import Loader from '../../../control-components/loader/loader'
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import apiHelper from "../../../helper/api-helper";
import API_URLS from "../../../helper/api-urls";
import APP_ROUTES from '../../../helper/app-routes';
import { showError } from "../../../util/utility";
import { mapDocumentTemplate, templateTypeString } from './document-template-utility';
import { PreviewDocumentTemplate } from "./preview-document-template";

import { NotificationManager } from "react-notifications";
import DeleteDialogModal from "../../../control-components/custom-delete-dialog-box/delete-dialog";
import useModelScroll from "../../../cutomHooks/model-dialouge-scroll";

export const ViewDocumentTemplate = () => {

    const [docTemplate, setDocTemplate] = useState()
    const [documentTemplateId, setDocumentTemplateId] = useState()
    const [editTemplateDraftId, setEditTemplateDraftId] = useState()
    const [templateName, setTemplateName] = useState("");
    const [templateType, setTemplateType] = useState(1);
    const [controlList, setControlList] = useState([]);
    const [loading, setLoading] = useState(false)
    const [backRoute, setBackRoute] = useState(APP_ROUTES.DOCUMENT_TEMPLATE_LIST)

    const [confirm, setConfirm] = useState(false);
    const [modelScroll, setScroll] = useModelScroll();

    const navigate = useNavigate();
    const location = useLocation();
    if (location && location.state && location.state.documentTemplateId != documentTemplateId) {
        setDocumentTemplateId(location.state.documentTemplateId)
    }

    if (location && location.state) {
        if (location.state.backRoute && location.state.backRoute != backRoute) {
            setBackRoute(location.state.backRoute)
        }
        if (location.state.documentTemplateId && location.state.documentTemplateId != documentTemplateId) {
            setDocumentTemplateId(location.state.documentTemplateId)
        }
        if (location.state.templateDraftId && location.state.templateDraftId != editTemplateDraftId) {
            setEditTemplateDraftId(location.state.templateDraftId)
        }
    }

    /* ============================= private functions ============================= */

    function deleteTemplateDraft() {
        setLoading(true)
        apiHelper.deleteRequestWithEncryption(API_URLS.DELETE_TEMPLATE_DRAFT_BY_ID, editTemplateDraftId)
            .then(_ => { navigate(APP_ROUTES.DOCUMENT_TEMPLATE_DRAFT_LIST) })
            .catch(err => { showError(err, "Delete Template Draft") })
            .finally(() => { setLoading(false) })
    }

    function deleteDocumentTemplate() {
        setLoading(true)
        apiHelper.deleteRequestWithEncryption(API_URLS.DELETE_DOCUMENT_TEMPLATE, documentTemplateId)
            .then(_ => { navigate(APP_ROUTES.DOCUMENT_TEMPLATE_LIST) })
            .catch(err => { showError(err, "Delete Document Template") })
            .finally(() => { setLoading(false) })
    }

    /* ============================= event functions ============================= */

    function onBack() { navigate(backRoute) }

    const handleConfirm = (id) => {
        setConfirm(true);
        setScroll(true);
    };

    const hideConfirmPopup = () => {
        setConfirm(false);
        setScroll(false);
    };

    function handleDelete() {
        if (editTemplateDraftId) {
            deleteTemplateDraft()
        } else {
            deleteDocumentTemplate()
        }
    }

    function handleEditDocumentTemplate() {
        navigate(APP_ROUTES.DOCUMENT_TEMPLATE_ADD, {
            state: {
                templateDraftId: editTemplateDraftId,
                documentTemplateId: documentTemplateId,
                backRoute: documentTemplateId ? APP_ROUTES.DOCUMENT_TEMPLATE_LIST
                    : APP_ROUTES.DOCUMENT_TEMPLATE_DRAFT_LIST
            }
        });
    }

    /* ============================= useEffects ============================= */

    useEffect(() => {
        if (docTemplate) {
            setTemplateName(docTemplate.name)
            setTemplateType(docTemplate.type)
            setControlList(docTemplate.controlList)
        }
    }, [docTemplate])

    useEffect(() => {
        if (documentTemplateId) {
            setLoading(true)
            apiHelper.queryGetRequestWithEncryption(API_URLS.GET_DOCUMENT_TEMPLATE_BY_ID, documentTemplateId)
                .then(result => {
                    if (result.resultData) {
                        setDocTemplate(mapDocumentTemplate(result.resultData))
                    }
                })
                .catch(err => { showError(err, "Fetch Document Template") })
                .finally(() => { setLoading(false) })
        }
    }, [documentTemplateId])

    useEffect(() => {
        if (editTemplateDraftId) {
            setLoading(true)
            apiHelper.queryGetRequestWithEncryption(API_URLS.GET_TEMPLATE_DRAFT_BY_ID, editTemplateDraftId)
                .then(result => {
                    if (result.resultData) {
                        setDocTemplate(mapDocumentTemplate(result.resultData))
                    }
                })
                .catch(err => { showError(err, "Fetch Template Draft") })
                .finally(() => { setLoading(false) })
        }
    }, [editTemplateDraftId])

    return (
        <div>
            {loading
                ? <div><Loader /></div>
                : <div>
                    <button type="button" value="BACK" onClick={onBack}
                        className='border-0 bg-transparent arrow-rotate pl-0 mb-3'>
                        <i className='k-icon k-i-sort-asc-sm'></i>
                    </button>
                    <div className="Service-RateList">
                        <div className="d-flex justify-content-between  mt-3">
                            <h4 className="address-title text-grey ">
                                <span className="f-24">
                                    {templateTypeString[templateType - 1]} Template{editTemplateDraftId ? " Draft" : ""} - {templateName}
                                </span>
                            </h4>
                            <div>
                                {
                                    docTemplate?.isDefault == false && docTemplate.isHtmlFileTypeTemplate == false &&
                                    <Button
                                        className="btn blue-primary text-white "
                                        onClick={handleEditDocumentTemplate}>
                                        Edit Template
                                    </Button>
                                }

                                &nbsp;
                                <button
                                    className="btn blue-primary text-white "
                                    onClick={handleConfirm}>
                                    Delete Template
                                </button>
                            </div>
                        </div>
                    </div>
                    <br />
                    <PreviewDocumentTemplate
                        templateName={templateName}
                        controlList={controlList}
                    />
                    {confirm && (
                        <DeleteDialogModal
                            onClose={hideConfirmPopup}
                            title="Document Template"
                            message="document template"
                            handleDelete={handleDelete}
                        />
                    )}
                </div>
            }
        </div>
    )
}