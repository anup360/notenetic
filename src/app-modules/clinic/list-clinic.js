/**
 * App.js Layout Start Here
 */
import React, { Component, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ThreeDots } from 'react-loader-spinner';
import { NotificationManager } from 'react-notifications';
import ApiUrls from '../../helper/api-urls'
import AppRoutes from '../../helper/app-routes'
import ApiHelper from '../../helper/api-helper'
import { CLIENT_ID } from "../../actions";
import { useSelector, useDispatch } from "react-redux";
import { renderErrors } from "src/helper/error-message-helper";

const ClinicList = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [providerData, setProviderData] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        getProviders()
    }, [])

    const getProviders = () => {
        setLoading(true)
        ApiHelper.getRequest(ApiUrls.GET_PROVIDER_LIST, '')
            .then(result => {
                setProviderData(result.resultData)
                setLoading(false)
            }).catch(error => {
                setLoading(false)
                renderErrors(error.message);
            })
    }

    const editProvider = (obj) => {
        navigate(AppRoutes.EDIT_PROVIDER + obj.id, { state: { id: obj.id } });
    }

    const addProviderLocation = (obj) => {
        dispatch({
            type: CLIENT_ID,
            payload: obj.id
        });
        navigate(AppRoutes.ADD_PROVIDER_LOCATION);

    }
    const deleteProvider = (obj) => {
        setLoading(true)
        var data = { "id": obj.id };
        ApiHelper.deleteRequest(ApiUrls.DELETE_PROVIDER, data)
            .then(result => {
                setLoading(false)
                NotificationManager.success(result.message);
                getProviders()
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
                            providerData.map((obj, key) => (
                                <div key={key}>
                                    <li >{obj.companyName}</li>
                                    <h6 onClick={() => deleteProvider(obj)} >delete</h6>
                                    <h6 onClick={() => editProvider(obj)} >Edit Provider</h6>
                                    <h6 onClick={() => addProviderLocation(obj)} >Add Location</h6>

                                </div>
                            ))
                        }
                    </div>
            }
        </div>
    );

}
export default ClinicList;



