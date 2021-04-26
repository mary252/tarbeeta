import React from "react";
import { Images } from "../../common";

const PaymentWay = () => (
  <div className="payment-container">
    <img src={Images.masary} alt="Masary" />
    <h2 className="sperator-text">Or</h2>
    <img src={Images.aman} alt="aman" />
  </div>
);

export { PaymentWay };
