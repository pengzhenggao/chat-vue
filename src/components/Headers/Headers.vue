<template>
    <div class="headers">
        <div class="headers-left">
            <router-link to="/wechat">
                <img src="@/assets/image/logo.png" style="width: 20px;margin-right: 5px">
            </router-link>
            <Breadcrumb/>
        </div>
        <div class="headers-middle" v-if="this.$store.getters.systemAnnouncements">
            <Notice ref="notice" v-if="this.noticeData.length>0 && refresh===true" :noticeData="noticeData"/>
        </div>
        <div class="headers-right">
            <div class="headers-right-left">
                <el-tooltip class="item" effect="dark" content="反馈及建议" style="margin-right: 22px" placement="bottom">
                    <!-- <i :class="isFullscreen ? 'el-icon-full-screen head-screen-news' : 'el-icon-rank head-screen'" @click="buttoncli"></i> -->
                    <feedback class="headers-right-left-screenIcon" @click="feedback"></feedback>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="isFullscreen ? '取消全屏' : '全屏'" placement="bottom">
                    <!-- <i :class="isFullscreen ? 'el-icon-full-screen head-screen-news' : 'el-icon-rank head-screen'" @click="buttoncli"></i> -->
                    <reduction v-if="isFullscreen" class="headers-right-left-screenIcon" @click="buttoncli"/>
                    <screen v-else class="headers-right-left-screenIcon" @click="buttoncli"/>
                </el-tooltip>

                <el-tooltip class="item" style="margin: 0 20px 0 10px; color: #171700" effect="dark" content="主题"
                            placement="bottom">
                    <i class="el-icon-picture-outline-round" @click="theme = true"></i>
                </el-tooltip>
                <el-badge is-dot class="item" style="margin: 0 20px 0 0; color: #171700">
                    <i class="el-icon-message" @mouseover.self="dropShowBtn"
                       @mouseout.self="dropHideBtn"></i>
                </el-badge>
                <el-badge v-if="friendCount !== 0 && friendCount !== null" :value="friendCount" :max="10"
                          class="item">
                    <i class="el-icon-user" @mouseover="friendDropShowBtn"
                       @mouseout.self="friendDropHideBtn"></i>
                </el-badge>
                <div v-else><i class="el-icon-user" @mouseover="friendDropShowBtn"
                               @mouseout.self="friendDropHideBtn"></i></div>
                <div class="header-right-friendDropdown" @mouseover="friendDropShowBtn"
                     @mouseout="friendDropShow = false">
                    <el-collapse-transition>
                        <Friends  ref="friendsRef" @reduceRequests="reduceRequests" v-show="friendDropShow"/>
                    </el-collapse-transition>
                </div>
                <!-- </el-tooltip> -->
                <!-- 通知栏 -->
                <div class="header-right-dropdown" @mouseover="dropdownBtn" @mouseout="dropShow = false">
                    <el-collapse-transition>
                        <Dropdowns v-show="dropShow"/>
                    </el-collapse-transition>
                </div>
            </div>
            <div class="headers-right-right">
                <div class="block">
                    <el-dropdown @command="handle">
                        <span class="el-dropdown-link">
                    <el-badge is-dot :class="{ 'custom-badge-online': isOnline, 'custom-badge-off': !isOnline }">
                        <el-avatar style="display: block" shape="square" size="large"
                                   :src="$store.getters.userLogin.avatar"></el-avatar>
                    </el-badge>
                        </span>
                        <el-dropdown-menu slot="dropdown" placement="bottom">
                            <el-dropdown-item command="online">
                                <div style="display: flex;flex-direction: row;align-items: center">
                                    <div style="height: 10px;width: 10px;background-color: #3BB54A;border-radius: 50%"></div>
                                    <div style="margin-left: 10px"><span>我在线上</span></div>
                                </div>
                            </el-dropdown-item>
                            <el-dropdown-item command="offline">
                                <div style="display: flex;flex-direction: row;align-items: center">
                                    <div style="height: 10px;width: 10px;background-color: #595959;border-radius: 50%"></div>
                                    <div style="margin-left: 10px"><span>离线</span></div>
                                </div>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <el-dropdown size="medium" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{$store.getters.userLogin.nickName}}<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="person" icon="el-icon-user-solid">个人中心</el-dropdown-item>
                        <el-dropdown-item command="system" divided icon=" el-icon-s-tools">系统设置</el-dropdown-item>
                        <el-dropdown-item command="updatePassword" icon="el-icon-edit">修改密码</el-dropdown-item>
                        <el-dropdown-item divided command="quit" icon="el-icon-delete-solid">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <el-drawer
                :with-header="false"
                :visible.sync="theme"
                direction="rtl"
                size='400px'
                class="theme"
        >
            <div class="theme-title">配色方案</div>
            <div class="theme-title-box">
                <div class="theme-title-box-list" v-for="(item,index) in themeColor" :key="index"
                     @click="targetThemeIndex(index)" :class="themeIndex === index ? 'theme-active' : ''">
                    <div class="theme-title-box-list-left" :style="item.aside"></div>
                    <div class="theme-title-box-list-right">
                        <div class="theme-title-box-list-right-top" :style="item.header"></div>
                        <div class="theme-title-box-list-right-bottom" :style="item.container"></div>
                    </div>
                </div>
            </div>
        </el-drawer>
        <el-dialog
                @open="initData"
                title="问题反馈及建议"
                :visible.sync="feedbackShow"
                width="40%"
                :before-close="handleClose"
                center>
            <div style="height: 380px;">
                <el-scrollbar style="height: 100%" wrap-style="overflow-x:hidden;">
                    <FeedBackView @closeFeedback="closeFeedback" ref="feedBackView"/>
                </el-scrollbar>

            </div>
        </el-dialog>
        <el-dialog
                title="修改密码"
                :visible.sync="updatePasswordView"
                :before-close="updatePasswordClose"
                width="30%"
                center>
            <el-form ref="updatePasswordForm" :rules="rules" :model="updatePasswordForm" label-width="80px">
                <el-form-item label="原密码" prop="oldPassword">
                    <el-input size="small" v-model="updatePasswordForm.oldPassword"
                              placeholder="输入原密码"
                              prefix-icon="el-icon-key"
                              style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                    <el-input type="password" show-password
                              prefix-icon="el-icon-lock"
                              placeholder="输入新密码"
                              v-model="updatePasswordForm.newPassword"
                              size="small" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input type="password" show-password
                              prefix-icon="el-icon-lock"
                              placeholder="再次输入新密码"
                              v-model="updatePasswordForm.confirmPassword"
                              size="small" style="width: 250px"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="updatePasswordClose">取 消</el-button>
    <el-button type="primary" @click="update('updatePasswordForm')">确 定</el-button>
  </span>
        </el-dialog>
        <el-drawer
                title="系统设置"
                :visible.sync="systemSetting"
                direction="rtl"
                :before-close="systemSettingHandleClose">
        <SystemSetting></SystemSetting>
        </el-drawer>
    </div>
</template>


<script>
    // 全屏组件
    import screenfull from 'screenfull'
    // 面包屑
    import Breadcrumb from '../Breadcrumb/Breadcrumb2'

    // 通知栏组件
    import Dropdowns from '../Dropdown/index'

    import Friends from '../Friend/index'

    import github2 from '../../assets/icon/github2.svg' //github
    import screen from '../../assets/icon/screen.svg'  //全屏
    import reduction from '../../assets/icon/reduction.svg'
    import feedback from '../../assets/icon/feedback.svg';
    import FeedBackView from "./FeedBackView";
    import service from "../../http"; //还原
    import {socket} from "../../config/websocket/socket"
    import Notice from "../Notice";
    import SystemSetting from "./Components/SystemSetting";
    export default {
        props: {
            switchMode: {
                type: Boolean,
                default: true
            },
            themeColor: {
                type: Array,
                default: true
            },
            themeIndex: {
                type: Number,
                default: true
            }
        },

        data() {
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.updatePasswordForm.confirmPassword !== '') {
                        this.$refs.updatePasswordForm.validateField('confirmPassword');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.updatePasswordForm.newPassword) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                updatePasswordForm: {
                    oldPassword: null,
                    newPassword: null,
                    confirmPassword: null
                },
                systemSetting:false,
                refresh: true,
                noticeData: [],
                feedbackShow: false,
                updatePasswordView: false,
                isOnline: true,
                squareUrl: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
                isFullscreen: false,
                dropShow: false, // 是否现实通知栏
                friendDropShow: false, //好友申请框
                setTime: null, //定时器
                friendSetTime: null,
                theme: false, // 主题 开关
                friendCount: 0,
                rules: {
                    oldPassword: [{type: 'string', required: true, message: "旧密码不能为空", trigger: 'blur'}],
                    newPassword: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    confirmPassword: [
                        { validator: validatePass2, trigger: 'blur' }
                    ],
                }
            }
        },
        components: {
            Notice,
            Breadcrumb,
            Dropdowns,
            Friends,
            github2,
            screen,
            reduction,
            feedback,
            FeedBackView,
            SystemSetting
        },
        methods: {
            initData() {
                this.$nextTick(() => {
                    this.$refs.feedBackView.initFeedBackData()
                })
            },
            closeFeedback() {
                this.$nextTick(() => {
                    this.feedbackShow = false
                })
            },
            updatePasswordClose() {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        this.$refs.updatePasswordForm.resetFields();
                        this.updatePasswordView = false
                    })
                    .catch(_ => {
                    });

            },
            handle(command) {
                switch (command) {
                    case 'online':
                        socket.init();
                        break;
                    case 'offline':
                        if (socket.websock !== null) {
                            this.$confirm('离线后将无法实时接收到任何信息?', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                socket.close();
                            }).catch(() => {
                            });
                        }

                        break;
                }
            },
            friendApplicationCount() {
                service.get("users/get/applyFriendCount").then(res => {
                    this.friendCount = res.data
                })
            },
            targetIcon() {
            },
            // 全屏
            buttoncli() {
                screenfull.toggle();
                this.checkFull()
            },

            // 监控屏幕变化
            checkFull() {
                var isFull = document.fullscreenEnabled || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
                // to fix : false || undefined == undefined
                // 是否全屏判断
                this.isFullscreen = !this.isFullscreen;
                if (isFull === undefined) {
                    isFull = false;
                }
                return isFull;
            },
            // 用户名 下拉菜单
            handleCommand(command) {
                switch (command) {
                    case 'updatePassword':
                        this.updatePasswordView = true
                        break;
                    case 'system':
                        this.systemSetting = true;
                        break;
                    case 'quit':
                        this.$confirm('是否退出当前登录?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            service.post("/userAuth/logout").then(res => {
                                if (res.code === 20000) {
                                    this.$store.dispatch('user/resetToken');
                                    this.$router.replace('/login');
                                } else {
                                    this.$notify({
                                        title: "退出登入",
                                        type: "warning",
                                        message: "退出失败"
                                    });
                                }
                            });
                        }).catch(() => {

                        });

                        break;
                    case 'person':
                        this.$router.push("/settings");
                        break;
                }
            },
            // 退出登陆
            quits() {
                this.$store.dispatch('user/resetToken')
            },
            update(updatePasswordForm) {
                this.$refs[updatePasswordForm].validate((valid) => {
                    if (valid) {
                        service({
                            method:"post",
                            url:"users/update/password",
                            data:this.updatePasswordForm
                        }).then(res=>{
                            if (res.code===20000){
                                this.updatePasswordView = false;
                                this.$store.dispatch('user/resetToken');
                                this.$router.replace('/login');
                                this.$notify({
                                    title:"密码修改",
                                    type:"success",
                                    message:"修改成功，请重新登入"
                                })
                            }

                        })
                    } else {

                    }
                });
            },
            // 展开通知
            dropShowBtn() {
                if (this.friendDropShow === true) {
                    this.friendDropShow = false
                }
                clearTimeout(this.setTime)
                this.dropShow = true
            },
            // 收起通知
            dropHideBtn() {
                let This = this;
                this.setTime = setTimeout(function () {
                    This.dropShow = false;
                }, 1000)
            },
            // 展开通知
            friendDropShowBtn() {
                if (this.dropShow === true) {
                    this.dropShow = false
                }
                clearTimeout(this.friendSetTime);
                this.friendDropShow = true
            },
            // 收起通知
            friendDropHideBtn() {
                let This = this;
                this.friendSetTime = setTimeout(function () {
                    This.friendDropShow = false;
                }, 1000)
            },
            // 鼠标移入 通知栏
            dropdownBtn() {
                clearTimeout(this.setTime);
                this.dropShow = true
            },
            // 选取配色方案
            targetThemeIndex(index) {
                this.$emit('targetThemeIndex', index)
            },
            // 去github
            goGithub() {
                window.open('https://github.com/cgq001/admin-menu/tree/2.0')
            },
            getSocketStatus(res) {
                var status = res.detail.data;
                if (status === 0) {
                    this.isOnline = false;
                } else this.isOnline = status === 1;
            },
            reduceRequests() {
                if (this.friendCount > 0) {
                    this.friendCount = Number(this.friendCount) - 1
                } else {
                    this.friendCount = 0
                }
            },
            addFriendNotice(event) {
                if (this.friendCount >= 0) {
                    this.friendCount = Number(this.friendCount) + 1
                } else {
                    this.friendCount = 1
                }
                this.$refs.friendsRef.getAllFriendRequest()
            },
            feedback() {
                this.feedbackShow = true;
            },
            handleClose(done) {
                this.$refs.feedBackView.dataClear()
                done();
            },
            systemSettingHandleClose(done){
                this.$confirm('确认关闭系统设置吗？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            },
            broadcastContent() {
                service.get("/users/config/notice").then(res => {
                    if (res.code === 20000) {
                        if (res.message != null) {
                            this.setNoticeData(res.message)
                        }
                    }
                })
            },
            setNoticeData(notice) {
                if (this.noticeData != null && this.noticeData.length !== 0) {
                    this.noticeData[0] = notice
                } else {
                    this.noticeData = [];
                    this.noticeData.push(notice)
                }
            },
            announcementNotice(event) {
                var notice = event.detail.data.data;
                this.noticeData = [];
                this.noticeData.push(notice);
                this.refresh = false;
                this.$nextTick(() => {
                    // 重新渲染组件
                    this.refresh = true;
                });
            }
        },
        mounted() {
            // 浏览器窗口改变事件
            window.addEventListener('socketStatus', this.getSocketStatus);
            window.addEventListener('addFriendNotice', this.addFriendNotice);
            window.addEventListener('announcementNotice', this.announcementNotice);
            this.isFullscreen = document.body.scrollHeight === window.screen.height;
            this.friendApplicationCount();
            this.broadcastContent();
            socket.init()
        }
    }
</script>

<style scoped>
    .headers {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
    }

    .headers-left {
        flex-direction: row;
        align-items: center;
        display: flex;
        justify-content: flex-start;
    }

    .headers-left-box {
        transition: all 0.5s;
        transform-origin: center center;
        width: 20px;
        height: 100%;
        margin-right: 15px;
    }

    .headers-left-active {
        transform: rotate(180deg);
    }

    .el-icon-s-fold {
        width: 20px;
        height: 100%;
        line-height: 50px;
        font-size: 20px;
        cursor: pointer;

    }

    .el-breadcrumb {
        line-height: 50px;
    }

    .headers-right {
        /* width: 200px; */
        height: 100%;
        /* background: orchid; */
        display: flex;
        justify-content: space-around;
    }

    .headers-right-left {
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin-right: 30px;
        font-size: 22px;
        cursor: pointer;
        position: relative;
    }

    .headers-right-left-screenIcon {
        width: 18px;
        height: 18px;
        margin-right: 10px;
        fill: currentColor;
        color: #413A3F;
    }

    .headers-right-left-switchsvg {
        width: 18px;
        height: 18px;
        margin-right: 20px;
        fill: currentColor;
        color: #413A3F;
    }

    .headers-right-left-githubIcon {
        width: 20px;
        height: 20px;
        margin-right: 20px;
        fill: currentColor;
        color: #413A3F;
    }

    .header-right-dropdown {
        width: 300px;
        height: auto;
        position: absolute;
        right: 0;
        top: 60px;
        z-index: 2;
        background: #ffffff;
        /* padding: 5px 0; */
        box-sizing: border-box;
        border-radius: 4px;
        box-shadow: 0 1px 6px rgba(0, 0, 0, .2);
        overflow: hidden;
    }

    .header-right-friendDropdown {
        width: 300px;
        height: auto;
        position: absolute;
        right: -80px;
        top: 60px;
        z-index: 2;
        background: #ffffff;
        /* padding: 5px 0; */
        box-sizing: border-box;
        border-radius: 4px;
        box-shadow: 0 1px 6px rgba(0, 0, 0, .2);
        overflow: hidden;
    }

    /* .head-news-icon{

    } */
    .head-screen {
        margin-right: 15px;
        transform: rotate(45deg);
    }

    .head-screen-news {
        margin-right: 15px;
    }

    .headers-right-right {
        display: flex;
        justify-content: space-around;
        align-items: center;
        color: #666666;
    }

    .block {
        margin-right: 15px;
    }

    .el-dropdown-link {
        cursor: pointer;
    }

    .focusing {
        border: none !important;
    }

    /* 主题 */
    .theme {
        height: 100vh;
        overflow: hidden;
    }

    .el-drawer__body {
        height: 100vh !important;
        overflow: hidden;
    }

    .theme-title {
        width: 100%;
        height: 50px;
        line-height: 50px;
        font-size: 16px;
        font-weight: bold;
        padding: 0 15px;
        border-bottom: 1px solid #dcdfe6;
    }

    .theme-title-box {
        padding: 10px;
        box-sizing: border-box;
        width: 100%;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        height: calc(100vh - 51px);
        overflow-x: hidden;
        overflow-y: auto;
        -ms-overflow-style: none;
        overflow: '-moz-scrollbars-none';
        scrollbar-width: none; /*  火狐   */
        background: #F5F7F9;
    }

    .theme-title-box::-webkit-scrollbar {
        display: none; /*  Chrome  */
        width: 0 !important; /*  Chrome  */
    }

    .theme-title-box-list {
        width: 180px;
        height: 150px;
        display: flex;
        padding: 10px;
        box-sizing: border-box;
        background: #999999;
        border-radius: 5px;
        cursor: pointer;
        margin-bottom: 10px;
        border: 5px solid transparent;
    }

    .theme-title-box-list-left {
        width: 30px;
        height: 120px;
    }

    .theme-title-box-list-right {
        flex: 1;
        height: 160px;
    }

    .theme-title-box-list-right-top {
        width: 100%;
        height: 20px;
        background: #ffffff;
    }

    .theme-title-box-list-right-bottom {
        width: 100%;
        height: 100px;
    }

    .theme-active {
        border: 5px solid #05DA89;
    }

    /deep/ .custom-badge-online .el-badge__content.is-fixed.is-dot {
        right: 5px;
        top: 38px;
        background-color: #3BB54A;
        height: 10px;
        width: 10px;
        cursor: pointer;
    }

    /deep/ .custom-badge-off .el-badge__content.is-fixed.is-dot {
        right: 5px;
        top: 38px;
        background-color: #999999;
        height: 10px;
        width: 10px;
        cursor: pointer;
    }

    .feedback {
        font-size: 13px;
        color: #9f9f9f;
        margin-right: 60px;
    }

    .headers-middle {
        position: absolute;
        left: 300px;
        top: 10px;
        width: 45%;
    }
</style>
