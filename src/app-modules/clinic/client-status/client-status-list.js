import React, { useEffect, useState } from 'react';
import CustomDrawer from '../../../control-components/custom-drawer/custom-drawer'
import Loader from "../../../control-components/loader/loader";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { orderBy } from "@progress/kendo-data-query";
import { getter } from "@progress/kendo-react-common";
import { Tooltip } from "@progress/kendo-react-tooltip";
import { SettingsService } from "../../../services/settingsService";
import { NotificationManager } from "react-notifications";
import DeleteDialogModal from "../../../control-components/custom-delete-dialog-box/delete-dialog";
import addIcon from "../../../assets/images/add.png";
import AddClientStatus from './add-client-status';
import { renderErrors } from "src/helper/error-message-helper";

const DATA_ITEM_KEY = "id";
const SELECTED_FIELD = "selected";
const idGetter = getter(DATA_ITEM_KEY);

const ClientStatus=()=>{
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = React.useState(10);
    const [sort, setSort] = useState([]);
    const [selectedState, setSelectedState] = React.useState({});
    const [clientStatus, setClientstatus] = useState([]);
    const [clientStatusModal, setClientStatusModel] = React.useState(false);
    const [selectedStatus, setSelectedStatus] = React.useState({});
    const [addClientStatus,setClientStatus]=useState(false)

    useEffect(()=>{
        getClientStatus()
    },[])

    const pageChange = (event) => {
        let skip = event.page.skip;
        let take = event.page.take;
        setPage(skip);
        setPageSize(take);

    };

    const deleteSelected = (obj) => {
        setSelectedStatus(obj)
        setClientStatusModel(true)

    }
    const handleCloseTag = () => {
        setClientStatus(false)
    }

    const getClientStatus = async () => {
        setLoading(true);
        await SettingsService.getclientStatus()
            .then((result) => {
        setLoading(false);
                setLoading(false);
                let list = result.resultData;
                setClientstatus(list);
            })
            .catch((error) => {
                setLoading(false);
                renderErrors(error.message);
            });
    };

    const closeClientStataus = () => {
        setClientStatusModel(false)
    }

    const deleteClientStatus = async () => {
        setLoading(true)
        await SettingsService.deleteClientStatus(selectedStatus?.id)
            .then(result => {
                setLoading(false)
                NotificationManager.success("Client Status Delete Successfully");
                getClientStatus();
                closeClientStataus();
            }).catch(error => {
                setLoading(false)
                renderErrors(error);
            });
    }

    const addNewClientStatus = () => {
        setClientStatus(true)
    }
    return(
        <>
        <div className="d-flex flex-wrap">
            <div className="inner-dt col-md-3 col-lg-2">
                <CustomDrawer />
            </div>
            <div className="col-md-9 col-lg-10">
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
                    <h4 className="address-title text-grey">
                        <span className="f-24">Client Status</span>
                    </h4>
                    <button
                        type="button" data-toggle="modal" data-target="#editform"
                        onClick={addNewClientStatus}
                        className="btn blue-primary text-white d-flex align-items-center mr-3">
                        <img src={addIcon} alt="" className="me-2 add-img" />
                        Add Client Status
                    </button>
                </div>

                <div className="grid-table  filter-grid">
                    <div className=" mt-3">
                        <div className="inner-section-edit position-relative text-center">
                            <div className="grid-table  filter-grid">
                                <div className=" mt-3">
                                    {loading && <Loader />}
                                    <Grid
                                        data={orderBy(clientStatus.slice(page, pageSize + page), sort).map(
                                            (item) => ({
                                                ...item,
                                                [SELECTED_FIELD]: selectedState[idGetter(item)],
                                            })
                                        )}
                                        checkboxElement
                                        style={{
                                            height: clientStatus.length > 0 ? "100%" : "250px",
                                        }}
                                        dataItemKey={DATA_ITEM_KEY}
                                        selectedField={SELECTED_FIELD}
                                        skip={page}
                                        take={pageSize}
                                        total={clientStatus.length}
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
                                        <GridColumn
                                            className="cursor-default"
                                            field="statusName"
                                            title="Status Name"
                                        />
                                      
                                        <GridColumn
                                            title="Action"
                                            filterable={false}
                                            cell={(props) => {
                                                let field = props.dataItem;
                                                return (
                                                    <td>
                                                        <div className="row-3">
                                                            <div
                                                                className="k-chip k-chip-md k-rounded-md k-chip-solid k-chip-solid-base"
                                                                onClick={() => deleteSelected(field)}
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
                addClientStatus &&
                <AddClientStatus  onClose={handleCloseTag} getClientStatus={getClientStatus}/>
            } 
            {
                clientStatusModal &&
                <DeleteDialogModal
                    onClose={closeClientStataus}
                    title="Client Status"
                    message="client status"
                    activeType={false}
                    handleDelete={deleteClientStatus}
                />
            }
            
        </div>
        </>
    )
}
export default ClientStatus 