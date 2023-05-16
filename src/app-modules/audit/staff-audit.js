import React, { useState } from "react";
import { getter } from "@progress/kendo-react-common";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import moment from "moment";
import StaffFilter from "./fillterModule/staff-filter";
import { orderBy } from "@progress/kendo-data-query";
import { renderErrors } from "src/helper/error-message-helper";

let DATA_ITEM_KEY = "id";
let SELECTED_FIELD = "selected";
let idGetter = getter(DATA_ITEM_KEY);

const StaffAudit = () => {
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [metaData, setMetaData] = useState([]);
  const [sort, setSort] = useState([]);
  const [selectedState, setSelectedState] = React.useState({});
  const [staffAuditData, setStaffAuditData] = useState([]);
  const [finalValue, setFinalValue] = useState();

  const pageChange = (event) => {
    let skip = event.page.skip;
    let take = event.page.take;
    setPage(skip);
    setPageSize(take);
    let newValue = skip / take;
    let finalValue = newValue + 1;
    setFinalValue(finalValue);
  };

  const filterOperators = {
    text: [
      {
        text: "grid.filterContainsOperator",
        operator: "contains",
      },
    ],
  };

  const dataStateChange = (event) => {
    setPage(event.dataState.skip);
    setPageSize(event.dataState.take);
    setSort(event.dataState.sort);
  };

  const onHeaderSelectionChange = React.useCallback((event) => {
    const checkboxElement = event.syntheticEvent.target;
    const checked = checkboxElement.checked;
    const newSelectedState = {};
    event.dataItems.forEach((item) => {
      newSelectedState[idGetter(item)] = checked;
    });
    setSelectedState(newSelectedState);
  }, []);

  const handleAuditData = (data) => {
    setStaffAuditData(data);
  };

  const handleMetaData = (data) => {
    setMetaData(data);
  };

  return (
    <div>
      <h4 className="address-title text-grey  ml-2 mb-3">
        <span className="f-24">Staff Audit</span>
      </h4>
      <div className="ml-2">
        <StaffFilter
          page={page}
          pageSize={pageSize}
          finalValue={finalValue}
          handleAuditData={handleAuditData}
          handleMetaData={handleMetaData}
        />
      </div>
      <div className="grid-table  filter-grid ml-2">
        <Grid
          data={orderBy(staffAuditData, sort).map((item) => ({
            ...item,
            [SELECTED_FIELD]: selectedState[idGetter(item)],
          }))}
          checkboxElement
          style={{
            height: staffAuditData.length > 0 ? "100%" : "250px",
          }}
          dataItemKey={DATA_ITEM_KEY}
          // selectedField={SELECTED_FIELD}
          skip={page}
          take={pageSize}
          total={metaData.totalCount}
          onPageChange={pageChange}
          className="pagination-row-cus"
          pageable={{
            pageSizes: [10, 20, 30, 50, 100, 500],
          }}
          sort={sort}
          sortable={true}
          onSortChange={(e) => {
            setSort(e.sort);
          }}
          filterOperators={filterOperators}
          onDataStateChange={dataStateChange}
          onHeaderSelectionChange={onHeaderSelectionChange}
        >
          <GridColumn
            title="Date"
            cell={(props) => {
              let date = props.dataItem.utcDateCreated;
              return (
                <td className="cursor-default">
                  {" "}
                  {moment(date).format("M/D/YYYY")}
                </td>
              );
            }}
          />
          <GridColumn
            title="Action"
            field="actionName"
            className="cursor-default"
          />
          <GridColumn
            title="Affected Section"
            field="affectedTable"
            className="cursor-default"
          />

          <GridColumn
            title="Date"
            cell={(props) => {
              let date = props.dataItem.utcDateCreated;
              return (
                <td className="cursor-default">
                  {moment.utc(date).local().format("M/D/YYYY")} at{" "}
                  {moment.utc(date).local().format("hh:mm A")}
                </td>
              );
            }}
          />
          <GridColumn
            title="Affected Staff"
            field="affectedStaffName"
            className="cursor-default"
          />
          <GridColumn
            title="Affected By"
            field="affectedByStaffName"
            className="cursor-default"
          />
        </Grid>
      </div>
    </div>
  );
};
export default StaffAudit;
