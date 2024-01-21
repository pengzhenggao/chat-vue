<template>
    <div>
        <div class="container" @click="clickPostCard">
            <div style="display: flex;flex-direction: row;border-bottom: 1px solid #999999;padding-bottom: 5px">
                <img :src="postcardMessage.avatar" style="width: 55px;height: 55px"/>
                <div style="margin-left: 10px;display: flex;flex-direction: column">
                    <div>
                        <span>{{postcardMessage.userName || "未知"}}</span>&nbsp;
                        <span v-if="postcardMessage.gender===1" class="el-icon-s-custom"></span>
                        <span v-else class="el-icon-user-solid" style="color: red"></span>
                    </div>
                    <div class="intro">
                        <span>{{postcardMessage.intro || "本人很懒~ 什么都没留下"}}</span>
                    </div>
                </div>
            </div>
            <div style="font-size: 12px">
                <span>个人名片</span>
            </div>
        </div>

        <div class="getSearch">
            <el-dialog
                    width="300px"
                    :visible.sync="innerVisible"
                    :before-close="clear"
                    append-to-body>
                <div style="padding: 10px">
                    <div class="personal">
                        <el-image
                                v-if="postcardMessage.avatar"
                                style="width: 75px; height: 75px;border-radius: 10px"
                                :src="postcardMessage.avatar"
                        ></el-image>
                        <div class="base-content">
                            <div style="display: flex;flex-direction: row">
                                <el-tooltip class="item" effect="dark" :content="postcardMessage.userName"
                                            placement="bottom">
                                    <p class="nick-name">{{postcardMessage.userName}}</p>
                                </el-tooltip>
                                &nbsp;
                                <span :class="{'man':postcardMessage.gender===1,'woman':postcardMessage.gender===0}">
                                    <i class="el-icon-s-custom"></i>
                                    </span>
                            </div>
                            <el-tooltip class="item" effect="dark" :content="postcardMessage.userName"
                                        placement="bottom">
                                <p class="login-name">
                                    <span>登入名:</span> <span>{{postcardMessage.userName}}
                                </span>
                                </p>
                            </el-tooltip>
                        </div>
                    </div>
                    <div style="text-align: center;margin-top: 20px">
                        <el-button v-if="postcardMessage.isFriend===0" type="info">正在申请</el-button>
                        <el-button @click="sendMessageFunction(postcardMessage)"
                                   v-else-if="postcardMessage.isFriend===1 || postcardMessage.isFriend===3"
                                   type="primary">发消息
                        </el-button>
                        <div v-else>
                            <el-input size="mini" v-model="sendMessage.content"
                                      prefix-icon="el-icon-edit"
                                      class="custom-input"
                                      maxlength="30"
                                      placeholder="输入留言"></el-input>
                            <el-button style="margin-top: 10px" @click="addFriend(postcardMessage.id)"
                                       type="success">添加为好友
                            </el-button>
                        </div>
                    </div>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import service from "../../http";
    import {socket} from "../../config/websocket/socket";
    import {getToken} from "../../utils/auth";
    import {asidefriend} from "../../listening/asidefriend";

    export default {
        name: "Postcard",
        props: {
            userInfoId: {
                type: Number,
                default: null
            },
        },
        data() {
            return {
                innerVisible: false,
                sendMessage: {
                    action: 10004,       //聊天标识
                    token: getToken(),
                    receiverId: "",     //接收方
                    extend: 1,
                    content: "你好",         //聊天输入内容
                },
                postcardMessage: {
                    isFriend: null,
                    userName: null,
                    avatar: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
                }
            }
        }, methods: {
            init() {
                service({
                    method: "get",
                    url: "users/userInfo/getByIdPostcardUser",
                    params: {
                        userInfoId: this.userInfoId
                    }
                }).then(res => {
                    this.postcardMessage = res.data
                })
            },
            addFriend(friendId) {
                this.sendMessage.receiverId = friendId;
                this.sendMessage.action = 10004;
                socket.send(this.sendMessage);
                this.clear();
                this.$message({
                    type: "success",
                    message: "已申请添加"
                })
            },
            clickPostCard() {
                this.innerVisible = true;
            },
            sendMessageFunction(postcardMessage) {
                this.innerVisible = false;
                asidefriend.getChat(postcardMessage.id)
            },
            clear() {
                this.innerVisible = false;
            }
        }, mounted() {
            this.$nextTick(() => {
                this.init()
            })

        }
    }
</script>

<style scoped>
    .container {
        cursor: pointer;
        padding: 10px;
        height: 70px;
        width: 210px;
        background-color: white;
    }

    .container .img {

    }

    .container img {
        border-radius: 5px;
    }

    .drop {
        position: relative;
        cursor: pointer;
        width: 300px;
        min-height: 65px !important;
        max-height: 87px !important;
        border-bottom: 1px solid #dcdfe6;
        padding: 0 5px 0 5px;
        box-sizing: border-box;
        display: flex;
    }

    .drop:hover {
        background: #f3f3f3;
    }

    .drop:hover img {
        transform: scale(1.5) rotate(360deg);
        opacity: 1;
    }

    .drop-left {
        text-align: right;
        width: 50px;
        height: 32px;
        position: absolute;
        right: 0;
    }

    .drop-left img {
        width: 32px;
        height: 32px;
        transition: all 0.5s;
    }

    .drop-left-icon {
        width: 10px;
        height: 20px;
        fill: currentColor;
        opacity: 0.9;
        transition: all 0.5s;
    }

    .drop-left-btns {
        color: black;
        height: 30px;
        padding: 0 10px;
        font-size: 14px;
        border-radius: 2px;
    }

    .drop-left-btns-success {
        background: #F8FDF6;
        border: 1px solid #A2FC76;
    }

    .drop-left-btns-warning {
        background: #FDF9F4;
        border: 1px solid #FDC673;
    }

    .drop-left-btns-danger {
        background: #FEF5F5;
        border: 1px solid #FCBEBE;
    }

    .drop-left-btns-info {
        background: #FCFCFD;
        border: 1px solid #CDCDCD;
    }

    .drop-right {
        margin-left: 10px;
        margin-top: 5px;
        flex: 1;
        display: flex;
        align-items: stretch;
        flex-wrap: wrap;
        width: 160px;

    }

    .drop-right p {
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .drop-right p:nth-child(1) {
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #515a6e;
        margin-bottom: 5px;
        max-height: 44px;
        min-height: 22px;
        text-overflow: -o-ellipsis-lastline;

        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }

    .drop-right p:nth-child(2) {
        font-size: 12px;
        color: #808695;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .init {
        height: 65px;
    }

    .search {
        width: 50px;
        height: 50px;
        display: flex;
        justify-content: center;
        background-color: #07c160;
        border-radius: 5px;
        font-size: 20px;
        color: white;
        align-items: center
    }

    .el-dialog__wrapper {
        top: 50px;
        right: -300px !important;
    }

    /deep/ .el-dialog__header {
        display: none;
    }

    .man {

        color: #409EFF;
    }

    .woman {
        color: #f38098;
    }

    .personal {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding-bottom: 30px;
        border-bottom: 1px solid #d9d9d9
    }

    .personal .login-name {
        margin-top: 5px;
        color: #999999;
        font-size: 13px;
        width: 150px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .personal .nick-name {
        max-width: 100px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .personal .base-content {
        display: flex;
        flex-direction: column;
        align-self: flex-start;
        color: black;
        margin-left: 10px
    }

    /* 利用穿透，设置input边框隐藏 */
    /deep/ .custom-input .el-input__inner {
        border-radius: 0;
        border: 0;
        border-bottom: 1px solid #999999;
    }

    .intro {
        overflow-wrap: break-word;
        width: 100%;
        font-size: 12px;
        color: #999999
    }
</style>
