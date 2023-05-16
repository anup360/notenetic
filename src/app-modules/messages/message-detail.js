import React, { useState, useEffect } from 'react';
import Loader from '../../control-components/loader/loader';
import useModelScroll from '../../cutomHooks/model-dialouge-scroll'
import { Tooltip } from "@progress/kendo-react-tooltip";
import { renderErrors } from "src/helper/error-message-helper";

function MessageDetail({ clickedMessage, onBack,
    trashOrDelete, onMoveToCustomLabel, setReplying, setForwarding }) {

    const [message, setMessage] = useState(undefined);
    if (!message) {
        setMessage(clickedMessage)
    }
    const messageId = clickedMessage.id
    const [modelScroll, setScroll] = useModelScroll()

    const RawHTML = ({ children, className = "" }) =>
        <div className={className}
            dangerouslySetInnerHTML={{ __html: children.replace(/\n/g, '<br />') }} />

    /* ============================= Private functions ============================= */

    /* ============================= useEffects ============================= */

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    /* ============================= onChange, Action events ============================= */

    function onDelete(e) {
        e.preventDefault()
        trashOrDelete([messageId])
        onBack()

    }

    function onReply(e) {
        e.preventDefault()
        setReplying(true)
        setScroll(true)
    }

    function onForward(e) {
        e.preventDefault()
        setForwarding(true)
        setScroll(true)

    }

    /* ============================= Render View ============================= */

    function renderAttachments() {
        const li = message.attachments.map(file => {
            return <li className='mb-2'><a href={file.url} target="_blank" download>{file.name}</a></li>
        })
        return <ul className='list-unstyled upload-attachemnt'>{li}</ul>
    }



    return (
        !message ? <Loader size="small" type={"converging-spinner"} /> : (
            <div className='details-show-message'>
                <button type="button" value="BACK" onClick={onBack}
                    className='border-0 bg-transparent arrow-rotate pl-0 mb-3'>
                    <i className='k-icon k-i-sort-asc-sm'></i>
                </button>
                <div className='d-flex justify-content-between mb-4'>
                    <div className='left-show-name'>
                        <div className='author_img_name d-flex'>
                            <img src={message.userImage} className='img-author-user' />
                            <div>
                                <h6 className='mb-0'>
                                    <b>{message.fromStaffName}</b>
                                    <span className='f-14 pl-2'>{message.fullDate}</span>

                                </h6>
                                <p className='mb-0 f-14'>{message.toStaffName}</p>
                            </div>
                        </div>
                    </div>
                    <div className='show-format-forword d-flex align-items-center'>
                        <button type="button" className='bg-transparent border-0' onClick={onDelete}>
                            <i className='k-icon  k-i-delete k-i-trash'></i>
                        </button>
                        <button type="button" className='bg-transparent border-0' onClick={onReply}>
                            <Tooltip anchorElement="target" position="top" >
                                <i title='Reply' className='k-icon k-i-undo'></i>
                            </Tooltip>
                        </button>

                        <button type="button" className='bg-transparent border-0' onClick={onForward}>
                        <Tooltip anchorElement="target" position="top" >
                            <i title='Forward' className='k-icon k-i-redo'></i>
                            </Tooltip>
                        </button>
                        <button type="button" className='bg-transparent border-0' onClick={onMoveToCustomLabel}>
                            <i className='k-icon k-i-move'></i>
                        </button>
                    </div>
                </div>
                <div className='pl-3 py-4'>
                    <div className='my-3 d-block'>

                        <p className="one-line-text f-16 mb-0">Subject: <span className='text-theme'>{message.subject}</span></p>
                    </div>
                    <hr />
                    <div className='my-4 f-14'>

                        <RawHTML>{message.bodyHtml}</RawHTML>
                    </div>
                    <hr />
                    <div className='footer-body my-3'>
                        {renderAttachments()}
                    </div>
                </div>
            </div >
        )
    );
}

export default MessageDetail;
