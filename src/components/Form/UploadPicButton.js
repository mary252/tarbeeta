import React, { Component } from "react";
import "./Form.css";
import { uploadPic } from "../../services";
import { Images } from "../../common";
class UploadPicButton extends Component {
  upload = e => {
    uploadPic(e, (data, file) => {
      this.props.onUpload(data, file);
    });
  };

  render() {
    const { picture, rmImage } = this.props;
    return (
      <button
        aria-label="Upload Product Image"
        className="upload-button"
        style={{
          ...(picture
            ? {
                border: `none`,
                backgroundImage: `url(${picture})`,
                backgroundSize: `contain`,
                position: "relative",
                border: "1px solid red"
              }
            : {
                backgroundImage: `url(${Images.imagePlaceHolder})`,
                backgroundSize: `auto auto`,
                position: "relative"
              })
        }}
      >
        <div
          onClick={e => {
            e.stopPropagation();
            rmImage();
          }}
          className="aic jcc"
          style={{
            ...(picture
              ? { display: `flex`, border: `solid 1px #f3444a` }
              : { display: `none` })
          }}
        >
          <span className="fas fa-times" />
        </div>
        <input
          type="file"
          accept='image/*'
          style={{
            opacity: 0.0,
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            width: "100%",
            height: "100%"
          }}
          onChange={this.upload}
        />
      </button>
    );
  }
}
export { UploadPicButton };
