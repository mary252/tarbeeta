import request from "../ultils/ApiCentral";

export function updateAccountInfo(data, langId) {
    return request(
      {
        url: `/user?lang_id=${langId}`,
        method: "PUT",
        data
      },
      true
    );
  }
  
  // export function getAccountInfo(shop_id, langId) {
  //   return request(
  //     {
  //       url: `/shop/${shop_id}?lang_id=${langId}`,
  //       method: "GET"
  //     },
  //     true
  //   );
  // }