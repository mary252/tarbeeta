import request from "../ultils/ApiCentral";
import { urlQueryGenrator, isLoggedIn } from "../ultils";
import { gistFollowShop } from "../services";

export function postNewShop(data, lang_id) {
  return request(
    {
      url: `/shop?lang_id=${lang_id}`,
      method: "POST",
      data
    },
    true
  );
}

export function editShop(data, shop_id) {
  return request(
    {
      url: `/shop/${shop_id}`,
      method: "PUT",
      data
    },
    true
  );
}

export function getInfo(shop_username, langId) {
  return request(
    {
      url: `/shop/${shop_username}?lang_id=${langId}`,
      method: "GET"
    },
    true
  );
}

export function getShopProduct(shop_id, filters) {
  return request(
    {
      url: urlQueryGenrator(`/shop/products/${shop_id}?`, filters),
      method: "GET"
    },
    true
  );
}

export function fetchShopFilter(filters, shopId) {
  return request(
    {
      url: urlQueryGenrator(`/shop/filters/${shopId}?`, filters),
      method: "GET"
    },
    true
  );
}

export function check_shop_owner(shop_id) {
  return request(
    {
      url: `/shop/check/${shop_id}`,
      method: "GET"
    },
    true
  );
}
export function isMyShop(shop_id) {
  return request(
    {
      url: `/shop/check/${shop_id}`,
      method: "GET"
    },
    true
  );
}

export function followShop(id, username) {
  //alert("follow shop ");
  return isLoggedIn()
    ? request(
        {
          url: `/shop/follow/${id}`,
          method: "POST"
        },
        true
      )
    : gistFollowShop(id, username);
}

export function unFollowShop(id) {
  return request(
    {
      url: `/shop/unfollow/${id}`,
      method: "POST"
    },
    true
  );
}

export function getFollowes(id) {
  // alert("get shop followers ");
  return request(
    {
      url: `/shop/followers/${id}`,
      method: "GET"
    },
    true
  );
}
