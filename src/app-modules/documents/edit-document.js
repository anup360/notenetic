import React, { useState } from 'react';
import { useLocation } from 'react-router';
import APP_ROUTES from '../../helper/app-routes';
import AddEditDocument, { documentStatusEnum } from "./add-edit-document";

const EditDocument = (props) => {

    // States
    const [backRoute, setBackRoute] = useState(APP_ROUTES.DOCUMENT_LIST)
    const [editDocumentId, setEditDocumentId] = useState()
    const [editDraftId, setEditDraftId] = useState()
    const [duplicateDocument, setDuplicateDoument] = useState()

    // Variable
    const location = useLocation()

    // Set States
    if (location && location.state) {
        if (location.state.backRoute && location.state.backRoute != backRoute) {
            setBackRoute(location.state.backRoute)
        }

        if (location.state.id && location.state.id != editDocumentId) {
            setEditDocumentId(location.state.id)
            setDuplicateDoument(location.state.isDuplicate)
        }
        else if (location.state.draftId && location.state.draftId != editDraftId) {
            setEditDraftId(location.state.draftId)
        }
    }

    /* ============================= useEffect functions ============================= */

    /* ============================= Render functions ============================= */

    return <AddEditDocument
        documentStatus={
            duplicateDocument ? documentStatusEnum.duplicate  :
            editDraftId ?  documentStatusEnum.draft : documentStatusEnum.edit
        
        }
        backRoute={backRoute}
        editDocumentId={editDocumentId}
        editDraftId={editDraftId}
    />
}

export default EditDocument;