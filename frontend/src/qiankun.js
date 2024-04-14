import { registerMicroApps, start } from 'qiankun'
import api from '@/api';

// 注册及启动
const registerAndStart = (appList) => {
  // 注册微应用
  registerMicroApps(appList)

  // 启动 qiankun
  start()
}

// 判断是否激活微应用
const getActiveRule = (hash) => (location) => location.hash.startsWith(hash);

// 初始化小程序
export const initMicroApp = async () => {
  try {
    let { data } = await api.getAppletList()
    // 过滤出微应用
    let appList = data.data.filter((item) => {
      return item.type === 'microApp';
    }).map((item) => {
      return {
        container: '#appletContainer',
        name: item.name,
        entry: process.env.NODE_ENV === "development" ? item.devUrl || item.url : item.url,
        activeRule: getActiveRule(item.activeRule)
      };
    })
    registerAndStart(appList)
  } catch (e) {
    console.log(e);
  }
}