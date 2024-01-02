<template>
    <el-tabs class="dropdowns" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="通知" name="first" style="padding:0; " class="dropdowns-dropBox">

            <div class="dropdowns-list-box">
                <Drop v-for="item in notifyList" :type='item.icon'  iconColor='#ffffff' iconBgColor='#3593FE'
                      :text='item.notifyTitle'
                      :time='item.createTime'
                      style="background: #AFFCDD"/>
                <el-button class="dropdowns-more" :loading="false" type="text">加载更多</el-button>
            </div>
            <div class="dropdowns-foots">
                <!-- <Clear class="dropdowns-foots-iconsClear"  /> -->
                清空通知
            </div>
            <!-- <Empy type='Horn' text='你还没有新的通知' /> -->
        </el-tab-pane>
        <el-tab-pane label="消息" name="second" style="padding:0" class="dropdowns-dropBox">
            <div class="dropdowns-list-box">
                <NewsBox v-for="item in messageList" :text='item.messageTitle' :time='item.createTime'/>
            </div>
            <div class="dropdowns-foots">
                清空通知
            </div>
            <!-- <Empy type='News' text='你还没有新的消息' /> -->
        </el-tab-pane>
        <el-tab-pane name="third" style="padding:0">
            <span slot="label">公告</span>
            <div class="dropdowns-list-box">
                <Announcement :announcementList="announcementList"/>
            </div>
            <!-- <Empy type='Flag' text='你还没有新的代办事项' /> -->
        </el-tab-pane>
    </el-tabs>
</template>

<script>
    // 通知 每一栏
    import Drop from './drop'
    // 消息 每一栏
    import NewsBox from './newsBox'
    // 代办 每一栏
    import Announcement from './Announcement'
    // 清空图标
    import Clear from '@/assets/icon/clear.svg'

    // 空
    import Empy from './empy'
    import service from "../../http";

    export default {
        data() {
            return {
                activeName: 'first',
                dropOff: false,
                notifyList:[],
                messageList:[],
                announcementList:{}
            };
        },
        components: {
            Drop,
            Clear,
            NewsBox,
            Empy,
            Announcement
        },
        methods: {
            handleClick(tab, event) {
            },
            getNotify() {
                service({
                    method: "get",
                    url: "/user/notify",
                }).then(res => {
                    this.notifyList = res.data
                })
            },
            getMessage(){
                service({
                    method: "get",
                    url: "/user/getMessage",
                }).then(res => {
                    this.messageList = res.data
                })
            },
            getAnnouncement(){
                service({
                    method: "get",
                    url: "user/announcement",
                }).then(res => {
                    this.announcementList = res.data
                })
            }
        },mounted() {
            this.getNotify();
            this.getMessage();
            this.getAnnouncement()
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
