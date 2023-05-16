import { useState } from "react";
import { Dialog } from "@progress/kendo-react-dialogs";
import { Grid, GridColumn, GridNoRecords } from '@progress/kendo-react-grid';
import { ColorPicker } from "@progress/kendo-react-inputs";
import { SchedulerService } from "../../services/schedulerService";
import Utils from "../../helper/utils"
import useModelScroll from '../../cutomHooks/model-dialouge-scroll'
import { permissionEnum } from "src/helper/permission-helper";
import { useSelector } from "react-redux";

export const EditStatusColor = ({ onClose, resourceFieldsParam }) => {
    const paletteSettings = {
        palette: ["#28a745", "#dc3545", "#ffc107", "#007bff", "#6f42c1", "#f0d0c9", "#e2a293", "#d4735e", "#65281a", "#eddfda", "#dcc0b6", "#cba092", "#7b4b3a", "#fcecd5", "#f9d9ab", "#f6c781", "#c87d0e", "#e1dca5", "#d0c974", "#a29a36", "#514d1b", "#c6d9f0", "#8db3e2", "#548dd4", "#17365d"],
        columns: 5,
        tileSize: 30,
    };
    const [isFormChanged, setIsFormChanged] = useState(false);
    const [eventStatusColors, setEventStatusColors] = useState(resourceFieldsParam.eventStatus.data.map(x => { return { ...x } }));
    const [modelScroll, setScroll] = useModelScroll()
    const userAccessPermission = useSelector((state) => state.userAccessPermission);

    const handleFormSubmit = () => {
        resourceFieldsParam.eventStatus.data = eventStatusColors;
        SchedulerService.UpdateEventStaffStatusColor(eventStatusColors.map(x => { return { id: x.id, color: x.color } }));
        onClose({ openCloseDialog: false });
    };

    const handleClose = () => {
        onClose({ openCloseDialog: false });
    };
    const colorPickerCustomCell = (props) => {

        return (
            <td>
                <ColorPicker
                    view="palette"
                    paletteSettings={paletteSettings}
                    defaultValue={props.dataItem.color}
                    onChange={(e) => {
                        setIsFormChanged(true);
                        props.dataItem.color = Utils.rgba2hex(e.value, true);
                    }}
                />
            </td>);
    };
    return (
        <Dialog
            onClose={handleClose}
            title={"Update Event Status Color"}
            className="dialog-modal">
            <div className="client-accept edit-client-popup">
                <div className="popup-modal">
                    <div className="grid-table">
                        <Grid data={eventStatusColors}
                            style={{
                                height: eventStatusColors.length > 0 ? "100%" : "250px",
                            }}
                            sortable={false}>
                            <GridNoRecords>
                                {"No data found"}
                            </GridNoRecords>
                            <GridColumn field="name" title="Status" />
                            <GridColumn field="color" title="Color" cell={colorPickerCustomCell} />
                        </Grid>
                    </div>
                </div>
                <div className="d-flex mt-4">

                    <button className="btn blue-primary text-white mx-3" onClick={handleFormSubmit} disabled={!isFormChanged}>
                        Update
                    </button>
                    <button className="btn grey-secondary text-white " onClick={handleClose}>
                        Cancel
                    </button>
                </div>

            </div>
        </Dialog>
    );

};