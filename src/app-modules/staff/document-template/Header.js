import React, { useState, useEffect } from "react";
import Loader from "../../../../src/control-components/loader/loader";
import DrawerContainer from "../../../control-components/custom-drawer/custom-drawer";
import StaffProfileHeader from "../../../../src/app-modules/staff/staff-profile/staff-profile-header";
import apiHelper from "../../../helper/api-helper";
import API_URLS from "../../../helper/api-urls";
import { useSelector } from "react-redux";
import { Encrption } from '../../encrption';
import DocumentTemplate from "./assign-document-template";
import { permissionEnum } from "../../../helper/permission-helper";
import { renderErrors } from "src/helper/error-message-helper";

const DocumentTemplateHeader = () => {
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState([]);
  const [assigned, setAssigned] = useState([]);
  const selectedStaffId = useSelector((state) => state.selectedStaffId);
  const userAccessPermission = useSelector((state) => state.userAccessPermission);

  useEffect(() => {
    AvailableDocumentTemplate();
    AssignedDocumentTemplate();
  }, []);

  const AvailableDocumentTemplate = () => {
    setLoading(true);
    apiHelper
      .getRequest(API_URLS.GET_DOCUMENT_TEMPLATES_DDL)
      .then((result) => {
        const data = result.resultData.map((item)=>{
          return{
            templateId:item.id,
            templateName:item.templateName
          }
        });
        if ( userAccessPermission[permissionEnum.MANAGE_STAFF_TEMPLATE]) {

        setAvailable(data);
        }
        setLoading(false);
      })
      .catch((error) => { });
  };

  const AssignedDocumentTemplate = () => {
    let staffSelected = Encrption(selectedStaffId)
    setLoading(true);
    apiHelper
      .getRequest(
        API_URLS.GET_STAFF_ASSIGNED_TEMPLATES_ONLY +
        staffSelected +
        "&active=" +
        1
      )
      .then((result) => {
        const data = result.resultData.map((item)=>{
          return{
            templateId:item.templateId,
            templateName:item.templateName
          }
        });
        setAssigned(data);
        setLoading(false);
      })
      .catch((error) => { });
  };

  return (
    <div className="d-flex flex-wra">
      {loading === true && <Loader />}
      <div className="inner-dt col-md-3 col-lg-2">
        <DrawerContainer />
      </div>
      <div className="col-md-9 col-lg-10 ">
        <StaffProfileHeader />

        <div className="px-2 mt-4">
          <div className="row ">
            <DocumentTemplate available={available} assigned={assigned} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentTemplateHeader;
