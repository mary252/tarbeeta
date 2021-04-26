import React, { Component } from "react";

import { TextInput, TButton, Page } from "../../components";
import { validateResetCode } from "../../services/auth";
import { validate } from "../../ultils/validate/validation";

class Activate extends Component {
  state = {
    is_busy: false,
    code: null,
    error_msg: null,
    is_verified: false,
    codeError: ""
  };

  componentDidMount = async () => {
    // Send confirmation code to the logged in user
    // let smsResp = await sendMobileConfirmationCode();
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

  activate = async () => {
    const email = this.props.location.state.email,
      code = this.state.code;

    this.validation(["code"])
      .then(async () => {
        this.setState({
          is_busy: true
        });
        try {
          let res = await validateResetCode({ reset_code: code, email });
          this.props.history.push({
            pathname: `/${this.props.lang}/recover`,
            state: { email, token: res.token }
          });
        } catch (err) {
          this.setState({
            error_msg: err.data ? err.data.message : "",
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

  toggle_busy = () => this.setState({ is_busy: !this.state.is_busy });

  render() {
    const { is_busy } = this.state;

    return (
      <Page
        title={this.props.locale.auth.activate_page.title}
        description={this.props.locale.auth.activate_page.paragraph}
        {...this.props}
      >
        <div className="form-wrap">
          <div className="section">
            <div className="container">
              <div className="columns is-mobile">
                <div className="column is-3-desktop is-2-tablet is-1-mobile" />

                <div className="column is-6-desktop is-8-tablet is-10-mobile">
                  <h3 className="page-title mar-bot-10">
                    {this.props.locale.auth.activate_page.title}
                  </h3>

                  <p className="mar-bot-25">
                    {this.props.locale.auth.activate_page.paragraph}
                  </p>

                  <TextInput
                    required
                    type="number"
                    placeholder={
                      this.props.locale.auth.activate_page
                        .code_input_placeholder
                    }
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
                        this.activate();
                      }
                    }}
                  />

                  <TButton
                    ariaLabel="Activate"
                    text={this.props.locale.auth.activate_page.button}
                    className="grad-blue mar-auto button"
                    loading={is_busy}
                    onPress={() => this.activate()}
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

export default Activate;
