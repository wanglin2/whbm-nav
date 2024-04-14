import anime from "animejs";

const isDev = process.env.NODE_ENV === "development"

// 判断是否是合法的url
export const isValidUrl = (url) => {
    var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
        + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@ 
        + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184 
        + "|" // 允许IP和DOMAIN（域名）
        + "([0-9a-z_!~*'()-]+\.)*" // 域名- www. 
        + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名 
        + "[a-z]{2,6})" // first level domain- .com or .museum 
        + "(:[0-9]{1,4})?" // 端口- :80 
        + "((/?)|" // a slash isn't required if there is no file name 
        + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
    var re = new RegExp(strRegex);
    return re.test(url);
}

/** 
 * @Author: 王林 
 * @Date: 2021-11-21 12:42:08 
 * @Desc: 处理皮肤图片的url 
 */
export const handleSkinUrl = (url) => {
    return /^http/.test(url)
        ? url
        : (isDev
            ? "http://lxqnsys.com/d/"
            : "../d/") + url;
};

/** 
 * @Author: 王林 
 * @Date: 2021-11-21 16:25:07 
 * @Desc: 处理阿里云资源路径 
 */
export const handleAliyunUrl = (url) => {
    return `http://aliyuncdn.lxqnsys.com/` + url;
}

/** 
 * @Author: 王林 
 * @Date: 2021-11-22 21:37:41 
 * @Desc: 加载js资源 
 */
let jsResourceLoadCache = {}
export const loadJsResource = (urls) => {
    urls = Array.isArray(urls) ? urls : [urls]
    return Promise.all(urls.map((url) => {
        return new Promise((resolve, reject) => {
            if (jsResourceLoadCache[url]) {
                return resolve();
            }
            let el = document.createElement('script')
            el.src = url
            el.onload = () => {
                jsResourceLoadCache[url] = true
                resolve()
            }
            el.onerror = (e) => {
                reject(e)
            }
            document.head.appendChild(el)
        });
    }))
}

/** 
 * @Author: 王林 
 * @Date: 2021-11-23 21:51:34 
 * @Desc: HEX十六进制颜色值转换为RGB(A)颜色值 
 */
export const hexToRgb = (val) => {
    // rgb
    let regResult = val.match(/rgba?\s*\(([^)]+)\)/)
    if (regResult && regResult[1]) {
        let arr = regResult[1].split(',').map((item) => {
            return Number(String(item).trim());
        })
        return {
            rgb: val,
            r: arr[0],
            g: arr[1],
            b: arr[2]
        };
    }
    // 16进制颜色值的正则
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // 把颜色值变成小写
    var color = val.toLowerCase();
    var result = '';
    if (reg.test(color)) {
        // 如果只有三位的值，需变成六位，如：#fff => #ffffff
        if (color.length === 4) {
            var colorNew = "#";
            for (var i = 1; i < 4; i += 1) {
                colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
            }
            color = colorNew;
        }
        // 处理六位的颜色值，转为RGB
        var colorChange = [];
        for (var i = 1; i < 7; i += 2) {
            colorChange.push(parseInt("0x" + color.slice(i, i + 2)));
        }
        result = "rgb(" + colorChange.join(",") + ")";
        return { rgb: result, r: colorChange[0], g: colorChange[1], b: colorChange[2] };
    } else {
        result = '无效';
        return { rgb: result };
    }
}

/** 
 * @Author: 王林 
 * @Date: 2021-11-25 22:36:01 
 * @Desc: 打开url 
 */
export const openUrl = (url) => {
    let a = document.createElement('a')
    a.href = url
    a.target = '_blank'
    a.click()
}

/** 
 * @Author: 王林 
 * @Date: 2021-11-27 08:48:46 
 * @Desc: 下载文件 
 */
export const downloadFile = (content, file) => {
    let downEle = document.createElement("a");
    downEle.download = file;
    downEle.style.display = "none";

    let blobs = new Blob([content]);
    downEle.href = URL.createObjectURL(blobs);

    document.body.appendChild(downEle);
    downEle.click();

    document.body.removeChild(downEle);
}

/** 
 * @Author: 王林 
 * @Date: 2022-02-04 14:36:18 
 * @Desc: 下载文件简单版 
 */
export const downloadFile2 = (file, name) => {
    let a = document.createElement("a");
    a.href = file;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

/** 
 * @Author: 王林 
 * @Date: 2021-12-03 22:55:54 
 * @Desc: 获取一个元素距离页面顶部的距离 
 */
export const getOffsetValue = (el) => {
    let offsetTop = el.offsetTop
    let offsetLeft = el.offsetLeft
    let par = el.offsetParent
    while (par && par !== document.body) {
        offsetLeft += par.offsetLeft
        offsetTop += par.offsetTop
        par = par.offsetParent
    }
    return {
        offsetLeft,
        offsetTop
    };
}

/** 
 * @Author: 王林 
 * @Date: 2021-12-03 22:55:54 
 * @Desc: 获取一个元素最近的指定父元素
 */
export const getNearestParentNode = (el, selector) => {
    let par = el.parentNode
    while (par && !par.classList.contains(selector)) {
        par = par.parentNode
    }
    return par
}

// 数组转对象
export const listToMap = (arr, key = 'name', value = 'value') => {
    let obj = {}
    arr.forEach((item) => {
        obj[item[key]] = item[value]
    })
    return obj;
}

// 加载样式文件
export const loadStyle = (url) => {
    let el = document.createElement('link')
    el.rel = "stylesheet"
    el.href = url
    document.head.appendChild(el)
    return el;
}

// 复制文本
export const copyText = (text) => {
    let el = document.createElement('input')
    el.type = 'text'
    el.style.cssText = 'position: fixed;left: 0;top: -5000px;'
    el.value = text
    document.body.appendChild(el)
    el.select();
    document.execCommand("Copy");
    document.body.removeChild(el)
}

// 滚动到指定位置
export const scrollTo = (to = 0) => {
    anime({
        targets: document.documentElement,
        scrollTop: to,
        easing: "easeInOutSine",
    });
};