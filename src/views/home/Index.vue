<template>
    <div class="index">
        <el-card class="box-card">
            <div class="contentMain">
                <div>
                    <el-form ref="form" :model="personalForm" label-width="80px">
                        <el-form-item>
                            <el-upload
                                    class="avatar-uploader"
                                    action="http://localhost:8001/api/upload/oss"
                                    :on-success="handleAvatarSuccess"
                                    :show-file-list="false"
                                    :before-upload="oss_upload">
                                <el-image class="avatar" v-if="personalForm.avatar!=null"
                                          :src="personalForm.avatar"></el-image>
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="登入名">
                            <el-input style="width: 250px" size="small" v-model="personalForm.username"></el-input>
                        </el-form-item>
                        <el-form-item label="昵称">
                            <el-input style="width: 250px" size="small" v-model="personalForm.nickName"></el-input>
                        </el-form-item>
                        <el-form-item label="手机">
                            <el-input style="width: 250px" :disabled="true" size="small" v-model="personalForm.phone">
                                <el-button @click="bindingModification(personalForm.id,'phone')" slot="append" class="update_button">
                                    <span v-if="personalForm.phone">修改</span>
                                    <span v-else>绑定</span>
                                </el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="邮箱">
                            <el-input style="width: 250px" :disabled="true" size="small" v-model="personalForm.email">
                                <el-button @click="bindingModification(personalForm.id,'email')" slot="append" class="update_button">
                                    <span v-if="personalForm.email">修改</span>
                                    <span v-else>绑定</span>
                                </el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="性别">
                            <el-select style="width: 150px" size="small" v-model="personalForm.gender"
                                       placeholder="选择性别">
                                <el-option label="女" :value="0"></el-option>
                                <el-option label="男" :value="1"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="生日日期">
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
                            <el-input style="width: 300px" type="textarea" v-model="personalForm.address"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="cancel">取消</el-button>
                            <el-button type="primary" @click="onSubmit">提交</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </el-card>
        <UpdateEmailOrPhone ref="updateEmailOrPhone"/>
    </div>
</template>
<script>
    import service from "../../http";
    import {uploadImage} from "../../http/api/upload";
    import UpdateEmailOrPhone from "../../components/Home/UpdateEmailOrPhone";
    export default {
        components:{
            UpdateEmailOrPhone
        },
        data() {
            return {
                objectData: {
                    OSSAccessKeyId: '',
                    policy: '',
                    Signature: '',
                    key: '',
                    host: '',
                    dir: ''
                },
                fits: ['fill', 'contain', 'cover', 'none', 'scale-down'],
                imageUrl: null,
                dialogImageUrl: '',
                personalForm: {
                    username:"",
                    avatar: "",
                    nickName: "",
                    gender: 1,
                    address: "",
                    dateBirth: "",
                    phone: "",
                    email: "",
                }
            }
        }, methods: {
            onSubmit() {
                this.personalForm.dateBirth=new Date(this.personalForm.dateBirth)
                service({
                    method: "post",
                    url: "/save/userInfo",
                    data: this.personalForm
                }).then(res => {
                    var userInfo = this.$store.getters.userLogin;
                    if (res.code){
                        userInfo.avatar = res.data.avatar;
                        userInfo.nickName = res.data.nickName;
                        userInfo.gender = res.data.gender;
                        userInfo.dateBirth = res.data.dateBirth;
                        userInfo.address = res.data.address;
                        userInfo.username = res.data.username;
                        this.$store.dispatch("user/updateUserInfo",userInfo);
                        this.$notify({
                            title:"个人信息",
                            type:"success",
                            message:"修改成功"
                        });
                    }
                })
            },
            oss_upload(file) {
                const isJPG = file.type === 'image/jpeg';
                if (!isJPG) {
                    this.$notify({
                        title:"上传头像图片",
                        type:"error",
                        message:"上传头像图片只能是 JPG 格式!"
                    });
                }
                return isJPG ;
            },
            handleAvatarSuccess(res, file){
                this.personalForm.avatar = res.message
            },
            cancel(){
                this.getUserInfo()
            },
            getUserInfo() {
                service.get("/userInfo/personal").then(res => {
                    this.personalForm = res.data;
                })
            },
            bindingModification(id,type){
                this.$refs.updateEmailOrPhone.selectUpdateView(id,type)
            }
        }, mounted() {
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

        justify-content: center;
        display: flex;
        flex-direction: column;
    }

    .update_button :hover {
        color: #adadad;
    }
</style>
