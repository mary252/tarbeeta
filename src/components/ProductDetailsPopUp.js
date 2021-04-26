import React, { Component } from "react";
import { ActiveModal } from "./Layout";
import ProductDetailsSection from "./Products/ProductDetailsSection";
import ProductDetailsMobile from "./Products/ProductDetailsMobile";
import Loader from "./Loader";
class ProductDetailsPopUp extends Component {
  componentDidMount() {}
  render() {
    const {
      visible,
      product = {},
      lang,
      toggle,
      loading,
      getNumberOfcart,
      colId,
      locale
    } = this.props;
    return (
      <ActiveModal
        toggle={toggle}
        visible={visible}
        wrapperClass="wrapperClass"
      >
        {loading ? (
          <div className="loader-container">
            <Loader />
          </div>
        ) : (
          <>
            <div
              className="is-hidden-touch full-wd"
              onClick={e => e.stopPropagation()}
            >
              <ProductDetailsSection
                addToCartPopUp={this.props.addToCartPopUp}
                showNotification={this.props.showNotification}
                getNumberOfcart={getNumberOfcart}
                withCloseButton
                toggle={toggle}
                product={product}
                colId={colId}
                lang={lang}
                locale={locale}
                openAddToCartPopUp={this.props.openAddToCartPopUp}
              />
            </div>

            <div
              className="is-hidden-desktop full-wd"
              onClick={e => e.stopPropagation()}
            >
              <ProductDetailsMobile
                addToCartPopUp={this.props.addToCartPopUp}
                showNotification={this.props.showNotification}
                getNumberOfcart={getNumberOfcart}
                withCloseButton
                toggle={toggle}
                product={product}
                lang={lang}
                locale={this.props.locale}
                openAddToCartPopUp={this.props.openAddToCartPopUp}
              />
            </div>
          </>
        )}
      </ActiveModal>
    );
  }
}

export default ProductDetailsPopUp;
