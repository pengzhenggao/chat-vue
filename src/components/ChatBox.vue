<template>
    <div class="CB">
        <el-container style="height: 100%">
            <el-main class="el-mai">
                <WeChatContent ref="weChatContent" @positionView="positionView" @reEdit="reEdit"/>
            </el-main>
            <el-footer height="160px">
                <div v-show="groupChatStatus">
                    <ChatEditor ref="chatEditor" :parentContent="this.sendMessage.content"
                                @submitMessage="submitMessage"/>
                </div>
                <div v-show="!groupChatStatus">
                    <span style="border-top: 1px solid #cccccc;display: flex;justify-content: center;line-height: 100px;cursor: default">
                        <span style="font-size: 18px;color: #999999"><span class="el-icon-warning"
                                                                           style="color: #a30000"></span>&nbsp;群主已解散该群聊，禁止发送消息</span>
                    </span>
                </div>
            </el-footer>
        </el-container>
    </div>
</template>

<script>
    import WeChatContent from "./Wechat/WeChatContent";
    import {getToken} from "../utils/auth";
    import {socket} from "../config/websocket/socket";

    import ChatEditor from "./editor/ChatEditor";
    import service from "../http";

    export default {
        components: {
            WeChatContent,
            ChatEditor
        },
        name: "ChatBox",
        data() {
            return {
                showScrollbar: false,
                //表情框是否展示
                emojiShow: false,
                //表情列表
                faceList: [],
                groupChatStatus: true,
                scrolltMax: 0,
                //表情文本
                content: "",
                getBrowString: "",
                chatType: 0,
                sendMessage: {           //单聊
                    action: 10003,       //聊天标识
                    token: getToken(),
                    receiverId: "",     //接收方
                    content: "",  //聊天输入内容
                    extend: 0,
                },
                sendGroupChatMessage: {   //群聊
                    action: 10006,       //聊天标识
                    token: getToken(),
                    groupChatId: "",     //接收方
                    content: "",        //聊天输入内容
                    extend: 0,
                },
                objectData: {
                    OSSAccessKeyId: '',
                    policy: '',
                    Signature: '',
                    key: '',
                    host: '',
                    dir: ''
                },
            }
        }, methods: {
            loadEmojis() {
                const appData = require("../assets/mate/emojis.json");
                for (let i in appData) {
                    this.faceList.push(appData[i].char);
                }
            },
            // 获取用户点击之后的标签 ，存放到输入框内
            getBrow(index) {
                for (let i in this.faceList) {
                    if (index.toString() === i) {
                        this.getBrowString = this.faceList[index];
                        this.content = this.content + this.getBrowString;
                    }
                }
                this.emojiShow = false;
            },
            submitMessage(content) {
                if (content.trim().length <= 0) {
                    this.$notify({
                        type:"warning",
                        title:"聊天内容",
                        message:"发送的内容不能为空"
                    });
                    return
                }
                if (this.chatType === 1) {
                    this.sendMessage.content = content;
                    socket.send(this.sendMessage);
                } else if (this.chatType === 0) {
                    this.sendGroupChatMessage.content = content;
                    socket.send(this.sendGroupChatMessage);
                }
            },
            chatBox(data) {
                this.content = '';
                if (data.type === 1) {
                    this.sendMessage.receiverId = data.friendshipId;
                    this.scrolltMax = 0;
                    this.groupChatStatus = true
                } else if (data.type === 0) {
                    this.sendGroupChatMessage.groupChatId = data.friendshipId;
                    this.scrolltMax = 0;
                    this.getGroupChatStatus(this.sendGroupChatMessage.groupChatId)
                } else {
                    return
                }
                this.chatType = data.type;
                this.chatType === 1 ? this.$refs.weChatContent.userChatMessages(this.sendMessage.receiverId) :
                    this.$refs.weChatContent.userGroupChatMessages(this.sendGroupChatMessage.groupChatId);
                this.$refs.chatEditor.editorFocus()
            },
            oss_upload(file) {
                const isJPG = file.type === 'image/jpeg';
                if (!isJPG) {
                    this.$notify({
                        title:"上传图片",
                        type:"error",
                        message:'上传头像图片只能是 JPG 格式!'
                    });
                }
                return isJPG;
            },
            getGroupChatStatus(groupChatId) {
                service({
                    method: "get",
                    url: "users/groupChat/getGroupChatStatus",
                    params: {
                        groupChatId: groupChatId
                    }
                }).then(res => {
                    if (res && res.code === 20000) {
                        this.groupChatStatus = res.data
                    }
                })
            },
            handleAvatarSuccess(res, file) {
                this.sendMessage.content = res.message;
                this.sendMessage.extend = 1;
                socket.send(this.sendMessage);
                this.sendMessage.content = ""
                this.sendMessage.extend = 0
            },
            handleScroll() {
                // 在这里获取滚动条高度
                const scrollHeight = document.querySelector('.el-mai').scrollTop;
                const scrollHeightMax = document.querySelector('.el-mai').scrollHeight;
                if (this.scrolltMax === 0) {
                    this.scrolltMax = scrollHeightMax;
                }
                if (scrollHeight === 0) {
                    this.$refs.weChatContent.lazyUserChatMessages()
                }

            },
            positionView(index) {
                const scrollHeight = this.scrolltMax + this.scrolltMax * index;
                document.querySelector('.el-mai').scrollTop = (scrollHeight - this.scrolltMax);
                this.scrolltMax = 0
            },
            reEdit(content) {
                this.$refs.chatEditor.content = content
            },
            groupChatNotify(event) {
                var params = event.detail.data;
                switch (params.message) {
                    case 1:
                        if (this.chatType === 0 && this.sendGroupChatMessage.groupChatId.toString() === params.data.toString())
                           this.groupChatStatus = false
                            break;
                    case 2:
                        break;
                    default:

                }
            },
        }, created() {

        }, mounted() {
            this.$nextTick(() => {
                const el = document.querySelector('.el-mai');
                el.addEventListener('scroll', this.handleScroll);
            });
            window.addEventListener("disbandGroupChat", this.groupChatNotify)
        },
        beforeDestroy() {
            // 取消滚动事件监听
            const el = document.querySelector('.el-mai');
            if (el) {
                el.removeEventListener('scroll', this.handleScroll);
            }
        },
    }
</script>
<style scoped>
    .CB {

        width: 100%;
        height: 100%;
        overflow: hidden;
        box-sizing: border-box;
    }

    /deep/ .el-footer {
        width: 100%;
        color: #333;
        height: 270px;
        padding: 30px 20px
    }

    /deep/ .el-main {

        color: #333;
        padding: 0 30px;
        overflow-y: auto;
    }

    /deep/ .el-textarea__inner {
        resize: none;
    }

    /deep/ .el-main::-webkit-scrollbar-track {
        display: none;
    }

    .el-main::-webkit-scrollbar {
        width: 5px; /* 设置滚动条宽度 */
    }

    .el-main::-webkit-scrollbar-track {
        background: #ffffff; /* 设置轨道背景色 */
    }

    .el-main::-webkit-scrollbar-thumb {
        background: #c9c9c9; /* 设置滚动条颜色 */
        border-radius: 5px;
    }

    /deep/ .el-textarea .el-input__count {
        display: none;
    }

    .submit-btn {
        margin: 0 15px 10px 0;
        float: right;
    }

    .el-main .overScrollbar {
        overflow-y: auto;
    }

    .el-main .leaveScrollbar {
        overflow-y: hidden;
    }

    /deep/ .la.el-button {
        padding: 10px 18px;
    }

</style>
