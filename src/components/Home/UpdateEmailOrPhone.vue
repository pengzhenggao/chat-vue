<template>
    <div>
        <el-dialog
                :title="updateForm.type==='phone'?'输入需要绑定的手机号':'输入需要绑定的邮箱号'"
                :visible.sync="visible"
                width="30%"
                :before-close="handleClose">
            <div>
                <el-form :model="updateForm" :rules="rules" ref="updateForm" class="demo-ruleForm">
                    <el-form-item v-if="updateForm.type==='phone'" prop="phone">
                        <el-input v-model="updateForm.phone" placeholder="输入需要绑定的手机号" size="medium">
                            <el-button slot="prepend" icon="el-icon-phone"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item v-if="updateForm.type==='email'" prop="email">
                        <el-input v-model="updateForm.email" placeholder="输入需要绑定的邮箱号" size="medium">
                            <el-button slot="prepend" icon="el-icon-phone"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="code">
                        <el-input @keyup.enter.native="submitForm('loginForm')" v-model="updateForm.code"
                                   placeholder="输入验证码" size="medium">
                            <el-button slot="append" style="width: 120px;">
                                <span @click.prevent="sendCode()" v-if="!isSend">{{sendmsg}}</span>
                                <span v-if="isSend">{{sendmsg}}</span>
                            </el-button>
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>

            <span slot="footer" class="dialog-footer">
    <el-button @click="cancel">取 消</el-button>
    <el-button type="primary" @click="submitForm()">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    import service from "../../http";

    export default {
        name: "UpdateEmailOrPhone",
        data() {
            return {
                updateForm: {
                    userInfoId:null,
                    phone: null,
                    email: null,
                    code:null,
                    type:null
                },
                isType: null,
                visible: false,
                isSend: false,
                sendmsg: "获取验证码",
                rules: {
                    phone: [{
                        required: true,
                        message: "手机号不能为空",
                        trigger: "blur"
                    }, {
                        pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
                        message: "请输入正确的手机号码",
                        trigger: "blur"
                    }],
                    email: [{
                        required: true,
                        message: "邮箱号不能为空",
                        trigger: "blur"
                    }, {
                        validator: function (rule, value, callback) {
                            if (
                                /^\w{1,64}@[a-z0-9\-]{1,256}(\.[a-z]{2,6}){1,2}$/i.test(
                                    value
                                ) == false
                            ) {
                                callback(new Error("邮箱格式错误"));
                            } else {
                                callback();
                            }
                        },
                        trigger: "blur"
                    }],
                    code:[{ required: true,
                        message: "验证码不能为空",
                        trigger: "change"}]
                }
            }
        }, methods: {
            cancel() {
                this.clear();
                this.visible = false
            },
            clear() {
                this.updateForm = {
                    userInfoId:null,
                    phone: null,
                    email: null,
                    type:null
                };
                this.isSend = false;
                this.sendmsg = "获取验证码";
                this.$refs.updateForm.clearValidate()
            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        this.clear();
                        done()
                    })
                    .catch(_ => {

                    });
            },
            submitForm() {
                this.$refs.updateForm.validate((valid) => {
                    if (valid) {
                        service({
                            method:"post",
                            url:"users/update/EmailOrPhone",
                            data:this.updateForm
                        }).then(res=>{
                            if (res.code===20000){
                                this.$notify({
                                    title:"绑定邮箱或手机",
                                    type:"success",
                                    message:"绑定成功"
                                });
                                this.visible = false;
                                this.clear()
                            }
                        })
                    }
                })
            },
            selectUpdateView(id, type) {
                this.updateForm.userInfoId = id;
                switch (type) {
                    case "phone":
                        this.updateForm.type = type;
                        this.getUpdateView(id, type);
                        break;
                    case "email":
                        this.updateForm.type = type;
                        this.getUpdateView(id, type);
                        break;
                }
                this.visible = true
            },
            getUpdateView(id, type) {
                service({
                    method: "get",
                    url: `users/userInfo/updateEmailAndPhoneView/${type}`,
                    params: {
                        userId: id
                    }
                }).then(res => {
                    if (this.updateForm.type === "phone") {
                        this.updateForm.phone = res.message
                    } else {
                        this.updateForm.email = res.message
                    }
                })
            },
            sendCode() {
                service({
                    method: "get",
                    url: `users/userAuth/sendCode/${this.updateForm.type==='phone'?'phoneUpdateBind':'emailUpdateBind'}`,
                    params: {
                        account: this.updateForm.type==='phone'?this.updateForm.phone:this.updateForm.email
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
        }
    }
</script>

<style scoped>
    .demo-ruleForm {
        margin: 0 auto;
        width: 80%;
    }
</style>
