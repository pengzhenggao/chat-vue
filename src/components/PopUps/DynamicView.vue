<template>
    <div v-if="showDialog">
        <transition name="fade" appear>
            <div class="modal-overlay"></div>
        </transition>
        <transition name="pop" appear class="custom-transition">
            <div class="modal" role="dialog" :style="{ width: `${width}px` }">
                <div class="model-body">
                    <div class="dynamic-main" v-if="dynamicItem.id!=null">
                        <div class="friend-dynamic"
                             :key="dynamicItem.id">
                            <img style="width: 50px;height: 50px;border-radius: 3px"
                                 :src="dynamicItem.avatar"/>
                            <div class="content">
                                <div class="username"><span>{{dynamicItem.nickName}}</span></div>
                                <div class="text">
                                    <span>{{dynamicItem.content}}</span>
                                </div>
                                <div class="image" v-if="dynamicItem.imageList!=null && dynamicItem.imageList.length>0">
                                    <el-image
                                            v-for=" (img,index) in dynamicItem.imageList"
                                            :key="index"
                                            class="custom-image"
                                            :src="img"
                                            :preview-src-list="dynamicItem.imageList">
                                    </el-image>
                                </div>
                                <div class="footer">
                                    <div class="released">
                                        <span>{{dynamicItem.updateTime}}</span>
                                    </div>
                                    <div class="comment-section">
                                        <div class="tool" @click.stop="more(dynamicItem.id)">
                                            <span class="el-icon-more"></span>
                                        </div>
                                    </div>
                                    <div class="operate" v-show="commentsAndThumbsUp === dynamicItem.id">
                                        <div class="thumbs-up" @click="lit(dynamicItem.id)">
                                <span v-if="dynamicItem.isLightUp===0"><i style="color: #ffba0b"
                                                                          class="el-icon-s-opportunity"></i> 点亮</span>
                                            <span v-else><i style="color: #cbcbcb" class="el-icon-s-opportunity"></i> 取消</span>
                                        </div>
                                        <el-divider direction="vertical"></el-divider>
                                        <div class="comments" @click.stop="comment(dynamicItem.id)">
                                            <span><i class="el-icon-chat-square"></i> 评论</span>
                                        </div>
                                    </div>
                                </div>
                                <div style="display: flex;flex-direction: column;margin-top: 10px">
                                    <!--                    点亮详情-->
                                    <div class="like-details" v-if="dynamicItem.lightUpUserName">
                                        <div>
                                            <span class="el-icon-s-opportunity" style="color: #dca10a">&nbsp;&nbsp;{{dynamicItem.lightUpUserName}}</span>
                                        </div>
                                    </div>
                                    <!--                    评论详情-->
                                    <div class="review-details"
                                         v-if="dynamicItem.commentNodeDTOS!=null && dynamicItem.commentNodeDTOS.length>0"
                                         v-for="(comment,index) in dynamicItem.commentNodeDTOS"
                                         :key="index">
                                        <div style="display: flex;flex-direction: row">
                                            <div class="review-message" v-show="comment.replyUserName!=null">
                                    <span class="user-nick"
                                          @click.prevent.stop="respondComments(dynamicItem.id,comment.commentUserName,comment.commentUserId)">
                                        {{comment.commentUserName}} <span style="color:#6394ff">回复</span> {{comment.replyUserName}}:</span>
                                                &nbsp;<span>{{comment.commentContent}}</span>
                                            </div>
                                            <div class="review-message" v-show="comment.replyUserName==null">
                                    <span class="user-nick"
                                          @click.prevent.stop="respondComments(dynamicItem.id,comment.commentUserName,comment.commentUserId)">
                                        {{comment.commentUserName}}:&nbsp;</span><span>{{comment.commentContent}}
                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <!--                    评论框-->
                                    <div class="input-box" v-show="commentBox === dynamicItem.id"
                                         @click.stop="comment(dynamicItem.id)" ref="scroll1">
                                        <el-input
                                                :rows="5"
                                                type="textarea"
                                                :autosize="{ minRows: 4, maxRows: 4 }"
                                                maxlength="60"
                                                :placeholder="respondCommentsContent==null?
                                    '请输入评论内容（按回车或Enter进行发送）':respondCommentsContent"
                                                @keyup.enter.native="submitComment()"
                                                show-word-limit
                                                v-model="commentForm.commentContent">
                                        </el-input>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <div style="display: flex;justify-content: center;width: 100%;height: 400px">
                            <el-empty
                                    :image-size="260"
                                    description="动态被隐藏或已删除"
                                   >
                            </el-empty>
                        </div>
                    </div>
                </div>
                <div class="footer_btn">
                    <div class="dis_in_center">
                        <el-button plain type="success" :size="size" @click="dynamic(friendFeedId)">
                            <i class="el-icon-refresh-right"></i> 刷新</el-button>
                    </div>
                    <div class="dis_in_center right-btn" :class="{ margin_left_20: showCancelButton }"
                         v-if="showCancelButton">
                        <el-button
                                :type="confimBtnType"
                                :loading="confimBtnLoading"
                                :size="size"
                                @click="confim('dynamicForms')"><i class="el-icon-refresh-left"/>{{ confimText }}
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
                dynamicItem: {},
                commentForm: {
                    commentContent: "",
                    friendFeedId: null,
                    replyUserId: null,
                    respondCommentsContent: null,
                },
                respondCommentsContent: null,
                friendDynamicMessageList: [],
                commentsAndThumbsUp: null,
                commentBox: false,
                postNewsShow: false,
                currentPage: 1,
                currentSize: 10,
                friendFeedId:null,
            }
        },
        methods: {
            dynamic(friendFeedId) {
                this.friendFeedId = friendFeedId
                service({
                    method: "get",
                    url: "/users/dynamic",
                    params: {
                        friendFeedId: friendFeedId
                    }
                }).then(res => {
                    this.dynamicItem = res.data
                })
            },
            reset() {
                this.commentForm = {
                    commentContent: "",
                    friendFeedId: null,
                    replyUserId: null,
                    respondCommentsContent: null,
                };
            },
            lit(friendFeedId) {
                service({
                    method: "put",
                    url: `/users/friendFeed/lit/${friendFeedId}`
                }).then(res => {
                    if (res.flag) {
                        this.dynamic(this.friendFeedId)
                    }

                })
            },
            comment(id) {
                this.commentBox = id;
                this.commentsAndThumbsUp = null;
                this.commentForm.friendFeedId = id
            },
            respondComments(id, userName, respondUserId) {
                this.respondCommentsContent = "回复 " + userName;
                this.commentForm.replyUserId = respondUserId;
                this.comment(id)
            },
            more(id) {
                this.commentsAndThumbsUp = id;
                this.commentBox = null;
            },
            publication() {
                this.$emit('closeDynamic', 'postNewsShow')
            },
            openDynamicView(friendFeedId) {
                this.$emit('closeDynamic', 'dynamicView', friendFeedId)
            },
            handleClickOutsideMore() {
                this.commentsAndThumbsUp = null;
                this.commentBox = false;
            },
            submitComment() {
                const params = JSON.parse(JSON.stringify(this.commentForm));
                this.reset();
                service({
                    method: "post",
                    url: "/users/friendFeed/comment",
                    data: params
                }).then(res => {
                    if (res.code === 20000) {
                        this.dynamic(this.friendFeedId);
                        this.commentsAndThumbsUp = null;
                        this.commentBox = false;
                    }

                })
            },
            close() {
                const data = this.beforeClose();
                if (!data) return;
                this.$emit('openDynamic');
            },
            confim() {
                this.reset();
                this.$emit('openDynamic');
            }
        }, mounted() {
            // 添加事件监听器
            document.addEventListener('click', this.handleClickOutsideMore);
        },
        beforeDestroy() {
            // 移除事件监听器
            document.removeEventListener('click', this.handleClickOutsideMore);
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

    .dynamic-main {
        height: 100%;
        padding-right: 20px;
        display: flex;
        flex-direction: column;
    }

    .dynamic-main .friend-dynamic {
        border-top: 1px solid #f0f0f0;
        padding-top: 10px;
        margin: 10px 0 20px 0;
        display: flex;
        flex-direction: row;
    }

    .dynamic-main .friend-dynamic .content {
        width: 100%;
        margin-left: 12px;
        display: flex;
        flex-direction: column;
    }

    .dynamic-main .friend-dynamic .content .username {
        font-size: 17px;
        color: #559eca;
    }

    .dynamic-main .friend-dynamic .content .text {
        text-align: left;
        margin-top: 8px;
        line-height: 1.5rem;
        word-break: break-all;
    }

    .dynamic-main .friend-dynamic .content .image {
        margin-top: 10px;
        width: 609px;
        display: flex;
        flex-wrap: wrap;
    }

    .custom-image {
        position: relative;
        overflow: hidden;
        margin-bottom: 4px;
        height: 308px;
    }

    /*四张图片总height:304px，9张图片总height：308px,2张占220px*/
    /*  3张图片  */
    .custom-image:nth-child(1):nth-last-child(3),
    .custom-image:nth-child(2):nth-last-child(2),
    .custom-image:nth-child(3):nth-last-child(1) {
        width: 49%;
        height: 150px;
    }

    /*  间隔  */
    .custom-image:nth-child(2):nth-last-child(2) {
        margin-left: 4px;
    }

    /*  2张图片  */
    .custom-image:nth-child(1):nth-last-child(2),
    .custom-image:nth-child(2):nth-last-child(1) {
        width: 49%;
        height: 308px;
    }

    /*  4张图片  */
    .custom-image:nth-child(1):nth-last-child(4),
    .custom-image:nth-child(2):nth-last-child(3),
    .custom-image:nth-child(3):nth-last-child(2),
    .custom-image:nth-child(4):nth-last-child(1) {
        height: 152px;
        width: 49%;
    }

    /* 每行的两张图片中间间隔2%的宽度 */
    /*  2张图片  */
    .custom-image:nth-child(2):nth-last-child(1),
        /*  4张图片  */
    .custom-image:nth-child(2):nth-last-child(3),
    .custom-image:nth-child(4):nth-last-child(1) {
        margin-left: 4px;
    }

    /*  5张以上图片  */
    .custom-image:nth-child(n + 5),
    .custom-image:nth-child(1):nth-last-child(n + 5),
    .custom-image:nth-child(1):nth-last-child(n + 5) ~ .custom-image {
        width: 32%;
        height: 100px;
    }

    .custom-image:nth-child(n + 5):not(:nth-child(3n + 1)),
    .custom-image:nth-child(1):nth-last-child(n + 5) ~ .custom-image:not(:nth-child(3n + 1)) {
        margin-left: 4px;
    }

    .dynamic-main .friend-dynamic .content .footer {

        display: flex;
        flex-direction: row;
        align-items: center;
        position: relative;
    }

    .dynamic-main .friend-dynamic .content .comment-section {
        display: flex;
        margin-left: auto;
        margin-top: 10px;
        cursor: pointer;
    }

    .dynamic-main .friend-dynamic .content .comment-section :hover {
        background-color: #dddddd;
    }

    .comment-section .tool {
        background-color: #f3f3f3;
        border-radius: 5px;
        color: #676767;
        padding: 0 6px 0 6px;
        font-size: 20px;

    }

    .footer .operate {
        position: absolute;
        width: 150px;
        border-radius: 5px;
        display: flex;
        flex-direction: row;
        height: 36px;
        right: 40px;
        font-size: 14px;
        color: #f3f3f3;
        bottom: -7px;
        background-color: #595959;
    }

    .footer .operate .thumbs-up {
        width: 48%;
        text-align: center;
        cursor: pointer;
        line-height: 36px;
    }

    .footer .operate .thumbs-up :hover {

    }

    .footer .operate .comments {
        cursor: pointer;
        width: 48%;
        text-align: center;
        line-height: 36px;
    }

    /deep/ .el-divider--vertical {
        height: 20px;
        margin-top: 7px;
        color: #484848;
    }

    /deep/ .el-divider {
        background-color: #535353;
    }

    .footer .released {
        font-size: 14px;
        color: #999999;
        margin-top: 10px;
    }

    .dynamic-main .friend-dynamic .content .like-details {
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        line-height: 35px;
        padding: 0 10px 0 10px;
        word-break: break-all;
        font-size: 13px;
        background-color: #f6f6f6;
        width: 100%;
        min-height: 35px;
    }

    .dynamic-main .friend-dynamic .content .review-details {
        display: flex;
        text-align: left;
        align-items: center;
        word-break: break-all;
        border-radius: 5px;
        background-color: #f6f6f6;
        line-height: 35px;
        width: 100%;
        min-height: 35px;
        padding: 0 10px 0 10px;
    }

    .review-details .user-nick {
        cursor: pointer;
        color: #dca10a;
    }

    .review-details .review-message {
        word-break: break-all;
        width: 100%;
        white-space: normal;
        font-size: 13px;
    }

    .dynamic-main .friend-dynamic .content .input-box {
        margin-top: 5px;
        background-color: #f6f6f6;
        width: 100%;
        border-top: 1px solid #e4e4e4;
        padding: 10px 10px 10px 10px;
    }

    /deep/ .el-textarea__inner:focus {
        border-color: #dca10a
    }

    /deep/ .el-badge__content.is-fixed {
        top: 15px;
    }

    .friend-dynamic-message {
        padding: 3px 10px 3px 10px;
        display: flex;
        flex-direction: row;
        cursor: pointer;
    }

    .friend-dynamic-message:hover {
        background-color: #f6f6f6;
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
</style>
