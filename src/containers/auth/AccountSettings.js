import React, { Component } from "react";

import {
  Page,
  BreadCrumb,
  TextInput,
  TButton,
  AddressTable
} from "../../components";

import { updateAccountInfo, fetchInfo } from "../../services";
import { connect } from "react-redux";
import * as actions from "../../actions";
import { validate } from "../../ultils/validate/validation";

import CustomCloseBtn from "../../containers/Shop/CustomCloseBtn";

import {
  FACEBOOK_CHAT_POPUP_THEME_COLOR,
  FACEBOOK_APP_ID,
  FACEBOOK_PAGE_ID
} from "../../common";
import MessengerCustomerChat from "react-messenger-customer-chat";

import { uploadPic } from "../../services";

const mapStateToProps = state => {
  const {
    user: { address }
  } = state;

  return {
    address
  };
};

export class AccountSettings extends Component {
  state = {
    is_busy: false,
    firstnameError: "",
    lastnameError: "",
    mobileError: "",
    firstname: "",
    lastname: "",
    mobile: "",
    email: "",
    avatar: "",
    avatarPreview: ""
  };

  async componentDidMount() {
    let langId = this.props.lang_id;

    await this.fetchInfo(langId);
  }

  fetchInfo = async langId => {
    try {
      let res = await fetchInfo(langId);

      this.setState({
        firstname: res.data.firstname,
        lastname: res.data.lastname,
        mobile: res.data.mobile,
        email: res.data.email,
        avatar: res.data.avatar,
        avatarPreview: res.data.avatar
      });
    } catch (e) {}
  };

  toggle_busy = () => this.setState({ is_busy: !this.state.is_busy });

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
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

  removeAvatar = () => this.setState({ avatar: "", avatarPreview: "" });

  saveChanges = async () => {
    this.validation(["firstname", "lastname", "mobile"])
      .then(async () => {
        this.setState({
          is_busy: true
        });
        const { firstname, lastname, mobile, avatar } = this.state;
        let langId = this.props.lang_id;

        let data = new FormData();

        data.append("firstname", firstname);
        data.append("lastname", lastname);
        data.append("mobile", mobile.toString());
        data.append("avatar", avatar);

        try {
          let res = await updateAccountInfo(data, langId);
          this.props.init_notification({
            type: "success",
            title: this.props.locale.success,
            message: this.props.locale.email_verification
              .account_settings_updated_message
          });
          this.setState({
            is_busy: false
          });
          setTimeout(() => {
            window.location.reload();
          }, 2000);
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

  delAddress = addressId => {
    this.props.deleteAddress(addressId);
  };

  updateAddress = data => {
    this.props.addNewAddress(data);
  };

  changeAvatar = e => {
    this.setState({
      avatar: e.target.files[0]
    });
    uploadPic(e, avatar => {
      this.setState({
        avatarPreview: avatar
      });
    });
  };

  render() {
    const {
      state: { is_busy, avatar, avatarPreview },
      props: { locale, lang }
    } = this;
    return (
      <Page
        title={locale.account_settings_link}
        description={locale.account_settings_desc}
        {...this.props}
      >
        <div className="section">
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
            <BreadCrumb
              history={[
                {
                  name: locale.tarbeeta,
                  href: `/${this.props.lang}`
                }
              ]}
              activeRoute={locale.account_settings_link}
            />

            <h1 className="page-title mar-bot-30">
              {locale.account_settings_link}
            </h1>
            <section className="white-box mar-bot-15">
              <div className="columns is-mobile is-flex is-vcentered">
                <div className="column is-2-desktop is-5-mobile is-2-tablet">
                  <div className="settings-avatar">
                    <div
                      className="shop-avatar is-flex aic jcc"
                      style={{
                        background:
                          avatar !== ""
                            ? `url(${avatarPreview}) no-repeat`
                            : null
                      }}
                    >
                      {avatar == "" && (
                        <img
                          alt="icon"
                          src={require("../../assets/images/image-file-icon.svg")}
                        />
                      )}

                      {avatar == null && (
                        <img
                          alt="icon"
                          src={require("../../assets/images/image-file-icon.svg")}
                        />
                      )}
                    </div>
                    <CustomCloseBtn
                      onClick={this.removeAvatar}
                      isVisible={avatar}
                    />
                  </div>
                </div>
                <div className="column is-4-desktop is-7-mobile is-4-tablet">
                  <div className="columns is-mobile">
                    <div className="column is-7-desktop is-12-mobile">
                      <TButton
                        text={locale.choose_picture_placeholder}
                        className="blue outline"
                        id={"avatar-button"}
                        name="avatar"
                        onPress={() => this.refs.changeAvatar.click()}
                        ariaLabel="Upload shop Photo"
                      />
                      <input
                        onChange={e => this.changeAvatar(e)}
                        type="file"
                        ref="changeAvatar"
                        className="is-hidden"
                        accept="image/*"
                      />
                    </div>
                  </div>
                  <p>{locale.shop_avatar_helper_p}</p>
                </div>
                <div className="column is-6" />
              </div>

              <div className="columns is-mobile">
                <div className="column is-3-desktop is-12-mobile">
                  <TextInput
                    placeholder={locale.firstname}
                    onChange={e => this.onChange(e)}
                    name="firstname"
                    type="text"
                    id="firstname-input"
                    divClassName="mar-bot-15"
                    errorMessage={this.state.firstnameError}
                    onBlur={() =>
                      this.validation(["firstname"])
                        .then()
                        .catch(e => {})
                    }
                    value={this.state.firstname}
                    onKeyPress={e => {
                      if (e.key === "Enter") {
                        this.saveChanges();
                      }
                    }}
                  />
                  <TextInput
                    placeholder={locale.lastname}
                    onChange={e => this.onChange(e)}
                    name="lastname"
                    type="text"
                    id="lastname-input"
                    divClassName="mar-bot-15"
                    errorMessage={this.state.lastnameError}
                    onBlur={() =>
                      this.validation(["lastname"])
                        .then()
                        .catch(e => {})
                    }
                    value={this.state.lastname}
                    onKeyPress={e => {
                      if (e.key === "Enter") {
                        this.saveChanges();
                      }
                    }}
                  />
                  <TextInput
                    placeholder={locale.email_placeholder}
                    onChange={e => this.onChange(e)}
                    name="email"
                    type="text"
                    id="email-input"
                    divClassName="mar-bot-15"
                    value={this.state.email}
                    disabled={true}
                    onKeyPress={e => {
                      if (e.key === "Enter") {
                        this.saveChanges();
                      }
                    }}
                  />
                  <TextInput
                    placeholder={locale.mobile}
                    onChange={e => this.onChange(e)}
                    name="mobile"
                    type="number"
                    id="mobile-input"
                    divClassName="mar-bot-20"
                    errorMessage={this.state.mobileError}
                    onBlur={() =>
                      this.validation(["mobile"])
                        .then()
                        .catch(e => {})
                    }
                    value={this.state.mobile}
                    onKeyPress={e => {
                      if (e.key === "Enter") {
                        this.saveChanges();
                      }
                    }}
                  />
                </div>
                <div className="column is-9 is-hidden-mobile" />
              </div>
              <div className="level">
                <div className="level-left">
                  <a className="blue med" href={`/${this.props.lang}/password`}>
                    {locale.auth.account_settings.change_password_link}
                  </a>
                </div>
                <div className="level-right">
                  <TButton
                    ariaLabel="Save"
                    text={locale.shop_addresses_table_save}
                    className="button grad-blue full"
                    onPress={this.saveChanges}
                    loading={is_busy}
                    id="savechanges-button"
                  />
                </div>
              </div>
            </section>
            <AddressTable
              addNewAddress={this.updateAddress}
              locale={locale}
              lang={lang}
              // withEditLink
              address={this.props.address}
              delAddress={this.delAddress}
            />
          </div>
        </div>
      </Page>
    );
  }
}

export default connect(
  mapStateToProps,
  actions
)(AccountSettings);
