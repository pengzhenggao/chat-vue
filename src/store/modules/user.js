import {getToken, setToken, removeToken, getRole, setRole, removeRole,} from '@/utils/auth'
import {login, logout} from "../../http/api/user";
import {socket} from "../../config/websocket/socket";

// 存储用户令牌和角色信息
const state = {
    token: getToken(),
    roles: [], //角色
    userLogin: JSON.parse(localStorage.getItem("user_login"))
}

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token;
    },
    SET_ROLES: (state, roles) => {
        state.roles = roles;
    },
    SET_USER: (state, data) => {
        state.userLogin = data;
    }
};

const actions = {
    // 用户登录
    login({commit}, loginForm) {
        let params = new URLSearchParams();
        params.append("account", loginForm.username);
        params.append("password", loginForm.password);

        return new Promise((resolve, reject) => {
            login(params).then(res => {
                commit('SET_TOKEN', res.data.token);
                commit('SET_USER', res.data);
                setToken(res.data.token);
                setRole(res.data.roles);
                localStorage.setItem("user_login", JSON.stringify(res.data));
                resolve()
            }).catch(() => {
                reject("系统错误")
            })
        })
    },

    saveUserLogin({commit}, oauthUser) {
        return new Promise((resolve, reject) => {
            commit('SET_TOKEN', oauthUser.token);
            commit('SET_USER', oauthUser);
            setToken(oauthUser.token);
            setRole(oauthUser.roles);
            localStorage.setItem("user_login", JSON.stringify(oauthUser));
            resolve()
        }).catch(() => {
            reject("系统错误")
        })
    },
    updateUserInfo({commit}, userInfo){
        commit('SET_USER', userInfo);
        localStorage.setItem("user_login", JSON.stringify(userInfo));
    },
    // 获取用户角色信息
    getInfo({commit, state}) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const roles = getRole()
                commit('SET_ROLES', roles);
                resolve({roles})
            }, 1000)
        })
    },
    // 重置令牌
    resetToken({commit}) {
        return new Promise(resolve => {
            commit('SET_TOKEN', '');
            commit('SET_ROLES', []);
            socket.close();
            localStorage.removeItem("user_login");
            removeToken();
            removeRole();
            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
