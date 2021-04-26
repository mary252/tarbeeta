import React, { Component } from "react";
import HorizontalLines from "./HorizontalLines";
import Line from "./Line";
import "./PlaceHolder.css";

class CartPlaceholder extends Component {
  renderLoading = products =>
    products.map(() => (
      <div className="products_container__row ">
        <div className="columns  is-multiline">
          <div className="column is-3-desktop  is-12-mobile  is-5-tablet ">
            <div className="products_container__row--cell">
              <Line width={"100%"} />
            </div>
          </div>

          <div className="column is-2  is-6-mobile is-flex aic is-hidden-mobile	is-hidden-tablet-only">
            <div className="products_container__row--cell">
              <span className=" text-price-desktop products_container__money-font">
                <Line width={"100%"} />
              </span>{" "}
            </div>
          </div>

          <div className="column  is-2-desktop is-hidden-mobile  is-hidden-tablet-only is-flex aic">
            <div className="text_input">
              <Line width={"100%"} />
            </div>
          </div>

          <div className="column   is-hidden-desktop	 is-12-mobile  mobile-cell-row  ">
            <div className="table-cell-price-mobile">
              <div className="text_input">
                <Line width={"100%"} />
              </div>
            </div>
            <div className="table-cell-price-mobile">
              <span className="products_container__total-font">
                Total Price
              </span>
              <span className="products_container__money-font">
                <Line width={"100%"} />
              </span>
            </div>
          </div>

          <div className="column  is-2-desktop   is-hidden-mobile is-hidden-tablet-only is-flex aic">
            <div className="table-cell-price-mobile">
              <span className="products_container__money-font">
                <Line width={"100%"} />
              </span>
            </div>
          </div>

          <div className="column is-3-desktop  is-12-mobile  is-12-tablet action_buttons">
            <Line width={"80%"} />
          </div>
          <div className="column is-hidden-desktop is-1" />
        </div>
      </div>
    ));

  render() {
    let { array, lang } = this.props;
    return (
      <div className="columns is-multiline columns__no-margin-bottom">
        <div className="column is-9-desktop is-12-tablet no-margin-horizontal ">
          <div className="products_container">
            <div className="columns is-hidden-mobile  is-hidden-tablet-only	products_container__head columns__no-margin-bottom">
              <div className="column is-3 products_container__head--cell">
                <span>{this.props.locale.data_table.item_label}</span>
              </div>

              <div className="column is-2 products_container__head--cell">
                <span>{this.props.locale.data_table.item_price_label}</span>
              </div>

              <div className="column is-2 products_container__head--cell">
                <span>{this.props.locale.data_table.quantity_label}</span>
              </div>

              <div className="column is-2 products_container__head--cell">
                <span>{this.props.locale.data_table.total_price}</span>
              </div>
              <div className="column is-1 products_container__head--cell" />
              <div className="column is-2 products_container__head--cell" />
            </div>

            {this.renderLoading(array)}
          </div>
        </div>
        <div className="column is-3-desktop no-margin-horizontal">
          <div className="is-hidden-mobile is-hidden-tablet-only sticky-invoice">
            <div className={"receipt_box"}>
              <HorizontalLines lang={lang} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export { CartPlaceholder };
