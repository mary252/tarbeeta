import { ADD_TO_CART_POPUP } from "./types";
export function addToCartPopUp(payload) {
  return {
    type: ADD_TO_CART_POPUP,
    payload
  };
}
