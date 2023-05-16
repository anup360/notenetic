import { Dialog } from "@progress/kendo-react-dialogs";
import { useEffect } from "react";
import useModelScroll from '../../cutomHooks/model-dialouge-scroll'

export const AddEditEventDialog = (props) => {



  return <Dialog  {...props} className={"k-scheduler-edit-dialog k-dialog-wrapper dialog-modal"} />;
};
