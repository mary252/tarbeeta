import React, { Component } from "react";
import {
  DropDown,
  ProductCard,
  InfiniteScroll,
  EmptyPage
} from "../../components";
import "../../components/Shop/Grid.css";
import ProductPlaceHolder from "../../components/PlaceHolder/ProductPlaceHolder";
import {
  SORT_MOST_RECENT,
  SORT_OLD_TO_NEW,
  SORT_HIGHEST_PRICE,
  SORT_LOWEST_PRICE,
  SORT_RATING
} from "../../common";
import Line from "../../components/PlaceHolder/Line";

class ProductsGrid extends Component {
  state = {
    selected: null
  };

  draw_products = () => {
    const {
      withStatus,
      products,
      onLiked = () => {},
      openProductDetails = () => {},
      loading,
      lang
    } = this.props;

    return loading ? (
      Array(30)
        .fill(0)
        .map(() => <ProductPlaceHolder lang={lang} />)
    ) : products.length ? (
      products.map((product, i) => (
        <div
          to={`/${this.props.lang}/products/${product.id}?c=${product.colour_id}`}
          className={`column ${
            this.props.small_cards ? "is-2-desktop" : "is-one-fifth-desktop"
          }  is-4-tablet is-half-mobile`}
          key={i}
        >
          <ProductCard
            keyId={i}
            openProductDetails={openProductDetails}
            productIndex={i}
            product={product}
            withStatus={withStatus}
            pendingProduct={true}
            shop_avatar={product.avatar}
            shop_id={product.shop_id}
            shop_name={product.shop_name}
            withseller={this.props.withseller}
            match={this.props.match}
            onLiked={onLiked}
            lang={this.props.lang}
            locale={this.props.locale}
          />
        </div>
      ))
    ) : (
      <React.Fragment>
        {this.props.Search && (
          <EmptyPage
            locale={this.props.locale}
            {...this.props}
            lang={this.props.lang}
            noSearch
          />
        )}

        {this.props.Favourites && (
          <EmptyPage
            locale={this.props.locale}
            {...this.props}
            lang={this.props.lang}
            noFavourites
          />
        )}
      </React.Fragment>
    );
  };
  draw_filter_bar = filtersBar =>
    filtersBar.map((item, i) => (
      <div key={i} className="filter-label">
        <span>
          {item.name}:
          {item.title ? (
            <a>{item.title} </a>
          ) : (
            <div
              style={{
                backgroundImage: `url(${item.image})`,
                width: "10px",
                height: "10px",
                borderRadius: "3px"
              }}
            />
          )}
        </span>
        <button
          aria-label="Remove Filters Item"
          onClick={() => this.props.select_filter(item.name, true, item.id)}
          className="no-button-default"
        >
          X
        </button>
      </div>
    ));

  render() {
    const {
      title,
      products,
      sort,
      filtersBar = [],
      is_busy,
      loadMore,
      showMore,
      locale,
      count
    } = this.props;
    return (
      <div>
        <div className="sorting">
          <div className="columns is-vcentered is-mobile is-0-mobile mar-bot-0">
            <div className="column is-7-desktop no-pad-bottom is-hidden-mobile is-2-tablet-only no-pad-right-mobile aic is-flex">
              {this.props.loading ? (
                <Line width={150} />
              ) : (
                <div className="is-flex aic">
                  {undefined !== title ? <h3>{title}</h3> : null}
                  <label>
                    {count || products.length} {locale.products_label}
                  </label>
                </div>
              )}
            </div>

            <div className="column is-2-desktop-only is-hidden-tablet-only is-hidden-mobile" />

            <div className="column is-hidden-desktop is-6-tablet is-3-mobile">
              <label>
                {count || products.length} {locale.products_label}
              </label>
            </div>

            {/* <div className="column is-one-fifth-desktop is-8-mobile-only is-4-tablet-only"> */}
            {undefined !== this.props.nosorting ? null : (
              <div className="column is-3-desktop is-9-mobile is-4-tablet-only">
                {this.props.loading ? (
                  <Line width={150} />
                ) : (
                  <DropDown
                    ariaLabel="Select Price To Filter"
                    options={[
                      {
                        value: SORT_LOWEST_PRICE,
                        title:
                          locale !== null &&
                          locale.sorting_options.price_low_to_high
                      },
                      {
                        value: SORT_HIGHEST_PRICE,
                        title:
                          locale !== null &&
                          locale.sorting_options.price_high_to_low
                      },
                      {
                        value: SORT_MOST_RECENT,
                        title:
                          locale !== null && locale.sorting_options.most_recent
                      },
                      {
                        value: SORT_RATING,
                        title:
                          locale !== null &&
                          locale.sorting_options.rating_low_to_high
                      },
                      {
                        value: SORT_OLD_TO_NEW,
                        title: locale !== null && locale.sorting_options.old
                      }
                    ]}
                    selected={this.state.selected}
                    onSelect={e => {
                      this.setState({ selected: e.target.value });
                      sort(e);
                    }}
                  />
                )}
              </div>
            )}
          </div>

          <div className="filter-tags mar-bot-15">
            {this.draw_filter_bar(filtersBar)}
          </div>
        </div>
        <InfiniteScroll
          list={products}
          isLoading={is_busy}
          loadMore={loadMore}
          showMore={showMore}
        >
          <div className="columns is-mobile is-multiline">
            {this.draw_products()}
          </div>
        </InfiniteScroll>
      </div>
    );
  }
}

export default ProductsGrid;
