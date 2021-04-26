import React from "react";
import { shallow } from "enzyme";
import { StartShop } from "../containers/Shop/StartShop";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { baseURL } from "../common/Config";
import { postNewShop } from "../services";
import axios from "axios"; // v0.15.3
import httpAdapter from "axios/lib/adapters/http";
import nock from "nock";
import VerificationPopup from "../components/VerificationPopup";
configure({ adapter: new Adapter() });
jest.setTimeout(30000);

const match = {
  params: {
    lang: "en" //any id you want to set
  }
};
const location = {
  search: "",
  pathname: "/en/start"
};
const host = baseURL;

axios.defaults.host = host;
axios.defaults.adapter = httpAdapter;
let query = {
  lang_id: 1
};
global.URL.createObjectURL = jest.fn();
const Shop = shallow(
  <StartShop
    match={match}
    mobile_verified={1}
    mobile={"0102357890"}
    location={location}
  />
);
let instance = Shop.instance();

describe('start shop render',()=>{
    it('reneders',()=>{
        expect(Shop.exists()).toBeTruthy()
    })
    it("renders correctly", () => {
        expect(Shop).toMatchSnapshot();
      });
    it('the locale load',()=>{
        expect(instance.state.locale).not.toBeNull()
    })

   
       
    it('verify robot function test ',()=>{
        expect(instance.state. verify_robot).toBeFalsy()
        instance.verify_robot('12321')
        expect(instance.state. verify_robot).toBeTruthy()

    })

    it('toogle busy test ',()=>{
        expect(instance.state.is_busy).toBeFalsy()
        instance.toggle_busy()
        expect(instance.state.is_busy).toBeTruthy()
    })
    it('change avatar function test',()=>{
        expect(instance.state.avatar).toBe("")
        let e={
            target:{
                files:['file']
            }
        }
        instance.changeAvatar(e)
        expect(instance.state.avatar).toBe("file")
    })

    it('ondrop function test',()=>{
        expect(instance.state.cover).toBe('')
        let e={
            target:{
                files:['file']
            }
        }
        instance.onDrop(e)
        expect(instance.state.cover).toBe('file')
    })

    it('onchange function test',()=>{
        expect(instance.state.name).toBe('')
        let e={
            target:{
                name:'name',
                value:'name'
            }
        }
        instance.onChange(e)
        expect(instance.state.name).toBe('name')
    })

    
})

describe('start shop functional testing',()=>{
  
    it('name validate',async()=>{
        instance.setState({
            name:'name'
        })
       let res=await instance.validation(['name'])
       expect(res).toBe(true)
       
    })
    it('redirect to mobile page if there is no mobile number found',async ()=>{
        const startShop_copy = shallow(<StartShop match={match} location={location}/>);
        let another_instance=startShop_copy.instance()
        another_instance.setState({
            name:'name',
            verify_robot:true
        })
        await another_instance.startYourShop()
        expect(another_instance.state.redirect).toBeTruthy()
        let dis=localStorage.getItem("destination")
        expect(dis).toEqual('start')
    })
    it('open popup if there is mobile number but not verified',async()=>{
        const startShop_copy = shallow(<StartShop match={match} mobile={'0102357890'} location={location}/>);
        let another_instance=startShop_copy.instance()
        const verification= shallow( <VerificationPopup
            lang={match.params.lang}
            translation={another_instance.state.locale}
            code={1}
          />)
          another_instance.VerificationPopup=verification.instance()
        another_instance.setState({
            name:'name',
            verify_robot:true
        })
        const spyPreventDefault = jest.spyOn(another_instance, 'openPopUp');
        await another_instance.startYourShop()
        expect(spyPreventDefault).toHaveBeenCalled()

    })
    it('start shop work successfully', async()=>{
        instance.setState({
            cover:'cover', 
            avatar:'avatar',
            name:"shop",
            bio:'bio',
            username:'username',
        })
        nock(host)
        .post("/shop")
        .query(query)
        .reply(200, {
          data: {
            "access_token":'3242576786543567897654345678',
            avatar:'awaver',
            user_id:233,
            verified:1, 
            mobile_verified:1
          }
        });
        await instance.startYourShop()
       // expect(postNewShop).toBeCalled()

        expect(instance.state.is_Error).toBeFalsy()
    })
})

describe("buttons test", () => {
  it("change avatar test", () => {
    instance.setState({ loggedin: true });
    const avatar_button = Shop.find("#avatar-button");
    expect(avatar_button.length).toEqual(1);
    // const spy = jest.spyOn(instance, "changeAvatar");
    // avatar_button.prop("onPress")();
    // expect(spy).toHaveBeenCalled()
  });

  // it('name input test',()=>{
  //     const username=Shop.find("#name-input")
  //     expect(username.length).toEqual(1);
  //     const event = { target: { name: "name", value: "456" } };
  //     username.simulate("keyUp", event);
  //     expect(instance.state.email).toEqual("456");

  //   })
});
