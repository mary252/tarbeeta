import React, { Component } from "react";
import "./StartShop.css";
import { isLoggedIn } from "../../ultils/auth";
import { uploadPic, postNewShop } from "../../services";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Page, ShopForm } from "../../components";
import { validate } from "../../ultils/validate/validation";

import * as actions from "../../actions";

const mapStateToProps = state => {
  const {
    user: { mobile_verified, verified, mobile, shop_id, shop_username }
  } = state;
  return {
    mobile_verified,
    verified,
    mobile,
    shop_id,
    shop_username
  };
};

export class StartShop extends Component {
  state = {
    loggedin: false,
    cover: "",
    avatar: "",
    name: "",
    bio: "",
    username: "",
    avatarPreview: "",
    coverPreview: "",
    mobile: "",
    mobileError: "",
    is_busy: false,
    isError: false,
    redirect: false,
    agreeTerms: true,
    nameError: "",
    usernameError: "",
    verify_robot: false
  };

  verify_robot = value => {
    this.setState({
      verify_robot: true
    });
  };

  toggle_busy = () => this.setState({ is_busy: !this.state.is_busy });
  componentWillMount() {
    if (isLoggedIn()) {
      this.setState({
        loggedin: true
      });
    }
  }

  onDrop = e => {
    const fileList = e.dataTransfer ? e.dataTransfer.files : e.target.files;

    this.setState({
      cover: fileList[0]
    });
    uploadPic(e, cover => {
      this.setState({
        coverPreview: cover
      });
    });
  };

  changeAvatar = e => {
    this.setState({
      avatar: e.target.files[0]
    });
    uploadPic(e, avatar => {
      this.setState({
        avatarPreview: avatar
      });
    });
  };

  removeCover = () => this.setState({ cover: null, coverPreview: null });

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

  startYourShop = async () => {
    // if(this.state.verify_robot){
    this.validation(["name", "mobile"])
      .then(async () => {
        if (this.props.mobile == null) {
          localStorage.setItem("destination", "start");
          this.setState({
            redirect: true
          });
        } else {
          if (!this.props.mobile_verified) {
            this.openPopUp();
          } else {
            const { cover, avatar, name, bio, username, mobile } = this.state;
            const { locale } = this.props;
            this.toggle_busy();
            var data = new FormData();
            data.append("name", name);
            data.append("shop_phone", mobile);
            // this.state.username !== '' ? data.append("username", username) : undefined
            // this.state.bio !== '' ? data.append("bio", bio) : undefined
            // this.state.avatar !== '' ? data.append("avatar", avatar) : undefined
            // this.state.cover !== '' ? data.append("cover", cover) : undefined

            if (this.state.username !== "") {
              data.append("username", username);
            }
            if (this.state.bio !== "") {
              data.append("bio", bio);
            }
            if (this.state.avatar !== "") {
              data.append("avatar", avatar);
            }
            if (this.state.cover !== "") {
              data.append("cover", cover);
            }

            let lang_id = this.props.lang_id;
            // const values = await postNewShop(data, lang_id);

            try {
              let values = await postNewShop(data, lang_id);

              this.setState({
                message: locale.shop_containers.status_200,
                isError: false
              });
              const {
                data: { shop_id = "", shop_username = "" } = {}
              } = values;
              this.props.set_shop_id(shop_id);
              this.toggle_busy();

              if (username == "") {
                setTimeout(() => {
                  this.props.history.push(
                    `/${this.props.lang}/shop/${shop_username}`
                  );
                }, 3000);
              } else {
                setTimeout(() => {
                  this.props.history.push(
                    `/${this.props.lang}/shop/${username}`
                  );
                }, 3000);
              }
            } catch (e) {
              console.log(e);
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
              }
              this.toggle_busy();
            }
          }
        }
      })
      .catch(formErrors => {});
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  VerificationPopup = null;
  openPopUp = () => {
    this.VerificationPopup.toggle();
  };

  removeCover = () => this.setState({ cover: "", coverPreview: "" });

  render() {
    if (!this.state.loggedin) {
      let path = this.props.location.pathname;
      let redirect = path.substring("4");
      return <Redirect to={`/${this.props.lang}/login?src=${redirect}`} />;
    }
    if (this.state.redirect) {
      return <Redirect to={`/${this.props.lang}/mobile`} />;
    }
    const {
      state: {
        cover,
        avatar,
        avatarPreview,
        coverPreview,
        is_busy,
        message,
        isError,
        agreeTerms,
        mobile,
        mobileError
      },
      props: { mobile_verified, verified, locale }
    } = this;

    if (this.props.shop_id) {
      return <Redirect to={`/${this.props.lang}/shop/edit`} />;
    }

    return (
      <Page
        title={locale.shop_containers.start_shop_page_title}
        description={locale.shop_containers.start_shop_page_desc}
        {...this.props}
      >
        {/* <VerificationPopup
          ref={a => (this.VerificationPopup = a)}
          lang={this.props.lang}
          translation={this.props.locale}
          code={1}
        /> */}
        <ShopForm
          {...this.props}
          removeCover={this.removeCover}
          startYourShop={this.startYourShop}
          username={this.state.username}
          onChange={this.onChange}
          validation={this.validation}
          nameError={this.state.nameError}
          usernameError={this.state.usernameError}
          onDrop={this.onDrop}
          changeAvatar={this.changeAvatar}
          avatar={this.state.avatar}
          avatarPreview={this.state.avatarPreview}
          cover={this.state.cover}
          coverPreview={this.state.coverPreview}
          is_busy={this.state.is_busy}
          message={this.state.message}
          isError={this.state.isError}
          locale={this.props.locale}
          onClose={() => this.setState({ message: null })}
          mobile={mobile}
          mobileError={mobileError}
          startShop
        />
      </Page>
    );
  }
}

export default connect(
  mapStateToProps,
  actions
)(StartShop);
