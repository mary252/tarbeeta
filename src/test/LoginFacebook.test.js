import { doAfterLogin } from "../services";
import { faceRes } from "../__fixtures__";

let localStorageKeys = [
  "access_token",
  "shop_id",
  "shop_username",
  "view_mode"
];
let history = {
  push: jest.fn()
};

describe("Testing login with facebook function", () => {
  it("Function will be and it should store some data in local storage", () => {
    localStorageKeys.forEach(key => {
      localStorage.removeItem(key);
    });

    window.location.assign = jest.fn();

    let spy4 = jest.spyOn(window.location, "assign");

    return doAfterLogin(null, faceRes, "en").then(() => {
      expect(localStorage.getItem("access_token")).toEqual(faceRes.token);
      expect(localStorage.getItem("shop_id")).toEqual(faceRes.data.shop_id);
      expect(localStorage.getItem("shop_username")).toEqual(
        faceRes.data.shop_username
      );

      expect(localStorage.getItem("view_mode")).toEqual("buyer");
      expect(spy4).toHaveBeenCalled();
    });
  });
});
