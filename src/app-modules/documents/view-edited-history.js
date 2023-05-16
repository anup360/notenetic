import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import Loading from '../../control-components/loader/loader';
import apiHelper from "../../helper/api-helper";
import API_URLS from "../../helper/api-urls";
import APP_ROUTES from "../../helper/app-routes";
import { showError } from "../../util/utility";
import { convertTimeToLocally, timeRecordingTypeEnum } from "./document-utility";
import { mapDocumentTemplate } from "./template/document-template-utility";
import { PreviewDocumentTemplate } from './template/preview-document-template';

const FIELD_NAME = {
    service: "serviceId",
    clientProgress: "clientProgressId",
    documentTimeRecording: "documentTimeRecording",
    placeOfService: "placeOfServiceId",
    serviceSite: "serviceSiteId",
    isFaceToFace: "isFaceToFace",
    isTelephone: "isTelephone",
    treatmentPlans: "documentTreatmentPlans",
    documentTemplate: "documentFieldsMappings",
}

const EditedHistory = ({ }) => {

    const [loading, setLoading] = useState(true)
    const [newService, setNewService] = useState()
    const [oldService, setOldService] = useState()
    const [newClientProgress, setNewClientProgress] = useState()
    const [oldClientProgress, setOldClientProgress] = useState()
    const [newTimeRecording, setNewTimeRecording] = useState()
    const [oldTimeRecording, setOldTimeRecording] = useState()
    const [newPlaceOfServiceList, setNewPlaceOfServiceList] = useState()
    const [oldPlaceOfServiceList, setOldPlaceOfServiceList] = useState()
    const [newSite, setNewSite] = useState()
    const [oldSite, setOldSite] = useState()
    const [newFaceToFace, setNewFaceToFace] = useState()
    const [oldFaceToFace, setOldFaceToFace] = useState()
    const [newTelephone, setNewTelephone] = useState()
    const [oldTelephone, setOldTelephone] = useState()
    const [newTreatmentPlans, setNewTreatmentPlans] = useState()
    const [oldTreatmentPlans, setOldTreatmentPlans] = useState()
    const [newDocumentFieldsMappings, setNewDocumentFieldsMappings] = useState()
    const [oldDocumentFieldsMappings, setOldDocumentFieldsMappings] = useState()
    const [changedDocumentFieldKeyNames, setChangedDocumentFieldKeyNames] = useState()
    const [template, setTemplate] = useState()

    const clinicId = useSelector((state) => state.loggedIn.clinicId)
    const navigate = useNavigate()
    const location = useLocation()

    const documentId = location.state.documentId
    const documentName = location.state.documentName
    const oldVersion = location.state.oldVersion
    const latestVersion = location.state.latestVersion
    const documentTemplateId = location.state.documentTemplateId

    /* ============================= useEffect functions ============================= */

    useEffect(() => {
        initData()
    }, [oldVersion, latestVersion])

    /* ============================= private functions ============================= */

    function onBack() {
        navigate(APP_ROUTES.DOCUMENT_HISTORY, {
            state: {
                id: documentId,
                documentName: documentName
            },
        });
    }

    async function initData() {
        for (const key of Object.keys(oldVersion)) {
            // return Object.keys(oldVersion).forEach(async (key) => {

            switch (key) {
                case FIELD_NAME.isFaceToFace:
                    setNewFaceToFace(latestVersion[key])
                    setOldFaceToFace(oldVersion[key])
                    break;
                case FIELD_NAME.isTelephone:
                    setNewTelephone(latestVersion[key])
                    setOldTelephone(oldVersion[key])
                    break;
            }

            if (JSON.stringify(oldVersion[key]) !== JSON.stringify(latestVersion[key])) {

                const obj = {
                    name: key,
                    oldValue: JSON.stringify(oldVersion[key]),
                    newValue: JSON.stringify(latestVersion[key]),
                }

                switch (obj.name) {

                    case FIELD_NAME.service:
                        await setService(obj)
                        break;

                    case FIELD_NAME.clientProgress:
                        await setClientProgress(obj)
                        break;

                    case FIELD_NAME.documentTimeRecording:
                        await setTimeRecording(obj)
                        break;

                    case FIELD_NAME.placeOfService:
                        await setPlaceOfService(obj)
                        break;

                    case FIELD_NAME.serviceSite:
                        await setServiceSite(obj)
                        break;

                    case FIELD_NAME.isFaceToFace:
                        break;

                    case FIELD_NAME.isTelephone:
                        break;

                    case FIELD_NAME.treatmentPlans:
                        await setTreatmentPlans(obj)
                        break;

                    case FIELD_NAME.documentTemplate:
                        await setDocumentTemplate(obj)
                        break;
                }
            }
            // });
        }
        setLoading(false)
    }

    async function setService(obj) {
        try {
            let result = await apiHelper.getRequest(API_URLS.GET_Services_BY_ID + obj.newValue)
            setNewService(result.resultData)
            result = await apiHelper.getRequest(API_URLS.GET_Services_BY_ID + obj.oldValue)
            setOldService(result.resultData)
        } catch (err) {
            showError(err, "Service")
        }
    }

    async function setClientProgress(obj) {
        try {
            let result = await apiHelper.getRequest(API_URLS.GET_CLIENT_PROGRESS)
            setNewClientProgress(result.resultData.find(x => x.id == obj.newValue))
            result = await apiHelper.getRequest(API_URLS.GET_CLIENT_PROGRESS)
            setOldClientProgress(result.resultData.find(x => x.id == obj.oldValue))
        } catch (err) {
            showError(err, "Client Progress")
        }
    }

    async function setTimeRecording(obj) {
        let newTime = JSON.parse(obj.newValue)
        let oldTime = JSON.parse(obj.oldValue)
        if (newTime.recordingMethodId == timeRecordingTypeEnum.shift ||
            oldTime.recordingMethodId == timeRecordingTypeEnum.shift) {
            try {
                let result = await apiHelper.getRequest(API_URLS.GET_SHIFTS)
                if (newTime.recordingMethodId == timeRecordingTypeEnum.shift) {
                    newTime.shift = result.resultData.find(x => x.id == obj.newValue)
                }
                if (oldTime.recordingMethodId == timeRecordingTypeEnum.shift) {
                    oldTime.shift = result.resultData.find(x => x.id == obj.newValue)
                }
            } catch (err) {
                showError(err, "Time Recording")
            }
        }
        setNewTimeRecording(newTime)
        setOldTimeRecording(oldTime)
    }

    async function setPlaceOfService(obj) {
        const newPlaceOfServiceList = JSON.parse(obj.newValue)
        const oldPlaceOfServiceList = JSON.parse(obj.oldValue)
        try {
            let result = await apiHelper.queryGetRequestWithEncryption(API_URLS.GET_PLACE_OF_SERVICES_DDL_BY_CLINIC_ID, clinicId)
            setNewPlaceOfServiceList(result.resultData.filter(x => newPlaceOfServiceList.includes(x.id)))
            result = await apiHelper.queryGetRequestWithEncryption(API_URLS.GET_PLACE_OF_SERVICES_DDL_BY_CLINIC_ID, clinicId)
            setOldPlaceOfServiceList(result.resultData.filter(x => oldPlaceOfServiceList.includes(x.id)))
        } catch (err) {
            showError(err, "Place of Service")
        }
    }

    async function setServiceSite(obj) {
        try {
            let result = await apiHelper.getRequest(API_URLS.GET_CLINIC_SITES)
            setNewSite(result.resultData.find(x => x.id == obj.newValue))
            result = await apiHelper.getRequest(API_URLS.GET_CLINIC_SITES)
            setOldSite(result.resultData.find(x => x.id == obj.oldValue))
        } catch (err) {
            showError(err, "Service Site")
        }
    }

    async function setTreatmentPlans(obj) {
        let newPlanList = JSON.parse(obj.newValue)
        let oldPlanList = JSON.parse(obj.oldValue)

        let treatmentPlanIds = []
        let objectiveIds = []
        let interventionIds = []
        for (const plan of [...newPlanList, ...oldPlanList]) {
            if (plan.treatmentPlanId && !treatmentPlanIds.includes(plan.treatmentPlanId)) {
                treatmentPlanIds.push(plan.treatmentPlanId)
            }
            if (plan.objectiveId && !objectiveIds.includes(plan.objectiveId)) {
                objectiveIds.push(plan.objectiveId)
            }
            if (plan.interventionId && !interventionIds.includes(plan.interventionId)) {
                interventionIds.push(plan.interventionId)
            }
        }
        try {
            let treatmentPlanList = []
            for (const treatmentPlanId of treatmentPlanIds) {
                const result = await apiHelper.queryGetRequestWithEncryption(API_URLS.GET_CLIENT_PLANS_BY_ID, treatmentPlanId)
                treatmentPlanList.push(result.resultData)
            }

            let objectiveList = []
            for (const objectiveId of objectiveIds) {
                const result = await apiHelper.queryGetRequestWithEncryption(API_URLS.GET_OBJECTIVE_BY_ID, objectiveId)
                objectiveList.push({ id: objectiveId, ...result.resultData })
            }

            let interventionList = []
            for (const interventionId of interventionIds) {
                const result = await apiHelper.queryGetRequestWithEncryption(API_URLS.GET_INTERVENTION_BY_ID, interventionId)
                interventionList.push({ id: interventionId, ...result.resultData })
            }

            const mapper = (x) => {

                let newObj = x

                const plan = treatmentPlanList.find(obj => obj.id == x.treatmentPlanId)
                if (plan) {
                    newObj = {
                        ...newObj,
                        ...plan
                    }
                }

                const objective = objectiveList.find(obj => obj.id == x.objectiveId)
                if (objective) {
                    newObj = {
                        ...newObj,
                        ...objective
                    }
                }

                const intervention = interventionList.find(obj => obj.id == x.interventionId)
                if (intervention) {
                    newObj = {
                        ...newObj,
                        ...intervention
                    }
                }
                return newObj
            }
            newPlanList = newPlanList.map(mapper)
            oldPlanList = oldPlanList.map(mapper)

            setNewTreatmentPlans(newPlanList)
            setOldTreatmentPlans(oldPlanList)
        } catch (err) {
            showError(err, "Treatement Plans")
        }
    }

    async function setDocumentTemplate(obj) {
        try {
            const result = await apiHelper.queryGetRequestWithEncryption(API_URLS.GET_DOCUMENT_TEMPLATE_BY_ID, documentTemplateId)
            if (result.resultData) {
                setTemplate(mapDocumentTemplate(result.resultData));
                const newMappings = JSON.parse(obj.newValue)
                const oldMappings = JSON.parse(obj.oldValue)
                setNewDocumentFieldsMappings(newMappings)
                setOldDocumentFieldsMappings(oldMappings)

                let changedKeyNameList = []
                for (const newMapping of newMappings) {
                    for (const oldMapping of oldMappings) {
                        if (newMapping.keyName == oldMapping.keyName) {
                            if (newMapping.keyValue != oldMapping.keyValue) {
                                changedKeyNameList.push(newMapping.keyName)
                            }
                        }
                    }
                }
                setChangedDocumentFieldKeyNames(changedKeyNameList)
            }
        } catch (err) {
            showError(err, "Document Template")
        }
    }

    /* ============================= render functions ============================= */

    function renderNewValue(value, key) {
        return <label key={key} className="mb-2">{!value ? "NA" : value}</label>
    }

    function renderOldValue(value, key) {
        return <label key={key} className="mb-2" style={{ color: "grey" }}>{!value ? "NA" : value}</label>
    }

    function renderValue(title, newValue, oldValue) {
        if (!oldValue && !newValue)
            return ""
        return <div className="form-group mb-3  pl-0 col-md-12">
            <h6 className="mb-2 ">{title}</h6>
            {renderNewValue(newValue)}
            <br />
            {renderOldValue(oldValue)}
        </div>
    }

    function renderTimeRecordingFor(documentTimeRecording, renderValueFunc) {
        return <>
            {
                documentTimeRecording.recordingMethodId == timeRecordingTypeEnum.actual
                    ? <label className="mb-2">
                        {renderValueFunc(convertTimeToLocally(documentTimeRecording))}
                    </label>
                    : documentTimeRecording.shiftName
                        ? <>
                            <label className="mb-2"></label>
                            {renderValueFunc(documentTimeRecording?.shiftName)}
                        </>
                        : <p>---</p>
            }
        </>
    }

    function renderTimeRecording() {
        if (!oldTimeRecording && !newTimeRecording) return ""

        return <div className="row">
            <h6 className="mb-2">
                Time/Duration/Shift
            </h6>
            {renderTimeRecordingFor(newTimeRecording, renderNewValue)}
            {renderTimeRecordingFor(oldTimeRecording, renderOldValue)}
        </div>
    }

    function renderPlaceOfServiceList(list, renderValueFunc) {
        return !list || list.length == 0
            ? (<p>---</p>)
            : (
                list.map((obj, index) => {
                    if (index < list.length - 1)
                        return <>{renderValueFunc(obj.name, index)}<br /></>
                    else
                        return renderValueFunc(obj.name, index)
                })
            )
    }

    function renderPlaceOfService() {
        if (!newPlaceOfServiceList && !oldPlaceOfServiceList) return ""

        return <div className="form-group mb-3 pl-0 col-md-6">
            <h6 className="mb-2">Place of Service</h6>
            {renderPlaceOfServiceList(newPlaceOfServiceList, renderNewValue)}
            <br />
            {renderPlaceOfServiceList(oldPlaceOfServiceList, renderOldValue)}
        </div>
    }

    function renderVisitType() {
        if (newFaceToFace === oldFaceToFace && newTelephone === oldTelephone)
            return

        return <div className="form-group mb-2 pl-0 col-md-6">
            <h6 className="mb-2">Visit </h6>
            {newFaceToFace && renderNewValue("Face to Face")}
            {newFaceToFace && <br />}
            {newTelephone && renderNewValue("Telephone")}
            <br />
            {oldFaceToFace && renderOldValue("Face to Face")}
            {oldFaceToFace && <span>  </span>}
            {oldTelephone && renderOldValue("Telephone")}
        </div>
    }

    function renderNewPlanValue(value) {
        return <p className="f-14 mb-2">{!value ? "NA" : value}</p>
    }

    function renderOldPlanValue(value) {
        return <p className="f-14 mb-2" style={{ color: "grey" }}>{!value ? "NA" : value}</p>
    }

    function renderTreatmentPlan(plan, index, renderValueFunc) {
        return < div key={index} className="treament-text mb-4">
            <div className="tex-show">
                {plan.treatmentPlanName && renderValueFunc(plan.treatmentPlanName)}
                {plan.objective && renderValueFunc(plan.objective)}
                {plan.intervention && renderValueFunc(plan.intervention)}
            </div>
        </div>
    }

    function renderTreatmentPlanListSelective(treatmentPlans, renderValueFunc) {
        return <div className="row">
            {treatmentPlans && (
                <div className="col-lg-12 col-12 mb-3">
                    <p className="mb-4 f-14"></p>
                    <div>
                        {treatmentPlans.length == 0 ? (
                            <p>{renderValueFunc("No Treatment Plans")}</p>
                        ) : (
                            treatmentPlans.map((plan, index) => {
                                return renderTreatmentPlan(plan, index, renderValueFunc)
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    }

    function renderTreatmentPlanList() {
        if (!newTreatmentPlans && !oldTreatmentPlans) return ""
        return (
            <div className="">
                <h6 >Treatment Plan</h6>
                {renderTreatmentPlanListSelective(newTreatmentPlans, renderNewPlanValue)}
                {renderTreatmentPlanListSelective(oldTreatmentPlans, renderOldPlanValue)}
            </div>
        );
    }

    function renderDocumentTemplate() {
        if (!newDocumentFieldsMappings && !oldDocumentFieldsMappings) return ""
        return <PreviewDocumentTemplate
            controlList={template.controlList}
            documentFieldsMappings={newDocumentFieldsMappings}
            oldDocumentFieldsMappings={oldDocumentFieldsMappings}
            changedDocumentFieldKeyNames={changedDocumentFieldKeyNames}
            isViewMode={true}
        />
    }

    return (
        <div className="container-fluid ">
            {loading && <Loading />}
            <div className="row ">
                <div className="col-md-12">
                    <button
                        type="button"
                        value="BACK"
                        onClick={onBack}
                        className="border-0 bg-transparent arrow-rotate mb-3"
                    >
                        <i className="k-icon k-i-sort-asc-sm"></i>
                        Back
                    </button>
                    <h5>Document History - Document Edited</h5>
                    {renderValue("Service", newService?.service, oldService?.service)}
                    {renderValue("Client Progress", newClientProgress?.name, oldClientProgress?.name)}
                    {renderTimeRecording()}
                    {renderPlaceOfService()}
                    {renderValue("Location/Site of Service", newSite?.siteName, oldSite?.siteName)}
                    {renderVisitType()}
                    {renderTreatmentPlanList()}
                    {renderDocumentTemplate()}
                </div>
            </div>
        </div>
    )
}

export default EditedHistory