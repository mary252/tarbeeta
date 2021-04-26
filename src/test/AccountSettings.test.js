import React from 'react';
import { shallow } from 'enzyme';
import { AccountSettings } from '../containers/auth/AccountSettings';
import Adapter from 'enzyme-adapter-react-16';
import { configure } from 'enzyme';
import {baseURL} from '../common/Config'
import axios from "axios"; // v0.15.3
import httpAdapter from "axios/lib/adapters/http";
import nock from "nock";
import store from "../Store";
import * as notification from '../actions/user'
import { data } from '../../src/__fixtures__/accountSettings'


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


const accountSettings = shallow(<AccountSettings match={match} location={location} />);
const instance = accountSettings.instance();
const spy = jest.spyOn(instance, "onChange");


describe('Account Settings Container', () => {
    


    it('Should fetchInfo', async () => {
        let { firstname, lastname, mobile, email } = instance.state;
        expect(firstname).toEqual("");
        expect(lastname).toEqual("");
        expect(mobile).toEqual("");
        expect(email).toEqual("");

        nock(host)
        .get(`/me`)
        .reply(200, {
            data
            }
        );

        return instance.fetchInfo().then(() => {
            expect(instance.state.firstname).toEqual(data.firstname);
            expect(instance.state.lastname).toEqual(data.lastname);
            expect(instance.state.mobile).toEqual(data.mobile);
            expect(instance.state.email).toEqual(data.email);
        })
        
    });


    it('Account Settings Exists', () => {
        expect(accountSettings.exists()).toEqual(true);
    });

    it('Load Locale', () => {
        expect(instance.state.locale).not.toBeNull();
    });


    it('firstname Field exists and should be filled corectly', () => {
        const firstnameInput = accountSettings.find('#firstname-input');
        expect(firstnameInput.length).toEqual(1);

        const event = { target: { name: "firstname", value: "Mohamed" } };

        firstnameInput.simulate('change', event);

        expect(instance.state.firstname).toEqual("Mohamed");

        firstnameInput.simulate("keypress", { key: "Enter" });

        expect(spy).toBeCalledTimes(1);

    });

    it('lastname Field exists and should be filled corectly', () => {
        const lastnameInput = accountSettings.find('#lastname-input');
        expect(lastnameInput.length).toEqual(1);

        const event = { target: { name: "lastname", value: "Shawky" } };

        lastnameInput.simulate('change', event);

        expect(instance.state.lastname).toEqual("Shawky");

        lastnameInput.simulate("keypress", { key: "Enter" });

        expect(spy).toBeCalledTimes(2);

    });

    it('email Field exists ', () => {
        const emailInput = accountSettings.find('#email-input');
        expect(emailInput.length).toEqual(1);

        expect(spy).toBeCalledTimes(2);

    });

    
    it('mobile Field exists and should be filled corectly', () => {
        const mobileInput = accountSettings.find('#mobile-input');
        expect(mobileInput.length).toEqual(1);

        const event = { target: { name: "mobile", value: "01142290603" } };

        mobileInput.simulate('change', event);

        expect(instance.state.mobile).toEqual("01142290603");

        mobileInput.simulate("keypress", { key: "Enter" });

        expect(spy).toBeCalledTimes(3);

    });


    it('Button exist And Clicked event worked correctly', () => {
        const savechangesButton = accountSettings.find('#savechanges-button');
        expect(savechangesButton.length).toEqual(1);

        savechangesButton.prop('onPress')()

        expect(spy).toBeCalledTimes(3);

    });

});


describe('Validation', () => {
    it('Should passed because firstname more than 2 letters', () => {
        instance.setState({ firstname: "Mohamed" });
        instance.saveChanges()
        .then(() => {
            expect(instance.state.firstnameError).toBeNull();
        })
        .catch((e) => {
            expect(instance.state.firstnameError).toEqual('*First Name Must Be More Than 2 Character');
        });
    });

    it('Should passed because lastname more than 2 letters', () => {
        instance.setState({ lastname: "Shawky" });
        instance.saveChanges()
        .then(() => {
            expect(instance.state.lastnameError).toBeNull();
        })
        .catch((e) => {
            expect(instance.state.lastnameError).toEqual('*Last Name Must Be More Than 2 Character');
        });
    });

    it('Should passed because mobile more than 2 letters', () => {
        instance.setState({ mobile: "01142290603" });
        instance.saveChanges()
        .then(() => {
            expect(instance.state.mobileError).toBeNull();
        })
        .catch((e) => {
            expect(instance.state.mobileError).toEqual('*Phone Number Must Be 11 Numbers');
        });
    });

});