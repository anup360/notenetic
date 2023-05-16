import * as React from "react";
import * as ReactDOM from "react-dom";
import { Hint } from "@progress/kendo-react-labels";
import { TextArea } from "@progress/kendo-react-inputs";
import { Error } from '@progress/kendo-react-labels';

function TextAreaKendo({
  name,
  txtValue,
  onChange,
  label,
  maxLength,
  rows,
  column,
  required,
  error,
  valid,
  title,
  defaultValue,
  placeholder,
  ...others
}) {

  return (
    <div
    >
      <label className={error ? "k-label red-label" : "k-label"} >{label}</label>
      <TextArea
        name={name}
        maxLength={maxLength}
        value={txtValue}
        onChange={onChange}
        label={label}
        title={title}
        rows={rows}
        cols={column}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
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

export default TextAreaKendo;
