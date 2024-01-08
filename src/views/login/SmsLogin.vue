<template>
    <div>
        <el-form :model="loginForm" :rules="rules" ref="loginForm" class="demo-ruleForm">
            <el-form-item prop="phone">
                <el-input v-model="loginForm.phone" placeholder="输入手机号" size="medium">
                    <el-button slot="prepend" icon="el-icon-phone"></el-button>
                </el-input>
            </el-form-item>
            <el-form-item prop="code">
                <el-input @keyup.enter.native="submitForm('loginForm')" v-model="loginForm.code" :disabled="loginForm.phone<=0" placeholder="输入验证码" size="medium">
                    <el-button slot="append" style="width: 120px;" v-if="loginForm.phone>0">
                        <span @click.prevent="sendCode" v-if="!isSend">{{sendmsg}}</span>
                        <span v-if="isSend">{{sendmsg}}</span>
                    </el-button>
                </el-input>
            </el-form-item>
            <el-form-item style="margin-top: 26px">
                    <el-checkbox  v-model="termsService"><span class="terms-service">
                        我已阅读并同意<a href="#" target="_blank">服务条款</a>、
                        <a href="#" target="_blank">隐私政策</a></span>
                    </el-checkbox>
                <el-button
                        :disabled="loginForm.phone<=0 || loginForm.code<=0"
                        type="primary" size="medium" :loading="loading"
                           style="width:100%;padding: 12px 0 12px 0"
                           @click="submitForm('loginForm')">立即登陆
                </el-button>
            </el-form-item>
        </el-form>
        <div>
            <el-dialog
                    :title="''"
                    :show-close="false"
                    :visible.sync="validationVisible"
                    :before-close="validationHandleClose"
                    width="330px">
                <SendCodeValidation v-if="validationVisible" :xl="this.xl" :yl="this.yl"
                                    :sliderName="this.sliderName" :username="this.loginForm.phone"
                                    @validationHandleClose="validationHandleClose"
                                    @successValidation="successValidation"/>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import service from "../../http";
    import SendCodeValidation from "../../components/SliderValidation/SmsValidation";
    export default {
        name: "SmsLogin",
        components:{
            SendCodeValidation
        },
        data() {
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
                if (value === '' && this.loginForm.phone.length>0) {
                    callback(new Error('验证码不能为空'));
                }else {
                    callback();
                }
            };
            return {
                xl: 0,
                yl: 0,
                sliderName: null,
                validationVisible:false,
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
                        {required: true, message: '请输入手机号', trigger: ['change']},
                        {validator: phoneRule, trigger: 'change'}
                    ],
                    code: [
                        {validator: codeRule, trigger: 'change'}
                    ],
                }
            }
        }, methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.termsService!==true){
                            this.$confirm('是否同意条款服务', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                this.termsService=true;
                                this.loading=true;
                                service({
                                    method:"post",
                                    url:"/userAuth/verificationLogin/phone",
                                    data:this.loginForm
                                }).then(res=>{
                                    if (res.code===20000){
                                        this.$store.dispatch('user/saveUserLogin', res.data).then(res=>{
                                            this.$router.push('/index')
                                        }).catch(()=>{
                                            this.loading=false;
                                        })
                                    }
                                }).catch(()=>{
                                    this.loading=false;
                                })
                            }).catch(() => {
                                this.termsService=false;
                            });

                        }else{
                            this.loading=true;
                            service({
                                method:"post",
                                url:"/userAuth/verificationLogin/phone",
                                data:this.loginForm
                            }).then(res=>{
                                if (res.code===20000){
                                    this.$store.dispatch('user/saveUserLogin', res.data).then(res=>{
                                        this.$router.push('/index')
                                    }).catch(()=>{
                                        this.loading=false;
                                    })
                                }
                            }).catch(()=>{
                                this.loading=false;
                            })
                        }

                    }
                })
            },
            successValidation(){
                var regex = /^1[3456789]\d{9}$/;
                if (regex.test(this.loginForm.phone)) {
                    service({
                        method: "get",
                        url: "/userAuth/sendCode/phoneLogin",
                        params: {
                            account: this.loginForm.phone
                        }
                    }).then(res=>{
                        this.validationVisible=false
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
                    }).finally(()=>{
                        this.validationVisible=false
                    })
                }
            },
            sendCode() {
                var regex = /^1[3456789]\d{9}$/;
                if (regex.test(this.loginForm.phone)) {
                    service({
                        method: "get",
                        url: "/sliderlocation",
                        params:{
                            type:"SmsLogin"
                        }
                    }).then(res => {
                        this.xl = res.data.xl;
                        this.yl = res.data.yl;
                        this.sliderName = res.data.sliderName;
                        this.validationVisible = true;
                    }).catch(()=>{
                        this.validationVisible = false;
                    })
                }

            },
            validationHandleClose(done) {
               this.validationVisible = false
                this.loading = false;
            }
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

/deep/.el-dialog__header{
    padding: 0 20px 10px;
}
/deep/.el-dialog__wrapper{
    top: 100px;
}
</style>
