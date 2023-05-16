import { DatePicker, TimePicker } from "@progress/kendo-react-dateinputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Editor, EditorTools } from "@progress/kendo-react-editor";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { Checkbox, Input, RadioGroup, TextArea } from "@progress/kendo-react-inputs";
import { Error, Hint } from "@progress/kendo-react-labels";
import React, { useRef } from "react";
import { useEffect } from "react";
import { templateControls } from "./document-template-utility";

export const InputDocumentTemplate = ({
  template,
  classToCheckValueContainer,
  documentFieldsMappings,
  setNewControl,
  controlErrors,
  showValidationError,
  focusEnable,
  setControlErrorList,
}) => {
  const controlList = template?.controlList ?? [];

  const RawHTML = ({ children, className = "" }) => (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: children.replace(/\n/g, "<br />") }}
    />
  );
  let columnCSS
  let renderControlList = []
  let lastControlList = [];
  let lastColumnCSS;
  let lastColumnNumber;
  for (let index = 0; index < controlList.length; index++) {
    const control = controlList[index]
    columnCSS = "1";
    // 3 column layout
    if (
      index + 2 < controlList.length && control.columnNumber == 1
      && controlList[index + 1].columnNumber == 2
      && controlList[index + 2].columnNumber == 3
      ||
      index + 1 < controlList.length && control.columnNumber == 2
      && controlList[index + 1].columnNumber == 3
      ||
      control.columnNumber == 3
    ) {
      columnCSS = "3"
    }

    // 2 column layout
    else if (
      index + 1 < controlList.length && control.columnNumber == 1
      && controlList[index + 1].columnNumber == 2
      ||
      control.columnNumber == 2
    ) {
      columnCSS = "2"
    }

    // Push column controls together with css
    if (lastColumnCSS && (columnCSS != lastColumnCSS || lastColumnCSS == "1" || lastColumnNumber == 3)) {
      renderControlList.push({
        columnCSS: "form-group mb-2 col-sm",
        controlList: lastControlList
      })
      lastControlList = []
    }

    // Collect same column controls
    lastControlList.push(control)
    lastColumnCSS = columnCSS
    lastColumnNumber = control.columnNumber
  }

  // Push last column controls together with css
  renderControlList.push({
    columnCSS: "form-group mb-2 col-sm",
    controlList: lastControlList,
  });

  const itemsRef = useRef([]);

  /* ============================= useEffect ============================= */

  useEffect(() => {
    const handleChange = (_) => {
      setControlErrorList()
    };

    const formEl = document.getElementById("input-document-template-root");
    formEl.addEventListener("change", handleChange);

    return () => {
      formEl.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    if (focusEnable && controlErrors && controlErrors.length > 0) {
      let isFound = false
      let uniqueIndex = 0

      renderControlList.forEach((value, listIndex) => {
        uniqueIndex++

        value.controlList.forEach((control, controlIndex) => {
          uniqueIndex++

          if (!isFound && controlErrors.find(error => error.id == control.id)) {
            isFound = true

            if (itemsRef.current && itemsRef.current[uniqueIndex] && itemsRef.current[uniqueIndex].focus) {
              itemsRef.current[uniqueIndex].focus()
            }
          }
        })
      })
    }
  }, [controlErrors, focusEnable])

  /* ============================= Render View ============================= */

  function renderControlErrorFor(control) {
    if (showValidationError && controlErrors.length > 0) {
      const error = controlErrors.find(error => error.id == control.id)
      if (error) {
        return <Error id={control.id}>{error.msg}</Error>
      }
    }
  }

  function renderHeaderableText(control) {
    if (control.isHeader) {
      let text = control.text;
      text = control.isRequired ? `* ${text}` : text;
      return <h6 className=" mt-2">{text}</h6>;
    }
    return <RawHTML className="">{control.textHtml}</RawHTML>
  }

  function renderHeaderableTitle(control) {
    let text = control.title
    if (control.isHeader && control.isRequired) {
      text = `*${text}`
    }
    if (controlErrors && controlErrors.find(error => error.id == control.id)) {
      return <span>
        <h6 className=" mt-2">{text}</h6>{renderControlErrorFor(control)}
      </span>
    }
    return <h6 className=" mt-2">{text}</h6>
  }

  function renderHint(control) {
    return control.hint && control.hint.length > 0 ? (
      <p className="f-12">({control.hint})</p>
    ) : (
      ""
    );
  }

  function renderParagraph(control) {
    return (
      <span className={columnCSS}>
        {renderHint(control)}
        <RawHTML>{control.textHtml}</RawHTML>
      </span>
    );
  }

  function renderHeading3(control) {
    control.isHeader = true;
    return (
      <span className={columnCSS}>
        {renderHeaderableText(control)}
        {renderHint(control)}
      </span>
    );
  }

  function renderMinMax(control) {
    let minMax = "";
    if (control.minInputChar > 0) {
      minMax = `Min chars: ${control.minInputChar} `;
    }
    if (control.maxInputChar > 0) {
      minMax += `Max chars: ${control.maxInputChar}`;
    }
    return minMax ? <Hint direction={"end"}>{minMax}</Hint> : "";
  }

  function getValueOf(id) {
    if (documentFieldsMappings) {
      const pair = documentFieldsMappings.find((x) => x.keyName == id);
      if (pair) {
        return pair.keyValue;
      }
    }
    return "";
  }

  function renderTextBox(control, uniqueIndex) {
    return (
      <span className={columnCSS}>
        {renderHeaderableTitle(control)}
        {renderHint(control)}
        {renderMinMax(control)}
        <Input
          ref={el => itemsRef.current[uniqueIndex] = el}
          defaultValue={getValueOf(control.id)}
          className={classToCheckValueContainer}
          name={control.id}
        // placeholder={control.title}
        />
      </span>
    );
  }

  const handleTextEditorChange = (props) => {
    setNewControl({
      name: props.target?.props?.name,
      text: props.value.textContent,
      textHtml: props.html,
    });
  };


  function renderTextKendoEditor(control, uniqueIndex) {
    const {
      Bold,
      Italic,
      Underline,
      AlignLeft,
      AlignRight,
      AlignCenter,
      Indent,
      Outdent,
      OrderedList,
      UnorderedList,
      Undo,
      Redo,
      Link,
      Unlink,
    } = EditorTools;
    return (
      <span className={columnCSS}>
        {renderHeaderableTitle(control)}
        {renderHint(control)}
        <Editor
          ref={el => itemsRef.current[uniqueIndex] = el}
          className={classToCheckValueContainer}
          defaultValue={getValueOf(control.id)}
          defaultContent={getValueOf(control.id)}
          //   value={control?.textHtml}
          name={control.id}
          onChange={handleTextEditorChange}
          tools={[
            [Bold, Italic, Underline],
            [Undo, Redo],
            [Link, Unlink],
            [AlignLeft, AlignCenter, AlignRight],
            [OrderedList, UnorderedList, Indent, Outdent],
          ]}
          contentStyle={{
            height: 100,
          }}
          placeholder={"Enter Text here"}
        />
      </span>
    );
  }

  function renderTextArea(control, uniqueIndex) {
    return (
      <span className={columnCSS}>
        {renderHeaderableTitle(control)}
        {renderHint(control)}

        {renderMinMax(control)}
        <TextArea
          ref={el => itemsRef.current[uniqueIndex] = el}
          defaultValue={getValueOf(control.id)}
          className={"contains-value"}
          name={control.id}
          placeholder={control.text}
          rows={5}
        />
      </span>
    );
  }


  function renderRadio(control, uniqueIndex) {
    const data = control.itemList.map((item, index) => {
      return {
        label: item,
        value: index,
      };
    });


    const radioItemIndex = getValueOf(control.id);
    const defaultValue = radioItemIndex ? data[radioItemIndex].value : undefined;
    return (
      <span className={columnCSS}>
        <label className="mb-2">{renderHeaderableTitle(control)}</label>
        {renderHint(control)}
        <div className="row radio-align-cus">
          <RadioGroup
            ref={el => itemsRef.current[uniqueIndex] = el}
            name={`${control.id}`}
            className={classToCheckValueContainer}
            defaultValue={defaultValue}
            data={data}
            layout={"vertical"}
          />
        </div>
      </span>
    );
  }



  function renderCheckbox(control, uniqueIndex) {
    return (
      <div className={columnCSS}>
        {renderHeaderableTitle(control)}
        {renderHint(control)}
        <div className="row">
          {control.itemList.map((item, index) => {
            return (
              <div key={index} className="col-sm-6 mb-1">
                <Checkbox
                  ref={el => itemsRef.current[uniqueIndex] = el}
                  defaultChecked={getValueOf(`${control.id}Checkbox${index}`) != ""}
                  className={classToCheckValueContainer}
                  name={`${control.id}Checkbox${index}`}
                  label={item}
                />
                <br />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function renderDropDown(control, uniqueIndex) {
    return (
      <span className={columnCSS}>
        {renderHeaderableTitle(control)}
        {renderHint(control)}
        {control.itemList.length > 0 && (
          <DropDownList
            ref={el => itemsRef.current[uniqueIndex] = el}
            name={control.id}
            className={classToCheckValueContainer}
            defaultValue={getValueOf(control.id)}
            data={control.itemList}
          />
        )}
      </span>
    );
  }

  function renderSignLine(_) {
    return <div className="border-bottom-line my-3"></div>;
  }

  function renderDatePicker(control, uniqueIndex) {
    let value = getValueOf(control.id);
    value = value ? new Date(value) : undefined;
    return (
      <span className={columnCSS}>
        {renderHeaderableTitle(control)}
        {renderHint(control)}
        <DatePicker
          ref={el => itemsRef.current[uniqueIndex] = el}
          name={control.id}
          defaultValue={value}
          className={classToCheckValueContainer}
          format="MM/dd/yyyy"
        />
      </span>
    );
  }

  function renderTimePicker(control, uniqueIndex) {
    let value = getValueOf(control.id);
    value = value ? new Date(`01/01/1997 ${value}`) : undefined;
    return (
      <span className={columnCSS}>
        {renderHeaderableTitle(control)}
        {renderHint(control)}
        <TimePicker
          ref={el => itemsRef.current[uniqueIndex] = el}
          name={control.id}
          defaultValue={value}
          className={classToCheckValueContainer}
          format="hh:mm a"
        />
      </span>
    );
  }

  function renderTable(control) {
    return (
      <span className={columnCSS}>
        {renderHeaderableTitle(control)}
        {renderHint(control)}
        {control.itemList.length > 0 && (
          <div className="grid-table">
            <Grid rows={control.rows}>
              {control.itemList.map((item) => (
                <GridColumn title={item}></GridColumn>
              ))}
            </Grid>
          </div>
        )}
      </span>
    );
  }

  function renderControl(control, uniqueIndex) {
    switch (control.type) {
      case templateControls.paragraph:
        return renderParagraph(control);
      case templateControls.textBox:
        return renderTextBox(control, uniqueIndex);
      case templateControls.textArea:
        return renderTextArea(control, uniqueIndex);
      case templateControls.radio:
        return renderRadio(control, uniqueIndex);
      case templateControls.checkbox:
        return renderCheckbox(control, uniqueIndex);
      case templateControls.dropDown:
        return renderDropDown(control, uniqueIndex);
      case templateControls.signLine:
        return renderSignLine(control);
      case templateControls.datePicker:
        return renderDatePicker(control, uniqueIndex);
      case templateControls.timePicker:
        return renderTimePicker(control, uniqueIndex);
      case templateControls.table:
        return renderTable(control);
      case templateControls.heading3:
        return renderHeading3(control);
      case templateControls.textEditor:
        return renderTextKendoEditor(control, uniqueIndex);
    }
    return <></>;
  }

  function handleRenderControlList() {
    let uniqueIndex = 0
    return renderControlList.map((obj) => {
      uniqueIndex++
      columnCSS = obj.columnCSS;

      return <div key={uniqueIndex} className="row">
        {obj.controlList.length > 0 && obj.controlList.map((control) => {
          uniqueIndex++

          return <div key={uniqueIndex}>
            {renderControl(control, uniqueIndex)}
          </div>
        })}
      </div>
    })
  }

  // Render all now
  return (
    <div id="input-document-template-root" className="col-md-12 input-document-template mt-2">
      <hr />
      {handleRenderControlList()}
    </div>
  );
};
