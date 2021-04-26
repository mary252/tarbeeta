import React from "react";
import animatedLoader from "../../assets/images/logomotion-final.gif";

var preLoader = {
  width: "100%",
  height: "100%",
  backgroundColor: "#f9f9f9",
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: 200000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

export default () => {
  return (
    <div style={preLoader}>
      <img src={animatedLoader} alt="..." className="animate-loader" />
    </div>
  );
};
