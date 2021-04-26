import React, { Component } from "react";
import { TButton } from "./Form";

import AddressPopUp from "./AddressPopUp";
import { connect } from "react-redux";
import * as actions from "../actions";
import "./components.css";

class AddressTabel extends Component {
  AddressPopup = null;
  openPopUp = () => this.AddressPopup.toggle();

  updateAddress = data => {
    this.props.addNewAddress(data);
  };

  render() {
    const {
      props: { locale, withEditLink, lang }
    } = this;
    return (
      <section className="white-box no-pad-right no-pad-left no-pad-top">
        <div className="table-head">
          <div className="level">
            <div className="level-left">
              <div className="level-item">
                <h4 className="table-head-tite med">
                  {locale.shop_addresses_table_title}
                </h4>
                <AddressPopUp
                  updateAddress={this.updateAddress}
                  ref={a => (this.AddressPopup = a)}
                  lang={lang}
                  translation={this.props.locale}
                  lang_id={this.props.lang_id}
                />
                <TButton
                  text={locale.shop_add_address_button}
                  className="blue outline"
                  onPress={this.openPopUp}
                  ariaLabel="Open Address Popup"
                />
              </div>
            </div>
            <div className="level-right is-hidden-mobile">
              <div className="level-item">
                {/* {withEditLink && (
                  <a className="blue med" href="#">
                    {locale.shop_edit_addresses_link}
                  </a>
                )} */}
              </div>
            </div>
          </div>
        </div>
        <div className="table-border">
          <div className="columns is-desktop is-hidden-touch">
            <div className="column is-2-desktop" />
            <div className="column is-1-desktop">
              <span className="grey med">{locale.shop_address_city_label}</span>
            </div>
            <div className="column is-1-desktop">
              <span className="grey med">{locale.shop_address_area_label}</span>
            </div>
            <div className="column is-7-desktop">
              <span className="grey med">
                {locale.shop_address_address_notes_label}
              </span>
            </div>
            <div className="column is-1-desktop" />
          </div>
        </div>
        <div className="table-row">
          {this.props.address &&
            this.props.address.map((address, i) => (
              <div className="container nthse-odd" key={i}>
                <div className="columns is-flex aic is-multiline">
                  <div className="column is-2-desktop is-12-mobile is-12-tablet">
                    <div className="is-flex">
                      <h4 className="address-num">
                        {locale.shop_address_address_label}
                      </h4>
                    </div>
                  </div>
                  <div className="column is-1-desktop is-6-mobile is-4-tablet">
                    <span className="is-hidden-desktop">
                      {locale.shop_address_city_label}
                    </span>
                    <h4> {address.city_name}</h4>
                  </div>
                  <div className="column is-1-desktop is-6-mobile is-4-tablet">
                    <span className="is-hidden-desktop">
                      {locale.shop_address_area_label}
                    </span>
                    <h4> {address.area_name}</h4>
                  </div>
                  <div className="column is-7-desktop is-12-mobile is-12-tablet">
                    <div className="address-notes-mobile">
                      <span className="is-hidden-desktop">
                        {locale.shop_address_address_notes_label}
                      </span>
                      <p>{address.address_line_1}</p>
                    </div>
                  </div>

                  <div className="column is-1-desktop is-12-mobile is-12-tablet is-flex aic jcc">
                    <a
                      className="red med"
                      onClick={() => this.props.delAddress(address.id)}
                    >
                      {locale.delete_link}
                    </a>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>
    );
  }
}

export default connect(
  null,
  actions
)(AddressTabel);
