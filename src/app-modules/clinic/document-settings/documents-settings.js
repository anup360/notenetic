/**
 * App.js Layout Start Here
 */
import React, { Component, useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import CustomDrawer from '../../../control-components/custom-drawer/custom-drawer'
import Loader from "../../../control-components/loader/loader";
import { TabStrip, TabStripTab } from "@progress/kendo-react-layout";
import GeneralSettings from './general-settings';
import ServiceHeader from './service-header';
import { renderErrors } from "src/helper/error-message-helper";

const DocumentSettings = () => {

    const [loading, setLoading] = useState(false);
    const clinicId = useSelector((state) => state.loggedIn.clinicId);
    const [selected, setSelected] = React.useState(0);

    useEffect(() => {

    }, [])


    const handleSelect = (e) => {
        setSelected(e.selected);
    };


    return (
        <div className="d-flex flex-wrap">
            <div className="inner-dt col-md-3 col-lg-2">
                <CustomDrawer />
            </div>
            <div className="col-md-9 col-lg-10">
                <h4 className="address-title text-grey">
                    <span className="f-24">Document Settings</span>
                </h4>
                <div className="grid-table  filter-grid">
                    <div className=" mt-3">
                        <div className="inner-section-edit position-relative text-center tabs-kendoselect">
                            <TabStrip className="setting-tabs-staff" selected={selected} onSelect={handleSelect}>
                                <TabStripTab title="General Settings">
                                    <div className="d-flex flex-wrap ">
                                        <GeneralSettings />
                                    </div>
                                </TabStripTab>
                                <TabStripTab title="Place of Service">
                                    <ServiceHeader />

                                </TabStripTab>
                            </TabStrip>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}
export default DocumentSettings;



