import React, { Component } from "react";
import "./FiltersMobile.css";

class FiltersMobile extends Component {
  render() {
    const {
      filter_mobile,
      openFilterMobile,
      closeFilterMobile,
      filters
    } = this.props;
    return (
      <div style={{ display: "none" }}>
        <div
          onClick={openFilterMobile}
          className="filters-icon is-flex aic jcc"
        >
          <img
            src={require("../../assets/images/filter-icon.svg")}
            alt="filter"
          />
        </div>

        {filter_mobile && (
          <div className="filter-popup">
            <div className="filter-popup-title is-flex aic">
              <div onClick={closeFilterMobile}>
                <img
                  src={require("../../assets/images/close.svg")}
                  alt="close"
                />
              </div>
              <h4>Filter</h4>
              <div>
                <img
                  src={require("../../assets/images/tick-icon.svg")}
                  alt="tick"
                />
              </div>
            </div>
            <div className="filter-head">
              <ul>
                <li>Department</li>
                <li className="active">Color</li>
                <li>Size</li>
                <li>Price</li>
                <li>Sort</li>
              </ul>
            </div>
            <div className="filter-values" />
          </div>
        )}
      </div>
    );
  }
}

export default FiltersMobile;
