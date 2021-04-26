import React, { Component, Fragment } from "react";
import "./Orders.css";

import {
  Page,
  EmptyPage,
  OrdersItems,
  OrderPlaceholder
} from "../../components";

import { getOrdersData } from "../../services";

import MessengerCustomerChat from "react-messenger-customer-chat";

import {
  ORDER_STATUS_PLACED,
  ORDER_STATUS_PAID,
  ORDER_STATUS_PENDING_PAYMENT,
  ORDER_STATUS_PENDING_SHIPPING,
  ORDER_STATUS_ON_THE_WAY,
  ORDER_STATUS_DELIVERED,
  ORDER_STATUS_CANCELLED,
  FACEBOOK_CHAT_POPUP_THEME_COLOR,
  FACEBOOK_APP_ID,
  FACEBOOK_PAGE_ID
} from "../../common/Config";

class Orders extends Component {
  state = {
    data: []
  };

  async componentDidMount() {
    this.setState({ loading: true });

    try {
      let res = await getOrdersData();
      this.setState({
        data: res.data
      });
    } catch (e) {}

    this.setState({ loading: false });
  }

  render() {
    const {
      state: { data, loading },
      props: { locale, lang }
    } = this;

    return (
      <Page
        title={locale.order_containers.page_title}
        description={locale.order_containers.page_order_desc}
        {...this.props}
      >
        <div className="section">
          <div className="container">
          <div>
          <MessengerCustomerChat
              pageId={FACEBOOK_PAGE_ID}
              greeting_dialog_display="hide"
              appId={FACEBOOK_APP_ID}
              themeColor={FACEBOOK_CHAT_POPUP_THEME_COLOR}
              language={this.props.lang == "en" ? "en_US" : "ar_AR"}
              greetingDialogDelay={0}
              minimized={true}
              shouldShowDialog={false}
              loggedInGreeting={this.props.locale.facebook_chat_greeting_message}
              loggedOutGreeting={this.props.locale.facebook_chat_greeting_message}
            />
          </div>
            <h1 className="page-head-title">{locale.order_containers.page_title}</h1>
            {
             loading?
              Array(3).fill(0).map(()=><OrderPlaceholder locale={locale}/>)
              :data.length > 0 ? (
              <Fragment>
                {data.map((order, index) => {
                  return order.chunks.map((chunk, i) => (
                    <div
                      key={index}
                      className={`order-info-section ${
                        chunk.status_id == ORDER_STATUS_CANCELLED
                          ? "transparent-white"
                          : ""
                      }`}
                    >
                      {chunk.status_id == ORDER_STATUS_CANCELLED && (
                        <div className="btns-while-cancelled">
                          <h4 className="cancelled-order">
                            {locale.order_containers.cancel_order_placeholder}
                          </h4>
                          <h2 className="order-details-link">
                            <a
                              className="blue"
                              href={`/${lang}/order/info/${order.order_id}`}
                            >
                              {locale.order_containers.order_details_link}
                              <span />
                            </a>
                          </h2>
                        </div>
                      )}

                      <div
                        className="columns is-multiline"
                        style={{ marginBottom: 0 }}
                      >
                        <div
                          className="column is-4 is-12-touch"
                          style={{ paddingBottom: 0 }}
                        >
                          <div className="columns">
                            <div className="column is-11 is-12-touch">
                              <h2 className="order-tracking-text">
                                {
                                  locale.order_containers
                                    .order_tracking_placeholder
                                }
                              </h2>
                              <div
                                className={`status-line ${
                                  lang == "ar" ? "rtl" : "ltr"
                                }`}
                              >
                                <div
                                  className={`circle-status ${
                                    chunk.status_id ==
                                    ORDER_STATUS_PENDING_PAYMENT
                                      ? "pending-circle"
                                      : ""
                                  } ${
                                    chunk.status_id == ORDER_STATUS_PLACED ||
                                    chunk.status_id == ORDER_STATUS_PAID ||
                                    chunk.status_id ==
                                      ORDER_STATUS_PENDING_SHIPPING ||
                                    chunk.status_id ==
                                      ORDER_STATUS_ON_THE_WAY ||
                                    chunk.status_id == ORDER_STATUS_DELIVERED ||
                                    chunk.status_id == "returned"
                                      ? "preparing-circle"
                                      : ""
                                  }`}
                                />
                                <div
                                  className={`s-line ${
                                    chunk.status_id ==
                                      ORDER_STATUS_ON_THE_WAY ||
                                    chunk.status_id == ORDER_STATUS_DELIVERED ||
                                    chunk.status_id ==
                                      ORDER_STATUS_PENDING_SHIPPING ||
                                    chunk.status_id == "returned"
                                      ? "s-line-green"
                                      : ""
                                  }`}
                                />
                                <div
                                  className={`circle-status ${
                                    chunk.status_id ==
                                      ORDER_STATUS_ON_THE_WAY ||
                                    chunk.status_id == ORDER_STATUS_DELIVERED ||
                                    chunk.status_id ==
                                      ORDER_STATUS_PENDING_SHIPPING ||
                                    chunk.status_id == "returned"
                                      ? "preparing-circle"
                                      : ""
                                  }`}
                                />
                                <div
                                  className={`s-line ${
                                    chunk.status_id == ORDER_STATUS_DELIVERED ||
                                    chunk.status_id == "returned"
                                      ? "s-line-green"
                                      : ""
                                  }`}
                                />
                                <div
                                  className={`circle-status ${
                                    chunk.status_id == ORDER_STATUS_DELIVERED ||
                                    chunk.status_id == "returned"
                                      ? "preparing-circle"
                                      : ""
                                  }`}
                                />
                              </div>
                              <div
                                className={`status-line-heads ${
                                  lang == "ar" ? "rtl" : "ltr"
                                }`}
                              >
                                <h4
                                  className={`${
                                    chunk.status_id ==
                                      ORDER_STATUS_PENDING_SHIPPING ||
                                    chunk.status_id == ORDER_STATUS_PLACED ||
                                    chunk.status_id == ORDER_STATUS_DELIVERED ||
                                    chunk.status_id ==
                                      ORDER_STATUS_PENDING_PAYMENT
                                      ? "status-line-heads-completed"
                                      : ""
                                  }`}
                                >
                                  {chunk.status_id ==
                                  ORDER_STATUS_PENDING_PAYMENT
                                    ? locale.order_containers
                                        .pending_placeholder
                                    : chunk.status_id == ORDER_STATUS_PLACED
                                    ? locale.order_containers
                                        .prepapring_placeholder
                                    : chunk.status_id == ORDER_STATUS_PAID
                                    ? locale.order_containers
                                        .prepapring_placeholder
                                    : chunk.status_id ==
                                      ORDER_STATUS_PENDING_SHIPPING
                                    ? locale.order_containers
                                        .processed_placeholder
                                    : chunk.status_id == ORDER_STATUS_DELIVERED
                                    ? locale.order_containers
                                        .prepared_placeholder
                                    : locale.order_containers
                                        .prepapring_placeholder}
                                </h4>
                                <h4
                                  className={`${
                                    chunk.status_id ==
                                      ORDER_STATUS_ON_THE_WAY ||
                                    chunk.status_id == ORDER_STATUS_DELIVERED ||
                                    chunk.status_id ==
                                      ORDER_STATUS_PENDING_SHIPPING
                                      ? "status-line-heads-completed"
                                      : ""
                                  }`}
                                >
                                  {chunk.status_id == ORDER_STATUS_ON_THE_WAY ||
                                  chunk.status_id ==
                                    ORDER_STATUS_PENDING_SHIPPING
                                    ? locale.order_containers
                                        .shipping_placeholder
                                    : locale.order_containers
                                        .shipped_placeholder}
                                </h4>
                                <h4
                                  className={`${
                                    chunk.status_id == ORDER_STATUS_DELIVERED
                                      ? "status-line-heads-completed"
                                      : ""
                                  }`}
                                >
                                  {
                                    locale.order_containers
                                      .delivered_placeholder
                                  }
                                </h4>
                              </div>
                              {order.payment_method_id == 2 &&
                              chunk.status_id ==
                                ORDER_STATUS_PENDING_PAYMENT ? (
                                <Fragment>
                                  <div className="pending-for-payment">
                                    <h2>
                                      {
                                        locale.order_containers
                                          .pending_payment_head_text
                                      }
                                    </h2>
                                    <p>
                                      {locale.order_containers.pending_first_p}
                                      <span>
                                        {order.kiosk_confirmation_code}
                                      </span>{" "}
                                      {locale.order_containers.pending_second_p}
                                    </p>
                                    <p>
                                      {locale.order_containers.amount_required}{" "}
                                      <span>{order.total}</span>{" "}
                                      {order.currency}
                                    </p>
                                  </div>
                                </Fragment>
                              ) : null}
                              {chunk.status_id == "Failed" ? (
                                <h4 className="cancelled-order">
                                  {
                                    locale.order_containers
                                      .cancel_order_placeholder
                                  }
                                </h4>
                              ) : null}
                              <div className="p-method-mobile">
                                {/* {order.payment_method_id == 2 && chunk.status_id == ORDER_STATUS_PENDING_PAYMENT && (
                                  <h2 className="change-payment-method">
                                      <a className="blue" href="#">
                                      {locale.change_payment_method_text}
                                      </a>
                                  </h2>
                                )} */}
                                {chunk.status_id ==
                                ORDER_STATUS_CANCELLED ? null : (
                                  <h2 className="order-details-link">
                                    <a
                                      className="blue"
                                      href={`/${lang}/order/info/${order.order_id}`}
                                    >
                                      {
                                        locale.order_containers
                                          .order_details_link
                                      }
                                      <span />
                                    </a>
                                  </h2>
                                )}
                              </div>
                            </div>
                            <div className="column is-1 is-hidden-mobile" />
                          </div>
                        </div>
                        {chunk.status_id == ORDER_STATUS_CANCELLED && (
                          <div
                            className="is-hidden-desktop"
                            style={{ height: 75, width: 1 }}
                          />
                        )}
                        <div
                          className="column is-3-desktop is-12-touch"
                          style={{ paddingBottom: 0 }}
                        >
                          <div className="columns is-mobile">
                            <div className="column is-6-desktop is-6-mobile">
                              <div className="order-details">
                                <h2>
                                  {locale.order_containers.order_no_placeholder}
                                </h2>
                                <h3>
                                  <a
                                    href={`/${lang}/order/info/${order.order_id}`}
                                  >
                                    {chunk.tracking_number}
                                  </a>
                                </h3>
                                <h2>
                                  {
                                    locale.order_containers
                                      .placed_on_placeholder
                                  }
                                </h2>
                                <h3>{chunk.date_add}</h3>
                                <h2>
                                  {
                                    locale.order_containers
                                      .total_amount_placeholder
                                  }
                                </h2>
                                <h3>
                                  {order.total} {order.currency}
                                </h3>

                                <h2>
                                  {locale.order_containers.seller_placeholder}
                                </h2>
                                <h3>
                                  <a href={`/${lang}/shop/${chunk.username}`}>
                                    {chunk.username}
                                  </a>
                                </h3>
                              </div>
                            </div>
                            <div className="column is-6-desktop is-6-mobile">
                              <div className="order-details">
                                <h2>
                                  {
                                    locale.order_containers
                                      .payment_method_placeholder
                                  }
                                </h2>
                                <h3>{order.payment_method}</h3>
                                <h2>
                                  {
                                    locale.order_containers
                                      .shipped_by_placeholder
                                  }
                                </h2>
                                <h3
                                  className={`shipped-by ${
                                    lang == "ar" ? "rtl" : ""
                                  }`}
                                >
                                  <span
                                    style={{
                                      background: `url('${require("../../assets/images/logo-small.svg")}')`
                                    }}
                                  />
                                  {locale.order_containers.tarbeeta_dot_com}
                                </h3>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="column is-5-desktop"
                          style={{ paddingBottom: 0 }}
                        >
                          <div className="items-row-head">
                            <div
                              className="columns"
                              style={{ marginBottom: 0 }}
                            >
                              <div
                                className="column is-2-desktop"
                                style={{ paddingBottom: 0 }}
                              >
                                <div className="order-details">
                                  <h2>{locale.items_label}</h2>
                                </div>
                              </div>
                              <div
                                className="column is-10-desktop is-hidden-mobile"
                                style={{ paddingBottom: 0 }}
                              />
                            </div>
                          </div>
                          {Array.isArray(chunk.items) &&
                            chunk.items.length > 0 &&
                            chunk.items.map((item, i) => (
                              <OrdersItems
                                chunk={chunk}
                                item={item}
                                key={i}
                                locale={locale}
                                lang={lang}
                                order={order}
                              />
                              //<div />
                            ))}
                        </div>
                      </div>
                      {chunk.status == "Pending payment" ||
                      chunk.status == "preparing" ? (
                        <div className="cancel-order">
                          <a className="cancel-order-link" href="#">
                            {locale.cancel_order_link}
                          </a>
                        </div>
                      ) : null}
                    </div>
                  ));
                })}
              </Fragment>
            ) : (
              <EmptyPage
                locale={this.props.locale}
                {...this.props}
                lang={this.props.lang}
                noOrders
              />
            )}
          </div>
        </div>
      </Page>
    );
  }
}

export default Orders;
