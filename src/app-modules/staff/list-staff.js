/**
 * App.js Layout Start Here
 */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { NotificationManager } from "react-notifications";
import ApiUrls from "../../helper/api-urls";
import AppRoutes from "../../helper/app-routes";
import ApiHelper from "../../helper/api-helper";
import { SELECTED_STAFF_ID } from "../../actions";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardActions,
  CardSubtitle,
  Avatar,
} from "@progress/kendo-react-layout";
import { Input } from "@progress/kendo-react-inputs";
import addIcon from "../../assets/images/add.png";
import searchIcon from "../../assets/images/search.png";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import Loader from "../../control-components/loader/loader";
import { Checkbox } from "@progress/kendo-react-inputs";
import { Switch } from "@progress/kendo-react-inputs";
import dummyImg from "../../assets/images/dummy-img.png";
import StaffTableList from "./table-list-staff";
import { useDispatch, useSelector } from "react-redux";
import { Encrption } from "../encrption";
import { GET_ROLE_PERMISSIONS } from '../../actions/authActions'
import { permissionEnum } from "../../helper/permission-helper";
import { renderErrors } from "src/helper/error-message-helper";

const StaffList = () => {
  const options = [
    { value: "table", text: "table view" },
  ];
  const staffId = useSelector((state) => state.loggedIn?.staffId);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [staffData, setStaffData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchApiQuery, setsearchApiQuery] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [staffType, setStaffType] = useState(false);
  const [deleteUser, setDeleteUser] = useState("");
  const [dropdownSelect, setDropdownSelect] = useState(options[0].value);
  const userAccessPermission = useSelector((state) => state.userAccessPermission);


  const renderAPI = (hitted) => {
    if (hitted) {
      getStaff(!staffType);
    }
  };

  useEffect(() => {
    getStaff(!staffType);
    getStaffSettingList()
  }, []);

  const getStaffSettingList = () => {
    setLoading(true);
    let id = Encrption(staffId);
    ApiHelper.getRequest(ApiUrls.GET_STAFF_SETTING + id)
      .then((result) => {
        const data = result.resultData;
        dispatch({
          type: GET_ROLE_PERMISSIONS,
          payload: result.resultData
        });
        setLoading(false);
      })
      .catch((error) => {
        renderErrors(error.message);
        setLoading(false);
      });
  };

  const getStaff = (e) => {
    setLoading(true);
    ApiHelper.postRequest(ApiUrls.GET_STAFF_LIST + e)
      .then((result) => {
        setStaffData(result.resultData);
        setsearchApiQuery(result.resultData);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error);
      });
  };
  const viewStaff = (obj) => {
    dispatch({
      type: SELECTED_STAFF_ID,
      payload: obj.id,
    });
    navigate(AppRoutes.STAFF_PROFILE);
  };
  const handleAddStaff = (e) => {
    e.preventDefault();
    navigate(AppRoutes.ADD_STAFF);
  };
  const showConfirmPopup = (obj) => {
    setShowConfirm(true);
    setDeleteUser(obj);
  };
  const hideConfirmPopup = () => {
    setShowConfirm(false);
    setDeleteUser("");
  };
  const InactiveStaff = () => {
    setLoading(true);
    ApiHelper.deleteRequest(ApiUrls.DELETE_STAFF + deleteUser.id)
      .then((result) => {
        setLoading(false);
        // NotificationManager.success(result.message);
        getStaff(!staffType);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
    hideConfirmPopup();
  };
  const activeStaff = () => {
    setLoading(true);
    ApiHelper.getRequest(ApiUrls.ACTIVE_STAFF + deleteUser.id)
      .then((result) => {
        setLoading(false);
        getStaff(!staffType);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
    hideConfirmPopup();
  };

  const handleFilter = (e) => {
    if (e.target.value === "") {
      setStaffData(searchApiQuery);
    } else {
      const filterResult = searchApiQuery.filter(
        (item) =>
          item.firstName.toLowerCase().includes(e.target.value.toLowerCase()) ||
          item.lastName.toLowerCase().includes(e.target.value.toLowerCase()) ||
          item.roleName.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setStaffData(filterResult);
    }
    setSearchQuery(e.target.value);
  };

  const handleSwitch = (e) => {
    var changeVal = e.target.value;
    setStaffType(changeVal);
    getStaff(!changeVal);
  };

  const handleChange = (event) => {
    setDropdownSelect(event.target.value);
  };
  return (
    <div className="tabs-nurse-dt">
      <div className="top-bar-show-list">
        <h4 className="address-title text-grey  ml-3">
          <span className="f-24">Staff</span>
        </h4>
        <div className="d-flex flex-wrap justify-content-between align-items-center">
          <div className="filter col-md-10 d-flex align-items-center">

            <div className="content-search-filter">
              <img src={searchIcon} alt="" className="search-icon" />
              <Input
                className="icon-searchinput"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => handleFilter(e)}
              />
            </div>

            <div className="px-1  switch-on mx-auto">
              <Switch
                onChange={handleSwitch}
                checked={staffType}
                onLabel={""}
                offLabel={""}
              />
              <span className="switch-title-text ml-2"> Show Inactive staff</span>
            </div>
          </div>


          {
            userAccessPermission[permissionEnum.ADD_STAFF] &&
          < button
            onClick={handleAddStaff}
            className="btn blue-primary text-white  text-decoration-none d-flex align-items-center ml-auto"
          >
            <img src={addIcon} alt="" className="me-2 add-img" />
            Add Staff
          </button>

}

        </div>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <div className="inner-tabs-dt">
            <div className="row">
              {staffData.map((obj, index) => {
                dropdownSelect === "card" && (
                  <div
                    className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-12 mb-4 media-colum"
                    key={index}
                  >
                    <Card className="k-tabs-cards ">
                      <Checkbox className="checkbox-show" />
                      <div className="k-check-border">
                        <CardActions>
                          <CardHeader className="border-0 text-center">
                            <Avatar
                              type="image"
                              size="medium"
                              shape="circle"
                              className="avatar-img-large"
                            >
                              <img
                                style={{}}
                                src={
                                  obj.profileImageUrl === null
                                    ? dummyImg
                                    : obj.profileImageUrl
                                }
                                alt="profile"
                              />
                            </Avatar>
                            <div className="text-center">
                              <CardTitle className="mt-3">
                                <h6
                                  onClick={() => viewStaff(obj)}
                                  className="Staff-heading-title"
                                >
                                  {obj.firstName} {obj.middleName}{" "}
                                  {obj.lastName}
                                </h6>
                              </CardTitle>
                              <CardSubtitle>{obj.roleName}</CardSubtitle>
                            </div>
                          </CardHeader>
                          <div className="button-link">
                            {!staffType ? (
                              <button
                                type="text"
                                name=""
                                className="delet-btn"
                                onClick={() => showConfirmPopup(obj)}
                              >
                                <span className="k-icon k-i-delete text-black"></span>
                              </button>
                            ) : (
                              <button
                                type="text"
                                name=""
                                className="delet-btn"
                                onClick={() => showConfirmPopup(obj)}
                              >
                                <span className="k-icon k-i-check-circle"></span>
                              </button>
                            )}
                          </div>
                          <div className="border-bottom-line"></div>
                          <CardBody className="bottom-partn">
                            <ul className="k-drawer-items mb-0 wrap-option-show">
                              <li className="bottom-list d-flex justify-content-between">
                                <p className="pb-1  mb-0 col-md-4 col-4 border-right large-size">
                                  Gender
                                </p>
                                <p className="mb-0 p-text col-md-8 col-8">
                                  {obj.genderName}
                                </p>
                              </li>
                              <li className="bottom-list d-flex justify-content-between ">
                                <p className="pb-1 mb-0 col-md-4 col-4 border-right large-size">
                                  Position
                                </p>
                                <p className="mb-0 p-text col-md-8 col-8">
                                  {obj.positionName ? obj.positionName : ""}
                                </p>
                              </li>
                            </ul>
                          </CardBody>
                        </CardActions>
                      </div>
                    </Card>
                  </div>
                )
              }

              )}
              {dropdownSelect === "table" && (
                <StaffTableList
                  renderAPI={renderAPI}
                  staffData={staffData}
                  staffType={staffType}
                />
              )}

              {showConfirm ? (
                <Dialog title={"Please confirm"} onClose={hideConfirmPopup}>
                  <p
                    style={{
                      margin: "25px",
                      textAlign: "center",
                    }}
                  >
                    Are you sure you want to{" "}
                    {!staffType ? "Deactivate" : "Active"}?
                  </p>
                  <DialogActionsBar>
                    {!staffType ? (
                      <button
                        className="btn blue-primary text-white"
                        onClick={InactiveStaff}
                      >
                        Yes
                      </button>
                    ) : (
                      <button
                        className="btn blue-primary text-white"
                        onClick={activeStaff}
                      >
                        Yes
                      </button>
                    )}
                    <button
                      className="btn  grey-secondary text-white "
                      onClick={hideConfirmPopup}
                    >
                      No
                    </button>

                  </DialogActionsBar>
                </Dialog>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default StaffList;
