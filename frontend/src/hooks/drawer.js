import { ref, getCurrentInstance } from 'vue'

// 抽屉
export const usrDrawer = (event) => {
    const drawerShow = ref(false)
    const payload = ref(null)
    const { proxy } = getCurrentInstance()
    const toggle = (e, data = null) => {
        drawerShow.value = e
        payload.value = data
    }
    proxy.$eventEmitter.on(event, toggle)
    const off = () => {
        proxy.$eventEmitter.off(event, toggle)
    }

    return {
        drawerShow,
        payload,
        toggle,
        off
    };
}