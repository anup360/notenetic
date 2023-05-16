import React, { useEffect, useState } from "react";
import Loader from "../../../control-components/loader/loader";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";



const ServiceType = ({ data }) => {


    const [loading, setLoading] = useState(false);
    const clinicId = useSelector((state) => state.loggedIn.clinicId);
    const navigate = useNavigate();



    return (
        <div className="border-elig ">
            <h5 className="mb-3">Service Type</h5>

            {
                data.length > 0 &&
                data.map((obj) => (
                    <>
                    <div className="row align-items-center">
                        <div className="col-md-7">
                            <div className="elig_value_text">
                                <h4>Code</h4>
                            </div>
                        </div>
                        <div className="col-md-5">
                            <div className="elig_value">
                                <h5>{obj?.code}</h5>
                            </div>
                        </div>
                    </div>
                    <div className="row align-items-center">
                        <div className="col-md-7">
                            <div className="elig_value_text">
                                <h4>Value</h4>
                            </div>
                        </div>
                        <div className="col-md-5">
                            <div className="elig_value">
                                <h5>{obj?.value}</h5>
                            </div>
                        </div>
                    </div>
                    </>
                ))
            }






        </div>
    );
};
export default ServiceType;
