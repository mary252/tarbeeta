import React, { Component } from "react";
import { isLoggedIn } from "../ultils/auth";
import { Redirect } from "react-router-dom";
import {
  TextInput,
  TextBox,
  Checkbox,
  TButton,
  Notification,
  VerificationPopup,
  AddressTable
} from "../components";

import Dropzone from "react-dropzone";
import { getShopId } from "../ultils/main";
import MessengerCustomerChat from 'react-messenger-customer-chat';
import { FACEBOOK_CHAT_POPUP_THEME_COLOR, FACEBOOK_APP_ID, FACEBOOK_PAGE_ID } from "../common";
import CustomCloseBtn from "../containers/Shop/CustomCloseBtn";

export class ShopForm extends Component {
  state = {
    loggedin: false,
    is_busy: false,
    isError: false,
    redirect: false,
    agreeTerms: true
  };

  copyLink = () => {
    if (this.state.username !== "") {
      navigator.clipboard.writeText(
        `https://www.tarbeeta.com/${this.props.lang}/${this.props.username}`
      );
      this.props.init_notification({
        type: "success",
        title: this.props.locale.success,
        message: this.props.locale.copied_msg
      });
    } else {
      navigator.clipboard.writeText(``);
    }
  };


  toggle_busy = () => this.setState({ is_busy: !this.state.is_busy });
  componentWillMount() {
    if (getShopId())
      this.props.history.push(`/${this.props.lang}/shop/edit`);
    if (isLoggedIn()) {
      this.setState({
        loggedin: true
      });
    }
  }

  VerificationPopup = null;
  openPopUp = () => this.VerificationPopup.toggle();


  render() {
    if (!this.state.loggedin) {
      let path = this..location.pathname;
      let redirect = path.substring("4");
      return <Redirect to={`/${this.props.lang}/login?src=${redirect}`} />;
    }
    if (this.state.redirect) {
      return <Redirect to={`/${this.props.lang}/mobile`} />;
    }
    const {
      state: { agreeTerms },
      props: {
            startShop,
            editShop,
            mobile_verified,
            verified,
            startYourShop,
            onChange,
            validation,
            nameError,
            usernameError,
            onDrop,
            changeAvatar,
            avatarPreview,
            avatar,
            cover,
            coverPreview,
            is_busy,
            message,
            isError,
            locale,
            username,
            bio,
            name,
            address,
            openPopUp,
            updateAddress,
            editYourShop,
            removeCover,
            onClose,
            delAddress,
            mobile,
            mobileError
        }
    } = this;

    return (
      <div>
        <Notification message={message} isError={isError} onClose={onClose} />

        <div>
            <MessengerCustomerChat
              pageId={FACEBOOK_PAGE_ID}
              appId={FACEBOOK_APP_ID}
              greeting_dialog_display="hide"
              themeColor={FACEBOOK_CHAT_POPUP_THEME_COLOR}
              language={this.props.lang == "en" ? "en_US" : "ar_AR"}
              greetingDialogDelay={0}
              minimized={true}
              shouldShowDialog={false}
              loggedInGreeting={this.props.locale.facebook_chat_greeting_message}
              loggedOutGreeting={this.props.locale.facebook_chat_greeting_message}
            />
        </div>

        <VerificationPopup
          ref={a => (this.VerificationPopup = a)}
          lang={this.props.lang}
          translation={this.props.locale}
          code={1}
        />

        <div className="section">
          <div className="container">
            <h3 className="page-title mar-bot-40">
              {startShop
                ? locale.shop_containers.start_shop_page_title
                : locale.shop_containers.edit_shop_page_title}
            </h3>
            <section className="white-box">
              <div className="columns">
                <div className="column is-5">
                  <div className="columns is-mobile is-flex is-vcentered">
                    <div className="column is-4-desktop is-4-mobile is-4-tablet">
                      <div
                        className="shop-avatar is-flex aic jcc"
                        style={{
                          

                          // background: startShop
                          //   ? avatar !== ""
                          //     ? `url(${avatarPreview}) no-repeat`
                          //     : null
                          //   : avatarPreview == ""
                          //   ? `url(${avatar}) no-repeat`
                          //   : `url(${avatarPreview})`

                          background: 
                             avatar !== ""
                              ? `url(${avatarPreview}) no-repeat`
                              : null

                              
                          // backgroundSize: avatar !== "" ? "contain" : "unset"
                        }}
                      >
                        {avatar == "" && (
                          <img
                            alt="icon"
                            src={require("../assets/images/image-file-icon.svg")}
                          />
                        )}

                        {avatar == null && (
                          <img
                            alt="icon"
                            src={require("../assets/images/image-file-icon.svg")}
                          />
                        )}
                      </div>
                    </div>
                    <div className="column is-8-desktop is-7-mobile is-8-tablet">
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
                            onChange={e => changeAvatar(e)}
                            type="file"
                            ref="changeAvatar"
                            className="is-hidden"
                          />
                        </div>
                      </div>
                      <p>{locale.shop_containers.shop_avatar_helper_p}</p>
                    </div>
                  </div>
                  <div className="columns" style={{ marginBottom: 0 }}>
                    <div className="column is-half">
                      <TextInput
                        placeholder={locale.shop_containers.shop_name_input_placeholder}
                        id={"name-input"}
                        onChange={e => onChange(e)}
                        name="name"
                        type="text"
                        errorMessage={nameError}
                        onBlur={() =>
                          validation(["name"])
                            .then()
                            .catch(e => {})
                        }
                        value={name}
                      />
                    </div>
                    <div className="column is-half">
                      <TextInput
                        placeholder={locale.shop_containers.shop_phone_placeholder}
                        id={"mobile"}
                        onChange={e => onChange(e)}
                        name="mobile"
                        type="text"
                        errorMessage={mobileError}
                        onBlur={() =>
                          validation(["mobile"])
                            .then()
                            .catch(e => {})
                        }
                        value={mobile}
                      />
                    </div>
                  </div>
                  <TextBox
                    placeholder={locale.shop_containers.shop_bio_placeholder}
                    rows="5"
                    id={"bio-input"}
                    custclass={`mar-bot-15`}
                    onChange={e => onChange(e)}
                    name="bio"
                    maxLength={160}
                    value={bio}
                  />
                  {/* <div className="columns" style={{ marginBottom: 0 }}>
                    <div className="column is-6">
                      <TextInput
                        placeholder={locale.shop_phone_placeholder}
                        id={"shop-phone"}
                        onChange={e => onChange(e)}
                        name="shop-phone"
                        type="text"
                        errorMessage={nameError}
                        onBlur={() =>
                          validation(["shop-phone"])
                            .then()
                            .catch(e => {})
                        }
                        value={shop_phone}
                      />
                    </div>
                  </div> */}
                  <div
                    className={`columns is-flex is-vcentered is-mobile is-multiline ${
                      this.props.lang == "ar" ? "rtl" : ""
                    }`}
                  >
                    <div className="column is-5-desktop is-12-mobile">
                      <p className={this.props.lang == "ar" ? "ltr is-flex jce" : ""}>https://www.tarbeeta.com/</p>
                    </div>
                    <div className="column is-4-desktop is-8-mobile">
                      <TextInput
                        placeholder={locale.shop_containers.shop_url_username_placeholder}
                        onChange={e => onChange(e)}
                        name="username"
                        value={username}
                        id="username"
                        type="text"
                        ref={textarea => (this.textArea = textarea)}
                        errorMessage={usernameError}
                        onBlur={() =>
                          validation(["username"])
                            .then()
                            .catch(e => {})
                        }
                      />
                    </div>
                    <div className="column is-3-desktop is-4-mobile">
                      <a
                        onClick={this.copyLink}
                        className="blue med"
                        href="javascript:void(0)"
                      >
                        {locale.shop_containers.shop_copy_link}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="column is-1 is-hidden-mobile" />
                <div className="column is-6">
                  <div
                    className="shop-cover"
                    style={{
                      


                        // background: startShop
                        // ? cover !== ""
                        //   ? `url(${coverPreview}) no-repeat`
                        //   : null
                        // : coverPreview === ""
                        // ? `url(${cover}) no-repeat`
                        // : `url(${coverPreview})`,


                        background: 
                         cover !== ""
                          ? `url(${coverPreview}) no-repeat`
                          : null


                      
                        
                      // border: cover != "" ? "none" : null
                    }}
                  >
                    <Dropzone
                      id="dropzone"
                      name="dropzone"
                      getFilesFromEvent={e => onDrop(e)}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <section className="drop-zone">
                          <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            {cover == "" && (
                              <div className="drop-zone-content">
                                <div className="is-flex aic mar-bot-10">
                                  <img
                                    alt="icon"
                                    className="mar-right-20"
                                    src={require("../assets/images/image-file-icon.svg")}
                                  />
                                  <img
                                    alt="icon"
                                    src={require("../assets/images/drag-file-icon.svg")}
                                  />
                                </div>
                                <p>{locale.shop_containers.shop_drop_zone_helper_p}</p>
                              </div>
                            )}

                            {cover == null && (
                              <div className="drop-zone-content">
                                <div className="is-flex aic mar-bot-10">
                                  <img
                                    alt="icon"
                                    className="mar-right-20"
                                    src={require("../assets/images/image-file-icon.svg")}
                                  />
                                  <img
                                    alt="icon"
                                    src={require("../assets/images/drag-file-icon.svg")}
                                  />
                                </div>
                                <p>{locale.shop_containers.shop_drop_zone_helper_p}</p>
                              </div>
                            )}
                            <p />
                          </div>
                        </section>
                      )}
                    </Dropzone>
                    <CustomCloseBtn onClick={removeCover} isVisible={cover} />
                  </div>
                  <div className="columns is-flex is-vcentered is-mobile is-multiline">
                    <div className="column is-4-desktop is-8-mobile">
                      <div className="choose-cover">
                        <TButton
                          text={locale.choose_picture_placeholder}
                          className="blue outline"
                          id={"cover-button"}
                          name="cover"
                          onPress={() => this.refs.changeCover.click()}
                          ariaLabel="Upload Cover Photo"
                        />
                        <input
                          onChange={e => onDrop(e)}
                          type="file"
                          ref="changeCover"
                          className="is-hidden"
                        />
                      </div>
                    </div>
                    <div className="column is-6-desktop is-12-mobile">
                      <p>{locale.shop_containers.shop_cover_helper_p}</p>
                    </div>
                  </div>
                  {startShop && (
                    <label className="is-flex aic mar-bot-20">
                      <Checkbox
                        ischecked={agreeTerms}
                        onClick={() => {
                          this.setState({
                            agreeTerms: !agreeTerms
                          });
                        }}
                      />
                      <span className="checkbox-text">
                        {locale.shop_containers.shop_checkbox_agreement_text}{" "}
                        <a className="blue" href="#">
                          {locale.shop_checkbox_terms}
                        </a>
                      </span>
                    </label>
                  )}

                  <div className="columns is-mobile">
                    <div className="column is-4-desktop" />
                    <div className="column is-4-desktop">
                      <TButton
                        text={locale.cancel}
                        className="red outline full"
                        onPress={() => this.props.history.goBack()}
                        ariaLabel="Cancel"
                      />
                    </div>
                    <div className="column is-4-desktop">
                      <TButton
                        text={
                          startShop
                            ? locale.shop_containers.start_shop_addresses_table_start
                            : locale.shop_addresses_table_save
                        }
                        // className={`grad-blue full button ${!mobile_verified ? "tooltip" : ""}`}
                        className={`grad-blue full button`}
                        // tip={locale.plz_verify}
                        loading={is_busy}
                        onPress={startShop ? startYourShop : editYourShop}
                        id={"shopForm-button"}
                        name="shopForm"
                        disabled={!this.state.agreeTerms}
                        ariaLabel="submit"
                      />
                    </div>
                  </div>

                  {/* <div className="mar-bot-15">
                    <ReCAPTCHA
                      sitekey={google_capcha}
                      onChange={this.verify_robot}
                    />
                  </div> */}
                </div>
              </div>
            </section>
            {editShop && (
              <AddressTable
                locale={locale}
                withEditLink
                address={address}
                delAddress={delAddress}
                addNewAddress={updateAddress}
                lang={this.props.lang}
                lang_id={this.props.lang_id}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default ShopForm;
