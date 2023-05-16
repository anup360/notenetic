import {
  IMMUNIZATION_ID,
  SELECTED_HEADER_MENU,
  IS_GLOBAL_SEARCH,
  GET_GENDER,
  GET_ROLE,
  DOC_TEMPLATE_INFO,
  SITE_ID,
  SITE_VALUE,
} from "../actions";

export const immunizationId = (state = false, action) => {
  switch (action.type) {
    case IMMUNIZATION_ID:
      return action.payload;
    default:
      return state;
  }
};

export const selectedHeaderMenu = (state = false, action) => {
  switch (action.type) {
    case SELECTED_HEADER_MENU:
      return action.payload;
    default:
      return state;
  }
};

export const isGlobalSearchReducer = (state = false, action) => {
  switch (action.type) {
    case IS_GLOBAL_SEARCH:
      return action.payload;
    default:
      return state;
  }
};

export const getGender = (state = false, action) => {
  switch (action.type) {
    case GET_GENDER:
      return action.payload;
    default:
      return state;
  }
};

export const getRole = (state = false, action) => {
  switch (action.type) {
    case GET_ROLE:
      return action.payload;
    default:
      return state;
  }
};

export const getDocumentTemplate = (state = false, action) => {
  switch (action.type) {
    case DOC_TEMPLATE_INFO:
      return action.payload;
    default:
      return state;
  }
};
export const getSiteId = (state = false, action) => {
  switch (action.type) {
    case SITE_ID:
      return action.payload;
    default:
      return state;
  }
};

export const getSiteVaue = (state = false, action) => {
  switch (action.type) {
    case SITE_VALUE:
      return action.payload;
    default:
      return state;
  }
};
