<template>
    <div>
        <el-steps :active="active" simple>
            <el-step title="基本信息" icon="el-icon-s-promotion"></el-step>
            <el-step title="群聊人员" icon="el-icon-s-custom"></el-step>
        </el-steps>

        <div v-if="active === 1" style="margin: 10px 45px 0 0;display: flex;justify-content: center">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="50px" >
                <el-form-item prop="imageUrl" label="头像">
                    <el-upload
                            class="avatar-uploader"
                            action="http://localhost:8001/api/upload/oss"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <el-image class="avatar" v-if="ruleForm.imageUrl!=null"
                                  :src="ruleForm.imageUrl"></el-image>
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item prop="groupChatName" label="名称">
                    <el-input size="small" v-model="ruleForm.groupChatName" autocomplete="off"></el-input>
                </el-form-item>
                <el-button type="primary" style="margin-left: 100px" @click="next('ruleForm')">下一步</el-button>
            </el-form>
        </div>
        <div v-if="active === 2" style="margin-top: 10px">
            <div class="search">
                <el-input placeholder="搜索好友(昵称/备注)"
                          prefix-icon="el-icon-search"
                          clearable
                          @input="init"
                          v-model="keyword" class="input-with-select" size="mini">
                </el-input>
            </div>
            <el-container>
                <el-main>
                    <div class="friends">
                        <el-table
                                ref="multipleTable"
                                :data="tableData"
                                tooltip-effect="dark"
                                :show-header="false"
                                @selection-change="handleSelectionChange"
                                style="width: 100%">
                            <el-table-column
                                    type="selection"
                                    width="30">
                            </el-table-column>
                            <el-table-column
                                    width="50px">
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
                        </el-table>
                    </div>
                </el-main>
            </el-container>
            <div class="footer">
                <el-button type="info" @click="cancel">取消</el-button>
                <el-button type="primary" @click="back">上一步</el-button>
                <el-button type="primary" @click="build">创建</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import service from "../../http";
    import {asidefriend} from "../../listening/asidefriend";

    export default {
        name: "BuildGroupChat",
        data() {
            return {
                ruleForm:{
                    groupChatName:null,
                    imageUrl:null
                },
                active: 1,
                tableData: [],
                multipleSelection: null,
                keyword: null,
                rules: {
                    groupChatName: [{ required:true, message:"必须填写群聊名", trigger: 'change' }],
                    imageUrl:[{required:true, message:"群头像必须选择", trigger: 'change'}]
                }
            }
        },
        methods: {
            init() {
                service.get("/buildGroupChatShow", {
                    params: {
                        keyword: this.keyword
                    }
                }).then(res => {
                    this.tableData = res.data
                })
            },
            build() {
                let newSet = this.multipleSelection.map(obj => Number(obj.friendId));
                const params={
                    groupName:this.ruleForm.groupChatName,
                    userInfoIds:newSet,
                    avatar:this.ruleForm.imageUrl
                };
                service.post("/groupChat",params).then(res=>{
                    if (res.code===20000){
                        this.$notify({
                            type:"success",
                            title:"创建群聊",
                            message:"创建群聊成功"
                        });
                        asidefriend.initAsideFriend();
                        this.cancel()
                    }else{
                        this.$notify({
                            type:"error",
                            title:"创建群聊",
                            message:res.message
                        })
                    }
                })
            },
            handleAvatarSuccess(res, file) {
                this.ruleForm.imageUrl = res.message
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            cancel() {
                this.$emit('cancelBuildGroupChat');
                this.initData()
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            initData() {
                this.multipleSelection = null;
                this.keyword = null;
                this.ruleForm.groupChatName = null;
                this.ruleForm.imageUrl = null
                this.active = 1
            },
            next(ruleForm) {
                this.$refs[ruleForm].validate(valid=>{
                    if (valid){
                        this.active++
                    }
                })

            },
            back(){
                this.active--
            }
        }, mounted() {
            this.init()
        }
    }
</script>

<style scoped>

    .el-main {
        background-color: #ffffff;
        color: #333;
        height: 250px;
        border-radius: 6px;
    }

    body > .el-container {
        margin-bottom: 40px;
    }

    .footer {
        justify-content: center;
        margin-top: 10px;
        display: flex;
        flex-direction: row;
    }

    .search {
        text-align: center;
        margin: 0 auto;
    }

    .friends {
        display: flex;
        flex-direction: column;
    }

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        border: 1px dashed #d9d9d9;
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>
