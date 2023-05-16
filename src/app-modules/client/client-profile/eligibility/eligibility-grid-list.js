import * as React from "react";
import { useTableKeyboardNavigation } from "@progress/kendo-react-data-tools";
import {
    Grid,
    GridColumn,
    GRID_COL_INDEX_ATTRIBUTE,
} from "@progress/kendo-react-grid";
import { Tooltip } from "@progress/kendo-react-tooltip";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import addIcon from "../../../../assets/images/add.png";
import CustomDrawer from "../../../../control-components/custom-drawer/custom-drawer";
import apiHelper from "../../../../helper/api-helper";
import API_URLS from "../../../../helper/api-urls";
import APP_ROUTES from "../../../../helper/app-routes";
import { showError } from "../../../../util/utility";
import { Encrption } from "../../../encrption";
import ClientHeader from "../../client-profile/client-header/client-header";
import useModelScroll from "../../../../cutomHooks/model-dialouge-scroll";
import Loading from "../../../../control-components/loader/loader";
import { permissionEnum } from "../../../../helper/permission-helper";
import AddEligibility from "../../eligibility/add-eligibility";
import moment from "moment";
import ListEligibility from "../../eligibility/dialouge-list-eligibility";


const Eligibility = () => {
    //State

    const [loading, setLoading] = useState(false);
    const selectedClientId = useSelector((state) => state.selectedClientId);
    const [confirm, setConfirm] = useState(false);
    const [deletePhysicianId, setDeletePhysicianId] = useState();
    const [modelScroll, setScroll] = useModelScroll();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const userAccessPermission = useSelector((state) => state.userAccessPermission);
    const [isAddEligibility, setAddEligibility] = useState(false);
    const clientDetails = useSelector((state) => state.clientDetails);

    const [isViewEligibility, setViewEligibility] = useState(false);
    const [eligibilityInfo, setEligibilityInfo] = useState([]);


    const [eligibility, setEligibility] = useState([]);

    const navigate = useNavigate();

    function getEligibility() {
        setLoading(true);
        apiHelper
            .getRequest(
                API_URLS.GET_CLIENT_ELIGIBILITY_BY_CLIENT_ID + Encrption(selectedClientId)
            )
            .then((result) => {
                setEligibility(result.resultData)
            })
            .catch((error) => {
                showError(error, "Fetch Eligibility");
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        getEligibility();
    }, [selectedClientId]);

    // ------------Edit----

    function editPhysician(id) {
        navigate(APP_ROUTES.CLIENT_PHYSICIAN_ADD, { state: { id: id } });
    }

    // -------------Delete----

    const handleConfirm = (id) => {
        setConfirm(true);
        setDeletePhysicianId(id);
        setScroll(true);
    };





    function pageChange(event) {
        let skip = event.page.skip;
        let take = event.page.take;

        setPage(skip);
        setPageSize(take);
    }


    const handleCloseElig = ({ isAdded }) => {
        if (isAdded) {
            setAddEligibility(false);
        } else {
            setAddEligibility(false);
            setScroll(false);
        }

    }


    const handleCloseViewElg = () => {
        setScroll(false);
        setViewEligibility(false);

    }




    const onHandleView = () => {
        // setViewEligibility(true)
        // setScroll(true);
    }


    const CustomActionCell = (props) => {
        const navigationAttributes = useTableKeyboardNavigation(props.id);
        let planList = props.dataItem?.clientEligibilityPlanList;
        return (
            <td
                colSpan={props.colSpan}
                role={"gridcell"}
                aria-colindex={props.ariaColumnIndex}
                aria-selected={props.isSelected}
                {...{ [GRID_COL_INDEX_ATTRIBUTE]: props.columnIndex }}
                {...navigationAttributes}
            >
                {planList.length > 0 ? (
                    planList.map((item) => (
                        <div>
                            <p className="mb-0">
                                <b>Status</b>: {item?.status}
                            </p>
                            <p className="mb-0">
                                <b>Effective Date</b>:{" "}
                                {item?.policyEffectiveDate === null
                                    ? "-/-/-"
                                    : moment(item?.policyEffectiveDate).format(
                                        "M/D/YYYY"
                                    )}
                            </p>
                            <p className="mb-0">
                                <b>Expiration Date</b>:{" "}
                                {item?.policyExpirationDate === null
                                    ? "-/-/-"
                                    : moment(item?.policyExpirationDate).format(
                                        "M/D/YYYY"
                                    )}
                            </p>

                        </div>
                    ))

                ) : (
                    ""
                )}

            </td>
        );
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
                            <span className="f-24">Eligibility</span>
                        </h4>
                        {loading && (
                            <div>
                                <Loading />
                            </div>
                        )}
                        {userAccessPermission[permissionEnum.EDIT_CLIENT_PROFILE] &&

                            <button
                                onClick={() => {
                                    setAddEligibility(true)
                                    setScroll(true);
                                }}
                                className="btn blue-primary text-white text-decoration-none d-flex align-items-center"
                            >
                                <img src={addIcon} alt="" className="me-2 add-img" />
                                Check Eligibility
                            </button>
                        }
                    </div>
                    <br></br>
                    {eligibility.length == 0 && !loading ? (
                        <div className="message-not-found">No Eligibility Available</div>
                    ) : (
                        <div className="grid-table">
                            <Grid
                                data={eligibility.slice(page, pageSize + page)}
                                skip={page}
                                take={pageSize}
                                onPageChange={pageChange}
                                total={eligibility.length}
                                className="pagination-row-cus"
                                pageable={{
                                    pageSizes: [10, 20, 30],
                                }}
                            >

                                <GridColumn
                                    width="250px"
                                    title="ID"
                                    cell={(props) => {
                                        let field = props.dataItem;
                                        return (
                                            <td
                                                className={"cursor-pointer text-theme"}
                                                onClick={() => onHandleView(field)}
                                            >
                                                {field.eligibilityCheckId}
                                            </td>
                                        );
                                    }}
                                    className="anchar-pointer text-theme"
                                />

                                <GridColumn
                                    field="clientName"
                                    title="Client Name"
                                    width="250px"
                                />
                                <GridColumn field="payerName" title="Payer Name" />
                                <GridColumn field="patientGender" title="Gender" />
                                <GridColumn field="subscriberFirstName" title="Subs. First Name" />
                                <GridColumn field="subscriberLastName" title="Subs. Last Name" />
                                <GridColumn cell={CustomActionCell} title="Plans" />
                            </Grid>
                        </div>
                    )}
                </div>
                {
                    isAddEligibility &&
                    <AddEligibility
                        onClose={handleCloseElig}
                        setViewEligibility={setViewEligibility}
                        setEligibilityInfo={setEligibilityInfo}
                        clientDetails={clientDetails}
                    />
                }

                {
                    isViewEligibility &&
                    <ListEligibility
                        onClose={handleCloseViewElg}
                        eligibilityInfo={eligibilityInfo}
                    />
                }

            </div>
        </div>
    );
};
export default Eligibility;
