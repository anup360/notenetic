import React, { useState } from "react";
import ApiHelper from "../../../helper/api-helper";
import ApiUrls from "../../../helper/api-urls";
import { NotificationManager } from "react-notifications";
import EditDocumentName from "./edit-file-name";
import { useSelector } from "react-redux";
import { Encrption } from '../../encrption';
import { Chip, ChipList } from "@progress/kendo-react-buttons";
import { renderErrors } from "src/helper/error-message-helper";

const EditDocumentList = ({
  documents,
  handleEdit,
  handlecallback,
  getClientDocumentById,
  setLoading,
  docTags,
  handleAddTags,
  handleRemoveTags

}) => {
  const staffId = useSelector((state) => state.loggedIn?.staffId);
  const [isEdit, setIsEdit] = useState(false);
  const [documnetselectId, setDocumentslectId] = useState("");
  const [documentSelectName, setDocumentSelectName] = useState("");



  function renderAttachments(documents) {
    const li = documents.staffDocumentAttachments.map((file) => {
      return (
        <li className="mb-3 mx-1">
          <a href={file.attachmentUrl} target="_blank" download>
            {file.fileName}
          </a>
          <button
            className=" bg-transparent border-0 pr-3 fa-solid fa-xmark"
            onClick={() => {
              handleDeleteDocument(documents.id, file.id);
            }}
          ></button>
        </li>
      );
    });
    return (
      <ul className="d-flex flex-wrap upload-attachemnt list-unstyled mt-3">
        {li}
      </ul>
    );
  }

  const handleDeleteDocument = (docId, attachmentId) => {
    let documentId = Encrption(docId)
    let staffSelected = Encrption(staffId)
    let attachemntSelectedId = Encrption(attachmentId)
    setLoading(true)
    ApiHelper.deleteRequest(
      ApiUrls.DELETE_STAFF_ATTACHMENT +
      "?docId=" +
      documentId +
      "&attachmentId=" +
      attachemntSelectedId +
      "&staffProfileId=" +
      staffSelected
    )
      .then(() => {
        setLoading(false)
        NotificationManager.success("Attachment deleted successfully");
        handlecallback();
      })
      .catch((error) => {
        renderErrors(error.message);
      });
  };

  const handleEditDocumnet = (id, name) => {
    setIsEdit(true);
    setDocumentslectId(id);
    setDocumentSelectName(name);
  };

  const handleClose = () => {
    setIsEdit(!isEdit);
  };

  return (
    <div>
      <div className="steps list-unstyled mt-3">
        {documents.map((item, index) => {
          return (
            <div data-step="" key={index}>
              <div style={{ display: "flex " }} className="mb-3">
                <p className="mb-0 fw-500 text-capitalize mr-2">
                  {item.docName}
                </p>
                <button
                  onClick={() => handleEditDocumnet(item.id, item.docName)}
                  className="bg-transparent border-0 px-1 py-0"
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Edit"
                >
                  <i className="k-icon k-i-edit f-12 "></i>
                </button>
              </div>
              <hr></hr>
              {docTags.length > 0 &&
                docTags.map((obj) => (
                  <Chip
                    text={obj.tagName}
                    key={obj.id}
                    value="chip"
                    rounded={"large"}
                    fillMode={"solid"}
                    removable={true}
                    size={"medium"}
                    style={{ marginRight: 5, backgroundColor: obj.color, marginBottom: 10, color: '#ffffff' }}
                    onRemove={(e) => {
                      handleRemoveTags(e, obj);
                    }}
                  />
                ))
              }
              <Chip
                text="Add Tags"
                value="chip"
                icon={"k-icon k-i-plus k-icon-64"}
                rounded={"large"}
                fillMode={"solid"}
                size={"medium"}
                onClick={handleAddTags}
                style={{ marginBottom: 10, }}
              />
              <h4 className="address-title text-grey ">
                <span className="f-24">Files</span>
              </h4>
              <div style={{ display: "flex" }}>
                <span>{renderAttachments(item)}</span>
                <button
                  className="bg-transparent border-0 p-0"
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Delete"
                ></button>
              </div>
            </div>
          );
        })}
      </div>
      {isEdit && (
        <EditDocumentName
          documnetselectId={documnetselectId}
          documentSelectName={documentSelectName}
          onClose={handleClose}
          getClientDocumentById={getClientDocumentById}
        />
      )}
    </div>
  );
};

export default EditDocumentList;
