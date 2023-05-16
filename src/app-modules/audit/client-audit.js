import React, { useState } from "react";
import { getter } from "@progress/kendo-react-common";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import moment from "moment";
import { orderBy } from "@progress/kendo-data-query";
import ClientFilter from "./fillterModule/client-filter";
import { renderErrors } from "src/helper/error-message-helper";

let DATA_ITEM_KEY = "id";
let SELECTED_FIELD = "selected";
let idGetter = getter(DATA_ITEM_KEY);

const ClientAudit = () => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [metaData, setMetaData] = useState([]);
  const [sort, setSort] = useState([]);
  const [selectedState, setSelectedState] = React.useState({});
  const [clientAuditData, setClientAuditData] = useState([]);
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

  const handleRowClick = (e) => {
    // dispatch({
    //   type: SELECTED_SERVICE_ID,
    //   payload: e.id,
    // });
    // navigate(APP_ROUTES.GET_Services_BY_ID);
  };

  const handleAuditData = (data) => {
    setClientAuditData(data);
  };
  const handleMetaData = (data) => {
    setMetaData(data);
  };
  return (
    <div>
      <h4 className="address-title text-grey  ml-2 mb-3">
        <span className="f-24">Client Audit</span>
      </h4>
      <div className="ml-2">
        <ClientFilter
          page={page}
          pageSize={pageSize}
          finalValue={finalValue}
          handleAuditData={handleAuditData}
          handleMetaData={handleMetaData}
        />
      </div>

      <div className="grid-table  filter-grid ml-2">
        <Grid
          data={orderBy(clientAuditData, sort).map((item) => ({
            ...item,
            [SELECTED_FIELD]: selectedState[idGetter(item)],
          }))}
          checkboxElement
          style={{
            height: clientAuditData.length > 0 ? "100%" : "250px",
          }}
          dataItemKey={DATA_ITEM_KEY}
          // selectedField={SELECTED_FIELD}
          skip={page}
          take={pageSize}
          total={metaData.totalCount}
          onPageChange={pageChange}
          pageable={{
            pageSizes: [10, 20, 30, 50, 100, 500],
          }}
          sort={sort}
          sortable={true}
          onSortChange={(e) => {
            setSort(e.sort);
          }}
          filterOperators={filterOperators}
          // filter={filter}
          onDataStateChange={dataStateChange}
          onHeaderSelectionChange={onHeaderSelectionChange}
        >
          <GridNoRecords style={{}}></GridNoRecords>
          <GridColumn 
          title="Client" field="clientName" />
          <GridColumn title="By Staff" field="staffName" />
          <GridColumn title="Affected Section" field="affectedTable" />
          <GridColumn
            title="Action"
            field="actionName"
            className="cursor-default"
          />
          <GridColumn
            title="Date"
            cell={(props) => {
              let date = props.dataItem.utcDateCreated;
              return (
                <td className="cursor-default">
                  {moment.utc(date).local().format("M/D/YYYY")} at {moment.utc(date).local().format("hh:mm A")}
                </td>
              );
            }}
          />
        </Grid>
      </div>
    </div>
  );
};
export default ClientAudit;
