import Axios from "axios";
import {MessageBox, Message} from 'element-ui'
import store from '../store/index'
import {getToken} from '@/utils/auth';
import {socket} from "../config/websocket/socket";
import {encrypt} from "../utils/http-crypto";

// 创建axios实例
const service = Axios.create({
    baseURL: process.env.VUE_APP_BASE_API, //URL地址   环境变量文件 .env.development
    timeout: 5000,//超时
    withCredentials: false,  //跨域时若要发生cookie,需要设置该选项
})
const whiteList = ['/user/login',"/upload/oss"]; //排除的路径
// 请求拦截器
service.interceptors.request.use(
    config => {
        if (store.getters.token) {
            // 设置令牌请求头
            config.headers['authorization'] = store.getters.token;
        }

        if (config.method === 'post' && whiteList.indexOf(config.url)===-1 && config.data){
            config.headers['Content-Type'] = 'application/json;charset=UTF-8';
            config.data = encrypt(config.data)
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
);

let confirmStatus = null;

// 相应拦截
service.interceptors.response.use(
    // 通过自定义code 判定响应状态 也可以通过HTTP状态码判断
    response => {
        const res = response.data;
        // code 不为0 则判断为一个错误
        if (res.code !== 20000) {
            if ((res.code === 40001 || res.code === 10012) && confirmStatus==null) {
                confirmStatus = 1;
                // 重新登陆
                MessageBox.confirm(
                    '登陆状态异常,请重新登陆',
                    "重新登入",
                    {
                        confirmButtonText: '重新登陆',
                        cancelButtonText: '取消',
                        center: true,
                        closeOnClickModal:false,
                        closeOnPressEscape:false,
                        showClose:false,
                        showCancelButton:false,
                        closeOnHashChange:false,
                        type: 'warning'
                    }
                ).then(() => {
                    confirmStatus = null;
                    socket.close();
                    store.dispatch('user/resetToken')
                        .then(() => {
                            location.reload()
                        })
                }).catch(()=>{
                    confirmStatus = null
                });
            }else if (confirmStatus == null){
                Message.error(res.message);
                // 假设 10008 非法令牌  10012 其他客户端已经登陆
                return Promise.reject(new Error(res.message || 'Error'));
            }
        } else {
            return res;
        }
    },
    error => {
        if (error.message.includes('timeout')) {  // 如果错误信息中包含'timeout'，则认为是连接超时
            Message.error("网络超时");
        }else{
            Message.error("网络超时");
        }

    }
);

export default service;
