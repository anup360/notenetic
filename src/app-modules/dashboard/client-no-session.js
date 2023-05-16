/**
 * App.js Layout Start Here
 */
import React, { useEffect, useState } from "react";
import apiHelper from "../../helper/api-helper";
import API_URLS from "../../helper/api-urls";
import ListViewDashboard from "../../control-components/list-view-dashboard/list-view-dashboard";
import DialougueClientSession from "../../control-components/dialouge-list-view/dialouge-list-view-client-session";
import days from './days.json';
import useModelScroll from "../../cutomHooks/model-dialouge-scroll";


const ClientNoSession = () => {

    // States
    const [loading, setLoading] = useState(false);
    const [clientSessionArry, setClientSessionArry] = useState(days)
    const [isShowItems, setShowItems] = useState(false);
    const [clientsData, setClientsData] = useState([]);
    const [isViewList, setIsViewList] = useState(false);
    const [modelScroll, setScroll] = useModelScroll();

    const label = "Clients with No Sessions"


    /* ============================= useEffect functions ============================= */

    useEffect(() => {
        getClientSession(0, 7, true)
        getClientSession(0, 14, true)
        getClientSession(0, 30, true)
        getClientSession(30, 0, true)
    }, [])

 

    /* ============================= private functions ============================= */

    const setCount = (id, count) => {
        clientSessionArry.forEach(element => {
            if (element.id == id) {
                element.count = count
            }
        });
        setClientSessionArry(clientSessionArry)
    }

    const getClientSession = (value1, value2, value3) => {
        setLoading(true);
        apiHelper
            .getRequest(API_URLS.GET_NO_SESSION_CLIENTS + "lastSeenDaysFrom" + "=" + value1 + "&" +
                "lastSeenDaysTo" + "=" + value2 + "&" + "returnTotCountOnly=" + value3)
            .then((result) => {
                setLoading(false);
                setShowItems(true)
                const totalCount = result.resultData.total
                if (value3 == false) {
                    setClientsData(result.resultData)
                } else {
                    if (value1 == 0 && value2 == 7) {
                        setCount(1, totalCount)
                    } else if (value1 == 0 && value2 == 14) {
                        setCount(2, totalCount)
                    }
                    else if (value1 == 0 && value2 == 30) {
                        setCount(3, totalCount)
                    }
                    else if (value1 == 30 && value2 == 0) {
                        setCount(4, totalCount)
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
                data={clientSessionArry}
                isShowItems={isShowItems}
                getAPICall={getClientSession}
                setIsViewList={setIsViewList}
                setScroll={setScroll}
            />

            {
                isViewList &&
                <DialougueClientSession
                    onClose={handleCloseView}
                    data={clientsData}
                    label={label}
                    setScroll={setScroll}
                />
            }
        </div>
    );
};

export default ClientNoSession;
