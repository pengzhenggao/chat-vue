<template>
    <div class="pop-container">
        <div ref="popRef" :style="{width: popWidth + 'px'}" :class="{'maxHeight7': !isFull}"
             class="container">
            <div class="top">
                <h3>{{ title }}</h3>
                <div style="display: flex;flex-direction: row;align-items: center">
                    <i v-if="fullScreenIcon" class="el-icon-full-screen el-icon-tools" @click="isFullScreen"/>
                    <!--                    <i class="el-icon-close el-icon-tools" @click="closePop"/>-->
                </div>
            </div>
            <div :class="{'maxHeight5': !isFull}" class="main-container">
                <slot/>
                <div v-if="btnShow" class="btn-content">
                    <el-button size="small" @click="closePop">{{ closeBtn }}</el-button>
                    <el-button size="small" type="primary" @click="submitPop">{{ submitBtn }}</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'AudioPopUps',
        props: {
            title: {
                type: String,
                default: ''
            },
            fullScreenIcon: { // 是否显示按钮
                type: Boolean,
                default: false
            },
            btnShow: { // 是否显示按钮
                type: Boolean,
                default: true
            },
            closeBtn: { // 关闭按钮-文字
                type: String,
                default: '取消'
            },
            submitBtn: { // 确定按钮-文字
                type: String,
                default: '确定'
            },
            popWidth: { // 弹出层宽度
                type: Number,
                default: 400
            },
        },
        data() {
            return {
                count:60,
                isFull: false
            }
        },
        created() {
            const that = this
            window.onresize = function () {
                if (!checkFull()) {
                    // 要执行的动作
                    that.isFull = false
                }
            }

            function checkFull() {
                var isFull =
                    document.fullscreenElement ||
                    document.mozFullScreenElement ||
                    document.webkitFullscreenElement
                // to fix : false || undefined == undefined
                if (isFull === undefined) isFull = false
                return isFull
            }
        },
        methods: {
            closePop() {
                this.$emit('closePop')
            },
            submitPop() {
                this.$emit('submitPop')
            },
            isFullScreen() {
                if (!this.isFull) {
                    this.$refs.popRef.requestFullscreen()
                } else {
                    document.exitFullscreen()
                }
                this.isFull = !this.isFull
            }
        }
    }
</script>
<style lang="stylus" scoped>
    $primaryColor = #17caaa

    .pop-container {
        position fixed
        left: 0;
        top: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.55);
        overflow: auto;
        z-index: 2000;

        .container {
            background-color #FFFFFF
            border-radius: 4px;
            overflow: auto;

            .top {
                height: 46px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid #EEEFF1;

                h3 {
                    font-size: 14px;
                    color: #283550;
                    padding-left: 20px;
                    position: relative;

                    &:after {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 6px;
                        height: 100%;
                        display: block;
                        content: '';
                        background: $primaryColor;
                    }
                }

                .el-icon-tools {
                    color: #AFAFAF;
                    font-size: 20px;
                    font-weight: bold;
                    cursor: pointer;
                    margin-right: 16px;
                }

                .el-button {
                    padding :4px 8px;
                    font-size 11px
                    margin-right : 10px
                }
            }

            .main-container {
                padding 15px 20px
                overflow auto

                .btn-content {
                    float: right;
                    margin-top 15px
                }
            }
        }
    }

    .maxHeight7 {
        max-height 700px
    }

    .maxHeight5 {
        max-height 600px
    }
</style>

