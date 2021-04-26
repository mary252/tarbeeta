import React, { Component } from "react";
import "./Header.css";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import * as actions from "../../actions";
import Autocomplete from "../../components/Autocomplete";
import NotificationList from "../../components/NotificationList";
import { Alert } from "../../components/SVG";
const mapStateToProps = state => {
  return {
    cartCount: state.global.cartCount,
    numberOfNotiUnseen: state.userNotifications.numberOfNotiUnseen
  };
};

class BuyerLinks extends Component {
  state = {};
  componentDidMount() {
    this.props.getNumberOfcart();
  }

  render() {
    const {
      props: {
        translation,
        isLoggedIn,
        cartCount,
        getSuggestions,
        suggestions,
        startSearch,
        initialText,
        lang,
        closeOverLay,
        showNotification,
        toggleNotification,
        numberOfNotiUnseen
      }
    } = this;
    return (
      <div className="columns is-mobile">
        <div className="column is-7-desktop is-hidden-touch is-flex aic jce">
          <Autocomplete
            locale={translation}
            getSuggestions={getSuggestions}
            suggestions={suggestions}
            onClick={startSearch}
            initialText={initialText}
            lang={lang}
            closeOverLay={closeOverLay}
          />
        </div>

        <div className="column is-5-desktop is-hidden-touch is-flex aic jce">
          {/* <a href="#">{translation.news_feed_link}</a> */}
          {/* <a href="#">{translation.discover_link}</a> */}
          {/* {isLoggedIn ? (
            <div
              onClick={toggleNotification}
              href="#"
              className={`icon mar-${
                this.props.lang === "ar" ? `left` : `right`
              }-30 `}
            >
              <div
                className={`notification-dot  ${
                  numberOfNotiUnseen ? "badge1" : ""
                }`}
                data-badge={numberOfNotiUnseen}
              >
                <Alert fill={showNotification ? "#4a90e2" : "#444444"} />
                {showNotification && <div className="oval" />}
              </div>
              {showNotification && (
                <NotificationList
                  locale={translation}
                  notifications={this.props.notifications}
                  lang={lang}
                />
              )}
            </div>
          ) : null} */}

          <Link
            to={`/${this.props.lang}/cart`}
            className={`icon ${cartCount ? "badge1" : ""}`}
            data-badge={cartCount}
          >
            <img
              src={require("../../assets/images/cart.svg")}
              height="20"
              alt="..."
            />
          </Link>

          {isLoggedIn ? null : (
            <div>
              <a href={`/${this.props.lang}/login`}>
                {translation.header.signin_link}
              </a>
              <a href={`/${this.props.lang}/quick-register`} className="mar-right-0">
                {translation.header.signup_link}
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  actions
)(BuyerLinks);
