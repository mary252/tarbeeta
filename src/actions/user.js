import {
  fetchAddress,
  addAddress,
  fetchInfo,
  removeAddress
} from "../services/UserService";
import {
  FETCH_ADDRESS,
  SAVE_ADDRESS,
  DELETE_ADDRESS,
  UPDATE_ADDRESS,
  STORE_USER_INFO
} from "./types";

export function store_user_info(info) {
  return {
    type: "STORE_USER_INFO",
    payload: info
  };
}

export function toggle_view() {
  return {
    type: "TOGGLE_VIEW",
    payload: null
  };
}

export function set_view_mode(mode) {
  return {
    type: "SET_VIEW_MODE",
    payload: mode
  };
}

export function set_locale(locale) {
  return {
    type: "SET_LOCALE",
    payload: locale
  };
}

export function init_notification(options) {
  options["visible"] = true;

  return async dispatch => {
    try {
      dispatch({
        type: "INIT_NOTIFICATION",
        payload: options
      });

      let t = setTimeout(() => {
        dispatch(
          {
            type: "HIDE_NOTIFICATION",
            payload: options
          },
          () => {
            clearInterval(t);
          }
        );
      }, 3000);
    } catch (e) {}
  };
}

export function loadInfo(lang_Id) {
  return async dispatch => {
    try {
      let res = await fetchInfo(lang_Id);

      let resWithReversedAddresses = {...res.data, ...res.data.address.reverse()}
 
      let payload = resWithReversedAddresses;

      dispatch({
        type: STORE_USER_INFO,
        payload
      });

      // localStorage.setItem("address_id", res.data.address[0].id);
    } catch (e) {}
  };
}

export function getAddress(langId) {
  
  return async dispatch => {
    try {
      let res = await fetchAddress(langId);
      dispatch({
        type: FETCH_ADDRESS,
        payload: res.data
      });
    } catch (e) {}
  };
}

export function deleteAddress(addressId) {
  return async dispatch => {
    try {
      let res = await removeAddress(addressId);

      dispatch({
        type: DELETE_ADDRESS,
        payload: addressId
      });
    } catch (e) {
    }
  };
}

export function addNewAddress(payload) {
  let reverseAddress = payload.reverse();
  localStorage.setItem("address_id", payload[0].id);
  return {
    type: UPDATE_ADDRESS,
    payload: reverseAddress
  };
}
