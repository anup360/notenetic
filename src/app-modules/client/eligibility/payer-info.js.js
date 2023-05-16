import React, { useEffect, useState } from "react";
import Loader from "../../../control-components/loader/loader";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";



const Payer = ({ data }) => {


    const [loading, setLoading] = useState(false);
    const clinicId = useSelector((state) => state.loggedIn.clinicId);
    const navigate = useNavigate();



    return (
        <div className="border-elig ">
            {/* <h5 className="mb-3">Payer</h5> */}

            <div className="row align-items-center">
                <div className="col-md-7">
                    <div className="elig_value_text">
                        <h4>Control #</h4>
                    </div>
                </div>
                <div className="col-md-5">
                    <div className="elig_value">
                        <h5>{data?.controlNumber}</h5>
                    </div>
                </div>
            </div>
            <div className="row align-items-center">
                <div className="col-md-7">
                    <div className="elig_value_text">
                        <h4>Payer Name</h4>
                    </div>
                </div>
                <div className="col-md-5">
                    <div className="elig_value">
                        <h5>{data?.payer?.name}</h5>
                    </div>
                </div>
            </div>

            <div className="row align-items-center">
                <div className="col-md-7">
                    <div className="elig_value_text">
                        <h4>Payer ID</h4>
                    </div>
                </div>
                <div className="col-md-5">
                    <div className="elig_value">
                        <h5>{data?.payer?.payerId}</h5>
                    </div>
                </div>
            </div>
           


        </div>
    );
};
export default Payer;
