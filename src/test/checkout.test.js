import React from 'react';
import {shallow} from 'enzyme';
import {CheckoutPage} from '../containers/Checkout/Checkout'
import ConfirmationPopup from '../components/ConfirmationPopup'
import {CheckoutTabs} from '../components/Checkout/CheckoutTabs'
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import axios from "axios"; // v0.15.3
import {baseURL} from '../common/Config'
import httpAdapter from "axios/lib/adapters/http";
import nock from "nock";
import {orderinfo,products,cart_total} from '../data/checkout'
import store from "../Store";
import * as user from '../actions/user'
import {DELETE_ADDRESS,UPDATE_ADDRESS}from '../actions/types'
import { update } from '../services';

configure({ adapter: new Adapter() });

const match = {
    params : { 
                lang : 'en', //any id you want to set
            }
}
const location={
    search:''
}
const history={
    push: function push(data){ return data}
}
const host = baseURL;

axios.defaults.host = host;
axios.defaults.adapter = httpAdapter;

localStorage.setItem("cart_id",1)
const checkout = shallow(<CheckoutPage history={history} match={match} location={location}/>);
let instance=checkout.instance()

const confimation_popup= shallow(
    <ConfirmationPopup
        ref={a => (instance.ConfirmationPopup = a)}
        lang={instance.props.match.params.lang}
        translation={instance.state.locale}
        action={instance.delAddress}
  />
)

const confirmation_instance=confimation_popup.instance()
confirmation_instance.modal={
    toggle: function toggle(){}
}

const checkout_tabs=shallow(
    <CheckoutTabs
        addNewAddress={instance.updateAddress}
        {...instance.state}
        {...instance.props}
        ref={t => {
            instance.Tabs = t;
        }}
        total={instance.state.total}
        locale={instance.state.locale}
        delAddress={instance.openPopUp}
        address={[]}
    />
)
const tabs_instance=checkout_tabs.instance()
tabs_instance.AddressPopup={
    toggle: function toggle(){}
}
describe('checkout container renders',()=>{
    it('reneders',()=>{
        expect(checkout.exists()).toBeTruthy()
    })

    it("renders correctly", () => {
        expect(checkout).toMatchSnapshot();
    });

    it('the locale load',()=>{
        expect(instance.state.locale).not.toBeNull()
    })

    nock(host)
    .get("/order/info")
    .reply(200, {
        data: orderinfo
    });
    nock(host)
    .get("/cart/guest/total/1?lang_id=1")
    .reply(200, {
        data: cart_total
    });
    nock(host)
    .get("/cart/sellers?lang_id=1")
    .reply(200, {
        data: products
    });
    it("didount function call other functions",async()=>{
        const spy_order = jest.spyOn(instance, 'getOrderInfo');
        const spy_products = jest.spyOn(instance, 'getRecieptProducts');
        const spy_total = jest.spyOn(instance, 'getCartTotal');
        await instance.componentDidMount()
        expect(spy_order).toHaveBeenCalled()
        expect(spy_products).toHaveBeenCalled()
        expect(spy_total).toHaveBeenCalled()


    })

    it('get orders function test',async()=>{
        await instance.getOrderInfo()
        expect(instance.state.payment_token).toEqual("ZXlKaGJHY2lPaUpJVXpVeE")
        expect(instance.state.payment_order_id).toEqual("3290455")
        expect(instance.state.id).toEqual(92)

    })
    it('get orders function test',async()=>{
        await instance.getRecieptProducts()
        expect(instance.state.products).toEqual(products)

    })
    it("get cart total function test",async()=>{
        await instance.getCartTotal(1)
        expect(instance.state.total).toEqual(1250)
        expect(instance.state.currency).toEqual("EGP")
    })
})

describe("confirmation popup test",()=>{
   
    it('popup reneders',()=>{
        expect(confimation_popup.exists()).toBeTruthy()
    })

    it("popup renders correctly", () => {
        expect(confimation_popup).toMatchSnapshot();
    });

   /* it ("close button call function",()=>{
        const spy_toggle = jest.spyOn(confirmation_instance, 'toggle');

        const close_button=confimation_popup.find("#popup-close-button")
        close_button.prop("onPress")()
        expect(spy_toggle).toHaveBeenCalled()

    })
    it("confirm button working ",()=>{
        const spy = jest.spyOn(instance, 'delAddress');

        let confirm_button=confimation_popup.find("#confirm-button")
        confirm_button.prop("onPress")()
        expect(spy).toHaveBeenCalled()

    })*/
})

describe("checkout tabs test",()=>{
    it('tabs reneders',()=>{
        expect(checkout_tabs.exists()).toBeTruthy()
    })

    it("tabs renders correctly", () => {
        expect(checkout_tabs).toMatchSnapshot();
    });
   /* it("add-address is called",()=>{
        const address_spy=jest.spyOn(tabs_instance,"openPopUp")
        const add_buttn=checkout_tabs.find("#add-address")
        add_buttn.prop("onPress")()
        expect(address_spy).toHaveBeenCalled()
    }) */
    it("select address function test",()=>{
        tabs_instance.selectAddress(9)
        expect(tabs_instance.state.address_id).toEqual(9)
        let id= localStorage.getItem("address_id")
        expect(id).toEqual("9")
    })

    it("place order function test",async()=>{
        nock(host)
        .post(`/order/place`)
        .reply(200,{
            data:22
        })
    })
})

describe("redux tests",()=>{
    nock(host)
    .put("/Address/22")
    .reply(200,{
        data:true
    })

    it("add address cycle", async()=>{
       let res=  store.dispatch(
        user.addNewAddress(
            [
                {
                    id:"33",
                    user_id:"2",
                    address_line_1:"trail",
                    area_id:"1",
                    is_deleted:"0",
                    modified:"0",
                    area_name :"maadi",
                    city_name :'cairo'
                }
            ]
        )
       )
       expect(res).toEqual({
        type: UPDATE_ADDRESS,
        payload: [
            {
                id:"33",
                user_id:"2",
                address_line_1:"trail",
                area_id:"1",
                is_deleted:"0",
                modified:"0",
                area_name :"maadi",
                city_name :'cairo'
            }
        ]
      })
      let user_state= store.getState().user
      expect(user_state.address)
      .toEqual(
        [
            {
                id:"33",
                user_id:"2",
                address_line_1:"trail",
                area_id:"1",
                is_deleted:"0",
                modified:"0",
                area_name :"maadi",
                city_name :'cairo'
            }
        ]
      )
 


    })
    
})