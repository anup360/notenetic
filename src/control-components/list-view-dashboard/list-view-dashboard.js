/**
 * App.js Layout Start Here
 */
import React, { useEffect, useState } from "react";
import CustomSkeleton from "../../control-components/skeleton/skeleton";
import useModelScroll from "../../cutomHooks/model-dialouge-scroll";

import {
    ListView,
    ListViewHeader,
    ListViewFooter,
} from "@progress/kendo-react-listview";
// Const Vars

const ListViewDashboard = ({
    label,
    data,
    isShowItems,
    getAPICall,
    setIsViewList,
    setScroll
}) => {
    // States



    const handleView = (item) => {
        setIsViewList(true)
        setScroll(true)
        getAPICall(item?.value1, item?.value2, false)
    }

    /* ============================= event functions ============================= */

    const MyItemRender = (props) => {
        let item = props.dataItem;
        return (
            <div
                className="row p-2 border-bottom align-middle"
                style={{
                    margin: 0,
                }}
            >
                {!isShowItems ? (<CustomSkeleton shape="text" />) : (<div className="col-10">{item.label}</div>)}

                {!isShowItems ? (<CustomSkeleton shape="text" />) : (<div onClick={() => { item.count > 0 && handleView(item) }} className={item.count > 0 ? "col-2 cursor-pointer text-theme" : "col-2"}>{item.count}</div>
                )}
            </div>
        );
    };


    return (
        <>
            <h5>{label}</h5>
            <ListView
                data={data}
                item={MyItemRender}
                style={{
                    width: "100%",
                }}
            />
        </>
    );
};

export default ListViewDashboard;
