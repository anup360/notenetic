/**
 * App.js Layout Start Here
 */
import React, { Component, useEffect, useState } from "react";
import { Error } from "@progress/kendo-react-labels";
import { DatePicker } from "@progress/kendo-react-dateinputs";

function DatePickerKendoRct({
  onChange,
  error,
  name,
  title,
  value,
  required,
  validityStyles,
  label,
  placeholder,
  max,
  min,
  disabled,
}) {
  return (
    <div>
      <DatePicker
        onChange={onChange}
        format={"MM/dd/yyyy"}
        value={value !== "" ? value : null}
        name={name}
        size={"medium"}
        title={title}
        required={required}
        validityStyles={validityStyles}
        max={max}
        label={label}
        placeholder={placeholder}
        min={min}
        disabled={disabled}
      />
      {error && <Error>{error}</Error>}
    </div>
  );
}
export default DatePickerKendoRct;
