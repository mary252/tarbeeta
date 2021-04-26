import React, { Component } from "react";
import { TButton } from "../Form";
import LazyLoad from "react-lazy-load";
import { withRouter } from "react-router-dom";

class ShopCard extends Component {
  state = {};

  render() {
    const {
      shop: { avatar, bio, cover, name, username },
      locale
    } = this.props;
    return (
      <div
        className="shop-card"
        onClick={() =>
          this.props.history.push(`/${this.props.lang}/shop/${username}`)
        }
      >
        <LazyLoad offsetVertical={300}>
          <div
            className="shop-bg-top"
            style={{
              background:
                cover != null
                  ? `url('${cover}') no-repeat`
                  : `url('${require("../../assets/images/shop-card.png")}') no-repeat`,
              animation: "fadein 2s linear"
            }}
          >
            <div className="is-flex jcc">
              <div
                className="shop-card-avatar-discover is-flex jcc aic"
                style={{
                  background:
                    avatar != null ? `url('${avatar}') no-repeat` : `#5b9dd0`,
                  animation: "fadein 2s linear"
                }}
              />
            </div>
          </div>
        </LazyLoad>

        <h2 className="mar-bot-20 shop-name-discover">{name}</h2>
        <div className="is-flex jcc">
          <TButton
            ariaLabel="Go To Shop"
            text={`${locale.discover.view_shop_btn_placeholder}`}
            className={`red outline`}
            onPress={() =>
              this.props.history.push(`/${this.props.lang}/shop/${username}`)
            }
          />
        </div>
      </div>
    );
  }
}

export default withRouter(ShopCard);
