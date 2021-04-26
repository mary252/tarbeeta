import React from 'react';
import { shallow } from 'enzyme';
import {Discover} from '../containers/Discover/index';
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

const host = baseURL;

axios.defaults.host = host;
axios.defaults.adapter = httpAdapter;
let query = {
  lang_id: 1,
  limit: 18
};

let queryTrendingForMen = {
    lang_id: 1,
    department_id: 1,
    limit: 18
}
let queryTrendingForWomen = {
    lang_id: 1,
    department_id: 2,
    limit: 18
}


let queryTrendingForKids = {
    lang_id: 1,
    department_id: 3,
    limit: 18
}


global.URL.createObjectURL = jest.fn();


const discover = shallow(<Discover match={match} location={location} />);
const instance = discover.instance();


describe('Discover', () => {

    it('Discover exists', () => {
        expect(discover.exists()).toEqual(true);
    });

    
    it('the locale load', () => {
        
        expect(instance.state.locale).not.toBeNull();
    });

    it('Should Fetch most_selling & top_deals & trending_Men Data And Update the State', async () => {

        expect(instance.state.most_selling).toEqual([]);
        expect(instance.state.top_deals).toEqual([]);
        expect(instance.state.trending_Men).toEqual([]);

        nock(host)
        .get(`/product/most_selling`)
        .query(query)
        .reply(200, {
            data
        });

        nock(host)
        .get(`/product/top_deals`)
        .query(query)
        .reply(200, {
            data
        });

        nock(host)
        .get(`/product/trending`)
        .query(queryTrendingForMen)
        .reply(200, {
            data
        });

        nock(host)
        .get(`/product/trending`)
        .query(queryTrendingForWomen)
        .reply(200, {
            data
        });

        nock(host)
        .get(`/product/trending`)
        .query(queryTrendingForKids)
        .reply(200, {
            data
        });

        instance.load_most_selling(1, 18)
        .then(() => {
            expect(instance.state.most_selling).toEqual(data);
        })

        instance.load_top_deals(1, 18)
        .then(() => {
            expect(instance.state.top_deals).toEqual(data);
        })

        instance.load_trending(1, 18, 1)
        .then(() => {
            expect(instance.state.trending_Men).toEqual(data);
        })

        instance.load_trending(1, 18, 2)
        .then(() => {
            expect(instance.state.trending_Women).toEqual(data);
        })

        instance.load_trending(1, 18, 3)
        .then(() => {
            expect(instance.state.trending_Kids).toEqual(data);
        })
    });


    it('Test slider', () => {
        expect(instance.state.currentIndex).toEqual(0);
        expect(instance.state.translateValue).toEqual(0);

        instance.componentDidMount();
        instance.slide('next');
        expect(instance.state.currentIndex).not.toEqual(0);
        expect(instance.state.translateValue).not.toEqual(0);

    })

});