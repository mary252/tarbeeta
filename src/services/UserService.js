import request from "../ultils/ApiCentral";
import { AR } from "../common";

export function fetchAddress(langId = AR) {
  return request(
    {
      url: `/address?lang_id=${langId}`,
      method: "GET"
    },
    true
  );
}

export function update(data) {
  return request(
    {
      url: `/user`,
      method: "PUT",
      data
    },
    true
  );
}

export function fetchInfo(langId) {
  return request(
    {
      url: `/me?lang_id=${langId}`,
      method: "GET"
    },
    true
  );
}

export function addAddress(data) {
  return request(
    {
      url: `/Address`,
      method: "POST",
      data
    },
    true
  );
}

export function removeAddress(addressId) {
  return request(
    {
      url: `/Address/${addressId}`,
      method: "PUT"
    },
    true
  );
}

export function getFAQs(lang_id) {
  return request({
    url: `/faq?lang_id=${lang_id}`,
    method: "GET"
  });
}

export function sendFeedback(data) {
  return request(
    {
      url: `/contact_us`,
      method: "POST",
      data
    },
    true
  );
}
