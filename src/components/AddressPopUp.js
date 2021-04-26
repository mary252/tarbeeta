import React, { Component } from "react";
import { Modal } from "./Layout";
import { DropDown, TButton, TextBox } from "./Form";
import { fetchCities, fetchAreas, addAddress } from "../services/location";

import { EG } from "../common";
import "./components.css";
import { validate } from "../ultils/validate/validation";

class AddressPopUp extends Component {
  static propTypes = {};

  constructor() {
    super();
    this.modal = null;
  }

  toggle = () => {
    this.modal.toggle();
  };

  state = {
    cities: [],
    areas: [],
    city_id: null,
    area_id: null,
    address: null,
    is_busy: false,
    addressError: ""
  };

  componentDidMount = async () => {
    await fetchCities(EG, this.props.lang_id).then(cities => {
      this.setState(
        {
          cities: cities.data,
          city_id: cities.data[0] ? cities.data[0].id : null
        },
        () => {
          this.load_areas(this.state.city_id);
        }
      );
    });
  };

  load_areas = async cityId => {
    await fetchAreas(cityId,this.props.lang_id).then(areas => {
      this.setState({
        areas: areas.data,
        area_id: areas.data.length ? areas.data[0].id : null
      });
    });
  };

  validation = fieldsArray => {
    this.setState({
      error_msg: null
    });

    return new Promise(async (resolve, reject) => {
      const errorsArray = await fieldsArray.map((field, i) => {
        return { [`${field}Error`]: validate(field, this.state[field]) };
      });

      let hasErrors = false;

      errorsArray.map((error, j) => {
        let key = Object.keys(error)[0],
          value = Object.values(error)[0];

        this.setState({
          [key]: value
        });

        if (value !== null) {
          hasErrors = true;
        }
      });

      if (hasErrors) {
        reject(false);
      }

      resolve(true);
    });
  };

  add_address = async () => {
    this.validation(["address"])
      .then(() => {
        this.setState({ is_busy: true });
        // let response = await addAddress({
        //   area_id: this.state.area_id,
        //   address: this.state.address
        // });
        addAddress({
          area_id: this.state.area_id,
          address: this.state.address
        })
          .then(response => {
            // if(this.props.updateAddressId){
            //   this.props.updateAddressId(response.data[0].id)
            // }
            localStorage.setItem("address_id", response.data[0].id);
            this.props.updateAddressId &&
              this.props.updateAddressId(response.data[0].id);
            this.props.autoSelectAddress &&
              this.props.autoSelectAddress(
                response.data[response.data.length - 1]
              );
            let addressAdded = JSON.stringify(
              response.data[response.data.length - 1]
            );
            localStorage.setItem("address_added", addressAdded);
            if (response.status) {
              this.toggle();
            }

            this.props.updateAddress(response.data);
            // localStorage.setItem("address_id", this.props.address[0].id)
            this.setState({ is_busy: false });
          })
          .catch(e => {
            this.setState({ is_busy: false });
          });
      })
      .catch(formErrors => {
      });
  };

  render() {
    const {
      state: { is_busy },
      toggle,
      props: { renderCollapsedSec, renderUnCollapsedSec, isexpandable, translation }
    } = this;


    return (
      <Modal ref={m => (this.modal = m)}>
        <div onClick={e => e.stopPropagation()} className="address-popup">
          <div className="address-popup-div ">
            <p className="address-popup-header">
              {this.props.translation.shop_add_address_button}
            </p>
            <div
              className={`columns is-mobile`}
              style={{ direction: this.props.lang == "ar" ? `ltr` : `rtl` }}
            >
              <div className="column is-half">
                <DropDown
                  ariaLabel="Select Cities"
                  options={this.state.cities}
                  onSelect={e => this.load_areas(e.target.value)}
                />
              </div>
              <div className="column is-half">
                <DropDown
                  ariaLabel="Select Areas"
                  options={this.state.areas}
                  onSelect={e => {
                    this.setState({
                      area_id: e.target.value
                    });
                  }}
                />
              </div>
            </div>
            <TextBox
              placeholder={
                this.props.translation.address_popup_details_textbox_placeholder
              }
              custclass="mar-bot-15"
              errorMessage={this.state.addressError}
              onBlur={() =>
                this.validation(["address"])
                  .then()
                  .catch(e => {})
              }
              onChange={e => {
                this.setState({
                  address: e.target.value
                });
              }}
              rows={5}
            />
            <div className="columns is-mobile">
              <div className="column is-4">
                <TButton
                  text={this.props.translation.cancel}
                  onPress={this.toggle}
                  className="red outline full"
                  ariaLabel="Cancel"
                />
              </div>
              <div className="column is-4 " />
              <div className="column is-4">
                <TButton
                  text={this.props.translation.add_mobile.button}
                  onPress={() => this.add_address()}
                  className="grad-blue full button"
                  loading={is_busy}
                  ariaLabel="Save User Address"
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default AddressPopUp;
