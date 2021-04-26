import React, { Component } from "react";
import "./Form.css";

class TextInput extends Component {
  render() {
    const { placeholder, divClassName, errorMessage } = this.props;
    return (
      <div className={divClassName}>
        <input placeholder={placeholder} {...this.props} className={`${errorMessage ? 'error-border' : ''}`} />
        {errorMessage && (
          <label className="input-error-message">*{errorMessage}</label>
        )}
      </div>
    );
  }
}

export { TextInput };