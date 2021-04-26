import React from 'react';
import { shallow } from 'enzyme';
import {OrderInfo} from '../containers/Orders/OrderInfo';
import Adapter from 'enzyme-adapter-react-16';
import { configure } from 'enzyme';
import {baseURL} from '../common/Config'


import axios from "axios"; // v0.15.3
import httpAdapter from "axios/lib/adapters/http";
import nock from "nock";


configure({ adapter: new Adapter() });
jest.setTimeout(30000);

const match = {
    params : { 
        lang : 'en', //any id you want to set,
        id:73
    }
}

const location={
    search:''
}

const host = baseURL;

axios.defaults.host = host;
axios.defaults.adapter = httpAdapter;
let query = {
  id: 73
};

describe('Order Info', () => {
    const orderinfo = shallow(<OrderInfo match={match} location={location}/>);
    let instance = orderinfo.instance();

    it('Should Fetch OrderInfo And Update the State', () => {


        let data = [
            {
                address: "17 Ahmed Mohamed st↵Sharabia - Ard ElSherka",
                chunk_id: 112,
                chunks: [
                    {
                        avatar: "https://static.tarbeeta.com/images/shops/59/1557848536743.png",
                        chunk_id: "112",
                        currency: "EGP",
                        date_add: "2019-06-24 15:16:19",
                        fulfilled: "1",
                        grand_total: 229,
                        items: [
                            {
                                comment: "",
                                currency: "EGP",
                                img: "https://static.tarbeeta.com/images/products/44/colour/9/1557928393540.jpg",
                                name: "LAVA",
                                price: "229",
                                product_id: "44",
                                qty: "1",
                                quality: "",
                                variation_id: "285"
                            }
                        ],
                        shippment_fees: "0",
                        shop_id: "59",
                        shop_name: "Magma Sports Wear",
                        status: "Order placed",
                        status_id: "2",
                        total: 229,
                        tracking_number: "KCLYEFCJ",
                        username: "Magma"
                    }
                ],
                currency: "EGP",
                kiosk_confirmation_code: null,
                order_id: 73,
                payment_method: "COD",
                payment_method_id: 4,
                src_data_subtype_id: null,
                total: "229"
            }
        ];

        nock(host)
        .get(`/order`)
        .query(query)
        .reply(200, {
            data: data
        });

        instance
        .componentDidMount()
        .then(res => expect(instance.state.data).toEqual(data));

    });


    it('Order Info Container exists', () => {
        expect(orderinfo.exists()).toEqual(true);
    });


    it('renders correctly', () => {
        // expect(orderinfo).toMatchSnapshot();
    });

});
