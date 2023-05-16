import { CLINIC_ID, GET_CLINIC_DETAILS_BY_ID } from "../actions";

export const clinicIDReducer = (state = false, action) => {
  switch (action.type) {
    case CLINIC_ID:
      return action.payload;
    default:
      return state;
  }
};

export const getClinicDetails = (state = false, action) => {
  switch (action.type) {
    case GET_CLINIC_DETAILS_BY_ID:
      return action.payload;
    default:
      return state;
  }
};
