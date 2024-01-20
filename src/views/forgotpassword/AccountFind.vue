<template>
    <div>
        <el-header>
            <div class="cMKEaF">
                <el-page-header @back="goBack" content="找回密码">
                </el-page-header>
            </div>
        </el-header>
        <div class="identity-title">找回密码</div>
        <div class="retrieve-password">
            <el-form ref="form" :model="form" label-width="0" class="content">
                <div style="font-size: 16px;margin-bottom: 10px;">
                    <span>登入名</span>
                </div>
                <el-form-item>
                    <el-input placeholder="邮箱/手机号/用户名" style="width: 320px;" v-model="form.username">
                    </el-input>
                    <transition name="el-zoom-in-top">
                        <div v-if="check" class="transition-box"><i class="el-icon-error" style="color: #ff3c3c"></i>{{error}}</div>
                    </transition>
                </el-form-item>
            </el-form>
            <el-button style="width: 320px;margin-top: 55px" type="primary" @click="findUserName">下一步: 验证身份</el-button>
            <div style="text-align: center;margin-left: 250px;cursor: pointer;margin-top: 5px">
                <router-link to="/forgot-account">
                    <span style="font-size: 12px;color: #999999;">忘记登入名 ></span></router-link>
            </div>
            <div style="margin-top: 100px;color: #999999">

                <div class="illustrate">
                    <p>特别说明：</p>
                    <p>1. 找回步骤：输入找回密码的登录名 - 完成身份验证 - 设置新密码</p>
                    <p>2. 进行身份验证时，如身份验证方式均不可用，您可在核身页面点击「提交申诉」提交资料，客服审核通过后将为您修改安全手机号</p>
                    <p>3. 客服后台审核修改手机号后，重新发起找回密码。此时您可通过手机号完成身份验证</p>
                </div>
            </div>
        </div>
        <div style="text-align: center;margin-top: 15px;color: #666;font-size: 13px">
            <span>@2023 即时聊天系统(网页版)</span>
        </div>
    </div>
</template>

<script>
    import service from "../../http";
    const Base64 = require("js-base64").Base64;
    export default {
        name: "PasswordFind",
        data() {
            return {
                error:"",
                check:false,
                form: {
                    username: ''
                }
            }
        },
        methods: {
            goBack() {
                this.$router.push("/login")
            },
            showAfterDelay(){
                this.check=false;
            },
            checkUserName(){
                if (this.form.username.length<=0){
                    this.check = true;
                    var _this = this;
                    _this.error = "请完整填写账号信息";
                    setTimeout(function() {
                        _this.check=false;
                    }, 2500);
                    return true
                }
                return false
            },
            findUserName(){
                if (this.checkUserName()){
                    return
                }
                var _this = this;
                service({
                    method:"GET",
                    url:"users/getLoginAccount",
                    params:{
                    loginAccount:_this.form.username
                    }
                }).then(res=>{
                    if (res &&res.code===20000){
                        this.$router.push({
                            path:"/authentication",
                            query:{
                                tag: Base64.encode(res.data.id.toString()),
                                type: Base64.encode(res.data.loginType.toString())
                            }
                        })
                    }else{
                        _this.error = res.message;
                        _this.check = true;
                        setTimeout(function() {
                            _this.check=false;
                        }, 2500);
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .transition-box {
        width: 200px;
        height: 60px;
        border-radius: 4px;
        background-color: #ffffff;
        text-align: center;
        color: #000000;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, -120%);
        transition: opacity 0.5s;
        padding: 10px 20px;
        box-sizing: border-box;
        margin: 0 auto;
    }
    .illustrate{
        width: 500px;
        margin: 0 auto;
        text-align: center;
        border-top: 1px solid #e9e9e9;
        font-size: 10px;
        padding-top: 31px;
        padding-bottom: 20px;
    }
    .illustrate p{
        line-height: 2em;
        text-align:justify;
        text-justify:inter-ideograph;
    }
    .el-header, .el-footer {
        background-color: #ffffff;
        text-align: center;
        line-height: 60px;
        box-shadow: 0px 1px 5px 0px #dadada;
    }

    .cMKEaF {
        padding: 20px 24px;
        height: 100%;
        margin: 0px auto;
        -webkit-box-align: center;
        align-items: center;
    }

    .identity-title {
        color: var(--title-text-color, #181818);
        font-size: 22px;
        font-weight: 500;
        margin-top: 26px;
        text-align: center;
    }

    .el-main {
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        line-height: 160px;
    }

    .retrieve-password {
        padding: 10px;
        text-align: center;
        margin-top: 26px;
        background-color: #f8f8f8;
    }

    .content {
        margin-top: 50px;
    }
</style>
