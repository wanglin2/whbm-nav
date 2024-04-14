import { listToMap } from '@/utils';

// 网站分类列表
export const allNavClassList = [
    ['最新添加', 'Latest', 'icon-zuixingengxin'],
    ['常用网站', 'Common', 'icon-changyongshili'],
    ['影视音乐', 'Movies', 'icon-duomeiti'],
    ['购物网站', 'Shopping', 'icon-gouwu'],
    ['生活休闲', 'Life', 'icon-shenghuo'],
    ['文艺阅读', 'Read', 'icon-yuedu'],
    ['好好学习', 'Learn', 'icon-w_xuexi'],
    ['社区论坛', 'Community', 'icon-shequ'],
    ['科技前沿', 'Technology', 'icon-keji'],
    ['新闻资讯', 'News', 'icon-24gl-newspaper2'],
    ['工具查询', 'Tool', 'icon-gongju'],
    ['资源搜索', 'Search', 'icon-sousuo'],
    ['模板素材', 'Material', 'icon-sucaiku'],
    ['图像漫画', 'Img', 'icon-tuxiang'],
    ['软件应用', 'Software', 'icon-ruanjiankaifabao'],
    ['小说游戏', 'Novel', 'icon-youxi'],
    ['个人网站', 'Personal', 'icon-geren'],
    ['导航网站', 'Navigation', 'icon-daohang'],
    ['其他分类', 'Others', 'icon-qita'],
    ['框架和库', 'Frame', 'icon-code'],
    ['GitHub', 'GitHub', 'icon-github-fill']
]
// 对象形式
export const navClassList = allNavClassList.map((item) => {
    return {
        name: item[0],
        tag: item[1],
        icon: item[2]
    };
})
// 名称到数据的映射
const _navClassMap = {}
navClassList.forEach((item) => {
    _navClassMap[item.name] = {
        ...item
    }
})
export const navClassMap = _navClassMap

// 预设颜色列表
export const colorList = [
    '#E1E1E1',
    '#EE6D52',
    '#FBAF42',
    '#FFE000',
    '#84D071',
    '#6BC7DB',
    '#4F9FED',
    '#8D68E0'
]

// 网站大全网站分类
export const typeList = [
    {
        name: '新闻',
        value: 'news',
        icon: 'icon-24gl-newspaper2'
    },
    {
        name: '音乐视频',
        value: 'music',
        icon: 'icon-duomeiti'
    },
    {
        name: '图片',
        value: 'photos',
        icon: 'icon-tuxiang'
    },
    {
        name: '阅读',
        value: 'read',
        icon: 'icon-yuedu'
    },
    {
        name: '购物与团购',
        value: 'shopping',
        icon: 'icon-gouwu'
    },
    {
        name: '社交与博客',
        value: 'social',
        icon: 'icon-weixin'
    },
    {
        name: '生活方式',
        value: 'life',
        icon: 'icon-shenghuo'
    },
    {
        name: '游戏与娱乐',
        value: 'games',
        icon: 'icon-youxi'
    },
    {
        name: '数码科技',
        value: 'tech',
        icon: 'icon-shumashouji'
    },
    {
        name: '教育与招聘',
        value: 'education',
        icon: 'icon-w_xuexi'
    },
    {
        name: '金融',
        value: 'finance',
        icon: 'icon-jinrong'
    },
    {
        name: '体育与旅行',
        value: 'sports',
        icon: 'icon-lvxing'
    },
    {
        name: '应用',
        value: 'app',
        icon: 'icon-yingyongguanli'
    },
    {
        name: '其他',
        value: 'others',
        icon: 'icon-qita'
    },
]

// 我的空间工具栏
export const myToolList = [
    {
        name: "返回旧版",
        id: "old",
        icon: "icon-jiu",
        url: "./old.html",
    },
    {
        name: "管理我的导航",
        id: "mySite",
        icon: "icon-bianji",
        needLogin: true
    },
    {
        name: "添加网站",
        id: "addSite",
        icon: "icon-tianjia",
        needLogin: true
    },
    {
        name: "小程序",
        id: "appletList",
        icon: "icon-xiaochengxu",
        class: 'hot'
    },
    {
        name: "管理分类导航的显示",
        id: "manageClassShow",
        icon: "icon-yanjing_xianshi",
        needLogin: true
    },
    {
        name: "主题定制",
        id: "skin",
        icon: "icon-jingzi",
    },
    {
        name: "Chrome扩展程序",
        id: "chrome",
        icon: "icon-chrome-fill",
        url: "../d/plugin.html",
    },
    {
        name: "推荐网站",
        id: "recommend",
        icon: "icon-tuijianfantuijian",
    },
    {
        name: "导入其他浏览器的书签",
        id: "importBookmark",
        icon: "icon-zu",
        needLogin: true
    },
    {
        name: "导出我的网站",
        id: "exportBookmark",
        icon: "icon-daochu",
        needLogin: true
    },
    {
        name: "网站大全",
        id: "siteLibrary",
        icon: "icon-cangku",
    },
    {
        name: "网站公告",
        id: "notice",
        icon: "icon-gonggao",
    },
    // {
    //   name: "访问历史记录",
    //   id: "history",
    //   icon: "icon-shouye",
    // },
    {
        name: "留言",
        id: "comment",
        icon: "icon-liuyan",
    },
    {
        name: "设置",
        id: "setting",
        icon: "icon-shezhi",
    }
]

//天气与图标的映射
export const weatherList = [
    {
        name: '未知',
        icon: 'weather/999.png'
    },
    {
        name: '晴',
        icon: 'weather/100.png'
    },
    {
        name: '多云',
        icon: 'weather/101.png'
    },
    {
        name: '少云',
        icon: 'weather/102.png'
    },
    {
        name: '晴间多云',
        icon: 'weather/103.png'
    },
    {
        name: '阴',
        icon: 'weather/104.png'
    },
    {
        name: '有风',
        icon: 'weather/200.png'
    },
    {
        name: '平静',
        icon: 'weather/201.png'
    },
    {
        name: '微风',
        icon: 'weather/202.png'
    },
    {
        name: '和风',
        icon: 'weather/203.png'
    },
    {
        name: '清风',
        icon: 'weather/204.png'
    },
    {
        name: '强风',
        icon: 'weather/205.png'
    },
    {
        name: '劲风',
        icon: 'weather/205.png'
    },
    {
        name: '疾风',
        icon: 'weather/206.png'
    },
    {
        name: '大风',
        icon: 'weather/207.png'
    },
    {
        name: '烈风',
        icon: 'weather/208.png'
    },
    {
        name: '风暴',
        icon: 'weather/209.png'
    },
    {
        name: '狂爆风',
        icon: 'weather/210.png'
    },
    {
        name: '飓风',
        icon: 'weather/211.png'
    },
    {
        name: '龙卷风',
        icon: 'weather/212.png'
    },
    {
        name: '热带风暴',
        icon: 'weather/213.png'
    },
    {
        name: '阵雨',
        icon: 'weather/300.png'
    },
    {
        name: '强阵雨',
        icon: 'weather/301.png'
    },
    {
        name: '雷阵雨',
        icon: 'weather/302.png'
    },
    {
        name: '强雷阵雨',
        icon: 'weather/303.png'
    },
    {
        name: '雷阵雨伴有冰雹',
        icon: 'weather/304.png'
    },
    {
        name: '小雨',
        icon: 'weather/305.png'
    },
    {
        name: '中雨',
        icon: 'weather/306.png'
    },
    {
        name: '大雨',
        icon: 'weather/307.png'
    },
    {
        name: '极端降雨',
        icon: 'weather/308.png'
    },
    {
        name: '毛毛雨',
        icon: 'weather/309.png'
    },
    {
        name: '细雨',
        icon: 'weather/309.png'
    },
    {
        name: '暴雨',
        icon: 'weather/310.png'
    },
    {
        name: '大暴雨',
        icon: 'weather/311.png'
    },
    {
        name: '特大暴雨',
        icon: 'weather/312.png'
    },
    {
        name: '冻雨',
        icon: 'weather/313.png'
    },
    {
        name: '小到中雨',
        icon: 'weather/314.png'
    },
    {
        name: '中到大雨',
        icon: 'weather/315.png'
    },
    {
        name: '大到暴雨',
        icon: 'weather/316.png'
    },
    {
        name: '暴雨到大暴雨',
        icon: 'weather/317.png'
    },
    {
        name: '大暴雨到特大暴雨',
        icon: 'weather/318.png'
    },
    {
        name: '雨',
        icon: 'weather/399.png'
    },
    {
        name: '小雪',
        icon: 'weather/400.png'
    },
    {
        name: '中雪',
        icon: 'weather/401.png'
    },
    {
        name: '大雪',
        icon: 'weather/402.png'
    },
    {
        name: '暴雪',
        icon: 'weather/403.png'
    },
    {
        name: '雨夹雪',
        icon: 'weather/404.png'
    },
    {
        name: '雨雪天气',
        icon: 'weather/405.png'
    },
    {
        name: '阵雨夹雪',
        icon: 'weather/406.png'
    },
    {
        name: '阵雪',
        icon: 'weather/407.png'
    },
    {
        name: '小到中雪',
        icon: 'weather/408.png'
    },
    {
        name: '中到大雪',
        icon: 'weather/409.png'
    },
    {
        name: '大到暴雪',
        icon: 'weather/410.png'
    },
    {
        name: '雪',
        icon: 'weather/499.png'
    },
    {
        name: '薄雾',
        icon: 'weather/500.png'
    },
    {
        name: '雾',
        icon: 'weather/501.png'
    },
    {
        name: '霾',
        icon: 'weather/502.png'
    },
    {
        name: '扬沙',
        icon: 'weather/503.png'
    },
    {
        name: '浮尘',
        icon: 'weather/504.png'
    },
    {
        name: '沙尘暴',
        icon: 'weather/507.png'
    },
    {
        name: '强沙尘暴',
        icon: 'weather/508.png'
    },
    {
        name: '浓雾',
        icon: 'weather/509.png'
    },
    {
        name: '强浓雾',
        icon: 'weather/510.png'
    },
    {
        name: '中度霾',
        icon: 'weather/511.png'
    },
    {
        name: '重度霾',
        icon: 'weather/512.png'
    },
    {
        name: '严重霾',
        icon: 'weather/513.png'
    },
    {
        name: '大雾',
        icon: 'weather/514.png'
    },
    {
        name: '特强浓雾',
        icon: 'weather/515.png'
    },
    {
        name: '热',
        icon: 'weather/900.png'
    },
    {
        name: '冷',
        icon: 'weather/901.png'
    }
]
export const weatherIconMap = listToMap(weatherList, 'name', 'icon')

export const compCache = {}