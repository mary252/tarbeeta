import request from "../ultils/ApiCentral";
import { AR } from "../common";

export function featchCategory(department_url, lang_id = AR) {
  return request({
    // url: `/category?lang_id=${lang_id}&department_id=${id}`,
    url: `/category?lang_id=${lang_id}&depName=${department_url}`,

    method: "GET"
  });
}

export function featchCategoryWithId(id, lang_id = AR, showAll) {
  return request({
    url: `/category?lang_id=${lang_id}&department_id=${id}&showAll=${showAll}`,

    method: "GET"
  });
}
