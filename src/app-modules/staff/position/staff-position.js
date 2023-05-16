import React, { useCallback, useEffect, useState } from "react";
import Loader from "../../../../src/control-components/loader/loader";
import DrawerContainer from "../../../control-components/custom-drawer/custom-drawer";
import InputKendoRct from "../../../control-components/input/input";
import ApiHelper from "../../../helper/api-helper";
import ApiUrls from "../../../helper/api-urls";
import { NotificationManager } from "react-notifications";
import ErrorHelper from "../../../helper/error-helper";
import DatePickerKendoRct from "../../../control-components/date-picker/date-picker";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import DiaglogEditPosition from "../position/edit-position";
import StaffProfileHeader from "../../../../src/app-modules/staff/staff-profile/staff-profile-header";
import NOTIFICATION_MESSAGE from "../../../helper/notification-messages";
import PositionList from "./list-position";
import { Encrption } from "../../encrption";
import ValidationHelper from "../../../helper/validation-helper";
import useModelScroll from "../../../cutomHooks/model-dialouge-scroll";
import { GET_STAFF_DETAILS } from "../../../actions";
import DeleteDialogModal from "../../../control-components/custom-delete-dialog-box/delete-dialog";
import { renderErrors } from "src/helper/error-message-helper";
import { Error } from "@progress/kendo-react-labels";

const StaffPosition = () => {
  const dispatch = useDispatch();
  const vHelper = ValidationHelper();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const selectedStaffId = useSelector((state) => state.selectedStaffId);
  const [idEdit, setIsEdit] = useState(false);
  const [SelectedEditId, setSelectedEditId] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [deletePosition, setDeletePosition] = useState("");
  const [staffError, setStaffError] = useState(false);
  const [modelScroll, setScroll] = useModelScroll();
  const [compError, setCompError] = useState("");


  const [handler, setHandler] = useState(false);
  const [fields, setFields] = useState({
    positionName: "",
    positionEffectiveDate: "",
    positionEndDate: "",
  });
  const getPositionList = useCallback(() => {
    setLoading(true);
    // let id=Encrption(selectedStaffId)
    ApiHelper.getRequest(ApiUrls.GET_POSITION_LIST + Encrption(selectedStaffId))
      .then((result) => {
        setLoading(false);
        setpositionList(result.resultData);
        getStaffDetail();
      })
      .catch((error) => {
        renderErrors(error.message);
      });
  }, [selectedStaffId]);

  useEffect(() => {
    getPositionList();
  }, [getPositionList]);

  const [postionList, setpositionList] = useState([]);

  const handleEdit = (positionID) => {
    setIsEdit(true);
    setSelectedEditId(positionID);
    setScroll(true);
  };

  const handleEditClose = () => {
    setIsEdit(false);
    setScroll(false);
  };

  const handleConfirm = (ID) => {
    setConfirm(true);
    setDeletePosition(ID);
    setScroll(true);
  };
  const hideConfirmPopup = () => {
    setConfirm(false);
    setDeletePosition("");
    setScroll(false);
  };

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;

    if (!fields.positionName || fields.positionName.trim().length === 0) {
      formIsValid = false;
      errors["positionName"] = ErrorHelper.POSITION_NAME;
    }
    if (!fields.positionEffectiveDate) {
      formIsValid = false;
      errors["positionEffectiveDate"] = ErrorHelper.POSITION_EFFECTIVE_DATE;
    } else if (fields.positionEffectiveDate && fields.positionEndDate) {
      let error = vHelper.startDateLessThanEndDateValidator(
        fields.positionEffectiveDate,
        fields.positionEndDate,
        "positionEffectiveDate",
        "positionEndDate"
      );
      if (error && error.length > 0) {
        setCompError(error)

        // errors["positionEffectiveDate"] = error;
        formIsValid = false;
      }
    }
    setErrors(errors);
    return formIsValid;
  };

  const handleExtraValidation = () => {
    let errors = {};
    let formIsValid = true;
    if (!fields.positionEffectiveDate) {
      formIsValid = false;
      errors["positionEffectiveDate"] = ErrorHelper.POSITION_EFFECTIVE_DATE;
    } else if (fields.positionEffectiveDate && fields.positionEndDate) {
      let error = vHelper.startDateLessThanEndDateValidator(
        fields.positionEffectiveDate,
        fields.positionEndDate,
        "positionEffectiveDate",
        "positionEndDate"
      );
      if (error && error.length > 0) {
        errors["positionEffectiveDate"] = error;
        formIsValid = false;
      }
    }
    else if (!fields.positionEffectiveDate) {
      formIsValid = true;

    }
    setErrors(errors);
    return formIsValid;
  };

  const getStaffDetail = () => {
    // setLoading(true);
    let id = Encrption(selectedStaffId);
    ApiHelper.getRequest(ApiUrls.GET_STAFF_BY_ID + id)
      .then((result) => {
        dispatch({
          type: GET_STAFF_DETAILS,
          payload: result.resultData,
        });
      })
      .catch((error) => {
        renderErrors(error.message);
      });
  };

  const savePosition = () => {
    setLoading(true);
    var data = {
      staffId: selectedStaffId,
      positionName: fields.positionName,
      effectiveDate: moment(fields.positionEffectiveDate).format("YYYY-MM-DD"),
      endDate:
        fields.positionEndDate === ""
          ? null
          : moment(fields.positionEndDate).format("YYYY-MM-DD"),
    };

    ApiHelper.postRequest(ApiUrls.POST_ADD_POSITION, data)
      .then((result) => {
        getStaffDetail();
        setLoading(false);
        NotificationManager.success(NOTIFICATION_MESSAGE.ADD_POSITION);
        getPositionList();
        hideConfirmPopup();
        setStaffError(false);
        setCompError('')
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error);
      });
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFields({
      ...fields,
      [name]: value,
    });

    if (name === "positionEffectiveDate") {
      handleExtraValidation()
    }
  };



  const handleSubmit = () => {
    setHandler(true);
    setStaffError(true);
    window.scrollTo(0, 0);
    if (handleValidation()) {
      savePosition();
      setFields({
        positionName: "",
        positionEffectiveDate: "",
        positionEndDate: "",
      });
    }
  };

  const handleDelete = () => {
    ApiHelper.deleteRequest(ApiUrls.DELETE_POSITION + Encrption(deletePosition))
      .then((result) => {
        NotificationManager.success("Position deleted successfully");
        getPositionList();
        hideConfirmPopup();
      })
      .catch((error) => {
        renderErrors(error.message);
        hideConfirmPopup();
      });
  };


  
  return (
    <div className="d-flex flex-wra">
      {loading === true && <Loader />}
      <div className="inner-dt col-md-3 col-lg-2">
        <DrawerContainer />
      </div>
      <div className="col-md-9 col-lg-10 ">
        <StaffProfileHeader />
        <div className="px-2 mt-4">
          <div className="row ">
            <div className="col-lg-4 col-md-12 mb-3">
              <h4 className="address-title text-grey pb_20">
                <span className="f-24">Positions</span>
              </h4>
              <PositionList
                postionList={postionList}
                handleEdit={handleEdit}
                handleConfirm={handleConfirm}
              />
            </div>
            <div className="col-lg-8 col-md-12 mb-3">
              <h4 className="address-title text-grey pb_20">
                <span className="f-24">Add New Position</span>
              </h4>
              <div className="Satff-dark">
                <div className="mb-3 col-lg-4 col-md-6 col-12 px-md-0">
                  <InputKendoRct
                    validityStyles={staffError}
                    value={fields.positionName}
                    onChange={handleChange}
                    name="positionName"
                    label="Position Name"
                    required={true}
                    error={fields.positionName === "" && errors.positionName}
                    placeholder="Position Name"
                  />
                </div>
                <div className="mb-3 col-lg-4 col-md-6 col-12 px-md-0">
                  <DatePickerKendoRct
                    validityStyles={staffError}
                    value={fields.positionEffectiveDate}
                    onChange={handleChange}
                    placeholder="Position Effective Date"
                    name={"positionEffectiveDate"}
                    label={"Effective Date"}
                    error={!fields.positionEffectiveDate && errors.positionEffectiveDate}
                    required={true}
                  />
                  {compError && <Error>{compError}</Error>}

                </div>
                <div className="mb-3 col-lg-4 col-md-6 col-12 px-md-0">
                  <DatePickerKendoRct
                    onChange={handleChange}
                    placeholder="Position End Date"
                    name={"positionEndDate"}
                    label={"End Date"}
                    value={fields.positionEndDate}
                  />
                </div>
                <div className="right-sde">
                  <button
                    className="btn blue-primary text-white "
                    onClick={handleSubmit}
                  >
                    Add Position
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12 col-xl-8 col-12 pt_30"></div>
      </div>
      {idEdit && (
        <DiaglogEditPosition
          stateData={postionList}
          onClose={handleEditClose}
          SelectedEditId={SelectedEditId}
          getPositionList={getPositionList}
        />
      )}
      {confirm ? (
        <DeleteDialogModal
          onClose={hideConfirmPopup}
          title="Position"
          message="position"
          handleDelete={handleDelete}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default StaffPosition;
