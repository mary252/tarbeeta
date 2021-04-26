import React, { Component } from "react";
import PropTypes from "prop-types";
import "./Form/Form.css";

class Empty extends Component {
  static propTypes = {
    message: PropTypes.string.isRequired
  };
  render() {
    const {
      props: { message, children }
    } = this;
    return (
      <div className="empty-wrapper">
        <h1>{message}</h1>
        {children}
      </div>
    );
  }
}

export default Empty;
