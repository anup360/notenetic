import { MultiSelect } from "@progress/kendo-react-dropdowns";
import { Editor, EditorTools, EditorUtils } from "@progress/kendo-react-editor";
import { Upload } from "@progress/kendo-react-upload";
import React, { useEffect, useState } from 'react';
import { NotificationManager } from "react-notifications";
import Loader from '../../control-components/loader/loader';
import ApiHelper from '../../helper/api-helper';
import ApiUrls from '../../helper/api-urls';
import { showError } from "../../util/utility";
import MessagePGCreateView from './message-pg-create';
import MessagePGListView from './message-pg-list';
import useModelScroll from '../../cutomHooks/model-dialouge-scroll'
import { Error } from '@progress/kendo-react-labels';

function MessageCompose({ orgStaffList, onClose, message, isReplying, isForwarding, isInSent }) {



    const [loading, setLoading] = useState(false);
    const [minimize, setMinimize] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [rbVisible, setRBVisible] = useState(false);
    const [pgVisible, setPGVisible] = useState(false);
    const [toStaffList, setToStaffList] = useState({ value: [], allSelected: true });
    const [toRoleBasedList, setToRoleBasedList] = useState([]);
    const [toPersonalGroupList, setToPersonalGroupList] = useState([]);
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [bodyHtml, setBodyHtml] = useState("");
    const [attachments, setAttachments] = useState([]);
    const [uploadError, setUploadError] = useState(false);
    const [staffList, setStaffList] = useState([]);
    const [roleBasedList, setRoleBasedList] = useState([]);
    const editor = React.createRef();
    const selectAllOption = { id: 0, name: "Select All" }
    const [modelScroll, setScroll] = useModelScroll()

    // Personal Group
    const [personalGroupList, setPersonalGroupList] = useState([]);
    const [displayPGListDialog, setDisplayPGListDialog] = useState(false)
    const [displayPersonalGroupDialog, setDisplayPersonalGroupDialog] = useState(false)
    const [editPGData, setEditPGData] = useState(undefined)

    /* ============================= Private functions ============================= */

    async function getStaffList() {
        if (isReplying && toStaffList.value.length == 0) {
            const matchId = isInSent ? message.toStaffId : message.fromStaffId
            setToStaffList({ value: orgStaffList.filter(x => x.id == matchId) })
        }
        setStaffList([selectAllOption, ...orgStaffList])
    }

    async function getRoleList() {
        const result = await ApiHelper.getRequest(ApiUrls.GET_ROLE)
        const roleList = result.resultData
            .filter(x => x.isActive)
            .map(x => {
                return {
                    id: x.id,
                    name: x.roleName
                }
            })
        setRoleBasedList(roleList);
    }

    async function getPGList() {
        try {
            const result = await ApiHelper.getRequest(ApiUrls.GET_PERSONAL_GROUP)
            const pgList = result.resultData
                .map(x => {
                    return {
                        id: x.id,
                        name: x.groupName,
                        totStaff: x.totStaff
                    }
                })
            setPersonalGroupList(pgList)
        } catch (err) {
            showError(err, "Get Personal Group")
        }
    }

    async function deletePG(id) {
        try {
            let result = await ApiHelper.deleteRequest(ApiUrls.DELETE_PERSONAL_GROUP + "?id=" + id)
            if (result.resultData) {
                setPersonalGroupList(personalGroupList.filter(pg => pg.id != id))
            }
        } catch (err) {
            showError(err, "Delete Personal Group")
        }
    }

    function editPG(pgData) {
        setEditPGData(pgData)
        setDisplayPGListDialog(false)
        setDisplayPersonalGroupDialog(true)
    }

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

    async function sendMessage(e) {
        try {
            e.preventDefault();

            if (toStaffList.value.length == 0 && toRoleBasedList.length == 0 && toPersonalGroupList.length == 0) {
                showError("Please select the Staff ID!")
                return
            }
            if (subject.length == 0) {
                showError("Please fill the Subject!")
                return
            }

            /* let bodyHtml = ""
            if (editor.current) {
                const view = editor.current.view;
                if (view) {
                    bodyHtml = EditorUtils.getHtml(view.state);
                }
            } */

            let toStaffIds = toStaffList.value.filter(x => x.id != selectAllOption.id).map(x => x.id)
            let otherIds = [];

            if (toRoleBasedList.length > 0) {
                const result = await ApiHelper.postRequest(ApiUrls.GET_STAFF_BY_ROLE_IDS, {
                    "roleIds": toRoleBasedList.map(x => x.id)
                })
                otherIds = otherIds.concat(result.resultData.map(x => x.id))
            }

            if (toPersonalGroupList.length > 0) {
                const result = await ApiHelper.postRequest(ApiUrls.GET_STAFF_BY_PG_IDS, {
                    "groupIds": toPersonalGroupList.map(x => x.id)
                })
                otherIds = otherIds.concat(result.resultData.map(x => x.id))
            }

            for (const id of otherIds) {
                if (!toStaffIds.includes(id))
                    toStaffIds.push(id)
            }

            setLoading(true)
            const data = {
                "toStaffIds": toStaffIds,
                "subject": subject,
                "body": body,
                "htmlBody": bodyHtml,
                "messageAttachments": attachments.length > 0 ? attachments.map(file => file.getRawFile()) : null,
            };

            const result = await ApiHelper.multipartPostRequest(ApiUrls.INSERT_MESSAGE, data, true)
            NotificationManager.success("Success")
            onClose()
        } catch (error) {
            showError(error)
        } finally {
            setLoading(false);
        }
    }

    /* ============================= useEffects ============================= */

    useEffect(() => {
        // Changes in toStaffList because of Deletion/Edition in Personal Groups
        if (toPersonalGroupList.length > 0) {

            // Handle Deleted PGs
            let newToPGList = toPersonalGroupList.filter(toPG => personalGroupList.find(pg => pg.id == toPG.id) != undefined)

            // Handle Edited PGs
            newToPGList = newToPGList.map(toPG => personalGroupList.find(pg => pg.id == toPG.id))

            // if (JSON.stringify(toPersonalGroupList) != JSON.stringify(newToPGList))
            setToPersonalGroupList(newToPGList)
        }
    }, [personalGroupList])

    useEffect(() => {
        if (isReplying || isForwarding) {
            let type = isReplying ? "RE : " : "FWD : "
            setSubject(type + message?.subject)
            if (editor.current) {
                const view = editor.current.view;
                const lineBreak = "<br />"
                let text = "<p>" + lineBreak
                text += "--------------------------------------" + lineBreak
                text += lineBreak
                text += "Sent: " + message.fullDate + lineBreak
                text += "Subject: " + message.subject + lineBreak
                text += "From: " + message.fromStaffName + lineBreak
                text += "To: " + message.toStaffName
                if (message.bodyHtml) text += message.bodyHtml + lineBreak
                text += "</p > "

                if (view) {
                    EditorUtils.setHtml(view, text);
                }
            }
        }
    }, [isReplying, isForwarding])

    useEffect(() => {
        getStaffList()
    }, [orgStaffList])

    useEffect(() => {
        try {
            setLoading(true);
            getRoleList()
            getPGList()
        } catch (error) {
            showError(error);
        } finally {
            setLoading(false);
        }
    }, [])

    /* ============================= onChange events ============================= */

    function onStaffFilterChange(event) {
        const searchValue = event.filter.value.toLowerCase()
        if (searchValue.length == 0) {
            setStaffList([selectAllOption, ...orgStaffList])
        } else {
            setStaffList(orgStaffList.filter(
                staff => staff.name.toLowerCase().includes(searchValue)))
        }
    }

    function onPGListDisplay(e) {
        e.preventDefault()
        setDisplayPGListDialog(true)
    }

    function onPGListClose() {
        setDisplayPGListDialog(false)
        getPGList()
    }

    function onPGAdd(e) {
        e.preventDefault()
        setDisplayPGListDialog(false)
        setDisplayPersonalGroupDialog(true)
    }

    function onPGAddClose() {
        setEditPGData(undefined)
        setDisplayPGListDialog(true)
        setDisplayPersonalGroupDialog(false)
        getPGList()
    }

    function onRBClick(e) {
        setRBVisible(!rbVisible)
    }

    function onPGClick(e) {
        setPGVisible(!pgVisible)
    }

    function onMinMaxClick(e) {
        setMinimize(!minimize)
        if (!minimize) {
            setExpanded(false)
        }
    }

    function onExpandCollapseClick(e) {
        setExpanded(!expanded)
        if (!expanded) {
            setMinimize(false)
        }
    }

    function onBodyChange(props) {
        setBody(props.value.textContent)
        setBodyHtml(props.html)
    }

    function onSubjectChange(e) {
        setSubject(e.target.value)
    }

    function onRoleBaseChange(event) {
        const value = event.target.value;
        setToRoleBasedList([...value]);
    }

    function onStaffChange(event) {

        const currentSelectAll = toStaffList.value.some((i) => i.id == selectAllOption.id);
        const nextSelectAll = event.value.some((i) => i.id == selectAllOption.id);
        let value = event.value;
        const currentCount = toStaffList.value.length;
        const nextCount = value.length;

        if (
            nextCount > currentCount &&
            !currentSelectAll &&
            !nextSelectAll &&
            staffList.length - 1 === nextCount
        ) {
            value = staffList;
        } else if (
            nextCount < currentCount &&
            currentCount === staffList.length &&
            currentSelectAll &&
            nextSelectAll
        ) {
            value = value.filter((v) => v.id !== selectAllOption.id);
        } else if (!currentSelectAll && nextSelectAll) {
            value = staffList;
        } else if (currentSelectAll && !nextSelectAll) {
            value = [];
        }

        setToStaffList({ value });
    }

    function onPersonalGroupChange(event) {
        const value = event.target.value;
        setToPersonalGroupList([...value]);
    }

    /* ============================= Render View ============================= */

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

    function renderKendoEditor() {
        const {
            Bold,
            Italic,
            Underline,
            AlignLeft,
            AlignRight,
            AlignCenter,
            Indent,
            Outdent,
            OrderedList,
            UnorderedList,
            Undo,
            Redo,
            Link,
            Unlink,
        } = EditorTools;
        return (
            <Editor
                ref={editor}
                value={bodyHtml}
                onChange={onBodyChange}
                tools={[
                    [Bold, Italic, Underline],
                    [Undo, Redo],
                    [Link, Unlink],
                    [AlignLeft, AlignCenter, AlignRight],
                    [OrderedList, UnorderedList, Indent, Outdent],
                ]}
                contentStyle={{
                    height: 320,
                }}
                defaultContent={""}
            />
        );
    }

    const renderFileUI = (props) => {
        return (
            <ul>
                {props.files.map((file) => (
                    <li key={file.name}>{file.name}
                        <button data-toggle="tooltip" title="Remove Attachment" className="mx-2 theme-text border-0" onClick={(e) => {
                            e.preventDefault()
                            props.onRemove(file.uid)
                        }}>x</button>
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <div className='modal-composer'>
            <div className={!expanded ? 'content-composer minimize-content'
                : 'content-composer maximize-content-composer'} id="content-composer">
                <div className='d-flex justify-content-between align-items-center top-header-composer'>
                    <h5 >Message</h5>
                    <div className='click-mine'>
                        <ul className='list-unstyled d-flex align-items-center'>
                            <li><button type="button" onClick={onMinMaxClick} className='bg-transparent border-0'><span className="k-icon k-i-minus bg-transparent"></span></button></li>
                            <li><button type="button" onClick={onExpandCollapseClick} className='bg-transparent border-0'><span className="k-icon k-i-full-screen"></span></button></li>
                            <li><button type="button" onClick={onClose} className='bg-transparent border-0'><span className="k-icon k-i-close"></span></button></li>
                        </ul>
                    </div>
                </div>
                {!minimize && <form>
                    <div className='inner-composer'>
                        <div className='header-top-composer'>
                            <div className='column-first'>
                                <span className='pr-2'>To</span>
                                <div className='mail-composer'>
                                    {<MultiSelect
                                        data={staffList}
                                        itemRender={renderToItem}
                                        onChange={onStaffChange}
                                        value={toStaffList.value}
                                        filterable={true}
                                        onFilterChange={onStaffFilterChange}
                                        textField="name"
                                        tags={
                                            toStaffList.value
                                                .filter(staff => staff.id != 0)
                                                .map(staff => {
                                                    return { text: staff.name, data: [staff] }
                                                })
                                        }
                                        autoClose={false} />}
                                </div>
                                <div className=' rp_pg'>

                                    <span className='pr-2' onClick={onRBClick}>RB</span>
                                    <span className='pr-2' onClick={onPGClick}>PG</span>
                                </div>
                            </div>
                            {rbVisible && <div className='column-first'>
                                <div className='mail-composer'>
                                    {<MultiSelect
                                        data={roleBasedList}
                                        textField="name"
                                        onChange={onRoleBaseChange}
                                        value={toRoleBasedList}
                                        placeholder="Select Roles" />}
                                </div>
                            </div>}
                            {pgVisible && <div className='column-first'>
                                <div className='mail-composer d-flex justify-content-between'>
                                    {<MultiSelect
                                        data={personalGroupList}
                                        textField="name"
                                        onChange={onPersonalGroupChange}
                                        value={toPersonalGroupList}
                                        placeholder="Select Personal Group" />}
                                    <button type="button" onClick={onPGListDisplay} className="btn blue-primary p-0 px-1"
                                        data-toggle="tooltip" data-placement="top" title="Add New Personal Group">
                                        <i className='k-icon k-i-plus'></i>
                                    </button>
                                </div>
                            </div>}
                            <div className='column-first'>
                                <div className='mail-composer'>
                                    <input type='text'
                                        className='form-control'
                                        placeholder='Subject'
                                        value={subject}
                                        onChange={onSubjectChange}
                                    />
                                </div>
                            </div>
                        </div>
                        {renderKendoEditor()}
                        <div className='footer-composer mt-2'>
                            <span className='position-relative'>
                                <Upload
                                    batch={false}
                                    multiple={true}
                                    autoUpload={false}
                                    files={attachments}
                                    defaultFiles={attachments}
                                    onAdd={onAdd}
                                    onRemove={onRemove}
                                    onStatusChange={onStatusChange}
                                    withCredentials={false}
                                    showActionButtons={false}
                                    ariaDescribedBy={"firstNameError"}
                                />
                                {uploadError && <Error>Document is required</Error>}
                                <button type='submit' className='blue-primary btn  mt-2 mr-2 text-white' onClick={sendMessage}>Send</button>
                            </span>
                        </div>
                        {loading && <Loader size="small" type={"converging-spinner"} />}
                    </div>
                </form>}
            </div >
            <MessagePGListView
                visible={displayPGListDialog}
                onClose={onPGListClose}
                personalGroupList={personalGroupList}
                onAdd={onPGAdd}
                deletePG={deletePG}
                editPG={editPG}
            />
            <MessagePGCreateView
                visible={displayPersonalGroupDialog}
                onDismiss={onPGAddClose}
                editPGData={editPGData}
                orgStaffList={orgStaffList}
            />
        </div >
    );
}

export default MessageCompose;
