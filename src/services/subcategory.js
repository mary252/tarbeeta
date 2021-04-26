import request from "../ultils/ApiCentral";
import { AR } from "../common";

export function fetchSubCategory(id, lang_id=AR, showAll=0) {
  return request(
    {
      url: `/subcategory?department_category_id=${id}&lang_id=${lang_id}&showAll=${showAll}`,
      method: "GET"
    },
    true
  );
}
