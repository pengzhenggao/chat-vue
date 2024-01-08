<template>
    <div>
        <el-form :model="registerForm" :rules="rules" ref="loginForm" class="demo-ruleForm">
            <el-form-item prop="username">
                <el-input v-model="registerForm.username" placeholder="输入登入名" size="medium">
                    <el-button slot="prepend" icon="el-icon-user"></el-button>
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" v-model="registerForm.password" placeholder="输入登入密码" size="medium">
                    <el-button slot="prepend" icon="el-icon-lock"></el-button>
                </el-input>
            </el-form-item>
            <el-form-item prop="confirmPassword">
                <el-input type="password" v-model="registerForm.confirmPassword" placeholder="再次输入登入密码" size="medium">
                    <el-button slot="prepend" icon="el-icon-lock"></el-button>
                </el-input>
            </el-form-item>
            <el-form-item prop="email">
                <el-input v-model="registerForm.email" placeholder="输入邮箱" size="medium">
                    <el-button slot="prepend" icon="el-icon-folder-checked"></el-button>
                </el-input>
            </el-form-item>
            <el-form-item prop="code">
                <el-input v-model="registerForm.code"
                          :disabled="registerForm.email==='' || registerForm.email.length<=0" placeholder="输入验证码"
                          size="medium">
                    <el-button v-if="registerForm.email!=='' || registerForm.email.length>0" slot="append"
                               style="width: 120px;">
                        <span @click.prevent="sendCode" v-if="!isSend">{{sendmsg}}</span>
                        <span v-if="isSend">{{sendmsg}}</span>
                    </el-button>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="medium" :loading="loading"
                           style="width:100%;padding: 12px 0 12px 0"
                           @click="submitForm('loginForm')">立即注册
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import service from "../../http";

    export default {
        name: "AccountRegister",
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
                } else if (value !== this.registerForm.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            var validateEMail = (rule, value, callback) => {
                const reg = /^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/;
                if (value == '' || value == undefined || value == null) {
                    callback();
                } else {
                    if (!reg.test(value)) {
                        callback(new Error('请输入正确的邮箱'));
                    } else {
                        callback();
                    }
                }
            }
            return {
                sendmsg: "发送验证码",
                isSend: false,
                loading: false,
                registerForm: {  // 登陆表单
                    username: '',
                    password: '',
                    confirmPassword: "",
                    email: "",
                    code: '',
                },
                rules: {  //登陆验证规则
                    username: [
                        {required: true, message: '请输入用户名', trigger: ['change']},
                        {min: 2, max: 18, message: '长度在 2 到 18 个字符', trigger: ['change']},
                    ],
                    password: [
                        {required: true, message: '请输入登入密码', trigger: ['change']},
                        {min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: ['change']},
                        {validator: validatePass, trigger: ['blur']}
                    ],
                    confirmPassword: [
                        {required: true, message: '请再次输入登入密码', trigger: ['change']},
                        {min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: ['change']},
                        {validator: validatePass2, trigger: 'blur'}
                    ],
                    email: [
                        {validator: validateEMail, trigger: ['change']}
                    ]
                }
            }
        }, methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        this.register()
                    } else {
                        return false;
                    }
                });
            },
            register() {
                service({
                    method: "post",
                    url: "/userAuth/register/emailRegister",
                    data: this.registerForm
                }).then(res => {
                    if (res.code === 20000) {
                        this.$notify({
                            title: "邮箱号注册",
                            type: "success",
                            message: "注册成功"
                        });
                        this.$router.push("/login");
                        this.loading = false
                    }
                }).catch(() => {
                    this.loading = false
                })
            },
            sendCode() {
                var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (regex.test(this.registerForm.email)) {
                    service({
                        method: "get",
                        url: "/userAuth/sendCode/emailRSC",
                        params: {
                            account: this.registerForm.email
                        }
                    }).then(res => {
                        if (res.code === 20000) {
                            this.$notify({
                                title:"获取验证码",
                                type:"success",
                                message:"发送成功"
                            });
                            this.isSend = true;
                            let timer = 60;
                            this.sendmsg = timer + "s";
                            this.timeFun = setInterval(() => {
                                --timer;
                                this.sendmsg = timer + "s";
                                if (timer === 0) {
                                    this.isSend = false;
                                    this.sendmsg = "重新发送";
                                    clearInterval(this.timeFun);
                                }
                            }, 1000);
                        }
                    })
                }
            }
        }
    }
</script>

<style scoped>
    .login-blocks a {
        margin-top: 8px;
        color: #999;
        font-size: 12px;
    }

    .login-blocks a:visited {

        text-decoration: none;
        color: #999;
    }

    .login-blocks {

        text-align: center;
        margin-top: -8px;
        display: flex;
        color: rgba(22, 26, 35, .3333333333333333);
        justify-content: space-between;
        text-align: justify;
    }

    .login-links a:visited {
        text-decoration: none;
        color: #999;
    }

    .el-form-item {
        margin-bottom: 20px;
    }
</style>
