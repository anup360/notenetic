import React, { useEffect, useState } from "react";
import CustomDrawer from "../../../../control-components/custom-drawer/custom-drawer";
import ClientHeader from "../client-header/client-header";
import addIcon from "../../../../assets/images/add.png";
import Loader from "../../../../control-components/loader/loader";
import ApiUrls from "../../../../helper/api-urls";
import ApiHelper from "../../../../helper/api-helper";
import { useSelector } from "react-redux";
import AddEmployment from "./add-employement";
import EditEmployment from "./add-employement";
import moment from "moment";
import DeleteEmployement from "./delete-employement";
import { Tooltip } from "@progress/kendo-react-tooltip";
import { Encrption } from "../../../encrption";
import useModelScroll from "../../../../cutomHooks/model-dialouge-scroll";
import { permissionEnum } from "../../../../helper/permission-helper";
import { renderErrors } from "src/helper/error-message-helper";

const EmploymentList = () => {
  const [loading, setLoading] = useState(false);
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const [isAdd, setIsAdd] = useState(false);
  const [isDeleteEmployement, setDeleteEmployement] = useState(false);
  const [isEditEmployement, setEditemployement] = useState(false);
  const [employmentList, setEmployementList] = useState([]);
  const [selectedEmployementId, setSelectedEmployementId] = useState();
  const [modelScroll, setScroll] = useModelScroll();
  const userAccessPermission = useSelector(
    (state) => state.userAccessPermission
  );

  useEffect(() => {
    getEmployement();
  }, [selectedClientId]);

  const getEmployement = () => {
    setLoading(true);
    try {
      ApiHelper.getRequest(
        ApiUrls.GET_CLIENT_EMPLOYEMENTS +
          Encrption(selectedClientId) +
          "&isActive=" +
          1 +
          ""
      ).then((response) => {
        const data = response.resultData;
        setEmployementList(data);
        setLoading(false);
      });
    } catch (err) {}
  };

  const handleAddEmployment = () => {
    setIsAdd(true);
    setScroll(true);
  };
  const handleClose = ({ added }) => {
    if (added) {
      getEmployement();
    }
    setIsAdd(false);
    setScroll(false);
  };

  const DeleteEmployementId = (id) => {
    setDeleteEmployement(!isDeleteEmployement);
    setSelectedEmployementId(id);
    if (isDeleteEmployement == false) {
      setScroll(true);
    } else {
      setScroll(false);
    }
  };

  const handleEditEmploye = (id) => {
    setEditemployement(true);
    setSelectedEmployementId(id);
    setScroll(true);
  };

  const handleCloseEdit = ({ edited }) => {
    if (edited) {
      getEmployement();
    }
    setEditemployement(false);
    setScroll(false);
  };

  return (
    <div className="d-flex flex-wrap">
      <div className="inner-dt col-md-3 col-lg-2">
        <CustomDrawer />
      </div>
      <div className="col-md-9 col-lg-10">
        <ClientHeader />
        <div className="Service-RateList">
          <div className="d-flex justify-content-between  mt-3">
            <h4 className="address-title text-grey ">
              <span className="f-24">Employment</span>
            </h4>
            {userAccessPermission[permissionEnum.EDIT_CLIENT_PROFILE] && (
              <button
                onClick={handleAddEmployment}
                className="btn blue-primary text-white text-decoration-none d-flex align-items-center "
              >
                <img src={addIcon} alt="" className="me-2 add-img" />
                Add Employment
              </button>
            )}
          </div>
          {loading === true && <Loader />}
        </div>
        {employmentList.map((item) => (
          <div className="border p-3 rounded mb-3 mt-3">
            <div className="d-flex justify-content-between">
              <span className="text-grey f-12 mb-2 d-block">
                <b>{item.designation}</b>
                <br></br>
                <br></br>
                {item.organisationName}
                <br></br>
                <br></br>
                {moment(item.jobStartDate).format("M/D/YYYY")} to{" "}
                {item.jobEndDate
                  ? moment(item.jobEndDate).format("M/D/YYYY")
                  : "current"}
                <br></br>
                <br></br>
                {item.jobResponsibilities}
              </span>
              {userAccessPermission[permissionEnum.EDIT_CLIENT_PROFILE] && (
                <div className="delete-btn">
                  <button
                    onClick={() => {
                      DeleteEmployementId(item.id);
                    }}
                    type=""
                    className="bg-transparent border-0"
                  >
                    <Tooltip anchorElement="target" position="top">
                      <i
                        className="fa fa-trash fa-xs"
                        aria-hidden="true"
                        title="Delete"
                      ></i>
                    </Tooltip>
                  </button>
                  <button
                    onClick={() => {
                      handleEditEmploye(item.id);
                    }}
                    type=""
                    className="bg-transparent border-0"
                  >
                    <Tooltip anchorElement="target" position="top">
                      <i
                        className="fa fa-pencil fa-xs"
                        aria-hidden="true"
                        title="Edit"
                      ></i>
                    </Tooltip>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {employmentList.length == 0 && !loading && (
          <div className="message-not-found mt-3">No Employment Available</div>
        )}
      </div>
      {isAdd && <AddEmployment onClose={handleClose} />}
      {isDeleteEmployement && (
        <DeleteEmployement
          onClose={DeleteEmployementId}
          selectedEmployementId={selectedEmployementId}
          getEmployement={getEmployement}
        />
      )}
      {isEditEmployement && (
        <EditEmployment
          onClose={handleCloseEdit}
          selectedEmployementId={selectedEmployementId}
        />
      )}
    </div>
  );
};

export default EmploymentList;
