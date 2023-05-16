/**
 * App.js Layout Start Here
 */
import React, { useEffect, useState } from "react";
import apiHelper from "../../helper/api-helper";
import API_URLS from "../../helper/api-urls";
import ListViewDashboard from "../../control-components/list-view-dashboard/list-view-dashboard";
import DialougeClientInsurance from "../../control-components/dialouge-list-view/dialouge-list-view-client-insurance";
import useModelScroll from "../../cutomHooks/model-dialouge-scroll";


const ClientByInsurance = () => {

    // States
    const [loading, setLoading] = useState(false);
    const [isShowItems, setShowItems] = useState(false);
    const [insuranceArry, setInsuranceArry] = useState([]);
    const [insuranceData, setInsuranceData] = useState([]);
    const [modelScroll, setScroll] = useModelScroll();

    const [isViewList, setIsViewList] = useState(false);

    const label = "Clients by Payer"


    /* ============================= useEffect functions ============================= */

    useEffect(() => {
        getClientInsurance(null, 0, true)
      
    }, [])


    /* ============================= private functions ============================= */

    
  
 
    const getClientInsurance = (value1, insuranceId, value) => {
        setLoading(true);
        apiHelper
            .getRequest(API_URLS.GET_CLIENT_BY_INSURANCE + "insuranceId" + "=" + insuranceId + "&" + "returnTotCountOnly" + "=" + value)
            .then((result) => {
                setLoading(false);
                setShowItems(true)
                if (value == true) {
                    const list = result.resultData.map((r) => {
                        return { label: r.insuranceName, count: r.totCount,
                            value2 : r.insuranceId
                        }
                    })
                    setInsuranceArry(list)
                } else{
                    setInsuranceData(result.resultData)
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
                data={insuranceArry}
                isShowItems={isShowItems}
                getAPICall={getClientInsurance}
                setIsViewList={setIsViewList}
                setScroll={setScroll}
            />

            {
                isViewList &&
                <DialougeClientInsurance
                    onClose={handleCloseView}
                    data={insuranceData}
                    label={label}
                    setScroll={setScroll}
                />
            }
        </div>
    );
};

export default ClientByInsurance;
