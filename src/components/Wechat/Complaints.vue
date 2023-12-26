<template>
    <div style="padding-bottom: 5px">
        <div>
            <el-form ref="form" :model="form" label-width="80px"  label-position="top">
                <el-form-item label="投诉原因">
                    <el-select v-model="form.cause" placeholder="请选择投诉原因">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="投诉描述">
                    <el-input
                            type="textarea"
                            placeholder="请输入投诉描述"
                            v-model="form.desc"

                            maxlength="120"
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
        </div>
        <div>

        </div>
    </div>
</template>

<script>
    export default {
        name: "Complaints",
        data(){
            return{
                friend:null,
                form:{
                    desc:null,
                    cause:null,
                    evidencePictures:null,
                },
                options: [{
                    value: '选项1',
                    label: '黄金糕'
                }, {
                    value: '选项2',
                    label: '双皮奶'
                }, {
                    value: '选项3',
                    label: '蚵仔煎'
                }, {
                    value: '选项4',
                    label: '龙须面'
                }, {
                    value: '选项5',
                    label: '北京烤鸭'
                }],
            }
        },
        methods:{
            initData(friend){
                this.friend = friend
            },
            handleAvatarSuccess(res,file) {
                this.form.evidencePictures.push(res.message)
            },
            handleExceed() {
                this.$message.warning("最多上传三张照片")
            },
            handleRemove(file, fileList) {
                this.form.evidencePictures = [];
                for (var item in fileList) {
                    this.form.evidencePictures.push(fileList[item].response.message)
                }
            },
        }
    }
</script>

<style scoped>
/deep/.el-form--label-top .el-form-item__label{
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
