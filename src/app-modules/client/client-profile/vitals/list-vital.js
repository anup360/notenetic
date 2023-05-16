/**
 * App.js Layout Start Here
 */
/**
 * App.js Layout Start Here
 */
import React, { Component, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ThreeDots } from "react-loader-spinner";
import { NotificationManager } from "react-notifications";
import ApiUrls from "../../../../helper/api-urls";
import AppRoutes from "../../../../helper/app-routes";
import ApiHelper from "../../../../helper/api-helper";
import {
  SELECTED_CLIENT_ID,
  SELECTED_CLIENT_FILTER,
} from "../../../../actions";
import {
  Grid,
  GridColumn,
  getSelectedState,
  GridToolbar,
  GridNoRecords,
} from "@progress/kendo-react-grid";
import { useDispatch, useSelector } from "react-redux";
import { skip, take } from "@progress/kendo-data-query/dist/npm/transducers";
import { Input } from "@progress/kendo-react-inputs";
import { Icon } from "@progress/kendo-react-common";
import addIcon from "../../../../assets/images/add.png";
import searchIcon from "../../../../assets/images/search.png";
import { Filter } from "@progress/kendo-react-data-tools";
import { getter } from "@progress/kendo-react-common";
import Loading from "../../../../control-components/loader/loader";
import APP_ROUTES from "../../../../helper/app-routes";
import {
  GridColumnMenuCheckboxFilter,
  GridColumnMenuSort,
  GridColumnMenuFilter,
} from "@progress/kendo-react-grid";
import { renderErrors } from "src/helper/error-message-helper";

import { filterBy, process, orderBy } from "@progress/kendo-data-query";
import { Popup } from "@progress/kendo-react-popup";
//import DropDownKendoRct from "../../../control-components/drop-down/drop-down";
import Loader from "../../../../control-components/loader/loader";

//import InputKendoRct from "../../../control-components/input/input";
import { Encrption } from "../../../encrption";

import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import DialougeEditVital from "./edit-vital";
import CustomDrawer from "../../../../control-components/custom-drawer/custom-drawer";
import ClientHeader from "../client-header/client-header";
import moment from "moment";
import { Tooltip } from "@progress/kendo-react-tooltip";
import useModelScroll from "../../../../cutomHooks/model-dialouge-scroll";
import DeleteDialogModal from "../../../../control-components/custom-delete-dialog-box/delete-dialog";
import { permissionEnum } from "../../../../helper/permission-helper";

const DATA_ITEM_KEY = "id";
const SELECTED_FIELD = "selected";
const idGetter = getter(DATA_ITEM_KEY);

const initialFilter = {
  logic: "and",
  filters: [
    {
      field: "fName",
      operator: "contains",
      value: "",
    },
  ],
};
// const DialougeDeleteVital = ({ onClose, vitalDelete }) => {
//   return (
//     <Dialog onClose={onClose} title={"Delete Vital"} className="">
//       <p
//         style={{
//           margin: "25px",
//           textAlign: "center",
//         }}
//       >
//         Are you sure you want to Delete ?{" "}
//       </p>
//       <DialogActionsBar>
//       <button
//           className="btn btn-primary text-white"
//           onClick={vitalDelete}
//         >
//           Yes
//         </button>
//         <button
//           className="btn btn-secondary text-white"
//           onClick={onClose}
//         >
//           No
//         </button>

//       </DialogActionsBar>
//     </Dialog>
//   );
// };

const ClientVital = () => {
  let pageCount = 1;
  const clinicId = useSelector((state) => state.loggedIn.clinicId);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [vitalData, setvitalData] = useState([]);
  const [filter, setFilter] = React.useState(initialFilter);
  const [metaData, setMetaData] = useState([]);
  const [sort, setSort] = useState([]);
  const userAccessPermission = useSelector((state) => state.userAccessPermission);

  const [selectedVitalId, setSelectedVitalId] = useState("");

  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [stateData, setStateData] = useState([]);
  const [stateLoading, setStateLoading] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.loggedIn.token);

  const vitalLastFilter = useSelector((state) => state.clientLastFilter);
  const [isDeleteConfirm, setDeleteConfirm] = useState(false);
  const [isEditVital, setIsEditVital] = useState(false);
  const selectedClientId = useSelector((state) => state.selectedClientId);
  const anchor = React.useRef(null);
  const [show, setShow] = React.useState(false);
  const [errors, setErrors] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchApiQuery, setsearchApiQuery] = useState([]);
  const [modelScroll, setScroll] = useModelScroll();

  const [fields, setFields] = useState({
    bpDia: "",
  });
  const [allColumnFilter, setAllColumnFilter] = React.useState("");

  //const [dataState, setDataState] = React.useState(vitalData.map(dataItem => Object.assign({
  //    selected: false
  //}, dataItem)));
  const [dataState, setDataState] = React.useState();
  const [selectedState, setSelectedState] = React.useState({});

  useEffect(() => {
    getVitalByclientId(page);
    /* getState()*/

    setFields({
      ...fields,
      bpDia: vitalLastFilter.bpDia,
    });
  }, [selectedClientId]);

  const pageChange = (event) => {
    let skip = event.page.skip;
    let take = event.page.take;
    setPage(skip);
    setPageSize(take);
  };
  const onClick = () => {
    setShow(!show);
  };
  const getVitalByclientId = (param, take) => {
    setLoading(true);
    var data = {
      clinicId: clinicId,
    };

    ApiHelper.getRequest(ApiUrls.GET_CLIENT_VITAL + Encrption(selectedClientId))
      .then((result) => {
        if (result.resultData.hasOwnProperty("id"))
          result.resultData = [result.resultData];
        let resultData = result.resultData.map(function (x) {
          x.selected = false;
          return x;
        });
        setvitalData(resultData);
        /*setvitalData(result.resultData)*/
        setsearchApiQuery(result.resultData);
        setsearchApiQuery(result.resultData);
        setMetaData(result.metaData);
        setLoading(false);
        setShow(false);
        let ret = vitalData.map((dataItem) =>
          Object.assign(
            {
              selected: false,
            },
            dataItem
          )
        );
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const deleteSite = (id) => {
    setDeleteConfirm(true);
    setSelectedVitalId(id);
    setScroll(true);
  };
  const vitalDelete = () => {
    setLoading(true);
    ApiHelper.deleteRequest(ApiUrls.DELETE_VITAL + Encrption(selectedVitalId))
      .then((result) => {
        setLoading(false);
        setDeleteConfirm(!isDeleteConfirm);
        NotificationManager.success("Deleted vital Successfully");
        getVitalByclientId();
      })
      .catch((error) => {
        setLoading(false);
        setDeleteConfirm(!isDeleteConfirm);
        renderErrors(error.message);
      });
  };

  const handleAddVital = () => {
    navigate(AppRoutes.ADD_CLIENT_VITAL);
  };

  const handleRowClick = (e) => {
    dispatch({
      type: SELECTED_CLIENT_ID,
      payload: e.dataItem.id,
    });
    navigate(APP_ROUTES.GET_CLIENT_VITAL);
  };

  const onSelectionChange = React.useCallback(
    (event) => {
      const newSelectedState = getSelectedState({
        event,
        selectedState: selectedState,
        dataItemKey: DATA_ITEM_KEY,
      });
      setSelectedState(newSelectedState);
    },
    [selectedState]
  );

  const onHeaderSelectionChange = React.useCallback((event) => {
    const checkboxElement = event.syntheticEvent.target;
    const checked = checkboxElement.checked;
    const newSelectedState = {};
    event.dataItems.forEach((item) => {
      newSelectedState[idGetter(item)] = checked;
    });
    setSelectedState(newSelectedState);
  }, []);

  const filterOperators = {
    text: [
      {
        text: "grid.filterContainsOperator",
        operator: "contains",
      },
    ],
  };

  const handleDeleteVital = () => {
    setDeleteConfirm(!isDeleteConfirm);
    setScroll(false);
  };

  const handleEditVital = (id) => {
    setSelectedVitalId(id);
    setIsEditVital(true);
    setScroll(true);
  };

  const handleEditClose = ({ editable }) => {
    if (editable) {
      getVitalByclientId(page);
    }
    setIsEditVital(false);
    setScroll(false);
  };

  return (
    <div className="d-flex flex-wrap">
      <div className="inner-dt col-md-3 col-lg-2">
        <CustomDrawer />
      </div>

      <div className="col-md-9 col-lg-10">
        <ClientHeader />

        <div className="top-bar-show-list mt-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center">
            <h4 className="address-title text-grey ">
              <span className="f-24">Vitals</span>
            </h4>
            <div className="filter d-flex align-items-center col-lg-4 col-md-6"></div>

            {userAccessPermission[permissionEnum.EDIT_CLIENT_PROFILE] &&

              <button
                onClick={handleAddVital}
                className="btn blue-primary text-white  text-decoration-none d-flex align-items-center "
              >
                <img src={addIcon} alt="" className="me-2 add-img" />
                Add Vital
              </button>
            }
          </div>
        </div>
        {vitalData.length == 0 && !loading ? (
          <div className="message-not-found mt-3">No Vitals Available</div>
        ) : (
          <div className="grid-table  filter-grid">
            <div className=" mt-3">
              {loading && <Loading />}
              <Grid
                data={orderBy(vitalData.slice(page, pageSize + page), sort).map(
                  (item) => ({
                    ...item,
                    [SELECTED_FIELD]: selectedState[idGetter(item)],
                  })
                )}
                style={{
                  height: vitalData.length > 0 ? "100%" : "250px",
                }}
                dataItemKey={DATA_ITEM_KEY}
                selectedField={SELECTED_FIELD}
                skip={page}
                take={pageSize}
                total={vitalData.length}
                onPageChange={pageChange}
                className="pagination-row-cus"
                pageable={{
                  pageSizes: [15, 20, 30],
                }}
              >
                {/* <GridNoRecords style={{}}>
                {loading ? <Loading /> : "No data found"}
              </GridNoRecords> */}
                <GridColumn
                  title="Date Record"
                  cell={(props) => {
                    let date = props.dataItem.dateRecord;
                    return (
                      <td className="cursor-default">
                        {moment(date).format("M/D/YYYY")}
                      </td>
                    );
                  }}
                />
                <GridColumn
                  title="BP Sys"
                  cell={(props) => {
                    let field = props.dataItem;
                    return (
                      <td className="cursor-default">
                        {field.bpSys ? field.bpSys : ""}
                      </td>
                    );
                  }}
                />
                <GridColumn
                  title="BP Dias"
                  cell={(props) => {
                    let field = props.dataItem;
                    return (
                      <td className="cursor-default">
                        {field.bpDia ? field.bpDia : ""}
                      </td>
                    );
                  }}
                />

                <GridColumn
                  title="Heart Rate"
                  cell={(props) => {
                    let field = props.dataItem;
                    return (
                      <td className="cursor-default">
                        {field.heartRate ? field.heartRate : ""}
                      </td>
                    );
                  }}
                />
                <GridColumn
                  title="Pulse Rate"
                  cell={(props) => {
                    let field = props.dataItem;
                    return (
                      <td className="cursor-default">
                        {field.pulseRate ? field.pulseRate : ""}
                      </td>
                    );
                  }}
                />
                <GridColumn
                  title="Respiration"
                  cell={(props) => {
                    let field = props.dataItem;
                    return (
                      <td className="cursor-default">
                        {field.respiration ? field.respiration : ""}
                      </td>
                    );
                  }}
                />
                <GridColumn
                  title="Temp."
                  cell={(props) => {
                    let field = props.dataItem;
                    return (
                      <td className="cursor-default">
                        {field.temperature ? field.temperature : ""}
                      </td>
                    );
                  }}
                />
                <GridColumn
                  title="Weight"
                  cell={(props) => {
                    let field = props.dataItem;
                    return (
                      <td className="cursor-default">
                        {field.weight ? field.weight : ""}
                      </td>
                    );
                  }}
                />
                <GridColumn
                  title="Height"
                  cell={(props) => {
                    let field = props.dataItem;
                    return (
                      <td className="cursor-default">
                        {field.height ? field.height : ""}
                      </td>
                    );
                  }}
                />

                {userAccessPermission[permissionEnum.EDIT_CLIENT_PROFILE] &&

                  <GridColumn
                    filterable={false}
                    cell={(props) => {
                      let field = props.dataItem.id;
                      return (
                        <td>
                          <div className="row-3">
                            <div
                              className="k-chip k-chip-md k-rounded-md k-chip-solid k-chip-solid-base"
                              onClick={() => deleteSite(field)}
                            >
                              <div className="k-chip-content">
                                <Tooltip anchorElement="target" position="top">
                                  <i
                                    className="fa fa-trash"
                                    aria-hidden="true"
                                    title="Delete"
                                  ></i>
                                </Tooltip>
                              </div>
                            </div>
                            <div
                              className="k-chip k-chip-md k-rounded-md k-chip-solid k-chip-solid-base m-2"
                              onClick={() => handleEditVital(field)}
                            >
                              <div className="k-chip-content">
                                <Tooltip anchorElement="target" position="top">
                                  <i className="fas fa-edit" title="Edit"></i>
                                </Tooltip>
                              </div>
                            </div>
                          </div>

                        </td>
                      );
                    }}
                  />
                }
              </Grid>
            </div>
          </div>
        )}
      </div>
      {isDeleteConfirm && (
        <DeleteDialogModal
          onClose={handleDeleteVital}
          title="Vitals"
          message="vitals"
          handleDelete={vitalDelete}
        />
      )}
      {isEditVital && (
        <DialougeEditVital
          stateData={stateData}
          onClose={handleEditClose}
          selectedVitalId={selectedVitalId}
        />
      )}
    </div>
  );
};
export default ClientVital;
