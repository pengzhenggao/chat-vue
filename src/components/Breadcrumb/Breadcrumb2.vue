<template>
    <el-breadcrumb class="app-breadcrumb" separator="/">
        <transition-group name="breadcrumb"  mode="out-in">
            <el-breadcrumb-item v-for="(item,index)  in levelList" :key="item.path" v-if='item.meta.title'>
                <span v-if='item.redirect==="wechat"||index===levelList.length-1' class="no-redirect">{{item.meta.title}}</span>
                <router-link v-else :to="item.redirect||item.path"><el-badge :is-dot="isDot" class="item">{{item.meta.title}}</el-badge></router-link>
            </el-breadcrumb-item>
        </transition-group>
    </el-breadcrumb>
</template>

<script>
    export default {
      created() {
        this.getBreadcrumb()
      },
      data() {
        return {
          isDot:false,
          levelList: null
        }
      },
      watch: {
        $route() {
          this.getBreadcrumb()
        }
      },
      methods: {
        getBreadcrumb() {
          let matched = this.$route.matched.filter(
                item => item.meta && item.meta.title && item.meta.breadcrumb !== false
            );
          const first = matched[0];
          if (first && first.name !== 'wechat') {
            matched = [{ path: '/wechat', meta: { title: '主页' }}].concat(matched)
              this.isDot = false
          }
          this.levelList = matched
        },
          updateIsDot(){
            if (this.isDot !== true && this.$route.path!=='/wechat'){
                this.isDot = true
            }
          },
      },mounted() {
          window.addEventListener("updateIsDot",this.updateIsDot)
        }
    }
</script>

<style scoped>
    /* .app-breadcrumb.el-breadcrumb {
        display: inline-block;
        font-size: 14px;
        line-height: 50px;
        margin-left: 10px;
    }
    .no-redirect {
            color: #97a8be;
            cursor: text;
        } */
    .breadcrumb-enter-active,
    .breadcrumb-leave-active{
        transition: all 0.5s;
    }
    /* .breadcrumb-enter,.breadcrumb-leave-to{
        opacity: 0;
        transform: translateX(20px);
    }
    .breadcrumb-enter-to,.breadcrumb-leave{
        opacity: 1;
        transform: translateX(0px);
    } */
    .breadcrumb-enter,
    .breadcrumb-leave-active{
        opacity: 0;
        transform: translateX(20px);
    }
    .breadcrumb-move{
        transition: all 0.5s;
    }
    .breadcrumb-leave-active{
        position: absolute;;
    }
    /deep/.el-badge__content.is-fixed{
        top: 13px;
    }
</style>
