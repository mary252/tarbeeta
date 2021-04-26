import React, { Component } from "react";
import {
  Page,
  PageTitle,
  BreadCrumb,
  TextInput,
  TextBox,
  TButton
} from "../components";
import { sendFeedback } from "../services";
import { validate } from "../ultils/validate/validation";
import MessengerCustomerChat from 'react-messenger-customer-chat';
import { connect } from "react-redux";
import * as actions from "../actions";
import { FACEBOOK_CHAT_POPUP_THEME_COLOR, FACEBOOK_APP_ID, FACEBOOK_PAGE_ID } from "../common";

export class ContactUs extends Component {
  state = {
    name: "",
    messageContactUs: "",
    nameError: "",
    messageContactUsError: "",
    mobile: "",
    mobileError: "",
    is_busy: false
  };

  validation = fieldsArray => {
    this.setState({
      error_msg: null
    });

    return new Promise(async (resolve, reject) => {
      const errorsArray = await fieldsArray.map((field, i) => {
        return { [`${field}Error`]: validate(field, this.state[field]) };
      });

      let hasErrors = false;

      errorsArray.map((error, j) => {
        let key = Object.keys(error)[0],
          value = Object.values(error)[0];

        this.setState({
          [key]: value
        });

        if (value !== null) {
          hasErrors = true;
        }
      });

      if (hasErrors) {
        reject(false);
      }

      resolve(true);
    });
  };

  saveFeedback = async () => {
    this.validation(["name", "mobile", "messageContactUs"])
      .then(async () => {
        this.setState({
          is_busy: true
        });
        try {
          let { name, mobile, messageContactUs } = this.state;

          let res = await sendFeedback({
            name,
            mobile,
            message: messageContactUs
          });

          this.restState();

          //show custom notification after saving successfully
          this.props.init_notification({
            type: "success",
            title: this.props.locale.success,
            message: this.props.locale.review_added
          });
          this.setState({
            is_busy: false
          });
        } catch (e) {
          this.props.init_notification({
            type: "error",
            title: this.props.locale.error,
            message: this.props.locale.error_message
          });
          this.setState({
            is_busy: false
          });
        }
      })
      .catch(formErrors => {});
  };

  restState = () =>
    this.setState(() => ({ name: "", mobile: "", messageContactUs: "" }));
  saveToState = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    const {
      state: { name, mobile, messageContactUs },
      props: {
        lang,
        locale: {
          tarbeeta,
          contat_us_title,
          mobile_placeholder,
          name_placeholder,
          save_button,
          message_placeholder,
          contact_us_paragraph
        }
      }
    } = this;
    return (
      <Page
        title={contat_us_title}
        description={contact_us_paragraph}
        {...this.props}
      >
        <div className="container">
        <div>
          <MessengerCustomerChat
              pageId={FACEBOOK_PAGE_ID}
              greeting_dialog_display="hide"
              appId={FACEBOOK_APP_ID}
              themeColor={FACEBOOK_CHAT_POPUP_THEME_COLOR}
              language={this.props.lang == "en" ? "en_US" : "ar_AR"}
              greetingDialogDelay={0}
              minimized={true}
              shouldShowDialog={false}
              loggedInGreeting={this.props.locale.facebook_chat_greeting_message}
              loggedOutGreeting={this.props.locale.facebook_chat_greeting_message}
            />
          </div>
          <div className="columns is-mobile">
            <div className="column is-hidden-desktop is-1-mobile is-1-tablet" />

            <div className="column is-4-desktop is-10-mobile is-10-tablet">
              <BreadCrumb
                history={[
                  {
                    name: tarbeeta,
                    href: `/${lang}`
                  }
                ]}
                activeRoute={contat_us_title}
                id="bread_crumb"
              />
              <PageTitle
                id="page_title"
                title={contat_us_title}
                className="mar-bot-15"
              />
              <p className="paragraph-title  mar-bot-15">
                {contact_us_paragraph}
              </p>

              <TextInput
                divClassName="mar-bot-10"
                required
                placeholder={name_placeholder}
                onBlur={() =>
                  this.validation(["name"])
                    .then()
                    .catch(e => {})
                }
                errorMessage={this.state.nameError}
                type="text"
                name="name"
                id="name-input"
                value={name}
                onChange={this.saveToState}
              />

              <TextInput
                divClassName="mar-bot-10"
                required
                placeholder={mobile_placeholder}
                onBlur={() =>
                  this.validation(["mobile"])
                    .then()
                    .catch(e => {})
                }
                errorMessage={this.state.mobileError}
                type="text"
                value={mobile}
                name="mobile"
                id="mobile-input"
                onChange={this.saveToState}
              />
              <TextBox
                custclass="mar-bot-20"
                rows={5}
                name="messageContactUs"
                id="message-input"
                placeholder={message_placeholder}
                onBlur={() =>
                  this.validation(["messageContactUs"])
                    .then()
                    .catch(e => {})
                }
                errorMessage={this.state.messageContactUsError}
                onChange={this.saveToState}
                value={messageContactUs}
              />
              <div className="btn-contactus-container columns">
                <TButton
                  ariaLabel="Save Contactus information"
                  text={save_button}
                  onPress={this.saveFeedback}
                  id="send-button"
                  type="submit"
                  className={`button grad-blue  mar-bot-25 column is-3-mobile is-3`}
                  loading={this.state.is_busy}
                />
              </div>
            </div>
          </div>
        </div>
      </Page>
    );
  }
}

export default connect(
  null,
  actions
)(ContactUs);
