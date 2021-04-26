import React from "react";
import { shallow } from "enzyme";
import {ChangePassword} from "../containers/auth/ChangePassword";
import { configure } from "enzyme";
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

describe("Change Password Container", () => {
  const changePassword = shallow(
    <ChangePassword match={match} location={location} />
  );
  let instance = changePassword.instance();
  const spy = jest.spyOn(instance, "changePass");

  it("  Change Password exists", () => {
    expect(changePassword.exists()).toEqual(true);
  });

  it("Old  password field Exist And  should be filled correctly", () => {
    const oldPassInput = changePassword.find("#oldPassword-input");
    expect(oldPassInput.length).toEqual(1);

    const event = { target: { name: "oldPassword", value: "123" } };

    oldPassInput.simulate("change", event);

    expect(instance.state.oldPassword).toEqual("123");

    oldPassInput.simulate("keypress", { key: "Enter" });

    expect(spy).toBeCalledTimes(1);
  });

  it("input password field Exist And  should be filled correctly", () => {
    const passwordInput = changePassword.find("#password-input");
    expect(passwordInput.length).toEqual(1);

    const event = { target: { name: "password", value: "123" } };

    passwordInput.simulate("change", event);

    expect(instance.state.password).toEqual("123");

    passwordInput.simulate("keypress", { key: "Enter" });

    expect(spy).toBeCalledTimes(2);
  });

  it("confirm password field Exist And be filled correctly", () => {
    const confirmPassInput = changePassword.find("#confirm-password-input");
    expect(confirmPassInput.length).toEqual(1);

    const event = { target: { name: "confirmPassword", value: "456" } };

    confirmPassInput.simulate("change", event);

    expect(instance.state.confirmPassword).toEqual("456");

    confirmPassInput.simulate("change", event);

    confirmPassInput.simulate("keypress", { key: "Enter" });

    expect(spy).toBeCalledTimes(3);
  });

  it("Button exist  And Clicked event worked correctly", () => {
    const restBtn = changePassword.find("#rest-button");
    expect(restBtn.length).toEqual(1);
    restBtn.prop("onPress")();

    expect(spy).toBeCalledTimes(4);
  });

  it(" Should Be More Than 8 Character", () => {
    instance.setState({ password: "46788" });
    instance.changePass().then(()=>{
      expect(instance.state.passwordError).toBeDefined();

    })
  });

  it("Test Passed because password more than 8 character", () => {
    instance.setState({ oldPassword: "12345678" });

    instance.changePass()
    .then(()=>{
      expect(instance.state.oldPasswordError).toBeNull();

    })

  });

  it(" Should Be More Than 8 Character", () => {
    instance.setState({ oldPassword: "46788" });
    instance.changePass()
    .then(() => {
      expect(instance.state.oldPasswordError).toBeDefined();
    });
    
  });

  it("Test Passed because password more than 8 character", () => {
    instance.setState({ password: "12345678" });
    instance.changePass()
    .then(() => {
      expect(instance.state.passwordError).toBeNull();
    });
    
  });

  it(" Should Be More confirmPassword Than 8 Character", () => {
    instance.setState({ confirmPassword: "46788" });
    instance.changePass()
    .then(() => {
      expect(instance.state.confirmPasswordError).toBeDefined();
    });
    
  });

  it("Test Passed because confirmPassword more than 8 character", () => {
    instance.setState({ confirmPassword: "12345678" });
    instance.changePass()
    .then(() => {
      expect(instance.state.confirmPasswordError).toBeNull();
    });
    
  });
  it(" Should Be More confirmPassword Than 8 Character", () => {
    instance.setState({ confirmPassword: "12345678", password: "12345678" });
    instance.changePass()
    .then(() => {
      expect(instance.state.identicalError).toBeNull();  
    })
    
  });

  it("Test Passed because confirmPassword more than 8 character", () => {
    instance.setState({ confirmPassword: "12345678", password: "12345679" });
    instance.changePass()
    .then(() => {
      expect(instance.state.identicalError).toBeDefined();
    })
    
  });

  it("Should Send Request to Change Password And Reset Form", () => {
    instance.setState({
      confirmPassword: "12345678910",
      password: "12345678910",
      oldPassword: "1234567891"
    });

    nock(host)
      .post(`/user/change_password`, {
        password: "12345678910",
        oldPassword: "1234567891"
      })
      .reply(200);
    instance.changePass().then(res => {
      let { password, oldPassword, confirmPassword } = instance.state,
        data = { password, oldPassword, confirmPassword };
 
      expect(data).toEqual({
        confirmPassword: "",
        oldPassword: "",
        password: ""
      });
    });
  });

  // it("renders correctly", () => {
  //   expect(changePassword).toMatchSnapshot();
  // });
});
