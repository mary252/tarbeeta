import request from "../ultils/ApiCentral";
import { baseURL, EN, AR } from "../common";
import { GistToMember } from "./GistService";
var popupTools = require("../ultils/PopupTools");
// import { store_user_info } from "../actions";

// import store from "../Store";

export function forgetPass(data) {
  return request({
    url: `/user/forget_password`,
    method: "POST",
    data
  });
}

export function cahngePass(data) {
  return request(
    {
      url: `/user/change_password`,
      method: "POST",
      data
    },
    true
  );
}

export function setPass(data) {
  return request({
    url: `/user/reset_password`,
    method: "POST",
    data
  });
}
export function Quick_Register (data){
  return request({
    url:  "/user/quick",
    method: "POST",
    data
  });
}
export function sendVerificationEmail() {
  return request(
    {
      url: `/user/mail/send`,
      method: "POST"
    },
    true
  );
}

export function sendMobileConfirmationCode() {
  return request(
    {
      url: `/user/mobile/send`,
      method: "POST"
    },
    true
  );
}

export function verifyEmail(data, lang) {
  return request(
    {
      url: `/user/verify?lang_id=${lang}`,
      method: "POST",
      data
    },
    true
  );
}

export function verifyMobile(data, lang) {
  return request(
    {
      url: `/user/mobile/verify?lang_id=${lang}`,
      method: "POST",
      data
    },
    true
  );
}

export function validateResetCode(data) {
  return request({
    url: `/user/validate_reset_code`,
    method: "POST",
    data
  });
}

export let doAfterLogin = async function(err, data, lang) {
  if (err || !data || !data.token) {
    return;
  }

  const { token, data: { mobile_verified } = {} } = data;

  localStorage.setItem("access_token", token);
  localStorage.setItem("view_mode", "buyer");

  if (!mobile_verified) {
    localStorage.setItem("destination", "mobile");
  }

  await GistToMember(lang, data.token);
};

export function loginFacebook(lang) {
  let lang_id = lang == "en" ? EN : AR;

  popupTools.popup(
    `${baseURL}fb_login?lang_id=${lang_id}`,
    "Facebook Login",
    { width: 600, height: 600 },
    (err, data) => doAfterLogin(err, data, lang),
    true
  );
}
