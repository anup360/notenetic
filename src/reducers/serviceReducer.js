import {
    SELECTED_SERVICE_ID,
    SERVICE_ID,

} from "../actions";

export const selectedServiceIdReducer = (state = false, action) => {
    switch (action.type) {
        case SELECTED_SERVICE_ID:
            return action.payload;
        default:
            return state;
    }
};
