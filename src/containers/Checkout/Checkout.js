import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions";
import {
  CartsCheckoutSection,
  CheckoutTabs,
  ConfirmationPopup,
  withLoader,
  PageTitle,
  ReceiptMobile,
  Page
} from "../../components";

import { getCartSeller, featchCartTotal, fetchOrderInfo } from "../../services";

const mapStateToProps = state => {
  const {
    user: { address, wallet }
  } = state;

  return {
    address,
    wallet
  };
};

export class CheckoutPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderId: 123,
      total: 0,
      products: [],
      loading: false,
      currency: "",
      payment_token: null,
      payment_order_id: null,
      id: null,
      sub_total: 0,
      discount: 0,
      disabled: true
    };
    if (!props.location.state) props.history.push(`/${props.lang}/cart`);
  }

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  checkPromoCode = e => {
    this.setState({ [e.target.name]: e.target.value }, this.checkCode);
  };
  ConfirmationPopup = null;

  getCartTotal = async lang_id => {
    try {
      let res = await featchCartTotal(lang_id);

      const { sub_total, discount, total, currency } = res.data;
      this.setState({ sub_total, discount, total, currency });
    } catch (e) {}
  };
  async componentDidMount() {
    this.setState({ loading: true });
    let { id } = this.props.match.params,
      lang_id = this.props.lang_id;

    await this.getOrderInfo();

    await this.getRecieptProducts(lang_id);
    await this.getCartTotal(lang_id);

    this.setState({ loading: false });
  }

  getRecieptProducts = async lang_id => {
    try {
      let res = await getCartSeller(lang_id);

      let products = res.data;
      this.setState({ products });
    } catch (e) {}
  };

  getOrderInfo = async () => {
    try {
      let res = await fetchOrderInfo(),
        order = res.data;
      const { payment_token, payment_order_id, id, promo_id } = order[0];
      this.setState({ payment_token, payment_order_id, id, promo_id });
    } catch (e) {}
  };
  naviagateNext = () => {
    if (this.Tabs.Tabs.state.activeTab == 0) this.Tabs.Tabs.navigateNext();
  };

  delAddress = addressId => {
    this.props.deleteAddress(addressId);
  };
  openPopUp = item => this.ConfirmationPopup.toggle(item);

  updateAddress = data => {
    this.props.addNewAddress(data);
  };

  toggleDisabled = () => {
    this.setState({ disabled: false });
  };

  render() {
    const {
      total,
      currency,
      sub_total,
      discount,
      is_code_valid,
      promo_id
    } = this.state;
    const { locale } = this.props;
    return (
      <Page
        title={locale.checkout}
        description={locale.checkout_desc}
        {...this.props}
      >
        <ConfirmationPopup
          ref={a => (this.ConfirmationPopup = a)}
          lang={this.props.lang}
          translation={this.props.locale}
          action={this.delAddress}
        />
        <div className="section">
          <div className="container main-container">
            <PageTitle title={locale.checkout} />
            <div className="columns  columns__no-margin-bottom">
              <div className="column  is-9-desktop  is-12-tablet is-12-mobile tabs-left-container">
                <CheckoutTabs
                  addNewAddress={this.updateAddress}
                  {...this.state}
                  {...this.props}
                  ref={t => {
                    this.Tabs = t;
                  }}
                  total={total}
                  locale={this.props.locale}
                  delAddress={this.openPopUp}
                  setCodeError={this.setCodeError}
                  disabled={this.state.disabled}
                  toggleDisabled={this.toggleDisabled}
                  init_notification={this.props.init_notification}
                />
              </div>
              <div className="column is-3-desktop right-container">
                <div className="is-hidden-desktop">
                  <ReceiptMobile
                    isexpandable
                    onClick={this.naviagateNext}
                    total={total}
                    currency={currency}
                    locale={locale}
                    btnText={locale.continue_button}
                    // checkPromoCode={this.checkPromoCode}
                    // promo_code={this.state.promo_code}
                    promo_codeError={this.state.promo_codeError}
                    // promo_id={!promo_id}
                    // is_code_valid={is_code_valid}
                    sub_total={sub_total}
                    discount={discount}
                    disabled={this.state.disabled}
                    toggleDisabled={this.toggleDisabled}
                    init_notification={this.props.init_notification}
                    address={this.props.address}
                    saveToState={this.saveToState}
                  />
                </div>
                <div className="is-hidden-mobile is-hidden-tablet-only sticky-invoice">
                  <CartsCheckoutSection
                    lang={this.props.lang}
                    {...this.state}
                    {...this.props}
                    saveToState={this.saveToState}
                    // checkPromoCode={this.checkPromoCode}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Page>
    );
  }
}

export default connect(
  mapStateToProps,
  actions
)(withLoader(CheckoutPage));
