import React, { Component } from "react";
import { CheckoutTabs } from "../components/Checkout";
import { ProductThumbnail } from "./Cart/ProductThumbnail";
import "./Checkout/checkout.css";

class BuyNow extends Component {

  renderProduct = () => {
    const { image, price, qty, name } = this.props.product;
    return (
      <div className="columns is-multiline  is-gapless raw-pro-container">
        <div className="column is-three-quarters ">
          <div className="columns product-container is-gapless is-paddingless">
            <div className="column is-1" />
            <div className="column is-1  buy-now-text ">Buy Now</div>
            {/* <div className="column is-1" /> */}
            <div className=" column is-1  img-pro-container  ">
              <ProductThumbnail link={image} />
            </div>
            {/* <div className="column is-1 " /> */}

            <div className="column is-3 product-title-pop   is-paddingless is-marginless">
              {name}
            </div>
            <div className="column is-1  " />

            <h1 className="column is-1 quantity-font-horizonatl ">
              {`Qty: ${qty}`}
            </h1>
            <div className="column is-1" />

            <h1 className="column is-2 text-price-list">{`${price} EGP`}</h1>
          </div>
        </div>
      </div>
    );
  };
  render() {
    return (
      <div className="pop-buy">
        <div>{this.renderProduct()}</div>
        <div>
          <CheckoutTabs {...this.props} locale={this.props.locale} />
        </div>
      </div>
    );
  }
}

export default BuyNow;
