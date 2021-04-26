import React, { Component } from "react";
import "./PlaceHolder.css";
class Line extends Component {
  render() {
    const { width } = this.props;
    return <div className=" animated-background line1" style={{ width }} />;
  }
}

export default Line;
