import { Loader } from "@progress/kendo-react-indicators";
import moment from "moment";
import { useState } from "react";
import { useEffect } from "react";
import { ClientService } from "src/services/clientService";

import { renderErrors } from "src/helper/error-message-helper";

const ShowSignature = ({
  parentId,
  setIsParentSign,
  setIsClientSign,
  setTreatmentPlan,
  treatmentPlan,
  setSignStaffId,
  deleteSign,
  isAddSign,
  isdeleteSign,
  showInactivePlans,
  setHaveStaffSign,
  setHaveClientSign,
}) => {
  const [clientSign, setClientSign] = useState([]);
  const [staffSign, setStaffSign] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getClientPlanSignById(parentId);
    getStaffPlanSignById(parentId);
  }, [parentId, isAddSign, isdeleteSign]);

  const getClientPlanSignById = async (getActivePlan) => {
    setLoading(true);
    await ClientService.getClientTreatmentSignByPlanId(getActivePlan)
      .then((result) => {
        let sign = result.resultData;
        if (sign.length > 0) {
          sign.forEach((element) => {
            let isParent = element.isParent;
            if (isParent === true) {
              setIsParentSign(true);
            }
            if (isParent === false) {
              setIsClientSign(true);
            }
          });
        }

        let tpIndex = treatmentPlan.findIndex(
          (item) => item.id === getActivePlan
        );

        treatmentPlan[tpIndex].clientSign = sign;

        setClientSign(sign);
        setHaveClientSign(sign);
        setTreatmentPlan(treatmentPlan);

        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const getStaffPlanSignById = async (getActivePlan) => {
    setLoading(true);
    await ClientService.getStaffTreatmentSignByPlanId(getActivePlan)
      .then((result) => {
        let sign = result.resultData;
        sign.forEach((element) => {
          let id = element.staffId;
          setSignStaffId(id);
        });

        let tpIndex = treatmentPlan.findIndex(
          (item) => item.id === getActivePlan
        );

        treatmentPlan[tpIndex].staffSign = sign;
        setStaffSign(sign);
        setHaveStaffSign(sign);
        setTreatmentPlan(treatmentPlan);

        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      {clientSign?.length > 0 || staffSign?.length > 0 ? (
        <h4 className="address-title text-grey mt-4 ">
          <span className="f-24">Signatures</span>
        </h4>
      ) : (
        ""
      )}
      {clientSign?.length > 0 &&
        clientSign?.map((obj, key) => (
          <div
            key={key}
            className="d-flex justify-content-between align-items-center border p-3 mb-3"
          >
            <div className="">
              <div className="">
                <p className="mb-0 text-grey">
                  Signed by: <span>{obj?.fullNameAtSig}</span>{" "}
                  {obj.isParent === true ? "(parent-guardian)" : "(client)"}
                </p>
                <p className="mb-0 text-grey">
                  Date : {moment(obj.sigDateTime).format("M/D/YYYY")}
                </p>
              </div>
              <img
                className="signImage"
                alt="demo"
                src={"data:image/png;base64," + obj.signature}
              />
            </div>
            <button
              onClick={() => deleteSign(obj)}
              type="button"
              className="btn  btn-sm text-theme f-16 blue-primary-outline mr-3 line-height-pencil"
            >
              {" "}
              <i className="fa fa-trash pencile-edit-color mr-2"></i>Delete
            </button>
          </div>
        ))}
      {staffSign?.length > 0 &&
        staffSign?.map((obj, key) => (
          <div
            key={key}
            className="d-flex justify-content-between align-items-center border p-3 mb-3"
          >
            <div className="">
              <div className="">
                <p className="mb-0 text-grey">
                  Signed by : <span className="">{obj?.staffName}</span>
                </p>
                <p className="mb-0 text-grey">
                  Date : {moment(obj.sigDateTime).format("M/D/YYYY")}
                </p>
              </div>
              <img
                className="signImage"
                alt="demo"
                src={"data:image/png;base64," + obj.signature}
              />
            </div>
            {!showInactivePlans ? (
              <button
                onClick={() => deleteSign(obj)}
                type="button"
                className="btn  btn-sm text-theme f-16 blue-primary-outline mr-3 line-height-pencil"
              >
                {" "}
                <i className="fa fa-trash pencile-edit-color mr-2"></i>Delete
              </button>
            ) : null}
          </div>
        ))}
    </div>
  );
};

export default ShowSignature;
