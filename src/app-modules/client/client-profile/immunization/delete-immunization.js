import React from 'react';
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import ApiUrls from "../../../../helper/api-urls";
import ApiHelper from "../../../../helper/api-helper";
import { NotificationManager } from "react-notifications";
import { Encrption } from '../../../encrption';
import DeleteDialogModal from "../../../../control-components/custom-delete-dialog-box/delete-dialog";
import { renderErrors } from "src/helper/error-message-helper";

const DeleteImmunization = ({ setScroll, onClose, selectedId, getImmunization, hide }) => {

  const handleDelete = () => {
    ApiHelper.deleteRequest(ApiUrls.DELETE_CLIENT_IMMUNIZATION + Encrption(selectedId))
      .then((result) => {
        NotificationManager.success(" Immunization deleted successfully");
        hide();
        getImmunization();
        setScroll(false)
      })
      .catch((error) => {
        renderErrors(error.message);
      });
  };
  return (
    <DeleteDialogModal
        onClose={onClose}
        title="Immunization"
        message="immunization"
        handleDelete={handleDelete}
        />
  )
}

export default DeleteImmunization;