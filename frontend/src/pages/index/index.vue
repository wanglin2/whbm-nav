<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
    <n-message-provider>
      <n-dialog-provider>
        <Noop></Noop>
        <div class="warning">非常遗憾的通知各位，由于各种原因，理想青年实验室网站将于<span>2024年05月07日关闭</span>，届时网站所有服务都将无法访问，所以请各位尽快将数据迁出。后续网站的一些功能可能会在GitHub上开源，有兴趣的可以关注站长的 <a href="https://github.com/wanglin2">GitHub</a> 动态。</div>
        <div class="wrap relative" :style="{ minHeight: wrapMinHeight + 'px' }">
          <div class="backgroundEl absolute w-full h-full" ref="backgroundEl"></div>
          <!-- <div class="fireworksContainer fixed w-full h-full" ref="fireworksContainer" v-if="userConfig.showFireworks">
          </div> -->
          <Firework v-if="userConfig.showFireworks"></Firework>
          <div class="content m-auto w-screen-lg">
            <Header :showSearchInput="userConfig.showSearchInput"></Header>
            <IconNav style="margin-top: 10px" v-if="userConfig.showIconSiteArea"></IconNav>
            <Ad v-if="userConfig.showAd"></Ad>
            <My style="margin-top: 20px"></My>
            <NavList></NavList>
            <Footer v-if="userConfig.showFooter"></Footer>
          </div>
          <EditMySiteDrawer></EditMySiteDrawer>
          <AddMySiteDrawer></AddMySiteDrawer>
          <ManageClassShowDrawer></ManageClassShowDrawer>
          <SkinDrawer></SkinDrawer>
          <CommentDrawer></CommentDrawer>
          <RecommendDrawer></RecommendDrawer>
          <NoticeDrawer></NoticeDrawer>
          <SiteLibraryDrawer></SiteLibraryDrawer>
          <SettingDrawer></SettingDrawer>
          <AppletDrawer></AppletDrawer>
          <AppletListDrawer></AppletListDrawer>
          <FixedTool v-if="userConfig.showFixedTool"></FixedTool>
          <ImmersiveWeather v-if="userConfig.showImmersiveWeather"></ImmersiveWeather>
        </div>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup>
import Header from "@c/Header";
import { useStore } from "vuex";
import { computed, watch, ref, onMounted, onUnmounted, nextTick } from "vue";
import cssVariables from "@/config/cssVariables";
import IconNav from "@c/IconNav";
import NavList from "@c/NavList";
import My from "@c/My";
import {
  NConfigProvider,
  NMessageProvider,
  zhCN,
  dateZhCN,
  NDialogProvider,
} from "naive-ui";
import EditMySiteDrawer from "@c/drawers/EditMySiteDrawer";
import AddMySiteDrawer from "@c/drawers/AddMySiteDrawer";
import ManageClassShowDrawer from "@c/drawers/ManageClassShowDrawer";
import SkinDrawer from "@c/drawers/SkinDrawer";
import CommentDrawer from "@c/drawers/CommentDrawer";
import RecommendDrawer from "@c/drawers/RecommendDrawer";
import NoticeDrawer from "@c/drawers/NoticeDrawer";
import SiteLibraryDrawer from "@c/drawers/SiteLibraryDrawer";
import SettingDrawer from "@c/drawers/SettingDrawer";
import AppletDrawer from "@c/drawers/AppletDrawer";
import AppletListDrawer from "@c/drawers/AppletListDrawer";
import Footer from "@c/Footer";
import FixedTool from "@c/FixedTool";
import Noop from "@c/Noop";
import ImmersiveWeather from "@c/ImmersiveWeather";
import Ad from "@c/Ad";
import { handleSkinUrl } from "@/utils";
import api from "@/api";
import { useRoute, useRouter } from "vue-router";
import { initMicroApp } from "@/qiankun";
import { Fireworks } from 'fireworks-js';
import Firework from '@c/firework/Firework';

// 初始化
const useInit = () => {
  const store = useStore();
  const route = useRoute();
  const router = useRouter();

  return {
    store,
    route,
    router,
  };
};

// 处理url
const useRouteHandle = ({ route, router }) => {
  if (/\/index\/applet\//.test(route.fullPath)) {
    router.replace("/index");
  }
  initMicroApp();
};

// 主题
const useTheme = ({ store }) => {
  const userConfigTheme = computed(() => {
    return store.state.userConfig ? store.state.userConfig.theme : null;
  });
  const backgroundEl = ref(null);
  // 样式
  const setTheme = async (val, oldVal) => {
    if (!userConfigTheme.value) {
      return;
    }
    let type = userConfigTheme.value.type;
    // 默认
    if (type === "default") {
      backgroundEl.value.style.background = "none";
    } else if (type === "skin") {
      // 皮肤
      let url = userConfigTheme.value.skin.url;
      let color = userConfigTheme.value.skin.color;
      backgroundEl.value.style.background = `url(${handleSkinUrl(
        url
      )}) center top no-repeat ${color}`;
    } else if (type === "image") {
      // 图片
      let url = "";
      // 随机图片
      if (userConfigTheme.value.image.random) {
        if (!oldVal || !oldVal.image.random) {
          let { data } = await api.getRandomImage();
          if (data && data.code === 0) {
            url = data.data;
          }
          backgroundEl.value.style.background = `url(${url}) center center / cover no-repeat fixed`;
        }
      } else {
        // 指定图片
        url = userConfigTheme.value.image.url;
        backgroundEl.value.style.background = `url(${url}) center center / cover no-repeat fixed`;
      }
    } else if (type === "color") {
      // 纯色
      backgroundEl.value.style.background = userConfigTheme.value.color.color;
    } else if (type === "upload") {
      // 上传
      backgroundEl.value.style.background = `url(${userConfigTheme.value.upload.url}) center center / cover no-repeat fixed`;
    }

    // 模糊度
    backgroundEl.value.style.filter = `blur(${(userConfigTheme.value.blur / 100) * 20
      }px)`;
  };
  watch(userConfigTheme, setTheme);
  onMounted(() => {
    setTheme();
  });

  return {
    backgroundEl,
  };
};

// 主题色
// const useThemeColor = ({ store }) => {
//   const themeOverrides = computed(() => {
//     return {
//       common: {
//         primaryColor:
//           cssVariables[store.state.userConfig.mode]["--theme-color"],
//       },
//     };
//   });

//   return {
//     themeOverrides,
//   };
// };

// 模式切换
const useMode = ({ store }) => {
  const mode = computed(() => {
    return store.state.userConfig.mode;
  });
  const colors = computed(() => {
    return store.state.userConfig.theme.colors;
  });
  watch(
    [
      () => {
        return mode.value;
      },
      () => {
        return colors.value;
      },
    ],
    () => {
      cssVariables.setCssVariables(mode.value, colors.value);
    },
    {
      deep: true,
    }
  );
  cssVariables.setCssVariables(mode.value, colors.value);
};

// 最低高度
const ueeMinHeight = () => {
  const wrapMinHeight = ref(null);
  const set = () => {
    wrapMinHeight.value = window.innerHeight;
  };

  onMounted(() => {
    set();
    window.addEventListener("resize", set);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", set);
  });

  return {
    wrapMinHeight,
  };
};

// 用户设置
const useSetting = () => {
  const userConfig = computed(() => {
    return store.state.userConfig ? store.state.userConfig : {};
  });

  return {
    userConfig,
  };
};

// 烟花

const useFireworks = () => {
  const fireworksContainer = ref(null);
  let fireworks = null;
  const initFireworks = () => {
    fireworks = new Fireworks(fireworksContainer.value, {
      autoresize: true,
      opacity: 0.5,
      acceleration: 1.05,// 加快
      friction: 0.97,// 摩擦
      gravity: 1.5,// 重力
      particles: 50,// particles
      trace: 3,
      traceSpeed: 10,
      explosion: 5,// 爆炸
      intensity: 30,// 强烈
      flickering: 50,// 闪烁
      lineStyle: 'round',
      hue: {// 颜色
        min: 0,
        max: 360
      },
      delay: {
        min: 90,
        max: 100
      },
      rocketsPoint: {// 火箭点
        min: 50,
        max: 50
      },
      lineWidth: {
        explosion: {
          min: 1,
          max: 3
        },
        trace: {
          min: 1,
          max: 2
        }
      },
      brightness: {// 亮度
        min: 50,
        max: 80
      },
      decay: {// decay
        min: 0.01,
        max: 0.02
      },
      mouse: {
        click: true,
        move: false,
        max: 1
      }
    })
  }
  watch(() => {
    return userConfig.value.showFireworks;
  }, () => {
    if (userConfig.value.showFireworks) {
      // 开启
      if (!fireworks) {
        nextTick(() => {
          initFireworks();
          fireworks.start();
        });
      }
    } else {
      // 关闭
      if (fireworks) {
        fireworks.clear();
        fireworks = null;
      }
    }
  }, {
    deep: true
  })
  onMounted(() => {
    if (userConfig.value.showFireworks) {
      nextTick(() => {
        initFireworks();
        fireworks.start();
      });
    }
  });

  return {
    fireworksContainer
  };
}

const { store, route, router } = useInit();
useRouteHandle({ route, router });
const { backgroundEl } = useTheme({ store });
// const { themeOverrides } = useThemeColor({ store });
useMode({ store });
const { wrapMinHeight } = ueeMinHeight();
const { userConfig } = useSetting({ store });
// const { fireworksContainer } = useFireworks();
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

a,
button,
label {
  cursor: pointer;
}

.n-drawer-container {
  z-index: 500 !important;
}
</style>
<style lang="less" scoped>
.warning {
  padding: 40px;
  font-size: 24px;

  span {
    color: lightcoral;
  }

  a {
    color: lightblue;
  }
}

.wrap {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  .backgroundEl {
    transition: background-image 0.3s, background-color 0.2s;
    z-index: -1;
  }

  .content {
    padding-bottom: 10px;
  }
}
</style>
