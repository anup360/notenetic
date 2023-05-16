import * as React from "react";
import {
  Drawer,
  DrawerItem,
} from "@progress/kendo-react-layout";
import { useNavigate } from "react-router";

const CustomItem = (props) => {
  const { visible, ...others } = props;

  return (
    <React.Fragment>
      {props.visible === false ? null : (
        <DrawerItem {...others}>
          {/* <span className={"k-icon " + props.icon} /> */}
          <span className={"k-item-text staff-text"}>{props.text}</span>
        </DrawerItem>
      )}
    </React.Fragment>
  );
};

const DrawerContainer = (props) => {
  const navigate = useNavigate();

  const staffMenu = [
    {
      text: "Staff",
      id: 2,
      ["data-expanded"]: true,
    },

    {
      text: "Dashboard",
      id: 2,
      parentId: 2,
      route: "/staff/profile",
      selected: true,
    },
    {
      text: "Signature",
      id: 3,
      parentId: 2,
      route: "/staff/signature",
      selected: false,
    },
    {
      text: "Position",
      id: 4,
      route: "/staff/position",
      selected: false
    },
    //   {
    //     text:"Diagnosis",
    //     id:4,
    //     route:"/staff/diagnosis",
    //     selected:false
    // },
    {
      separator: true,
    },
  ];
  const [items, setItems] = React.useState(staffMenu);
  const onSelect = (ev) => {
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

    navigate(ev.itemTarget.props.route);
  };

  const data = items.map((item) => {
    const { parentId, ...others } = item;

    if (parentId !== undefined) {
      const parent = items.find((parent) => parent.id === parentId);
      return { ...others, visible: parent["data-expanded"] };
    }

    return item;
  });

  return (
    <div className="side-bar-left">
      <div className="custom-toolbar"></div>
      <Drawer
        expanded={true}
        mode="push"
        items={data}
        item={CustomItem}
        onSelect={onSelect}
      >
      </Drawer>
    </div>
  );
};

export default DrawerContainer;
