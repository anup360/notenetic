import React from 'react';
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { forwardRef, useRef, useImperativeHandle } from "react"

const DeleteDialogModal = forwardRef(({
  title,
  message,
  onClose,
  activeType,
  handleDelete,
  handleReactive
}, ref) => {

  useImperativeHandle(ref, () => ({
    handleDelete
  }))

  return (
    <Dialog onClose={onClose} title={activeType === true ? `Reactivate ${title}` : `Delete ${title}`}>
      <p
        style={{
          margin: "25px",
          textAlign: "center",
        }}
      >
        {activeType === true ? `Are you sure you want to reactivate ${message}?` : `Are you sure you want to delete ${message}?`}
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

export default DeleteDialogModal