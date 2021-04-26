import React, { Component } from "react";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect } from "react-redux";
import { Link, Redirect, withRouter } from "react-router-dom";
import {
  TextInput,
  TButton,
  Modal,
  Autocomplete,
  ProductDetailsPopUp,
  AddToCartPopUp,
  CustomNotification
} from "../index";
import * as actions from "../../actions";
import CategoryNav from "./CategoryNav";
import SellerLinks from "./SellerLinks";
import BuyerLinks from "./BuyerLinks";
import BuyerPanel from "./BuyerPanel";
import Drawer from "./Drawer";
import { isLoggedIn } from "../../ultils/auth";
import {
  verifyEmail,
  fetchInfo,
  verifyMobile,
  getQueryStringValue,
  sendVerificationEmail,
  sendMobileConfirmationCode,
  fetchSuggestions
} from "../../services";
import { getViewMode, changeLang, validate } from "../../ultils";

import "./Header.css";
const mapStateToProps = state => {
  const {
    user: {
      avatar,
      firstname,
      address,
      notification,
      wallet,
      verified,
      mobile_verified,
      mobile,
      shop_id,
      numberOfNotiUnseen,
      shop_username,
      shop_name
    },
    departments: { all },
    global: { cartCount, isOpen, product, isFetching, colId },
    userNotifications,
    cartPopUp
  } = state;
  return {
    avatar,
    firstname,
    address,
    departments: all,
    notification,
    cartCount: cartCount,
    wallet,
    verified,
    mobile_verified,
    mobile,
    isOpen,
    product,
    isFetching,
    allNotifications: userNotifications.data,
    numberOfNotiUnseen,
    shop_id,
    shop_username,
    shop_name,
    cartPopUp,
    colId
  };
};

class Header extends Component {
  constructor(props) {
    super(props);
    //put this in here because the ref is null in componentDidMount !!!

    this.setHeaderRef = element => {
      //fallback value for stickyTop because element some time be null
      let stickyTop = 70;
      if (element) {
        stickyTop = element.getBoundingClientRect().top;
      }

      if (this.state.loading == false) {
        document.addEventListener("scroll", () => this.handleScrool(stickyTop));
      }
    };
  }

  handleScrool = stickyTop => {
    window.scrollY >= stickyTop
      ? this.setState({ isSticky: true })
      : this.setState({ isSticky: false });

    if (window.scrollY < 30) {
      this.setState({ isSticky: false });
    }
  };

  is_logged_in = false;
  modal = null;

  state = {
    drawer_active: false,
    popup_visible: true,
    notification_visible: false,
    email_verification_code: null,
    is_loading: false,
    verified: null,
    is_busy: false,
    isVerifyMobile: true,
    view_mode: null,
    txt: "",
    suggestions: [],
    is_sending: false,
    is_sending_email: false,
    loading: false,
    mobile_verified: null,
    isSticky: false,
    isMobile: false,
    email_verification_codeError: "",
    showNotification: false
  };

  AddToCartPopUp = null;
  openAddToCartPopUp = () => {
    this.AddToCartPopUp.toggle();
  };

  isMobileDevice = () => {
    return (
      typeof window.orientation !== "undefined" ||
      navigator.userAgent.indexOf("IEMobile") !== -1
    );
  };

  toggleNotification = () => {
    this.setState(state => ({ showNotification: !state.showNotification }));
    this.iSeeNotification();
  };

  iSeeNotification = () => {
    this.props.markNotiSeen();
  };

  closeOverLay = () => this.setState({ suggestions: [] });

  getSuggestions = async txt => {
    try {
      let langId = this.props.lang_id;
      let res = await fetchSuggestions(txt, langId),
        suggestions = res.data;
      this.setState({ suggestions });
    } catch (e) {}
  };

  store_data = (event, input) => {
    this.setState({
      [input]: event.target.value
    });
  };

  sign_out = () => {
    // localStorage.removeItem("access_token");
    let keysToRemove = [
      "access_token",
      "shop_id",
      "shop_username",
      "address_id",
      "view_mode"
    ];

    keysToRemove.forEach(k => localStorage.removeItem(k));

    // this.props.getNumberOfcart();
    window.location.href = `/${this.props.lang}/login`;
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

  verify_email = async () => {
    this.validation(["email_verification_code"])
      .then(() => {
        this.setState({
          is_busy: true
        });
        let langId = this.props.lang_id;
        const { isVerifyMobile, email_verification_code } = this.state;
        let func = isVerifyMobile
          ? verifyMobile({ code: email_verification_code }, langId)
          : verifyEmail({ code: email_verification_code }, langId);
        func
          .then(response => {
            if (response.status) {
              this.props.init_notification({
                type: "success",
                title: this.props.locale.success,
                message: this.props.locale.email_verification.success_message
              });
              window.location.reload();
            }
          })
          .catch(err => {
            this.setState({
              error_msg: err.data ? err.data.message : "",
              is_busy: false
            });
          });
      })
      .catch(formErrors => {});
  };

  send_verification_email = async code => {
    try {
      if (code == 1) {
        this.setState({ is_sending: true });
        await sendMobileConfirmationCode();
        this.setState({ is_sending: false });
      } else {
        this.setState({ is_sending_email: true });
        await sendVerificationEmail();
        this.setState({ is_sending_email: false });
      }
    } catch (e) {
      if (this.props.mobile == null) {
        this.setState({
          redirect: true
        });
      }

      this.setState({
        error_msg: e.data ? e.data.message : "",
        is_sending: false
      });
    }
  };

  componentDidMount = async () => {
    this.setState(() => ({
      isMobile: this.isMobileDevice(),
      loading: true
    }));

    let langId = this.props.lang_id;
    let query = this.props.location.search;
    let txt = getQueryStringValue(query, "k");
    this.setState(() => ({ txt }));
    if (isLoggedIn()) {
      let userInfo = await fetchInfo(langId);
      let { verified, mobile_verified, email } = userInfo.data;
      // if (verified || mobile_verified) {
      this.setState({
        verified,
        mobile_verified,
        email
      });
      // }
    }

    const { getDepartment, loadInfo, shop_id, getNotification } = this.props;
    // Check if user is logged in ..
    if (localStorage.getItem("access_token")) {
      this.is_logged_in = true;
      this.setState({
        view_mode: getViewMode()
      });
    }

    if (undefined !== this.props.query) {
      let query = this.props.query;

      query = query.replace("?", "");
      var vars = query.split("&");
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        let mode = "buyer";
        if (decodeURIComponent(pair[0]) == "mode" && this.is_logged_in) {
          mode =
            pair[1] === "seller" ? (shop_id ? "seller" : "buyer") : "buyer";
        }
      }
    }

    getDepartment(langId);
    if (isLoggedIn()) {
      loadInfo(langId);
      // getNotification();
    }
    this.setState({ loading: false });
  };

  toggle = code => {
    if (code == 1 && !this.props.mobile) {
      return (window.location.href = `/${this.props.lang}/mobile`);
    }
    this.setState({ isVerifyMobile: code == 1 });
    this.modal.toggle();
  };

  toggle_view = () => {
    let mode = this.state.view_mode === "seller" ? "buyer" : "seller";
    this.setState({
      view_mode: mode
    });
    localStorage.setItem("view_mode", mode);
  };

  toggle_drawer = e => {
    this.setState({
      drawer_active: !this.state.drawer_active
    });
  };

  startSearch = txt => {
    // window.location.href = `/${this.props.lang}/search?k=${txt}`;
    window.location.replace(`/${this.props.lang}/search?k=${txt}`);
  };
  togglePopUP = () => this.props.TogglePopup(null);
  getNumberOfcart = cart_id => this.props.getNumberOfcart(cart_id);

  showNotification = (type, e) => {
    type === "success"
      ? this.props.init_notification({
          type: "success",
          title: this.props.locale.success,
          message: this.props.locale.product_added_message,
          link_text: this.props.locale.view_cart,
          link: `/${this.props.lang}/cart`
        })
      : this.props.init_notification({
          type: "error",
          title: this.props.locale.error,
          message: e.data ? e.data.message : this.props.locale.error_message
        });
  };

  render() {
    if (this.state.isSticky) {
      if (isLoggedIn()) {
        if (this.state.verified && this.state.mobile_verified) {
          window.document.body.style.marginTop = "180px";

          this.state.isMobile &&
            (window.document.body.style.marginTop = "160px");
        } else {
          window.document.body.style.marginTop = "210px";

          this.state.isMobile &&
            (window.document.body.style.marginTop = "160px");
        }
      } else {
        window.document.body.style.marginTop = "180px";

        this.state.isMobile && (window.document.body.style.marginTop = "160px");
      }

      // window.document.body.style.paddingTop = '210px';
    } else {
      window.document.body.style.marginTop = 0;
    }

    if (this.state.redirect) {
      return <Redirect from="/" to={`/${this.props.lang}/mobile`} />;
    }

    const {
      state: { is_busy, isVerifyMobile, isSticky },
      toggle,
      props: { cartCount, shop_id, shop_username, shop_name }
    } = this;
    return (
      <header>
        {/* {Boolean(this.state.suggestions.length) && (
          <div className="over-lay" onClick={this.closeOverLay} />
        )} */}
        <CustomNotification notification={this.props.notification} />

        <ProductDetailsPopUp
          showNotification={this.showNotification}
          addToCartPopUp={this.props.addToCartPopUp}
          getNumberOfcart={this.getNumberOfcart}
          visible={this.props.isOpen}
          product={this.props.product}
          lang={this.props.lang}
          toggle={this.togglePopUP}
          loading={this.props.isFetching}
          colId={this.props.colId}
          locale={this.props.locale}
          openAddToCartPopUp={this.openAddToCartPopUp}
        />
        <AddToCartPopUp
          // openAddToCartPopUp={this.openAddToCartPopUp}
          cartPopUp={this.props.cartPopUp}
          ref={a => (this.AddToCartPopUp = a)}
          locale={this.props.locale}
          history={this.props.history}
          lang={this.props.lang}
          toggleProductDetailsPopUp={this.props.toggle}
        />
        {/* {this.props.location.toLowerCase() ==
          `/${this.props.match.params.lang}` ||
        this.props.location == "/" ||
        this.props.location.toLowerCase() ==
          `/${this.props.match.params.lang}/` ? (
          <div
            className="home-popup-overlay"
            style={{ display: this.state.popup_visible ? `flex` : `none` }}
          >
            <div className="wrap">
              <a
                className="close"
                onClick={() => {
                  this.setState({
                    popup_visible: false
                  });
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </a>
              <div
                className="img"
                style={{
                  backgroundImage: `url(${require("../../assets/images/eid-banner.jpg")})`
                }}
              />

              <h3>{this.props.locale.popup_title}</h3>
              <p>
                {this.props.locale.popup_paragraph} <strong>TDFree19</strong>
              </p>
            </div>
          </div>
        ) : null} */}
        {/* Mobile drawer */}
        {}
        <Drawer
          className={`${this.state.drawer_active ? `active` : ``}`}
          onClose={this.toggle_drawer}
          translation={this.props.locale}
          match={this.props.match}
          departments={this.props.departments}
          lang={this.props.lang}
          sign_out={this.sign_out}
          currentRoute={changeLang(this.props.location.pathname)}
          toggle={this.toggle_view}
          view_mode={this.state.view_mode}
          location={this.props.location}
          name={this.props.firstname}
          wallet={this.props.wallet}
          notification={this.props.numberOfNotiUnseen}
          iSeeNotification={this.iSeeNotification}
          shopUsername={this.props.shop_username}
          avatar={this.props.avatar}
        />
        {/* End of mobile drawer */}
        {/* Email verification popup */}
        <Modal ref={m => (this.modal = m)}>
          <div onClick={e => e.stopPropagation()} className="address-popup">
            <div className="address-popup-div">
              <p className="address-popup-header">
                {isVerifyMobile
                  ? this.props.locale.verify_mobile.title
                  : this.props.locale.email_verification.popup_title}
              </p>
              <div className="columns is-mobile">
                <TextInput
                  divClassName="confirm-input-div"
                  type="number"
                  onKeyUp={e => this.store_data(e, "email_verification_code")}
                  errorMessage={this.state.email_verification_codeError}
                  onBlur={() =>
                    this.validation(["email_verification_code"])
                      .then()
                      .catch(e => {})
                  }
                  onKeyPress={e => {
                    if (e.key === "Enter") {
                      this.verify_email();
                    }
                  }}
                  placeholder={
                    this.props.locale.email_verification.popup_input_placeholder
                  }
                />
              </div>

              <div className="columns is-mobile">
                <div className="column is-4">
                  <TButton
                    ariaLabel="Cancel"
                    text={this.props.locale.cancel}
                    onPress={this.toggle}
                    className="red outline full"
                  />
                </div>
                <div className="column is-2 " />
                <div className="column is-6">
                  <TButton
                    ariaLabel="Verify"
                    text={this.props.locale.email_verification.verify_button}
                    onPress={() => this.verify_email()}
                    className="grad-blue full button"
                    loading={is_busy}
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal>
        {/* End of email verification popup */}
        {this.state.mobile_verified == false &&
        isLoggedIn() &&
        !this.state.loading ? (
          <div className={`${isSticky ? "is-hidden" : ""}`}>
            <div className="warning-header is-flex aic jcc has-background-warning">
              <div className="container">
                <div className="level is-multiline">
                  <div className="level-left">
                    <div className="level-item">
                      <p>{this.props.locale.email_verification.paragraph}</p>
                    </div>
                  </div>

                  <div className="level-right">
                    {!this.state.mobile_verified && (
                      <React.Fragment>
                        <div className="level-item">
                          <TButton
                            ariaLabel="Send Verfication Email"
                            text={
                              this.props.locale.email_verification
                                .resend_button_mob
                            }
                            onPress={() => this.send_verification_email(1)}
                            type="submit"
                            className={`button is-text is-warning bg-transparent`}
                            loading={this.state.is_sending}
                          />
                        </div>

                        <div className="level-item">
                          <TButton
                            ariaLabel="Open popup"
                            text={
                              this.props.locale.email_verification
                                .verify_button_mobile
                            }
                            onPress={() => this.toggle(1)}
                            type="submit"
                            className={`button is-text is-warning bg-transparent`}
                            loading={this.state.is_loading}
                          />
                        </div>
                      </React.Fragment>
                    )}
                    {this.state.email && !this.state.verified && (
                      <React.Fragment>
                        {" "}
                        {/* <div className="level-item">
                          <TButton
                            ariaLabel="resend Verfication Code"
                            text={
                              this.props.locale.email_verification.resend_button
                            }
                            onPress={() => this.send_verification_email(2)}
                            type="submit"
                            className={`button is-text is-warning`}
                            loading={this.state.is_sending_email}
                          />
                        </div>
                        <div className="level-item">
                          <TButton
                            ariaLabel="Verify Email"
                            text={
                              this.props.locale.email_verification
                                .verify_button_email
                            }
                            onPress={() => this.toggle(2)}
                            type="submit"
                            className={`button is-text is-warning`}
                            // loading={this.state.is_sending}
                          />
                        </div> */}
                      </React.Fragment>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <div className={`top-bar ${isSticky ? "is-hidden" : "top-bar-block"}`}>
          <div className="section">
            <div className="container">
              <div className="columns is-vcentered">
                <div className="column is-5-desktop is-8-tablet is-flex">
                  {/* <a href="#" className="is-hidden-mobile">
                    {this.props.locale.restaurant_link}
                  </a>
                  <a href="#" className="is-hidden-mobile">
                    {this.props.locale.pos_link}
                  </a>
                  <a
                    href="javascript:void(0)"
                    onClick={() =>
                      this.props.init_notification({
                        type: "success",
                        title: "Success",
                        message: "Shop successfully created"
                      })
                    }
                    className="is-hidden-mobile"
                  >
                    {this.props.locale.delivery_link}
                  </a> */}
                  <h4 className="">
                    {this.props.locale.header.free_shipping_text}
                  </h4>
                  <h4 className="">
                    {this.props.locale.header.cash_on_delivery_text}
                  </h4>
                  <h4 className="">
                    {this.props.locale.header.money_back_text}
                  </h4>
                </div>

                <div className="column is-4-desktop is-hidden-tablet-only" />

                <div
                  className={`column is-2-desktop is-4-tablet is-hidden-mobile ${
                    this.props.lang == "ar" ? `has-text-left` : `has-text-right`
                  }`}
                >
                  {/* <div className="level"> */}
                  <div
                    className={`${this.props.lang == "ar" ? "is-flex " : ""}`}
                  >
                    {isLoggedIn() ? (
                      <React.Fragment>
                        {shop_id ? (
                          <a
                            href={`/${this.props.lang}/shop/${shop_username}`}
                            className="view-shop-text"
                          >
                            {this.props.locale.view_my_shop}
                          </a>
                        ) : (
                          <a href={`/${this.props.lang}/start`}>
                            {this.props.locale.header.sell_link}
                          </a>
                        )}

                        <Link
                          to={`/${this.props.lang}/login`}
                          onClick={this.sign_out}
                        >
                          {this.props.locale.header.signout_link}
                        </Link>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <Link to={`/${this.props.lang}/login`}>
                          {this.props.locale.header.signin_link}
                        </Link>
                        <Link to={`/${this.props.lang}/quick-register`}>
                          {this.props.locale.header.signup_link}
                        </Link>
                      </React.Fragment>
                    )}
                    <a
                      className="first"
                      href={`/${this.props.lang == "ar" ? "en" : "ar"}${
                        undefined !== changeLang(this.props.location.pathname)
                          ? `${changeLang(this.props.location.pathname)}`
                          : `/`
                      }`}
                    >
                      {this.props.lang === "ar" ? `English` : `عربى`}
                    </a>
                  </div>
                  {/* </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`sticky ${this.state.isSticky ? "fixed" : ""}`}
          // className={`sticky-header `}
          // style={{ top: this.state.header_top }}
          // ref={a => (this.stickyHeader = a)}
          ref={this.setHeaderRef}
        >
          <div
            className="section"
            style={{ backgroundColor: "#f9f9f9", marginBottom: "-1px" }}
          >
            <div className="container">
              {/* Links menu in the navigation bar */}
              <nav>
                <div className="columns is-vcentered is-mobile">
                  {/* Burger icon and logo for mobile and tablet */}
                  <div className="column is-hidden-desktop is-flex is-7-mobile is-3-tablet mobile-nav">
                    <button
                      className="burger"
                      onClick={this.toggle_drawer}
                      aria-label="Open Burger Menu"
                    >
                      <FontAwesomeIcon icon={faBars} />
                    </button>

                    <Link to={`/${this.props.lang}/`} className="logo">
                      {this.props.lang == "ar" ? (
                        <img
                          style={{ height: 29.7 }}
                          src={require("../../assets/images/new-logo-ar.svg")}
                          alt="log-ar"
                        />
                      ) : (
                        <img
                          src={require("../../assets/images/new-logo-en.svg")}
                          alt="logo"
                        />
                      )}
                    </Link>
                  </div>

                  {/* Cart and avatar for mobile */}
                  <div className="column is-hidden-desktop is-5-mobile is-flex mobile-panel">
                    <div
                      className={`is-flex mar-${
                        this.props.lang === "ar" ? `left` : `right`
                      }-25`}
                    >
                      <a
                        href={`${this.props.location}?mode=buyer`}
                        className="is-flex aic is-hidden-touch"
                        onClick={this.toggle_view}
                      >
                        Switch to buyer
                      </a>

                      {this.is_logged_in ? (
                        <Link
                          to={`/${this.props.lang}/cart`}
                          className={`${
                            this.props.lang == "ar"
                              ? `mar-left-0`
                              : `mar-right-0`
                          } ${cartCount ? "badge1" : ""}`}
                          data-badge={cartCount}
                        >
                          <img
                            src={require("../../assets/images/cart.svg")}
                            alt="cart"
                          />
                        </Link>
                      ) : null}
                    </div>

                    {/* <a
                      href="#"
                      className="thumb"
                      style={{
                        backgroundImage: `url(${
                          this.props.avatar ? this.props.avatar : defaultAvatar
                        })`
                      }}
                    /> */}

                    {isLoggedIn() ? (
                      <a
                        aria-label="Avatar"
                        href="#"
                        className={`thumb mar-${
                          this.props.lang == "ar" ? `left` : `right`
                        }-0`}
                        style={{
                          backgroundImage: `url(${
                            this.props.avatar == null
                              ? `https://i0.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png?fit=256%2C256&quality=100&ssl=1`
                              : this.props.avatar
                          })`
                        }}
                      />
                    ) : (
                      <div className={`is-flex aic`}>
                        <Link
                          to={`/${this.props.lang}/cart`}
                          className={`${
                            this.props.lang == "ar"
                              ? `mar-left-10`
                              : `mar-right-10`
                          } ${cartCount ? "badge1" : ""}`}
                          data-badge={cartCount}
                        >
                          <img
                            src={require("../../assets/images/cart.svg")}
                            alt="cart"
                          />
                        </Link>
                        <Link to={`/${this.props.lang}/login`}>
                          {this.props.locale.header.signin_link}
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Logo for desktop */}
                  <div className="column is-2-desktop is-hidden-touch">
                    <Link
                      to={`/${this.props.lang}/`}
                      className={`logo ${
                        this.props.lang == "ar" ? `jce` : `jcs`
                      } mar-right-0`}
                    >
                      {this.props.lang == "ar" ? (
                        <img
                          style={{ height: 29.7 }}
                          src={require("../../assets/images/new-logo-ar.svg")}
                          alt="logo-desktop"
                        />
                      ) : (
                        <img
                          src={require("../../assets/images/new-logo-en.svg")}
                          alt="logo-desktop"
                        />
                      )}
                    </Link>
                  </div>

                  {/* Navigation bar for seller and buyer respectively */}
                  <div
                    className={`column is-${
                      isLoggedIn() ? `9` : `10`
                    }-desktop is-hidden-touch`}
                  >
                    {this.state.view_mode === "seller" ? (
                      <SellerLinks
                        translation={this.props.locale}
                        signout={this.sign_out}
                        location={this.props.location}
                        toggle={this.toggle_view}
                        lang={this.props.lang}
                        isLoggedIn={isLoggedIn()}
                        // notifications={this.props.allNotifications.slice(0, 5)}
                        showNotification={this.state.showNotification}
                        toggleNotification={this.toggleNotification}
                        shopUsername={this.props.shop_username}
                      />
                    ) : (
                      <BuyerLinks
                        // notifications={this.props.allNotifications.slice(0, 5)}
                        showNotification={this.state.showNotification}
                        toggleNotification={this.toggleNotification}
                        isLoggedIn={isLoggedIn()}
                        translation={this.props.locale}
                        match={this.props.match}
                        getSuggestions={this.getSuggestions}
                        suggestions={this.state.suggestions}
                        startSearch={this.startSearch}
                        initialText={this.state.txt}
                        closeOverLay={this.closeOverLay}
                        lang={this.props.lang}
                      />
                    )}
                  </div>

                  {/* Logged in user avatar */}
                  {isLoggedIn() ? (
                    <div className="column is-1-desktop is-flex aic jce is-hidden-touch">
                      <div className="panel">
                        <a
                          aria-label="Avatar"
                          href="#"
                          className={`thumb mar-${
                            this.props.lang == "ar" ? `left` : `right`
                          }-0`}
                          style={{
                            backgroundImage: `url(${
                              this.props.avatar == null
                                ? `https://i0.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png?fit=256%2C256&quality=100&ssl=1`
                                : this.props.avatar
                            })`
                          }}
                        />
                        {this.state.view_mode === "buyer" ? (
                          <BuyerPanel
                            translation={this.props.locale}
                            signout={this.sign_out}
                            toggle={this.toggle_view}
                            viewmode={this.state.view_mode}
                            lang={this.props.lang}
                            shop_id={shop_id}
                          />
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </div>
              </nav>
            </div>
          </div>
          {this.state.view_mode === "seller" ? null : (
            <CategoryNav
              match={this.props.match}
              lang={this.props.lang}
              locale={this.props.locale}
              departments={this.props.departments}
            />
          )}
          <div className="mobile-search is-hidden-desktop-only is-hidden-tablet">
            <Autocomplete
              locale={this.props.locale}
              suggestions={this.state.suggestions}
              getSuggestions={this.getSuggestions}
              onClick={this.startSearch}
              initialText={this.state.txt}
              closeOverLay={this.closeOverLay}
            />
          </div>
        </div>

        {this.state.mobile_verified || !isLoggedIn() ? null : (
          <div className="section">
            <div className="verification-warning has-background-warning mar-bot-10">
              <div className="container">
                <p>{this.props.locale.email_verification.paragraph}</p>
                <div className="verification-buttons">
                  {/* <TButton
                    ariaLabel="Send Verfication Code"
                    text={this.props.locale.email_verification.resend_button}
                    onPress={() => this.send_verification_email()}
                    type="submit"
                    className={`button is-text is-warning`}
                    loading={this.state.is_sending}
                  />

                  <TButton
                    ariaLabel="Verify"
                    text={this.props.locale.email_verification.verify_button}
                    onPress={() => this.toggle()}
                    type="submit"
                    className={`button is-text is-warning`}
                    loading={this.state.is_loading}
                  /> */}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    );
  }
}

export default connect(
  mapStateToProps,
  actions
)(Header);
