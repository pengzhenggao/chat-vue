<template>
    <div class="Informationall">
        <!-- <div class="Informationall-box"> -->
        <el-tabs v-model="activeName" @tab-click="handleClick" class="Informationall-box">
            <el-tab-pane label="好友分组" name="group">
                <div class="Informationall-list">
                    <FriendGroup/>
                </div>
            </el-tab-pane>
            <el-tab-pane label="黑名单" name="blacklist">
                <div class="Informationall-list">
                    <FriendsBlacklist/>
                </div>
            </el-tab-pane>
        </el-tabs>
        <!-- </div> -->
    </div>
</template>

<script>
    import InformationList from '../../components/Setting/InformationList'
    import FriendsBlacklist from "../../components/Setting/FriendsBlacklist";
    import FriendGroup from "../../components/Setting/FriendGroup";

    export default {
        data() {
            return {
                activeName: 'group'
            }
        },
        methods: {
            handleClick() {

            }
        },
        components: {
            InformationList,
            FriendsBlacklist,
            FriendGroup
        },
        mounted() {
            if (this.$route.query.activeName){
               this.activeName = this.$route.query.activeName
            }
        },
    }
</script>

<style>
    .Informationall {
        width: 100%;
        min-height: 100%;
        padding: 25px;
        box-sizing: border-box;
    }

    .Informationall-box {
        width: 100%;
        min-height: 100%;
        border-radius: 5px;
        padding: 15px;
        box-sizing: border-box;
        background: #ffffff;
    }

    .Informationall-box .el-tabs__nav-scroll {
        justify-content: flex-start !important;
        padding-left: 15px;
        box-sizing: border-box;
    }

    .Informationall-list {
        width: 100%;
        height: auto;
        padding: 15px;
        box-sizing: border-box;
    }
</style>
