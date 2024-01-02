import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 引入进度条样式
import 'nprogress/nprogress.css'
import china from 'echarts/map/json/china.json'
import echarts from 'echarts'
// 炫酷图标
import dataV from '@jiaminghi/data-view'
//引入自定义滚动条
import HappyScroll from 'vue-happy-scroll'
import 'vue-happy-scroll/docs/happy-scroll.css'
//自动滚动插件
import scroll from 'vue-seamless-scroll'
// 炫酷的粒子动效
import VueParticles from 'vue-particles'
// 全局路由守卫
import './router/permission'
import {  Message} from 'element-ui';
// 全局注册指令
import vPermission from './directive/permission'
import VueFocus from 'v-focus';
// 引入图表
import VCharts from 'v-charts'
import SlideVerify from 'vue-monoplasty-slide-verify';
Vue.use(SlideVerify);
Vue.use(VCharts)
Vue.use(VueFocus);
Vue.prototype.$echarts = echarts;
echarts.registerMap('china', china);
Vue.use(dataV);
Vue.config.productionTip = false;
Vue.use(HappyScroll);
Vue.use(scroll);
Vue.use(VueParticles);
// ****************防止message同样内容多次弹出**************************
let messageInstance = null;
const overrideMessage = (options) => {
    if (messageInstance) {
        messageInstance.close()
    }
    messageInstance = Message(options)};
['error', 'success', 'info', 'warning'].forEach(type => {
    Message[type] = options => {
        if (typeof options === 'string') {
            options = {
                message: options,
            }
        }
        options.type = type
        return overrideMessage(options)
    }
})
Vue.use(ElementUI);
//挂载
Vue.prototype.$message = overrideMessage;
// ****************《《《《《《《《《《《《《《《**************************
Vue.directive('permission', vPermission);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
