import axios from 'axios'
import qs from 'qs'

export default {
    api: null,
    cookies: {},
    setCookies(value) {
        // value = value || {}
        // this.cookies = value
        this.api = axios.create({
            // baseURL: config.api,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                // cookie: parseCookie(value)
                aceessToken: value
            },
            timeout: 30000,
        })
    },
    postJson(url, data) {
        if (!this.api) this.setCookies()
        return this.api({
            method: 'post',
            url: "http://localhost:3000/api/"+url,
            data: data,
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => {
            return res
        })
    },
    post(url, data) {
        if (!this.api) this.setCookies()
        return this.api({
            method: 'post',
            url: "http://localhost:3000/api/"+url,
            data: data,
            transformRequest:[function (data) {
                return qs.stringify(data)
            }],
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            }
        }).then(res => {
            return res
        })
    },
    get(url, params) {
        if (!this.api) this.setCookies()
        return this.api({
            method: 'get',
            url: "http://localhost:3000/api/"+url,
            params,
        }).then(res => {
            return res.data
        })
    },
    put(url, params) {
        if (!this.api) this.setCookies()
        return this.api({
            method: 'put',
            url: "http://localhost:3000/api/"+url,
            params,
        }).then(res => {
            return res.data
        })
    },
    delete(url, params) {
        if (!this.api) this.setCookies()
        return this.api({
            method: 'delete',
            url: "http://localhost:3000/api/"+url,
            params,
        }).then(res => {
            return res.data
        })
    }
}