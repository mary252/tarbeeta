import React, { Component } from "react";
import HorizontalLines from "./HorizontalLines";
import Line from './Line'
import "./PlaceHolder.css";
class OrderPlaceholder extends Component {
  render() {
    const { lang,locale } = this.props;
    return (
      <div
        className="order-info-section"
        dir={lang == "ar" ? "rtl" : "ltr"}
      >

        <div className="columns ">
          <div className="column is-4">
            <HorizontalLines/>
          </div>
          <div
            className="column is-3-desktop is-12-touch"
            style={{ paddingBottom: 0 }}
          >
            <div className="columns is-mobile">
              <div className="column is-6-desktop is-6-mobile">
                <div className="order-details">
                  <h2>{locale.order_containers.order_no_placeholder}</h2>
                  <Line width={"50%"}/>
                  <h2>{locale.order_containers.placed_on_placeholder}</h2>
                  <Line width={"50%"}/>
                  <h2>{locale.order_containers.total_amount_placeholder}</h2>
                  <Line width={"50%"}/>
                  <h2>{locale.order_containers.seller_placeholder}</h2>
                  <Line width={"50%"}/>
                </div>
              </div>
              <div className="column is-6-desktop is-6-mobile">
                <div className="order-details">
                  <h2>{locale.order_containers.payment_method_placeholder}</h2>
                  <Line width={"80%"}/>
                  <h2>{locale.order_containers.shipped_by_placeholder}</h2>
                  <Line width={"80%"}/>
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
                {
                  Array(2).fill(0).map(()=>
                  <div className="columns is-mobile" style={{marginBottom: 0}}>
                     <div className="column is-2-desktop is-3-mobile is-2-tablet" style={{paddingBottom: 0}}>
                        <div className={`orders-item-img `}
                          style={{
                            background: `url(${require("../../assets/images/logo-copy@2x.jpg")}) no-repeat`
                          }}
                        ></div>

                      </div>
                      <div className="column is-7-desktop is-6-mobile is-8-tablet" style={{paddingBottom: 0, position:'relative'}}>
                        <Line width={"80%"}/>
                      </div>
                  </div>
                  )
                }
              </div>
        </div>
        
      </div>
    );
  }
}

export {OrderPlaceholder};