import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import React, { useState } from 'react';
import { MultiSelect } from "@progress/kendo-react-dropdowns";
import useModelScroll from '../../cutomHooks/model-dialouge-scroll'

function LabelSelectionDialog(props) {

    const [label, setLabel] = useState()
    const visible = props.visible
    const onLabelSelected = props.onLabelSelected
    const labelList = props.labelList
    const [modelScroll, setScroll] = useModelScroll()

    function handleChange(e) {
        let value = e.target.value;
        setLabel(value)
    }

    function onClose() {
        onLabelSelected()
    }

    function onSelect() {
        onLabelSelected(...label)
    }

    function renderItem(li, itemProps) {
        const itemChildren = (
            <span>
                {li.props.children}
            </span>
        );
        return React.cloneElement(li, li.props, itemChildren);
    }

    return (
        <div>
            {visible && (
                <Dialog title={"Select Label"} onClose={onClose}>
                    <MultiSelect
                        validityStyles={false}
                        value={label}
                        onChange={handleChange}
                        name="label"
                        label="Label"
                        textField="labelName"
                        data={labelList}
                        itemRender={renderItem}
                    />
                    <DialogActionsBar>
                        <button className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
                            onClick={onClose} >
                            Cancel
                        </button>
                        <button className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
                            onClick={onSelect} >
                            Select
                        </button>
                    </DialogActionsBar>
                </Dialog>
            )}
        </div>
    )
}

export default LabelSelectionDialog;
