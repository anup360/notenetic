import React from 'react';
import { ListViewHeader } from '@progress/kendo-react-listview';
import { renderErrors } from "src/helper/error-message-helper";

const DiagnosisHeader = ({handleAddService}) => {
    return <ListViewHeader style={{
        color: '#000000',
        fontSize: 20
    }} className='pl-3 pb-2 pt-2'>
        <div className='d-flex justify-content-between mb-3'>
            <h4 className='address-title text-grey '><span className='f-24'>Diagnosis</span></h4>
            <button onClick={handleAddService} className="btn blue-primary text-white text-decoration-none d-flex align-items-center "><span className="k-icon k-i-plus me-2"></span>Add Service Rate</button>
        </div>
        <div className='row py-2 border-bottom align-middle mt-20'>

            <div className='col-'>
                Diagnosis Name
            </div>
            <div className='col-3'>
                <h2 style={{
                    fontSize: 15,
                    color: '#000000',
                    fontWeight: '600',
                    marginBottom: 0
                }} className="">diagnosis Date</h2>

            </div>
            <div className='col-3'>
                <h2 style={{
                    fontSize: 15,
                    color: '#000000',
                    fontWeight: '600',
                    marginBottom: 0
                }} className="">Actions</h2>

            </div>
        </div>
    </ListViewHeader>;
};

export default DiagnosisHeader;