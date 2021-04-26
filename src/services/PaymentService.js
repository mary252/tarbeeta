import request from "../ultils/ApiCentral";

export function loadPending() {
  return request(
    {
      url: `/payment/load_Pending`,
      method: "GET"
    },
    true
  );
}

export function paymentInit(data) {
  return request(
    {
      url: `/payment/init`,
      method: "POST",
      data
    },
    true
  );
}

export function fetchOrderInfo() {
  return request(
    {
      url: `/order/info`,
      method: "GET"
    },
    true
  );
}

export function payWithKiosk(data) {
  return request(
    {
      url: `/payment/pay`,
      method: "POST",
      data
    },
    true
  );
}
