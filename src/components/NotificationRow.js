import React, { Component } from "react";
import "./components.css";

class NotificationRow extends Component {
  render() {
    const {
      body = "",
      avatar = "",
      locale,
      url = "",
      date_add = "",
      href = ""
    } = this.props;

    return (
      <div className="notification-raw-continer columns is-mobile is-multiline">
        <img className="notification-raw-avatar " src={avatar} alt="avatar" />
        <div className="column is-7-desktop ">{body}</div>
        <div className="column is-2-desktop is-12-touch" />
        <div className="column is-2-mobile is-hidden-desktop is-3-touch" />

        <div className=" notification-raw-time">{date_add}</div>
      </div>
    );
  }
}

export default NotificationRow;
