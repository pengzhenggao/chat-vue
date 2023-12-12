<template>
    <div style="margin:40px 0 0 20px">
        <div class="form-title">
            <span>登录名将发送至账号绑定的邮箱号</span>
            <div class="ER-content">
                <el-form ref="form" status-icon :rules="rules" :model="form" label-width="80px" class="demo-ruleForm">
                    <el-form-item label="邮箱号" prop="email">
                        <el-input placeholder="请输入邮箱号" size="medium" style="width:400px"  v-model="form.email">
                            <template slot="append"><span>.com</span></template>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="code" label="验证码">
                        <el-input v-model="form.code" placeholder="输入验证码" size="medium">
                            <el-button slot="append" style="width: 120px;">
                                <span @click.prevent="sendCode" v-if="!isSend">{{sendmsg}}</span>
                                <span v-if="isSend">{{sendmsg}}</span>
                            </el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item >
                        <el-button type="warning" @click="submit('form')">立即找回</el-button>
                    </el-form-item>
                </el-form>

            </div>
        </div>
    </div>
</template>

<script>
    import service from "../../http";
    export default {
        name: "EmailRecover",
        data(){
            var emailRule = (rule, value, callback) => {
                let reg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (value === '') {
                    callback(new Error('输入内容不能为空'));
                } else if (!reg.test(value)) {
                    callback(new Error('邮箱格式不正确'));
                } else {
                    callback();
                }
            };
            var codeRule = (rule, value, callback) => {
                if (value === '' && this.form.email.length>0) {
                    callback(new Error('验证码不能为空'));
                }else {
                    callback();
                }
            };
            return{
                isSend:false,
                sendmsg:"发送验证码",
                form:{
                    email:"",
                    code:"",
                },
                rules: {
                    email: [
                        {required: true, message: '请输入邮箱号', trigger: ['blur','change']},
                        {validator: emailRule, trigger: 'change'}
                    ],
                    code: [
                        {validator: codeRule, trigger: 'change'}
                    ],
                }
            }
        },methods:{
            submit(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        service({
                            method:"post",
                            url:"/find/account/emailRecoverAccount/",
                            data:this.form
                        }).then(res=>{
                            this.$emit("isFindAccountE",res.data);
                        })
                    }})
            },
            sendCode(){
                var regex = /^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/;
                if (regex.test(this.form.email) || value.endsWith(".com")) {
                    service({
                        method: "get",
                        url: "/userAuth/sendCode/emailARSendCode",
                        params: {
                            account: this.form.email
                        }
                    }).then(res=>{
                        if (res.code===20000){
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
                }else{
                    this.$message.warning("邮箱格式不正确")
                }
            }
        }
    }
</script>

<style scoped>

    .ER-content {
        margin-top: 40px;
        display: flex;
        align-items: center;
    }

    .form-title {
        font-size: 15px;
        color: #444444;
    }
</style>
