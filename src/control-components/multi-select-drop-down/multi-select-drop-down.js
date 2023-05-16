/**
 * App.js Layout Start Here
 */
import React, { Component, useEffect, useState } from 'react';
import { Error } from '@progress/kendo-react-labels';
import { MultiSelect } from '@progress/kendo-react-dropdowns';
import { filterBy } from "@progress/kendo-data-query";


function MultiSelectDropDown({ data, textField, onChange, label, error, name,
    dataItemKey, validityStyles, required, value, itemRender, placeholder,disabled
}) {

    const [filter, setFilter] = useState(data.slice());

    const onFilterChange = (event) => {
        setFilter(filterBy(data.slice(), event.filter))
    }


    return (
        <div>
            <MultiSelect
                label={label}
                onChange={onChange}
                data={filter.length > 0 ? filter : data}
                textField={textField}
                value={value}
                name={name}
                validityStyles={validityStyles}
                required={required}
                dataItemKey={dataItemKey}
                itemRender={itemRender}
                filterable={true}
                onFilterChange={onFilterChange}
                placeholder={placeholder}
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
export default MultiSelectDropDown;



