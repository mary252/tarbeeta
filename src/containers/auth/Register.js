import React, { Component } from "react";
import "./css/EN.css";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { TextInput, TButton, DropDown, Page } from "../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookSquare } from "@fortawesome/free-brands-svg-icons";
import { loginFacebook, GistToMember } from "../../services";
import { connect } from "react-redux";
import * as user from "../../actions/user";
import { validate } from "../../ultils/validate/validation";
import { baseURL } from "../../common";
import {fetchUUid} from "../../ultils"

export class Register extends Component {
  state = {
    error_msg: null,
    firstname: "",
    country_code: "+2",
    lastname: "",
    emailRegister: "",
    mobile: "",
    password: "",
    is_loading: false,
    loggedin: false,
    firstnameError: "",
    lastnameError: "",
    mobileError: "",
    passwordError: "",
    emailRegisterError: "",
    verify_robot: false
  };

  componentWillMount = () => {
    if (localStorage.getItem("access_token")) {
      this.setState({
        loggedin: true
      });
    }
  };

  store_data = (event, input) => {
    this.setState({
      [input]: event.target.value
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

  getFieldsToValidate = () => {
    let result = ["firstname", "lastname", "mobile", "password"];
    // if (this.state.password) result.push("password");

    if (this.state.emailRegister) result.push("emailRegister");

    return result;
  };

  register = () => {
    // if (this.state.verify_robot) {
    this.validation(this.getFieldsToValidate())
      .then(() => {
        this.setState({
          is_loading: true
        });
        let lang_id = this.props.lang_id;
        let uuid=fetchUUid()
        let data = {
          firstname: this.state.firstname,
          lastname: this.state.lastname,
          email: this.state.emailRegister,
          country_code: this.state.country_code,
          mobile: this.state.mobile,
          password: this.state.password,
          locale: this.props.lang,
          uuid
        };

        axios
          .post(`${baseURL}user?lang_id=${lang_id}`, data, {
            headers: {
              // 'Content-Type': 'application/x-www-form-urlencoded'
            }
          })
          .then(res => {
            var response = res.data;

            if (response.status) {
              const {
                avatar,
                user_id,
                verified,
                mobile_verified,
                api_access_token
              } = response.data;

              this.props.dispatch(
                user.store_user_info({
                  avatar,
                  user_id,
                  verified,
                  mobile_verified
                })
              );

              GistToMember(this.props.lang, res.data.data.api_access_token);
            } else {
              this.setState({
                error_msg: response.message,
                is_loading: false
              });
            }
          })
          .catch(err => {
            this.setState({
              error_msg: err.response
                ? err.response.data
                  ? undefined !== err.response.data.error
                    ? err.response.data.error
                    : err.response.data.message
                  : ""
                : "",
              is_loading: false
            });
          });
      })
      .catch(formErrors => {});
    /*} else {
      this.setState({
        is_loading: false,
        is_busy: false,
        error_msg: this.props.locale.auth.robot_verify
      });
    }*/
  };

  verify_robot = value => {
    this.setState({
      verify_robot: true
    });
  };

  render() {
    if (this.state.loggedin) {
      return <Redirect from={"/register"} to={"/"} />;
    }

    return (
      <Page
        title={this.props.locale.auth.login.title}
        description={this.props.locale.auth.login.desc}
        {...this.props}
      >
        <div className="container">
          <div className="columns is-mobile">
            <div className="column is-3-desktop is-1-mobile is-2-tablet" />

            <div className="column is-6-desktop is-10-mobile is-8-tablet">
              <div className="form-wrap">
                <p className="page-title mar-bot-27">
                  {this.props.locale.auth.login.title}
                </p>

                <div className="columns is-mobile mar-bot-0">
                  <div className="column is-2-desktop is-hidden-mobile" />

                  <div className="column is-8-desktop is-full-mobile is-8-tablet">
                    <TButton
                      ariaLabel="Register with Facebook"
                      leftIcon={faFacebookSquare}
                      text={this.props.locale.auth.facebook_button_text}
                      className="facebook is-uppercase mar-bot-13 full"
                      onPress={() => loginFacebook(this.props.lang)}
                    />
                  </div>

                  <div className="column is-2-desktop is-hidden-mobile" />
                </div>

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

                <div className="columns is-mobile is-multiline">
                  <div className="column is-6-desktop is-full-touch">
                    <div className="columns is-mobile is-multiline">
                      <div className="column is-6-desktop is-6-touch">
                        <TextInput
                          required
                          placeholder={this.props.locale.auth.firstname}
                          id={"firstname-input"}
                          name="firstname"
                          type="text"
                          errorMessage={this.state.firstnameError}
                          onBlur={() =>
                            this.validation(["firstname"])
                              .then()
                              .catch(e => {})
                          }
                          onKeyPress={e => {
                            if (e.key === "Enter") {
                              this.register();
                            }
                          }}
                          onKeyUp={e => this.store_data(e, "firstname")}
                        />
                      </div>

                      <div className="column is-6-desktop is-6-touch">
                        <TextInput
                          required
                          placeholder={this.props.locale.auth.lastname}
                          type="text"
                          id={"lastname-input"}
                          name="lastname"
                          errorMessage={this.state.lastnameError}
                          onBlur={() =>
                            this.validation(["lastname"])
                              .then()
                              .catch(e => {})
                          }
                          onKeyPress={e => {
                            if (e.key === "Enter") {
                              this.register();
                            }
                          }}
                          onKeyUp={e => this.store_data(e, "lastname")}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="column is-2-desktop is-2-tablet is-4-mobile">
                    <DropDown
                      ariaLabel="Select Country Code"
                      options={[{ value: "+2", title: "+2" }]}
                      onSelect={e => this.store_data(e, "country_code")}
                    />
                  </div>

                  <div className="column is-4-desktop is-4-tablet is-8-mobile">
                    <TextInput
                      required
                      placeholder={this.props.locale.auth.mobile}
                      type="number"
                      id={"mobile-input"}
                      name="mobile"
                      errorMessage={this.state.mobileError}
                      onBlur={() =>
                        this.validation(["mobile"])
                          .then()
                          .catch(e => {})
                      }
                      onKeyPress={e => {
                        if (e.key === "Enter") {
                          this.register();
                        }
                      }}
                      onKeyUp={e => this.store_data(e, "mobile")}
                    />
                  </div>
                </div>

                <div className="columns is-mobile">
                  <div className="column is-6">
                    <TextInput
                      required
                      placeholder={this.props.locale.auth.password_placeholder}
                      id={"password-input"}
                      name="password"
                      type="password"
                      errorMessage={this.state.passwordError}
                      onBlur={() => {
                        // if (this.state.password) {
                        this.validation(["password"])
                          .then()
                          .catch(e => {});
                        // }
                      }}
                      onKeyPress={e => {
                        if (e.key === "Enter") {
                          this.register();
                        }
                      }}
                      onKeyUp={e => this.store_data(e, "password")}
                    />
                  </div>

                  <div className="column is-6">
                    <TextInput
                      required
                      placeholder={this.props.locale.auth.email_placeholder}
                      type="email"
                      id={"email-input"}
                      name="emailRegister"
                      errorMessage={this.state.emailRegisterError}
                      onBlur={() => {
                        if (this.state.emailRegister) {
                          this.validation(["emailRegister"])
                            .then()
                            .catch(e => {});
                        }
                      }}
                      onKeyPress={e => {
                        if (e.key === "Enter") {
                          this.register();
                        }
                      }}
                      onKeyUp={e => this.store_data(e, "emailRegister")}
                    />
                  </div>
                </div>

                {/* <div className="mar-bot-15">
                  <ReCAPTCHA
                    sitekey={google_capcha}
                    onChange={this.verify_robot}
                  />
                </div> */}

                <TButton
                  ariaLabel="Register"
                  text={this.props.locale.auth.registration_button_text}
                  onPress={() => this.register()}
                  type="submit"
                  id={"register-button"}
                  name="register"
                  className={`button grad-blue mar-bot-25`}
                  loading={this.state.is_loading}
                />

                <div className="form-foot mar-auto has-text-centered">
                  {this.props.locale.auth.sign_in_text}{" "}
                  <a href={`/${this.props.lang}/login`}>
                    {this.props.locale.auth.sign_in_button}
                  </a>
                </div>
              </div>
            </div>

            <div className="column is-3-desktop is-1-mobile is-2-tablet" />
          </div>
        </div>
      </Page>
    );
  }
}
// export default Register;
export default connect(null)(Register);
