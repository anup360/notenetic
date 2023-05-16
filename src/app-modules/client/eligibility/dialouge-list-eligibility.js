import React, { useEffect, useState } from "react";
import Loader from "../../../control-components/loader/loader";
import { useSelector } from "react-redux";
import { Dialog } from "@progress/kendo-react-dialogs";
import { useNavigate } from "react-router";

import SubscriberInfo from "./subscriber-info";
import Plans from "./plans";
import Payer from './payer-info.js.js'

import Patient from './patient-info'
import ServiceType from './service-type';



const ListEligibility = ({ onClose, eligibilityInfo }) => {

    const [loading, setLoading] = useState(false);
    const clinicId = useSelector((state) => state.loggedIn.clinicId);
    const navigate = useNavigate();


    return (
        <div>
            <Dialog
                onClose={onClose}
                title={"Eligibility"}
                className="dialog-modal"
            >
                <div className="client-accept edit-client-popup">
                    <div className="popup-modal">

                        {
                            eligibilityInfo.length > 0 && eligibilityInfo.map((data) => (
                                <div >
                                    <div class="row gy-3">
                                        <div class="col-md-6">
                                            <SubscriberInfo data={data.subscriber} />
                                        </div>
                                      
                                        <div class="col-md-6">
                                            <Patient data={data?.patient} />
                                        </div>
                                        <div class="col-md-6">
                                            <Payer data={data} />
                                        </div>
                                        <div class="col-md-6">
                                            <ServiceType data={data?.requestedServiceType} />
                                        </div>


                                    </div>
                                    {data?.plans.length > 0 &&
                                        <Plans data={data?.plans} />}
                                </div>
                            ))
                        }
                    </div>
                    {loading == true && <Loader />}
                </div>
                <div className="border-bottom-line"></div>

            </Dialog>
        </div>
    );
};
export default ListEligibility;
