import request from "../ultils/ApiCentral";

export function getOrdersData() {
  return request(
    {
      url: `/order`,
      method: "GET"
    },
    true
  );
}

export function getOrderInfo(order_id) {
  return request(
    {
      url: `/order?id=${order_id}`,
      method: "GET"
    },
    true
  );
}

export function checkOrder() {
  return request(
    {
      url: `order/cart/check`,
      method: "GET"
    },
    true
  );
}

export function placeOrder(data,lang_id) {
  return request(
    {
      url: `/order/place?lang_id=${lang_id}`,
      method: "POST",
      data
    },
    true
  );
}

export function fetchFinishedOrder(lang_id) {
  return request(
    {
      url: `/order/done?lang_id=${lang_id}`,
      method: "GET"
    },
    true
  );
}

export function fetchSingleOrder(order_id, lang_id) {
  return request(
    {
      url: `/order?id=${order_id}&lang_id=${lang_id}`,
      method: "GET"
    },
    true
  );
}

export function cancelOrder(chunk_id) {
  return request(
    {
      url: `/order/cancel/${chunk_id}`,
      method: "POST"
    },
    true
  );
}

export function writeReview(product_id, data) {
  return request(
    {
      url: `/product/rate/${product_id}`,
      method: "POST",
      data
    },
    true
  );
}

export function applyCode(promo_code) {
  return request(
    {
      url: `/order/promo/${promo_code}`,
      method: "POST",
    },
    true
  );
}
