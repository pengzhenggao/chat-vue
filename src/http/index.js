import Axios from "axios";
import {MessageBox, Message} from 'element-ui'
import store from '../store/index'
import {getToken} from '@/utils/auth';

// 创建axios实例
const service = Axios.create({
    baseURL: process.env.VUE_APP_BASE_API, //URL地址   环境变量文件 .env.development
    timeout: 5000,//超时
    withCredentials: false,  //跨域时若要发生cookie,需要设置该选项
})

// 请求拦截器
service.interceptors.request.use(
    config => {
        // if (store.getters.token) {
            // 设置令牌请求头
            config.headers['authorization'] = getToken()?getToken():null;
        // }
        return config
    },
    error => {
        return Promise.reject(error)
    }
);



// 相应拦截
service.interceptors.response.use(
    // 通过自定义code 判定响应状态 也可以通过HTTP状态码判断
    response => {
        const res = response.data;
        console.log(res)
        // code 不为0 则判断为一个错误
        if (res.code !== 20000) {
            Message({
                message: res.message || "Error",
                type: 'error',
                duration: 5 * 1000
            });
            // 假设 10008 非法令牌  10012 其他客户端已经登陆
            if (res.code === 40001 || res.code === 10012) {
                // 重新登陆
                MessageBox.confirm(
                    '登陆状态异常,请重新登陆',
                    "确认登陆信息",
                    {
                        confirmButtonText: '重新登陆',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                ).then(() => {
                    store.dispatch('user/resetToken')
                        .then(() => {
                            location.reload()
                        })
                })
            }

            return Promise.reject(new Error(res.message || 'Error'));

        } else {
            return res;
        }
    },
    error => {
        console.log()
        if (error.message.includes('timeout')) {  // 如果错误信息中包含'timeout'，则认为是连接超时
            Message({
                message: "网络连接超时",
                type: 'error',
                duration: 5 * 1000
            });
        }else{
            Message({
                message: "服务器错误",
                type: 'error',
                duration: 5 * 1000
            });
        }

    }
);

export default service;
