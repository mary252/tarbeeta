import React, { Component } from "react";
import {
  PageTitle,
  Page,
  Faq,
  BreadCrumb,
  Exclamation,
  Payment,
  Setting,
  Rewards,
  Shipping
} from "../components";
import { getFAQs } from "../services";

const RenderChildrens = props => {
  let renderChild = null;
  React.Children.forEach(props.children, child => {
    if (child.key === props.name) {
      renderChild = child;
    }
  });
  return renderChild;
};

const Icon = ({ name }) => (
  <RenderChildrens name={name}>
    <Exclamation key={"Exclamation"} />
    <Payment key={"Payment"} />
    <Setting key={"Setting"} />
    <Rewards key={"Rewards"} />
    <Shipping key={"Shipping"} />
  </RenderChildrens>
);
class Faqs extends Component {
  state = {
    faqs: []
  };

  async componentDidMount() {
    const { lang_id } = this.props;

    await this.getFAQs(lang_id);
  }
  renderFaqs = () =>
    this.state.faqs.map((faq, i) => (
      <Faq
        className="column is-6-desktop is-12-mobile is-12-tablet "
        title={faq.title}
        questions={faq.questions}
        icon={<Icon name={faq.icon} />}
        key={i}
      />
    ));

  getFAQs = async lang_id => {
    try {
      let res = await getFAQs(lang_id);
      this.setState({ faqs: res.data });
    } catch (e) {}
  };
  render() {
    const { locale } = this.props;
    return (
      <Page title={locale.faq} description={locale.faq_desc} {...this.props}>
        <div className="section">
          <div className="container">
            <BreadCrumb
              history={[
                {
                  name: locale.tarbeeta,
                  href: `/${this.props.lang}`
                }
              ]}
              activeRoute={locale.faq}
            />
            <PageTitle title={locale.faq} label={locale.items_label} />
            <div className="columns  is-multiline faq-container">
              {this.renderFaqs()}
            </div>

            <div />
          </div>
        </div>
      </Page>
    );
  }
}

export default Faqs;
