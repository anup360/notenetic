
import React, { Component, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import ApiUrls from '../../../../helper/api-urls'

import { NotificationManager } from 'react-notifications';
import ApiHelper from '../../../../helper/api-helper'
import { useLocation } from 'react-router-dom';
import DropDownKendoRct from '../../../../control-components/drop-down/drop-down';
import { useDispatch, useSelector } from 'react-redux';
import MultiSelectDropDown from '../../../../control-components/multi-select-drop-down/multi-select-drop-down';
import { Switch } from "@progress/kendo-react-inputs";
import { ClientService } from '../../../../services/clientService';

import { renderErrors } from "src/helper/error-message-helper";

const AddClientSettings = ({ fields, setFields, errors, handleChange, settingError }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const dispatch = useDispatch();

    const [siteData, setSiteData] = useState([]);
    const [siteLoading, setSiteLoading] = useState(false);
    const clinicId = useSelector(state => state.loggedIn.clinicId);

    useEffect(() => {
        getSites()
    }, [])


    const getSites = async () => {
        setLoading(true)
        await ClientService.getSites(clinicId)
            .then(result => {
                let siteList = result.resultData
                setSiteLoading(false)
                setSiteData(siteList)
            }).catch(error => {
                setSiteLoading(false);
                renderErrors(error.message);
            });
    }

    return (
        <div className="row mx-0">
            <div className="row">
                <div className="mb-3 col-lg-4 col-md-6 col-12 px-0">
                    <div className="multiselect-input">
                        <MultiSelectDropDown
                            label="Assign Site"
                            onChange={handleChange}
                            data={siteData}
                            value={fields.site}
                            textField="siteName"
                            validityStyles={settingError}
                            required={true}
                            name="site"
                            error={!fields.site && errors.site}
                            placeholder="Assign Site"
                        />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="mb-3 col-lg-6 col-md-6 col-12 switch-on">
                    <span className="switch-title-text mr-3"

                    >
                        Go to client profile after adding
                    </span>
                    <Switch onLabel={""} offLabel={""} value={fields.goToProfile} name={"goToProfile"} onChange={handleChange} />
                </div>
            </div>
        </div>


    );
}
export default AddClientSettings;




