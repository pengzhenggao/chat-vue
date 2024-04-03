<template>
    <div class="main">
        <div>
            <el-button type="primary" icon="el-icon-c-scale-to-original"
                       v-if="systemAnnouncements" @click="closeAnnouncements(false)">关闭公告</el-button>
            <el-button type="info" icon="el-icon-c-scale-to-original"
                       v-else  @click="closeAnnouncements(true)">打开公告</el-button>
            <el-button type="warning" icon="el-icon-microphone"
                       v-if="promptSounds" @click="closeSounds(false)">关闭声音</el-button>
            <el-button type="info" icon="el-icon-turn-off-microphone"
                       v-else  @click="closeSounds(true)">打开声音</el-button>
            <el-button type="danger" icon="el-icon-refresh-right" @click="refreshConnect">重新连接</el-button>
        </div>
        <div>

        </div>
    </div>
</template>

<script>
    import {socket} from "../../../config/websocket/socket";

    export default {
        name: "SystemSetting",
        data(){
            return{
                promptSounds:null,
                systemAnnouncements:null,
            }
        },created() {
           this.initValue()
        },methods:{
            closeAnnouncements(data){
                this.$store.commit('updateSystemAnnouncements', data);
                this.initValue()
            },
            closeSounds(data){
                this.$store.commit('updatePromptSounds', data);
                this.initValue()
            },
            refreshConnect(){
                socket.reconnect()
            },
            initValue(){
                this.promptSounds = this.$store.getters.promptSounds;
                this.systemAnnouncements = this.$store.getters.systemAnnouncements
            }
        }
    }
</script>

<style scoped>
.main{
    display: flex;
    justify-content: center;
    padding: 0 40px 0 40px;
}
</style>
