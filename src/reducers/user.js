import {
  FETCH_ADDRESS,
  UPDATE_ADDRESS,
  STORE_USER_INFO,
  DELETE_ADDRESS
} from "../actions/types";
import { updateObject } from "../ultils";

const INITIAL_STATE = {
  view_mode: "buyer",
  firstname: null,
  lastname: null,
  avatar: "",
  cover: null,
  bio: null,
  overall_rating: 4,
  n_reviews: 325,
  n_followers: 1322,
  locale: null,
  verified: false,
  mobile_verified: false,
  address: [],
  notification: [],
  wallet: null,
  mobile: null,
  shop_username: null,
  shop_id: null,
  me_busy: false,
  is_fetching_finsihed:false
};

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case STORE_USER_INFO:
      state = updateObject(state, action.payload);
      break;

    case "TOGGLE_VIEW":
      state = {
        ...state,
        view_mode: state.view_mode === "seller" ? "buyer" : "seller"
      };
      break;

    case "INIT_NOTIFICATION":
      let old = state.notification.slice();
      old.push(action.payload);

      state = {
        ...state,
        notification: old
      };

      break;

    case "HIDE_NOTIFICATION":
      old = state.notification.splice(1, state.notification.length - 1);

      state = {
        ...state,
        // notification: state.notification.splice(state.notification, 1)
        notification: old
      };

    case "SET_VIEW_MODE":
      state = {
        ...state,
        view_mode: action.payload
      };
      break;

    case "SET_LOCALE":
      state = {
        ...state,
        locale: action.payload
      };
      break;
    case "FETCH_ADDRESS":
      state = updateObject(state, { address: action.payload });
      break;
    case DELETE_ADDRESS:
      state = updateObject(state, {
        address: state.address.filter(x => x.id !== action.payload)
      });
      break;

    case UPDATE_ADDRESS:
      state = updateObject(state, { address: action.payload });
      break;
    

      
    default:
  }
  return state;
}
