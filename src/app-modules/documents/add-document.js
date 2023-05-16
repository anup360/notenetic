import APP_ROUTES from "../../helper/app-routes";
import AddEditDocument, { documentStatusEnum } from "./add-edit-document";

const AddDocument = (props) => {
  return <AddEditDocument
    documentStatus={documentStatusEnum.new}
    backRoute={APP_ROUTES.DOCUMENT_LIST}
  />
};

export default AddDocument;
