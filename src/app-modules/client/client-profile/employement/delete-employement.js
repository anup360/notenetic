import React, { useState } from "react";
import NotificationManager from "react-notifications/lib/NotificationManager";
import ApiHelper from "../../../../helper/api-helper";
import ApiUrls from "../../../../helper/api-urls";
import { Encrption } from "../../../encrption";
import DeleteDialogModal from "../../../../control-components/custom-delete-dialog-box/delete-dialog";
import { renderErrors } from "src/helper/error-message-helper";

const DeleteEmployement = ({
  onClose,
  selectedEmployementId,
  getContactNotes,
  getEmployement,
}) => {
  const [loading, setLoading] = useState(false);

  const deleteEmployement = async () => {
    setLoading(true);
    await ApiHelper.deleteRequest(
      ApiUrls.DELETE_CLIENT_EMPLOYMENTS + Encrption(selectedEmployementId)
    )
      .then((result) => {
        setLoading(false);
        NotificationManager.success("Delete Employement  Successfully");
        getEmployement();
        onClose({ isDeleteDiscussion: true });
        // getContactNotes();
      })
      .catch((error) => {
        renderErrors(error);

        setLoading(false);
      });
  };
  return (
    <>
   <DeleteDialogModal
              onClose={onClose}
              title="Employement"
              message="employement"
              handleDelete={deleteEmployement}
              />
    </>
  );
};
export default DeleteEmployement;
