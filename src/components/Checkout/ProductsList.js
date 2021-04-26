import React from "react";
import { ProductThumbnail } from "../Cart/ProductThumbnail";
import { Link } from "react-router-dom";
const ProductsList = ({ products = [], locale, currency, lang }) =>
  products.map((item, i) => (
    <div className="product_cell" key={i}>
      <ProductThumbnail
        link={item.avatar}
        height={68}
        width={68}
        to={`/${lang}/shop/${item.id}`}
      />
      <div className="prodcut-cell-texts">
        <Link to={`/${lang}/shop/${item.id}`} className="seller-title-list">
          {item.name}
        </Link>
        <h3 className="quantity-font">
          {`${locale.qty} :`}
          {item.total_items}
        </h3>
        <h3 className={`text-price-list ${lang == 'ar' ? 'rtl' : ''}`}>
          {item.shop_total_price} {item.currency || currency}
        </h3>
      </div>
    </div>
  ));

const HorizontalProductsList = ({ products = [], locale, lang }) =>
  products.map((item, i) => (
    <React.Fragment>
      <div className="column order-message put-in-row ">
        <h1>{locale.ur_order}</h1>
        <h1 className="tracking-number">{item.tracking_number}</h1>
        <h1>{locale.order_success}</h1>
      </div>
      <div className="columns product_cell  ar-radio" key={i}>
        <div className="column is-2 no-padding-margin-left  is-3-mobile ar-shop-avatar">
          <ProductThumbnail
            link={item.avatar}
            to={`/${lang}/shop/${item.id}`}
          />
        </div>

        <div className="prodcut-cell-texts-horizontal column is-8  ">
          <div className="columns prodcut-cell-texts-horizontal ar-radio">
            <a
              className="seller-title column "
              style={{ textDecoration: "none ", borderBottomStyle: "none" }}
            >
              {item.name}
            </a>
            <div className="column is-4-desktop is-hidden-mobile  " />
            <h3 className=".quantity-font-horizonatl column is-1 ">
              {`${locale.qty} :`}
              {item.total_items}
            </h3>
          </div>
        </div>
      </div>
    </React.Fragment>
  ));

export { ProductsList, HorizontalProductsList };
