import { allNavClassList } from './constants';

// 默认配置
const config = {
    // 模式，light（日间模式）、dark（夜间模式）
    mode: 'light',
    // 默认搜索引擎
    searchEngine: '百度',
    // 主题
    theme: {
        colors: {},// 主题色
        blur: 0,// 背景模糊度
        opacity: 1,// 内容块透明度
        // 背景类型
        type: 'default',//default（默认）、 skin（皮肤）、image（图片）、color（纯色）、upload（上传）
        // 皮肤
        skin: {
            color: '',
            url: ''
        },
        // 图片
        // image: {
        //     random: true,
        //     url: ''
        // },
        // 纯色
        // color: {
        //     custom: false,
        //     color: ''
        // },
        // 上传
        // upload: {
        //     url: ''
        // }
    },
    // 分类导航列表
    classNavList: allNavClassList.slice(0, -2).map((item) => {
        return item[0];
    }),
    // 是否显示图标导航区域
    showIconSiteArea: true,
    // 是否显示搜索框
    showSearchInput: true,
    // 是否显示底部区域
    showFooter: true,
    // 是否显示右下角固定工具条
    showFixedTool: true,
    // 是否开启沉浸式雨雪天气
    showImmersiveWeather: false,
    // 是否开启霜冻模式
    showFrost: false,
    // 是否显示广告栏
    showAd: true,
    // 是否固定显示快速导航
    showQuickLocation: false,
    // 是否开启烟花效果
    showFireworks: false
}

export default config