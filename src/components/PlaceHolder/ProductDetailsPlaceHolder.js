import React, { Component } from "react";
import HorizontalLines from "./HorizontalLines";
import Circle from "./Circle";
import Line from "./Line";

import "./PlaceHolder.css";

const logo = require("../../assets/images/logo-copy@2x.jpg");
class ProductPlaceHolder extends Component {
  draw_product_pictures = () => {
    return [1, 2, 3, 4, 5, 6].map(i => (
      <div className="product-img is-flex jcc aic">
        <img src={logo} alt="..." width="35px" height=" 35px" />
      </div>
    ));
  };

  render() {
    const {
      lang,
      locale: { color, size, qty }
    } = this.props;
    return (
      <div className={`details `}>
        <div
          className="columns is-multiline"
          style={{ flexDirection: lang == "en" ? "row" : "row-reverse" }}
        >
          <div className="column is-6-desktop is-full-touch is-flex ">
            <div
              className={`side-pic-div ${
                lang == "en" ? "mar-20-p-r" : "mar-20-p-l"
              }`}
            >
              {this.draw_product_pictures()}
            </div>

            <div className="is-flex flex-column ">
              <div className="product-pic is-flex jcc aic">
                <img src={logo} alt="..." width="58px" height=" 57px" />
              </div>

              <div class="is-flex mar-top-15 social-share-wrap jcc">
                {[1, 2, 3, 4, 5, 6].map(() => (
                  <div className="social-share-button no-pad-bottom">
                    <Circle />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="column is-6-desktop is-full-touch">
            <div className="columns is-mobile">
              <div className="column is-9-tablet is-7-desktop">
                <div className="is-flex aic">
                  <Circle />
                  <Line width={144} />
                </div>
                <Line />
                <div className="stars">
                  <Line width={144} />
                </div>

                <div className="is-flex">
                  <Line width={"25%"} />
                </div>
              </div>
            </div>
            <div className="is-flex ">
              <Line width={"40%"} />
            </div>

            <div className="product-options">
              <p className="attr-title">{color}</p>
              <div className="is-flex ">
                <Line width={"30%"} />
              </div>

              <p className="attr-title">{size}</p>

              <div className="is-flex ">
                <Line width={"35%"} />
              </div>

              <p className="attr-title">{qty}</p>

              <div className="is-flex ">
                <Line width={"40%"} />
              </div>
            </div>

            <div className="is-flex ">
              <div className=" animated-background button-place-holder wid-40" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductPlaceHolder;
