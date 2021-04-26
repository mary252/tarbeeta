import React, { Component } from "react";
import "./Form.css";

class Radio extends Component {
  state = {
    active_filters: null
  };

  componentWillReceiveProps({ someProp }) {
    this.setState({
      ...this.state,
      someProp
    });
  }

  render() {
    const { ischecked } = this.props;

    return (
      <div className={`radio-button-container ${ischecked ? `active` : ``}`}>
        {ischecked ? <div className="dot" /> : null}
      </div>
    );
  }
}

export { Radio };
