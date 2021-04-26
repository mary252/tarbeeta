import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import {} from "@fortawesome/free-brands-svg-icons";

class Notification extends Component {
  

  static propTypes = {
    message: PropTypes.string,
    willFade: PropTypes.bool
  };

  hide = () =>{ 
    this.props.onClose();
  };

  componentWillReceiveProps() {
     this.fade();
  }

  fade = () => {
    if (this.props.willFade) {
      setTimeout(this.hide, 3000);
    }
  };

  render() {
    const {
      props: { message, isError },
     } = this;
    return message ? (
      <div className={`sys-msg  ${isError && 'has-background-danger'} ${!isError && 'has-background-success'} fixed-error jcc notification`}
      >
        <FontAwesomeIcon icon={"exclamation-circle"} />
        {message}
        <button className="delete" onClick={this.hide} />
      </div>
    ) : null;
  }
}
export { Notification };
