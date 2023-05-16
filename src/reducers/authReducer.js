import {
    LOGIN_USER,
    LOGOUT_USER
} from "../actions/authActions";

export const logInReducer = (state = false, action) => {
    switch (action.type) {
        case LOGIN_USER:
            return action.payload;
        default:
            return state;
    }
};
export const logOutReducer = (state = false, action) => {
    switch (action.type) {
        case LOGOUT_USER:
            return action.payload;
        default:
            return state;
    }
};





