import React, { Component } from "react";
import { Modal } from "./Layout";
import { TButton } from "./Form";
import { TextBox } from "./Form";
import { validate } from "../ultils/validate/validation";
import { writeReview } from "../services";

class WriteReviewPopUp extends Component {
  static propTypes = {};

  constructor() {
    super();
    this.modal = null;
  }

  toggle = () => {
    this.modal.toggle();
  };

  state = {
    is_busy: false,
    review: null,
    reviewError: ""
  };

  componentDidMount = async () => {
    this.setState({
      review: this.props.item ? this.props.item.comment : null
    });
  };

  write_review = async () => {
    this.setState({ is_busy: true });

    this.validation(["review"]).then(async () => {

      
      let data = {
        order_id: this.props.order.order_id,
        comment: this.state.review
      }


      try {
        let res = await writeReview(this.props.item.variation_id, data);
        this.setState({ is_busy: false });
        this.props.changeCommentState(this.state.review);
        this.props.init_notification({
            type: "success",
            title: this.props.locale.success,
            message: this.props.locale.review_added
          });
          this.toggle();
        } catch (e) {
          this.props.init_notification({
            type: "error",
            title: this.props.locale.error,
            message: this.props.locale.error_message
          });
          this.setState({ is_busy: false });
        }

        this.setState({ is_busy: false });
      })
      .catch(formErrors => {
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

  render() {
    const {
      state: { is_busy },
      props: {
        item,
        locale
      }
    } = this;


    return (
      <Modal ref={m => (this.modal = m)}>
        <div onClick={(e)=>e.stopPropagation()} className="address-popup">
          <div className="address-popup-div ">
            {item && (
              <div className="write-review">
                <div className="columns is-mobile">
                  <div className="column is-4 is-flex aic">
                    <h2 className="is-uppercase">
                      {locale.write_review_placeholder}
                    </h2>
                  </div>
                  <div className="column is-8 is-flex aic">
                    <div
                      className={`orders-item-img-review`}
                      style={{
                        background: `url('${item.img}') no-repeat`
                      }}
                    />
                    <h3>{item.name}</h3>
                  </div>
                  {/* <div className="column is-4">
                        
                    </div> */}
                </div>
              </div>
            )}

            <div className="line" />

            <TextBox
              placeholder={locale && locale.write_here_placeholder}
              custclass="mar-bot-15"
              errorMessage={this.state.reviewError}
              onBlur={() =>
                this.validation(["review"])
                  .then()
                  .catch(e => {})
              }
              onChange={e => {
                this.setState({
                  review: e.target.value
                });
              }}
              // value={this.props.item && this.props.item.comment}
              comment={this.state.review}
              rows={5}
              id="review-textbox"
            />

            <div className="columns is-mobile">
              <div className="column is-4">
                <TButton
                  text={locale && locale.skip_btn_placeholder}
                  onPress={this.toggle}
                  className="gray"
                  ariaLabel="Skip"
                />
              </div>
              <div className="column is-4 " />
              <div className="column is-4">
                <TButton
                  ariaLabel="Submit"
                  text={locale && locale.submit_btn_placeholder}
                  onPress={this.write_review}
                  className="grad-blue full button"
                  loading={is_busy}
                  id="review-submit-btn"
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default WriteReviewPopUp;
