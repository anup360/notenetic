import {
    USER_CAN_ACCESS,
} from "../actions/authActions";

export const userAccessReducer = (state = false, action) => {
    switch (action.type) {
        case USER_CAN_ACCESS:
            return action.payload;
        default:
            return state;
    }
};