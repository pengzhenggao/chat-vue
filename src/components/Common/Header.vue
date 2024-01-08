<template>
    <div class="header">
        <div class="system-name">
            <img src="../../../public/logo.png" style="width: 25px"/>
            <span class="logo-name">网页即时聊天系统</span><span style="margin-left: 20px">{{this.name}}</span>
            <div style="margin-left: auto;margin-right: 50px;font-size: 15px">
                <el-dropdown trigger="click">
  <span class="el-dropdown-link languages">
      中文
      <span class="el-icon-arrow-down "></span>
  </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>中&emsp; 文</el-dropdown-item>
                        <el-dropdown-item>English</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Header",
        props: {
            name: {
                type: String,
                default: null
            }
        },
        data() {
            return {}
        },
        methods: {
            switchLanguages() {

            }
        }
    }
</script>

<style scoped>
    .header {
        background-color: white;
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        height: 60px;
        box-shadow: rgba(0, 0, 0, 0.15) 0 2px 15px;
    }

    .system-name {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        margin-left: 3%;
        font-family: "PingFang SC", serif;
        line-height: 60px;
        font-size: 20px;
        font-weight: 800;
        color: #000000;
    }

    .system-name .logo-name {
        background-image: -webkit-linear-gradient(top, #bc8550, #d77f34, #de6912);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .languages {
        margin-left: 2px;
        cursor: pointer;
    }
</style>
