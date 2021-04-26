import React, { Component } from "react";
import "./css/EN.css";
import { featchCategory, urlGenrators } from "../../services";
import { Link } from "react-router-dom";
import { FACEBOOK_CHAT_POPUP_THEME_COLOR, FACEBOOK_APP_ID, FACEBOOK_PAGE_ID } from "../../common";
import MessengerCustomerChat from 'react-messenger-customer-chat';
import { withLoader, Page } from "../../components";
class Categories extends Component {
  state = {
    categories: [],
    loading: false,
    departmentId: null
  };

  async componentDidMount() {
    const {
      match: {
        params: { id, department_url }
      }
    } = this.props;
    this.setState({ departmentId: id, loading: true });

    let localizedDepartmentKey = ``,
      localizedDepartment = ``;

    Object.entries(require("../Locale/AR")).forEach(([key, value]) => {
      if (value == department_url) {
        localizedDepartmentKey = key;
        return;
      }
    });

    let keyword = department_url;

    if (localizedDepartmentKey.length) {
      keyword = localizedDepartmentKey;
    }

    localizedDepartment =
      undefined !== this.props.locale[keyword.toLowerCase()]
        ? this.props.locale[keyword.toLowerCase()].toLowerCase()
        : keyword;

    await this.getCategory(localizedDepartment, this.props.lang_id);
    this.setState({ loading: false });
  }

  getCategory = async (department_url, lang_id) => {
    try {
      let res = await featchCategory(department_url, lang_id);

      this.setState({
        loading: false,
        categories: res.data
      });
    } catch (e) {}
  };

  draw_categories_header = () =>
    this.state.categories.map((cat, i) => {
      let department = cat.url.split("-")[0],
        category = cat.url.split("-")[1];
      return (
        <div className="column is-one-third" key={i}>
          <Link
            to={`/${this.props.lang}/subcategory/${department}/${category}`}
          >
            <div
              className="sys-message has-text-right"
              style={{
                backgroundImage: `url(${urlGenrators(
                  "departments",
                  cat.department_id,
                  `${cat.department_category_id}.jpg`
                )})`
              }}
            >
              <p className="top-cover-text is-uppercase">{cat.name}</p>
            </div>
          </Link>
        </div>
      );
    });

  draw_categories = () => {
    let category_div = [];
    this.state.categories.map((category, i) =>
      category_div.push(
        <div key={i} className="category-div">
          <div className="level is-mobile">
            <div className="level-left">
              <p className="category-name">{category.name}</p>
            </div>
            <div className="level-right">
              <Link
                to={`/${this.props.lang}/subcategory/${
                  category.department_name
                }/${category.name}`}
                className="red"
              >
                {this.props.locale.view_all}
              </Link>
            </div>
          </div>
          <div className="sep" />
          <div className="columns is-mobile is-multiline">
            {this.draw_items(category)}
          </div>
        </div>
      )
    );
    return category_div;
  };
  draw_items = ({
    subcategories,
    category_id,
    department_name,
    name,
    department_id
  }) => {
    let item_div = [];
    subcategories.map((item, i) => {
      item_div.push(
        <div
          key={i}
          className=" column is-one-quarter-desktop is-one-third-tablet is-half-mobile"
        >
          <div className="item">
            <a
              href={`/${
                this.props.lang
              }/subcategory/${department_name}/${name}/${
                item.subcategory_name
              }`}
            >
              <img
                alt="subcategory thumbnail"
                className="subcategory-thumb"
                src={urlGenrators(
                  "departments",
                  department_id,
                  category_id,
                  item.subcategory_id,
                  "1.jpg"
                )}
              />
            </a>
            <a
              className="item-name"
              href={`/${
                this.props.lang
              }/subcategory/${department_name}/${name}/${
                item.subcategory_name
              }`}
            >
              {item.subcategory_name}
            </a>
          </div>
        </div>
      );
    });
    return item_div;
  };

  render() {
    const {
      props: {
        match: {
          params: { department_url }
        },
        location: { pathname, search },
        locale
      }
    } = this;
    return (
      <Page
        title={this.props.locale[department_url.toLowerCase()]}
        description={locale.category_desc}
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
            <p className="category-title">
              {this.props.locale[department_url.toLowerCase()]}
            </p>
            <div className="columns">{this.draw_categories_header()}</div>
            {this.draw_categories()}
          </div>
        </div>
      </Page>
    );
  }
}
export default withLoader(Categories);
