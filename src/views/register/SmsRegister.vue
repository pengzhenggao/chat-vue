<template>
    <div>
        <el-form :model="loginForm" :rules="rules" ref="loginForm" class="demo-ruleForm">
            <el-form-item prop="phone">
                <el-input v-model="loginForm.phone" :placeholder="$t('system.loginPhone')" size="medium">
                    <el-button slot="prepend" icon="el-icon-phone"></el-button>
                </el-input>
            </el-form-item>
            <el-form-item prop="code">
                <el-input v-model="loginForm.code" :disabled="loginForm.phone.length<=0"
                          :placeholder="$t('system.enterCode')" size="medium">
                    <el-button slot="append" style="width: 120px;" v-if="loginForm.phone.length>0">
                        <span @click.prevent="sendCode" v-if="!isSend">{{sendmsg}}</span>
                        <span v-if="isSend">{{sendmsg}}</span>
                    </el-button>
                </el-input>
            </el-form-item>
            <el-form-item style="margin-top: 40px">
                    <el-checkbox  v-model="termsService"><span class="terms-service">
                        {{$t('system.termsOfAccessPrefix1')}}<a href="#" target="_blank">{{$t('system.termsOfAccessPrefix2')}}</a>、
                        <a href="#" target="_blank">{{$t('system.termsOfAccessPrefix3')}}</a></span>
                    </el-checkbox>
                <el-button type="primary" size="medium" :loading="loading"
                           :disabled="loginForm.phone<=0"
                           style="width:100%;padding: 12px 0 12px 0"
                           @click="submitForm('loginForm')">{{$t('system.registerInNow')}}
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import service from "../../http";

    export default {
        name: "Register",
        data() {
            let letterRule = (rule, value, callback) => {
                let reg = /^1[3456789]\d{9}$/;
                if (value === '') {
                    callback(new Error('输入内容不能为空'));
                } else if (!reg.test(value)) {
                    callback(new Error('手机格式不正确'));
                } else {
                    callback();
                }
            };
            return {
                termsService:false,
                sendmsg: '发送验证码',
                isSend: false,
                loading: false,
                loginForm: {  // 登陆表单
                    phone: '',
                    code: ''
                },
                rules: {  //登陆验证规则
                    phone: [
                        {required: true, message: '请输入手机号', trigger: ['blur','change']},
                        {validator: letterRule, trigger: 'blur'}
                    ],
                    code: [
                        {required: true, message: '请输入验证码', trigger: 'change'},
                    ]
                }
            }
        }, methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.loading=true;
                        service({
                            method:"post",
                            url:"/userAuth/register/phoneRegister",
                            data:this.loginForm
                        }).then(res=>{
                            if (res.code===20000){
                                this.$notify({
                                    title:"手机注册",
                                    type:"success",
                                    message:"注册成功"
                                });
                                this.$router.push('/login');
                                this.loading=false;
                            }
                        }).catch(()=>{
                            this.loading=false;
                        })
                    }
                })
            },
            sendCode() {
                var regex = /^1[3456789]\d{9}$/;
                if (regex.test(this.loginForm.phone)) {
                    service({
                        method: "get",
                        url: "/userAuth/sendCode/phoneRSC",
                        params: {
                            account: this.loginForm.phone
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
                }
            },

        },
    }
</script>

<style scoped>
.terms-service{
    color: black;
    font-size: 12px;
}
.terms-service a{
    color: red;
}
</style>
