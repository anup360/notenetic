/**
 * App.js Layout Start Here
 */
import React, { Component, useEffect } from 'react';
import { useNavigate } from 'react-router';
import DEVELOPMENT_CONFIG from '../helper/config'


function Protected(props) {
    const { Component } = props;
    const navigate = useNavigate();

    useEffect(() => {
        let token = localStorage.getItem(DEVELOPMENT_CONFIG.TOKEN);
        if (!token) {
            navigate('/logIn')
        }
    }, [])

    return (
        <div>
            <Component />
        </div>
    );
}


export default Protected;



