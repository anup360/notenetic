import { Button } from "@progress/kendo-react-buttons";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Editor, EditorTools } from "@progress/kendo-react-editor";
import Loader from "../../../control-components/loader/loader";
import { Checkbox, Input, NumericTextBox } from "@progress/kendo-react-inputs";
import { Hint } from "@progress/kendo-react-labels";
import { Tooltip } from "@progress/kendo-react-tooltip";
import React, { useEffect, useRef, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useLocation, useNavigate } from "react-router-dom";
import ApiHelper from "../../../helper/api-helper";
import ApiUrls from "../../../helper/api-urls";
import APP_ROUTES from "../../../helper/app-routes";
import { showError } from "../../../util/utility";
import {
  availTemplateControls,
  mapDocumentTemplate, 
  templateControls,
  templateTypeInt,
  templateTypeString,
} from "./document-template-utility";
import { PreviewDocumentTemplate } from "./preview-document-template";
import useModelScroll from "../../../cutomHooks/model-dialouge-scroll";
// Constant Variables
const controlActions = {
  moveUp: "up",
  moveDown: "down",
  delete: "delete",
  required: "required",
};
const templateNameMaxLength = 100;

// Display controls
const displayColumnNumber = (controlType) =>
  controlType == templateControls.textBox ||
  controlType == templateControls.datePicker ||
  controlType == templateControls.radio ||
  controlType == templateControls.checkbox ||
  controlType == templateControls.timePicker;
const displayTextHtmlEditor = (controlType) =>
  controlType == templateControls.paragraph ||
  controlType == templateControls.textArea ||
  controlType == templateControls.heading3 ||
  controlType == templateControls.textEditor;
const displayIsHeader = (controlType) =>
  controlType == templateControls.paragraph ||
  controlType == templateControls.heading3;
const displayTitle = (controlType) =>
  controlType != templateControls.paragraph &&
  controlType != templateControls.signLine &&
  controlType != templateControls.heading3;
const displayHint = (controlType) => controlType != templateControls.signLine;
const displayIsRequired = (controlType) =>
  controlType != templateControls.paragraph &&
  controlType != templateControls.signLine &&
  controlType != templateControls.table &&
  controlType != templateControls.heading3;
const displayMinInputChars = (controlType) =>
  controlType == templateControls.textBox ||
  controlType == templateControls.textArea ||
  controlType == templateControls.textEditor;
const displayItemAddDynamically = (controlType) =>
  controlType == templateControls.radio ||
  controlType == templateControls.checkbox ||
  controlType == templateControls.dropDown ||
  controlType == templateControls.table;
const displayRowsCols = (controlType) => controlType == templateControls.table;

const defaultNewControl = {
  type: availTemplateControls[0],
  columnNumber: 1,
  text: "",
  textHtml: "",
  title: "",
  isRequired: false,
  isHeader: false,
  minInputChar: 0,
  maxInputChar: 0,
  itemValue: "",
  itemList: [],
  rows: 0,
  hint: "",
  // columns: 0 // It will be itemList.length which are actually header
};

function AddDocumentTemplate() {
  // States
  const [templateName, setTemplateName] = React.useState("");
  const [templateType, setTemplateType] = React.useState();
  const [newControl, setNewControl] = React.useState(defaultNewControl);
  const [isEditing, setEditing] = React.useState(false);
  const [editIndex, setEditIndex] = React.useState(0);
  const [controlList, setControlList] = React.useState([]);
  const [seconds, setSeconds] = useState(0);
  const [draftId, setDraftId] = useState(0);
  const [editDocumentTemplateId, setEditDocumentTemplateId] = useState();
  const [duplicateDocumentTemplate, setDuplicateDoumentTemplate] = useState();
  const [editTemplateDraftId, setEditTemplateDraftId] = useState();
  const [editDocumentTemplate, setEditDocumentTemplate] = useState();
  const [loading, setLoading] = useState(false);
  const [backRoute, setBackRoute] = useState(APP_ROUTES.DOCUMENT_TEMPLATE_LIST);
  const [modelScroll, setScroll] = useModelScroll();
  const [isPreview, setIsPreview] = React.useState(false);
  const [docTypes, setDocTypes] = React.useState([]);

  // Variables
  const navigate = useNavigate();
  const location = useLocation();
  const editor = React.createRef();
  const previewTemplateRef = useRef(null);

  if (location && location.state) {
    if (location.state.backRoute && location.state.backRoute != backRoute) {
      setBackRoute(location.state.backRoute);
    }
    if (location.state.documentTemplateId && location.state.documentTemplateId != editDocumentTemplateId) {
      setEditDocumentTemplateId(location.state.documentTemplateId);
      setDuplicateDoumentTemplate(location.state.isDuplicate);
    }
    if (
      location.state.templateDraftId &&
      location.state.templateDraftId != editTemplateDraftId
    ) {
      setEditTemplateDraftId(location.state.templateDraftId);
      setDraftId(location.state.templateDraftId);
    }
  }

  /* ============================= useEffect functions ============================= */

  useEffect(() => {
    setScroll(previewTemplateRef.current);
  }, [previewTemplateRef.current]);

  /* ============================= Private functions ============================= */

  async function insertDocumentTemplate(isDraft, isAutoDraft) {
    const body = {
      templateName: templateName,
      templateTypeId: templateType?.id,
      documentTemplatesFields: controlList.map((control, index) => {
        return {
          htmlAttributePropertyName:
            control.type.toLowerCase().replaceAll(" ", "") + index,
          displayLabel: control.title,
          htmlControlType: control.type,
          divideInColumns: control.columnNumber,
          minCharacters: control.minInputChar,
          maxCharacters: control.maxInputChar,
          sequenceNumber: index,
          isRequired: control.isRequired,
          isHeader: control.isHeader,
          textOrPlaceholder: control.text,
          hint: control.hint,
          htmlText: control.textHtml,
          htmlControlHasMasterData: control.itemList.length > 0,
          htmlControlMasterData: control.itemList.map((item, index) => {
            return { keyName: `${index}`, keyValue: item };
          }),
        };
      }),
    };

    if (isDraft) {
      body.id = draftId;
    } else if (duplicateDocumentTemplate) {
    } else {
      if (editDocumentTemplateId) {
        body.id = editDocumentTemplateId;
      }
      body.templateDraftId = draftId;
    }

    if (!isAutoDraft) {
      setLoading(true);

    }

    (editDocumentTemplateId && !duplicateDocumentTemplate && !isDraft
      ? ApiHelper.putRequest(ApiUrls.UPDATE_DOCUMENT_TEMPLATE, body)
      : ApiHelper.postRequest(
        isDraft
          ? ApiUrls.AUTO_SAVE_TEMPLATE_DRAFT
          : duplicateDocumentTemplate
            ? ApiUrls.INSERT_DOCUMENT_TEMPLATE
            : ApiUrls.INSERT_DOCUMENT_TEMPLATE,
        body
      )
    )
      .then((result) => {
        if (result.resultData) {
          if (isDraft) {
            setDraftId(result.resultData.templateDraftId);
          } else {
            NotificationManager.success("Success");
            onBack();
          }
        }
      })
      .catch((err) => {
        showError(err, "Insert Document Template");
      })
      .finally(() => {
        if (!isAutoDraft) setLoading(false);
      });
  }

  function saveDocumentTemplate() {
    if (!templateType) {
      showError(`Please enter template type`);
      return;
    }
    if (!templateName) {
      showError(`Please enter template name`);
      return;
    }

    if (controlList.length < 1) {
      showError("Please add some controls first!");
      return;
    }

    insertDocumentTemplate(false, false);
  }

  function draftDocumentTemplate(isAutoDraft) {
    if (!templateName || controlList.length < 1) {
      return;
    }
    insertDocumentTemplate(true, isAutoDraft);
    if(!isAutoDraft){
      NotificationManager.success("Template saved successfully in draft");
    }

  }

  function editControl(index) {
    setNewControl(controlList[index]);
    setEditIndex(index);
    setEditing(true);
  }

  function applyControlAction(index, action) {
    if (action == controlActions.moveUp && index == 0) return;
    if (action == controlActions.moveDown && index == controlList.length - 1)
      return;
    const newControlList = [];
    for (let i = 0; i < controlList.length; i++) {
      if (i == index - 1 && action == controlActions.moveUp) {
        newControlList.push(controlList[index]);
        newControlList.push(controlList[index - 1]);
        i++;
        continue;
      }
      if (i == index) {
        if (action == controlActions.moveDown) {
          newControlList.push(controlList[index + 1]);
          newControlList.push(controlList[index]);
          i++;
        }
        if (action == controlActions.delete) continue;
        if (action == controlActions.required) {
          const newControl = {
            ...controlList[index],
            isRequired: !controlList[index].isRequired,
          };
          newControlList.push(newControl);
        }
        continue;
      }
      newControlList.push(controlList[i]);
    }
    setControlList(newControlList);
  }

  /* ============================= useEffects ============================= */

  useEffect(() => {
    const closePreventFunction = (ev) => {
      ev.preventDefault();
      return (ev.returnValue = "Are you sure you want to close?");
    };
    window.addEventListener("beforeunload", closePreventFunction);
    return () => {
      window.removeEventListener("beforeunload", closePreventFunction);
    };
  }, []);

  useEffect(() => {
    if (editDocumentTemplate) {
      let data = {
        id: editDocumentTemplate.templateTypeId,
        name: editDocumentTemplate.templateTypeName,
      };
      setTemplateName(editDocumentTemplate.name);
      setTemplateType(data);
      setControlList(editDocumentTemplate.controlList);
    }
  }, [editDocumentTemplate]);

  useEffect(() => {
    if (editDocumentTemplateId) {
      setLoading(true);
      ApiHelper.queryGetRequestWithEncryption(
        ApiUrls.GET_DOCUMENT_TEMPLATE_BY_ID,
        editDocumentTemplateId
      )
        .then((result) => {
          if (result.resultData) {
            setEditDocumentTemplate(mapDocumentTemplate(result.resultData));
          }
        })
        .catch((err) => {
          showError(err, "Fetch Document Template");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [editDocumentTemplateId]);

  useEffect(() => {
    setLoading(true);
    ApiHelper.getRequest(ApiUrls.GET_DOCUMENT_TEMPLATE_TYPES)
      .then((result) => {
        if (result.resultData) {
          setDocTypes(result.resultData);
        }
      })
      .catch((err) => {
        showError(err, "Document Template Types");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [editDocumentTemplateId]);

  useEffect(() => {
    if (editTemplateDraftId) {
      setLoading(true);
      ApiHelper.queryGetRequestWithEncryption(
        ApiUrls.GET_TEMPLATE_DRAFT_BY_ID,
        editTemplateDraftId
      )
        .then((result) => {
          if (result.resultData) {
            setEditDocumentTemplate(mapDocumentTemplate(result.resultData));
          }
        })
        .catch((err) => {
          showError(err, "Fetch Template Draft");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [editTemplateDraftId]);

  useEffect(() => {
    draftDocumentTemplate(true);
    let interval = setInterval(() => {
      setSeconds((seconds) => (seconds == 0 ? 1 : 0));
    }, 10 * 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  /* ============================= onChange, Action events ============================= */

  function onBack() {
    navigate(backRoute);
  }

  const handleNameChange = (e) => {
    setTemplateName(e.value);
  };

  const handleTypeChange = (e) => {
    let value = e.target.value;
    // setTemplateType(e.value == templateTypeString[0]
    //     ? templateTypeInt.assesment : templateTypeInt.note)
    setTemplateType(value);
  };

  const handleControlChange = (e) => {
    setNewControl({
      ...defaultNewControl,
      type: e.value,
      // isHeader: e.value != templateControls.paragraph && e.value != templateControls.signLine &&
      //     e.value != templateControls.heading3 &&
      //     e.value != templateControls.heading4 &&
      //     e.value != templateControls.heading5 &&
      //     e.value != templateControls.heading6
      // ,
      maxInputChar: e.value == templateControls.textBox ? 100 : 0,
    });
  };

  const handleColumnNumberChange = (e) => {
    if (
      e.value.length > 0 &&
      e.value != "1" &&
      e.value != "2" &&
      e.value != "3"
    ) {
      showError("Value should be between 1 and 3");
      return;
    }
    setNewControl({
      ...newControl,
      columnNumber: e.value,
    });
  };

  const handleChange = (e) => {
    setNewControl({
      ...newControl,
      [e.target.name]: e.value,
    });
  };

  const handleMinCharChange = (e) => {
    setNewControl({
      ...newControl,
      minInputChar: e.value,
    });
  };

  const handleNewItemValue = (e) => {
    setNewControl({
      ...newControl,
      itemValue: e.value,
    });
  };

  const handleTitleChange = (e) => {
    setNewControl({
      ...newControl,
      title: e.value,
    });
  };

  const handleTextChange = (props) => {
    setNewControl({
      ...newControl,
      text: props.value.textContent,
      textHtml: props.html,
    });
  };

  const handleIsHeaderChange = (e) => {
    setNewControl({
      ...newControl,
      isHeader: e.value,
    });
  };

  const handleIsRequiredChange = (e) => {
    setNewControl({
      ...newControl,
      isRequired: e.value,
    });
  };

  function addControl() {
    if (displayTextHtmlEditor(newControl.type) && newControl.text.length < 1) {
      if (newControl.type == "Text Editor") {
      } else if (newControl.type != templateControls.textArea) {
        showError("Text can't be empty!");
        return;
      } else {
      }
    }
    setControlList([...controlList, newControl]);
    setNewControl({ ...defaultNewControl, type: newControl.type });
  }

  function updateControl() {
    if (displayTextHtmlEditor(newControl.type) && newControl.text.length < 1) {
      if (newControl.type == "Text Editor") {
      } else if (newControl.type != templateControls.textArea) {
        showError("Text can't be empty!");
        return;
      } else {
      }
    }
    let newControlList = controlList;
    newControlList[editIndex] = newControl;
    setControlList(newControlList);
    cancelEdit();
  }

  function cancelEdit() {
    setEditing(false);
    setNewControl(defaultNewControl);
  }

  function addNewItem(e) {
    e.preventDefault();
    if (!newControl.itemValue) return;
    for (const item of newControl.itemList) {
      if (item == newControl.itemValue) {
        showError("Duplicate Entry not allowed!");
        return;
      }
    }
    setNewControl({
      ...newControl,
      itemList: [...newControl.itemList, newControl.itemValue],
      itemValue: "",
    });
  }

  function deleteItem(e, itemValue) {
    e.preventDefault();
    setNewControl({
      ...newControl,
      itemList: newControl.itemList.filter((item) => item != itemValue),
    });
  }

  /* ============================= Render View ============================= */

  function renderTemplateType() {
    return (
      <div className="mb-2 col-lg-6">
        <h6>Template Type</h6>
        <DropDownList
          value={templateType}
          onChange={handleTypeChange}
          data={docTypes}
          textField="name"
          dataItemKey="id"
        />
      </div>
    );
  }

  function renderTemplateName() {
    return (
      <div className="col-lg-6">
        <h6>Template</h6>
        <Input
          maxLength={templateNameMaxLength}
          value={templateName}
          onChange={handleNameChange}
        />
        <Hint direction={"end"}>
          {templateName.length} / {templateNameMaxLength}
        </Hint>
      </div>
    );
  }


  function renderNewControlEntry() {
    return (
      <div className="edit-form-show">
        <div className="row">
          <div
            className={
              !displayColumnNumber(newControl.type)
                ? "form-group"
                : "form-group col-md-6"
            }
          >
            <label>Type</label>
            <DropDownList
              value={newControl.type}
              onChange={handleControlChange}
              data={availTemplateControls}
            />
          </div>
          {displayColumnNumber(newControl.type) && (
            <div className="form-group col-md-6">
              <label>Column Number</label>

              <NumericTextBox
                value={newControl.columnNumber}
                onChange={handleColumnNumberChange}
                min={1}
                max={controlList.length > 0 ? controlList[controlList.length - 1].columnNumber + 1 : 1}
                // max={controlList.length > 0 && 3}
                className=""
                placeholder="Text Box"
              />
            </div>
          )}
        </div>
        {displayTitle(newControl.type) && (
          <div className="form-group">
            <label>Title</label>
            <Input
              value={newControl.title}
              onChange={handleTitleChange}
              className=""
              placeholder="Title"
            />
          </div>
        )}
        {displayHint(newControl.type) && (
          <div className="form-group">
            <label>Hint</label>
            <Input
              value={newControl.hint}
              onChange={handleChange}
              name="hint"
              placeholder="Hint"
            />
          </div>
        )}
        {displayRowsCols(newControl.type) && (
          <div className="form-group">
            <label>Rows</label>
            <Input
              value={newControl.rows}
              name="rows"
              onChange={handleChange}
              placeholder="Rows"
            />
          </div>
        )}
        {displayTextHtmlEditor(newControl.type) && (
          <div className="form-group">
            <label>Text</label>
            {renderTextKendoEditor()}
          </div>
        )}
        {/* {displayIsHeader(newControl.type) &&
                <div className='form-group'>
                    <Checkbox value={newControl.isHeader} onChange={handleIsHeaderChange}> Is Header</Checkbox>
                </div>
            } */}
        {displayMinInputChars(newControl.type) && (
          <div className="form-group">
            <label>Min Input Chars</label>
            <NumericTextBox
              value={newControl.minInputChar}
              onChange={handleMinCharChange}
              className=""
              placeholder="Minumum Characters Required"
            />
          </div>
        )}
        {displayIsRequired(newControl.type) && (
          <div className="form-group">
            <Checkbox
              value={newControl.isRequired}
              onChange={handleIsRequiredChange}
            >
              {" "}
              Is Required
            </Checkbox>
          </div>
        )}
        {displayItemAddDynamically(newControl.type) && (
          <div className="form-group">
            <label className="mb-2">
              {displayRowsCols(newControl.type)
                ? "Column Titles (" + newControl.itemList.length + " Columns)"
                : "Items"}
            </label>
            <div className="form-group">
              <div className="d-flex  align-items-center">
                <Input
                  value={newControl.itemValue}
                  onChange={handleNewItemValue}
                  className="mt-0"
                  placeholder="Enter item here..."
                />
                <Button
                  className="blue-primary-outline btn-sm btn ml-2"
                  onClick={addNewItem}
                >
                  <i className="fa fa-plus pr-2"></i>Add
                </Button>
              </div>
              <ul className="pl-2 list-unstyled my-2">{renderItemList()}</ul>
            </div>
          </div>
        )}
        <div></div>
        {!isEditing && (
          <Button
            className="blue-primary-outline btn-sm btn"
            onClick={addControl}
          >
            <i className="fa fa-plus pr-2"></i>Add Control
          </Button>
        )}
        {isEditing && (
          <Button themeColor={"primary"} onClick={updateControl}>
            Update
          </Button>
        )}{" "}
        &nbsp;
        {isEditing && (
          <Button themeColor={"secondary"} onClick={cancelEdit}>
            Cancel
          </Button>
        )}
      </div>
    );
  }

  function renderItemList() {
    return newControl.itemList.map((item) => {
      return (
        <li className="mb-1 pb-2 border-bottom-line d-flex justify-content-between align-items-center">
          <p className="mb-0 f-14 text-set">{item}</p>
          <Button
            className="btn btn-danger-delete btn-sm f-9"
            onClick={(e) => deleteItem(e, item)}
          >
            <i className="fa fa-trash"></i>
          </Button>
        </li>
      );
    });
  }

  const handlePreview = () => {
    // setScroll(true)
  };

  const onClosePreview = () => {
    // setScroll(false)
  };

  function renderTextKendoEditor() {
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
      <Editor
        ref={editor}
        value={newControl.textHtml}
        onChange={handleTextChange}
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
    );
  }

  function renderControlGrid() {
    return (
      <div className="col-md-12 details-info ">
        <div className="table-responsive table_view_dt mt-3">
          <table className="table">
            <thead>
              <tr>
                <th>No</th>
                <th>Type</th>
                <th>Col. Num.</th>
                <th>Title</th>
                <th>Hint</th>
                <th>Text</th>
                <th>Min IC</th>
                {/* <th>Rows</th> */}
                <th>Items</th>
                {/* <th>Is Header</th> */}
                <th>Is Required</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{controlList.map((c, i) => renderControl(c, i))}</tbody>
          </table>
        </div>
      </div>
    );
  }

  function renderControl(control, index) {
    let truncText = control.text;
    if (truncText && truncText.length > 25) {
      truncText = truncText.substring(0, 25) + "...";
    }
    let truncTitle = control.title;
    if (truncTitle && truncTitle.length > 25) {
      truncTitle = truncTitle.substring(0, 25) + "...";
    }
    let truncHint = control.hint;
    if (truncHint && truncHint.length > 25)
      truncHint = truncHint.substring(0, 25) + "...";

    return (
      <tr>
        <td>{index + 1}</td>
        <td>{control.type}</td>
        <td>{control.columnNumber}</td>
        <td title={control.title}>
          {displayTitle(control.type) ? truncTitle : "-"}
        </td>
        <td title={control.hint}>
          {displayHint(control.type) ? truncHint : "-"}
        </td>
        <td title={control.text}>
          {displayTextHtmlEditor(control.type) ? truncText : "-"}
        </td>
        <td title={"Minimum Characters Required"}>
          {control.minInputChar == 0 ? "-" : control.minInputChar}
        </td>

        <td>{control.itemList.length < 1 ? "-" : control.itemList.length}</td>
        <td>
          {displayIsRequired(control.type)
            ? control.isRequired
              ? "Yes"
              : "No"
            : "-"}
        </td>
        <td className="cursor-default">
          <div
            className="k-chip k-chip-md k-rounded-md k-chip-solid k-chip-solid-base "
            onClick={() => {
              applyControlAction(index, controlActions.delete);
            }}
          >
            <div className="k-chip-content ">
              <Tooltip anchorElement="target" position="top">
                <i
                  className="fa fa-trash cursor-default"
                  aria-hidden="true"
                  title="Delete"
                />
              </Tooltip>
            </div>
          </div>
          <div
            className="k-chip k-chip-md k-rounded-md k-chip-solid k-chip-solid-base m-2 "
            onClick={() => {
              editControl(index);
            }}
          >
            <div className="k-chip-content">
              <Tooltip anchorElement="target" position="top">
                <i className="fas fa-edit cursor-default" title="Edit" />
              </Tooltip>
            </div>
          </div>
          {index != 0 && (
            <div
              className="k-chip k-chip-md k-rounded-md k-chip-solid k-chip-solid-base m-2"
              onClick={() => {
                applyControlAction(index, controlActions.moveUp);
              }}
            >
              <div className="k-chip-content">
                <Tooltip anchorElement="target" position="top">
                  <i
                    className="fa fa-arrow-up"
                    aria-hidden="true"
                    title="Move Up"
                  />
                </Tooltip>
              </div>
            </div>
          )}
          {index != controlList.length - 1 && (
            <div
              className="k-chip k-chip-md k-rounded-md k-chip-solid k-chip-solid-base m-2"
              onClick={() => {
                applyControlAction(index, controlActions.moveDown);
              }}
            >
              <div className="k-chip-content">
                <Tooltip anchorElement="target" position="top">
                  <i className="fas fa-arrow-down" title="Move Down" />
                </Tooltip>
              </div>
            </div>
          )}
          {displayIsRequired(control.type) && (
            <Checkbox
              defaultChecked={true}
              title="Is Required?"
              onChange={() => {
                applyControlAction(index, controlActions.required);
              }}
              value={control.isRequired}
            />
          )}
        </td>
      </tr>
    );
  }

  return (
    <div>
      {loading && (
        <div>
          <Loader />
        </div>
      )}
      <button
        type="button"
        value="BACK"
        onClick={onBack}
        className="border-0 bg-transparent arrow-rotate pl-0 mb-3"
      >
        <i className="k-icon k-i-sort-asc-sm"></i>
      </button>
      <div className="button-height-scroll white-scroll mb-3">
        <div className="row">
          <div className="col-lg-4 ">
            <div className="d-flex flex-wrap">
              {renderTemplateType()}
              {renderTemplateName()}
            </div>

            {!isEditing && <h6 className="">Add new control</h6>}
            {isEditing && (
              <h6 className="">Updating Control No. {editIndex}</h6>
            )}

            {renderNewControlEntry()}
          </div>
          <div className="col-lg-8">
            <h6 className="px-3">Document Template Listing</h6>
            {renderControlGrid()}
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-between preview-btn-bottom">
        <div className="draf-btn">
          <Button
            className="blue-primary btn btn-sm"
            onClick={saveDocumentTemplate}
          >
            {editDocumentTemplateId && !duplicateDocumentTemplate
              ? "Update Template"
              : "Save Template"}
          </Button>{" "}
          &nbsp;
          <Button
            className="blue-primary-outline btn btn-sm"
            onClick={() => draftDocumentTemplate(false)}
          >
            <i className="fa fa-file pr-2"></i>Save as Draft
          </Button>{" "}
          &nbsp;
          <Button
            className="blue-primary-outline btn btn-sm"
            onClick={() => navigate(-1)}
          >
            <i className="fa fa-times-circle pr-2"></i>Cancel
          </Button>{" "}
          &nbsp;
        </div>

        <div className="modal-preview">
          <button
            onClick={handlePreview}
            type="button"
            className="btn blue-primary preview-dt btn-sm"
            data-toggle="modal"
            data-target="#preview"
          >
            Preview
          </button>
        </div>
      </div>
      <div
        className="modal fade popupmodal-design"
        id="preview"
        tabIndex="2"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="header-top">
              <h5 className="modal-title" id="exampleModalLongTitle">
                Preview
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span onClick={onClosePreview} aria-hidden="true">
                  &times;
                </span>
              </button>
            </div>
            <div className="inner-form-modal">
              <PreviewDocumentTemplate
                ref={previewTemplateRef}
                templateName={templateName}
                controlList={controlList}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddDocumentTemplate;
