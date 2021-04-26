import React from "react";
import { shallow } from "enzyme";
import Faqs from "../containers/Faqs";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { baseURL } from "../common/Config";
import axios from "axios"; // v0.15.3
import httpAdapter from "axios/lib/adapters/http";
import nock from "nock";

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

describe("Faqs Container", () => {
  const faqs = shallow(<Faqs match={match} location={location} />);
  let instance = faqs.instance();

  it("Should Fetch Faqs And Update the State", () => {
    nock(host)
      .get("/faq")
      .query(query)

      .reply(200, {
        data: [1, 2, 3, 4, 5]
      });
    instance
      .componentDidMount()
      .then(res => expect(instance.state.faqs).toEqual([1, 2, 3, 4, 5]));
  });

  it("  Faqs container exists", () => {
    expect(faqs.exists()).toEqual(true);
  });

  it("renders correctly", () => {
    expect(faqs).toMatchSnapshot();
  });
});
