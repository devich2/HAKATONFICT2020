
import {appPath} from "./common"
const querystring = require("querystring")
export default class ProductService {
    constructor() {
        this.baseUrl = appPath + "shop/"
    }
    get(shop, search, page = 1) {
        return fetch(this.baseUrl + (shop || "zakaz_all") + "?" + querystring.stringify({ search, page })).then(res => res.json()).then(res => res.items)
    }
}