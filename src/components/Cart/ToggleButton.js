import React from "react";
import ArrowUp from "./ArrowUp";
import ArrowDown from "./ArrowDown";

export default ({ collapsed, color, className, toggle = () => {} }) => (
  <button
    className={className}
    onClick={toggle}
    aria-label={collapsed ? "collapse View" : "uncollapse View"}
  >
    {collapsed ? <ArrowUp color={color} /> : <ArrowDown color={color} />}
  </button>
);
