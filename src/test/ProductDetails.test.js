import React from "react";
import { shallow } from "enzyme";
import { ProductDetails } from "../containers/Products/Details/index";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { fetchtProductDetails } from "../services";
import axios from "axios"; // v0.15.3
import { baseURL } from "../common/Config";
import httpAdapter from "axios/lib/adapters/http";
import nock from "nock";
import { productDetailsData } from "../data/productDetails";
import {ProductDetailsSection} from '../components/Products/ProductDetailsSection'
configure({ adapter: new Adapter() });
jest.setTimeout(30000);

const match = {
  params: {
    lang: "en", //any id you want to set
    id: 3
  }
};
const location = {
  search: "c=11"
};
function init_notification(data) {}
const host = baseURL;

axios.defaults.host = host;
axios.defaults.adapter = httpAdapter;
let query = {
  lang_id: 1
};
let params = {
  id: 1
};
const history = {
  replace: function replace(data) {}
};

const productDetails = shallow(
  <ProductDetails
    history={history}
    init_notification={init_notification}
    match={match}
    location={location}
  />
);
let instance = productDetails.instance();
//const spy_func2 = jest.spyOn(instance, "updateCart");

describe("Product details render", () => {
  it("reneders", () => {
    expect(productDetails.exists()).toBeTruthy();
  });

  it("renders correctly", () => {
    expect(productDetails).toMatchSnapshot();
  });

  it("the locale load", () => {
    expect(instance.state.locale).not.toBeNull();
  });

  it("get product is called", async () => {
    nock(host)
    .get("/product/details/3")
    .query(query)
    .reply(200, {
      data: productDetailsData
    });
    await instance.getProduct(3, 1, 11);
    expect(instance.state.shop_id).toEqual(59);
    expect(instance.state.price).toEqual("299");

  });


  /*it(" test", () => {
    const add_button = productDetails.find("#add-to-cart-button");

    expect(add_button.length).toEqual(1);
    expect(instance.state.actual_stock > 0).toBeTruthy();

    add_button.prop("onPress")();

    expect(spy_func2).toHaveBeenCalled();
  });*/

});
const productdetailsComonent=shallow(
  <ProductDetailsSection
  getNumberOfcart={instance.getNumberOfcart}
  lang={instance.props.match.params.lang}
  product={productDetailsData}
  colId={11}
  changeUrl={instance.changeUrl}
  showNotification={instance.showNotification}
  open_share={instance.openShare}

/>
)
let conp_instance=productdetailsComonent.instance()
describe("product info component ",()=>{
  it("reneders", () => {
    expect(productdetailsComonent.exists()).toBeTruthy();
  });

  it("renders correctly", () => {
    expect(productdetailsComonent).toMatchSnapshot();
  });

  it("the locale load", () => {
    expect(conp_instance.state.locale).not.toBeNull();
  });


  it("hover image test", () => {
    let color = {
      hoveredImage: "123"
    };
    conp_instance.hoverOn(color);
    expect(conp_instance.state.hoveredImgae).toEqual("123");
  });

  it("remove hover test", () => {
    conp_instance.hoverOff();
    expect(conp_instance.state.hoveredImgae).toBeNull();
  });

  it("select color test ", () => {
    let currentVariation = {
      sizes: [
        {
          price: 250,
          variation_id: 28,
          size_id: 3,
          colour_id: 2
        }
      ],
      colour_id: 2
    };

    conp_instance.selectColur(currentVariation);
    expect(conp_instance.state.variation_id).toEqual(28);
    expect(conp_instance.state.size_id).toEqual(3);
  });

  it("select size function test", () => {
    let size = {
      size_id: 1,
      available_stock: 20,
      variation_id: 34,
      price: 342,
      stock: 33
    };
    conp_instance.selectSize(size);
    expect(conp_instance.state.size_id).toEqual(1);
    expect(conp_instance.state.sizeQty).toEqual(20);
    expect(conp_instance.state.variation_id).toEqual(34);
    expect(conp_instance.state.price).toEqual(342);
    expect(conp_instance.state.actual_stock).toEqual(33);
  });

  it("update cart function test", async () => {
    conp_instance.setState({
      variation_id: 138,
      id: 25
    });
    nock(host)
      .post("/cart/guest/add")
      .reply(200, {
        data: {
          cart_id: 89
        }
      });
    const spyPreventDefault = jest.spyOn(conp_instance, "updateAvailableStock");
    await conp_instance.updateCart();
    expect(spyPreventDefault).toHaveBeenCalled();
  });
})
describe("buttons test", () => {
  it("color buttons test", () => {
    const spy_func = jest.spyOn(conp_instance, "selectColur");
    const add_button = productdetailsComonent.find("#color-button-0");
    expect(add_button.length).toEqual(1);
    expect(conp_instance.state.actual_stock > 0).toBeTruthy();
    add_button.prop("onClick")();

    expect(spy_func).toHaveBeenCalled();
  });
  it("size button test", () => {
    const add_button = productdetailsComonent.find("#size-button-0");
    expect(add_button.length).toEqual(1);
    expect(conp_instance.state.actual_stock > 0).toBeTruthy();
    const spy_func = jest.spyOn(conp_instance, "selectSize");
    add_button.prop("onClick")();
    expect(spy_func).toHaveBeenCalled();

  });
});
