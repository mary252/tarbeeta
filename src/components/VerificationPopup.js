import React, { Component } from "react";
import { Modal } from "../components/Layout";
import { TextInput, TButton } from "./Form";
import {
  sendVerificationEmail,
  sendMobileConfirmationCode
} from "../services/auth";
import { verifyEmail, verifyMobile } from "../services";

class VerificationPopup extends Component {
  state = {
    is_busy: false,
    email_verification_code: null,
    is_sending: false,
    error_msg: null
  };

  toggle = () => {
    this.modal.toggle();
    if (!this.modal.state.visible) {
      this.send_message();
    }
  };

  store_data = (event, input) => {
    this.setState({
      [input]: event.target.value
    });
  };

  verify = async () => {
    this.setState({
      is_busy: true
    });
    const { email_verification_code } = this.state;
    const { isVerifyMobile } = this.props;

    let func = !isVerifyMobile
      ? verifyMobile({ code: email_verification_code })
      : verifyEmail({ code: email_verification_code });
    await func
      .then(response => {
        if (response.status) {
          alert(
            this.props.translation.account_settings_updated_message
              ? this.props.translation.account_settings_updated_message
                  .success_message
              : ""
          );
          window.location.reload();
        }
      })
      .catch(err => {
        this.setState({
          error_msg: err.data ? err.data.message : "",
          is_busy: false
        });
      });
  };

  send_message = async () => {
    this.setState({
      is_sending: true
    });
    try {
      let response =
        this.props.code == 1
          ? await sendMobileConfirmationCode()
          : await sendVerificationEmail();
      if (response.status) {
        this.setState({
          is_sending: false
        });
      }
    } catch (err) {
      this.setState({
        error_msg:
          undefined !== err.response.data.error
            ? err.response.data.error
            : err.response.data.message,
        is_sending: false
      });
    }
  };

  render() {
    const { is_busy } = this.state;
    const { isVerifyMobile, translation } = this.props;
    return (
      <Modal ref={m => (this.modal = m)}>
        <div onClick={e => e.stopPropagation()} className="address-popup">
          <div className="address-popup-div">
            <p className="address-popup-header">
              {translation.verify_mobile.title}
            </p>
            <div className="columns is-mobile">
              <TextInput
                type="number"
                onKeyUp={e => this.store_data(e, "email_verification_code")}
                onKeyPress={e => {
                  if (e.key === "Enter") {
                    this.verify();
                  }
                }}
                placeholder={
                  translation.email_verification.popup_input_placeholder
                }
              />
            </div>

            <div className="columns is-mobile">
              <div className="column is-4">
                <TButton
                  text={translation.cancel}
                  onPress={this.toggle}
                  className="red outline full"
                  ariaLabel="Cancel"
                />
              </div>
              <div className="column is-2 " />
              <div className="column is-6">
                <TButton
                  text={translation.email_verification.verify_button}
                  onPress={() => this.verify()}
                  className="grad-blue full button"
                  loading={is_busy}
                  ariaLabel="Verify"
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default VerificationPopup;
