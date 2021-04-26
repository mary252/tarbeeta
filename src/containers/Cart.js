import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Page,
  EmptyPage,
  BreadCrumb,
  DropDown,
  withLoader,
  VerificationPopup,
  TextIconBtnDel,
  TextIconBtnFav,
  ProductCell,
  ReceiptDesktop,
  CartNotification,
  PageTitle,
  ReceiptMobile,
  CartPlaceholder
} from "../components";
import * as actions from "../actions";
import {
  arrNumGen,
  featchCartTotal,
  delfromCart,
  like,
  updateVariationQty,
  featchCart,
  loadPending,
  paymentInit,
  applyCode
} from "../services";
import { isLoggedIn } from "../ultils";
import "../components/Cart/cart.css";
const mapStateToProps = state => {
  const {
    user: { mobile_verified, mobile }
  } = state;
  return {
    mobile_verified,
    mobile
  };
};

export class CartPage extends Component {
  state = {
    products: [],
    shops: [],
    notifications: [],
    total: 0,
    currency: "",
    collapsed: false,
    products_count: 0,
    willPaymentInit: false,
    loading: false,
    is_busy: false,
    topPosition: 0,
    sub_total: 0,
    discount: 0,
    // promo_id: null,
    is_code_valid: false,
    promo_code: null,
    promo_codeError: ""
  };

  VerificationPopup = null;
  openPopUp = () => this.VerificationPopup.toggle();

  async componentDidMount() {
    window.scroll({ top: 0, left: 0, behavior: "smooth" });

    this.setState({ loading: true });
    let lang_id = this.props.lang_id;

    if (isLoggedIn()) await this.checkPayment();

    await this.getCartTotal(lang_id);

    await this.getCartProducts(lang_id);
    this.setState({ loading: false });
  }

  toggle_busy = () => this.setState({ is_busy: !this.state.is_busy });

  updateQty = async (variation_id, qty, shop_index, product_index) => {
    try {
      let res = await updateVariationQty({ variation_id, qty });
      let shops = [...this.state.shops];

      shops[shop_index].products[product_index].qty = qty;

      await this.setState({
        shops,
        total: res.data.total,
        sub_total: res.data.sub_total
      });
      this.props.init_notification({
        type: "success",
        title: this.props.locale.success,
        message: this.props.locale.cart_updated_message
      });
    } catch (e) {
      this.props.init_notification({
        type: "error",
        title: this.props.locale.error,
        message: this.props.locale.error_message
      });
    }
  };

  getCartTotal = async lang_id => {
    try {
      let res = await featchCartTotal(lang_id);
      const { sub_total, discount, total, currency } = res.data;
      this.setState({ sub_total, discount, total, currency });
    } catch (e) {}
  };

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  checkPayment = async () => {
    try {
      let res = await loadPending();

      if (!res.data) {
        this.setState({ willPaymentInit: true });
      }
    } catch (e) {}
  };

  getCartProducts = async lang_id => {
    try {
      let res = await featchCart(lang_id),
        alldata = res.data.filter(x => Boolean(x.products));
      let products_count = this.getProductsCount(alldata);

      let notifications = this.notificationGenerator(alldata);

      this.setState({ shops: alldata, products_count, notifications });
    } catch (e) {
      // console.log(e);
    }
  };
  isShopHasOneEmptyStock = shopProducts =>
    shopProducts.filter(product => product.stock > 0).length > 0;

  getProductsCount = productsByShop =>
    [].concat(...productsByShop.map(x => x.products.filter(y => y.stock > 0)))
      .length;

  checkOut = async () => {
    if (!isLoggedIn()) {
      localStorage.setItem("destination", "cart");
      return this.props.history.push(`/${this.props.lang}/login`);
    }
    if (this.props.mobile == null) {
      localStorage.setItem("destination", "cart");
      return window.location.assign(`/${this.props.lang}/mobile`);

      // window.location.href = `/${this.props.match.params.lang}/mobile`);
      // return this.props.history.push(`/${this.props.match.params.lang}/mobile`);
    } else {
      try {
        if (!this.props.mobile_verified) {
          this.openPopUp();
        } else {
          this.toggle_busy();

          const { willPaymentInit, total } = this.state;
          if (willPaymentInit) {
            await paymentInit({ amount_cents: parseFloat(total) * 10 * 10 });
          }
          this.toggle_busy();

          this.props.history.push({
            pathname: `/${this.props.lang}/checkout`,
            state: { navFromCart: true }
          });
        }
      } catch (e) {
        this.props.init_notification({
          type: "error",
          title: this.props.locale.error,
          message: this.props.locale.error_message
        });
        this.toggle_busy();
      }
    }
  };

  del = async (variation_id, shop_index) => {
    try {
      let res = await delfromCart(variation_id);

      let shops = [...this.state.shops];

      if (undefined !== shop_index) {
        shops[shop_index].products = shops[shop_index].products.filter(
          a => a.variation_id !== variation_id
        );
        if (!shops[shop_index].products.length) {
          shops = shops.filter((el, i) => i !== shop_index);
        }
      }

      this.setState(state => ({
        shops,
        notifications: state.notifications.filter(
          x => x.variation_id !== variation_id
        ),
        products_count: state.products_count > 0 ? state.products_count - 1 : 0
      }));

      this.getCartTotal(this.props.lang_id);

      this.props.getNumberOfcart();
      this.props.init_notification({
        type: "success",
        title: this.props.locale.success,
        message: this.props.locale.cart_updated_message
      });
    } catch (e) {
      this.props.init_notification({
        type: "error",
        title: this.props.locale.error,
        message: this.props.locale.error_message
      });
    }
  };

  likeProdcut = async ({ variation_id, product_id, colour_id }, shop_index) => {
    try {
      await like(product_id, colour_id, this.props.lang);

      await this.del(variation_id, shop_index);
    } catch (e) {
      this.props.init_notification({
        type: "error",
        title: this.props.locale.error,
        message: this.props.locale.error_message
      });
    }
  };

  notificationGenerator = productsByShop =>
    [].concat(...productsByShop.map(x => x.products.filter(y => y.stock <= 0)));

  getTotalPrice = (price, qty) =>
    (parseFloat(price) * parseFloat(qty)).toFixed(2);
  renderRow = ({ shop_username, name, products }, shop_index) =>
    products.map((product, i) =>
      product.stock > 0 ? (
        <div className="products_container__row " key={i}>
          <div className="columns  is-multiline">
            <div className="column is-3-desktop  is-12-mobile  is-5-tablet ">
              <div className="products_container__row--cell">
                <ProductCell
                  {...product}
                  shopId={shop_username}
                  lang={this.props.lang}
                  name={name}
                />
              </div>
            </div>

            <div className="column is-2  is-6-mobile is-flex aic is-hidden-mobile	is-hidden-tablet-only">
              <div className="products_container__row--cell">
                <span className=" text-price-desktop products_container__money-font">
                  {product.price} {product.currency}
                </span>{" "}
              </div>
            </div>

            <div className="column  is-2-desktop is-hidden-mobile  is-hidden-tablet-only is-flex aic">
              <div className="text_input">
                <DropDown
                  ariaLabel="Select Stock"
                  options={arrNumGen(product.stock)}
                  selected={product.qty}
                  onSelect={e =>
                    this.updateQty(
                      product.variation_id,
                      e.target.value,
                      shop_index,
                      i
                    )
                  }
                />
              </div>
            </div>

            <div className="column   is-hidden-desktop	 is-12-mobile  mobile-cell-row  ">
              <div className="table-cell-price-mobile">
                <div className="text_input">
                  <DropDown
                    ariaLabel="Select Quantity"
                    options={arrNumGen(product.stock)}
                    selected={product.qty}
                    onSelect={e =>
                      this.updateQty(product, e.target.value, shop_index, i)
                    }
                  />
                </div>
              </div>
              <div className="table-cell-price-mobile">
                <span className="products_container__total-font">
                  Total Price
                </span>
                <span className="products_container__money-font">
                  {this.getTotalPrice(product.price, product.qty)}{" "}
                  {product.currency}
                </span>
              </div>
            </div>

            <div className="column  is-2-desktop   is-hidden-mobile is-hidden-tablet-only is-flex aic">
              <div className="table-cell-price-mobile">
                <span className="products_container__money-font">
                  {this.getTotalPrice(product.price, product.qty)}{" "}
                  {product.currency}
                </span>
              </div>
            </div>

            <div className="column is-3-desktop  is-12-mobile  is-12-tablet action_buttons">
              <TextIconBtnDel
                onClick={() => this.del(product.variation_id, shop_index)}
                text={this.props.locale.remove}
              />

              <TextIconBtnFav
                onClick={() => this.likeProdcut(product, shop_index)}
                text={this.props.locale.save_to_later}
              />
            </div>
            <div className="column is-hidden-desktop is-1" />
          </div>
        </div>
      ) : null
    );

  draw_shop_card = () =>
    this.state.shops.map((x, y) =>
      this.isShopHasOneEmptyStock(x.products) ? (
        <div className="products_container" key={y}>
          <div className="columns is-hidden-mobile  is-hidden-tablet-only	products_container__head columns__no-margin-bottom">
            <div className="column is-3 products_container__head--cell">
              <span>{this.props.locale.data_table.item_label}</span>
            </div>

            <div className="column is-2 products_container__head--cell">
              <span>{this.props.locale.data_table.item_price_label}</span>
            </div>

            <div className="column is-2 products_container__head--cell">
              <span>{this.props.locale.data_table.quantity_label}</span>
            </div>

            <div className="column is-2 products_container__head--cell">
              <span>{this.props.locale.data_table.total_price}</span>
            </div>
            <div className="column is-1 products_container__head--cell" />
            <div className="column is-2 products_container__head--cell" />
          </div>

          {this.renderRow(x, y)}
        </div>
      ) : null
    );

  renderNotification = () =>
    this.state.notifications.map((noti, i) => (
      <CartNotification
        locale={this.props.locale}
        lang={this.props.lang}
        product={noti}
        key={i}
        onClick={this.del}
      />
    ));

  // checkPromoCode = e => {
  //   this.setState({ [e.target.name]: e.target.value }, this.checkCode);
  // };
  checkCode = async () => {
    try {
      const { id, promo_code } = this.state;
      let res = await applyCode(promo_code);
      const {
        data: { sub_total, discount, total, currency },
        promo_id = 1
      } = res;
      this.setState({
        sub_total,
        discount,
        total,
        currency,
        is_code_valid: true
      });

      this.props.init_notification({
        type: "success",
        title: this.props.locale.success,
        message: this.props.locale.promo_success
      });

      setTimeout(() => this.setState(() => ({ promo_id })), 2000);
    } catch ({ data: { message = "" } = {} }) {
      this.setState({
        is_code_valid: false,
        promo_codeError: message
      });
    }
  };
  setCodeError = promo_codeError => this.setState({ promo_codeError });

  render() {
    const {
      state: {
        total,
        currency,
        products_count,
        is_busy,
        sub_total,
        discount,
        promo_id,
        is_code_valid,
        loading
      },
      props: { mobile_verified, locale, lang }
    } = this;

    return (
      <Page
        title={locale.cart_page_title}
        description={locale.cart_page_desc}
        {...this.props}
      >
        <VerificationPopup
          ref={a => (this.VerificationPopup = a)}
          lang={this.props.lang}
          translation={locale}
          code={1}
        />
        <div className="section">
          <div className="container main-container">
            <BreadCrumb
              history={[
                {
                  name: this.props.locale.tarbeeta,
                  href: `/${this.props.lang}`
                }
              ]}
              activeRoute={this.props.locale.cart_page_title}
            />
            <PageTitle
              title={this.props.locale.cart_page_title}
              z
              count={products_count}
              label={this.props.locale.items_label}
              withCount
            />

            {loading ? (
              <CartPlaceholder
                array={Array(4).fill(0)}
                locale={locale}
                lang={lang}
              />
            ) : this.state.shops.length ? (
              <>
                <div className="columns is-multiline columns__no-margin-bottom">
                  <div className="column  is-9-desktop  is-12-tablet no-margin-horizontal notification__no-paddin-bottom">
                    {this.renderNotification()}
                  </div>
                  {/* <div className="column is-3-desktop   is-12-tablet no-margin-horizontal ">
                    <DeliverySection location={"Cario"} />
                  </div> */}
                </div>

                <div className="columns is-multiline columns__no-margin-bottom">
                  <div className="column is-9-desktop is-12-tablet no-margin-horizontal ">
                    {this.draw_shop_card()}
                  </div>

                  <div className="column is-3-desktop no-margin-horizontal">
                    {total > 0 && (
                      <>
                        <div className="is-hidden-desktop">
                          <ReceiptMobile
                            withCode={isLoggedIn() && discount <= 0}
                            isexpandable
                            onClick={this.checkOut}
                            total={total}
                            currency={currency}
                            is_busy={is_busy}
                            locale={locale}
                            btnText={locale.checkout}
                            mobile_verified={
                              isLoggedIn() ? mobile_verified : true
                            }
                            promo_code={this.state.promo_code}
                            promo_codeError={this.state.promo_codeError}
                            is_code_valid={is_code_valid}
                            // checkPromoCode={this.checkPromoCode}
                            checkCode={this.checkCode}
                            sub_total={sub_total}
                            discount={discount}
                            saveToState={this.saveToState}
                          />
                        </div>
                        <div
                          className="is-hidden-mobile is-hidden-tablet-only sticky-invoice"
                          ref={this.receiptDesktop}
                        >
                          <ReceiptDesktop
                            withCode={isLoggedIn() && discount <= 0}
                            // topPosition={this.state.topPosition}
                            withButton
                            onClick={this.checkOut}
                            total={total}
                            currency={currency}
                            is_busy={is_busy}
                            locale={locale}
                            promo_code={this.state.promo_code}
                            promo_codeError={this.state.promo_codeError}
                            checkPromoCode={this.checkPromoCode}
                            checkCode={this.checkCode}
                            is_code_valid={is_code_valid}
                            mobile_verified={
                              isLoggedIn() ? mobile_verified : true
                            }
                            saveToState={this.saveToState}
                            sub_total={sub_total}
                            discount={discount}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <EmptyPage
                locale={locale}
                {...this.props}
                lang={this.props.lang}
                emptyCart
              />
            )}
          </div>
        </div>
      </Page>
    );
  }
}

export default connect(
  mapStateToProps,
  actions
)(CartPage);
