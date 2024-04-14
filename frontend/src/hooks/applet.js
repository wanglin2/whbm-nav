import { ref, onUnmounted } from 'vue';

export const useAppletEmit = ({ proxy }) => {
    const emitAppletMinimizeEvent = () => {
        proxy.$eventEmitter.emit("appletMinimize");
    }

    const emitAppletCloseEvent = () => {
        proxy.$eventEmitter.emit("appletClose");
    }

    return {
        emitAppletMinimizeEvent,
        emitAppletCloseEvent
    };
}

export const useApplet = ({ proxy, onAppletMinimize = () => { }, onAppletClose = () => { } }) => {
    const isAppletMinimize = ref(false)

    const _onAppletMinimize = () => {
        isAppletMinimize.value = true
        onAppletMinimize()
    }

    const _onAppletClose = () => {
        isAppletMinimize.value = false
        onAppletClose()
    }

    // 监听小程序最小化事件
    proxy.$eventEmitter.on("appletMinimize", _onAppletMinimize);

    // 监听小程序关闭事件
    proxy.$eventEmitter.on("appletClose", _onAppletClose);

    onUnmounted(() => {
        proxy.$eventEmitter.off("appletMinimize", _onAppletMinimize);
        proxy.$eventEmitter.off("appletClose", _onAppletClose);
    })

    return {
        isAppletMinimize
    };
}