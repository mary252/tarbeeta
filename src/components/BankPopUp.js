import React, { Component } from "react";
import { Modal } from "../components/Layout";
import { DropDown, TextInput, TButton, Checkbox } from "./Form";
import { validate } from "../ultils/validate/validation";

class BankPopUp extends Component {
  static propTypes = {};

  constructor() {
    super();
    this.modal = null;
  }

  toggle = () => {
    this.modal.toggle();
  };

  state = {
    is_loading: false,
    is_personal_account: 0,
    currency_id: 0,
    bank_id: 0,
    account_name: "",
    account_number: "",
    error: null,
    account_nameError: "",
    account_numberError: ""
  };

  toogle_state = () => {
    this.setState({
      is_personal_account: !this.state.is_personal_account
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

  add_bank_account = async () => {
    const {
      is_personal_account,
      currency_id,
      bank_id,
      account_name,
      account_number
    } = this.state;
    const { addBankAccount } = this.props;

    let data = {
      account_name,
      account_number,
      currency_id,
      is_personal_account,
      bank_id
    };

    this.validation(["account_name", "account_number"])
      .then(() => {
        this.setState({
          is_loading: true
        });
        // let response = await addBankAccount(data);
        addBankAccount(data)
          .then(response => {
            window.location.reload();
          })
          .catch(e => {
            this.setState({
              error: this.props.locale.error_message,
              is_loading: false
            });
          });
      })
      .catch(formErrors => {
      });
  };

  render() {
    const {
      state: { is_loading },
      props: { banks, locale }
    } = this;

    return (
      <Modal ref={m => (this.modal = m)}>
        <div className="address-popup" onClick={e => e.stopPropagation()}>
          <div className="address-popup-div ">
            <p className="address-popup-header">
              {locale.wallet_container.add_bank_account_popup_title}
            </p>
            <div
              className="columns is-mobile"
              style={{ direction: this.props.lang == "ar" ? `ltr` : `rtl` }}
            >
              <div className="column is-half">
                <TextInput
                  placeholder={locale.wallet_container.account_number_input_placeholder}
                  errorMessage={this.state.account_numberError}
                  onBlur={() =>
                    this.validation(["account_number"])
                      .then()
                      .catch(e => {})
                  }
                  onChange={e =>
                    this.setState({
                      account_number: e.target.value
                    })
                  }
                  name="account_number"
                  type="number"
                />
              </div>
              <div className="column is-half">
                <TextInput
                  placeholder={locale.wallet_container.account_name_input_placeholder}
                  errorMessage={this.state.account_nameError}
                  onBlur={() =>
                    this.validation(["account_name"])
                      .then()
                      .catch(e => {})
                  }
                  onChange={e =>
                    this.setState({
                      account_name: e.target.value
                    })
                  }
                  name="account_name"
                  type="text"
                />
              </div>
            </div>
            <div
              className={`columns is-mobile`}
              style={{ direction: this.props.lang == "ar" ? `ltr` : `rtl` }}
            >
              <div className="column is-half">
                <DropDown
                  ariaLabel="Select Currency"
                  options={[
                    {
                      id: 1,
                      name: "EGP"
                    },
                    {
                      id: 2,
                      name: "SAR"
                    },
                    {
                      id: 3,
                      name: "USD"
                    }
                  ]}
                  onSelect={e => {
                    this.setState({
                      currency_id: e.target.value
                    });
                  }}
                />
              </div>
              <div className="column is-half">
                <DropDown
                  ariaLabel="Select Bank"
                  options={banks}
                  onSelect={e =>
                    this.setState({
                      bank_id: e.target.value
                    })
                  }
                />
              </div>
            </div>
            <div className="columns is-mobile">
              <div className="column is-half" />
              <div className="column is-half is-flex aic">
                <Checkbox
                  ischecked={this.state.is_personal_account}
                  onClick={() => this.toogle_state()}
                />
                <p>{this.props.locale.personal}</p>
              </div>
            </div>
            <p>{this.state.error}</p>
            <div className="columns is-mobile">
              <div className="column is-4">
                <TButton
                  text={this.props.locale.cancel}
                  onPress={this.toggle}
                  className="red outline full"
                  ariaLabel="Cancel"
                />
              </div>
              <div className="column is-4 " />
              <div className="column is-4">
                <TButton
                  text={this.props.locale.add_mobile.button}
                  onPress={() => this.add_bank_account()}
                  className="grad-blue full button"
                  loading={this.state.is_loading}
                  ariaLabel="Add Bank Account"
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default BankPopUp;
