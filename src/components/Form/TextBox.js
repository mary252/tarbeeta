import React, { Component } from "react";
import "./Form.css";

class TextBox extends Component {
  render() {
    const { errorMessage } = this.props;
    return (
      <div className={`${this.props.custclass}`}>
        <textarea
          row={this.props.rows}
          cols={this.props.cols}
          className={`textbox  ${errorMessage ? 'error-border' : ''}`}
          style={{ height: `${this.props.rows * 25}px` }}
          placeholder={this.props.placeholder}
          {...this.props}
        >
          {this.props.comment}
        </textarea>
        {errorMessage && (
          <label className="input-error-message">*{errorMessage}</label>
        )}
      </div>
    );
  }
}

export { TextBox };
