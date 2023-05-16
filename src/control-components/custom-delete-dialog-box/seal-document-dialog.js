import React from 'react';
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { forwardRef, useRef, useImperativeHandle } from "react"

const SealDocumentModal = forwardRef(({
  onClose,
  title,
  message,
  handleDelete,
  activeType,
  handleReactive
}, ref) => {

  useImperativeHandle(ref, () => ({
    handleDelete
  }))

  return (
    <Dialog onClose={onClose} title={ `Seal ${title}`}>
      <p
        style={{
          margin: "25px",
          textAlign: "center",
        }}
      >
        {  `Sealing a note prohibits all further editing to Document. Continue?` }
      </p>
      <DialogActionsBar>
      {activeType ? (
          <button
            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
            onClick={handleReactive}
          >
            Yes
          </button>
        ) : (
          <button
            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
            onClick={handleDelete}
          >
            Yes
          </button>
        )}
        <button
          className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
          onClick={onClose}
        >
          No
        </button>
     
      </DialogActionsBar>
    </Dialog>
  )
})

export default SealDocumentModal