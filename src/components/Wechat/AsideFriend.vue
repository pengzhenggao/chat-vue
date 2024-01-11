<template>
    <div class="aside-friend-sidebar"
         v-loading="loading"
         element-loading-text="拼命加载中"
         element-loading-spinner="el-icon-loading">
        <el-main>
            <el-menu :default-active="activeIndex" class="el-menu-vertical-demo" @select="handleSelect" mode="vertical">
                <div v-for="(group,index) in friendMenu" v-show="!isSearch" :key="index">
                    <!--                    分组展示-->
                    <div v-if="showRules==='0'">
                        <el-submenu :index="index.toString()">
                            <template slot="title">
                                <span style="font-weight: bold;font-size: 16px">{{group.groupName}}</span>
                                <span style="font-size: 16px" v-if="group.friendshipsDTOS"> ({{group.friendshipsDTOS.length}})</span>
                                <span style="font-size: 16px" v-else> (0)</span>
                            </template>
                            <el-menu-item v-for="friend in group.friendshipsDTOS"
                                          :key="friend.id"
                                          :index="friend.id.toString()"
                                          @click="getChat(friend)"
                                          style="display: flex;flex-direction: row;align-items: center;padding: 30px 0 30px 10px">
                                <div>
                                    <el-badge :ref="friend.friendId" is-dot
                                              :class="{ 'badge-online': isOnline(friend.isActive), 'badge-off': !isOnline(friend.isActive) }">
                                        <img v-if="friend.avatar" :src="friend.avatar"
                                             style="width: 40px;height: 40px;border-radius: 3px"
                                             alt=""
                                             onerror="this.src='https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';this.onerror=null;"/>
                                    </el-badge>
                                </div>
                                <div @contextmenu.prevent="rightClick(friend.friendId,friend.remark,$event)"
                                     style="margin-left: 14px;display: flex;flex-direction: column;">
                                    <span class="friend-remark">{{friend.remark}}</span>
                                    <!-- latestNews,latestTime -->
                                    <span class="friend-latestNews">
                                         {{text(friend.latestNews)}}
                                    </span>
                                    <!--                                    <span class="friend-latestNews"-->
                                    <!--                                          v-else-if="friend.latestNews && friend.messageType==1">-->
                                    <!--                                        图片-->
                                    <!--                                    </span>-->
                                    <!--                                    <span class="friend-latestNews" v-else>-->
                                    <!--                                        暂无消息-->
                                    <!--                                    </span>-->
                                </div>
                                <div style="position: absolute;color: #868686;top:-16px;right: 10px;font-size: 13px;text-align: center">
                                    {{chatTime(friend.latestTime)}}
                                </div>
                                <div style="position: absolute;right: 25px;bottom: -3px" v-if="friend.isStar===1">
                                    <span style="color: #dab74d" class="el-icon-star-on"></span>
                                </div>
                                <div style="position: absolute;left: 52px;top:-16px" v-if="friend.unreadCount>0">
                                    <el-badge :value="friend.unreadCount" :max="99" class="item">
                                        <span></span>
                                    </el-badge>
                                </div>
                            </el-menu-item>
                        </el-submenu>
                    </div>

                    <!--                    不分组展示-->
                    <div v-if="showRules==='1'">
                        <el-menu-item v-for="friend in group.friendshipsDTOS"
                                      :key="friend.id"
                                      :index="friend.id.toString()"
                                      @click="getChat(friend)"
                                      style="display: flex;flex-direction: row;align-items: center;padding: 30px 0 30px 10px">
                            <div v-if="friend.type===1">
                                <el-badge :ref="friend.friendId" is-dot

                                          :class="{ 'badge-online': isOnline(friend.isActive), 'badge-off': !isOnline(friend.isActive) }">
                                    <img v-if="friend.avatar" :src="friend.avatar"
                                         style="width: 40px;height: 40px;border-radius: 3px"
                                         alt=""
                                         onerror="this.src='https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';this.onerror=null;"/>
                                </el-badge>
                            </div>
                            <div v-else>
                                <img v-if="friend.avatar" :src="friend.avatar"
                                     style="width: 40px;height: 40px;border-radius: 3px"
                                     alt=""
                                     onerror="this.src='https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';this.onerror=null;"/>
                            </div>
                            <div @contextmenu.prevent="rightClick(friend.friendId,friend.remark,friend.type,friend.id,$event)"
                                 style="margin-left: 14px;display: flex;flex-direction: column;">
                                <span class="friend-remark">{{friend.remark}}</span>
                                <!-- latestNews,latestTime -->
                                <span class="friend-latestNews">
                                        {{text(friend.latestNews)}}
                                </span>

                            </div>
                            <div style="position: absolute;color: #868686;top:-16px;right: 10px;font-size: 13px;text-align: center">
                                {{chatTime(friend.latestTime)}}
                            </div>
                            <div :class="[friend.isTop===1?'friend-isStar1':'friend-isStar2']" v-if="friend.isStar===1">
                                <span style="color: #dab74d" class="el-icon-star-on"></span>
                            </div>
                            <div style="position: absolute;left: 52px;top:-16px" v-if="friend.unreadCount>0">
                                <el-badge :value="friend.unreadCount" :max="99" class="item">
                                    <span></span>
                                </el-badge>
                            </div>
                            <div style="position: absolute;right: 10px;bottom: 1px;" v-if="friend.isTop===1">
                                <span style="font-size: 12px;color: #a4a4a4;background-color: #ebebeb;padding: 2px">置顶</span>
                            </div>
                        </el-menu-item>
                    </div>
                </div>
            </el-menu>
            <div v-show="isSearch">
                <FriendSearch ref="friendSearch" @clickSession="clickSession"/>
            </div>
            <div style="text-align: center;margin-top: 280px" v-if="(friendMenu.length<=0 && !isSearch)">
                <span style="color: #b6b6b6;font-size: 20px;">暂无好友</span>
            </div>
            <div
                    v-show="rightClickView"
                    class="float-window"
                    :style="{ left: `${x}px`, top: `${y}px` }">
                <div class="opear">
                    <div style="border-bottom: 1px solid #e1e1e1">
                        <div class="detail" @click.prevent="top(1)" v-if="this.sidewaysStatus.isTop===0">
                            <span>置顶</span>
                        </div>
                        <div class="detail" @click="cancelTop(0)" v-else>
                            <span>取消置顶</span>
                        </div>
                        <div class="detail" @click="markUnread"
                             v-if="this.sidewaysStatus.isUnreadCount<=0 || this.sidewaysStatus.isUnreadCount===null">
                            <span>标记为未读</span>
                        </div>
                        <div class="detail" @click="clearUnreadCount(rightClickFriendId)" v-else>
                            <span>取消未读</span>
                        </div>
                        <div class="detail" @click="clearChatHistory">清空记录</div>
                    </div>
                    <div style="border-bottom: 1px solid #e1e1e1">
                        <div class="detail" @click="delFriend">删除好友</div>
                    </div>
                    <div class="detail" @click="friendSettings(rightClickFriendId)">设置</div>
                </div>
            </div>
        </el-main>
    </div>
</template>

<script>
    import service from "../../http";
    import FriendSearch from "./FriendSearch";

    export default {
        name: "AsideFriend",
        components: {
            FriendSearch
        },
        data() {
            return {
                loading: false,
                rightClickView: false,
                x: 0, // 浮动窗口的X坐标
                y: 0, // 浮动窗口的Y坐标
                isSearch: false,
                showRules: '1',
                keyword: "",
                friendMenu: [],
                insertLocation: 0,
                sidewaysStatus: {
                    isTop: 0,
                    isUnreadCount: 0,
                },
                remark: null,
                username: null,
                activeIndex: '0',
                rightClickRemark: null,
                rightClickFriendId: null,
            };
        }, methods: {
            rightClick(friendId, remark, type, id, event) {
                if (type === 1) {
                    service({
                        method: "get",
                        url: "/getSidewaysStatus",
                        params: {
                            friendId: friendId
                        }
                    }).then(res => {
                        if (res && res.code === 20000) {
                            this.sidewaysStatus = res.data;
                            this.rightClickRemark = remark;
                            this.rightClickFriendId = friendId;
                            this.rightClickView = true;
                            if (event.button === 2) {
                                this.x = event.clientX; // 更新X坐标
                                this.y = event.clientY; // 更新Y坐标
                            }
                        } else {
                            this.$notify({
                                title: "服务器异常",
                                type: "success"
                            })
                        }
                    });
                } else if (type === 0) {
                }
            },
            top(status) {
                for (let i = 0; i < this.friendMenu.length; i++) {
                    for (let f = 0; f < this.friendMenu[i].friendshipsDTOS.length; f++) {
                        if (this.rightClickFriendId.toString() === this.friendMenu[i].friendshipsDTOS[f].friendId.toString()) {
                            this.friendMenu[i].friendshipsDTOS[f].isTop = status;
                            const itemToMove = this.friendMenu[i].friendshipsDTOS.splice(f, 1)[0];
                            this.friendMenu[i].friendshipsDTOS.unshift(itemToMove);
                            this.insertLocation = this.insertLocation + 1
                            break;
                        }
                    }
                }
                service({
                    method: "put",
                    url: `/isTop/${status}`,
                    params: {
                        friendId: this.rightClickFriendId
                    }
                })
            },
            cancelTop(status) {
                for (let i = 0; i < this.friendMenu.length; i++) {
                    for (let f = 0; f < this.friendMenu[i].friendshipsDTOS.length; f++) {
                        if (this.rightClickFriendId.toString() === this.friendMenu[i].friendshipsDTOS[f].friendId.toString()) {
                            this.friendMenu[i].friendshipsDTOS[f].isTop = status;
                            const itemToMove = this.friendMenu[i].friendshipsDTOS.splice(f, 1)[0];
                            this.friendMenu[i].friendshipsDTOS.splice(this.insertLocation - 1, 0, itemToMove);
                            this.insertLocation = this.insertLocation - 1;
                            break;
                        }
                    }
                }
                service({
                    method: "put",
                    url: `/isTop/${status}`,
                    params: {
                        friendId: this.rightClickFriendId
                    }
                })
            },
            hideFloatWindow(event) {
                this.rightClickView = false;
            },
            markUnread() {
                for (let i = 0; i < this.friendMenu.length; i++) {
                    for (var f in this.friendMenu[i].friendshipsDTOS) {
                        if (this.rightClickFriendId.toString() === this.friendMenu[i].friendshipsDTOS[f].friendId.toString()) {
                            this.friendMenu[i].friendshipsDTOS[f].unreadCount = this.friendMenu[i].friendshipsDTOS[f].unreadCount + 1
                            break
                        }
                    }
                }
                this.addUnreadCount(this.rightClickFriendId);
            },
            clearChatHistory() {
                this.$confirm(`将联系人‘${this.rightClickRemark}’聊天记录清空 ,将不能找回聊天记录`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    service({
                        method: "delete",
                        url: "/chatStorage",
                        params: {
                            friendId: this.rightClickFriendId
                        }
                    }).then(res => {
                        if (res && res.code === 20000) {
                            window.dispatchEvent(new CustomEvent('clearChatHistory', {
                                detail: {
                                    data: this.rightClickFriendId
                                }
                            }));
                            this.rightClickFriendId = null;
                        }
                    })
                }).catch(() => {
                })

            },
            //删除好友确认
            delFriend() {
                this.$confirm(`将联系人‘${this.rightClickRemark}’删除 ,将同时删除与该联系人的聊天记录`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    service({
                        method: "delete",
                        url: "delete/friend",
                        params: {
                            friendId: this.rightClickFriendId
                        }
                    }).then(res => {
                        if (res.flag) {
                            this.delFriendNotice()
                        }
                    }).catch(() => {

                    })
                }).catch(() => {
                })
            },
            //删除好友后置处理
            delFriendNotice(friendId) {
                if (!friendId) {
                    for (let i = 0; i < this.friendMenu.length; i++) {
                        for (var f in this.friendMenu[i].friendshipsDTOS) {
                            if (this.rightClickFriendId.toString() === this.friendMenu[i].friendshipsDTOS[f].friendId.toString()) {
                                this.friendMenu[i].friendshipsDTOS.splice(f, 1);
                                break
                            }
                        }
                    }
                    window.dispatchEvent(new CustomEvent('clearChatHistory', {
                        detail: {
                            data: this.rightClickFriendId
                        }
                    }));
                    window.dispatchEvent(new CustomEvent('initFriendshipId'));
                    this.rightClickFriendId = null
                } else {
                    for (let i = 0; i < this.friendMenu.length; i++) {
                        for (var f in this.friendMenu[i].friendshipsDTOS) {
                            if (friendId.detail.data.toString() === this.friendMenu[i].friendshipsDTOS[f].friendId.toString()) {
                                this.friendMenu[i].friendshipsDTOS.splice(f, 1);
                                break
                            }
                        }
                    }
                    window.dispatchEvent(new CustomEvent('clearChatHistory', {
                        detail: {
                            data: friendId.detail.data
                        }
                    }));
                    window.dispatchEvent(new CustomEvent('initFriendshipId'));
                }

            },
            getFriendshipsMenu(showRules, flag) {
                if (!flag) {
                    this.loading = true;
                }
                service({
                    method: "get",
                    url: `get/friendships/${showRules ? showRules : this.showRules}`,
                    params: {
                        remark: this.remark,
                        username: this.username
                    }
                }).then(res => {
                    // this.map = new Map(Object.entries(res.data));
                    if (res && res.code === 20000) {
                        this.friendMenu = res.data;

                        if (showRules === '1' && res.data[0].friendshipsDTOS.length <= 0) {
                            this.friendMenu = []
                        }
                        if (showRules) {
                            this.showRules = showRules
                        }
                    }
                    this.loading = false
                }).catch(() => {
                    this.loading = false
                })
            },
            /**
             * 搜索好友后点击
             * @param friend
             */
            clickSession(friend) {
                this.activeIndex = friend.id.toString();
                this.$emit("completeSearch");
                this.getChat(friend)
            },
            /**
             * 在搜索添加好友时，搜索已添加的好友点击发送消息
             * @param searchResult
             */
            clickAddSession(searchResult) {
                this.activeIndex = searchResult.friendId.toString();
                var params = {
                    friendId: searchResult.userInfoId,
                    remark: searchResult.remark,
                    type: 1
                };
                this.getChat(params)
            },
            // 获取聊天记录预处理
            preGetChat(event) {
                if (this.showRules !== '0' && this.friendMenu[0].friendshipsDTOS !== null) {
                    this.friendMenu[0].friendshipsDTOS.forEach((item) => {
                        if (item.friendId === event.detail.data) {
                            this.activeIndex = item.id.toString();
                            this.getChat(item)
                        }
                    })
                } else {
                    var i = 0;
                    for (let i = 0; i < this.friendMenu.length; i++) {
                        this.friendMenu[i].friendshipsDTOS.forEach((item) => {
                            if (item.friendId === event.detail.data) {
                                i = 1;
                                this.activeIndex = item.id.toString();
                                this.getChat(item)
                            }
                        })
                        if (i === 1) {
                            break
                        }
                    }
                }
            },
            getChat(event) {
                var from = {
                    friendshipId: event.type === 1 ? event.friendId : event.id,
                    remark: event.remark,
                    type: event.type,
                    groupChatCount: event.groupChatCount
                };
                this.$emit("currentFriend", from);
                this.clearUnreadCount(event.friendId)
            },
            isOnline(active) {
                return active === 1;
            },
            onAndOffLineNotifications(event) {
                var obj = this.friendMenu;
                var _this = this;
                var flag = 1;

                for (let i = 0; i < this.friendMenu.length; i++) {
                    for (var f in this.friendMenu[i].friendshipsDTOS) {
                        if (event.detail.data.onAndOffLineUserId === this.friendMenu[i].friendshipsDTOS[f].friendId.toString()) {
                            this.friendMenu[i].friendshipsDTOS[f].isActive = event.detail.data.isActive;
                            flag = 0;
                            break
                        }
                    }
                    if (flag !== 1) {
                        break
                    }
                }
                // this.getFriendshipsMenu(_this.friendMenu);
            },
            friendSettings(rightClickFriendId) {
                this.$router.push({
                    path: `/communication/friend-settings/${rightClickFriendId}`
                })
            },
            remoteSearchFriend(keyword) {
                service({
                    url: "/remote/friendships",
                    method: "get",
                    params: {
                        keyword: keyword
                    }
                }).then(res => {
                    this.$refs.friendSearch.searchView(res.data)
                })
            },
            getInsertLocation() {
                service({
                    method: "get",
                    url: `/getInsertLocation`
                }).then(res => {
                    this.insertLocation = res.data
                })
            },
            isSearchStatus(status) {
                this.isSearch = status
            },
            messageUpdates(event) {
                var params = event.detail.data;
                for (let i = 0; i < this.friendMenu.length; i++) {
                    for (let f = 0; f < this.friendMenu[i].friendshipsDTOS.length; f++) {
                        //双方都在面对面聊天
                        if (params.othersUserId === this.friendMenu[i].friendshipsDTOS[f].friendId) {
                            this.friendMenu[i].friendshipsDTOS[f].latestNews = params.content;
                            this.friendMenu[i].friendshipsDTOS[f].latestTime = params.createTime;
                            this.friendMenu[i].friendshipsDTOS[f].messageType = params.messageType;
                            if (this.showRules !== '0' && this.friendMenu[i].friendshipsDTOS[f].isTop !== 1) {
                                const itemToMove = this.friendMenu[i].friendshipsDTOS.splice(f, 1)[0];
                                this.friendMenu[i].friendshipsDTOS.splice(this.insertLocation, 0, itemToMove);
                            }
                            return;
                        } else if (params.myUserId === this.friendMenu[i].friendshipsDTOS[f].friendId) {
                            //接收方在另一个好友聊天界面（非面对面）
                            this.friendMenu[i].friendshipsDTOS[f].latestNews = params.content;
                            this.friendMenu[i].friendshipsDTOS[f].latestTime = params.createTime;
                            this.friendMenu[i].friendshipsDTOS[f].messageType = params.messageType;
                            this.friendMenu[i].friendshipsDTOS[f].unreadCount = this.friendMenu[i].friendshipsDTOS[f].unreadCount + 1
                            if (this.showRules !== '0' && this.friendMenu[i].friendshipsDTOS[f].isTop !== 1) {
                                const itemToMove = this.friendMenu[i].friendshipsDTOS.splice(f, 1)[0];
                                this.friendMenu[i].friendshipsDTOS.splice(this.insertLocation, 0, itemToMove);
                            }
                            //异步刷新
                            this.addUnreadCount(params.myUserId);
                            return;
                        }
                    }

                }
            },
            listeningStar(event) {
                for (let i = 0; i < this.friendMenu.length; i++) {
                    for (let f = 0; f < this.friendMenu[i].friendshipsDTOS.length; f++) {
                        if (event.detail.data.friendId.toString() === this.friendMenu[i].friendshipsDTOS[f].friendId.toString()) {
                            this.friendMenu[i].friendshipsDTOS[f].isStar = event.detail.data.isStar;
                            return;
                        }
                    }
                }
            },
            buddyListPopulation(event) {
                for (let i = 0; i < this.friendMenu.length; i++) {
                    if (this.friendMenu[i].groupName === event.detail.data.message.groupName) {
                        this.friendMenu[i].friendshipsDTOS.unshift(event.detail.data.message);
                        return
                    }
                }
                if (!this.friendMenu[0]) {
                    this.getFriendshipsMenu(null, true)
                } else {
                    this.friendMenu[0].friendshipsDTOS.unshift(event.detail.data.message);
                }

            },
            updateRemark(event) {
                for (let i = 0; i < this.friendMenu.length; i++) {
                    for (var f in this.friendMenu[i].friendshipsDTOS) {
                        if (event.detail.data.friendId.toString() === this.friendMenu[i].friendshipsDTOS[f].friendId.toString()) {
                            this.friendMenu[i].friendshipsDTOS[f].remark = event.detail.data.remark;
                            break
                        }
                    }
                }
            },
            addUnreadCount(friendId) {
                service.put(`/addUnreadCount/${friendId}`)
            },
            clearUnreadCount(friendId) {
                if (!friendId) {
                    return;
                }
                for (let i = 0; i < this.friendMenu.length; i++) {
                    for (let f = 0; f < this.friendMenu[i].friendshipsDTOS.length; f++) {
                        if (friendId === this.friendMenu[i].friendshipsDTOS[f].friendId) {
                            //接收方在另一个好友聊天界面（非面对面）
                            this.friendMenu[i].friendshipsDTOS[f].unreadCount = 0;
                            service.put(`/clearUnreadCount/${friendId}`);
                            return;
                        }
                    }
                }
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
            handleSelect(event) {
                this.activeIndex = event.toString();
            },
            initAsideFriend() {
                var showSwitching = localStorage.getItem("showSwitching");
                if (showSwitching === '1') {
                    this.getFriendshipsMenu(showSwitching, 1)
                }

            },
            text(html) {
                if (!html) {
                    return "暂无消息"
                }
                var text = html.replace(/<img[^>]*>/g, "[图片] ");
                if (text.replace(/<[^<>]*>/g, '').replace("&lt;", '<').replace("&gt;", '>').length === 0) {
                    return "空白消息"
                }
                return text.replace(/<[^<>]*>/g, '').replaceAll("&lt;", '<').replaceAll("&gt;", '>');
            }
        },
        created() {
            this.getInsertLocation();
        },
        mounted() {
            this.getFriendshipsMenu(localStorage.getItem("showSwitching"));
            window.addEventListener('listeningStar', this.listeningStar);
            window.addEventListener('delFriendNotice', this.delFriendNotice);
            window.addEventListener('initAsideFriend', this.initAsideFriend);
            window.addEventListener('updateRemark', this.updateRemark);
            window.addEventListener('MessageUpdates', this.messageUpdates);
            window.addEventListener('getChat', this.preGetChat);
            window.addEventListener('buddyListPopulation', this.buddyListPopulation);
            window.addEventListener('OnAndOffLineNotifications', this.onAndOffLineNotifications);
            document.body.addEventListener('contextmenu', e => {
                e.preventDefault()
            });
            document.addEventListener("click", (event) => {
                this.hideFloatWindow(event);
            });
        }, beforeDestroy() {
            window.removeEventListener('listeningStar', this.listeningStar);
            window.removeEventListener('delFriendNotice', this.delFriendNotice);
            window.removeEventListener('updateRemark', this.updateRemark);
            window.removeEventListener('initAsideFriend', this.initAsideFriend);
            window.removeEventListener('MessageUpdates', this.messageUpdates);
            window.removeEventListener('buddyListPopulation', this.buddyListPopulation);
            window.removeEventListener('OnAndOffLineNotifications', this.onAndOffLineNotifications);
            document.body.removeEventListener('contextmenu', e => {
                e.preventDefault()
            });
            document.removeEventListener("click", (event) => {
                this.hideFloatWindow(event);
            });
        },
    }
</script>

<style scoped>
    .float-window {
        position: absolute;
        width: 130px;
        background-color: #fefefe;
        border: 1px solid #ccc;
        color: black;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .float-window .opear {
        font-size: 13px;
    }

    .float-window .opear .detail {
        padding: 5px 0 5px 30px;
        text-align: left;
        cursor: pointer;
    }

    .float-window .opear .detail:hover {
        background-color: #e4e4e4;
    }

    .aside-friend-sidebar {
        height: calc(100vh - 19vh);
        background-color: #f5f7fa;
        overflow-y: auto;
        /* 设置滚动轨道的样式 */
    }

    .aside-friend-sidebar::-webkit-scrollbar {
        width: 5px; /* 设置滚动条宽度 */
    }

    .aside-friend-sidebar::-webkit-scrollbar-track {
        background: #ffffff; /* 设置轨道背景色 */
    }

    .aside-friend-sidebar::-webkit-scrollbar-thumb {
        background: #c9c9c9; /* 设置滚动条颜色 */
        border-radius: 5px;
    }

    /deep/ .el-menu {
        background: #fff;
    }

    .el-menu-item.is-active {
        background-color: #e1eaf4 !important;
        color: #000000;

    span {
        color: #1c1c1c !important;
    }

    }
    /deep/ .el-menu-item.is-active:focus {
        color: black;
    }

    /*.el-submenu {*/
    /*    background: #ecf5ff;*/
    /*}*/
    .el-menu-item {
        margin: 10px 0;
    }

    /deep/ .el-menu-item[data-v-469efc1d] {
        margin: 0;
    }

    .friend-remark {
        display: block;
        margin-bottom: -5px;
        width: 100px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .friend-isStar1 {
        position: absolute;
        right: 35px;
        bottom: 2px
    }

    .friend-isStar2 {
        position: absolute;
        right: 10px;
        bottom: 1px;
    }

    .friend-latestNews {
        margin-top: -25px;
        font-size: 12px;
        width: 100px;
        color: #999999;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    /deep/ .badge-online .el-badge__content.is-fixed.is-dot {
        right: 5px;
        top: 38px;
        background-color: #3BB54A;
        height: 8px;
        width: 8px;
        cursor: pointer;
    }

    /deep/ .badge-off .el-badge__content.is-fixed.is-dot {
        right: 5px;
        top: 38px;
        background-color: #999999;
        height: 8px;
        width: 8px;
        cursor: pointer;
    }

    .el-main {
        overflow: hidden !important;
    }

    .search {
        height: 50px;
        background-color: white;
    }

    /deep/ .el-card__body, .el-main {
        padding: 0;
    }

    /deep/ .el-scrollbar__wrap {
        overflow-x: hidden;
    }


</style>
