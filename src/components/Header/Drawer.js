import React, { Component, Fragment } from "react";
import { TButton } from "../Form";
import "./Header.css";
import { isLoggedIn } from "../../ultils/auth";
import {
  fetchtDepartment,
  featchCategoryWithId,
  fetchSubCategory
} from "../../services";

import { Link } from "react-router-dom";

const arrowDown = require("../../assets/images/arrow-down.svg"),
  arrowUp = require("../../assets/images/arrow-up.svg");
class Drawer extends Component {
  state = {
    active: ["fashion"],
    activeCategory: [],
    categories: []
  };

  toggle_accordion = (department_id, department) => {
    this.getDepartments(department_id, department);
    if (this.state.active.indexOf(department_id) > -1) {
      this.setState({
        ...this.state,
        active: this.state.active.filter(
          (_, i) => i !== this.state.active.indexOf(department_id)
        )
      });
    } else {
      let newActive = this.state.active.slice();
      newActive.push(department_id);

      this.setState({
        ...this.state,
        active: newActive
      });
    }
  };

  getDepartments = (department_id, department) => {
    this.setState(() => {
      return {
        [`d_${department_id}`]: department.categories
      };
    });
  };

  getSubCategories = (category, department_id) => {
    let category_id = category.category_id,
      subcategoryKey = `c_${category_id}_${department_id}`;
    this.setState({
      [subcategoryKey]: category.subcategories
    });

    if (this.state.activeCategory.indexOf(subcategoryKey) > -1) {
      this.setState({
        ...this.state,
        activeCategory: this.state.activeCategory.filter(
          (subcategory, i) => subcategory !== subcategoryKey
        )
      });
    } else {
      let newActive = this.state.activeCategory.slice();
      newActive.push(subcategoryKey);

      this.setState({
        ...this.state,
        activeCategory: newActive
      });
    }
  };

  renderSubcategory = (department, category) => (
    <div
      className={`subs  no-pad${
        this.state.activeCategory.indexOf(
          `c_${category.category_id}_${department.department_id}`
        ) > -1
          ? ``
          : `shrink`
      }`}
    >
      {this.state[`c_${category.category_id}_${department.department_id}`] &&
        this.state.activeCategory.includes(
          `c_${category.category_id}_${department.department_id}`
        ) &&
        this.state[`c_${category.category_id}_${department.department_id}`].map(
          subcategory => (
            <a
              className="border-bottom-gray padd-10"
              href={`/${this.props.lang}/subcategory/${department.department_name}/${category.name}/${subcategory.subcategory_name}`}
            >
              {subcategory.subcategory_name}
            </a>
          )
        )}
    </div>
  );
  renderCategory = department => {
    const { lang } = this.props;
    return (
      <div
        className={`subs ${
          this.state.active.indexOf(department.department_id) > -1
            ? ``
            : `shrink`
        }`}
      >
        {this.state[`d_${department.department_id}`]
          ? this.state[`d_${department.department_id}`].map(category => {
              let isCategryActive =
                this.state.activeCategory.indexOf(
                  `c_${category.category_id}_${department.department_id}`
                ) > -1;
              return (
                <>
                  {/* <a href="#">{category.name}</a> */}
                  <a
                    className={`expandable no-background border-bottom-gray ${
                      lang == "ar" ? "expandable-ar" : ""
                    } ${isCategryActive ? `active` : ``}`}
                    aria-label="Toggle Category "
                    href={`/${lang}/search?k=${category.name}`}
                  >
                    {category.name}
                    <img
                      src={isCategryActive ? arrowUp : arrowDown}
                      alt=".."
                      className={`${
                        this.props.lang == "ar"
                          ? "icon-row-left"
                          : "icon-row-right"
                      }  ${isCategryActive ? `active` : ``}`}
                      style={{ "pointer-events": "all" }}
                      onClick={e => {
                        e.preventDefault();

                        this.getSubCategories(
                          category,
                          department.department_id
                        );
                      }}
                    />
                  </a>
                  {this.renderSubcategory(department, category)}
                </>
              );
            })
          : null}
      </div>
    );
  };

  renderDeparments = () => {
    let { departments, lang } = this.props;
    return departments.map((department, i) => {
      let isActive = this.state.active.indexOf(department.department_id) > -1;
      return (
        <>
          <a
            className={`expandable ${lang == "ar" ? "expandable-ar" : ""} `}
            aria-label="Toggle Departments "
            href={`/${lang}/search?k=${department.department_name}`}
          >
            {department.department_name}
            <img
              src={isActive ? arrowUp : arrowDown}
              alt=".."
              className={`${
                this.props.lang == "ar" ? "icon-row-left" : "icon-row-right"
              } ${isActive ? `active` : ``}`}
              style={{ "pointer-events": "all" }}
              onClick={e => {
                e.preventDefault();
                this.toggle_accordion(department.department_id, department);
              }}
            />
          </a>

          {this.renderCategory(department, isActive)}
        </>
      );
    });
  };

  render() {
    const {
      translation,
      departments,
      lang,
      sign_out,
      currentRoute,
      toggle,
      view_mode,
      shopUsername
    } = this.props;

    return (
      <div className={`drawer hidden-desktop ${this.props.className}`}>
        <div className={`wrap ${this.props.lang == "ar" ? "rtl" : ""}`}>
          <div className={`section`}>
            <button
              className={`borderless ${
                this.props.lang == "ar" ? "is-pulled-left" : "is-pulled-right"
              }`}
              onClick={this.props.onClose}
              style={{ zIndex: 1 }}
              aria-label="Close"
            >
              <img src={require("../../assets/images/close.svg")} alt="Close" />
            </button>

            {isLoggedIn() === null && (
              <Fragment>
                <TButton
                  ariaLabel="Go To Signin Page"
                  className="grad-blue mar-bot-20"
                  text={translation.header.signin_link}
                  onPress={() => {
                    window.location.href = "login";
                  }}
                />

                <p>
                  {translation.header.do_not_have_account_placeholder}{" "}
                  <Link to={`/${lang}/quick-register`}>
                    {translation.header.signup_link}
                  </Link>
                </p>
              </Fragment>
            )}
          </div>

          {/* {isLoggedIn() !== null && (
            <a className="red mar-bot-10" href="/start">
              <img src={require("../../assets/images/price-tag.svg")} />
              {translation.start_your_shop_link}
            </a>
          )} */}

          {isLoggedIn() ? (
            <div
              className={`drawer-avatar is-flex aic ${
                lang == "ar" ? "ltr" : ""
              } mar-bot-20`}
            >
              <a
                aria-label="Avatar"
                href="#"
                className={`thumb mar-${
                  lang == "ar" ? `left` : `right`
                }-15 mar-bot-0`}
                style={{
                  backgroundImage: `url(${
                    this.props.avatar
                      ? this.props.avatar
                      : `https://i0.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png?fit=256%2C256&quality=100&ssl=1`
                  })`
                }}
              />
              <div>
                {this.props.name}
                <h5>
                  {this.props.wallet != null
                    ? `${this.props.wallet.balance} ${this.props.wallet.currency}`
                    : 0}
                </h5>
              </div>
            </div>
          ) : null}

          {/* <div className="sep mar-bot-10" /> */}

          {isLoggedIn() && (
            <Fragment>
              {this.props.shopUsername && view_mode == "seller" ? (
                <Fragment>
                  <div className="drawer-links">
                    <Link
                      to={`/${lang}/shop/${shopUsername}`}
                      aria-label="Shop"
                    >
                      {translation.header.shop_link}
                    </Link>

                    <Link to={`/${lang}/wallet`} aria-label="Wallet">
                      {translation.header.wallet_link}
                    </Link>

                    <Link to={`/${lang}/orders`} aria-label="orders">
                      {translation.orders_link}
                    </Link>
                    {/* <div>
                      <Link
                        to={`/${lang}/notifications`}
                        aria-label="notifications"
                      >
                        {translation.notification}
                      </Link>
                    </div> */}
                  </div>

                  {this.props.shopUsername ? (
                    <Fragment>
                      <div className="sep mar-bot-10" />
                      <a
                        className="red mar-bot-10 is-uppercase"
                        href="javascript:void(0)"
                        onClick={toggle}
                      >
                        {view_mode == "seller"
                          ? translation.header.switch_to_buyer_link
                          : translation.header.switch_to_seller_link}
                      </a>
                    </Fragment>
                  ) : null}
                </Fragment>
              ) : (
                <Fragment>
                  <div className="drawer-links">
                    <Link to={`/${lang}/start`} aria-label="Start shop">
                      {translation.header.sell_link}
                    </Link>

                    <Link to={`/${lang}/wallet`} aria-label="Wallet">
                      {translation.header.wallet_link}
                    </Link>

                    <Link to={`/${lang}/orders`}>
                      {translation.orders_link}
                    </Link>

                    <div
                      onClick={this.props.iSeeNotification}
                      className="noti-mobile-menu"
                    >
                      <div
                        onClick={this.props.iSeeNotification}
                        className="noti-mobile-menu"
                      >
                        <Link to={`/${lang}/notifications`}>
                          {translation.notification}
                        </Link>

                        {this.props.notification && (
                          <span className="dot">{this.props.notification}</span>
                        )}
                      </div>

                      {this.props.notification && (
                        <span className="dot">{this.props.notification}</span>
                      )}
                    </div>

                    <Link to={`/${lang}/favorites`}>
                      {translation.likes_link}
                    </Link>
                    {/* 
                    <Link to={`/${lang}/rewards`}>
                      {translation.rewards_link}
                    </Link> */}
                  </div>

                  {this.props.shopUsername ? (
                    <Fragment>
                      <div className="sep mar-bot-10" />
                      <a
                        className="red mar-bot-10 is-uppercase"
                        href="javascript:void(0)"
                        onClick={toggle}
                      >
                        {view_mode == "seller"
                          ? translation.header.switch_to_buyer_link
                          : translation.header.switch_to_seller_link}
                      </a>
                    </Fragment>
                  ) : null}
                </Fragment>
              )}
            </Fragment>
          )}

          <div className="sep mar-bot-10" />

          <p className="dimmed">
            {translation.header.all_categories_placeholder}
          </p>

          <div className="mar-bot-20">{this.renderDeparments()}</div>

          {/* <Link to={`/${lang}/account-settings`}>
              {translation.account_settings_link}
          </Link> */}

          <a
            className="mar-bot-20"
            href={`/${lang == "ar" ? "en" : "ar"}${
              undefined !== currentRoute ? `${currentRoute}` : `/`
            }`}
          >
            {lang === "ar" ? `English` : `عربى`}
          </a>

          {isLoggedIn() && (
            <div className="drawer-links">
              <Link to={`/${lang}/settings`}>
                {translation.account_settings_link}
              </Link>

              <Link to={`/${lang}/login`} onClick={sign_out}>
                {translation.header.signout_link}
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Drawer;
