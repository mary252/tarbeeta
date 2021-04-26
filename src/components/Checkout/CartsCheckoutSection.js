import React from "react";
import { ReceiptDesktop } from "../Cart";
import { ProductsList } from "./ProductsList";

const CartsCheckoutSection = props => (
  <div className="columns carts-checkout-section is-multiline is-marginless   ">
    <h1 className="column  is-12 column-no-margin section-title ">
      {props.locale.receipt.cart_section_title}
    </h1>
    <div className="column  product-list-wrapper is-paddingless  ">
      <ProductsList {...props} lang={props.lang} />
    </div>

    <hr className="custom-hr" />
    <div className="column  is-12 column-no-margin">
      <ReceiptDesktop
        withCode={props.withCode}
        is_code_valid={props.is_code_valid}
        sub_total={props.sub_total}
        discount={props.discount}
        checkPromoCode={props.checkPromoCode}
        containerStyle="section-container-style"
        total={props.total}
        currency={props.currency}
        locale={props.locale}
        promo_code={props.promo_code}
        promo_codeError={props.promo_codeError}
      />
    </div>
  </div>
);

export { CartsCheckoutSection };
