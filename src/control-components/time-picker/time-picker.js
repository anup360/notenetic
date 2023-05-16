import React, { Component, useEffect, useState } from "react";
import { Error } from "@progress/kendo-react-labels";
import { TimePicker } from "@progress/kendo-react-dateinputs";

function TimePickerKendoRct({
  onChange,
  error,
  name,
  title,
  value,
  required,
  validityStyles,
  label,
  placeholder,
  min,
  disabled,
  max,
  steps={minute: 15},
  show
   
}) {
  return (
    <div>
      <TimePicker
      className="icontimer"
        onChange={onChange}
        value={value}
        name={name}
        size={"medium"}
        title={title}
        required={required}
        validityStyles={validityStyles}
        min={min}
        max={max}
        label={label}
        placeholder={placeholder}
        steps={steps}
        disabled={disabled}
        show={show}
      />
      {error && <Error>{error}</Error>}
    </div>
  );
}
export default TimePickerKendoRct; 