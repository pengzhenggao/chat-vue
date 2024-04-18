<template>
    <div class="main">
<!--        是好友，可查看-->
        <div class="container" v-show="friendMessageIsNull===false">
            <div class="upper-part">
                <el-image :src="friendMessage.avatar"
                          style="width: 80px;height: 80px;border-radius: 5px"></el-image>
                <div class="message">
                    <div style="display: flex;align-items: center">
                        <span>{{friendMessage.remark}}</span>
                        <div style="display: flex;align-items: center">
                            <span :class="{'man':friendMessage.gender===1,'woman':friendMessage.gender===0}">
                                    <i class="el-icon-s-custom"></i>
                                </span>
                            <span v-if="friendMessage.isStar===1" style="color: #ffc300;font-size: 18px"
                                  class="el-icon-star-on"></span>
                        </div>

                    </div>
                    <div class="item">
                        <div><span>昵称：</span><span>{{friendMessage.nickName}}</span></div>
                        <div><span>登入名：</span><span>{{friendMessage.username}}</span></div>
                        <div><span>地区：</span><span>{{friendMessage.address}}</span></div>
                    </div>
                </div>
                <div class="tool-icon">
                         <span @click.prevent="poolClick(friendMessage.friendId,$event)" class="el-icon-more tool"></span>
                </div>
            </div>
            <el-divider></el-divider>
            <div class="medium-part">
                <div class="item" @mouseenter="handleMouseEnter(1)" @mouseleave="handleMouseLeave(1)">
                    <span class="item-name">备注</span>
                    <p class="text-ellipsis">{{friendMessage.remark}}</p>
                    <span @click.prevent="edit" style="float: right;cursor: pointer" v-show="editShow1"><i
                            class="el-icon-edit-outline"></i></span>
                </div>
                <div class="item" @mouseenter="handleMouseEnter(2)" @mouseleave="handleMouseLeave(2)">
                    <span class="item-name">标签</span>
                    <p class="text-ellipsis">{{friendMessage.label}}</p>
                    <span @click.prevent="edit" style="float: right;cursor: pointer" v-show="editShow2"><i
                            class="el-icon-edit-outline"></i></span>
                </div>
                <div class="item" @mouseenter="handleMouseEnter(3)" @mouseleave="handleMouseLeave(3)">
                    <span class="item-name">描述</span>
                    <p class="text-ellipsis">{{friendMessage.description}}</p>
                    <span @click.prevent="edit" style="float: right;cursor: pointer" v-show="editShow3"><i
                            class="el-icon-edit-outline"></i></span>
                </div>
            </div>
            <el-divider></el-divider>
            <div class="bottom">
                <div class="item" @click="sendMsg(friendMessage)">
                    <div>
                        <span class="el-icon-chat-round"></span>
                    </div>
                    <div style="font-size: 15px" ><span>发消息</span></div>
                </div>
                <div class="item" @click="voiceChat(friendMessage.friendId)">
                    <div>
                        <span class="el-icon-phone-outline"></span>
                    </div>
                    <div style="font-size: 15px">语音通话</div>
                </div>
                <div class="item" @click="videoChat(friendMessage.friendId)">
                    <div>
                        <span class="el-icon-video-camera"></span>
                    </div>
                    <div style="font-size: 15px">视频通话</div>
                </div>
            </div>
        </div>
<!--        不是好友不可查看-->
        <div class="container" v-show="friendMessageIsNull===true">
            <div style="text-align: center">
                <hide style="width: 80px;height: 80px"/>
            </div>
            <div style="font-size: 25px;text-align: center">
              <span>对方已将您删除，请先添加对方后查看</span>
            </div>
            <div style="text-align: center;margin-top: 10px" @click="sendFriendCheck">
                <span class="add-friend">进行好友验证？</span>
            </div>
            <div style="color: #909090;font-size: 12px;margin-top: 20px;line-height: 1.5rem">
                <span> 温馨提示：</span> <br/>
                <div style="width: 470px;text-align: left">
                    <p> 1.对方与您不是好友关系，需进行好友验证成功后才能查看对方信息或与对方进行聊天。</p>
                    <p> 2.只有对方同意您的好友请求后才能成为好友关系。</p>
                </div>

            </div>
        </div>
<!--        加载过程-->
        <div class="container" v-show="friendMessageIsNull===null">
            <div v-loading="friendMessageIsNull===null"></div>
        </div>
        <div
                v-show="poolClickView"
                class="pool-float-window"
                :style="{ left: `${px}px`, top: `${py}px` }">
            <div class="poolChick">
                <div class="opear">
                    <div class="detail" @click="remarkViewChick">设置备注和标签</div>
                    <div class="detail" style="border-bottom: 1px solid #e1e1e1"
                         @click="recommend(friendMessage.friendId)">
                        <span>分享<span v-if="friendMessage.gender===1">他</span><span v-else>她</span>的名片</span>
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

        <!--  设置备注和标签-->
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
                <ReferFriend :recommendFriendId="recommendFriendId" @referFriendClose="referFriendClose"
                             ref="referFriendChat"></ReferFriend>
            </el-dialog>
        </div>

        <PopContent
                v-if="dialogVisibleVideo"
                :pop-width="700"
                :full-screen-icon="true"
                :btn-show="false"
                title="视频通话"
                @closePop="dialogVisibleVideo = false">
            <div>
                <VideoCalls v-if="dialogVisibleVideo" @clearVideoTimer="clearVideoTimer" @closeVideo="closeVideo" :friendItem="this.friendMessage" ref="videoCalls"/>
            </div>
        </PopContent>
        <PopContent
                v-if="dialogVisibleVoice"
                :pop-width="700"
                :full-screen-icon="false"
                :btn-show="false"
                title="语音通话"
                @closePop="dialogVisibleVoice = false">
            <div>
                <VoiceCalls v-if="dialogVisibleVoice" @clearVoiceTimer="clearVoiceTimer" @closeVoice="closeVoice" :friendItem="this.friendMessage" ref="voiceCalls"/>
            </div>
        </PopContent>

        <!--        请求添加好友-->
        <div>
            <el-dialog
                    width="400px"
                    :visible.sync="addFriendView"
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
                        <el-button v-if="searchResult.isFriend==0 " type="info">正在申请</el-button>
                        <el-button @click.prevent="innerVisible=false"
                                   v-else-if="searchResult.isFriend==1 || searchResult.isFriend==3"
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
        </div>
    </div>
</template>

<script>
    import Complaints from "./Complaints";
    import ReferFriend from "./ReferFriend";
    import service from "../../http";
    import {getToken} from "../../utils/auth";
    import PopContent from "../../components/PopUps/PopContent";
    import {asidefriend} from "../../listening/asidefriend";
    import VideoCalls from "../../components/Wechat/VideoCalls";
    import VoiceCalls from "../../components/Wechat/VoiceCalls";
    import {socket} from "../../config/websocket/socket";
    import PrecisionSearch from "./PrecisionSearch";
    import hide from "@/assets/icon/hide.svg"
    export default {
        name: "FriendDetail",
        components:{
            VideoCalls,
            VoiceCalls,
            Complaints,
            PopContent,
            ReferFriend,
            PrecisionSearch,
            hide
        },
        props:{
            select:{
                type:Number
            }
        },
        data() {
            return {
                searchResult:{},
                videoCountdownTimer:null,
                voiceCountdownTimer:null,
                dialogVisibleVoice:false,
                dialogVisibleVideo:false,
                poolClickView: false,
                addFriendView:false,
                px: 0,
                py: 0,
                x: 0, // 浮动窗口的X坐标
                y: 0, // 浮动窗口的Y坐标
                editShow1: false,
                editShow2: false,
                editShow3: false,
                friendMessage: {},
                friendMessageIsNull:null,
                recommendFriendId: null,
                referFriendVisible: false,
                complaintsVisible: false,
                labelOptions: [],
                form: {
                    friendId: "",
                    remark: "",
                    label: [],
                    description: ""
                },
                leftClickView: false,
                remarkView: false,
                searchUserId: "",
                endFlag: false,
                flag: false,
                sendMessage: {
                    action: 0,
                    token: getToken(),
                    receiverId: "",
                    content: "你好",
                    extend: 1,
                },
            }
        },
        created() {

        },
        mounted() {
                window.addEventListener("videoCallsResponse",this.videoCallsResponse);
                window.addEventListener("voiceCallsResponse",this.voiceCallsResponse);
            document.addEventListener("click", (event) => {
                this.hideFloatWindow(event);
            });
        },
        methods: {
            voiceChat(friendId){
                const voiceLoading = this.$loading({
                    lock: true,
                    text: '建立通信中',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                setTimeout(() => {
                    voiceLoading.close();
                    service({
                        method:"get",
                        url:"users/userInfo/userOnlineStatus",
                        params:{
                            userInfo: friendId
                        }
                    }).then(res=>{
                        if (res && res.code===20000){
                            if (res.data===true){
                                this.sendMessage.action = 10008;
                                this.sendMessage.receiverId = friendId;
                                socket.send(this.sendMessage);
                                this.dialogVisibleVoice = true;
                                var _this = this;
                                _this.voiceCountdownTimer = setTimeout(function () {
                                    _this.$refs.voiceCalls.closeVoice(_this.sendMessage.receiverId)
                                },10*1000)
                            }else{
                                this.$notify({
                                    title:"语音通话",
                                    type:"warning",
                                    message:"对方不在线，无法进行语音通话"
                                })
                            }
                        }
                    });

                }, 2000);
            },
            videoChat(friendId){
                const videoLoading = this.$loading({
                    lock: true,
                    text: '建立通信中',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                setTimeout(() => {
                    videoLoading.close();
                    service({
                        method:"get",
                        url:"users/userInfo/userOnlineStatus",
                        params:{
                            userInfo: friendId
                        }
                    }).then(res=>{
                        if (res && res.code===20000){
                            if (res.data===true){
                                this.sendMessage.action = 10007;
                                this.sendMessage.receiverId = friendId;
                                socket.send(this.sendMessage);
                                this.dialogVisibleVideo = true;
                                var _this = this;
                                _this.videoCountdownTimer = setTimeout(function () {
                                    _this.$refs.videoCalls.closeVideo(_this.sendMessage.receiverId)
                                },10*1000)
                            }else{
                                this.$notify({
                                    title:"视屏通话",
                                    type:"warning",
                                    message:"对方不在线，无法进行视频通话"
                                })
                            }
                        }
                    });

                }, 2000);
            },
            clearVoiceTimer(){
                if (this.voiceCountdownTimer!==null){
                    clearTimeout(this.voiceCountdownTimer);
                    this.voiceCountdownTimer = null;
                }
            },
            clearVideoTimer(){
                if (this.videoCountdownTimer!==null){
                    clearTimeout(this.videoCountdownTimer);
                    this.videoCountdownTimer = null;
                }
            },
            closeVideo(message){
                this.clearVideoTimer();
                this.dialogVisibleVideo = false;
                this.$notify({
                    title:"视频通话",
                    type:"warning",
                    message: message
                });
            },
            closeVoice(message){
                this.clearVoiceTimer();
                if (this.dialogVisibleVoice===true){
                    this.dialogVisibleVoice = false;
                    this.$notify({
                        title:"语音通话",
                        type:"warning",
                        message: message || "语音通话中断"
                    });
                }

            },
            videoCallsResponse(event){
                if (this.select === 2){
                    this.dialogVisibleVideo = true;
                    var _this = this;
                    _this.$nextTick(()=>{
                        _this.$refs.videoCalls.VCResponse(event.detail.data);
                    })
                }

            },
            voiceCallsResponse(event){
                if (this.select === 2){
                    this.dialogVisibleVoice = true;
                    var _this = this;
                    _this.$nextTick(()=>{
                        _this.$refs.voiceCalls.voiceResponse(event.detail.data);
                    })
                }

            },
            friendMessageItem(friendId) {
                this.friendMessageIsNull = null;
                this.searchUserId = friendId;
                this.friendMessage = {};
                service({
                    method: "get",
                    url: "/users/getFriendById",
                    params: {
                        friendId: friendId
                    }
                }).then(res => {
                    this.friendMessage = res.data;
                    this.friendMessageIsNull = false
                }).catch(()=>{
                    this.friendMessageIsNull = true
                })
            },
            sendMsg(friendItem){
                this.$emit('chatView',friendItem)
            },
            handleMouseEnter(position) {
                switch (position) {
                    case 1:
                        this.editShow1 = true;
                        break;
                    case 2:
                        this.editShow2 = true;
                        break;
                    case 3:
                        this.editShow3 = true
                }
            },
            handleMouseLeave(position) {
                switch (position) {
                    case 1:
                        this.editShow1 = false;
                        break;
                    case 2:
                        this.editShow2 = false;
                        break;
                    case 3:
                        this.editShow3 = false
                }
            },
            remarkViewChick() {
                service({
                    method: "get",
                    url: "users/getUserLabelList"
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
            edit(){
                service({
                    method: "get",
                    url: "users/getUserLabelList"
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
                this.remarkView = true
            },
            poolClick(friendId, event) {
                if (event.button === 0) {
                    this.poolClickView = true;
                    this.px = event.clientX; // 更新X坐标
                    this.py = event.clientY; // 更新Y坐标
                }
            },
            recommend(friendMessage) {
                this.recommendFriendId = Number(friendMessage);
                this.poolClickView = false;
                this.leftClickView = false;
                this.referFriendVisible = true;
                this.$nextTick(() => {
                    this.$refs.referFriendChat.init()
                })
            },
            //设置星标
            setFriendStar(isStar) {
                service({
                    method: "put",
                    url: "users/updateStar",
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
                        url: `users/addBlacklist/${friendId}`
                    }).then(res => {
                        if (res.code === 20000) {
                            this.flag = false;
                            this.poolClickView = false;
                            this.leftClickView = false;
                            this.$emit('initFriendDetailId');
                            window.dispatchEvent(new CustomEvent('delFriendNotice', {
                                detail: {
                                    data: friendId
                                }
                            }));
                            this.$notify({
                                title:"加入黑名单",
                                type:"success",
                                message:"已加入黑名单"
                            });
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
            delFriend(friendId) {
                this.$confirm(`将联系人‘${this.friendMessage.remark}’删除 ,将同时删除与该联系人的聊天记录`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    service({
                        method: "delete",
                        url: "users/delete/friend",
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
            sendFriendCheck() {
                const loading = this.$loading({
                    lock: true,
                    text: '加载中',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.1)'
                });
                service({
                    method: "get",
                    url: `users/getUserById/${this.searchUserId}`,
                }).then(res => {
                    loading.close();
                    if (res.data && res.data.userInfoId !== null) {
                        this.addFriendView = true;
                        this.searchResult = res.data
                    } else {
                        this.$notify({
                            title: "查找用户",
                            type: "error",
                            message: "找不到该用户"
                        });
                    }
                }).catch(() => {
                    loading.close();
                })
            },
            addFriend(friendId) {
                this.sendMessage.receiverId = friendId;
                this.sendMessage.action = 10004;
                socket.send(this.sendMessage);
                this.$notify({
                    type: "success",
                    title: "添加好友",
                    message: "已申请添加"
                });
                this.addFriendView = false
            },
            cancelConfirmUpdate() {
                this.remarkView = false;
                this.flag = false;
            },
            confirmUpdate() {
                if (this.form.label.length <= 0 || this.form.label === '') {
                    this.form.label = []
                }
                service({
                    method: "post",
                    url: "users/updateFriendDetail",
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
            referFriendClose() {
                this.$refs.referFriendChat.clearCacheAndClose();
                this.referFriendVisible = false;
            },
            complaintsFinish() {
                this.complaintsVisible = false;
            },
            complaintsHandleClose() {
                this.$confirm('确认关闭投诉页？')
                    .then(_ => {
                        this.$refs.complaints.clearCacheAndClose()
                    })
                    .catch(_ => {
                    });
            },
        }
    }
</script>

<style scoped>
    .main {
        width: 100%;
        display: flex;
        justify-content: center;

    }

    .container {
        margin-top: 100px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-bottom: 150px;
    }

    .upper-part {
        padding: 20px 20px 0 20px;
        width: 360px;
        display: flex;
        flex-direction: row;
    }

    .message {
        line-height: 1.3em;
        margin-left: 15px;
    }

    .upper-part .item {
        font-size: 13px;
        color: #999999;
    }

    .man {
        margin-left: 3px;
        color: #409EFF;
    }

    .woman {
        margin-left: 3px;
        color: #f38098;
    }

    .tool-icon {
        margin-left: auto;
        color: #999999;

    }

    .tool-icon .tool {
        padding: 0 2px 0 2px;
    }

    .tool-icon .tool:hover {
        border-radius: 3px;
        background-color: #e1e1e1;
        cursor: pointer;
    }

    .medium-part {
        padding: 0 20px 0 20px;
        width: 360px;
        display: flex;
        flex-direction: column;
        line-height: 2em;
    }

    .medium-part .item {
        display: flex;
        flex-direction: row;
        font-size: 14px;
        color: #999999;
    }

    .medium-part .item .item-name {
        cursor: default;
        margin-right: 2.5rem;
    }

    .bottom {
        padding: 0 20px 0 20px;
        width: 360px;
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .bottom .item {
        margin: 0 3px 0 3px;
        cursor: pointer;
        padding: 8px 13px 8px 13px;
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #8d8d8d;
        font-size: 1.5em;
    }

    .bottom .item:hover {
        background-color: #e3e3e3;
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
    .text-ellipsis{
        width: 250px;
        overflow:hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        -o-text-overflow:ellipsis;
    }


    .add-friend {
        color: #409EFF;
        font-size: 13px;
        cursor: pointer;
    }
    .add-friend:hover{
        color: #3479ce;

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

    /* 利用穿透，设置input边框隐藏 */
    /deep/ .custom-input .el-input__inner {
        border-radius: 0;
        border: 0;
        border-bottom: 1px solid #999999;
    }
</style>
