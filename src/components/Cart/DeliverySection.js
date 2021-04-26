import React from "react";

const DeliverySection = ({ location }) => (
  <div className="delevery-card">
    <div>Delivers to {location}</div>
    <button className="button__no-default-style" aria-label="Open">
      <a className="change-text-info"> Change </a>
    </button>
  </div>
);

export { DeliverySection };
