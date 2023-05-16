import { Button } from '@progress/kendo-react-buttons';
import { useTableKeyboardNavigation } from '@progress/kendo-react-data-tools';
import { Grid, GridColumn, GRID_COL_INDEX_ATTRIBUTE } from '@progress/kendo-react-grid';
import { Tooltip } from '@progress/kendo-react-tooltip';
import React, { useEffect, useState } from 'react';
import { NotificationManager } from "react-notifications";
import { useNavigate } from "react-router";
import Loader from '../../../control-components/loader/loader';
import ApiHelper from '../../../helper/api-helper';
import ApiUrls from '../../../helper/api-urls';
import APP_ROUTES from '../../../helper/app-routes';
import { showError } from '../../../util/utility';
import DeleteDialogModal from "../../../control-components/custom-delete-dialog-box/delete-dialog";
import useModelScroll from "../../../cutomHooks/model-dialouge-scroll";
import { mapDocumentTemplate } from './document-template-utility';
import { GridColumnMenuSort } from "@progress/kendo-react-grid";
import { orderBy } from "@progress/kendo-data-query";
import { filter } from "@progress/kendo-data-query/dist/npm/transducers";
import { getter } from "@progress/kendo-react-common";
import searchIcon from "../../../assets/images/search.png";
import { Input } from "@progress/kendo-react-inputs";


const DATA_ITEM_KEY = "id";
const SELECTED_FIELD = "selected";
const idGetter = getter(DATA_ITEM_KEY);

function ListDocumentTemplateDrafts() {

    // States
    const [templateDraftList, setTemplateDraftList] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedState, setSelectedState] = React.useState({});

    const [confirm, setConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState();
    const [modelScroll, setScroll] = useModelScroll();
    const [sort, setSort] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchApiQuery, setsearchApiQuery] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    // Variables
    const navigate = useNavigate();


    const filterOperators = {
        text: [
            {
                text: "grid.filterContainsOperator",
                operator: "contains",
            },
        ],
    };

    const dataStateChange = (event) => {
        setSort(event.dataState.sort);
    };


    function pageChange(event) {
        let skip = event?.page?.skip;
        let take = event?.page?.take;
        setPage(skip);
        setPageSize(take);
        storePage(take);
        window.scrollTo(0, 0);

    }
    /* ============================= private functions ============================= */

    function getAllTemplateDrafts() {
        ApiHelper.getRequest(ApiUrls.GET_TEMPLATE_DRAFT)
            .then(result => {
                if (result.resultData) {
                    setTemplateDraftList(result.resultData.map(d => mapDocumentTemplate(d)))
                }
                setsearchApiQuery(result.resultData.map(d => mapDocumentTemplate(d)));

            })
            .catch(err => { showError(err, "Fetch Template Drafts") })
            .finally(() => { setLoading(false) })
    }

    const handleFilter = (e) => {
        if (e.target.value === "") {
            setPage(currentPage);
            setTemplateDraftList(searchApiQuery);
        } else {
            const filterResult = searchApiQuery.filter((item) =>
                item.templateName.toLowerCase().includes(e.target.value.toLowerCase())
            );
            if(filterResult.length > 0){
                setCurrentPage(page);
                setPage(0);
              }
            setTemplateDraftList(filterResult);
        }
        setSearchQuery(e.target.value);
    };

    function deleteTemplateDraft(id) {
        setLoading(true)
        ApiHelper.deleteRequestWithEncryption(ApiUrls.DELETE_TEMPLATE_DRAFT_BY_ID, id)
            .then(_ => {
                NotificationManager.success("Delete Document Template Draft Successfully");
                getAllTemplateDrafts()
            })
            .catch(err => { showError(err, "Delete Template Draft") })
            .finally(() => { hideConfirmPopup(); setLoading(false) })
    }

    /* ============================= useEffect functions ============================= */

    useEffect(() => {
        setLoading(true)
        getAllTemplateDrafts()
        if(localStorage.getItem("document-template-draft-pagesize")){
            setPageSize(localStorage.getItem("document-template-draft-pagesize"))
          }
    }, [])

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
        handleDeleteTemplateDraft(deleteId)
    };

    function onBack() { navigate(APP_ROUTES.DOCUMENT_TEMPLATE_LIST) }

    function handleAddNewTemplateDraft(e) {
        navigate(APP_ROUTES.DOCUMENT_TEMPLATE_ADD, {
            state: {
                templateDraftId: undefined,
                backRoute: APP_ROUTES.DOCUMENT_TEMPLATE_DRAFT_LIST
            }
        });
    }

    function handleEditTemplateDraft(id) {
        navigate(APP_ROUTES.DOCUMENT_TEMPLATE_ADD, {
            state: {
                templateDraftId: id,
                backRoute: APP_ROUTES.DOCUMENT_TEMPLATE_DRAFT_LIST
            }
        });
    }

    function handleDeleteTemplateDraft(id) {
        deleteTemplateDraft(id)
    }

    function handleTemplateDraftView(event) {
        navigate(APP_ROUTES.DOCUMENT_TEMPLATE_VIEW, {
            state: {
                templateDraftId: event.dataItem.id,
                backRoute: APP_ROUTES.DOCUMENT_TEMPLATE_DRAFT_LIST
            }
        });
    }
    const storePage = (pageValue)=>localStorage.setItem("document-template-draft-pagesize", pageValue);

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
                {...navigationAttributes}>
                <div className="k-chip k-chip-md k-rounded-md k-chip-solid k-chip-solid-base"
                    onClick={() => { handleConfirm(props.dataItem.id) }}>
                    <div className="k-chip-content">
                        <Tooltip anchorElement="target" position="top">
                            <i className="fa fa-trash" aria-hidden="true" title="Delete" />
                        </Tooltip>
                    </div>
                </div>
                <div
                    className="k-chip k-chip-md k-rounded-md k-chip-solid k-chip-solid-base m-2"
                    onClick={() => { handleEditTemplateDraft(props.dataItem.id) }}>
                    <div className="k-chip-content">
                        <Tooltip anchorElement="target" position="top">
                            <i className="fas fa-edit" title="Edit" />
                        </Tooltip>
                    </div>
                </div>
            </td>
        )
    }

    return (
        <div className="grid-table ">
            <div className='d-flex justify-content-between align-items-center mb-3'>
                <span className='d-flex justify-content-between align-items-center'>
                    <button type="button" value="BACK" onClick={onBack}
                        className='border-0 bg-transparent arrow-rotate pl-0 mb-0'>
                        <i className='k-icon k-i-sort-asc-sm'></i>
                    </button>
                    <h4 className="address-title text-grey ml-3">
                        <span className="f-24">Document Template Drafts</span>
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
                <Button
                    onClick={handleAddNewTemplateDraft}
                    className="btn blue-primary-outline d-flex align-items-center">
                    {/* <img src={addIcon} alt="" className="me-2 add-img" /> */}
                    Add New Document Template
                </Button>
            </div>
            {loading && <div><Loader /></div>}
            <div className="grid-table">
                <Grid
                    onRowClick={handleTemplateDraftView}

                    data={orderBy(templateDraftList.slice(page, +pageSize + page), sort).map(
                        (item) => ({
                            ...item,
                            [SELECTED_FIELD]: selectedState[idGetter(item)],
                        })
                    )}
                    filterOperators={filterOperators}
                    onDataStateChange={dataStateChange}
                    sort={sort}
                    sortable={true}
                    onSortChange={(e) => {
                        setSort(e.sort);
                    }}
 
                    onPageChange={pageChange}
                    skip={page}
                    take={+pageSize}
                    total={templateDraftList.length}
                    dataItemKey={DATA_ITEM_KEY}
                    pageable={{
                        pageSizes: [10, 20, 30],
                    }}
                >
                    <GridColumn field="name" title="Name" />
                    <GridColumn field="typeString" title="Type" />
                    <GridColumn sortable={false}
                        field="controlListLength" title="Controls" />
                    <GridColumn
                        sortable={false}
                        cell={CustomActionCell} title="Actions" />
                </Grid>
            </div>
            {confirm && (
                <DeleteDialogModal
                    onClose={hideConfirmPopup}
                    title="Document Template Draft"
                    message="document template draft"
                    handleDelete={handleDelete}
                />
            )}
        </div >
    )
}

export default ListDocumentTemplateDrafts;