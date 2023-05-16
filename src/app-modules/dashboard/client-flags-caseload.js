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



const ClientFlagsCaseload = () => {

    // States
    const [loading, setLoading] = useState(false);
    const [isShowItems, setShowItems] = useState(false);
    const [clientFlagsData, setClientFlagsData] = useState([]);
    const [isViewList, setIsViewList] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    /* ============================= useEffect functions ============================= */

    useEffect(() => {
        getClientFlagCaseload()

    }, [])


    /* ============================= private functions ============================= */


    function handleClientView(e, field) {
        dispatch({
          type: SELECTED_CLIENT_ID,
          payload: field?.clientId,
        });
        navigate(APP_ROUTES.CLIENT_DASHBOARD);
      }
    

    const MyItemRender = (props) => {
        let item = props.dataItem;
        let clientFlags = item.flag
        return (
            <div
                className="row p-2 border-bottom align-middle"
                style={{
                    margin: 0,
                }}
            >
                {!isShowItems ? (<CustomSkeleton shape="text" />) : (<div onClick={(e) => handleClientView(e, item)} className="col-md-6  cursor-pointer text-theme">{item.clientName}</div>)}
                    
                {!isShowItems ? (<CustomSkeleton shape="text" />) : (<div className="col-md-6 text-right">
                    {clientFlags.length > 0 &&
                        clientFlags.map((obj) => (
                            <Chip
                                text={obj.flagName}
                                key={obj.id}
                                value="chip"
                                rounded={"large"}
                                fillMode={"solid"}
                                size={"medium"}
                               
                                style={{
                                    marginRight: 5,
                                    backgroundColor: obj.color,
                                    marginBottom: 10,
                                    color: "#ffffff",
                                    width:"max-Content",
                                }} 
                            />
                        ))}
                </div>)}
            </div>
        );
    };

    const getClientFlagCaseload = () => {
        setLoading(true);
        apiHelper
            .getRequest(API_URLS.GET_CLIENT_FLAGS_CASELOAD)
            .then((result) => {
                setLoading(false);
                setShowItems(true)
                setClientFlagsData(result.resultData)
            })
            .catch((error) => {
                setLoading(false);
            });
    };


    return (
        <div className="grid-table filter-grid dash-filter-grid my-3 caseload-custom">

            <h5>My Caseload Clients</h5>
            <ListView
                data={clientFlagsData}
                item={MyItemRender}
                style={{
                    width: "100%",
                }}
            />

        </div>
    );
};

export default ClientFlagsCaseload;
