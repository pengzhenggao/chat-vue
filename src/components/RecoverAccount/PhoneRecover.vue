<template>
    <div style="margin:40px 0 0 20px">
        <div class="form-title">
            <span>登录名将发送至账号绑定的手机号</span>
            <div class="PR-content">
                <el-form ref="form" :rules="rules" :model="form" label-width="80px">
                    <el-form-item label="手机号" prop="phone">
                        <el-input placeholder="请输入手机号" size="medium" style="width:400px" v-model="form.phone">
                            <template slot="prepend"><span>86</span></template>
                            <el-button slot="append" style="width: 120px;">
                                <span @click.prevent="sendCode()" v-if="!isSend">{{sendmsg}}</span>
                                <span v-if="isSend">{{sendmsg}}</span>
                            </el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="code" label="验证码">
                        <el-input v-model="form.code" placeholder="输入验证码" size="medium">
                        </el-input>
                    </el-form-item>
                    <el-form-item >
                        <el-button type="primary" @click="submit('form')">立即找回</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import service from "../../http";

    export default {
        name: "PhoneRecover",
        data(){
            let phoneRule = (rule, value, callback) => {
                let reg = /^1[3456789]\d{9}$/;
                if (value === '') {
                    callback(new Error('输入内容不能为空'));
                } else if (!reg.test(value)) {
                    callback(new Error('手机格式不正确'));
                } else {
                    callback();
                }
            };
            let codeRule = (rule, value, callback) => {
                if (value === '' && this.form.phone.length>0) {
                    callback(new Error('验证码不能为空'));
                }else {
                    callback();
                }
            };
            return{
                isSend:false,
                sendmsg:"发送验证码",
                findAccount:[],
                form:{
                    phone:"",
                    code:"",
                },
                rules: {  //登陆验证规则
                    phone: [
                        {required: true, message: '请输入手机号', trigger: ['blur','change']},
                        {validator: phoneRule, trigger: ['blur','change']}
                    ],
                    code: [
                        {validator: codeRule, trigger: ['blur','change']}
                    ],
                }
            }
        },methods:{
            submit(form){
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        service({
                            method:"post",
                            url:"users/find/account/phoneRecoverAccount",
                            data:this.form
                        }).then(res=>{
                            this.findAccount = res.data;
                            this.$emit("isFindAccountP",this.findAccount);
                        })
                    }})
            },
            sendCode(){
                var regex = /^1[3456789]\d{9}$/;
                if (regex.test(this.form.phone)) {
                    service({
                        method: "get",
                        url: "users/userAuth/sendCode/phoneARSendCode",
                        params: {
                            account: this.form.phone
                        }
                    }).then(res=>{
                        if (res.code===20000){
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
                }else{
                    this.$notify({
                        title:"手机号校验",
                        type:"warning",
                        message:"请输入手机号"
                    });
                }
            }
        }
    }
</script>

<style scoped>

    .PR-content {
        margin-top: 40px;
        display: flex;
        align-items: center;
    }

    .form-title {
        font-size: 15px;
        color: #444444;
    }
</style>
