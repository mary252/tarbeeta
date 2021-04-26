import { fetchtDepartment } from "../services";
import { FETCH_DEPARTMENTS } from "./types";

export function getDepartment(langId) {
  return async dispatch => {
    try {
      let res = await fetchtDepartment(langId);

      dispatch({
        type: FETCH_DEPARTMENTS,
        payload: res.data
      });
    } catch (e) {}
  };
}
