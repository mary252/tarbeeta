import request from "../ultils/ApiCentral";

export function getWalletInfo() {
  return request(
    {
      url: `/wallet`,
      method: "GET"
    },
    true
  );
}

export function getBankInfo() {
  return request(
    {
      url: `/wallet/bank`,
      method: "GET"
    },
    true
  );
}

export function getStatusInfo() {
  return request(
    {
      url: `/wallet/status`,
      method: "GET"
    },
    true
  );
}

export function getLogInfo() {
  return request(
    {
      url: `/wallet/log`,
      method: "GET"
    },
    true
  );
}

export function getLogInfoFromSelect(id) {
  return request(
    {
      url: `/wallet/log?status=${id}`,
      method: "GET"
    },
    true
  );
}

export function getBanks() {
  return request(
    {
      url: `/banks`,
      method: "GET"
    },
    true
  );
}

export function addBankAccount(data) {
  return request(
    {
      url: `/wallet/bank`,
      method: "POST",
      data
    },
    true
  );
}

export function deleteBankAccount (data){
  return request(
    {
      url: `/wallet/bank`,
      method: "DELETE",
      data
    },
    true
  );
}