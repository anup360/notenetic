/**
 * App.js Layout Start Here
 */
import React, { Component, useEffect, useState } from 'react';
import { Error } from '@progress/kendo-react-labels';
import { Input } from '@progress/kendo-react-inputs';
import InputMask from 'react-input-mask';


function SignPin({ name, value, onChange, label, error, placeholder,type,disabled
}) {


    return (
        <div >
            <InputMask
                className="k-input k-input-md k-rounded-md k-input-solid"
                onChange={onChange}
                name={name}
                label={label}
                placeholder={placeholder}
                value={value}
                type={type==="password" ? "password" : "text"}
                mask="9999"
                maskChar={null}
                disabled={disabled}
                
                />
            {
                error &&
                <Error >
                    {error}
                </Error>
            }
        </div>


    );

}
export default SignPin;



