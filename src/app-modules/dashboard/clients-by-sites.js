/**
 * App.js Layout Start Here
 */
import React, { useEffect, useState } from "react";
import apiHelper from "../../helper/api-helper";
import API_URLS from "../../helper/api-urls";
import ListViewDashboard from "../../control-components/list-view-dashboard/list-view-dashboard";
import DialougeClientSites from "../../control-components/dialouge-list-view/dialouge-list-view-client-sites";
import useModelScroll from "../../cutomHooks/model-dialouge-scroll";


const ClientNoSession = () => {

    // States
    const [loading, setLoading] = useState(false);
    const [isShowItems, setShowItems] = useState(false);
    const [clientSitesArry, setClientSiteArry] = useState([]);
    const [siteData, setSiteData] = useState([]);

    const [isViewList, setIsViewList] = useState(false);
    const [modelScroll, setScroll] = useModelScroll();

    const label = "Clients by Sites"


    /* ============================= useEffect functions ============================= */

    useEffect(() => {
        getClientSites(0, 0, true)

    }, [])


    /* ============================= private functions ============================= */

    const getClientSites = (value1, siteId, value) => {
        setLoading(true);
        apiHelper
            .getRequest(API_URLS.GET_CLIENT_BY_SITE + "siteId" + "=" + siteId + "&" + "returnTotCountOnly" + "=" + value)
            .then((result) => {
                setLoading(false);
                setShowItems(true)
                if (value == true) {
                    const list = result.resultData.map((r) => {
                        return { label: r.siteName, count: r.totCount ,
                        value2 : r.siteId
                        }
                    })
                    setClientSiteArry(list)
                }else{
                    setSiteData(result.resultData)
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
        <div className="grid-table filter-grid dash-filter-grid my-3 clientsites-cus">
            <ListViewDashboard
                label={label}
                data={clientSitesArry}
                isShowItems={isShowItems}
                getAPICall={getClientSites}
                setIsViewList={setIsViewList}
                setScroll={setScroll}
            />

            {
                isViewList &&
                <DialougeClientSites
                    onClose={handleCloseView}
                    data={siteData}
                    label={label}
                    setScroll={setScroll}
                />
            }
        </div>
    );
};

export default ClientNoSession;
