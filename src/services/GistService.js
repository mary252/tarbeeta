import {
  storeGistLike,
  getGistLike,
  rmGuestLike,
  getGistCartId,
  rmGistCartId,
  storeGistLikeColor,
  getGistLikeColor,
  storeGistShopId,
  getGistShopId,
  rmGistShopId
} from "../ultils";

import { like, delfromCart } from "./";
import { mergeCart } from "./CartService";
import { followShop } from "./shop";
import { connectRT } from "./socketIOService";
export const gistLikeProduct = async (product_id, colour_id, lang) => {
  try {
    storeGistLike(product_id);
    storeGistLikeColor(colour_id);

    // window.location.href = `/${lang}/login`;
    window.location.assign(`/${lang}/login`);

    await delfromCart(product_id);
  } catch (e) {}
};

export const checkGuestLike = async lang => {
  try {
    let variation_id = getGistLike(),
      colour_id = getGistLikeColor();
    if (!variation_id) return;

    await like(variation_id, colour_id, lang);

    rmGuestLike();
  } catch (e) {}
};

export const mergeGistMember = async () => {
  try {
    if (!getGistCartId()) return;

    let res = await mergeCart(getGistCartId());

    rmGistCartId();
  } catch (e) {}
};

export const checkToRedirect = lang => {
  let destination = localStorage.getItem("destination");

  window.location.assign(destination ? `/${lang}/${destination}` : `/${lang}`);

  localStorage.removeItem("destination");
};

export const GistToMember = async (lang, token) => {
  try {
    if (!token) throw new Error("Token Should Not Be Null");
    localStorage.setItem("view_mode", "buyer");

    localStorage.setItem("access_token", token);

    connectRT();

    await mergeGistMember();

    await checkGuestLike(lang);

    await checkGuestFollowShop();

    checkToRedirect(lang);
  } catch (e) {
    console.log(e.message);
  }
};

export const gistFollowShop = (id, username) => {
  storeGistShopId(id);
  localStorage.setItem("destination", `shop/${username}`);

  window.location.href = `/${localStorage.getItem("locale")}/login`;
};

export const checkGuestFollowShop = async () => {
  try {
    let followed_shop_id = getGistShopId();
    if (!followed_shop_id) return;

    await followShop(followed_shop_id);

    rmGistShopId();
  } catch (e) {}
};
