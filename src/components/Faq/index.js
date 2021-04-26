import React, { Component } from "react";
import "./faq.css";
import Accordin from "../Accordin";

class Faq extends Component {
  renderFaqList = () =>
    this.props.questions.map((q, i) => (
      <Accordin title={q.question} content={q.answer} key={i} />
    ));
  render() {
    const { icon, title } = this.props;
    return (
      <div {...this.props}>
        <div className="faq-header rev">
          <div className="faq-icon">{icon}</div>
          <div className="faq-title">{title}</div>
        </div>
        <div className="faqs-list">{this.renderFaqList()}</div>
      </div>
    );
  }
}

export default Faq;
