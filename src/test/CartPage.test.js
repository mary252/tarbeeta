import React from "react";
import { shallow, mount } from "enzyme";
import { CartPage } from "../containers/Cart";

import { baseURL } from "../common/Config";
import axios from "axios"; // v0.15.3
import httpAdapter from "axios/lib/adapters/http";
import nock from "nock";
import { CartList, total } from "../__fixtures__";
import { getGistCartId } from "../ultils";

const match = {
  params: {
    lang: "en" //any id you want to set
  }
};
const location = {
  search: ""
};

const host = baseURL;

axios.defaults.host = host;
axios.defaults.adapter = httpAdapter;
let query = {
  lang_id: 1
};
let query2 = {
  variation_id: 88
};
const baseProps = {
  match,
  location,
  init_notification: jest.fn(),
  getNumberOfcart: jest.fn(),
  trackEvent: jest.fn(),
  history: {
    push: jest.fn()
  },
  mobile_verified: true,
  mobile: null
};
describe("Cart Container", () => {
  const cart = shallow(<CartPage {...baseProps} />);
  let instance = cart.instance();

  it("  Cart container exists", () => {
    expect(cart.exists()).toEqual(true);
  });

  it("  As A Guest Should Fetch Cart products  Update the State", () => {
    localStorage.setItem("cart_id", 1);
    nock(host)
      .get(`/cart/guest/${getGistCartId()}`)
      .query(query)

      .reply(200, {
        data: CartList
      });

    return instance.getCartProducts(1).then(res => {
      expect(instance.state.shops.length).toEqual(CartList.length);
      localStorage.removeItem("cart_id");
    });
  });

  it("Should Fetch Cart As A Guest  Update the State", () => {
    localStorage.setItem("cart_id", 1);

    nock(host)
      .get(`/cart/guest/total/${getGistCartId()}`)
      .query(query)

      .reply(200, {
        data: total
      });

    return instance.getCartTotal(1).then(res => {
      expect(instance.state.total).toEqual(total.total);
      localStorage.removeItem("cart_id");
    });
  });

  it("Should Fetch Cart Products As A User Update the State", () => {
    localStorage.setItem("access_token", "fake Token");

    nock(host)
      .get("/cart")
      .query(query)

      .reply(200, {
        data: CartList
      });

    return instance.getCartProducts(1).then(res => {
      expect(instance.state.shops.length).toEqual(CartList.length);

      localStorage.removeItem("access_token");
    });
  });

  it("Should Fetch Cart Total A User Update the State", () => {
    localStorage.setItem("access_token", "fake Token");

    nock(host)
      .get("/cart/total")
      .query(query)

      .reply(200, {
        data: total
      });
    return instance.getCartTotal(1).then(res => {
      expect(instance.state.total).toEqual(total.total);
      localStorage.removeItem("access_token");
    });
  });

  it("It Should Call The Two Functions", () => {
    const spy1 = jest.spyOn(instance, "getCartProducts");

    const spy2 = jest.spyOn(instance, "getCartTotal");

    instance.componentDidMount().then(res => {
      expect(spy1).toHaveBeenCalled();

      expect(spy2).toHaveBeenCalled();
    });
  });

  it("As A User It Should Send Request &  Remove From Cart ", () => {
    localStorage.setItem("access_token", "fake Token");
    instance.setState({
      shops: CartList
    });

    nock(host)
      .intercept("/cart", "DELETE")
      .query(query2)
      .reply(200);

    return instance.del("88", 0).then(() => {
      expect(instance.state.shops[0].products.length).toEqual(1);
      localStorage.removeItem("access_token");
    });
  });

  it("As A Guest It Should Send Request &  Remove From Cart ", () => {
    localStorage.removeItem("access_token");

    localStorage.setItem("cart_id", 1);
    instance.setState({
      shops: CartList
    });

    nock(host)
      .intercept("/cart/guest/1", "DELETE")
      .query(query2)
      .reply(200);

    return instance.del("88", 0).then(() => {
      expect(instance.state.shops[0].products.length).toEqual(1);
      localStorage.setItem("cart_id", 1);
    });
  });

  it("As A User It LIke Product Then  Call Delete ", () => {
    localStorage.setItem("access_token", "fake Token");
    const spy1 = jest.spyOn(instance, "del");
    instance.setState(() => ({
      shops: CartList
    }));

    nock(host)
      .post("/product/like/23", {
        colour_id: "1"
      })
      .reply(200);

    nock(host)
      .intercept("/cart", "DELETE")
      .query(query2)
      .reply(200);

    return instance
      .likeProdcut({ variation_id: "88", product_id: 23, colour_id: "1" }, 0)
      .then(() => {
        expect(spy1).toHaveBeenCalled();
        localStorage.removeItem("access_token");
      });
  });

  it("As A Guest It LIke Product Then  Navigation Happend  ", () => {
    localStorage.setItem("cart_id", 1);
    window.location.assign = jest.fn();

    let spy3 = jest.spyOn(window.location, "assign");

    return instance
      .likeProdcut({ variation_id: "88", product_id: 23, colour_id: "1" }, 0)
      .then(() => {
        expect(spy3).toHaveBeenCalled();
      });
  });

  it("As A Uset ,Should Update quantity  ", () => {
    localStorage.setItem("access_token", "fake Token");

    instance.setState({ shops: CartList });

    nock(host)
      .intercept("/cart", "PUT")
      .reply(200, {
        data: { total: 8584 }
      });

    return instance.updateQty("88", 10, 0, 0).then(res => {
      expect(instance.state.total).toEqual(8584);

      expect(instance.state.shops[0].products[0].qty).toEqual(10);
      localStorage.removeItem("access_token");
    });
  });

  it("When Guest Press Check out It will nvigate him to login", async () => {
    await instance.checkOut();
    expect(baseProps.history.push).toHaveBeenCalled();
  });

  it("When User is not Verified Navigate him To Mobile Page", async () => {
    localStorage.setItem("access_token", "fake Token");

    window.location.assign = jest.fn();

    let spy4 = jest.spyOn(window.location, "assign");

    return instance.checkOut().then(() => {
      expect(spy4).toHaveBeenCalled();
      localStorage.removeItem("access_token");
    });
  });

  it("When User is  Verified & check out ", async () => {
    baseProps.mobile = "12334667";
    const cart = shallow(<CartPage {...baseProps} />);
    let instance = cart.instance();
    localStorage.setItem("access_token", "fake Token");

    return instance.checkOut().then(() => {
      expect(baseProps.history.push).toHaveBeenCalledTimes(2);
      localStorage.removeItem("access_token");
    });
  });
});
