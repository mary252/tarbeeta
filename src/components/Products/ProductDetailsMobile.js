import React, { Component } from "react";
import {
  DropDown,
  TButton,
  ColorButton,
  SizeButton,
} from "../Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { arrNumGen, addToCart, unlike, like } from "../../services";
import { isLoggedIn, getGistCartId, storeGistCartId } from "../../ultils";
import { HeadPhone, CloseButton } from "../SVG";

import { pending_product } from "../../common";
import { withRouter } from "react-router-dom";

import "./Filters.css";
const genAvailbleColurs = variations =>
  variations.map(colour => {
    return {
      colour_image: colour.colour_image,
      colour_id: colour.colour_id,
      hoveredImage: colour.images.length ? colour.images[0].file : "",
      images: colour.images ? colour.images.map(x => x.file) : [],
      sizes: colour.sizes,
      variation_id: colour.variation_id,
      is_liked: colour.is_liked
    };
  });

export class ProductDetailsMobile extends Component {
  state = {
    colors: [],
    start: 0,
    currPic: 0,
    colour_id: null,
    size_id: 0,
    hoveredImgae: null,
    currentVariation: {},
    sizeQty: 0,
    subcategoryProducts: [],
    price: null,
    qty: null,
    product_price: null,
    loading: false,
    currency_name: "",
    is_mine: false,
    product_status: false,
    is_busy: false,
    noProduct: false,
    is_liked: false,
    status_id: null,
    id: null,
    actual_stock: 0,
    is_fulfilled: false,
    shop_phones: []
  };
  // AddToCartPopUp = null;
  // openPopUp = () => {
  //   this.AddToCartPopUp.toggle();
  // };


  static getDerivedStateFromProps(nextProps, prevState) {
    const { colId } = nextProps;
    if (nextProps.product.id !== prevState.id) {
      const { variations } = nextProps.product,
        availbleColurs = genAvailbleColurs(variations || []) || [],
        colIndex =
          availbleColurs.findIndex(x => x.colour_id == colId) > -1
            ? availbleColurs.findIndex(x => x.colour_id == colId)
            : 0;

      let currentVariation = availbleColurs[colIndex] || {};

      let sizeQty = 0,
        price = 0,
        currency_name = null,
        variation_id = null,
        colour_id = null,
        size_id = null,
        actual_stock = 0;
      if (currentVariation.sizes) {
        actual_stock = currentVariation.sizes[0].stock;
        sizeQty = currentVariation.sizes[0].available_stock;
        price = currentVariation.sizes[0].price;
        currency_name = currentVariation.sizes[0].currency_name;
        variation_id = currentVariation.sizes[0].variation_id;
        colour_id = currentVariation.colour_id;
        size_id = currentVariation.sizes[0].size_id;
      }

      return {
        colors: availbleColurs,
        currentVariation,
        currency_name,
        sizeQty,
        actual_stock,
        price,
        variation_id,
        colour_id,
        size_id,
        ...nextProps.product,
        is_liked: currentVariation.is_liked
      };
    }
  }

  draw_product_pictures = () => {
    const {
      currPic,
      currentVariation: { images = [] }
    } = this.state;
    return images.map((productImg, i) => (
      <button
        className="product-img"
        aria-label="Product Image"
        style={{
          ...(currPic === i ? { border: `solid 1px #f3444a` } : ""),
          backgroundImage: `url(${productImg})`
        }}
        key={i}
        onClick={() =>
          this.setState({ current_product_image: productImg, currPic: i })
        }
      >
        {/* <img className="side-pic" src={} /> */}
      </button>
    ));
  };

  draw_stars = overallrating => {
    let stars = [];

    for (let i = 1; i <= 5; i++) {
      let color = i <= Math.floor(overallrating) ? `red` : `grey`;

      stars.push(
        <div className={`${color}`} key={i}>
          <FontAwesomeIcon icon={faStar} className="red" />
        </div>
      );
    }

    return stars;
  };

  navigate = right =>
    this.setState(state => {
      const {
        currPic,
        currentVariation: { images }
      } = state;

      return {
        currPic: right
          ? currPic === images.length - 1
            ? 0
            : currPic + 1
          : currPic === 0
          ? images.length - 1
          : currPic - 1
      };
    });

  hoverOn = colour => {
    this.setState({
      hoveredImgae: colour.hoveredImage
    });
  };
  hoverOff = () => {
    this.setState({ hoveredImgae: null });
  };

  draw_color_buttons = () => {
    const {
      colors,
      colour_id
      // currentVariation: { colour_id }
    } = this.state;
    return colors.map((color, i) => (
      <button
        key={i}
        aria-label="Select Colour"
        className="color-button-warper no-button-default"
        onClick={() => this.selectColur(color)}
        onMouseEnter={() => this.hoverOn(color)}
        onMouseLeave={() => this.hoverOff()}
        id={`color-button-${i}`}
      >
        <ColorButton
          isSelected={colour_id === color.colour_id}
          colour={color.colour_image}
        />
      </button>
    ));
  };

  selectColur = currentVariation => {
    const { changeUrl = () => {} } = this.props;

    changeUrl(currentVariation.colour_id);

    let price = 0,
      variation_id = null,
      size_id = null;
    if (currentVariation.sizes.length) {
      price = currentVariation.sizes[0].price;
      variation_id = currentVariation.sizes[0].variation_id;
      size_id = currentVariation.sizes[0].size_id;
    }
    this.setState({
      currentVariation,
      colour_id: currentVariation.colour_id,
      price,
      variation_id,
      size_id,
      is_liked: currentVariation.is_liked
    });
  };

  draw_size_buttons = sizes => {
    const { size_id } = this.state;

    return sizes.map((size, i) => (
      <button
        key={i}
        aria-label="Enter Sizes"
        className={`  ${
          parseInt(size.stock) <= 0 ? "disabled-div" : ""
        } no-button-default`}
        onClick={() => this.selectSize(size)}
        id={`size-button-${i}`}
      >
        <SizeButton
          size={size.size_abbreviation}
          isSelected={size.size_id == size_id}
        />
      </button>
    ));
  };

  selectSize = size => {
    this.setState({
      size_id: size.size_id,
      sizeQty: size.available_stock,
      variation_id: size.variation_id,
      price: size.price,
      actual_stock: size.stock
    });
  };

  rnCartEditBtn = () => {
    const{
      state:{
        is_mine,
        status_id,
        actual_stock,
        sizeQty,
        is_busy
      },
      props:{
        locale:{
          edit_producet, add_to_cart, navigate_to_cart, call_seller
        }
      }
    }=this
    if (is_mine && status_id == pending_product) {
      return (
        <div className="column is-3-tablet is-4-desktop">
          <TButton
            ariaLabel="Edit Product"
            className="blue outline button"
            text={edit_producet}
            onPress={this.goToEditProduct}
          />
        </div>
      );
    } else if (sizeQty <= 0 && actual_stock > 0) {
      return (
        <div className="column is-3-tablet is-4-desktop">
          <TButton
            ariaLabel="Go To Cart"
            className="blue outline button"
            text={navigate_to_cart}
            onPress={this.goToCart}
          />
        </div>
      );
    } else {
      return (
        <div className="column is-3-tablet is-4-desktop">
          <TButton
            ariaLabel="Add To Cart"
            className="blue outline button"
            text={add_to_cart}
            onPress={this.updateCart}
            loading={is_busy}
            disabled={!(actual_stock > 0)}
          />
        </div>
      );
    }
  };

  likeProdcut = async (product_id, colour_id) => {
    try {
      this.setState({ is_liked: !this.state.is_liked });

      this.state.is_liked
        ? await unlike(product_id, colour_id, this.props.lang)
        : await like(product_id, colour_id, this.props.lang);
    } catch (e) {
    }
  };

  updateAvailableStock = (variation_id, available_stock) => {
    const { colour_id } = this.state;

    let variations = [...this.state.variations];

    let colourIndex = variations.findIndex(el => el.colour_id == colour_id),
      sizeIndex = variations[colourIndex].sizes.findIndex(
        el => el.variation_id == variation_id
      );
    variations[colourIndex].sizes[sizeIndex].available_stock = available_stock;

    this.setState({ sizeQty: available_stock, variations });
  };

  updateCart = async () => {
    const {
      state: { variation_id, qty },
      props: { showNotification = () => {} }
    } = this;

    try {
      this.setState({ is_busy: true });

      let body = {
        variation_id,
        qty: qty || 1
      };

      let cart_id = getGistCartId();

      if (cart_id) {
        body["cart_id"] = cart_id;
      }

      let res = await addToCart(body);
      this.updateAvailableStock(variation_id, res.data.available_stock);

      if (!cart_id && !isLoggedIn()) {
        cart_id = res.data.cart_id;
        storeGistCartId(cart_id);
      }

      this.props.getNumberOfcart(cart_id);
      this.setState({ is_busy: false });

      showNotification("success");
      this.props.addToCartPopUp({
        qty: this.state.qty,
        price: this.state.price,
        currency_name: this.state.currency_name,
        currentVariation: this.state.currentVariation,
        name: this.state.name
      });

      this.props.openAddToCartPopUp();
      // this.openPopUp();
      this.props.toggle();
    } catch (e) {
      this.setState({ is_busy: false });
      showNotification("error", e);
    }
  };

  renderSellerPhones = phones =>
    phones.map((phone, i) => (
      <h4 className="seller-phones" key={i}>
        {phone.phone}
      </h4>
    ));
  renderQuantityCart = () => {
    const {
      state: {
        sizeQty,
        actual_stock,
        shop_phones = []
      },
      props: { 
        lang,
        locale: {
          data_table = {},
          items_left_label,
          no_stock,
          go_to_cart,
          call_seller
        }
      },
      renderSellerPhones,
      rnCartEditBtn
    } = this;

    return this.state.is_fulfilled ? (
      <React.Fragment>
        <p className="attr-title">{data_table.quantity_label}</p>
        <div className="is-flex aic mar-bot-12">
          {sizeQty > 0 ? (
            <div
              className={`drop-down ${
                lang == "ar" ? `mar-left-10` : `mar-right-10`
              }`}
            >
              <DropDown
                ariaLabel="Select Quantity"
                options={arrNumGen(sizeQty)}
                onSelect={e => this.setState({ qty: e.target.value })}
              />
            </div>
          ) : null}

          {sizeQty > 0 ? (
            <p className={sizeQty < 10 ? "remain-item" : ""}>
              {sizeQty} {items_left_label}
            </p>
          ) : actual_stock <= 0 ? (
            <p className="danger-text">{no_stock}</p>
          ) : (
            <p className="danger-text">{go_to_cart}</p>
          )}
        </div>
        {/* <DeliverySection location={"Cairo"} /> */}
        {/*lang == "en" ? (
          <div className="row-pic">
            <img
              alt="shipping and availability"
              className="badges"
              src={require("../../assets/images/shipping-and-availability-01.jpg")}
            />
            <img
              alt="shipping-and-availability"
              className="badges"
              src={require("../../assets/images/shipping-and-availability-02.jpg")}
            />
          </div>
        ) : (
          <div className="row-pic">
            <img
              alt="shipping arabic"
              className="badges"
              src={require("../../assets/images/shipping-arabic-01.png")}
            />
            <img
              alt="stores arabic"
              className="badges"
              src={require("../../assets/images/stores-arabic-01.png")}
            />
          </div>
        )*/}
        <div className="columns is-mobile">
          {rnCartEditBtn()}

          <div className="column is-3-tablet is-5-desktop">
            {/* <TButton
            ariaLabel="Verify"
                  className="green"
                  text={buy_now}
                  onPress={e => this.refs[`modal`].toggle()}
                /> */}
          </div>
        </div>
      </React.Fragment>
    ) : (
      <div>
        <div className="head-phone-container">
          <HeadPhone id="productdetailmobilesection" />
          <h4 className="call-seller">{call_seller}</h4>
        </div>
        {renderSellerPhones(shop_phones)}
      </div>
    );
  };
  render() {
    const {
      state: {
        name,
        shop_name,
        shop_username,
        shop_avatar,
        n_reviews,
        currPic,
        hoveredImgae,
        overallrating,
        currentVariation: { sizes = [], images = [] },
        price,
        is_mine,
        currency_name,
        colour_id,
        id,
        is_liked,
        has_size,
        has_colour
      },
      props: { lang, className, toggle, withCloseButton, locale: { color, size }},
      renderQuantityCart
    } = this;

    return (
      <div className={`details ${className || ""} `}>
        <div className="is-flex aic">
          <div
            className={`seller-pic mar-${lang == "en" ? "right" : "left"}-10`}
            style={{
              backgroundImage: `url(${
                shop_avatar
                  ? shop_avatar
                  : `https://i0.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png?fit=256%2C256&quality=100&ssl=1`
              })`
            }}
          />
          <a className="seller-name" href={`/${lang}/shop/${shop_username}`}>
            {shop_name}
          </a>
        </div>
        <p className="product-name">{name}</p>
        <div className="stars">
          {this.draw_stars(overallrating)}
          <span>{n_reviews ? `(${n_reviews})` : ``}</span>
        </div>

        <div className="price-div-mobile">
          <div>
            <p className="selling-price">
              {price} {currency_name}
            </p>
            <del className="actual-price">
              {price} {currency_name}
            </del>
          </div>
          {/* <div className="discount">-12 %</div> */}
        </div>

        <div>
        {Boolean(has_colour) && (
                <>
          <p className="attr-title">{color}</p>
          <div className="is-flex mar-bot-10">
            <div className="over-flaw-raw">{this.draw_color_buttons()}</div>
          </div>
          </>
        )}

          {Boolean(has_size) && (
            <>
            <p className="attr-title">{size}</p>

            <div className="is-flex mar-bot-10">
              <div className="over-flaw-raw">{this.draw_size_buttons(sizes)}</div>
            </div>
          </>
          )}
        </div>
        <div />

        {renderQuantityCart()}

        {withCloseButton && (
          <button
            aria-label="Close Modal"
            className="modal-close-button no-button-default"
            onClick={toggle}
          >
            <CloseButton />
          </button>
        )}
      </div>
    );
  }
}

export default withRouter(ProductDetailsMobile);
