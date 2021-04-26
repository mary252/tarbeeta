export const getGistCartId = () => localStorage.getItem("cart_id");
export const rmGistCartId = () => localStorage.removeItem("cart_id");

export const getGistLike = () => localStorage.getItem("gist_like");

export const getGistLikeColor = () => localStorage.getItem("gist_like_color");

export const storeGistLike = id => localStorage.setItem("gist_like", id);

export const storeGistLikeColor = id =>
  localStorage.setItem("gist_like_color", id);

export const storeGistCartId = cart_id =>
  localStorage.setItem("cart_id", cart_id);

export const rmGuestLike = () => localStorage.removeItem("gist_like");

export const storeGistShopId = id =>
  localStorage.setItem("followed_shop_id", id);

export const rmGistShopId = () => localStorage.removeItem("followed_shop_id");
export const getGistShopId = () => localStorage.getItem("followed_shop_id");
