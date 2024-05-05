<template>
    <div>
        <div class="myself">
            <div class="submit-dynamic" @click.stop="dynamicLists()">
                <el-tooltip content="刷新" placement="bottom" effect="light" :open-delay="450">
                    <span class="el-icon-refresh-right camera"></span>
                </el-tooltip>
            </div>
            <div class="submit-dynamic">
                <el-popover
                        placement="bottom-start"
                        width="350"
                        @show="read()"
                        trigger="hover">
                    <el-scrollbar style="height: 100%">
                        <div style="max-height: 360px">
                            <div class="friend-dynamic-message" v-for="(item,index) in this.friendDynamicMessageList"
                                 @click="openDynamicView(item.friendFeedId)"
                                 :key="index">
                                <img :src="item.userAvatar" style="width: 50px;height: 50px;border-radius: 5px"/>
                                <div style="display: flex;flex-direction: column;margin-left: 10px;line-height: 22px">
                                    <div style="color: #78a1ff;font-weight: bold">{{item.remark}}</div>
                                    <div v-if="item.type===1"><span v-if="item.isReply===1">回复
                                    <span style="color: #78a1ff">{{item.replyUserName}}</span>: </span>
                                        <span>{{item.content}}</span></div>
                                    <div v-else><i style="color: #ffba0b" class="el-icon-s-opportunity"/>点亮了</div>
                                    <span style="font-size: 12px;color: #999999">{{item.createTime}}</span>
                                </div>
                            </div>
                        </div>
                    </el-scrollbar>
                    <div slot="reference">
                        <el-badge :value="dynamicCount" class="item" :max="100" v-if="dynamicCount>0">
                            <span class="el-icon-chat-square camera"></span>
                        </el-badge>
                        <span class="el-icon-chat-square camera" v-else></span>
                    </div>
                </el-popover>

            </div>
            <div class="submit-dynamic" @click="publication()" style="display: flex;margin-left: auto">
                <el-tooltip content="发动态" placement="bottom" effect="light" :open-delay="450">
                    <span class="el-icon-camera camera"></span>
                </el-tooltip>
            </div>
            <div class="avatar">
                <img :src="$store.getters.userLogin.avatar"/>
            </div>
        </div>
        <div class="dynamic-main" v-if="this.friendDynamicList.length>0">
            <div class="friend-dynamic" v-for="(friendDynamicListItem,index) in this.friendDynamicList"
                 :key="friendDynamicListItem.id">
                <img style="width: 50px;height: 50px;border-radius: 3px"
                     :src="friendDynamicListItem.avatar"/>
                <div class="content">
                    <div class="username"><span>{{friendDynamicListItem.nickName}}</span></div>
                    <div class="text">
                        <span>{{friendDynamicListItem.content}}</span>
                    </div>
                    <div class="image" v-if="friendDynamicListItem.imageList.length>0">
                        <el-image
                                v-for=" (img,index) in friendDynamicListItem.imageList"
                                :key="index"
                                class="custom-image"
                                :src="img"
                                :preview-src-list="friendDynamicListItem.imageList">
                        </el-image>
                    </div>
                    <div class="footer">
                        <div class="released">
                            <span>{{friendDynamicListItem.updateTime}}</span>
                        </div>
                        <div class="comment-section">
                            <div class="tool" @click.stop="more(friendDynamicListItem.id)">
                                <span class="el-icon-more"></span>
                            </div>
                        </div>
                        <div class="operate" v-show="commentsAndThumbsUp === friendDynamicListItem.id">
                            <div class="thumbs-up" @click="lit(friendDynamicListItem.id)">
                                <span v-if="friendDynamicListItem.isLightUp===0"><i style="color: #ffba0b"
                                                                                    class="el-icon-s-opportunity"></i> 点亮</span>
                                <span v-else><i style="color: #cbcbcb" class="el-icon-s-opportunity"></i> 取消</span>
                            </div>
                            <el-divider direction="vertical"></el-divider>
                            <div class="comments" @click.stop="comment(friendDynamicListItem.id)">
                                <span><i class="el-icon-chat-square"></i> 评论</span>
                            </div>
                        </div>
                    </div>
                    <div style="display: flex;flex-direction: column;margin-top: 10px">
                        <!--                    点亮详情-->
                        <div class="like-details" v-if="friendDynamicListItem.lightUpUserName">
                            <div>
                                <span class="el-icon-s-opportunity" style="color: #dca10a">&nbsp;&nbsp;{{friendDynamicListItem.lightUpUserName}}</span>
                            </div>
                        </div>
                        <!--                    评论详情-->
                        <div class="review-details" v-if="friendDynamicListItem.commentNodeDTOS.length>0"
                             v-for="(comment,index) in friendDynamicListItem.commentNodeDTOS"
                             :key="index">
                            <div style="display: flex;flex-direction: row">
                                <div class="review-message" v-show="comment.replyUserName!=null">
                                    <span class="user-nick"
                                          @click.prevent.stop="respondComments(friendDynamicListItem.id,comment.commentUserName,comment.commentUserId)">
                                        {{comment.commentUserName}} <span style="color:#6394ff">回复</span> {{comment.replyUserName}}:</span>
                                    &nbsp;<span>{{comment.commentContent}}</span>
                                </div>
                                <div class="review-message" v-show="comment.replyUserName==null">
                                    <span class="user-nick"
                                          @click.prevent.stop="respondComments(friendDynamicListItem.id,comment.commentUserName,comment.commentUserId)">
                                        {{comment.commentUserName}}:&nbsp;</span><span>{{comment.commentContent}}
                                </span>
                                </div>
                            </div>
                        </div>
                        <!--                    评论框-->
                        <div class="input-box" v-show="commentBox === friendDynamicListItem.id"
                             @click.stop="comment(friendDynamicListItem.id)" ref="scroll1">
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
        <div v-else style="display: flex;justify-content: center;margin-top: 200px;
        color: #999999;cursor: pointer">
            <div @click.stop="publication()">
                <span class="el-icon-camera"></span>&nbsp;
                <span>暂无其他动态</span>
            </div>
        </div>
    </div>
</template>

<script>
    import service from "../../http";

    export default {
        name: "FriendDynamic",
        data() {
            return {
                friendDynamicList: [],
                commentForm: {
                    commentContent: "",
                    friendFeedId: null,
                    replyUserId: null,
                },
                respondCommentsContent: null,
                friendDynamicMessageList: [],
                dynamicCount: 0,
                commentsAndThumbsUp: null,
                commentBox: false,
                postNewsShow: false,
                currentPage: 1,
                currentSize: 10,
            }
        }, methods: {
            dynamicLists() {
                service({
                    method: "get",
                    url: "/users/dynamic/lists",
                    params: {
                        currentPage: this.currentPage,
                        size: this.currentSize
                    }
                }).then(res => {
                    this.friendDynamicList = res.data
                }).catch(() => {

                })
            },
            friendDynamicMessage() {
                service.get("/users/friendFeedMessage")
                    .then(res => {
                        this.friendDynamicMessageList = res.data
                    })
            },
            dynamicMessageCount() {
                service.get("/users/friendFeedMessageCount")
                    .then(res => {
                        this.dynamicCount = res.data
                    })
            },
            reset() {
                this.commentForm = {
                    commentContent: "",
                    friendFeedId: null,
                    replyUserId: null,
                    respondCommentsContent: null,
                    respondUserId: null,
                };
            },
            lit(friendFeedId) {
                service({
                    method: "put",
                    url: `/users/friendFeed/lit/${friendFeedId}`
                }).then(res => {
                    if (res.flag) {
                        this.dynamicLists()
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
                this.$emit('closeDynamic','postNewsShow')
            },
            openDynamicView(friendFeedId){
                this.$emit('closeDynamic','dynamicView',friendFeedId)
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
                        this.dynamicLists();
                        this.commentsAndThumbsUp = null;
                        this.commentBox = false;
                    }

                })
            },
            read() {
                service.put("/users/friendFeedMessage/read").then(res => {
                    if (res.flag) {
                        this.dynamicCount = 0
                    }
                })
            },
            scrollIntoView() {

            }
        },
        mounted() {
            // 添加事件监听器
            document.addEventListener('click', this.handleClickOutsideMore);
            this.dynamicLists();
            this.dynamicMessageCount();
            this.friendDynamicMessage()
        },
        beforeDestroy() {
            // 移除事件监听器
            document.removeEventListener('click', this.handleClickOutsideMore);
        },
    }
</script>

<style scoped>
    .myself {
        padding: 10px 10px 10px 10px;
        height: 60px;
        width: 100%;
        background-color: #f7f7f7;
        margin-bottom: 20px;
        display: flex;
        margin-left: auto;
    }

    .myself .avatar {
        display: flex;
        margin-left: auto;
    }

    .myself .avatar img {
        cursor: pointer;
        border-radius: 5px;
    }

    .myself .submit-dynamic {
        cursor: pointer;
        margin-left: 10px;
    }

    .myself .submit-dynamic :hover {
        color: #ffba0b;
    }

    .camera {
        font-size: 25px;
        margin-top: 18px;
        color: #999999
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
        height: 130px;
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

    /deep/ .el-popover {
        height: 100px;
        overflow: auto;
    }
</style>
