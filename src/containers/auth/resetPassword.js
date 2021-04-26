import React, { Component } from "react";
import "./css/EN.css";
import { Redirect } from "react-router-dom";
import { TextInput, TButton, Page } from "../../components";
import { setPass } from "../../services";

import { validate } from "../../ultils/validate/validation";

class ResetPassword extends Component {
  state = {
    is_logged_in: false,
    email: null,
    error_msg: null,
    is_busy: false,
    confirmPassword: null,
    password: null,
    passwordError: "",
    confirmPasswordError: ""
  };

  componentWillMount = () => {
    if (localStorage.getItem("access_token")) {
      this.setState({
        is_logged_in: true
      });
    }
  };

  toggle_busy = () => this.setState({ is_busy: !this.state.is_busy });

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

  resetPass = async () => {
    this.validation(["password", "confirmPassword"])
      .then(async () => {
        try {
          const { password, confirmPassword } = this.state;
          const { token, email } = this.props.location.state;

          if (password !== confirmPassword) {
            this.setState({
              passwordError: this.props.locale.auth.validateEquality,
              confirmPasswordError: this.props.locale.auth.validateEquality
            });
          } else {
            this.toggle_busy();
            let res = await setPass({ password, token, email });
            this.toggle_busy();
            this.props.history.push(`/${this.props.lang}/login`);
          }
        } catch (e) {
          this.setState({ loading: false, error: e.data, is_busy: false });
        }
      })
      .catch(formErrors => {});
  };

  saveToState = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    const { is_busy } = this.state;
    if (this.state.is_logged_in) {
      return <Redirect from={"/forgot-password"} to={"/"} />;
    }

    return (
      <Page
        title={this.props.locale.auth.reset_password.title}
        description={this.props.locale.auth.reset_password.paragraph}
        {...this.props}
      >
        <div className="form-wrap">
          <div className="section">
            <div className="container">
              <div className="columns is-mobile">
                <div className="column is-3-desktop is-2-tablet is-1-mobile" />

                <div className="column is-6-desktop is-8-tablet is-10-mobile">
                  <h3 className="page-title mar-bot-10">
                    {this.props.locale.auth.reset_password.title}
                  </h3>

                  <p className="mar-bot-25">
                    {this.props.locale.auth.reset_password.paragraph}
                  </p>

                  <div className="mar-bot-25">
                    <TextInput
                      id="password-input"
                      required
                      placeholder={this.props.locale.auth.password_placeholder}
                      onBlur={() =>
                        this.validation(["password"])
                          .then()
                          .catch(e => {})
                      }
                      errorMessage={this.state.passwordError}
                      onChange={this.saveToState}
                      name="password"
                      type="password"
                      onKeyPress={e => {
                        if (e.key === "Enter") {
                          this.resetPass();
                        }
                      }}
                    />
                  </div>
                  <div className="mar-bot-25">
                    <TextInput
                      id="confirm-password-input"
                      required
                      type="password"
                      placeholder={
                        this.props.locale.auth.confitm_password_placeholder
                      }
                      onBlur={() =>
                        this.validation(["confirmPassword"])
                          .then()
                          .catch(e => {})
                      }
                      errorMessage={this.state.confirmPasswordError}
                      onChange={this.saveToState}
                      name="confirmPassword"
                      onKeyPress={e => {
                        if (e.key === "Enter") {
                          this.resetPass();
                        }
                      }}
                    />
                  </div>
                  <TButton
                    ariaLabel="Reset Password"
                    id="rest-button"
                    text={this.props.locale.auth.reset_password.button}
                    className="grad-blue mar-auto button"
                    loading={is_busy}
                    onPress={this.resetPass}
                  />
                </div>

                <div className="column is-3-desktop is-2-tablet is-1-mobile" />
              </div>
            </div>
          </div>
        </div>
      </Page>
    );
  }
}

export default ResetPassword;
