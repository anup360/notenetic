import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import {
  ExpansionPanel,
  ExpansionPanelContent,
} from "@progress/kendo-react-layout";

import { useDispatch, useSelector } from "react-redux";

const MedicationNoteList = ({ notesInfo, setAddNotes, setScroll }) => {
  //State
  const [loading, setLoading] = useState(false);
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const userAccessPermission = useSelector(
    (state) => state.userAccessPermission
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [expMedNotes, setExpMedNotes] = React.useState(true);

  return (
    <>
      <div className="widget-box">
        <ExpansionPanel
          title="Medication Notes"
          expanded={expMedNotes}
          onAction={(e) => setExpMedNotes(!e.expanded)}
        >
          {expMedNotes && (
            <ExpansionPanelContent>
              <div>
                <div className="text-right">
                  <button
                    onClick={() => {
                      setAddNotes(true);
                      setScroll(true);
                    }}
                    className="btn blue-primary-outline btn-sm "
                  >
                    <i className="k-icon k-i-edit pencile-edit-color"></i> Edit
                  </button>
                </div>
                <div className="show-height-common white-scroll">
                  <div>
                    <ul className="list-unstyled mb-0 details-info mt-2">
                      <li className="d-flex mb-3">
                        <p className="mb-0  col-12">{notesInfo?.medNotes}</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </ExpansionPanelContent>
          )}
        </ExpansionPanel>
      </div>
    </>
  );
};

export default MedicationNoteList;
