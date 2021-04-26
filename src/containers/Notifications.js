import React, { Component } from "react";
import {
  Page,
  PageTitle,
  BreadCrumb,
  NotificationRow,
  InfiniteScroll,
  EmptyPage
} from "../components";
import { connect } from "react-redux";
import * as actions from "../actions";

const mapStateToProps = state => {
  const {
    userNotifications: {
      data,
      numberOfNotiUnseen,
      loading,
      showMore,
      page,
      is_busy
    }
  } = state;
  return {
    data,
    numberOfNotiUnseen,
    loading,
    showMore,
    page,
    is_busy
  };
};

class Notifications extends Component {
  state = {
    loading: this.props.loading
  };

  async componentDidMount() {
    const { lang_id, getNotification } = this.props;
    getNotification();
  }
  renderNotifications = () =>
    this.props.data.length ? (
      this.props.data.map((noti, i) => (
        <div className="column is-9 is-mobile">
          <NotificationRow {...noti} />
        </div>
      ))
    ) : (
      // <div className="empty-wrapper">
      //   <div style={{ marginBottom: "150px", textAlign: "center" }}>
      //     {locale.no_notifications}
      //   </div>
      // </div>
      <EmptyPage
        locale={this.props.locale}
        {...this.props}
        lang={this.props.lang}
        noNoifications
      />
    );
  loadMore = () => {
    const { getMoreNotification, page } = this.props;

    getMoreNotification(page);
  };
  render() {
    const {
      loadMore,
      props: { showMore, data, loading, is_busy, locale }
    } = this;
    return (
      <Page
        {...this.props}
        title={locale.notification}
        description={locale.descriptionSearch}
      >
        <div className="section">
          <div className="container">
            <BreadCrumb
              history={[
                {
                  name: locale.tarbeeta,
                  href: `/${this.props.lang}`
                }
              ]}
              activeRoute={locale.notification}
            />
            <PageTitle title={locale.notification} label={locale.items_label} />
            <InfiniteScroll
              list={data}
              isLoading={is_busy}
              loadMore={loadMore}
              showMore={showMore}
            >
              <div className="columns is-multiline">
                {this.renderNotifications()}
              </div>
            </InfiniteScroll>
            <div />
          </div>
        </div>
      </Page>
    );
  }
}

export default connect(
  mapStateToProps,
  actions
)(Notifications);
