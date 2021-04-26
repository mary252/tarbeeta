import request from "../ultils/ApiCentral";
import { AR, EG } from "../common";

export function fetchCities(countryId=EG, langId=AR) {
  return request(
    {
      url: `/cities/${countryId}?lang_id=${langId}`,
      method: "GET"
    }
  );
}

export function fetchAreas (cityId, langId=AR) {
    return request({
        url: `/areas/${cityId}?lang_id=${langId}`,
        method: "GET"
    })
}

export function addAddress (data) {
    return request({
        url: `/address`,
        method: "POST",
        data
    }, true)
}
