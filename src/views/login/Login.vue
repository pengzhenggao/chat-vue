<template>
    <div class="main">
        <Header :name="$t('system.loginName')"/>
        <div style="position: absolute;left: 5%;top: 30%">
        </div>
        <div class="login">
            <!-- 登录面板 -->
            <div class="login-box">
                <div class="go-to-register">
                    <span @click.prevent="routerRegister">{{$t('system.register')}}</span>
                </div>
                <div class="login-box-title">
                </div>
                <div class="login-box-from">
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane :label="$t('system.accountLogin')" name="first">
                            <!--账号密码登入-->
                            <AccountLogin/>
                        </el-tab-pane>
                        <el-tab-pane :label="$t('system.SmsLogin')" name="second">
                            <SmsLogin/>
                        </el-tab-pane>
                    </el-tabs>
                </div>
                <div style="display: flex;justify-content: center">
                    <span style="color: rgba(0,0,0,0.64);font-size: 13px;font-weight: 500">{{$t('system.otherWays')}}</span>
                </div>
                <div class="thirdParty">
                    <div class="flex-item">
                        <gitee @click="otherLogin('gitee')" class="list-button-icon icon"></gitee>
                        <github3 @click="otherLogin('github')" class="list-button-icon icon"></github3>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
    </div>

</template>

<script>
    import Footer from "../../components/Common/Footer";
    import Header from "../../components/Common/Header";
    import gitee from '@/assets/icon/gitee.svg'
    import qq from '@/assets/icon/qq.svg'
    import github3 from '@/assets/icon/github3.svg'
    import weixin from '@/assets/icon/weixin.svg'
    import AccountLogin from "./AccountLogin";
    import config from "@/config/config"
    import SmsLogin from "./SmsLogin";
    export default {
        components: {
            gitee,
            qq,
            github3,
            weixin,
            AccountLogin,
            SmsLogin,
            Header,
            Footer
        },
        data() {
            return {
                activeName: "first",
            }
        },
        methods: {
            handleClick(tab, event) {

            },
            otherLogin(command) {
                switch (command) {
                    case 'gitee':
                        window.open('https://gitee.com/oauth/authorize?client_id=' + config.GiteeLogin.clientID +
                            '&redirect_uri=' + config.GiteeLogin.redirectUri + '&response_type=code', '_self');
                        break;
                    case 'github':
                        window.open('https://github.com/login/oauth/authorize?client_id=' + config.GitHubLogin.clientID +
                            '&redirect_uri=' + config.GitHubLogin.redirectUri + '&scope=user', '_self');
                        break;
                    case 'qq':
                        window.open('https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=' + config.QQ.clientID +
                            '&redirect_uri=' + config.QQ.redirectUri + '&scope=user', '_self');
                        break;
                    case 'weixin':
                        this.$notify({
                            title:"WeChat快捷登入",
                            message:"未完成",
                            type:"warning"
                        });
                        break;
                }
            },
            routerRegister() {
                this.$router.push("/register")
            },

        }
    }
</script>

<style scoped>
    .main{
        height: 100%;
        width: 100%;
        background-image: url("../../assets/image/login.jpg");
        background-repeat:no-repeat;
        background-attachment:fixed;
        background-size:cover;
        position: relative;
    }
    .login {
        margin: 8% 0 10% 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        color: #cccccc;
    }

    .login-bg {
        width: 100%;
        height: 100%;
        background: #3E3E3E;
    }

    .login-box {
        position: relative;
        width: 450px;
        /* height: 287px; */
        background: hsl(0, 0%, 100%);
        border-radius: 5px;
        box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 15px;
        border: 1px solid #f7f7f7;
        padding-bottom: 20px;
    }

    .login-box-title {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        height: 67px;
        font-size: 20px;
        font-weight: 800;
        color: #000000;
        text-align: center;
        border-bottom: 1px solid #ffffff;
    }
    .login-box-title img{
         margin-right: 3px;
      }
    .login-box-title image{
       width: 50px;
    }
    .login-box-from {
        width: 93%;
        height: 320px;
        margin: 0 auto;
        padding: 25px;
        box-sizing: border-box;
    }

    .thirdParty {
        margin-top: 5px;
        padding: 8px;
        border-top: #333333 solid 1px;
        display: flex;
        justify-content: center;
        align-self: flex-end;
    }


    .list-button-icon {
        width: 20px;
        height: 20px;
        fill: currentColor;
        margin: 0 5px 0 5px;
    }
     .icon:hover {
        cursor: pointer;
        transition: 0.5s;
        transform: scale(1.5);
    }
    .go-to-register {
        cursor: pointer;
        height: 70px;
        width: 70px;
        background-image: url('https://img.alicdn.com/imgextra/i3/O1CN01yz6fEl1MwaRtkJyvf_!!6000000001499-55-tps-70-70.svg');
        position: absolute;
        top: 0;
        right: 0;
        text-align: right;
    }

    .go-to-register span {
        font-size: 14px;
        color: rgb(255, 255, 255);
        font-weight: 500;
        position: relative;
        top: 10px;
        right: 7px;
    }

    .el-tab-pane {

        padding: 20px;
    }

    /deep/ .el-tabs__item {
        font-size: 16px !important;
        font-weight: bold;
    }


    /*去掉tabs底部的下划线*/
    /deep/ .el-tabs__nav-wrap::after {
        position: static !important;
    }
</style>
