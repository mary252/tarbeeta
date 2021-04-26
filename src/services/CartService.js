import request from "../ultils/ApiCentral";
import { isLoggedIn, getGistCartId } from "../ultils";

export function featchCartTotal(lang_id) {
  return isLoggedIn()
    ? request(
        {
          url: `/cart/total?lang_id=${lang_id}`,
          method: "GET"
        },
        true
      )
    : request({
        url: `/cart/guest/total/${getGistCartId()}?lang_id=${lang_id}`,
        method: "GET"
      });
}

export function featchCart(lang_id) {
  return isLoggedIn()
    ? request(
        {
          url: `/cart?lang_id=${lang_id}`,
          method: "GET"
        },
        true
      )
    : request({
        url: `/cart/guest/${getGistCartId()}?lang_id=${lang_id}`,
        method: "GET"
      });
}

export function addToCart(data) {
  return isLoggedIn()
    ? request(
        {
          url: `/cart/add`,
          method: "POST",
          data
        },
        true
      )
    : request({
        url: `/cart/guest/add`,
        method: "POST",
        data
      });
}

export function delfromCart(variation_id) {
  return isLoggedIn()
    ? request(
        {
          url: `/cart?variation_id=${variation_id}`,
          method: "DELETE"
        },
        true
      )
    : request({
        url: `/cart/guest/${getGistCartId()}?variation_id=${variation_id}`,
        method: "DELETE"
      });
}

export function updateVariationQty(data) {
  return isLoggedIn()
    ? request(
        {
          url: `/cart`,
          method: "PUT",
          data
        },
        true
      )
    : request({
        url: `/cart/guest`,
        method: "PUT",
        data: { ...data, cart_id: getGistCartId() }
      });
}

export function getCartSeller(lang_id) {
  return request(
    {
      url: `/cart/sellers?lang_id=${lang_id}`,
      method: "GET"
    },
    true
  );
}

export function fetchNoCart(cart_id_new) {
  return isLoggedIn()
    ? request(
        {
          url: `/cart/count`,
          method: "GET"
        },
        true
      )
    : request({
        url: `/cart/count?cart_id=${getGistCartId() || cart_id_new}`,
        method: "GET"
      });
}

export function mergeCart(cart_id) {
  return request(
    {
      url: `/cart/merge/${cart_id}`,
      method: "PUT"
    },
    true
  );
}
