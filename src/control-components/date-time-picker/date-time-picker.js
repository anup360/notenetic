/**
 * App.js Layout Start Here
 */
import React, { Component, useEffect, useState } from "react";
import { Error } from "@progress/kendo-react-labels";
import { DateTimePicker } from "@progress/kendo-react-dateinputs";

function DateTimePickerKendoRct({
  format,
  label,
  placeholder,
  fillMode,
  onChange,
  size,
  error,
  name,
  title,
  weekNumber,
  dateValue,
}) {
  return (
    <div>
      <label className="k-label">{label}</label>
      <DateTimePicker
        onChange={onChange}
        format={format}
        placeholder={placeholder}
        name={name}
        fillMode={fillMode}
        size={size}
        title={title}
        weekNumber={weekNumber}
        value={dateValue}
      />
      {error && <Error>{error}</Error>}
    </div>
  );
}
export default DateTimePickerKendoRct;
