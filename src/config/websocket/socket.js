// 导出socket对象
import {getToken} from '@/utils/auth';
import VueRouter from 'vue-router'
import store from '../../store/index'
export {
    socket
}
import { Message,MessageBox } from 'element-ui'
import {header} from "../../listening/header";
import {asidefriend} from "../../listening/asidefriend";
import {chatbox} from "../../listening/chatbox";
import {chatcontent} from "../../listening/chatcontent";
import {videocalls} from "../../listening/videocalls";
import {voicecalls} from "../../listening/voicecalls";

// socket主要对象
var socket = {
    websock: null,
    /** //pengzhenggao.top
     * 这个是我们的ws的地址//pengzhenggao.top
     * */
    ws_url: "ws://localhost:8089/ws",
    /**
     * 开启标识
     * */
    socket_open: false,

    /**
     * 下线标识
     */
    offLineFlag : null,
    /**
     * 心跳timer
     * */
    hearbeat_timer: null,
    /**
     * 心跳发送频率
     * */
    hearbeat_interval: 5000,

    /**
     * 是否开启重连
     * */
    is_reonnect: true,
    /**
     * 重新连接的次数
     * */
    reconnect_count: 3,
    /**
     * 当前重新连接的次数，默认为：1
     * */
    reconnect_current: 1,
    /**
     * 重新连接的时间类型
     * */
    reconnect_timer: null,
    /**
     * 重新连接的间隔
     * */
    reconnect_interval: 3000,

      i : 0,

     timer:null,
    /**
     * 初始化连接
     */
    init: () => {
        if (!("WebSocket" in window)) {
            Message({
                message: '当前浏览器与网站不兼容丫',
                type: 'error',
            });
            return null
        }

        if (socket.websock && socket.websock.readyState===1) {
            return socket.websock
        }

        socket.websock = new WebSocket(socket.ws_url)
        //接收消息
        socket.websock.onmessage = function (e) {
            //调用处理消息的方法
            socket.receive(e)
        }

        // 关闭连接
        socket.websock.onclose = function (e) {
            clearInterval(socket.hearbeat_interval);
            socket.socket_open = false;
            if (socket.websock!=null){
                header.getWebsocketStatus(socket.websock.readyState);
            }
            // 需要重新连接
            if (socket.is_reonnect) {
                socket.reconnect_timer = setTimeout(() => {
                    // 超过重连次数
                    if (socket.reconnect_current > socket.reconnect_count) {
                        clearTimeout(socket.reconnect_timer)
                        return
                    }
                    // 记录重连次数
                    socket.reconnect_current++
                    socket.reconnect()
                }, socket.reconnect_interval)
            }
        }

        // 连接成功
        socket.websock.onopen = function () {
            // Message({
            //     message: '连接成功',
            //     type: 'success',
            // });
            header.getWebsocketStatus(socket.websock.readyState);
            let data = {
                "action": 10002,
                "token":getToken(),
                "chatMsg": null,
                "extend": 1,
            };
            socket.send(data);
            socket.socket_open = true;
            socket.is_reonnect = true;
            //重修刷新好友内容
            window.dispatchEvent(new CustomEvent('connectInit'));
            // 开启心跳
            socket.heartbeat()
        };
        // 连接发生错误
        socket.websock.onerror = function (err) {
            Message({
                message: '服务连接发送错误！',
                type: 'error',
            });
        }
    },
    /**
     * 获取websocket对象
     * */

    getSocket:()=>{
        //创建了直接返回，反之重来
        if (socket.websock) {
            return socket.websock
        }else {
            socket.init();
        }
    },

    getStatus:()=> {
        if (socket.websock.readyState === 0) {
            return "未连接";
        } else if (socket.websock.readyState === 1) {
            return "已连接";
        } else if (socket.websock.readyState === 2) {
            return "连接正在关闭";
        } else if (socket.websock.readyState === 3) {
            return "连接已关闭";
        }
    },

    /**
     * 发送消息
     * @param {*} data 发送数据
     * @param {*} callback 发送后的自定义回调函数
     */
    send: (data, callback = null) => {
        // 开启状态直接发送
        if (socket.websock!=null && socket.websock.readyState === socket.websock.OPEN) {
            try {
                socket.websock.send(JSON.stringify(data));
            }catch (e) {
                if (socket.timer !=null){
                    return
                }
                socket.timer = setInterval(()=>{
                   if (i>=6){
                       clearInterval(socket.timer);
                       socket.timer = null;
                       socket.i = 0;
                       return
                   }
                  socket.websock.send(JSON.stringify(data));
                    socket.i++;
               },2000)
            }
            if (callback) {
                callback()
            }

            // 正在开启状态，则等待1s后重新调用
        } else if (socket.websock!=null && socket.websock.readyState === socket.websock.CONNECTING) {
            setTimeout(function () {
                socket.send(data, callback)
            }, 1000)

            // 未开启，则等待1s后重新调用
        } else if (socket.websock!=null){
            socket.init();
            setTimeout(function () {
                socket.send(data, callback)
            }, 1000)
        }
    },

    /**
     * 接收消息
     * @param {*} message 接收到的消息
     */
    receive: (message) => {
        var recData = JSON.parse(message.data);
        /**
         *这部分是我们具体的对消息的处理
         * */
        switch (recData.active) {
            case 30000:   //上线下线通知
                asidefriend.OnAndOffLineNotificationsImpl(recData);
                break;
            case 30001:  //单人聊天
                if (VueRouter.path  !== "/wechat"){
                    header.updateIsDot();
                }
                chatbox.receiverMessage(recData);
                break;
            case 30002:  //发送添加请求
                header.addFriendNotice(recData);
                break;
            case 30003:  //同意添加请求
                asidefriend.buddyListPopulation(recData);
                break;
            case 30004:   //撤回
                chatcontent.retractMessage(recData);
                break;
            case 30005:   //发送群聊信息
                if (VueRouter.path  !== "/wechat"){
                   header.updateIsDot();

                }
                chatbox.groupChatMessage(recData);
                break;
            case 30006:   //初始化好友栏
                asidefriend.initAsideFriend();
                break;
            case 30007:   //视屏通话
                videocalls.videoCallsResponse(recData);
                break;
            case 30008:  //语音通话
                voicecalls.voiceCallsResponse(recData);
                break;
            case 30009:  //解散群聊通知操作
                chatbox.disbandGroupChat(recData);
                break;
            case 50001:
                header.announcementNotice(recData);  //公告发布实时更新
                break;
            case 40002:  //被迫下线通知
                socket.offLine(recData)

        }
        // 自行扩展其他业务处理...
    },
    offLine:(data) =>{
        if (socket.offLineFlag==null){
            MessageBox.confirm(
                data.message || '登陆状态异常,请重新登陆',
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
                socket.offLineFlag = null;
                socket.close();
                store.dispatch('user/resetToken')
                    .then(() => {
                        location.reload()
                    })
            }).catch(()=>{
                socket.offLineFlag = null
            });
        }

    },
    /**
     * 心跳
     */
    heartbeat: () => {
        if (socket.hearbeat_timer) {
            clearInterval(socket.hearbeat_timer)
        }
        socket.hearbeat_timer = setInterval(() => {
            //发送心跳包
            let data = {
                "action": 10000,
                "token":getToken(),
                "chatMsg": null,
                "extend": null,
            };
            socket.send(data)
        }, socket.hearbeat_interval)
    },

    /**
     * 主动关闭连接
     */
    close: () => {
        if (socket.websock==null){
            return
        }
        let data = {
            "action": 10002,
            "token":getToken(),
            "chatMsg": null,
            "extend": 0,
        };
        socket.send(data);
        clearInterval(socket.hearbeat_interval);
        socket.is_reonnect = false;
        socket.websock.close();
        header.getWebsocketStatus(socket.websock.readyState);
        socket.websock=null
    },

    /**
     * 重新连接
     */
    reconnect: () => {
        if (socket.websock && socket.socket_open) {
            socket.websock.close()
        }
        socket.init()
    },
}
