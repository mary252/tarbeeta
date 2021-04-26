import "./toast.css";
import React, { Component } from "react";

class Toast extends Component {
  getIcon() {
    switch (this.props.level) {
      case "warning":
        return "http://svgshare.com/i/19x.svg";
      case "danger":
        return "http://svgshare.com/i/19E.svg";
      case "success":
        return "http://svgshare.com/i/19y.svg";
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.visible !== nextProps.visible) {
      this.setState({
        visible: nextProps.visible
      });
    }
    setTimeout(this.setState, 3000);
    this.setState({ isHidden: false });
  }

  render() {
    let classes = `toast ${this.props.level} `;
    classes += this.props.visible ? "visible" : "";
    return (
      <div className={classes}>
        <figure>
          <img src={this.getIcon()} alt="toast" />
        </figure>
        <div className="toast-content">
          <p>{this.props.message}</p>
          <div>{this.props.children}</div>
        </div>
      </div>
    );
  }
}

export { Toast };
