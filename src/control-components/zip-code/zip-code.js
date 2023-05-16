
/**
 * App.js Layout Start Here
 */
import React, { Component, useEffect, useState } from 'react';
import { Error } from '@progress/kendo-react-labels';
import { MaskedTextBox } from "@progress/kendo-react-inputs";
import { MaskFormatted } from '../../helper/mask-helper'


function ZipCode({ name, value, onChange, label, error, placeholder, validityStyles, required
}) {


    let mask = '99999'
    let maskedValue = MaskFormatted(value, mask)


    return (
        <div >

            <MaskedTextBox
                name={name}
                defaultValue={maskedValue}
                onChange={onChange}
                label={label}
                placeholder={placeholder}
                validityStyles={validityStyles}
                required={required}
                mask={mask}
                includeLiterals={false}
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
export default ZipCode;





