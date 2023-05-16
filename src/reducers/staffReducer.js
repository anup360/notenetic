import {
  SELECTED_STAFF_ID,
  GET_STAFF,
  GET_MARITIALS_STATUS,
  STAFF_LOGIN_DETAIL,
  GET_GENDER,
  GET_STAFF_DETAILS,
  GET_STAFF_PROFILE_IMG,
  GET_ROLE_PERMISSIONS,
  ALL_STAFF_AVAILABLE,
  GET_DOCUMENT_FILTER,
  STAFF_ONLINE_STATUS
} from "../actions";

const initialstate = {
  gender: {},
};

export const selectedStaffIdReducer = (state = false, action) => {
  switch (action.type) {
    case SELECTED_STAFF_ID:
      return action.payload;
    default:
      return state;
  }
};

export const getStaffReducer = (state = false, action) => {
  switch (action.type) {
    case GET_STAFF:
      return action.payload;
    case STAFF_LOGIN_DETAIL:
      return action.payload;
    default:
      return state;
  }
};

export const getMaritialsStatusReducer = (state = false, action) => {
  switch (action.type) {
    case GET_MARITIALS_STATUS:
      return action.payload;
    default:
      return state;
  }
};

export const getGenderReducer = (state = false, action) => {
  switch (action.type) {
    case GET_GENDER:
      return action.payload;
    default:
      return state;
  }
};

export const getStaffDetails = (state = false, action) => {
  switch (action.type) {
    case GET_STAFF_DETAILS:
      return action.payload;
    default:
      return state;
  }
};
export const getStaffOnline = (state = false, action) => {
  switch (action.type) {
    case STAFF_ONLINE_STATUS:
      return action.payload;
    default:
      return state;
  }
};

export const getStaffProfileImg = (state = false, action) => {
  switch (action.type) {
    case GET_STAFF_PROFILE_IMG:
      return action.payload;
    default:
      return state;
  }
};

export const getRolePermisson = (state = false, action) => {
  switch (action.type) {
    case GET_ROLE_PERMISSIONS:
      return action.payload;
    default:
      return state;
  }
};

export const getAvailableStaff = (state = false, action) => {
  switch (action.type) {
    case ALL_STAFF_AVAILABLE:
      return action.payload;
    default:
      return state;
  }
};

export const getDocumentFilter = (state = false, action) => {
  switch (action.type) {
    case GET_DOCUMENT_FILTER:
      return action.payload;
    default:
      return state;
  }
};
