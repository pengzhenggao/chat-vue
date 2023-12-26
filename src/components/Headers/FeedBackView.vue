<template>
    <div class="main">
        <div>
            <el-form ref="form" :rules="rules" :model="form" label-width="80px" label-position="top">
                <el-form-item label="类型" prop="feedbackTypeId">
                    <el-radio-group v-model="form.feedbackTypeId">
                        <el-radio :label="item.id" :key="item.id" v-for="item in this.feedbackTypeList">{{item.name}}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="图片" prop="isUpLoadImg">
                    <el-radio-group v-model="form.isUpLoadImg">
                        <el-radio :label="0">有</el-radio>
                        <el-radio :label="1">无</el-radio>
                    </el-radio-group>
                    <div v-show="form.isUpLoadImg===0">
                        <el-upload
                                action="http://localhost:8001/api/upload/oss"
                                list-type="picture-card"
                                :on-success="handleAvatarSuccess"
                                :limit="3"
                                :on-exceed="handleExceed"
                                :on-remove="handleRemove">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                    </div>
                </el-form-item>
                <el-form-item label="反馈内容" prop="content">
                    <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-model="form.content"
                            maxlength="200"
                            show-word-limit
                    >
                    </el-input>
                </el-form-item>
                <div style="width: 100%;text-align: center">
                    <el-button @click="cancelFeedBack">取 消</el-button>&emsp;&emsp;
                    <el-button type="primary" @click="submitFeedBack('form')">提 交</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    import service from "../../http";

    export default {
        name: "FeedBackView",
        data() {
            return {
                dialogVisible: false,
                feedbackTypeList: [],
                form: {
                    feedbackTypeId: null,
                    isUpLoadImg: 1,
                    content: null,
                    feedbackImageUrl: [],
                },
                rules: {
                    feedbackTypeId: [{required: true, message: "请选择一项类型", trigger: 'change'},],
                    content: [{required: true, message: '请填写反馈内容', trigger: 'change'}],
                    isUpLoadImg: [{required: false}],
                    feedbackImageUrl: [{required: false}],
                }
            }
        }, methods: {
            async initFeedBackData() {
                const response = await service.get('/feedbackType');
                this.feedbackTypeList = response.data
            },
            cancelFeedBack() {
                this.dataClear();
                this.$emit('closeFeedback')
            },
            submitFeedBack() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        service({
                            method: "post",
                            url: "/feedback",
                            data: this.form
                        }).then(res => {
                            if (res && res.code === 20000) {
                                this.$notify({
                                    title: "问题反馈及建议",
                                    type: "success",
                                    message: "反馈成功！感谢您提供的宝贵意见！"
                                });
                                this.dataClear();
                                this.$emit('closeFeedback')
                            } else {
                                this.$notify({
                                    title: "问题反馈及建议",
                                    type: "error",
                                    message: "反馈失败，请联系管理员"
                                })
                            }
                        })
                    }
                });
            },
            handleAvatarSuccess(res,file) {
                this.form.feedbackImageUrl.push(res.message)
                this.dialogVisible = true;
            },
            handleRemove(file, fileList) {
                this.form.feedbackImageUrl = [];
                for (var item in fileList) {
                    this.form.feedbackImageUrl.push(fileList[item].response.message)
                }
            },
            handleExceed() {
                this.$message.warning("最多上传三张照片")
            },
            dataClear() {
                this.form = {
                    feedbackType: null,
                    isUpLoadImg: 1,
                    content: null,
                    feedbackImageUrl: null,
                };
                this.$refs.form.clearValidate();
            },
        }
    }
</script>

<style scoped>
    .main {
        width: 100%;

    }

    /deep/ .el-radio {
        margin-bottom: 10px;

    }

    /deep/ .el-form--label-top .el-form-item__label {
        padding: 0
    }

    /deep/ .el-form-item__content {
        line-height: 20px;
    }

    /deep/ .el-form--label-top .el-form-item__label {
        font-weight: bold;
        font-size: 16px;
    }

    /deep/ .el-upload--picture-card {
        height: 120px;
        width: 120px;
        line-height: 130px;
    }

    /deep/ .el-upload-list__item-thumbnail {
        height: 120px !important;
        width: 120px !important;
    }

    /deep/ .el-upload-list--picture-card .el-upload-list__item {
        height: 120px !important;
        width: 120px !important;
    }
</style>
