import React, { Component } from "react";
import PropTypes from "prop-types";
import "./tabs.css";

class Tab extends Component {
  static propTypes = {
    activeTab: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
  };

  onClick = () => {
    const { onClick, indicator } = this.props;
    onClick(indicator);
  };

  render() {
    const {
      onClick,
      props: { activeTab, label, indicator, isTabDisabled }
    } = this;

    let className = "tab-list-item",
      classNameIndicator = "";

    if (activeTab === indicator) {
      className += " tab-list-active";
      classNameIndicator = "indicator";
    }
    if (isTabDisabled) {
      className += " disabled-tab";
    }

    return (
      <div className={className} onClick={onClick}>
        <div className="tab-label">{label}</div>
        <span className={classNameIndicator} />
      </div>
    );
  }
}

export default Tab;
