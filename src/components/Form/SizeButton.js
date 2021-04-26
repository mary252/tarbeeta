import React, { Component } from "react";
import "./Form.css";

class SizeButton extends Component {
  render() {
    const { onPress, size, isSelected, disabled } = this.props;
    return (
      <button
        aria-label="Select Size"
        disabled={disabled}
        onClick={onPress}
        key={size}
        className="size-button"
        style={{ ...(isSelected ? { border: `solid 1px #f3444a` } : "") }}
      >
        <span>{size}</span>
      </button>
    );
  }
}
export { SizeButton };
