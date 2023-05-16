import React, { useState } from "react";
import Loader from "../../../../control-components/loader/loader";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import NotificationManager from "react-notifications/lib/NotificationManager";
import { ClientService } from "../../../../services/clientService";
import NOTIFICATION_MESSAGE from "../../../../helper/notification-messages";
import { renderErrors } from "src/helper/error-message-helper";

const DeleteSiblings = ({ onClose, selectedSibling }) => {
  const [loading, setLoading] = useState(false);

  const deleteSibling = async () => {
    setLoading(true);
    await ClientService.deleteSiblingClient(selectedSibling.id)
      .then((result) => {
        NotificationManager.success(NOTIFICATION_MESSAGE.SIBLING_DELETED);
        setLoading(false);
        onClose({ siblingDeleted: true });
      })
      .catch((error) => {
        renderErrors(error);
        setLoading(false);
      });
  };

  return (
    <>
      <Dialog onClose={onClose} title={"Delete Relation"} className="">
        {loading == true && <Loader />}
        <p
          style={{
            margin: "25px",
            textAlign: "center",
          }}
        >
          Are you sure you want to delete ?{" "}
        </p>
        <DialogActionsBar>
          <button
            className="btn blue-primary text-white"
            onClick={deleteSibling}
          >
            Yes
          </button>
          <button className="btn grey-secondary text-white" onClick={onClose}>
            No
          </button>
        </DialogActionsBar>
      </Dialog>
    </>
  );
};
export default DeleteSiblings;
