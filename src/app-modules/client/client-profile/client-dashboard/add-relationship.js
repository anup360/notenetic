import { Dialog } from "@progress/kendo-react-dialogs";
import { RadioGroup } from "@progress/kendo-react-inputs";
import React, { useEffect, useState } from "react";
import NotificationManager from "react-notifications/lib/NotificationManager";
import DropDownKendoRct from "../../../../control-components/drop-down/drop-down";
import InputKendoRct from "../../../../control-components/input/input";
import Loader from "../../../../control-components/loader/loader";
import ErrorHelper from "../../../../helper/error-helper";
import NOTIFICATION_MESSAGE from "../../../../helper/notification-messages";
import { ClientService } from "../../../../services/clientService";
import {useSelector } from "react-redux";
import { renderErrors } from "src/helper/error-message-helper";

const radioData = [
  {
    label: "Add the existing client",
    value: "existing",
  },
  {
    label: "New Relation",
    value: "new",
  },
];

const AddSiblings = ({ onClose, selectedClientId, selectedSibling }) => {
  const clientDetails = useSelector(
    (state) => state.clientDetails
  );
  const [loading, setLoading] = useState(false);
  const [relationData, setRelationData] = useState([]);
  const [clientData, setClientData] = useState([]);
  const filterClientList=clientData.filter((item)=>item.clientId != clientDetails.id)
  const [errors, setErrors] = useState("");
  const [settingError, setSettingError] = useState(false);
  const [checked, setChecked] = React.useState(radioData[0].value);

  let [fields, setFields] = useState({
    existingRelations: "",
    newRelations: "",
    firstName: "",
    lastName: "",
    sibClient: "",
  });
  useEffect(() => {
    getRelations();
    getClientsDDL();

    if (selectedSibling) {
      getSiblingById();
    }
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

  const getClientsDDL = async () => {
    await ClientService.getClientsDDL()
      .then((result) => {
        let clientListing = result.resultData;
        setClientData(clientListing);
      })
      .catch((error) => {
        renderErrors(error.message);
      });
  };

  const getSiblingById = async () => {
    setLoading(true);
    await ClientService.getClientSiblingById(selectedSibling?.id)
      .then((result) => {
        setLoading(false);
        let siblingInfo = result.resultData;
        if (siblingInfo) {
          const relationDetail = {
            id: siblingInfo.relationId,
            relationName: siblingInfo.relationName,
          };
          const sibClientDetail = {
            clientId: siblingInfo.sibClientId,
            clientName: siblingInfo.fName + " " + siblingInfo.lName,
          };

          if (siblingInfo.sibClientId !== 0) {
            setChecked("existing");
          } else {
            setChecked("new");
          }
          setFields({
            ...fields,
            existingRelations:
              siblingInfo.sibClientId == 0 ? "" : relationDetail,
            newRelations: siblingInfo.sibClientId !== 0 ? "" : relationDetail,
            firstName: siblingInfo.sibFirstName,
            lastName: siblingInfo.sibLastName,
            sibClient: siblingInfo.sibClientId !== 0 && sibClientDetail,
          });
        }
      })
      .catch((error) => {
        setLoading(false);
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
    await ClientService.addClientSibling(fields, checked, selectedClientId)
      .then((result) => {
        setLoading(false);
        NotificationManager.success(NOTIFICATION_MESSAGE.SIBLING_ADDED);
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
      checked,
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

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;

    if (checked === "new") {
      if (!fields.firstName || fields.firstName.trim().length === 0) {
        formIsValid = false;
        errors["firstName"] = ErrorHelper.FIRST_NAME;
      }
      if (!fields.lastName || fields.lastName.trim().length === 0) {
        formIsValid = false;
        errors["lastName"] = ErrorHelper.LAST_NAME;
      }
      if (!fields.newRelations || !fields.newRelations.id) {
        formIsValid = false;
        errors["newRelations"] = ErrorHelper.RELATION;
      }
    } else {
      if (!fields.sibClient || !fields.sibClient.clientId) {
        formIsValid = false;
        errors["sibClient"] = ErrorHelper.SIB_CLIENT;
      }
      if (!fields.existingRelations || !fields.existingRelations.id) {
        formIsValid = false;
        errors["existingRelations"] = ErrorHelper.RELATION;
      }
    }
    setErrors(errors);
    return formIsValid;
  };

  const handleRadioChange = (e) => {
    setChecked(e.value);
  };

  return (
    <div>
      <Dialog
        onClose={onClose}
        title={!selectedClientId ? "Add Relationship" : "Edit Relationship"}
        className="small-dailog"
      >
        <div className="edit-client-popup">
          <div className="popup-modal slibling-data">
            <div className="row">
              <RadioGroup
                data={radioData}
                value={checked}
                onChange={handleRadioChange}
              />

              {checked == "new" ? (
                <div className="col-md-12">
                  <InputKendoRct
                    validityStyles={settingError}
                    value={fields.firstName}
                    onChange={handleChange}
                    name="firstName"
                    label="First Name"
                    error={fields.firstName == "" && errors.firstName}
                    required={true}
                  />
                  <InputKendoRct
                    validityStyles={settingError}
                    value={fields.lastName}
                    onChange={handleChange}
                    required={true}
                    name="lastName"
                    label="Last Name"
                    error={fields.lastName == "" && errors.lastName}
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
                    placeholder="Relations"
                  />
                </div>
              ) : (
                <div>
                  <DropDownKendoRct
                    validityStyles={settingError}
                    label="Client"
                    onChange={handleChange}
                    data={filterClientList}
                    value={fields.sibClient}
                    textField="clientName"
                    required={true}
                    suggest={true}
                    dataItemKey="clientId"
                    name="sibClient"
                    error={!fields.sibClient && errors.sibClient}
                    placeholder="Client"
                  />
                  <DropDownKendoRct
                    validityStyles={settingError}
                    label="Relations"
                    onChange={handleChange}
                    data={relationData}
                    value={fields.existingRelations}
                    textField="relationName"
                    required={true}
                    suggest={true}
                    name="existingRelations"
                    dataItemKey="id"
                    placeholder="Relations"
                    error={
                      !fields.existingRelations && errors.existingRelations
                    }
                  />
                </div>
              )}
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
export default AddSiblings;
