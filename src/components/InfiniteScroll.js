import React from "react";
import PropTypes from "prop-types";
import LoaderEllipsis from "./Loader/LoaderEllipsis";
class InfiniteScroll extends React.Component {
  static propTypes = {
    loadMore: PropTypes.func.isRequired,
    list: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired
  };
  componentDidMount() {
    window.addEventListener("scroll", this.onScroll, false);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll, false);
  }

  onScroll = () => {
    const { list, isLoading, loadMore, showMore } = this.props;
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
      list.length &&
      !isLoading &&
      showMore
    ) {
      loadMore();
    }
  };

  render() {
    const { children, isLoading } = this.props;
    return (
      <React.Fragment>
        {children}
        {isLoading && (
          <div className="infinite-loader-container">
            <LoaderEllipsis />
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default InfiniteScroll;
