import React, { useState } from "react";
import {
  ListView,
  ListViewHeader,
  ListViewFooter,
} from "@progress/kendo-react-listview";

const Footer = () => {
  const [total, setTotal] = useState([]);
  let messages = 0;
  total.map((i) => {
    messages = messages + i.messages;
  });
  return (
    <ListViewFooter
      style={{
        fontSize: 16,
      }}
      className="pl-3 pb-2 pt-2"
    >
      <p style={{ position: "absolute", left: "1000px" }}>
        Total {0} - Moderate Depression{" "}
      </p>
    </ListViewFooter>
  );
};
export default Footer;
