import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import {} from "@fortawesome/free-brands-svg-icons";

class Message extends Component {
  static propTypes = {
    msg: PropTypes.string
  };

  render() {
    const {
      props: { msg }
    } = this;
    return (
      <div className="sys-msg   has-background-info jcc">
        <FontAwesomeIcon icon={"exclamation-circle"} />
        {msg}
      </div>
    );
  }
}
export { Message };
