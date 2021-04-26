import request from "../ultils/ApiCentral";
import { AR } from "../common";

export function fetchtDepartment(lang_id = AR, showAll) {
  return request({
    url: `/department?lang_id=${lang_id}&showAll=${showAll}`,
    method: "GET"
  });
}
