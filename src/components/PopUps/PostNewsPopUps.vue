<template>
    <div v-if="showDialog">
        <transition name="fade" appear>
            <div class="modal-overlay"></div>
        </transition>
        <transition name="pop" appear class="custom-transition">
            <div class="modal" role="dialog" :style="{ width: `${width}px` }">
                <div class="model-body">
                    <el-form ref="dynamicForms" :rules="rules" :model="dynamicForms" label-width="0"
                             label-position="top">
                        <el-form-item prop="content">
                            <el-input
                                    type="textarea"
                                    :autosize="{ minRows: 6, maxRows: 6}"
                                    placeholder="这一刻的想法..."
                                    maxlength="250"
                                    v-model="dynamicForms.content">
                            </el-input>
                            <el-popover
                                    placement="bottom"
                                    title="标题"
                                    width="500"
                                    height="700"
                                    trigger="click"
                                    v-model="emojiShow">
                                <div class="la" slot="reference" style="display: inline-flex;cursor: pointer"
                                     @click="loadEmojis">
                                    <Emoji style="width: 24px;height: 24px;"/>
                                </div>
                                <div class="browBox">
                                    <ul>
                                        <li v-for="(item, index) in faceList"
                                            :key="index"
                                            @click="getBrow(index)">
                                            {{ item }}
                                        </li>
                                    </ul>
                                </div>
                            </el-popover>
                        </el-form-item>
                        <el-form-item>
                            <el-upload
                                    action="http://localhost:8001/api/upload/oss"
                                    list-type="picture-card"
                                    :on-success="handleAvatarSuccess"
                                    class="custom-upload"
                                    :limit="9"
                                    :on-exceed="handleExceed"
                                    :on-remove="handleRemove">
                                <i class="el-icon-plus"></i>
                            </el-upload>
                        </el-form-item>
                    </el-form>
                    <el-divider></el-divider>
                    <div style="display: flex;flex-direction: row;align-items: center;width: 100%">
                        <div style="font-size: 14px;font-family: '楷体',serif">
                            <span class="el-icon-user">&nbsp;谁可以看</span>
                        </div>
                        <div style="display: flex;margin-left: auto;cursor: pointer">
                            <el-dropdown trigger="click" @command="handleCommand" @visible-change="visibleChange">
                     <span class="el-dropdown-link">
                      {{dynamicForms.seeDetails===0?'仅自己可见':'公开'}}
                         <i class="el-icon-arrow-right el-icon--right" v-show="!isDropDown"></i>
                         <i class="el-icon-arrow-down el-icon--right" v-show="isDropDown"></i>
                     </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="0" icon="el-icon-search">仅自己可见</el-dropdown-item>
                                    <el-dropdown-item command="1" icon="el-icon-view">公开</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                    <el-divider></el-divider>
                    <div style="color: #858585;font-size: 13px;">
                        <span class="el-icon-location-outline" style="cursor: pointer;">&nbsp;发表地址:</span>
                        <span>&nbsp;{{dynamicForms.publicationAddress}}</span>
                    </div>
                </div>
                <div class="footer_btn">
                    <div class="dis_in_center" v-if="showConfimButton">
                        <el-button plain :type="cancelType" :size="size" @click="close">{{ cancelText }}</el-button>
                    </div>
                    <div class="dis_in_center right-btn" :class="{ margin_left_20: showCancelButton }"
                         v-if="showCancelButton">
                        <el-button
                                :disabled="dynamicForms.content.trim().length>0?disabled:true"
                                :type="dynamicForms.content.trim().length>0?confimBtnType:'info'"
                                :loading="confimBtnLoading"
                                :size="size"
                                @click="confim('dynamicForms')">{{ confimText }}
                        </el-button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
    import Emoji from "../../assets/icon/emoji.svg"
    import service from "../../http";

    export default {
        name: 'DynamicPopUps',
        components: {
            Emoji
        },
        model: {
            prop: 'showDialog',
            event: 'change'
        },
        props: {
            // 弹框的显示隐藏
            showDialog: {
                type: Boolean,
                default: false
            },
            // 底部按钮大小
            size: {
                type: String,
                default: 'medium'
            },
            // 宽度设置
            width: {
                type: [String, Number],
                default: '600'
            },
            // 是否显示右上角的关闭按钮
            showClose: {
                type: Boolean,
                default: true
            },
            // 弹框标题
            title: {
                type: String,
                default: '标题'
            },
            // 确认按钮
            confimText: {
                type: String,
                default: '保存'
            },
            // 确认按钮loading
            confimBtnLoading: {
                type: Boolean,
                default: false
            },
            // 是否显示确认按钮
            showConfimButton: {
                type: Boolean,
                default: true
            },
            // 是否显示取消按钮
            showCancelButton: {
                type: Boolean,
                default: true
            },
            // 是否禁用确认按钮
            disabled: {
                type: Boolean,
                default: false
            },
            // 确认按钮类型
            confimBtnType: {
                type: String,
                default: 'primary'
            },
            // 取消按钮类型
            cancelType: {
                type: String,
                default: 'info'
            },
            // 取消按钮文本
            cancelText: {
                type: String,
                default: '取消'
            },
            // 关闭按钮前的事件处理
            beforeClose: {
                type: Function,
                default: () => {
                    return true;
                }
            }
        }, data() {
            return {
                dynamicForms: {
                    content: "",
                    images: [],
                    seeDetails: 0,
                    publicationAddress: '',
                },
                faceList: [],
                resizeObserver: null,
                emojiShow: false,
                imagesVisible: false,
                isDropDown: false,
                rules: {
                    content: [{required: true, message: "请填写发表内容", trigger: 'change'},],
                }
            }
        },
        methods: {
            close() {
                const data = this.beforeClose();
                if (!data) return;
                this.$emit('openDynamic');
            },
            confim() {
                this.$refs.dynamicForms.validate((valid) => {
                    const params = JSON.parse(JSON.stringify(this.dynamicForms))
                    params.images = this.dynamicForms.images.toString();
                    if (valid) {
                        service({
                            method: "post",
                            url: "/users/friendFeed",
                            data: params
                        }).then(res => {
                            if (res.flag) {
                                this.$notify({
                                    title: "发表动态",
                                    type: 'success',
                                    message: "发表成功"
                                });
                                this.reset();
                                this.$emit('openDynamic');
                            }
                        })
                    }
                })
            },
            reset() {
                this.dynamicForms = {
                    content: "",
                    images: [],
                    seeDetails: 0
                }
            },
            currentAddress() {
                service.get("/users/current/address").then(res => {
                    this.dynamicForms.publicationAddress = res.message
                }).catch(() => {
                })
            },
            handleAvatarSuccess(res, file) {
                this.dynamicForms.images.push(res.message)
                this.imagesVisible = true;
            },
            handleRemove(file, fileList) {
                this.dynamicForms.images = [];
                for (var item in fileList) {
                    this.dynamicForms.images.push(fileList[item].response.message)
                }
            },
            handleExceed() {
                this.$notify({
                    title: "图片上传",
                    type: "warning",
                    message: "最多上传九张照片"
                });
            },
            handleCommand(command) {
                this.dynamicForms.seeDetails = Number(command)
            },
            visibleChange(event) {
                this.isDropDown = event
            },
            loadEmojis() {
                const appData = require("../../assets/mate/emojis.json");
                for (let i in appData) {
                    this.faceList.push(appData[i].char);
                }
            },
            getBrow(index) {
                for (let i in this.faceList) {
                    if (index.toString() === i) {
                        this.getBrowString = this.faceList[index];
                        this.dynamicForms.content = this.dynamicForms.content + this.getBrowString
                    }
                }
                this.emojiShow = false;
            },
        }, mounted() {
            this.currentAddress();
        },
        beforeDestroy() {

        }
    };
</script>
<style scoped>
    .modal {
        position: absolute;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        margin: auto;
        height: 580px;
        box-shadow: 0 5px 15px 0 rgba(134, 152, 255, 0.3);
        min-width: 420px;
        overflow: hidden;
        background: #fff;
        z-index: 999;
        border-radius: 4px;
        transform: none;
    }

    .model-body {
        padding: 1rem;
        min-height: 2rem;
        max-height: 85%;
        overflow-y: auto;
    }

    .icon-close i {
        cursor: pointer;
    }

    .modal-overlay {
        content: '';
        position: absolute;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 998;
        background: rgba(104, 104, 104, 0.4);
    }

    .footer_btn {
        text-align: center;
        padding-bottom: 20px;
        padding-top: 10px;
    }

    .dis_in_center {
        display: inline-block;
        vertical-align: middle;
    }

    .right-btn {
        margin-left: 20px;
    }

    /deep/ .el-textarea__inner {
        border: none;
    }

    .browBox {
        width: 100%;
        height: 250px;
        background: #e6e6e6;
        position: absolute;
        z-index: 100;
        bottom: 0;
        overflow: scroll;
    }

    .browBox ul {
        display: flex;
        flex-wrap: wrap;
        padding: 10px;
    }

    .browBox li {
        cursor: pointer;
        width: 10%;
        font-size: 26px;
        list-style: none;
        text-align: center;
    }

    /deep/ .el-upload--picture-card {
        width: 100px;
        height: 100px;
        line-height: 100px;
    }

    /deep/ .el-upload-list--picture-card .el-upload-list__item {
        width: 100px;
        height: 100px;
    }

    /deep/ .custom-upload img {
        width: 100px;
        height: 100px;
    }

    /deep/ .el-form-item__content {
        line-height: 0;
    }
</style>
