<template>
    <div>
        <el-header>
            <div class="cMKEaF">
                <el-page-header @back="goBack" content="找回登入名">
                </el-page-header>
            </div>
        </el-header>
        <div class="kMthTr">
            <div class="header-title" v-if="show">
                <span class="title">找回登入名</span>
                <span class="more">您可以通过以下方式找回，更多信息可以
                    <a href="#" target="_blank"
                       rel="noopener noreferrer" class="help-link">查看帮助</a></span>
                <div class="content">
                    <el-tabs tab-position="top" v-model="activeName" type="card">
                        <el-tab-pane label="手机" name="phone">
                            <PhoneRecover @isFindAccountP="isFindAccountP"/>
                        </el-tab-pane>
                        <el-tab-pane label="邮箱" name="email">
                            <EmailRecover @isFindAccountE = "isFindAccountE"/>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
            <div v-else-if="!show" style="margin-left: 170px;">
                <div class="F-context">
                    <div>
                        <div style="color: #3BB54A;">
                            <i style="font-size: 40px" class="el-icon-success"></i>
                        </div>
                    </div>
                    <div style="margin-left: 20px;font-size: 17px"><span>找回成功，请妥善保管您的登入名</span></div>
                </div>
                <div class="primary-content">
                    <div v-for="intem in findAccount">
                        <div><span>{{intem}}</span><span class="copy" @click.prevent="copyToClipboard(intem)">复制</span>
                        </div>
                    </div>
                    <div style="margin-top: 20px">
                        <el-button type="warning" @click="goLogin"><span>去登入</span></el-button> &emsp;
                        <span @click.prevent="goAccountRegister" style="font-size: 13px;color: #878787;cursor: pointer">继续找回其他账号</span>
                    </div>
                </div>

            </div>
        </div>

    </div>
</template>

<script>
    import PhoneRecover from "../../components/RecoverAccount/PhoneRecover"
    import EmailRecover from "../../components/RecoverAccount/EmailRecover";

    export default {
        name: "Index",
        components: {
            PhoneRecover,
            EmailRecover
        },
        data() {
            return {
                findAccount: [],
                show:true,
                activeName: "phone",
            }
        }, methods: {
            goBack() {
                this.$router.push("/login")
            },
            isFindAccountP(event){
                this.isFindAccount(event)
            },
            isFindAccountE(event){
                this.isFindAccount(event)
            },

            isFindAccount(event) {
                this.show = false
                this.findAccount = event
            },
            copyToClipboard(text) {
                navigator.clipboard.writeText(text).then(() => {
                    this.$notify({
                        title:"复制内容",
                        type:"success",
                        message:"复制成功"
                    });
                })
            },
            goLogin(){
                this.$router.push("/login")
            },
            goAccountRegister(){
                window.open("http://localhost:8001/forgot-password")
            }
        }, mounted() {

        }
    }
</script>

<style scoped>

    /deep/ .primary-content .el-button{
        padding: 10px 20px;

    }
    .primary-content {
        margin-top: 15px;
        margin-left: 60px;
        line-height: 2em;
    }

    .F-context {

        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .content {
        max-width: 85%;
        margin-top: 36px;
    }

    .header-title {
        margin-left: 170px;
    }

    .header-title .title {
        color: #181818;
        font-size: 24px;
    }

    .header-title .more {
        margin-left: 10px;
        font-size: 12px;
        color: #999999;
    }

    .kMthTr {
        min-width: 1000px;
        max-width: 1200px;
        margin: 100px auto;
        padding: 0px 120px;
    }

    .el-header {
        background-color: #ffffff;
        text-align: center;
        line-height: 60px;
        box-shadow: 0px 1px 5px 0px #dadada;
    }

    .copy {
       font-size: 12px;
        color: #fd4149;
        margin-left: 10px;
        cursor: pointer;
    }

    .cMKEaF {
        padding: 20px 24px;
        height: 100%;
        margin: 0px auto;
        -webkit-box-align: center;
        align-items: center;
    }

    ::v-deep .el-tabs__nav-scroll {

        justify-content: left;
    }

    /deep/ .el-tabs__item {
        padding: 0 40px !important;
    }
</style>
