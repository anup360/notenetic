import React from "react";
import {
  ListView,
  ListViewHeader,
  ListViewFooter,
} from "@progress/kendo-react-listview";

const Header = () => {
  return (
    <ListViewHeader className="pl-3 pb-2 pt-2">
      <div>
        <h3>PHQ-9 - Patient Health Questionnaire</h3>
        <p>
          Over the last two weeks, How often have you been bothered by any of
          the following? (Use the drop down list to select the application
          amount.)
        </p>
      </div>
    </ListViewHeader>
  );
};

export default Header;
