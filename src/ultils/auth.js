const uuidv4 = require('uuid/v4');
export const isLoggedIn = () => localStorage.getItem("access_token");

export const getJwt = () => localStorage.getItem("access_token");

export const fetchStoredShopId = () => undefined !== localStorage.getItem("shop_id") ? localStorage.getItem("shop_id") : null;

export const fetchUUid = () =>{
    let uuid =localStorage.getItem("uuid")
    console.log(uuid)
    let new_uuid =uuid? uuid:uuidv4();
    console.log(new_uuid)
    localStorage.setItem("uuid",new_uuid)
    return new_uuid
}