import React, { Component } from "react";
import { Page, BreadCrumb } from "../components";
import ProductsGrid from "./Products/Grid";
import * as actions from "../actions";
import { connect } from "react-redux";
import MessengerCustomerChat from "react-messenger-customer-chat";

import { getLikes } from "../services";
import {
  FACEBOOK_CHAT_POPUP_THEME_COLOR,
  FACEBOOK_APP_ID,
  FACEBOOK_PAGE_ID
} from "../common";

export class Favorites extends Component {
  state = {
    products: [],
    loading: false,
    pageTitle: "",
    showMore: false,
    page: 1,
    count: 0
  };

  componentDidMount = async () => {
    this.setState({ loading: true });

    await this.getLikesProducts();

    this.setState({ loading: false });
  };

  getLikesProducts = async willMerge => {
    try {
      this.setState({ is_busy: true });
      let page = this.state.page,
        lang_id = this.props.lang_id;

      let res = await getLikes(lang_id, page);

      this.setState(({ products }) => ({
        products: willMerge ? [...products, ...res.data] : res.data,
        showMore: res.showMore,
        is_busy: false,
        count: res.count
      }));
    } catch (e) {}
  };

  likePro = variation_id => {
    this.setState(state => ({
      products: state.products.filter(el => el.variation_id !== variation_id)
    }));
  };

  openProductDetails = (id, colId) => {
    this.props.TogglePopup(id, this.props.lang_id, colId);
  };

  loadMore = () =>
    this.setState(
      state => ({ page: state.page + 1 }),
      () => this.getLikesProducts(true)
    );

  render() {
    const {
      state: {
        products = [],
        filtersBar,
        pageTitle,
        is_busy,
        loading,
        showMore,
        count
      },
      props: { lang, location, locale },
      loadMore
    } = this;

    return (
      <Page
        title={locale.Favorite_title}
        description={locale.Facvorites_desc}
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
                  name: locale.tarbeeta,
                  href: `/${lang}`
                }
              ]}
              activeRoute={locale.Favorite_title}
            />

            <ProductsGrid
              count={count}
              lang={this.props.lang}
              locale={this.props.locale}
              loading={loading}
              is_busy={is_busy}
              loadMore={loadMore}
              showMore={showMore}
              openProductDetails={this.openProductDetails}
              nosorting
              sort={this.sort}
              title={pageTitle}
              withseller={true}
              products={products}
              goToDetails={this.goToDetails}
              filtersBar={filtersBar}
              select_filter={this.select_filter}
              match={this.props.match}
              onLiked={this.likePro}
              lang={this.props.lang}
              Favourites
              small_cards
            />
          </div>
        </div>
      </Page>
    );
  }
}

export default connect(
  null,
  actions
)(Favorites);
