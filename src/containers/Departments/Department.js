import React, { Component } from "react";
import { connect } from "react-redux";
import { Page, BreadCrumb } from "../../components";
import { Link } from "react-router-dom";
import MessengerCustomerChat from 'react-messenger-customer-chat';
import { baseUrlStatic, FACEBOOK_CHAT_POPUP_THEME_COLOR, FACEBOOK_APP_ID, FACEBOOK_PAGE_ID } from "../../common";
import "./index.css";

const mapStateToProps = state => {
  return {
    departments: state.departments.all
  };
};

class Section extends Component {
  state = {
    loading: false
  };

  draw_departments = () => {
    let depts = [];

    this.props.departments.map((dept, i) =>
      depts.push(
        <div className="column is-4-desktop is-12-mobile is-6-tablet" key={i}>
          <Link to={`/${this.props.lang}/categories/${dept.department_name}`}>
            <div className="dept">
              <a
                href="#"
                className="img"
                style={{
                  backgroundImage: `url(${baseUrlStatic}${
                    dept.department_image
                  })`
                  // backgroundImage: `url(${require(`../assets/images/${
                  //   i == 0 ? "men.jpg" : i == 1 ? "women.jpg" : "kids.jpg"
                  // }`)})`
                }}
              />
              <h3>{dept.department_name}</h3>
            </div>
          </Link>
        </div>
      )
    );

    return depts;
  };

  render() {
    const { locale } = this.props;

    return (
      <Page
        title={locale.Fashion}
        description={locale.Fashion_desc}
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
              activeRoute={locale.Fashion}
            />

            <div className="columns is-mobile is-multiline">
              {this.draw_departments()}
            </div>
          </div>
        </div>
      </Page>
    );
  }
}

export default connect(mapStateToProps)(Section);
