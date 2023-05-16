import React, { useEffect, useState } from "react";
import Loader from "../../control-components/loader/loader";
import { Dialog } from "@progress/kendo-react-dialogs";
import NotificationManager from "react-notifications/lib/NotificationManager";
import { CommonService } from "../../services/commonService";
import NOTIFICATION_MESSAGE from "../../helper/notification-messages";
import ErrorHelper from "../../helper/error-helper";
import MultiSelectDropDown from "../../control-components/multi-select-drop-down/multi-select-drop-down";
import InputKendoRct from "../../control-components/input/input";
import ApiUrls from "../../helper/api-urls";
import ApiHelper from "../../helper/api-helper";
import { renderErrors } from "src/helper/error-message-helper";

const LinkAnotherDocument = ({
  onClose,
  clientId,
  documentId
}) => {
  const [loading, setLoading] = useState(false);
  const [documentsData, setDocumentData] = useState([]);
  const [errors, setErrors] = useState("");
  const [settingError, setSettingError] = useState(false);

  let [fields, setFields] = useState({
    docName:""
  
  });


  useEffect(()=>{
    getDocumentsByClientId();
  },[])


  const getDocumentsByClientId = async () => {
    await CommonService.getDocumentByClientId(clientId)
      .then((result) => {
        let data = result.resultData;
        setDocumentData(data);
      })
      .catch((error) => {
        renderErrors(error.message);
      });
  };

  
  const saveDocumentLink = async () => {
    setLoading(true)
    let docIds = [];
    fields.docName.map((objType) => docIds.push(objType.documentId));
    await CommonService.addDocumentExisting(documentId, docIds)
      .then((result) => {
        NotificationManager.success("Document linked successfully");
        setLoading(false)
        onClose({linked:true});
      })
      .catch((error) => {
        setLoading(false)
        renderErrors(error.message);
      });
  };

  

  const handleSubmit = () => {
    setSettingError(true);
    if (handleValidation()) {
        saveDocumentLink();
    }
  };




  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFields({
      ...fields,
      [name]: value,
    });
  };

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;


    if (fields.docName.length == 0) {
        formIsValid = false;
        errors["docName"] = "Please select atleast one document";
    }

    setErrors(errors);
    return formIsValid;
  };
  return (
    <div>
      <Dialog
        onClose={onClose}
        title={"Add Existing Document"}
        className="small-dailog"
      >
        <div className="edit-client-popup">
          <div className="popup-modal slibling-data">
            <div className="row">
              <div>

              <MultiSelectDropDown
                label="Documents"
                onChange={handleChange}
                data={documentsData}
                value={fields.docName}
                textField="docName"
                name="docName"
                dataItemKey="documentId"
                validityStyles={settingError}
                required={true}
                error={fields.docName.length == 0 && errors.docName}
              />
            
             
              </div>
            </div>
          </div>

          {loading == true && <Loader />}
        </div>
        <div className="border-bottom-line"></div>
        <div className="d-flex my-3">
          <div className="right-sde">
            <button
              className="btn blue-primary text-white mx-3"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
          <div className="right-sde-grey">
            <button
              className="btn grey-secondary text-white "
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
export default LinkAnotherDocument;
