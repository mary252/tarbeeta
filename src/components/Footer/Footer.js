import React, { Component } from "react";
import { connect } from "react-redux";
import "./Footer.css";

const mapStateToProps = state => {
  return {
    departments: state.departments.all,
    shop_username: state.user.shop_username
  };
};
class Footer extends Component {
  draw_departments = () => {
    return this.props.departments.map((dept, i) => (
      <li key={i}>
        <a href={`/${this.props.lang}/search?k=${dept.department_name}`}>
          {dept.department_name}
        </a>
      </li>
    ));
  };
  render() {
    const { shop_username, locale, lang } = this.props;
    return (
      <>
        <footer className="mar-top-25">
          <div className="section">
            <div className="container">
              <div className="footer-content-top">
                <div className="columns is-mobile is-multiline">
                  <div className="column is-2-desktop is-12-mobile">
                    <a href="/" className="footer-logo">
                      <img
                        src={
                          lang == "ar"
                            ? require("../../assets/images/new-logo-footer-arabic.svg")
                            : require("../../assets/images/new-logo-footer-english.svg")
                        }
                        alt="Tarbeeta"
                      />
                    </a>
                    <ul className="is-hidden-touch">
                      <li className="social-icons">
                        <a href=" https://www.fb.com/tarbeeta">
                          <img
                            alt="facebook logo"
                            src={require("../../assets/images/facebook.png")}
                          />
                        </a>
                        <a href="https://www.linkedin.com/company/tarbeetatech/">
                          <img
                            alt="linkedin logo"
                            src={require("../../assets/images/linkedin.png")}
                          />
                        </a>
                        <a href=" https://www.instagram.com/tarbeeta/">
                          <img
                            alt="instagram logo"
                            src={require("../../assets/images/instagram.png")}
                          />
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="column is-2-desktop is-6-touch">
                    <ul>
                      <li>
                        <h5>{locale.footer.categories_head_text}</h5>
                      </li>
                      {this.draw_departments()}
                    </ul>
                  </div>
                  <div className="column is-2-desktop is-6-touch">
                    <ul>
                      <li>
                        <h5>{locale.footer.buy}</h5>
                      </li>
                      <li>
                        <a href={`/${lang}/cart`}>
                          {locale.footer.shopping_card}
                        </a>
                      </li>
                      <li>
                        <a href={`/${lang}/orders`}>{locale.orders_link}</a>
                      </li>
                      {/*<li><a href="#">{locale.my_list}</a></li>*/}
                      <li>
                        <a href={`/${lang}/wallet`} aria-label="Wallet">
                          {locale.footer.e_wallet}
                        </a>
                      </li>
                      {/*<li><a href="#">{locale.tarbeeta_points}</a></li>*/}
                      <li>
                        <a href={`/${lang}/faqs`}>{locale.footer.faqs}</a>
                      </li>
                      <li>
                        <a href={`/${lang}/contactus`}>
                          {locale.footer.contact_us}
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div className="column is-2-desktop i6-hidden-touch">
                    <ul>
                      <li>
                        <h5>{locale.footer.sell}</h5>
                      </li>
                      {/*<li><a href="#">{locale.how_it_works}</a></li>}*/}
                      {shop_username != null ? (
                        <li>
                          <a href={`/${lang}/shop/${shop_username}`}>
                            {locale.view_my_shop}
                          </a>
                        </li>
                      ) : (
                        <li>
                          <a href={`/${lang}/start`}>{locale.start_shop}</a>
                        </li>
                      )}
                    </ul>
                  </div>
                  <div className="column is-4-desktop is-6-mobile">
                    <ul>
                      <li>
                        <p className="mar-bot-10">
                          {locale.footer.tarbeeta_store_head_text}
                        </p>
                      </li>
                      <li className="li-map">
                        <div className="map">
                          <a
                            target="_blank"
                            href="https://www.google.com/maps/@30.0648611,31.3369788,15z"
                          >
                            <img
                              alt="location"
                              src="https://maps.googleapis.com/maps/api/staticmap?center=30.0648611,31.3369788&zoom=15&size=400x400&key=AIzaSyBs5mn6Ta64iQxoRvNbX_YPI-Tr6u02-_I"
                            />
                          </a>
                        </div>
                      </li>
                      <li className="mar-bot-15">
                        <span>{locale.footer.visit_us_head_text}</span>
                        <p>{locale.footer.address_line1}</p>
                        <p style={{ fontWeight: "bold" }}>
                          {locale.footer.address_line2}
                        </p>
                      </li>
                      {/*<li><h5 >{locale.download_app_head_text}</h5></li>
                                            <li>
                                                <i class="fab fa-apple download-icon"></i>
                                                <i class="fab fa-android"></i>
                                </li>*/}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
        <div className="footer-bottom">
          <div className="section">
            <div className="container">
              <div className="footer-content-bottom">
                <div className="level is-multiline">
                  <div className="level-left">
                    <h6>{locale.rights_reserved_placeholder}</h6>
                  </div>
                  {/*<div className="level-right mar-top-0">
                                        <ul className="is-flex jcc">
                                            <li><a href="#">{locale.corporate_information_link}</a></li>
                                            <li><a href="#">{locale.forums_blog_link}</a></li>
                                            <li><a href="#">{locale.careers_link}</a></li>
                                            <li><a href="#">{locale.accessibility_link}</a></li>
                                            <li><a href="#">{locale.terms_and_conditions_link}</a></li>
                                            <li><a href="#">{locale.privacy_link}</a></li>
                                        </ul>
                                        </div>*/}
                  <div className="level-right">
                    <h6 style={{ direction: `rtl` }}>
                      {locale.contact_us_link}{" "}
                      <a
                        style={{ color: `#fff` }}
                        href={`mailto:info@tarbeeta.com`}
                      >
                        info@tarbeeta.com
                      </a>
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default connect(mapStateToProps)(Footer);
