import request from "../ultils/ApiCentral";

export function getCountries() {
  return request(
    {
      url: `/countries/`,
      method: "GET"
    },
    true
  );
}

export function getCities(country_id) {
  return request(
    {
      url: `/cities/country_id=${country_id}`,
      method: "GET"
    },
    true
  );
}

export function getAreas(city_id) {
  return request(
    {
      url: `/areas/city_id=${city_id}`,
      method: "GET"
    },
    true
  );
}
