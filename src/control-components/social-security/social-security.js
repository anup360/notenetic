/**
 * App.js Layout Start Here
 */
import React, { Component, useEffect, useState } from "react";
import { Error } from "@progress/kendo-react-labels";
import { MaskedTextBox } from "@progress/kendo-react-inputs";
import { MaskFormatted } from "../../helper/mask-helper";

function SocialSecurity({
  name,
  value,
  onChange,
  label,
  error,
  placeholder,
  required,
  validityStyles,
  valid,
}) {
  let mask = "999 99-9999";
  let maskedValue = MaskFormatted(value, mask);

  return (
    <div>
      <MaskedTextBox
        width="100%"
        name={name}
        onChange={onChange}
        label={label}
        placeholder={placeholder}
        defaultValue={maskedValue}
        mask={mask}
        validityStyles={validityStyles}
        required={required}
        valid={valid}
      />

      {error && <Error>{error}</Error>}
    </div>
  );
}
export default SocialSecurity;
