import React, { Component } from "react";
import "./Form.css";

class ClickableSquare extends Component {
  render() {
    const {
      active,
      onClick,
      text,
      color,
      withToolTip,
      title,
      ariaLabel
    } = this.props;
    return (
      <button
        aria-label={ariaLabel}
        className={`clickable-square ${withToolTip ? "tooltip" : ""} ${
          undefined !== text ? `txt` : ``
        } ${active ? "active" : null}`}
        onClick={onClick}
        data-tooltip={title}
      >
        {undefined !== text ? (
          text
        ) : (
          <div
            className="inner-color"
            style={{
              backgroundImage: `url(${color})`
            }}
          />
        )}

        <div className="selected">
          <img
            src={require("../../assets/images/thick-tick.svg")}
            height="7"
            alt="thick tick"
          />
        </div>
      </button>
    );
  }
}

export { ClickableSquare };
