import React, { Component } from "react";
import "./css/EN.css";
import { TextInput, TButton, Page } from "../../components";
import { cahngePass } from "../../services";
import { validate } from "../../ultils/validate/validation";
import { connect } from "react-redux";
export class ChangePassword extends Component {
  state = {
    error_msg: null,
    is_busy: false,
    confirmPassword: "",
    password: "",
    oldPassword: "",
    oldPasswordError: "",
    passwordError: "",
    confirmPasswordError: ""
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

  changePass = async () => {
    this.validation(["oldPassword", "password", "confirmPassword"])
      .then(async () => {
        try {
          const { password, oldPassword, confirmPassword } = this.state,
            data = {
              password: `${password}`,
              oldPassword: `${oldPassword}`
            };

          if (password !== confirmPassword) {
            this.setState({
              passwordError: this.props.locale.auth.validateEquality,
              confirmPasswordError: this.props.locale.auth.validateEquality
            });
          } else {
            this.setState({
              passwordError: "",
              confirmPasswordError: ""
            });
            this.toggle_busy();
            let res = await cahngePass(data);
            this.resetForm();
            this.toggle_busy();
          }
          this.props.init_notification({
            type: "success",
            title: this.props.locale.auth.success,
            message: this.props.locale.auth.success
          });
        } catch (e) {
          this.setState({ loading: false, error: e.data, is_busy: false });
          this.props.init_notification({
            type: "error",
            title: this.props.locale.auth.error,
            message: this.props.locale.auth.error_message
          });
        }
      })
      .catch(formErrors => {
        this.props.init_notification({
          type: "error",
          title: this.props.locale.auth.error,
          message: this.props.locale.auth.error_message
        });
      });
  };

  resetForm = () => {
    this.setState(() => ({
      password: "",
      confirmPassword: "",
      oldPassword: ""
    }));

    //show popup the user succesfully update his password
  };

  saveToState = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    const {
      state: { is_busy, password, confirmPassword, oldPassword },
      saveToState
    } = this;

    return (
      <Page
        title={this.props.locale.auth.change_password.title}
        description={this.props.locale.auth.change_password.paragraph}
        {...this.props}
      >
        <div className="form-wrap">
          <div className="section">
            <div className="container">
              <div className="columns is-mobile">
                <div className="column is-3-desktop is-2-tablet is-1-mobile" />

                <div className="column is-6-desktop is-8-tablet is-10-mobile">
                  <h3 className="page-title mar-bot-10">
                    {this.props.locale.auth.change_password.title}
                  </h3>

                  <p className="mar-bot-25">
                    {this.props.locale.auth.change_password.paragraph}
                  </p>

                  <div className="mar-bot-25">
                    <TextInput
                      required
                      id="oldPassword-input"
                      name="oldPassword"
                      type="password"
                      value={oldPassword}
                      placeholder={
                        this.props.locale.auth.old_password_placeholder
                      }
                      onBlur={() =>
                        this.validation(["oldPassword"])
                          .then()
                          .catch(e => {})
                      }
                      errorMessage={this.state.oldPasswordError}
                      onChange={saveToState}
                      onKeyPress={e => {
                        if (e.key === "Enter") {
                          this.changePass();
                        }
                      }}
                    />
                  </div>

                  <div className="mar-bot-25">
                    <TextInput
                      required
                      id="password-input"
                      name="password"
                      type="password"
                      value={password}
                      placeholder={
                        this.props.locale.auth.new_password_placeholder
                      }
                      onBlur={() =>
                        this.validation(["password"])
                          .then()
                          .catch(e => {})
                      }
                      errorMessage={this.state.passwordError}
                      onChange={saveToState}
                      onKeyPress={e => {
                        if (e.key === "Enter") {
                          this.changePass();
                        }
                      }}
                    />
                  </div>
                  <div className="mar-bot-25">
                    <TextInput
                      required
                      id="confirm-password-input"
                      value={confirmPassword}
                      name="confirmPassword"
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
                      onChange={saveToState}
                      onKeyPress={e => {
                        if (e.key === "Enter") {
                          this.changePass();
                        }
                      }}
                    />
                  </div>
                  <TButton
                    ariaLabel="Change Password"
                    id="rest-button"
                    text={this.props.locale.auth.reset_password.button}
                    className="grad-blue mar-auto button"
                    loading={is_busy}
                    onPress={() => this.changePass()}
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

export default connect(null)(ChangePassword);
