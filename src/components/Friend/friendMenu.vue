<template>
    <div class="drop">
        <div class="drop-left">
            <img :src="avatar"/>
        </div>
        <div class="drop-right">
            <p>{{nickName}}</p>
            <p>{{guestBook}}</p>
        </div>
        <div class="drop-left">
            <div v-if="type === 'primary'">
                <el-link @click="agree(friendId)" :disabled="isDisabled"
                         class="" type="primary" :underline="false">
                    <span>同意</span>
                </el-link>
                <el-link @click="reject(friendId)" :disabled="isDisabled"
                         class="" type="primary" :underline="false">
                    &emsp;<span style="color: red">拒绝</span>
                </el-link>
            </div>
            <el-link v-if="type === 'success'" class="drop-left-btns drop-left-btns-success" type="success"
                     :underline="false">已同意
            </el-link>
            <el-link v-if="type === 'warning'" class="drop-left-btns drop-left-btns-warning" type="warning"
                     :underline="false">已拒绝
            </el-link>
            <el-link v-if="type === 'danger'" class="drop-left-btns drop-left-btns-danger" type="danger"
                     :underline="false">已拒绝
            </el-link>
            <el-link v-if="type === 'info'" class="drop-left-btns drop-left-btns-info" type="info" :underline="false">
                已拒绝
            </el-link>
        </div>
    </div>
</template>

<script>
    import {getToken} from "../../utils/auth";
    import {socket} from "../../config/websocket/socket";
    import service from "../../http";

    export default {
        props: {
            friendId: {
                type: Number,
                default: 0,
                required: true
            },
            avatar: {
                type: String,
                default: 'http://public.nodebook.top/20200319164136.jpg',
                required: true
            },
            nickName: {
                type: String,
                default: 'Zhuye',
                required: true
            },
            guestBook: {
                type: String,
                required: true
            },
            type: {
                type: String,
                default: 'info',
                validator: function (value) {
                    // 这个值必须匹配下列字符串中的一个
                    return ['info', 'danger', 'warning', 'success', 'primary'].indexOf(value) !== -1
                }
            },
        },
        data() {
            return {
                isDisabled: false,
                sendMessage: {
                    action: 10004,       //聊天标识
                    token: getToken(),
                    extend:2,
                    receiverId: "",     //接收方
                    content: "你好",         //聊天输入内容
                }
            }
        },
        methods: {
            agree(friendId) {
                this.isDisabled = true;
                this.sendMessage.receiverId = friendId;
                socket.send(this.sendMessage);
            },
            reject(friendId){
                this.isDisabled = true;
                service({
                    url: "users/reject",
                    method: "delete",
                    params: {
                        friendId: friendId
                    }
                }).then(res=>{
                    if (res && res.code===20000){
                        this.notifyFlush()
                    }
                    this.isDisabled = false;
                }).catch(()=>{
                    this.isDisabled = false;
                })
            },
            notifyFlush(){
                service({
                    url: "users/get/allFriendRequest",
                    method: "get",
                    params: {
                        currentPage: 1,
                        size: 10,
                    }
                }).then(res => {
                    this.$emit("friendMenu",res.data);
                    this.isDisabled = false;
                }).catch(()=>{
                    this.isDisabled = false;
                })
            }
        },mounted() {
            window.addEventListener('buddyListPopulation', this.notifyFlush);
        }
    }
</script>

<style scoped>
    .drop {
        width: 300px;
        min-height: 65px !important;
        max-height: 87px !important;
        border-bottom: 1px solid #dcdfe6;
        padding: 12px 24px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: flex-start;

    }

    .drop:hover {
        background: #E2EFFD;
    }

    .drop:hover img {
        transform: scale(1.0) rotate(360deg);
        opacity: 1;
    }

    .drop-left {
        width: 80px;
        height: 35px;
        border-radius: 16px;
        margin-right: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
    }

    .drop-left img {
        border-radius: 50%;
        width: 35px;
        height: 35px;
        transition: all 0.5s;
    }

    .drop-left-icon {
        width: 20px;
        height: 20px;
        fill: currentColor;
        opacity: 0.9;
        transition: all 0.5s;
    }

    .drop-left-btns {
        height: 20px;
        padding: 0 10px;
        font-size: 12px;
        border-radius: 2px;
    }

    .drop-left-btns-primary {
        background: #E8F6FD;
        border: 1px solid #91D5FF;
    }

    .drop-left-btns-success {
        background: #F8FDF6;
        border: 1px solid #A2FC76;
    }

    .drop-left-btns-warning {
        background: #FDF9F4;
        border: 1px solid #FDC673;
    }

    .drop-left-btns-danger {
        background: #FEF5F5;
        border: 1px solid #FCBEBE;
    }

    .drop-left-btns-info {
        background: #FCFCFD;
        border: 1px solid #CDCDCD;
    }

    .drop-right {
        flex: 1;
        display: flex;
        align-items: stretch;
        flex-wrap: wrap;

    }



    .drop-right p:nth-child(1) {
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #515a6e;
        margin-bottom: 5px;
        max-height: 44px;
        min-height: 22px;
        /*text-overflow: -o-ellipsis-lastline;*/
        overflow: hidden;
        text-overflow: ellipsis;


        width: 72px;
        white-space: nowrap;
    }

    .drop-right p:nth-child(2) {
        font-size: 12px;
        color: #808695;
        width: 72px;
        text-overflow: ellipsis;
        overflow: hidden; white-space: nowrap;
    }

</style>
