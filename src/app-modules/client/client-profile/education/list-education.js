import React, { useEffect, useState } from "react";
import CustomDrawer from "../../../../control-components/custom-drawer/custom-drawer";
import ClientHeader from "../client-header/client-header";
import addIcon from "../../../../assets/images/add.png";
import Loader from "../../../../control-components/loader/loader";
import ApiUrls from "../../../../helper/api-urls";
import ApiHelper from "../../../../helper/api-helper";
import { useSelector } from "react-redux";
import { NotificationManager } from "react-notifications";
import { Tooltip } from "@progress/kendo-react-tooltip";
import DeleteEducation from "./delete-education";
import EditEducation from "./add-education";
import AddEducation from "./add-education";
import { Encrption } from "../../../encrption";
import useModelScroll from "../../../../cutomHooks/model-dialouge-scroll";
import { permissionEnum } from "../../../../helper/permission-helper";
import { renderErrors } from "src/helper/error-message-helper";

const EducationList = () => {
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const [isAdd, setIsAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [educationList, setEducationList] = useState([]);
  const [deleteEducation, setDeleteEducation] = useState(false);
  const [editEducation, setEditEducation] = useState(false);
  const [SelectedEducationId, setSelectedEducationId] = useState();
  const [modelScroll, setScroll] = useModelScroll();
  const userAccessPermission = useSelector((state) => state.userAccessPermission);

  useEffect(() => {
    getEducationList();
  }, [selectedClientId]);

  const getEducationList = () => {
    setLoading(true);
    ApiHelper.getRequest(
      ApiUrls.GET_CLIENT_EDUCATION +
      Encrption(selectedClientId) +
      "&isActive=" +
      1 +
      ""
    )
      .then((result) => {
        setLoading(false);
        setEducationList(result.resultData);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const handleClose = ({ added }) => {
    if (added) {
      getEducationList();
    }

    setIsAdd(false);
    setScroll(false);
  };

  const handleCloseEdit = ({ edited }) => {
    if (edited) {
      getEducationList();
    }

    setEditEducation(false);
    setScroll(false);
  };

  const deleteEducationId = (id) => {
    setDeleteEducation(!deleteEducation);
    setSelectedEducationId(id);
    if (deleteEducation == false) {
      setScroll(true);
    } else {
      setScroll(false);
    }
  };

  const handleAddEducation = () => {
    setIsAdd(true);
    setScroll(true);
  };

  const handleEditEducation = (id) => {
    setEditEducation(true);
    setSelectedEducationId(id);
    setScroll(true);
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
              <span className="f-24">Education</span>
            </h4>
            {userAccessPermission[permissionEnum.EDIT_CLIENT_PROFILE] &&

              <button
                onClick={handleAddEducation}
                className="btn blue-primary text-white text-decoration-none d-flex align-items-center "
              >
                <img src={addIcon} alt="" className="me-2 add-img" />
                Add Education
              </button>
            }
          </div>
          {loading === true && <Loader />}
          {educationList.map((item) => {
            return (
              <div className="border p-3 rounded mb-3 mt-3">
                <div className="d-flex justify-content-between">
                  <span className="text-grey f-12 mb-2 d-block">
                    <b>Education Name:</b> {item.educationLevel}
                    <br></br>
                    <br></br>
                    <b>Degree:</b> {item.degree}
                    <br></br>
                    <br></br>
                    <b>Year of completion:</b> {item.yearOfPassing}
                    <br></br>
                    <br></br>
                    <b>Grade:</b> {item.gradePercentage}
                  </span>
                  {userAccessPermission[permissionEnum.EDIT_CLIENT_PROFILE] &&

                    <div className="delete-btn">
                      <button
                        onClick={() => {
                          deleteEducationId(item.id);
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
                          handleEditEducation(item.id);
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
                  }
                </div>
              </div>
            );
          })}
          {educationList.length == 0 && !loading && (
            <div className="message-not-found mt-3">No Education Available</div>
          )}
        </div>
      </div>
      {isAdd && <AddEducation onClose={handleClose} />}
      {deleteEducation && (
        <DeleteEducation
          onClose={deleteEducationId}
          id={SelectedEducationId}
          getEducationList={getEducationList}
        />
      )}
      {editEducation && (
        <EditEducation
          onClose={handleCloseEdit}
          selectedId={SelectedEducationId}
        />
      )}
    </div>
  );
};

export default EducationList;
