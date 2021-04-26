import React from "react";
import { shallow } from "enzyme";
import {Favorites} from "../containers/favorites";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { baseURL } from "../common/Config";
import axios from "axios"; // v0.15.3
import httpAdapter from "axios/lib/adapters/http";
import nock from "nock";
import { FavoritesList } from "../__fixtures__";

configure({ adapter: new Adapter() });

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

const favorites = shallow(<Favorites match={match} location={location} />);
let instance = favorites.instance();

describe("Favorites Container", () => {

  it("Should Fetch Faqs And Update the State", async() => {
   nock(host)
  .get("/product/liked")
  .query(query)
  .reply(200, {
    data: FavoritesList
  });
    await instance.componentDidMount()
    expect(instance.state.products).toEqual(FavoritesList);

    
  });

  it("Should On Like Remove Product", () => {
    instance.setState(() => ({ products: FavoritesList }));
    instance.likePro(234);

    expect(instance.state.products.length).toEqual(2);
  });

  it("  Faqs container exists", () => {
    expect(favorites.exists()).toEqual(true);
  });

  it("renders correctly", () => {
    expect(favorites).toMatchSnapshot();
  });
});
