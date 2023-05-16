import React, { useState } from 'react';
import ApiUrls from '../../helper/api-urls'
import ApiHelper from '../../helper/api-helper'
import { showError } from '../../util/utility';
import { Button } from "@progress/kendo-react-buttons";
import { Input } from '@progress/kendo-react-inputs';

function MessageLabelView(props) {

    const [newLabelValue, setNewLabelValue] = useState("")
    const [showAddLabel, setShowAddLabel] = useState(false)
    const [renameLabel, setRenameLabel] = useState()

    // props
    const onLabelSelected = props.onLabelSelected
    const labels = props.labels
    const setLabels = props.setLabels
    const labelState = props.labelState

    /* ============================= Private functions ============================= */

    /* ============================= useEffects ============================= */

    /* ============================= Event functions ============================= */

    function onShowAddLabel() {
        setShowAddLabel(!showAddLabel)
        setRenameLabel(undefined)
    }

    function handleNewLabelValueChange(e) {
        setNewLabelValue(e.value);
    }

    async function onNewValueAdd() {
        if (newLabelValue.length < 1) {
            showError("Please enter the new Label name!")
            return
        }
        try {
            const result = await ApiHelper.postRequest(ApiUrls.CREATE_PERSONAL_LABEL +
                "?labelName=" + newLabelValue)
            if (result.resultData.personalLabelId) {
                setLabels([...labels, {
                    id: result.resultData.personalLabelId,
                    labelName: newLabelValue
                }])
                setNewLabelValue("")
                setShowAddLabel(false)
            }
        } catch (err) {
            showError(err, "Add Personal Label")
        }
    }

    async function onLabelDelete(id) {
        try {
            const result = await ApiHelper.deleteRequest(
                ApiUrls.DELETE_PERSONAL_LABEL + "?id=" + id)
            if (result.resultData) {
                setLabels(labels.filter(x => x.id != id))
            }
        } catch (err) {
            showError(err, "Delete Personal Label")
        } finally {
            if (renameLabel && renameLabel.id == id) {
                setRenameLabel(undefined)
            }
        }
    }

    async function onLabelRename() {
        try {
            const result = await ApiHelper.putRequest(ApiUrls.UPDATE_PERSONAL_LABEL
                + "?id=" + renameLabel.id
                + "&labelName=" + newLabelValue.replace(' ', '%20')
            )
            if (result.resultData) {
                setLabels(labels.map(x => x.id != renameLabel.id ? x : { id: x.id, labelName: newLabelValue }))
            }
        } catch (err) {
            showError(err, "Delete Personal Label")
        } finally {
            setRenameLabel(undefined)
            setNewLabelValue("")
        }
    }

    function onShowRenameLabelView(label) {
        setRenameLabel(label)
        setShowAddLabel(false)
    }

    /* ============================= Render View ============================= */

    function renderLabelList() {
        return labels.map(label => renderLabel(label))
    }

    function renderLabel(label) {
        const className = {
            className: labelState && labelState.id == label.id
                ? "mb-0 active-menu-item" : "mb-0"
        }
        return <li
            className="text-black-common"
            
        >
            <div {...className} className="d-flex justify-content-between ">
                <p className='mb-0' onClick={() => onLabelSelected(label)}>{label.labelName}</p>
                <span className="dropdown">
                    <p className="dropdown-toggle toogle-hide cursor-pointer mb-0" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i className="k-icon k-i-more-vertical"></i>
                    </p>
                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <a className="dropdown-item text-black-common" href="#"
                            onClick={() => onLabelDelete(label.id)}>Delete</a>
                        <a className="dropdown-item text-black-common" href="#"
                            onClick={() => onShowRenameLabelView(label)}>Rename</a>
                    </div>
                </span>
            </div>
        </li >

    }

    return (
        <div>
            <div className="labels-add mt-5">
                <div className="d-flex justify-content-between align-items-center">
                    <p className=" mb-0 common-heading fw-500">Labels</p>
                    <button onClick={onShowAddLabel} className='btn blue-primary btn-small'>

                        {showAddLabel && <i className='k-icon k-i-minus'></i>}
                        {!showAddLabel && <i className='k-icon k-i-plus'></i>}

                    </button>
                </div>
                <ul className="list-unstyled mt-3"> {renderLabelList()} </ul>
            </div>
            {(showAddLabel || renameLabel) && <div className={"k-item-text staff-text mt-3"}>

                <label className='mb-2'>
                    {renameLabel ? "Rename " + renameLabel.labelName : "Add New Label"}
                </label>
                <div className='d-flex align-items-center'>
                    <Input maxLength={100}
                        value={newLabelValue}
                        onChange={handleNewLabelValueChange} className='mr-2 mt-0 input-field-drop' />

                    <Button themeColor={"primary"}
                        onClick={renameLabel ? onLabelRename : onNewValueAdd}>
                        +
                    </Button>
                </div>

            </div>}
        </div>
    );
}

export default MessageLabelView;
