import React from 'react';
import {shallow} from 'enzyme';
import {Shop} from '../containers/Shop'
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import store from "../Store";
import {baseURL} from '../common/Config'
import httpAdapter from "axios/lib/adapters/http";
import { shop_data} from '../data/shop'
import nock from "nock";
import axios from "axios"; // v0.15.3
import { followShop,
  unFollowShop} from '../services'

configure({ adapter: new Adapter() });

jest.setTimeout(30000);
const match = {
    params : { 
                lang : 'en', //any id you want to set
                id:57 
            }
   }
  const location={
    search:'c=11'
  }
  const host = baseURL;

  axios.defaults.host = host;
  axios.defaults.adapter = httpAdapter;
  let query = {
    lang_id: 1
  };
  
  nock(host)
  .get("/shop/57")
  .query(query)
  .reply(200, {
    data: shop_data
  });
  nock(host)
  .get("/shop/followers/57")

  .reply(200, {
    data: []
  });
  nock(host)
  .post("/shop/follow/57")
  .reply(200,{
    data:[
      {avatar: null,
        id: 134,
        name: "Osama Rezk"
      },
      {avatar: null,
        id: 134,
        name: "Osama Rezk"
      }
    ]
  })
  nock(host)
  .post("/shop/unfollow/57")
  .reply(200,{
    data:[
      {avatar: null,
        id: 134,
        name: "Osama Rezk"}
    ]
  })
  
const shop = shallow(<Shop match={match} location={location}/>);
let instance=shop.instance()

describe('Shop page render',()=>{
  it('reneders',()=>{
      expect(shop.exists()).toBeTruthy()
  })

  it("renders correctly", () => {
    expect(shop).toMatchSnapshot();
  });

  it('the locale load',()=>{
      expect(instance.state.locale).not.toBeNull()
  })

  it("component did mount test",()=>{
    const shop_spy=jest.spyOn(instance,"getShop")
    const products_spy=jest.spyOn(instance,"getFilters")
  })
})

describe('followers popup function',()=>{
  instance.setState({id:57})
 
  it('get followers function', async()=>{
    expect(instance.getFollowers).toBeDefined()
    expect(instance.getFollowers).toBeInstanceOf(Function)
    expect(instance.state.followers).toBeNull()
    await instance.getFollowers()
    expect(instance.state.followers).not.toBeNull()
  })

  it("follow button call folllowunfollow", async ()=>{
    localStorage.setItem("access_token","11122227654345679876543")
    expect(instance.state.is_followed).toEqual("false")
    await instance.followUnfollow()
    expect(instance.state.followers.length).toEqual(2)
    expect(instance.state.is_followed).toEqual("true")
    await instance.followUnfollow()
    expect(instance.state.followers.length).toEqual(1)
    expect(instance.state.is_followed).toEqual("false")


  })
})

