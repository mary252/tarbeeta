import React from "react";
import animatedLoader from "../../assets/images/logomotion-final.gif";

const withLoader = WrappedComponent => {
  return class extends WrappedComponent {
    render() {
      const { loading } = this.state;
      if (loading) {
        return (
          <div className="pre-loader">
            <img src={animatedLoader} alt="..." className="animate-loader" />
          </div>
        );
      }
      return super.render();
    }
  };
};

export { withLoader };
