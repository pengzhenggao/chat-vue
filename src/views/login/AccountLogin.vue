<template>
    <div>
        <el-form :model="loginForm" :rules="rules" ref="loginForm" class="demo-ruleForm">
            <el-form-item prop="username">
                <el-input v-model="loginForm.username" name="username" autocomplete="off"
                          :placeholder="$t('system.LARequirements')"
                          size="medium">
                    <el-button slot="prepend" icon="el-icon-user"></el-button>
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input v-model="loginForm.password" @keyup.enter.native="submitForm('loginForm')" name="password"
                          type="password" :placeholder="$t('system.loginPassword')" size="medium">
                    <el-button slot="prepend" icon="el-icon-key"></el-button>
                </el-input>

            </el-form-item>
            <el-checkbox v-model="isRememberMe"><span style="color: #999999">{{$t('system.rememberMe')}}</span></el-checkbox>
            <el-form-item style="margin-top: 15px">
                <el-button type="primary" size="medium" :loading="loading"
                           style="width:100%;padding: 12px 0 12px 0"
                           @click="submitForm('loginForm')"><span>{{$t('system.logInNow')}}</span>
                </el-button>
            </el-form-item>
            <div class="login-blocks login-links">
                <span class="forgotPassword" @click.prevent="forgotAccount()">{{$t('system.forgotAccount')}}</span>
                <span class="forgotPassword" @click.prevent="forgotPassword()">{{$t('system.forgotPassword')}}</span>
            </div>
        </el-form>
        <div>
            <el-dialog
                    :title="''"
                    :show-close="false"
                    :visible.sync="validationVisible"
                    :before-close="validationHandleClose"
                    width="330px">
                <LoginValidation :xl="this.xl" :yl="this.yl" :sliderName="this.sliderName" :username="this.loginForm.username"
                                 v-if="validationVisible"
                                 @closeValidation="closeValidation"
                                 @successValidation="successValidation"/>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import service from "../../http";

    const Base64 = require("js-base64").Base64;
    import LoginValidation from "../../components/SliderValidation/LoginValidation";

    export default {
        name: "AccountLogin",
        components: {
            LoginValidation
        },
        data() {
            let letterRule = (rule, value, callback) => {
                let reg = /^[a-zA-Z0-9_@.-]{4,18}$/
                if (value === '') {
                    callback(new Error('输入内容不能为空'));
                } else {
                    callback();
                }
            };
            return {
                xl: 0,
                yl: 0,
                sliderName: null,
                validationVisible: false,
                needValidation: false,
                isRememberMe: false,
                loading: false,
                loginForm: {  // 登陆表单
                    username: '',
                    password: ''
                },
                rules: {  //登陆验证规则
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {min: 2, max: 18, message: '长度在 2 到 18 个字符', trigger: 'blur'},
                        {validator: letterRule, trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: ['change']},
                        {validator: letterRule, trigger: 'change'}
                    ]
                }
            }
        }, methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid && !this.loading) {
                        this.loading = true;
                        setTimeout(() => {
                            this.login();
                        }, 700)

                    } else {
                        return false;
                    }
                });
            },
            login() {
                service({
                    method: "get",
                    url: "/sliderlocation",
                    params:{
                        type:"accountLogin"
                    }
                }).then(res => {
                    this.xl = res.data.xl;
                    this.yl = res.data.yl;
                    this.sliderName = res.data.sliderName;
                    this.validationVisible = true;
                })
            },
            successValidation() {
                this.validationVisible = false;
                this.$store.dispatch('user/login', this.loginForm)
                    .then(() => {
                        //判断是否记住密码
                        if (this.isRememberMe) {
                            let password = Base64.encode(this.loginForm.password); // base64加密
                            localStorage.setItem("username", this.loginForm.username);
                            localStorage.setItem("password", password);
                        } else {
                            localStorage.removeItem("username");
                            localStorage.removeItem("password");
                        }
                        // 登陆成功后重定向
                        this.$router.push({
                            path: this.$route.query.redirect || '/'
                        })
                        setTimeout(() => {
                            this.loading = false;
                        }, 1000)

                    }).catch(() => {
                    this.loading = false;
                })
            },
            closeValidation(){
                console.log(666)
                this.validationHandleClose()
            },
            forgotPassword() {
                this.$router.push("/account-find")
            },
            forgotAccount() {
                this.$router.push("/forgot-account")
            },
            populate() {
                let username = localStorage.getItem("username");
                if (username) {
                    this.loginForm.username = localStorage.getItem("username");
                    this.loginForm.password = Base64.decode(localStorage.getItem("password"));// base64解密
                    this.isRememberMe = true;
                }
            },
            validationHandleClose() {
                this.loading = false;
                this.validationVisible = false;
                this.$notify({
                    title: "登入验证",
                    type: "warning",
                    message: "验证关闭"
                })
            }
        }, mounted() {
            this.populate();
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
        margin-top: -22px;
        display: flex;
        color: rgba(22, 26, 35, .3333333333333333);
        justify-content: space-between;
        text-align: justify;
    }

    .login-links a:visited {
        text-decoration: none;
        color: #929292;
    }

    .forgotPassword {
        color: #999999;
        cursor: pointer;
        margin-top: 5px;
        font-size: 12px
    }

    /deep/ .el-dialog__header {
        padding: 0 20px 10px;
    }

    /deep/ .el-dialog__wrapper {
        top: 100px;
    }
</style>
