import React from 'react';
import "../template-file-css/templateFile1.css";


export const TemplateFile1 = ({ itemsRef, showErrorFor }) => {

    return <form id="templateFile1" className='file-pdf-document'>
        <div className='form-template-cus'>
            <div className='row'>
                <div className='col-md-6'>
                    <div className='form-group'>
                        <label>
                            First Name:
                        </label>
                        <input id="0" ref={el => itemsRef.current[0] = el}
                            name="firstName" type="text" msg="please enter first name" required
                            className='form-control form-control-input  add-only' />
                        {showErrorFor("0")}
                        <span className='view-only firstName'></span>
                        <p className='error-message firstName-error'></p>

                    </div>
                </div>
                <div className='col-md-6'>
                    <div className='form-group'>
                        <label>
                            Last Name:
                        </label>
                        <input id="1" ref={el => itemsRef.current[1] = el}
                            type="text" name="lastName"
                            className='form-control form-control-input add-only' />
                        <span className='view-only lastName'></span>
                    </div>
                </div>

            </div>
            <div className='row'>
                <div className='col-md-6'>
                    <div className='form-group'>
                        <label name="gender">
                            Gender:
                        </label><br />
                        <input id="2" ref={el => itemsRef.current[2] = el} type="radio" className='form-control-radio' required name="gender" value={"male"} />
                        <label className='pl-1'> Male</label><br />
                        <input id="2" type="radio" className='form-control-radio' required value={"female"} name="gender" />
                        <label className='pl-1'> Female</label><br />
                        <input id="2" type="radio" className='form-control-radio' required value={"other"} name="gender" />
                        <label className='pl-1'> Other</label>
                        {showErrorFor("2")}
                    </div>

                </div>

                <div className='col-md-6'>
                    <div className='form-group ' msg="please select mood">
                        <label name="currentMood">
                            Current Mood:
                        </label><br />
                        <input id="3" ref={el => itemsRef.current[3] = el} type="checkbox" className='form-control-checkbox' required
                            name="currentMood" value="anger"
    
                        />
                        <label className='pl-1'> Anger</label><br />
                        <input id="3" type="checkbox" className='form-control-checkbox' required name="currentMood" value="happy" />
                        <label className='pl-1'> Happy</label><br />
                        <input id="3" type="checkbox" className='form-control-checkbox' required name="currentMood" value="sad" />
                        <label className='pl-1'> Sad</label>
                        {showErrorFor("3")}
                    </div>
                </div>


            </div>
            <div className='row'>
                <div className='col-md-6'>
                    <div className='form-group'>
                        <label>
                            Time of Birth:
                        </label>
                        <input id="4" ref={el => itemsRef.current[4] = el} type="time"
                            msg="please enter time of birth" required
                            name="timeOfBirth" className='form-control form-control-input add-only' />
                        {showErrorFor("4")}
                        <span className='view-only timeOfBirth'></span>

                    </div>
                </div>
                <div className='col-md-6'>
                    <div className='form-group'>
                        <label>
                            Date of Birth:
                        </label>
                        <input id="5"  ref={el => itemsRef.current[5] = el} type="date"
                            msg="please enter date of birth" required
                            name="dob" className='form-control form-control-input add-only' />
                        {showErrorFor("5")}
                        <span className='view-only dob '></span>

                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-md-12'>
                    <div className='form-group select-box-cus position-relative'>
                        <label>
                            Favorite Fruit:
                        </label>
                        <select  id="6" ref={el => itemsRef.current[6] = el} msg="please select any fruit"
                            required defaultValue={""}
                            name="favouriteFruit" className='form-control form-control-select add-only'>
                            <option value="" disabled ></option>
                            <option value="mango">Mango</option>
                            <option value="banana">Banana</option>
                            <option value="orange">Orange</option>
                            <option value="apple">Apple</option>
                        </select>
                        {showErrorFor("6")}
                        <span className='view-only favouriteFruit'></span>

                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-md-12'>
                    <div className='form-group'>
                        <label>
                            Medical History:
                        </label>
                        <textarea id="7" ref={el => itemsRef.current[7] = el} msg="please enter medical history" required type="text" name="medicalHistory"
                            className='form-control form-control-textarea add-only' />
                        <span className='view-only medicalHistory '></span>
                        {showErrorFor("7")}
                    </div>
                </div>
            </div>
        </div>
    </form>
}