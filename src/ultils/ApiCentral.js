import axios from "axios";
import { baseURL, v2_url } from "../common";
import { getJwt } from "./auth";
import store from "../Store";

const request = async function(options, isHeader = false, isFile = false, version="v1") {
  let headers = {};
  if (isHeader) {
    headers = {
      "Content-Type": isFile
        ? "application/x-www-form-urlencoded"
        : "application/json"
    };
  }

  if (getJwt()) {
    headers["Authorization"] = `Bearer ${getJwt()}`;
  }
  var client;
  if (version == "v1") {
    client = axios.create({
      baseURL,
      headers
    });
  } else {
    client = axios.create({
      baseURL:v2_url,
      headers
    });
  }

  const onSuccess = function(response) {
    return response.data;
  };

  const onError = function(error) {
    if (undefined !== error.response && error.response.status == 401) {
      localStorage.removeItem("access_token");
      window.location.href = `/${localStorage.getItem("locale")}/login`;
    }

    return Promise.reject(error.response || error.message);
  };

  return client(options)
    .then(onSuccess)
    .catch(onError);
};

export default request;
