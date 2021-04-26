import {
  NEW_NOTIFICATION,
  MARK_NOTIFICATION_SEEN,
  FETCH_NOTIFICATION,
  START_FETCH_NOTIFICATIONS,
  FETCH_MORE_NOTIFICATION,
  START_FETCH_MORE_NOTIFICATION
} from "../actions/types";
import { updateObject } from "../ultils";

const INITIAL_STATE = {
  data: [],
  numberOfNotiUnseen: 0,
  loading: false,
  showMore: false,
  is_busy: false,
  page: 1
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case NEW_NOTIFICATION:
      return updateObject(state, {
        data: [action.payload, ...state.data]
      });
    case MARK_NOTIFICATION_SEEN:
      return updateObject(state, {
        numberOfNotiUnseen: 0
      });

    case FETCH_NOTIFICATION:
      return updateObject(state, {
        numberOfNotiUnseen: action.payload.unseen,
        ...action.payload,
        loading: false
      });

    case START_FETCH_NOTIFICATIONS:
      return updateObject(state, {
        is_busy: action.payload.is_busy
      });

    case FETCH_MORE_NOTIFICATION:
      return updateObject(state, {
        data: [...state.data, ...action.payload.data],
        is_busy: false
      });
    case START_FETCH_MORE_NOTIFICATION:
      return updateObject(state, {
        page: action.payload.page || state.page,
        loading: action.payload
      });

    default:
      return state;
  }
};
