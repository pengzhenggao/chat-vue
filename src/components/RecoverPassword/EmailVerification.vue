<template>
    <div style="margin-top: 10px">
        <el-form ref="form" :model="emailVerificationList" label-width="80px">
            <el-form-item label="邮箱号">
                <div v-if="message">{{noPassByEmail(message.email)}}</div>
            </el-form-item>
            <el-form-item label="验证码">
                <el-input v-model="emailVerificationList.code" style="width: 300px" placeholder="输入验证码" size="medium">
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
            <p>1. 接收验证码的邮箱号为您账号中绑定的安全邮箱号</p>
            <p>2. 发送验证码后，您可以在对应邮箱中获取（1分钟内未收到，建议在垃圾短信中查看）</p>
        </div>
    </div>
</template>

<script>
    import service from "../../http";
    import Cookies from "js-cookie";

    export default {
        name: "EmailVerification",
        props: ['message'],//获取父级传值
        data(){
            return{
                emailVerificationList:{},
                isSend:false,
                sendmsg:"发送验证码"
            }
        },methods:{
            sendCode() {
                var regex = /^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/;
                if (regex.test(this.message.email)) {
                    service({
                        method: "get",
                        url: "users/userAuth/sendCode/emailPRSendCode",
                        params: {
                            account: this.message.email
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

            },
            verification(){
                this.emailVerificationList.email = this.message.email;
                this.emailVerificationList.id = this.message.id;
                service({
                    method:"post",
                    url:"users/authentication/emailPasswordRecovery",
                    data:this.emailVerificationList
                }).then(res=>{
                    if (res.code===20000){
                        let seconds = 60*9;
                        let expires = new Date(new Date() * 1 + seconds * 1000);
                        Cookies.set("IV"+this.emailVerificationList.id,res.message, { expires: expires });
                        this.$router.push({
                            path:"/set-password",
                            query:{
                                token:res.message
                            }
                        });
                    }
                })
            },
            noPassByEmail(email) {
                let new_email = email;
                if (String(email).indexOf('@') > 0) {
                    let str = email.split('@');
                    let 　_s = '';
                    if (str[0].length > 3) { //@前面多于3位
                        for (let i = 3; i < str[0].length; i++) {
                            _s += '*';
                        }
                        new_email= str[0].substr(0, 3) + _s + '@' + str[1];
                    }else{ //@前面小于等于于3位
                        for(let i = 1;i<str[0].length;i++){
                            _s+='*'
                        }
                        new_email = str[0].substr(0,1)+ _s + '@' + str[1]
                    }
                }
                return new_email;
            }
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
