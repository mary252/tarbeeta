import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Page,
  Filters,
  Cover,
  FiltersMobile,
  FollowersPopup,
  ActiveModal,
  Loader,
  EmptyPage
} from "../components";
import ProductsGrid from "./Products/Grid";
import * as actions from "../actions";
import {
  getInfo,
  fetchShopFilter,
  isMyShop,
  getShopProduct,
  followShop,
  unFollowShop,
  getFollowes
} from "../services";

export class Shop extends Component {
  state = {
    id: null,
    products: [],
    filters: [],
    loading: false,
    Color: [],
    Size: [],
    Material: [],
    Subcategories: [],
    filtersBar: [],
    sort: null,
    min_price: null,
    max_price: null,
    is_mine: false,
    no_shop: false,
    filter_mobile: false,
    n_followers: 0,
    is_followed: false,
    followers: null,
    page: 1,
    is_busy: false,
    showMore: false,
    will_follow: true,
    show_loader: false,
    is_following_load: false,
    count: 0
  };

  FollowersPopup = null;
  openPopUp = () => this.FollowersPopup.toggle();

  openFilterMobile = () => {
    this.setState({
      filter_mobile: true
    });
  };

  closeFilterMobile = () => {
    this.setState({
      filter_mobile: false
    });
  };

  getFollowers = async () => {
    try {
      let res = await getFollowes(this.state.id);
      this.setState({
        followers: res.data
      });
    } catch (e) {}
  };

  componentDidMount = async () => {
    this.setState({ loading: true });
    var langId = this.props.lang_id;
    window.scroll({ top: 0, left: 0, behavior: "smooth" });

    let shop_id = this.props.match.params.id;
    await this.getShop(shop_id, langId);

    // await this.checK(shop_id);

    await this.getFilters(this.state.id, langId);
    await this.getFollowers();
    this.setState({ loading: false });
  };

  checK = async shop_id => {
    try {
      let res = await isMyShop(shop_id);
      this.setState({ isMine: true });
    } catch (e) {}
  };

  getProducts = async willMerge => {
    try {
      // is_busy : this for Dots loader in infinite
      // show_loader : for showing the circle loader

      // this.setState({ is_busy: true, show_loader: true });

      this.state.show_loader
        ? this.setState({ is_busy: false })
        : this.setState({ is_busy: true });

      // this.setState({ is_busy: true });

      let { lang_id } = this.props,
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
          shop_id: this.state.id,
          Colour: Color,
          Size,
          Material,
          lang_id,
          sort,
          max_price,
          min_price,
          subcategories: Subcategories,
          page
        };

      let res = await getShopProduct(this.state.id, filter);
      this.setState(state => ({
        products: willMerge ? [...state.products, ...res.data] : res.data,
        is_busy: false, // this for Dots loader in infinite
        showMore: res.showMore,
        loading: false, // this for showing the circle loader,
        count: res.count
      }));
    } catch (e) {}
  };

  getShop = async (shop_username, langId) => {
    try {
      let res = await getInfo(shop_username, langId),
        { products: { data, showMore, count } = {} } = res.data;

      this.setState({
        ...res.data,
        is_followed: Boolean(res.data.is_followed),
        count,
        products: data,
        showMore
      });
    } catch (e) {
      this.setState({ no_shop: true });
    }
  };

  getFilters = async (shop_id, langId) => {
    try {
      let res = await fetchShopFilter(
        {
          lang_id: langId
        },
        shop_id
      );

      const { filters, max_price, min_price } = res.data;

      this.setState({ filters, max_price, min_price });
    } catch (e) {}
  };

  sort = e => this.setState({ sort: e.target.value }, this.getProducts);

  saveToState = e => this.setState({ [e.target.name]: e.target.value });

  extract_filters = () => {};

  select_filter = (key, isSelected, val, obj) =>
    this.setState(state => {
      return {
        [key]: isSelected
          ? state[key].filter(a => a !== val)
          : [...state[key], val],
        filtersBar: isSelected
          ? state.filtersBar.filter(a => !(a.name == key && a.id == val))
          : [...state.filtersBar, obj],
        loading: true // this for showing the circle loader
      };
    }, this.getProducts);

  goToDetails = id =>
    this.props.history.push(`/${this.props.lang}/products/${id}`);
  navigate = () => this.props.history.push(`/${this.props.lang}/products/new`);

  followUnfollow = async () => {
    try {
      this.setState(() => ({ is_following_load: true }));
      const { is_followed, id, username } = this.state;
      // is_followed = Boolean(is_followed);
      let res = is_followed
        ? await unFollowShop(id)
        : await followShop(id, username);
      const { data = [] } = res;
      if (res)
        this.setState(state => ({
          is_followed: !state.is_followed,
          followers: data,
          n_followers: data.length,
          is_following_load: false
        }));
    } catch (e) {
      this.setState(() => ({ is_following_load: false }));
    }
  };
  openProductDetails = (id, colId) => {
    this.props.TogglePopup(id, this.props.lang_id, colId);
  };
  loadMore = () =>
    this.setState(
      state => ({ page: state.page + 1 }),
      () => this.getProducts(true)
    );

  render() {
    const {
      state: {
        filters = [],
        department,
        products = [],
        filtersBar,
        name,
        avatar,
        cover,
        bio,
        is_mine,
        is_followed,
        no_shop,
        n_followers,
        Color,
        Size,
        Material,
        sort,
        min_price,
        max_price,
        is_busy,
        showMore,
        is_following_load,
        show_loader,
        loading,
        count
      },
      loadMore
    } = this;
    return no_shop ? (
      <Page
        title={this.state.name}
        description={this.state.bio}
        {...this.props}
      >
        <EmptyPage
          locale={this.props.locale}
          {...this.props}
          lang={this.props.lang}
          FouroFour
        />
      </Page>
    ) : (
      <Page
        title={this.state.name}
        description={this.state.bio}
        {...this.props}
      >
        <FiltersMobile
          filter_mobile={this.state.filter_mobile}
          openFilterMobile={this.openFilterMobile}
          closeFilterMobile={this.closeFilterMobile}
          filters={filters}
        />

        <FollowersPopup
          ref={a => (this.FollowersPopup = a)}
          lang={this.props.lang}
          translation={this.props.locale}
          followers={this.state.followers}
        />
        <ActiveModal visible={show_loader}>
          <div className="loader-container">
            <Loader />
          </div>
        </ActiveModal>
        <div className="section">
          <div className="container">
            <Cover
              loading={loading}
              is_followed={is_followed}
              n_followers={n_followers}
              name={name}
              avatar={avatar}
              cover={cover}
              bio={bio}
              isMine={is_mine}
              onClick={this.navigate}
              translation={this.props.locale}
              followUnfollow={this.followUnfollow}
              open_follower_popup={this.openPopUp}
              is_following_load={is_following_load}
              {...this.props}
              open_share={this.openShare}
            />

            <div className="columns">
              <div className="column is-2 is-hidden-mobile">
                <Filters
                  startFilter={this.getProducts}
                  saveToState={this.saveToState}
                  data={filters}
                  department={department}
                  translation={this.props.locale}
                  onClick={this.select_filter}
                  history={this.props.history}
                  withSubCategory={false}
                  {...this.state}
                  {...this.props}
                  is_shop={true}
                />
              </div>

              <div className="column is-10">
                <ProductsGrid
                  count={count}
                  lang={this.props.lang}
                  loading={loading}
                  locale={this.props.locale}
                  is_busy={is_busy}
                  loadMore={loadMore}
                  showMore={showMore}
                  openProductDetails={this.openProductDetails}
                  sort={this.sort}
                  products={products}
                  goToDetails={this.goToDetails}
                  filtersBar={filtersBar}
                  select_filter={this.select_filter}
                  withStatus={is_mine}
                  withTitle
                  match={this.props.match}
                  Search
                />
              </div>
            </div>
          </div>
        </div>
      </Page>
    );
  }
}

/*Shop.propTypes = {
    user: PropTypes.object.isRequired,
    products: PropTypes.array.isRequired,
}*/

export default connect(
  null,
  actions
)(Shop);
