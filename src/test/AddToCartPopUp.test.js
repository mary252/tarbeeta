import React from 'react';
import { shallow } from 'enzyme';
import AddToCartPopUp from '../components/AddToCartPopUp';
import Adapter from 'enzyme-adapter-react-16';
import { configure } from 'enzyme';
import {baseURL} from '../common/Config'
import axios from "axios"; // v0.15.3
import httpAdapter from "axios/lib/adapters/http";
import nock from "nock";
import store from "../Store";
import * as notification from '../actions/user'
import { data } from '../../src/__fixtures__/discover'


configure({ adapter: new Adapter() });
jest.setTimeout(30000);

const match = {
    params : { 
        lang : 'en' //any id you want to set
    }
}

const location={
    search:''
}

const props = {
    currentVariation: {
        hoveredImage: "https://static.tarbeeta.com/images/products/25/colour/11/1557599974322.jpg"
    },
    name: "Sleeve crew t-shirt",
    qty: null,
    price: "1250",
    currency_name: "EGP"
}

const host = baseURL;

axios.defaults.host = host;
axios.defaults.adapter = httpAdapter;
let query = {
  lang_id: 1
};

global.URL.createObjectURL = jest.fn();


const addtocart = shallow(<AddToCartPopUp match={match} location={location} {...props} />);
const instance = addtocart.instance();

const spy = jest.spyOn(instance, "go_to_cart");


describe('AddToCartPopUp Render', () => {
    it('renders', () => {
        expect(addtocart.exists()).toBeTruthy();
    });

    // it("renders correctly", () => {
    //     expect(addtocart).toMatchSnapshot();
    // });

    it('the locale load',()=>{
        expect(instance.state.locale).not.toBeNull()
    })

    


    it('Button exists', () => {
        // const addToCartBtn = addtocart.find('#go-to-cart-btn');
        // expect(addToCartBtn.length).toEqual(1);
        
        // addToCartBtn.prop("onPress")();
        // expect(spy).toHaveBeenCalled()
    });


});