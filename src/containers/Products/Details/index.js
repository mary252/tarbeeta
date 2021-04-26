import React, { Component } from "react";
import {
  Page,
  Slider,
  ProductCard,
  Empty,
  ProductDetailsSection,
  BreadCrumb,
  AddToCartPopUp,
  EmptyPage
} from "../../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import * as actions from "../../../actions";
import MessengerCustomerChat from "react-messenger-customer-chat";

import { fetchtProductDetails, getQueryStringValue } from "../../../services";

import ProductsGrid from "../Grid";
import {
  FACEBOOK_CHAT_POPUP_THEME_COLOR,
  FACEBOOK_APP_ID,
  FACEBOOK_PAGE_ID
} from "../../../common/Config";
import Line from "../../../components/PlaceHolder/Line";

const mapStateToProps = state => {
  return {
    cartPopUp: state.cartPopUp
  };
};

export class ProductDetails extends Component {
  state = {
    shopProducts: [],
    colors: [],
    reviews: [],
    start: 0,
    currPic: 0,
    colour_id: null,
    size_id: 0,
    hoveredImgae: null,
    material_name: "",
    sizeQty: 0,
    overallrating: 0,
    ratings: {},
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

    status_id: null,
    id: null,
    actual_stock: 0,
    product: {},
    colId: null,
    has_material: true
  };

  async componentDidMount() {
    try {
      let query = this.props.location.search,
        colId = getQueryStringValue(query, "c");
      this.setState({ loading: true });
      let { id } = this.props.match.params,
        lang_id = this.props.lang_id;

      window.scroll({ top: 0, left: 0, behavior: "smooth" });

      await this.getProduct(id, lang_id, colId);
      this.setState({ loading: false, colId });
    } catch (error) {}
  }
  async componentWillReceiveProps(nextProps) {
    const {
        match: {
          params: { id }
        },
        location: { search }
      } = nextProps,
      {
        match: { params },
        location
      } = this.props,
      is_query_updated = id !== params.id,
      is_search_changed =
        getQueryStringValue(search, "c") ||
        getQueryStringValue(location.search, "c");
    let colId = getQueryStringValue(search, "c");

    if (is_query_updated) {
      this.setState({ loading: true });
      let lang_id = this.props.lang_id;
      window.scroll({ top: 0, left: 0, behavior: "smooth" });

      await this.getProduct(id, lang_id, colId);
      this.setState({ loading: false, colId });
    } else if (is_search_changed) {
      this.setState({ loading: false, colId });
      window.scroll({ top: 0, left: 0, behavior: "smooth" });
    }
  }
  getProduct = async (id, lang_id, colId) => {
    try {
      let res = await fetchtProductDetails(id, lang_id),
        product = res.data,
        { shop_products, subcategory_products } = product;

      this.setState({
        subcategoryProducts: subcategory_products
          ? subcategory_products.data
          : [],
        shopProducts: shop_products ? shop_products.data : [],
        product,
        ...product,
        colId
      });
    } catch (e) {
      this.setState({ noProduct: true });
    }
  };
  draw_reviews = () => {
    return this.state.reviews.map((reviewer, i) => (
      <div
        className="review"
        style={{
          ...(i == this.state.reviews.length - 1 ? { border: `none` } : "")
        }}
        key={i}
      >
        <div className="level is-mobile">
          <div className="level-left">
            <h4 className="reviewer-name">{reviewer.user_name}</h4>
          </div>
          <div className="column" />
          <div className="level-right">
            <div className="stars">{this.draw_stars(reviewer.quality)}</div>
          </div>
        </div>
        <p className="review-text">{reviewer.comment}</p>
        <p className="review-date">{reviewer.date_add}</p>
      </div>
    ));
  };

  draw_products = start => {
    let product_cards = [];
    for (let i = start; i < start + 6; i++) {
      product_cards.push(
        <div className="column is-2-desktop is-4-tablet is-half-mobile" key={i}>
          <ProductCard
            lang={this.props.lang}
            locale={this.props.locale}
            lang={this.props.lang}
            product={{}}
          />
        </div>
      );
    }

    return product_cards;
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

  extractColours = () => {};

  goToCheckOut = () => this.props.history.push(`/${this.props.lang}/checkout`);

  toggle = () => this.modal.toggle;

  showNotification = (type, e) => {
    type === "success"
      ? this.props.init_notification({
          type: "success",
          title: this.props.locale.success,
          message: this.props.locale.product_added_message,
          link_text: this.props.locale.view_cart,
          link: `/${this.props.lang}/cart`
        })
      : this.props.init_notification({
          type: "error",
          title: this.props.locale.error,
          message: e.data ? e.data.message : this.props.locale.error_message
        });
  };

  changeUrl = colour_id => {
    const current = this.props.location.pathname;
    this.props.history.replace(`${current}?c=${colour_id}`);
  };

  goToCart = () => {
    this.props.history.push(`/${this.prop.lang}/cart`);
  };
  openProductDetails = (id, colId) => {
    this.props.TogglePopup(id, this.props.lang_id, colId);
  };

  getNumberOfcart = cart_id => this.props.getNumberOfcart(cart_id);
  AddToCartPopUp = null;
  openAddToCartPopUp = () => {
    this.AddToCartPopUp.toggle();
  };

  SharePopup = null;
  openShare = () => this.SharePopup.toggle();

  render() {
    const {
      state: {
        shop_name,
        shop_id,
        shop_avatar,
        n_reviews,
        description,
        overallrating,
        material_name,
        shopProducts,
        category_name,
        department_name,
        ratings,
        subcategoryProducts,
        noProduct,
        product: { name },
        loading,
        has_material
      },
      props: { locale }
    } = this;

    return noProduct ? (
      <EmptyPage
        locale={locale}
        {...this.props}
        lang={this.props.lang}
        FouroFour
      />
    ) : (
      <Page
        title={name}
        description={locale.product_details_desc}
        {...this.props}
      >
        <div className="section">
          <div className="container">
            <div>
              <MessengerCustomerChat
                pageId={FACEBOOK_PAGE_ID}
                greeting_dialog_display="hide"
                appId={FACEBOOK_APP_ID}
                themeColor={FACEBOOK_CHAT_POPUP_THEME_COLOR}
                language={this.props.lang == "en" ? "en_US" : "ar_AR"}
                greetingDialogDelay={0}
                minimized={true}
                shouldShowDialog={false}
                loggedInGreeting={
                  this.props.locale.facebook_chat_greeting_message
                }
                loggedOutGreeting={
                  this.props.locale.facebook_chat_greeting_message
                }
              />
            </div>

            <BreadCrumb
              history={[
                {
                  name: this.props.locale.tarbeeta,
                  href: `/${this.props.lang}`
                }
              ]}
              activeRoute={this.props.locale.product_details_breadcrumb}
            />
            <AddToCartPopUp
              cartPopUp={this.props.cartPopUp}
              ref={a => (this.AddToCartPopUp = a)}
              locale={this.props.locale}
              history={this.props.history}
              toggleProductDetailsPopUp={this.props.toggle}
            />
            <ProductDetailsSection
              loading={loading}
              addToCartPopUp={this.props.addToCartPopUp}
              getNumberOfcart={this.getNumberOfcart}
              lang={this.props.lang}
              product={this.state.product}
              colId={this.state.colId}
              changeUrl={this.changeUrl}
              showNotification={this.showNotification}
              open_share={this.openShare}
              locale={this.props.locale}
              openAddToCartPopUp={this.openAddToCartPopUp}
            />

            <div className="seperator" />
            <div className="description-highlights-div">
              <div className="columns is-multiline">
                <div className="column is-8 is-full-touch">
                  <p className="des-text is-uppercase">
                    {this.props.locale.description_label}
                  </p>
                  {loading ? (
                    <div className="is-flex">
                      <Line width={"35%"} />
                    </div>
                  ) : (
                    <p className="des-info">{description}</p>
                  )}
                </div>

                <div className="column is-full-touch">
                  <p className="Highlights is-uppercase">
                    {this.props.locale.information_label}
                  </p>
                  <div className="is-flex aic hl mar-bot-10">
                    <p>{this.props.locale.department_label}</p>

                    {loading ? (
                      <Line width={"20%"} />
                    ) : (
                      // </div>
                      <h4>{department_name}</h4>
                    )}
                  </div>
                  <div className="hl is-flex aic mar-bot-10">
                    <p>{this.props.locale.category_label}</p>
                    {loading ? (
                      <Line width={"20%"} />
                    ) : (
                      <h4>{category_name}</h4>
                    )}
                  </div>
                  {Boolean(has_material) && (
                    <div className="hl is-flex aic">
                      <p>{this.props.locale.material}</p>
                      {loading ? (
                        <Line width={"20%"} />
                      ) : (
                        <h4>{material_name}</h4>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="seperator" />

            <div className="review-rating">
              <p className="Ratings-Reviews is-uppercase">
                {this.props.locale.ratings_and_reviews_label}
              </p>
              <div className="columns is-multiline">
                <div className="column is-full-touch">
                  <div className="rating">
                    <p className="no-of-rates">
                      {n_reviews} {this.props.locale.rating_label}
                    </p>
                    <p className="rating-no">{overallrating}</p>
                    <p className="out-of">{this.props.locale.out_of_5_label}</p>
                    <div className="ratings">
                      <div className="one-rating is-flex aic mar-bot-10">
                        <div className="stars mar-bot-0">
                          {this.draw_stars(1)}
                        </div>
                        <div className="rating-line">
                          <div className="gray-line" />
                        </div>
                        <p className="one-rating-no">
                          {ratings["_1star"] || 0}
                        </p>
                      </div>
                      <div className="one-rating is-flex aic mar-bot-10">
                        <div className="stars mar-bot-0">
                          {this.draw_stars(2)}
                        </div>
                        <div className="rating-line">
                          <div className="gray-line" />
                        </div>
                        <p className="one-rating-no">
                          {ratings["_2star"] || 0}
                        </p>
                      </div>
                      <div className="one-rating is-flex aic mar-bot-10">
                        <div className="stars mar-bot-0">
                          {this.draw_stars(3)}
                        </div>
                        <div className="rating-line">
                          <div className="gray-line" />
                        </div>
                        <p className="one-rating-no">
                          {ratings["_3star"] || 0}
                        </p>
                      </div>
                      <div className="one-rating is-flex aic mar-bot-10">
                        <div className="stars mar-bot-0">
                          {this.draw_stars(4)}
                        </div>
                        <div className="rating-line">
                          <div className="gray-line" />
                        </div>
                        <p className="one-rating-no">
                          {ratings["_4star"] || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="column is-touch is-8-desktop">
                  <div className="reviews">
                    {this.state.reviews.length ? (
                      <>
                        {this.draw_reviews()}
                        {/* <button className="show-more-button">
                          Show More <span className="fas fa-chevron-down" />
                        </button> */}
                      </>
                    ) : (
                      <Empty
                        message={
                          this.props.locale !== null
                            ? this.props.locale.no_reviews_paragraph
                            : ``
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="seperator" />

            <p className="Other-items-text mar-bot-20">
              {this.props.locale.other_seller_items_label}
            </p>
            <div className="items-seller-div">
              <div
                className="items-seller-pic"
                style={{
                  backgroundImage: `url(${
                    shop_avatar
                      ? shop_avatar
                      : `https://i0.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12user.png?fit=256%2C256&quality=100&ssl=1`
                  })`
                }}
              />

              <div className="seller-info">
                <a
                  href={`/${this.props.lang}/shop/${shop_id}`}
                  className="items-seller-name"
                >
                  {shop_name}
                </a>
                <div className="stars no-pad-top">{this.draw_stars()}</div>
              </div>
            </div>

            <div className="seller-items">
              <div className="columns is-mobile">
                <div className="column is-12">
                  {/* {this.draw_products(this.state.start)} */}
                  <Slider
                    loading={loading}
                    openProductDetails={this.openProductDetails}
                    className="slider"
                    products={shopProducts}
                    match={this.props.match}
                    title={this.props.locale.similar_items_label}
                    nosorting={true}
                    withseller={true}
                    small_cards
                    lang={this.props.lang}
                    locale={this.props.locale}
                  />
                </div>
              </div>
            </div>

            <div className="is-hidden-touch">
              <div className="seperator" />
              <p className="Other-items-text is-hidden-mobile is-hidden-tablet">
                Similar items {this.props.lang}
              </p>

              <ProductsGrid
                lang={this.props.lang}
                locale={this.props.locale}
                loading={loading}
                openProductDetails={this.openProductDetails}
                products={subcategoryProducts}
                match={this.props.match}
                title={this.props.locale.similar_items_label}
                small_cards
                nosorting={true}
                withseller={true}
              />
            </div>
          </div>
        </div>
      </Page>
    );
  }
}

export default connect(
  mapStateToProps,
  actions
)(ProductDetails);
