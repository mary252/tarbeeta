import React from "react";

export default ({ onClick = () => {}, isVisible }) => (
  <button
    onClick={e => {
      e.stopPropagation();
      onClick();
    }}
    aria-label="Close Form"
    className="aic jcc close-button-edit-shop"
    style={{
      ...(isVisible
        ? {
            display: `flex`,
            border: `solid 1px #f3444a`,
            position: "absolute",
            width: " 25px",
            height: " 25px",
            backgroundColor: " #f3444a",
            color: " #ffffff",
            top: " -10px",
            right: " -10px",
            borderRadius: " 45%",
            fontSize: " 18px"
          }
        : { display: `none` })
    }}
  >
    <span className="fas fa-times" />
  </button>
);
