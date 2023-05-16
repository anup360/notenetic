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
import moment from "moment";
import { renderErrors } from "src/helper/error-message-helper";

const AttachQuestionnaire = ({
  onClose,
  clientId,
  documentId
}) => {
  const [loading, setLoading] = useState(false);
  const [questionnaireData, seQuestionnaireData] = useState([]);
  const [errors, setErrors] = useState("");
  const [settingError, setSettingError] = useState(false);

  let [fields, setFields] = useState({
    questionnaireName: ""

  });


  useEffect(() => {
    getQuestionnaireByClientId();
  }, [])


  const getQuestionnaireByClientId = async () => {
    await CommonService.getQuestionnaireByClientId(clientId)
      .then((result) => {
        const list = result.resultData.map((r) => {
          return { id: r.id, questionnaire:  " [" + moment.utc(r.utcDateCreated).local().format("M/D/YYYY") + "] " +r?.questionnaire  };
        });
        seQuestionnaireData(list);
      })
      .catch((error) => {
        renderErrors(error.message);
      });
  };


  const saveLinkedQuestionnaire = async () => {
    setLoading(true)
    let questionIds = [];
    fields.questionnaireName.map((objType) => questionIds.push(objType.id));
    await CommonService.addClientQuestionnaire(documentId, questionIds)
      .then((result) => {
        NotificationManager.success("Questionnaire linked successfully");
        setLoading(false)
        onClose({ attached: true });
      })
      .catch((error) => {
        setLoading(false)
        renderErrors(error.message);
      });
  };



  const handleSubmit = () => {
    setSettingError(true);
    if (handleValidation()) {
      saveLinkedQuestionnaire();
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


    if (fields.questionnaireName.length == 0) {
      formIsValid = false;
      errors["questionnaireName"] = "Please select atleast one questionnaire";
    }

    setErrors(errors);
    return formIsValid;
  };
  return (
    <div>
      <Dialog
        onClose={onClose}
        title={"Add Questionnaire"}
        className="small-dailog"
      >
        <div className="edit-client-popup">
          <div className="popup-modal slibling-data">
            <div className="row">
              <div>

                <MultiSelectDropDown
                  label="Questionnaire"
                  onChange={handleChange}
                  data={questionnaireData}
                  value={fields.questionnaireName}
                  textField="questionnaire"
                  name="questionnaireName"
                  dataItemKey="id"
                  validityStyles={settingError}
                  required={true}
                  error={fields.questionnaireName.length == 0 && errors.questionnaireName}
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
export default AttachQuestionnaire;
