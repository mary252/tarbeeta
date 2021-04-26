import React, { Component } from "react";
import "./css/EN.css";
import { Redirect } from "react-router-dom";
import { TextInput, TButton, Page } from "../../components";
import { forgetPass } from "../../services";

import { validate } from "../../ultils/validate/validation";

class ForgotPassword extends Component {
  state = {
    is_logged_in: false,
    email: null,
    error_msg: null,
    is_busy: false,
    verify_robot: false,
    emailError: ""
  };

  componentWillMount = () => {
    if (localStorage.getItem("access_token")) {
      this.setState({
        is_logged_in: true
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

  verify_robot = value => {
    this.setState({
      verify_robot: true
    });
  };
  toggle_busy = () => this.setState({ is_busy: !this.state.is_busy });

  forgetPassword = async () => {
    this.validation(["email"])
      .then(async () => {
        try {
          let email = this.state.email;
          this.toggle_busy();
          let res = await forgetPass({ email });
          this.toggle_busy();
          this.props.init_notification({
            type: "success",
            title: this.props.locale.auth.success,
            message: this.props.locale.auth.success
          });
          setTimeout(() => {
            this.props.history.push({
              pathname: `/${this.props.lang}/activate`,
              state: { email }
            });
          }, 5000);
        } catch (e) {
          this.setState({
            loading: false,
            error: this.props.locale.auth.robot_verify,
            is_busy: false
          });
        }
      })
      .catch(formErrors => {});
  };

  store_data = (event, input) => {
    this.setState({
      [input]: event.target.value
    });
  };

  render() {
    const { is_busy } = this.state;
    if (this.state.is_logged_in) {
      return <Redirect from={"/forgot-password"} to={"/"} />;
    }

    return (
      <Page
        title={this.props.locale.auth.forgot_password.title}
        description={this.props.locale.auth.forgot_password.paragraph}
        {...this.props}
      >
        <div className="form-wrap">
          <div className="section">
            <div className="container">
              <div className="columns is-mobile">
                <div className="column is-3-desktop is-2-tablet is-1-mobile" />

                <div className="column is-6-desktop is-8-tablet is-10-mobile">
                  <h3 className="page-title mar-bot-10">
                    {this.props.locale.auth.forgot_password.title}
                  </h3>

                  <p className="mar-bot-25">
                    {this.props.locale.auth.forgot_password.paragraph}
                  </p>

                  <TextInput
                    required
                    type="email"
                    name="email"
                    placeholder={this.props.locale.auth.email_placeholder}
                    onBlur={() =>
                      this.validation(["email"])
                        .then()
                        .catch(e => {})
                    }
                    errorMessage={this.state.emailError}
                    className="mar-bot-25"
                    onKeyUp={e => this.store_data(e, "email")}
                    onKeyPress={e => {
                      if (e.key === "Enter") {
                        this.forgetPassword();
                      }
                    }}
                  />
                  <TButton
                    ariaLabel="Forget Password"
                    text={this.props.locale.auth.forgot_password.button}
                    className="grad-blue mar-auto button"
                    loading={is_busy}
                    onPress={() => this.forgetPassword()}
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

export default ForgotPassword;
