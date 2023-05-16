import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { NotificationManager } from "react-notifications";
import ApiUrls from "../../../helper/api-urls";
import ApiHelper from "../../../helper/api-helper";
import moment from "moment";
import AppRoutes from "../../../helper/app-routes";
import Dropzone from "react-dropzone";
import { resizeFiles } from "../../../control-components/image-resizer/image-resizer";
import dummyImg from "../../../assets/images/dummy-img.png";
import { useLocation } from "react-router-dom";
import { MaskFormatted } from "../../../helper/mask-helper";
import NOTIFICATION_MESSAGE from "../../../helper/notification-messages";
import useBirthDateCalculor from "../../../cutomHooks/birth-date-calculate/birth-date-calculate";
import CustomSkeleton from "../../../control-components/skeleton/skeleton";
import { permissionEnum } from "../../../helper/permission-helper";
import { renderErrors } from "src/helper/error-message-helper";
import { userPermission } from "../../../helper/permission-helper";


const StaffProfileHeader = ({ profilePic, getStaffDetail }) => {
  const navigate = new useNavigate();
  const location = useLocation();
  const selectedStaffId = useSelector((state) => state?.selectedStaffId);
  const clinicId = useSelector((state) => state?.loggedIn?.clinicId);
  const getProfilePic = useSelector((state) => state?.getStaffProfileImg);
  const staffId = useSelector((state) => state.loggedIn?.staffId);
  const staffLoginInfo = useSelector((state) => state?.getStaffReducer);

  const [loading, setLoading] = useState(false);
  const [calculatedAge, handleAge] = useBirthDateCalculor();
  const pathName = location.pathname.toLowerCase();
  const staffInfo = useSelector((state) => state?.getStaffDetails);
  const userAccessPermission = useSelector(
    (state) => state?.userAccessPermission
  );

  const handleEditProfile = ({ editable }) => {
    navigate(AppRoutes.EDIT_STAFF);
    if (editable) {
    }
  };
  useEffect(() => {
    if (selectedStaffId !== null) {
      handleAge(staffInfo?.dob);
    }
  }, [staffInfo]);


  const uploadStaffProfile = (profile) => {
    let bodyFormData = new FormData();
    bodyFormData.append("file", profile, profile.path);
    bodyFormData.append("clinicId", clinicId);
    bodyFormData.append("staffId", selectedStaffId);
    setLoading(true);
    ApiHelper.postRequest(ApiUrls.UPLOAD_STAFF_PROFILE, bodyFormData)
      .then((result) => {
        setLoading(false);
        getStaffDetail();
        NotificationManager.success(NOTIFICATION_MESSAGE.UPLOAD_PHOTO);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error);
      });
  };

  const handleValueChange = (value) => {
    uploadStaffProfile(value);
  };
  let phoneNum = MaskFormatted(
    staffInfo ? staffInfo.phone : "",
    "(999) 999-9999"
  );





  return (
    <>
      <div className="client-profileheader profile-edit-show d-flex justify-content-between align-items-start">
        <div className="edit-profile-left d-flex align-items-start tabletprofile-view">
          <div className="profile-image position-relative">
            {staffInfo?.id === staffId  ? (
              <Dropzone
                onDrop={(files) => {
                  resizeFiles(files, 200, 300).then((reSizedFiles) => {
                    handleValueChange(reSizedFiles[0]);
                  });
                }}
                multiple={false}
                accept={"image/*"[(".png", ".gif", ".jpeg", ".jpg")]}
              >
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps({ className: "" })}>
                    <span className="k-icon k-i-photo-camera camera-photo"></span>
                    <input {...getInputProps()} />
                    {profilePic || getProfilePic ? (
                      <img
                        width={160}
                        height={140}
                        src={
                          profilePic || getProfilePic.staffProfileImageUrl
                            ? profilePic || getProfilePic.staffProfileImageUrl
                            : profilePic
                        }
                        alt="profileImage"
                      />
                    ) : (
                      <div>
                        <img src={dummyImg} alt="dummyImage" />
                      </div>
                    )}
                  </div>
                )}
              </Dropzone>
            ) : (
              <div>
                {
                  staffInfo?.id === staffId  &&
                  <span className="k-icon k-i-photo-camera camera-photo"></span>

                }
                {profilePic || getProfilePic ? (
                  <img
                    width={160}
                    height={140}
                    src={
                      profilePic || getProfilePic.staffProfileImageUrl
                        ? profilePic || getProfilePic.staffProfileImageUrl
                        : dummyImg
                    }
                    alt="profileImage"
                  />
                ) : (
                  <div>
                    <img src={dummyImg} alt="dummyImage" />
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="content-inner">
            {!staffInfo ? (
              <CustomSkeleton shape="text" />
            ) : (
              <h4 className="address-title text-theme mb-2">
                {staffInfo?.firstName} {staffInfo.middleName}{" "}
                {staffInfo?.lastName}
              </h4>
            )}
            <p className="mb-2 f-16 fw-500">
              {!staffInfo ? (
                <CustomSkeleton shape="text" />
              ) : (
                staffInfo?.roleName
              )}
            </p>
            <ul className="list-unstyled mb-0 details-info">
              <li className="d-flex mb-2">
                <p className="mb-0 col-md-6 px-0 fw-500">Date of Birth</p>
                <p className="mb-0  col-md-6 px-0">
                  {staffInfo ? (
                    moment(staffInfo?.dob).format("M/D/YYYY")
                  ) : (
                    <CustomSkeleton shape="text" />
                  )}{" "}
                  {staffInfo || calculatedAge ? (
                    `(${calculatedAge}  years)`
                  ) : (
                    <CustomSkeleton shape="text" />
                  )}
                </p>
              </li>
              <li className="d-flex mb-2">
                <p className="mb-0 col-md-6 px-0 fw-500">Work Phone</p>
                <p className="mb-0  col-md-6 px-0">
                  {phoneNum ? phoneNum : <CustomSkeleton shape="text" />}
                </p>
              </li>
              <li className="d-flex mb-2">
                <p className="mb-0 col-md-6 px-0 fw-500">Email</p>
                <p className="mb-0  col-md-6 px-0">
                  {staffInfo?.email ? (
                    staffInfo?.email
                  ) : (
                    <CustomSkeleton shape="text" />
                  )}
                </p>
              </li>
              <li className="d-flex mb-2">
                <p className="mb-0 col-md-6 px-0 fw-500">Position</p>
                <p className="mb-0  col-md-6 px-0">
                  {!staffInfo ? (
                    <CustomSkeleton shape="text" />
                  ) : (
                    staffInfo?.position
                  )}
                </p>
              </li>
            </ul>
          </div>
        </div>
        {pathName == "/staff/profile" &&
          userAccessPermission[permissionEnum.EDIT_STAFF_PROFILE]   && (
            <button
              className="btn blue-primary text-white tablet-view text-decoration-none d-flex align-items-center "
              onClick={handleEditProfile}
            >
              <span className="k-icon k-i-edit me-2"></span>Edit Profile
            </button>
          )}
      </div>
    </>
  );
};
export default StaffProfileHeader;
