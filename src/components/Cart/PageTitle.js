import React from "react";

const PageTitle = ({ title, count, withCount, label, className }) => (
  <div className={`page-title-container ${className || ""}`}>
    <div className="page-title__main-title">{title}</div>
    {withCount && (
      <div className="products-count-text">
        ( {count} {label} )
      </div>
    )}
  </div>
);

export { PageTitle };
