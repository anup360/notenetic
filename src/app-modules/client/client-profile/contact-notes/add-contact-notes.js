import { Dialog } from "@progress/kendo-react-dialogs";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import DatePickerKendoRct from "../../../../control-components/date-picker/date-picker";
import DropDownKendoRct from "../../../../control-components/drop-down/drop-down";
import TextAreaKendoRct from "../../../../control-components/kendo-text-area/kendo-text-area";
import Loader from "../../../../control-components/loader/loader";
import TimePickerKendoRct from "../../../../control-components/time-picker/time-picker";
import ApiHelper from "../../../../helper/api-helper";
import ApiUrls from "../../../../helper/api-urls";
import AppRoutes from "../../../../helper/app-routes";
import ErrorHelper from "../../../../helper/error-helper";
import { ClientService } from "../../../../services/clientService";
import { Encrption } from "../../../encrption";
import ValidationHelper from "../../../../helper/validation-helper";
import { renderErrors } from "src/helper/error-message-helper";

const AddContactNotes = ({
  onClose,
  orgStaffList,
  getContactNotes,
  selectedContactId,
}) => {
  const vHelper = ValidationHelper();
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [settingError, setSettingError] = useState(false);
  const [relationData, setRelationData] = useState([]);
  const [communicationMethod, setCommunicationMethod] = useState([]);
  const navigate = useNavigate();
  const [fields, setFields] = useState({
    contactedByStaffId: "",
    newRelations: "",
    dateOfContact: "",
    timeOfContact: "",
    methodOfContact: "",
    contactNotes: "",
  });

  useEffect(() => {
    getCommunicationMethod();
    getRelations();
    if (selectedContactId) {
      getConatctNotesById();
    }
  }, [orgStaffList]);

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

  const getConatctNotesById = async () => {
    setLoading(true);
    ApiHelper.getRequest(
      ApiUrls.GET_CONTACT_NOTES_BY_ID + Encrption(selectedContactId)
    )
      .then((result) => {
        const data = result.resultData;
        const staffId = {
          id: data.contactedByStaffId,
          name: data.contactedByStaffName,
        };
        const relation = {
          id: data.relationId,
          relationName: data.relationName,
        };
        const contact = {
          id: data.methodOfContact,
          name: data.methodOfContactName,
        };
        setFields({
          contactedByStaffId: staffId,
          newRelations: relation,
          dateOfContact: data.dateOfContact ? new Date(data.dateOfContact) : "",
          timeOfContact: data.timeOfContact ? new Date(data.dateOfContact) : "",
          // ? new Date(data.timeOfContact)
          // : "",
          methodOfContact: contact,
          contactNotes: data.contactNotes,
        });
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const getCommunicationMethod = () => {
    ApiHelper.getRequest(ApiUrls.GET_COMMUNICATION_METHODS)
      .then((result) => {
        setCommunicationMethod(result.resultData);
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

  const handleTextChange = (e) => {
    const name = e.target.name;
    const value = e.value;
    setFields({
      ...fields,
      [name]: value,
    });
  };
  const saveTask = async () => {
    setLoading(true);
    const data = {
      clientId: selectedClientId,
      contactedByStaffId: fields.contactedByStaffId.id,
      relationId: fields.newRelations.id,
      dateOfContact:
        fields.dateOfContact === ""
          ? null
          : moment(fields.dateOfContact).format("YYYY-MM-DD"),
      timeOfContact:
        fields.timeOfContact === ""
          ? null
          : moment(fields.timeOfContact).format("HH:mm:ss"),
      methodOfContact: fields.methodOfContact.id,
      contactNotes: fields.contactNotes,
    };

    await ApiHelper.postRequest(ApiUrls.INSERT_CONTACT_NOTES, data)
      .then((result) => {
        setLoading(false);
        NotificationManager.success("Contact  added successfully");
        onClose({ added: true });
        getContactNotes();
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error);
      });
  };

  const updateTask = async () => {
    setLoading(true);
    const data = {
      id: selectedContactId,
      clientId: selectedClientId,
      contactedByStaffId: fields.contactedByStaffId.id,
      relationId: fields.newRelations.id,
      dateOfContact:
        fields.dateOfContact === ""
          ? null
          : moment(fields.dateOfContact).format("YYYY-MM-DD"),
      timeOfContact:
        fields.timeOfContact === ""
          ? null
          : moment(fields.timeOfContact).format("HH:mm:ss"),
      methodOfContact: fields.methodOfContact.id,
      contactNotes: fields.contactNotes,
    };

    await ApiHelper.putRequest(ApiUrls.UPDATE_CONTACT_NOTES, data)
      .then((result) => {
        setLoading(false);
        NotificationManager.success("Contact note updated successfully");
        navigate(AppRoutes.CLIENT_CONTACT_NOTES);
        onClose({ added: true });
        getContactNotes();
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error);
      });
  };

  const handleSubmit = () => {
    setSettingError(true);
    if (handleValidation()) {
      if (selectedContactId) {
        updateTask();
      } else {
        saveTask();
      }
    }
  };

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;

    if (!fields.contactedByStaffId) {
      formIsValid = false;
      errors["contactedByStaffId"] = ErrorHelper.FIELD_BLANK;
    }

    if (!fields.newRelations) {
      formIsValid = false;
      errors["newRelations"] = ErrorHelper.FIELD_BLANK;
    }

    // if (!fields.dateOfContact) {
    //   let error = vHelper.startDateLessThanEndDateValidator(
    //     new Date(),
    //     fields.jobEndDate,
    //     "jobStartDate",
    //     "dateOfContact"
    //   );
    //   if (error && error.length > 0) {
    //     errors["dateOfContact"] = error;
    //     formIsValid = false;
    //   }
    // }
    if (!fields.dateOfContact) {
      formIsValid = false;
      errors["dateOfContact"] = ErrorHelper.FIELD_BLANK;
    }
    if (!fields.timeOfContact) {
      formIsValid = false;
      errors["timeOfContact"] = ErrorHelper.FIELD_BLANK;
    }
    if (!fields.methodOfContact) {
      formIsValid = false;
      errors["methodOfContact"] = ErrorHelper.FIELD_BLANK;
    }
    if (!fields.contactNotes) {
      formIsValid = false;
      errors["contactNotes"] = ErrorHelper.FIELD_BLANK;
    }
    setErrors(errors);
    return formIsValid;
  };

  return (
    <Dialog
      onClose={onClose}
      title={selectedContactId ? "Edit Contact Note" : "Add Contact Note"}
      className="small-dailog"
    >
      <div className="edit-client-popup d-flex flex-wrap">
        <div className="col-md-12 col-lg-6 col-12 mb-4">
          <DropDownKendoRct
            validityStyles={settingError}
            data={orgStaffList}
            onChange={handleChange}
            value={fields.contactedByStaffId}
            textField="name"
            label="Contacted by"
            dataItemKey="id"
            name="contactedByStaffId"
            required={true}
            error={!fields.contactedByStaffId && errors.contactedByStaffId}
            placeholder="Contacted by"
          />
        </div>
        <div className="col-md-12 col-lg-6 col-12 mb-4">
          <DropDownKendoRct
            validityStyles={settingError}
            label="Contacted to"
            onChange={handleChange}
            data={relationData}
            value={fields.newRelations}
            textField="relationName"
            required={true}
            suggest={true}
            name="newRelations"
            dataItemKey="id"
            error={!fields.newRelations && errors.newRelations}
            placeholder="Contacted to"
          />
        </div>
        <div className="col-md-6 col-lg-6 col-12 mb-4 ">
          <DatePickerKendoRct
            validityStyles={settingError}
            onChange={handleChange}
            placeholder="Date of Contact"
            name={"dateOfContact"}
            label={"Date of Contact"}
            value={fields.dateOfContact}
            required={true}
            error={!fields.dateOfContact && errors.dateOfContact}
            max={new Date()}
          />
        </div>
        <div className="col-md-6 col-lg-6 col-12 mb-4">
          <TimePickerKendoRct
            validityStyles={settingError}
            onChange={handleChange}
            placeholder="Time of Contact"
            name={"timeOfContact"}
            label={"Time of Contact"}
            value={fields.timeOfContact}
            required={true}
            error={!fields.timeOfContact && errors.timeOfContact}
          />
        </div>

        <div className="col-md-12 col-lg-12 col-12 mb-4">
          <DropDownKendoRct
            validityStyles={settingError}
            label="Method of Contact"
            onChange={handleChange}
            data={communicationMethod}
            value={fields.methodOfContact}
            textField="name"
            required={true}
            suggest={true}
            name="methodOfContact"
            dataItemKey="id"
            error={!fields.methodOfContact && errors.methodOfContact}
            placeholder="Method of Contact"
          />
        </div>

        <div className="col-md-12 col-lg-12 col-12 ">
          <TextAreaKendoRct
            validityStyles={settingError}
            name="contactNotes"
            txtValue={fields.contactNotes}
            onChange={handleTextChange}
            label="Contact note"
            error={!fields.contactNotes && errors.contactNotes}
            required={settingError}
          />
        </div>
      </div>

      {loading == true && <Loader />}
      <div className="border-bottom-line"></div>

      <div className="d-flex my-3 mx-3">
        <div>
          <button
            onClick={handleSubmit}
            className="btn blue-primary text-white  mx-3"
          >
            {selectedContactId ? "Update" : "Add"}
          </button>
        </div>
        <div>
          <button className="btn grey-secondary text-white" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default AddContactNotes;
