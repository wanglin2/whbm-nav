import axios from 'axios';
import jsonp from 'jsonp';

const isDev = process.env.NODE_ENV === 'development'
axios.defaults.baseURL = `http://lxqnsys.com/whbm/api/${isDev ? 'dev' : 'v1'}`;

export default {
    // 注册
    register(data) {
        return axios.post('/registerApplet.php', data, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
    },

    // 获取网站列表
    getSiteList(params) {
        return axios.get('/getAllSiteList.php', {
            params
        });
    },

    // 更新网站
    updateSite(data) {
        return axios.post('/updateSite.php', data, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
    },

    // 删除网站
    deleteSite(params) {
        return axios.get('/deleteSite.php', {
            params
        });
    },
}