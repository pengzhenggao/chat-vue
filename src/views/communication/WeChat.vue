<template>
    <div class="WeChat">
        <el-container style="height: 100%; border: 1px solid #eee">
            <div class="toolbar">
                <div @click="switchTool(1)" :class="{'toolFocus':select===1,'tool':select!==1}"
                     style="margin-top: 70px">
                    <span class="el-icon-chat-line-square"></span></div>
                <div @click="switchTool(2)" :class="{'toolFocus':select===2,'tool':select!==2}"
                     style="margin-top: 30px">
                    <span class="el-icon-user"></span>
                </div>
                <div @click="dynamic()" class="tool" style="margin-top: 30px">
                    <span class="el-icon-help"></span>
                </div>
            </div>
            <el-aside class="sidebar" style="background-color: #f5f7fa;border-right: 1px solid #e7e7e7">
                <el-header height="60px" :style="{ backgroundColor: '#ffffff' ,borderBottom: '1px solid #e2e2e2', position: 'relative',
                    }">
                    <div class="header-R">
                        <el-input
                                ref="input"
                                prefix-icon="el-icon-search"
                                class="custom-input "
                                style="width: 85%;"
                                v-model="keyword"
                                placeholder="搜索" size="mini"
                                :disabled="select===2"
                                @input="remoteSearch"
                                @focus="focusInit"
                                @blur="isLoseFocus">
                            <span @click.prevent="cancelFocus" v-if="clearFlag" slot="suffix" class="clear">
                                <i class="el-icon-close"></i>
                            </span>
                        </el-input>
                        <el-dropdown placement="bottom-start" trigger="click" @command="handleCommand">
                            <el-button><span style="font-weight: bold" class="el-icon-setting"></span></el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="addFriend" icon="el-icon-s-custom">添加好友</el-dropdown-item>
                                <el-dropdown-item command="addGroup" icon="el-icon-s-tools">设置中心</el-dropdown-item>
                                <el-dropdown-item command="buildGroupChat" icon="el-icon-s-promotion">发起群聊
                                </el-dropdown-item>
                                <el-dropdown-item command="tagFriends" icon="el-icon-refresh">
                                    <template v-if="showSwitching==='0'">
                                        <span @click.prevent="switchShow('1')">全部展示</span>
                                    </template>
                                    <template v-if="showSwitching==='1'">
                                        <span @click.prevent="switchShow('0')">分组展示</span>
                                    </template>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </el-header>
                <!--                好友消息-->
                <AsideFriend v-show="select===1" v-if="chatFlag" @currentFriend="currentFriend"
                             @completeSearch="completeSearch" ref="asideFriend"/>
                <!--                好友详情-->
                <AsideFriendDetail ref="asideFriendDetail" v-show="select===2" v-if="friendFlag"
                                   @friendMessage="friendMessage"/>
            </el-aside>
            <el-container
                    v-show="(this.item.friendshipId && this.select===1) || (this.friendDetailId!==null && this.select===2)">
                <el-header class="my-header"
                           v-show="this.select===1"
                           style="background-color:#ffffff;border-bottom: 1px solid #e1e1e1">
                    <div style="display: flex;flex-direction: row;align-items: center;position: relative">
                        <div><span>{{item.remark}}</span>&nbsp;<span v-if="this.item.type===0">({{this.item.groupChatCount}})</span>
                        </div>
                        <div class="callFriend">
                            <transition name="el-zoom-in-top">
                                <div v-if="item.type===1 && animation"
                                     class="transition-box"
                                     style="display: flex;flex-direction: row;align-items: center">
                                    <div class="voice function" @click="operationCommand('voiceCalls')">
                                        <el-tooltip class="item" :open-delay="400" effect="light" content="语音通话"
                                                    placement="bottom">
                                            <span class="el-icon-phone-outline"></span>
                                        </el-tooltip>
                                    </div>
                                    <el-divider direction="vertical"></el-divider>
                                    <div class="video function" @click="operationCommand('videoCalls')">
                                        <el-tooltip class="item" :open-delay="400" effect="light" content="视频通话"
                                                    placement="bottom">
                                            <span class="el-icon-video-camera"></span>
                                        </el-tooltip>
                                    </div>
                                    <el-divider direction="vertical"></el-divider>
                                    <div class="prompt function" @click="operationCommand('notifyOnline')">
                                        <el-tooltip class="item" :open-delay="400" effect="light" content="通知上线"
                                                    placement="bottom">
                                            <span class="el-icon-bell"></span>
                                        </el-tooltip>
                                    </div>
                                </div>
                            </transition>
                            <div class="flexible function" @click="animation = !animation" v-if="item.type===1">
                                <el-tooltip class="item" effect="light" :content="animation?'收起':'展开'"
                                            :open-delay="400"
                                            placement="bottom">
                                    <span class="el-icon-s-fold" v-if="animation"></span>
                                    <span class="el-icon-s-unfold" v-else-if="!animation"></span>
                                </el-tooltip>
                            </div>
                            <el-tooltip :disabled="true" placement="left" effect="light" v-show="item.type===0">
                                <el-popover
                                        placement="bottom"
                                        width="300"
                                        trigger="click">
                                    <span class="bell" slot="reference"
                                          @click.prevent="getGroupMembers(item.friendshipId)"><i
                                            class="el-icon-more"></i></span>
                                    <el-scrollbar>
                                        <ChatGroupMember :total="this.total" ref="chatGroupMember"
                                                         :loadingMore="this.loadingMore" :loadFlag="this.loadFlag"
                                                         :item="this.item"/>
                                    </el-scrollbar>
                                </el-popover>
                            </el-tooltip>
                        </div>
                    </div>
                </el-header>
                <el-main>
                    <ChatBox ref="chatBox" v-show="this.select===1"/>
                    <FriendDetail ref="friendDetail" @initFriendDetailId="initFriendDetailId" @chatView="chatView"
                                  :select="select" v-show="this.select===2 && this.friendDetailId!==null"/>
                </el-main>
            </el-container>
            <!--            初始LOGO-->
            <el-container
                    v-if="(this.item.friendshipId===null && this.select===1) || (this.friendDetailId===null && this.select===2)"
                    style="display: flex;justify-content: center;align-items: center;">
                <div style="display: flex;flex-direction: row;justify-content: center;align-items: center;">
                    <WechatFriend/>
                    <div class="WeChatLOGO">
                        和语聊天系统
                    </div>
                </div>
            </el-container>
        </el-container>
        <div>
            <el-dialog
                    title="添加好友"
                    :visible.sync="precisionSearchView"
                    width="30%"
                    :before-close="clearName"
                    @open="handleOpen"
                    center>
                <div style="display: flex;flex-direction: column;justify-content: center;align-items: center">
                    <el-input placeholder="登入名/手机号/邮箱"
                              v-model="name" size="small"
                              clearable
                              style="width: 300px">
                    </el-input>
                    <PrecisionSearch :keyword="name" @precisionSearch="precisionSearch"/>
                </div>
            </el-dialog>
        </div>
        <div>
            <el-dialog
                    title="创建群聊"
                    width="500px"
                    :visible.sync="buildGroupChat"
                    :before-close="buildGroupChatClose"
                    center>
                <BuildGroupChat ref="buildGroupChat" @cancelBuildGroupChat="cancelBuildGroupChat"></BuildGroupChat>
            </el-dialog>
        </div>

        <AudioPopUps
                v-if="dialogVisibleVideo"
                :pop-width="700"
                :full-screen-icon="true"
                :btn-show="false"
                title="视频通话"
                @closePop="dialogVisibleVideo = false">
            <div>
                <VideoCalls @clearVideoTimer="clearVideoTimer" @closeVideo="closeVideo" :friendItem="this.item"
                            ref="videoCalls"/>
            </div>
        </AudioPopUps>
        <AudioPopUps
                v-if="dialogVisibleVoice"
                :pop-width="700"
                :full-screen-icon="false"
                :btn-show="false"
                title="语音通话"
                @closePop="dialogVisibleVoice = false">
            <div>
                <VoiceCalls @clearVoiceTimer="clearVoiceTimer" @closeVoice="closeVoice" :friendItem="this.item"
                            ref="voiceCalls"/>
            </div>
        </AudioPopUps>
        <!--        朋友动态-->
        <DynamicPopUps
                v-model="dialogVisibleDynamic"
                width="500"
                :showConfimButton="false"
                :showCancelButton="false"
                cancelType="primary"
                title="好友动态"
        >
            <FriendDynamic v-if="dialogVisibleDynamic" @closeDynamic="closeDynamic"></FriendDynamic>
        </DynamicPopUps>

        <!--        发表动态-->
        <PostNewsPopUps
                v-model="postNewsShow"
                v-if="postNewsShow"
                @openDynamic="openDynamic"
                width="400"
                :confimText="'发表'"
                :showConfimButton="true"
                :showCancelButton="true">
        </PostNewsPopUps>
        <!--        某个动态视图-->
        <DynamicView
                v-model="dynamicViewShow"
                v-if="dynamicViewShow"
                @openDynamic="openDynamic"
                ref="dynamicView"
                width="750"
                :confimText="'返回'"
                :showConfimButton="true"
                :showCancelButton="true">

        </DynamicView>
    </div>
</template>

<script>
    import Flag from "@/assets/icon/flag.svg"
    import AsideFriendDetail from "../../components/Wechat/AsideFriendDetail";
    import FriendDetail from "../../components/Wechat/FriendDetail";
    import WechatFriend from "@/assets/icon/wechat-friend.svg"
    import AudioPopUps from "../../components/PopUps/AudioPopUps.vue";
    import DynamicPopUps from "../../components/PopUps/DynamicPopUps";
    import PostNewsPopUps from "../../components/PopUps/PostNewsPopUps";
    import DynamicView from "../../components/PopUps/DynamicView";
    import AsideFriend from "../../components/Wechat/AsideFriend";
    import ChatBox from "../../components/ChatBox";
    import addFriend from "@/assets/icon/add-friend.svg"
    import zhuming from "@/assets/icon/zhuming.svg"
    import PrecisionSearch from "../../components/Wechat/PrecisionSearch";
    import BuildGroupChat from "../../components/Wechat/BuildGroupChat";
    import service from "../../http";
    import ChatGroupMember from "../../components/Wechat/ChatGroupMember";
    import VideoCalls from "../../components/Wechat/VideoCalls";
    import VoiceCalls from "../../components/Wechat/VoiceCalls";
    import FriendDynamic from "../../components/Sidebar/FriendDynamic";
    import {socket} from "../../config/websocket/socket";
    import {getToken} from "../../utils/auth";

    export default {
        components: {
            addFriend,
            ChatBox,
            AsideFriend,
            zhuming,
            PrecisionSearch,
            BuildGroupChat,
            ChatGroupMember,
            AudioPopUps,
            DynamicPopUps,
            PostNewsPopUps,
            DynamicView,
            VideoCalls,
            VoiceCalls,
            FriendDynamic,
            WechatFriend,
            Flag,
            AsideFriendDetail,
            FriendDetail
        },
        data() {
            return {
                animation: true,
                chatFlag: true,
                friendFlag: true,
                videoCountdownTimer: null,
                voiceCountdownTimer: null,
                dialogVisibleVoice: false,
                dialogVisibleVideo: false,
                dialogVisibleDynamic: false,
                dynamicViewShow: false,
                postNewsShow: false,
                showSwitching: '0',
                name: null,
                buildGroupChat: false,
                precisionSearchView: false,
                item: {
                    friendshipId: null,
                    remark: null,
                },
                clearFlag: false,
                keyword: "",
                loadingMore: false,
                loadFlag: true,
                total: 0,
                friendDetailId: null,
                groupMemberList: [],
                select: 1,
                sendMessage: {
                    action: 0,
                    token: getToken(),
                    receiverId: "",
                    content: "",
                    extend: 1,
                },
            }
        }, methods: {
            closeDynamic(event,friendFeedId) {
                this.dialogVisibleDynamic = false;
                if (event === 'postNewsShow') {
                    this.$nextTick(() => {
                        this.postNewsShow = true
                    })
                } else if (event === 'dynamicView') {
                    this.dynamicViewShow = true;
                    this.$nextTick(() => {
                        this.$refs.dynamicView.dynamic(friendFeedId)
                    })
                }

            },
            handleOpen() {
                this.name = null;
                this.completeSearch()
            },
            clearName(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        this.precisionSearchView = false;
                        this.name = null;
                        done();
                    }).catch(_ => {
                });
            },
            buildGroupChatClose(done) {
                this.$confirm('确认关闭创建群聊窗口吗？')
                    .then(_ => {
                        this.buildGroupChat = false;
                        this.$refs.buildGroupChat.initData()
                        done();
                    })
                    .catch(_ => {

                    });
            },
            getGroupMembers(groupId) {
                this.$refs.chatGroupMember.getGroupMembers(groupId)
            },
            cancelBuildGroupChat() {
                this.buildGroupChat = false;
            },
            currentFriend(event) {
                this.item = event;
                if (this.item.type === 0) {
                    this.$refs.chatGroupMember.getIsGroupLeader(this.item.friendshipId);
                    this.$refs.chatGroupMember.groupChatMessageList(this.item.friendshipId)
                }
                this.$refs.chatBox.chatBox(this.item);
            },
            friendMessage(event) {
                if (event.type === 1) {
                    this.friendDetailId = event.friendId;
                    this.$refs.friendDetail.friendMessageItem(this.friendDetailId)
                } else if (event.type === 0) {
                    this.select = 1;
                    this.friendDetailId = null;
                    // this.chatFlag = false;

                    this.$store.commit('updateToolbarSelectState', this.select);
                    // this.$nextTick(()=>{
                    //     this.chatFlag = true
                    // });
                    this.$refs.asideFriend.getChat(event)

                }

            },
            completeSearch() {
                this.cancelFocus()
            },
            isLoseFocus() {
                if (this.clearFlag) {
                    this.$refs.input.focus();
                    return
                }
                this.$refs.input.clear();
                this.$refs.asideFriend.isSearchStatus(this.clearFlag);
            },
            cancelFocus() {
                this.clearFlag = false;
                this.$refs.input.blur()
            },
            focusInit() {

                this.clearFlag = true;
                this.$refs.asideFriend.isSearchStatus(this.clearFlag);
                this.$refs.asideFriend.remoteSearchFriend(this.keyword)
            },
            remoteSearch() {
                this.$refs.asideFriend.remoteSearchFriend(this.keyword)
            },
            handleCommand(command) {
                switch (command) {
                    case "addFriend":
                        this.precisionSearchView = true;
                        break;
                    case "addGroup":
                        this.$router.replace({
                            path: "/informationall",
                            query: {
                                activeName: "group"
                            }
                        });
                        break;
                    case "buildGroupChat":
                        this.buildGroupChat = true;
                        break
                }

            },
            closeVideo(message) {
                this.clearVideoTimer();
                this.dialogVisibleVideo = false;
                this.$notify({
                    title: "视频通话",
                    type: "warning",
                    message: message
                });
            },
            clearVideoTimer() {
                if (this.videoCountdownTimer !== null) {
                    clearTimeout(this.videoCountdownTimer);
                    this.videoCountdownTimer = null;
                }
            },
            closeVoice(message) {
                this.clearVoiceTimer();
                this.dialogVisibleVoice = false;
                this.$notify({
                    title: "语音通话",
                    type: "warning",
                    message: message
                });
            },
            clearVoiceTimer() {
                if (this.voiceCountdownTimer !== null) {
                    clearTimeout(this.voiceCountdownTimer);
                    this.voiceCountdownTimer = null;
                }
            },
            operationCommand(command) {
                switch (command) {
                    case "notifyOnline":
                        this.notifyFriend(this.item.friendshipId);
                        break;
                    case "videoCalls":  //视屏通话
                        const videoLoading = this.$loading({
                            lock: true,
                            text: '建立通信中',
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        });
                        setTimeout(() => {
                            videoLoading.close();
                            service({
                                method: "get",
                                url: "users/userInfo/userOnlineStatus",
                                params: {
                                    userInfo: this.item.friendshipId
                                }
                            }).then(res => {
                                if (res && res.code === 20000) {
                                    if (res.data === true) {
                                        this.sendMessage.action = 10007;
                                        this.sendMessage.receiverId = this.item.friendshipId;
                                        socket.send(this.sendMessage);
                                        this.dialogVisibleVideo = true;
                                        var _this = this;
                                        _this.videoCountdownTimer = setTimeout(function () {
                                            _this.$refs.videoCalls.closeVideo(_this.sendMessage.receiverId)
                                        }, 10 * 1000)
                                    } else {
                                        this.$notify({
                                            title: "视屏通话",
                                            type: "warning",
                                            message: "对方不在线，无法进行视频通话"
                                        })
                                    }
                                }
                            });

                        }, 2000);
                        break;
                    case "voiceCalls":   //语音通话
                        const voiceLoading = this.$loading({
                            lock: true,
                            text: '建立通信中',
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        });
                        setTimeout(() => {
                            voiceLoading.close();
                            service({
                                method: "get",
                                url: "users/userInfo/userOnlineStatus",
                                params: {
                                    userInfo: this.item.friendshipId
                                }
                            }).then(res => {
                                if (res && res.code === 20000) {
                                    if (res.data === true) {
                                        this.sendMessage.action = 10008;
                                        this.sendMessage.receiverId = this.item.friendshipId;
                                        socket.send(this.sendMessage);
                                        this.dialogVisibleVoice = true;
                                        var _this = this;
                                        _this.voiceCountdownTimer = setTimeout(function () {
                                            _this.$refs.voiceCalls.closeVoice(_this.sendMessage.receiverId)
                                        }, 10 * 1000)
                                    } else {
                                        this.$notify({
                                            title: "语音通话",
                                            type: "warning",
                                            message: "对方不在线，无法进行语音通话"
                                        })
                                    }
                                }
                            });

                        }, 2000);
                        break
                }
            },
            notifyFriend(friendId) {
                const params = {
                    friendId: friendId,
                    content: ""
                };
                service.post("users/notify/friend/online", params).then(res => {
                    if (res.code === 20000) {
                        this.$notify({
                            type: "success",
                            title: "邀请好友上线",
                            message: "发送成功"
                        })
                    } else {
                        this.$notify({
                            type: "error",
                            title: "邀请好友上线",
                            message: res.message
                        })
                    }
                })
            },
            switchShow(showSwitching) {
                this.select = 1;
                this.showSwitching = showSwitching;
                localStorage.setItem("showSwitching", showSwitching);
                this.$refs.asideFriend.getFriendshipsMenu(showSwitching)
            },
            precisionSearch(searchResult) {
                this.precisionSearchView = false;
                this.$refs.asideFriend.clickAddSession(searchResult);
            },
            initFriendshipId() {
                if (this.select === 1) {
                    this.friendFlag = false;
                    this.$nextTick(() => {
                        this.friendFlag = true;
                    })
                    this.item.friendshipId = null
                } else {
                    this.chatFlag = false;
                    this.$nextTick(() => {
                        this.chatFlag = true;
                    })
                    this.friendDetailId = null;
                }

            },
            initFriendDetailId() {
                this.friendDetailId = null;
            },
            chatView(friendItem) {
                this.select = 1;
                this.$refs.asideFriend.getChat(friendItem)
            },
            switchTool(type) {
                this.select = type;
                this.$store.commit('updateToolbarSelectState', this.select);
                this.cancelFocus()
            },
            openDynamic() {
                this.postNewsShow = false;
                this.dynamicViewShow = false;
                this.$nextTick(() => {
                    this.dialogVisibleDynamic = true
                })

            },
            dynamic() {
                this.dialogVisibleDynamic = true
            },
            chatTime(time) {
                const regex = /^\d{4}-\d{2}-\d{2}$/; // 验证YYYY-MM-DD格式
                if (regex.test(time)) {
                    return time;
                } else {
                    var date = new Date(time.toString());
                    var now = new Date(); // 获取当前时间
                    var diff = now - date; // 计算时间差（毫秒）
                    if (diff > 24 * 60 * 60 * 1000) { // 如果时间差大于一天（毫秒）
                        return date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0'); // 返回年月日格式
                    } else {
                        return date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0')// 返回时分秒格式
                    }
                }
            },
            videoCallsResponse(event) {
                if (this.select === 1) {
                    this.dialogVisibleVideo = true;
                    var _this = this
                    _this.$nextTick(() => {
                        _this.$refs.videoCalls.VCResponse(event.detail.data);
                    })
                }


            },
            voiceCallsResponse(event) {
                if (this.select === 1) {
                    this.dialogVisibleVoice = true;
                    var _this = this;
                    _this.$nextTick(() => {
                        _this.$refs.voiceCalls.voiceResponse(event.detail.data);
                    })
                }

            },
            initContainer() {
                this.item = {
                    friendshipId: null,
                    remark: null,
                }
            }
        }, created() {
            this.select = this.$store.getters.toolbarSelect
        },
        mounted() {
            if (localStorage.getItem("showSwitching") !== null) {
                this.showSwitching = localStorage.getItem("showSwitching")
            }
            window.addEventListener('initFriendshipId', this.initFriendshipId);
            window.addEventListener("initContainer", this.initContainer);
            window.addEventListener("videoCallsResponse", this.videoCallsResponse);
            window.addEventListener("voiceCallsResponse", this.voiceCallsResponse);
            if (this.$route.query.friendId && this.$route.query.remark) {

                const params = {
                    friendId: this.$route.query.friendId,
                    remark: this.$route.query.remark,
                    userInfoId: this.$route.query.userInfoId
                };
                this.select = 1
                this.$refs.asideFriend.clickAddSession(params)
            }
        }
    }
</script>

<style scoped>
    .WeChat {

        width: 100%;
        height: 100%;
        overflow: hidden;
        box-sizing: border-box;
        /* padding: 5px; */
    }

    .WeChat-left {
        width: 240px;
        height: 100%;
        background-image: linear-gradient(#3DBCFD, #97DBFE, #30D791);
    }

    .my-header {
        box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
    }

    /deep/ .el-card__body, .el-main {
        padding-top: 5px !important;
    }

    .el-header {
        background-color: #f5f5f5;
        color: #333;
        height: 50px !important;
        line-height: 50px;
    }

    .sidebar {
        overflow: hidden; /* 隐藏滚动条 */
    }


    /deep/ .el-aside {
        color: #e4e4e4;
    }

    /deep/ .el-card__body {
        padding: 0 !important;
    }

    .header-R {
        line-height: 50px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center
    }

    /deep/ .header-R .el-button {
        margin-left: 10px;
        padding: 5px 5px;
        background-color: #f3f3f3;
    }

    /deep/ .header-R .el-input__inner {
        background-color: #f3f3f3;

    }

    /deep/ .header-R .el-input__inner:focus {
        border-color: #f3f3f3;
    }

    .clear {
        background-color: #d1d1d1;
        cursor: pointer;
        color: #999999;
        font-weight: bold;
        border-radius: 50%;
        padding: 1px
    }

    .clear :hover {
        color: #7e7e7e;
    }

    .function-content {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
    }

    .function-icon {

        cursor: pointer;
        width: 40px;
        height: 40px;
    }

    .function-icon:hover {
        transition: 0.5s;
        transform: scale(1.1);
    }

    .operation {
        margin-left: auto;
        font-size: 22px;
    }

    .operation:hover {
        cursor: pointer;
        color: #999999;
    }

    .callFriend {
        display: flex;
        margin-left: auto;

    }

    .callFriend .bell {
        font-size: 18px;
        cursor: pointer;
    }

    .callFriend .bell:hover {
        color: #1AB8B8;
    }

    /deep/ .el-popover {
        padding: 0 !important;
    }

    .WeChatLOGO {
        background-image: -webkit-linear-gradient(top, #bc8550, #d77f34, #de6912);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: 6em;
        font-weight: bold;
        height: 100%;
        color: #dadada;
        font-family: "PingFang SC", serif;
    }


    .transition-box {

        margin-bottom: 10px;
        width: 200px;
        height: 100px;
        border-radius: 4px;
        background-color: white;
        text-align: center;
        z-index: 0 !important;
        color: #fff;
        padding: 40px 20px;
        box-sizing: border-box;
        margin-right: 20px;
    }

    .toolbar {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 25px;
        min-width: 50px;

        background-color: #525252;
    }

    .toolbar .tool, .toolFocus {
        font-size: 25px;
        cursor: pointer;
    }

    .toolbar .tool {
        color: #bfbfbf;
        margin-top: 70px;
    }

    .toolbar .toolFocus {
        color: #0badf9;
    }

    .toolbar .tool:hover {
        color: #d8d8d8;
    }

    .toolbar .toolFocus:hover {
        color: #15c2ff;
    }

    .tool-operation {
        margin-top: 420px;
        cursor: pointer;
        color: #d8d8d8;
    }

    .tool-operation:hover {
        color: #fff;
    }

    .voice {
        cursor: pointer;
        font-size: 23px;
        margin: 0 15px 0 15px;
    }

    .voice:hover {
        cursor: pointer;
        transition: 0.4s;
        transform: scale(1.2);
        color: #000000;
    }

    .video {
        cursor: pointer;
        font-size: 23px;
        margin: 0 15px 0 15px;
    }

    .video:hover {
        cursor: pointer;
        transition: 0.4s;
        transform: scale(1.2);
        color: #000000;
    }

    .prompt {
        cursor: pointer;
        font-size: 23px;
        margin: 0 15px 0 15px;
    }

    .prompt:hover {
        cursor: pointer;
        transition: 0.4s;
        transform: scale(1.2);
        color: #000000;
    }

    .flexible {
        cursor: pointer;
        font-size: 23px;
        margin: 0 0 0 15px;
    }

    .transition-box {
        margin-bottom: 0;
        height: 50px;
        border-radius: 0;
        background-color: revert;
        color: #494949;
        padding: 0;
        margin-right: 0;
    }
</style>
