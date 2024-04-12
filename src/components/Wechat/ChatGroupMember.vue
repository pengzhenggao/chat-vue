<template>
    <div style="height: 78vh;padding-right: 10px;padding-left: 10px;">
        <div style="border-bottom: 1px solid #e2e2e2">
            <div style="text-align: center;font-weight: 700;font-size: 15px;margin-bottom: 5px">
                群成员({{this.total}})
            </div>
            <div class="member">
                <div v-for="(item,index) in groupMemberList" :key="index"
                     class="member-item">
                    <div style="margin: 2px 7px 2px 7px;display: flex;flex-direction: column;" @click="selectMember(item)">
                        <img style="width: 40px;height: 40px" :src="item.avatar"/>
                        <div class="member-username">
                            <span>{{item.customizeRemark?item.customizeRemark:item.username}}</span>
                        </div>
                    </div>
                </div>
                <div class="pull-group-chat">
                    <div class="pull-icon" @click="pullPeople">
                        <span style="font-size: 18px"><i class="el-icon-plus"></i></span>
                    </div>
                </div>
            </div>
            <div class="load">
                <div v-if="loadFlag" @click="loadMore">加载更多&nbsp;<i class="el-icon-arrow-down"></i></div>
                <div v-else-if=" currentPage>1" @click="collapse">收起&nbsp;<i class="el-icon-arrow-up"></i></div>
            </div>
        </div>
        <div class="group-chat-message">
            <el-form label-position="top" label-width="80px" :model="groupChatMessage">
                <el-form-item label="群聊名称">
                    <el-input size="small"
                              :disabled="!isGroupLeader"
                              @keyup.enter.native="updateGroupChatMessage($event)"
                              :placeholder="isGroupLeader?this.groupChatMessage.groupChatName:'仅群主可以进行修改'"
                              v-model="groupChatMessage.groupChatName"></el-input>
                </el-form-item>
<!--                <el-form-item label="群公告">-->
<!--                    <el-input v-model="groupChatMessage.region"></el-input>-->
<!--                </el-form-item>-->
                <el-form-item label="备注">
                    <el-input size="small"
                              placeholder="群聊备注仅自己可见"
                              v-model="groupChatMessage.groupChatRemark" @keyup.enter.native="updateGroupChatMessage($event)" ></el-input>
                </el-form-item>
                <el-form-item label="我在本群的名称">
                    <el-input size="small"
                              placeholder="本群昵称全部人可见"
                              v-model="groupChatMessage.customizeRemark" @keyup.enter.native="updateGroupChatMessage($event)"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <el-divider></el-divider>
        <!--        操作栏-->
        <div class="operation-tool">
            <div class="clear-group-record" @click="clearGroupChatMessage"><span>清空聊天记录</span></div>
            <div class="back-chatgroup">
                <span @click.prevent="leaveGroupChat" v-if="!isGroupLeader">退出群聊</span>
                <span @click.prevent="disbandGroupChat" v-else-if="isGroupLeader">解散群聊</span>
            </div>
        </div>
        <el-dialog
                append-to-body
                title="拉入群聊"
                :visible.sync="pullChatView"
                width="30%"
                :before-close="handleClose">
            <el-input placeholder="搜索好友(昵称/备注)"
                      prefix-icon="el-icon-search"
                      clearable
                      style="width: 250px;margin-bottom: 5px"
                      @input="getFriend"
                      v-model="keyword" class="input-with-select" size="mini">
            </el-input>
            <div style="height: 200px">
                <el-table
                        ref="multipleTable"
                        :data="tableData"
                        tooltip-effect="dark"
                        :show-header="false"
                        @selection-change="handleSelectionChange"
                        style="width: 100%;height: 200px">
                    <el-table-column
                            type="selection"
                            width="50">
                    </el-table-column>
                                      <el-table-column
                            width="60px">
                        <template slot-scope="scope">
                            <!-- 插槽内容，可以自定义表头 label -->
                            <el-avatar size="large" :src="scope.row.avatar"></el-avatar>
                        </template>
                    </el-table-column>

                    <el-table-column :show-overflow-tooltip='true' width="195px">
                        <template slot-scope="scope">
                            <p>{{scope.row.remark}}</p>
                            <!-- 插槽内容，可以自定义表头 label -->
                        </template>
                    </el-table-column>
                    <el-table-column
                    >
                    </el-table-column>
                </el-table>
            </div>

            <span slot="footer" class="dialog-footer">
    <el-button @click="cancel()">取 消</el-button>
    <el-button type="primary" @click="confirm()">确 定</el-button>
  </span>
        </el-dialog>
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
                pullChatView:false,
                tableData:[],
                groupChatMessage:{},
                groupChatMessageMediator:{},
                keyword:null,
                multipleSelection: null,
            }
        },
        props: {
            item: {
                type: Object,
            }
        },
        methods: {
            selectMember(item){

            },
            getFriend() {
                service.get("/users/notGroupChatFriend", {
                    params: {
                        keyword: this.keyword,
                        groupId: this.item.friendshipId
                    }
                }).then(res => {
                    this.tableData = res.data
                })
            },
            confirm(){
                let newSet = this.multipleSelection.map(obj => Number(obj.friendId));
                const params={
                    groupChatId:this.item.friendshipId,
                    friendIds:newSet,
                };
                service({
                    method:"post",
                    url:"/users/pullGroupChat",
                    data:params
                }).then(res=>{

                    if (res.code===20000){
                        this.$notify({
                            title:"拉入群聊",
                            type:"success",
                            message:"拉入群聊成功"
                        });
                        this.pullChatView = false;
                        this.tableData = []
                    }else {
                        this.$notify({
                            title:"拉入群聊",
                            type:"error",
                            message:res.message
                        });
                    }
                }).catch(()=>{
                    this.pullChatView = false;
                })
            },
            cancel(){
                this.pullChatView = false;
                this.multipleSelection = null
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            pullPeople(){
                this.pullChatView = true;
                this.getFriend()
            },
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
                    url: "/users/groupChat",
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
            groupChatMessageList(groupChatId){
                service({
                    method: "get",
                    url: "/users/groupChatMessage",
                    params: {
                        chatGroupId: groupChatId
                    }
                }).then(res=>{
                    this.groupChatMessage = res.data;
                    this.groupChatMessageMediator = JSON.parse(JSON.stringify(res.data))
                })
            },
            updateGroupChatMessage(event){
                if (this.groupChatMessage.groupChatName==null || this.groupChatMessage.groupChatName===''){
                    this.$notify({
                       type:"warning",
                        title:"修改群聊信息",
                        message:"群聊昵称不能为空"
                    });
                    this.groupChatMessage = this.groupChatMessageMediator;
                    return
                }
                service.put("/users/update/groupChatMessage",this.groupChatMessage).then(res=>{
                    if (res.flag){
                        if (event){
                            event.target.blur()
                        }
                        this.$notify({
                            type:"success",
                            title:"修改群聊信息",
                            message:"修改成功"
                        })
                    }
                })
            },
            leaveGroupChat() {
                this.$confirm('确定需要退出群聊吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    service.put(`users/leaveGroupChat/${this.item.friendshipId}`).then(res => {
                        if (res && res.code === 20000) {
                            asidefriend.initAsideFriend();
                            wechat.initContainer();
                            this.$notify({
                                title:"退出群聊",
                                type:"success",
                                message:res.message
                            })
                        } else {
                            this.$notify({
                                title:"退出群聊",
                                type:"error",
                                message:res.message
                            })
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
                        url: `users/groupChat/disbandGroupChat/${this.item.friendshipId}`
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
                    url: "users/groupChat/isGroupLeader",
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
                    service.delete(`users/groupChatStorage/clearGroupChatMessage/${this.item.friendshipId}`).then(res => {
                        if (res && res.code === 20000) {
                            chatcontent.initMessage();
                            this.$notify({
                                title:"清空记录",
                                type:"success",
                                message:res.message
                            });
                        } else {
                            this.$notify({
                                title:"清空记录",
                                type:"error",
                                message:res.message
                            });
                        }
                    })
                }).catch(() => {
                });

            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
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
        text-align: center;
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
        margin: 3px 7px 3px 7px;
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
    .group-chat-message{
        margin-top: 20px;
    }
    /deep/.el-form--label-top .el-form-item__label{
        padding: 0;
    }
    /deep/.el-form-item__label{
        line-height: 0;
    }
    /deep/.el-form-item{
        margin-bottom:0
    }
  /deep/.el-form--label-top .el-form-item__label{
        font-weight: 600;
 }
    /* 利用穿透，设置input边框隐藏 */
    /deep/ .group-chat-message .el-input__inner{
        border-radius: 0;
        border: 0;
        border:none;
        padding: 0 5px;
    }
    /deep/ .el-input__inner:focus{
        background-color: #f6f6f6;
    }
</style>
