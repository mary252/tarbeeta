import React, { Component } from "react";
import Circle from "./Circle";
import Line from "./Line";
import "./PlaceHolder.css";
import "../Shop/Cover.css";

const logo = require("../../assets/images/logo-copy@2x.jpg");
class ShopCoverPlaceHolder extends Component {
  render() {
    const { lang } = this.props;
    return (
      <div className="cover">
        <div className="info">
          <div className="sec-1">
            <div
              className="avatar "
              style={{ backgroundColor: "transparent", position: "relative" }}
            >
              <img
                src={logo}
                alt="..."
                width="58px"
                height=" 57px"
                className="force-center"
              />
            </div>

            <div className="det">
              <Line width={144} />

              <Line width={100} />
            </div>

            <div className="sec-2 is-hidden-touch mar-top-15">
              <Line width={"60%"} />
              <Line width={"40%"} />

              <div className="actions is-flex mar-auto jcs">
                <div class="is-flex mar-top-15 social-share-wrap jcc">
                  {[1, 2, 3, 4, 5, 6].map(() => (
                    <div className="social-share-button no-pad-bottom">
                      <Circle />
                    </div>
                  ))}
                </div>
              </div>

              <div className="is-flex ">
                <div className=" animated-background button-place-holder wid-40" />
              </div>
            </div>
          </div>
        </div>

        <div className="photo is-flex jcc aic">
          <img src={logo} alt="..." width="58px" height=" 57px" />
        </div>
      </div>
    );
  }
}

export default ShopCoverPlaceHolder;
