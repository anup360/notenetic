import React, { useState } from "react";
import NotificationManager from "react-notifications/lib/NotificationManager";
import ApiHelper from "../../../../helper/api-helper";
import ApiUrls from "../../../../helper/api-urls";
import { Encrption } from '../../../encrption';
import DeleteDialogModal from "../../../../control-components/custom-delete-dialog-box/delete-dialog";
import { renderErrors } from "src/helper/error-message-helper";

const ContactDelete = ({ onClose, selectedContactId, getContactNotes }) => {
  const [loading, setLoading] = useState(false);
  
  const deleteContactNote = async () => {
    setLoading(true);
    await ApiHelper.deleteRequest(
      ApiUrls.DELETE_CONTACT_NOTES + Encrption(selectedContactId)
    )
      .then((result) => {
        setLoading(false);
        NotificationManager.success("Contact note deleted successfully");
        onClose({ isDeleteDiscussion: true });
        getContactNotes();
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
              title="Contact Notes"
              message="contact notes"
              handleDelete={deleteContactNote}
              />
    </>
  );
};
export default ContactDelete;
