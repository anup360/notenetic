import React, { Component, useEffect, useState } from 'react';
import dummyImg from '../../assets/images/dummy-img.png';
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { convertFromUtcDateToDateOnly, convertFromUtcTimeToTimeOnly } from "../../util/utility";

function notFound() {
let data =[{
    id:1,
    name:"In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the",
    date:"12/25/2023"
},{
    id:2,
    name:"In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the",
    date:"12/25/2023"
}]

    return (
        <div >
            <div className='mian-header-pdf' style={{ display: "flex", justifyContent: 'space-between', alignItems: "center", width: "100%", backgroundColor: "#f6f6f9", padding: "20px 20px", }} >
                <div className="document-sec" >
                    <h6 className='mb-0' style={{ fontweight: "600," }}>Document ID : <span style={{ color: "#4a4a4b", }}>1202</span> </h6>
                </div>
                <div className="document-sec">
                    <h6 className='mb-0'>Client name : <span style={{ color: "#4a4a4b", }}>John Smith</span></h6>
                </div>
                <div className="document-sec">
                    <h6 className='mb-0'>Service Date : <span style={{ color: "#4a4a4b", }}>12/02/2023</span></h6>
                </div>
            </div>
            <div className='row'>
                <div className='col-lg-6'>
                    <div className='document-user-cover text-center bg-light p-5'>
                        <p className="document-pdf-img">
                            <img src={dummyImg} className="user-pdf" alt="" />
                        </p>
                        <h5>Guru Clinic C</h5>
                        <p style={{ color: "#aaa9b0", }}>Progress Note</p>
                    </div>
                </div>
                <div className='col-lg-6 '>
                    <ul className=" document-details-grid list-unstyled p-5">
                        <li className='mb-2'>
                            <p className="fw-bold mb-4">Client Name</p>
                            <span className='text-center '>:</span>
                            <p style={{ color: "#414141" }}>
                                John Smith
                            </p>
                        </li>
                        <li className='mb-2'>
                            <p className="fw-bold mb-4">Service Date</p>
                            <span className='text-center'>:</span>
                            <p style={{ color: "#414141" }}>
                                12/02/2023
                            </p>
                        </li>
                        <li className='mb-2'>
                            <p className="fw-bold mb-4">Time Of Service</p>
                            <span className='text-center'>:</span>
                            <p style={{ color: "#414141" }}>
                                10:00 - 11:00
                            </p>
                        </li>
                        <li>
                            <p className="fw-bold">Location/Site Of Service</p>
                            <span className='text-center'>:</span>
                            <p style={{ color: "#414141" }}>
                                Haryana
                            </p>
                        </li>
                    </ul>
                </div>
            </div>
            <div className='row mt-4  mb-4 px-3'>
                <div className='col-lg-6'>
                    <div className='place-pdf'>
                        <h6 className="blue-style mb-4">Place Of Service</h6>
                        <ul className='placelist pl-0'>
                            <li className='mb-3'>Forem ipsum dolor sit</li>
                            <li className='mb-3'>Forem ipsum dolor sit</li>
                            <li className='mb-3'>Forem ipsum dolor sit</li>
                        </ul>
                    </div>
                </div>
                <div className='col-lg-6'>
                    <div className='place-pdf'>
                        <h6 className="blue-style mb-4"> Service</h6>
                        <ul className='placelist pl-0'>
                            <li className='mb-3'>Forem ipsum dolor sit</li>
                            <li className='mb-3'>Forem ipsum dolor sit</li>
                            <li className='mb-3'>Forem ipsum dolor sit</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='mb-3'>
                    <h6 className="blue-style mb-5"> Treatment Plan</h6>
                </div>
                <div className='col-lg-6'>
                    <div className='treatment-pdf'>
                        <p style={{color:"#4a4a4b !important"}}>Borem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam</p>
                        <ul className='list-unstyled'>
                            <li>
                                <div className='d-flex w-100'>
                                    <p style={{ width: "40px", }}><b>obj :</b></p>
                                    <span style={{ color:"#727272", }}>Borem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</span>
                                </div>
                            </li>
                            <li>
                                <div className='d-flex w-100'>
                                    <p style={{ width: "40px", }}><b>obj :</b></p>
                                    <span style={{ color:"#727272", }}>Borem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className='col-lg-6'>
                    <div className='treatment-pdf'>
                        <p>Borem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam</p>
                        <ul className='list-unstyled'>
                            <li>
                                <div className='d-flex w-100'>
                                    <p style={{ width: "40px", }}><b>obj :</b></p>
                                    <span style={{ color:"#727272", }}>Borem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</span>
                                </div>
                            </li>
                            <li>
                                <div className='d-flex w-100'>
                                    <p style={{ width: "40px", }}><b>obj :</b></p>
                                    <span style={{ color:"#727272", }}>Borem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className='diagnosis-pdf'>
                <h6 className="blue-style mb-4"> Diagnosis</h6>
                <div className="grid-table">
                    <Grid data={data}>
                        <GridColumn
                            title="Diagnosis"
                            cell={(props) => {
                                let field = props.dataItem;
                                return (
                                    <td
                                    >
                                        {field?.name }
                                    </td>
                                );
                            }}
                        />
                        <GridColumn
                            cell={(props) => {
                                let field = props.dataItem;
                                return (
                                    <td
                                    >
                                        {convertFromUtcDateToDateOnly(field?.date)

                                        }
                                    </td>
                                );
                            }}
                            title="Date" />
                    </Grid>
                </div>
            </div>
            <div className='row'>
                <div className='col-lg-6'>
                    <ul className=" document-details-grid list-unstyled p-5">
                        <li className='mb-2'>
                            <p className="fw-bold mb-4  text-center" >First Name</p>
                            <span className='text-center'>:</span>
                            <p style={{ color: "#414141" }}>
                                John
                            </p>
                        </li>

                    </ul>
                </div>
                <div className='col-lg-6'>
                    <ul className=" document-details-grid list-unstyled p-5">
                        <li className='mb-2'>
                            <p className="fw-bold mb-4 text-center">Last Name</p>
                            <span className='text-center'>:</span>
                            <p style={{ color: "#414141", }}>
                                Smith
                            </p>
                        </li>
                    </ul>
                </div>
            </div>
            <div className='row'>
                <div className='col-lg-6'>
                    <div className='gender-pdf'>
                        <div className='mb-3'>
                            <h6 className="blue-style"> Gender</h6>
                        </div>
                        <input type="radio" id="Male" name="fav_language" value="Male" />
                        <label for="Male" className='pl-3 fw-bold' >Male</label><br />
                        <input type="radio" id="Female" name="fav_language" value="Female" />
                        <label for="Female" className='pl-3 fw-bold'>Female</label><br />
                        <input type="radio" id="Other" name="fav_language" value="Other" />
                        <label for="Other" className='pl-3 fw-bold'>Other</label>
                    </div>

                </div>
                <div className='col-lg-6'>
                    <div className='currentmood-pdf'>
                        <div className='mb-3'>
                            <h6 className="blue-style"> Current Mood</h6>
                        </div>
                        <input type="checkbox" id="Anger" name="vehicle1" value="Anger" />
                        <label for="Anger" className='pl-3 fw-bold'> Anger</label><br />
                        <input type="checkbox" id="Happy" name="Happy" value="Happy" />
                        <label for="Happy" className='pl-3 fw-bold'>Happy</label><br />
                        <input type="checkbox" id="Sad" name="Sad" value="Sad" />
                        <label for="Sad" className='pl-3 fw-bold'>Sad</label>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-lg-2 ml-auto' >
                    <div className="signature text-center">
                        <img src={dummyImg} style={{ width: "200px", height: "150px" }}></img>
                        <p className='text-center fw-bold pt-1'>Dr. Sahil Arora</p>
                    </div>
                </div>
            </div>
            <div className='bottom-fotter-pdf mt-5'>
                <div className='mian-header-pdf' style={{ display: "flex", justifyContent: 'space-between', alignItems: "center", width: "100%", backgroundColor: "#f6f6f9", padding: "20px 20px", }} >
                    <div className="document-sec" >
                        <h6 className='mb-0'>Client DOB : <span style={{ color: "#4a4a4b", }}>10/10/1999</span> </h6>
                    </div>
                    <div className="document-sec">
                        <h6 className='mb-0'>Client MID : <span style={{ color: "#4a4a4b", }}>123456</span></h6>
                    </div>
                    <div className="document-sec">
                        <h6 className='mb-0'>Page NO. <span style={{ color: "#4a4a4b", }}>1/10</span></h6>
                    </div>
                </div>
            </div>
        </div>
    );

}
export default notFound;



