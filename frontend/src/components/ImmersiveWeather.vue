<template>
  <div>
    <div class="frostBox" :class="{ show: showFrostWeather || showFrost }">
      <div class="frostItem frostLeft"></div>
      <div class="frostItem frostTop"></div>
      <div class="frostItem frostRight"></div>
      <div class="frostItem frostBottom"></div>
    </div>
  </div>
</template>

<script setup>
import { useImmersiveWeather } from "@/hooks/weather";
import { loadJsResource } from "@/utils";
import { onUnmounted, computed, ref } from "vue";
import { useStore } from "vuex";
const isDev = process.env.NODE_ENV === "development";

// 初始化
const useInit = () => {
  const store = useStore();
  return {
    store,
  };
};

// 霜冻
const useFrost = () => {
  const showFrost = computed(() => {
    return store.state.userConfig ? store.state.userConfig.showFrost : {};
  });

  return {
    showFrost,
  };
};

// 沉浸式天气
let stopWeather = null;
const showFrostWeather = ref(false);
const useWeather = async () => {
  await loadJsResource(
    isDev ? "http://lxqnsys.com/js/snow.min.js" : "../js/snow.min.js"
  );
  const { stop, showFrost } = await useImmersiveWeather();
  stopWeather = stop;
  showFrostWeather.value = showFrost.value;
};

const { store } = useInit();
const { showFrost } = useFrost();
useWeather();
onUnmounted(() => {
  stopWeather();
});
</script>

<style lang="less" scoped>
.frostBox {
  &.show {
    .frostItem {
      opacity: 1;
    }
  }

  .frostItem {
    position: fixed;
    height: 100px;
    background-repeat: repeat-x;
    background-size: contain;
    background-position: center bottom;
    opacity: 0;
    background-image: url("http://assets.lxqnsys.com/frostTop.png");
    pointer-events: none;
    transition: all 0.35s;

    &.frostLeft {
      top: -133px;
      left: 0;
      transform: rotate(90deg);
      transform-origin: 0 100px;
      pointer-events: none;
      width: 500%;
    }

    &.frostTop {
      top: 0;
      width: 500%;
      transform: rotate(180deg);
      pointer-events: none;
    }

    &.frostRight {
      top: 100%;
      left: calc(100% - 100px);
      transform: rotate(-90deg);
      transform-origin: 0 0;
      width: 500%;
      pointer-events: none;
    }

    &.frostBottom {
      bottom: 0;
      left: 0;
      width: 500%;
      pointer-events: none;
    }
  }
}
</style>
