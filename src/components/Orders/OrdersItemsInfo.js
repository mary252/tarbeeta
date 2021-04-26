import React, { Component, Fragment } from "react";
import StarsRating from "./StarsRating";
import WriteReviewPopUp from "../../components/WriteReviewPopUp";
import {
  ORDER_STATUS_FAILED,
  ORDER_STATUS_DELIVERED,
} from "../../common/Config";

class OrdersItemsInfo extends Component {
  state = {
    chunk_id: null,
    item: null,
    commentState: ""
  };

  changeCommentState = comment => {
    this.setState({
      commentState: comment
    });
  };

  writeReview = null;
  openPopUp = () => {
    this.writeReview.toggle();
  };

    render(){
        const { chunk, item, locale, lang, order, orderInfo } = this.props;
        
        return (
            <div className="columns is-mobile" style={{marginBottom: 0}}>
                {chunk && (
                    <Fragment>
                        <div className="column is-2-desktop is-3-mobile is-2-tablet" style={{paddingBottom: 0}}>
                            <a className={`a-orders-item-img`} href={`/${lang}/products/${item.product_id}?c=${item.colour_id}`}>
                                <div className={`orders-item-img ${chunk.status_id == ORDER_STATUS_FAILED ? "pending" : ""}`}
                                    style={{
                                        background: `url('${item.img}') no-repeat`
                                    }}
                                ></div>
                            </a>
                        </div>
                        <div className="column is-6-desktop is-6-mobile is-5-tablet" style={{paddingBottom: 0, position:'relative'}}>
                            {/* {chunk.status == "returned" && (
                                <button className="returned-btn">Returned item</button>
                            )} */}
                            <div className={`orders-items-info ${chunk.status_id == ORDER_STATUS_FAILED ? "pending" : ""}`}>
                                <div>
                                    <h3><a href={`/${lang}/products/${item.product_id}?c=${item.colour_id}`}>{item.name}</a></h3>
                                    <span className="qty-for-mobile is-hidden-desktop is-hidden-tablet">{locale.qty + ":"} {item.qty}</span>
                                    {chunk.status_id == ORDER_STATUS_DELIVERED && (
                                        <Fragment>
                                            <StarsRating 
                                                name={`item-${item.product_id}`}
                                                item={item}
                                                locale={locale}
                                                lang={lang}
                                                order={order}
                                                rating={`${item.quality}`}
                                            />
                                            <p className="review-order-info" style={{whiteSpace: 'pre'}}>
                                                {this.state.commentState.trim() || item.comment.trim()}
                                            </p>
                                            <div className="is-flex jcsb" style={{marginBottom: 24}}>
                                                {/* <a className="request-resturn-link" style={{marginRight: 10}} href="javascript:void(0)">{locale.request_return}</a> */}
                                                <a onClick={() => {
                                                    this.openPopUp();
                                                    this.setState({
                                                        chunk_id: chunk.chunk_id,
                                                        item: item
                                                    });
                                                }} className="request-resturn-link blue" href="javascript:void(0)">
                                                {item.comment !== '' ? locale.edit_review_link : locale.add_review_link}
                                                </a>
                                            </div>
                                            <WriteReviewPopUp 
                                                ref={a => (this.writeReview = a)}
                                                locale={locale}
                                                chunk_id={chunk.chunk_id}
                                                item={item}
                                                order={order}
                                                init_notification={this.props.init_notification}
                                                changeCommentState={this.changeCommentState}
                                            />
                                        </Fragment>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="column is-2-desktop is-hidden-mobile is-3-tablet" style={{paddingBottom: 0}}>
                            <div className={`orders-items-info ${chunk.status_id == ORDER_STATUS_DELIVERED ? "qty-mobile" : ""} ${chunk.status == "returned" ? "returned" : ""}`}>
                                <h2>{locale.qty + ":"} {item.qty}</h2>
                            </div>
                        </div>
                        <div className="column is-2-desktop is-3-mobile">
                            <div className="orders-items-info">
                                <h3 className="item-price" style={{whiteSpace: 'nowrap'}}>{item.price} {item.currency}</h3>
                            </div>
                        </div>
                    </Fragment>
                  
            
        )}
      </div>
    );
  }
}

export default OrdersItemsInfo;
