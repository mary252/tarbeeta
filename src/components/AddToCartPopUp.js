import React, { Component } from "react";
import { Modal } from "./Layout";
import { TButton } from "./Form";

class AddToCartPopUp extends Component {
  static propTypes = {};

  constructor() {
    super();
    this.modal = null;
  }

  toggle = () => {
    this.modal.toggle();
  };

  state = {
    is_busy: false,
    review: null,
    reviewError: ""
  };

  go_to_cart = () => {
    this.setState({ is_busy: true });

    this.props.history.push({
      pathname: `/${this.props.lang}/cart`
    });
    this.toggle();

    this.setState({ is_busy: false });
  };

  render() {
    const {
      state: { is_busy, lang },
      props: {
        cartPopUp: { currentVariation, name, qty, price, currency_name },
        locale
      }
    } = this;

    return (
      <Modal ref={m => (this.modal = m)} colsize={5}>
        <div className="address-popup" onClick={e => e.stopPropagation()}>
          <div className="address-popup-div">
            <div className="add-to-cart-popup">
              <div className="columns is-mobile">
                <div className="column is-12 is-flex aic">
                  <div
                    className={`add-to-cart-popup-img`}
                    style={{
                      background: `url('${
                        currentVariation.hoveredImage
                      }') no-repeat`
                    }}
                  />
                  <div className="name-qty-price">
                    <h3 className="mar-bot-10">{name}</h3>
                    <h4 className="mar-bot-10">
                      {locale.qty}: {qty == null ? 1 : qty}
                    </h4>
                    <h2 className={`${lang == "ar" ? "rtl" : ""}`}>
                      {price}
                      <span
                        className={`mar-${lang == "en" ? "left" : "right"}-5`}
                      >
                        {currency_name}
                      </span>
                    </h2>
                  </div>
                </div>
              </div>
            </div>

            <div className="columns is-mobile">
              <div className="column is-6">
                <TButton
                  text={locale.continue_shopping_btn_placeholder}
                  onPress={this.toggle}
                  className="blue outline"
                  ariaLabel="Continue Shopping"
                />
              </div>
              <div className="column is-2 " />
              <div className="column is-4">
                <TButton
                  text={locale.go_to_cart_btn_placeholder}
                  onPress={this.go_to_cart}
                  className="grad-blue full button"
                  loading={is_busy}
                  id="go-to-cart-btn"
                  ariaLabel="Go To Cart"
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default AddToCartPopUp;
