import React, { useEffect, useState } from "react";
import Loader from "../../../../control-components/loader/loader";
import { Dialog } from "@progress/kendo-react-dialogs";
import NotificationManager from "react-notifications/lib/NotificationManager";
import { ClientService } from "../../../../services/clientService";
import NOTIFICATION_MESSAGE from "../../../../helper/notification-messages";
import ErrorHelper from "../../../../helper/error-helper";
import DropDownKendoRct from "../../../../control-components/drop-down/drop-down";
import InputKendoRct from "../../../../control-components/input/input";
import ApiUrls from "../../../../helper/api-urls";
import ApiHelper from "../../../../helper/api-helper";
import PhoneInputMask from "../../../../control-components/phone-input-mask/phone-input-mask";
import { renderErrors } from "src/helper/error-message-helper";

const AddEmergence = ({
  onClose,
  selectedClientId,
  selectedSibling,
  getEmergencyContact,
}) => {
  const [loading, setLoading] = useState(false);
  const [relationData, setRelationData] = useState([]);
  const [errors, setErrors] = useState("");
  const [settingError, setSettingError] = useState(false);

  let [fields, setFields] = useState({
    Name: "",
    phoneNumber: "",
    newRelations: "",
  });

  useEffect(() => {
    getRelations();
  }, []);

  const getRelations = async () => {
    await ClientService.getRelations()
      .then((result) => {
        let relationList = result.resultData;
        setRelationData(relationList);
      })
      .catch((error) => {
        renderErrors(error.message);
      });
  };

  const handleSubmit = () => {
    setSettingError(true);
    if (handleValidation()) {
      if (selectedSibling) {
        updateClientSibling();
      } else {
        addClientSibling();
      }
    }
  };

  const addClientSibling = async () => {
    setLoading(true);
    const data = {
      clientId: selectedClientId,
      contacts: [
        {
          ecName: fields.Name,
          ecPhone: fields.phoneNumber,
          relationId: fields.newRelations.id,
        },
      ],
    };
    await ApiHelper.postRequest(ApiUrls.ADD_EMERGENCY_CONTACT, data)
      .then((result) => {
        setLoading(false);
        NotificationManager.success("Emergency contact added successfully ");
        getEmergencyContact();
        onClose({ siblingAdded: true });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error);
      });
  };

  const updateClientSibling = async () => {
    setLoading(true);
    await ClientService.updateClientSibling(
      fields,
      selectedClientId,
      selectedSibling.id
    )
      .then((result) => {
        setLoading(false);
        NotificationManager.success(NOTIFICATION_MESSAGE.SIBLING_UPDATED);
        onClose({ siblingAdded: true });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFields({
      ...fields,
      [name]: value,
    });
  };

  const handleValueChange = (e) => {
    const name = e.target.name;
    const rawValue = e.target.rawValue;
    setFields({
      ...fields,
      [name]: rawValue,
    });
  };

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;

    if (!fields.Name || fields.Name.trim().length === 0) {
      formIsValid = false;
      errors["Name"] = ErrorHelper.NAME;
    }
    if (!fields.phoneNumber || fields.phoneNumber.trim().length === 0) {
      formIsValid = false;
      errors["phoneNumber"] = ErrorHelper.PHONE;
    }
    if (!fields.newRelations || !fields.newRelations.id) {
      formIsValid = false;
      errors["newRelations"] = ErrorHelper.RELATION;
    }
    setErrors(errors);
    return formIsValid;
  };
  return (
    <div>
      <Dialog
        onClose={onClose}
        title={"Add Emergency"}
        className="small-dailog"
      >
        <div className="edit-client-popup">
          <div className="popup-modal slibling-data">
            <div className="row">
              <div>
                <InputKendoRct
                  validityStyles={settingError}
                  value={fields.Name}
                  onChange={handleChange}
                  name="Name"
                  label="Name"
                  error={fields.Name == "" && errors.Name}
                  required={true}
                />
                <PhoneInputMask
                  validityStyles={settingError}
                  onChange={handleValueChange}
                  name="phoneNumber"
                  label="Phone Number"
                  value={fields?.phoneNumber}
                  error={fields.phoneNumber === "" && errors?.phoneNumber}
                  required={true}
                />
                <DropDownKendoRct
                  validityStyles={settingError}
                  label="Relations"
                  onChange={handleChange}
                  data={relationData}
                  value={fields.newRelations}
                  textField="relationName"
                  required={true}
                  suggest={true}
                  name="newRelations"
                  dataItemKey="id"
                  error={!fields.newRelations && errors.newRelations}
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
export default AddEmergence;
