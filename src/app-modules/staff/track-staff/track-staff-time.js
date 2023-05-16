/**
 * App.js Layout Start Here
 */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { NotificationManager } from "react-notifications";
import addIcon from "../../../assets/images/add.png";

import {
    Grid,
    GridColumn,
    getSelectedState,
    GridToolbar,
    GridNoRecords,
} from "@progress/kendo-react-grid";
import { useDispatch, useSelector } from "react-redux";
import { getter } from "@progress/kendo-react-common";
import Loading from "../../../control-components/loader/loader";
import {
    GridColumnMenuCheckboxFilter,
    GridColumnMenuSort,
    GridColumnMenuFilter,
} from "@progress/kendo-react-grid";
import { filterBy, process, orderBy } from "@progress/kendo-data-query";
import { StaffService } from '../../../services/staffService'
import moment from "moment";
import AddTrackTime from "./add-track-time";
import { renderErrors } from "src/helper/error-message-helper";

const DATA_ITEM_KEY = "id";
const SELECTED_FIELD = "selected";
const idGetter = getter(DATA_ITEM_KEY);

const initialFilter = {
    logic: "and",
    filters: [
        {
            field: "fName",
            operator: "contains",
            value: "",
        },
    ],
};



const TrackStaff = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [trackTimeDdata, setTrackTimeData] = useState([]);
    const [metaData, setMetaData] = useState([]);
    const [sort, setSort] = useState([]);
    const [genderData, setGenderData] = useState([]);
    const [page, setPage] = React.useState(0);
    const [pageSize, setPageSize] = React.useState(10);
    const dispatch = useDispatch();
    const anchor = React.useRef(null);
    const [filter, setFilter] = React.useState(initialFilter);
    const [isTrackTime, setIsAddTrack] = useState(false);

    const [fields, setFields] = useState({

    });
    const [selectedState, setSelectedState] = React.useState({});

    useEffect(() => {
        getStaffTime();
    }, []);

    const pageChange = (event) => {
        let skip = event.page.skip;
        let take = event.page.take;
        setPage(skip);
        setPageSize(take);
        let newValue = skip / take;
        let finalValue = newValue + 1;
        getStaffTime(take, finalValue);
    };

    const getStaffTime = async (take, finalValue) => {
        setLoading(true);
        await StaffService.getStaffTrack(take, pageSize, finalValue)
            .then((result) => {
                setTrackTimeData(result.resultData);
                setMetaData(result.metaData);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                renderErrors(error.message);
            });
    };


    const handleRowClick = (field) => {

    };

    const onSelectionChange = React.useCallback(
        (event) => {
            const newSelectedState = getSelectedState({
                event,
                selectedState: selectedState,
                dataItemKey: DATA_ITEM_KEY,
            });
            setSelectedState(newSelectedState);
        },
        [selectedState]
    );

    const onHeaderSelectionChange = React.useCallback((event) => {
        const checkboxElement = event.syntheticEvent.target;
        const checked = checkboxElement.checked;
        const newSelectedState = {};
        event.dataItems.forEach((item) => {
            newSelectedState[idGetter(item)] = checked;
        });
        setSelectedState(newSelectedState);
    }, []);

    const filterOperators = {
        text: [
            {
                text: "grid.filterContainsOperator",
                operator: "contains",
            },
        ],
    };

    const columnMenus = (props) => {
        return (
            <div>
                {/* <GridColumnMenuCheckboxFilter
                     {...props}
                     data={clientData}
                     expanded={true}
                     searchBox={() => null}
                 /> */}
                <GridColumnMenuSort {...props} data={trackTimeDdata} />
            </div>
        );
    };
    const dataStateChange = (event) => {
        setPage(event.dataState.skip);
        setPageSize(event.dataState.take);
        setSort(event.dataState.sort);
    };


    const handleAddTrackTime = () => {
        setIsAddTrack(true)
    }

    const handleCloseTrack =({updated})=>{
        setIsAddTrack(false)
        if(updated){
            getStaffTime();
        }
    }



    return (
        <div className="grid-table  filter-grid">
            <div className="top-bar-show-list">


                <div className="d-flex justify-content-between align-items-center">
                    <h4 className="address-title text-grey">
                        <span className="f-24">Track Time</span>
                    </h4>
                    <button
                        type="button" data-toggle="modal" data-target="#editform"
                        onClick={handleAddTrackTime}
                        className="btn blue-primary text-white d-flex align-items-center mr-3">
                        <img src={addIcon} alt="" className="me-2 add-img" />
                        Add Track Time
                    </button>


                </div>

            </div>
            {loading && <Loading />}
            <Grid
                data={orderBy(trackTimeDdata, sort).map((item) => ({
                    ...item,
                    [SELECTED_FIELD]: selectedState[idGetter(item)],
                }))}
                checkboxElement
                style={{
                    height: trackTimeDdata.length > 0 ? "100%" : "250px",
                }}
                dataItemKey={DATA_ITEM_KEY}
                // selectedField={SELECTED_FIELD}
                skip={page}
                take={pageSize}
                total={metaData.totalCount}
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
                filterOperators={filterOperators}
                filter={filter}
                onDataStateChange={dataStateChange}
                onSelectionChange={onSelectionChange}
                onHeaderSelectionChange={onHeaderSelectionChange}
            >

                {/* <GridColumn filterable={false} field={SELECTED_FIELD} width="100px" /> */}

                <GridColumn
                    title="Staff Name"
                    cell={(props) => {
                        let field = props.dataItem
                        return (
                            <td className="anchar-pointer text-theme" onClick={() => handleRowClick(field)}>
                                {field.staffName}
                            </td>
                        );
                    }
                    }
                />
                <GridColumn
                    title="In Time"
                    cell={(props) => {
                        let field = props.dataItem
                        return (
                            <td className="anchar-pointer text-theme" onClick={() => handleRowClick(field)}>
                                {moment(field.timeIn, ["h:mm A"]).format("h:mm A")}
                            </td>
                        );
                    }
                    }
                />
                <GridColumn
                    title="Out Time"
                    cell={(props) => {
                        let field = props.dataItem
                        return (
                            <td className="anchar-pointer text-theme" onClick={() => handleRowClick(field)}>
                                {moment(field.timeOut, ["h:mm A"]).format("h:mm A")}
                            </td>
                        );
                    }
                    }
                />
                <GridColumn
                    title="Total Hours"
                    cell={(props) => {
                        let field = props.dataItem
                        return (
                            <td className="anchar-pointer text-theme" onClick={() => handleRowClick(field)}>
                                {field.totalLogHours}

                            </td>
                        );
                    }
                    }
                />
            </Grid>

            {
                isTrackTime && 
                <AddTrackTime onClose={handleCloseTrack} />
            }

        </div>
    );
};
export default TrackStaff;
