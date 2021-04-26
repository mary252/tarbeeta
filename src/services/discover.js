import request from "../ultils/ApiCentral";
import * as config from '../common/Config'

export function load_top_deals (lang_id, limits) {
    return request({
        url: `/product/top_deals?lang_id=${lang_id}&limit=${limits}`,
        method: "GET",
    }, true)
}

export function load_most_selling (lang_id, limits) {
    return request({
        url: `/product/most_selling?lang_id=${lang_id}&limit=${limits}`,
        method: "GET"
    }, true)
}

export function load_recently_add (lang_id, limits) {
    return request({
        url: `/shop/recently_add?lang_id=${lang_id}&limit=${limits}`,
        method: "GET"
    }, true)
}

export function load_trending (lang_id, limits, department_id) {
    return request({
        url: `/product/trending?lang_id=${lang_id}&department_id=${department_id}&limit=${limits}`,
        method: "GET"
    }, true)
}

export function load_featured (lang_id, limits) {
    return request({
        url: `/product/featured?lang_id=${lang_id}&limit=${limits}`,
        method: "GET"
    }, true)
}
