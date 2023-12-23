<template>
    <div style="height: 60vh;padding-right: 10px;padding-left: 10px;">

        <div style="border-bottom: 1px solid #e2e2e2">
            <div style="text-align: center;font-weight: 700;font-size: 15px;margin-bottom: 5px">
                群成员({{this.total}})
            </div>
            <div class="member">
                <div v-for="(item,index) in groupMemberList" :key="index"
                     class="member-item">
                    <div style="margin: 2px 7px 2px 7px;display: flex;flex-direction: column;">
                        <img style="width: 40px;height: 40px" :src="item.avatar"/>
                        <div class="member-username">
                            <span>{{item.customizeRemark?item.customizeRemark:item.username}}</span>
                        </div>
                    </div>
                    <!-- <div style="display: flex;flex-direction: column;margin-left: 5px">
                         <span style="font-size: 11px;color: #b5b5b5;margin-top: 5px">最近发言：{{chatTime(item.leaveMessageTime)}}</span>
                     </div>-->
                </div>
                <div class="pull-group-chat">
                    <div class="pull-icon">
                        <span style="font-size: 18px"><i class="el-icon-plus"></i></span>
                    </div>
                    <div>添加</div>
                </div>
            </div>
            <div class="load">
                <div v-if="loadFlag" @click="loadMore">加载更多&nbsp;<i class="el-icon-arrow-down"></i></div>
                <div v-else-if=" currentPage>1" @click="collapse">收起&nbsp;<i class="el-icon-arrow-up"></i></div>
            </div>
        </div>

        <!--        操作栏-->
        <div class="operation-tool">
            <div class="clear-group-record" @click="clearGroupChatMessage"><span>清空聊天记录</span></div>
            <div class="back-chatgroup">
                <span @click.prevent="leaveGroupChat" v-if="!isGroupLeader">退出群聊</span>
                <span @click.prevent="disbandGroupChat" v-else-if="isGroupLeader">解散群聊</span>
            </div>
        </div>

    </div>
</template>

<script>
    import service from "../../http";
    import {asidefriend} from "../../listening/asidefriend";
    import {wechat} from "../../listening/wechat";
    import {chatcontent} from "../../listening/chatcontent";

    export default {
        name: "ChatGroupMember",
        data() {
            return {
                currentPage: 1,
                size: 20,
                loadFlag: true,
                isGroupLeader: false,
                groupMemberList: [],
                total: 0,
            }
        },
        props: {
            item: {
                type: Object,
            }
        },
        methods: {
            loadMore() {
                this.currentPage++;
                this.getGroupMembers(this.item.friendshipId, true)
            },
            collapse() {
                this.currentPage = 1;
                this.groupMemberList = this.groupMemberList.slice(0, this.size)
                this.loadFlag = true
            },
            getGroupMembers(groupId, clearFlag, collapseFlag) {
                if (!clearFlag && !collapseFlag) {
                    this.groupMemberList = []
                }
                service({
                    method: "get",
                    url: "/groupChat",
                    params: {
                        currentPage: this.currentPage,
                        size: this.size,
                        chatGroupId: groupId
                    }
                }).then(res => {
                    if (!res.data || res.data.length < this.size) {
                        this.loadFlag = false
                    }
                    for (let i = 0; i < res.data.length; i++) {
                        this.groupMemberList.push(res.data[i])
                    }
                    this.total = res.total
                })
            },
            leaveGroupChat() {
                this.$confirm('确定需要退出群聊吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    service.put(`leaveGroupChat/${this.item.friendshipId}`).then(res => {
                        if (res && res.code === 20000) {
                            asidefriend.initAsideFriend();
                            wechat.initContainer();
                            this.$message.success(res.message)
                        } else {
                            this.$message.error(res.message)
                        }
                    })
                }).catch(() => {
                });
            },
            disbandGroupChat() {
                this.$confirm('解散群聊后聊天记录后将不可在恢复！', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    service({
                        method: "put",
                        url: `/groupChat/disbandGroupChat/${this.item.friendshipId}`
                    }).then(res => {
                        if (res && res.code === 20000) {
                            asidefriend.initAsideFriend();
                            wechat.initContainer();
                            this.$notify({
                                type: 'success',
                                title: "解散群聊",
                                message: "群聊已解散"
                            })
                        }
                    })
                }).catch(() => {
                });

            },
            getIsGroupLeader(groupChatId) {
                service({
                    method: "get",
                    url: "groupChat/isGroupLeader",
                    params: {
                        groupChatId: groupChatId
                    }
                }).then(res => {
                    if (res && res.code === 20000) {
                        this.isGroupLeader = res.data
                    }
                })
            },
            clearGroupChatMessage() {
                this.$confirm('清空聊天记录后将不可在恢复！', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    service.delete(`groupChatStorage/clearGroupChatMessage/${this.item.friendshipId}`).then(res => {
                        if (res && res.code === 20000) {
                            chatcontent.initMessage();
                            this.$message.success(res.message)
                        } else {
                            this.$message.error(res.message)
                        }
                    })
                }).catch(() => {
                });

            }
        }, mounted() {

        }
    }
</script>

<style scoped>

    .member {
        display: flex;
        max-width: 220px;
        flex-wrap: wrap;
        flex-direction: row;
    }

    .member-item {
        cursor: pointer;
        padding: 5px 0 5px 0;
    }

    .load {
        text-align: center;
        cursor: pointer;
        padding: 5px 0 5px 0;
    }

    .load:hover {
        color: #727272;
    }

    .member-username {
        font-weight: 700;
        white-space: nowrap; /* 防止文字换行 */
        overflow: hidden; /* 隐藏超出容器宽度的内容 */
        text-overflow: ellipsis; /* 当内容超出容器宽度时显示省略号 */
        max-width: 40px; /* 设置容器的最大宽度 */
    }

    .pull-group-chat {
        cursor: pointer;
        padding: 5px 0 5px 0;
        display: flex;
        flex-direction: column;
        align-items: center
    }

    .pull-icon {
        width: 40px;
        height: 36px;
        border: 1px solid #cccccc;
        margin: 2px 7px 2px 7px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .pull-icon:hover {
        border: #999999 1px solid;
    }

    .operation-tool {
        text-align: center;
    }

    .operation-tool span {
        text-align: center;
        cursor: pointer;
    }

    .clear-group-record {
        padding-bottom: 10px;
        margin-top: 10px;
        color: #ff4347;
        border-bottom: 1px solid #cccccc;
    }

    .back-chatgroup {
        margin-top: 10px;
        color: #ff4347;
    }
</style>
