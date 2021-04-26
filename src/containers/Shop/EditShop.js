import React, { Component } from "react";
import "./StartShop.css";
import { Redirect } from "react-router-dom";
import * as actions from "../../actions";
import {
  uploadPic,
  editShop,
  getInfo,
  check_shop_owner,
  fetchInfo
} from "../../services";
import { connect } from "react-redux";

import { Page, withLoader, ShopForm } from "../../components";
import { validate } from "../../ultils/validate/validation";

const mapStateToProps = state => {
  const {
    user: { address, shop_id, shop_username, bio }
  } = state;

  return {
    address,
    shop_id,
    shop_username,
    bio
  };
};

class EditShop extends Component {
  state = {
    cover: "",
    avatar: "",
    name: "",
    bio: "",
    username: "",
    avatarPreview: "",
    coverPreview: "",
    mobile: "",
    mobileError: "",
    avatarChange: null,
    coverChange: null,
    owner: true,
    is_busy: false,
    isError: false,
    nameError: "",
    shop_id: null
  };

  ConfirmationPopup = null;
  openPopUp = item => this.ConfirmationPopup.toggle(item);

  openPopUp = item => this.ConfirmationPopup.toggle(item);
  addNewAddress = data => {
    this.props.addNewAddress(data);
  };

  async componentDidMount() {
    this.setState({ loading: true });

    let langId = this.props.lang_id;
    let res = await fetchInfo(langId);

    getInfo(res.data.shop_username, langId).then(res => {
      this.setState({
        name: res.data.name,
        bio: res.data.bio,
        username: res.data.username,
        cover: res.data.cover ? res.data.cover : "",
        coverPreview: res.data.cover,
        avatar: res.data.avatar,
        avatarPreview: res.data.avatar,
        shop_id: res.data.id,
        mobile: res.data.shop_phone
      });
    });

    await this.checkOwner(res.data.shop_id);

    this.setState({ loading: false });
  }

  onDrop = e => {
    this.setState({
      cover: e.target.files[0],
      coverChange: e.target.files[0]
    });

    uploadPic(e, cover => {
      this.setState({
        coverPreview: cover
      });
    });
  };

  changeAvatar = e => {
    this.setState({
      avatar: e.target.files[0],
      avatarChange: e.target.files[0]
    });

    uploadPic(e, avatar => {
      this.setState({
        avatarPreview: avatar
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

  editYourShop = async () => {
    this.validation(["name", "mobile"])
      .then(async () => {
        const { shop_username, locale, shop_id } = this.props;
        var {
          cover,
          avatar,
          name,
          bio,
          username,
          avatarChange,
          coverChange,
          mobile
        } = this.state;

        this.toggle_busy();

        var data = new FormData();
        data.append("name", name);
        data.append("shop_phone", mobile);

        if (shop_username != username) {
          data.append("username", username);
          // localStorage.setItem("shop_username", username);
        }

        if (this.props.bio != bio) {
          data.append("bio", bio);
        }

        // data.append("bio", bio);

        if (avatarChange != null) {
          data.append("avatar", avatar);
        }

        // if (coverChange !== null) {
        data.append("cover", cover);
        // }

        // const values = await editShop(data, shop_id);

        try {
          let values = await editShop(data, this.state.shop_id);
          this.setState({
            message: locale.shop_containers.status_200,
            isError: false
          });
          setTimeout(() => {
            this.props.history.push(`/${this.props.lang}/shop/${username}`);
          }, 3000);
          // this.toggle_busy();
        } catch (e) {
          this.setState({ isError: true });
          if (e.status == 400) {
            this.setState({
              message: locale.shop_containers.status_400
            });
          } else if (e.status == 500) {
            this.setState({
              message: locale.shop_containers.status_500
            });
          } else if (e.status == 422) {
            this.setState({
              message: locale.shop_containers.status_422
            });
          } else if (e.status == 406) {
            this.setState({
              message: locale.shop_containers.status_406
            });
          }
          this.toggle_busy();
        }
      })
      .catch(formErrors => {});
  };

  checkOwner = async shop_id => {
    try {
      let res = await check_shop_owner(shop_id);
      this.setState({
        owner: res.data
      });
    } catch (e) {
      // this.setState({
      //   owner: false
      // });
    }
  };
  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  toggle_busy = () => this.setState({ is_busy: !this.state.is_busy });

  delAddress = addressId => {
    this.props.deleteAddress(addressId);
  };
  updateAddress = data => {
    this.props.addNewAddress(data);
  };

  removeCover = () => this.setState({ cover: "", coverPreview: "" });

  render() {
    const {
      username,
      nameError,
      usernameError,
      avatar,
      avatarPreview,
      cover,
      coverPreview,
      is_busy,
      message,
      isError,
      bio,
      name,
      mobile,
      mobileError
    } = this.state;

    const { address, locale } = this.props;

    if (!this.state.owner) {
      return <Redirect to={`/${this.props.lang}/shop/${username}`} />;
    }

    return (
      <Page
        title={locale.shop_containers.edit_shop_page_title}
        description={locale.shop_containers.edit_shop_page_desc}
        {...this.props}
      >
        <ShopForm
          {...this.props}
          startYourShop={this.startYourShop}
          username={username}
          onChange={this.onChange}
          validation={this.validation}
          nameError={nameError}
          usernameError={usernameError}
          onDrop={this.onDrop}
          changeAvatar={this.changeAvatar}
          avatar={avatar}
          avatarPreview={avatarPreview}
          cover={cover}
          coverPreview={coverPreview}
          is_busy={is_busy}
          message={message}
          isError={isError}
          locale={locale}
          editShop
          bio={bio}
          name={name}
          address={address}
          delAddress={this.delAddress}
          updateAddress={this.updateAddress}
          editYourShop={this.editYourShop}
          removeCover={this.removeCover}
          onClose={() => this.setState({ message: null })}
          mobile={mobile}
          mobileError={mobileError}
        />
      </Page>
    );
  }
}

export default connect(
  mapStateToProps,
  actions
)(withLoader(EditShop));
