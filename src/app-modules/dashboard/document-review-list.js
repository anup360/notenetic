/**
 * App.js Layout Start Here
 */
import React, { useEffect, useState } from "react";
import apiHelper from "../../helper/api-helper";
import API_URLS from "../../helper/api-urls";
import CustomSkeleton from "../../control-components/skeleton/skeleton";
import {
    ListView,
    ListViewHeader,
    ListViewFooter,
} from "@progress/kendo-react-listview";
import { Chip } from "@progress/kendo-react-buttons";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
    GET_CLIENT_PROFILE_IMG_BYTES, SELECTED_CLIENT_ID, SELECTED_STAFF_ID
} from "../../actions";
import APP_ROUTES from "../../helper/app-routes";
import moment from "moment";
import useModelScroll from "../../cutomHooks/model-dialouge-scroll";

const DocumentsReviewed = () => {

    // States
    const [loading, setLoading] = useState(false);
    const [isShowItems, setShowItems] = useState(false);
    const [reviewedDocumentData, setReviewedDocuments] = useState([]);
    const [isViewList, setIsViewList] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [modelScroll, setScroll] = useModelScroll();

    /* ============================= useEffect functions ============================= */

    useEffect(() => {
        getDocumentsReviewed()

    }, [])



    function handleClientView(e, field) {
        dispatch({
            type: SELECTED_CLIENT_ID,
            payload: field?.clientId,
        });
        navigate(APP_ROUTES.CLIENT_DASHBOARD);
    }



    function handleDocumentView(e, field) {
        navigate(APP_ROUTES.DOCUMENT_VIEW, {
            state: {
                id: field.id,
                backRoute: APP_ROUTES.DASHBOARD,
            },
        });
        window.scrollTo(0, 0);
    }

    const MyHeader = () => {
        return (
            <ListViewHeader
                style={{
                    color: "#000000",
                    fontSize: 20,
                }}
                className="px-3 py-2 "
            >
                <div className="d-flex justify-content-between mb-3">

                </div>
                <div className="row py-2 border-bottom align-middle">
                    <div className="col-2 ">
                        <h2 className="f-14">
                            ID
                        </h2>
                    </div>
                    <div className="col-3 ">
                        <h2 className="f-14">
                            Client
                        </h2>
                    </div>
                    <div className="col-2">
                        <h2 className="f-14">
                            DOS
                        </h2>
                    </div>
                    <div className="col-2">
                        <h2 className="f-14">
                            Service
                        </h2>
                    </div>
                    <div className="col-3">
                        <h2 className="f-14">
                            Staff
                        </h2>
                    </div>

                </div>
            </ListViewHeader>
        );
    };


    /* ============================= private functions ============================= */

    const MyItemRender = (props) => {
        let item = props.dataItem;


        return (
            <div className="row border-bottom mx-0">
                <div className="col-md-2">
                    <div
                        onClick={(e) => handleDocumentView(e, item)}

                        className="cursor-pointer text-theme "
                    >
                        {item.id}
                    </div>
                </div>
                <div className="col-md-3">
                    {!isShowItems ? (<CustomSkeleton shape="text" />) : (<div

                    >
                        {item.clientName}
                    </div>)}
                </div>
                <div className="col-md-2">
                    {
                        moment(item.serviceDate).format('M/D/YYYY')
                    }
                </div>

                <div className="col-md-2">
                    {item.serviceName}
                </div>

                <div className="col-md-3">{item.createByStaffName}
                </div>
            </div>


        );
    };

    const getDocumentsReviewed = () => {
        setLoading(true);
        apiHelper
            .getRequest(API_URLS.GET_DOCUMENT_REVIEWED_LIST)
            .then((result) => {
                setLoading(false);
                setShowItems(true)
                setReviewedDocuments(result.resultData)
            })
            .catch((error) => {
                setLoading(false);
            });
    };


    return (
        <div className="grid-table filter-grid dash-filter-grid my-3 caseload-custom">

            <h5>Documents to be Pending Review</h5>
            <ListView
                data={reviewedDocumentData}
                item={MyItemRender}
                style={{
                    width: "100%",
                }}
                header={MyHeader}

            />

        </div>
    );
};

export default DocumentsReviewed;
