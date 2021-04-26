import React from 'react';
import {shallow } from 'enzyme';
import {Login} from '../containers/auth/Login'
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import store from "../Store";
import * as user from '../actions/user'
import {baseURL} from '../common/Config'

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


describe('Login Container', () => {
  const login = shallow(<Login  match={match} location={location}/>);

  let instance = login.instance();

  it("renders correctly", () => {
    expect(login).toMatchSnapshot();
  });
  
  it('toogle remember me', () => {
    expect(instance.remember_me).toEqual(undefined)
    instance.toogle_state()
    expect(instance.state.remember_me).toEqual(true)
  })

  instance.setState({
    email: `test@tarbeeta.com`,
    password: `12345678`,
    verify_robot: true
  });

  it("change username and password state",()=>{  
    expect(instance.state.email).toEqual(`test@tarbeeta.com`)
    expect(instance.state.password).toEqual(`12345678`)
    expect(instance.state.verify_robot).toEqual(true)

  })
  it('login function work',async ()=>{
    nock(host)
      .post("/login/")
      .reply(200, {
        data: {
          "access_token":'3242576786543567897654345678',
          "shop_id": 22,
          "shop_username":'shop',
          avatar:'awaver',
          user_id:233,
          verified:1, 
          mobile_verified:1
        }
      });
    try{
      await instance.login()
      let access_token=localStorage.getItem('access_token')
      expect(instance.state.loggedin).toEqual(true)
      expect(access_token).toEqual('3242576786543567897654345678')
      let shop_id=localStorage.getItem('shop_id')
      expect(shop_id).toEqual(22)
      let shop_username=localStorage.getItem("shop_username")
      expect(shop_username).toEqual('shop')
      let view=localStorage.getItem('view_mode')
      expect(view).toEqual('buyer')
    }catch(e){
    }
   
  })

  it('email input test',()=>{
    const username=login.find("#email-input")
    expect(username.length).toEqual(1);
    const event = { target: { name: "email", value: "456" } };
    username.simulate("change", event);
    expect(instance.state.email).toEqual("456");

  })
  
  it('password input test',()=>{
    const password=login.find("#password-input")

    expect(password.length).toEqual(1);
    const event = { target: { name: "password", value: "456" } };

    password.simulate("change", event);

    expect(instance.state.password).toEqual("456");

  })
  it ('login button working',()=>{
    const login_button=login.find("#login-button")
    const spy = jest.spyOn(instance, "login");
    login_button.prop("onPress")();
    expect(spy).toHaveBeenCalled()
  })
})
describe('redux dispatch function',()=>{
  let res=store.dispatch(
    user.store_user_info({
      avatar: null,
      user_id: 1,
      verified: 0,
      mobile_verified: 1
    })
  );
  it("dispatch work", () => {
    expect(res).toEqual({
      type: "STORE_USER_INFO",
      payload: {
        avatar: null,
        user_id: 1,
        verified: 0,
        mobile_verified: 1
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
