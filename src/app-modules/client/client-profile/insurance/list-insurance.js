/**
 * App.js Layout Start Here
 */
import React, { Component, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ThreeDots } from 'react-loader-spinner';
import { NotificationManager } from 'react-notifications';
import ApiUrls from '../../../../helper/api-urls'
import AppRoutes from '../../../../helper/app-routes'
import ApiHelper from '../../../../helper/api-helper'
import { ClientService } from '../../../../services/clientService';
import { permissionEnum } from "../../../../helper/permission-helper";
import { useSelector } from "react-redux";
import { renderErrors } from "src/helper/error-message-helper";


const InsuranceList = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [insuranceData, setInsuranceData] = useState([]);
    const userAccessPermission = useSelector((state) => state.userAccessPermission);

    useEffect(() => {
        getInsuranceList()
    }, [])


    const getInsuranceList = async () => {
        setLoading(true)
        await ClientService.getInsuranceList()
            .then(result => {
                setInsuranceData(result.resultData)
                setLoading(false)
            }).catch(error => {
                setLoading(false)
                renderErrors(error.message);
            });
    }

    const editInsurance = (obj) => {
        navigate(AppRoutes.EDIT_INSURANCE + obj.id, { state: { insuranceObj: obj } });
    }


    const deleteInsurance = (obj) => {
        setLoading(true)
        var data = { "id": obj.id };
        ApiHelper.deleteRequest(ApiUrls.DELETE_INSURANCE, data)
            .then(result => {
                setLoading(false)
                NotificationManager.success(result.message);
                getInsuranceList()
            }).catch(error => {
                setLoading(false)
                renderErrors(error.message);
            })
    }

    return (
        <div>
            {
                loading ?
                    <ThreeDots color="#2BAD60" height="60" width="60" /> :
                    <div>
                        {
                            insuranceData.map((obj, key) => (
                                <div key={key}>
                                    <li >{obj.firstName}</li>
                                    <h6 onClick={() => deleteInsurance(obj)} >delete</h6>
                                    <h6 onClick={() => editInsurance(obj)} >Edit Staff</h6>

                                </div>
                            ))
                        }
                    </div>
            }
        </div>
    );

}
export default InsuranceList;



