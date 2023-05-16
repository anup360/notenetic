import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Loader from "../../../control-components/loader/loader";
import DrawerContainer from "../../../control-components/custom-drawer/custom-drawer";
import StaffProfileHeader from "../staff-profile/staff-profile-header";
import AppRoutes from "../../../helper/app-routes";
import { Upload } from "@progress/kendo-react-upload";
import { useSelector } from "react-redux";
import ApiHelper from "../../../helper/api-helper";
import ApiUrls from "../../../helper/api-urls";
import { NotificationManager } from "react-notifications";
import { useLocation } from "react-router-dom";
import EditDocumentList from "./edit-files-list";
import { Error } from "@progress/kendo-react-labels";
import { ProseMirror } from "@progress/kendo-react-editor";
import { Encrption } from "../../encrption";
import AssignStaffTags from "./add-files-tags";
import { StaffService } from "../../../services/staffService";
import useModelScroll from "../../../cutomHooks/model-dialouge-scroll";
import { renderErrors } from "src/helper/error-message-helper";

import { Chip, ChipList } from "@progress/kendo-react-buttons";

const EditStaffStoredDocuments = () => {
  const staffId = useSelector((state) => state.loggedIn?.staffId);
  const clinicId = useSelector((state) => state.loggedIn.clinicId);
  const documentId = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [uploadError, setUploadError] = useState(false);
  const [openTags, setOpenTags] = React.useState(false);
  const [docTags, setTagsArry] = useState([]);
  const [modelScroll, setScroll] = useModelScroll();

  const [isAdded, setIsAdded] = useState(true);

  useEffect(() => {
    getClientDocumentById();
    handlecallback();
    window.scrollTo(0, 0);
  }, []);

  const handlecallback = () => {
    getClientDocumentById();
  };

  // function addAttachment(e) {
  //   setAttachments(e.affectedFiles);
  //   setUploadError(false);
  // }

  // function removeAttachment(e) {
  //   for (const file of e.affectedFiles) {
  //     setAttachments(attachments.filter((r) => r === file));
  //   }
  // }
  // const renderFileUI = () => {
  //   const handleRemove = (id) => {
  //     const newList = attachments.filter((item) => item.uid !== id);
  //     setAttachments(newList);
  //   };
  //   return (
  //     <>
  //       {attachments.length > 0 ? (
  //         attachments.map((file) => (
  //           <ul>
  //             <li key={file.name}>
  //               {file.name}
  //               <button
  //                 data-toggle="tooltip"
  //                 title="Remove Attachment"
  //                 className="mx-2 theme-text border-0"
  //                 onClick={() => handleRemove(file.uid)}
  //               ></button>
  //             </li>
  //           </ul>
  //         ))
  //       ) : (
  //         <p> No data found</p>
  //       )}
  //     </>
  //   );
  // };

  const getClientDocumentById = () => {
    let documentSelectedId = Encrption(documentId.state.id);
    let staffSelected = Encrption(staffId);
    setLoading(true);
    ApiHelper.getRequest(
      ApiUrls.GET_STAFF_STORED_DOCUMENT_BY_ID +
        "?docId=" +
        documentSelectedId +
        "&staffId=" +
        staffSelected
    )
      .then((result) => {
        setLoading(false);
        const list = result.resultData;
        let newData;
        if (list.length > 0) {
          for (var i = 0; i < list.length; i++) {
            newData = list[i].staffDocumentTags;
          }
        }
        setTagsArry(newData);
        setDocuments(list);
      })
      .catch((error) => {});
  };

  const saveDocument = () => {
    setLoading(true);
    let data = {
      docId: documentId.state.id,
      staffId: staffId,
      documents:
        attachments.length > 0
          ? attachments.map((file) => file.getRawFile())
          : null,
    };
    ApiHelper.multipartPostRequest(ApiUrls.POST_ADD_ATTACHMENT_DOCUMNET, data)
      .then((result) => {
        setLoading(false);
        NotificationManager.success("Files added to this document");
        setIsAdded(false);
        setAttachments([]);
        getClientDocumentById();
      })
      .catch((error) => {
        setLoading(false);
        renderErrors(error.message);
      });
  };
  const handleSubmit = () => {
    if (attachments.length === 0) {
      setUploadError(true);
    } else {
      saveDocument();
    }
  };

  const onAdd = (event) => {
    setAttachments(event.newState);

    setUploadError(false);
  };

  const onRemove = (event) => {
    setAttachments(event.newState);
  };

  const onStatusChange = (event) => {
    setAttachments(event.newState);
  };

  const handleAddTags = () => {
    setOpenTags(true);
    setScroll(true);
  };

  const handleCloseTags = ({ updated }) => {
    if (updated) {
      getClientDocumentById();
    }
    setScroll(false);
    setOpenTags(false);
  };

  const handleRemoveTags = (e, obj) => {
    deleteTags(obj.id);
  };

  const deleteTags = async (id) => {
    await StaffService.removeStaffDocTags(id)
      .then((result) => {
        getClientDocumentById();
      })
      .catch((error) => {
        renderErrors(error.message);
      });
  };

  return (
    <div className="d-flex flex-wrap">
      {loading === true && <Loader />}
      <div className="inner-dt col-md-3 col-lg-2">
        <DrawerContainer />
      </div>
      <div className="col-md-9 col-lg-10">
        <StaffProfileHeader />

        <div className="mt-3">
          <h4 className="address-title text-grey ">
            <span className="f-24">Edit File</span>
          </h4>

          <div className="d-flex flex-wrap">
            <div className="col-md-6 mb-3 mb-md-0 details-info firts-details-border">
              <EditDocumentList
                documents={documents}
                handlecallback={handlecallback}
                getClientDocumentById={getClientDocumentById}
                setLoading={setLoading}
                handleRemoveTags={handleRemoveTags}
                docTags={docTags}
                handleAddTags={handleAddTags}
              />
            </div>
            <div className="col-md-6">
              <p className="f-18 mb-3 fw-500">
                Add More files to this document
              </p>

              <Upload
                batch={false}
                multiple={true}
                autoUpload={false}
                defaultFiles={isAdded && attachments}
                onAdd={onAdd}
                onRemove={onRemove}
                onStatusChange={onStatusChange}
                withCredentials={false}
                showActionButtons={false}
                ariaDescribedBy={"firstNameError"}
              />
              {uploadError && <Error>File is required</Error>}

              <div className="right-sde mt-3">
                <button
                  className="btn blue-primary text-white"
                  onClick={handleSubmit}
                >
                  Upload
                </button>
                <button
                  className="btn grey-secondary text-white mx-3"
                  onClick={() => {
                    navigate(AppRoutes.STAFF_STORED_DOCUMENTS);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {openTags && (
        <AssignStaffTags
          onClose={handleCloseTags}
          docId={documentId.state.id}
          staffTags={documents}
        />
      )}
    </div>
  );
};

export default EditStaffStoredDocuments;
