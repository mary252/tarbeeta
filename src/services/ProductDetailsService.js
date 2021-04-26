import request from "../ultils/ApiCentral";

export function fetchtProductDetails(id, lang_id) {
  return request(
    {
      url: `/product/details/${id}?lang_id=${lang_id}`,
      method: "GET"
    },
    true
  );
}
