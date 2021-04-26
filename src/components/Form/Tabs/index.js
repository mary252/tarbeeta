import React, { Component } from "react";
import PropTypes from "prop-types";
import "./tabs.css";
import Tab from "./tab";

class Tabs extends Component {
  static propTypes = {
    children: PropTypes.instanceOf(Array).isRequired
  };

  state = {
    activeTab: this.props.defaultTab || this.props.children[0].props.indicator
  };

  onClickTabItem = tab => {
    this.setState({ activeTab: tab });
  };

  navigateNext = () => {
    if (this.state.activeTab >= this.props.children.length - 1) return;
    this.setState({ activeTab: this.state.activeTab + 1 });
  };
  navigatePrevious = () => {
    if (this.state.activeTab == 0) return;
    this.setState({ activeTab: this.state.activeTab - 1 });
  };

  render() {
    const {
      onClickTabItem,
      props: { children },
      state: { activeTab }
    } = this;

    return (
      <div className="tabs">
        <div className="tab-list">
          {children.map(child => {
            const { label, indicator, isTabDisabled } = child.props;

            return (
              <Tab
                activeTab={activeTab}
                key={indicator}
                indicator={indicator}
                label={label}
                onClick={onClickTabItem}
                isTabDisabled={isTabDisabled}
              />
            );
          })}
        </div>
        <div className="tab-content">
          {children.map(child => {
            if (child.props.indicator !== activeTab) return undefined;
            return child.props.children;
          })}
        </div>
      </div>
    );
  }
}

export { Tabs };
