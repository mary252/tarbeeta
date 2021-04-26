import React from "react";
import "./CheckBox.css";

const CustomCheckbox = props => (
  <div className="custom-checkbox-container" onClick={props.onChange}>
    <div
      className="styled-checkbox"
      style={
        props.checked
          ? { background: "#5378dd" }
          : { border: "solid 1px #e8e8e8", backgroundColor: "#ffffff" }
      }
    >
      <svg
        className="Icon"
        viewBox="0 0 24 24"
        style={{
          fill: "none",
          stroke: "white",
          strokeWidth: "2px",
          visibility: props.checked ? "visible" : "hidden"
        }}
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  </div>
);

export default CustomCheckbox;
