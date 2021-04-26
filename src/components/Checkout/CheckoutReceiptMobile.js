import React from "react";
import { TextInput, TButton } from "../Form";
import { FloatCollapsedSection } from "../Layout";
import { CheckRow } from "../Cart";

const RenderCollapsedSec = class extends React.Component {
  render() {
    const { locale } = this.props;
    return (
      <div>
        <CheckRow title={locale.sub_total_title} />

        <CheckRow title={locale.shipping_fees_title} />

        <div className="receipt-input">
          <TextInput
            placeholder={locale.apply_code_input_placeholder}
            type="text"
          />
        </div>
        <hr />
      </div>
    );
  }
};

const renderUnCollapsedSec = ({ onClick, locale }) => (
  <div className="total-div">
    <div className="total-row-mobile">
      <CheckRow
        id="totalRow"
        title={locale.total_mobile_placeholder}
        valueClass="money_font"
        titleClass="total-font"
      />
    </div>
    <TButton
      text={locale.continue_button}
      className="button continue-table-btn"
      onPress={onClick}
      ariaLabel="Continue"
    />
  </div>
);

const CheckoutReceiptMobile = props => (
  <FloatCollapsedSection
    {...props}
    RenderCollapsedSec={RenderCollapsedSec}
    renderUnCollapsedSec={() => renderUnCollapsedSec(props)}
  />
);

export { CheckoutReceiptMobile };
