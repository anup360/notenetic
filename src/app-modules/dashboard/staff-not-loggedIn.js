/**
 * App.js Layout Start Here
 */
import React, { useEffect, useState } from "react";
import apiHelper from "../../helper/api-helper";
import API_URLS from "../../helper/api-urls";
import ListViewDashboard from "../../control-components/list-view-dashboard/list-view-dashboard";
import DialougueStaffSession from "../../control-components/dialouge-list-view/dialouge-list-view-staff-not-logged";
import daysNotLogged from './not-loggedIn-days.json';
import useModelScroll from "../../cutomHooks/model-dialouge-scroll";


const StaffNotLoggedIn = () => {

    // States
    const [loading, setLoading] = useState(false);
    const [staffLoggedArry, setStaffLoggedArry] = useState(daysNotLogged)
    const [isShowItems, setShowItems] = useState(false);
    const [staffData, setStaffData] = useState([]);
    const [isViewList, setIsViewList] = useState(false);
    const [_,forceUpdate] = useState(0);
    const [modelScroll, setScroll] = useModelScroll();

    const label = "Staff NOT Logged in"


    /* ============================= useEffect functions ============================= */

    useEffect(() => {
        getStaffNotLoggedIn(0, 7, true)
        getStaffNotLoggedIn(0, 14, true)
        getStaffNotLoggedIn(0, 30, true)
        getStaffNotLoggedIn(30, 0, true)
    }, [])


    /* ============================= private functions ============================= */


    const setCount = (id, count) => {
        staffLoggedArry.forEach(element => {
            if (element.id == id) {
                element.count = count
            }
        });
        setStaffLoggedArry(staffLoggedArry)
        forceUpdate(Math.random())
    }


    const getStaffNotLoggedIn = async (value1, value2, value3) => {
        setLoading(true);
      await apiHelper.getRequest(API_URLS.GET_STAFF_NOT_LOGGEDIN + "days" + "=" + value2 + "&" + "returnTotCountOnly" + "=" + value3)
            .then((result) => {
                setLoading(false);
                setShowItems(true)
                const totalCount = result.resultData.count
                if (value3 == false) {
                    setStaffData(result.resultData)
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
                }            })
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
            data={staffLoggedArry}
            isShowItems={isShowItems}
            getAPICall={getStaffNotLoggedIn}
            setIsViewList={setIsViewList}
            setScroll={setScroll}
        />

        {
            isViewList &&
            <DialougueStaffSession
                onClose={handleCloseView}
                data={staffData}
                label={label}
                setScroll={setScroll}
            />
        }
    </div>
    );
};

export default StaffNotLoggedIn;
