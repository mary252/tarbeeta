import React from 'react';
import {shallow } from 'enzyme';
import {Register} from '../containers/auth/Register'
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import store from "../Store";
import * as user from '../actions/user'
import {baseURL} from '../common/Config'
import { GistToMember } from '../services'
import axios from "axios"; // v0.15.3
import httpAdapter from "axios/lib/adapters/http";
import nock from "nock";

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
  
describe('Register page test',()=>{
    const register = shallow(<Register  match={match} location={location}/>);

    it('container renders without errors', () => {
        expect(register.exists()).toEqual(true)
    })
    it("renders correctly", () => {
      expect(register).toMatchSnapshot();
    });
    let instance =register.instance()

    it('the locale load',()=>{
        expect(instance.state.locale).not.toBeNull()
    })

    it('store_data function test ',()=>{
        expect(instance.state.email).toEqual("")
        let event ={
            target:{
                value:'email'
            }
        }
        instance.store_data(event,'email')
        expect(instance.state.email).toEqual('email')
    })
    
    it('verify robot function test ',()=>{
        expect(instance.state. verify_robot).toBeFalsy()
        instance.verify_robot('12321')
        expect(instance.state. verify_robot).toBeTruthy()

    })

    it('register function test',async()=>{
        instance.setState({
            firstname: 'test',
            lastname: 'test',
            email: 'test@tarbeeta.com',
            country_code: '+2',
            mobile: '01027836541',
            password: '12345678',
            verify_robot: true
        })
        nock(host)
        .post("/user/")
        .reply(200, {
          data: {
            "access_token":'3242576786543567897654345678',
            avatar:'awaver',
            user_id:233,
            verified:1, 
            mobile_verified:1
          }
        });
        try{
            await instance.register()
            let access_token=localStorage.getItem('access_token')
            expect(access_token).toEqual('3242576786543567897654345678')
            let view=localStorage.gletItem('view_mode')
            expect(view).toEqual('buyer')
            expect(GistToMember).toBeCalled()
        }catch(e){

        }
    })

    it('first name input test',()=>{
      const firstname=register.find("#firstname-input")
      expect(firstname.length).toEqual(1);
      const event = { target: { name: "firstname", value: "456" } };
      firstname.simulate("keyUp", event);
      expect(instance.state.firstname).toEqual("456");
  
    })
    
    it('lastname input test',()=>{
      const lastname=register.find("#lastname-input")
  
      expect(lastname.length).toEqual(1);
      const event = { target: { name: "lastname", value: "456" } };
  
      lastname.simulate("keyUp", event);
  
      expect(instance.state.lastname).toEqual("456");
  
    })
    it('mobile input test',()=>{
      const mobile=register.find("#mobile-input")
      expect(mobile.length).toEqual(1);
      const event = { target: { name: "mobile", value: "456" } };
      mobile.simulate("keyUp", event);
      expect(instance.state.mobile).toEqual("456");
  
    })
    
    it('email input test',()=>{
      const username=register.find("#email-input")
      expect(username.length).toEqual(1);
      const event = { target: { name: "email", value: "456" } };
      username.simulate("keyUp", event);
      expect(instance.state.email).toEqual("456");
  
    })
    
    it('password input test',()=>{
      const password=register.find("#password-input")
  
      expect(password.length).toEqual(1);
      const event = { target: { name: "password", value: "456" } };
  
      password.simulate("keyUp", event);
  
      expect(instance.state.password).toEqual("456");
  
    })

    it ('register button working',()=>{
      const register_button=register.find("#register-button")
      const spy = jest.spyOn(instance, "register");
      register_button.prop("onPress")();
      expect(spy).toHaveBeenCalled()
    })
})

describe('redux dispatch ',()=>{
    let res=store.dispatch(
      user.store_user_info({
        avatar:null,
        user_id:1,
        verified:0,
        mobile_verified:1
      })
    );
    it('dispatch test',()=>{
      expect(res).toEqual({
        type: "STORE_USER_INFO",
        payload: {
          avatar:null,
          user_id:1,
          verified:0,
          mobile_verified:1
        }
      })
        
    })
    let user_state= store.getState().user
      it('state changed',()=>{
        expect(user_state.avatar).toBe(null)
        expect(user_state.verified).toBe(0)
        expect(user_state.mobile_verified).toBe(1)
      })
  })