import React, { Component } from "react";
import { Page, TextInput, TButton } from "../components";
import { Redirect } from "react-router-dom";
import * as user from "../actions/user";
import { connect } from "react-redux";
import { sendMobileConfirmationCode, verifyMobile } from "../services/auth";
import { checkToRedirect } from "../services";
import { validate } from "../ultils/validate/validation";

const mapStateToProps = state => {
  return {
    mobile_verified: state.user.mobile_verified,
    firstname: state.user.firstname
  };
};

class Verify extends Component {
  state = {
    is_busy: false,
    code: null,
    error_msg: null,
    is_verified: false,
    codeError: ""
  };

  componentWillMount = async () => {
    // Check if user's mobile phone is already verified
    if (this.props.mobile_verified) {
      this.setState({
        is_verified: true
      });
    }
  };

  componentDidMount = async () => {
    // Send confirmation code to the logged in user
    let smsResp = await sendMobileConfirmationCode();
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

  verify = async () => {
    //let codeError = validate("code",this.state.code);

    this.validation(["code"])
      .then(async () => {
        this.setState({
          is_loading: true
        });
        try {
          let response = await verifyMobile({ code: this.state.code });
          if (response.status) {
            this.props.store_user_info({
              mobile_verified: true
            });

            checkToRedirect(this.props.lang);
          } else {
            this.setState({
              error_msg: response.message,
              is_loading: false
            });
          }
        } catch (err) {
          this.setState({
            error_msg: err.data ? err.data.message : "",
            is_loading: false
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

  toggle_busy = () => this.setState({ is_busy: !this.state.is_busy });

  render() {
    const {
      state: { is_busy, is_verified },
      props: { locale, lang }
    } = this;

    if (is_verified) {
      return <Redirect from={"/verify"} to={`/${lang}/`} />;
    }

    return (
      <Page
        title={locale.verify_mobile.title}
        description={locale.verify_mobile.helper_paragraph}
        {...this.props}
      >
        <div className="form-wrap">
          <div className="section">
            <div className="container">
              <div className="columns is-mobile">
                <div className="column is-3-desktop is-2-tablet is-1-mobile" />

                <div className="column is-6-desktop is-8-tablet is-10-mobile">
                  <h3 className="page-title mar-bot-10">
                    {locale.verify_mobile.title}
                  </h3>

                  <p className="mar-bot-25">
                    {locale.verify_mobile.helper_paragraph}
                  </p>

                  <TextInput
                    required
                    type="number"
                    placeholder={locale.verify_mobile.code_input_placeholder}
                    divClassName="mar-bot-25"
                    errorMessage={this.state.codeError}
                    onBlur={() =>
                      this.validation(["code"])
                        .then()
                        .catch(e => {})
                    }
                    onKeyUp={e => this.store_data(e, "code")}
                    onKeyPress={e => {
                      if (e.key === "Enter") {
                        this.verify();
                      }
                    }}
                  />

                  <TButton
                    ariaLabel="Verify"
                    text={locale.verify_mobile.verify_button}
                    className="grad-blue mar-auto button"
                    loading={is_busy}
                    onPress={() => this.verify()}
                    loading={this.state.is_loading}
                  />
                </div>

                <div className="column is-3-desktop is-2-tablet is-1-mobile" />
              </div>
            </div>

            <div className="column is-3-desktop is-2-tablet is-1-mobile" />
          </div>
        </div>
      </Page>
    );
  }
}

export default connect(
  mapStateToProps,
  user
)(Verify);
