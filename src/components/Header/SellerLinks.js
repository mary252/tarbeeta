import React, { Component } from "react";
import NotificationList from "../../components/NotificationList";
import { Alert } from "../../components/SVG";
import "./Header.css";
import { Link } from "react-router-dom";

class SellerLinks extends Component {
  navs = [
    {
      link: `shop/${this.props.shopUsername}`,
      text: this.props.translation.header.shop_link
    },
    {
      link: `wallet`,
      text: this.props.translation.header.wallet_link
    },
    {
      link: `orders`,
      text: this.props.translation.orders_link
    },
    // {
    //   link: `notifications`,
    //   text: this.props.translation.header.notifications_link
    // },
    {
      link: `settings`,
      text: this.props.translation.header.account_link
    }
  ];

  renderLinks = () =>
    this.navs.map(item => (
      <Link className="nav-link-seller" to={`/${this.props.lang}/${item.link}`}>
        {item.text}
        {window.location.href.includes(item.link) && (
          <div className="nav-indicator" />
        )}
      </Link>
    ));
  render() {
    const {
      props: {
        translation,
        lang,
        showNotification,
        toggleNotification,
        numberOfNotiUnseen,
        isLoggedIn,
        shopUsername
      }
    } = this;

    return (
      <div className="columns is-mobile">
        <div className="column is-2-desktop is-hidden-touch is-hidden-mobile" />
        <div className="column is-10-desktop is-hidden-touch is-flex aic jce no-pad-right seller-links-head">
          {this.renderLinks()}

          <Link
            // to="javascript:void(0)"
            onClick={this.props.signout}
          >
            {this.props.translation.header.signout_link}
          </Link>
          {/* <Link to={`${this.props.location}?mode=buyer`} className={`red mar-${this.props.locale == "ar" ? `left`: `right`}-43`}>{this.props.translation.switch_to_buyer_link}</Link> */}
          <Link
            // to="javascript:void(0)"
            onClick={this.props.toggle}
            className={`red mar-${
              this.props.locale == "ar" ? `left` : `right`
            }-43`}
          >
            {this.props.translation.header.switch_to_buyer_link}
          </Link>

          {/* {isLoggedIn ? (
            <div
              onClick={toggleNotification}
              href="#"
              className={`icon mar-${lang === "ar" ? `left` : `right`}-30 `}
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
        </div>
      </div>
    );
  }
}

export default (SellerLinks);
