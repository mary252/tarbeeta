import React, { Component } from "react";
import PropTypes from "prop-types";
import "./layout.css";
class Modal extends Component {
  static propTypes = {
    // renderUnCollapsedSec: PropTypes.func.isRequired,
    // renderCollapsedSec: PropTypes.func.isRequired
  };

  state = {
    visible: false
  };
  toggle = () => {
    this.setState({ visible: !this.state.visible });

  };

  render() {
    const {
      state: { visible },
      props: { children },
      toggle
    } = this;
    return visible ? (
      <div className="modal-style" onClick={()=> this.toggle()}>
        <div className="columns is-vcentered is-centered">
          <div className={`column is-${undefined !== this.props.colsize ? (12-this.props.colsize)/2 : 4}`}></div>

          <div className={`column is-${undefined !== this.props.colsize ? this.props.colsize : 4} is-flex aic is-full-vh`}>
            {children}
          </div>

          <div className={`column is-${undefined !== this.props.colsize ? (12-this.props.colsize)/2 : 4}`}></div>
        </div>
      </div>
    ) : null;
  }
}

export { Modal };
