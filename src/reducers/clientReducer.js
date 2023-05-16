import {
  CLIENT_ID,
  CLIENT_INSURANCE_ID,
  SELECTED_CLIENT_ID,
  SELECTED_CLIENT_FILTER,
  REMOVE_CLIENT_FILTER,
  SELECTED_DRAWER_ROUTE,
  GET_CLIENT_DETAILS,
  GET_CLIENT_PROFILE_IMG,
  GET_CLIENT_INSURANCE,
  GET_PRIMARY_CARE_PHYSICIAN,
  GET_PEDIATRICIAN,
  ALL_CLIENT_AVAILABLE,
  GET_CLIENT_PROFILE_IMG_BYTES,
  GET_CLIENT_FLAGS
} from "../actions";

export const clientIDReducer = (state = false, action) => {
  switch (action.type) {
    case CLIENT_ID:
      return action.payload;
    default:
      return state;
  }
};

export const clientFlagsReducer = (state = false, action) => {
  switch (action.type) {
    case GET_CLIENT_FLAGS:
      return action.payload;
    default:
      return state;
  }
};

export const clientInsuranceIDReducer = (state = false, action) => {
  switch (action.type) {
    case CLIENT_INSURANCE_ID:
      return action.payload;
    default:
      return state;
  }
};

export const selectedClientIdReducer = (state = false, action) => {
  switch (action.type) {
    case SELECTED_CLIENT_ID:
      return action.payload;
    default:
      return state;
  }
};

export const selectedDrawer = (state = false, action) => {
  switch (action.type) {
    case SELECTED_DRAWER_ROUTE:
      return action.payload;
    default:
      return state;
  }
};

export const clientFilterReducer = (state = false, action) => {
  switch (action.type) {
    case SELECTED_CLIENT_FILTER:
      return {
        ...state,
        filter: action.payload,
      };

    case REMOVE_CLIENT_FILTER:
      return {
        ...state,
        filter: null,
      };
    default:
      return state;
  }
};

export const clientDetails = (state = false, action) => {
  switch (action.type) {
    case GET_CLIENT_DETAILS:
      return action.payload;
    default:
      return state;
  }
};

export const getClientProfileImg = (state = false, action) => {
  switch (action.type) {
    case GET_CLIENT_PROFILE_IMG:
      return action.payload;
    default:
      return state;
  }
};
export const getClientProfileImgBytes = (state = false, action) => {
  switch (action.type) {
    case GET_CLIENT_PROFILE_IMG_BYTES:
      return action.payload;
    default:
      return state;
  }
};
export const currentInsuranceDetails = (state = false, action) => {
  switch (action.type) {
    case GET_CLIENT_INSURANCE:
      return action.payload;
    default:
      return state;
  }
};
export const getPrimaryCarePhysician = (state = false, action) => {
  switch (action.type) {
    case GET_PRIMARY_CARE_PHYSICIAN:
      return action.payload;
    default:
      return state;
  }
};
export const getPediatrician = (state = false, action) => {
  switch (action.type) {
    case GET_PEDIATRICIAN:
      return action.payload;
    default:
      return state;
  }
};

export const getAllclientAvailable = (state = false, action) => {
  switch (action.type) {
    case ALL_CLIENT_AVAILABLE:
      return action.payload;
    default:
      return state;
  }
};

// export const removeFilterReducer = (state = false, action) => {
//     switch (action.type) {
//         case REMOVE_CLIENT_FILTER:
//             return {
//                 ...state,
//                 filter: null
//             };

//         // return action.payload;
//         default:
//             return state;
//     }
// };
