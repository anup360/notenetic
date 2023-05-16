import React from 'react';
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { forwardRef, useRef, useImperativeHandle } from "react"
import { Checkbox, NumericTextBox } from "@progress/kendo-react-inputs"

const LockDialogModal = forwardRef(({
  title,
  message,
  onClose,
  activeType,
  handleDelete,
  handleReactive,
  setDeleteAssociateSign,
  isDeleteAssociateSign
}, ref) => {

  useImperativeHandle(ref, () => ({
    handleDelete
  }))

  const onChange =(e)=>{
    setDeleteAssociateSign(e.target.value)
  }

  return (
    <Dialog onClose={onClose}
      className="small-dailog"
      title={activeType === true ?
        `Unlock ${title}` : `Lock ${title}`}>
      <p
        style={{
          margin: "25px",
          textAlign: "center",
        }}
      >
        {activeType === true ? 'Are you sure you want to unlock and allow editing again. Continue?' : 'Locking a document prohibits all further editing to this document. Continue?'}
      </p>

      {
        activeType === true &&
        <p className="mb-0 f-12 d-flex align-items-center check-delete-cus mb-2">
          <Checkbox
            name="isDeleteAssociate"
            value={isDeleteAssociateSign}
            onChange={onChange}
            style={{marginRight:"5px", marginTop:"0px"}}
          />
          Delete associate signatures?
        </p>
      }



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

export default LockDialogModal