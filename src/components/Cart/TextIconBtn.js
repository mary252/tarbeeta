import React from "react";
import DelSvg from "./DelSvg";
import LoveSvg from "./LoveSvg";
import "./cart.css";

const TextIconBtn = props => (
  <button className="icon_text_btn" {...props}>
    <div className="icon_text_bttuon">{props.render()}</div>
    <a className="icon-text">{props.text}</a>
  </button>
);

export const TextIconBtnDel = props => (
  <TextIconBtn
    aria-label="Delete Product From Cart"
    render={() => <DelSvg />}
    text={props.text}
    {...props}
  />
);

export const TextIconBtnFav = props => (
  <TextIconBtn
    aria-label="Add Product To Favorite"
    render={() => <LoveSvg />}
    text={props.text}
    {...props}
  />
);
