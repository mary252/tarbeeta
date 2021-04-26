import React, { Component } from "react";
import "./Form.css";

class ArrowButton extends Component {
  render() {
    return (
      <button
        aria-label="Move Slider"
        onClick={this.props.onPress}
        key={this.props.key}
        className={`arrow-button `}
        style={{
          ...(this.props.arrow == "left" ? { left: `0%` } : { right: `0%` }),
          ...(this.props.background
            ? { backgroundColor: this.props.background }
            : "")
        }}
      >
        {this.props.arrow == "left" ? (
          <span className="fas fa-chevron-right" />
        ) : (
          <span className="fas fa-chevron-left" />
        )}
      </button>
    );
  }
}
export { ArrowButton };
