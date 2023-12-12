<template>
    <div v-loading="loading">
        <el-header>
            <div class="cMKEaF">
                <el-page-header @back="goBack" content="身份验证">
                </el-page-header>
            </div>
        </el-header>
        <div class="authentication-title">身份验证</div>
        <div style="text-align: center;margin-top: 25px;font-size: 12px;color: #656565">
            <p v-if="this.emailIdMsg!=null">为确保账号 <span>{{this.$refs.emailVerification.noPassByEmail(this.emailIdMsg.email)}}</span> 是您本人操作，请任意选择一种方式验证身份</p>
            <p v-else-if="this.phoneMsg!=null">为确保账号 <span>{{this.$refs.phoneVerification.noPassByMobile(this.phoneMsg.phone)}}</span> 是您本人操作，请任意选择一种方式验证身份</p>
            <p v-else></p>
        </div>
        <div class="authentication">
            <div class="content">
                <el-tabs v-model="activeName">
                    <el-tab-pane label="手机号验证" :lazy="true" name="phone" v-if="this.type==='2'">
                        <PhoneVerification  ref="phoneVerification" :message="phoneMsg"/>
                    </el-tab-pane>
                    <el-tab-pane label="邮箱验证" :lazy="true" name="email" v-else>
                        <EmailVerification  ref="emailVerification" :message="emailIdMsg"/>
                    </el-tab-pane>
<!--                    <el-tab-pane label="扫脸验证" :lazy="true" name="sweepFace">-->
<!--                        未开发-->
<!--                    </el-tab-pane>-->
<!--                    <el-tab-pane label="无法验证？提交申述" :lazy="true" name="fourth">-->
<!--                        未开发-->
<!--                    </el-tab-pane>-->
                </el-tabs>
            </div>
        </div>
        <div style="text-align: center;margin-top: 15px;color: #666;font-size: 13px">
            <span>后台管理系统</span>&nbsp;
            <span>2023-2023</span>&emsp;
            <span><a href="https://beian.miit.gov.cn/" target="_blank">备案号:桂ICP备2023000509号</a></span>
        </div>
    </div>
</template>

<script>

    import PhoneVerification from "../../components/RecoverPassword/PhoneVerification";
    import EmailVerification from "../../components/RecoverPassword/EmailVerification";
    import service from "../../http";
    const Base64 = require("js-base64").Base64;
    export default {
        name: "Authentication",
        components:{
            PhoneVerification,
            EmailVerification
        },
        data(){
            return{
                loading:false,
                phoneMsg:null,
                emailIdMsg:null,
                id:"",
                activeName:"email",
                type:"",
            }
        },mounted() {this.loading = true;
          var tag = this.$route.query.tag;
          this.type = Base64.decode(this.$route.query.type)
          if (tag){
              this.id = Base64.decode(tag)
              this.init(this.id)
          }
           this.activeName = this.type==="1"?"email":"phone"
        },
        methods:{
            goBack(){
                this.$router.push("/password-find")
            },
            init: function (id) {
                if (id) {
                    service({
                        method: "get",
                        url: "/getUserAuthId",
                        params: {
                            id: id
                        }
                    }).then(res => {
                        this.loading=false;
                        if (this.type === "1") {
                            this.emailIdMsg = res.data
                        } else {
                            this.phoneMsg = res.data
                        }
                    }).catch(()=>{
                        this.loading = false
                    })
                }

            },

        }
    }
</script>

<style scoped>
    /deep/.el-tabs__nav{
        display: none;
    }

    .content{
        padding: 15px 30px 0 30px;
        box-shadow: 0 0 7px 5px #eaeaea;
        margin: 20px auto;
        width: 500px;
        height: 393px;
        background-color: white;
    }
    .authentication {
        padding: 10px;
        margin-top: 50px;
        background-color: #f8f8f8;
    }
    .authentication-title {
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

    .cMKEaF {
        padding: 20px 24px;
        height: 100%;
        margin: 0px auto;
        -webkit-box-align: center;
        align-items: center;
    }
</style>
