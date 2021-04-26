import React, { Component } from "react";
import axios from "axios";
import { TextInput, TButton, Checkbox, Page } from "../../components";
import * as user from "../../actions/user";
import { connect } from "react-redux";
import "./css/EN.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookSquare } from "@fortawesome/free-brands-svg-icons";
import { loginFacebook, GistToMember } from "../../services";
import { baseURL } from "../../common";
import { validate } from "../../ultils/validate/validation";
import {fetchUUid} from "../../ultils"

const mapStateToProps = state => {
  return {};
};

export class Login extends Component {
  state = {
    loggedin: false,
    email: null,
    password: null,
    error_msg: false,
    is_loading: false,
    remember_me: false,
    emailError: "",
    passwordError: "",
    verify_robot: false
  };
  toogle_state = () => {
    this.setState({
      remember_me: !this.state.remember_me
    });
  };
  componentWillMount = () => {
    if (localStorage.getItem("access_token")) {
      this.setState({
        loggedin: true
      });
    }
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

  login = () => {
    // if(this.state.verify_robot){
    this.validation(["email", "password"]).then(() => {
      this.setState({
        is_loading: true
      });
      let lang_id = this.props.lang_id;
      let uuid=fetchUUid
      axios
        .post(
          `${baseURL}login?lang_id=${lang_id}`,
          {
            email: this.state.email,
            password: this.state.password,
            remember_me: this.state.remember_me,
            uuid
          }
          // {
          //   headers: {
          //     // 'Content-Type': 'application/x-www-form-urlencoded'
          //   }
          // }
        )
        .then(res => {
          var response = res.data;
          if (response.status) {
            localStorage.setItem("view_mode", "buyer");

            const {
              avatar,
              user_id,
              verified,
              mobile_verified
            } = response.data;
            // Store user information in redux

            this.props.dispatch(
              user.store_user_info({
                avatar,
                user_id,
                verified,
                mobile_verified
              })
            );

            GistToMember(this.props.lang, response.token);

            this.setState({
              loggedin: true
            });
          } else {
            this.setState({
              is_loading: false,
              error_msg: response.message
            });
          }
        })
        .catch(err => {
          this.setState({
            is_loading: false,
            is_busy: false,
            error_msg: err.response
              ? err.response.data
                ? err.response.data.message
                : ""
              : ""
          });
        });
    });
  };

  store_data = (event, input) => {
    this.setState({
      [input]: event.target.value
    });
  };

  verify_robot = value => {
    this.setState({
      verify_robot: true
    });
  };

  render() {
    let query = this.props.location.search;

    return (
      <Page
        title={this.props.locale.auth.login.title}
        description={this.props.locale.auth.login.desc}
        {...this.props}
      >
        <div className="container">
          <div className="columns is-mobile">
            <div className="column is-4-desktop is-1-mobile is-2-tablet" />

            <div className="column is-4-desktop is-10-mobile is-8-tablet">
              <div className="form-wrap">
                <p className="page-title mar-bot-27">
                  {this.props.locale.auth.login.title}
                </p>

                <TButton
                  ariaLabel="Register with Facebook"
                  leftIcon={faFacebookSquare}
                  text={this.props.locale.auth.facebook_button_text}
                  className="facebook is-uppercase mar-bot-25 full"
                  onPress={() => loginFacebook(this.props.lang)}
                />

                <div className="is-flex or-separator">
                  <div className="line" />
                  <p>{this.props.locale.auth.seperator}</p>
                  <div className="line" />
                </div>

                <p className="form-helper mar-bot-15">
                  {this.props.locale.auth.form_helper_text}
                </p>

                {this.state.error_msg ? (
                  <div className="sys-msg has-background-danger mar-bot-15">
                    <FontAwesomeIcon icon={"exclamation-circle"} />
                    {this.state.error_msg}
                  </div>
                ) : null}

                <TextInput
                  required
                  placeholder={
                    this.props.locale.auth.login.form.email_or_mobile
                  }
                  divClassName="mar-bot-20"
                  id={"email-input"}
                  name="email"
                  type="text"
                  onBlur={() =>
                    this.validation(["email"])
                      .then()
                      .catch(e => {})
                  }
                  errorMessage={this.state.emailError}
                  onKeyPress={e => {
                    if (e.key === "Enter") {
                      this.login();
                    }
                  }}
                  onChange={e => this.store_data(e, "email")}
                />

                <TextInput
                  required
                  placeholder={this.props.locale.auth.password_placeholder}
                  divClassName="mar-bot-15"
                  id={"password-input"}
                  name="password"
                  type="password"
                  onBlur={() =>
                    this.validation(["password"])
                      .then()
                      .catch(e => {})
                  }
                  errorMessage={this.state.passwordError}
                  onKeyPress={e => {
                    if (e.key === "Enter") {
                      this.login();
                    }
                  }}
                  onChange={e => this.store_data(e, "password")}
                />

                <div className="level is-mobile form-links mar-bot-25">
                  <div className="level-left">
                    <Checkbox
                      ischecked={this.state.remember_me}
                      onClick={() => this.toogle_state()}
                    />
                    <span>{this.props.locale.auth.login.form.remember_me}</span>
                  </div>

                  <div className="level-right">
                    <a href={`/${this.props.lang}/forgot-password`}>
                      {this.props.locale.auth.login.form.forgot_password_link}
                    </a>
                  </div>
                </div>

                {/* <div className="mar-bot-15">
                  <ReCAPTCHA
                    sitekey={google_capcha}
                    onChange={this.verify_robot}
                  />
                </div> */}
                <TButton
                  ariaLabel="Login"
                  text={this.props.locale.auth.sign_in_button}
                  onPress={() => this.login()}
                  id={"login-button"}
                  name="login"
                  type="submit"
                  className={`button grad-blue auto mar-auto mar-bot-25`}
                  loading={this.state.is_loading}
                />

                <div className="form-foot mar-auto has-text-centered">
                  {this.props.locale.auth.registration_text}{" "}
                  <a href={`/${this.props.lang}/register`}>
                    {this.props.locale.auth.registration_button_text}
                  </a>
                </div>
              </div>
            </div>

            <div className="column is-4-desktop is-1-mobile is-2-tablet" />
          </div>
        </div>
      </Page>
    );
  }
}
export default connect(mapStateToProps)(Login);
