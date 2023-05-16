import React, { useEffect, useCallback, useState } from "react";
import Loader from "../../../../control-components/loader/loader";
import { useSelector } from "react-redux";
import { Dialog } from "@progress/kendo-react-dialogs";
import NotificationManager from "react-notifications/lib/NotificationManager";
import ErrorHelper from "../../../../helper/error-helper";
import { ClientService } from "../../../../services/clientService";
import { SettingsService } from "../../../../services/settingsService";
import MultiSelectDropDown from "../../../../control-components/multi-select-drop-down/multi-select-drop-down";
import { renderErrors } from "src/helper/error-message-helper";


const AddDocumentTags = ({ onClose, docId }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [settingError, setSettingError] = useState(false);
  const [tagsData, setTagsData] = useState([]);
  const clinicId = useSelector((state) => state.loggedIn.clinicId);
  const selectedClientId = useSelector((state) => state.selectedClientId);

  let [fields, setFields] = useState({
    tagName: "",

  });

  useEffect(() => {
    getClinicTags();
  }, []);

  const getClinicTags = async () => {
    await SettingsService.getClinicTags(clinicId)
      .then((result) => {
        let list = result.resultData;
        setTagsData(list)
      })
      .catch((error) => {
        renderErrors(error.message);
      });
  };

  const assignTags = async () => {
    setLoading(true);
    await ClientService.assignTagToClientDocument(fields, docId)
      .then((result) => {
        setLoading(false);
        NotificationManager.success("Tags assigned successfully");
        onClose({ "updated": true });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const handleSubmit = () => {
    setSettingError(true);
    if (handleValidation()) {
      assignTags();
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
    if (!fields.tagName) {
      formIsValid = false;
      errors["tagName"] = ErrorHelper.TAG_NAME;
    }
    setErrors(errors);
    return formIsValid;
  };

  const itemRender = (li, itemProps) => {
    const itemObj = itemProps.dataItem;
    const itemChildren = (
      <>
        <span className="k-scheduler-mark" style={{
          backgroundColor: itemObj.color,
          marginRight: 4
        }} />
        <span
        >
          {itemObj.tagName}
        </span>
      </>
    );
    return React.cloneElement(li, li.props, itemChildren);
  };

  return (
    <div>
      <Dialog onClose={onClose} title={"Assign Tags"} className="small-dailog">
        <div className="edit-client-popup">
          <div className="popup-modal slibling-data">
            <div className="row">
              <div>
                <MultiSelectDropDown
                  label="Tag Name"
                  onChange={handleChange}
                  data={tagsData}
                  value={fields.tagName}
                  textField="tagName"
                  name="tagName"
                  dataItemKey="id"
                  validityStyles={settingError}
                  required={true}
                  error={fields.tagName.length == 0 && errors.tagName}
                  itemRender={itemRender}
                  placeholder={"Tag Name"}
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
              Assign
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
export default AddDocumentTags;
