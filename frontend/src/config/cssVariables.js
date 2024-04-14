// 亮色
const light = {
    // 主题色
    '--theme-color': '#87BDFF',
    // 导航区域内容块背景色
    '--light-color': '#fff',
    // 导航区域内容块文字颜色
    '--dark-color': '#48576a',
    // 导航区域网站文字块hover时的背景颜色
    '--site-block-hover-color': '#f5f5f5',
    // 其他区域内容块背景色
    '--other-light-color': '#fff',
    // 其他区域的文字颜色
    '--other-dark-color': '#48576a',
    // 其他区域网站文字块hover时的背景颜色
    '--other-site-block-hover-color': '#f5f5f5',
    // 弱暗色，辅助色
    '--weak-dark-color': '#999',
    // 错误色
    '--error-color': '#ff4546',
    // 我的空间部分颜色
    '--my-color': '#FFbf65',
    // 阴影遮罩
    '--mask': 'rgba(0, 0, 0, 0.5)',
    // 网站大全背景色
    '--site-library-background-color': 'rgb(245, 245, 245)'
}

// 暗色
const dark = {

}


// 名称映射
const nameMap = {
    '--theme-color': '主题色',
    '--my-color': '【我的空间】标题背景色',
    '--light-color': '导航区域内容块背景色',
    '--dark-color': '导航区域内容块文字颜色',
    '--site-block-hover-color': '导航区域鼠标移上去的背景色'
}

// 用户自定义变量
const userVariables = {

}

const variables = {
    light,
    dark,
    userVariables
}


// 获取最终变量对象
const getCssVariables = (mode) => {
    let ob = {
        ...variables[mode] || variables.light
    }
    Object.keys(userVariables).forEach((key) => {
        if (userVariables[key]) {
            ob[key] = userVariables[key]
        }
    })
    return ob;
}

// 设置css变量
const setCssVariables = (mode, plusConfig = {}) => {
    Object.keys(plusConfig).forEach((key) => {
        userVariables[key] = plusConfig[key]
    })
    let config = getCssVariables(mode)
    Object.keys(config).forEach((key) => {
        document.documentElement.style.setProperty(
            key,
            config[key]
        )
    })
}

export default {
    ...variables,
    nameMap,
    setCssVariables,
    getCssVariables
}