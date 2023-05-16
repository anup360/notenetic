/**
 * App.js Layout Start Here
 */
import React, { useEffect, useState } from "react";
import apiHelper from "../../helper/api-helper";
import API_URLS from "../../helper/api-urls";
import ListViewDashboard from "../../control-components/list-view-dashboard/list-view-dashboard";
import DialougueRemainingUnits from "../../control-components/dialouge-list-view/dialouge-list-view-remaining-units";
import authUnits from './auth-units.json';
import useModelScroll from "../../cutomHooks/model-dialouge-scroll";


const AuthorizationUnits = () => {

    // States
    const [loading, setLoading] = useState(false);
    const [authUnitsArry, setAuthUnitsArry] = useState(authUnits)
    const [isShowItems, setShowItems] = useState(false);
    const [authUnitsData, setAuthUnitsData] = useState([]);
    const [isViewList, setIsViewList] = useState(false);
    const [modelScroll, setScroll] = useModelScroll();

    const label = "Clients by Remaining Authorizations Units"


    /* ============================= useEffect functions ============================= */

    useEffect(() => {
        getRemainingAuthUnits(0, 5, true)
        getRemainingAuthUnits(0, 10, true)
        getRemainingAuthUnits(0, 25, true)
    }, [])


    /* ============================= private functions ============================= */

    const setCount = (id, count) => {
        authUnitsArry.forEach(element => {
            if (element.id == id) {
                element.count = count
            }
        });
        setAuthUnitsArry(authUnitsArry)
    }

    const getRemainingAuthUnits = (value1, value2, value3) => {
        setLoading(true);
        apiHelper
            .getRequest(API_URLS.GET_REMAINING_AUTH_UNITS + "numUnitRangeFrom" + "=" + value1 + "&" +
                "numUnitRangeTo" + "=" + value2 + "&" + "returnTotCountOnly=" + value3)
            .then((result) => {
                setLoading(false);
                setShowItems(true)
                const totalCount = result.resultData.result.count
                if (value3 == false) {
                    setAuthUnitsData(result.resultData.result)
                } else {
                    if (value1 == 0 && value2 == 5) {
                        setCount(1, totalCount)
                    } else if (value1 == 0 && value2 == 10) {
                        setCount(2, totalCount)
                    }
                    else if (value1 == 0 && value2 == 25) {
                        setCount(3, totalCount)
                    } 
                }
            })
            .catch((error) => {
                setLoading(false);
            });
    };


    const handleCloseView = () => {
        setIsViewList(false)
        setScroll(false)
    }

    return (
        <div className="grid-table filter-grid dash-filter-grid my-3">
            <ListViewDashboard
                label={label}
                data={authUnitsArry}
                isShowItems={isShowItems}
                getAPICall={getRemainingAuthUnits}
                setIsViewList={setIsViewList}
                setScroll={setScroll}
            />

            {
                isViewList &&
                <DialougueRemainingUnits
                    onClose={handleCloseView}
                    data={authUnitsData}
                    label={label}
                    setScroll={setScroll}
                />
            }
        </div>
    );
};

export default AuthorizationUnits;
