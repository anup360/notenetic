import React, { useEffect, useState } from "react";
import moment from "moment";
import { useNavigate } from "react-router";
import {
  Grid,
  GridColumn,
  GRID_COL_INDEX_ATTRIBUTE,
} from "@progress/kendo-react-grid";
import { Tooltip } from "@progress/kendo-react-tooltip";
import { useTableKeyboardNavigation } from "@progress/kendo-react-data-tools";
import { renderErrors } from "src/helper/error-message-helper";

import addIcon from "../../../../assets/images/add.png";
import CustomDrawer from "../../../../control-components/custom-drawer/custom-drawer";
import apiHelper from "../../../../helper/api-helper";
import API_URLS from "../../../../helper/api-urls";
import APP_ROUTES from "../../../../helper/app-routes";
import ClientHeader from "../client-header/client-header";
import Loader from "../../../../control-components/loader/loader";
import DeleteDialogModal from "../../../../control-components/custom-delete-dialog-box/delete-dialog";
import { Encrption } from "../../../encrption";
import NotificationManager from "react-notifications/lib/NotificationManager";
import { ClientService } from "../../../../services/clientService";
import { useSelector } from "react-redux";

const Questionnaire = () => {
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [questionnaireList, setQuestionnaireList] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [confirm, setConfirm] = useState(false);
  const [deleteSelectedId, setDeleteSelectedId] = useState();

  useEffect(() => {
    getQuestionsByClientId();
    window.scrollTo(0, 0);
  }, [selectedClientId]);

  function pageChange(event) {
    let skip = event.page.skip;
    let take = event.page.take;

    setPage(skip);
    setPageSize(take);
  }

  const getQuestionsByClientId = async () => {
    setLoading(true);
    await ClientService.getQuestionsListByClientId(selectedClientId)
      .then((result) => {
        setLoading(false);
        let questionList = result.resultData;
        setQuestionnaireList(questionList);
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };

  const CustomActionCell = (props) => {
    const navigationAttributes = useTableKeyboardNavigation(props.id);
    return (
      <td
        colSpan={props.colSpan}
        role={"gridcell"}
        aria-colindex={props.ariaColumnIndex}
        aria-selected={props.isSelected}
        {...{ [GRID_COL_INDEX_ATTRIBUTE]: props.columnIndex }}
        {...navigationAttributes}
      >
        <div
          className="k-chip k-chip-md k-rounded-md k-chip-solid k-chip-solid-base"
          onClick={() => {
            handleConfirm(props.dataItem.id);
          }}
        >
          <div className="k-chip-content">
            <Tooltip anchorElement="target" position="top">
              <i className="fa fa-trash" aria-hidden="true" title="Delete" />
            </Tooltip>
          </div>
        </div>
      </td>
    );
  };

  const handleConfirm = (id) => {
    setConfirm(true);
    setDeleteSelectedId(id);
  };

  const hideConfirmPopup = () => {
    setConfirm(false);
    setDeleteSelectedId();
  };

  const handleDelete = () => {
    setLoading(true);
    apiHelper
      .postRequest(API_URLS.DELETE_QUESTIONNAIRE + Encrption(deleteSelectedId))
      .then((_) => {
        getQuestionsByClientId();
        NotificationManager.success(" Questionnaire deleted successfully");
        hideConfirmPopup();
      })
      .catch((error) => {
        // showError(error.message, "Delete Physician");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleRowClick = (field) => {
    if (field.id) {
      let element = field.id;
      navigate(APP_ROUTES.CREATE_QUESTIONNAIRE, { state: { field } });
    }
  };

  return (
    <div className="d-flex flex-wrap">
      <div className="inner-dt col-md-3 col-lg-2">
        <CustomDrawer />
      </div>
      <div className="col-md-9 col-lg-10">
        <ClientHeader />
        <br></br>
        <div className="Service-RateList">
          <div className="d-flex justify-content-between  mt-3">
            <h4 className="address-title text-grey ">
              <span className="f-24">Questionnaire</span>
            </h4>
            {loading && (
              <div>
                <Loader />
              </div>
            )}
            <button
              onClick={() => {
                navigate(APP_ROUTES.CREATE_QUESTIONNAIRE);
              }}
              className="btn blue-primary text-white text-decoration-none d-flex align-items-center"
            >
              <img src={addIcon} alt="" className="me-2 add-img" />
              Add Questionnaire
            </button>
          </div>
          <br></br>
          {questionnaireList?.length == 0 && !loading ? (
            <div className="message-not-found">No Questionnaire Available</div>
          ) : (
            <div className="grid-table">
              <Grid
                data={questionnaireList?.slice(page, pageSize + page)}
                skip={page}
                take={pageSize}
                onPageChange={pageChange}
                total={questionnaireList?.length}
                className="pagination-row-cus"
                pageable={{
                  pageSizes: [10, 20, 30],
                }}
              >
                <GridColumn
                  field="questionnaire"
                  title="questionnaire"
                  cell={(props) => {
                    let field = props?.dataItem;
                    return (
                      <td
                        className="anchar-pointer text-theme"
                        onClick={() => handleRowClick(field)}
                      >
                        {field?.questionnaire}
                      </td>
                    );
                  }}
                />
                <GridColumn
                  title="Date"
                  cell={(props) => {
                    let field = props?.dataItem?.utcDateCreated;

                    return (
                      <td className="cursor-default">
                        {moment
                          .utc(props.dataItem.utcDateCreated)
                          .local()
                          .format("M/D/YYYY")}{" "}
                        at{" "}
                        {moment
                          .utc(props.dataItem.utcDateCreated)
                          .local()
                          .format("hh:mm A")}
                      </td>
                    );
                  }}
                />
                <GridColumn field="createdByStaff" title="Staff" />

                <GridColumn cell={CustomActionCell} title="Action" />
              </Grid>
            </div>
          )}
        </div>
        {confirm && (
          <DeleteDialogModal
            onClose={hideConfirmPopup}
            title="Questionnaire"
            message="questionnaire"
            handleDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default Questionnaire;
