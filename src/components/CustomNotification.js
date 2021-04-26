import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle
} from "@fortawesome/free-solid-svg-icons";

class CustomNotification extends Component {
  render_notifications = () => {
    let stack = [];

    this.props.notification.map((n, i) =>
      stack.push(
        <div
          key={i}
          className={`notification-wrap is-${n.type} ${
            n.visible ? `active` : ``
          }`}
          style={{ top: 50 + i * 120 }}
        >
          <div className="thumb">
            <FontAwesomeIcon
              icon={n.type == "success" ? faCheckCircle : faTimesCircle}
            />
          </div>

          <div className="info">
            <h4>{n.title}</h4>
            <p>{n.message}</p>
            {n.link ? <a href={n.link}>{n.link_text}</a> : null}
          </div>
        </div>
      )
    );

    return stack;
  };

  render() {
    if (!this.props.notification.length) {
      return <div />;
    }

    return this.render_notifications();
  }
}

export default CustomNotification;
