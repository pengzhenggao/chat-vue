<template>
    <div class="chat-content" id="content">
        <!-- recordContent 聊天记录数组-->
        <div v-if="loading" v-loading="loading"
             element-loading-text="加载中..."
             element-loading-spinner="el-icon-loading"
        ></div>
        <div v-show="endFlag || (recordContent.length<=0 && loading===false)"
             style="text-align: center"><span
                style="color: #999999;font-size: 13px">已经没有更多数据了</span>
        </div>
        <!--单聊-->
        <div v-if="isSingleChat">
            <div v-for="(itemc,indexc) in recordContent" :key="indexc">
                <div v-if="itemc.isRetract===0">
                    <!-- 对方 -->
                    <div class="word" v-if="!itemc.isMyselfMsg" @mouseover="messageEnterHandler(itemc.id)"
                         @mouseleave="messageLeaveHandler">
                        <div @click="detail(itemc.othersUserId,$event)">
                            <img :src="itemc.othersAvatar">
                        </div>
                        <div class="info">
                            <p class="time">
                                <span>{{itemc.othersRemark}}</span>&nbsp;<span>{{chatTime(itemc.createTime)}}</span>
                            </p>
                            <div class="info-content">
                                <div v-if="messageHandlerFlag===itemc.id && (itemc.messageType===0 || itemc.messageType===1)" class="otherMessageHandler"
                                     @click="getContent(itemc.content)">
                                    <el-dropdown trigger="click" @visible-change="dropdownClose"
                                                 @command="handleCommand"
                                                 placement="bottom-start">
                                        <i class="el-icon-more"></i>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item command="1">复制
                                            </el-dropdown-item>
                                            <el-dropdown-item command="3">删除</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </div>
                                <div v-html="itemc.content" v-if="itemc.messageType===0 || itemc.messageType===1"></div>
                                <div v-else-if="itemc.messageType===3">
                                    <Postcard :userInfoId="itemc.recommendId"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 我的 -->
                    <div class="word-my" v-else @mouseover="messageEnterHandler(itemc.id)"
                         @mouseleave="messageLeaveHandler">
                        <div class="info">
                            <p class="time">
                                <span>{{chatTime(itemc.createTime)}}</span>&nbsp;<span>{{itemc.myNickName}}</span>
                            </p>
                            <div class="info-content">
                                <div v-if="messageHandlerFlag===itemc.id && (itemc.messageType===0 || itemc.messageType===1)" class="messageHandler"
                                     @click="getContent(itemc.content)">
                                    <el-dropdown trigger="click" @visible-change="dropdownClose"
                                                 @command="handleCommand"
                                                 placement="bottom-end">
                                        <i class="el-icon-more"></i>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item command="1">复制
                                            </el-dropdown-item>
                                            <el-dropdown-item command="2" v-if="compareTime(itemc.createTime)">撤回
                                            </el-dropdown-item>
                                            <el-dropdown-item command="3">删除</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </div>
                                <div v-if="itemc.isSendSuccessfully!==1"
                                     style="position: absolute;
                              left: -20px;
                              bottom: 0;
                              font-size: 15px;
                              color: #ff004f">
                                    <span class="el-icon-warning"></span>
                                </div>
                                <div style="cursor: text" v-html="itemc.content" v-if="itemc.messageType==0 || itemc.messageType==1"></div>
                                <div v-else-if="itemc.messageType==3" class="postcard">
                                    <Postcard :userInfoId="itemc.recommendId"/>
                                </div>
                            </div>
                        </div>
                        <img :src="itemc.myAvatar">
                    </div>
                    <div v-if="itemc.isSendSuccessfully===0 && itemc.isMyselfMsg===true"
                         style="background-color: #e9e9e9;width: 220px;border-radius:3px;margin: 0 auto;padding: 10px">
                        <p style="text-align: center;font-size: 13px;color: #828282">
                            不支持临时会话，请先添加他（她）
                            <span @click.prevent="sendFriendCheck" style="color: #409EFF;cursor: pointer">发送朋友验证</span>
                        </p>
                    </div>
                    <div v-else-if="itemc.isSendSuccessfully===2 && itemc.isMyselfMsg===true"
                         style="background-color: #e9e9e9;width: 410px;border-radius:3px;margin: 0 auto;padding: 10px">
                        <p style="text-align: center;font-size: 13px;color: #828282">
                            你还不是他（她）的朋友。请先发送朋友验证请求，对方验证通过后，才能聊天。
                            <span @click.prevent="sendFriendCheck" style="color: #409EFF;cursor: pointer">发送朋友验证</span>
                        </p>
                    </div>
                    <div v-else-if="itemc.isSendSuccessfully === 3 && itemc.isMyselfMsg===true"
                         style="background-color: #e9e9e9;width: 170px;border-radius:3px;margin: 0 auto;padding: 10px">
                        <p style="text-align: center;font-size: 13px;color: #828282">
                            消息已发出，但被对方拒收了</p>
                    </div>
                </div>
                <div v-if="itemc.isRetract===1"
                     style="text-align: center;background-color: #e9e9e9;width: 190px;border-radius:3px;margin: 10px auto;padding: 5px">
                    <div v-if="!itemc.isMyselfMsg">
                        <p style="font-size: 13px;color: #828282"><span>对方撤回了一条消息</span></p>
                    </div>
                    <div v-else>
                        <p style="font-size: 13px;color: #828282"><span>你撤回了一条消息</span>&nbsp;
                            <span style="color: #999999;cursor: pointer" @click.prevent="edit(itemc.content)"
                                  v-if="compareTime(itemc.createTime)">重新编辑</span></p>
                    </div>
                </div>
            </div>
        </div>

       <!-- 群聊-->
        <div v-else-if="!isSingleChat">
            <div v-for="(itemc,indexc) in recordContent" :key="indexc">
                <div v-if="itemc.isRetract===0">
                    <!-- 对方 -->
                    <div class="word" v-if="!itemc.isMyselfMessage">
                        <div>
                            <img :src="itemc.memberAvatar">
                        </div>
                        <div class="info">
                            <p class="time">
                            <span>{{itemc.customizeRemark!==null?item.customizeRemark:itemc.username}}
                            </span>&nbsp;<span>{{chatTime(itemc.createTime)}}</span>
                            </p>
                            <div class="info-content">
                                <div v-if="messageHandlerFlag===itemc.id" class="otherMessageHandler"
                                     @click="getContent(itemc.content)">
                                </div>
                                <span v-html="itemc.content"></span>
                            </div>
                        </div>
                    </div>
                    <!-- 我的 -->
                    <div class="word-my" v-else>
                        <div class="info">
                            <p class="time">
                                <span>{{chatTime(itemc.createTime)}}</span>
                                &nbsp;<span>{{itemc.customizeRemark!==null?itemc.customizeRemark:itemc.username}}</span>
                            </p>
                            <div class="info-content">
                                <div v-if="messageHandlerFlag===itemc.id" class="messageHandler"
                                     @click="getContent(itemc.content)">
                                </div>
                                <div v-if="itemc.isSendSuccessfully!==1"
                                     style="position: absolute;
                              left: -20px;
                              bottom: 0;
                              font-size: 20px;
                              color: #ff004f">
                                    <span class="el-icon-warning"></span>
                                </div>
                                <span style="cursor: text" v-html="itemc.content"></span>
                            </div>
                        </div>
                        <img :src="itemc.memberAvatar">
                    </div>
                    <div v-if="itemc.isSendSuccessfully===0 && itemc.isMyselfMsg===true"
                         style="background-color: #e9e9e9;width: 220px;border-radius:3px;margin: 0 auto;padding: 10px">
                        <p style="text-align: center;font-size: 13px;color: #828282">
                            不支持临时会话，请先添加他（她）
                            <span @click.prevent="sendFriendCheck" style="color: #409EFF;cursor: pointer">发送朋友验证</span>
                        </p>
                    </div>
                    <div v-else-if="itemc.isSendSuccessfully===2 && itemc.isMyselfMsg===true"
                         style="background-color: #e9e9e9;width: 410px;border-radius:3px;margin: 0 auto;padding: 10px">
                        <p style="text-align: center;font-size: 13px;color: #828282">
                            您还不是他（她）的朋友。请先发送朋友验证请求，对方验证通过后，才能聊天。
                            <span @click.prevent="sendFriendCheck" style="color: #409EFF;cursor: pointer">发送朋友验证</span>
                        </p>
                    </div>
                    <div v-else-if="itemc.isSendSuccessfully === 3 && itemc.isMyselfMsg===true"
                         style="background-color: #e9e9e9;width: 170px;border-radius:3px;margin: 0 auto;padding: 10px">
                        <p style="text-align: center;font-size: 13px;color: #828282">
                            消息已发出，但被对方拒收了</p>
                    </div>
                </div>
                <div v-if="itemc.isRetract===1"
                     style="text-align: center;background-color: #e9e9e9;width: 190px;border-radius:3px;margin: 10px auto;padding: 5px">
                    <div v-if="!itemc.isMyselfMsg">
                        <p style="font-size: 13px;color: #828282"><span>对方撤回了一条消息</span></p>
                    </div>
                    <div v-else>
                        <p style="font-size: 13px;color: #828282"><span>你撤回了一条消息</span>&nbsp;
                            <span style="color: #999999;cursor: pointer" @click.prevent="edit(itemc.content)"
                                  v-if="compareTime(itemc.createTime)">重新编辑</span></p>
                    </div>
                </div>
            </div>
        </div>

        <div class="getSearch">
            <el-dialog
                    width="300px"
                    :visible.sync="innerVisible"
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
                        <el-button v-if="searchResult.isFriend===0 " type="info">正在申请</el-button>
                        <el-button @click.prevent="innerVisible=false"
                                   v-else-if="searchResult.isFriend===1 || searchResult.isFriend===3"
                                   type="primary">发消息
                        </el-button>
                        <div v-else>
                            <el-input size="mini" v-model="sendMessage.content"
                                      class="custom-input"
                                      maxlength="30"
                                      placeholder="输入留言"></el-input>
                            <el-button style="margin-top: 10px" @click="addFriend(searchResult.userInfoId)"
                                       type="success">添加为好友
                            </el-button>
                        </div>
                    </div>
                </div>
            </el-dialog>
            <div
                    v-show="leftClickView"
                    class="float-window"
                    :style="{ left: `${x}px`, top: `${y}px` }">
                <div class="details">
                    <div style="display: flex;flex-direction: row;
                    padding-bottom: 20px;
                    border-bottom: 1px solid #e1e1e1">
                        <img :src="friendMessage.avatar">
                        <div class="base">
                            <div style="display: flex;flex-direction: row;align-items: center;width: 172px">
                                <p style="
                                max-width:110px;
                                 white-space: nowrap;
                                 overflow: hidden;
                                 text-overflow: ellipsis;">
                                    <span>{{friendMessage.username}}</span>&nbsp;
                                </p>&nbsp;
                                <span :class="{'man':friendMessage.gender===1,'woman':friendMessage.gender===0}">
                                    <i class="el-icon-s-custom"></i>
                                </span>
                                <p class="pool" @click="poolClick(friendMessage.friendId,$event)">
                                    <span class="el-icon-more"></span>
                                </p>
                            </div>
                            <p class="text"><span>昵称：</span>
                                <span>{{friendMessage.nickName}}</span>
                            </p>
                            <p class="text"><span>登入名：</span>
                                <span>{{friendMessage.username}}</span>
                            </p>
                            <p v-show="friendMessage.address" class="text">
                                <span>地区：</span>
                                <span>{{friendMessage.address}}</span>
                            </p>
                        </div>
                    </div>
                    <div class="other">
                        <div style="display: flex;flex-direction: column;">
                            <p style="margin-top: 5px;font-size: 14px"><span style="color: #999999;">备注名</span>
                                &emsp;&emsp;<span>{{friendMessage.remark}}</span>
                            </p>
                            <p v-show="friendMessage.label" style="margin-top: 5px;font-size: 14px"><span
                                    style="color: #999999;">标签</span>
                                &emsp;&emsp;&emsp;<span>{{friendMessage.label}}</span>
                            </p>
                            <p v-show="friendMessage.description" style="margin-top: 5px;font-size: 14px"><span
                                    style="color: #999999;">描述</span>
                                &emsp;&emsp;&emsp;<span>{{friendMessage.description}}</span>
                            </p>
                            <p style="margin-top: 12px;font-size: 14px"><span style="color: #999999;">朋友权限</span>
                                &emsp;<span>仅聊天</span>
                            </p>
                            <p style="margin-top: 12px;font-size: 14px"><span style="color: #999999;">来源</span>
                                &emsp;&emsp;&emsp;<span>通过账号搜索</span>
                            </p>
                        </div>
                    </div>
                    <div style="display: flex;justify-content: center;margin-top: 19px">
                        <el-button type="success" @click=" leftClickView = false">发送消息</el-button>
                    </div>
                </div>
            </div>
<!--            额外功能-->
            <div
                    v-show="poolClickView"
                    class="pool-float-window"
                    :style="{ left: `${px}px`, top: `${py}px` }">
                <div class="poolChick">
                    <div class="opear">
                        <div class="detail" @click="remarkViewChick">设置备注和标签</div>
                        <div class="detail" style="border-bottom: 1px solid #e1e1e1" @click="recommend(friendMessage.friendId)">
                            推荐<span v-if="friendMessage.gender===1">他</span><span v-else>她</span>给好友
                        </div>
                        <div class="detail" style="border-bottom: 1px solid #e1e1e1">
                            <span v-if="friendMessage.isStar===0" @click.prevent="setFriendStar(1)">设置星标朋友</span>
                            <span v-if="friendMessage.isStar===1" @click.prevent="setFriendStar(0)">取消星标朋友</span>
                        </div>
                        <div class="detail" @click="addBlacklist(friendMessage.friendId)">加入黑名单</div>
                        <div class="detail" style="border-bottom: 1px solid #e1e1e1" @click="complaints(friendMessage)">
                            投诉
                        </div>
                        <div class="detail" @click="delFriend(friendMessage.friendId)">删除联系人</div>
                    </div>
                </div>
            </div>
            <!--            设置备注和标签-->
            <div class="form">
                <el-dialog
                        title="设置备注和标签"
                        :before-close="handleClose"
                        :visible.sync="remarkView"
                        width="22%"
                        center>
                    <el-form ref="form" label-position="top" :model="form" label-width="80px">
                        <el-form-item>
                            <span slot="label">备注名</span>
                            <el-input size="small" placeholder="备注名" v-model="form.remark"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <span slot="label">标签</span>
                            <el-select
                                    style="width: 100%"
                                    v-model="form.label"
                                    multiple
                                    filterable
                                    size="small"
                                    suffix-icon="el-icon-arrow-right"
                                    allow-create
                                    default-first-option
                                    placeholder="选择标签">
                                <el-option
                                        v-for="(item,index) in labelOptions"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.label">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <span slot="label">描述</span>
                            <el-input
                                    type="textarea"
                                    :rows="3"
                                    placeholder="请输入内容"
                                    v-model="form.description">
                            </el-input>
                        </el-form-item>
                    </el-form>
                    <span slot="footer">
                <el-button @click="cancelConfirmUpdate">取 消</el-button>
                <el-button type="primary" @click="confirmUpdate()">确 定</el-button>
                </span>
                </el-dialog>
            </div>
        </div>
        <div>
            <audio ref="chaTone" src="@/assets/audio/chat-tone.mp3"></audio>
            <audio ref="chatGroupTone" src="@/assets/audio/chat-tone.mp3"></audio>
        </div>
        <!--        //投诉-->
        <div class="complaints">
            <el-dialog
                    title="请填写投诉信息"
                    :visible.sync="complaintsVisible"
                    width="30%"
                    center
                    :before-close="complaintsHandleClose">
                <Complaints @complaintsFinish="complaintsFinish" ref="complaints"/>
            </el-dialog>
        </div>
        <!--        好友推荐-->
        <div>
            <el-dialog
                    title="选择推荐的好友"
                    width="400px"
                    :visible.sync="referFriendVisible"
                    :before-close="referFriendClose"
                    center>
                <ReferFriend :recommendFriendId="recommendFriendId" @referFriendClose="referFriendClose" ref="referFriendChat"></ReferFriend>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import service from "../../http";
    import {getToken} from "../../utils/auth";
    import {socket} from "../../config/websocket/socket";
    import {asidefriend} from "../../listening/asidefriend";
    import Complaints from "./Complaints";
    import ReferFriend from "./ReferFriend";
    import Postcard from "./Postcard";
    export default {
        components: {
            Postcard,
            Complaints,
            ReferFriend
        },
        data() {
            return {
                recommendFriendId:null,
                referFriendVisible:false,
                complaintsVisible: false,
                labelOptions: [],
                form: {
                    friendId: "",
                    remark: "",
                    label: [],
                    description: ""
                },
                isSingleChat: true,
                copyContent: '',
                mediacyValue: null,
                messageHandlerChatId: null,
                messageHandlerFlag: null,
                showMessageHandlerFlag: false,
                poolClickView: false,
                leftClickView: false,
                remarkView: false,
                searchResult: {},
                recordContent: [],
                newMessage: '',
                searchUserId: "",
                innerVisible: false,
                searchLoading: false,
                loading: false,
                endFlag: false,
                flag: false,
                px: 0,
                py: 0,
                x: 0, // 浮动窗口的X坐标
                y: 0, // 浮动窗口的Y坐标
                page: 1,
                size: 50,
                friendMessage: {},
                sendMessage: {
                    action: 10004,       //聊天标识
                    token: getToken(),
                    receiverId: "",     //接收方
                    extend: 1,
                    content: "你好",         //聊天输入内容
                }
            };
        },
        computed: {
            disabled() {
                return this.loading
            }
        },
        methods: {
            //重新初始化
            init() {
                this.page = 1;
                this.size = 50;
                this.endFlag = false;
            },
            userGroupChatMessages(groupChatId) {
                this.isSingleChat = false
                if (this.searchUserId === groupChatId) {
                    return
                }
                this.recordContent = [];
                this.searchUserId = groupChatId;
                this.loading = true;
                this.init();
                service({
                    method: "get",
                    url: "/groupChatStorage",
                    params: {
                        page: this.page,
                        size: this.size,
                        groupChatId: groupChatId
                    }
                }).then(res => {
                    this.loading = false;
                    this.recordContent = res.data
                    this.scroll()
                }).catch(() => {
                    this.loading = false
                })
            },
            userChatMessages(searchUserId) {
                this.isSingleChat = true
                if (this.searchUserId === searchUserId) {
                    return
                }
                this.recordContent = [];
                this.searchUserId = searchUserId;
                this.loading = true;
                this.init();
                service({
                    method: "get",
                    url: "/getChatStorage",
                    params: {
                        friendId: this.searchUserId,
                        page: this.page,
                        size: this.size
                    }
                }).then(res => {
                    this.loading = false;
                    this.recordContent = res.data;
                    this.scroll()
                }).catch(() => {
                    this.loading = false
                })
            },
            poolClick(friendId, event) {
                if (event.button === 0) {
                    this.poolClickView = true;
                    this.px = event.clientX; // 更新X坐标
                    this.py = event.clientY; // 更新Y坐标
                }
            },
            detail(othersUserId, event) {
                service({
                    method: "get",
                    url: "/getFriendById",
                    params: {
                        friendId: othersUserId
                    }
                }).then(res => {
                    if (res.code === 20000) {
                        this.friendMessage = res.data;
                        if (event.button === 0) {
                            this.leftClickView = true;
                            this.x = event.clientX; // 更新X坐标
                            this.y = event.clientY; // 更新Y坐标
                        }
                    }
                })
            },
            messageEnterHandler(chatId) {
                this.mediacyValue = chatId ? chatId : this.mediacyValue;
                if (chatId) {
                    if (!this.showMessageHandlerFlag) {
                        this.messageHandlerFlag = chatId;
                    }
                } else {
                    this.messageHandlerFlag = this.mediacyValue;
                }
            },
            messageLeaveHandler() {
                if (!this.showMessageHandlerFlag) {
                    this.messageHandlerFlag = null;
                }
            },
            dropdownClose(event) {
                this.showMessageHandlerFlag = event;
                if (!event) {
                    this.messageLeaveHandler();
                    this.messageEnterHandler()
                }
            },
            getContent(content) {
                this.copyContent = content;
            },
            handleCommand(command) {
                switch (parseInt(command)) {
                    case 1: //复制
                        navigator.clipboard.writeText(this.copyContent).then(() => {
                            this.$notify({
                                type: "success",
                                title: '复制',
                                message: "复制成功",
                            })
                        }).catch(() => {
                            this.$notify({
                                type: "error",
                                title: '复制',
                                message: "复制失败",
                            })
                        });
                        break;
                    case 2: //撤回
                        this.$confirm('两分钟内可撤回消息，确定要撤回吗?', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                        }).then(() => {
                            const sendMessage = {
                                action: 10005,       //标识
                                token: getToken(),
                                chatId: this.messageHandlerFlag,    //消息数据行id
                                extend: 0,
                            };
                            socket.send(sendMessage);
                        })

                        break;
                    case 3: //删除
                        var messageStorageId = this.messageHandlerFlag;
                        this.$confirm('消息删除后将不可恢复！', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                        }).then(() => {
                            service.delete(`/deleteChatStorage/${messageStorageId}`)
                                .then(res => {
                                    var flag = 0;
                                    if (res.code === 20000) {
                                        for (let i = 0; i < this.recordContent.length; i++) {
                                            if (this.recordContent[i].id === res.data) {
                                                flag = i;
                                                break
                                            }
                                        }
                                        this.recordContent.splice(flag, 1);
                                        this.$notify({
                                            type: "success",
                                            title: "删除聊天消息",
                                            message: "删除成功"
                                        })
                                    } else {
                                        this.$notify({
                                            type: "error",
                                            title: "删除聊天消息",
                                            message: res.message
                                        })
                                    }
                                });
                        });
                        break
                }
            },
            edit(content) {
                this.$emit("reEdit", content)
            },
            remarkViewChick() {
                service({
                    method: "get",
                    url: "/getUserLabelList"
                }).then(res => {
                    this.labelOptions = res.data
                });
                this.form.friendId = this.friendMessage.friendId;
                this.form.remark = this.friendMessage.remark;
                if (this.friendMessage.label) {
                    this.form.label = this.friendMessage.label.split(",");
                } else {
                    this.form.label = this.friendMessage.label;
                }

                this.form.description = this.friendMessage.description;
                this.flag = true;
                this.remarkView = true
            },
            recommend(friendMessage) {
                this.recommendFriendId = Number(friendMessage);
                this.poolClickView = false;
                this.leftClickView = false;
                this.referFriendVisible = true;
                this.$nextTick(()=>{
                    this.$refs.referFriendChat.init()
                })
            },
            hideFloatWindow(event) {
                var lx = Number(event.clientX);
                var ly = Number(event.clientY);
                if (this.flag === false) {
                    if ((lx - this.px > 151 || lx < this.px) || (ly - this.py > 164 || ly < this.py)) {
                        this.poolClickView = false
                    }
                    if ((lx - this.x > 300 || lx < this.x) || (ly - this.y > 315 || ly < this.y)) {
                        if (this.poolClickView === false) {
                            this.poolClickView = false;
                            this.leftClickView = false;
                        }
                    }
                }

            },
            confirmUpdate() {
                if (this.form.label.length <= 0 || this.form.label === '') {
                    this.form.label = []
                }
                service({
                    method: "post",
                    url: "/updateFriendDetail",
                    data: this.form
                }).then(res => {
                    if (res.code === 20000) {
                        this.remarkView = false;
                        this.flag = false;
                        this.friendMessage = res.data;
                        asidefriend.updateRemark(res.data)
                    }
                }).catch(() => {
                    this.remarkView = false;
                    this.flag = false;
                })
            },
            //设置星标
            setFriendStar(isStar) {
                service({
                    method: "put",
                    url: "/updateStar",
                    params: {
                        twoUserId: this.searchUserId,
                        isStar: isStar
                    }
                }).then(res => {
                    if (res.code === 20000) {
                        this.poolClickView = false;
                        this.friendMessage.isStar = isStar;
                        this.$notify({
                            title: '成功',
                            message: "星标操作成功",
                            type: 'success'
                        });
                        let params = {};
                        params.friendId = this.searchUserId;
                        params.isStar = isStar;
                        window.dispatchEvent(new CustomEvent('listeningStar', {
                            detail: {
                                data: params
                            }
                        }));
                    }

                })
            },
            cancelConfirmUpdate() {
                this.remarkView = false;
                this.flag = false;
            },
            sendFriendCheck() {
                const loading = this.$loading({
                    lock: true,
                    text: '加载中',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.1)'
                });
                service({
                    method: "get",
                    url: `/getUserById/${this.searchUserId}`,
                }).then(res => {
                    loading.close();
                    if (res.data && res.data.userInfoId !== null) {
                        this.innerVisible = true;
                        this.searchResult = res.data
                    } else {
                        this.$message.error("找不到该用户")
                    }
                }).catch(() => {
                    loading.close();
                })
            },
            addBlacklist(friendId) {
                this.flag = true;
                this.$confirm('加入黑名单，你将不再收到对方的消息，' +
                    '并且你们互相看不到对方朋友圈的更新', '加入黑名单', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    customClass: 'my-dialog'
                }).then(() => {
                    service({
                        method: "put",
                        url: `/addBlacklist/${friendId}`
                    }).then(res => {
                        if (res.code === 20000) {
                            this.flag = false;
                            this.poolClickView = false;
                            this.leftClickView = false;
                            window.dispatchEvent(new CustomEvent('delFriendNotice', {
                                detail: {
                                    data: friendId
                                }
                            }));
                            this.$message.success("已加入黑名单")
                        }
                    })
                }).catch(() => {
                    this.flag = false;
                });
            },
            complaints(friend) {
                this.poolClickView = false;
                this.leftClickView = false;
                this.complaintsVisible = true;
                this.$nextTick(() => {
                    this.$refs.complaints.initData(friend)
                })

            },
            cancelBlacklist() {

            },
            addFriend(friendId) {
                this.sendMessage.receiverId = friendId;
                this.sendMessage.action = 10004;
                socket.send(this.sendMessage);
                this.$message.success("已申请添加");
                this.innerVisible = false
            },
            lazyUserChatMessages() {
                var _this = this;
                if (!_this.loading && !_this.endFlag && this.recordContent.length > 0) {
                    _this.loading = true;
                    setTimeout(this.callback, 1500)
                }
            },
            callback() {
                var _this = this;
                _this.page++;
                service({
                    method: "get",
                    url: "/getChatStorage",
                    params: {
                        friendId: _this.searchUserId,
                        currentPage: _this.page,
                        size: _this.size
                    }
                }).then(res => {
                    if (res.data.length <= 0) {
                        _this.endFlag = true;

                    }
                    _this.loading = false;
                    // this.recordContent = res.data;
                    _this.recordContent.unshift(...res.data);
                    _this.$emit("positionView", (res.data.length / this.recordContent.length));
                }).catch(() => {
                    _this.loading = false
                })
            },
            receiverMessage(event) {
                if (!this.isSingleChat) {
                    return
                }
                const userInfo = this.$store.getters.userLogin;
                var params = event.detail.data.message;
                //如果发送消息后返回的消息的发送者是当前用户，则再判断是否还在发消息时的用户聊天窗口，是则追加，不在则不追加
                if (userInfo.id === params.myUserId) {
                    if (this.searchUserId === params.othersUserId) {
                        params.isMyselfMsg = true;
                        this.recordContent.push(params);
                        this.scroll()
                    }
                } else {
                    this.$refs.chaTone.play();
                    //判断接收方的聊天框是在发送者的聊天框中
                    if (this.searchUserId === params.myUserId) {
                        params.isMyselfMsg = false;
                        params.othersUserId = params.myUserId;
                        this.recordContent.push(params);
                        this.scroll()
                    }
                }
                window.dispatchEvent(new CustomEvent('MessageUpdates', {
                    detail: {
                        data: params
                    }
                }))
            },
            groupChatMessage(event) {
                if (this.isSingleChat || this.searchUserId !== event.detail.data.message.groupChatId) {
                    this.$refs.chatGroupTone.play()
                    return
                }
                this.recordContent.push(event.detail.data.message);
                this.scroll();
            },
            delFriend(friendId) {
                this.$confirm(`将联系人‘${this.friendMessage.remark}’删除 ,将同时删除与该联系人的聊天记录`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    service({
                        method: "delete",
                        url: "delete/friend",
                        params: {
                            friendId: friendId
                        }
                    }).then(res => {
                        if (res && res.code === 20000) {
                            this.poolClickView = false;
                            this.leftClickView = false;
                            window.dispatchEvent(new CustomEvent('delFriendNotice', {
                                detail: {
                                    data: friendId
                                }
                            }));
                        }
                    }).catch(() => {

                    })
                }).catch(() => {
                })
            },
            retractMessage(event) {
                var data = event.detail.data;
                if (data.flag) {
                    for (let i = 0; i < this.recordContent.length; i++) {
                        if (this.recordContent[i].id === data.message.id) {
                            this.recordContent[i].isRetract = data.message.isRetract
                            break
                        }
                    }
                    this.$notify({
                        type: "success",
                        title: "撤回聊天消息",
                        message: "消息撤回成功"
                    });
                } else {
                    this.$notify({
                        type: "error",
                        title: "撤回聊天消息",
                        message: data.message
                    });
                }
            },
            compareTime(date) {
                // 创建两个Date对象，一个用于存储提供的日期时间，一个用于存储当前时间
                const providedDate = new Date(date);
                const currentDate = new Date();
                // 检查提供的日期时间是否在当前时间的两分钟内
                const twoMinutesInMilliseconds = 2 * 60 * 1000; // 两分钟（毫秒）
                return providedDate.getTime() + twoMinutesInMilliseconds >= currentDate.getTime();
            },
            clearChatHistory(event) {
                if (this.searchUserId === event.detail.data) {
                    this.recordContent = [];
                    this.searchUserId = ""
                }
            },
            handleClose() {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        this.remarkView = false;
                        this.flag = false;
                        done();
                    })
                    .catch(_ => {
                    });
            },
            complaintsHandleClose() {
                this.$confirm('确认关闭投诉页？')
                    .then(_ => {
                        this.$refs.complaints.clearCacheAndClose()
                    })
                    .catch(_ => {
                    });
            },
            referFriendClose(){
                this.$confirm('确认关闭投诉页？')
                    .then(_ => {
                        this.$refs.referFriendChat.clearCacheAndClose()
                        this.referFriendVisible = false;
                    })
                    .catch(_ => {

                    });
            },
            complaintsFinish() {
                this.complaintsVisible = false;
            },
            connectInit() {
                if (this.searchUserId !== null && this.searchUserId !== "") {
                    var friendId = this.searchUserId;
                    this.searchUserId = "";
                    this.userChatMessages(friendId)
                }
            },
            chatTime(time) {
                const regex = /^\d{4}-\d{2}-\d{2}$/; // 验证YYYY-MM-DD格式
                if (regex.test(time)) {
                    return time;
                } else {
                    var dt = new Date(time);
                    let year = dt.getFullYear();
                    let month = (dt.getMonth() + 1).toString().padStart(2, '0');
                    let date = dt.getDate().toString().padStart(2, '0');
                    return `${year}-${month}-${date}`;
                }
            },
            scroll() {
                this.$nextTick(() => {
                    var container = this.$el.querySelector("#content>div:last-child");
                    if (container != null) {
                        container.scrollIntoView();
                    }
                });
            },
            initMessage() {
                this.recordContent = []
            }
        }, created() {

        },
        mounted() {
            document.addEventListener("click", (event) => {
                this.hideFloatWindow(event);
            });
            window.addEventListener('retractMessage', this.retractMessage);
            window.addEventListener('connectInit', this.connectInit);
            window.addEventListener('clearChatHistory', this.clearChatHistory);
            window.addEventListener('receiverMessage', this.receiverMessage);
            window.addEventListener('groupChatMessage', this.groupChatMessage);
            window.addEventListener("initMessage", this.initMessage)
        }, beforeDestroy() {
            window.removeEventListener('retractMessage', this.retractMessage);
            window.removeEventListener('connectInit', this.connectInit);
            window.removeEventListener('clearChatHistory', this.clearChatHistory);
            window.removeEventListener('receiverMessage', this.receiverMessage);
            window.removeEventListener('groupChatMessage', this.groupChatMessage);
            window.removeEventListener('initMessage', this.initMessage);
        },
    };
</script>

<style scoped>
    .chat-content {
        width: 100%;
        /*padding: 20px;*/
    }

    .word {
        display: flex;
        margin-bottom: 20px;
    }

    .word img {
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }

    .word .info {
        position: relative;
        margin-left: 10px;
        width: 90%;
        text-align: left;
    }

    .word .time {
        font-size: 12px;
        color: rgba(51, 51, 51, 0.8);
        margin: 0;
        height: 20px;
        line-height: 20px;
        margin-top: -5px;
    }

    .word .info-content {
        padding: 10px;
        border-radius: 3px;
        font-size: 14px;
        max-width: 40%;
        background: #fff;
        float: left;
        position: relative;
        word-wrap: break-word; /* 强制换行 */
        margin-top: 8px;
    }

    .word .info-content::before {
        position: absolute;
        left: -8px;
        top: 8px;
        content: '';

        border-right: 10px solid #FFF;
        border-top: 8px solid transparent;
        border-bottom: 8px solid transparent;
    }

    .word-my {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 20px;
    }

    .word-my img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }

    .word-my .info {
        width: 90%;
        margin-left: 10px;
        text-align: right;
    }

    .word-my .time {
        font-size: 12px;
        color: rgba(51, 51, 51, 0.8);
        margin: 0;
        height: 20px;
        line-height: 20px;
        margin-top: -5px;
        margin-right: 10px;
    }

    .word-my .messageHandler {
        position: absolute;
        left: -28px;
        top: 0;
        cursor: pointer;
        padding: 1px 3px 0 3px;
        border-radius: 5px;
        background-color: #e6e6e6;
        color: #797979;
        font-size: 14px;
    }

    .word-my .postcard{
        padding: 0;
    }
    .otherMessageHandler {
        position: absolute;
        right: -28px;
        top: 0;
        cursor: pointer;
        padding: 1px 3px 0 3px;
        border-radius: 5px;
        background-color: #e6e6e6;
        color: #797979;
        font-size: 14px;
    }

    .otherMessageHandler:hover {
        background-color: #d6d6d6;
    }

    .word-my .messageHandler:hover {
        background-color: #d6d6d6;
    }

    .word-my .info-content {
        max-width: 40%;
        padding: 10px;
        border-radius: 3px;
        font-size: 14px;
        position: relative;
        float: right;
        margin-right: 10px;
        word-wrap: break-word; /* 强制换行 */
        margin-top: 8px;
        background: #A3C3F6;
        min-height: 1em;
        text-align: left;
    }

    .word-my .info-content::after {
        position: absolute;
        right: -8px;
        top: 8px;
        content: '';
        border-left: 10px solid #A3C3F6;
        border-top: 8px solid transparent;
        border-bottom: 8px solid transparent;
    }

    /* 利用穿透，设置input边框隐藏 */
    /deep/ .custom-input .el-input__inner {
        border-radius: 0;
        border: 0;
        border-bottom: 1px solid #999999;
    }

    /deep/ .el-dialog__header {

    }

    /deep/ .el-dialog__wrapper {
        top: 0px;
        right: 0 !important;
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

    .man {

        color: #409EFF;
    }

    .woman {
        color: #f38098;
    }

    .float-window {
        position: absolute;
        width: 300px;
        z-index: 10;
        background-color: #fefefe;
        border: 1px solid #ccc;
        color: black;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .details {
        padding: 22px;
        display: flex;
        flex-direction: column;
    }

    .details img {
        width: 75px;
        height: 75px;
        border-radius: 5px;
    }

    .base {
        display: flex;
        flex-direction: column;
        margin-left: 10px
    }

    .base .text {
        font-size: 13px;
        color: #999999;
        margin-top: 3px;
        max-width: 150px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .pool {
        padding: 3px 2px 3px 2px;
        display: flex;
        border-radius: 4px;
        font-size: 18px;
        color: #5e5e5e;
        margin-left: auto;
    }

    .pool:hover {
        cursor: pointer;
        background-color: #e1e1e1;
    }

    .other {
        margin-top: 10px;
        padding-bottom: 15px;
        border-bottom: 1px solid #e1e1e1
    }

    .other p {
        max-width: 250px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .pool-float-window {
        position: absolute;
        z-index: 11;
        background-color: #fefefe;
        border: 1px solid #ccc;
        color: black;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .poolChick {

    }

    .pool-float-window .opear {
        font-size: 13px;
    }

    .pool-float-window .opear .detail {
        padding: 5px 30px 5px 30px;
        text-align: left;
        cursor: pointer;
    }

    .pool-float-window .opear .detail:hover {
        background-color: #dddddd;
    }

    /deep/ .my-dialog .el-dialog__wrapper {
        width: 300px !important;
    }

    .form span {
        color: #999999;
    }

    /deep/ .form .el-form-item__label {
        line-height: 0
    }

    /deep/ .el-dialog--center .el-dialog__body {
        padding: 25px 25px 0;
    }

    /deep/ .info-content img {
        width: 160px;
    }
</style>
