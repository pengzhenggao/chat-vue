import Vue from 'vue'
import VueI18n from 'vue-i18n'
// 从语言包文件中导入语言包对象
import ElementLocale from 'element-ui/lib/locale'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import zh from './modules/zh'
import en from './modules/en'
Vue.use(VueI18n);
const messages = {
    zh: {
        ...zh,
        ...zhLocale
    },
    en: {
        ...en,
        ...enLocale
    }
}

const i18n = new VueI18n({
    locale: sessionStorage.getItem("selectedValue")?sessionStorage.getItem("selectedValue"):'zh',
    messages
    // silentFallbackWarn: true, // 抑制警告
    // globalInjection: true // 全局注入
});
ElementLocale.i18n((key, value) => i18n.t(key, value))
export default i18n
