
import {appPath} from "./common"
const querystring = require("querystring")
export default class ProductService {
    constructor() {
        this.baseUrl = appPath + "shop/"
    }
    get(shops, search, page = 1) {
        return fetch(this.baseUrl + "zakaz_all" + this.formMultipleShops(shops) + "?" + querystring.stringify({ search, page })).then(res => res.json()).then(res => res.items)
    }
    formMultipleShops(shops){
        return shops && shops?.length ? ("/" + shops.join(",")) : "";
    }
}