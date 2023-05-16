/**
 * App.js Layout Start Here
 */
import React, { Component, useEffect, useState } from "react";
import { Error } from "@progress/kendo-react-labels";
import { ComboBox } from "@progress/kendo-react-dropdowns";
import { filterBy } from "@progress/kendo-data-query";

function DropDownKendoRct({
  data,
  textField,
  onChange,
  error,
  name,
  value,
  label,
  validityStyles,
  required,
  dataItemKey,
  defaultValue,
  disabled,
  suggest,
  placeholder,
  itemRender,
  valueRender,
  autoClose,
}) {
  const [listData, setListData] = React.useState(data.slice());

  const filterData = (filter) => {
    const newData = data.slice();
    return filterBy(newData, filter);
  };

  const filterChange = (event) => {
    setListData(filterData(event.filter));
  };

  return (
    <div>
      <ComboBox
        data={listData.length > 0 ? listData : data}
        onChange={onChange}
        textField={textField}
        name={name}
        value={value}
        label={label}
        dataItemKey={dataItemKey}
        validityStyles={validityStyles}
        required={required}
        defaultValue={defaultValue}
        filterable={true}
        onFilterChange={filterChange}
        disabled={disabled}
        suggest={suggest}
        itemRender={itemRender}
        placeholder={placeholder}
        valueRender={valueRender}
        autoClose={true}
      />
      {error && <Error>{error}</Error>}
    </div>
  );
}
export default DropDownKendoRct;
