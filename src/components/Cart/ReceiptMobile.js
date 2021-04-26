import React from "react";
import { TButton } from "../Form";

import { FloatCollapsedSection } from "../Layout";
import { CheckRow } from "./CheckRow";

const RenderCollapsedSec = class extends React.Component {
  render() {
    const {
      total,
      currency,
      locale,
      withCode,
      checkPromoCode = () => {},
      promo_code,
      promo_codeError,
      sub_total = 0,
      discount = 0,
      is_code_valid,
      saveToState,
      checkCode
    } = this.props;
    return (
      <div>
        <CheckRow
          title={locale.receipt.sub_total_title}
          value={sub_total}
          currency={currency}
        />
        <CheckRow
          title={locale.receipt.shipping_fees_title}
          value={0}
          currency={currency}
        />

        <CheckRow
          title={locale.receipt.discount_fees}
          value={discount}
          currency={currency}
        />

        {withCode && (
          <>
            <div
              className="receipt-input"
              onClick={() => {
                this.myInp.focus();
              }}
            >
              <button className="code-button" onClick={checkCode}>
                {locale.receipt.apply_code_btn}
              </button>
              {/* {promo_code ? is_code_valid ? <CheckMark /> : <Close /> : null} */}

              <div className="code-input">
                <input
                  ref={ip => (this.myInp = ip)}
                  placeholder={locale.receipt.apply_code_input_placeholder}
                  type="text"
                  onChange={saveToState}
                  name="promo_code"
                  value={promo_code}
                />
              </div>
            </div>
            {promo_codeError && (
              <h3 className="input-error-message txt-centered">
                {promo_codeError}
              </h3>
            )}
          </>
        )}
        <hr />
      </div>
    );
  }
};

const renderUnCollapsedSec = ({
  onClick,
  total,
  currency,
  is_busy,
  mobile_verified,
  locale,
  btnText,
  disabled,
  address
}) => (
  <div className="total-div">
    <div className="total-row-mobile">
      <CheckRow
        id="totalRow"
        title={locale.receipt.total_mobile_placeholder}
        valueClass="money_font"
        titleClass="total-font"
        value={total}
        currency={currency}
      />
    </div>
    <TButton
      text={btnText}
      tip={locale.select_address_tooltip}
      className={`button green ${
        disabled && address.length < 1 ? "tooltip" : ""
      }`}
      onPress={onClick}
      loading={is_busy}
      ariaLabel="Chcekout"
      disabled={disabled && address.length < 1 ? true : false}
    />
    {/* ${!mobile_verified ? "tooltip" : ""} */}
  </div>
);

const ReceiptMobile = props => (
  <FloatCollapsedSection
    {...props}
    RenderCollapsedSec={RenderCollapsedSec}
    renderUnCollapsedSec={() => renderUnCollapsedSec(props)}
  />
);

export { ReceiptMobile };
