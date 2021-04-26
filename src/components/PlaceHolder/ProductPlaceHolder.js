import React, { Component } from "react";
import HorizontalLines from "./HorizontalLines";
import "./PlaceHolder.css";
class ProductPlaceHolder extends Component {
  render() {
    const { lang } = this.props;
    return (
      <div
        className="column is-one-fifth-desktop is-4-tablet is-half-mobile "
        dir={lang == "ar" ? "rtl" : "ltr"}
      >
        <div className="product-card" style={{ border: "1px solid lightgray" }}>
          <div className="image-place-holder">
            <img
              src={require("../../assets/images/logo-copy@2x.jpg")}
              alt="..."
              width="58px"
              height=" 57px"
            />
          </div>
          <HorizontalLines lang={lang} />
          <div className=" animated-background button-place-holder" />
        </div>
      </div>
    );
  }
}

export default ProductPlaceHolder;
