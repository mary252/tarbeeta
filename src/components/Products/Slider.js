import React, { Component } from "react";
import { SliderButton } from "../../components/Form";
import ProductCard from "../../components/Products/ProductCard";
import ProductPlaceHolder from "../../components/PlaceHolder/ProductPlaceHolder";
import Line from "../../components/PlaceHolder/Line";
import "./Slider.css";

import ShopCard from "../Shop/ShopCard";

class Slider extends Component {
  state = {
    currentIndex: 0,
    translateValue: 0,
    isMobile: false
  };

  isMobileDevice = () => {
    return (
      typeof window.orientation !== "undefined" ||
      navigator.userAgent.indexOf("IEMobile") !== -1
    );
  };

  componentDidMount() {
    this.setState({
      isMobile: this.isMobileDevice()
    });
  }

  draw_products = () => {
    const { loading, products, lang } = this.props;
    return loading
      ? [1, 2, 3, 4, 5, 6].map(() => <ProductPlaceHolder lang={lang} />)
      : products.map((product, i) => (
          <div
            // onClick={this.props.goToDetails}
            // className="column is-one-fifth-desktop is-4-tablet is-half-mobile"
            className="column is-2-desktop is-4-tablet is-half-mobile"
            key={i}
          >
            {this.props.shopCard ? (
              <ShopCard
                shop={product}
                match={this.props.match}
                locale={this.props.locale}
                lang={this.props.lang}
              />
            ) : (
              <ProductCard
                keyId={i}
                openProductDetails={this.props.openProductDetails}
                product={product}
                hasLikeButton={true}
                liked={false}
                match={this.props.match}
                shop_avatar={product.avatar}
                shop_id={product.shop_id}
                shop_name={product.shop_name}
                withseller={this.props.withseller}
                lang={this.props.lang}
                locale={this.props.locale}
              />
            )}
          </div>
        ));
  };

  slideWidth = () => {
    return document.querySelector(".product-card").clientWidth + 24;
  };

  slide = mode => {
    const { currentIndex } = this.state;

    // if (currentIndex === this.props.products.length - 1 || currentIndex === this.props.products.length - 6 || currentIndex === 0) {
    //     this.setState({
    //       currentIndex: 0,
    //       translateValue: 0
    //     });
    // }

    // this.setState(prevState => ({
    //     currentIndex: mode == "next" ? prevState.currentIndex + 1 : prevState.currentIndex - 1,
    //     translateValue: mode == "next" ? prevState.translateValue - this.slideWidth() : prevState.translateValue + this.slideWidth(),
    // }));

    if (currentIndex === this.props.products.length - 1) {
      return this.setState({
        currentIndex: 0,
        translateValue: 0
      });
    }

    if (currentIndex === this.props.products.length - 6) {
      return this.setState({
        currentIndex: 0,
        translateValue: 0
      });
    }

    if (this.props.lang == "ar") {
      if (mode == "prev") {
        this.setState(prevState => ({
          currentIndex: prevState.currentIndex + 1,
          translateValue: prevState.translateValue + this.slideWidth()
        }));
      } else {
        if (currentIndex == 0) {
          this.setState({
            currentIndex: 0,
            translateValue: 0
          });
        } else {
          this.setState(prevState => ({
            currentIndex: prevState.currentIndex - 1,
            translateValue: prevState.translateValue + -this.slideWidth()
          }));
        }
      }
    } else {
      if (mode == "next") {
        this.setState(prevState => ({
          currentIndex: prevState.currentIndex + 1,
          translateValue: prevState.translateValue + -this.slideWidth()
        }));
      } else {
        if (currentIndex == 0) {
          this.setState({
            currentIndex: 0,
            translateValue: 0
          });
        } else {
          this.setState(prevState => ({
            currentIndex: prevState.currentIndex - 1,
            translateValue: prevState.translateValue + this.slideWidth()
          }));
        }
      }
    }
  };

  render() {
    const { translateValue, isMobile } = this.state;

    return (
      <div className={`product-slider ${this.props.className}`}>
        {this.props.products.length > 6 ||
        (isMobile && this.props.products.length > 2) ? (
          <React.Fragment>
            <SliderButton
              className="left"
              imageSrc={require("../../assets/images/dark-slider-arrow.svg")}
              onPress={() => this.slide("prev")}
            />

            <SliderButton
              className="right"
              imageSrc={require("../../assets/images/dark-slider-arrow.svg")}
              onPress={() => this.slide("next")}
            />
          </React.Fragment>
        ) : null}

        <div className="level is-mobile">
          <div className="level-left">
            <div className="level-item">
              <h4 className="has-text-weight-bold	">
                {this.props.loading ? (
                  <Line width={144} />
                ) : this.props.products.length > 0 ? (
                  this.props.title
                ) : null}
              </h4>
            </div>
          </div>

          <div className="level-right">
            <div className="level-item">
              {this.props.loading ? (
                <Line width={144} />
              ) : this.props.products.length > 0 ? (
                this.props.link && (
                  <a
                    href={this.props.href}
                    className="red is-uppercase has-text-weight-bold"
                  >
                    {this.props.link}
                  </a>
                )
              ) : null}
            </div>
          </div>
        </div>

        <div
          className="columns is-mobile scroll-mobile-sliders"
          style={{
            transform: `translateX(${translateValue}px)`,
            transition: "transform ease-out 0.35s"
          }}
        >
          {this.draw_products()}
        </div>
      </div>
    );
  }
}

export default Slider;
