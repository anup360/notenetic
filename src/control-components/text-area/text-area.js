import * as React from "react";
import * as ReactDOM from "react-dom";
import { Hint } from "@progress/kendo-react-labels";
import { TextArea } from "@progress/kendo-react-inputs";
import { Error } from '@progress/kendo-react-labels';

function TextAreaKendoRct({
  name,
  txtValue,
  onChange,
  label,
  maxLength,
  rows,
  column,
  required,
  error,
}) {
  return (
    <div

    >
      <label className="k-label">{label}</label>
      <TextArea
        name={name}
        maxLength={maxLength}
        value={txtValue}
        onChange={onChange}
        rows={rows}
        cols={column}
        required={required}

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

export default TextAreaKendoRct;
