import React, { Component } from "react";
import "./PlaceHolder.css";
class HorizontalLines extends Component {
  render() {
    const { lang, width } = this.props;
    return (
      <div dir={undefined !== lang && lang == "ar" ? "rtl" : "ltr"}>
        <div className=" animated-background line1" />
        <div className=" animated-background line1" />
        <div className=" animated-background line2" />
      </div>
    );
  }
}

export default HorizontalLines;
