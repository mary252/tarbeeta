import React, { Component } from "react";
import PropTypes from "prop-types";
import { like, unlike } from "../../services";
import { APPROVED_PRODUCT, pending_product, Images } from "../../common";
import { Link } from "react-router-dom";
import { HeadPhone } from "../SVG/headPhone";
import { TButton } from "../Form";
import LazyLoad from "react-lazy-load";

import "../Shop/Grid.css";
class ProductCard extends Component {
  state = {
    is_liked: this.props.product.is_liked
  };

  likePro = async (product_id, colour_id, variation_id) => {
    try {
      const { onLiked = () => {} } = this.props;
      this.setState({ is_liked: !this.state.is_liked });
      this.state.is_liked
        ? await unlike(product_id, colour_id, this.props.lang)
        : await like(product_id, colour_id, this.props.lang);

      onLiked(variation_id);
    } catch (e) {}
  };

  render() {
    const {
      product: {
        image,
        id,
        title,
        price,
        currency,
        variation_id,
        status_id,
        status,
        shop_id,
        shop_name,
        stock,
        is_mine,
        colour_id,
        shop_username,
        is_fulfilled
      },
      hasLikeButton,
      productIndex,
      withStatus,
      withseller,
      shop_avatar,
      openProductDetails = () => {},
      keyId = ""
    } = this.props;
    return (
      <div className="product-card">
        {undefined !== stock && parseInt(stock) > 0 ? null : (
          <div>
            <h1 className="out-of-stock">
              {this.props.locale.out_of_stock_text}
            </h1>
          </div>
        )}
        {withStatus ? (
          status_id !== APPROVED_PRODUCT ? (
            <div className="pending-product">
              <span className="far fa-clock" /> {status}
            </div>
          ) : null
        ) : null}

        {!is_mine ? (
          <button
            className="like"
            aria-label="Like Product"
            onClick={e => {
              e.stopPropagation();
              this.likePro(id, colour_id, variation_id);
            }}
          >
            <img
              src={this.state.is_liked ? Images.redHeart : Images.fillHeart}
              alt={"like product"}
            />
          </button>
        ) : null}
        <LazyLoad height={203} offsetVertical={300}>
          <Link
            to={`/${this.props.lang}/products/${id}?c=${colour_id}`}
            className={`img  img-pro-selller-ar ${
              undefined !== stock && parseInt(stock) > 0
                ? ``
                : "out-of-stock-back"
            }`}
            style={{
              backgroundImage: `url(${image})`,
              animation: "fadein 2s linear"
            }}
          />
        </LazyLoad>

        <div className="product-card-info-wrapper">
          {withseller ? (
            <div
              className={`is-flex aic mar-bot-5 ${
                this.props.lang == "en" ? "card-en" : ""
              }`}
            >
              <div
                className="card-seller-pic"
                style={{
                  backgroundImage: `url(${
                    shop_avatar
                      ? shop_avatar
                      : `https://i0.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png?fit=256%2C256&quality=100&ssl=1`
                  })`
                }}
              />
              <a
                className="card-seller-name mar-bot-0 "
                href={`/${this.props.lang}/shop/${shop_username}`}
              >
                {shop_name}
                {/* {shop_name
                  ? shop_name.length > 12
                    ? shop_name.substring(0, 12) + ".."
                    : shop_name
                  : null} */}
              </a>
            </div>
          ) : null}
          <div className="product-title-container">
            <a href={`/${this.props.lang}/products/${id}?c=${colour_id}`}>
              {title}
            </a>
          </div>
        </div>

        <div className="price edit-price-container">
          <div className="price-currency-container">
            <h3
              className={`mar-${
                this.props.lang == "en" ? "right" : "left"
              }-5 price-product-card`}
            >
              {price}
            </h3>
            <span className="price-product-card">{currency}</span>
          </div>
          {Boolean(is_mine && status_id == pending_product) && (
            <Link
              to={`/${this.props.lang}/products/edit/${id}`}
              className="edit-product"
            >
              {this.props.locale.edit}
            </Link>
          )}
        </div>
        <div className="add-to-cart--container">
          {is_fulfilled ? (
            <TButton
              aria-label="Add To Cart"
              className="add-to-cart--btn"
              onPress={() => openProductDetails(id, colour_id)}
              text={this.props.locale.quick_view}
            />
          ) : (
            <button
              aria-label="Open Product Details"
              className="t-button head-phone-container no-button-default"
              onClick={() => openProductDetails(id, colour_id)}
            >
              <HeadPhone id={Math.random().toString(36)} />
              <h4 className="call-seller">{this.props.locale.show_number}</h4>
            </button>
          )}
        </div>

        {/* <h5>{old_price} {currency}</h5> */}
      </div>
    );
  }
}

ProductCard.propTypes = {
  product: PropTypes.object.isRequired
};

export default ProductCard;
