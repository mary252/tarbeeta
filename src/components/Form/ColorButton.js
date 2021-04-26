import React, { Component } from "react";
import "./Form.css";

class ColorButton extends Component {
  state = {
    active: true
  };

  render() {
    const { isSelected, colour, selectedColorMethod = () => {} } = this.props;
    return (
      <button
        aria-label="Select Colour"
        disabled={this.props.disabled}
        // onClick={this.props.onPress}
        onClick={() => selectedColorMethod(colour)}
        style={{
          backgroundImage: `url(${colour})`,
          ...(isSelected ? { border: `solid 1px #f3444a` } : { border: `none` })
        }}
        className="color-button"
      >
        {isSelected && (
          <div className="selected center-content">
            <img
              src={require("../../assets/images/thick-tick.svg")}
              height="7"
              alt="thick tick"
            />
          </div>
        )}
      </button>
    );
  }
}
export { ColorButton };
