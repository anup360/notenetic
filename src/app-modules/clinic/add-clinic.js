/**
 * App.js Layout Start Here
 */
import React, { Component, useEffect, useState } from 'react';
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { useNavigate } from 'react-router';
import { Button } from "@progress/kendo-react-buttons";
import { Form, Field, FormElement } from '@progress/kendo-react-form';
import { Error } from '@progress/kendo-react-labels';
import { Input } from '@progress/kendo-react-inputs';
import { ThreeDots } from 'react-loader-spinner';
import { NotificationManager } from 'react-notifications';
import { useLocation } from 'react-router-dom';
import ApiUrls from '../../helper/api-urls'
import ApiHelper from '../../helper/api-helper'
import ErrorHelper from '../../helper/error-helper'
import InputKendoRct from '../../control-components/input/input';

import { renderErrors } from "src/helper/error-message-helper";

const AddClinic = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [errors, setErrors] = useState("");
    const [loading, setLoading] = useState(false);
    const [fields, setFields] = useState({
        companyName: "",
        address: "",
        state: "",
        city: "",
        zipCode: "",
        phone: "",
        fax: "",
        email: "",
    })

    useEffect(() => {
        if (location.state !== null) {
            let providerId = location.state.id
            getProviderDetail(providerId)
        }
    }, [])


    const handleSubmit = (event) => {
        if (handleValidation()) {
            if (location.state !== null) {
                let providerId = location.state.id
                updateProvider(providerId)
            } else {
                addProvider()
            }
        }
    }

    const addProvider = () => {
        setLoading(true)
        var data = {
            "companyName": fields.companyName,
            "address": fields.address,
            "stateId": 1,
            "city": fields.city,
            "zip": fields.zipCode,
            "phone": fields.phone,
            "fax": fields.fax,
            "email": fields.email,
        };
        ApiHelper.postRequest(ApiUrls.CREATE_PROVIDER, data)
            .then(result => {
                setLoading(false)
                NotificationManager.success(result.message);
                setFields({
                    ...fields,
                    companyName: "",
                    address: "",
                    state: "",
                    city: "",
                    zipCode: "",
                    phone: "",
                    fax: "",
                    email: "",
                })
            }).catch(error => {
                setLoading(false)
                renderErrors(error.message);
            })
    }

    const updateProvider = (providerId) => {
        setLoading(true)
        var data = {
            "id": providerId,
            "companyName": fields.companyName,
            "address": fields.address,
            "stateId": 1,
            "city": fields.city,
            "zip": fields.zipCode,
            "phone": fields.phone,
            "fax": fields.fax,
            "email": fields.email,
        };
        ApiHelper.putRequest(ApiUrls.UPDATE_PROVIDER, data)
            .then(result => {
                setLoading(false)
                NotificationManager.success(result.message);
            }).catch(error => {
                setLoading(false)
                renderErrors(error.message);
            })
    }

    const getProviderDetail = (providerId) => {
        setLoading(true)
        ApiHelper.getRequest(ApiUrls.GET_PROVIDER_BY_ID + providerId, '')
            .then(result => {
                let providerDetail = result.resultData
                setLoading(false)
                setFields({
                    ...fields,
                    companyName: providerDetail.companyName,
                    email: providerDetail.email,
                    address: providerDetail.address,
                    state: providerDetail.stateId,
                    city: providerDetail.city,
                    zipCode: providerDetail.zip,
                    phone: providerDetail.phone,
                    fax: providerDetail.fax
                })
            }).catch(error => {
                setLoading(false)
                renderErrors(error.message);
            })
    }

    const handleChange = e => {
        const name = e.target.name;
        const value = e.target.value;
        setFields({
            ...fields,
            [name]: value
        })
    }

    const handleValidation = () => {
        let errors = {};
        let formIsValid = true;
        var emailPattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        var pattern = new RegExp(/^[0-9\b]+$/);
        if (!fields.companyName || fields.companyName.trim().length === 0) {
            formIsValid = false;
            errors["companyName"] = ErrorHelper.FIELD_BLANK
        }
        if (!fields.address || fields.address.trim().length === 0) {
            formIsValid = false;
            errors["address"] = ErrorHelper.FIELD_BLANK
        }
        if (!fields.state || fields.state.trim().length === 0) {
            formIsValid = false;
            errors["state"] = ErrorHelper.FIELD_BLANK
        }
        if (!fields.city || fields.city.trim().length === 0) {
            formIsValid = false;
            errors["city"] = ErrorHelper.FIELD_BLANK
        }
        if (!fields.zipCode || fields.zipCode.trim().length === 0) {
            formIsValid = false;
            errors["zipCode"] = ErrorHelper.FIELD_BLANK
        }
        if (!fields.phone || fields.phone.trim().length === 0) {
            formIsValid = false;
            errors["phone"] = ErrorHelper.FIELD_BLANK
        } else if (!pattern.test(fields.phone)) {
            formIsValid = false;
            errors["phone"] = ErrorHelper.NUMBER_ONLY
        }
        if (!fields.fax || fields.fax.trim().length === 0) {
            formIsValid = false;
            errors["fax"] = ErrorHelper.FIELD_BLANK
        }
        if (!fields.email || fields.email.trim().length === 0) {
            formIsValid = false;
            errors["email"] = ErrorHelper.FIELD_BLANK
        } else if (!emailPattern.test(fields.email)) {
            formIsValid = false;
            errors["email"] = ErrorHelper.INVALID_EMAIL
        }
        setErrors(errors)
        return formIsValid;
    }
    return (
        <div>
            <div className="mb-3">
                <InputKendoRct
                    validityStyles={false}
                    value={fields.companyName}
                    onChange={handleChange}
                    name="companyName"
                    label="Company Name"
                    error={errors.companyName && errors.companyName}
                />
            </div>
            <div className="mb-3">
                <InputKendoRct
                    validityStyles={false}
                    value={fields.address}
                    onChange={handleChange}
                    name="address"
                    label="Address"
                    error={errors.address && errors.address}
                />
            </div>
            <div className="mb-3">
                <InputKendoRct
                    validityStyles={false}
                    value={fields.state}
                    onChange={handleChange}
                    name="state"
                    label="State"
                    error={errors.state && errors.state}
                />
            </div>
            <div className="mb-3">
                <InputKendoRct
                    validityStyles={false}
                    value={fields.city}
                    onChange={handleChange}
                    name="city"
                    label="City"
                    error={errors.city && errors.city}
                />
            </div>
            <div className="mb-3">
                <InputKendoRct
                    validityStyles={false}
                    value={fields.zipCode}
                    onChange={handleChange}
                    name="zipCode"
                    label="Zip"
                    error={errors.zipCode && errors.zipCode}
                />
            </div>
            <div className="mb-3">
                <InputKendoRct
                    validityStyles={false}
                    value={fields.phone}
                    type="number"
                    onChange={handleChange}
                    name="phone"
                    label="Phone"
                    error={errors.phone && errors.phone}
                />
            </div>
            <div className="mb-3">
                <InputKendoRct
                    validityStyles={false}
                    value={fields.fax}
                    onChange={handleChange}
                    name="fax"
                    label="Fax"
                    error={errors.fax && errors.fax}
                />
            </div>
            <div className="mb-3">
                <InputKendoRct
                    validityStyles={false}
                    value={fields.email}
                    onChange={handleChange}
                    name="email"
                    label="Email"
                    error={errors.email && errors.email}
                />
            </div>
            <button onClick={handleSubmit}>
                {location.state ? "Update Provider" : "Add Provider"}
            </button>
            {
                loading &&
                <ThreeDots color="#2BAD60" height="60" width="60" />
            }
        </div>
    );
}
export default AddClinic;



