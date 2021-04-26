import React, { Component } from "react";
import { Page, TextInput, TButton } from "../components";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { update } from "../services/UserService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const mapStateToProps = state => {
  const {
    user: { mobile_verified }
  } = state;
  return {
    mobile_verified
  };
};

class Mobile extends Component {
  state = {
    is_busy: false,
    error_msg: null,
    mobile_number: null
  };

  componentWillMount = async () => {
    // Check if user's mobile phone is already verified
    if (this.props.mobile_verified) {
      this.setState({
        is_verified: true
      });
    }
  };

  store_data = (event, input) => {
    this.setState({
      [input]: event.target.value
    });
  };

  save_mobile = async () => {
    this.setState({
      is_loading: true
    });

    // await update({ mobile: this.state.mobile_number })
    //   .then(response => {
    //     if (response.status) {
    //       window.location.href = `/${this.props.match.params.lang}/verify`;
    //     } else {
    //       this.setState({
    //         error_msg: response.message,
    //         is_loading: false
    //       });
    //     }
    //   })
    //   .catch(err => {
    //     this.setState({
    //       error_msg: err.response
    //         ? err.response.data
    //           ? err.response.data.message
    //           : ""
    //         : "",
    //       is_loading: false
    //     });
    //   });
    try {
      this.setState({
        is_loading: true
      });

      let res = await update({ mobile: this.state.mobile_number });

      this.props.history.push(`/${this.props.lang}/verify`);
    } catch (e) {
      let error_msg = e.data ? e.data.message : "";
      this.setState({ error_msg, is_loading: false });
    }
  };

  toggle_busy = () => this.setState({ is_busy: !this.state.is_busy });

  render() {
    const {
      state: { is_busy },
      props: { locale }
    } = this;
    if (this.state.is_verified) {
      return <Redirect from={"/verify"} to={`/${this.props.lang}/`} />;
    }

    return (
      <Page
        title={locale.add_mobile.title}
        description={locale.add_mobile.helper_paragraph}
        {...this.props}
      >
        <div className="form-wrap">
          <div className="section">
            <div className="container">
              <div className="columns is-mobile">
                <div className="column is-3-desktop is-2-tablet is-1-mobile" />

                <div className="column is-6-desktop is-8-tablet is-10-mobile">
                  <h3 className="page-title mar-bot-10">
                    {locale.add_mobile.title}
                  </h3>

                  <p className="mar-bot-25">
                    {locale.add_mobile.helper_paragraph}
                  </p>

                  {this.state.error_msg ? (
                    <div className="sys-msg has-background-danger mar-bot-15">
                      <FontAwesomeIcon icon={"exclamation-circle"} />
                      {this.state.error_msg}
                    </div>
                  ) : null}
                  <TextInput
                    required
                    type="number"
                    placeholder={locale.add_mobile.input_placeholder}
                    divClassName="mar-bot-25"
                    onKeyUp={e => this.store_data(e, "mobile_number")}
                    onKeyPress={e => {
                      if (e.key === "Enter") {
                        this.save_mobile();
                      }
                    }}
                  />

                  <TButton
                    ariaLabel="Save Mobile"
                    text={locale.add_mobile.button}
                    className="grad-blue mar-auto button"
                    loading={is_busy}
                    onPress={() => this.save_mobile()}
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

export default connect(mapStateToProps)(Mobile);
