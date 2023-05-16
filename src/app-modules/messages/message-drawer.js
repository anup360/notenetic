import { Drawer, DrawerItem } from "@progress/kendo-react-layout";
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import useModelScroll from '../../cutomHooks/model-dialouge-scroll'

export const messageDrawerState = {
    inbox: 0,
    sent: 1,
    trash: 2
}

const MessageDrawerContainer = forwardRef((props, ref) => {

    const onStateChange = props.onStateChange
    const [modelScroll, setScroll] = useModelScroll()

    const [inboxCount, setInboxCount] = useState(props.inboxCount)
    if (inboxCount != props.inboxCount) {
        setInboxCount(props.inboxCount)
    }

    const msgMenu = [
        { text: "", id: 0, selected: false },
        { text: "Inbox", id: 1, selected: true, state: messageDrawerState.inbox },
        { text: "Sent", id: 2, selected: false, state: messageDrawerState.sent },
        { text: "Trash", id: 3, selected: false, state: messageDrawerState.trash },
    ];

    const [items, setItems] = React.useState(msgMenu);
    if (items.length !== msgMenu.length)
        setItems(msgMenu)

    const renderItem = (props) => {
        const { visible, ...others } = props;
        return (
            <React.Fragment>
                {props.visible === false ? null : (
                    <DrawerItem {...others} {...(props.selected ? { className: "active-menu-item" } : {})}>
                        <span className={"k-item-text staff-text d-flex justify-content-between w-100"}>
                            {props.text}
                            &emsp;&emsp;
                            {props.id == 1 && inboxCount != 0 && <span className="count_number">{inboxCount}</span>}
                        </span>
                    </DrawerItem>
                )}
            </React.Fragment>
        );
    };

    const onSelect = (ev) => {
        const msgMenuItem = ev.itemTarget.props
        if (msgMenuItem.state === undefined) {
            return
        }

        setItems((prev) =>
            prev.map((item, index) => {
                if (item.hasOwnProperty("selected")) {
                    if (index === ev.itemIndex) {
                        return { ...item, selected: true };
                    } else {
                        return { ...item, selected: false };
                    }
                }
                return item;
            })
        );
        onStateChange(msgMenuItem.state)
    };

    const data = items.map((item) => {
        const { parentId, ...others } = item;

        if (parentId !== undefined) {
            const parent = items.find((parent) => parent.id === parentId);
            return { ...others, visible: parent["data-expanded"] };
        }

        return item;
    });

    useImperativeHandle(ref, () => ({
        unselectAll() {
            setItems(prev => prev.map(item => { return { ...item, selected: false } }))
        }
    }));

    return (
        <div className="side-bar-left">
            <div className="custom-toolbar"></div>
            <Drawer className="menu-drawer-layer"
                expanded={true}
                mode={'push'}
                items={data}
                item={renderItem}
                onSelect={onSelect}
            />
        </div>
    )
})

export default MessageDrawerContainer;
