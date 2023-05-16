import React from 'react';
import "../template-file-css/templateFile1.css";


export const TemplateFile2 = () => {
    return <form id="templateFile2">
        <div className='form-template-cus'>
            <div className='row'>
                <div className='col-md-6'>
                    <div className='form-group'>
                        <label>
                            Gender:
                        </label><br />
                        <input type="radio" className='form-control-radio' required name="gender" value={"male"} />
                        <label className='pl-1'> Male</label><br />
                        <input type="radio" className='form-control-radio' required value={"female"} name="gender" />
                        <label className='pl-1'> Female</label><br />
                        <input type="radio" className='form-control-radio' required value={"other"} name="gender" />
                        <label className='pl-1'> Other</label>
                    </div>

                </div>

                <div className='col-md-6'>
                    <div className='form-group ' textName="please select mood">
                        <label>
                            Current Mood:
                        </label><br />
                        <input type="checkbox" className='form-control-checkbox' required
                            name="currentMood" value="anger"
                        />
                        <label className='pl-1'> Anger</label><br />
                        <input type="checkbox" className='form-control-checkbox' required name="currentMood" value="happy" />
                        <label className='pl-1'> Happy</label><br />
                        <input type="checkbox" className='form-control-checkbox' required name="currentMood" value="sad" />
                        <label className='pl-1'> Sad</label>
                    </div>
                </div>


            </div>
            <div className='row'>
                <div className='col-md-6'>
                    <div className='form-group'>
                        <label>
                            Time of Birth:
                        </label>
                        <input type="time"
                            textName="please enter time of birth" required
                            name="timeOfBirth" className='form-control form-control-input add-only' />
                        <span className='view-only timeOfBirth'></span>

                    </div>
                </div>
                <div className='col-md-6'>
                    <div className='form-group'>
                        <label>
                            Date of Birth:
                        </label>
                        <input type="date"
                            textName="please enter date of birth" required
                            name="dob" className='form-control form-control-input add-only' />
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
                        <select textName="please select any fruit"
                            required
                            name="favouriteFruit" className='form-control form-control-select add-only'>
                            <option value="" selected disabled ></option>
                            <option value="mango">Mango</option>
                            <option value="banana">Banana</option>
                            <option value="orange">Orange</option>
                            <option value="apple">Apple</option>
                        </select>
                        <span className='view-only favouriteFruit'></span>

                    </div>
                </div>
            </div>
         
        </div>
    </form>
}