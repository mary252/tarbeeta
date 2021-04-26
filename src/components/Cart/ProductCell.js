import React from "react";
import { ProductThumbnail } from "./ProductThumbnail";
import { Link } from "react-router-dom";

const ProductCell = (
  {
    img,
    name,
    title,
    lang,
    price,
    currency,
    product_id,
    shopId,
    size_name,
    colour_img,
    colour_id,
    has_colour,
    has_size
  },
  isAr
) => (
  <div className="product_cell">
    <ProductThumbnail
      link={img}
      lang={lang}
      isAr={isAr}
      to={`/${lang}/products/${product_id}?c=${colour_id}`}
    />
    <div className="prodcut-cell-texts">
      <Link to={`/${lang}/shop/${shopId}`} className="product_title">
        {name}
      </Link>
      <h3 className="product-color-description">{title}</h3>
      <div className="size-colour-img is-flex aic">
        {Boolean(has_size) && <h3>{size_name} </h3>}
        {Boolean(has_colour) && <img src={colour_img} alt="colour" />}
      </div>
      <h3 className="is-hidden-desktop is-hidden-tablet-only  text-price">
        {price} {currency}
      </h3>
    </div>
  </div>
);

export { ProductCell };
