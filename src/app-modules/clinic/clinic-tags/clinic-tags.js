/**
 * App.js Layout Start Here
 */
import React, { Component, useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import CustomDrawer from '../../../control-components/custom-drawer/custom-drawer'
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
import UpdateClinicTags from './add-tags';
import NOTIFICATION_MESSAGE from "../../../helper/notification-messages";
import useModelScroll from '../../../cutomHooks/model-dialouge-scroll'
import addIcon from "../../../assets/images/add.png";
import AddClinicTags from './add-tags';
import { ColorPicker } from "@progress/kendo-react-inputs";
import { renderErrors } from "src/helper/error-message-helper";

const DATA_ITEM_KEY = "id";
const SELECTED_FIELD = "selected";
const idGetter = getter(DATA_ITEM_KEY);

const ClinicTagsList = () => {

    const [loading, setLoading] = useState(false);
    const clinicId = useSelector((state) => state.loggedIn.clinicId);
    const [tagList, setTagList] = useState([]);
    const [page, setPage] = React.useState(0);
    const [pageSize, setPageSize] = React.useState(10);
    const [sort, setSort] = useState([]);
    const [selectedState, setSelectedState] = React.useState({});
    const [selectedTag, setselectedTag] = React.useState({});
    const [isUpdateTag, setUpdateTag] = React.useState(false);
    const [isDeleteTag, setDeleteTag] = React.useState(false);
    const [modelScroll, setScroll] = useModelScroll()
    const [isAddTag, setAddTag] = React.useState(false);


    useEffect(() => {
        getClinicTags();
    }, [])

    const pageChange = (event) => {
        let skip = event.page.skip;
        let take = event.page.take;
        setPage(skip);
        setPageSize(take);

    };

    const getClinicTags = async () => {
        setLoading(true);
        await SettingsService.getClinicTags(clinicId)
            .then((result) => {
                setLoading(false);
                let list = result.resultData;
                setTagList(list);
            })
            .catch((error) => {
                setLoading(false);
                renderErrors(error.message);
            });
    };


    const editTag = (obj) => {
        setselectedTag(obj)
        setUpdateTag(true)
        setScroll(true)

    }

    const handleCloseTag = ({ updated }) => {
        setUpdateTag(false)
        setAddTag(false)
        if (updated) {
            getClinicTags();
        }
        setScroll(false)

    }

    const deleteTag = (obj) => {
        setselectedTag(obj)
        setDeleteTag(true)
        setScroll(true)

    }

    const closeDeleteTag = () => {
        setDeleteTag(false)
        setScroll(false)


    }

    const deleteTagAPI = async () => {
        setLoading(true)
        await SettingsService.deleteTags(selectedTag?.id)
            .then(result => {
                setLoading(false)
                NotificationManager.success(NOTIFICATION_MESSAGE.TAG_DELETE);
                getClinicTags();
                closeDeleteTag();
            }).catch(error => {
                setLoading(false)
                renderErrors(error);
            });
    }

    const addTags = () => {
        setAddTag(true)
        setScroll(true)

    }


    return (
        <div className="d-flex flex-wrap">
            <div className="inner-dt col-md-3 col-lg-2">
                <CustomDrawer />
            </div>
            <div className="col-md-9 col-lg-10">
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
                    <h4 className="address-title text-grey">
                        <span className="f-24">Clinic Tags</span>
                    </h4>


                    <button
                        type="button" data-toggle="modal" data-target="#editform"
                        onClick={addTags}
                        className="btn blue-primary text-white d-flex align-items-center mr-3">
                        <img src={addIcon} alt="" className="me-2 add-img" />
                        Add Tag
                    </button>
                </div>

                <div className="grid-table  filter-grid">
                    <div className=" mt-3">
                        <div className="inner-section-edit position-relative text-center">
                            <div className="grid-table  filter-grid">
                                <div className=" mt-3">
                                    {loading && <Loader />}
                                    <Grid
                                        data={orderBy(tagList.slice(page, pageSize + page), sort).map(
                                            (item) => ({
                                                ...item,
                                                [SELECTED_FIELD]: selectedState[idGetter(item)],
                                            })
                                        )}
                                        checkboxElement
                                        style={{
                                            height: tagList.length > 0 ? "100%" : "250px",
                                        }}
                                        dataItemKey={DATA_ITEM_KEY}
                                        selectedField={SELECTED_FIELD}
                                        skip={page}
                                        take={pageSize}
                                        total={tagList.length}
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
                                        <GridNoRecords style={{}}>
                                        </GridNoRecords>
                                        {/* <GridColumn filterable={false} field={SELECTED_FIELD} width="100px" /> */}
                                        <GridColumn
                                            className="cursor-default"
                                            field="tagName"
                                            title="Tag Name"
                                        />
                                        <GridColumn
                                            title="Tag Color"
                                            cell={(props) => {
                                                let field = props.dataItem.color;
                                                return (
                                                    <td>
                                                        <ColorPicker
                                                            defaultValue={field}
                                                        />
                                                    </td>
                                                );
                                            }}
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
                                                                onClick={() => deleteTag(field)}
                                                            >
                                                                <div className="k-chip-content">
                                                                    <Tooltip anchorElement="target" position="top">
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
                                                                onClick={() => editTag(field)}
                                                            >
                                                                <div className="k-chip-content">
                                                                    <Tooltip anchorElement="target" position="top">
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
            {
                isUpdateTag &&
                <UpdateClinicTags onClose={handleCloseTag} selectedTag={selectedTag} />
            }
            {
                isAddTag &&
                <AddClinicTags onClose={handleCloseTag} />
            }
            {
                isDeleteTag &&
                <DeleteDialogModal
                    onClose={closeDeleteTag}
                    title="Tag"
                    message="tag"
                    activeType={false}
                    handleDelete={deleteTagAPI}
                />
            }
        </div>
    );

}
export default ClinicTagsList;



