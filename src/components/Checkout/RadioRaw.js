import React, { Component } from "react";
import PropTypes from "prop-types";
import { Radio, TButton } from "../Form";

class RadioRaw extends Component {
  static propTypes = {
    renderContent: PropTypes.func,
    isSelected: PropTypes.bool.isRequired
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
      props: {
        isSelected,
        nobutton,
        renderContentAlign,
        selectRow,
        id,
        isdisabled,
        renderAdds,
        naviagateNext,
        is_busy,
        locale,
        on_focus = () => {}
      }
    } = this;
    return (
      <div
        // className={`column is-12 payment-row-container ${
        className={`payment-row-container ${
          isSelected ? "active-address-row" : ""
        } ${isdisabled ? "disabled-wallet" : ""} `}
        onClick={async () => {
          selectRow(id);
          await on_focus();
        }}
        disabled={isdisabled}
      >
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <Radio ischecked={isSelected} />
          {renderContentAlign()}
        </div>

        {isSelected ? (
          <React.Fragment>
            {renderAdds ? (
              <div style={{ width: "100%" }}>{renderAdds()}</div>
            ) : null}

            {undefined !== nobutton ? null : (
              <div className="btn-parent-container">
                <div className="btn-place-container">
                  <TButton
                    ariaLabel="Place Order"
                    loading={is_busy}
                    text={locale.place_order}
                    className="green place-order-btn button"
                    onPress={naviagateNext}
                  />
                </div>
              </div>
            )}
          </React.Fragment>
        ) : null}
      </div>
    );
  }
}

export { RadioRaw };
