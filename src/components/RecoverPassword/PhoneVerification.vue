<template>
    <div style="margin-top: 10px">
        <el-form ref="form" :model="phoneVerificationList" label-width="80px">
            <el-form-item label="手机号">
                <div v-if="message">{{noPassByMobile(message.phone)}}</div>
            </el-form-item>
            <el-form-item label="验证码">
                <el-input v-model="phoneVerificationList.code" style="width: 300px" placeholder="输入验证码" size="medium">
                    <el-button slot="append" style="width: 120px;">
                        <span @click.prevent="sendCode" v-if="!isSend">{{sendmsg}}</span>
                        <span v-if="isSend">{{sendmsg}}</span>
                    </el-button>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="verification">立即验证</el-button>
            </el-form-item>
        </el-form>
        <div class="illustrate">
            <p>1. 接收验证码的手机号为您账号中绑定的安全手机号</p>
            <p>2. 发送验证码后，您可以在手机短信中获取（1分钟内未收到，建议在垃圾短信中查看）</p>
        </div>
    </div>
</template>

<script>
    import service from "../../http";
    import Cookies from "js-cookie";

    export default {
        name: "PhoneVerification",
        props: ['message'],//获取父级传值
        data() {
            return {
                phoneVerificationList: {
                    code:""
                },
                isSend: false,
                sendmsg: "发送验证码"
            }
        }, methods: {
            sendCode() {
                var regex = /^1[3456789]\d{9}$/;
                if (regex.test(this.message.phone)) {
                    service({
                        method: "get",
                        url: "/userAuth/sendCode/phonePRSendCode",
                        params: {
                            account: this.message.phone
                        }
                    }).then(res => {
                        if (res.code === 20000) {
                            this.$message.success("发送成功");
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

            },
            verification(){
                this.phoneVerificationList.phone = this.message.phone;
                this.phoneVerificationList.id = this.message.id;
                service({
                    method:"post",
                    url:"/authentication/phoneRecoverPassword",
                    data:this.phoneVerificationList
                }).then(res=>{
                    if (res.code===20000){
                        let seconds = 60*9;
                        let expires = new Date(new Date() * 1 + seconds * 1000);
                        Cookies.set("IV"+this.phoneVerificationList.id,res.message, { expires: expires });
                        this.$router.push({
                            path:"/set-password",
                            query:{
                                token:res.message
                            }
                        });
                    }
                })
            },
            noPassByMobile(str) { //中间四位脱敏
                if (null !== str && str !== undefined) {
                    var pat = /(\d{3})\d*(\d{4})/;
                    return str.replace(pat, '$1****$2');
                } else {
                    return "";
                }
            }
        }, mounted() {

        }
    }
</script>

<style scoped>
    .illustrate {
        width: 500px;
        margin: 0 auto;
        text-align: center;
        border-top: 1px solid #e9e9e9;
        font-size: 10px;
        color: #999999;
        font-family: "PingFang SC";
        padding-top: 31px;
        padding-bottom: 20px;
    }

    .illustrate p {
        line-height: 2em;
        text-align: justify;
        text-justify: inter-ideograph;
    }
</style>
