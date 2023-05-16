import React, { useState } from "react";
import { useNavigate } from "react-router";
import ApiUrls from "../../helper/api-urls";
import ErrorHelper from "../../helper/error-helper";
import { NotificationManager } from "react-notifications";
import ApiHelper from "../../helper/api-helper";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import APP_ROUTES from "../../helper/app-routes";
import Loader from "../../control-components/loader/loader";
import {
  ExpansionPanel,
  ExpansionPanelContent,
} from "@progress/kendo-react-layout";
import AddClient from "./client-profile/demographics/demographics";
import AddInsurance from "./client-profile/insurance/add-insurance";
import AddClientSettings from "./client-profile/settings/settings";
import { SELECTED_CLIENT_ID } from "../../actions";
import { CLIENT_INSURANCE_ID } from "../../actions";
import { ClientService } from "../../services/clientService";
import NOTIFICATION_MESSAGE from "../../helper/notification-messages";
import ValidationHelper from "../../helper/validation-helper";
import useDateCheck from "../../cutomHooks/date-check/date-check";
import useModelScroll from "../../cutomHooks/model-dialouge-scroll";
import AddEligibility from "./eligibility/add-eligibility";
import ListEligibility from "./eligibility/dialouge-list-eligibility";
import { renderErrors } from "src/helper/error-message-helper";


const Client = () => {
  const vHelper = ValidationHelper();
  const navigate = useNavigate();
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [expDemographics, setExpDemographics] = React.useState(true);
  const [expInsurance, setExpInsurance] = React.useState(true);
  const [expSettings, setExpSettings] = React.useState(true);
  const clinicId = useSelector((state) => state.loggedIn.clinicId);
  const [settingError, setSettingError] = useState(false);
  const [mobilePhone, setMobilePhone] = useState("");
  const [dateChecker, setDateCheck] = useDateCheck();
  const [isAddEligibility, setAddEligibility] = useState(false);
  const [modelScroll, setScroll] = useModelScroll();
  const [viewEligibility, setViewEligibility] = useState(false);

  const [eligibilityInfo, setEligibilityInfo] = useState([]);

  const [fields, setFields] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    addressOne: "",
    addressTwo: "",
    mobilePhone: "",
    email: "",
    dob: "",
    city: "",
    state: "",
    zip: "",
    raceId: "",
    socialSecurityNumber: "",
    gender: "",
    nickName: "",
    site: "",
    startDate: "",
    endDate: "",
    policyNumber: "",
    insuranceType: "",
    goToProfile: false,
  });

  const handleSubmit = (event) => {
    setDateCheck(fields.dob);
    setSettingError(true);
    if (handleValidation()) {
      saveClient();
      window.scrollTo(0, 0);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const saveClient = async () => {
    setLoading(true);
    await ClientService.saveClient(fields, clinicId)
      .then((result) => {
        let clientId = result.resultData.clientId;
        saveInsurance(clientId);
        dispatch({
          type: SELECTED_CLIENT_ID,
          payload: result.resultData.clientId,
        });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error);
      });
  };

  const saveInsurance = async (clientId) => {
    let newClientId = clientId;
    await ClientService.saveInsurance(fields, clientId)
      .then((result) => {
        assignSiteToClient(newClientId);
        dispatch({
          type: CLIENT_INSURANCE_ID,
          payload: result.resultData.clientInsuranceId,
        });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error);
      });
  };

  const assignSiteToClient = async (clientId) => {
    await ClientService.assignSiteToClient(fields, clientId)
      .then((result) => {
        setLoading(false);
        NotificationManager.success(NOTIFICATION_MESSAGE.CLIENT_CREATED);
        if (fields.goToProfile == true) {
          navigate(APP_ROUTES.CLIENT_DASHBOARD);
        } else {
          navigate(APP_ROUTES.GET_CLIENT);
        }
        setFields({
          ...fields,
          firstName: "",
          lastName: "",
          addressOne: "",
          addressTwo: "",
          mobilePhone: "",
          email: "",
          dob: "",
          city: "",
          state: "",
          zip: "",
          socialSecurityNumber: "",
          gender: "",
          nickName: "",
          recordId: "",
          startDate: "",
          endDate: "",
          policyNumber: "",
          insuranceType: "",
        });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const handleValidation = () => {
    let errors = {};

    let formIsValid = true;
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var pattern = new RegExp(/^[0-9\b]+$/);

    if (!fields.addressOne || fields.addressOne.trim().length === 0) {
      formIsValid = false;
      errors["addressOne"] = ErrorHelper.ADDRESS_LINE_ONE;
    }

    if (!fields.firstName || fields.firstName.trim().length === 0) {
      formIsValid = false;
      errors["firstName"] = ErrorHelper.FIRST_NAME;
    }
    if (!fields.lastName || fields.lastName.trim().length === 0) {
      formIsValid = false;
      errors["lastName"] = ErrorHelper.LAST_NAME;
    }
    if (!fields.dob) {
      formIsValid = false;
      errors["dob"] = ErrorHelper.DOB;
    }
    if (dateChecker === true) {
      formIsValid = false;
      errors["dob"] = ErrorHelper.DATE_CHECK;
    } else if (fields.dob && fields.startDate) {
      let error = vHelper.startDateLessThanEndDateValidator(
        fields.dob,
        fields.startDate,
        "dob",
        "startDate"
      );
      if (error && error.length > 0) {
        errors["dob"] = error;
        formIsValid = false;
      }
    }

 
    if (!fields.mobilePhone || fields.mobilePhone.trim().length !== 10) {
      formIsValid = false;
      errors["mobilePhone"] = ErrorHelper.MOBILE_PHONE;
    }

    if (!emailPattern.test(fields.email)) {
      formIsValid = false;
      errors["email"] = ErrorHelper.INVALID_EMAIL;
    }
    if (!fields.email || fields.email.trim().length === 0) {
      formIsValid = false;
      errors["email"] = ErrorHelper.EMAIL;
    }

    if (!fields.city || fields.city.trim().length === 0) {
      formIsValid = false;
      errors["city"] = ErrorHelper.CITY;
    }
    if (!fields.state || !fields.state.id) {
      formIsValid = false;
      errors["state"] = ErrorHelper.STATE;
    }

    if (!fields.zip || fields.zip.trim().length === 0) {
      formIsValid = false;
      errors["zip"] = ErrorHelper.ZIP_CODE;
    }

    if (!fields.gender || !fields.gender.id) {
      formIsValid = false;
      errors["gender"] = ErrorHelper.GENDER;
    }
    if (!fields.raceId || !fields.raceId.id) {
      formIsValid = false;
      errors["raceId"] = ErrorHelper.RACE;
    }

    if (!fields.startDate) {
      formIsValid = false;
      errors["startDate"] = ErrorHelper.START_DATE;
    } else if (fields.startDate && fields.endDate) {
      let error = vHelper.startDateLessThanEndDateValidator(
        fields.startDate,
        fields.endDate,
        "StartDate",
        "EndDate"
      );
      if (error && error.length > 0) {
        errors["startDate"] = error;
        formIsValid = false;
      }
    }
    if (!fields.policyNumber || fields.policyNumber.trim().length === 0) {
      formIsValid = false;
      errors["policyNumber"] = ErrorHelper.POLICY;
    }
    if (!fields.insuranceType) {
      formIsValid = false;
      errors["insuranceType"] = ErrorHelper.INSURANCE_TYPE;
    }
    if (!fields.endDate) {
      formIsValid = false;
      errors["endDate"] = ErrorHelper.END_DATE;
    }
    if (!fields.site) {
      formIsValid = false;
      errors["site"] = ErrorHelper.ASSIGN_SITES;
    }

    setErrors(errors);
    return formIsValid;
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


  const handleAddEligibility =()=>{
    setAddEligibility(true);
    setScroll(true);
  }

  const handleCloseElig =({isAdded})=>{
    if(isAdded){
      setAddEligibility(false);
    }else{
      setAddEligibility(false);
      setScroll(false);
    }
   
  }

  const handleCloseViewElig =()=>{
    setViewEligibility(false);
    setScroll(false);
  }

  return (
    <div className="client-accept accordition-list">
      <div className="notenetic-container">
        <div className="row mx-0"> 
        
          <div onKeyDown={(e) => setExpDemographics(!e.expanded)}>
            <ExpansionPanel
              title="Demographics"
              expanded={expDemographics}
              onAction={(e) => setExpDemographics(!e.expanded)}
            >
              
              {expDemographics && (
                <ExpansionPanelContent>
                  <div onKeyDown={(e) => e.stopPropagation()}>
                    <AddClient
                      mobilePhone={mobilePhone}
                      handleValueChange={handleValueChange}
                      handleChange={handleChange}
                      fields={fields}
                      setFields={setFields}
                      errors={errors}
                      settingError={settingError}
                    />
                  </div>
                </ExpansionPanelContent>
              )}
            </ExpansionPanel>
            
          </div>
          <div onKeyDown={(e) => setExpInsurance(!e.expanded)}>
            <ExpansionPanel
              title="Insurance Information"
              expanded={expInsurance}
              onAction={(e) => setExpInsurance(!e.expanded)}
            >
              {expInsurance && (
                <ExpansionPanelContent>
                  <div onKeyDown={(e) => e.stopPropagation()}>
                    <AddInsurance
                      handleChange={handleChange}
                      fields={fields}
                      setFields={setFields}
                      errors={errors}
                      settingError={settingError}
                    />
                  </div>
                </ExpansionPanelContent>
              )}
            </ExpansionPanel>
          </div>
          <div onKeyDown={(e) => setExpSettings(!e.expanded)}>
            <ExpansionPanel
              title="Settings & Actions"
              expanded={expSettings}
              onAction={(e) => setExpSettings(!e.expanded)}
            >
              {expSettings && (
                <ExpansionPanelContent>
                  <AddClientSettings
                    handleChange={handleChange}
                    fields={fields}
                    setFields={setFields}
                    errors={errors}
                    settingError={settingError}
                  />
                </ExpansionPanelContent>
              )}
            </ExpansionPanel>
          </div>
        </div>
        {loading == true && <Loader />}

        <div className="row mx-1">
          <div className="d-flex">
            <div>
              <button
                className="btn blue-primary text-white  mx-3"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
            <div>
              <button
                className="btn grey-secondary text-white"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
            <div>
              <button
                className="btn blue-primary text-white  mx-3"
                onClick={handleAddEligibility}
              >
                Check Eligibility
              </button>
            </div>
          </div>
        </div>
      </div>


      {
        isAddEligibility &&
         <AddEligibility
         onClose={handleCloseElig}
         setViewEligibility={setViewEligibility}
         setEligibilityInfo={setEligibilityInfo}
         />
      }

      {
        viewEligibility &&
        <ListEligibility
        onClose={handleCloseViewElig}
        eligibilityInfo={eligibilityInfo}
        />
      }
    </div>
  );
};
export default Client;
