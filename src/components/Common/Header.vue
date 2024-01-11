<template>
    <div class="header">
        <div class="system-name">
            <img src="../../../public/logo.png" style="width: 25px"/>
            <span class="logo-name">{{$t('system.logoName')}}</span><span style="margin-left: 20px">{{this.name}}</span>
            <div style="margin-left: auto;margin-right: 50px;font-size: 15px">
                <el-dropdown trigger="click" @command="switchLanguages" v-model="selectedValue">
  <span class="el-dropdown-link languages">
    <languages style="width: 18px;height: 18px;margin-right: 5px"/><span>{{this.languages}}</span> <span class="el-icon-arrow-down "></span>
  </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="item in options" :command="item.value"
                                          :key="item.value" :label="item.label" :value="item.value"
                        :class="{'dropdown-selected':selectedValue===item.value}">
                            {{ item.label }}  </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>

<script>
    import languages from "../../assets/icon/languages.svg"
    export default {
        name: "Header",
        components:{
            languages
        },
        props: {
            name: {
                type: String,
                default: null
            }
        },
        data() {
            return {
                selectedValue:sessionStorage.getItem("selectedValue")?sessionStorage.getItem("selectedValue"):"zh",
                languages:sessionStorage.getItem("languages")?sessionStorage.getItem("languages"):"中文",
                options: [
                    { value: 'zh', label: '中文' },
                    { value: 'en', label: 'English' },
                ]
            }
        },
        methods: {
            switchLanguages(command) {
                this.selectedValue = command;
                this.$i18n.locale = command;
                this.languages = command ==="zh"?"中文":"English"
                sessionStorage.setItem("languages",this.languages)
                sessionStorage.setItem("selectedValue",this.selectedValue)
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
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-left: 2px;
        cursor: pointer;
    }
    .dropdown-selected{
        background-color: #d6fcff;
    }
</style>
