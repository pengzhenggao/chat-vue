<template>
    <div>
        <div class="container">
            <el-input v-model="keyword" clearable
                      style="width: 200px;margin-right: 20px" size="small"
                      placeholder="输入用户名"></el-input>
            <el-button size="small" type="primary" @click="search">搜索</el-button>
        </div>

        <div class="Information-table">
            <el-table
                    ref="multipleTable"
                    :key="tableKey"
                    :data="tableData"
                    tooltip-effect="dark"
                    style="width: 100%;"
                    @selection-change="handleSelectionChange">
                <el-table-column
                        type="selection"
                        >
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="name"
                        label="头像"
                        >
                    <template slot-scope="scope">
                        <el-image
                                style="width: 50px; height: 50px;border-radius: 50%"
                                :src="scope.row.avatar"
                                ></el-image>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="username"
                        label="昵称"
                        >
                </el-table-column>
                <el-table-column
                        prop="remark"
                        label="备注"
                       >
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="性别"
                        >
                    <template slot-scope="scope">
                            <span v-if="scope.row.gender===1"><el-tag>男</el-tag></span>
                        <span v-else><el-tag type="success">女</el-tag></span>

                    </template>
                </el-table-column>
                <el-table-column
                        label="操作"
                        >
                    <template slot-scope="scope">
                        <el-button
                                @click="cancelBlack(scope.row.friendId,scope.row.remark)"
                                type="text"
                                size="small">
                            <span style="color: #da4844;font-size:13px">移出黑名单</span>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    background
                    @current-change="handleCurrentChange"
                    layout="prev, pager, next"
                    :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import service from "../../http";

    export default {
        name: "FriendsBlacklist",
        props:{
            remark:{
              type:String,
              default:""
          }
        },
        data(){
            return{
                keyword:"",
                tableKey:0,
                friendIds:null,
                tableData:[],
                currentPage:1,
                size:10,
                total:0
            }
        },methods:{
            cancelBlack(friendIds,remark){
                this.$confirm(`是否移出‘${remark}’黑名单`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    service.delete(`/users/cancelBlacklistFriend/${friendIds.toString()}`).then(res=>{
                        if (res.code===20000){
                            this.$notify({
                                title:"移出成功",
                                type: 'success'
                            });
                            for (let i = 0; i < this.tableData.length; i++) {
                                if (this.tableData[i].friendId === friendIds){
                                    // 删除某行数据
                                    this.tableData.splice(this.tableData[i], 1);
                                    // 更新表格的唯一标识，触发动画效果
                                    this.tableKey += 1;
                                }
                            }
                        }
                    })
                }).catch(() => {
                    this.$notify({
                        title:"移出黑名单",
                        type:"info",
                        message:"已取消移出"
                    });
                });

            },
            search(){
                this.currentPage = 1;
                this.getBlacklist()
            },
            getBlacklist(){
                service({
                    methods: "get",
                    url:"users/getBlacklistFriend",
                    params:{
                        currentPage:this.currentPage,
                        size:this.size,
                        remark:this.keyword
                    }
                }).then(res=>{
                    this.total = res.total;
                    this.tableData = res.data
                })
            },
            toggleSelection(rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                } else {
                    this.$refs.multipleTable.clearSelection();
                }
            },
            handleSelectionChange(val) {
                this.friendIds = val;
            },
            handleCurrentChange(page){
                this.currentPage = page;
                this.getBlacklist()
            },
        },mounted() {
            this.getBlacklist()
            this.keyword = this.remark
        }
    }
</script>

<style scoped>
.container{
    text-align: right;
    margin: 0 0 10px 0;
}
</style>
