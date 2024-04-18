<template>
    <div style="margin: 0 auto">
        <el-menu class="el-menu-vertical-demo" mode="vertical">
            <div v-for="(item,index) in friendSearchList" class="item" :key="index">
                <el-menu-item
                        :key="item.id"
                        :index="item.id.toString()">
                    <div class="search-content" @click="$emit('clickSession',item)">
                        <div>
                            <img :src="item.avatar" style="width: 35px;height: 35px; overflow: hidden;"
                                 alt="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
                                 onerror="this.src='https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';this.onerror=null;"/>
                        </div>
                        <div class="friend-remark">
                            <span>{{item.remark}}</span>
                        </div>
                    </div>
                </el-menu-item>
            </div>
        </el-menu>
    </div>
</template>

<script>
    export default {
        name: "FriendSearch",
        data() {
            return {

                friendSearchList: []
            }
        }, methods: {
            searchView(data) {
                this.friendSearchList = data
            },
        }
    }
</script>

<style scoped>
    /deep/ .el-menu {
        background: #fff;
    }

    .el-menu-item.is-active {
        background-color: #e1eaf4 !important;
        color: #000000;

    span {
        color: #fff !important;
    }

    }

    /*/deep/.el-menu-item, .el-submenu__title{*/
    /*    line-height:1.5em*/
    /*}*/
    .item {
        background-color: #ffffff;
        cursor: pointer;
    }

    .friend-remark {
        display: flex;
        color: black;
        flex-direction: column;
        margin-left: 20px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .search-content {
        flex-direction: row;
        display: flex;
        align-items: center
    }
</style>
