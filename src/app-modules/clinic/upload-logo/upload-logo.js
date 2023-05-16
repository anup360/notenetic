/**
 * App.js Layout Start Here
 */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CustomDrawer from "../../../control-components/custom-drawer/custom-drawer";
import Loader from "../../../control-components/loader/loader";
import { SettingsService } from "../../../services/settingsService";
import { NotificationManager } from "react-notifications";
import Dropzone from "react-dropzone";
import { resizeFiles } from "../../../control-components/image-resizer/image-resizer";
import dummyImg from "../../../assets/images/dummy-img.png";
import { MaskFormatted } from "../../../helper/mask-helper";
import EditClinic from "../clinic-update/clinic-update";
import { useDispatch } from "react-redux";
import { GET_CLINIC_DETAILS_BY_ID } from "../../../actions";
import { renderErrors } from "src/helper/error-message-helper";

let startOfWeek = [
  { id: 1, value: "Sunday" },
  { id: 2, value: "Monday" },
  { id: 3, value: "Tuesday" },
  { id: 4, value: "Wednesday" },
  { id: 5, value: "Thursday" },
  { id: 6, value: "Friday" },
  { id: 7, value: "Saturday" },
];

const UploadLogo = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const clinicId = useSelector((state) => state.loggedIn.clinicId);
  const [profilePic, setProfilePic] = React.useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [clinicDetails, setClinicDetails] = useState({});

  const result = startOfWeek.find(
    (element) => element.id === clinicDetails?.startOfWeek
  );

  useEffect(() => {
    getLogo();
    getClinicDetails();
  }, []);

  const handleValueChange = (value) => {
    setProfilePic(value);
    updateLogo(value);
  };

  const updateLogo = async (profile) => {
    setLoading(true);
    await SettingsService.uploadClinicLogo(profile, clinicId)
      .then((result) => {
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error);
      });
  };

  const getClinicDetails = async () => {
    setLoading(true);
    await SettingsService.getClinicDetails(clinicId)
      .then((result) => {
        setLoading(false);
        if (result.resultData !== null) {
          setClinicDetails(result?.resultData);
          dispatch({
            type: GET_CLINIC_DETAILS_BY_ID,
            payload: result?.resultData,
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const getLogo = async () => {
    setLoading(true);
    await SettingsService.getClinicLogo(clinicId, false)
      .then((result) => {
        setLoading(false);
        if (result.resultData !== null) {
          setProfilePic(result.resultData.clinicLogo);
        }
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  let Phone = MaskFormatted(
    clinicDetails ? clinicDetails?.phone : "",
    "(999) 999-9999"
  );
  let Fax =
    clinicDetails?.fax?.trim() == ""
      ? null
      : MaskFormatted(clinicDetails?.fax, "(999) 999-9999");

  const handleEdit = () => {
    setIsEdit(!isEdit);
  };

  return (
    <div className="d-flex flex-wrap">
      <div className="inner-dt col-md-3 col-lg-2">
        <CustomDrawer />
      </div>
      <div className="col-md-9 col-lg-10">
        <div className="row">
          <div className="col-lg-6 col-12 mb-3 mb-lg-0">
            <div className="d-flex justify-content-between mb-3">
              <h4>
                <span className="f-24">Details</span>
              </h4>
              <button
                className="btn blue-primary-outline btn-sm ml-2  default-head-btn"
                onClick={handleEdit}
              >
                <i className="k-icon k-i-edit me-2"></i>Edit
              </button>
              {/* <button
                type="button"
                name=""
                className="blue-primary btn text-white btn-sm py-1"
              >
                <span className="k-icon k-i-edit me-2"></span>Edit
              </button> */}
            </div>
            <ul className="list-unstyled mb-0 details-info  position-relative">
              <li className="d-flex mb-3">
                <p className="mb-0 col-md-6 fw-500">Clinic Name</p>
                <p className="mb-0  col-md-6">{clinicDetails?.clinicName}</p>
              </li>
              <li className="d-flex mb-3">
                <p className="mb-0 col-md-6 fw-500">Clinic Address</p>
                <p className="mb-0  col-md-6">{clinicDetails?.address}</p>
              </li>
              <li className="d-flex mb-3">
                <p className="mb-0 col-md-6 fw-500">City</p>
                <p className="mb-0  col-md-6">{clinicDetails?.city}</p>
              </li>
              <li className="d-flex mb-3">
                <p className="mb-0 col-md-6 fw-500">State </p>
                <p className="mb-0  col-md-6">{clinicDetails?.state}</p>
              </li>
              <li className="d-flex mb-3">
                <p className="mb-0 col-md-6 fw-500">Zip </p>
                <p className="mb-0  col-md-6">{clinicDetails?.zip}</p>
              </li>
              <li className="d-flex mb-3">
                <p className="mb-0 col-md-6 fw-500">Phone</p>
                <p className="mb-0  col-md-6">{Phone}</p>
              </li>

              <li className="d-flex mb-3">
                <p className="mb-0 col-md-6 fw-500">Email</p>
                <p className="mb-0  col-md-6">{clinicDetails?.email}</p>
              </li>
              <li className="d-flex mb-3">
                <p className="mb-0 col-md-6 fw-500">Fax</p>
                <p className="mb-0  col-md-6">{Fax}</p>
              </li>

              <li className="d-flex mb-3">
                <p className="mb-0 col-md-6 fw-500">NPI #</p>
                <p className="mb-0  col-md-6">{clinicDetails?.npi}</p>
              </li>

              <li className="d-flex mb-3">
                <p className="mb-0 col-md-6 fw-500">Website URL </p>
                <p className="mb-0  col-md-6">{clinicDetails?.websiteUrl}</p>
              </li>
              <li className="d-flex mb-3">
                <p className="mb-0 col-md-6 fw-500">Start Of Week </p>
                <p className="mb-0  col-md-6">{result?.value}</p>
              </li>
            </ul>
          </div>
          <div className="col-lg-6 col-12">
            <h4 className="address-title text-grey">
              <span className="f-24"></span>
            </h4>

            <div className="grid-table  filter-grid">
              <div className=" mt-3">
                {loading && <Loader />}
                <div className="inner-section-edit position-relative">
                  <div className="upload-logo-clinic position-relative">
                    <div className="logopdf-logo">
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
                          <div
                            className="logopdf-logo"
                            {...getRootProps({ className: "" })}
                          >
                            {/* <span className="k-icon k-i-photo-camera camera-photo"></span> */}
                            <input {...getInputProps()} />
                            {profilePic ? (
                              <img
                                src={
                                  profilePic.url ? profilePic.url : profilePic
                                }
                              />
                            ) : (
                              <div>
                                <img width={160} height={140} src={dummyImg} />
                              </div>
                            )}
                            <i
                              style={{ position: "absolute", top: "82px" }}
                              className="fa fa-upload clinic-logodetail"
                              aria-hidden="true"
                            ></i>
                          </div>
                        )}
                      </Dropzone>
                    </div>
                    <p className="mb-0 mt-3 text-center">Upload Your Logo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isEdit && (
        <EditClinic
          onClose={handleEdit}
          getClinicDetails={getClinicDetails}
          // selectedRefId={selectedRefId}
          // activeType={activeType}
        />
      )}
    </div>
  );
};
export default UploadLogo;
