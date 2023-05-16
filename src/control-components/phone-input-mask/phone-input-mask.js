import React from "react";
import { Error } from "@progress/kendo-react-labels";
import { MaskedTextBox } from "@progress/kendo-react-inputs";
import { MaskFormatted } from "../../helper/mask-helper";

function PhoneInput({
  name,
  value,
  onChange,
  label,
  error,
  placeholder,
  validityStyles,
  required,
  maskValidation,
}) {
  let mask = "(999) 000-0000";
  let maskedValue = MaskFormatted(value, mask);

  const handleKeyDown = (e) => {
    if (e.key === " ") {
      e.preventDefault();
    }
  };

  return (
    <div>
      <MaskedTextBox
        width="100%"
        mask={mask}
        name={name}
        defaultValue={maskedValue}
        onChange={onChange}
        label={label}
        placeholder={placeholder}
        validityStyles={validityStyles}
        required={required}
        onKeyPress={handleKeyDown}
        maskValidation={maskValidation}
      />
      {error && <Error>{error}</Error>}
    </div>
  );
}
export default PhoneInput;
