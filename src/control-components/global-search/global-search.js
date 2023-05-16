/**
 * App.js Layout Start Here
 */
import React, { Component, useEffect, useState } from 'react';
import { AutoComplete } from "@progress/kendo-react-dropdowns";
import {
    SELECTED_CLIENT_ID,
    IS_GLOBAL_SEARCH,
    REMOVE_CLIENT_FILTER,
} from "../../actions";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import APP_ROUTES from "../../helper/app-routes";
import { ClientService } from "../../services/clientService";
import { STAFF_LOGIN_DETAIL, GET_CLIENT_DETAILS, GET_CLIENT_PROFILE_IMG } from "../../actions";
import { NotificationManager } from "react-notifications";
import { renderErrors } from "src/helper/error-message-helper";

function GlobalSearch({ data, textField, onChange, label, name,
    dataItemKey, validityStyles, required, value, itemRender, filterable, onFilterChange, placeholder, isSelectedDDL, isGlobalSearchReducer,
    setSearchValue
}) {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const selectedClientId = useSelector(state => state.selectedClientId);


    useEffect(() => {

    }, [])

    const getClientDetail = async (element) => {
        await ClientService.getClientDetail(element)
            .then((result) => {
                dispatch({
                    type: GET_CLIENT_DETAILS,
                    payload: result.resultData,
                });
                getClientProfileImg(element);
            })
            .catch((error) => {
                renderErrors(error.message);
            });
    };

    const getClientProfileImg = async (element) => {
        await ClientService.getClientProfileImg(element)
            .then((result) => {
                dispatch({
                    type: GET_CLIENT_PROFILE_IMG,
                    payload: result.resultData,
                });
            })
            .catch((error) => {
                renderErrors(error.message);
            });
    };

    let element;
    if (data.length == 1) {
        for (var i = 0; i < data.length; i++) {
            element = data[i].clientId;
        }
        if (isSelectedDDL) {
            getClientDetail(element)
            dispatch({
                type: SELECTED_CLIENT_ID,
                payload: element,
            });
            dispatch({
                type: IS_GLOBAL_SEARCH,
                payload: true,
            });
        }
    }

    return (
        <AutoComplete
            className='search_input_bar'
            label={label}
            onChange={onChange}
            data={data}
            textField={textField}
            value={value}
            name={name}
            validityStyles={validityStyles}
            required={required}
            dataItemKey={dataItemKey}
            itemRender={itemRender}
            filterable={filterable}
            onFilterChange={onFilterChange}
            dataId={element}
            placeholder={placeholder}
        />
    );
}
export default GlobalSearch;



