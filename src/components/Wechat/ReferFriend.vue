<template>
    <div>
        <div class="search">
            <el-input placeholder="搜索好友(昵称/备注)"
                      prefix-icon="el-icon-search"
                      clearable
                      @input="init"
                      v-model="keyword" class="input-with-select" size="mini">
            </el-input>
        </div>
        <el-container>
            <el-main>
                <el-scrollbar wrap-style="overflow-x:hidden;" style="height: 100%">
                <div class="friends">
                        <el-table
                                ref="multipleTable"
                                :data="tableData"
                                tooltip-effect="dark"
                                :show-header="false"
                                @selection-change="handleSelectionChange"
                                style="width: 100%">
                            <el-table-column
                                    type="selection"
                                    width="30">
                            </el-table-column>
                            <el-table-column
                                    width="50px">
                                <template slot-scope="scope">
                                    <!-- 插槽内容，可以自定义表头 label -->
                                    <el-avatar size="large" :src="scope.row.avatar"></el-avatar>
                                </template>
                            </el-table-column>
                            <el-table-column :show-overflow-tooltip='true' width="195px">
                                <template slot-scope="scope">
                                    <p>{{scope.row.nickName}}</p>
                                    <!-- 插槽内容，可以自定义表头 label -->
                                </template>
                            </el-table-column>
                        </el-table>
                </div>
                </el-scrollbar>
            </el-main>
        </el-container>
        <div style="display: flex;justify-content: center;padding-bottom: 10px">
            <el-button type="danger" @click="cancelRef">关闭</el-button>
            <el-button type="info" v-if="this.multipleSelection===null || multipleSelection.length<=0">推送</el-button>
            <el-button type="primary" @click="push" v-else>推送</el-button>
        </div>
    </div>
</template>

<script>
    import service from "../../http";

    export default {
        name: "ReferFriend",
        props: {
            recommendFriendId: {
                type: Number,
                default: null
            }
        },
        data() {
            return {
                keyword: null,
                multipleSelection: null,
                tableData: [],
            }
        }, methods: {
            init() {
                service.get("/getRecommendFriends", {
                    params: {
                        userInfoId: this.recommendFriendId,
                        keyword: this.keyword
                    }
                }).then(res => {
                    this.tableData = res.data
                })
            },
            push(){
                var form ={};
                if (this.multipleSelection.length>0){
                    var params = [];
                    this.multipleSelection.forEach((item,index)=>{
                        params.push(item.id)
                    });
                    form.userIds = params.toString();
                    form.recommendFriendId = this.recommendFriendId
                    service({
                        method:"post",
                        url:"/sendRecommend",
                        // headers: {
                        //     'Content-Type': 'text/plain'
                        // },
                        data:form
                    }).then(res=>{
                        console.log(res)
                    })
                }
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            clearCacheAndClose() {
                this.keyword = null;
                this.multipleSelection = null;
                this.tableData = [];
            },
            cancelRef(){
               this.$emit("referFriendClose")
            }
        },
    }
</script>

<style scoped>
    .el-main {
        background-color: #ffffff;
        color: #333;
        height: 250px;
        border-radius: 6px;
    }

    body > .el-container {
        margin-bottom: 40px;
    }

    .footer {
        justify-content: center;
        margin-top: 10px;
        display: flex;
        flex-direction: row;
    }

    .search {
        width: 270px;
        padding-bottom: 10px;
        text-align: center;
        margin: 0 auto;
    }

    .friends {
        display: flex;
        flex-direction: column;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
    /deep/.el-table tbody tr:hover > td {
        background-color: transparent !important;
    }

</style>
