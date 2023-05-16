import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import APP_ROUTES from "../../helper/app-routes";
import ViewDocument from "./view-document";
import MultiSelectDropDown from "../../control-components/multi-select-drop-down/multi-select-drop-down";
import apiHelper from '../../helper/api-helper';
import API_URLS from '../../helper/api-urls';
import { GET_DOCUMENT_FILTER } from "../../actions";
import { showError } from '../../util/utility';
import { useDispatch, useSelector } from "react-redux";
import { Input, NumericTextBox } from '@progress/kendo-react-inputs';
import { Switch } from "@progress/kendo-react-inputs";
import { NotificationManager } from "react-notifications";
import { renderErrors } from "src/helper/error-message-helper";

const SideFilter = ({ showFilter, handleShowFilter, advSearchFields, setAdvSearchFields, setPage, setPageSize
    , defaultPageSettings, fetchDocuments, docFilter, setIsActiveCheck, isActiveCheck
}) => {

    const [isFilter, setFilter] = useState();
    const [staffList, setStaffList] = useState([])
    const [loading, setLoading] = useState({})
    const clinicId = useSelector((state) => state.loggedIn.clinicId);
    const [templateList, setTemplateList] = useState([])
    const dispatch = useDispatch();


    useEffect(() => {
        if (showFilter) {
            setFilter(true)
        } else {
            setFilter(false)
        }

        getAllDocumentTemplates()
    }, [])



    async function getAllDocumentTemplates() {
        apiHelper.getRequest(
            API_URLS.GET_DOCUMENT_TEMPLATE_BY_CLINIC_ID
        )
            .then((result) => {
                if (result.resultData) {
                    const list = result.resultData.map(r => { return { id: r.id, name: r.templateName } })
                    setTemplateList(list)
                }
            })
            .catch((err) => {
                showError(err, "Fetch Document Templates");
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const handleChange = (e) => {
        const name = e.target.name;
        let value = e.target.value;

        const newAdvSearchFileds = {
            ...advSearchFields,
            [name]: value,
        }
        setAdvSearchFields(newAdvSearchFileds)
    }


    const handleApplyFilter = () => {

        if (advSearchFields?.documentId !== "" && advSearchFields.documentId == "0") {
            renderErrors("Document id couldn't be zero")
        } else {
            dispatch({
                type: GET_DOCUMENT_FILTER,
                payload: advSearchFields,
            });

            setPage(defaultPageSettings.page)
            setPageSize(defaultPageSettings.pageSize)
            fetchDocuments()
        }
    }


    const handleClearFilter = () => {
        setAdvSearchFields({
            ...advSearchFields,
            template: [],
            documentId: ""
        })
        dispatch({
            type: GET_DOCUMENT_FILTER,
            payload: {
                template: [],
                documentId: ""
            },
        });
        setIsActiveCheck(false)
        setPage(defaultPageSettings.page)
        setPageSize(defaultPageSettings.pageSize)
        fetchDocuments()
        // handleShowFilter()

    }

    const handleTrashSwitch = (e) => {
        var changeVal = e.target.value;
        setIsActiveCheck(changeVal);
    };

    function renderToItem(li, itemProps) {
        const itemChildren = (
            <span>
                <input
                    type="checkbox"
                    name={itemProps.dataItem}
                    checked={itemProps.selected}
                    onChange={(e) => itemProps.onClick(itemProps.index, e)}
                />
                &nbsp;{li.props.children}
            </span>
        );
        return React.cloneElement(li, li.props, itemChildren);
    }




    return <div
        className={showFilter ? "opensidebar" : "closedsidebar"}
        id="sidefiter" >
        <div className="d-flex justify-content-end" onClick={handleShowFilter}>
            <a className="" ><i className="fa fa-times cross-icon  mr-1"  ></i></a>
        </div>


        <div className='documnet-id-filter mb-3'>
            <MultiSelectDropDown
                data={templateList}
                loading={loading.templateList}
                textField="name"
                label='Template'
                name="template"
                value={advSearchFields.template}
                onChange={handleChange}
                autoClose={true}
                dataItemKey={"id"}
                itemRender={renderToItem}

            />
        </div>

        <div className='documnet-id-filter mb-3'>
            <NumericTextBox
                validityStyles={false}
                value={advSearchFields.documentId}
                onChange={handleChange}
                name="documentId"
                label='Document ID'
                spinners={false}
            />
        </div>


        <div className='documnet-id-filter mb-3'>
            <Switch
                onChange={handleTrashSwitch}
                checked={isActiveCheck}
                onLabel={""}
                offLabel={""}
                className="switch-on"
            />
            <span className="switch-title-text ml-2">
                Show Trashed
            </span>

        </div>
        <div className="d-flex">
            <div>
                <button type='button' className='btn blue-primary  mt-2'
                    onClick={handleApplyFilter}>
                    Show Docs
                </button>
            </div>
            <div>
                <button type='button' className='btn grey-secondary mt-2 ml-2'
                    onClick={handleClearFilter}>
                    Clear
                </button>
            </div>
        </div>
    </div>


}

export default SideFilter;