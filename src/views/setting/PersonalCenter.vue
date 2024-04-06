<template>
    <div class="index">
        <el-card class="box-card">
            <div style="display: flex;flex-direction: row">
                <div class="contentMain">
                    <div>
                        <el-form ref="form" :model="personalForm" label-width="80px">
                            <el-form-item>
                                <el-upload
                                        class="avatar-uploader"
                                        action="http://localhost:8001/api/upload/oss"
                                        :on-success="handleAvatarSuccess"
                                        :headers = 'headers'
                                        :show-file-list="false"
                                        :before-upload="oss_upload">
                                    <el-image class="avatar" v-if="personalForm.avatar!=null"
                                              :src="personalForm.avatar"></el-image>
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </el-form-item>
                            <el-form-item label="登入名">
                                <el-input :readonly="true" style="width: 250px" size="small"
                                          v-model="personalForm.username"></el-input>
                            </el-form-item>
                            <el-form-item label="昵称">
                                <el-input style="width: 250px" size="small" v-model="personalForm.nickName"></el-input>
                            </el-form-item>
                            <el-form-item label="手机">
                                <el-input style="width: 250px" :disabled="true" size="small"
                                          v-model="personalForm.phone">
                                    <el-button @click="bindingModification(personalForm.id,'phone')" slot="append"
                                               class="update_button">
                                        <span v-if="personalForm.phone">修改</span>
                                        <span v-else>绑定</span>
                                    </el-button>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="邮箱">
                                <el-input style="width: 250px" :disabled="true" size="small"
                                          v-model="personalForm.email">
                                    <el-button @click="bindingModification(personalForm.id,'email')" slot="append"
                                               class="update_button">
                                        <span v-if="personalForm.email">修改</span>
                                        <span v-else>绑定</span>
                                    </el-button>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="隐藏自己">
                                <el-select style="width: 150px" size="small" v-model="personalForm.allowSearching"
                                           placeholder="是否允许被搜索">
                                    <el-option label="是" :value="0"></el-option>
                                    <el-option label="否" :value="1"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="性别">
                                <el-select style="width: 150px" size="small" v-model="personalForm.gender"
                                           placeholder="选择性别">
                                    <el-option label="女" :value="0"></el-option>
                                    <el-option label="男" :value="1"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="生日">
                                <div class="block">
                                    <el-date-picker
                                            size="small"

                                            v-model="personalForm.dateBirth"
                                            type="date"
                                            value-format="yyyy-MM-dd"
                                            placeholder="选择日期">
                                    </el-date-picker>
                                </div>
                            </el-form-item>
                            <el-form-item label="住址">
                                <el-input style="width: 300px" type="textarea"
                                          v-model="personalForm.address"></el-input>
                            </el-form-item>
                            <el-form-item label="简介">
                                <el-input style="width: 300px"
                                          maxlength="20"
                                          show-word-limit
                                          type="textarea" v-model="personalForm.intro"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="info" @click="cancel">取消</el-button>
                                <el-button type="primary" @click="onSubmit">提交</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div style="display:flex;flex-direction: column">
                    <el-button type="info" @click="visualization" v-if="!visualizationShow">
                        <span >展开动态</span>
                        <i class="el-icon-arrow-down"></i>
                    </el-button>
                    <el-button type="primary" @click="visualization" v-if="visualizationShow">
                        <span >关闭动态</span>
                        <i class="el-icon-arrow-up"></i>
                    </el-button>
                </div>
                <!--                图形化-->
                <transition name="el-zoom-in-top">
                    <div class="visualization" v-show="visualizationShow">
                        <div>
                            <el-row :gutter="31">
                                <el-col :span="8">
                                    <el-card>
                                        <div class="card-icon-container">
                                            <FriendCount class="card-icon-container"/>
                                        </div>
                                        <div class="card-desc">
                                            <div class="card-title">好友数</div>
                                            <div class="card-count">{{this.friendCount}}</div>
                                        </div>
                                    </el-card>
                                </el-col>
                                <el-col :span="8">
                                    <el-card>
                                        <div class="card-icon-container">
                                            <GroupChatCount class="card-icon-container"/>
                                        </div>
                                        <div class="card-desc">
                                            <div class="card-title">群聊数</div>
                                            <div class="card-count">{{this.groupChatCount}}</div>
                                        </div>
                                    </el-card>
                                </el-col>
                                <el-col :span="8">
                                    <el-card>
                                        <div class="card-icon-container">
                                            <ActivityValue class="card-icon-container"/>
                                        </div>
                                        <div class="card-desc">
                                            <div class="card-title">活跃值</div>
                                            <div class="card-count">{{activityValue}}</div>
                                        </div>
                                    </el-card>
                                </el-col>

                            </el-row>
                        </div>
                        <div>
                            <el-card style="margin-top: 1rem">
                                <span style="font-weight: bold">近期活跃视图</span>
                                <ChatHistoryAnalysis v-if="chatHistoryData" :chatHistoryData="chatHistoryData"/>
                            </el-card>
                        </div>
                        <div style="height: 320px">
                            <el-card style="margin-top: 1rem">
                                <span style="font-weight: bold">登入通知</span>
                                <div style="height: 240px">
                                    <el-scrollbar style="height: 100%;width: 100%" wrap-style="overflow-x:hidden;">
                                        <div style="display: flex;flex-direction: column;justify-content: center;align-items: center">
                                            <div v-for="loginRecord in loginRecordsDTOList">
                                                <el-card style="margin: 10px">
                                                    <div class="main" style="height: 225px;width: 350px;margin: 10px">
                                                        <div class="title">
                                                            <span><i class="el-icon-warning" style="color: red"></i>{{loginRecord.title}}</span>
                                                        </div>
                                                        <div class="description">
                                                            {{loginRecord.description}}
                                                        </div>
                                                        <div class="detail">
                                                            <div>
                                                                <span class="title">登入时间:</span><span>{{loginRecord.createTime}}</span>
                                                            </div>
                                                            <div>
                                                                <span class="title">登入方式:</span><span>{{loginRecord.loginMethod}}</span>
                                                            </div>
                                                            <div>
                                                                <span class="title">登入地点:</span><span>{{loginRecord.ipSource}}</span>
                                                            </div>
                                                        </div>
                                                        <div class="suggestion">
                                                            <span>{{loginRecord.suggestion}}</span>
                                                        </div>
                                                        <div class="operate" @click="updatePassword">
                                                            <span>修改密码</span>
                                                            <span style="float: right;padding-top: 3px" class="el-icon-arrow-right"></span>
                                                        </div>
                                                    </div>
                                                </el-card>

                                            </div>
                                        </div>
                                    </el-scrollbar>
                                </div>
                            </el-card>
                        </div>
                    </div>
                </transition>
            </div>
        </el-card>
        <UpdateEmailOrPhone ref="updateEmailOrPhone"/>

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
    </div>
</template>
<script>
    import GroupChatCount from "@/assets/icon/group-chat-count.svg"
    import ActivityValue from "@/assets/icon/activity-value.svg"
    import FriendCount from "@/assets/icon/friend-count.svg"
    import ChatHistoryAnalysis from "../../components/Setting/ChatHistoryAnalysis";
    import service from "../../http";
    import UpdateEmailOrPhone from "../../components/Setting/UpdateEmailOrPhone";
    import store from "../../store";

    export default {
        components: {
            UpdateEmailOrPhone,
            ChatHistoryAnalysis,
            FriendCount,
            GroupChatCount,
            ActivityValue
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
                headers:{Authorization: store.getters.token},
                objectData: {
                    OSSAccessKeyId: '',
                    policy: '',
                    Signature: '',
                    key: '',
                    host: '',
                    dir: ''
                },
                updatePasswordForm: {
                    oldPassword: null,
                    newPassword: null,
                    confirmPassword: null
                },
                visualizationShow:false,
                friendCount: 0,
                groupChatCount: 0,
                chatHistoryData: null,
                activityValue:0,
                loginRecordsDTOList:null,
                fits: ['fill', 'contain', 'cover', 'none', 'scale-down'],
                imageUrl: null,
                dialogImageUrl: '',
                updatePasswordView:false,
                personalForm: {
                    username: "",
                    avatar: "",
                    nickName: "",
                    gender: 1,
                    allowSearching:null,
                    address: "",
                    dateBirth: "",
                    phone: "",
                    email: "",
                    intro: null,
                },
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
        }, methods: {
            onSubmit() {
                this.personalForm.dateBirth = new Date(this.personalForm.dateBirth)
                service({
                    method: "post",
                    url: "users/save/userInfo",
                    data: this.personalForm
                }).then(res => {
                    var userInfo = this.$store.getters.userLogin;
                    if (res.code) {
                        userInfo.avatar = res.data.avatar;
                        userInfo.nickName = res.data.nickName;
                        userInfo.gender = res.data.gender;
                        userInfo.dateBirth = res.data.dateBirth;
                        userInfo.address = res.data.address;
                        userInfo.username = res.data.username;
                        this.$store.dispatch("user/updateUserInfo", userInfo);
                        this.$notify({
                            title: "个人信息",
                            type: "success",
                            message: "修改成功"
                        });
                    }
                })
            },
            oss_upload(file) {
                const isJPG = file.type === 'image/jpeg';
                if (!isJPG) {
                    this.$notify({
                        title: "上传头像图片",
                        type: "error",
                        message: "上传头像图片只能是 JPG 格式!"
                    });
                }
                return isJPG;
            },
            getData() {
                service({
                    method: "get",
                    url: "/users"
                }).then(res => {
                    this.friendCount = res.data.friendCount;
                    this.groupChatCount = res.data.groupChatCount;
                    this.chatHistoryData = res.data.chatHistoryDTOList;
                    this.activityValue = res.data.activityValue;
                    this.loginRecordsDTOList = res.data.loginRecordsDTOList
                })
            },
            visualization(){
            this.visualizationShow = !this.visualizationShow
            },
            handleAvatarSuccess(res, file) {
                this.personalForm.avatar = res.message
            },
            cancel() {
                this.getUserInfo()
            },
            getUserInfo() {
                service.get("users/userInfo/personal").then(res => {
                    this.personalForm = res.data;
                })
            },
            bindingModification(id, type) {
                this.$refs.updateEmailOrPhone.selectUpdateView(id, type)
            },
            updatePassword(){
                this.updatePasswordView = true;
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
            updatePasswordClose() {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        this.$refs.updatePasswordForm.resetFields();
                        this.updatePasswordView = false
                    })
                    .catch(_ => {
                    });

            },
        }, mounted() {
            this.getData();
            this.getUserInfo()
        }
    }
</script>
<style>
    .index {
        margin: 20px auto;
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
        font-size: 28px;
        color: #8c939d;
        width: 100px;
        height: 100px;
        line-height: 100px;
        text-align: center;
    }

    .avatar {
        width: 100px;
        height: 100px;
        display: block;
    }

    .box-card {
        margin: 0 auto;
        width: 97%;
    }

    .contentMain {

    }

    .update_button :hover {
        color: #adadad;
    }

    .visualization {
        margin-left: 3rem;
        display: flex;
        flex-direction: column;
    }

    .card-icon-container {
        display: inline-block;
        width: 60px;
        height: 60px;
    }

    .card-desc {
        font-weight: bold;
        float: right;
    }

    .card-title {
        margin-top: 0.3rem;
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 1rem;
    }

    .card-count {
        margin-top: 0.75rem;
        color: #666;
        font-size: 1.25rem;
    }

    .el-carousel__item h3 {
        color: #475669;
        font-size: 14px;
        opacity: 0.75;
        line-height: 200px;
        margin: 0;
    }


    .main .title {
        font-weight: bold;
    }

    .main .description{
        margin-top: 10px;
        font-size: 14px;
    }

    .main  .suggestion {
        margin-bottom: 10px;
        font-size: 14px;
    }
    .main .detail {
        display: flex;
        flex-direction: column;
        margin: 10px 0 10px 0;
    }
    .main .detail div{
       margin-top: 5px;
    }
    .main .detail .title{
        font-size: 14px;
        color: #999999;
        margin-right: 8px;
    }
    .main .operate{
        font-weight: 600;
        color: #9993f9;
        font-size: 14px;
        cursor: pointer;
        padding-top: 8px;
        border-top: 1px solid #999999;
    }

    .main .operate:hover{
        color: #8776f9;
    }
</style>
