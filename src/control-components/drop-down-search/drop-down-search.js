/**
 * App.js Layout Start Here
 */
import React, { Component, useEffect, useState } from "react";
import { Error } from "@progress/kendo-react-labels";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { filterBy } from "@progress/kendo-data-query";

function DropDownSearch({
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
  filterChange
}) {
    return (
    <div>
      <DropDownList
        data={data}
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
      />
      {error && <Error>{error}</Error>}
    </div>
  );
}
export default DropDownSearch;
