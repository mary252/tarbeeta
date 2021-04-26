import { FETCH_DEPARTMENTS } from "../actions/types";

const INITIAL_STATE = {
  all: []
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_DEPARTMENTS:
      return {
        ...state,
        all: action.payload
      };

    default:
      return state;
  }
};
