import { Tooltip } from "@progress/kendo-react-tooltip";
import moment from "moment";
import React, { useEffect, useState } from "react";
import addIcon from "../../../../assets/images/add.png";
import dummyImg from "../../../../assets/images/dummy-img.png";
import CustomDrawer from "../../../../control-components/custom-drawer/custom-drawer";
import Loader from "../../../../control-components/loader/loader";
import useModelScroll from "../../../../cutomHooks/model-dialouge-scroll";
import ApiHelper from "../../../../helper/api-helper";
import ApiUrls from "../../../../helper/api-urls";
import { Encrption } from "../../../encrption";
import ClientHeader from "../client-header/client-header";
import {
  default as AddContactNotes,
  default as EditContactNotes,
} from "./add-contact-notes";
import ContactDelete from "./delete-contact-notes";
import { permissionEnum } from "../../../../helper/permission-helper";
import { useSelector } from "react-redux";
import { renderErrors } from "src/helper/error-message-helper";

const ContactNotesList = () => {
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const [isAdd, setIsAdd] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [contactNotes, setContactNotes] = useState([]);
  const [isDeleteContact, setDeleteContact] = useState(false);
  const [isEditDiscussion, setEditDiscussion] = useState(false);
  const [selectedContactId, setSelectedcontactId] = useState();
  const [loading, setLoading] = useState(false);
  const [modelScroll, setScroll] = useModelScroll();
  const userAccessPermission = useSelector((state) => state.userAccessPermission);


  useEffect(() => {
    getStaffLists();
    getContactNotes();
  }, [selectedClientId]);

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

  const getContactNotes = () => {
    setLoading(true);
    try {
      ApiHelper.getRequest(
        ApiUrls.GET_CONTACT_NOTES_BY_CLIENT_ID + Encrption(selectedClientId)
      ).then((response) => {
        const data = response.resultData;
        setContactNotes(data);
        setLoading(false);
      });
    } catch (err) { }
  };

  const handleAddDocumnet = () => {
    setIsAdd(!isAdd);
    if (isAdd == false) {
      setScroll(true);
    } else {
      setScroll(false);
    }
  };

  const deleteContactNote = (obj) => {
    setDeleteContact(!isDeleteContact);
    setSelectedcontactId(obj.id);
    if (isDeleteContact == false) {
      setScroll(true);
    } else {
      setScroll(false);
    }
  };

  const editContactNotes = (obj) => {
    setEditDiscussion(!isEditDiscussion);
    setSelectedcontactId(obj.id);
    if (isEditDiscussion == false) {
      setScroll(true);
    } else {
      setScroll(false);
    }
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
              <span className="f-24">Contact Notes</span>
            </h4>

            {userAccessPermission[permissionEnum.MANAGE_CONTACT_NOTES] &&
              <button
                onClick={handleAddDocumnet}
                className="btn blue-primary text-white text-decoration-none d-flex align-items-center "
              >
                <img src={addIcon} alt="" className="me-2 add-img" />
                Add Notes
              </button>
            }

          </div>
          {loading === true && <Loader />}

          {contactNotes.map((item) => (
            <div className="user-people mb-3 grid-view mt-3 ">
              <img
                src={
                  item.contactedByStaffPhoto
                    ? item.contactedByStaffPhoto
                    : dummyImg
                }
                className="user-top"
                alt=""
              />
              <div className="border p-3 rounded">
                <div className="d-flex justify-content-between">
                  <span className="text-grey f-12 mb-2 d-block">
                    <b>{item.contactedByStaffName}</b> contacted to -{" "}
                    <b>{item.relationName}</b> via{" "}
                    <b>{item.methodOfContactName}</b> on{" "}
                    {moment(item.dateOfContact).format("M/D/YYYY")} at{" "}
                    {moment(item.timeOfContact, ["h:mm A"]).format("h:mm A")}
                  </span>
                  {
                    userAccessPermission[permissionEnum.MANAGE_CONTACT_NOTES] &&

                    <div className="delete-btn">
                      <button
                        onClick={() => {
                          deleteContactNote(item);
                        }}
                        type=""
                        className="bg-transparent border-0"
                      >
                        <Tooltip anchorElement="target" position="top">
                          <i
                            className="fa fa-trash fa-xs"
                            aria-hidden="true"
                            title="Delete"
                          ></i>
                        </Tooltip>
                      </button>
                      <button
                        onClick={() => {
                          editContactNotes(item);
                        }}
                        type=""
                        className="bg-transparent border-0"
                      >
                        <Tooltip anchorElement="target" position="top">
                          <i
                            className="fa fa-pencil fa-xs"
                            aria-hidden="true"
                            title="Edit"
                          ></i>
                        </Tooltip>
                      </button>
                    </div>
                  }
                </div>
                <p className="f-14">{item.contactNotes}</p>
              </div>
            </div>
          ))}
          {contactNotes.length == 0 && !loading && (
            <div className="message-not-found mt-3">
              No Contact Notes Available
            </div>
          )}
        </div>
      </div>
      {isAdd && (
        <AddContactNotes
          onClose={handleAddDocumnet}
          orgStaffList={staffList}
          getContactNotes={getContactNotes}
        />
      )}
      {isDeleteContact && (
        <ContactDelete
          onClose={deleteContactNote}
          selectedContactId={selectedContactId}
          getContactNotes={getContactNotes}
        />
      )}
      {isEditDiscussion && (
        <EditContactNotes
          onClose={editContactNotes}
          orgStaffList={staffList}
          getContactNotes={getContactNotes}
          selectedContactId={selectedContactId}
        />
      )}
    </div>
  );
};

export default ContactNotesList;
