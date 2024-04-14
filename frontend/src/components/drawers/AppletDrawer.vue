<template>
  <n-drawer
    class="drawerContainer"
    v-model:show="drawerShow"
    :display-directive="isMinimize ? 'show' : 'if'"
    :width="payload ? payload.width : 450"
    :mask-closable="false"
    :close-on-esc="false"
    :z-index="501"
  >
    <n-drawer-content class="appletDrawer">
      <template #header>
        <div class="headerBox">
          <div class="header">
            <div class="backBtn" v-if="isMicroApp && !isInHome" @click="back">
              <span class="iconfont icon-fanhui"></span>
            </div>
            <div class="title">{{ payload.name }}</div>
          </div>
          <div class="headerBtns">
            <span class="btn iconfont icon-zuixiaohua" @click="minimize"></span>
            <span
              class="btn iconfont icon-xiaochengxu-guanbi"
              @click="close"
            ></span>
          </div>
        </div>
      </template>
      <div
        class="appletContainer"
        id="appletContainer"
        ref="appletContainer"
      ></div>
      <div class="applteComponentContainer" v-if="!isMicroApp">
        <component v-if="comp" :key="comp.toString()" :is="comp"></component>
      </div>
      <Loading v-if="showLoading"></Loading>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup>
import { NDrawer, NDrawerContent } from "naive-ui";
import { usrDrawer } from "@/hooks/drawer";
import {
  watch,
  ref,
  computed,
  nextTick,
  shallowRef,
  getCurrentInstance,
  onUnmounted,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import * as Vue from "vue";
import { loadStyle } from "@/utils";
import { useAppletEmit } from "@/hooks/applet";
import { compCache } from "@/config/constants";
import Loading from "@/components/Loading";

const isDev = process.env.NODE_ENV === "development";

// 控制显示
const useShow = ({
  drawerShow,
  proxy,
  emitAppletMinimizeEvent,
  emitAppletCloseEvent,
  payload,
}) => {
  const isMinimize = ref(false);

  // 恢复最小化的小程序
  const onResumeMinimizeApplet = () => {
    drawerShow.value = true;
    nextTick(() => {
      isMinimize.value = false;
    });
  };
  proxy.$eventEmitter.on("resumeMinimizeApplet", onResumeMinimizeApplet);
  onUnmounted(() => {
    proxy.$eventEmitter.off("resumeMinimizeApplet", onResumeMinimizeApplet);
  });

  // 最小化
  const minimize = () => {
    isMinimize.value = true;
    nextTick(() => {
      drawerShow.value = false;
      emitAppletMinimizeEvent();
    });
  };

  // 关闭
  const close = () => {
    isMinimize.value = false;
    nextTick(() => {
      drawerShow.value = false;
      emitAppletCloseEvent();
    });
  };

  return {
    isMinimize,
    minimize,
    close,
  };
};

// 微应用
const useMicroApp = ({
  router,
  route,
  drawerShow,
  isMicroApp,
  payload,
  isMinimize,
}) => {
  const isInHome = ref(true);
  const scrollTopCache = {};
  let scrollTop = 0;

  watch(drawerShow, (val, oldVal) => {
    if (!isMicroApp.value || isMinimize.value) {
      return;
    }
    // 抽屉关闭后修改路由
    if (oldVal && !val) {
      router.push("/index");
    }
    if (val && !oldVal) {
      nextTick(() => {
        // 监听容器滚动位置
        appletContainer.value.addEventListener("scroll", () => {
          scrollTop = appletContainer.value.scrollTop;
        });
      });
    }
  });

  const back = () => {
    router.go(-1);
  };

  router.beforeEach(() => {
    // 缓存滚动位置
    scrollTopCache[route.fullPath] = scrollTop;
  });

  // 在非首页的时候显示返回按钮
  router.afterEach(() => {
    if (!isMicroApp.value) {
      return;
    }
    let reg = new RegExp("^#" + route.fullPath + "?$");
    isInHome.value = reg.test(payload.value.activeRule);
    // 恢复滚动位置
    appletContainer.value.scrollTop = scrollTopCache[route.fullPath];
  });

  return {
    isInHome,
    back,
  };
};

// vue组件
const useComp = ({
  drawerShow,
  isMicroApp,
  payload,
  isMinimize,
  showLoading,
}) => {
  const comp = shallowRef(null);
  let styleEl = null;
  const load = async () => {
    try {
      showLoading.value = true;
      // 加载样式
      let styleUrl = isDev
        ? payload.value.devStyleUrl || payload.value.styleUrl
        : payload.value.styleUrl;
      if (styleUrl) {
        styleEl = loadStyle(styleUrl);
      }
      // 加载js
      let url = isDev
        ? payload.value.devUrl || payload.value.url
        : payload.value.url;
      let data = null;
      if (compCache[url]) {
        data = compCache[url];
      } else {
        let res = await axios.get(url);
        compCache[url] = data = res.data;
      }
      let run = new Function("exports", "require", `return ${data}`);
      const exports = {};
      const require = () => {
        return Vue;
      };
      run(exports, require);
      comp.value = exports.comp.default;
      showLoading.value = false;
    } catch (error) {
      console.error(error);
      showLoading.value = false;
    }
  };
  watch(drawerShow, (val, oldVal) => {
    if (isMicroApp.value || isMinimize.value) {
      return;
    }
    if (!val && oldVal) {
      comp.value = null;
      // 删除样式节点
      document.head.removeChild(styleEl);
    }
    if (val && !oldVal) {
      isMicroApp.value.true;
      load();
    }
  });

  return {
    comp,
  };
};

const router = useRouter();
const route = useRoute();
const { proxy } = getCurrentInstance();
const { drawerShow, payload } = usrDrawer("appletDrawer");
const isMicroApp = computed(() => {
  return payload.value ? payload.value.type === "microApp" : false;
});
const showLoading = ref(false);
const { emitAppletMinimizeEvent, emitAppletCloseEvent } = useAppletEmit({
  proxy,
});
const { isMinimize, minimize, close } = useShow({
  drawerShow,
  proxy,
  emitAppletMinimizeEvent,
  emitAppletCloseEvent,
  payload,
});
const appletContainer = ref(null);
const { isInHome, back } = useMicroApp({
  router,
  route,
  drawerShow,
  isMicroApp,
  payload,
  isMinimize,
});
const { comp } = useComp({
  drawerShow,
  isMicroApp,
  payload,
  isMinimize,
  showLoading,
});
</script>

<style lang="less" scoped>
.appletDrawer {
  /deep/ .n-drawer-body-content-wrapper {
    padding: 0;
    overflow: hidden !important;
  }

  /deep/ .n-drawer-header__main {
    width: 100%;
  }

  /deep/ .n-drawer-body {
    position: relative;
    height: 100%;
    overflow: hidden;
  }

  .headerBox {
    display: flex;
    justify-content: space-between;

    .header {
      display: flex;

      .backBtn {
        margin-right: 10px;
        cursor: pointer;
      }
    }

    .headerBtns {
      display: flex;
      background-color: rgba(0, 0, 0, 0.5);
      height: 24px;
      border-radius: 12px;

      .btn {
        display: block;
        height: 100%;
        color: #fff;
        width: 30px;
        text-align: center;
        line-height: 24px;
        cursor: pointer;

        &:first-of-type {
          border-right: 1px solid rgba(255, 255, 255, 0.3);
        }

        &:hover {
          background-color: rgba(255, 255, 255, 0.3);
        }
      }
    }
  }

  .appletContainer {
    height: 100%;
    overflow: auto;
  }

  .applteComponentContainer {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
}
</style>
