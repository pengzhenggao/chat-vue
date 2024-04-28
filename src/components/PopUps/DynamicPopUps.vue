<template>
    <div v-if="showDialog">
        <transition name="fade" appear>
            <div class="modal-overlay"></div>
        </transition>
        <transition name="pop" appear class="custom-transition">
            <div class="modal" role="dialog" :style="{ width: `${width}px` }">
                <div class="model-title">
                    <div class="title-text">
                        <span><i class="el-icon-help"/> {{ title }}</span>
                        <div class="icon-close" v-if="showClose">
                            <i class="el-icon-close" @click="close"></i>
                        </div>
                    </div>
                    <div class="semiel-lipse"></div>
                </div>
                <div class="model-body" >
                    <el-backtop target=".model-body" :visibility-height=100></el-backtop>
                    <slot></slot>
                </div>
                <div class="footer_btn">
                    <div class="dis_in_center" v-if="showConfimButton">
                        <el-button
                                :disabled="disabled"
                                :type="confimBtnType"
                                :loading="confimBtnLoading"
                                :size="size"
                                @click="confim"
                        >
                            {{ confimText }}
                        </el-button>
                    </div>
                    <div class="dis_in_center right-btn" :class="{ margin_left_20: showCancelButton }" v-if="showCancelButton">
                        <el-button plain :type="cancelType" :size="size" @click="close">{{ cancelText }}</el-button>
                    </div>

                </div>
            </div>
        </transition>
    </div>
</template>
<script>
    export default {
        name: 'DynamicPopUps',
        components: {},
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
        },data(){
            return{
                resizeObserver:null,
            }
        },
        methods: {
            close() {
                const data = this.beforeClose();
                if (!data) return;
                this.$emit('change', false);
            },
            confim() {
                this.$emit('confim', false);
            }
        },mounted() {

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
        height: 650px;
        box-shadow: 0 5px 15px 0 rgba(134, 152, 255, 0.3);
        min-width: 750px;
        overflow: hidden;
        background: #fff;
        z-index: 999;
        border-radius: 4px;
        transform: none;
    }

    .model-body {
        padding: 2rem;
        min-height: 2rem;
        max-height: 85%;
        overflow-y: auto;
    }

    .model-title {
        position: relative;
        height: 64px;
        text-align: center;
        overflow: hidden;
        line-height: 47px;
        width: 100%;
        color: #fff;
        font-size: 18px;
    }

    .semiel-lipse {
        position: absolute;
        width: 110%;
        left: -5%;
        height: 120%;
        top: -50%;
        background: #dcb753;

    }

    .title-text {
        position: relative;
        z-index: 1000;
    }

    .icon-close {
        position: absolute;
        right: 25px;
        top: 0;
        line-height: 47px;
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
        padding-top: 20px;
    }

    .dis_in_center {
        display: inline-block;
        vertical-align: middle;
    }

    .right-btn {
        margin-left: 20px;
    }

    /* ---------------------------------- */
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.4s linear;
    }

    .fade-enter,
    .fade-leave-to {
        opacity: 0;
    }

    .pop-enter-active,
    .pop-leave-active {
        transition: transform 0.4s cubic-bezier(0.5, 0, 0.5, 1), opacity 0.4s linear;
    }

    .pop-enter,
    .pop-leave-to {
        opacity: 0;
        transform: scale(0.3) translateY(-50%);
    }

    /deep/.model-body::-webkit-scrollbar-track {
        display: none;
    }

    /deep/.el-backtop{
        position: absolute;
        opacity:0.9;
    }
</style>
