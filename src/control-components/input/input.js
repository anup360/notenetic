/**
 * App.js Layout Start Here
 */
import React, { Component, useEffect, useState } from "react";
import { Error } from "@progress/kendo-react-labels";
import { Input } from "@progress/kendo-react-inputs";
function InputKendoRct({
  validityStyles,
  name,
  value,
  onChange,
  label,
  error,
  minLength,
  required,
  maxLength,
  type,
  disabled,
  focusout,
  placeholder,
  pattern,
  width,
  min,
}) {
  return (
    <div>
      <Input
        style={{ width: width }}
        validityStyles={validityStyles}
        name={name}
        value={value}
        onChange={onChange}
        label={label}
        maxLength={maxLength}
        type={type}
        disabled={disabled}
        minLength={minLength}
        focusout={focusout}
        required={required}
        placeholder={placeholder}
        pattern={pattern}
        width={width}
        min={min}
      />
      {error && <Error>{error}</Error>}
    </div>
  );
}
export default InputKendoRct;
