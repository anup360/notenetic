import React, { useEffect, useState } from "react";
import Loader from "../../../../control-components/loader/loader";
import { useSelector } from "react-redux";
import { Dialog } from "@progress/kendo-react-dialogs";
import NotificationManager from "react-notifications/lib/NotificationManager";
import ErrorHelper from "../../../../helper/error-helper";
import DropDownKendoRct from "../../../../control-components/drop-down/drop-down";
import { ClientService } from "../../../../services/clientService";
import { SettingsService } from "../../../../services/settingsService";
import { renderErrors } from "src/helper/error-message-helper";

const AddClientFlag = ({ onClose, clientFlags }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [settingError, setSettingError] = useState(false);
  const [flagsData, setFlagsData] = useState([]);
  const clinicId = useSelector((state) => state.loggedIn.clinicId);
  const selectedClientId = useSelector((state) => state.selectedClientId);


  let [fields, setFields] = useState({
    flagName: "",
  });

  useEffect(() => {
    getClinicFlagss();
  }, []);

  const getClinicFlagss = async () => {
    await SettingsService.getClinicFlags(clinicId)
      .then((result) => {
        let list = result.resultData;
        let newArray = list.filter(
          (val) => !clientFlags.map((item) => item.flagId).includes(val.id)
        );
        setFlagsData(newArray);
      })
      .catch((error) => {
        renderErrors(error.message);
      });
  };


  const assignFlags = async () => {
    setLoading(true);
    await ClientService.assignFlagToClient(fields, selectedClientId)
      .then((result) => {
        setLoading(false);
        NotificationManager.success("Flag assign to client");
        onClose({ updated: true });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const handleSubmit = () => {
    setSettingError(true);
    if (handleValidation()) {
      assignFlags();
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
    if (!fields.flagName) {
      formIsValid = false;
      errors["flagName"] = ErrorHelper.FLAG_NAME;
    }
    setErrors(errors);
    return formIsValid;
  };

  const itemRender = (li, itemProps) => {
    const itemObj = itemProps.dataItem;
    const itemChildren = (
      <>
        <span
          className="k-scheduler-mark"
          style={{
            backgroundColor: itemObj.color,
            marginRight: 4,
          }}
        />
        <span>{itemObj.flagName}</span>
      </>
    );
    return React.cloneElement(li, li.props, itemChildren);
  };

  return (
    <div>
      <Dialog onClose={onClose} title={"Assign Flag"} className="small-dailog">
        <div className="edit-client-popup">
          <div className="popup-modal slibling-data">
            <div className="row">
              <div>
                <DropDownKendoRct
                  label="Flag Name"
                  value={fields.flagName}
                  onChange={handleChange}
                  data={flagsData}
                  textField="flagName"
                  suggest={true}
                  name="flagName"
                  dataItemKey="id"
                  required={true}
                  validityStyles={settingError}
                  error={!fields.flagName && errors.flagName}
                  placeholder="Flag Name"
                  itemRender={itemRender}
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
export default AddClientFlag;
