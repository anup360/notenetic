import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import dummyImg from "../../../../assets/images/dummy-img.png";
import useBirthDateCalculor from "../../../../cutomHooks/birth-date-calculate/birth-date-calculate";
import CustomSkeleton from "../../../../control-components/skeleton/skeleton";
import { MaskFormatted } from "../../../../helper/mask-helper";
import { Chip } from "@progress/kendo-react-buttons";
import { renderErrors } from "src/helper/error-message-helper";

const ClientHeader = () => {
  const [loading, setLoading] = useState(false);
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const currentInsurance = useSelector(
    (state) => state.currentInsuranceDetails
  );
  const [calculatedAge, handleAge] = useBirthDateCalculor();
  const clientDetail = useSelector((state) => state.clientDetails);
  const profilePic = useSelector((state) => state.getClientProfileImg);

  const clientFlags = useSelector((state) => state.clientFlagsReducer);



  useEffect(() => {
    if (selectedClientId !== null) {
      handleAge(clientDetail.dob);
      // getClientProfileImg();
    }
  }, [selectedClientId]);

  return (
    <div className="client-profile">
      <div className="client-profileheader profile-box-show">
        <div className="row align-items-center">
          <div className="col-xxl-2 col-md-4  mb-3 mb-xxl-0">
            <div className="inner-uploadimg">
              {/* <img src={!profilePic ? <CustomSkeleton shape="circle" width={50} height={50} /> : profilePic } alt="profile" />
               */}
              {profilePic ? (
                <img
                  width={200}
                  height={200}
                  src={"data:image/png;base64," + profilePic.clinicLogo}
                  alt="profilePic"
                />
              ) : (
                <div>
                  <img src={dummyImg} alt="dummy" />
                </div>
              )}
            </div>
          </div>
          <div className="col-xxl-5 col-md-4 mb-3 mb-xxl-0 mt-4 mt-md-0">
            <h4 className="address-title text-theme my-2">
              {clientDetail.fName ? (
                clientDetail.fName + " " + clientDetail.lName
              ) : (
                <CustomSkeleton shape="text" />
              )}
            </h4>
            <ul className="list-unstyled pl-0 details-info">
              <li className="d-flex mb-2">
                <p className="col-md-4 mb-0  px-0 f-14 fw-500">Date of Birth</p>
                <p className="col-md-8 mb-0  px-0 f-14">
                  {/* {moment(clientDetail.dob).format("M/D/YYYY")} (
                  {`${calculatedAge} years`}) */}
                  {clientDetail.dob ? (
                    moment(clientDetail.dob).format("M/D/YYYY")
                  ) : (
                    <CustomSkeleton shape="text" />
                  )}{" "}
                  {clientDetail.dob || calculatedAge ? (
                    `(${calculatedAge}  years)`
                  ) : (
                    <CustomSkeleton shape="text" />
                  )}
                </p>
              </li>
              <li className="d-flex mb-2">
                <p className="col-md-4 mb-0  px-0 f-14 fw-500">Phone</p>
                <p className="col-md-8 mb-0  px-0 f-14">
                  {clientDetail.homePhone ? (
                    MaskFormatted(clientDetail.homePhone, "(999) 999-9999")
                  ) : (
                    <CustomSkeleton shape="text" />
                  )}
                </p>
              </li>
              <li className="d-flex mb-2">
                <p className="col-md-4 mb-0  px-0 f-14 fw-500">Email</p>
                <p className="col-md-8 mb-0  px-0 f-14">
                  {clientDetail.email ? (
                    clientDetail.email
                  ) : (
                    <CustomSkeleton shape="text" />
                  )}
                </p>
              </li>
              <li className="d-flex mb-2">
                <p className="col-md-4 mb-0  px-0 f-14 fw-500">Insurance</p>
                <p className="col-md-8 mb-0  px-0 f-14">
                  {currentInsurance === null
                    ? ""
                    : currentInsurance.insuranceName}
                </p>
              </li>
            </ul>
          
          </div>

          <div className="col-xxl-5 col-md-4  mb-3 mb-xxl-0">
            <div className="profiles-tags">
          {clientFlags.length > 0 &&
              clientFlags.map((obj) => (
                <Chip
                  text={obj.flagName}
                  key={obj.id}
                  value="chip"
                  rounded={"large"}
                  fillMode={"solid"}
                  size={"medium"}
                  style={{
                    marginRight: 5,
                    backgroundColor: obj.color,
                    marginBottom: 10,
                    color: "#ffffff",
                  }}
                />
              ))}

          </div>
          </div>

     
        </div>
      </div>
    </div>
  );
};
export default ClientHeader;
