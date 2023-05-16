import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Loader from "../../../../control-components/loader/loader";
import CustomDrawer from "../../../../control-components/custom-drawer/custom-drawer";
import ClientHeader from "../client-header/client-header";
import AppRoutes from "../../../../helper/app-routes";
import { Upload } from "@progress/kendo-react-upload";
import { useSelector } from "react-redux";
import ApiHelper from "../../../../helper/api-helper";
import ApiUrls from "../../../../helper/api-urls";
import { NotificationManager } from "react-notifications";
import { useLocation } from "react-router-dom";
import EditDocumentList from "./edit-files-list";
import { Error } from "@progress/kendo-react-labels";
import { Encrption } from '../../../encrption';
import AssignClientTags from './add-files-tags';
import useModelScroll from '../../../../cutomHooks/model-dialouge-scroll'
import { renderErrors } from "src/helper/error-message-helper";

const EditStoredDocuments = () => {
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const clinicId = useSelector((state) => state.loggedIn.clinicId);
  const documentId = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [docTags, setTagsArry] = useState([]);
  const [documents, setDocuments] = useState([]);

  const [uploadError, setUploadError] = useState(false);
  const [isAdded, setIsAdded] = useState(true);
  const [openClientTags, setOpenTags] = React.useState(false);
  const [modelScroll, setScroll] = useModelScroll()

  useEffect(() => {
    getClientDocumentById();
    handlecallback();
    window.scrollTo(0, 0);
  }, []);

  const handlecallback = () => {
    getClientDocumentById();
  };

  const getClientDocumentById = () => {
    setLoading(true);
    ApiHelper.postRequest(
      ApiUrls.POST_CLIENT_STORED_DOCUMENT_BY_ID + Encrption(documentId.state.id)
    )
      .then((result) => {
        setLoading(false);
        const list = result.resultData;
        let newData;
        if (list.length > 0) {
          for (var i = 0; i < list.length; i++) {
            newData = list[i].clientDocumentTags
          }
        }
        setTagsArry(newData);
        setDocuments(list);
      })
      .catch((error) => { });
  };



  const saveDocument = () => {
    setLoading(true);
    let data = {
      docId: documentId.state.id,
      clientId: selectedClientId,
      clinicId: clinicId,
      documents:
        attachments.length > 0
          ? attachments.map((file) => file.getRawFile())
          : null,
    };
    ApiHelper.multipartPostRequest(ApiUrls.POST_CLIENT_ATTACHED_DOCUMENT, data)
      .then((result) => {
        setLoading(false);
        NotificationManager.success("Files added to this document");
        setIsAdded(false)
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
    }
    else {
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


  const handleAddTags = (id) => {
    setOpenTags(true);
    setScroll(true);

  }

  const handleCloseTags = ({ updated }) => {
    if (updated) {
      getClientDocumentById();
    }
    setScroll(false);
    setOpenTags(false);

  }





  return (
    <div className="d-flex flex-wrap">
      {loading === true && <Loader />}
      <div className="inner-dt col-md-3 col-lg-2">
        <CustomDrawer />
      </div>
      <div className="col-md-9 col-lg-10">
        <ClientHeader />

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
                docTags={docTags}
                handleAddTags={handleAddTags}

              />
            </div>
            <div className="col-md-6">
              <p className="f-18 mb-3 fw-500">Add More files to this document</p>

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
                  className="btn blue-primary text-white mx-3"
                  onClick={handleSubmit}
                >
                  Upload
                </button>
                <button
                  className="btn grey-secondary text-white "
                  onClick={() => {
                    navigate(AppRoutes.STORED_DOCUMENTS);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {
        openClientTags &&
        <AssignClientTags
          onClose={handleCloseTags}
          docId={documentId?.state.id}
          docTags={docTags}

        />
      }
    </div>
  );
};

export default EditStoredDocuments;
