
import appPath from "./common"
export default class ShopService {
    constructor() {
        this.baseUrl = appPath + "shops";
    }
    static getAll() {
        return fetch(this.baseUrl).then(res => res.json()).then(res => res.shops);
    }
}