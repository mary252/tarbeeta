import {
  TOGGLE_TOAST,
  FETCH_NO_OF_CARTS,
  INCREMENT_CART,
  TOGGLE_POPUP,
  FETCH_DETAILS_POPUP,
  NEW_NOTIFICATION
} from "../actions/types";
import { updateObject } from "../ultils";

const INITIAL_STATE = {
  cartCount: 0,
  isOpen: false,
  product: {},
  isFetching: true,
  notifications: [],
  colId: null
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TOGGLE_TOAST:
      return updateObject(state, {
        showToast: !state.showToast,
        level: action.payload.level,
        message: action.payload.message
      });

    case FETCH_NO_OF_CARTS:
      return updateObject(state, {
        cartCount: action.payload
      });

    case INCREMENT_CART:
      return updateObject(state, {
        cartCount: state.cartCount + 1
      });

    case TOGGLE_POPUP:
      return updateObject(state, {
        isOpen: !state.isOpen,
        colId: action.payload.colId,
        isFetching: true
      });

    case FETCH_DETAILS_POPUP:
      return updateObject(state, {
        product: action.payload,
        isFetching: false
      });

    case NEW_NOTIFICATION:
      return updateObject(state, {
        notifications: [action.payload, ...state.notifications]
      });
    default:
      return state;
  }
};
