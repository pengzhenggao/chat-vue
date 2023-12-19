<template>
    <div style="width: 100%;height: 100%">
        <el-container style="height: 100%">
            <el-aside width="17%">Aside</el-aside>
            <el-container>
                <el-main style="line-height: 100px;">

                        <p>MAIN</p><p>MAIN</p><p>MAIN</p><p>MAIN</p><p>MAIN</p>
                        <p>MAIN</p><p>MAIN</p><p>MAIN</p><p>MAIN</p><p>MAIN</p>

                </el-main>
                <el-footer height="160px">
                    <div>
                        <ChatEditor @submitMessage="submitMessage">

                        </ChatEditor>
                    </div>

                </el-footer>
            </el-container>

            <el-aside width="17%">Aside</el-aside>
        </el-container>
    </div>
</template>

<script>
    import ChatEditor from "@/components/editor/ChatEditor";
    export default {
        name: "LobbyChat",
        components:{
            ChatEditor
        },data(){
            return{

            }
        },methods:{
            submitMessage(){

            }
        }
    }
</script>

<style scoped>
    .el-header {
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        line-height: 60px;
    }

    .el-aside {
        background-color: #D3DCE6;
        color: #333;
        text-align: center;
    }

    /deep/ .el-footer {
        width: 100%;
        background-color: #f0f1f6;
        color: #333;

        padding: 30px 20px
    }

    /deep/ .el-main {
        background-color: #f1f2f6;
        color: #333;
        padding: 0 30px;
        overflow-y: auto;
    }

    body > .el-container {

    }

    .el-container:nth-child(5) .el-aside,
    .el-container:nth-child(6) .el-aside {
        line-height: 260px;
    }

    .el-container:nth-child(7) .el-aside {
        line-height: 320px;
    }
    /deep/.el-scrollbar__wrap {
        overflow-x: hidden;
    }
    /deep/.el-main::-webkit-scrollbar-track {
        display: none;
    }
    .el-main::-webkit-scrollbar {
        width: 5px; /* 设置滚动条宽度 */
    }
    .el-main::-webkit-scrollbar-track {
        background: #ffffff; /* 设置轨道背景色 */
    }

    .el-main::-webkit-scrollbar-thumb {
        background: #c9c9c9; /* 设置滚动条颜色 */
        border-radius: 5px;
    }

    .browBox {
        width: 100%;

        background: #e6e6e6;
        position: absolute;
        z-index: 100;
        bottom: 0;
        overflow: scroll;
    }

    .browBox ul {
        display: flex;
        flex-wrap: wrap;
        padding: 10px;
    }

    .browBox li {
        cursor: pointer;
        width: 10%;
        font-size: 26px;
        list-style: none;
        text-align: center;
    }

    .submit-btn {
        margin: 0 15px 10px 0;
        float: right;
    }

    .el-main .overScrollbar {
        overflow-y: auto;
    }

    .el-main .leaveScrollbar {
        overflow-y: hidden;
    }
    /deep/.la.el-button{
        padding: 10px 18px;
    }
</style>
