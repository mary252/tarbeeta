import React, { Component } from "react";
// import "./Grid.css";
import "./EmptyPage.css"

import { Images } from "../../common"

import {
    TButton
  } from "../Form";

class EmptyPage extends Component {

    state = {
        is_busy: false,
    }

    toggle_busy = () => this.setState({ is_busy: !this.state.is_busy });

    goHome = () => {
      const {
        history
      } = this.props;
      history.push(`/${this.props.lang}`);
    }

    goBack = () => {
        const {
            history
         } = this.props;
        history.goBack()
    }

    render(){
        const { is_busy  } = this.state;
        const { lang, FouroFour, noOrders, emptyCart, noNoifications, noSearch, noFavourites, locale } = this.props;
        return (
            <div className="Empty-Page">
                {FouroFour && (
                  <div className="shop-doesnt-exists">
                    <img src={Images.notFound404}/>
                    <p><span>404 ,</span> {locale.page_not_found}</p>

                    <div className={`is-flex`}>
                      <TButton
                        text={locale && locale.go_home_btn_placeholder}
                        className={`grad-blue full button mar-${this.props.lang == 'ar' ? 'left' : 'right'}-10`}
                        loading={is_busy}
                        onPress={this.goHome}
                        name="goHome"
                        lang={lang}
                      />

                      <TButton
                        text={locale && locale.back_btn_placeholder}
                        className={`blue outline full button`}
                        loading={is_busy}
                        onPress={this.goBack}
                        name="goBack"
                        lang={lang}
                      />
                    </div>
                  </div>
                )}

                    
                {noOrders && (
                  <div className="no-orders-empty">
                    <img src={Images.noOrders}/>
                    <p className="mar-bot-15">{locale.you_have_no_orders_placeholder}</p>
                    <p>{locale.add_items_to_cart_placeholder}</p>

                  </div>
                )}


                {emptyCart && (
                  <div className="cart-empty">
                    <img src={Images.emptyCart}/>
                    <p className="mar-bot-15">{locale.empty_cart_message}</p>
                    <p>{locale.made_choice_text}</p>

                  </div>
                )}

                {noNoifications && (
                  <div className="no-notifications">
                    <img src={Images.emptyNotifications}/>
                    <p>{locale.no_notifications}</p>

                  </div>
                )}

                {noSearch && (
                  <div className="no-notifications">
                    <img src={Images.emptySearch}/>
                    <p>{locale.no_items_found}</p>

                  </div>
                )}


                {noFavourites && (
                  <div className="no-notifications">
                    <img src={Images.emptyFavourites}/>
                    <p>{locale.no_favourites}</p>
                    <p>{locale.add_items_to_favourites}</p>
                  </div>
                )}

                    
                    

                
            </div>
        );
    }
}

export default EmptyPage;