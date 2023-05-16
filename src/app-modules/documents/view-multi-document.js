import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import APP_ROUTES from "../../helper/app-routes";
import ViewDocument from "./view-document";

const ViewMultipleDocument = () => {

    // States
    const [idList, setIdList] = useState([])
    const [backRoute, setBackRoute] = useState(APP_ROUTES.DOCUMENT_LIST)

    // use Variables
    const navigate = useNavigate();
    const location = useLocation();

    // One time set
    if (location && location.state) {
        if (idList.length < 1) {
            setIdList(location.state.idList)
        }
        if (location.state.backRoute && location.state.backRoute != backRoute) {
            setBackRoute(location.state.backRoute)
        }
    }

    /* ============================= useEffects ============================= */

    /* ============================= private functions ============================= */

    /* ============================= Event functions ============================= */

    function onBack() { navigate(backRoute) }

    /* ============================= render functions ============================= */

    function renderDocumentList() {
        return idList.map(id =>
            <div>
                <ViewDocument multiId={id} />
                <div className="border-bottom-line my-3"></div>
            </div>
        )
    }

    return <div>
        <button type="button" value="BACK" onClick={onBack}
            className='border-0 bg-transparent arrow-rotate pl-0 mb-3'>
            <i className='k-icon k-i-sort-asc-sm'></i>
            Back
        </button>
        <br />
        {renderDocumentList()}
    </div>
}

export default ViewMultipleDocument;