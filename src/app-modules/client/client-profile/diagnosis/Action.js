import React from 'react';
import moment from 'moment';
import { renderErrors } from "src/helper/error-message-helper";


const DiagnosisAction=({item})=>{
return(
    <div className='row p-2 border-bottom align-middle' style={{
        margin: 0
    }}>
        <div className='col-2'>
            {"$" + item.serviceRate}
        </div>

        <div className='col-3'>
            <h2 style={{
                fontSize: 14,
                color: '#454545',
                marginBottom: 0
            }} className="">{moment(item.dateEffective).format("M/D/YYYY")}</h2>

        </div>
        <div className='col-3'>
            <h2 style={{
                fontSize: 14,
                color: '#454545',
                marginBottom: 0
            }} className="" >{item.dateEnd && moment(item.dateEnd).format("M/D/YYYY")}</h2>

        </div>
        {/* <div className='col-3'>
            <div className='k-chip k-chip-md k-rounded-md k-chip-solid k-chip-solid-base' onClick={() => deleteServiceRate(item)}>
                <div className='k-chip-content' >
                    <i className="fa fa-trash" aria-hidden="true"></i>
                </div>
            </div>
            <div className='k-chip k-chip-md k-rounded-md k-chip-solid k-chip-solid-base m-2' onClick={() => handleEditServiceRate(item)}>
                <div className='k-chip-content'  >
                    <i className="fas fa-edit"></i>
                </div>
            </div>
        </div> */}
    </div>
)
}

export default DiagnosisAction;