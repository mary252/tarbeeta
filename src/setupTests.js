import nock from "nock";

import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import axios from "axios"; // v0.15.3
import httpAdapter from "axios/lib/adapters/http";
import { baseURL } from "./common/Config";

configure({ adapter: new Adapter() });

axios.defaults.host = baseURL;
axios.defaults.adapter = httpAdapter;

nock.disableNetConnect();
