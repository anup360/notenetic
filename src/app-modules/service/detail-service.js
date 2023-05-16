import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import EditService from "./edit-service";
import EditServiceRate from "./service-rate/edit-service-rate";
import ApiUrls from "../../helper/api-urls";
import ApiHelper from "../../helper/api-helper";
import { NotificationManager } from "react-notifications";
import moment from "moment";
import Loader from "../../control-components/loader/loader";
import { Switch } from "@progress/kendo-react-inputs";
import AddServiceRate from "./service-rate/edit-service-rate";
import { Tooltip } from "@progress/kendo-react-tooltip";
import { Encrption } from "../encrption";
import DeleteDialogModal from "../../control-components/custom-delete-dialog-box/delete-dialog";
import {
  ListView,
  ListViewHeader,
  ListViewFooter,
} from "@progress/kendo-react-listview";
import APP_ROUTES from "../../helper/app-routes";
import useModelScroll from "../../cutomHooks/model-dialouge-scroll";
import { renderErrors } from "src/helper/error-message-helper";


const ServiceDetail = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [onEdit, setOnEdit] = React.useState(false);
  const [ServiceInfo, setServiceInfo] = React.useState(false);
  const selectedServiceId = useSelector((state) => state.selectedServiceId);
  const clinicId = useSelector((state) => state.loggedIn.clinicId);
  const [isDeleteConfirm, setDeleteConfirm] = useState(false);
  const [selectedServiceRate, setselectedServiceRate] = useState("");
  const [isEditServiceRate, setIsEditServiceRate] = useState(false);
  const [addServiceRate, setAddServiceRate] = useState(false);
  const [modelScroll, setScroll] = useModelScroll();
  

  const handleEditService = ({ editable }) => {
    setOnEdit(!onEdit);
    if (editable) {
      getserviceDetail();
    }
    if (onEdit == false) {
      setScroll(true);
    } else {
      setScroll(false);
    }
  };

  useEffect(() => {
    if (selectedServiceId !== null) {
      getserviceDetail();
    }
  }, []);

  const deleteServicesRate = () => {
    setLoading(true);
    ApiHelper.deleteRequest(
      ApiUrls.DELETE_SERVICE_RATE + Encrption(selectedServiceRate.id)
    )
      .then((result) => {
        setLoading(false);
        setScroll(false);
        setDeleteConfirm(!isDeleteConfirm);
        NotificationManager.success("Service rate deleted successfully");
        getserviceDetail();
      })
      .catch((error) => {
        setLoading(false);
        setDeleteConfirm(!isDeleteConfirm);
        renderErrors(error.message);
      });
  };

  const getserviceDetail = () => {
    setLoading(true);
    ApiHelper.getRequest(
      ApiUrls.GET_Services_BY_ID + Encrption(selectedServiceId)
    )
      .then((result) => {
        let serviceDetail = result.resultData;
        setServiceInfo(serviceDetail);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const deleteServiceRate = (item) => {
    setDeleteConfirm(true);
    setselectedServiceRate(item);
    setScroll(true);
  };
  const handleDeleteServiceRate = () => {
    setDeleteConfirm(!isDeleteConfirm);
    setScroll(false);
  };
  const handleEditServiceRate = (item) => {
    setselectedServiceRate(item);
    setIsEditServiceRate(true);
    setScroll(true);
  };

  const handleAddService = () => {
    setAddServiceRate(true);
    setScroll(true);
  };

  const handleEditClose = ({ billEdited }) => {
    if (billEdited) {
      getserviceDetail();
    }
    setIsEditServiceRate(false);
    setAddServiceRate(false);
    setScroll(false);
  };
  const MyHeader = () => {
    return (
      <ListViewHeader
        style={{
          color: "#000000",
          fontSize: 20,
        }}
        className="pl-3 pb-2 pt-2"
      >
        <div className="d-flex justify-content-between mb-3">
          <h4 className="address-title text-grey ">
            <span className="f-24">Service Rates</span>
          </h4>
          
            <button
              onClick={handleAddService}
              className="btn blue-primary-outline d-flex align-items-center "
            >
              <span className="k-icon k-i-plus me-2"></span>Add Service Rate
            </button>
        
        </div>
        <div className="row py-2 border-bottom align-middle mt-20">
          <div className="col-2">
            <h2
              style={{
                fontSize: 15,
                color: "#000000",
                fontWeight: "600",
                marginBottom: 0,
              }}
              className=""
            >
              Service Rate
            </h2>
          </div>
          <div className="col-3">
            <h2
              style={{
                fontSize: 15,
                color: "#000000",
                fontWeight: "600",
                marginBottom: 0,
              }}
              className=""
            >
              Effective Date
            </h2>
          </div>
          <div className="col-3">
            <h2
              style={{
                fontSize: 15,
                color: "#000000",
                fontWeight: "600",
                marginBottom: 0,
              }}
              className=""
            >
              End Date
            </h2>
          </div>
     
            <div className="col-3">
              <h2
                style={{
                  fontSize: 15,
                  color: "#000000",
                  fontWeight: "600",
                  marginBottom: 0,
                }}
                className=""
              >
                Actions
              </h2>
            </div>
       
        </div>
      </ListViewHeader>
    );
  };

  const MyFooter = () => {
    return (
      <ListViewFooter
        style={{
          color: "rgb(160, 160, 160)",
          fontSize: 14,
        }}
        className="pl-3 pb-2 pt-2"
      ></ListViewFooter>
    );
  };

  const MyItemRender = (props) => {
    let item = props.dataItem;
    return (
      <div
        className="row p-2 border-bottom align-middle"
        style={{
          margin: 0,
        }}
      >
        <div className="col-2">{"$" + item.serviceRate}</div>

        <div className="col-3">
          <h2
            style={{
              fontSize: 14,
              color: "#454545",
              marginBottom: 0,
            }}
            className=""
          >
            {moment(item.dateEffective).format("M/D/YYYY")}
          </h2>
        </div>
        <div className="col-3">
          <h2
            style={{
              fontSize: 14,
              color: "#454545",
              marginBottom: 0,
            }}
            className=""
          >
            {item.dateEnd && moment(item.dateEnd).format("M/D/YYYY")}
          </h2>
        </div>
        {(
          <div className="col-3">
            <div
              className="k-chip k-chip-md k-rounded-md k-chip-solid k-chip-solid-base"
              onClick={() => {
                deleteServiceRate(item);
              }}
            >
              <div className="k-chip-content">
                <Tooltip anchorElement="target" position="top">
                  <i
                    className="fa fa-trash"
                    aria-hidden="true"
                    title="Delete"
                  ></i>
                </Tooltip>
              </div>
            </div>
            <div
              className="k-chip k-chip-md k-rounded-md k-chip-solid k-chip-solid-base mx-2"
              onClick={() => {
                handleEditServiceRate(item);
              }}
            >
              <div className="k-chip-content">
                <Tooltip anchorElement="target" position="top">
                  <i
                    className="fas fa-edit"
                    aria-hidden="true"
                    title="Edit"
                  ></i>
                </Tooltip>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="notenetic-container">
      {loading == true && <Loader />}

      <div className="row">
        {/* End*/}
        <div className="col-md-12 col-xl-12 col-12 px-lg-4 mb-3">
          <button
            type="button"
            value="BACK"
            className="border-0 bg-transparent arrow-rotate pl-0"
            onClick={() => {
              navigate(APP_ROUTES.GET_SERVICE_BY_CLINICID);
            }}
          >
            <i className="k-icon k-i-sort-asc-sm"></i>
          </button>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="address-title text-grey">
              <span className="f-24">Services</span>
            </h4>
            
              <button
                onClick={handleEditService}
                className="btn blue-primary-outline d-flex align-items-center "
              >
                <span className="k-icon k-i-edit me-2"></span>Edit Service
              </button>
           
          </div>
          <div className="row">
            <div className="col-xl-6 col-md-12 mb-3">
              <ul className="list-unstyled mb-0 details-info firts-details-border position-relative">
                <li className="d-flex mb-3">
                  <p className="mb-0 col-md-6 fw-500">Service</p>
                  <p className="mb-0  col-md-6">{ServiceInfo.service}</p>
                </li>
                <li className="d-flex mb-3">
                  <p className="mb-0 col-md-6 fw-500">Service Code</p>
                  <p className="mb-0  col-md-6">{ServiceInfo.serviceCode}</p>
                </li>
                <li className="d-flex mb-3">
                  <p className="mb-0 col-md-6 fw-500">Modifier</p>
                  <p className="mb-0  col-md-6">{ServiceInfo.modifier}</p>
                </li>

                <li className="d-flex mb-3">
                  <p className="mb-0 col-md-6 fw-500"> II Modifier</p>
                  <p className="mb-0  col-md-6">{ServiceInfo.secModifier}</p>
                </li>

                <li className="d-flex mb-3">
                  <p className="mb-0 col-md-6 fw-500">III Modifier</p>
                  <p className="mb-0  col-md-6">{ServiceInfo.thirdModifier}</p>
                </li>
                <li className="d-flex mb-3">
                  <p className="mb-0 col-md-6 fw-500">IV Modifier</p>
                  <p className="mb-0  col-md-6">{ServiceInfo.fourthModifier}</p>
                </li>
                <li className="d-flex mb-3">
                  <p className="mb-0 col-md-6 fw-500">Age Modifier</p>
                  <p className="mb-0  col-md-6">{ServiceInfo.ageModifier}</p>
                </li>

                <li className="d-flex mb-3">
                  <p className="mb-0 col-md-6 fw-500">Loc Modifier</p>
                  <p className="mb-0  col-md-6">{ServiceInfo.locModifier}</p>
                </li>
                <li className="d-flex mb-3">
                  <p className="mb-0 col-md-6 fw-500">Date Effective</p>
                  <p className="mb-0  col-md-6">
                    {ServiceInfo.dateEffective &&
                      moment(ServiceInfo.dateEffective).format("M/D/YYYY")}
                  </p>
                </li>
                <li className="d-flex mb-3">
                  <p className="mb-0 col-md-6 fw-500">Date End</p>
                  <p className="mb-0  col-md-6">
                    {ServiceInfo.dateEnd &&
                      moment(ServiceInfo.dateEnd).format("M/D/YYYY")}
                  </p>
                </li>
                <li className="d-flex mb-3">
                  <p className="mb-0 col-md-6 fw-500">Min Time</p>
                  <p className="mb-0  col-md-6">
                    {ServiceInfo.minTime == "0" ? "" : ServiceInfo.minTime}
                  </p>
                </li>
                <li className="d-flex mb-3">
                  <p className="mb-0 col-md-6 fw-500">Max Time</p>
                  <p className="mb-0  col-md-6">
                    {ServiceInfo.maxTime == "0" ? "" : ServiceInfo.maxTime}
                  </p>
                </li>
              </ul>
            </div>
            <div className="col-xl-6 col-md-12 mb-3">
              <ul className="list-unstyled mb-0 details-info">
                <li className="d-flex mb-3">
                  <p className="mb-0 col-md-6 fw-500">Revenue Code</p>
                  <p className="mb-0  col-md-6">{ServiceInfo.revenueCode}</p>
                </li>
                <li className="d-flex mb-3">
                  <p className="mb-0 col-md-6 fw-500">Billing Unit</p>
                  <p className="mb-0  col-md-6">
                    {ServiceInfo.billingUnitsDesc}
                  </p>
                </li>
                <li className="d-flex mb-3">
                  <p className="mb-0 col-md-6 fw-500">Billable</p>
                  <div className="mb-2 col-lg-4 col-md-6 col-12">
                    <span className="switch-title-text mr-3">
                      <Switch
                        onLabel={""}
                        offLabel={""}
                        disabled={true}
                        checked={ServiceInfo.billable}
                      />
                    </span>
                  </div>
                </li>
                <li className="d-flex mb-3">
                  <p className="mb-0 col-md-6 fw-500 ">Professional</p>
                  <div className="mb-2 col-lg-4 col-md-6 col-12">
                    <span className="switch-title-text mr-3">
                      <Switch
                        onLabel={""}
                        offLabel={""}
                        disabled={true}
                        checked={ServiceInfo.professional}
                      />
                    </span>
                  </div>
                </li>
                <li className="d-flex mb-3">
                  <p className="mb-0 col-md-6 fw-500">Add On</p>
                  <div className="mb-2 col-lg-4 col-md-6 col-12">
                    <span className="switch-title-text mr-3">
                      <Switch
                        onLabel={""}
                        offLabel={""}
                        disabled={true}
                        checked={ServiceInfo.addon}
                      />
                    </span>
                  </div>
                </li>
                <li className="d-flex mb-3">
                  <p className="mb-0 col-md-6 fw-500">Allow Overlapping</p>
                  <div className="mb-2 col-lg-4 col-md-6 col-12">
                    <span className="switch-title-text mr-3">
                      <Switch
                        onLabel={""}
                        offLabel={""}
                        disabled={true}
                        checked={ServiceInfo.allowOverlapping}
                      />
                    </span>
                  </div>
                </li>
                <li className="d-flex mb-3">
                  <p className="mb-0 col-md-6 fw-500">Auth Required</p>
                  <div className="mb-2 col-lg-4 col-md-6 col-12">
                    <span className="switch-title-text mr-3">
                      <Switch
                        onLabel={""}
                        offLabel={""}
                        disabled={true}
                        checked={ServiceInfo.authRequired}
                      />
                    </span>
                  </div>
                </li>
              </ul>
            </div>
            {/*End*/}
          </div>
        </div>
        <div className="Service-RateList">
          <ListView
            data={ServiceInfo.serviceRateList}
            item={MyItemRender}
            style={{
              width: "100%",
            }}
            header={MyHeader}
            footer={MyFooter}
          />
        </div>

        {/*End*/}
      </div>
      {onEdit && (
        <EditService
          onClose={handleEditService}
          selectedServiceId={selectedServiceId}
          serviceInfo={ServiceInfo}
        />
      )}
      {isEditServiceRate && (
        <EditServiceRate
          onClose={handleEditClose}
          selectedServiceRate={selectedServiceRate}
          selectedServiceId={selectedServiceId}
        />
      )}

      {addServiceRate && (
        <AddServiceRate
          onClose={handleEditClose}
          selectedServiceId={selectedServiceId}
        />
      )}

      {isDeleteConfirm && (
        <DeleteDialogModal
          onClose={handleDeleteServiceRate}
          handleDelete={deleteServicesRate}
          title="Service Rate"
          message="Service Rate"
        />
      )}
    </div>
  );
};
export default ServiceDetail;
