import React, { Component } from "react";
import "./Form.css";

class SliderButton extends Component {
  render() {
    return (
      <div
        className={`slider-button ${this.props.className}`}
        onClick={this.props.onPress}
      >
        <img src={this.props.imageSrc} alt="..." />
      </div>
    );
  }
}

export { SliderButton };
