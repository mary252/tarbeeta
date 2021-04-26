import {
  TOGGLE_TOAST,
  FETCH_NO_OF_CARTS,
  INCREMENT_CART,
  TOGGLE_POPUP,
  FETCH_DETAILS_POPUP
} from "./types";
import { fetchNoCart, fetchtProductDetails } from "../services";
export function toastify(payload) {
  return {
    type: TOGGLE_TOAST,
    payload
  };
}

export function getNumberOfcart(cart_id) {
  return async dispatch => {
    try {
      let res = await fetchNoCart(cart_id);

      dispatch({
        type: FETCH_NO_OF_CARTS,
        payload: res.data.length ? res.data[0].count : 0
      });
    } catch (e) {}
  };
}

export function TogglePopup(product_id, lang_id, colId) {
  return async dispatch => {
    try {
      dispatch({
        type: TOGGLE_POPUP,
        payload: {
          colId
        }
      });

      let res = { data: {} };
      if (product_id) res = await fetchtProductDetails(product_id, lang_id);
      dispatch({ type: FETCH_DETAILS_POPUP, payload: res.data });
    } catch (e) {}
  };
}

export function incrementCart() {
  return {
    type: INCREMENT_CART
  };
}
