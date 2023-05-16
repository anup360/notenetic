import React, { useEffect, useState } from "react";
import Loader from "../../../control-components/loader/loader";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";



const Patient = ({ data }) => {


    const [loading, setLoading] = useState(false);
    const clinicId = useSelector((state) => state.loggedIn.clinicId);
    const navigate = useNavigate();



    return (
        <div className="border-elig ">
            <h5 className="mb-3">Patient</h5>

            <div className="row align-items-center">
                <div className="col-md-7">
                    <div className="elig_value_text">
                        <h4>First Name</h4>
                    </div>
                </div>
                <div className="col-md-5">
                    <div className="elig_value">
                        <h5>{data?.firstName}</h5>
                    </div>
                </div>
            </div>
            <div className="row align-items-center">
                <div className="col-md-7">
                    <div className="elig_value_text">
                        <h4>Last Name</h4>
                    </div>
                </div>
                <div className="col-md-5">
                    <div className="elig_value">
                        <h5>{data?.lastName}</h5>
                    </div>
                </div>
            </div>

            <div className="row align-items-center">
                <div className="col-md-7">
                    <div className="elig_value_text">
                        <h4>Subscriber Relationship</h4>
                    </div>
                </div>
                <div className="col-md-5">
                    <div className="elig_value">
                        <h5>{data?.subscriberRelationship}</h5>
                    </div>
                </div>
            </div>
           


        </div>
    );
};
export default Patient;
