import React, { Component } from "react";
import { faStar, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import ShopCoverPlaceHolder from "../PlaceHolder/ShopCoverPlaceHolder";
import {
  FacebookShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  LinkedinShareButton
} from "react-share";

import "./Cover.css";
import { TButton } from "../Form";
import {
  faFacebook,
  faLinkedinIn,
  faWhatsapp,
  faTwitter,
  faTelegramPlane
} from "@fortawesome/free-brands-svg-icons";

class Cover extends Component {
  draw_stars = rating => {
    let stars = [];

    for (let i = 1; i <= 5; i++) {
      let color = i <= Math.floor(rating) ? `red` : `grey`;

      stars.push(
        <div className={`${color}`} key={i}>
          <FontAwesomeIcon icon={faStar} className="red" />
        </div>
      );
    }

    return stars;
  };

  render() {
    const {
      is_followed,
      followUnfollow,
      translation,
      isMine,
      open_follower_popup,
      open_share,
      is_following_load,
      loading
    } = this.props;

    let url = `www.tarbeeta.com${this.props.match.url}`;

    return loading ? (
      <ShopCoverPlaceHolder />
    ) : (
      <div className="cover">
        <div className="info">
          <div className="sec-1">
            <div
              className="avatar"
              style={{
                background:
                  this.props.avatar ? `url(${this.props.avatar})` : `#5b9dd0`
              }}
            />
            {/* <TButton
              text={"Add Product "}
              className="red"
              onPress={this.props.onClick}
            /> */}

            <div className="det">
              <h3>{this.props.name}</h3>

              <div className="stars" style={{ marginBottom: `0px` }}>
                {this.draw_stars(this.props.overall_rating)}

                <span>
                  {this.props.n_reviews ? `(${this.props.n_reviews})` : ``}
                </span>
              </div>

              <button onClick={open_follower_popup} className="followers-link ">
                <FontAwesomeIcon icon={faUser} />
                <span>
                  {this.props.n_followers} {this.props.translation.followers}
                </span>
              </button>

              <div className="is-hidden-desktop">
                {isMine && (
                  <TButton
                    text={this.props.translation.add_product_button}
                    className="red is-full"
                    onPress={this.props.onClick}
                  />
                )}
              </div>
            </div>

            <div className="sec-2 is-hidden-touch">
              <p style={{ width: "90%" }}>{this.props.bio}</p>
              <div className="actions is-flex mar-auto jcs">
                {isMine && (
                  <Link className="red" to={`/${this.props.lang}/shop/edit`}>
                    {this.props.translation.edit}
                  </Link>
                )}
                {/* <button
                  style={{ fontSize: `14px` }}
                  onClick={() => open_share()}
                  className="followers-link mar-bot-14"
                >
                  {this.props.translation.share}
                </button> */}

                <FacebookShareButton
                  className="social-share-button"
                  children={
                    <FontAwesomeIcon icon={faFacebook} size={32} round={true} />
                  }
                  url={url}
                />

                <LinkedinShareButton
                  className="social-share-button"
                  children={
                    <FontAwesomeIcon
                      icon={faLinkedinIn}
                      size={32}
                      round={true}
                    />
                  }
                  url={url}
                />

                <WhatsappShareButton
                  className="social-share-button"
                  children={
                    <FontAwesomeIcon icon={faWhatsapp} size={32} round={true} />
                  }
                  url={url}
                />

                <TwitterShareButton
                  className="social-share-button"
                  children={
                    <FontAwesomeIcon icon={faTwitter} size={32} round={true} />
                  }
                  url={url}
                />

                <TelegramShareButton
                  className="social-share-button"
                  children={
                    <FontAwesomeIcon
                      icon={faTelegramPlane}
                      size={32}
                      round={true}
                    />
                  }
                  url={url}
                />
              </div>
              {!isMine && (
                <TButton
                  disabled={is_following_load}
                  text={is_followed ? translation.unFollow : translation.follow}
                  className="follow-btn mar-bot-30"
                  onPress={followUnfollow}
                />
              )}
              {isMine && (
                <TButton
                  text={this.props.translation.add_product_button}
                  className="red"
                  onPress={this.props.onClick}
                />
              )}
            </div>
          </div>
        </div>

        <div
          className="photo"
          style={{
            backgroundImage: `url(${
              this.props.cover
                ? this.props.cover
                : require("../../assets/images/Group2.png")
            })`
          }}
        />
      </div>
    );
  }
}

export default Cover;
