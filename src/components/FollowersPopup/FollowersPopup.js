import React, { Component } from "react";
import { Modal } from "../Layout";
import "./followers.css";
import Empty from "../Empty";

class FollowersPopup extends Component {
  state = {
    is_busy: false,
    items: [
      {
        name: "name",
        shop_avatar: null
      },
      {
        name: "name",
        shop_avatar: null
      },
      {
        name: "name",
        shop_avatar: null
      },
      {
        name: "name",
        shop_avatar: null
      }
    ],
    error_msg: null
  };

  toggle = () => {
    this.modal.toggle();
  };

  toggle = item => {
    this.setState({
      item: item
    });
    this.modal.toggle();
  };

  draw_followers = (followers, translation) => {
    return followers.length ? (
      followers.map((follower, i) => (
        <div className="follower-warper" key={i}>
          <div className="columns is-mobile">
            <div className="column is-2-desktop is-2-mobile is-3-tablet">
              <div
                className="followers-seller-pic"
                style={{
                  backgroundImage: `url(${
                    follower.avatar
                      ? follower.avatar
                      : `https://i0.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png?fit=256%2C256&quality=100&ssl=1`
                  })`
                }}
              />
            </div>
            <div className="column is-8 is-flex aic">
              <p className="followers-seller-name">{follower.name}</p>
            </div>
            <div className="column is-2" />
          </div>
        </div>
      ))
    ) : (
      <Empty message={translation.no_followers} />
    );
  };
  render() {
    const { translation, followers } = this.props;
    return (
      <Modal ref={m => (this.modal = m)}>
        <div onClick={e => e.stopPropagation()} className="address-popup">
          <div className="address-popup-div">
            <div className="columns is-mobile">
              <div className="column is-4-desktop is-4-mobile is-3-tablet" />
              <div className="column is-3">
                <p className="followers-header-text">{translation.followers}</p>
              </div>
              <div className="column is-3" />
              <div className="column is-2">
                <button onClick={this.toggle} className="close-button">
                  {translation.close}
                </button>
              </div>
            </div>
            {followers ? (
              this.draw_followers(followers, translation)
            ) : (
              <Empty message={translation.no_followers} />
            )}
          </div>
        </div>
      </Modal>
    );
  }
}

export default FollowersPopup;
