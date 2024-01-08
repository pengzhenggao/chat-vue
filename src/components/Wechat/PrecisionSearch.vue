<template>
    <div v-loading="loading">
        <div style="margin: 5px 0 5px 0" v-if="emptyMessage && emptyMessage.length>0">
            <p>{{emptyMessage}}</p>
        </div>
        <div :class="{'drop':keyword,'init':!keyword}">
            <div @click="search" style="display: flex;flex-direction: row;align-items: center;justify-content: center"
                 v-if="keyword">
                <div class="search">
                    <span class="el-icon-search"></span>
                </div>
                <div class="drop-right">
                    <p><span>搜索:</span> <span>{{keyword}}</span></p>
                </div>
                <div class="drop-left">
                    <el-link class="drop-left-btns drop-left-btns-primary" type="primary" :underline="false"><i
                            class="el-icon-arrow-right"></i></el-link>
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
                                    v-if="searchResult.avatar"
                                    style="width: 75px; height: 75px;border-radius: 10px"
                                    :src="searchResult.avatar"
                            ></el-image>
                            <div class="base-content">
                                <div style="display: flex;flex-direction: row">
                                    <el-tooltip class="item" effect="dark" :content="searchResult.nickName"
                                                placement="bottom">
                                        <p class="nick-name">{{searchResult.nickName}}</p>
                                    </el-tooltip>
                                    &nbsp;
                                    <span :class="{'man':searchResult.gender===1,'woman':searchResult.gender===0}">
                                    <i class="el-icon-s-custom"></i>
                                    </span>
                                </div>
                                <el-tooltip class="item" effect="dark" :content="searchResult.username"
                                            placement="bottom">
                                    <p class="login-name">
                                        <span>登入名:</span> <span>{{searchResult.username}}
                                </span>
                                    </p>
                                </el-tooltip>
                            </div>
                        </div>
                        <div style="text-align: center;margin-top: 20px">
                            <el-button v-if="searchResult.isFriend===0" type="info">正在申请</el-button>
                            <el-button @click="sendMessageFunction(searchResult)"
                                       v-else-if="searchResult.isFriend===1 || searchResult.isFriend===3" type="primary">发消息
                            </el-button>
                            <div v-else>
                                <el-input size="mini" v-model="sendMessage.content"
                                          class="custom-input"
                                          maxlength="30"
                                          placeholder="输入留言"></el-input>
                                <el-button style="margin-top: 10px" @click="addFriend(searchResult.userInfoId)" type="success">添加为好友
                                </el-button>
                            </div>
                        </div>
                    </div>
                </el-dialog>
            </div>
        </div>
    </div>

</template>

<script>
    import service from "../../http";
    import {getToken} from "../../utils/auth";
    import {socket} from "../../config/websocket/socket";

    export default {
        name: "PrecisionSearch",
        props: {
            keyword: {
                type: String,
                default: null
            },
        },
        data() {
            return {
                value: "",
                options: [],
                loading: false,
                innerVisible: false,
                searchResult: {},
                emptyMessage: null,
                sendMessage: {
                    action: 10004,       //聊天标识
                    token: getToken(),
                    receiverId: "",     //接收方
                    extend:1,
                    content: "你好",         //聊天输入内容
                }
            }
        }, methods: {
            search() {
                this.searchUser();
            },
            searchUser() {
                this.loading = true;
                service({
                    method: "get",
                    url: "/search/user",
                    params: {
                        keyword: this.keyword
                    }
                }).then(res => {
                    this.loading = false;
                    if (res.data && res.data.userInfoId !== null) {
                        this.innerVisible = true;
                        this.searchResult = res.data
                    } else {
                        this.emptyMessage = "无法找到该用户，请检查你填写的账号是否正确"
                    }
                }).catch(() => {
                    this.loading = false
                })
            },
            addFriend(friendId) {
                this.sendMessage.receiverId = friendId;
                this.sendMessage.action = 10004;

                socket.send(this.sendMessage);
                this.clear();
                this.$notify({
                    title:"添加好友",
                    type:"success",
                    message:"已申请添加"
                });
            },
            sendMessageFunction(searchResult) {
                this.innerVisible = false;
                this.$emit('precisionSearch', searchResult)
            },
            clear(){
                this.innerVisible = false;
            }
        }, mounted() {

        },
        watch: {
            keyword(newVal, oldVal) {
                this.emptyMessage = null
                // 在这里执行你想要的操作
            }
        }
    }
</script>

<style scoped>
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
    /deep/ .custom-input .el-input__inner{
        border-radius: 0;
        border: 0;
        border-bottom: 1px solid #999999;
    }

</style>
