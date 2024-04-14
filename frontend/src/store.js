import { createStore } from 'vuex'
import api from '@/api'
import defaultConfig from '@/config/default'

let updateUserConfigTimer = null

const store = createStore({
    state() {
        return {
            // 用户信息
            userInfo: null,
            // 用户配置
            userConfig: null,
            // 网站配置
            config: null,
            // 站内搜索结果
            searchResultList: null
        }
    },
    mutations: {
        // 设置用户信息
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo
        },

        // 设置用户配置
        setUserConfig(state, userConfig) {
            state.userConfig = userConfig
        },

        // 设置网站配置
        setConfig(state, config) {
            state.config = config
        },

        // 设置搜索结果
        setSearchResultList(state, searchResultList) {
            state.searchResultList = searchResultList
        }
    },
    actions: {
        // 获取用户信息
        async getUserInfo(ctx) {
            if (ctx.state.userInfo) {
                return ctx.state.userInfo;
            }
            try {
                let { data } = await api.getUserInfo()
                if (data && data.code === 0) {
                    ctx.commit('setUserInfo', data.data)
                }
            } catch (e) {
                console.log(e)
            }
        },

        // 获取用户配置
        async getUserConfig(ctx) {
            if (ctx.state.userConfig) {
                return ctx.state.userConfig;
            }
            try {
                let { data } = await api.getUserConfig()
                if (data && data.code === 0) {
                    data = Object.assign(defaultConfig, JSON.parse(data.data) || {})
                } else {
                    data = { ...defaultConfig }
                }
                ctx.commit('setUserConfig', data)
            } catch (e) {
                console.log(e)
            }
        },

        // 修改用户配置
        async updateUserConfig(ctx, config) {
            let newConfig = {
                ...ctx.state.userConfig,
                ...config
            }
            ctx.commit('setUserConfig', newConfig)
            clearTimeout(updateUserConfigTimer)
            updateUserConfigTimer = setTimeout(async () => {
                try {
                    if (!ctx.state.userInfo) {
                        window.$message.warning('登录后即可保存到云端');
                        return;
                    }
                    let formData = new FormData()
                    formData.append('config', JSON.stringify(newConfig))
                    let { data } = await api.updateUserConfig(formData)
                    if (!data || data.code !== 0) {
                        window.$message.error('配置保存失败');
                    }
                } catch (e) {
                    console.log(e)
                    window.$message.error('配置保存失败');
                }
            }, 500);
        },

        // 获取网站配置
        async getConfig(ctx) {
            if (ctx.state.config) {
                return ctx.state.config;
            }
            try {
                let { data } = await api.getConfig()
                ctx.commit('setConfig', data)
            } catch (e) {
                console.log(e)
            }
        },
    }
})

export default store