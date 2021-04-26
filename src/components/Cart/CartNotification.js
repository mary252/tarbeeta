import React from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const CartNotification = ({
  product,
  onClick,
  lang = "ar",
  locale
}) => (
  <div className="notification_container">
    <h1 className="notification__main-title">{locale.notification}! </h1>
    <button
      aria-label="Close"
      className="button__no-default-style notification__close-icon"
      onClick={() => onClick(product.variation_id)}
    >
      <FontAwesomeIcon icon={faTimes} style={{ color: "#aaaaaa" }} />
    </button>
    <h2 className="notification__details">
      {locale.the_product}
      <Link
        className="product-link-name"
        to={`/${lang}/products/${product.product_id}?c=${product.colour_id}`}
      >
        , {product.title} ,
      </Link>
      {locale.notification_notes}
    </h2>
  </div>
);

export { CartNotification };
