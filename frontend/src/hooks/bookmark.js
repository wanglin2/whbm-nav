import api from '@/api';
import { ref } from 'vue';
import { downloadFile } from '@/utils';

/** 
 * @Author: 王林 
 * @Date: 2021-11-25 22:45:56 
 * @Desc: 创建文件选择输入框 
 */
let inputEl = null
const createInputEl = (callback, isLoading) => {
    if (inputEl) {
        return inputEl;
    }
    inputEl = document.createElement('input')
    inputEl.type = 'file'
    inputEl.accept = 'text/html,text/htm'
    inputEl.style.cssText = `
            position: absolute;
            left: -999999px;
            top: -9999999px;
        `
    document.body.appendChild(inputEl)
    inputEl.addEventListener('change', (e) => {
        onFileChange(e, callback, isLoading)
    })
    return inputEl;
}

/** 
 * @Author: 王林 
 * @Date: 2021-11-25 22:50:35 
 * @Desc: 解析书签文件 
 */
const analysisBookmarksStr = (str) => {
    // 创建iframe
    let iframe = document.createElement('iframe')
    document.body.appendChild(iframe)
    iframe.style.display = 'none'
    // 添加书签dom字符串
    iframe.contentWindow.document.documentElement.innerHTML = str
    // 获取书签树根节点
    let root = iframe.contentWindow.document.querySelector('dl')
    let result = []
    let siteList = []
    // 深度优先遍历
    let walk = function (node, list) {
        let els = node.children
        if (els && els.length > 0) {
            for (let i = 0; i < els.length; i++) {
                let item = els[i]
                // p标签或h3标签直接跳过
                if (item.tagName === 'P' || item.tagName === 'H3') {
                    continue
                }
                // 文件夹不用创建元素
                if (item.tagName === 'DL') {
                    walk(els[i], list)
                } else {
                    let child = null
                    // 判断是否是文件夹
                    let children = item.children
                    let isDir = false
                    for (let j = 0; j < children.length; j++) {
                        if (children[j].tagName === 'H3' || children[j].tagName === 'DL') {
                            isDir = true
                        }
                    }
                    // 文件夹
                    if (isDir) {
                        child = {
                            name: item.tagName === 'DT' ? item.querySelector('h3') ? item.querySelector('h3').innerText : '' : '',
                            folder: true,
                            children: []
                        }
                        walk(els[i], child.children)
                    } else {// 书签
                        let _item = item.querySelector('a')
                        child = {
                            name: _item.innerText,
                            url: _item.href
                        }
                        siteList.push(child)
                    }
                    list.push(child)
                }
            }
        }
    }
    walk(root, result)
    return siteList
}

/** 
 * @Author: 王林 
 * @Date: 2021-11-25 22:48:57 
 * @Desc: 文件处理 
 */
const onFileChange = (e, callback, isLoading) => {
    let file = e.target.files[0]
    if (!file) {
        return
    }
    let reader = new FileReader()
    reader.addEventListener('loadend', async function () {
        try {
            isLoading.value = true
            let siteList = analysisBookmarksStr(this.result)
            let formData = new FormData()
            siteList.forEach((item, index) => {
                formData.append(`list[${index}][name]`, item.name)
                formData.append(`list[${index}][url]`, item.url)
            })
            let { data } = await api.importSites(formData)
            isLoading.value = false
            if (data && data.code === 0) {
                callback()
            } else {
                callback('导入失败')
            }
            inputEl.value = null
        } catch (e) {
            isLoading.value = false
            inputEl.value = null
            callback('导入失败')
        }
    })
    reader.readAsText(file)
}

/** 
 * @Author: 王林 
 * @Date: 2021-11-27 08:44:12 
 * @Desc: 创建书签数据 
 */
const createBookmarksStr = (bookmarks) => {
    let str = '<!DOCTYPE NETSCAPE-Bookmark-file-1>\n<!-- This is an automatically generated file.It will be read and overwritten.DO NOT EDIT! -->\n<META HTTP-EQUIV=\"Content-Type\" CONTENT=\"text/html; charset=UTF-8\">\n<TITLE>Bookmarks</TITLE>\n<H1>Bookmarks</H1>\n<DL>\n\t<p>\n\t\t<DT>\n\t\t\t<H3 ADD_DATE=\"1568796074\" LAST_MODIFIED=\"1601707819\" PERSONAL_TOOLBAR_FOLDER=\"true\">\u4E66\u7B7E\u680F</H3>\n\t\t\t<DL>\n\t\t\t\t<p>\n\t\t\t\t\t'
    let loop = function (root) {
        let str = ''
        root.forEach(function (item) {
            if (item.folder) {
                str += '<DT>\n\t\t\t\t\t\t<H3 ' + (item.toolbar ? 'PERSONAL_TOOLBAR_FOLDER="true"' : '') + '>' + item.name + '</H3>\n\t\t\t\t\t\t<DL>\n\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\t'
                str += loop(item.children)
                str += '</DL>\n\t\t\t\t\t\t<p>\n\t\t\t'
            } else {
                str += '<DT><A HREF=\"' + item.url + '\">' + item.name + '</A>\n\t\t\t\t\t\t\t\t'
            }
        })
        return str
    }
    str += loop(bookmarks)
    str += '</DL>\n\t\t\t<p>\n</DL>\n<p>'
    return str
}


/** 
 * @Author: 王林 
 * @Date: 2021-11-27 08:43:28 
 * @Desc: 下载导出书签
 */
const downloadBookmark = async (callback, isLoading) => {
    try {
        isLoading.value = true
        let { data } = await api.getUserAllSiteList()
        if (data && data.code === 0) {
            let bookmarks = [
                {
                    name: '五花八门收藏',
                    folder: true,
                    children: data.data.map(function (item) {
                        return {
                            name: item.sitename,
                            url: item.siteurl
                        }
                    })
                }
            ]
            let str = createBookmarksStr(bookmarks)
            let date = new Date()
            downloadFile(str, '书签_' + date.getFullYear() + '_' + (date.getMonth() + 1) + '_' + date.getDate() + '.html')
            callback()
        } else {
            callback('导出失败')
        }
        isLoading.value = false
    } catch (e) {
        console.log(e)
        isLoading.value = false
        callback(e)
    }
}

/** 
 * @Author: 王林 
 * @Date: 2021-11-25 22:42:02 
 * @Desc: 书签 
 */
export const useBookmark = () => {
    const isLoading = ref(false)
    // 导入书签
    const importBookmark = (callback = () => { }) => {
        let el = createInputEl(callback, isLoading)
        el.click()
    }
    // 导出书签
    const exportBookmark = (callback = () => { }) => {
        downloadBookmark(callback, isLoading)
    }

    return {
        importBookmark,
        exportBookmark,
        isLoading
    };
}