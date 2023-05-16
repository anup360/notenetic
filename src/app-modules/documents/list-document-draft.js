import { Button } from "@progress/kendo-react-buttons";
import { useTableKeyboardNavigation } from "@progress/kendo-react-data-tools";
import {
  Grid,
  GridColumn,
  GRID_COL_INDEX_ATTRIBUTE,
} from "@progress/kendo-react-grid";
import { Tooltip } from "@progress/kendo-react-tooltip";
import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useNavigate } from "react-router";
import DeleteDialogModal from "../../control-components/custom-delete-dialog-box/delete-dialog";
import Loading from "../../control-components/loader/loader";
import useModelScroll from "../../cutomHooks/model-dialouge-scroll";
import ApiHelper from "../../helper/api-helper";
import ApiUrls from "../../helper/api-urls";
import APP_ROUTES from "../../helper/app-routes";
import { showError } from "../../util/utility";
import { convertServerDocumentDraftToLocal } from "./document-utility";
import searchIcon from "../../assets/images/search.png";
import { Input } from "@progress/kendo-react-inputs";

function ListDocumentDrafts() {
  // States
  const [draftList, setDraftList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [confirm, setConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [modelScroll, setScroll] = useModelScroll();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchApiQuery, setsearchApiQuery] = useState([]);
  // Variables
  const navigate = useNavigate();

  /* ============================= private functions ============================= */

  function getAllDrafts() {
    ApiHelper.getRequest(ApiUrls.GET_DOCUMENT_DRAFT)
      .then((result) => {
        if (result.resultData) {
          let list = result.resultData.map(convertServerDocumentDraftToLocal);
          list = list.map((x) => {
            return { ...x, id: x.draftId };
          });
          setDraftList(list);
          setsearchApiQuery(list);
        }
      })
      .catch((err) => {
        showError(err, "Fetch Drafts");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function deleteDraft(id) {
    setLoading(true);
    ApiHelper.deleteRequestWithEncryption(
      ApiUrls.DELETE_DOCUMENT_DRAFT_BY_ID,
      id
    )
      .then((_) => {
        NotificationManager.success("Document draft deleted successfully");
        getAllDrafts();
      })
      .catch((err) => {
        showError(err, "Delete Draft");
      })
      .finally(() => {
        hideConfirmPopup();
        setLoading(false);
      });
  }

  /* ============================= useEffect functions ============================= */

  useEffect(() => {
    setLoading(true);
    getAllDrafts();
  }, []);

  /* ============================= Event functions ============================= */

  const handleConfirm = (id) => {
    setConfirm(true);
    setDeleteId(id);
    setScroll(true);
  };

  const hideConfirmPopup = () => {
    setConfirm(false);
    setDeleteId();
    setScroll(false);
  };

  const handleDelete = () => {
    handleDeleteDraft(deleteId);
  };

  function onBack() {
    navigate(APP_ROUTES.DOCUMENT_LIST);
  }

  function pageChange(event) {
    let skip = event.page.skip;
    let take = event.page.take;

    setPage(skip);
    setPageSize(take);
  }

  function handleAddNewDocument(e) {
    navigate(APP_ROUTES.DOCUMENT_ADD, {
      state: {
        draftId: undefined,
        backRoute: APP_ROUTES.DOCUMENT_DRAFT_LIST,
      },
    });
  }

  function handleEditDraft(id) {
    navigate(APP_ROUTES.DOCUMENT_EDIT, {
      state: {
        draftId: id,
        backRoute: APP_ROUTES.DOCUMENT_DRAFT_LIST,
      },
    });
  }

  function handleDeleteDraft(id) {
    deleteDraft(id);
  }

  function handleDraftView(event) {
    navigate(APP_ROUTES.DOCUMENT_EDIT, {
      state: {
        draftId: event.dataItem.id,
        backRoute: APP_ROUTES.DOCUMENT_DRAFT_LIST,
      },
    });
  }

  /* ============================= Render functions ============================= */

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
        <div
          className="k-chip k-chip-md k-rounded-md k-chip-solid k-chip-solid-base m-2"
          onClick={() => {
            handleEditDraft(props.dataItem.id);
          }}
        >
          <div className="k-chip-content">
            <Tooltip anchorElement="target" position="top">
              <i className="fas fa-edit" title="Edit" />
            </Tooltip>
          </div>
        </div>
      </td>
    );
  };

  const handleFilter = (e) => {
    if (e.target.value === "") {
      setDraftList(searchApiQuery);
    } else {
      const filterResult = searchApiQuery.filter(
        (item) =>
          item.clientName
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          item.documentTemplateName
            .toLowerCase()
            .includes(e.target.value.toLowerCase())
      );
      setDraftList(filterResult);
    }
    setSearchQuery(e.target.value);
  };

  return (
    <div className="grid-table ">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="d-flex justify-content-between align-items-center">
          <button
            type="button"
            value="BACK"
            onClick={onBack}
            className="border-0 bg-transparent arrow-rotate pl-0 mb-0"
          >
            <i className="k-icon k-i-sort-asc-sm"></i>
          </button>
          <h4 className="address-title text-grey ml-3">
            <span className="f-24">Document Drafts</span>
          </h4>
        </span>
        <div className="content-search-filter ">
          <img src={searchIcon} alt="" className="search-icon" />
          <Input
            className="icon-searchinput"
            placeholder="Search Template Name"
            value={searchQuery}
            onChange={(e) => handleFilter(e)}
          />
        </div>
        {/* <Button
          onClick={handleAddNewDocument}
          className="btn blue-primary-outline d-flex align-items-center"
        >
          <img src={addIcon} alt="" className="me-2 add-img" />
          Add New Document
        </Button> */}
      </div>
      <div className="grid-table">
        <Grid
          onRowClick={handleDraftView}
          data={draftList.slice(page, pageSize + page)}
          skip={page}
          take={pageSize}
          onPageChange={pageChange}
          total={draftList.length}
          className="pagination-row-cus"
          pageable={{
            pageSizes: [10, 20, 30],
          }}
        >
          <GridColumn field="draftId" title="Draft Id" />
          <GridColumn field="clientName" title="Client Name" />
          <GridColumn field="documentTemplateName" title="Template Name" />
          <GridColumn field="serviceDateStr" title="Date of Service" />
          {/* <GridColumn field="timeStr" title="Time" />
                    <GridColumn field="serviceName" title="Service" />
                    <GridColumn field="placeOfServiceStr" title="Place of Service" /> */}
          <GridColumn field="utcDateCreatedStr" title="Date Submitted" />
          <GridColumn cell={CustomActionCell} title="Actions" />
        </Grid>
        {loading && <Loading />}
      </div>
      {confirm && (
        <DeleteDialogModal
          onClose={hideConfirmPopup}
          title="Document Draft"
          message="document draft"
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default ListDocumentDrafts;
