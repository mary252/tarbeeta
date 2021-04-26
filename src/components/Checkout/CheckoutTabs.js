import React, { Component } from "react";
import { RadioRaw } from "./RadioRaw";
import { PaymentWay } from "./PaymentWay";
import AddressPopUp from "../AddressPopUp";

import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { TButton, Radio, Tabs } from "../Form";

import "../Cart/cart.css";
import "../Form/Tabs/tabs.css";
import "../Checkout/checkout.css";
import {
  Images,
  CARD_PAYMENT_IFRAME,
  EN_FRAME_ID,
  AR_FRAME_ID
} from "../../common";
import { placeOrder, checkOrder } from "../../services";
import { KIOSK } from "../../common";
class CheckoutTabs extends Component {
  state = {
    isWallet: false,
    ccv: null,
    ischecked: false,
    address_id: null,
    payment_option: 4,
    is_busy: false
  };

  AddressPopup = null;
  openPopUp = () => this.AddressPopup.toggle();

  onCCVChange = e => {
    if (e.target.value.length === 5) return;

    this.setState({ [e.target.name]: e.target.value });
  };

  selectAddress = (address_id = this.state.address_id) => {
    // localStorage.setItem("address_id", address_id);
    this.setState({ address_id });
  };
  renderWallet = ({ locale }) => (
    <div>
      <div className="wallet-balance">
        <h1 className="pay-text">{locale.checkout_page.wallet_title_head}</h1>
        <h2 className="wallet-text">{locale.balance_head} 1,392.00 EGP:</h2>
      </div>

      {/* <h1 className="details-font tex-breaker">
        {locale.safe_money_p}
        <br />
        Maestro, Discover, American Express.
      </h1> */}
    </div>
  );

  toggle_busy = () => this.setState({ is_busy: !this.state.is_busy });

  // componentWillMount(){
  //   this.setState({
  //     address_id: localStorage.getItem("address_id")
  //   })
  // }

  // componentWillReceiveProps(){
  //   this.setState({
  //     address_id: localStorage.getItem("address_id")
  //   })
  // }

  // componentDidMount(){
  //   if(localStorage.getItem("address_id") != null){
  //     this.setState({
  //       address_id: localStorage.getItem("address_id")
  //     });
  //   }
  // }

  updateAddressId = id => {
    this.setState({
      address_id: id
    });
  };
  check_order = async () => {
    const {
      props: {
        match: {
          params: { lang }
        }
      }
    } = this;
    try {
      let res = await checkOrder();
      if (res.data.redirect) {
        this.props.init_notification({
          type: "error",
          title: this.props.locale.error,
          message: this.props.locale.quantity_err
        });
        setTimeout(
          () =>
            this.props.history.push({
              pathname: `/${lang}/cart`
            }),
          2000
        );
      }
    } catch (e) {}
  };
  newOrder = async () => {
    const {
      state: { address_id, payment_option },
      props: {
        match: {
          params: { lang, lang_id }
        },
        promo_code
      }
    } = this;
    try {
      this.toggle_busy();
      let response = await checkOrder();

      if (!response.redirect) {
        let res = await placeOrder(
          { address_id, payment_option },
          this.props.lang_id
        );
        this.props.getNumberOfcart();

        this.props.history.push({
          pathname: `/${lang}/thankyou/${res.data}`,
          state: { navFromCheck: true }
        });
      } else {
        this.props.init_notification({
          type: "error",
          title: this.props.locale.error,
          message: this.props.locale.quantity_err
        });
        setTimeout(
          () =>
            this.props.history.push({
              pathname: `/${lang}/cart`
            }),
          2000
        );
      }

      this.toggle_busy();
    } catch (e) {
      if (e.data.invalid_promocode) {
        this.props.setCodeError(e.data.message);
      }
      if (e.status === 400 && e.data.redirect) {
      }
      this.props.init_notification({
        type: "error",
        title: this.props.locale.error,
        message: this.props.locale.quantity_err
      });
      this.toggle_busy();
    }
  };

  payKIOSK = () => {
    this.props.history.push(
      `/payment/callback?paymentMethod=${KIOSK}&amount_cents=${this.props
        .total * 1000}`
    );
  };

  renderAman = () => (
    <div>
      <div className="image-desc-container">
        <h1 className="pay-text">{this.props.locale.pay_with_text} </h1>
        <PaymentWay />
      </div>

      {/* <h1 className="details-font tex-breaker">
        {this.props.locale.safe_money_p}
        <br />
        Maestro, Discover, American Express.
      </h1> */}
    </div>
  );
  renderMasterCardForm = () => {
    const { ischecked, ccv } = this.state;
    const { locale } = this.props;
    return (
      <iframe
        title="Credit Card Payment"
        src={`${CARD_PAYMENT_IFRAME}${
          this.props.lang == "ar" ? AR_FRAME_ID : EN_FRAME_ID
        }?payment_token=${this.props.payment_token}`}
        style={{ width: "100%", height: "100%" }}
      />
    );
  };
  renderMasterCard = () => (
    <div>
      <div className="image-desc-container">
        <h1 className="pay-text">
          {this.props.locale.checkout_page.credit_card_title_head}
        </h1>
        <img src={Images.creditCard} alt="Credit Card" />
      </div>
      {/* <h1 className="details-font tex-breaker">
        {this.props.locale.safe_money_p}
        <br />
        Maestro, Discover, American Express.
      </h1> */}
    </div>
  );

  renderEmptyWallet = () => (
    <div className="disabled-wallet">
      <div className="wallet-balance">
        <h1 className="pay-text">
          {this.props.locale.checkout_page.wallet_title_head}
        </h1>
        <h2 className="empty-wallet">
          {this.props.locale.checkout_page.empty_wallet_text}{" "}
        </h2>
      </div>

      {/* <h1 className="details-font tex-breaker">
        {this.props.locale.checkout_page.safe_money_p}
        <br />
        Maestro, Discover, American Express.
      </h1> */}
    </div>
  );

  naviagateNext = () => this.Tabs.navigateNext();

  navigatePrevious = () => this.Tabs.navigatePrevious();

  renderCashOnDelivery = () => (
    <div>
      <div className="image-desc-container">
        <h1 className="pay-text">
          {this.props.locale.checkout_page.cash_on_delivery_title_head}
        </h1>
        {/* <FontAwesomeIcon icon={faTruck} color="#599de5" /> */}
      </div>

      {/* <h1 className="details-font tex-breaker">
        {this.props.locale.checkout_page.safe_money_p}
        <br />
        Maestro, Discover, American Express.
      </h1> */}
    </div>
  );

  renderPayment = () => {
    const { wallet = {}, locale } = this.props;
    const { payment_option, is_busy } = this.state;

    return (
      // <div className="columns is-multiline ">
      <React.Fragment>
        {/* { <RadioRaw
          locale={locale}
          renderContentAlign={this.renderAman}
          isSelected={payment_option === KIOSK}
          selectRow={() => this.setState({ payment_option: KIOSK })}
          naviagateNext={this.payKIOSK}
          is_busy={is_busy}
        />} */}

        <RadioRaw
          locale={locale}
          renderContentAlign={this.renderCashOnDelivery}
          isSelected={payment_option === 4}
          selectRow={() => this.setState({ payment_option: 4 })}
          naviagateNext={this.newOrder}
          is_busy={is_busy}
        />

        {wallet && wallet.balance > 0 ? (
          <RadioRaw
            locale={locale}
            renderContentAlign={this.renderWallet}
            isSelected={payment_option === 3}
            selectRow={() => this.setState({ payment_option: 3 })}
            naviagateNext={this.newOrder}
            is_busy={is_busy}
          />
        ) : (
          <RadioRaw
            locale={locale}
            renderContentAlign={this.renderEmptyWallet}
            isSelected={payment_option === 3}
            selectRow={() => this.setState({ payment_option: 3 })}
            isdisabled
            naviagateNext={this.newOrder}
            is_busy={is_busy}
          />
        )}

        {/*<RadioRaw
          locale={locale}
          renderContentAlign={this.renderMasterCard}
          isSelected={payment_option === 1}
          nobutton={true}
          selectRow={() => this.setState({ payment_option: 1 })}
          renderAdds={this.renderMasterCardForm}
          naviagateNext={this.newOrder}
          is_busy={is_busy}
          on_focus={this.check_order}
        />*/}
      </React.Fragment>
    );
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.address !== prevState.address) {
      // nextProps.toggleDisabled();
      return {
        address_id: nextProps.address.length ? nextProps.address[0].id : null,
        address: nextProps.address
      };
    } else return null;
  }

  drawAddressRow = () => {
    const { address } = this.props;
    const { address_id } = this.state;
    return address.map((item, i) => {
      let className =
          " column  is-6-tablet is-12-desktop  is-12-mobile   save-address-row-conatienr   ",
        isSelected = item.id == address_id;

      if (isSelected) {
        className += " active-address-row";
      }

      // if(this.props.address[0].id == item.id && this.props.address[0].id != address_id){
      //   isSelected = true;
      // }

      return (
        <div
          className={className}
          onClick={() => {
            this.selectAddress(item.id);
            this.props.toggleDisabled();
          }}
          key={i}
        >
          <div className="columns is-multiline ">
            <div className="column is-12">
              <div className="columns is-multiline  arabic-address">
                <div className="column is-one-third-desktop is-full-touch">
                  <div className="columns is-multiline is-mobile ar-radio">
                    <div className="column  is-1-desktop  is-1-mobile is-1-tablet  ">
                      <Radio ischecked={isSelected} />
                    </div>
                    <div className="column is-10-desktop is-11-mobile  is-11-tablet address-details-container ">
                      <div className="address-info">
                        <h1>{`${item.city_name}, ${item.area_name}`}</h1>
                        <p>{item.address_line_1}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="column is-1-touch is-1-tablet is-hidden-desktop" />

                <div className="column is-4-desktop is-11-mobile is-11-tablet delievry-font  details-font ">
                  <p>{this.props.locale.shipping_period}</p>
                </div>
                <div className="column is-4-touch is-1-desktop" />

                <div
                  className={`column is-3 is-full-mobile rm-btn-container is-flex`}
                  style={{
                    justifyContent:
                      this.props.match.params.lang == "ar"
                        ? "flex-start"
                        : `flex-end`
                  }}
                >
                  <TButton
                    ariaLabel="Remove Address"
                    text={this.props.locale.remove}
                    className="text-button remove-address-button"
                    onPress={e => {
                      e.stopPropagation();
                      this.props.delAddress(item.id);
                      // this.setState({address_id: null});
                      // this.props.toggleDisabled();
                      // localStorage.removeItem("address_id");
                      this.setState({
                        address_id: null
                      });
                      // this.props.toggleDisabled();
                      // localStorage.setItem("address_id", null)
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  renderPaymentSec = () => {
    const { locale } = this.props;
    return (
      <div className="tabs_shipping-info-container">
        <div className="payment-title">
          {locale.checkout_page.choose_payment_method_title}
        </div>
        {/* <div className="column">{this.renderPayment()}</div> */}
        {this.renderPayment()}

        <div className="back-btn-container is-hidden-mobile is-hidden-tablet-only">
          <TButton
            ariaLabel="Back"
            text={locale.checkout_page.back_to_shipping_info_button_placeholder}
            className="back-btn-text"
            leftIcon={faArrowLeft}
            rightIcon={faArrowRight}
            onPress={() => this.navigatePrevious()}
            lang={this.props.match.params.lang}
          />
        </div>
        <div />
      </div>
    );
  };

  updateAddress = data => {
    this.props.addNewAddress(data);
  };

  renderShippingSec = () => (
    <div className="tabs_shipping-info-container ">
      <AddressPopUp
        updateAddress={this.updateAddress}
        ref={a => (this.AddressPopup = a)}
        lang={this.props.lang}
        translation={this.props.locale}
        address={this.props.address}
        updateAddressId={this.updateAddressId}
        lang_id={this.props.lang_id}
      />
      <TButton
        ariaLabel="Add Address"
        id={`add-address`}
        text={this.props.locale.shop_add_address_button}
        className="cancel-table-btn"
        onPress={this.openPopUp}
      />

      <h2 className="subtitle">
        {this.props.locale.shop_addresses_table_title}
      </h2>

      <div className="columns is-multiline   selected-address-containers ">
        {this.drawAddressRow()}
      </div>

      <div className="button-Container is-hidden-mobile  is-hidden-tablet-only  ">
        {/* <TButton
          ariaLabel="Continue"
          text={this.props.locale.continue_button}
          // className="continue-table-btn"
          className={`grad-blue full button ${this.props.disabled || this.state.address_id == null ? "tooltip" : ""}`}
          tip={this.props.locale.select_address_tooltip}
          onPress={this.naviagateNext}
          disabled={this.props.disabled || this.state.address_id == null || localStorage.getItem("address_id") != null ? false : this.props.disabled}
        /> */}

        <TButton
          ariaLabel="Continue"
          text={this.props.locale.continue_button}
          // className="continue-table-btn"
          className={`grad-blue full button ${
            this.state.address_id == null ? "tooltip" : ""
          }`}
          tip={this.props.locale.select_address_tooltip}
          onPress={this.naviagateNext}
          disabled={this.state.address_id == null && this.props.disabled}
        />
      </div>
    </div>
  );

  render() {
    const { locale } = this.props;
    return (
      <Tabs ref={t => (this.Tabs = t)}>
        <div label={locale.shipping_info_tab} indicator={0}>
          {this.renderShippingSec()}
        </div>

        {!this.props.disabled ? (
          <div label={locale.payment_tab} indicator={1} isTabDisabled>
            {this.renderPaymentSec()}
          </div>
        ) : this.state.address_id == null ? (
          <div label={locale.payment_tab} indicator={1} isTabDisabled>
            {this.renderPaymentSec()}
          </div>
        ) : (
          <div label={locale.payment_tab} indicator={1}>
            {this.renderPaymentSec()}
          </div>
        )}

        <div label={locale.done_tab} indicator={2} isTabDisabled>
          {null}
        </div>
      </Tabs>
    );
  }
}

export { CheckoutTabs };
