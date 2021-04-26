import React from "react";
import { shallow } from "enzyme";
import { ContactUs } from "../containers/ContactUs";
import { baseURL } from "../common/Config";

import nock from "nock";

const match = {
  params: {
    lang: "en" //any id you want to set
  }
};
const location = {
  search: ""
};

const host = baseURL;

let query = {
  lang_id: 1
};

describe("ContactUs Container", () => {
  const ContactUsComponent = shallow(
    <ContactUs match={match} location={location} />
  );
  let instance = ContactUsComponent.instance();
  const spy = jest.spyOn(instance, "saveFeedback");

  it("ContactUs exists", () => {
    expect(ContactUsComponent.exists()).toEqual(true);
  });

  it("bread_crumb Exist", () => {
    const nameInput = ContactUsComponent.find("#bread_crumb");
    expect(nameInput.length).toEqual(1);
  });

  it("Page Title Exist", () => {
    const nameInput = ContactUsComponent.find("#page_title");
    expect(nameInput.length).toEqual(1);
  });

  it("Page Title Exist", () => {
    const nameInput = ContactUsComponent.find("#page_title");
    expect(nameInput.length).toEqual(1);
  });

  it("Should Be More Than 8 Character", () => {
    expect(instance.state.name).toEqual("");
    expect(instance.state.nameError).toEqual("");

    instance.setState(() => ({ name: "Mohamed Shawky" }));
    instance.setState(() => ({ nameError: "Error message" }));

    instance.saveFeedback().then(() => {
      expect(instance.state.nameError).toBeNull();
    });
  });

  it('Should be Email pattern', () => {
    expect(instance.state.email).toEqual('');

    instance.setState({ email: "mohamedshawkybayoumi@gmail.com" });
    instance.setState({ emailError: "*Email is invalid" });
    instance.saveFeedback()
    .then(() => {
      expect(instance.state.emailError).toBeNull();
    })
  });

  it("Test Passed because Message more than 8 character", () => {
    expect(instance.state.messageContactUs).toEqual("");

    instance.setState({
      messageContactUs: "Hello, I wanna make a refund for order id #123465789"
    });
    instance.setState({
      messageContactUsError: "*Description Must Be More Than 5 Character"
    });
    instance.saveFeedback().then(() => {
      expect(instance.state.messageContactUsError).toBeNull();
    });
  });

  it("Name field Exist And  should be filled correctly", () => {
    const nameInput = ContactUsComponent.find("#name-input");
    expect(nameInput.length).toEqual(1);

    const event = { target: { name: "name", value: "user" } };

    nameInput.simulate("change", event);

    expect(instance.state.name).toEqual("user");
  });

  it("mobile field Exist And  should be filled correctly", () => {
    const mobileInput = ContactUsComponent.find("#mobile-input");
    expect(mobileInput.length).toEqual(1);

    const event = { target: { name: "mobile", value: "user@gmail.com" } };

    mobileInput.simulate("change", event);

    expect(instance.state.mobile).toEqual("user@gmail.com");
  });

  it("Message field Exist And be filled correctly", () => {
    const messageInput = ContactUsComponent.find("#message-input");
    expect(messageInput.length).toEqual(1);

    const event = {
      target: {
        name: "message",
        value: "This is Feed back about the Performance Of Application"
      }
    };

    messageInput.simulate("change", event);

    expect(instance.state.message).toEqual(
      "This is Feed back about the Performance Of Application"
    );
  });

  it("Button exist  And Clicked event worked correctly", () => {
    const sendBtn = ContactUsComponent.find("#send-button");
    expect(sendBtn.length).toEqual(1);
    sendBtn.prop("onPress")();

    expect(spy).toHaveBeenCalled();
  });

  it("Should Send Request to Save ContactUs Form And Reset Form", () => {
    instance.setState({
      name: "user",
      email: "user@gmail.com",
      messageContactUs: "this is negative feedback about performance"
    });

    nock(host)
      .post(`/contact_us`, {
        name: "user",
        email: "user@gmail.com",
        message: "this is negative feedback about performance"
      })
      .reply(200);
    return instance.saveFeedback().then(res => {

      instance.restState();

      expect(instance.state.name).toEqual("");
      expect(instance.state.email).toEqual("");
      expect(instance.state.messageContactUs).toEqual("");


    });
  });

  it("Should Send Request to Save ContactUs Form And Reset Form", () => {
    instance.setState({
      name: "user",
      mobile: "user@gmail.com",
      messageContactUs: "this is negative feedback about performance"
    });

    nock(host)
      .post(`/contact_us`, {
        name: "user",
        mobile: "user@gmail.com",
        message: "this is negative feedback about performance"
      })
      .reply(200);
    return instance.saveFeedback().then(res => {

      instance.restState();

      let { name, mobile, messageContactUs } = instance.state,
        data = { name, mobile, messageContactUs };

      expect(data).toEqual({
        name: "",
        mobile: "",
        messageContactUs: ""
      });
    });
  });
});
