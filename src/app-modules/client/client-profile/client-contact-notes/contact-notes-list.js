import React, { useState, useEffect } from "react";
import CustomDrawer from "../../../../control-components/custom-drawer/custom-drawer";
import ClientHeader from "../client-header/client-header";
import addIcon from "../../../../assets/images/add.png";
import AddContactNotes from "./add-contact-notes";
import ApiUrls from "../../../../helper/api-urls";
import ApiHelper from "../../../../helper/api-helper";
import { useSelector } from "react-redux";
import { renderErrors } from "src/helper/error-message-helper";

const ContactNotesList = () => {
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const [isAdd, setIsAdd] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [contactNotes, setContactNotes] = useState([]);

  useEffect(() => {
    getStaffLists();
    getContactNotes();
  }, []);

  async function getStaffLists() {
    try {
      const result = await ApiHelper.getRequest(
        ApiUrls.GET_STAFF_DDL_BY_CLINIC_ID
      );
      const staffObjList = result.resultData.map((x) => {
        return {
          id: x.id,
          name: x.name,
        };
      });
      setStaffList(staffObjList);
    } catch (err) { }
  }

  async function getContactNotes() {
    try {
      const result = await ApiHelper.getRequest(
        ApiUrls.GET_CONTACT_NOTES_BY_CLIENT_ID + selectedClientId
      ).then((response) => {
        const data = response.resultData;
        setContactNotes(data);
      });
    } catch (err) { }
  }

  const handleEditDocumnet = (id, name) => {
    setIsAdd(true);
    // setDocumentslectId(id);
    // setDocumentSelectName(name);
  };
  const handleClose = () => {
    setIsAdd(!isAdd);
  };

  return (
    <div className="d-flex flex-wrap">
      <div className="inner-dt col-md-3 col-lg-2">
        <CustomDrawer />
      </div>
      <div className="col-md-9 col-lg-10">
        <ClientHeader />
        <div className="Service-RateList">
          <div className="d-flex justify-content-between  mt-3">
            <h4 className="address-title text-grey ">
              <span className="f-24">Document Notes</span>
            </h4>

            <button
              // onClick={() => {
              //   navigate(AppRoutes.ADD_STORED_DOCUMENTS);
              // }}
              onClick={handleEditDocumnet}
              className="btn blue-primary text-white text-decoration-none d-flex align-items-center "
            >
              <img src={addIcon} alt="" className="me-2 add-img" />
              Add Notes
            </button>

          </div>
        </div>
      </div>
      {isAdd && (
        <AddContactNotes onClose={handleClose} orgStaffList={staffList} />
      )}
    </div>
  );
};

export default ContactNotesList;
