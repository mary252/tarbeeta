import React, { Component } from "react";
import "./Accordin.css";
import ToggleButton from "../Cart/ToggleButton";

class Accordion extends React.Component {
  state = {
    collapsed: false
  };

  toggle = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  render() {
    const {
      state: { collapsed },
      props: { title, content }
    } = this;

    return (
      <div className="accordin-container">
        <div className="accordin-header" onClick={this.toggle}>
          <ToggleButton
            color={"#444444"}
            className=" button__no-default-style accordin-arrow"
            collapsed={!collapsed}
          />

          <div className="accordin-header-text">{title}</div>
        </div>
        {collapsed && (
          <div className="accordin-body content-text">{content}</div>
        )}
      </div>
    );
  }
}

export default Accordion;
