<template>
    <div style="padding-bottom: 10px">
        <div>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="top">
                <el-form-item label="投诉原因" prop="complaintsCause">
                    <el-select v-model="form.causeId" placeholder="请选择投诉原因">
                        <el-option
                                v-for="item in complaintsCause"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="投诉描述" prop="complaintsDesc">
                    <el-input
                            type="textarea"
                            placeholder="请输入投诉描述"
                            v-model="form.complaintsDesc"
                            show-word-limit
                    >
                    </el-input>
                </el-form-item>
                <el-form-item label="图片证据（选填）">
                    <el-upload
                            action="http://localhost:8001/api/upload/oss"
                            list-type="picture-card"
                            :on-success="handleAvatarSuccess"
                            :limit="3"
                            :on-exceed="handleExceed"
                            :on-remove="handleRemove">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div style="text-align: center">
                <el-button type="info" @click="clearCacheAndClose">取消</el-button>
                <el-button type="primary" @click="submit">提交</el-button>
            </div>

        </div>
        <div>

        </div>
    </div>
</template>

<script>
    import service from "../../http";

    export default {
        name: "Complaints",
        props: {
            respondentId: {
                type: Number,
                default: null,
            }
        },
        data() {
            return {
                friend: null,
                form: {
                    respondent: null,
                    complaintsDesc: null,
                    causeId: null,
                    evidencePictures: [],
                },
                complaintsCause: [],
                rules: {
                    causeId: [{required: true, message: '请选择投诉理由', trigger: ['change']}],
                    complaintsDesc: [{required: true, message: '请描述理由', trigger: [ 'change']}],
                }
            }
        },
        methods: {
            initData(friend) {
                this.friend = friend;
                this.form.respondent = this.friend.friendId
            },
            getComplaintType() {
                service({
                    method: "get",
                    url: "users/complaintsCause"
                }).then(res => {
                    this.complaintsCause = res.data
                })
            },
            submit() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$confirm(`确定需要投诉"${this.friend.nickName}"吗？`, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.form.evidencePictures = this.form.evidencePictures.toString()
                            service({
                                method: "post",
                                url: "users/userComplaints",
                                data: this.form
                            }).then(res => {
                                if (res && res.code === 20000) {
                                    this.$notify({
                                        title: "投诉",
                                        type: "success",
                                        message: "投诉成功"
                                    });
                                    this.clearCacheAndClose()
                                }
                            })
                        }).catch(() => {

                        });

                    } else {
                        return false
                    }
                })
            },
            clearCacheAndClose() {
                this.$emit("complaintsFinish");
                this.friend = null;
                this.form = {
                    respondent: null,
                    complaintsDesc: null,
                    causeId: null,
                    evidencePictures: [],
                }
                this.$refs.form.resetFields()
            },
            handleAvatarSuccess(res, file) {
                this.form.evidencePictures.push(res.message)
            },
            handleExceed() {
                this.$notify({
                    title:"图片上传",
                    type:"warning",
                    message:"最多上传三张照片"
                });
            },
            handleRemove(file, fileList) {
                this.form.evidencePictures = [];
                for (var item in fileList) {
                    this.form.evidencePictures.push(fileList[item].response.message)
                }
            },
        }, created() {
            this.getComplaintType()
        }
    }
</script>

<style scoped>
    /deep/ .el-form--label-top .el-form-item__label {
        padding: 0;
    }

    /deep/ .el-upload--picture-card {
        height: 100px;
        width: 100px;
        line-height: 110px;
    }

    /deep/ .el-upload-list__item-thumbnail {
        height: 100px !important;
        width: 100px !important;
    }

    /deep/ .el-upload-list--picture-card .el-upload-list__item {
        height: 100px !important;
        width: 100px !important;
    }
</style>
