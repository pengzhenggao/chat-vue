<template>
    <el-tabs class="dropdowns" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane name="first" style="padding:0">
            <span slot="label">好友通知</span>
            <div class="dropdowns-list-box">
                <div v-for="item in allFriendRequestList">
                    <friendMenu @friendMenu="friendMenu" :type="getType(item.isFriends)" :friendId="item.friendId"
                                :avatar="item.avatar" :nickName='item.nickName' :guestBook='item.guestBook'/>
                </div>
            </div>
<!--            <div class="dropdowns-foots">-->
<!--                清空通知-->
<!--            </div>-->
            <!-- <Empy type='Flag' text='你还没有新的代办事项' /> -->
        </el-tab-pane>
    </el-tabs>
</template>

<script>
    // 清空图标
    import Clear from '@/assets/icon/clear.svg'

    import friendMenu from "./friendMenu";
    import service from "../../http";

    export default {
        data() {
            return {
                allFriendRequestList: {},
                activeName: 'first',
                dropOff: false
            };
        },
        components: {
            friendMenu
        },
        mounted() {
            this.getAllFriendRequest()
        },
        methods: {
            getType(params) {
                if (params === 0) {
                    return 'primary'
                } else if (params === 1) {
                    return 'success'
                } else {
                    return 'danger'
                }
            },
            handleClick(tab, event) {
                // console.log(tab, event);
            },
            friendMenu(allFriendRequestList) {
                this.allFriendRequestList = allFriendRequestList;
                this.$emit("reduceRequests")
            },
            getAllFriendRequest() {
                service({
                    url: "/get/allFriendRequest",
                    method: "get",
                    params: {
                        currentPage: 1,
                        size: 10,
                    }
                }).then(res => {
                    this.allFriendRequestList = res.data;
                })
            }
        }
    }
</script>

<style>
    .el-tabs__nav-scroll {
        display: flex;
        justify-content: center;
    }

    .el-tabs__nav {
        /* width: 320px!important; */
        display: flex !important;
        justify-content: center !important;
    }

    .el-tabs__header {
        margin-bottom: 0 !important;
    }

    .dropdowns-dropBox {
        width: 100%;
        /* min-height: 330px;
        max-height: 450px; */
        max-height: 450px;
        overflow: hidden;
        position: relative;
    }

    .dropdowns-list-box {
        max-height: 450px;
        overflow-x: hidden;
        overflow-y: auto;
        -ms-overflow-style: none;
        overflow: '-moz-scrollbars-none';
        scrollbar-width: none; /*  火狐   */
        position: relative;
        padding-bottom: 40px;
        box-sizing: border-box;
    }

    .dropdowns-list-box::-webkit-scrollbar {
        display: none; /*  Chrome  */
        width: 0 !important; /*  Chrome  */
    }

    .dropdowns-list-box .drop:nth-last-child(1) {
        border-bottom: transparent;
    }

    .dropdowns-dropBox-scroll {
        width: 300px;
        /* height: 328px; */

    }

    .happy-scroll-container {
        width: 300px !important;
    }

    .happy-scroll-container .happy-scroll-content {
        /* padding-bottom: 38px !important; */
        box-sizing: border-box !important;
        width: 300px !important;
    }

    .happy-scroll-container {
        height: 290px !important;
    }

    .dropdowns-more {
        width: 100%;
        height: 30px;
        color: #2D8CF0;
        font-size: 14px;
        text-align: center;
        line-height: 30px;

    }

    .dropdowns-foots {
        width: 100%;
        height: 38px;
        background: #f7f7f7;
        font-size: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #515A6E;
        border-top: 1px solid #dcdfe6;
        position: absolute;
        bottom: -2px;
        left: 0;
    }

    .dropdowns-foots-iconsClear {
        width: 16px;
        height: 16px;
        margin-right: 5px;
        color: #515A6E;
        fill: currentColor;
    }

    .dropdowns-foots:hover {
        /* color: #2AB4FB!important; */
        background: #E8F6FD;
    }

    .disableds {
        pointer-events: none;
    }
</style>
