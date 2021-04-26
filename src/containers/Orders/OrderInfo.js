import React, { Component, Fragment } from 'react';
import "./Orders.css";
import { 
    Page,
    CancelOrderPopUp,
    EmptyPage,
    OrdersItemsInfo,
     OrderPlaceholder
} from "../../components";
import { getOrderInfo ,cancelOrder } from "../../services";
import MessengerCustomerChat from 'react-messenger-customer-chat';

import {
    ORDER_STATUS_PLACED,
    ORDER_STATUS_PAID,
    ORDER_STATUS_PENDING_PAYMENT,
    ORDER_STATUS_PENDING_SHIPPING,
    ORDER_STATUS_ON_THE_WAY,
    ORDER_STATUS_DELIVERED,
    ORDER_STATUS_CANCELLED,
    FACEBOOK_CHAT_POPUP_THEME_COLOR, FACEBOOK_APP_ID, FACEBOOK_PAGE_ID
  } from "../../common/Config";

 import { connect } from "react-redux";
import * as actions from "../../actions";

export class OrderInfo extends Component {

    state = {
        data: [],
        chunk_id: null
    }

    CancelOrderPopup = null;
    openPopUp = () => {
        this.CancelOrderPopup.toggle();
    }

    cancel = async (chunk_id) => {

        try {
            let res = await cancelOrder(chunk_id);
            this.props.init_notification({
                type: "success",
                title: this.props.locale.success,
                message: this.props.locale.order_canceled
            });
            setTimeout(() => {
                window.location.reload();
            }, 2000)
        } catch (e){
            this.props.init_notification({
                type: "error",
                title: this.props.locale.error,
                message: this.props.locale.error_message
            });
        }

    }

    async componentDidMount() {
        this.setState({ loading: true });

        try{
            let res = await getOrderInfo(this.props.match.params.id);
            this.setState({
                data: res.data
            });
        }catch(e){
        }

    
        this.setState({ loading: false });
      }

    render(){
        const{
            state:{
              data,
              loading
            },
            props:{
              locale,
              lang
            }
          }=this
        return (
            <Page 
            title={locale.order_containers.order_info_page_title}
        description={locale.order_containers.order_info_page_desc}
            {...this.props}>
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
                        <h1 className="page-head-title">{locale.order_info_page_title}</h1>

                        {loading?
                            <OrderPlaceholder lang={lang}/>  
                            :data.length > 0 ? data.map(order => {
                            return order.chunks.length > 0 && order.chunks.map((chunk,i) => (
                                <div
                                key={i}
                                className={`order-info-section ${
                                    chunk.status_id == ORDER_STATUS_CANCELLED ? "transparent-white" : ""
                                }`}
                                >
                                    {chunk.status_id == ORDER_STATUS_CANCELLED && (
                                        <div className="btns-while-cancelled info-cancelled-order">
                                        <h4 className="cancelled-order">
                                            {locale.order_containers.cancel_order_placeholder}
                                        </h4>
                                        </div>
                                    )}
                                
                                <div
                                    className="columns is-multiline"
                                    // style={{ marginBottom: 0 }}
                                >
                                    <div
                                        className="column is-6 is-12-touch"
                                        style={{ paddingBottom: 0 }}
                                    >
                                        <div className="columns">
                                            <div className="column is-11 is-12-touch">
                                            <h2 className="order-tracking-text">
                                                {locale.order_containers.order_tracking_placeholder}
                                            </h2>
                                            <div
                                                className={`status-line ${
                                                lang == "ar" ? "rtl" : "ltr"
                                                }`}
                                            >
                                                <div
                                                className={`circle-status ${
                                                    chunk.status_id == ORDER_STATUS_PENDING_PAYMENT
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
                                                <h4 className={`${chunk.status_id == ORDER_STATUS_PENDING_SHIPPING || chunk.status_id == ORDER_STATUS_PLACED || chunk.status_id == ORDER_STATUS_DELIVERED || chunk.status_id == ORDER_STATUS_PENDING_PAYMENT ? 'status-line-heads-completed' : ''}`}>
                                                {chunk.status_id == ORDER_STATUS_PENDING_PAYMENT
                                                    ? locale.order_containers.pending_placeholder
                                                    : chunk.status_id == ORDER_STATUS_PLACED
                                                    ? locale.order_containers.prepapring_placeholder
                                                    : chunk.status_id == ORDER_STATUS_PAID
                                                    ? locale.order_containers.prepapring_placeholder
                                                    : chunk.status_id == ORDER_STATUS_PENDING_SHIPPING
                                                    ? locale.order_containers.processed_placeholder
                                                    : chunk.status_id == ORDER_STATUS_DELIVERED
                                                    ? locale.order_containers.prepared_placeholder
                                                    : locale.order_containers.prepapring_placeholder}
                                                </h4>
                                                <h4 className={`${chunk.status_id == ORDER_STATUS_ON_THE_WAY || chunk.status_id == ORDER_STATUS_DELIVERED || chunk.status_id == ORDER_STATUS_PENDING_SHIPPING ? 'status-line-heads-completed' : ''}`}>
                                                {chunk.status_id == ORDER_STATUS_ON_THE_WAY || chunk.status_id == ORDER_STATUS_PENDING_SHIPPING ? locale.order_containers.shipping_placeholder : locale.order_containers.shipped_placeholder}
                                                </h4>
                                                <h4 className={`${chunk.status_id == ORDER_STATUS_DELIVERED ? 'status-line-heads-completed' : ''}`}>
                                                {locale.order_containers.delivered_placeholder}
                                                </h4>
                                            </div>
                                            </div>
                                                <div className="column is-1 is-hidden-mobile" />
                                            </div>
                                    </div>
                                    <div className="column is-6-desktop">
                                        {order.payment_method_id == 2 && chunk.status_id == ORDER_STATUS_PENDING_PAYMENT ? (
                                            <Fragment>
                                                <div className="pending-for-payment">
                                                    <h2>{locale.order_containers.pending_payment_head_text}</h2>
                                                    <p>
                                                    {locale.order_containers.pending_first_p}
                                                    <span>{order.kiosk_confirmation_code}</span>{" "}
                                                    {locale.order_containers.pending_second_p}
                                                    </p>
                                                    <p>
                                                    {locale.order_containers.amount_required}{" "}
                                                    <span>{order.total}</span>{" "}
                                                    {order.currency}
                                                    </p>
                                                </div>
                                            </Fragment>
                                        ): null}

                                        {chunk.status_id == "Failed" ? (
                                            <h4 className="cancelled-order">
                                            {locale.order_containers.cancel_order_placeholder}
                                            </h4>
                                        ) : null}
                                        {/* <div className="p-method-mobile">
                                            {order.payment_method_id == 2 && chunk.status_id == ORDER_STATUS_PENDING_PAYMENT && (
                                                <h2 className="change-payment-method">
                                                    <a className="blue" href="#">
                                                    {locale.change_payment_method_text}
                                                    </a>
                                                </h2>
                                            )}
                                        </div> */}

                                    </div>
                                    
                                </div>

                                <div className="columns is-mobile is-multiline">
                                    <div
                                        className="column is-3-desktop is-12-touch"
                                        style={{ paddingBottom: 0 }}
                                    >
                                        <div className="order-details">
                                            <h2>{locale.order_containers.address_placeholder}</h2>
                                            <h3 className="address-info">
                                                {order.address}
                                            </h3>
                                        </div>
                                    </div>
                                    <div
                                        className="column is-1-desktop is-6-touch"
                                        style={{ paddingBottom: 0 }}
                                    >
                                        <div className="order-details">
                                            <h2>{locale.order_containers.placed_on_placeholder}</h2>
                                            <h3>{chunk.date_add}</h3>
                                        </div>
                                    </div>
                                    <div
                                        className="column is-2-desktop is-6-touch"
                                        style={{ paddingBottom: 0 }}
                                    >
                                        <div className="order-details">
                                            <h2>{locale.order_containers.payment_method_placeholder}</h2>
                                            <h3>{order.payment_method}</h3>    
                                        </div>   
                                    </div>
                                    <div
                                        className="column is-2-desktop is-6-touch"
                                        style={{ paddingBottom: 0 }}
                                    >
                                        <div className="order-details">
                                            <h2>{locale.order_containers.total_amount_placeholder}</h2>
                                            <h3>
                                            {chunk.grand_total} {chunk.currency}
                                            </h3>
                                        </div>
                                    </div>
                                    <div
                                        className="column is-2-desktop is-6-touch"
                                        style={{ paddingBottom: 0 }}
                                    >
                                        <div className="order-details">
                                            <h2>{locale.order_containers.seller_placeholder}</h2>
                                            <h3>
                                            <a href={`/${lang}/shop/${chunk.username}`}>
                                                {chunk.username}
                                            </a>
                                            </h3>
                                        </div>
                                    </div>
                                    <div
                                        className="column is-2-desktop"
                                        style={{ paddingBottom: 0 }}
                                    >
                                        <div className="order-details">
                                            <h2>{locale.order_containers.shipped_by_placeholder}</h2>
                                            <h3 className={`shipped-by ${lang == 'ar' ? 'rtl' : ''}`}>
                                            <span
                                                style={
                                                {
                                                    background: `url('${require('../../assets/images/logo-small.svg')}')`
                                                }
                                                }
                                            />
                                            {locale.order_containers.tarbeeta_dot_com}
                                            </h3>
                                        </div>
                                    </div>

                                </div>

                                <div className="columns">
                                    <div className="column is-8-desktop">
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
                                                    <h2 style={{whiteSpace: 'nowrap'}}>{locale.order_containers.order_summary_placeholder}</h2>
                                                </div>
                                            </div>
                                            <div
                                                className="column is-10-desktop is-hidden-mobile"
                                                style={{ paddingBottom: 0 }}
                                            />
                                            </div>
                                        </div>
                                        {chunk.items.length > 0 &&
                                            chunk.items.map((item, i) => (
                                            <OrdersItemsInfo
                                                chunk={chunk}
                                                item={item}
                                                key={i}
                                                locale={locale}
                                                lang={lang}
                                                order={order}
                                            />
                                        ))}
                                    </div>
                                    <div className="column is-4-desktop">
                                        <div className="final-billing">
                                            <div className="is-flex jcsb">
                                                <div>
                                                    <h3>{locale.order_containers.subtotal_placeholder} ({chunk.items.length} {locale.items_placeholder})</h3>
                                                    <h3>{locale.order_containers.shipping_fees_placeholder}</h3>
                                                </div>
                                                <div>
                                                    <h3>{chunk.total} {chunk.currency}</h3>
                                                    <h3>{chunk.shippment_fees} {chunk.currency}</h3>
                                                </div>
                                            </div>
                                            <div className="billing-line" />
                                            <div className="is-flex jcsb">
                                                <div>
                                                    <h3>{locale.order_containers.grand_total_placeholder}</h3>
                                                </div>
                                                <div>
                                                    <h3>{chunk.grand_total} {chunk.currency}</h3>
                                                </div>
                                            </div>
                                            <h4>{locale.order_containers.applicable_VAT_placeholder}</h4>
                                        </div>
                                    </div>
                                </div>
                                
                                <button 
                               aria-label="Open Confirmation PopUp"
                                onClick={() => {
                                    this.openPopUp();
                                    this.setState({
                                        chunk_id: chunk.chunk_id
                                    });
                                }} className="is-flex jce no-button-default anchor-button">{locale.order_containers.cancel_order_link}</button>
                                <CancelOrderPopUp
                                    ref={a => (this.CancelOrderPopup = a)}
                                    lang={lang}
                                    locale={locale}
                                    cancelOrder={this.cancel}
                                    chunk_id={this.state.chunk_id}
                                />

                                {/* {chunk.status == "Pending payment" ||
                                chunk.status == "preparing" ? (
                                    <div className="cancel-order">
                                    <a className="cancel-order-link" href="#">
                                        {locale.cancel_order_link}
                                    </a>
                                    </div>
                                ) : null} */}
                                
                                </div>
                            ));
                        }) : (
                            // <h1 className="has-text-centered">
                            //     {locale.no_orders_text_placeholder}
                            // </h1>
                            <EmptyPage
                                locale={this.props.locale}
                                {...this.props}
                                lang={lang}
                                noOrders
                            />
                        )}
                            

                    </div>
                </div>
            </Page>
        );
    }
}


export default connect(
    null,
    actions
  )(OrderInfo);