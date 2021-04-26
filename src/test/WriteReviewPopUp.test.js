import React from 'react';
import { shallow } from 'enzyme';
import WriteReviewPopUp from '../components/WriteReviewPopUp';
import Adapter from 'enzyme-adapter-react-16';
import { configure } from 'enzyme';
import {baseURL} from '../common/Config'
import axios from "axios"; // v0.15.3
import httpAdapter from "axios/lib/adapters/http";
import nock from "nock";
import store from "../Store";
import * as notification from '../actions/user'

// import { writeReview } from "../services";

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

const host = baseURL;

axios.defaults.host = host;
axios.defaults.adapter = httpAdapter;
let query = {
  lang_id: 1
};
global.URL.createObjectURL = jest.fn();

const writeReview = shallow(<WriteReviewPopUp match={match} location={location}/>);
let instance = writeReview.instance();

const spy = jest.spyOn(instance, "write_review");



describe('Write Review PopUp', () => {
    
    it('renders Write Review', () => {
        expect(writeReview.exists()).toEqual(true);
    });

    // it('renders correctly', () => {
    //     expect(writeReview).toMatchSnapshot();
    // });


    it('the locale load', () => {
        expect(instance.state.locale).not.toBeNull();

    });


    it('OnChange function test',() => {

        const reviewTextBox = writeReview.find("#review-textbox");
        expect(reviewTextBox.length).toEqual(1);

        const event = { target: { name: "review", value: "comment test" } };

        reviewTextBox.simulate('change', event);

        expect(instance.state.review).toBe('comment test');

    });

    it('Write Review Working successfully', async()=>{
        
        expect(instance.state.is_busy).toBeFalsy();
        
        let product_id = 5;
        let data = {
            order_id: 6,
            comment: 'Comment Test review'
        }
        
        nock(host)
        .post(`/product/rate/${product_id}`, data)
        .reply(200, { message: 'Success!' });

        await instance.write_review();

        expect(instance.state.is_busy).toBeTruthy();
        
    })


    it('Button exists', () => {
        const reviewSubmitBtn = writeReview.find('#review-submit-btn');
        expect(reviewSubmitBtn.length).toEqual(1);
        
        reviewSubmitBtn.prop("onPress")();
        expect(spy).toHaveBeenCalled()
    });

});

