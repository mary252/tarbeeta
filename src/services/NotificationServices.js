import request from "../ultils/ApiCentral";

export function fetchNotifications(page = 1) {
  return request(
    {
      url: `/notification?page=${page}`,
      method: "GET"
    },
    true
  );
}

export function markNotiAsSeen() {
  return request(
    {
      url: `/notification`,
      method: "POST"
    },
    true
  );
}
