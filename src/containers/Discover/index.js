import React, { Component } from "react";
import { Page, SliderButton, Slides, Slider } from "../../components";
import "./Discover.css";
import MessengerCustomerChat from "react-messenger-customer-chat";

import {
  load_most_selling,
  load_top_deals,
  load_trending,
  load_featured,
  load_recently_add
} from "../../services";
import {
  FACEBOOK_PAGE_ID,
  FACEBOOK_APP_ID,
  FACEBOOK_CHAT_POPUP_THEME_COLOR
} from "../../common";
import * as actions from "../../actions";
import { connect } from "react-redux";

import { slidersAr, slidersEn, slideshowAr, slideshowEn } from "./sliders";
export class Discover extends Component {
  t = null;

  currentIndex = 0;
  pause = false;

  imageSlider = React.createRef();
  state = {
    image_slider:
      this.props.lang == "en" || localStorage.getItem("locale") == "en"
        ? slidersEn
        : slidersAr,
    most_selling: [],
    top_deals: [],
    trending_Men: [],
    trending_Women: [],
    trending_Kids: [],
    recently_add: [],
    trending_home: [],
    supermarket: [],
    featured_products: [],
    slideshow:
      this.props.lang == "en" || localStorage.getItem("locale") == "en"
        ? slideshowEn
        : slideshowAr,
    currentIndex: 0,
    translateValue: 0,
    loading: false,
    loading_featured: false,
    loading_most_selling: false,
    loading_recently_added: false,
    loading_top_deals: false,
    loading_men: false,
    loading_woman: false,
    loading_kid: false,
    loading_home: false,
    loading_supermarket: false
  };

  goTo = direction => {
    if (this.pause == true) {
      clearInterval(this.t);
      this.t = setInterval(() => {
        this.goTo("auto");
      }, 15000);
    }

    const { image_slider } = this.state;
    let index = 0;
    switch (direction) {
      case "auto":
        index = this.currentIndex + 1;
        this.currentIndex = index >= image_slider.length ? 0 : index;
        break;
      case "prev":
        index = this.currentIndex - 1;
        this.currentIndex = index < 0 ? image_slider.length - 1 : index;
        this.pause = true;
        break;
      case "next":
        index = this.currentIndex + 1;
        this.currentIndex = index >= image_slider.length ? 0 : index;
        this.pause = true;
        break;
      default:
        this.currentIndex = direction;
        this.pause = true;
        break;
    }

    this.setState({
      slideIndex: this.currentIndex,
      slideshow: image_slider[this.currentIndex]
    });
  };

  componentDidMount = async () => {
    window.scroll({ top: 0, left: 0, behavior: "smooth" });
    document.onkeydown = e => {
      switch (e.keyCode) {
        case 37:
          this.goTo("prev");
          break;
        case 39:
          this.goTo("next");
          break;
      }
    };

    if (this.pause == false) {
      this.t = setInterval(() => {
        this.goTo("auto");
      }, 15000);
    }

    this.setState(() => ({
      loading: true,
      loading_recently_added: true,
      loading_top_deals: true,
      loading_featured: true,
      loading_men: true,
      loading_woman: true,
      loading_kid: true,
      loading_home: true,
      loading_supermarket: true
    }));

    const limits = 18;
    const lang_id = this.props.lang_id;

    await this.load_featured(lang_id, limits);

    await this.load_top_deals(lang_id, limits);

    await this.load_most_selling(lang_id, limits);

    await this.load_trending(lang_id, limits, 1);

    await this.load_trending(lang_id, limits, 2);

    await this.load_trending(lang_id, limits, 3);
    await this.load_trending(lang_id, limits, 5); //supermarket
    await this.load_trending(lang_id, limits, 4); //home

    await this.load_recently_add(lang_id, limits);

    this.setState({
      loading: false,
      loading_kid: false
    });
  };

  load_most_selling = async (lang_id, limits) => {
    try {
      this.setState(() => ({ loading_most_selling: true }));
      let res = await load_most_selling(lang_id, limits);
      this.setState({
        most_selling: res.data,
        loading_most_selling: false
      });
    } catch (e) {}
  };

  load_recently_add = async (lang_id, limits) => {
    try {
      let res = await load_recently_add(lang_id, limits);
      this.setState({
        recently_add: res.data,
        loading_recently_added: false
      });
    } catch (e) {}
  };

  load_top_deals = async (lang_id, limits) => {
    try {
      let res = await load_top_deals(lang_id, limits);
      this.setState({
        top_deals: res.data,
        loading_top_deals: false
      });
    } catch (e) {}
  };

  load_featured = async (lang_id, limits) => {
    try {
      let res = await load_featured(lang_id, limits);

      this.setState({
        featured_products: res.data,
        loading_featured: false
      });
    } catch (e) {}
  };

  load_trending = async (lang_id, limits, department_id) => {
    try {
      let res = await load_trending(lang_id, limits, department_id);

      if (department_id == 1) {
        this.setState({
          trending_Men: res.data,
          loading_men: false
        });
      }

      if (department_id == 2) {
        this.setState({
          trending_Women: res.data,
          loading_woman: false
        });
      }

      if (department_id == 3) {
        this.setState({
          trending_Kids: res.data,
          loading_kid: false
        });
      }
      if (department_id == 4) {
        this.setState({
          trending_home: res.data,
          loading_home: false
        });
      }
      if (department_id == 5) {
        this.setState({
          supermarket: res.data,
          loading_supermarket: false
        });
      }
    } catch (e) {}
  };

  slideWidth = () => {
    if (this.imageSlider.current) {
      return this.imageSlider.current.offsetWidth;
    }
  };

  openProductDetails = (id, colId) => {
    this.props.TogglePopup(id, this.props.lang_id, colId);
  };
  render() {
    const {
      state: {
        most_selling,
        top_deals,
        trending_Men,
        trending_Women,
        trending_Kids,
        featured_products,
        recently_add,
        loading,
        loading_featured,
        loading_top_deals,
        loading_most_selling,
        loading_recently_added,
        loading_kid,
        loading_men,
        loading_woman,
        trending_home,
        loading_home,
        supermarket,
        loading_supermarket
      },
      props: { locale, lang }
    } = this;
    return (
      <Page
        title={locale.discover.title}
        description={locale.discover.description}
        {...this.props}
      >
        <div className="section">
          <div className="container">
            <div>
              <MessengerCustomerChat
                pageId={FACEBOOK_PAGE_ID}
                // greetingDialogDisplay={0}
                appId={FACEBOOK_APP_ID}
                themeColor={FACEBOOK_CHAT_POPUP_THEME_COLOR}
                language={this.props.lang == "en" ? "en_US" : "ar_AR"}
                greetingDialogDelay={0}
                minimized={true}
                shouldShowDialog={false}
                loggedInGreeting={
                  this.props.locale.facebook_chat_greeting_message
                }
                loggedOutGreeting={
                  this.props.locale.facebook_chat_greeting_message
                }
              />
            </div>

            <div className="image-slider-wrapper">
              <div className="image-slider">
                <SliderButton
                  className="left"
                  imageSrc={require("../../assets/images/white-slider-arrow.svg")}
                  onPress={() => this.goTo("prev")}
                />

                <SliderButton
                  className="right"
                  imageSrc={require("../../assets/images/white-slider-arrow.svg")}
                  onPress={() => this.goTo("next")}
                />

                <Slides
                  listItems={this.state.image_slider}
                  slideshow={this.state.slideshow}
                  goTo={this.goTo} // function
                  slideIndex={this.state.slideIndex}
                  pause={this.pause}
                  timePause={this.timePause}
                  timeout={this.timeout}
                />
              </div>
            </div>

            <Slider
              loading={loading_featured}
              openProductDetails={this.openProductDetails}
              products={featured_products}
              className="mar-bot-40"
              title={locale.discover.featured_products}
              href={`/${lang}/`}
              match={this.props.match}
              withseller={true}
              lang={lang}
              locale={this.props.locale}
            />

            <Slider
              loading={loading_top_deals}
              openProductDetails={this.openProductDetails}
              products={top_deals}
              className="mar-bot-40"
              title={locale.discover.top_deals}
              href={`/${lang}/`}
              match={this.props.match}
              withseller={true}
              lang={lang}
              locale={this.props.locale}
            />

            <div className="columns mar-bot-25" />

            <Slider
              loading={loading_most_selling}
              openProductDetails={this.openProductDetails}
              products={most_selling}
              className="mar-bot-40"
              title={locale.discover.top_selling}
              href={`/${lang}/`}
              match={this.props.match}
              withseller={true}
              lang={lang}
              locale={this.props.locale}
            />

            <Slider
              loading={loading_supermarket}
              openProductDetails={this.openProductDetails}
              products={supermarket}
              className="mar-bot-40"
              title={locale.discover.trending_in_supermarket}
              link={locale.view_all}
              href={`/${lang}/search?k=sm`}
              match={this.props.match}
              withseller={true}
              lang={lang}
              locale={this.props.locale}
            />

            <Slider
              loading={loading_men}
              openProductDetails={this.openProductDetails}
              products={trending_Men}
              className="mar-bot-40"
              title={locale.discover.trending_in_men_fashion}
              link={locale.view_all}
              href={`/${lang}/search?k=men`}
              match={this.props.match}
              withseller={true}
              lang={lang}
              locale={this.props.locale}
            />

            <Slider
              loading={loading_woman}
              openProductDetails={this.openProductDetails}
              products={trending_Women}
              className="mar-bot-40"
              title={locale.discover.trending_in_women_fashion}
              link={locale.view_all}
              href={`/${lang}/search?k=women`}
              match={this.props.match}
              withseller={true}
              lang={lang}
              locale={this.props.locale}
            />

            <Slider
              loading={loading_kid}
              openProductDetails={this.openProductDetails}
              products={trending_Kids}
              className="mar-bot-40"
              title={locale.discover.trending_in_kids_fashion}
              link={locale.view_all}
              href={`/${lang}/search?k=kids`}
              match={this.props.match}
              withseller={true}
              lang={lang}
              locale={this.props.locale}
            />
            <Slider
              loading={loading_home}
              openProductDetails={this.openProductDetails}
              products={trending_home}
              className="mar-bot-40"
              title={locale.discover.trending_in_home}
              link={locale.view_all}
              href={`/${lang}/search?k=men`}
              match={this.props.match}
              withseller={true}
              lang={lang}
              locale={this.props.locale}
            />

            <Slider
              loading={loading_recently_added}
              products={recently_add}
              className="mar-bot-40"
              title={locale.discover.new_shops_title}
              href={`/${lang}/`}
              match={this.props.match}
              locale={locale}
              shopCard
              lang={lang}
            />
          </div>
        </div>
      </Page>
    );
  }
}

export default connect(
  null,
  actions
)(Discover);
