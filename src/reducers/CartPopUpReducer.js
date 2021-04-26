import { ADD_TO_CART_POPUP } from "../actions/types";

const INITIAL_STATE = {
    currentVariation: "",
    name: "",
    qty: "",
    price: "",
    currency_name: ""
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_TO_CART_POPUP:
      return {
        ...action.payload,
        ...state.data
      };
    default:
      return state;
  }
};
