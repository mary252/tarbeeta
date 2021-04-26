import React, { Component } from "react";
import { TButton } from "../Form";
import { CheckRow } from "./CheckRow";

const ReceiptDesktop = class extends Component {
  render() {
    const {
      withButton,
      containerStyle,
      withCode,
      onClick,
      total,
      currency,
      is_busy,
      locale,
      mobile_verified,
      topPosition,
      checkPromoCode,
      promo_code,
      promo_codeError,
      sub_total = 0,
      discount = 0,
      checkCode,
      is_code_valid,
      saveToState
    } = this.props;

    return (
      <div className={containerStyle ? containerStyle : "receipt_box"}>
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
                  errorMessage={promo_codeError}
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
        <div id="total-row">
          <CheckRow
            title={locale.receipt.total_mobile_placeholder}
            valueClass="money_font"
            titleClass="total-font"
            value={total}
            currency={currency}
          />
        </div>

        {withButton && (
          <TButton
            text={locale.checkout}
            className={`button green ${!mobile_verified ? "tooltip" : ""}`}
            onPress={onClick}
            loading={is_busy}
            tip={locale.plz_verify_to_check}
            ariaLabel="Checkout"
          />
        )}
      </div>
    );
  }
};

export { ReceiptDesktop };
