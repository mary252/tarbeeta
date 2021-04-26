import React, { Component } from "react";
import "../Cart/cart.css";
import ToggleButton from "../Cart/ToggleButton";
import PropTypes from "prop-types";

class FloatCollapsedSection extends Component {
  static propTypes = {
    renderUnCollapsedSec: PropTypes.func.isRequired,
    RenderCollapsedSec: PropTypes.func.isRequired
  };

  state = {
    collapsed: false
  };
  toggle = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  render() {
    const {
      state: { collapsed },
      toggle,
      props: { RenderCollapsedSec, renderUnCollapsedSec, isexpandable }
    } = this;
    return (
      <div className="receipt_box receipt-mobile  is-hidden-desktop-only">
        {isexpandable && (
          <div>
            <ToggleButton
              className="arrow-postions-left button__no-default-style"
              toggle={toggle}
              collapsed={collapsed}
            />
            {/* <ToggleButton
              className="arrow-postions-right button__no-default-style"
              toggle={toggle}
              collapsed={collapsed}
            /> */}
          </div>
        )}

        {collapsed && <div>{<RenderCollapsedSec {...this.props} />}</div>}
        <div className="total-div">{renderUnCollapsedSec()}</div>
      </div>
    );
  }
}

export { FloatCollapsedSection };
