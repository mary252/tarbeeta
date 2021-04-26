import { combineReducers } from "redux";

import user from "./user";
import GlobalReducer from "./GlobalReducer";
import departments from "./DepartmentsReducer";
import userNotifications from "./NotificationsReducer";
import addToCartPopUp from "./CartPopUpReducer";
export default combineReducers({
  user,
  departments,
  global: GlobalReducer,
  userNotifications,
  cartPopUp: addToCartPopUp
});
