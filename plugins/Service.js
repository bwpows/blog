import axios from 'axios'
const { sha256 } = require("js-sha256")
const configBaseURL = 'https://www.bwpow.com:8746';
import {state, mutations} from '../store/todos'
import store from '../store'

function encryption(str){
    return sha256('hspJ3ScaaMTzWYx' + '&bowei' + 'cFdmeR3X6T3cQiBY' + (JSON.stringify(str) || ''))
}

// 用 create方法创建axios实例
export const Service = axios.create({
    timeout: 7000,
    baseURL: configBaseURL,
    method: 'post',
    headers:{
        'Content-Type': 'application/json;charset=UTF-8',
        'boweiid':'cFdmeR3X6T3cQiBY'
    }
})

Service.interceptors.request.use(req => {
    if(req.method.toUpperCase() == 'GET'){
        req.headers.common['opkey'] = encryption(req.params);
    }else{
        req.headers.common['opkey'] = encryption(req.data);
        req.headers.common['userName'] = localStorage.getItem('userName');
        req.headers.common['token'] = localStorage.getItem('token');
    }
    return req
})

Service.interceptors.response.use(res => {
    return res
}, err=>{
    return Promise.reject(err)
})
