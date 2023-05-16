import { Dialog } from "@progress/kendo-react-dialogs";
import React, { useEffect, useState } from "react";
import NotificationManager from "react-notifications/lib/NotificationManager";
import { useSelector } from "react-redux";
import Loader from "../../../../control-components/loader/loader";
import MultiSelectDropDown from "../../../../control-components/multi-select-drop-down/multi-select-drop-down";
import ErrorHelper from "../../../../helper/error-helper";
import NOTIFICATION_MESSAGE from "../../../../helper/notification-messages";
import { ClientService } from "../../../../services/clientService";
import { renderErrors } from "src/helper/error-message-helper";

const AddSites = ({ onClose, selectedClientId, clientSites }) => {
  const [loading, setLoading] = useState(false);
  const [siteData, setSiteData] = useState([]);
  const [errors, setErrors] = useState("");
  const [settingError, setSettingError] = useState(false);
  let [fields, setFields] = useState({
    site: "",
  });
  const clinicId = useSelector((state) => state.loggedIn.clinicId);
  useEffect(() => {
    getSites();
    let newSites = [];
    if (clientSites.length > 0) {
      for (var i = 0; i < clientSites.length; i++) {
        const element = {
          id: clientSites[i].id,
          siteName: clientSites[i].name,
        };
        newSites.push(element);
      }
    }
    setFields({
      site: newSites,
    });
  }, []);

  const getSites = async () => {
    setLoading(true);
    await ClientService.getSites(clinicId)
      .then((result) => {
    setLoading(false);
        let siteList = result.resultData;
        setSiteData(siteList);
      })
      .catch((error) => {
    setLoading(false);
        renderErrors(error.message);
      });
  };

  const assignSiteToClient = async () => {
    setLoading(true);
    await ClientService.assignSiteToClient(fields, selectedClientId)
      .then((result) => {
        setLoading(false);
        NotificationManager.success(NOTIFICATION_MESSAGE.SITES_ADDED);
        onClose({ siteAdded: true });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error);
      });
  };

  const handleSubmit = () => {
    setSettingError(true);
    if (handleValidation()) {
      assignSiteToClient();
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

    if (fields.site.length == 0) {
      formIsValid = false;
      errors["site"] = ErrorHelper.ASSIGN_SITES;
    }

    setErrors(errors);
    return formIsValid;
  };

  return (
    <div>
      <Dialog onClose={onClose} title={"Add Sites"} className="small-dailog">
        <div className="edit-client-popup ">
          <div className="popup-modal">
            <div className="row">
              <MultiSelectDropDown
                label="Assign Site"
                onChange={handleChange}
                data={siteData}
                value={fields.site}
                textField="siteName"
                name="site"
                dataItemKey="id"
                validityStyles={settingError}
                required={true}
                error={fields.site.length == 0 && errors.site}
              />
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
export default AddSites;
