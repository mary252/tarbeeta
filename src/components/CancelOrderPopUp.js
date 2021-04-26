import React, { Component } from "react";
import { Modal } from "./Layout";
import { TButton } from "./Form";

class CancelOrderPopUp extends Component {
  static propTypes = {};

  constructor() {
    super();
    this.modal = null;
  }

  toggle = () => {
    this.modal.toggle();
  };

  state = {
    is_busy: false
  };


  cancel_order = () => {
    this.setState({ is_busy: true });

    this.props.cancelOrder(this.props.chunk_id);

    this.setState({ is_busy: false });
    this.toggle();
  };

  render() {
    const {
      state: { is_busy },
    } = this;

    return (
      <Modal ref={m => (this.modal = m)}>
        <div className="address-popup" onClick={(e)=>e.stopPropagation()}>
          <div className="address-popup-div ">
            <p className="address-popup-header">
              {this.props.locale.cancel_order_popup_confirmation_text}
            </p>

            <div className="columns is-mobile">
              <div className="column is-4">
                <TButton
                  text={this.props.locale.yes}
                  onPress={this.cancel_order}
                  className="red outline full"
                  loading={is_busy}
                  ariaLabel="Cancel Order"
                />
              </div>
              <div className="column is-4 " />
              <div className="column is-4">
                <TButton
                  text={this.props.locale.no}
                  onPress={this.toggle}
                  className="gray outline full button"
                  ariaLabel="Close"
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default CancelOrderPopUp;
