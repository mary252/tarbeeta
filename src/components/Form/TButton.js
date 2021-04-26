import React, { Component } from "react";
import "./Form.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class TButton extends Component {
  render() {
    const {
      onPress,
      className,
      leftIcon,
      rightIcon,
      lang,
      text,
      loading,
      disabled,
      tip,
      ariaLabel
    } = this.props;
    return (
      <button
        onClick={onPress}
        className={`t-button ${className} ${loading ? `is-loading` : ``}`}
        disabled={disabled}
        data-tooltip={tip}
        aria-label={ariaLabel}
      >
        <div className={`${lang == "ar" ? "rtl" : ""}`}>
          {undefined !== lang && lang == "en" ? (
            undefined !== leftIcon ? (
              <FontAwesomeIcon icon={leftIcon} className="left-icon" />
            ) : null
          ) : undefined !== rightIcon ? (
            <FontAwesomeIcon icon={rightIcon} className="right-icon" />
          ) : null}
          {/* {undefined !== leftIcon ? (
            <FontAwesomeIcon icon={leftIcon} className="left-icon" />
          ) : null} */}
          <span>{text}</span>
        </div>
      </button>
    );
  }
}

export { TButton };
