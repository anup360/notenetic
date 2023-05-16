import React, { useState } from "react";
import NotificationManager from "react-notifications/lib/NotificationManager";
import ApiHelper from "../../../../helper/api-helper";
import ApiUrls from "../../../../helper/api-urls";
import { Encrption } from "../../../encrption";
import DeleteDialogModal from "../../../../control-components/custom-delete-dialog-box/delete-dialog";
import { renderErrors } from "src/helper/error-message-helper";

const DeleteEducation = ({ onClose, id, getEducationList }) => {
  const [loading, setLoading] = useState(false);

  const deleteEducation = async () => {
    setLoading(true);
    await ApiHelper.deleteRequest(
      ApiUrls.DELETE_CLIENT_EDUCATION + Encrption(id)
    )
      .then((result) => {
        setLoading(false);
        NotificationManager.success("Education Deleted  Successfully");
        onClose();
        getEducationList();
      })
      .catch((error) => {
        renderErrors(error);
        setLoading(false);
      });
  };
  return (
    <DeleteDialogModal
    onClose={onClose}
    title="Education"
    message="education"
    handleDelete={deleteEducation}
    />
  );
};
export default DeleteEducation;
