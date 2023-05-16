import React, { useEffect, useState } from "react";
import DatePickerKendoRct from "../../../control-components/date-picker/date-picker";
import InputKendoRct from "../../../control-components/input/input";
import { Dialog } from "@progress/kendo-react-dialogs";
import ApiHelper from "../../../helper/api-helper";
import ApiUrls from "../../../helper/api-urls";
import { NotificationManager } from "react-notifications";
import { useSelector, useDispatch } from "react-redux";
import ErrorHelper from "../../../helper/error-helper";
import NOTIFICATION_MESSAGE from "../../../helper/notification-messages";
import moment from "moment";
import { Encrption } from "../../encrption";
import Loader from "../../../control-components/loader/loader";
import ValidationHelper from "../../../helper/validation-helper";
import { GET_STAFF_DETAILS } from "../../../actions";
import { renderErrors } from "src/helper/error-message-helper";

const EditModal = ({ onClose, stateData, SelectedEditId, getPositionList }) => {
  const dispatch = useDispatch();
  const vHelper = ValidationHelper();
  const selectedStaffId = useSelector((state) => state.selectedStaffId);
  const [staffError, setStaffError] = useState(false);
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const staffInfo = useSelector((state) => state.getStaffDetails);
  const [positionData, setPositiondData] = useState({
    positionName: "",
    positionEffectiveDate: "",
    positionEndDate: "",
  });

  useEffect(() => {
    getPositionById();
  }, []);

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

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;
    if (
      !positionData.positionName ||
      positionData.positionName.trim().length === 0
    ) {
      formIsValid = false;
      errors["positionName"] = ErrorHelper.POSITION_NAME;
    }
    if (!positionData.positionEffectiveDate) {
      formIsValid = false;
      errors["positionEffectiveDate"] = ErrorHelper.POSITION_EFFECTIVE_DATE;
    } else if (
      positionData.positionEffectiveDate &&
      positionData.positionEndDate
    ) {
      let error = vHelper.startDateLessThanEndDateValidator(
        positionData.positionEffectiveDate,
        positionData.positionEndDate,
        "positionEffectiveDate",
        "positionEndDate"
      );
      if (error && error.length > 0) {
        errors["positionEffectiveDate"] = error;
        formIsValid = false;
      }
    }
    setErrors(errors);
    return formIsValid;
  };

  const getPositionById = () => {
    setLoading(true);
    ApiHelper.getRequest(ApiUrls.GET_POSITION_BY_ID + Encrption(SelectedEditId))
      .then((result) => {
        setLoading(false);
        const data = result.resultData;
        setPositiondData({
          positionName: data.positionName,
          positionEffectiveDate: new Date(data.effectiveDate),
          positionEndDate:
            data.effectiveEndDate === null
              ? ""
              : new Date(data.effectiveEndDate),
        });
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const saveEditPosition = () => {
    setLoading(true);
    var data = {
      id: SelectedEditId,
      staffId: selectedStaffId,
      positionName: positionData.positionName,
      effectiveDate: moment(positionData.positionEffectiveDate).format(
        "YYYY-MM-DD"
      ),
      effectiveEndDate: positionData.positionEndDate
        ? moment(positionData.positionEndDate).format("YYYY-MM-DD")
        : null,
    };

    ApiHelper.putRequest(ApiUrls.EDIT_POSITION, data)
      .then((result) => {
        getStaffDetail();
        NotificationManager.success(NOTIFICATION_MESSAGE.UPDATE_POSITION);
        onClose({ editable: true });
        getPositionList();
        setLoading(false);
      })
      .catch((error) => {
        renderErrors(error.message);
      });
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setPositiondData({
      ...positionData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    setStaffError(true);
    if (handleValidation()) {
      saveEditPosition();
    }
  };

  const handleCancel = () => {
    onClose();
  };
  return (
    <Dialog onClose={onClose} title={"Edit Position"} className="small-dailog ">
      <div className="py-4">
        {loading === true && <Loader />}
        <div className="mb-3 col-lg-12 col-md-12 col-12 mb-3">
          <InputKendoRct
            validityStyles={staffError}
            value={
              positionData.positionName === null
                ? ""
                : positionData.positionName
            }
            onChange={handleChange}
            name="positionName"
            label="Position Name"
            error={errors.positionName}
            required={true}
          />
        </div>
        <div className="mb-3 col-lg-12 col-md-12 col-12">
          <DatePickerKendoRct
            validityStyles={staffError}
            onChange={handleChange}
            placeholder="Position Effective Date"
            name={"positionEffectiveDate"}
            label={"Effective Date"}
            value={
              positionData.positionEffectiveDate === null
                ? ""
                : positionData.positionEffectiveDate
            }
            error={errors.positionEffectiveDate}
            required={true}
          />
        </div>
        <div className="col-lg-12 col-md-12 col-12">
          <DatePickerKendoRct
            onChange={handleChange}
            placeholder="Position End Date"
            name={"positionEndDate"}
            label={"End Date"}
            value={positionData.positionEndDate}
          />
        </div>
      </div>
      <div className="border-bottom-line"></div>
      <div className="d-flex flex-wrap mx-4 my-3">
        <button className="btn blue-primary text-white " onClick={handleSubmit}>
          Update
        </button>
        <button
          onClick={handleCancel}
          className="btn grey-secondary text-white ml-3"
        >
          Cancel
        </button>
      </div>
    </Dialog>
  );
};

export default EditModal;
