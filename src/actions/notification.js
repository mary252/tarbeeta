import {
  NEW_NOTIFICATION,
  MARK_NOTIFICATION_SEEN,
  FETCH_NOTIFICATION,
  START_FETCH_NOTIFICATIONS,
  FETCH_MORE_NOTIFICATION,
  START_FETCH_MORE_NOTIFICATION
} from "./types";

import { markNotiAsSeen, fetchNotifications } from "../services";

export function NewNotification(payload) {
  return {
    type: NEW_NOTIFICATION,
    payload
  };
}

export function markNotiSeen() {
  return async dispatch => {
    try {
      let res = await markNotiAsSeen();

      dispatch({
        type: MARK_NOTIFICATION_SEEN
      });
    } catch (e) {}
  };
}

export function getNotification() {
  return async dispatch => {
    try {
      dispatch({
        type: START_FETCH_NOTIFICATIONS,
        payload: true
      });

      let res = await fetchNotifications();
      dispatch({
        type: FETCH_NOTIFICATION,
        payload: res
      });
    } catch (e) {
      dispatch({
        type: START_FETCH_NOTIFICATIONS,
        payload: false
      });
    }
  };
}

export function getMoreNotification(page) {
  return async dispatch => {
    try {
      dispatch({
        type: START_FETCH_MORE_NOTIFICATION,
        payload: {
          is_busy: true,
          page: page + 1
        }
      });

      let res = await fetchNotifications(page + 1);

      dispatch({
        type: FETCH_MORE_NOTIFICATION,
        payload: res
      });
    } catch (e) {
      dispatch({
        type: START_FETCH_MORE_NOTIFICATION,
        payload: {
          is_busy: false
        }
      });
    }
  };
}
