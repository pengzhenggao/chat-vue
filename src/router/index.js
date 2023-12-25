import Vue from 'vue'
import VueRouter from 'vue-router'

import Layout from '@/layout'
import {getModeType} from "../utils/mode-type"; //布局页


Vue.use(VueRouter)

// 通用页面, 这里的配置不需要权限
export const constRouter = [
    {
        path: '/login',
        component: () => import('@/views/login/Login'),
        hidden: true, //导航菜单忽略选项
        meta: {
            title: '登入界面'
        }
    },
    {
        path: '/register',
        name: "register",
        component: () => import('@/views/register/Register'),
        hidden: true, //导航菜单忽略选项
        meta: {
            title: '注册页面'
        }
    },
    {
        path: '/password-find',
        name: "password-find",
        component: () => import('@/views/forgotpassword/PasswordFind'),
        hidden: true, //导航菜单忽略选项
        meta: {
            title: '找回密码'
        }
    },
  {
    path: '/forgot-password',
    name: "forgot-password",
    component: () => import('@/views/forgotaccount/Index'),
    hidden: true, //导航菜单忽略选项
    meta: {
      title: '找回密码'
    }
  },
    {
        path: '/set-password',
        name: "set-password",
        component: () => import('@/views/forgotpassword/SetPassword'),
        hidden: true, //导航菜单忽略选项
        meta: {
            title: '设置密码'
        }
    },
    {
        path: '/authentication',
        name: "authentication",
        component: () => import('@/views/forgotpassword/Authentication'),
        hidden: true, //导航菜单忽略选项
        meta: {
            title: '身份验证'
        }
    },
    {
        path: '/password-recovery',
        name: "password-recovery",
        component: () => import('@/views/forgotpassword/PasswordRecovery'),
        hidden: true, //导航菜单忽略选项
        meta: {
            title: '设置新密码'
        }
    },
    {
        path: '',
        component: Layout, //应用布局页
        redirect: '/wechat',
        hidden: true,

    },
    {
        path: '/oauth/login/:type',
        name: 'oauth',
        component: () => import('@/components/OauthLogin.vue'),
        hidden: true, //导航菜单忽略选项
        meta: {
            title: '第三方登入'
        }
    },
    {
        path: '/',
        component: Layout, //应用布局页
        name: 'wechat',
        meta: {
            icon: 'el-icon-s-home' //导航菜单图标
        },
        children: [
            {
                path: '/wechat',
                component: () => import('@/views/communication/WeChat.vue'),
                name: 'wechat',
                meta: {
                    title: "主页",
                    icon: 'el-icon-s-home',
                    roles: ['user']
                }
            },
            {
                path: '/lobbychat',
                component: () => import('@/views/communication/LobbyChat.vue'),
                name: 'lobbychat',
                meta: {
                    title: "大厅",
                    icon: 'el-icon-s-home',
                    roles: ['user']
                }
            },
            {
                path: 'friend-settings/:friendId',
                component: () => import('@/views/communication/FriendSettings.vue'),
                name: 'friend-settings',
                meta: {
                    title: "好友设置",
                    icon: 'el-icon-service',
                    hidden: true,
                    roles: ['admin', 'user']
                }
            },
            {
                path: 'settings',
                component: () => import('@/views/home/Index.vue'),
                name: 'settings',
                meta: {
                    title: "个人设置",
                    icon: 'el-icon-user-solid',
                    hidden: false,
                    roles: ['admin', 'user']
                }
            },
            {
                path: '/Informationall',
                component: () => import('@/views/home/Informationall.vue'),
                name: 'homeinformationall',
                meta: {
                    title: "个人隐私",
                    icon: 'el-icon-message-solid',
                    hidden: false,
                    roles: ['admin', 'user']
                }
            },
        ]
    }
]
// 动态路由 communication
export const asyncRoutes = [
/*    {
        path: 'communication',
        component: () => import('@/views/communication/Index.vue'),
        name: 'communicationindex',
        meta: {
            title: "邮件",
            icon: 'el-icon-message',
            hidden: false,
            roles: ['admin', 'user']
        }
    },*/
    {
        path: '/404',
        name: 'NotFound',
        meta: {
            title: 'Page not found',
            hidden: true,
            isLogin: false
        },
        component: () => import('@/views/error/404.vue')
    },
    // 所有未定义路由，全部重定向到404页
    {
        path: '*',
        redirect: '/404'
    }
]
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(error => error)
}
const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: constRouter
})

export default router

