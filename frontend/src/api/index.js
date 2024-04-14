import axios from 'axios';
import jsonp from 'jsonp';

const isDev = process.env.NODE_ENV === 'development'
axios.defaults.baseURL = `http://lxqnsys.com/whbm/api/${isDev ? 'dev' : 'v1'}`;

export default {
    // 退出登录
    logout() {
        return axios.get('/logout.php')
    },

    // 获取用户信息
    getUserInfo() {
        return axios.get(`/getUserInfo.php`);
    },

    // 获取用户配置
    getUserConfig() {
        return axios.get('/getUserConfig.php');
    },

    // 获取网站配置
    getConfig() {
        return axios.get('/getConfig.php');
    },

    // 获取分类导航数据
    getSiteList(data) {
        return axios.get('/getSiteList.php', {
            params: data
        });
    },

    // 百度搜索联想
    searchAssociation(text) {
        return new Promise((resolve, reject) => {
            jsonp('http://suggestion.baidu.com/su?p=3&wd=' + text, {
                param: 'cb'
            }, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        });
    },

    // 搜索站内网站
    searchSites(params) {
        return axios.get('/searchSites.php', {
            params
        });
    },

    // 获取我的网站列表
    getMySiteList(params) {
        return axios.get('/getMySiteList.php', {
            params
        });
    },

    // 添加我的网站
    addUserSite(params) {
        return axios.get('/addUserSite.php', {
            params
        });
    },

    // 删除我的网站
    deleteUserSite(params) {
        return axios.get('/deleteUserSite.php', {
            params
        });
    },

    // 更新我的网站
    updateUserSite(params) {
        return axios.get('/updateUserSite.php', {
            params
        });
    },

    // 获取分类
    getUserClass(params) {
        return axios.get('/getUserClass.php', {
            params
        });
    },

    // 添加分类
    addUserClass(params) {
        return axios.get('/addUserClass.php', {
            params
        });
    },

    // 修改分类
    updateUserClass(params) {
        return axios.get('/updateUserClass.php', {
            params
        });
    },

    // 删除分类
    deleteUserClass(params) {
        return axios.get('/deleteUserClass.php', {
            params
        });
    },

    // 获取用户分类下的标签
    getUserTag(params) {
        return axios.get('/getUserTag.php', {
            params
        });
    },

    // 添加标签
    addUserTag(params) {
        return axios.get('/addUserTag.php', {
            params
        });
    },

    // 删除标签
    deleteUserTag(params) {
        return axios.get('/deleteUserTag.php', {
            params
        });
    },

    // 添加用户分类网站
    addUserClassTagSite(params) {
        return axios.get('/addUserClassTagSite.php', {
            params
        });
    },

    // 获取用户分类网站列表
    getUserClassSiteList(params) {
        return axios.get('/getUserClassSiteList.php', {
            params
        });
    },

    // 删除用户分类网站
    deleteUserClassSite(params) {
        return axios.get('/deleteUserClassSite.php', {
            params
        });
    },

    /** 
     * @Author: 王林 
     * @Date: 2021-11-16 22:09:30 
     * @Desc: 更新用户分类网站 
     */
    updateUserClassSite(params) {
        return axios.get('/updateUserClassSite.php', {
            params
        });
    },

    /** 
     * @Author: 王林 
     * @Date: 2021-11-17 21:29:36 
     * @Desc: 更新用户配置 
     */
    updateUserConfig(data) {
        return axios.post('/updateUserConfig.php', data, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
    },

    /** 
     * @Author: 王林 
     * @Date: 2021-11-19 22:59:15 
     * @Desc: 获取用户分类和标签列表数据 
     */
    getUserClassTagList(params) {
        return axios.get('/getUserClassTagList.php', {
            params
        });
    },

    /** 
     * @Author: 王林 
     * @Date: 2021-11-20 11:33:35 
     * @Desc: 获取用户指定分类id下的网站列表 
     */
    getUserClassSiteListById(params) {
        return axios.get('/getUserClassSiteListById.php', {
            params
        });
    },

    /** 
     * @Author: 王林 
     * @Date: 2021-11-21 16:12:55 
     * @Desc: 获取图片列表 
     */
    getImageList(params) {
        return axios.get('/getImageList.php', {
            params
        });
    },

    /** 
     * @Author: 王林 
     * @Date: 2021-11-21 20:43:38 
     * @Desc: 随机获取一张图片 
     */
    getRandomImage(params) {
        return axios.get('/getRandomImage.php', {
            params
        });
    },

    /** 
     * @Author: 王林 
     * @Date: 2021-11-17 21:29:36 
     * @Desc: 导入网站 
     */
    importSites(data) {
        return axios.post('/importSites.php', data, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
    },

    /** 
     * @Author: 王林 
     * @Date: 2021-11-28 16:19:27 
     * @Desc: 获取用户所有的网站列表 
     */
    getUserAllSiteList(params) {
        return axios.get('/getUserAllSiteList.php', {
            params
        });
    },

    /** 
     * @Author: 王林 
     * @Date: 2021-11-28 21:23:53 
     * @Desc: 添加推荐网站 
     */
    addRecommendSite(data) {
        return axios.post('/addRecommendSite.php', data, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
    },

    /** 
     * @Author: 王林 
     * @Date: 2021-11-28 21:50:19 
     * @Desc: 获取推荐网站列表 
     */
    getRecommendSiteList(params) {
        return axios.get('/getRecommendSiteList.php', {
            params
        });
    },

    /** 
     * @Author: 王林 
     * @Date: 2021-11-29 20:56:09 
     * @Desc: 获取公告列表 
     */
    getNoticeList(params) {
        return axios.get('/getNoticeList.php', {
            params
        });
    },

    /** 
     * @Author: 王林 
     * @Date: 2021-12-01 08:02:29 
     * @Desc: 获取网站大全列表
     */
    getLibrarySiteList(params) {
        return axios.get('/getLibrarySiteList.php', {
            params
        });
    },

    /** 
     * @Author: 王林 
     * @Date: 2021-12-02 07:36:55 
     * @Desc: 获取友情链接数据 
     */
    getFriendLinks(params) {
        return axios.get('/getFriendLinks.php', {
            params
        });
    },

    /** 
     * @Author: 王林 
     * @Date: 2021-12-04 10:32:20 
     * @Desc: 获取用户ip 
     */
    getCityInfo() {
        return axios.get('https://restapi.amap.com/v3/ip', {
            params: {
                key: ''
            }
        });
    },

    /** 
     * @Author: 王林 
     * @Date: 2021-12-04 10:33:41 
     * @Desc: 获取天气 
     */
    getWeather(type, city) {
        return axios.get('https://api.heweather.net/s6/weather/' + type, {
            params: {
                location: city,
                key: ''
            }
        });
    },

    // 获取小程序列表
    getAppletList(params) {
        return axios.get('/getAppletList.php', {
            params
        });
    }
}