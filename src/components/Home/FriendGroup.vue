<template>
    <div  v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0)">
        <div>
            <el-button type="primary" @click="openCreate">创建分组</el-button>
        </div>
        <div style="margin-top: 10px">
            <el-table
                    :data="tableData"
                    style="width: 100%;margin-bottom: 20px;"
                    row-key="id"
                    border
                    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                <el-table-column
                        prop="date"
                        label="分组名"
                        width="180">
                    <template slot-scope="scope">
                        <span v-if="scope.row.groupName">{{scope.row.groupName}}</span>
                    </template>
                </el-table-column>

                <el-table-column
                        prop="avatar"
                        label="好友头像"
                >
                    <template slot-scope="scope">
                <span v-if="scope.row.avatar">
                    <el-image style="width: 50px;height: 50px" :src="scope.row.avatar"></el-image>
                </span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="remark"
                        label="好友备注名">
                </el-table-column>
                <el-table-column
                        prop="remark"
                        label="好友性别">
                    <template slot-scope="scope">
                        <div v-if="scope.row.gender">
                            <el-tag>
                                <span v-if="scope.row.gender===1">男</span>
                                <span v-else>女</span>
                            </el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作">
                    <template slot-scope="scope">
                        <div v-if="scope.row.friendId">
                            <el-button size="mini" type="primary" @click="sendMessage(scope.row.friendId,scope.row.remark,scope.row.id)"><i class="el-icon-thumb"></i>发消息</el-button>
                            <el-button
                                    size="mini"
                                    @click="updateGroup(scope.row.friendId)"
                                    type="warning"><i class="el-icon-edit"></i>改变分组
                            </el-button>
                        </div>
                        <div v-else-if="scope.row.groupName">
                            <el-button v-if="scope.row.isDefault!==1" type="text" @click="openUpdate(scope.row.id)"><i
                                    class="el-icon-edit"></i>修改分组
                            </el-button>
                            <el-button v-else-if="scope.row.isDefault===1" type="text" style="color: #cccccc">默认（不可修改）
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分组-->
        <el-dialog
                :title="form.id===null?'创建分组':'修改分组'"
                :visible.sync="centerDialogVisible"
                width="30%"
                center>
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="分组名">
                    <el-input v-model="form.groupName" placeholder="分组名"></el-input>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input type="text" oninput="value=value.replace(/[^\d.]/g,'')"
                              placeholder="排序"
                              v-model="form.sort"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
  </span>
        </el-dialog>
        <!-- 移出分组-->

        <el-dialog
                title="选择需要移动到的分组"
                :visible.sync="updateGroupView"
                width="30%"
                center>
            <div style="display: flex;justify-content: center">
                <el-select v-model="updateFriendGroup.groupId" filterable placeholder="请选择一个分组">
                    <el-option
                            v-for=" item in groupList"
                            :key="item.id"
                            :label="item.groupName"
                            :value="item.id">
                    </el-option>
                </el-select>
            </div>

            <span slot="footer" class="dialog-footer">
    <el-button @click="updateGroupView = false">取 消</el-button>
    <el-button type="primary" @click="confirmMoveFriendGroup">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    import service from "../../http";

    export default {
        name: "FriendGroup",
        data() {
            return {
                centerDialogVisible: false,
                form: {
                    id: null,
                    groupName: "",
                    sort: 5
                },
                updateGroupView: false,
                loading:false,
                groupList: [],
                tableData: [],
                updateFriendGroup: {
                    friendId: "",
                    groupId: "",
                }

            }
        },
        methods: {
            init() {
                this.loading = true
                service({
                    method: "get",
                    url: "/getFriendGroup"
                }).then(res => {
                    this.tableData = res.data;
                   this.groupList = res.data;
                    this.loading = false
                }).catch(()=>{
                    this.loading = false
                })
            },
            confirm() {
                //创建
                if (this.form.id === null) {
                    service({
                        method: "post",
                        url: "/addFriendGroup",
                        data: this.form
                    }).then(res => {
                        if (res.code === 20000) {
                            this.$notify({
                                title: "创建分组成功"
                            });
                            this.init();
                            this.cancel()
                        }
                    })
                } else { //更新
                    service({
                        method: "put",
                        url: "/updateFriendGroup",
                        params: {
                            groupId: this.form.id,
                            groupName: this.form.groupName,
                            sort: this.form.sort
                        }
                    }).then(res => {
                        if (res.code === 20000) {
                            this.$notify({
                                title: "更新分组成功"
                            });
                            this.init();
                            this.cancel()
                        }
                    })
                }
            },
            openCreate() {
                this.centerDialogVisible = true
            },
            openUpdate(groupId) {
                service({
                    method: "get",
                    url: "/getByIdGroup",
                    params: {
                        groupId: groupId
                    }
                }).then(res => {
                    this.form.id = res.data.id;
                    this.form.groupName = res.data.groupName;
                    this.form.sort = res.data.sort;
                    this.centerDialogVisible = true;
                })
            },
            cancel() {
                this.centerDialogVisible = false;
                this.form = {
                    id: null,
                    groupName: "",
                    sort: 5
                }
            },
            updateGroup(friendId) {
                service({
                    method: "get",
                    url: "/getBelongsGroup",
                    params: {
                        friendId: friendId
                    }
                }).then(res => {
                    if (res.code === 20000 && res.data) {
                        this.updateFriendGroup.groupId = res.data.id;
                        this.updateFriendGroup.friendId = friendId;
                        this.updateGroupView = true
                    } else {
                        this.$notify({
                            title: "失败",
                            type:"error",
                            message: "请刷新页面重试"
                        })
                    }
                })
            },
            confirmMoveFriendGroup(){
               service({
                   method:"post",
                   url:"moveFriendGroup",
                   data:this.updateFriendGroup
               }).then(res=>{
                   if (res && res.code===20000){
                       this.$notify({
                           title:"",
                           type:"success",
                           message:"移动成功"
                       });
                       this.init();
                       this.updateFriendGroup= {
                           friendId: "",
                           groupId: "",
                       };
                       this.updateGroupView = false
                   }
               })
            },
            sendMessage(userInfoId,remark,friendId){
                this.$router.replace({
                    path:"communication/wechat",
                    query:{
                        friendId:friendId,
                        remark:remark,
                        userInfoId:userInfoId
                    }
                })
            }
        }, mounted() {
            this.init()
        }
    }
</script>

<style scoped>

</style>
