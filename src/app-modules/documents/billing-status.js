import React, { useEffect, useState } from "react";
import Loader from "../../control-components/loader/loader";
import {
    ExpansionPanel,
    ExpansionPanelContent,
} from "@progress/kendo-react-layout";

const ViewBillingStatus = () => {
    const [loading, setLoading] = useState(false);
    const [questionnaireData, seQuestionnaireData] = useState([]);
    const [errors, setErrors] = useState("");

    const [expDocBilling, setExpDocBilling] = React.useState(false);


    return (
        <div>
            <div className="widget-box">
                <ExpansionPanel
                    title="Billing"
                    expanded={expDocBilling}
                    onAction={(e) => setExpDocBilling(!e.expanded)}
                >
                    {expDocBilling && (
                        <ExpansionPanelContent>
                            <div>
                                <div className="text-right">
                                    <button
                                        className="btn blue-primary-outline btn-sm "
                                    >
                                        <i className="k-icon k-i-edit pencile-edit-color"></i>{" "}
                                        Edit
                                    </button>

                                </div>
                                <div className="show-height-common white-scroll">
                                    <div>
                                        <ul className="list-unstyled mb-0 details-info">
                                            <li className="d-flex mb-3">
                                                <p className="mb-0 col-md-6 fw-500">
                                                    Rate
                                                </p>
                                                <p className="mb-0  col-md-6">
                                                    $52
                                                </p>
                                            </li>
                                            <li className="d-flex mb-3">
                                                <p className="mb-0 col-md-6 fw-500">
                                                    Units
                                                </p>
                                                <p className="mb-0  col-md-6">
                                                    30
                                                </p>
                                            </li>
                                            <li className="d-flex mb-3">
                                                <p className="mb-0 col-md-6 fw-500">
                                                    Tolal Bill
                                                </p>
                                                <p className="mb-0  col-md-6">
                                                    $100
                                                </p>
                                            </li>
                                            <li className="d-flex mb-3">
                                                <p className="mb-0 col-md-6 fw-500">
                                                   Bill Status
                                                </p>
                                                <p className="mb-0  col-md-6">
                                                    Pending
                                                </p>
                                            </li>
                                            <li className="d-flex mb-3">
                                                <p className="mb-0 col-md-6 fw-500">
                                                    Bill Comments
                                                </p>
                                                <p className="mb-0  col-md-6">
                                                    In publishing and graphic design
                                                </p>
                                            </li>

                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </ExpansionPanelContent>
                    )}
                </ExpansionPanel>
            </div>
        </div>
    );
};
export default ViewBillingStatus;
