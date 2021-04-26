import React from "react";

const CheckRow = ({ title, value, titleClass, valueClass, currency }) => (
  <div className="receipt-row">
    <h1 className={titleClass ? titleClass : "title_reciet"}>{title}</h1>
    <h1 className={valueClass ? valueClass : "money_font2"}>
      {value} {currency}
    </h1>
  </div>
);

export { CheckRow };
