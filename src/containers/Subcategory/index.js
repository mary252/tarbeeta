import React, { Component } from "react";
import {
  Page,
  Filters,
  BreadCrumb,
  ActiveModal,
  Loader
} from "../../components";
import ProductsGrid from "../Products/Grid";
import * as actions from "../../actions";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import MessengerCustomerChat from "react-messenger-customer-chat";
import {
  FACEBOOK_CHAT_POPUP_THEME_COLOR,
  FACEBOOK_APP_ID,
  FACEBOOK_PAGE_ID
} from "../../common";
import { fetchProducts, fetchProductsFilter } from "../../services";
import { SORT_LOWEST_PRICE } from "../../common";

class Subcategory extends Component {
  state = {
    products: [],
    filters: [],
    Subcategories: [],
    Color: [],
    Size: [],
    Material: [],
    filtersBar: [],
    sort: SORT_LOWEST_PRICE,
    min_price: null,
    max_price: null,
    loading: false,
    pageTitle: "",
    is_busy: false,
    showMore: false,
    page: 1,
    redirect: null,
    show_loader: false,
    count: 0
  };

  componentDidMount = async () => {
    this.setState({ loading: true });

    let {
      department_url,
      category_url,
      subcategory_url
    } = this.props.match.params;

    let lang_id = this.props.lang_id;

    await this.init();

    await this.getFilters(
      department_url,
      category_url,
      subcategory_url,
      lang_id
    );

    this.setState({ loading: false });
  };

  openProductDetails = (id, colId) => {
    this.props.TogglePopup(id, this.props.lang_id, colId);
  };

  init = async willMerge => {
    let {
      department_url,
      category_url,
      subcategory_url
    } = this.props.match.params;

    // let {id } = this.props.match.params,
    let lang_id = this.props.lang_id,
      {
        Color,
        Size,
        Material,
        sort,
        max_price,
        min_price,
        Subcategories,
        page
      } = this.state,
      filter = {
        // subcategory_id: id,
        subcategories: Subcategories,
        category_name: category_url,
        subcategory_name: subcategory_url,
        department_name: department_url,
        Colour: Color,
        Size,
        Material,
        lang_id,
        sort,
        max_price,
        min_price,
        page
      };

    await this.getProducts(filter, willMerge);
  };

  getProducts = async (filter, willMerge) => {
    try {
       this.setState({ is_busy: true});

      // this.state.show_loader
      //   ? this.setState({ is_busy: false })
      //   : this.setState({ is_busy: true });

      let res = await fetchProducts(filter),
        {
          data,
          subcategory_name,
          category,
          showMore,
          department_name,
          count
        } = res.data,
        pageTitle =
          subcategory_name ||
          category ||
          department_name ||
          this.props.locale.subcategories;
      this.setState(state => ({
        products: willMerge ? [...state.products, ...data] : data,
        pageTitle,
        showMore,
        is_busy: false,
        loading: false,
        count
      }));
    } catch (e) {
      this.setState({ loading: false, loading: false });
    }
  };
  componentDidUpdate() {
    if (this.state.redirect == this.props.location.pathname) {
      window.location.reload();
    }
  }
  sort = e => this.setState({ sort: e.target.value }, this.init);

  loadMore = () =>
    this.setState(state => ({ page: state.page + 1 }), () => this.init(true));
  goback = () => {
    let str = this.props.location.pathname;
    var lastIndex = str.lastIndexOf("/");
    str = str.substring(0, lastIndex);
    this.setState({
      redirect: str
    });
  };
  getFilters = async (
    department_name,
    category_name,
    subcategory_name,
    lang_id
  ) => {
    try {
      let res = await fetchProductsFilter({
        department_name,
        category_name,
        subcategory_name,
        lang_id
      });
      const { filters, max_price, min_price } = res.data;

      this.setState({ filters, max_price, min_price });
    } catch (e) {}
  };
  goToDetails = id =>
    this.props.history.push(`/${this.props.lang}/products/${id}`);

  select_filter = (key, isSelected, val, obj) =>
    this.setState(state => {
      return {
        [key]: isSelected
          ? state[key].filter(a => a !== val)
          : [...state[key], val],
        filtersBar: isSelected
          ? state.filtersBar.filter(a => !(a.name == key && a.id == val))
          : [...state.filtersBar, obj],
        loading: true
      };
    }, this.init);
  saveToState = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    const {
      state: {
        filters = [],
        products = [],
        filtersBar,
        pageTitle,
        is_busy,
        showMore,
        show_loader,
        count
      },
      props: { locale, lang, location },
      loadMore
    } = this;

    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    return (
      <Page title={pageTitle} description={locale.subcat_desc} {...this.props}>
        <ActiveModal visible={show_loader}>
          <div className="loader-container">
            <Loader />
          </div>
        </ActiveModal>
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
              activeRoute={locale.Fashion}
            />

            <div className="columns is-mobile">
              <div className="column is-2-desktop is-hidden-mobile">
                <Filters
                  startFilter={this.init}
                  loading={this.state.loading}
                  saveToState={this.saveToState}
                  data={filters}
                  department={pageTitle}
                  onClick={this.select_filter}
                  translation={locale}
                  withSubCategory
                  {...this.state}
                  {...this.props}
                  goback={this.goback}
                />
              </div>

              <div className="column is-10-desktop is-full-mobile">
                <ProductsGrid
                  count={count}
                  lang={this.props.lang}
                  locale={this.props.locale}
                  loading={this.state.loading}
                  is_busy={is_busy}
                  loadMore={loadMore}
                  showMore={showMore}
                  openProductDetails={this.openProductDetails}
                  sort={this.sort}
                  title={pageTitle}
                  withseller={true}
                  products={products}
                  goToDetails={this.goToDetails}
                  filtersBar={filtersBar}
                  select_filter={this.select_filter}
                  match={this.props.match}
                />
              </div>
            </div>
          </div>
        </div>
      </Page>
    );
  }
}

export default connect(
  null,
  actions
)(Subcategory);
