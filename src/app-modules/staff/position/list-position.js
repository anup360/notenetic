import React from "react";
import moment from "moment";

const PositionList = ({ postionList, handleEdit, handleConfirm }) => {
  return (
    <div>
      <ul className="steps list-unstyled">
        {postionList.map((item, index) => {
          
          return (
            <li
              className={`step is-complete ${
                item.isActive ? "is-active" : "is-complete"
              } pl-3`}
              data-step=""
              key={index}
            >
              <p className="mb-0 fw-500 text-capitalize">{item.positionName}</p>
              <span>
                {item.effectiveDate !== null
                  ? moment(item.effectiveDate).format("M/D/YYYY")
                  : ""}
              </span>
              <span> to </span>
              <span>
                {item.effectiveEndDate !== null
                  ? moment(item.effectiveEndDate).format("M/D/YYYY")
                  : ""}
              </span>
              <button
                className="bg-transparent border-0 p-0 ml-2 "
                data-toggle="tooltip"
                data-placement="top"
                title="Delete"
                onClick={() => {
                  handleConfirm(item.id);
                }}
              >
                <i className="fa fa-trash fa-xs"></i>
              </button>

              <button
                onClick={() => handleEdit(item.id)}
                className="bg-transparent border-0"
                data-toggle="tooltip"
                data-placement="top"
                title="Edit"
              >
                <i className="k-icon k-i-edit f-12 "></i>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PositionList;
