import React, { Component } from "react";
import "./Header.css";

class BuyerPanel extends Component {
  state={}
  render() {
    const { shop_id } = this.props;
    return (
      <div className="menu">
        {shop_id ? (
          <div className="item">
            <div className="l">
              <img
                alt="wallet"
                src={require("../../assets/images/wallet.svg")}
              />
            </div>

            <a
              className="r"
              href="javascript:void(0)"
              onClick={this.props.toggle}
            >
              {this.state.view_mode == "seller"
                ? this.props.translation.header.switch_to_buyer_link
                : this.props.translation.header.switch_to_seller_link}
            </a>
          </div>
        ) : null}

        <div className="item">
          <div className="l">
            <img alt="wallet" src={require("../../assets/images/wallet.svg")} />
          </div>

          <a className="r" href={`/${this.props.lang}/wallet`}>
            {this.props.translation.wallet_title_head}
          </a>
        </div>

        <div className="item">
          <div className="l">
            <img alt="order" src={require("../../assets/images/order.svg")} />
          </div>

          <a className="r" href={`/${this.props.lang}/orders`}>
            {this.props.translation.orders_link}
          </a>
        </div>

        {
          /*<div className="item">
                <div className="l">
                    <img
                    alt=""
                    src={require('../../assets/images/rewards.svg')} />
                </div>

                <a className="r" href={`/${this.props.lang}/rewards`}>{this.props.translation.rewards_link}</a>
                </div>
*/
          <div className="item">
            <div className="l">
              <img alt="heart" src={require("../../assets/images/heart.svg")} />
            </div>

            <a className="r" href={`/${this.props.lang}/favorites`}>
              {this.props.translation.header.likes_link}
            </a>
          </div>
          /*
                <div className="item">
                <div className="l">
                    <img
                    alt=""
                    src={require('../../assets/images/settings.svg')} />
                </div>

                <a className="r" href={`/${this.props.lang}/settings`}>{this.props.translation.account_settings_link}</a>
            </div>*/
        }

        <div className="item">
          <div className="l">
            <img
              alt="settings"
              src={require("../../assets/images/settings.svg")}
            />
          </div>
          <a className="r" href={`/${this.props.lang}/settings`}>
            {this.props.translation.header.settings_link}
          </a>
        </div>

        <div className="item">
          <div className="l">
            <img
              alt="Sign Out"
              src={require("../../assets/images/sign-out.svg")}
            />
          </div>

          <a
            className="r"
            href="javascript:void(0)"
            onClick={this.props.signout}
          >
            {this.props.translation.header.signout_link}
          </a>
        </div>
      </div>
    );
  }
}

export default BuyerPanel;
