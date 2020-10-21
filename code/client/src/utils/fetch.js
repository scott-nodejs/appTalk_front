import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
import {cookie} from "./cookie";

axios.defaults.withCredentials = false;
axios.interceptors.request.use(config => {
    // const token = "JSESSIONID=a01fd6e4-ca97-41d3-8b53-b28099e4fa4b"
    // config.headers.Cookie = token;
    return config
}, err => {
    return Promise.reject(err)
})

axios.interceptors.response.use(response => response, err => Promise.resolve(err.response))

// function checkStatus(res) {
//     if (res.status === 200 || res.status === 304) {
//         return res.data
//     }
//     return {
//         code: 0,
//         msg: res.data.msg || res.statusText,
//         data: res.statusText
//     }
// }

// function checkCode(res) {
//     if (res.code === 0) {
//         Vue.prototype.$alert(res.msg)
//         throw new Error(res.msg)
//     }

//     return res
// }

let prefix = 'http://www.appshuo.club/api/'
let prefix1 = 'http://localhost:3000/node/'
export default {
    get(url, params, cookies = {}) {
        if (!url) return
        return axios({
            method: 'get',
            url: prefix + url,
            params,
            timeout: 10000,
            headers: {
                'accessToken': params.accessToken,
                cookies
            }
        })
    },
    post(url, data) {
        if (!url) return
        return axios({
            method: 'post',
            url: prefix + url,
            // data: JSON.stringify(data),
            data: qs.stringify(data),
            timeout: 10000
        })
    },
    postForm(url, data) {
        if (!url) return
        return axios({
            method: 'post',
            url: prefix + url,
            headers: {
                'Content-Type': 'application/x-www-from-urlencoded'
            },
            data: qs.stringify(data),
            timeout: 10000
        }).then(checkStatus).then(checkCode)
    }
}
