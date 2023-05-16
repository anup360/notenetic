/**
 * App.js Layout Start Here
 */
import React, { Component, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import CustomDrawer from "../../../control-components/custom-drawer/custom-drawer";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { orderBy } from "@progress/kendo-data-query";
import { getter } from "@progress/kendo-react-common";
import { Tooltip } from "@progress/kendo-react-tooltip";
import DeleteDialogModal from "../../../control-components/custom-delete-dialog-box/delete-dialog";
import Loader from "../../../control-components/loader/loader";
import { SettingsService } from "../../../services/settingsService";
import ApiHelper from "../../../helper/api-helper";
import ApiUrls from "../../../helper/api-urls";
import { NotificationManager } from "react-notifications";
import UpdateCertification from "./update-certification";
import NOTIFICATION_MESSAGE from "../../../helper/notification-messages";
import useModelScroll from "../../../cutomHooks/model-dialouge-scroll";
import addIcon from "../../../assets/images/add.png";
import AddCertification from "./update-certification";
import { renderErrors } from "src/helper/error-message-helper";

const DATA_ITEM_KEY = "id";
const SELECTED_FIELD = "selected";
const idGetter = getter(DATA_ITEM_KEY);

const CertificationSettings = () => {
  const [loading, setLoading] = useState(false);
  const clinicId = useSelector((state) => state.loggedIn.clinicId);
  const [certificate, setCertificate] = useState([]);
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [sort, setSort] = useState([]);
  const [selectedState, setSelectedState] = React.useState({});
  const [selectedCertificate, setSelectedCertificate] = React.useState({});
  const [isUpdateCertf, setUpdateCertf] = React.useState(false);
  const [isDeleteCertf, setDeleteCertf] = React.useState(false);
  const [modelScroll, setScroll] = useModelScroll();
  const [isAddCertf, setAddCertf] = React.useState(false);

  useEffect(() => {
    getCertificates();
  }, []);

  const pageChange = (event) => {
    let skip = event.page.skip;
    let take = event.page.take;
    setPage(skip);
    setPageSize(take);
  };
  const getCertificates = () => {
    setLoading(true);
    ApiHelper.getRequest(ApiUrls.GET_CLINIC_CERTIFICATE)
      .then((result) => {
        const data = result.resultData;
        setCertificate(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const editCertificate = (obj) => {
    setSelectedCertificate(obj);
    setUpdateCertf(true);
    setScroll(true);
  };

  const handleCloseCertf = ({ updated }) => {
    setUpdateCertf(false);
    setAddCertf(false);
    if (updated) {
      getCertificates();
    }
    setScroll(false);
  };

  const deleteCertf = (obj) => {
    setSelectedCertificate(obj);
    setDeleteCertf(true);
    setScroll(true);
  };

  const closeDeleteCertificate = () => {
    setDeleteCertf(false);
    setScroll(false);
  };

  const deleteCertfAPI = async () => {
    setLoading(true);
    await SettingsService.deleteCertificate(selectedCertificate?.id)
      .then((result) => {
        setLoading(false);
        NotificationManager.success(NOTIFICATION_MESSAGE.CERTIFICATE_DELETE);
        setDeleteCertf(false);
        getCertificates();
        closeDeleteCertificate();
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error);
      });
  };

  const addCertification = () => {
    setAddCertf(true);
    setScroll(true);
  };

  return (
    <div className="d-flex flex-wrap">
      <div className="inner-dt col-md-3 col-lg-2">
        <CustomDrawer />
      </div>
      <div className="col-md-9 col-lg-10">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <h4 className="address-title text-grey">
            <span className="f-24">Certification Settings</span>
          </h4>

          <button
            type="button"
            data-toggle="modal"
            data-target="#editform"
            onClick={addCertification}
            className="btn blue-primary text-white d-flex align-items-center mr-3"
          >
            <img src={addIcon} alt="" className="me-2 add-img" />
            Add Certification
          </button>
        </div>

        <div className="grid-table  filter-grid">
          <div className=" mt-3">
            <div className="inner-section-edit position-relative text-center">
              <div className="grid-table  filter-grid">
                <div className=" mt-3">
                  {loading && <Loader />}
                  <Grid
                    data={orderBy(
                      certificate.slice(page, pageSize + page),
                      sort
                    ).map((item) => ({
                      ...item,
                      [SELECTED_FIELD]: selectedState[idGetter(item)],
                    }))}
                    checkboxElement
                    style={{
                      height: certificate.length > 0 ? "100%" : "250px",
                    }}
                    dataItemKey={DATA_ITEM_KEY}
                    selectedField={SELECTED_FIELD}
                    skip={page}
                    take={pageSize}
                    total={certificate.length}
                    onPageChange={pageChange}
                    className="pagination-row-cus"
                    pageable={{
                      pageSizes: [10, 20, 30],
                    }}
                    sort={sort}
                    sortable={true}
                    onSortChange={(e) => {
                      setSort(e.sort);
                    }}
                  >
                    <GridNoRecords style={{}}></GridNoRecords>
                    {/* <GridColumn filterable={false} field={SELECTED_FIELD} width="100px" /> */}
                    <GridColumn
                      className="cursor-default"
                      field="certificationName"
                      title="Certifications Name"
                    />

                    <GridColumn
                      filterable={false}
                      cell={(props) => {
                        let field = props.dataItem;
                        return (
                          <td>
                            <div className="row-3">
                              <div
                                className="k-chip k-chip-md k-rounded-md k-chip-solid k-chip-solid-base"
                                onClick={() => deleteCertf(field)}
                              >
                                <div className="k-chip-content">
                                  <Tooltip
                                    anchorElement="target"
                                    position="top"
                                  >
                                    <i
                                      className={"fa fa-trash"}
                                      aria-hidden="true"
                                      title={"Delete"}
                                    ></i>
                                  </Tooltip>
                                </div>
                              </div>
                              <div
                                className="k-chip k-chip-md k-rounded-md k-chip-solid k-chip-solid-base m-2"
                                onClick={() => editCertificate(field)}
                              >
                                <div className="k-chip-content">
                                  <Tooltip
                                    anchorElement="target"
                                    position="top"
                                  >
                                    <i className="fas fa-edit" title="Edit"></i>
                                  </Tooltip>
                                </div>
                              </div>
                            </div>
                          </td>
                        );
                      }}
                    />
                  </Grid>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isUpdateCertf && (
        <UpdateCertification
          onClose={handleCloseCertf}
          selectedCertificate={selectedCertificate}
        />
      )}
      {isAddCertf && <AddCertification onClose={handleCloseCertf} />}
      {isDeleteCertf && (
        <DeleteDialogModal
          onClose={closeDeleteCertificate}
          title="Certification"
          message="certification"
          activeType={false}
          handleDelete={deleteCertfAPI}
        />
      )}
    </div>
  );
};
export default CertificationSettings;
