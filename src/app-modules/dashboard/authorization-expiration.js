/**
 * App.js Layout Start Here
 */
import React, { useEffect, useState } from "react";
import apiHelper from "../../helper/api-helper";
import API_URLS from "../../helper/api-urls";
import ListViewDashboard from "../../control-components/list-view-dashboard/list-view-dashboard";
import DialougueAuthExpiration from "../../control-components/dialouge-list-view/dialouge-list-view-expiration-auth";
import authExpiration from './auth-expiration.json';
import useModelScroll from "../../cutomHooks/model-dialouge-scroll";


const AuthorizeExpiration = () => {

    // States
    const [loading, setLoading] = useState(false);
    const [authExpArry, setAuthExpArry] = useState(authExpiration)
    const [isShowItems, setShowItems] = useState(false);
    const [expAuthData, setAuthExpData] = useState([]);
    const [isViewList, setIsViewList] = useState(false);
    const [modelScroll, setScroll] = useModelScroll();

    const label = "Clients by Expiring Authorizations Units"


    /* ============================= useEffect functions ============================= */

    useEffect(() => {
        getAuthExpiring(0, 7, true)
        getAuthExpiring(0, 14, true)
        getAuthExpiring(0, 30, true)
    }, [])


    /* ============================= private functions ============================= */

    const setCount = (id, count) => {
        authExpArry.forEach(element => {
            if (element.id == id) {
                element.count = count
            }
        });
        setAuthExpArry(authExpArry)
    }

    const getAuthExpiring = (value1, value2, value3) => {
        setLoading(true);

        apiHelper.getRequest(API_URLS.GET_AUTH_EXPIRATION + "lastSeenDaysFrom" + "=" + value2 + "&" + "returnTotCountOnly=" + value3)
            .then((result) => {
                setLoading(false);
                setShowItems(true)
                const totalCount = result.resultData.total
                if (value3 == false) {
                    setAuthExpData(result.resultData)
                } else {
                    if (value1 == 0 && value2 == 7) {
                        setCount(1, totalCount)
                    } else if (value1 == 0 && value2 == 14) {
                        setCount(2, totalCount)
                    }
                    else if (value1 == 0 && value2 == 30) {
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
                data={authExpArry}
                isShowItems={isShowItems}
                getAPICall={getAuthExpiring}
                setIsViewList={setIsViewList}
                setScroll={setScroll}
            />

            {
                isViewList &&
                <DialougueAuthExpiration
                    onClose={handleCloseView}
                    data={expAuthData}
                    label={label}
                    setScroll={setScroll}
                />
            }
        </div>
    );
};

export default AuthorizeExpiration;
