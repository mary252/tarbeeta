import React, { Component } from "react";
import "./layout.css";
class ActiveModal extends Component {
  render() {
    const {
      props: { children, visible = false, colsize, toggle, wrapperClass }
    } = this;
    return visible ? (
      <div className="modal-style" onClick={() => (toggle ? toggle() : null)}>
        <div
          className={`columns is-vcentered is-centered is-mobile ${wrapperClass}`}
        >
          <div
            className={`column is-${
              undefined !== colsize ? (12 - colsize) / 2 : 1
            }`}
          />

          <div
            className={`column is-${
              undefined !== colsize ? colsize : 10
            } is-flex aic is-full-vh children-container`}
          >
            {children}
          </div>

          <div
            className={`column is-${
              undefined !== colsize ? (12 - colsize) / 2 : 1
            }`}
          />
        </div>
      </div>
    ) : null;
  }
}

export { ActiveModal };
