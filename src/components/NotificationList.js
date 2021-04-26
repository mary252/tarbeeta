import React, { Component } from "react";
import "./Header/Header.css";
import { Link } from "react-router-dom";

class NotificationList extends Component {
  renderNotificationsList = notifications =>
    notifications.map((noti, i) => (
      <div className="noti-container" key={i}>
        <div
          className="thumb-notification"
          style={{
            backgroundImage: `url(${noti.avatar})`
          }}
        />
        <div className="title-description-container">
          <h4 className="desc-noti">{noti.body}</h4>
          <h2 className="noti-popup-time"> 5 sec</h2>
        </div>
      </div>
    ));

  render() {
    const { notifications = [], lang, locale } = this.props;

    return (
      <div
        className={`notification-container ${
          notifications.length ? "" : "no-notification-container"
        }`}
      >
        {notifications.length ? (
          <>
            <div>{this.renderNotificationsList(notifications)}</div>
            <hr />
            <div className="view-all">
              <Link className="link-view-all" to={`/${lang}/notifications`}>
                <span>{locale.view_all}</span>
              </Link>
            </div>
          </>
        ) : (
          <div>{locale.no_notifications}</div>
        )}
      </div>
    );
  }
}

export default NotificationList;
