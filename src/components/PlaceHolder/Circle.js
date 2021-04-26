import React, { Component } from "react";
import "./PlaceHolder.css";
class Circle extends Component {
  render() {
    const { lang } = this.props;
    return (
      <div
        dir={undefined !== lang && lang == "ar" ? "rtl" : "ltr"}
        className="placeholder-square animated-background"
      />
    );
  }
}

export default Circle;
