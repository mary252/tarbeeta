import React, { Component } from "react";
import { getQueryStringValue, placeOrder, payWithKiosk } from "../services";
import { KIOSK, MASTER_CARD } from "../common";
import { ActiveModal, Loader } from "../components";

class PaymentCallback extends Component {
  state = {
    success: null,
    loading: null
  };

  componentWillMount = async () => {
    var query = this.props.location.search;

    let paymentMethod = getQueryStringValue(query, "paymentMethod"),
      amount_cents = getQueryStringValue(query, "amount_cents");
    if (paymentMethod == KIOSK) {
      await this.payKiosk(amount_cents);
    } else {
      this.setState(
        {
          success: JSON.parse(getQueryStringValue(query, "success") || null),
          merchant_order_id: getQueryStringValue(query, "merchant_order_id"),
          accept_order_id: getQueryStringValue(query, "order"),
          pending: getQueryStringValue(query, "pending"),
          dataMessage: getQueryStringValue(query, "data.message"),
          txn_response_code: getQueryStringValue(query, "txn_response_code"),
          source_data_type: getQueryStringValue(query, "source_data.type"),
          source_data_sub_type: getQueryStringValue(
            query,
            "source_data.sub_type"
          )
        },
        async () => {
          // If success, send request to place order
          if (this.state.success) {
            await this.newOrder(MASTER_CARD);
          } else {
            setTimeout(() => this.props.history.push("/"), 50000);
          }
        }
      );
    }
  };
  payKiosk = async amount_cents => {
    try {
      let res = await payWithKiosk({ amount_cents });

      if (res.data.pending) {
        await this.newOrder(KIOSK);
      } else {
        this.setState({ success: false });
        setTimeout(() => this.props.history.push("/"), 5000);
      }
    } catch (e) {}
  };

  newOrder = async payment_option => {
    try {
      let address_id = localStorage.getItem("address_id"),
        res = await placeOrder({ address_id, payment_option }, this.props.lang_id);

      this.props.history.push({
        pathname: `/${this.props.lang}/thankyou/${res.data}`,
        state: { navFromCheck: true }
      });
    } catch (e) {}
  };

  render() {
    let {
      state: { success },
      props: { locale }
    } = this;

    //  if (this.state.success == null) {
    //    return <h4>payment in progress</h4>;
    //  }

    return (
      <ActiveModal visible={true}>
        <div className="loader-container" style={{ direction: `rtl` }}>
          <Loader />
          <h2 style={{ color: `#fff` }}>{locale.processinsg_payment}</h2>
        </div>
      </ActiveModal>
    );
  }
}

export default PaymentCallback;
