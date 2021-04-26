import React from "react";
import { shallow } from "enzyme";
import ResetPassword from "../containers/auth/resetPassword";
import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { baseURL } from "../common/Config";
import axios from "axios"; // v0.15.3
import httpAdapter from "axios/lib/adapters/http";
import nock from "nock";

configure({ adapter: new Adapter() });

const match = {
  params: {
    lang: "en" //any id you want to set
  }
};
const location = {
  search: ""
};

const host = baseURL;

axios.defaults.host = host;
axios.defaults.adapter = httpAdapter;
let query = {
  lang_id: 1
};

describe("reset Password Container", () => {
  const resetPassword = shallow(
    <ResetPassword match={match} location={location} />
  );
  let instance = resetPassword.instance();
  const spy = jest.spyOn(instance, "resetPass");

  it("  Faqs container exists", () => {
    expect(resetPassword.exists()).toEqual(true);
  });

  it("input password field Exist And  should be filled correctly", () => {
    const passwordInput = resetPassword.find("#password-input");
    expect(passwordInput.length).toEqual(1);

    const event = { target: { name: "password", value: "123" } };

    passwordInput.simulate("change", event);

    expect(instance.state.password).toEqual("123");

    passwordInput.simulate("keypress", { key: "Enter" });

    expect(spy).toBeCalledTimes(1);
  });

  it("confirm password field Exist And be filled correctly", () => {
    const confirmPassInput = resetPassword.find("#confirm-password-input");
    expect(confirmPassInput.length).toEqual(1);

    const event = { target: { name: "confirmPassword", value: "456" } };

    confirmPassInput.simulate("change", event);

    expect(instance.state.confirmPassword).toEqual("456");

    confirmPassInput.simulate("change", event);

    confirmPassInput.simulate("keypress", { key: "Enter" });

    expect(spy).toBeCalledTimes(2);
  });

  it("Button exist  And Clicked event worked correctly", () => {
    const restBtn = resetPassword.find("#rest-button");
    expect(restBtn.length).toEqual(1);
    restBtn.prop("onPress")();

    expect(spy).toBeCalledTimes(3);
  });

  it(" Should Be More Than 8 Character", () => {
    instance.setState({ password: "46788" });
    instance.resetPass()
    .then(() => {
      expect(instance.state.passwordError).toBeDefined();
    })
    
  });

  it("Test Passed because password more than 8 character", () => {
    instance.setState({ password: "12345678" });
    instance.resetPass()
    .then(() => {
      expect(instance.state.passwordError).toBeUndefined();
    });
    
  });

  it(" Should Be More confirmPassword Than 8 Character", () => {
    instance.setState({ confirmPassword: "46788" });
    instance.resetPass()
    .then(() => {
      expect(instance.state.confirmPasswordError).toBeDefined();
    });
    
  });

  it("Test Passed because confirmPassword more than 8 character", () => {
    instance.setState({ confirmPassword: "12345678" });
    instance.resetPass()
    .then(() => {
      expect(instance.state.confirmPasswordError).toBeUndefined();
    });
    
  });
  it(" Should Be More confirmPassword Than 8 Character", () => {
    instance.setState({ confirmPassword: "12345678", password: "12345678" });
    instance.resetPass()
    .then(() => {
      expect(instance.state.identicalError).toBeUndefined();
    });
    
  });

  it("Test Passed because confirmPassword more than 8 character", () => {
    instance.setState({ confirmPassword: "12345678", password: "12345679" });
    instance.resetPass()
    .then(() => {
      expect(instance.state.identicalError).toBeDefined();
    });
    
  });

  // it("renders correctly", () => {
  //   expect(resetPassword).toMatchSnapshot();
  // });
});
