import { DatePicker, TimePicker } from "@progress/kendo-react-dateinputs";
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { Checkbox, Input, RadioGroup, TextArea } from "@progress/kendo-react-inputs";
import { Hint } from "@progress/kendo-react-labels";
import React, { forwardRef } from 'react';
import { templateControls } from './document-template-utility';
import { Editor, EditorTools } from "@progress/kendo-react-editor";

export const PreviewDocumentTemplate = forwardRef(({
    templateName, controlList, documentFieldsMappings, oldDocumentFieldsMappings,
    changedDocumentFieldKeyNames, disabled, isViewMode
}, ref) => {
    const editor = React.createRef();

    const RawHTML = ({ children, className = "" }) =>
        <div className={className}
            dangerouslySetInnerHTML={{ __html: children.replace(/\n/g, '<br />') }} />

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
        controlList: lastControlList
    })

    /* ============================= Render View ============================= */

    function renderHeader(control, isTitle) {

        let text = isTitle ? control.title : control.text
        text = control.isRequired ? `* ${text}` : text
        return (

            <h6 className="mb-0">
                {text}
            </h6>

        )
    }

    function getValueOf(id) {
        if (documentFieldsMappings) {
            const pair = documentFieldsMappings.find(x => x.keyName == id)
            if (pair) {
                return pair.keyValue
            }
        }
        return ""
    }

    function getOldValueOf(id) {
        if (oldDocumentFieldsMappings) {
            const pair = oldDocumentFieldsMappings.find(x => x.keyName == id)
            if (pair) {
                return pair.keyValue
            }
        }
        return ""
    }

    function renderHeaderableText(control) {
        return control.isHeader ? renderHeader(control, false) : <RawHTML className="">{control.textHtml}</RawHTML>

    }

    function renderHeaderableHeading(control) {
        return <h6>{control.text}</h6>

    }

    function renderHeaderableTitle(control) {
        return control.isHeader ? renderHeader(control, true) : <h6>{control.title}</h6>
    }

    function renderHint(control) {
        return control.hint && control.hint.length > 0 ? (<p className="f-12">({control.hint})</p>) : ""
    }

    function renderParagraph(control) {
        control.isHeader = true
        return <span className={columnCSS}>
            {renderHint(control)}
            <RawHTML className="f-18" >{control.textHtml}</RawHTML>
        </span>
    }

    function renderHeading3(control) {
        return <span className={columnCSS}>
            {renderHeaderableHeading(control)}
            {renderHint(control)}
        </span>
    }
    function renderHeading4(control) {
        return <span className={columnCSS}>
            {renderHeaderableText(control)}
            {renderHint(control)}
        </span>
    } function renderHeading5(control) {
        return <span className={columnCSS}>
            {renderHeaderableText(control)}
            {renderHint(control)}
        </span>
    } function renderHeading6(control) {
        return <span className={columnCSS}>
            {renderHeaderableText(control)}
            {renderHint(control)}
        </span>
    }

    function renderMinMax(control) {
        let minMax = ""
        if (control.minInputChar > 0) {
            minMax = `Min: ${control.minInputChar} `
        }
        if (control.maxInputChar > 0) {
            minMax += `Max: ${control.maxInputChar}`
        }
        return minMax ? "" : <Hint direction={"end"}>{minMax}</Hint>
    }   

    function renderOldValue(control, hasItemList) {
        if (!oldDocumentFieldsMappings) return ""
        if (hasItemList) {
            const index = getOldValueOf(control.id)
            if (control.itemList && index > -1 && index < control.itemList.length) {
                return <div style={{ color: "grey" }}>{control.itemList[index]}</div>
            }
        }
        return <div style={{ color: "grey" }}>{getOldValueOf(control.id)}</div>
    }

    function renderTextBox(control) {
        if (isViewMode) {
            return <div>
                {renderHeaderableTitle(control)}
                {renderHint(control)}
                <div>{getValueOf(control.id)}</div>
                {renderOldValue(control)}
                <br />
            </div>
        }
        return <span className={columnCSS}>
            <div className='mb-2' ><h6 className="fw-500">{renderHeaderableTitle(control)}</h6></div>
            {renderHint(control)}
            <Input
                disabled={disabled}
                value={getValueOf(control.id)}
            // placeholder={control.title}
            />
            {renderMinMax(control)}
        </span >
    }


    function renderTextKendoEditor(control) {
        if (isViewMode) {
            return <div>
                <label className='mb-2' >{renderHeaderableTitle(control)}</label>
                {renderHint(control)}
                <RawHTML>{getValueOf(control.id)}</RawHTML>
                {oldDocumentFieldsMappings && <div style={{ color: "grey" }}>
                    <RawHTML>{getOldValueOf(control.id)}</RawHTML>
                </div>}
                <br />
            </div>
        }
        const { Bold, Italic, Underline, AlignLeft, AlignRight, AlignCenter, Indent, Outdent, OrderedList, UnorderedList, Undo, Redo, Link, Unlink, } = EditorTools;
        return (<span className={columnCSS}>
            <label className='mb-2' >{renderHeaderableTitle(control)}</label>
            {renderHint(control)}
            <Editor
                disabled={disabled}
                ref={editor}
                value={control?.textHtml}
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

    function renderTextArea(control) {
        if (isViewMode) {
            return <div>
                <label className='mb-2' >{renderHeaderableTitle(control)}</label>
                {renderHint(control)}
                <div>{getValueOf(control.id)}</div>
                {renderOldValue(control)}
                <br />
            </div>
        }
        return <span className={columnCSS}>
            <label className='mb-2' >{renderHeaderableTitle(control)}</label>
            {renderHint(control)}
            <p>{control.text}</p>
            <TextArea
                disabled={disabled}
                value={getValueOf(control.id)}
                // placeholder={control.text}
                rows={5} />
            {renderMinMax(control)}
        </span >
    }

    function renderRadio(control) {
        const data = control.itemList.map((item, index) => {
            return {
                label: item,
                value: index,
            }
        })
        const radioItemIndex = getValueOf(control.id)
        const defaultValue = radioItemIndex ? data[radioItemIndex].value : undefined
        return <span className={columnCSS}>
            <label className='mb-2' >{renderHeaderableTitle(control)}</label>
            {renderHint(control)}
            <div className="row radio-align-cus">
                <RadioGroup
                    disabled={disabled}
                    layout={"vertical"}
                    name={`radio${control.id}`}
                    defaultValue={defaultValue}
                    data={data}
                />
            </div>
            {renderOldValue(control, true)}
        </span >
    }

    function renderCheckbox(control) {
        return <div className={columnCSS}>
            <label className='mb-2' >{renderHeaderableTitle(control)}</label>
            {renderHint(control)}
            <div className="row">
                {control.itemList.map((item, index) => {
                    return <div className="col-sm-6 mb-1">
                        <Checkbox
                            disabled={disabled}
                            defaultChecked={getValueOf(`${control.id}Checkbox${index}`) != ""}
                            name={`checkbox${index}`}
                            // value={index}
                            // checked={index === 0}
                            className="text-overlap-cus"
                            label={item}
                        />
                        <br />
                    </div>
                })}
            </div>
            {oldDocumentFieldsMappings && <div className="row">
                {control.itemList.map((item, index) => {
                    const keyName = `checkbox1Checkbox${index}`
                    if (oldDocumentFieldsMappings.find(x => x.keyName == keyName)) {
                        if (getValueOf(`${control.id}Checkbox${index}`)) {
                            return <div style={{ color: "grey" }}>{item}</div>
                        }
                    }
                    return ""
                })}
            </div>}
        </div >
    }

    function renderDropDown(control) {
        if (isViewMode) {
            return <div>
                <label className='mb-2' >{renderHeaderableTitle(control)}</label>
                {renderHint(control)}
                <div>{getValueOf(control.id)}</div>
                {renderOldValue(control)}
                <br />
            </div>
        }
        return <span className={columnCSS}>
            <label className='mb-2' >{renderHeaderableTitle(control)}</label>
            {renderHint(control)}
            {control.itemList.length > 0 &&
                <DropDownList
                    disabled={disabled}
                    defaultValue={getValueOf(control.id)}
                    data={control.itemList}
                />
            }
        </span >
    }

    function renderSignLine(_) {
        return <div className="border-bottom-line my-3"></div>
    }

    function renderDatePicker(control) {
        if (isViewMode) {
            return <div>
                <label className='mb-2' >{renderHeaderableTitle(control)}</label>
                {renderHint(control)}
                <div>{getValueOf(control.id)}</div>
                {renderOldValue(control)}
                <br />
            </div>
        }
        return <span className={columnCSS}>
            <label className='mb-2' >{renderHeaderableTitle(control)}</label>
            {renderHint(control)}
            <DatePicker
                disabled={disabled}
                value={getValueOf(control.id)}
                format="MM/dd/yyyy"
            />
        </span>
    }

    function renderTimePicker(control) {
        if (isViewMode) {
            return <div>
                <label className='mb-2' >{renderHeaderableTitle(control)}</label>
                {renderHint(control)}
                <div>{getValueOf(control.id)}</div>
                {renderOldValue(control)}
                <br />
            </div>
        }
        return <span className={columnCSS}>
            <label className='mb-2'>{renderHeaderableTitle(control)}</label>
            {renderHint(control)}
            <TimePicker
                disabled={disabled}
                value={getValueOf(control.id)}
                format="hh:mm a" />
        </span>
    }

    function renderTable(control) {
        return <span className={columnCSS}>
            <label className='mb-2'>{renderHeaderableTitle(control)}</label>
            {renderHint(control)}
            {control.itemList.length > 0 &&
                <div className="grid-table">
                    <Grid rows={control.rows}>
                        {control.itemList.map(item => <GridColumn title={item}></GridColumn>)}
                    </Grid>
                </div>
            }
        </span>
    }

    // Render all now
    return (
        <div ref={ref} className='col-md-12 pl-0'>
            <div className='preview-section mt-2'>
                {templateName && <h4 className='fw-500 text-center'>{templateName}</h4>}
                {renderControlList.map((obj) => {
                    columnCSS = obj.columnCSS
                    return <div className='row'>
                        {obj.controlList.map(control => {

                            // Show only controls who are changed.
                            if (changedDocumentFieldKeyNames) {
                                const changedControl = changedDocumentFieldKeyNames.find(
                                    keyName => keyName.includes(control.id))
                                if (!changedControl) {
                                    return <></>
                                }
                            }

                            // Render controls
                            switch (control.type) {
                                case templateControls.paragraph:
                                    return renderParagraph(control)
                                case templateControls.textBox:
                                    return renderTextBox(control)
                                case templateControls.textArea:
                                    return renderTextArea(control)
                                case templateControls.radio:
                                    return renderRadio(control)
                                case templateControls.checkbox:
                                    return renderCheckbox(control)
                                case templateControls.dropDown:
                                    return renderDropDown(control)
                                case templateControls.signLine:
                                    return renderSignLine(control)
                                case templateControls.datePicker:
                                    return renderDatePicker(control)
                                case templateControls.timePicker:
                                    return renderTimePicker(control)
                                // case templateControls.table:
                                //     return renderTable(control)
                                case templateControls.heading3:
                                    return renderHeading3(control)
                                case templateControls.textEditor:
                                    return renderTextKendoEditor(control)

                            }
                            return <div></div>
                        })}
                    </div>
                })}
            </div>
        </div>
    )
})
