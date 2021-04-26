import React from "react";
import { shallow } from "enzyme";
import { ShopForm } from "../components/ShopForm";
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

const props ={
    changeAvatar:jest.fn()
}

const startShop = shallow(
    <StartShop 
        match={match}
        location={location}
    />
);

let startShopInstance = startShop.instance();



const formShop = shallow(
  <ShopForm
    match={match}
    mobile_verified={1}
    mobile={"0102357890"}
    location={location}
    onDrop={startShopInstance.onDrop}
    onChange={startShopInstance.onChange}
    locale={startShopInstance.state.locale}
    {...props}
  />
);
let instance = formShop.instance();

describe('Shop Form container', () => {
    it('shop form renders', () => {
        expect(formShop.exists()).toBe(true);
    });

    it('renders correctly', () => {
        expect(ShopForm).toMatchSnapshot();
    });

    it('the locale load', () => {
        expect(instance.state.locale).not.toBeNull();
    });

    // it('verify robot function test ',()=>{
    //     expect(instance.state. verify_robot).toBeFalsy()
    //     instance.verify_robot('12321')
    //     expect(instance.state. verify_robot).toBeTruthy()

    // })

    it('toogle busy test ',()=>{
        expect(instance.state.is_busy).toBeFalsy()
        instance.toggle_busy()
        expect(instance.state.is_busy).toBeTruthy()
    })

    it('change avatar function test',()=>{
        expect(startShopInstance.state.avatar).toBe("")
        let e={
            target:{
                files:['file']
            }
        }
        startShopInstance.changeAvatar(e)
        expect(startShopInstance.state.avatar).toBe("file")
    })

    it('ondrop function test',()=>{
        expect(startShopInstance.state.cover).toBe('')
        let e={
            target:{
                files:['file']
            }
        }
        startShopInstance.onDrop(e)
        expect(startShopInstance.state.cover).toBe('file')
    })

    it('onchange function test',()=>{
        expect(startShopInstance.state.name).toBe('')
        let e={
            target:{
                name:'name',
                value:'name'
            }
        }
        startShopInstance.onChange(e)
        expect(startShopInstance.state.name).toBe('name')
    })
});


describe("shop form functional testing", async () => {
    it('name validate',async()=>{
        startShopInstance.setState({
            name:'name'
        })
       let res=await startShopInstance.validation(['name'])
       expect(res).toBe(true)
       
    })

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

});


describe("buttons test", () => {
    it("change avatar test", () => {
        instance.setState({loggedin: true, redirect: false});
    //   startShopInstance.setState({ loggedin: true });
      const avatar_button = formShop.find("#avatar-button");
      expect(avatar_button.length).toEqual(1);
    // expect(instance.props.changeAvatar).toHaveBeenCalled();

    });
  
    // it('name input test',()=>{
    //     const username=Shop.find("#name-input")
    //     expect(username.length).toEqual(1);
    //     const event = { target: { name: "name", value: "456" } };
    //     username.simulate("keyUp", event);
    //     expect(instance.state.email).toEqual("456");
  
    //   })
  });
  