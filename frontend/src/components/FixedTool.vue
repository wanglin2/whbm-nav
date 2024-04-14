<template>
  <div class="fixedToolContainer fixed" :style="{ right: right + 'px' }">
    <!-- 天气 -->
    <div class="btn flex justify-center items-center relative" v-if="weatherIcon">
      <span class="icon inline-block w-full h-full" :style="{ backgroundImage: `url(${weatherIcon})` }"
        @mouseenter="onWeatherMouseenter" @mouseleave="onWeatherMouseleave"></span>
      <div class="weatherDetail absolute bottom-0" v-if="showWeatherDetail">
        <div class="cityBox flex items-end">
          <span class="icon iconfont icon-chengshi"></span>
          <span class="text">{{ weatherInfo.basic.location }}</span>
        </div>
        <div class="weatherBox flex items-center">
          <div class="weatherIcon h-full flex items-center">
            <span class="icon inline-block" :style="{ backgroundImage: `url(${weatherIcon})` }"></span>
          </div>
          <div class="weatherInfoBox h-full flex flex-col justify-center">
            <div class="text">{{ weatherInfo.now.cond_txt }}</div>
            <div class="text">{{ weatherInfo.now.tmp }}℃</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 快速导航 -->
    <div class="btn flex justify-center items-center relative" v-if="!userConfig.showQuickLocation"
      @mouseenter="onNavMouseenter" @mouseleave="onNavMouseleave">
      <span class="icon iconfont icon-daohang1"></span>
      <div class="absolute bottom-0 right-[30px]" v-if="showNavList">
        <QuickLocation v-if="showNavList"></QuickLocation>
      </div>
    </div>
    <!-- 返回顶部 -->
    <div class="btn flex justify-center items-center" @click="scrollTo">
      <span class="icon iconfont icon-fanhuidingbu"></span>
    </div>
    <!-- 快速导航 -->
    <QuickLocation style="margin-left: -16px; margin-top: 20px"
      v-if="userConfig.showQuickLocation && showQuickLocation"></QuickLocation>
  </div>
</template>

<script setup>
import { onUnmounted, ref, unref, getCurrentInstance, watch, computed } from "vue";
import { scrollTo } from "@/utils";
import { useWeather } from "@/hooks/weather";
import { useMouseoverDropMenu } from "@/hooks/dropdown";
import QuickLocation from '@/components/QuickLocation.vue';
import { useStore } from "vuex";
import { nextTick } from "process";

// 初始化
const useInit = () => {
  const store = useStore();
  const { proxy } = getCurrentInstance();
  const userConfig = computed(() => {
    return store.state.userConfig ? store.state.userConfig : {};
  });

  return {
    store,
    proxy,
    userConfig
  };
};

// 快速导航
const useQuickLocation = () => {
  const showQuickLocation = ref(true)
  const reRenderQuickLocation = () => {
    showQuickLocation.value = false
    nextTick(() => {
      showQuickLocation.value = true
    })
  }

  watch(() => {
    return store.state.userConfig.classNavList;
  }, reRenderQuickLocation, {
    deep: true,
    immediate: true
  });
  proxy.$eventEmitter.on("navListUpdated", reRenderQuickLocation);

  return {
    showQuickLocation
  }
}

// 定位
const usePos = () => {
  const right = ref(0);
  const contentWidth = 1024;
  const toolWidth = 70;
  const setPos = () => {
    let _right = (window.innerWidth - contentWidth) / 2 - toolWidth;
    if (_right > 0) {
      right.value = _right;
    } else {
      right.value = 10;
    }
  };
  setPos();
  window.addEventListener("resize", setPos);
  onUnmounted(() => {
    window.removeEventListener("resize", setPos);
  });

  return {
    right,
  };
};

// 导航
const useNav = () => {
  const showNavList = ref(false);
  const onNavMouseenter = () => {
    showNavList.value = true;
  };
  const onNavMouseleave = () => {
    showNavList.value = false;
  };

  return {
    onNavMouseenter,
    onNavMouseleave,
    showNavList,
  };
};

let weatherIcon = ref(null), weatherInfo = ref(null)
const useWeatherHook = async () => {
  const res = await useWeather();
  weatherIcon.value = unref(res.weatherIcon)
  weatherInfo.value = unref(res.weatherInfo)
}

const { store, proxy, userConfig } = useInit();
const { showQuickLocation } = useQuickLocation();
const { right } = usePos();
const { onNavMouseenter, onNavMouseleave, showNavList } =
  useNav();
useWeatherHook()
const {
  showMouseoverDropMenu: showWeatherDetail,
  onMouseenter: onWeatherMouseenter,
  onMouseleave: onWeatherMouseleave,
} = useMouseoverDropMenu();
</script>

<style lang="less" scoped>
.fixedToolContainer {
  bottom: 50px;
  width: 30px;

  .btn {
    height: 30px;
    margin-bottom: 2px;
    background-color: var(--light-color);
    border-radius: 2px;
    cursor: pointer;

    &:hover {
      background-color: var(--other-site-block-hover-color);
    }

    .icon {
      background-size: cover;
    }

    .navList {
      width: 62px;
      background-color: var(--other-light-color);
      right: 30px;
      border: 1px solid var(--other-dark-color);
      border-radius: 5px;
      overflow: hidden;

      .navItem {
        width: 30px;

        &:hover {
          background-color: var(--other-site-block-hover-color);
        }
      }
    }

    .weatherDetail {
      width: 150px;
      padding: 10px;
      right: 30px;
      background-color: var(--other-light-color);
      border: 1px solid var(--other-dark-color);
      border-radius: 5px;

      .cityBox {
        color: var(--other-dark-color);

        .icon {
          font-size: 16px;
          margin-right: 5px;
          margin-bottom: 2px;
        }

        .text {
          font-size: 20px;
        }
      }

      .weatherBox {
        height: 60px;

        .weatherIcon {
          width: 50%;

          .icon {
            width: 60px;
            height: 60px;
          }
        }

        .weatherInfoBox {
          width: 50%;
          color: var(--other-dark-color);
        }
      }
    }
  }
}
</style>
