import moment from "moment";
import { convertFromUtcDateToDateOnly, convertFromUtcTimeToTimeOnly } from "../../util/utility";

export const timeRecordingTypeEnum = { notRequired: 1, actual: 2, duration: 3, shift: 4 }


const format = "hh:mm A"

function formatTime(data) {
    let { recordingMethodId, startTime, endTime, shiftName, totalMinutes } = data;
    if (recordingMethodId) {
        switch (recordingMethodId) {
            case timeRecordingTypeEnum.actual:
                if (startTime && endTime) {
                    return `${(moment(startTime).format(format))} - ${(moment(endTime).format(format))}`;
                }
                break;
            case timeRecordingTypeEnum.shift:
                if (shiftName) {
                    return `${shiftName}`;
                }
                break;
            case timeRecordingTypeEnum.duration:
                if (totalMinutes != null) {
                    return `${totalMinutes} mins`;
                }
                break;
        }
    }
    return "-";
}

function parseFullName(fname, mname, lname) {
    let clientName = "";

    if (fname) {
        clientName += lname
    }
    if (lname) {
        clientName += ", " + fname
    }

    return clientName;
}

function parseDocumentListItem(data) {
    let clientName = parseFullName(data.clientFName, data.clientMName, data.clientLName);
    let authorName = data.staffFName + " " + data.staffLName;
    return {
        ...data,
        documentTemplateName: data.templateName,
        id: data.documentId,
        clientName: clientName,
        serviceName: data.service || data.serviceName,
        serviceNameTemp: data.serviceName,
        docTemplateName: data.documentTemplateName,
        clientNameDoc: data.clientName,
        createdBy: data.createdBy,
        clientId: data.clientId,
        dateOfBirth: data.dateOfBirth,
        diagnosis: data.diagnosis,
        isLocked: data.isLocked,
        isSigned: data.isSigned,
        lockedByStaff: data.lockedByStaff,
        numUnits: data.numUnits,
        primaryInsurance: data.primaryInsurance,
        serviceRate: data.serviceRate,
        amtBilled: data.amtBilled,
        custAuthId: data.custAuthId,
        rating: data.rating,
        isNoteReviewed:data.isNoteReviewed,
        clientDiagnosisId:data.clientDiagnosisId,
        docStatusId:data.docStatusId,
        docStatus:data.docStatus,
        // serviceDateStr: convertFromUtcDateToDateOnly(data.serviceDate),
        serviceDate: convertFromUtcDateToDateOnly(data.serviceDate),
        serviceDateStr: data.serviceDate,
        serviceDateObj: new Date(convertFromUtcDateToDateOnly(data.serviceDate)),
        utcDateCreatedStr: convertFromUtcDateToDateOnly(data.utcDateCreated),
        utcDateCreatedObj: new Date(convertFromUtcDateToDateOnly(data.utcDateCreated)),

        placeOfServiceStr: data.placeOfServiceList.map(y => ` ${y.placeOfServiceName}`),
        timeStr: data.recordingMethodId ? formatTime(data) : "-",
        authorName: authorName
    }
}


function parseDocumentDraftListItem(serverDoc) {
    let clientName = serverDoc.draftData.clientName;

    if (serverDoc.draftData.clients && serverDoc.draftData.clients.length > 0) {
        clientName = ""
        for (const client of serverDoc.draftData.clients) {
            if (clientName != "") {
                clientName += ", "
            }
            clientName += client.clientName
        }
    }

    return {
        ...serverDoc.draftData,
        documentTemplateName: serverDoc.draftData.templateName ? serverDoc.draftData.templateName : serverDoc.draftData.documentTemplateName,
        draftId: serverDoc.draftData.draftId,
        clientName: clientName,
        serviceName: serverDoc.draftData.serviceName ? serverDoc.draftData.serviceName : serverDoc.draftData.service,
        serviceDate: convertFromUtcDateToDateOnly(serverDoc.draftData.serviceDate),
        serviceDateStr: convertFromUtcDateToDateOnly(serverDoc.draftData.serviceDate),
        serviceDateObj: new Date(convertFromUtcDateToDateOnly(serverDoc.draftData.serviceDate)),
        utcDateCreatedStr: convertFromUtcDateToDateOnly(serverDoc.utcDateCreated),
        utcDateCreatedObj: new Date(convertFromUtcDateToDateOnly(serverDoc.utcDateCreated))
    }
}

export function convertTimeToLocally(data) {
    return formatTime(data)
}

export function convertServerDocumentToLocal(serverDoc) {
    return parseDocumentListItem(serverDoc)
}

export function convertServerDocumentDraftToLocal(serverDoc) {
    return parseDocumentDraftListItem(serverDoc)
}