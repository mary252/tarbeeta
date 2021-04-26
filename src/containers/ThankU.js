import React, { Component } from "react";
import {
  PageTitle,
  Page,
  Tabs,
  TButton,
  CheckoutReceiptMobile,
  CartsCheckoutSection,
  PaymentWay,
  HorizontalProductsList
} from "../components";
import "../components/Cart/cart.css";
import "../components/Form/Tabs/tabs.css";
import "../components/Checkout/checkout.css";
import {
  getCartSeller,
  fetchFinishedOrder,
  featchCartTotal,
  fetchSingleOrder
} from "../services";

class ThankUPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      po: null,
      oid: null,
      total: 0,
      products: [],
      currency: "",
      order: {},
      no_order: false
    };
    this.Tabs = null;

    if (!props.location.state) props.history.push(`${props.lang}/orders`);
  }

  onCCVChange = e => {
    if (e.target.value.length === 5) {
      return;
    }
    this.setState({ [e.target.name]: e.target.value });
  };

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  async componentDidMount() {
    this.setState({ loading: true });
    this.controlReload();

    let { id } = this.props.match.params,
      lang_id = this.props.lang_id;

    await this.getOrderDetails(id, lang_id);

    // await this.getRecieptProducts(lang_id);

    // await this.getOrder(lang_id);
    // await this.getCartTotal(lang_id);

    // this.setState({ po, loading: false });
  }
  selectAddress = currentSelectedAddress => {
    this.setState({ currentSelectedAddress });
  };
  getRecieptProducts = async lang_id => {
    try {
      let res = await getCartSeller(lang_id);

      let products = res.data;

      this.setState({ products });
    } catch (e) {}
  };

  getCartTotal = async lang_id => {
    try {
      let res = await featchCartTotal(lang_id);

      const { total, currency } = res.data;
      this.setState({ total, currency });
    } catch (e) {}
  };

  getOrderDetails = async (order_id, lang_id) => {
    try {
      let res = await fetchSingleOrder(order_id, lang_id),
        order = res.data[0];
      if (!order) {
        this.setState({ no_order: true });
        return;
      }
      this.setState({ order });
    } catch (e) {
      this.setState({ no_order: true });
    }
  };
  controlReload = () => {
    if (window.performance) {
      if (performance.navigation.type == 1) {
        this.props.history.push(`/${this.props.lang}/orders`);
      }
    }
  };

  goToOrder = () => this.props.history.push(`/${this.props.lang}/orders`);

  getOrder = async lang_id => {
    try {
      let res = await fetchFinishedOrder(lang_id);
    } catch (e) {}
  };

  getProductsPerSeller = () => {
    const {
      order: { chunks = [] }
    } = this.state;
    return chunks.map(x => ({
      id: x.shop_id,
      shop_total_price: x.total,
      total_items: x.items.length,
      avatar: x.avatar,
      name: x.shop_name,
      tracking_number: x.tracking_number
    }));

    // return [].concat(...chunks.map(x => ({shop_total_price:x.items.reduce((x,y)=>x+y) })));
  };

  renderDoneSec = () => {
    const {
      state: {
        po,
        order: {
          chunks = [],
          payment_method_id,
          total,
          currency,
          kiosk_confirmation_code
        },
        no_order
      },
      props: {
        locale: {
          receipt,
          amount_required,
          order_status,
          use_code,
          message_code,
          payemn_message,
          congratulation,
          ur_order,
          order_success,
          go_order,
          no_order_here
        }
      }
    } = this;
    return (
      <div className=" columns is-multiline   done-shipping-section is-gapless ar-radio">
        <div className="column is-9  no-margin-padding ">
          {undefined !== payment_method_id && payment_method_id == 2 ? (
            <div>
              <h1 className="done-title column is-paddingless">
                {order_status}
              </h1>
              <div className="code-row column  is-paddingless ">
                <div className="columns ar-radio">
                  <h1 className="done-pay-text column ">{use_code}</h1>
                  <h1 className="code-text column">
                    {kiosk_confirmation_code}
                  </h1>
                  <div className="column">
                    <PaymentWay />
                  </div>
                </div>
              </div>
              <div className="column is-12-desktop is-12-mobile is-paddingless amount-container ">
                <div className="columns ar-radio">
                  <h2 className="column is-2-desktop amount-req-text">
                    {amount_required}
                  </h2>
                  <div className="column is-2-desktop is-hidden-mobile" />

                  <h2 className="column is-2-desktop total-text-amount">
                    {total} {currency}
                  </h2>
                </div>
              </div>

              <p className="column is-12-mobile instruction-text  ">
                {message_code} <br />
                {payemn_message}
              </p>
            </div>
          ) : (
            <div>
              <h1 className="success-title column ">{congratulation}</h1>

              {/* <p className="column is-12-mobile  is-6-desktop instruction-text ">
                Lorem ipsum dolor sit amet, consectetur adipiscing <br /> elit,
                sed do eiusmod tempor incididunt ut labore
                <br /> et dolore magna aliqua. Ut enim ad minim veniam
              </p> */}
            </div>
          )}

          {/* {chunks.map((item, i) => ( */}
          <div className="column  is-8-desktop is-paddingless ">
            <HorizontalProductsList
              showTrackingNumber={!(payment_method_id == 2)}
              locale={this.props.locale}
              products={this.getProductsPerSeller()}
              lang={this.props.lang}
              // key={i}
            />
          </div>
          {/* ))} */}
        </div>

        <div className="column is-3 done-total-sec-container no-margin-padding ">
          <div className="is-hidden-mobile  is-hidden-tablet-only done-total-sec">
            <h2 className="column is-2-desktop total-desktop">
              {receipt.total_mobile_placeholder}
            </h2>
            <h2 className="column is-2-desktop total-text-amount-desktop">
              {total} {currency}
            </h2>
          </div>
        </div>

        <nav className="level no-background is-hidden-mobile is-hidden-tablet-only ">
          <div className="level-left" />

          <div className="level-right ar">
            <TButton
              ariaLabel="Go To Order"
              text={go_order}
              className="continue-table-btn"
              onPress={this.goToOrder}
            />
          </div>
        </nav>
      </div>
    );
  };

  render() {
    const {
      state: {
        order: { total, currency, sub_total, discount },
        no_order
      },
      props: { locale }
    } = this;
    if (no_order) {
      return <div>{locale.no_order_here}</div>;
    }
    return (
      <Page
        title={locale.thnx_title}
        description={locale.description}
        {...this.props}
      >
        <div className="section">
          <div className="container main-container">
            <PageTitle title={locale.thnx_title} />
            <div className="columns  columns__no-margin-bottom">
              <div className="column  is-9-desktop  is-12-tablet is-12-mobile tabs-left-container">
                <Tabs ref={t => (this.Tabs = t)} defaultTab={2}>
                  <div
                    label={locale.shipping_info_tab}
                    indicator={0}
                    isTabDisabled
                  >
                    {null}
                  </div>
                  <div
                    label={locale.payment_tab}
                    indicator={1}
                    disabled
                    isTabDisabled
                  >
                    {null}
                  </div>
                  <div label={locale.done_tab} indicator={2}>
                    {this.renderDoneSec()}
                  </div>
                </Tabs>
              </div>
              <div className="column is-3-desktop right-container">
                <div className="is-hidden-desktop">
                  <CheckoutReceiptMobile
                    promo_id={1}
                    onClick={this.naviagateNext}
                    total={total}
                    locale={locale}
                    currency={currency}
                  />
                </div>
                <div className="is-hidden-mobile is-hidden-tablet-only">
                  <CartsCheckoutSection
                    promo_id={1}
                    lang={this.props.lang}
                    total={total}
                    locale={locale}
                    sub_total={sub_total}
                    discount={discount}
                    currency={currency}
                    products={this.getProductsPerSeller()}
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

export default ThankUPage;
