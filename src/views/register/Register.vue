<template>
    <div class="register">

        <div class="register-box">
            <div class="go-to-register">
                <span @click.prevent="routerLogin">登入</span>
            </div>
            <div class="register-box-from">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="账号注册" name="first">
                        <!--账号密码登入-->
                        <AccountRegister/>
                    </el-tab-pane>
                    <el-tab-pane label="短信注册" name="second">
                        <SmsRegister/>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <div style="position: absolute;bottom: 0;font-size: 13px">
            <span><a style="color:black;" href="https://beian.miit.gov.cn/" target="_blank">备案号:桂ICP备2023000509号</a></span>
        </div>
    </div>
</template>

<script>
    import gitee from '@/assets/icon/gitee.svg'
    import qq from '@/assets/icon/qq.svg'
    import github3 from '@/assets/icon/github3.svg'
    import AccountRegister from "./AccountRegister";
    import SmsRegister from "./SmsRegister";
    export default {
        components: {
            gitee,
            qq,
            github3,
            AccountRegister,
            SmsRegister
        },
        data() {
            return {
                activeName: "first",
            }
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab, event);
            },
            routerLogin() {
               this.$router.push("/login")
            }
        }
    }
</script>

<style scoped>
    .register {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-image: url('../../assets/image/login.jpg');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        color: #cccccc;

        position: relative;
    }

    .register-bg {
        width: 100%;
        height: 100%;
        background: #3E3E3E;
    }

    .register-box {
        width: 450px;
        /* height: 287px; */
        background: hsl(0, 0%, 100%);
        border-radius: 5px;
        box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 15px;
        border: 1px solid #f7f7f7;
        position: absolute;
        left: 50%;
        top: 50%;
        margin-left: -225px;
        margin-top: -200px;
        padding-bottom: 4px;
    }

    .register-box-title {
        line-height: 50px;
        font-size: 20px;
        font-weight: 800;
        color: #000000;
        text-align: center;
        border-bottom: 1px solid #ffffff;
    }

    .register-box-from {
        width: 93%;
        height: 449px;
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
        background-image: url(https://img.alicdn.com/imgextra/i3/O1CN01yz6fEl1MwaRtkJyvf_!!6000000001499-55-tps-70-70.svg);
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
