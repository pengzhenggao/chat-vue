<template>
    <div>
        <el-header>
            <div class="cMKEaF">
                <el-page-header @back="goBack" content="设置密码">
                </el-page-header>
            </div>
        </el-header>
        <div class="setPassword-title">设置密码</div>
        <div class="content">
            <div class="BJ">
                <el-form ref="form" :model="form" label-position="top" :rules="rules" label-width="80px">
                    <el-form-item prop="newPassword" label="新密码">
                        <el-input type="password" clearable show-password style="width: 340px"  placeholder="输入新密码" v-model="form.newPassword"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="confirmPassword">
                        <el-input type="password" clearable show-password style="width: 340px" placeholder="再次输入新密码" v-model="form.confirmPassword"></el-input>
                    </el-form-item>
                    <el-form-item >
                        <el-button style="width: 340px" type="warning" @click="submit('form')">确认修改</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div style="text-align: center;margin-top: 15px;color: #666;font-size: 13px">
                <span>@2023 即时聊天系统(网页版)</span>
            </div>
        </div>
    </div>
</template>

<script>
    import service from "../../http";

    export default {
        name: "SetPassword",
        data() {
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.form.newPassword) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                form: {
                    newPassword: "",
                    confirmPassword: "",
                    token:""
                },
                rules: {  //登陆验证规则
                    newPassword: [
                        {required: true, message: '请输入登入密码', trigger: ['change']},
                        {min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: ['change']},
                        {validator: validatePass, trigger: ['change']}
                    ],
                    confirmPassword: [
                        {required: true, message: '请再次输入登入密码', trigger: ['change']},
                        {min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: ['change']},
                        {validator: validatePass2, trigger:'change'}
                    ],
                }
            }
        }, methods: {
            submit(form){
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        service({
                            method:"post",
                            url:"users/forgot/updatePassword",
                            data:this.form
                        }).then(res=>{
                            if (res.code===20000){
                                this.$notify({
                                    title:"修改密码",
                                    type:"success",
                                    message:"修改密码成功"
                                });
                                this.$router.push("/login")
                            }
                        })
                    }
                })
            },
            goBack() {
                this.$router.push("/login")
            }
        },mounted() {
            var token =this.$route.query.token;
            if (token){
                this.form.token = this.$route.query.token
            }else{
                this.$router.push("/login")
            }

        }
    }
</script>

<style scoped>
    .setPassword-title {
        color: var(--title-text-color, #181818);
        font-size: 22px;
        font-weight: 500;
        margin-top: 26px;
        text-align: center;
    }

    .el-header {
        background-color: #ffffff;
        text-align: center;
        line-height: 60px;
        box-shadow: 0px 1px 5px 0px #dadada;
    }

    .content {
        margin-top: 50px;
    }

    .cMKEaF {
        padding: 20px 24px;
        height: 100%;
        margin: 0px auto;
        -webkit-box-align: center;
        align-items: center;
    }

    .BJ {
        height: 469px;
        padding-top: 40px;
        display: flex;
        justify-content: center;
        background-color: #f8f8f8;
    }
    /deep/.el-form-item__label{
        line-height: 0;
    }
</style>
